export interface StackGroup {
  label: string;
  /** Категория для подсветки чипа: backend | frontend | ai | infra */
  kind: "backend" | "frontend" | "ai" | "infra";
  items: string[];
}

export interface ApproachCard {
  icon: string; // имя иконки (рисуем inline-SVG в компоненте)
  title: string;
  text: string;
}

export interface CaseLink {
  label: string;
  href: string;
  icon?: string; // имя иконки из набора в utils/dom.ts
}

export interface CaseItem {
  title: string;
  role: string;
  description: string;
  tags: string[];
  highlights: string[];
  links?: CaseLink[];
}

export interface ContactLink {
  label: string;
  value: string;
  href: string;
  icon: string;
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  summary: string;
  stack: StackGroup[];
  approach: ApproachCard[];
  cases: CaseItem[];
  contacts: ContactLink[];
}
