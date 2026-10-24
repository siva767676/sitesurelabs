import hmac
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, BackgroundTasks, Depends, Header, Query, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..db import Enquiry
from ..errors import ApiError
from ..notify import dispatch
from ..schemas import EnquiryAdminOut, EnquiryIn, EnquiryOut
from ..security import check_rate_limit, check_spam_signals, client_ip, content_hash, hash_ip, verify_turnstile

router = APIRouter(prefix="/api", tags=["enquiries"])


def get_db(request: Request):
    with request.app.state.session_factory() as session:
        yield session


@router.post("/enquiries", response_model=EnquiryOut, status_code=201)
def create_enquiry(data: EnquiryIn, request: Request, background: BackgroundTasks, db: Session = Depends(get_db)) -> EnquiryOut:
    """Contact, demo and project enquiries. Validated server-side, abuse-checked, stored, then notified."""
    state = request.app.state
    settings = state.settings
    ip = client_ip(request, settings)
    ip_hash = hash_ip(ip, settings)

    check_rate_limit(state.limiter, ip_hash, settings)
    check_spam_signals(data, settings)
    verify_turnstile(data.turnstile_token, ip, settings)

    ch = content_hash(data.email, data.message)
    since = datetime.now(timezone.utc) - timedelta(hours=24)
    existing = db.scalar(select(Enquiry).where(Enquiry.content_hash == ch, Enquiry.created_at > since))
    if existing:  # double-click or resubmit: idempotent, no second notification
        return EnquiryOut(id=existing.id, message=_received(data.email))

    enquiry = Enquiry(
        id=f"SSL-{secrets.token_hex(4).upper()}",
        kind=data.kind, name=data.name, email=data.email, company=data.company, interest=data.interest,
        message=data.message, budget=data.budget, timeline=data.timeline,
        content_hash=ch, ip_hash=ip_hash, user_agent=(request.headers.get("user-agent") or "")[:300],
    )
    db.add(enquiry)
    db.commit()

    background.add_task(dispatch, enquiry.id, settings, state.session_factory)
    return EnquiryOut(id=enquiry.id, message=_received(data.email))


def _received(email: str) -> str:
    return f"Your enquiry has been received. We will reply to {email}, usually within two working days."


@router.get("/admin/enquiries", response_model=list[EnquiryAdminOut], tags=["admin"])
def list_enquiries(
    request: Request,
    authorization: str | None = Header(default=None),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """Read stored enquiries. Disabled unless ADMIN_TOKEN is configured."""
    token = request.app.state.settings.admin_token
    if not token:
        raise ApiError(404, "not_found", "Not found.")
    supplied = (authorization or "").removeprefix("Bearer ").strip()
    if not hmac.compare_digest(supplied.encode(), token.encode()):
        raise ApiError(401, "unauthorized", "Invalid or missing token.", headers={"WWW-Authenticate": "Bearer"})
    rows = db.scalars(select(Enquiry).order_by(Enquiry.created_at.desc()).limit(limit).offset(offset)).all()
    return [
        EnquiryAdminOut(
            id=r.id, created_at=r.created_at.isoformat(), kind=r.kind, name=r.name, email=r.email, company=r.company,
            interest=r.interest, message=r.message, budget=r.budget, timeline=r.timeline, notified=r.notified,
        )
        for r in rows
    ]
