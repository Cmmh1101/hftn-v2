// Supabase pauses free-tier projects after ~1 week without activity, which
// takes every data-driven page of the site down (and DNS for the project
// stops resolving). This runs every 3 days and does one tiny real query so
// the project always counts as active. Uses only the public anon key and the
// publicly-readable site_settings table, so no secret is involved.
export const config = {
  schedule: "0 14 */3 * *",
};

export default async function handler() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("supabase-keepalive: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY not set");
  }

  const response = await fetch(`${url}/rest/v1/site_settings?select=id&limit=1`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
  });

  // A thrown error shows up as a failed run in Netlify's function logs, so a
  // paused or unreachable project is visible instead of failing silently.
  if (!response.ok) {
    throw new Error(`supabase-keepalive: Supabase responded ${response.status}`);
  }

  console.log(`supabase-keepalive: ok (${response.status}) at ${new Date().toISOString()}`);
  return new Response(JSON.stringify({ ok: true, status: response.status }), {
    headers: { "Content-Type": "application/json" },
  });
}
