import { el, icon } from "../utils/dom";
import { getProfile } from "../data/profile";
import { t } from "../i18n";

export function Hero(): HTMLElement {
  const profile = getProfile();
  return el("section", { class: "hero container", id: "top" }, [
    el("p", { class: "section-label reveal" }, [t("hero.greeting")]),
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
        el("span", {}, [t("hero.cta_contact")]),
      ]),
      el("a", { class: "btn", href: "#assistant" }, [
        el("span", { html: icon("robot", 18) }),
        el("span", {}, [t("hero.cta_ai")]),
      ]),
    ]),
  ]);
}
