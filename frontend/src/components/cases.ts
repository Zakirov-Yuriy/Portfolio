import { el } from "../utils/dom";
import { profile } from "../data/profile";

export function Cases(): HTMLElement {
  const cards = profile.cases.map((item) =>
    el("article", { class: "case" }, [
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
        item.tags.map((t) => el("li", { class: "tag" }, [t]))
      ),
    ])
  );

  return el("section", { class: "section container", id: "cases" }, [
    el("p", { class: "section-label" }, ["// 03 — кейсы и опыт"]),
    el("h2", { class: "section-title" }, ["Что делал лично"]),
    el("div", { class: "cases__grid" }, cards),
  ]);
}
