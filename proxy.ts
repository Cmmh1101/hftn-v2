import { type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/session";

const handleI18nRouting = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);

  // next-intl already issued a redirect (e.g. adding the locale prefix) —
  // let it through as-is, the follow-up request gets checked again.
  if (response.headers.get("location")) {
    return response;
  }

  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const locale = (routing.locales as readonly string[]).includes(segments[0])
    ? segments[0]
    : routing.defaultLocale;
  const pathWithoutLocale = "/" + segments.slice(1).join("/");

  if (pathWithoutLocale.startsWith("/admin")) {
    return updateSession(request, response, locale, pathWithoutLocale);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
