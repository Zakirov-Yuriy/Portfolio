import logging
from email.message import EmailMessage

import aiosmtplib

from app.config import get_settings
from app.schemas import ContactRequest

logger = logging.getLogger("portfolio.email")


def _build_owner_message(data: ContactRequest, sender: str, owner: str) -> EmailMessage:
    msg = EmailMessage()
    msg["From"] = sender
    msg["To"] = owner
    msg["Reply-To"] = str(data.email)
    msg["Subject"] = f"Новая заявка с портфолио — {data.name}"
    msg.set_content(
        "Новая заявка с лендинга:\n\n"
        f"Имя:        {data.name}\n"
        f"Телефон:    {data.phone}\n"
        f"Email:      {data.email}\n\n"
        f"Комментарий:\n{data.comment}\n"
    )
    return msg


def _build_user_message(data: ContactRequest, sender: str) -> EmailMessage:
    msg = EmailMessage()
    msg["From"] = sender
    msg["To"] = str(data.email)
    msg["Subject"] = "Ваша заявка получена — Юрий Закиров"
    msg.set_content(
        f"Здравствуйте, {data.name}!\n\n"
        "Спасибо за сообщение — оно получено, я свяжусь с вами в ближайшее время.\n\n"
        "Копия вашей заявки:\n"
        f"{data.comment}\n\n"
        "—\nЮрий Закиров\nFullstack-разработчик"
    )
    return msg


async def _send(messages: list[EmailMessage]) -> None:
    settings = get_settings()
    for msg in messages:
        await aiosmtplib.send(
            msg,
            hostname=settings.smtp_host,
            port=settings.smtp_port,
            username=settings.smtp_user or None,
            password=settings.smtp_password or None,
            use_tls=settings.smtp_ssl,
            start_tls=not settings.smtp_ssl,
        )


async def send_contact_emails(data: ContactRequest) -> None:
    """Отправляет письмо владельцу и копию пользователю.

    Если SMTP не настроен (dry-run) — печатает письма в лог,
    чтобы цикл формы можно было проверить без почтового сервера.
    """
    settings = get_settings()
    owner_msg = _build_owner_message(data, settings.smtp_from, settings.owner_email)
    user_msg = _build_user_message(data, settings.smtp_from)

    if settings.email_dry_run:
        logger.warning("SMTP не настроен — режим dry-run, письма не отправлены.")
        logger.info("[DRY-RUN owner]\n%s", owner_msg.get_content())
        logger.info("[DRY-RUN user]\n%s", user_msg.get_content())
        return

    await _send([owner_msg, user_msg])
    logger.info("Письма отправлены: владельцу (%s) и пользователю (%s).", settings.owner_email, data.email)
