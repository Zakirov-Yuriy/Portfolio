import { el, icon } from "../utils/dom";
import { sendChat, ApiError, type ChatMessage } from "../api/client";
import { t } from "../i18n";

export function AiChat(): HTMLElement {
  const history: ChatMessage[] = [];
  let busy = false;

  const suggestions = [t("chat.suggestion_1"), t("chat.suggestion_2"), t("chat.suggestion_3")];

  const messages = el("div", { class: "chat__messages", "aria-live": "polite" });
  const input = el("input", {
    class: "chat__input",
    type: "text",
    placeholder: t("chat.placeholder"),
    "aria-label": t("chat.input_aria"),
  });
  const sendBtn = el("button", {
    class: "chat__send",
    type: "button",
    "aria-label": t("chat.send_aria"),
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
      const text = err instanceof ApiError ? err.message : t("chat.error_generic");
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
    suggestions.map((s) =>
      el("button", { class: "chat__suggestion", type: "button" }, [s])
    )
  );
  chips.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("chat__suggestion")) ask(target.textContent ?? "");
  });

  const section = el("section", { class: "section container", id: "assistant" }, [
    el("p", { class: "section-label" }, [t("chat.label")]),
    el("h2", { class: "section-title" }, [t("chat.title")]),
    el("p", { class: "section-lead" }, [t("chat.lead")]),
    el("div", { class: "chat" }, [messages, chips, el("div", { class: "chat__bar" }, [input, sendBtn])]),
  ]);

  // Приветственный пузырёк.
  queueMicrotask(() => {
    addBubble("assistant", t("chat.welcome"));
  });

  return section;
}
