export type ProgramCategory = "flagship" | "continuous" | "jornada" | "relief";
export type ProgramStatus = "Active" | "Planned" | "Completed";
export type DonationKind = "one_time" | "monthly" | "sponsorship";
export type PostType = "blog" | "story";
export type PostStatus = "draft" | "published";
export type ProfileRole = "admin" | "editor" | "viewer";

export type Program = {
  id: string;
  name: string;
  name_es: string | null;
  category: ProgramCategory;
  type: string;
  region: string;
  participants: number;
  status: ProgramStatus;
  summary: string;
  summary_es: string | null;
  slug: string | null;
  description: string;
  description_es: string | null;
  video_url: string | null;
  photo_path: string | null;
  program_date: string | null;
  website_url: string | null;
  created_at: string;
};

export type ProgramPhoto = {
  id: string;
  program_id: string;
  storage_path: string;
  caption: string;
  caption_es: string | null;
  sort_order: number;
  created_at: string;
};

export type Sponsor = {
  id: string;
  name: string;
  logo_path: string | null;
  website_url: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
};

export type Event = {
  id: string;
  name: string;
  name_es: string | null;
  event_date: string;
  location: string;
  description: string;
  description_es: string | null;
  goal_cents: number;
  raised_cents: number;
  status: ProgramStatus;
  cta_label: string;
  cta_label_es: string | null;
  photo_path: string | null;
  created_at: string;
};

export type Donation = {
  id: string;
  donor_name: string;
  donor_email: string;
  amount_cents: number;
  kind: DonationKind;
  program_id: string | null;
  event_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
};

export type Post = {
  id: string;
  title: string;
  title_es: string | null;
  slug: string;
  type: PostType;
  author: string;
  category: string;
  category_es: string | null;
  tags: string[];
  tags_es: string[];
  body: string;
  body_es: string | null;
  status: PostStatus;
  published_at: string | null;
  photo_path: string | null;
  created_at: string;
};

export type GalleryPhoto = {
  id: string;
  location: string;
  region: string;
  storage_path: string | null;
  caption: string;
  caption_es: string | null;
  program_id: string | null;
  created_at: string;
};

export type Leader = {
  id: string;
  name: string;
  role: string;
  role_es: string | null;
  bio: string;
  bio_es: string | null;
  photo_path: string | null;
  sort_order: number;
  team: "leadership" | "outreach";
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  handled: boolean;
  created_at: string;
};

export type Profile = {
  id: string;
  name: string;
  role: ProfileRole;
  region: string;
  created_at: string;
};

export type ImpactMilestone = {
  id: string;
  period: string;
  area: string;
  area_es: string | null;
  impact_value: string;
  impact_value_es: string | null;
  is_goal: boolean;
  sort_order: number;
  created_at: string;
};

export type Subscriber = {
  id: string;
  email: string;
  name: string;
  source: string;
  resend_contact_id: string | null;
  unsubscribed_at: string | null;
  created_at: string;
};

export type SiteSettings = {
  countries_served: string;
  jornadas_completed: string;
  scholarships_stat: string;
  families_reached: string;
  total_deployed: string;
  annual_report_path: string | null;
  form_990_path: string | null;
  letter_501c3_path: string | null;
  hero_photo_path: string | null;
  home_video_url: string | null;
};

export type Verse = {
  id: string;
  reference: string;
  reference_es: string | null;
  text: string;
  text_es: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
};
