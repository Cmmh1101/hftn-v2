import { useTranslations } from "next-intl";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { SOCIALS, type SocialId } from "@/lib/socials";
import { cn } from "@/lib/cn";

// Brand colour sits on the icon tile only; the label stays brand navy so text
// contrast never depends on a third-party colour. Every tile colour (including
// each stop of the Instagram gradient, whose orange is deepened from the
// official one) keeps the white glyph at 3:1 or better.
const TILE: Record<SocialId, string> = {
  facebook: "bg-[#1877F2]",
  instagram: "bg-[linear-gradient(45deg,#d4561a_0%,#dc2743_45%,#cc2366_75%,#bc1888_100%)]",
  youtube: "bg-[#E00000]",
};

// Accessibility notes:
// - a real <ul>/<li> (role="list" restores list semantics in Safari/VoiceOver,
//   which drops them when list-style is removed), named by the section heading
// - each link keeps a visible text label, so its accessible name matches what
//   is on screen; the icon is decorative (aria-hidden)
// - links open a new tab, which is announced via visually-hidden text
// - 48px min height for comfortable touch targets, focus ring from the global
//   :focus-visible rule
export function SocialButtons({ labelledBy }: { labelledBy: string }) {
  const t = useTranslations("a11y");

  return (
    <ul role="list" aria-labelledby={labelledBy} className="flex flex-wrap content-start gap-3.5">
      {SOCIALS.map((s) => (
        <li key={s.id}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-12 items-center gap-3 rounded-xl border border-border bg-surface py-2 pl-2.5 pr-5 text-[15px] font-bold text-ink shadow-[0_1px_2px_rgba(3,48,124,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue hover:shadow-[0_8px_20px_rgba(3,48,124,0.14)]"
          >
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:scale-110",
                TILE[s.id],
              )}
            >
              <SocialIcon id={s.id} className="h-4 w-4" />
            </span>
            {s.label}
            <span className="sr-only"> {t("opensInNewTab")}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
