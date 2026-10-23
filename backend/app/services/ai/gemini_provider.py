import json
from typing import Any

from google import genai
from google.genai import types

from app.core.config import settings
from app.schemas.ai import ParsedTransaction
from app.services.ai.base import SYSTEM_PROMPT_TRANSACTION_PARSER, BaseAIProvider


class GeminiProvider(BaseAIProvider):
    """Proveedor de IA usando el nuevo SDK oficial google-genai (Gemini 1.5 Flash / Pro)."""

    def __init__(self, api_key: str | None = None, model_name: str | None = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model_name = model_name or settings.AI_MODEL or "gemini-1.5-flash"
        self._client: genai.Client | None = None

    @property
    def client(self) -> genai.Client:
        if self._client is None:
            if not self.api_key:
                raise ValueError("GEMINI_API_KEY no está configurada en el entorno.")
            self._client = genai.Client(api_key=self.api_key)
        return self._client

    async def parse_transaction(self, text: str) -> ParsedTransaction:
        prompt = f'Analiza la siguiente notificación o mensaje financiero:\n\n"{text}"'

        # Generación con structured output en JSON usando google-genai
        response = await self.client.aio.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT_TRANSACTION_PARSER,
                response_mime_type="application/json",
            ),
        )

        raw_json = json.loads(response.text or "{}")
        return ParsedTransaction.model_validate(raw_json)

    async def chat(
        self,
        messages: list[dict[str, str]],
        system_prompt: str | None = None,
        **kwargs: Any,
    ) -> str:
        # Flatten messages to string conversation for standard chat
        formatted_prompt = ""
        for m in messages:
            formatted_prompt += f"{m.get('role', 'user')}: {m.get('content', '')}\n"

        response = await self.client.aio.models.generate_content(
            model=self.model_name,
            contents=formatted_prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt
                or "Eres el asistente financiero de Draftly.",
            ),
        )
        return response.text or ""
