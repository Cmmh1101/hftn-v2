// Bilingual content. A translatable field is stored as `field` (English) plus
// `field_es` (Spanish). The visitor sees their own language and falls back to
// the other one when a translation is missing, so content can be published in
// a single language and translated later without leaving a blank on the page.

export type ContentLocale = "en" | "es";

export function toContentLocale(locale: string): ContentLocale {
  return locale === "es" ? "es" : "en";
}

function isFilled(value: unknown): boolean {
  if (typeof value === "string") {
    // Rich-text editors leave "<p></p>" behind when a field is cleared.
    return value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length > 0 || /<img\b/i.test(value);
  }
  if (Array.isArray(value)) return value.length > 0;
  return value != null;
}

/** Value for `locale`, or the other language's value when it is empty. */
export function pick<T>(en: T, es: T | null | undefined, locale: ContentLocale): T {
  const [first, second] = locale === "es" ? [es, en] : [en, es];
  if (isFilled(first)) return first as T;
  if (isFilled(second)) return second as T;
  return (first ?? second ?? en) as T;
}

/** True when the requested language has no content of its own for this field. */
export function isFallback(en: unknown, es: unknown, locale: ContentLocale): boolean {
  const own = locale === "es" ? es : en;
  const other = locale === "es" ? en : es;
  return !isFilled(own) && isFilled(other);
}

export function hasText(value: unknown): boolean {
  return isFilled(value);
}

type Rec = Record<string, unknown>;

/**
 * Returns a copy of `row` where each listed field holds the visitor's language,
 * so existing pages keep reading `row.title` / `row.summary` unchanged.
 */
export function localizeRow<T extends Rec>(row: T, fields: readonly (keyof T & string)[], locale: ContentLocale): T {
  const copy: Rec = { ...row };
  for (const field of fields) {
    copy[field] = pick(row[field], row[`${field}_es`], locale);
  }
  return copy as T;
}
