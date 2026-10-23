"""initial ledger schema

Revision ID: 001_initial_ledger_schema
Revises:
Create Date: 2026-10-23 10:35:00.000000

"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "001_initial_ledger_schema"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # 1. Users table
    op.create_table(
        "users",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=150), nullable=True),
        sa.Column(
            "default_currency",
            sa.String(length=3),
            server_default="COP",
            nullable=False,
        ),
        sa.Column("webhook_token", sa.String(length=64), nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default="true", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_index("ix_users_webhook_token", "users", ["webhook_token"], unique=True)

    # 2. Accounts table (Bolsillos)
    op.create_table(
        "accounts",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("type", sa.String(length=20), server_default="DEBIT", nullable=False),
        sa.Column(
            "balance",
            sa.Numeric(precision=14, scale=2),
            server_default="0.00",
            nullable=False,
        ),
        sa.Column(
            "currency", sa.String(length=3), server_default="COP", nullable=False
        ),
        sa.Column("account_tail", sa.String(length=4), nullable=True),
        sa.Column("color", sa.String(length=20), nullable=True),
        sa.Column("is_active", sa.Boolean(), server_default="true", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_accounts_user_id", "accounts", ["user_id"], unique=False)

    # 3. Categories table
    op.create_table(
        "categories",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=True),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("icon", sa.String(length=50), nullable=True),
        sa.Column("color", sa.String(length=20), nullable=True),
        sa.Column("is_system", sa.Boolean(), server_default="false", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_categories_user_id", "categories", ["user_id"], unique=False)

    # 4. Transactions table
    op.create_table(
        "transactions",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("account_id", sa.Uuid(), nullable=False),
        sa.Column("destination_account_id", sa.Uuid(), nullable=True),
        sa.Column("category_id", sa.Uuid(), nullable=True),
        sa.Column("amount", sa.Numeric(precision=14, scale=2), nullable=False),
        sa.Column(
            "type", sa.String(length=20), server_default="EXPENSE", nullable=False
        ),
        sa.Column("description", sa.String(length=255), nullable=False),
        sa.Column("merchant", sa.String(length=150), nullable=True),
        sa.Column(
            "status", sa.String(length=20), server_default="CONFIRMED", nullable=False
        ),
        sa.Column(
            "source", sa.String(length=30), server_default="MANUAL", nullable=False
        ),
        sa.Column("idempotency_hash", sa.String(length=64), nullable=True),
        sa.Column("tags", sa.JSON(), nullable=True),
        sa.Column("transaction_date", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["account_id"], ["accounts.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(
            ["category_id"], ["categories.id"], ondelete="SET NULL"
        ),
        sa.ForeignKeyConstraint(
            ["destination_account_id"], ["accounts.id"], ondelete="SET NULL"
        ),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_transactions_account_id", "transactions", ["account_id"], unique=False
    )
    op.create_index(
        "ix_transactions_category_id", "transactions", ["category_id"], unique=False
    )
    op.create_index(
        "ix_transactions_idempotency_hash",
        "transactions",
        ["idempotency_hash"],
        unique=True,
    )
    op.create_index(
        "ix_transactions_user_id", "transactions", ["user_id"], unique=False
    )

    # 5. Financial Goals table
    op.create_table(
        "financial_goals",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("target_amount", sa.Numeric(precision=14, scale=2), nullable=False),
        sa.Column(
            "current_saved",
            sa.Numeric(precision=14, scale=2),
            server_default="0.00",
            nullable=False,
        ),
        sa.Column("target_date", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "status", sa.String(length=20), server_default="ACTIVE", nullable=False
        ),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_financial_goals_user_id", "financial_goals", ["user_id"], unique=False
    )


def downgrade() -> None:
    op.drop_table("financial_goals")
    op.drop_table("transactions")
    op.drop_table("categories")
    op.drop_table("accounts")
    op.drop_table("users")
