import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { NavLink } from "@/components/ui/NavLink";
import { NavDropdown } from "@/components/ui/NavDropdown";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { MobileNav } from "@/components/site/MobileNav";

export function Header() {
  const t = useTranslations("nav");

  // Every important page is one click away: no destination hides behind a
  // vaguely-named menu. Only "About" is grouped, and its entries carry
  // descriptions so the contents are visible without guessing.
  const MAIN_NAV = [
    { href: "/programs", label: t("programs") },
    { href: "/jornadas", label: t("jornadas") },
    { href: "/impact", label: t("impact") },
    { href: "/stories", label: t("storiesBlog") },
    { href: "/gallery", label: t("gallery") },
    { href: "/events", label: t("events") },
  ];
  const ABOUT_MENU = [
    { href: "/about", label: t("aboutOurStory"), description: t("aboutOurStoryDesc") },
    { href: "/about/team", label: t("team"), description: t("teamDesc") },
    { href: "/contact", label: t("contact"), description: t("contactDesc") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-sm">
      <div className="relative flex w-full items-center justify-between gap-6 px-5 py-4 sm:px-8 min-[1440px]:px-12">
        <Link href="/" className="flex items-center gap-3 leading-none">
          <Image src="/brand/logo.png" alt="" width={212} height={180} priority className="h-12 w-auto" />
          {/* Under 540px and between 1280-1439px the badge (which already reads "Hope For The Nations") stands alone;
              the text stays in the DOM, visually hidden, so the link keeps its accessible name. */}
          <span className="flex flex-col whitespace-nowrap max-[540px]:sr-only xl:max-[1439px]:sr-only">
            <span className="font-serif text-[22px] font-bold tracking-wide text-ink">
              Hope <span className="text-accent">For The Nations</span>
            </span>
            <span className="mt-1 text-xs tracking-[2.5px] text-label uppercase">{t("tagline")}</span>
          </span>
        </Link>
        <nav aria-label={t("mainNavLabel")} className="hidden items-center gap-6 xl:flex">
          {MAIN_NAV.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
          <NavDropdown label={t("aboutGroup")} items={ABOUT_MENU} />
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden xl:block">
            <LocaleSwitcher />
          </div>
          <Button href="/donate" variant="accent">
            {t("donate")}
          </Button>
          <MobileNav
            menuLabel={t("menu")}
            sections={[
              { items: [{ href: "/", label: t("home") }, ...MAIN_NAV] },
              { title: t("aboutGroup"), items: ABOUT_MENU },
            ]}
          />
        </div>
      </div>
    </header>
  );
}
