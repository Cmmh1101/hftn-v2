import { getTranslations, getLocale } from "next-intl/server";
import { Input } from "@/components/ui/Field";
import { SidebarItem } from "@/components/ui/SidebarItem";
import { Avatar } from "@/components/ui/Avatar";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { createClient } from "@/lib/supabase/server";
import { initials, toIntlLocale } from "@/lib/format";
import { signOut } from "../actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [t, tRoles, locale] = await Promise.all([
    getTranslations("admin.nav"),
    getTranslations("admin.roles"),
    getLocale(),
  ]);
  const tTopbar = await getTranslations("admin.topbar");

  const NAV_ITEMS = [
    { href: "/admin", label: t("overview") },
    { href: "/admin/programs", label: t("programs") },
    { href: "/admin/events", label: t("events") },
    { href: "/admin/donations", label: t("donations") },
    { href: "/admin/impact-milestones", label: t("milestones") },
    { href: "/admin/content", label: t("content") },
    { href: "/admin/gallery", label: t("gallery") },
    { href: "/admin/leadership", label: t("leadership") },
    { href: "/admin/subscribers", label: t("subscribers") },
    { href: "/admin/users", label: t("users") },
    { href: "/admin/settings", label: t("settings") },
  ];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let name = "";
  let role = "";
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("name, role").eq("id", user.id).single();
    name = profile?.name || user.email || "";
    role = profile?.role ?? "viewer";
  }

  return (
    <div className="grid min-h-screen grid-cols-[240px_1fr] font-sans text-ink">
      <aside className="flex flex-col gap-1 bg-ink-dark p-[18px] text-white">
        <div className="px-2.5 pb-6 pt-1.5">
          <div className="font-serif text-lg font-bold">
            Hope <span className="text-accent-strong">Admin</span>
          </div>
          <div className="mt-1 text-[10px] tracking-[2px] text-sidebar-inactive">FOR THE NATIONS</div>
        </div>
        {NAV_ITEMS.map((item) => (
          <SidebarItem key={item.href} href={item.href}>
            {item.label}
          </SidebarItem>
        ))}
        <div className="mt-auto flex items-center gap-2.5 border-t border-white/10 pt-3.5">
          <Avatar initials={initials(name || "?")} />
          <div>
            <div className="text-[12.5px] font-bold">{name}</div>
            <div className="text-[10.5px] capitalize text-sidebar-inactive">{tRoles(role)}</div>
          </div>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="mt-1 w-full cursor-pointer py-1 text-left text-[11.5px] text-sidebar-inactive hover:text-white"
          >
            {t("signOut")}
          </button>
        </form>
      </aside>

      <div className="flex flex-col">
        <header className="flex items-center justify-between border-b border-border bg-surface px-8 py-4">
          <Input placeholder={tTopbar("search")} className="w-80" />
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            <span className="text-[12.5px] text-muted-2">
              {new Date().toLocaleDateString(toIntlLocale(locale), {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <div className="cursor-pointer rounded-md bg-accent px-4 py-2.5 text-[12.5px] font-bold text-white">
              {tTopbar("newButton")}
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
