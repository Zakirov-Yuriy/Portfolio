// Простой i18n без зависимостей: текущий язык + словарь UI-строк.
// Содержательный контент (профиль, кейсы) живёт в data/profile.ts.
export type Lang = "ru" | "en";

const STORAGE_KEY = "lang";

function detectInitial(): Lang {
  const saved = (typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY)) as Lang | null;
  if (saved === "ru" || saved === "en") return saved;
  const browser = typeof navigator !== "undefined" ? navigator.language.toLowerCase() : "ru";
  return browser.startsWith("ru") ? "ru" : "en";
}

let current: Lang = detectInitial();

type Dict = Record<string, string>;

const dictionaries: Record<Lang, Dict> = {
  ru: {
    // nav
    "nav.about": "о себе",
    "nav.work": "как работаю",
    "nav.cases": "кейсы",
    "nav.assistant": "ai-чат",
    "nav.contact": "контакты",
    "nav.lang_aria": "Переключить язык",
    // skip-link / meta
    "skip.link": "Перейти к форме",
    // hero
    "hero.greeting": "// привет, я",
    "hero.cta_contact": "Связаться",
    "hero.cta_ai": "Спросить AI про опыт",
    // stack
    "stack.label": "// 01 — стек и направления",
    "stack.title": "Чем работаю",
    // approach
    "approach.label": "// 02 — как работаю",
    "approach.title": "Подход к задачам и AI",
    // cases
    "cases.label": "// 03 — кейсы и опыт",
    "cases.title": "Что делал лично",
    // ai chat
    "chat.label": "// 04 — ai-интеграция",
    "chat.title": "Спросите AI про мой опыт",
    "chat.lead":
      "Чат отправляет запрос на эндпоинт FastAPI, тот обращается к LLM с моим профилем в system prompt и возвращает ответ.",
    "chat.placeholder": "Спросите про мой опыт…",
    "chat.input_aria": "Сообщение AI-ассистенту",
    "chat.send_aria": "Отправить",
    "chat.welcome":
      "Привет! Я AI-ассистент Юрия. Спросите — расскажу про его стек, проекты и подход к работе.",
    "chat.error_generic": "Что-то пошло не так. Попробуйте позже.",
    "chat.suggestion_1": "Какой опыт с async Python?",
    "chat.suggestion_2": "Расскажи про интеграции с LLM",
    "chat.suggestion_3": "Что делал на Flutter?",
    // contact form
    "contact.label": "// 05 — контакты",
    "contact.title": "Напишите мне",
    "contact.lead":
      "Письмо придёт мне, а копия — вам на указанный email. Все состояния обрабатываются: загрузка, успех, ошибка.",
    "field.name": "Имя",
    "field.name_ph": "Как к вам обращаться",
    "field.phone": "Телефон",
    "field.phone_ph": "+7 ___ ___ __ __",
    "field.email": "Email",
    "field.email_ph": "you@example.com",
    "field.comment": "Комментарий",
    "field.comment_ph": "Коротко о задаче или вопросе",
    "form.submit": "Отправить",
    "form.invalid": "Проверьте поля формы.",
    "form.sending": "Отправляю…",
    "form.success": "Готово! Письмо отправлено, копия — вам на почту.",
    "form.error_generic": "Не удалось отправить. Попробуйте позже.",
    // validation
    "valid.name": "Укажите имя (минимум 2 символа)",
    "valid.phone": "Введите корректный телефон",
    "valid.email": "Введите корректный email",
    "valid.comment": "Напишите чуть подробнее (минимум 5 символов)",
    // api client
    "api.timeout": "Превышено время ожидания. Попробуйте ещё раз.",
    "api.offline": "Нет связи с сервером. Проверьте подключение.",
    "api.server_error": "Ошибка сервера",
    "api.bad_request": "Не удалось обработать запрос",
    // footer
    "footer.built": "Собрано на Vite + TypeScript + SCSS и FastAPI.",
  },
  en: {
    // nav
    "nav.about": "about",
    "nav.work": "approach",
    "nav.cases": "cases",
    "nav.assistant": "ai chat",
    "nav.contact": "contacts",
    "nav.lang_aria": "Switch language",
    // skip-link / meta
    "skip.link": "Skip to the form",
    // hero
    "hero.greeting": "// hi, i'm",
    "hero.cta_contact": "Get in touch",
    "hero.cta_ai": "Ask AI about my experience",
    // stack
    "stack.label": "// 01 — stack & focus",
    "stack.title": "What I work with",
    // approach
    "approach.label": "// 02 — how I work",
    "approach.title": "Approach to tasks & AI",
    // cases
    "cases.label": "// 03 — cases & experience",
    "cases.title": "What I did myself",
    // ai chat
    "chat.label": "// 04 — ai integration",
    "chat.title": "Ask AI about my experience",
    "chat.lead":
      "The chat sends a request to a FastAPI endpoint, which calls an LLM with my profile in the system prompt and returns the answer.",
    "chat.placeholder": "Ask about my experience…",
    "chat.input_aria": "Message to the AI assistant",
    "chat.send_aria": "Send",
    "chat.welcome":
      "Hi! I'm Yuriy's AI assistant. Ask me about his stack, projects and the way he works.",
    "chat.error_generic": "Something went wrong. Please try again later.",
    "chat.suggestion_1": "What's your experience with async Python?",
    "chat.suggestion_2": "Tell me about LLM integrations",
    "chat.suggestion_3": "What did you build with Flutter?",
    // contact form
    "contact.label": "// 05 — contacts",
    "contact.title": "Write to me",
    "contact.lead":
      "The message goes to me, with a copy to the email you provide. Every state is handled: loading, success, error.",
    "field.name": "Name",
    "field.name_ph": "How should I address you",
    "field.phone": "Phone",
    "field.phone_ph": "+1 ___ ___ ____",
    "field.email": "Email",
    "field.email_ph": "you@example.com",
    "field.comment": "Message",
    "field.comment_ph": "Briefly about the task or question",
    "form.submit": "Send",
    "form.invalid": "Please check the form fields.",
    "form.sending": "Sending…",
    "form.success": "Done! The message has been sent, with a copy to your email.",
    "form.error_generic": "Couldn't send. Please try again later.",
    // validation
    "valid.name": "Enter your name (at least 2 characters)",
    "valid.phone": "Enter a valid phone number",
    "valid.email": "Enter a valid email",
    "valid.comment": "Add a bit more detail (at least 5 characters)",
    // api client
    "api.timeout": "Request timed out. Please try again.",
    "api.offline": "No connection to the server. Check your network.",
    "api.server_error": "Server error",
    "api.bad_request": "Couldn't process the request",
    // footer
    "footer.built": "Built with Vite + TypeScript + SCSS and FastAPI.",
  },
};

export function getLang(): Lang {
  return current;
}

export function t(key: string): string {
  return dictionaries[current][key] ?? dictionaries.ru[key] ?? key;
}

export function setLang(lang: Lang): void {
  current = lang;
  if (typeof localStorage !== "undefined") localStorage.setItem(STORAGE_KEY, lang);
  if (typeof document !== "undefined") document.documentElement.lang = lang;
}
