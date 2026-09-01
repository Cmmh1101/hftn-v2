import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { NavLink } from "@/components/ui/NavLink";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";

export function Header() {
  const t = useTranslations("nav");

  const NAV_ITEMS = [
    { href: "/", label: t("home") },
    { href: "/programs", label: t("programs") },
    { href: "/impact", label: t("impact") },
    { href: "/events", label: t("events") },
    { href: "/stories", label: t("stories") },
    { href: "/gallery", label: t("gallery") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-6 px-8 py-4">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-serif text-[22px] font-bold tracking-wide text-ink">
            Hope <span className="text-accent">For The Nations</span>
          </span>
          <span className="mt-1 text-[10px] tracking-[2.5px] text-label uppercase">{t("tagline")}</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-5">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          <Button href="/donate" variant="accent">
            {t("donate")}
          </Button>
        </div>
      </div>
    </header>
  );
}
