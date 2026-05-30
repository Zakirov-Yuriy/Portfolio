import { el } from "../utils/dom";
import { profile } from "../data/profile";

export function Stack(): HTMLElement {
  const groups = profile.stack.map((group) =>
    el("div", { class: `stack__group stack__group--${group.kind}` }, [
      el("h3", { class: "stack__group-label" }, [group.label]),
      el(
        "ul",
        { class: "stack__chips" },
        group.items.map((item) => el("li", { class: "chip" }, [item]))
      ),
    ])
  );

  return el("section", { class: "section container", id: "about" }, [
    el("p", { class: "section-label" }, ["// 01 — стек и направления"]),
    el("h2", { class: "section-title" }, ["Чем работаю"]),
    el("div", { class: "stack__grid" }, groups),
  ]);
}
