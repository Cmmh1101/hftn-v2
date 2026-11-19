// What every server action returns, so the UI can tell the user what happened
// (a toast) instead of failing silently. Kept free of server-only imports so
// client components can import the type.
export type ActionResult =
  | { ok: true; message?: string; redirectTo?: string }
  | { ok: false; error: string };

export const success = (message?: string, redirectTo?: string): ActionResult => ({ ok: true, message, redirectTo });
export const failure = (error: string): ActionResult => ({ ok: false, error });

type Translate = (key: string) => string;

// Postgres "insufficient_privilege" is what Row Level Security answers with when
// a viewer tries to change something.
export function describeDbError(error: { code?: string } | null | undefined, t: Translate, fallbackKey: string): string {
  return error?.code === "42501" ? t("noPermission") : t(fallbackKey);
}
