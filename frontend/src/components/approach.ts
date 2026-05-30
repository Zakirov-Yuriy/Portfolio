import { el, icon } from "../utils/dom";
import { profile } from "../data/profile";

export function Approach(): HTMLElement {
  const cards = profile.approach.map((card) =>
    el("article", { class: "approach__card" }, [
      el("div", { class: "approach__icon", html: icon(card.icon, 22) }),
      el("h3", { class: "approach__title" }, [card.title]),
      el("p", { class: "approach__text" }, [card.text]),
    ])
  );

  return el("section", { class: "section container", id: "work" }, [
    el("p", { class: "section-label" }, ["// 02 — как работаю"]),
    el("h2", { class: "section-title" }, ["Подход к задачам и AI"]),
    el("div", { class: "approach__grid" }, cards),
  ]);
}
