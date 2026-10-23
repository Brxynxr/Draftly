import uuid
from decimal import Decimal

from app.models.account import Account, AccountType
from app.models.financial_goal import FinancialGoal, GoalStatus
from app.models.transaction import (
    Transaction,
    TransactionSource,
    TransactionStatus,
    TransactionType,
)
from app.models.user import User


def test_user_model_initialization():
    user = User(
        email="breyner@example.com",
        hashed_password="hashed_pwd_sample",
        full_name="Breyner Dev",
    )
    assert user.email == "breyner@example.com"
    assert user.default_currency == "COP"
    assert user.is_active is True
    assert isinstance(user.webhook_token, str)
    assert len(user.webhook_token) > 10


def test_account_model_financial_precision():
    account = Account(
        user_id=uuid.uuid4(),
        name="Nequi Principal",
        type=AccountType.DEBIT,
        balance=Decimal("150000.50"),
        account_tail="4521",
        color="#20002c",
    )
    assert account.name == "Nequi Principal"
    assert account.type == AccountType.DEBIT
    assert isinstance(account.balance, Decimal)
    assert account.balance == Decimal("150000.50")
    assert account.currency == "COP"


def test_transaction_model_with_enums_and_tags():
    user_id = uuid.uuid4()
    account_id = uuid.uuid4()
    category_id = uuid.uuid4()

    tx = Transaction(
        user_id=user_id,
        account_id=account_id,
        category_id=category_id,
        amount=Decimal("45000.00"),
        type=TransactionType.EXPENSE,
        description="Compra en Éxito Calle 53",
        merchant="Éxito",
        status=TransactionStatus.PENDING_REVIEW,
        source=TransactionSource.MACRODROID_PUSH,
        idempotency_hash="abc123sha256hash",
        tags=["supermercado", "comida"],
    )

    assert tx.amount == Decimal("45000.00")
    assert tx.type == TransactionType.EXPENSE
    assert tx.status == TransactionStatus.PENDING_REVIEW
    assert tx.source == TransactionSource.MACRODROID_PUSH
    assert "supermercado" in tx.tags


def test_financial_goal_model():
    user_id = uuid.uuid4()
    goal = FinancialGoal(
        user_id=user_id,
        name="Moto Yamaha MT-03",
        target_amount=Decimal("28000000.00"),
        current_saved=Decimal("5000000.00"),
        status=GoalStatus.ACTIVE,
    )

    assert goal.name == "Moto Yamaha MT-03"
    assert goal.target_amount == Decimal("28000000.00")
    assert goal.current_saved == Decimal("5000000.00")
    assert goal.status == GoalStatus.ACTIVE
