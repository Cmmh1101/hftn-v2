import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { SOCIALS } from "@/lib/socials";

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 text-xs font-bold tracking-wide text-label">{title}</div>
      <div className="flex flex-col gap-2 text-[13.5px]">{children}</div>
    </div>
  );
}

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="border-t border-border bg-surface-soft-2">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-8 px-8 pb-7 pt-14 sm:grid-cols-5">
        <div className="sm:col-span-1">
          <div className="font-serif text-[19px] font-bold text-ink">Hope For The Nations</div>
          <p className="mt-2.5 max-w-[280px] text-[13.5px] leading-relaxed text-muted-2">{t("blurb")}</p>
        </div>
        <FooterColumn title={t("explore")}>
          <Link href="/programs">{nav("programs")}</Link>
          <Link href="/impact">{nav("impact")}</Link>
          <Link href="/events">{nav("events")}</Link>
          <Link href="/gallery">{nav("gallery")}</Link>
        </FooterColumn>
        <FooterColumn title={t("organization")}>
          <Link href="/about">{nav("about")}</Link>
          <Link href="/contact">{nav("contact")}</Link>
          <Link href="/impact">{t("form990")}</Link>
          <Link href="/impact">{t("the501c3")}</Link>
        </FooterColumn>
        <FooterColumn title={t("follow")}>
          {SOCIALS.map((s) => (
            <a key={s.href} href={s.href} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          ))}
        </FooterColumn>
        <FooterColumn title={t("newsletterTitle")}>
          <NewsletterForm />
        </FooterColumn>
      </div>
      <div className="mx-auto max-w-[1240px] border-t border-border px-8 py-5 text-[12.5px] text-label">
        {t("copyright", { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}
