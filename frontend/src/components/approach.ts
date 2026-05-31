import { el, icon } from "../utils/dom";
import { getProfile } from "../data/profile";
import { t } from "../i18n";

export function Approach(): HTMLElement {
  const profile = getProfile();
  const cards = profile.approach.map((card) =>
    el("article", { class: "approach__card" }, [
      el("div", { class: "approach__icon", html: icon(card.icon, 22) }),
      el("h3", { class: "approach__title" }, [card.title]),
      el("p", { class: "approach__text" }, [card.text]),
    ])
  );

  return el("section", { class: "section container", id: "work" }, [
    el("p", { class: "section-label" }, [t("approach.label")]),
    el("h2", { class: "section-title" }, [t("approach.title")]),
    el("div", { class: "approach__grid" }, cards),
  ]);
}
