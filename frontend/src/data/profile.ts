import type { Profile } from "../types";

// Весь контент лендинга собран здесь, чтобы менять текст без правок разметки.
export const profile: Profile = {
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
    },
  ],

  contacts: [
    { label: "Телефон", value: "+7 (925) 449-95-50", href: "tel:+79254499550", icon: "phone" },
    { label: "Email", value: "zakirov.yuriy86@gmail.com", href: "mailto:zakirov.yuriy86@gmail.com", icon: "mail" },
    { label: "Telegram", value: "@Zak_Yuri", href: "https://t.me/Zak_Yuri", icon: "telegram" },
    { label: "GitHub", value: "Zakirov-Yuriy", href: "https://github.com/Zakirov-Yuriy", icon: "github" },
  ],
};
