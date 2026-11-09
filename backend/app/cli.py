"""Operations commands, run inside the API container:

    docker exec sitesurelabs-api-1 python -m app.cli status
    docker exec sitesurelabs-api-1 python -m app.cli send-test [--to a@b.com]
    docker exec sitesurelabs-api-1 python -m app.cli resend-pending [--limit 50] [--dry-run]

Nothing here prints a secret (no SMTP password, no token).
"""
import argparse
import sys

from sqlalchemy import func, select

from .config import Settings, get_settings
from .db import Enquiry, make_session_factory
from .notify import (
    DEFAULT_FROM, build_test_message, config_problems, deliver, describe, notifications_configured, recipients, send_with_retry,
)


def _status(s: Settings) -> int:
    print(f"environment : {s.app_env}")
    print(f"smtp server : {s.smtp_host or '(not set)'}:{s.smtp_port}  starttls={s.smtp_starttls}")
    print(f"credentials : {'set' if s.smtp_username and s.smtp_password else 'not set'}")
    print(f"from        : {s.notify_from or DEFAULT_FROM}")
    print(f"to          : {', '.join(recipients(s)) or '(not set)'}")
    print(f"webhook     : {'set' if s.webhook_url else 'not set'}")
    print(f"configured  : {'yes' if notifications_configured(s) else 'NO'}")
    for p in config_problems(s):
        print(f"problem     : {p}")
    factory = make_session_factory(s.database_url)
    with factory() as db:
        total = db.scalar(select(func.count()).select_from(Enquiry)) or 0
        pending = db.scalar(select(func.count()).select_from(Enquiry).where(Enquiry.notified.is_(False))) or 0
        failed = db.scalar(select(func.count()).select_from(Enquiry).where(Enquiry.notify_error.is_not(None))) or 0
    print(f"enquiries   : {total} stored, {pending} not yet notified, {failed} with a recorded error")
    return 0


def _send_test(s: Settings, to: list[str] | None) -> int:
    if not s.smtp_host:
        print("SMTP_HOST is not set: nothing to test.")
        return 2
    targets = to or recipients(s)
    if not targets:
        print("No recipient: set NOTIFY_TO or pass --to.")
        return 2
    try:
        send_with_retry(build_test_message(s, targets), s)
    except Exception as exc:  # noqa: BLE001
        print(f"FAILED: {describe(exc)}")
        return 1
    print(f"OK: test e-mail handed to {s.smtp_host} for {', '.join(targets)}")
    return 0


def _resend_pending(s: Settings, limit: int, dry_run: bool) -> int:
    if not notifications_configured(s):
        print("Notifications are not configured; nothing can be sent.")
        return 2
    factory = make_session_factory(s.database_url)
    sent = failed = 0
    with factory() as db:
        rows = db.scalars(select(Enquiry).where(Enquiry.notified.is_(False)).order_by(Enquiry.created_at.asc()).limit(limit)).all()
        for e in rows:
            if dry_run:
                print(f"would send {e.id}  ({e.kind}, {e.created_at.date()})")
                continue
            errors = deliver(e, s)
            e.notified = not errors
            e.notify_error = "; ".join(errors) or None
            db.commit()
            if errors:
                failed += 1
                print(f"{e.id}: FAILED ({'; '.join(errors)})")
            else:
                sent += 1
                print(f"{e.id}: sent")
        if dry_run:
            print(f"{len(rows)} enquiry(ies) would be sent.")
        else:
            print(f"done: {sent} sent, {failed} failed, {len(rows)} considered.")
    return 1 if failed else 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="python -m app.cli", description="SiteSureLabs API operations")
    sub = parser.add_subparsers(dest="cmd", required=True)
    sub.add_parser("status", help="show the notification settings (no secrets) and enquiry counts")
    t = sub.add_parser("send-test", help="send a test e-mail through the configured SMTP server")
    t.add_argument("--to", action="append", help="recipient (default: NOTIFY_TO); may be repeated")
    r = sub.add_parser("resend-pending", help="send notifications for stored enquiries that were not delivered")
    r.add_argument("--limit", type=int, default=50)
    r.add_argument("--dry-run", action="store_true")
    args = parser.parse_args(argv)
    s = get_settings()
    if args.cmd == "status":
        return _status(s)
    if args.cmd == "send-test":
        return _send_test(s, args.to)
    return _resend_pending(s, args.limit, args.dry_run)


if __name__ == "__main__":
    sys.exit(main())
