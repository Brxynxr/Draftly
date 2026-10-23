import uuid
from datetime import UTC, datetime
from decimal import Decimal
from enum import Enum
from typing import TYPE_CHECKING, Optional

from sqlalchemy import JSON, DateTime, ForeignKey, Numeric, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.account import Account
    from app.models.category import Category
    from app.models.user import User


class TransactionType(str, Enum):
    EXPENSE = "EXPENSE"  # Salida de dinero de la cuenta
    INCOME = "INCOME"  # Entrada de dinero a la cuenta
    INTERNAL_TRANSFER = "INTERNAL_TRANSFER"  # Movimiento entre bolsillos propios (ej. Nequi -> Efectivo)


class TransactionStatus(str, Enum):
    CONFIRMED = "CONFIRMED"  # Verificado y categorizado por el usuario
    PENDING_REVIEW = "PENDING_REVIEW"  # En bandeja de entrada esperando clasificación (< 30 min)
    AUTO_RESOLVED = "AUTO_RESOLVED"  # Auto-clasificado en Gastos Generales tras timeout de 30 min


class TransactionSource(str, Enum):
    MANUAL = "MANUAL"
    AI_CHAT = "AI_CHAT"
    MACRODROID_PUSH = "MACRODROID_PUSH"
    BANK_STATEMENT = "BANK_STATEMENT"


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    account_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("accounts.id", ondelete="CASCADE"), index=True, nullable=False
    )
    destination_account_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("accounts.id", ondelete="SET NULL"), nullable=True
    )
    category_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid,
        ForeignKey("categories.id", ondelete="SET NULL"),
        index=True,
        nullable=True,
    )

    amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)
    type: Mapped[TransactionType] = mapped_column(String(20), default=TransactionType.EXPENSE, nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    merchant: Mapped[str | None] = mapped_column(String(150), nullable=True)
    status: Mapped[TransactionStatus] = mapped_column(String(20), default=TransactionStatus.CONFIRMED, nullable=False)
    source: Mapped[TransactionSource] = mapped_column(String(30), default=TransactionSource.MANUAL, nullable=False)
    idempotency_hash: Mapped[str | None] = mapped_column(String(64), unique=True, index=True, nullable=True)
    tags: Mapped[list[str] | None] = mapped_column(JSON, default=list, nullable=True)

    transaction_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False
    )
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
    user: Mapped["User"] = relationship("User", back_populates="transactions")
    account: Mapped["Account"] = relationship("Account", foreign_keys=[account_id], back_populates="transactions")
    destination_account: Mapped[Optional["Account"]] = relationship("Account", foreign_keys=[destination_account_id])
    category: Mapped[Optional["Category"]] = relationship("Category", back_populates="transactions")

    def __init__(self, **kwargs):
        kwargs.setdefault("type", TransactionType.EXPENSE)
        kwargs.setdefault("status", TransactionStatus.CONFIRMED)
        kwargs.setdefault("source", TransactionSource.MANUAL)
        kwargs.setdefault("tags", [])
        super().__init__(**kwargs)
