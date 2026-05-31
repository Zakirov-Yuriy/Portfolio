import type { ContactValues } from "../utils/validation";
import { t, getLang } from "../i18n";

// База берётся из env; пусто = относительный путь (Vite-прокси в dev / rewrite в проде).
const BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  body?: unknown;
  timeoutMs?: number;
}

async function request<T>(path: string, { body, timeoutMs = 15000 }: RequestOptions = {}): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {}),
      signal: controller.signal,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const detail =
        (data && (data.detail || data.message)) || `${t("api.server_error")} (${res.status})`;
      throw new ApiError(typeof detail === "string" ? detail : t("api.bad_request"), res.status);
    }

    return data as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError(t("api.timeout"));
    }
    throw new ApiError(t("api.offline"));
  } finally {
    clearTimeout(timer);
  }
}

export interface ContactResult {
  status: string;
  message: string;
}

export function sendContact(values: ContactValues): Promise<ContactResult> {
  return request<ContactResult>("/api/contact", { body: values });
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResult {
  reply: string;
}

export function sendChat(message: string, history: ChatMessage[]): Promise<ChatResult> {
  // lang передаём на бэкенд, чтобы ассистент отвечал на языке интерфейса.
  return request<ChatResult>("/api/chat", { body: { message, history, lang: getLang() }, timeoutMs: 30000 });
}
