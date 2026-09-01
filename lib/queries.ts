import { createClient } from "@/lib/supabase/server";
import type { Donation, Event, GalleryPhoto, Leader, Post, Profile, Program } from "@/lib/types";
import { relativeTime } from "@/lib/format";

export async function getPrograms(): Promise<Program[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("programs").select("*").order("created_at", { ascending: true });
  return data ?? [];
}

export async function getActivePrograms(): Promise<Program[]> {
  const programs = await getPrograms();
  return programs.filter((p) => p.status === "Active");
}

export async function getEvents(): Promise<Event[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("events").select("*").order("event_date", { ascending: true });
  return data ?? [];
}

export async function getNextEvent(): Promise<Event | null> {
  const events = await getEvents();
  return events.find((e) => e.status === "Active") ?? events[0] ?? null;
}

export async function getPublishedPosts(type: "blog" | "story"): Promise<Post[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("type", type)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return data ?? [];
}

export async function getLeaders(): Promise<Leader[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("leaders").select("*").order("sort_order", { ascending: true });
  return data ?? [];
}

export type GalleryGroup = {
  location: string;
  region: string;
  caption: string;
  photoCount: number;
};

export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_photos")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getGalleryGroups(): Promise<GalleryGroup[]> {
  const photos = await getGalleryPhotos();
  const byLocation = new Map<string, GalleryGroup>();
  for (const photo of photos) {
    const existing = byLocation.get(photo.location);
    if (existing) {
      existing.photoCount += 1;
    } else {
      byLocation.set(photo.location, {
        location: photo.location,
        region: photo.region,
        caption: photo.caption,
        photoCount: 1,
      });
    }
  }
  return Array.from(byLocation.values());
}

// ── admin-only queries ──────────────────────────────────────────────────

export async function getAllPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function getDonations(): Promise<Donation[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("donations").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function getProfiles(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: true });
  return data ?? [];
}

export type MonthlyDonationTotal = { label: string; cents: number };

export async function getDonationsByMonth(months = 8, locale = "en-US"): Promise<MonthlyDonationTotal[]> {
  const donations = await getDonations();
  const now = new Date();
  const buckets: MonthlyDonationTotal[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ label: d.toLocaleDateString(locale, { month: "short" }), cents: 0 });
  }
  for (const donation of donations) {
    const createdAt = new Date(donation.created_at);
    const monthsAgo =
      (now.getFullYear() - createdAt.getFullYear()) * 12 + (now.getMonth() - createdAt.getMonth());
    const index = months - 1 - monthsAgo;
    if (index >= 0 && index < buckets.length) {
      buckets[index].cents += donation.amount_cents;
    }
  }
  return buckets;
}

export async function getDonationsThisMonthCents(): Promise<number> {
  const donations = await getDonations();
  const now = new Date();
  return donations
    .filter((d) => {
      const createdAt = new Date(d.created_at);
      return createdAt.getFullYear() === now.getFullYear() && createdAt.getMonth() === now.getMonth();
    })
    .reduce((sum, d) => sum + d.amount_cents, 0);
}

export type ActivityItem =
  | { kind: "donation"; amountCents: number; donorName: string; at: string }
  | { kind: "postPublished"; title: string; at: string }
  | { kind: "postDrafted"; title: string; at: string }
  | { kind: "galleryAdded"; location: string; at: string };

export async function getRecentActivity(locale = "en-US"): Promise<(ActivityItem & { time: string })[]> {
  const supabase = await createClient();
  const [donationsRes, postsRes, galleryRes] = await Promise.all([
    supabase
      .from("donations")
      .select("donor_name, amount_cents, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("posts")
      .select("title, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("gallery_photos")
      .select("location, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const items: ActivityItem[] = [];
  for (const d of donationsRes.data ?? []) {
    items.push({ kind: "donation", amountCents: d.amount_cents, donorName: d.donor_name, at: d.created_at });
  }
  for (const p of postsRes.data ?? []) {
    items.push({
      kind: p.status === "published" ? "postPublished" : "postDrafted",
      title: p.title,
      at: p.created_at,
    });
  }
  for (const g of galleryRes.data ?? []) {
    items.push({ kind: "galleryAdded", location: g.location, at: g.created_at });
  }

  items.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  return items.slice(0, 5).map((i) => ({ ...i, time: relativeTime(i.at, locale) }));
}
