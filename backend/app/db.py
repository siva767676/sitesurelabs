from collections.abc import Iterator
from datetime import datetime, timezone
from pathlib import Path

from sqlalchemy import Boolean, DateTime, Index, String, Text, TypeDecorator, create_engine, event
from sqlalchemy.engine import Dialect, make_url
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker
from sqlalchemy.pool import StaticPool


class UTCDateTime(TypeDecorator[datetime]):
    """A UTC timestamp. SQLite has no time zone type, so values are stored as naive UTC and read back as aware UTC:
    comparisons line up, and API output and webhooks always carry the +00:00 offset."""

    impl = DateTime
    cache_ok = True

    def process_bind_param(self, value: datetime | None, dialect: Dialect) -> datetime | None:
        if value is not None and value.tzinfo is not None:
            value = value.astimezone(timezone.utc).replace(tzinfo=None)
        return value

    def process_result_value(self, value: datetime | None, dialect: Dialect) -> datetime | None:
        return value.replace(tzinfo=timezone.utc) if value is not None else None


class Base(DeclarativeBase):
    pass


class Enquiry(Base):
    __tablename__ = "enquiries"

    id: Mapped[str] = mapped_column(String(24), primary_key=True)  # public reference, e.g. SSL-7F3A9C21
    created_at: Mapped[datetime] = mapped_column(UTCDateTime(), default=lambda: datetime.now(timezone.utc), index=True)
    kind: Mapped[str] = mapped_column(String(16))
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(254), index=True)
    company: Mapped[str] = mapped_column(String(160))
    interest: Mapped[str] = mapped_column(String(32))
    message: Mapped[str] = mapped_column(Text)
    budget: Mapped[str] = mapped_column(String(16), default="")
    timeline: Mapped[str] = mapped_column(String(16), default="")
    content_hash: Mapped[str] = mapped_column(String(64))  # email + message, for duplicate detection
    ip_hash: Mapped[str] = mapped_column(String(64))  # salted hash only; the raw IP is never stored
    user_agent: Mapped[str] = mapped_column(String(300), default="")
    notified: Mapped[bool] = mapped_column(Boolean, default=False)
    notify_error: Mapped[str | None] = mapped_column(Text, nullable=True)

    __table_args__ = (Index("ix_enquiries_dupe", "content_hash", "created_at"),)


def make_session_factory(database_url: str) -> sessionmaker[Session]:
    """SQLite engine. The database file, its folder and the table are created on first use."""
    url = make_url(database_url)
    in_memory = url.database in (None, "", ":memory:")
    if not in_memory:
        Path(url.database).parent.mkdir(parents=True, exist_ok=True)
    engine = create_engine(
        url,
        # Sessions are used from FastAPI's thread pool and from background tasks. A writer that finds the
        # database locked waits up to 15 s instead of failing at once.
        connect_args={"check_same_thread": False, "timeout": 15},
        # An in-memory database belongs to one connection, so every session has to share it.
        **({"poolclass": StaticPool} if in_memory else {}),
    )

    @event.listens_for(engine, "connect")
    def _wal(dbapi_connection, _record) -> None:
        # WAL: reads never wait for a write, so a notification result can be saved while a request reads.
        # The setting is stored in the database file; an in-memory database keeps its own journal.
        dbapi_connection.execute("PRAGMA journal_mode=WAL")

    Base.metadata.create_all(engine)
    return sessionmaker(engine, expire_on_commit=False)


def session_dependency(factory: sessionmaker[Session]):
    def _get() -> Iterator[Session]:
        with factory() as session:
            yield session

    return _get
