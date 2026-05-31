import { el, icon } from "../utils/dom";
import { getProfile } from "../data/profile";
import { t } from "../i18n";

export function Cases(): HTMLElement {
  const profile = getProfile();
  const cards = profile.cases.map((item) => {
    const children: (Node | string)[] = [
      el("div", { class: "case__head" }, [
        el("h3", { class: "case__title" }, [item.title]),
        el("span", { class: "case__role" }, [item.role]),
      ]),
      el("p", { class: "case__desc" }, [item.description]),
      el(
        "ul",
        { class: "case__highlights" },
        item.highlights.map((h) => el("li", {}, [h]))
      ),
      el(
        "ul",
        { class: "case__tags" },
        item.tags.map((tag) => el("li", { class: "tag" }, [tag]))
      ),
    ];

    if (item.links && item.links.length > 0) {
      children.push(
        el(
          "div",
          { class: "case__links" },
          item.links.map((link) =>
            el("a", {
              class: "case__link",
              href: link.href,
              target: "_blank",
              rel: "noopener noreferrer",
              html: icon(link.icon ?? "arrow", 15) + `<span>${link.label}</span>`,
            })
          )
        )
      );
    }

    return el("article", { class: "case" }, children);
  });

  return el("section", { class: "section container", id: "cases" }, [
    el("p", { class: "section-label" }, [t("cases.label")]),
    el("h2", { class: "section-title" }, [t("cases.title")]),
    el("div", { class: "cases__grid" }, cards),
  ]);
}
