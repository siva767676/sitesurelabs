import re
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, StringConstraints, field_validator

# Mirrors frontend/src/lib/validation.ts (the server is the source of truth).
FREE_EMAIL_DOMAINS = {
    "gmail.com", "googlemail.com", "yahoo.com", "yahoo.in", "yahoo.co.in", "outlook.com", "hotmail.com", "live.com", "msn.com",
    "aol.com", "icloud.com", "me.com", "proton.me", "protonmail.com", "gmx.com", "mail.com", "rediffmail.com", "zoho.com", "yandex.com",
}

Name = Annotated[str, StringConstraints(min_length=2, max_length=120)]
Company = Annotated[str, StringConstraints(min_length=2, max_length=160)]
Message = Annotated[str, StringConstraints(min_length=20, max_length=4000)]

_CONTROL = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")


class EnquiryIn(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    kind: Literal["demo", "project", "general"]
    name: Name
    email: EmailStr
    company: Company
    interest: Literal["anviksha", "sitevision", "digi-reco", "parichay", "progress-tracker", "robotic-dog", "custom-ai", "other"]
    message: Message
    budget: Literal["", "exploring", "small", "medium", "large"] = ""
    timeline: Literal["", "asap", "1-3m", "3-6m", "later"] = ""
    consent: Literal[True]
    # anti-abuse signals
    website: str = Field(default="", max_length=200)  # honeypot: must stay empty
    form_elapsed_ms: int = Field(ge=0, le=7 * 24 * 3600 * 1000)
    turnstile_token: str | None = Field(default=None, max_length=4096)

    @field_validator("name", "company", "message")
    @classmethod
    def _clean(cls, v: str) -> str:
        return _CONTROL.sub("", v)

    @field_validator("message")
    @classmethod
    def _links(cls, v: str) -> str:
        if len(re.findall(r"https?://|www\.", v, flags=re.I)) > 3:
            raise ValueError("Please remove some of the links from your message.")
        return v

    @field_validator("email")
    @classmethod
    def _lower(cls, v: str) -> str:
        return v.lower()


class EnquiryOut(BaseModel):
    id: str
    status: Literal["received"] = "received"
    message: str


class EnquiryAdminOut(BaseModel):
    id: str
    created_at: str
    kind: str
    name: str
    email: str
    company: str
    interest: str
    message: str
    budget: str
    timeline: str
    notified: bool
