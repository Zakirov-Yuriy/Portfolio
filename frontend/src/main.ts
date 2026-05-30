import "./styles/main.scss";
import { qs } from "./utils/dom";
import { Nav } from "./components/nav";
import { Hero } from "./components/hero";
import { Stack } from "./components/stack";
import { Approach } from "./components/approach";
import { Cases } from "./components/cases";
import { AiChat } from "./components/aiChat";
import { ContactForm } from "./components/contactForm";
import { Footer } from "./components/footer";

const app = qs("#app");

const main = document.createElement("main");
main.append(Hero(), Stack(), Approach(), Cases(), AiChat(), ContactForm());

app.append(Nav(), main, Footer());

// Появление секций при скролле.
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".section").forEach((node) => observer.observe(node));

// Hero раскрываем сразу после загрузки.
requestAnimationFrame(() => {
  document.querySelectorAll(".hero .reveal").forEach((node) => node.classList.add("is-visible"));
});
