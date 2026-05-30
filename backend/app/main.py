import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import chat, contact

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")

settings = get_settings()

app = FastAPI(
    title="Portfolio API",
    description="Backend для лендинга-портфолио: форма обратной связи и AI-ассистент.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(contact.router)
app.include_router(chat.router)


@app.get("/api/health", tags=["health"])
async def health() -> dict[str, object]:
    return {
        "status": "ok",
        "email_configured": not settings.email_dry_run,
        "ai_configured": bool(settings.anthropic_api_key),
    }
