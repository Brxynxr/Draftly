from datetime import UTC, datetime

from fastapi import APIRouter

from app.core.config import settings

router = APIRouter()


@router.get("/health", tags=["Health"])
async def health_check():
    """Chequeo de salud del API y estado de configuración."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "ai_engine": {
            "provider": settings.AI_PROVIDER,
            "model": settings.AI_MODEL,
        },
        "timestamp": datetime.now(UTC).isoformat(),
    }
