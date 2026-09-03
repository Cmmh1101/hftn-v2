import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { NavLink } from "@/components/ui/NavLink";
import { NavDropdown } from "@/components/ui/NavDropdown";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { MobileNav } from "@/components/site/MobileNav";

export function Header() {
  const t = useTranslations("nav");

  const MAIN_NAV = [
    { href: "/", label: t("home") },
    { href: "/programs", label: t("programs") },
    { href: "/impact", label: t("impact") },
  ];
  const GET_INVOLVED = [
    { href: "/events", label: t("events") },
    { href: "/gallery", label: t("gallery") },
    { href: "/stories", label: t("stories") },
  ];
  const ABOUT_GROUP = [
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];
  // Mobile has room for a flat list — no need to nest dropdowns there.
  const ALL_NAV_ITEMS = [...MAIN_NAV, ...GET_INVOLVED, ...ABOUT_GROUP];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-sm">
      <div className="relative mx-auto flex max-w-[1240px] items-center justify-between gap-6 px-8 py-4">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-serif text-[22px] font-bold tracking-wide text-ink">
            Hope <span className="text-accent">For The Nations</span>
          </span>
          <span className="mt-1 text-[10px] tracking-[2.5px] text-label uppercase">{t("tagline")}</span>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {MAIN_NAV.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
          <NavDropdown label={t("getInvolved")} items={GET_INVOLVED} />
          <NavDropdown label={t("aboutGroup")} items={ABOUT_GROUP} />
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
            <LocaleSwitcher />
          </div>
          <Button href="/donate" variant="accent">
            {t("donate")}
          </Button>
          <MobileNav navItems={ALL_NAV_ITEMS} />
        </div>
      </div>
    </header>
  );
}
