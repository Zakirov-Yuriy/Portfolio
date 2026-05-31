// Маленький хелпер для создания элементов без фреймворка.
type Attrs = Record<string, string | boolean | undefined>;

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  children: (Node | string)[] = []
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === false) continue;
    if (key === "class") node.className = String(value);
    else if (key === "html") node.innerHTML = String(value);
    else if (value === true) node.setAttribute(key, "");
    else node.setAttribute(key, String(value));
  }
  for (const child of children) {
    node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

export function qs<T extends Element = Element>(selector: string, root: ParentNode = document): T {
  const found = root.querySelector<T>(selector);
  if (!found) throw new Error(`Элемент не найден: ${selector}`);
  return found;
}

// Inline-SVG иконки (stroke наследует currentColor).
const ICONS: Record<string, string> = {
  target:
    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  sparkles:
    '<path d="M12 3l1.8 4.8L18.6 9.6 13.8 11.4 12 16.2 10.2 11.4 5.4 9.6 10.2 7.8z"/><path d="M18 14l.9 2.4L21.3 17.4 18.9 18.3 18 20.7 17.1 18.3 14.7 17.4 17.1 16.4z"/>',
  shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
  phone:
    '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  telegram: '<path d="M21 5L3 12l5 2 2 5 3-3 4 3 4-14z"/><path d="M8 14l9-7-6 9"/>',
  github:
    '<path d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.3 4.3 0 00-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 00-6 0C6.3 3.3 5.3 3.6 5.3 3.6a4.3 4.3 0 00-.1 3.2A4.6 4.6 0 003.9 10c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
  robot:
    '<rect x="4" y="8" width="16" height="11" rx="2"/><path d="M12 8V5M9 13h.01M15 13h.01M9 16h6"/><circle cx="12" cy="4" r="1"/>',
  send: '<path d="M4 12l16-7-7 16-2-7z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  external:
    '<path d="M14 5h5v5"/><path d="M19 5l-7 7"/><path d="M19 13v4a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4"/>',
};

export function icon(name: string, size = 20): string {
  const path = ICONS[name] ?? "";
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}
