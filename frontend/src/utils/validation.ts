export interface ContactValues {
  name: string;
  phone: string;
  email: string;
  comment: string;
}

export type FieldErrors = Partial<Record<keyof ContactValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Допускаем +, пробелы, скобки, дефисы; считаем только цифры.
const PHONE_DIGITS_RE = /\d/g;

export function validateContact(values: ContactValues): FieldErrors {
  const errors: FieldErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Укажите имя (минимум 2 символа)";
  }

  const digits = values.phone.match(PHONE_DIGITS_RE)?.length ?? 0;
  if (digits < 10) {
    errors.phone = "Введите корректный телефон";
  }

  if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = "Введите корректный email";
  }

  if (values.comment.trim().length < 5) {
    errors.comment = "Напишите чуть подробнее (минимум 5 символов)";
  }

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
