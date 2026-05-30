import { el, icon } from "../utils/dom";
import { profile } from "../data/profile";

export function Footer(): HTMLElement {
  const links = profile.contacts.map((c) =>
    el("a", { class: "footer__link", href: c.href, target: c.href.startsWith("http") ? "_blank" : undefined, rel: "noopener" }, [
      el("span", { class: "footer__icon", html: icon(c.icon, 18) }),
      el("span", { class: "footer__value" }, [c.value]),
    ])
  );

  return el("footer", { class: "footer" }, [
    el("div", { class: "footer__inner container" }, [
      el("div", { class: "footer__links" }, links),
      el("p", { class: "footer__note" }, [
        `© ${new Date().getFullYear()} ${profile.name}. Собрано на Vite + TypeScript + SCSS и FastAPI.`,
      ]),
    ]),
  ]);
}
