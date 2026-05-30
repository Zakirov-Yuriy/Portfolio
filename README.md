# Портфолио-лендинг разработчика

Одностраничный сайт-презентация с рабочей формой обратной связи и AI-ассистентом.
Реализован полный цикл: frontend → API → обработка ошибок → результат.

**Живая версия:** https://portfolio-eight-rouge-59.vercel.app
**API (health):** https://portfolio-api-1mu0.onrender.com/api/health
**Репозиторий:** https://github.com/Zakirov-Yuriy/Portfolio

## Стек

| Слой | Технологии |
|---|---|
| Frontend | Vite, TypeScript, SCSS (без фреймворка) |
| Backend | FastAPI (Python, async), Pydantic |
| Почта | Brevo (HTTP API) |
| AI | OpenRouter (модель `openai/gpt-oss-120b`), OpenAI-совместимый API |
| Деплой | Vercel (фронт) + Render (бэкенд) |

## Структура

```
portfolio/
├── frontend/                 # Vite + TS + SCSS
│   ├── vercel.json           # проксирование /api на Render
│   └── src/
│       ├── components/       # секции: hero, stack, approach, cases, aiChat, contactForm, footer
│       ├── api/              # клиент к backend (fetch, таймаут, обработка ошибок)
│       ├── utils/            # DOM-хелперы, валидация
│       ├── data/             # контент профиля
│       └── styles/           # SCSS: токены, база, по файлу на компонент
└── backend/                  # FastAPI
    └── app/
        ├── routers/          # /api/contact, /api/chat, /api/health
        ├── services/         # email (Brevo), llm (OpenRouter)
        ├── schemas.py        # валидация (Pydantic, EmailStr)
        ├── config.py         # настройки из окружения
        └── main.py           # приложение, CORS, health
```

## Запуск локально

Нужны Node.js 18+ и Python 3.11+.

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # заполнить BREVO_API_KEY и OPENROUTER_API_KEY
uvicorn app.main:app --reload --port 8000
```

API: `http://127.0.0.1:8000`, документация: `http://127.0.0.1:8000/docs`.
Без ключей всё работает в демо-режиме: форма логирует письма в консоль (dry-run),
AI-чат отвечает заглушкой.

### Frontend

```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

Запросы к `/api` Vite проксирует на FastAPI (порт 8000), поэтому CORS в разработке не мешает.
Сборка прода: `npm run build` (статика в `frontend/dist`).

## Как реализована форма

Поля: имя, телефон, email, комментарий.

1. **Клиент** (`utils/validation.ts`): проверка полей до отправки, подсветка ошибок по полю,
   состояния `loading / success / error`, спиннер в кнопке. Запрос через `api/client.ts`:
   `fetch` с таймаутом (`AbortController`) и единым разбором ошибок.
2. **Сервер** (`routers/contact.py`): повторная валидация через Pydantic (`EmailStr`,
   проверка количества цифр в телефоне). Сервис `services/email.py` через HTTP API Brevo
   отправляет два письма: владельцу (с `Reply-To` на адрес отправителя) и копию пользователю.
3. **Ошибки**: невалидные данные → `422`; сбой почты → `502` с дружелюбным текстом, детали в лог.

## AI-ассистент

Эндпоинт `/api/chat` принимает сообщение и историю, обращается к модели через OpenRouter
(`services/llm.py`). Профиль зашит в system prompt, ответы ограничены темой опыта.
Заложен запасной ключ на случай лимита бесплатной модели. На фронте: чат с историей,
подсказками-вопросами и состояниями загрузки/ошибки.

## AI-инструменты

- **OpenRouter** (единый OpenAI-совместимый шлюз к LLM) — как продакшен-фича в `/api/chat`.
- **Claude / Cursor** — как ассистенты в самой разработке.

### Что делалось с помощью ИИ

- Каркас компонентов фронтенда и структура SCSS.
- Болванки роутеров и сервисов FastAPI, схемы Pydantic.
- System prompt ассистента, тексты подсказок.

### Что пришлось исправлять вручную

- **Render режет SMTP.** Бесплатный тариф Render с сентября 2025 блокирует исходящие
  SMTP-порты (25, 465, 587), письма через Gmail SMTP уходили в таймаут. Переписал
  отправку почты с `aiosmtplib` на HTTP API Brevo (порт 443 не блокируется).
- **Лишний `\n` в ключе.** Значение API-ключа в переменных окружения пришло с переводами
  строки, и `httpx` падал с `Illegal header value` ещё до запроса. Добавил в конфиг
  валидатор, срезающий пробелы и переносы у всех значений из окружения.
- **Health после смены провайдера.** Эндпоинт `/api/health` ссылался на удалённое поле
  конфигурации после перехода с Anthropic на OpenRouter; поправил на ключи OpenRouter.
- **Типизация Vite.** Добавил `vite-env.d.ts` для `import.meta.env`, иначе не проходила `tsc`.
- **Монорепо на Vercel.** При импорте Vercel распознал репозиторий как мультисервис и пытался
  собрать ещё и FastAPI; ограничил деплой только папкой `frontend` (Root Directory).

## Деплой

- **Frontend → Vercel.** Root Directory `frontend`, фреймворк Vite. Файл `frontend/vercel.json`
  проксирует `/api` на Render, поэтому фронт ходит на относительный путь и CORS не нужен.
- **Backend → Render.** Web Service (Docker), start `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
  Переменные: `ALLOWED_ORIGINS`, `OWNER_EMAIL`, `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`,
  `OPENROUTER_API_KEY`, `OPENROUTER_API_KEY_BACKUP`, `LLM_MODEL`.

## Холодный старт

Бесплатный сервис Render засыпает после 15 минут простоя (первый запрос потом ~30-60 сек).
Чтобы у проверяющего не было задержки, `/api/health` пингуется по расписанию (cron-job.org).