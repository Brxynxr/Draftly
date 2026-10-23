from app.core.config import settings
from app.services.ai.anthropic_provider import AnthropicProvider
from app.services.ai.base import BaseAIProvider
from app.services.ai.gemini_provider import GeminiProvider
from app.services.ai.openai_compatible_provider import OpenAICompatibleProvider


def get_ai_provider(
    provider_name: str | None = None,
    api_key: str | None = None,
    model_name: str | None = None,
) -> BaseAIProvider:
    """
    Factory que retorna el proveedor de IA configurado en el sistema o uno especificado dinámicamente.
    Soporta:
      - 'gemini' (Google AI Studio Free Tier)
      - 'groq' (Groq Llama 3.3 ultra rápido)
      - 'openai' (GPT-4o, GPT-4o-mini)
      - 'ollama' (Modelos locales en http://localhost:11434/v1)
      - 'anthropic' (Claude 3.5 Sonnet / Haiku)
    """
    provider = (provider_name or settings.AI_PROVIDER).lower()

    if provider == "gemini":
        return GeminiProvider(api_key=api_key, model_name=model_name)
    elif provider in ["openai", "groq", "ollama"]:
        return OpenAICompatibleProvider(
            api_key=api_key,
            model_name=model_name,
            provider_name=provider,
        )
    elif provider == "anthropic":
        return AnthropicProvider(api_key=api_key, model_name=model_name)
    else:
        raise ValueError(
            f"Proveedor de IA no soportado: '{provider}'. Opciones: gemini, groq, openai, ollama, anthropic."
        )
