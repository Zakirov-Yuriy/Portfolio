import type { ContactValues } from "../utils/validation";

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
        (data && (data.detail || data.message)) || `Ошибка сервера (${res.status})`;
      throw new ApiError(typeof detail === "string" ? detail : "Не удалось обработать запрос", res.status);
    }

    return data as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError("Превышено время ожидания. Попробуйте ещё раз.");
    }
    throw new ApiError("Нет связи с сервером. Проверьте подключение.");
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
  return request<ChatResult>("/api/chat", { body: { message, history }, timeoutMs: 30000 });
}
