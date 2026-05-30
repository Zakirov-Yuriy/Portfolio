# Лендинг-портфолио — Юрий Закиров

Одностраничный сайт-презентация разработчика с рабочей формой обратной связи и AI-ассистентом.
Тестовое задание: полный цикл **frontend → API → обработка ошибок → результат**.

- **Frontend:** Vite + TypeScript + SCSS (без фреймворка)
- **Backend/API:** FastAPI (Python, async)
- **AI:** Claude API — ассистент отвечает на вопросы о моём опыте

```
portfolio/
├── frontend/          # Vite + TS + SCSS
│   └── src/
│       ├── components/   # секции: hero, stack, approach, cases, aiChat, contactForm, footer
│       ├── api/          # клиент к backend (fetch, таймаут, ошибки)
│       ├── utils/        # DOM-хелперы, валидация
│       ├── data/         # контент профиля
│       └── styles/       # SCSS: токены, база, по компоненту на файл
└── backend/           # FastAPI
    └── app/
        ├── routers/      # /api/contact, /api/chat
        ├── services/     # email (SMTP), llm (Claude)
        ├── schemas.py    # валидация (Pydantic)
        ├── config.py     # настройки из .env
        └── main.py       # приложение, CORS, health
```

## Как запустить

Нужны Node.js 18+ и Python 3.11+.

### 1. Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # при желании заполнить SMTP и ANTHROPIC_API_KEY
uvicorn app.main:app --reload --port 8000
```

API поднимется на `http://127.0.0.1:8000`. Документация — `http://127.0.0.1:8000/docs`.

Без настройки `.env` всё работает в демо-режиме: форма логирует письма в консоль (dry-run),
AI-чат отвечает заглушкой. Чтобы включить реально — заполните в `.env`:
- `SMTP_HOST/SMTP_USER/SMTP_PASSWORD` — для отправки писем (mail.ru / gmail / yandex);
- `ANTHROPIC_API_KEY` — для AI-ассистента.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env        # для локалки можно не трогать
npm run dev
```

Откроется `http://localhost:5173`. Запросы к `/api` Vite проксирует на FastAPI (порт 8000),
поэтому CORS в разработке не мешает.

Сборка прода: `npm run build` → статика в `frontend/dist`.

## Как реализована форма

Поля: имя, телефон, email, комментарий.

1. **Клиент** (`utils/validation.ts`): проверка полей до отправки, подсветка ошибок по полю,
   состояния `loading / success / error`, спиннер в кнопке. Запрос через `api/client.ts` —
   `fetch` с таймаутом (`AbortController`) и единым разбором ошибок.
2. **Сервер** (`routers/contact.py`): повторная валидация через Pydantic (`EmailStr`,
   проверка количества цифр в телефоне). Сервис `services/email.py` шлёт **два письма** через
   `aiosmtplib`: владельцу (с `Reply-To` на адрес отправителя) и **копию пользователю**.
3. **Ошибки**: невалидные данные → `422`; сбой почты → `502` с дружелюбным текстом, детали в лог.

## Какие AI-инструменты использовались

- **Claude (Anthropic)** — как ассистент в разработке (генерация бойлерплейта, ревью, правки)
  и как продакшен-фича: эндпоинт `/api/chat` обращается к Claude API. Профиль зашит в system
  prompt (`services/llm.py`), ответы ограничены темой опыта.
- Модель по умолчанию — `claude-3-5-haiku-latest` (быстрая и дешёвая), меняется через `LLM_MODEL`.

### Что делалось с помощью ИИ

- Каркас компонентов фронтенда и структура SCSS по файлам.
- Болванки роутеров и сервисов FastAPI, схемы Pydantic.
- Тексты подсказок и system prompt для ассистента.

### Что пришлось править вручную

- Типизация `import.meta.env` — добавил `vite-env.d.ts`, иначе `tsc` падал.
- Логика отправки двух писем — ИИ предложил кривой вариант с заглушкой, переписал на чистый цикл.
- Запуск под `PYTHONPATH`, флаги SSL/STARTTLS для SMTP, корректные коды ответов (422 vs 502).
- Подбор акцентов и адаптив SCSS под мобильные — донастраивал руками.

## Деплой

- **Frontend** → Vercel (или Netlify): импорт репозитория, root `frontend`, build `npm run build`,
  output `dist`. В переменных окружения указать `VITE_API_BASE_URL` = адрес backend.
- **Backend** → Render (Docker или Python): старт `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
  В переменных задать `ALLOWED_ORIGINS` (домен фронта), SMTP-данные и `ANTHROPIC_API_KEY`.

## Замена AI-провайдера

Чтобы использовать OpenAI вместо Claude — поменять `services/llm.py` на вызов OpenAI SDK
(messages → chat.completions, system prompt тем же). Контракт эндпоинта `/api/chat` не меняется.
