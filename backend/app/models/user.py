import uuid
from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.account import Account
    from app.models.category import Category
    from app.models.financial_goal import FinancialGoal
    from app.models.transaction import Transaction


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str | None] = mapped_column(String(150), nullable=True)
    default_currency: Mapped[str] = mapped_column(
        String(3), default="COP", nullable=False
    )
    webhook_token: Mapped[str] = mapped_column(
        String(64),
        unique=True,
        index=True,
        default=lambda: uuid.uuid4().hex,
        nullable=False,
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

    # Relationships
    accounts: Mapped[list["Account"]] = relationship(
        "Account", back_populates="user", cascade="all, delete-orphan"
    )
    categories: Mapped[list["Category"]] = relationship(
        "Category", back_populates="user", cascade="all, delete-orphan"
    )
    transactions: Mapped[list["Transaction"]] = relationship(
        "Transaction", back_populates="user", cascade="all, delete-orphan"
    )
    goals: Mapped[list["FinancialGoal"]] = relationship(
        "FinancialGoal", back_populates="user", cascade="all, delete-orphan"
    )

    def __init__(self, **kwargs):
        kwargs.setdefault("default_currency", "COP")
        kwargs.setdefault("is_active", True)
        if "webhook_token" not in kwargs or not kwargs["webhook_token"]:
            kwargs["webhook_token"] = uuid.uuid4().hex
        super().__init__(**kwargs)
