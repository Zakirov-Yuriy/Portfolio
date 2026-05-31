import type { Profile } from "../types";
import { getLang, type Lang } from "../i18n";

// Контент лендинга на двух языках. Меняем тексты, не трогая разметку.
export const profiles: Record<Lang, Profile> = {
  ru: {
    name: "Юрий Закиров",
    title: "Fullstack-разработчик",
    tagline: "Python backend · клиент · AI-интеграции",
    summary:
      "Делаю асинхронные REST API на FastAPI, интеграции с LLM (OpenAI, Claude) и кроссплатформенный клиент на Flutter. Закрываю полный цикл: frontend → API → обработка ошибок → результат.",

    stack: [
      {
        label: "Backend",
        kind: "backend",
        items: ["Python 3.11", "FastAPI", "Django / DRF", "asyncio · httpx", "PostgreSQL", "SQLAlchemy · Alembic", "Redis", "Celery"],
      },
      {
        label: "Frontend",
        kind: "frontend",
        items: ["TypeScript", "JavaScript", "HTML5", "SCSS / CSS", "fetch · async/await", "Flutter · Dart"],
      },
      {
        label: "AI",
        kind: "ai",
        items: ["OpenAI API", "Claude API", "prompt engineering", "structured outputs", "tool calling"],
      },
      {
        label: "Infra",
        kind: "infra",
        items: ["Docker · docker-compose", "GitHub Actions · GitLab CI", "Pytest", "Git-flow", "Linux"],
      },
    ],

    approach: [
      {
        icon: "target",
        title: "Сначала задача, потом код",
        text: "Разбираю требования и контракт API до того, как писать. Декомпозирую, проектирую схемы данных, проверяю крайние случаи. Это экономит итерации.",
      },
      {
        icon: "sparkles",
        title: "AI как инструмент, не как костыль",
        text: "Claude и Cursor — для ревью кода, генерации тестов и быстрого разбора legacy. Решения и архитектуру держу под контролем сам: ИИ ускоряет, но не думает за меня.",
      },
      {
        icon: "shield",
        title: "Надёжность по умолчанию",
        text: "Валидация на входе, явная обработка ошибок, ретраи и rate-limit для внешних API, состояния loading/success/error в UI. Критичную логику покрываю тестами.",
      },
    ],

    cases: [
      {
        title: "Маркетплейс LIDLE",
        role: "Flutter-клиент + Python backend",
        description:
          "Кроссплатформенное приложение (Android / iOS / Web) с единой кодовой базой, интегрированное с REST API на Python.",
        tags: ["Flutter", "FastAPI", "REST", "JWT", "CI/CD"],
        highlights: [
          "Запуск с нуля до prod-готовности",
          "Clean Architecture + BLoC для 8+ доменов",
          "Проектирование контрактов API с backend-командой (OpenAPI/Swagger)",
        ],
        links: [
          { label: "Сайт", href: "https://lidle.io/ru", icon: "external" },
          { label: "RuStore", href: "https://www.rustore.ru/catalog/app/io.lidle.app", icon: "external" },
          { label: "Репозиторий", href: "https://github.com/Zakirov-Yuriy/Lidle", icon: "github" },
        ],
      },
      {
        title: "AI Assistant Platform",
        role: "Python Backend Developer",
        description:
          "Async-сервис работы с LLM API: генерация текстов и обработка пользовательских запросов через единый API.",
        tags: ["FastAPI", "asyncio", "OpenAI", "Claude", "Redis"],
        highlights: [
          "Снизил среднее время ответа API на 30% (стриминг, параллельные вызовы)",
          "Очереди с учётом rate-limit, экспоненциальные ретраи, таймауты",
          "Кэширование повторяющихся промптов — экономия на LLM-запросах",
        ],
        links: [
          { label: "Репозиторий", href: "https://github.com/Zakirov-Yuriy/Bot_WiseVoiceAI_2.0", icon: "github" },
        ],
      },
      {
        title: "XFF-Trust-Chain",
        role: "DevOps · Nginx + Docker",
        description:
          "Стенд на docker-compose: цепочка из трёх Nginx reverse proxy перед Python-приложением с корректной сборкой X-Forwarded-For и защитой от подделки заголовка клиентом.",
        tags: ["Docker", "Nginx", "Python", "Bash", "Security"],
        highlights: [
          "Доверие определяется по $remote_addr TCP-соединения, а не по содержимому заголовка",
          "geo + map с точечным списком доверенных IP, чтобы docker-шлюз не считался доверенным",
          "Протокол проверки на curl: 8 сценариев, включая защиту от spoof XFF",
        ],
        links: [
          { label: "Репозиторий", href: "https://github.com/Zakirov-Yuriy/XFF-Trust-Chain", icon: "github" },
        ],
      },
      {
        title: "ChatGPT App",
        role: "React + Express · LLM",
        description:
          "Веб-чат с LLM: React-фронтенд и Express-бэкенд через OpenRouter, с голосовым вводом на нативном Web Speech API.",
        tags: ["React 19", "Vite", "Tailwind", "Express", "OpenRouter"],
        highlights: [
          "Голосовой ввод с автоотправкой текста после окончания диктовки",
          "Явная обработка ошибок на всех этапах и индикатор загрузки",
          "Деплой: Vercel (фронт) + Render (бэк)",
        ],
        links: [
          { label: "Демо", href: "https://chatgpt-app-six-eta.vercel.app", icon: "external" },
          { label: "Репозиторий", href: "https://github.com/Zakirov-Yuriy/Chatgpt-app", icon: "github" },
        ],
      },
      {
        title: "hh_auto_apply",
        role: "Python · автоматизация + AI",
        description:
          "Скрипт автооткликов на вакансии hh.ru: Playwright управляет браузером, SQLite исключает повторы, AI генерирует персональное сопроводительное письмо под каждую вакансию.",
        tags: ["Python", "Playwright", "SQLite", "OpenRouter", "pytest"],
        highlights: [
          "Clean Architecture: слои domain / application / infrastructure / cli",
          "AI-письма под описание конкретной вакансии через OpenRouter",
          "Безопасный dry-run, отчёты в CSV, покрытие тестами на pytest",
        ],
        links: [
          { label: "Репозиторий", href: "https://github.com/Zakirov-Yuriy/hh_auto_apply", icon: "github" },
        ],
      },
      {
        title: "Pet-проект: этот лендинг",
        role: "Fullstack + AI",
        description:
          "Тестовое задание целиком: Vite + TypeScript + SCSS на фронте, FastAPI на бэке, рабочая форма с письмами и AI-чат про мой опыт.",
        tags: ["TypeScript", "SCSS", "FastAPI", "Claude API"],
        highlights: [
          "Полный цикл: frontend → API → обработка ошибок → результат",
          "Письмо владельцу + копия пользователю",
          "AI-ассистент на эндпоинте FastAPI",
        ],
        links: [
          { label: "Сайт", href: "https://portfolio-eight-rouge-59.vercel.app/#about", icon: "external" },
          { label: "Репозиторий", href: "https://github.com/Zakirov-Yuriy/Portfolio", icon: "github" },
        ],
      },
    ],

    contacts: [
      { label: "Телефон", value: "+7 (925) 449-95-50", href: "tel:+79254499550", icon: "phone" },
      { label: "Email", value: "zakirov.yuriy86@gmail.com", href: "mailto:zakirov.yuriy86@gmail.com", icon: "mail" },
      { label: "Telegram", value: "@Zak_Yuri", href: "https://t.me/Zak_Yuri", icon: "telegram" },
      { label: "GitHub", value: "Zakirov-Yuriy", href: "https://github.com/Zakirov-Yuriy", icon: "github" },
    ],
  },

  en: {
    name: "Yuriy Zakirov",
    title: "Fullstack Developer",
    tagline: "Python backend · client · AI integrations",
    summary:
      "I build async REST APIs with FastAPI, LLM integrations (OpenAI, Claude) and a cross-platform client in Flutter. I cover the full cycle: frontend → API → error handling → result.",

    stack: [
      {
        label: "Backend",
        kind: "backend",
        items: ["Python 3.11", "FastAPI", "Django / DRF", "asyncio · httpx", "PostgreSQL", "SQLAlchemy · Alembic", "Redis", "Celery"],
      },
      {
        label: "Frontend",
        kind: "frontend",
        items: ["TypeScript", "JavaScript", "HTML5", "SCSS / CSS", "fetch · async/await", "Flutter · Dart"],
      },
      {
        label: "AI",
        kind: "ai",
        items: ["OpenAI API", "Claude API", "prompt engineering", "structured outputs", "tool calling"],
      },
      {
        label: "Infra",
        kind: "infra",
        items: ["Docker · docker-compose", "GitHub Actions · GitLab CI", "Pytest", "Git-flow", "Linux"],
      },
    ],

    approach: [
      {
        icon: "target",
        title: "Task first, code second",
        text: "I work through the requirements and the API contract before writing code. Decompose, design the data schemas, check edge cases. It saves iterations.",
      },
      {
        icon: "sparkles",
        title: "AI as a tool, not a crutch",
        text: "Claude and Cursor are for code review, generating tests and quickly making sense of legacy. I keep the decisions and architecture under my own control: AI speeds things up, it doesn't think for me.",
      },
      {
        icon: "shield",
        title: "Reliability by default",
        text: "Input validation, explicit error handling, retries and rate limits for external APIs, loading/success/error states in the UI. I cover critical logic with tests.",
      },
    ],

    cases: [
      {
        title: "LIDLE Marketplace",
        role: "Flutter client + Python backend",
        description:
          "Cross-platform app (Android / iOS / Web) with a single codebase, integrated with a Python REST API.",
        tags: ["Flutter", "FastAPI", "REST", "JWT", "CI/CD"],
        highlights: [
          "From scratch to production-ready",
          "Clean Architecture + BLoC across 8+ domains",
          "Designed API contracts with the backend team (OpenAPI/Swagger)",
        ],
        links: [
          { label: "Website", href: "https://lidle.io/ru", icon: "external" },
          { label: "RuStore", href: "https://www.rustore.ru/catalog/app/io.lidle.app", icon: "external" },
          { label: "Repository", href: "https://github.com/Zakirov-Yuriy/Lidle", icon: "github" },
        ],
      },
      {
        title: "AI Assistant Platform",
        role: "Python Backend Developer",
        description:
          "Async service for working with LLM APIs: text generation and handling user requests through a single API.",
        tags: ["FastAPI", "asyncio", "OpenAI", "Claude", "Redis"],
        highlights: [
          "Cut average API response time by 30% (streaming, parallel calls)",
          "Queues with rate-limit awareness, exponential retries, timeouts",
          "Caching of repeated prompts — saving on LLM requests",
        ],
        links: [
          { label: "Repository", href: "https://github.com/Zakirov-Yuriy/Bot_WiseVoiceAI_2.0", icon: "github" },
        ],
      },
      {
        title: "XFF-Trust-Chain",
        role: "DevOps · Nginx + Docker",
        description:
          "A docker-compose stand: a chain of three Nginx reverse proxies in front of a Python app, building X-Forwarded-For correctly and protecting against client header spoofing.",
        tags: ["Docker", "Nginx", "Python", "Bash", "Security"],
        highlights: [
          "Trust is decided by the TCP connection's $remote_addr, not by header contents",
          "geo + map with an explicit list of trusted IPs, so the docker gateway isn't trusted",
          "curl test protocol: 8 scenarios, including XFF spoof protection",
        ],
        links: [
          { label: "Repository", href: "https://github.com/Zakirov-Yuriy/XFF-Trust-Chain", icon: "github" },
        ],
      },
      {
        title: "ChatGPT App",
        role: "React + Express · LLM",
        description:
          "A web chat with an LLM: React frontend and Express backend via OpenRouter, with voice input on the native Web Speech API.",
        tags: ["React 19", "Vite", "Tailwind", "Express", "OpenRouter"],
        highlights: [
          "Voice input that auto-sends the text once dictation ends",
          "Explicit error handling at every step and a loading indicator",
          "Deploy: Vercel (frontend) + Render (backend)",
        ],
        links: [
          { label: "Demo", href: "https://chatgpt-app-six-eta.vercel.app", icon: "external" },
          { label: "Repository", href: "https://github.com/Zakirov-Yuriy/Chatgpt-app", icon: "github" },
        ],
      },
      {
        title: "hh_auto_apply",
        role: "Python · automation + AI",
        description:
          "A script that auto-applies to hh.ru job postings: Playwright drives the browser, SQLite avoids duplicates, AI generates a personal cover letter for each vacancy.",
        tags: ["Python", "Playwright", "SQLite", "OpenRouter", "pytest"],
        highlights: [
          "Clean Architecture: domain / application / infrastructure / cli layers",
          "AI cover letters tailored to each vacancy via OpenRouter",
          "Safe dry-run, CSV reports, test coverage with pytest",
        ],
        links: [
          { label: "Repository", href: "https://github.com/Zakirov-Yuriy/hh_auto_apply", icon: "github" },
        ],
      },
      {
        title: "Pet project: this landing page",
        role: "Fullstack + AI",
        description:
          "A full test assignment: Vite + TypeScript + SCSS on the frontend, FastAPI on the backend, a working form with emails and an AI chat about my experience.",
        tags: ["TypeScript", "SCSS", "FastAPI", "Claude API"],
        highlights: [
          "Full cycle: frontend → API → error handling → result",
          "Email to the owner + a copy to the user",
          "AI assistant on a FastAPI endpoint",
        ],
        links: [
          { label: "Website", href: "https://portfolio-eight-rouge-59.vercel.app/#about", icon: "external" },
          { label: "Repository", href: "https://github.com/Zakirov-Yuriy/Portfolio", icon: "github" },
        ],
      },
    ],

    contacts: [
      { label: "Phone", value: "+7 (925) 449-95-50", href: "tel:+79254499550", icon: "phone" },
      { label: "Email", value: "zakirov.yuriy86@gmail.com", href: "mailto:zakirov.yuriy86@gmail.com", icon: "mail" },
      { label: "Telegram", value: "@Zak_Yuri", href: "https://t.me/Zak_Yuri", icon: "telegram" },
      { label: "GitHub", value: "Zakirov-Yuriy", href: "https://github.com/Zakirov-Yuriy", icon: "github" },
    ],
  },
};

// Профиль текущего языка. Вызывать внутри компонентов (не на уровне модуля).
export function getProfile(): Profile {
  return profiles[getLang()];
}
