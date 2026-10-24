from collections.abc import Iterator
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Index, String, Text, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker


class Base(DeclarativeBase):
    pass


class Enquiry(Base):
    __tablename__ = "enquiries"

    id: Mapped[str] = mapped_column(String(24), primary_key=True)  # public reference, e.g. SSL-7F3A9C21
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)
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
    connect_args = {"check_same_thread": False} if database_url.startswith("sqlite") else {}
    engine = create_engine(database_url, pool_pre_ping=True, connect_args=connect_args)
    Base.metadata.create_all(engine)
    return sessionmaker(engine, expire_on_commit=False)


def session_dependency(factory: sessionmaker[Session]):
    def _get() -> Iterator[Session]:
        with factory() as session:
            yield session

    return _get
