import { el, icon } from "../utils/dom";
import { sendContact, ApiError } from "../api/client";
import { validateContact, hasErrors, type ContactValues, type FieldErrors } from "../utils/validation";

interface FieldSpec {
  name: keyof ContactValues;
  label: string;
  type: string;
  placeholder: string;
  multiline?: boolean;
}

const FIELDS: FieldSpec[] = [
  { name: "name", label: "Имя", type: "text", placeholder: "Как к вам обращаться" },
  { name: "phone", label: "Телефон", type: "tel", placeholder: "+7 ___ ___ __ __" },
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
  { name: "comment", label: "Комментарий", type: "text", placeholder: "Коротко о задаче или вопросе", multiline: true },
];

export function ContactForm(): HTMLElement {
  const inputs = new Map<keyof ContactValues, HTMLInputElement | HTMLTextAreaElement>();
  const errorNodes = new Map<keyof ContactValues, HTMLElement>();

  const fieldNodes = FIELDS.map((spec) => {
    const field = spec.multiline
      ? el("textarea", { id: `f-${spec.name}`, class: "field__control", placeholder: spec.placeholder, rows: "4" })
      : el("input", { id: `f-${spec.name}`, class: "field__control", type: spec.type, placeholder: spec.placeholder });
    const error = el("span", { class: "field__error", "aria-live": "polite" });
    inputs.set(spec.name, field as HTMLInputElement);
    errorNodes.set(spec.name, error);

    field.addEventListener("input", () => {
      field.classList.remove("is-invalid");
      error.textContent = "";
    });

    return el("div", { class: "field" }, [
      el("label", { class: "field__label", for: `f-${spec.name}` }, [spec.label]),
      field,
      error,
    ]);
  });

  const status = el("p", { class: "form__status", role: "status", "aria-live": "polite" });
  const submit = el("button", { class: "btn btn--primary form__submit", type: "submit" }, [
    el("span", { class: "btn__label" }, ["Отправить"]),
    el("span", { class: "btn__spinner", "aria-hidden": "true" }),
  ]);

  function readValues(): ContactValues {
    return {
      name: inputs.get("name")!.value,
      phone: inputs.get("phone")!.value,
      email: inputs.get("email")!.value,
      comment: inputs.get("comment")!.value,
    };
  }

  function showErrors(errors: FieldErrors): void {
    for (const [name, field] of inputs) {
      const msg = errors[name];
      const node = errorNodes.get(name)!;
      if (msg) {
        field.classList.add("is-invalid");
        node.textContent = msg;
      } else {
        field.classList.remove("is-invalid");
        node.textContent = "";
      }
    }
  }

  function setState(state: "idle" | "loading" | "success" | "error", message = ""): void {
    form.dataset.state = state;
    submit.toggleAttribute("disabled", state === "loading");
    status.className = `form__status form__status--${state}`;
    status.innerHTML = "";
    if (!message) return;
    const iconName = state === "success" ? "send" : "shield";
    status.appendChild(el("span", { html: icon(iconName, 18) }));
    status.appendChild(el("span", {}, [message]));
  }

  const form = el("form", { class: "form", id: "contact-form", novalidate: true }, [
    ...fieldNodes,
    el("div", { class: "form__footer" }, [submit, status]),
  ]) as HTMLFormElement;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const values = readValues();
    const errors = validateContact(values);
    showErrors(errors);

    if (hasErrors(errors)) {
      setState("error", "Проверьте поля формы.");
      return;
    }

    setState("loading", "Отправляю…");

    try {
      const result = await sendContact(values);
      setState("success", result.message || "Готово! Письмо отправлено, копия — вам на почту.");
      form.reset();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Не удалось отправить. Попробуйте позже.";
      setState("error", message);
    }
  });

  return el("section", { class: "section container", id: "contact" }, [
    el("p", { class: "section-label" }, ["// 05 — контакты"]),
    el("h2", { class: "section-title" }, ["Напишите мне"]),
    el("p", { class: "section-lead" }, [
      "Письмо придёт мне, а копия — вам на указанный email. Все состояния обрабатываются: загрузка, успех, ошибка.",
    ]),
    el("div", { class: "form__wrap" }, [form]),
  ]);
}
