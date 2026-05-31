import { el, icon } from "../utils/dom";
import { sendChat, ApiError, type ChatMessage } from "../api/client";

const SUGGESTIONS = [
  "Какой опыт с async Python?",
  "Расскажи про интеграции с LLM",
  "Что делал на Flutter?",
];

export function AiChat(): HTMLElement {
  const history: ChatMessage[] = [];
  let busy = false;

  const messages = el("div", { class: "chat__messages", "aria-live": "polite" });
  const input = el("input", {
    class: "chat__input",
    type: "text",
    placeholder: "Спросите про мой опыт…",
    "aria-label": "Сообщение AI-ассистенту",
  });
  const sendBtn = el("button", {
    class: "chat__send",
    type: "button",
    "aria-label": "Отправить",
    html: icon("send", 18),
  });

  function addBubble(role: "user" | "assistant", text: string): HTMLElement {
    const bubble = el("div", { class: `chat__bubble chat__bubble--${role}` }, [text]);
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
    return bubble;
  }

  function setBusy(value: boolean): void {
    busy = value;
    input.toggleAttribute("disabled", value);
    sendBtn.toggleAttribute("disabled", value);
  }

  async function ask(text: string): Promise<void> {
    const message = text.trim();
    if (!message || busy) return;

    addBubble("user", message);
    input.value = "";
    setBusy(true);

    // Состояние loading — отдельный «печатающий» пузырёк.
    const typing = el("div", { class: "chat__bubble chat__bubble--assistant chat__typing" }, [
      el("span", { class: "dot" }),
      el("span", { class: "dot" }),
      el("span", { class: "dot" }),
    ]);
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;

    try {
      const { reply } = await sendChat(message, history);
      typing.remove();
      addBubble("assistant", reply);
      history.push({ role: "user", content: message }, { role: "assistant", content: reply });
    } catch (err) {
      typing.remove();
      const text = err instanceof ApiError ? err.message : "Что-то пошло не так. Попробуйте позже.";
      const errBubble = addBubble("assistant", text);
      errBubble.classList.add("chat__bubble--error");
    } finally {
      setBusy(false);
      input.focus();
    }
  }

  sendBtn.addEventListener("click", () => ask(input.value));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") ask(input.value);
  });

  const chips = el(
    "div",
    { class: "chat__suggestions" },
    SUGGESTIONS.map((s) =>
      el("button", { class: "chat__suggestion", type: "button" }, [s])
    )
  );
  chips.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("chat__suggestion")) ask(target.textContent ?? "");
  });

  const section = el("section", { class: "section container", id: "assistant" }, [
    el("p", { class: "section-label" }, ["// 04 — ai-интеграция"]),
    el("h2", { class: "section-title" }, ["Спросите AI про мой опыт"]),
    el("p", { class: "section-lead" }, [
      "Чат отправляет запрос на эндпоинт FastAPI, тот обращается к LLM с моим профилем в system prompt и возвращает ответ.",
    ]),
    el("div", { class: "chat" }, [messages, chips, el("div", { class: "chat__bar" }, [input, sendBtn])]),
  ]);

  // Приветственный пузырёк.
  queueMicrotask(() => {
    addBubble(
      "assistant",
      "Привет! Я AI-ассистент Юрия. Спросите — расскажу про его стек, проекты и подход к работе."
    );
  });

  return section;
}
