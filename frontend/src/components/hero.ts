import { el, icon } from "../utils/dom";
import { profile } from "../data/profile";

export function Hero(): HTMLElement {
  return el("section", { class: "hero container", id: "top" }, [
    el("p", { class: "section-label reveal" }, ["// привет, я"]),
    el("h1", { class: "hero__name reveal", "data-delay": "1" }, [profile.name]),
    el("p", { class: "hero__title reveal", "data-delay": "2" }, [
      el("span", { class: "hero__role" }, [profile.title]),
      el("span", { class: "hero__sep" }, ["·"]),
      el("span", { class: "hero__tag" }, [profile.tagline]),
    ]),
    el("p", { class: "hero__summary reveal", "data-delay": "3" }, [profile.summary]),
    el("div", { class: "hero__actions reveal", "data-delay": "4" }, [
      el("a", { class: "btn btn--primary", href: "#contact" }, [
        el("span", { html: icon("mail", 18) }),
        el("span", {}, ["Связаться"]),
      ]),
      el("a", { class: "btn", href: "#assistant" }, [
        el("span", { html: icon("robot", 18) }),
        el("span", {}, ["Спросить AI про опыт"]),
      ]),
    ]),
  ]);
}
