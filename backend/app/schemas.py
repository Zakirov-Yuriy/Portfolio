import re

from pydantic import BaseModel, EmailStr, Field, field_validator

PHONE_DIGITS = re.compile(r"\d")


class ContactRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    phone: str = Field(..., min_length=5, max_length=40)
    email: EmailStr
    comment: str = Field(..., min_length=5, max_length=4000)

    @field_validator("phone")
    @classmethod
    def phone_has_enough_digits(cls, value: str) -> str:
        if len(PHONE_DIGITS.findall(value)) < 10:
            raise ValueError("Телефон должен содержать минимум 10 цифр")
        return value


class ContactResponse(BaseModel):
    status: str = "ok"
    message: str


class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str = Field(..., max_length=4000)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    history: list[ChatMessage] = Field(default_factory=list, max_length=20)


class ChatResponse(BaseModel):
    reply: str
