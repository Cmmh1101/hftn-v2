import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getClientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";
}

/**
 * Sliding-window rate limit backed by our own Supabase project rather than
 * a separate service like Upstash. Returns true if the action is allowed.
 * Opportunistically prunes hits older than a day so the table doesn't grow
 * unbounded — no separate cron job needed at this volume.
 */
export async function checkRateLimit(bucket: string, limit: number, windowMinutes: number): Promise<boolean> {
  const supabase = createAdminClient();
  const since = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

  const { count } = await supabase
    .from("rate_limit_hits")
    .select("*", { count: "exact", head: true })
    .eq("bucket", bucket)
    .gte("created_at", since);

  if ((count ?? 0) >= limit) return false;

  await supabase.from("rate_limit_hits").insert({ bucket });

  // Prune occasionally rather than on every call — no need for a separate
  // cron job at this volume, but no reason to pay the cost every time either.
  if (Math.random() < 0.05) {
    await supabase.from("rate_limit_hits").delete().lt("created_at", new Date(Date.now() - 86400000).toISOString());
  }

  return true;
}
