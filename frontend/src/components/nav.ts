import { el } from "../utils/dom";
import { profile } from "../data/profile";

export function Nav(): HTMLElement {
  return el("header", { class: "nav" }, [
    el("div", { class: "nav__inner container" }, [
      el("a", { class: "nav__brand", href: "#top" }, [
        el("span", { class: "nav__brand-mark" }, ["{ }"]),
        el("span", {}, [profile.name]),
      ]),
      el("nav", { class: "nav__links", "aria-label": "Основная навигация" }, [
        el("a", { href: "#about" }, ["о себе"]),
        el("a", { href: "#work" }, ["как работаю"]),
        el("a", { href: "#cases" }, ["кейсы"]),
        el("a", { href: "#assistant" }, ["ai-чат"]),
        el("a", { class: "nav__cta", href: "#contact" }, ["контакты"]),
      ]),
    ]),
  ]);
}
