import "./styles/main.scss";
import { qs } from "./utils/dom";
import { getLang } from "./i18n";
import { Nav } from "./components/nav";
import { Hero } from "./components/hero";
import { Stack } from "./components/stack";
import { Approach } from "./components/approach";
import { Cases } from "./components/cases";
import { AiChat } from "./components/aiChat";
import { ContactForm } from "./components/contactForm";
import { Footer } from "./components/footer";

const app = qs("#app");

// Появление секций при скролле — общий observer, пересоздаём при ре-рендере.
let observer: IntersectionObserver | null = null;

function initReveal(): void {
  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer?.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".section").forEach((node) => observer!.observe(node));

  // Hero раскрываем сразу после загрузки.
  requestAnimationFrame(() => {
    document.querySelectorAll(".hero .reveal").forEach((node) => node.classList.add("is-visible"));
  });
}

function render(): void {
  app.innerHTML = "";

  const main = document.createElement("main");
  main.append(Hero(), Stack(), Approach(), Cases(), AiChat(), ContactForm());
  app.append(Nav(), main, Footer());

  initReveal();
}

// Стартовая отрисовка + синхронизация атрибута языка у <html>.
document.documentElement.lang = getLang();
render();

// Перерисовываем всю страницу при смене языка.
window.addEventListener("langchange", render);
