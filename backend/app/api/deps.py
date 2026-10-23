from app.services.ai.base import BaseAIProvider
from app.services.ai.factory import get_ai_provider


def get_ai() -> BaseAIProvider:
    """Dependency para inyectar el proveedor de IA configurado."""
    return get_ai_provider()
