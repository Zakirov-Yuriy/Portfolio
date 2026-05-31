import { el } from "../utils/dom";
import { getProfile } from "../data/profile";
import { t, getLang, setLang } from "../i18n";

export function Nav(): HTMLElement {
  const profile = getProfile();
  const other = getLang() === "ru" ? "en" : "ru";

  const langBtn = el(
    "button",
    { class: "nav__lang", type: "button", "aria-label": t("nav.lang_aria") },
    [other.toUpperCase()]
  );
  langBtn.addEventListener("click", () => {
    setLang(other);
    window.dispatchEvent(new CustomEvent("langchange"));
  });

  return el("header", { class: "nav" }, [
    el("div", { class: "nav__inner container" }, [
      el("a", { class: "nav__brand", href: "#top" }, [
        el("span", { class: "nav__brand-mark" }, ["{ }"]),
        el("span", {}, [profile.name]),
      ]),
      el("nav", { class: "nav__links", "aria-label": "Navigation" }, [
        el("a", { href: "#about" }, [t("nav.about")]),
        el("a", { href: "#work" }, [t("nav.work")]),
        el("a", { href: "#cases" }, [t("nav.cases")]),
        el("a", { href: "#assistant" }, [t("nav.assistant")]),
        el("a", { class: "nav__cta", href: "#contact" }, [t("nav.contact")]),
        langBtn,
      ]),
    ]),
  ]);
}
