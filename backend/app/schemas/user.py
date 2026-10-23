import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserBase(BaseModel):
    email: EmailStr
    full_name: str | None = None
    default_currency: str = "COP"


class UserCreate(UserBase):
    password: str = Field(min_length=8, description="Contraseña de mínimo 8 caracteres")


class UserUpdate(BaseModel):
    full_name: str | None = None
    default_currency: str | None = None
    password: str | None = Field(default=None, min_length=8)


class UserResponse(UserBase):
    id: uuid.UUID
    webhook_token: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
