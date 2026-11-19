import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { SOCIALS } from "@/lib/socials";

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 text-xs font-bold tracking-wide text-label">{title}</div>
      <div className="flex flex-col text-[13.5px] sm:gap-2 max-sm:[&_a]:flex max-sm:[&_a]:min-h-11 max-sm:[&_a]:items-center">{children}</div>
    </div>
  );
}

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="border-t border-border bg-surface-soft-2">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-8 px-5 sm:px-8 pb-7 pt-10 sm:pt-14 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
        <div className="sm:col-span-2 md:col-span-4 lg:col-span-1">
          <div className="flex items-center gap-3">
            <Image src="/brand/logo.png" alt="" width={212} height={180} className="h-12 w-auto" />
            <div className="font-serif text-[19px] font-bold leading-tight text-ink">Hope For The Nations</div>
          </div>
          <p className="mt-2.5 max-w-[280px] text-[13.5px] leading-relaxed text-muted-2">{t("blurb")}</p>
        </div>
        <FooterColumn title={t("explore")}>
          <Link href="/programs">{nav("programs")}</Link>
          <Link href="/jornadas">{nav("jornadas")}</Link>
          <Link href="/stories">{nav("storiesBlog")}</Link>
          <Link href="/impact">{nav("impact")}</Link>
          <Link href="/events">{nav("events")}</Link>
          <Link href="/gallery">{nav("gallery")}</Link>
        </FooterColumn>
        <FooterColumn title={t("organization")}>
          <Link href="/about">{nav("aboutOurStory")}</Link>
          <Link href="/about/team">{nav("team")}</Link>
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
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-x-4 border-t border-border px-5 sm:px-8 py-5 text-[12.5px] text-label">
        <span>{t("copyright", { year: new Date().getFullYear() })}</span>
        <Link href="/admin/login" className="inline-flex min-h-11 items-center hover:text-muted-2">
          {t("adminLogin")}
        </Link>
      </div>
    </footer>
  );
}
