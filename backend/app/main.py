import logging
import time
import uuid

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from .config import Settings, get_settings
from .db import make_session_factory
from .errors import register_error_handlers
from .logging_config import configure_logging
from .routes import enquiries
from .security import SlidingWindowLimiter

log = logging.getLogger("app")


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or get_settings()
    configure_logging(settings.log_level)

    if settings.is_production and settings.ip_hash_salt == "change-me":
        raise RuntimeError("IP_HASH_SALT must be set to a random value in production.")

    app = FastAPI(
        title="SiteSureLabs API",
        version="0.1.0",
        docs_url=None if settings.is_production else "/api/docs",
        redoc_url=None,
        openapi_url=None if settings.is_production else "/api/openapi.json",
    )
    app.state.settings = settings
    app.state.session_factory = make_session_factory(settings.database_url)
    app.state.limiter = SlidingWindowLimiter()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
        max_age=600,
    )

    @app.middleware("http")
    async def request_context(request: Request, call_next):
        rid = request.headers.get("x-request-id") or uuid.uuid4().hex[:12]
        started = time.perf_counter()
        response = await call_next(request)
        response.headers["X-Request-ID"] = rid
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Cache-Control"] = "no-store"
        log.info(
            "request",
            extra={"ctx": {"rid": rid, "method": request.method, "path": request.url.path, "status": response.status_code, "ms": round((time.perf_counter() - started) * 1000, 1)}},
        )
        return response

    register_error_handlers(app)
    app.include_router(enquiries.router)

    @app.get("/api/health", tags=["meta"])
    def health():
        try:
            with app.state.session_factory() as db:
                db.execute(text("SELECT 1"))
            db_ok = True
        except Exception:  # noqa: BLE001
            log.exception("health check: database unavailable")
            db_ok = False
        return {"status": "ok" if db_ok else "degraded", "database": db_ok, "env": settings.app_env}

    return app


app = create_app()
