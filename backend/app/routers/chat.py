import logging

from fastapi import APIRouter, HTTPException, status

from app.schemas import ChatRequest, ChatResponse
from app.services.llm import answer_about_experience

logger = logging.getLogger("portfolio.chat")

router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest) -> ChatResponse:
    try:
        reply = await answer_about_experience(payload.message, payload.history, payload.lang)
    except Exception as exc:  # noqa: BLE001
        logger.exception("Ошибка AI-чата: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI-ассистент временно недоступен. Попробуйте чуть позже.",
        ) from exc

    return ChatResponse(reply=reply)
