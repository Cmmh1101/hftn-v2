import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Input } from "@/components/ui/Field";
import { AdminSidebarNav } from "@/components/site/AdminSidebarNav";
import { AdminMenuButton, AdminShell } from "@/components/site/AdminShell";
import { Avatar } from "@/components/ui/Avatar";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { createClient } from "@/lib/supabase/server";
import { initials, toIntlLocale } from "@/lib/format";
import { signOut } from "../actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [t, tGroups, tRoles, locale] = await Promise.all([
    getTranslations("admin.nav"),
    getTranslations("admin.navGroups"),
    getTranslations("admin.roles"),
    getLocale(),
  ]);
  const tTopbar = await getTranslations("admin.topbar");

  const OVERVIEW = { href: "/admin", label: t("overview") };
  const NAV_GROUPS = [
    {
      label: tGroups("content"),
      items: [
        { href: "/admin/programs", label: t("programs") },
        { href: "/admin/impact-milestones", label: t("milestones") },
        { href: "/admin/content", label: t("content") },
        { href: "/admin/gallery", label: t("gallery") },
        { href: "/admin/leadership", label: t("leadership") },
      ],
    },
    {
      label: tGroups("engagement"),
      items: [
        { href: "/admin/events", label: t("events") },
        { href: "/admin/donations", label: t("donations") },
        { href: "/admin/subscribers", label: t("subscribers") },
      ],
    },
    {
      label: tGroups("admin"),
      items: [
        { href: "/admin/users", label: t("users") },
        { href: "/admin/settings", label: t("settings") },
      ],
    },
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

  const sidebar = (
    <>
      <div className="px-2.5 pb-6 pt-1.5">
        <span className="mb-3 inline-flex rounded-xl bg-white p-1.5">
          <Image src="/brand/logo.png" alt="" width={212} height={180} className="h-10 w-auto" />
        </span>
        <div className="font-serif text-lg font-bold">
          Hope <span className="text-accent-strong">Admin</span>
        </div>
        <div className="mt-1 text-[10px] tracking-[2px] text-sidebar-inactive">FOR THE NATIONS</div>
      </div>
      <AdminSidebarNav overview={OVERVIEW} groups={NAV_GROUPS} />
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
          className="mt-1 w-full cursor-pointer py-2 text-left text-[11.5px] text-sidebar-inactive hover:text-white"
        >
          {t("signOut")}
        </button>
      </form>
    </>
  );

  return (
    <AdminShell sidebar={sidebar} closeLabel={tTopbar("closeMenu")}>
      <header className="flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3 sm:px-8 sm:py-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <AdminMenuButton label={tTopbar("openMenu")} />
          <Input placeholder={tTopbar("search")} className="w-full min-w-0 max-w-80" />
        </div>
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <LocaleSwitcher />
          <span className="hidden text-[12.5px] text-muted-2 md:inline">
            {new Date().toLocaleDateString(toIntlLocale(locale), {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <div className="hidden cursor-pointer rounded-md bg-accent px-4 py-2.5 text-[12.5px] font-bold text-white sm:block">
            {tTopbar("newButton")}
          </div>
        </div>
      </header>
      {children}
    </AdminShell>
  );
}
