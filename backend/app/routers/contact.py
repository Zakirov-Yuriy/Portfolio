import logging

from fastapi import APIRouter, HTTPException, status

from app.schemas import ContactRequest, ContactResponse
from app.services.email import send_contact_emails

logger = logging.getLogger("portfolio.contact")

router = APIRouter(prefix="/api", tags=["contact"])


@router.post("/contact", response_model=ContactResponse)
async def create_contact(payload: ContactRequest) -> ContactResponse:
    try:
        await send_contact_emails(payload)
    except Exception as exc:  # noqa: BLE001 — наружу отдаём дружелюбное сообщение, детали в лог
        logger.exception("Не удалось отправить письма: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Не удалось отправить сообщение. Попробуйте позже или напишите в Telegram.",
        ) from exc

    return ContactResponse(message="Сообщение отправлено. Копия письма ушла вам на email.")
