import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Runs the Supabase auth check for /admin routes, layering cookies onto the
 * response next-intl's middleware already produced (so the locale cookie and
 * the Supabase session cookies both land on the same response).
 */
export async function updateSession(
  request: NextRequest,
  response: NextResponse,
  locale: string,
  pathWithoutLocale: string,
) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginRoute = pathWithoutLocale === "/admin/login";
  // Reachable without being signed in: asking for a reset link, and the page
  // the reset/invitation email lands on (which signs the person in itself).
  const isPublicAuthRoute =
    pathWithoutLocale === "/admin/forgot-password" || pathWithoutLocale === "/admin/reset-password";

  if (isPublicAuthRoute) return response;

  if (!isLoginRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/admin/login`;
    return NextResponse.redirect(url);
  }

  if (isLoginRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/admin`;
    return NextResponse.redirect(url);
  }

  return response;
}
