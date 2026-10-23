import json
from typing import Any

from anthropic import AsyncAnthropic

from app.core.config import settings
from app.schemas.ai import ParsedTransaction
from app.services.ai.base import SYSTEM_PROMPT_TRANSACTION_PARSER, BaseAIProvider


class AnthropicProvider(BaseAIProvider):
    """Proveedor de IA usando Anthropic Claude (Claude 3.5 Sonnet / Haiku)."""

    def __init__(self, api_key: str | None = None, model_name: str | None = None):
        self.api_key = api_key or settings.ANTHROPIC_API_KEY
        self.model_name = model_name or settings.AI_MODEL
        if not self.model_name or "gemini" in self.model_name:
            self.model_name = "claude-3-5-haiku-20241022"
        self.client = AsyncAnthropic(api_key=self.api_key or "missing-key")

    async def parse_transaction(self, text: str) -> ParsedTransaction:
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY no está configurada en el entorno.")

        system_instruction = (
            f"{SYSTEM_PROMPT_TRANSACTION_PARSER}\n"
            "Responde estrictamente con un objeto JSON sin formato markdown ni texto adicional:\n"
            "{\n"
            '  "is_legitimate": bool,\n'
            '  "action": "PURCHASE"|"TRANSFER_OUT"|"TRANSFER_IN"|"ATM_WITHDRAWAL"|"RECHARGE"|"NON_TRANSACTIONAL",\n'
            '  "bank": string|null,\n'
            '  "amount": number,\n'
            '  "currency": "COP",\n'
            '  "counterparty": string|null,\n'
            '  "account_identifier": string|null,\n'
            '  "suggested_category": string,\n'
            '  "confidence": float,\n'
            '  "raw_summary": string\n'
            "}"
        )

        response = await self.client.messages.create(
            model=self.model_name,
            max_tokens=1024,
            system=system_instruction,
            messages=[
                {
                    "role": "user",
                    "content": f'Analiza la siguiente notificación: "{text}"',
                }
            ],
            temperature=0.1,
        )

        text_response = response.content[0].text
        # Clean potential markdown fences
        if "```json" in text_response:
            text_response = text_response.split("```json")[1].split("```")[0].strip()
        elif "```" in text_response:
            text_response = text_response.split("```")[1].split("```")[0].strip()

        raw_json = json.loads(text_response)
        return ParsedTransaction.model_validate(raw_json)

    async def chat(
        self,
        messages: list[dict[str, str]],
        system_prompt: str | None = None,
        **kwargs: Any,
    ) -> str:
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY no está configurada en el entorno.")

        anthropic_messages = []
        for m in messages:
            anthropic_messages.append({"role": m["role"], "content": m["content"]})

        response = await self.client.messages.create(
            model=self.model_name,
            max_tokens=2048,
            system=system_prompt or "Eres el asistente financiero de Draftly.",
            messages=anthropic_messages,
            **kwargs,
        )
        return response.content[0].text
