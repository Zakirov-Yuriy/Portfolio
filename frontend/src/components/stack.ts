import { el } from "../utils/dom";
import { getProfile } from "../data/profile";
import { t } from "../i18n";

export function Stack(): HTMLElement {
  const profile = getProfile();
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
    el("p", { class: "section-label" }, [t("stack.label")]),
    el("h2", { class: "section-title" }, [t("stack.title")]),
    el("div", { class: "stack__grid" }, groups),
  ]);
}
