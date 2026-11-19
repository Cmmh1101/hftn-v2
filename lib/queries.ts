import { createClient } from "@/lib/supabase/server";
import type {
  Donation,
  Event,
  GalleryPhoto,
  ImpactMilestone,
  Leader,
  Post,
  Profile,
  Program,
  SiteSettings,
  Subscriber,
} from "@/lib/types";
import { relativeTime } from "@/lib/format";
import { localizeRow, toContentLocale } from "@/lib/localize";

// Public pages pass the visitor's locale and get rows already in their language
// (falling back to the other one). Admin screens omit it and get both languages.
const PROGRAM_FIELDS = ["name", "summary"] as const;
const EVENT_FIELDS = ["name", "description", "cta_label"] as const;
const POST_FIELDS = ["title", "category", "tags", "body"] as const;
const LEADER_FIELDS = ["role", "bio"] as const;
const MILESTONE_FIELDS = ["area", "impact_value"] as const;

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  countries_served: "3",
  jornadas_completed: "312",
  scholarships_stat: "50+",
  families_reached: "4,500+",
  total_deployed: "$300K",
  annual_report_path: null,
  form_990_path: null,
  letter_501c3_path: null,
  hero_photo_path: null,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", true).single();
  return data ?? DEFAULT_SITE_SETTINGS;
}

export async function getPrograms(locale?: string): Promise<Program[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("programs").select("*").order("created_at", { ascending: true });
  const rows = data ?? [];
  return locale ? rows.map((r) => localizeRow(r, PROGRAM_FIELDS, toContentLocale(locale))) : rows;
}

export async function getActivePrograms(locale?: string): Promise<Program[]> {
  const programs = await getPrograms(locale);
  return programs.filter((p) => p.status === "Active");
}

export async function getEvents(locale?: string): Promise<Event[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("events").select("*").order("event_date", { ascending: true });
  const rows = data ?? [];
  return locale ? rows.map((r) => localizeRow(r, EVENT_FIELDS, toContentLocale(locale))) : rows;
}

export async function getNextEvent(locale?: string): Promise<Event | null> {
  const events = await getEvents(locale);
  return events.find((e) => e.status === "Active") ?? events[0] ?? null;
}

export async function getPublishedPosts(type: "blog" | "story", locale?: string): Promise<Post[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("type", type)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  const rows = data ?? [];
  return locale ? rows.map((r) => localizeRow(r, POST_FIELDS, toContentLocale(locale))) : rows;
}

export async function getPostBySlug(slug: string, locale?: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*").eq("slug", slug).eq("status", "published").single();
  if (!data) return null;
  return locale ? localizeRow(data, POST_FIELDS, toContentLocale(locale)) : data;
}

export async function getLeaders(locale?: string): Promise<Leader[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("leaders").select("*").order("sort_order", { ascending: true });
  const rows = data ?? [];
  return locale ? rows.map((r) => localizeRow(r, LEADER_FIELDS, toContentLocale(locale))) : rows;
}

export type GalleryGroup = {
  location: string;
  region: string;
  caption: string;
  photoCount: number;
  photos: GalleryPhoto[];
};

export async function getGalleryPhotos(locale?: string): Promise<GalleryPhoto[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_photos")
    .select("*")
    .order("created_at", { ascending: false });
  const rows = data ?? [];
  return locale ? rows.map((r) => localizeRow(r, ["caption"] as const, toContentLocale(locale))) : rows;
}

export async function getGalleryGroups(locale?: string): Promise<GalleryGroup[]> {
  const photos = await getGalleryPhotos(locale);
  const byLocation = new Map<string, GalleryGroup>();
  for (const photo of photos) {
    const existing = byLocation.get(photo.location);
    if (existing) {
      existing.photoCount += 1;
      existing.photos.push(photo);
    } else {
      byLocation.set(photo.location, {
        location: photo.location,
        region: photo.region,
        caption: photo.caption,
        photoCount: 1,
        photos: [photo],
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

export async function getSubscribers(): Promise<Subscriber[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("subscribers").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function getImpactMilestones(locale?: string): Promise<ImpactMilestone[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("impact_milestones")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("period", { ascending: true });
  const rows = data ?? [];
  return locale ? rows.map((r) => localizeRow(r, MILESTONE_FIELDS, toContentLocale(locale))) : rows;
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
      .select("title, title_es, status, created_at")
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
      title: p.title || p.title_es || "",
      at: p.created_at,
    });
  }
  for (const g of galleryRes.data ?? []) {
    items.push({ kind: "galleryAdded", location: g.location, at: g.created_at });
  }

  items.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  return items.slice(0, 5).map((i) => ({ ...i, time: relativeTime(i.at, locale) }));
}
