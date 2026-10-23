from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.security import create_access_token, get_password_hash, verify_password
from app.db.session import get_db
from app.models.account import Account, AccountType
from app.models.category import Category
from app.models.user import User
from app.schemas.token import LoginRequest, Token
from app.schemas.user import UserCreate, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

STARTER_CATEGORIES = [
    {"name": "Comida", "icon": "utensils", "color": "#f97316"},
    {"name": "Transporte", "icon": "car", "color": "#3b82f6"},
    {"name": "Vivienda", "icon": "home", "color": "#10b981"},
    {"name": "Servicios", "icon": "zap", "color": "#eab308"},
    {"name": "Salud", "icon": "heart", "color": "#ef4444"},
    {"name": "Educación", "icon": "book", "color": "#8b5cf6"},
    {"name": "Ocio", "icon": "film", "color": "#ec4899"},
    {"name": "Gastos Generales", "icon": "tag", "color": "#64748b"},
]


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar nuevo usuario",
)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Crea una nueva cuenta de usuario en Draftly, inicializa sus bolsillos
    base (Efectivo y Nequi) y sus categorías predeterminadas.
    """
    # Verificar si el correo ya existe
    stmt = select(User).where(User.email == user_in.email.lower().strip())
    result = await db.execute(stmt)
    if result.scalar_one_or_none() is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un usuario registrado con este correo electrónico.",
        )

    # Crear usuario
    user = User(
        email=user_in.email.lower().strip(),
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        default_currency=user_in.default_currency.upper(),
    )
    db.add(user)
    await db.flush()  # Para obtener el user.id

    # Crear bolsillos base para el usuario
    starter_accounts = [
        Account(
            user_id=user.id,
            name="Efectivo",
            type=AccountType.CASH,
            balance=Decimal("0.00"),
            currency=user.default_currency,
            color="#16a34a",
        ),
        Account(
            user_id=user.id,
            name="Nequi",
            type=AccountType.DEBIT,
            balance=Decimal("0.00"),
            currency=user.default_currency,
            color="#20002c",
        ),
    ]
    db.add_all(starter_accounts)

    # Crear categorías base para el usuario
    starter_cats = [
        Category(
            user_id=user.id,
            name=cat["name"],
            icon=cat["icon"],
            color=cat["color"],
            is_system=True,
        )
        for cat in STARTER_CATEGORIES
    ]
    db.add_all(starter_cats)
    await db.commit()
    await db.refresh(user)

    return user


@router.post(
    "/login",
    response_model=Token,
    summary="Iniciar sesión y obtener JWT",
)
async def login(credentials: LoginRequest, db: AsyncSession = Depends(get_db)):
    """
    Autentica al usuario por correo y contraseña, retornando el token JWT.
    """
    stmt = select(User).where(User.email == credentials.email.lower().strip())
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Esta cuenta de usuario ha sido desactivada.",
        )

    access_token = create_access_token(subject=str(user.id))
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Obtener perfil del usuario autenticado",
)
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Retorna la información del usuario autenticado, incluyendo su webhook_token
    para configurar MacroDroid en Android.
    """
    return current_user
