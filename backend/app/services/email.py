import logging

import httpx

from app.config import get_settings
from app.schemas import ContactRequest

logger = logging.getLogger("portfolio.email")

BREVO_URL = "https://api.brevo.com/v3/smtp/email"


def _owner_payload(data: ContactRequest, sender: dict, owner: str) -> dict:
    return {
        "sender": sender,
        "to": [{"email": owner}],
        "replyTo": {"email": str(data.email), "name": data.name},
        "subject": f"Новая заявка с портфолио — {data.name}",
        "textContent": (
            "Новая заявка с лендинга:\n\n"
            f"Имя:        {data.name}\n"
            f"Телефон:    {data.phone}\n"
            f"Email:      {data.email}\n\n"
            f"Комментарий:\n{data.comment}\n"
        ),
    }


def _user_payload(data: ContactRequest, sender: dict) -> dict:
    return {
        "sender": sender,
        "to": [{"email": str(data.email), "name": data.name}],
        "subject": "Ваша заявка получена — Юрий Закиров",
        "textContent": (
            f"Здравствуйте, {data.name}!\n\n"
            "Спасибо за сообщение — оно получено, я свяжусь с вами в ближайшее время.\n\n"
            "Копия вашей заявки:\n"
            f"{data.comment}\n\n"
            "—\nЮрий Закиров\nFullstack-разработчик"
        ),
    }


async def _send_via_brevo(api_key: str, payloads: list[dict]) -> None:
    headers = {
        "api-key": api_key,
        "Content-Type": "application/json",
        "accept": "application/json",
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        for payload in payloads:
            response = await client.post(BREVO_URL, headers=headers, json=payload)
            response.raise_for_status()


async def send_contact_emails(data: ContactRequest) -> None:
    """Отправляет письмо владельцу и копию пользователю через Brevo HTTP API.

    Если ключ Brevo не задан (dry-run) — печатает письма в лог,
    чтобы цикл формы можно было проверить без почтового сервиса.
    """
    settings = get_settings()
    sender = {"name": settings.brevo_sender_name, "email": settings.brevo_sender_email}
    owner = _owner_payload(data, sender, settings.owner_email)
    user = _user_payload(data, sender)

    if settings.email_dry_run:
        logger.warning("BREVO_API_KEY не задан — режим dry-run, письма не отправлены.")
        logger.info("[DRY-RUN owner -> %s]\n%s", settings.owner_email, owner["textContent"])
        logger.info("[DRY-RUN user -> %s]\n%s", data.email, user["textContent"])
        return

    try:
        await _send_via_brevo(settings.brevo_api_key, [owner, user])
    except httpx.HTTPStatusError as exc:
        logger.error("Brevo вернул ошибку %s: %s", exc.response.status_code, exc.response.text[:300])
        raise
    except httpx.HTTPError as exc:
        logger.error("Сетевая ошибка Brevo: %s", exc)
        raise

    logger.info("Письма отправлены через Brevo: владельцу (%s) и пользователю (%s).", settings.owner_email, data.email)