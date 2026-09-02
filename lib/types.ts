export type ProgramCategory = "flagship" | "continuous" | "jornada" | "relief";
export type ProgramStatus = "Active" | "Planned" | "Completed";
export type DonationKind = "one_time" | "monthly" | "sponsorship";
export type PostType = "blog" | "story";
export type PostStatus = "draft" | "published";
export type ProfileRole = "admin" | "editor" | "viewer";

export type Program = {
  id: string;
  name: string;
  category: ProgramCategory;
  type: string;
  region: string;
  participants: number;
  status: ProgramStatus;
  summary: string;
  photo_path: string | null;
  program_date: string | null;
  website_url: string | null;
  created_at: string;
};

export type Event = {
  id: string;
  name: string;
  event_date: string;
  location: string;
  description: string;
  goal_cents: number;
  raised_cents: number;
  status: ProgramStatus;
  cta_label: string;
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
  type: PostType;
  author: string;
  tag: string;
  body: string;
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
  program_id: string | null;
  created_at: string;
};

export type Leader = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo_path: string | null;
  sort_order: number;
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
  impact_value: string;
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
};
