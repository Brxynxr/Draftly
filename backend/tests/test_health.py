import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app
from app.services.ai.anthropic_provider import AnthropicProvider
from app.services.ai.factory import get_ai_provider
from app.services.ai.gemini_provider import GeminiProvider
from app.services.ai.openai_compatible_provider import OpenAICompatibleProvider


@pytest.mark.asyncio
async def test_health_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "Draftly API" in data["service"]
        assert "ai_engine" in data


@pytest.mark.asyncio
async def test_root_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "docs" in data


def test_ai_factory_providers():
    # Test factory instantiation for multiple providers
    gemini = get_ai_provider("gemini", api_key="dummy_key")
    assert isinstance(gemini, GeminiProvider)

    groq = get_ai_provider("groq", api_key="dummy_key")
    assert isinstance(groq, OpenAICompatibleProvider)
    assert groq.provider_name == "groq"

    openai = get_ai_provider("openai", api_key="dummy_key")
    assert isinstance(openai, OpenAICompatibleProvider)
    assert openai.provider_name == "openai"

    ollama = get_ai_provider("ollama")
    assert isinstance(ollama, OpenAICompatibleProvider)
    assert ollama.provider_name == "ollama"

    anthropic = get_ai_provider("anthropic", api_key="dummy_key")
    assert isinstance(anthropic, AnthropicProvider)
