from abc import ABC, abstractmethod
from typing import Any

from app.schemas.ai import ParsedTransaction

SYSTEM_PROMPT_TRANSACTION_PARSER = """Eres el motor de extracción financiera de Draftly, una plataforma de finanzas personales para Colombia y Latinoamérica.
Tu tarea es analizar el texto recibido (que puede ser una notificación push de Android de Bancolombia, Nequi, Nu, Daviplata, o un mensaje del usuario como "hoy me gasté 100mil en ir a la u").

Reglas de extracción estrictas:
1. Identifica si es legítima:
   - Falso si es publicidad, aviso de seguridad, clave dinámica, o intentos de phishing (especialmente si contiene enlaces sospechosos como 'cancele aquí' o links web).
   - Verdadero si es un pago, transferencia, compra, retiro o ingreso real.
2. Identifica la acción:
   - PURCHASE: Compras en datáfonos, comercios, apps (Uber, Rappi, Exito).
   - TRANSFER_OUT: Envíos de dinero a personas o cuentas externas ("Enviaste plata a...").
   - TRANSFER_IN: Dinero recibido ("Recibiste plata de...", consignaciones).
   - ATM_WITHDRAWAL: Retiro en cajero o corresponsal ("Sacaste plata", "Retiro cajero").
   - RECHARGE: Recargas de saldo.
   - NON_TRANSACTIONAL: Claves dinámicas o mensajes sin movimiento financiero.
3. Monto y Moneda:
   - Extrae el monto numérico exacto sin puntos de miles ni símbolos. Si el usuario dice "100mil" o "100k", el monto es 100000. Moneda por defecto COP.
4. Categoría sugerida:
   - Categorías estándar: Comida, Transporte, Vivienda, Servicios, Salud, Educación, Ocio, Transferencias, Gastos Generales.
5. Banco o billetera:
   - Nequi, Bancolombia, Nu, Daviplata, Efectivo, u Otro.

Debes responder ÚNICAMENTE con un JSON válido con la estructura solicitada."""


class BaseAIProvider(ABC):
    """Interfaz abstracta para proveedores de Inteligencia Artificial en Draftly."""

    @abstractmethod
    async def parse_transaction(self, text: str) -> ParsedTransaction:
        """Parsea texto no estructurado o notificaciones y retorna un objeto ParsedTransaction estructurado."""

    @abstractmethod
    async def chat(
        self,
        messages: list[dict[str, str]],
        system_prompt: str | None = None,
        **kwargs: Any,
    ) -> str:
        """Genera una respuesta conversacional para el asistente financiero."""
