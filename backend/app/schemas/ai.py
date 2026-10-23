from decimal import Decimal
from enum import Enum

from pydantic import BaseModel, Field


class FinancialAction(str, Enum):
    PURCHASE = "PURCHASE"  # Compras en comercios, datáfonos, online
    TRANSFER_OUT = "TRANSFER_OUT"  # Envíos de dinero a personas / Transfiya
    TRANSFER_IN = "TRANSFER_IN"  # Dinero recibido / pagos / transferencias entrantes
    ATM_WITHDRAWAL = "ATM_WITHDRAWAL"  # Retiro en cajero o corresponsal
    RECHARGE = "RECHARGE"  # Recargas de cuenta (ej. PSE)
    NON_TRANSACTIONAL = "NON_TRANSACTIONAL"  # Publicidad, claves dinámicas, avisos de seguridad


class ParsedTransaction(BaseModel):
    is_legitimate: bool = Field(
        description="True si es una transacción financiera real. False si es publicidad, alerta de seguridad o intento de phishing.",
    )
    action: FinancialAction = Field(
        description="Tipo de acción financiera detectada.",
    )
    bank: str | None = Field(
        default=None,
        description="Nombre del banco o billetera detectada (ej. Bancolombia, Nequi, Nu, Daviplata, Efectivo).",
    )
    amount: Decimal = Field(
        default=Decimal("0.00"),
        description="Monto numérico exacto de la transacción.",
    )
    currency: str = Field(
        default="COP",
        description="Moneda (por defecto COP para Colombia).",
    )
    counterparty: str | None = Field(
        default=None,
        description="Comercio (ej. Exito, Uber, Didi) o persona destino/origen (ej. Daniel).",
    )
    account_identifier: str | None = Field(
        default=None,
        description="Últimos 4 dígitos de la tarjeta o cuenta si aparecen.",
    )
    suggested_category: str = Field(
        default="Gastos Generales",
        description="Categoría sugerida (ej. Comida, Transporte, Vivienda, Servicios, Salud, Educación).",
    )
    confidence: float = Field(
        default=1.0,
        ge=0.0,
        le=1.0,
        description="Nivel de confianza de la extracción entre 0.0 y 1.0.",
    )
    raw_summary: str = Field(
        description="Breve resumen en español para mostrar al usuario en la notificación.",
    )
