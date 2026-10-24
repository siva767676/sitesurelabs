import hashlib
import logging
import threading
import time
from collections import defaultdict, deque

import httpx
from fastapi import Request

from .config import Settings
from .errors import ApiError
from .schemas import FREE_EMAIL_DOMAINS, EnquiryIn

log = logging.getLogger("app.security")


class SlidingWindowLimiter:
    """Per-process sliding window. Fine for a single worker; behind several workers or instances
    also rate-limit at the proxy/CDN (documented in the README)."""

    def __init__(self) -> None:
        self._hits: dict[str, deque[float]] = defaultdict(deque)
        self._lock = threading.Lock()

    def hit(self, key: str, limit: int, window: int) -> int | None:
        """Record a hit. Returns None if allowed, else seconds until the window frees up."""
        now = time.monotonic()
        with self._lock:
            q = self._hits[key]
            while q and now - q[0] > window:
                q.popleft()
            if len(q) >= limit:
                return max(1, int(window - (now - q[0])) + 1)
            q.append(now)
            if len(self._hits) > 10_000:  # bound memory
                for k in [k for k, v in self._hits.items() if not v or now - v[-1] > window]:
                    self._hits.pop(k, None)
            return None

    def reset(self) -> None:
        with self._lock:
            self._hits.clear()


def client_ip(request: Request, settings: Settings) -> str:
    if settings.trust_proxy_headers:
        fwd = request.headers.get("x-forwarded-for")
        if fwd:
            return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def hash_ip(ip: str, settings: Settings) -> str:
    return hashlib.sha256(f"{settings.ip_hash_salt}:{ip}".encode()).hexdigest()


def content_hash(email: str, message: str) -> str:
    return hashlib.sha256(f"{email}\n{' '.join(message.split()).lower()}".encode()).hexdigest()


def check_rate_limit(limiter: SlidingWindowLimiter, ip_hash: str, settings: Settings) -> None:
    wait = limiter.hit(ip_hash, settings.rate_limit_max, settings.rate_limit_window_seconds)
    if wait is not None:
        raise ApiError(429, "rate_limited", "You have sent several messages recently. Please try again a little later.", headers={"Retry-After": str(wait)})


def check_spam_signals(data: EnquiryIn, settings: Settings) -> None:
    if data.website:  # honeypot tripped
        log.warning("spam: honeypot", extra={"ctx": {"reason": "honeypot"}})
        raise ApiError(400, "spam_detected", "We could not accept this submission. Please try again.")
    if data.form_elapsed_ms < settings.min_fill_seconds * 1000:
        log.warning("spam: too fast", extra={"ctx": {"reason": "too_fast", "elapsed_ms": data.form_elapsed_ms}})
        raise ApiError(400, "spam_detected", "That was very quick. Please review your message and submit again.")
    if settings.require_business_email and data.email.split("@")[-1] in FREE_EMAIL_DOMAINS:
        raise ApiError(422, "validation_error", "Please use your business email address.", fields={"email": "Please use your business email address"})


def verify_turnstile(token: str | None, ip: str, settings: Settings) -> None:
    """Enforced only when TURNSTILE_SECRET_KEY is configured."""
    if not settings.turnstile_secret_key:
        return
    if not token:
        raise ApiError(400, "verification_failed", "Please complete the verification check and try again.")
    try:
        r = httpx.post(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            data={"secret": settings.turnstile_secret_key, "response": token, "remoteip": ip},
            timeout=5.0,
        )
        ok = r.status_code == 200 and r.json().get("success") is True
    except (httpx.HTTPError, ValueError):
        log.exception("turnstile verification unavailable")
        raise ApiError(503, "verification_unavailable", "Verification is temporarily unavailable. Please try again shortly.")
    if not ok:
        raise ApiError(400, "verification_failed", "Verification failed. Please try again.")
