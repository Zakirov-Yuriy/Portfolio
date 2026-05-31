import logging
import httpx
from app.config import get_settings
from app.schemas import ChatMessage

logger = logging.getLogger("portfolio.llm")

# Фактическая база для ответов ассистента (из резюме). Язык ответа задаётся отдельно.
PROFILE_FACTS = """\
ПРОФИЛЬ ЮРИЯ ЗАКИРОВА:
- Роль: Fullstack-разработчик. Python backend + клиент (Flutter) + AI-интеграции. 4+ года опыта.
- Backend: Python 3.11, FastAPI, Django/DRF, Flask. asyncio, httpx. PostgreSQL (схемы, индексы, \
оптимизация, миграции Alembic, SQLAlchemy). Redis, Celery (очереди, ретраи, rate-limit). MongoDB.
- AI: интеграции с LLM (OpenAI API, Claude API). Prompt engineering, structured outputs, контроль \
контекста и токенов, tool calling.
- Frontend: TypeScript, JavaScript, HTML, SCSS/CSS, fetch, async/await. Этот лендинг сделан на Vite + TS + SCSS.
- Mobile: Flutter, Dart, Clean Architecture, BLoC, Riverpod, Firebase, FCM/APNs.
- Infra: Docker, docker-compose, CI/CD (GitHub Actions, GitLab CI), Pytest, code review, Scrum.

КЛЮЧЕВЫЕ ПРОЕКТЫ:
1. Маркетплейс LIDLE — кроссплатформенное приложение (Android/iOS/Web) на Flutter + Python REST \
backend. Запуск с нуля до prod, Clean Architecture + BLoC для 8+ доменов, CI/CD.
2. AI Assistant Platform — async-сервис работы с LLM API на FastAPI. Снизил время ответа API на \
30% (стриминг, параллельные вызовы), очереди с rate-limit и ретраями, кэширование промптов в Redis.
3. Backend в AKK International — REST API на Django/Flask/FastAPI, Celery-воркеры, оптимизация \
endpoint обработки заказов (-15% времени отклика), автоматизация CI/CD (деплой с часов до 20 минут).

ДОСТИЖЕНИЯ И ПОДХОД: сначала разбирает задачу и контракт API, потом пишет код; типизация (mypy, \
Pydantic); явная обработка ошибок; критичную логику покрывает pytest. Английский B1.
"""

# Инструкция ассистенту — на нужном языке.
INSTRUCTIONS = {
    "ru": (
        "Ты — AI-ассистент на портфолио разработчика Юрия Закирова. Отвечай о его "
        "профессиональном опыте: дружелюбно, по делу, на русском, 2–4 предложениями. "
        "Не выдумывай факты сверх профиля. На вопросы не по теме опыта вежливо возвращай "
        "разговор к профессиональным темам."
    ),
    "en": (
        "You are an AI assistant on developer Yuriy Zakirov's portfolio. Answer about his "
        "professional experience: friendly, to the point, in English, in 2–4 sentences. "
        "Do not invent facts beyond the profile. For off-topic questions, politely steer the "
        "conversation back to professional topics."
    ),
}

UNAVAILABLE_REPLY = {
    "ru": (
        "AI-ассистент сейчас недоступен: на сервере не настроен ключ API. "
        "Но я с радостью отвечу лично — напишите в форме ниже."
    ),
    "en": (
        "The AI assistant is unavailable right now: no API key is configured on the server. "
        "But I'm happy to reply in person — drop me a message in the form below."
    ),
}

FALLBACK_REPLY = {
    "ru": "Не смог сформировать ответ, попробуйте переформулировать.",
    "en": "I couldn't form an answer, please try rephrasing.",
}


def _system_prompt(lang: str) -> str:
    instruction = INSTRUCTIONS.get(lang, INSTRUCTIONS["ru"])
    return f"{instruction}\n\n{PROFILE_FACTS}"


async def answer_about_experience(
    message: str, history: list[ChatMessage], lang: str = "ru"
) -> str:
    lang = lang if lang in INSTRUCTIONS else "ru"
    settings = get_settings()

    # Используем основной или резервный ключ OpenRouter
    api_key = settings.openrouter_api_key or settings.openrouter_api_key_backup
    if not api_key:
        logger.warning("OpenRouter API ключи не заданы — возвращаю заглушку.")
        return UNAVAILABLE_REPLY[lang]

    messages = [{"role": m.role, "content": m.content} for m in history]
    messages.append({"role": "user", "content": message})

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "HTTP-Referer": "http://localhost:5173",
                    "X-Title": "Yurii-Portfolio",
                },
                json={
                    "model": settings.llm_model,
                    "messages": [
                        {"role": "system", "content": _system_prompt(lang)},
                        *messages,
                    ],
                    "max_tokens": 400,
                    "temperature": 0.7,
                },
                timeout=30.0,
            )
            response.raise_for_status()
            result = response.json()

    except httpx.HTTPError as exc:
        logger.error("OpenRouter API ошибка: %s", exc)
        raise

    # Извлекаем текст ответа из OpenRouter
    if "choices" in result and len(result["choices"]) > 0:
        content = result["choices"][0].get("message", {}).get("content", "")
        return content.strip() or FALLBACK_REPLY[lang]

    return FALLBACK_REPLY[lang]
