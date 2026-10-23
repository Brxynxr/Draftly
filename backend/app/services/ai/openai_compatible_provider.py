import json
from typing import Any

from openai import AsyncOpenAI

from app.core.config import settings
from app.schemas.ai import ParsedTransaction
from app.services.ai.base import SYSTEM_PROMPT_TRANSACTION_PARSER, BaseAIProvider


class OpenAICompatibleProvider(BaseAIProvider):
    """
    Proveedor unificado compatible con el protocolo OpenAI.
    Soporta:
      - OpenAI (GPT-4o, GPT-4o-mini)
      - Groq (Llama 3.3 70B, etc. ultra rápido)
      - Ollama / vLLM / Modelos Locales (http://localhost:11434/v1)
    """

    def __init__(
        self,
        api_key: str | None = None,
        base_url: str | None = None,
        model_name: str | None = None,
        provider_name: str = "openai",
    ):
        self.provider_name = provider_name
        self.model_name = model_name or settings.AI_MODEL

        if provider_name == "groq":
            self.api_key = api_key or settings.GROQ_API_KEY
            self.base_url = base_url or "https://api.groq.com/openai/v1"
            if not self.model_name or "gemini" in self.model_name:
                self.model_name = "llama-3.3-70b-versatile"
        elif provider_name == "ollama":
            self.api_key = api_key or "ollama"  # Ollama no requiere clave
            self.base_url = base_url or settings.AI_BASE_URL or "http://localhost:11434/v1"
            if not self.model_name or "gemini" in self.model_name:
                self.model_name = "llama3.2"
        else:  # Standard OpenAI
            self.api_key = api_key or settings.OPENAI_API_KEY
            self.base_url = base_url
            if not self.model_name or "gemini" in self.model_name:
                self.model_name = "gpt-4o-mini"

        self.client = AsyncOpenAI(
            api_key=self.api_key or "missing-key",
            base_url=self.base_url,
        )

    async def parse_transaction(self, text: str) -> ParsedTransaction:
        if self.provider_name != "ollama" and not self.api_key:
            raise ValueError(f"API Key no configurada para el proveedor '{self.provider_name}'.")

        system_instruction = (
            f"{SYSTEM_PROMPT_TRANSACTION_PARSER}\n"
            "Esquema JSON requerido:\n"
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

        response = await self.client.chat.completions.create(
            model=self.model_name,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_instruction},
                {
                    "role": "user",
                    "content": f'Analiza la siguiente notificación o mensaje: "{text}"',
                },
            ],
            temperature=0.1,
        )

        content = response.choices[0].message.content or "{}"
        raw_json = json.loads(content)
        return ParsedTransaction.model_validate(raw_json)

    async def chat(
        self,
        messages: list[dict[str, str]],
        system_prompt: str | None = None,
        **kwargs: Any,
    ) -> str:
        all_messages = []
        if system_prompt:
            all_messages.append({"role": "system", "content": system_prompt})
        all_messages.extend(messages)

        response = await self.client.chat.completions.create(
            model=self.model_name,
            messages=all_messages,
            **kwargs,
        )
        return response.choices[0].message.content or ""
