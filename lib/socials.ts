export const SOCIALS = [
  { id: "facebook", href: "https://www.facebook.com/hopeforthenations7", label: "Facebook" },
  { id: "instagram", href: "https://www.instagram.com/hopeforthenations7/", label: "Instagram" },
  { id: "youtube", href: "https://www.youtube.com/channel/UCknlRAt1zFByIgx-5MaRrLA", label: "YouTube" },
] as const;

export type SocialId = (typeof SOCIALS)[number]["id"];
