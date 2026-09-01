export function formatCents(cents: number, locale = "en-US"): string {
  return (cents / 100).toLocaleString(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function formatEventDateLong(isoDate: string, locale = "en-US"): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString(locale, { month: "long", day: "numeric", year: "numeric" }).toUpperCase();
}

export function formatEventMonth(isoDate: string, locale = "en-US"): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString(locale, { month: "short" }).toUpperCase();
}

export function formatEventDay(isoDate: string, locale = "en-US"): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString(locale, { day: "2-digit" });
}

export function relativeTime(iso: string, locale = "en-US"): string {
  const diffMs = new Date(iso).getTime() - Date.now();
  const minutes = Math.round(diffMs / 60000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  const days = Math.round(hours / 24);
  return rtf.format(days, "day");
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[parts.length - 1][0] ?? "")).toUpperCase();
}

export function formatPostDate(iso: string | null, locale = "en-US"): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(locale, { month: "short", year: "numeric" });
}

export function toIntlLocale(locale: string): string {
  return locale === "es" ? "es-ES" : "en-US";
}
