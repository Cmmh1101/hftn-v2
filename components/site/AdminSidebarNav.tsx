"use client";

import { useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { SidebarItem } from "@/components/ui/SidebarItem";
import { cn } from "@/lib/cn";

type NavItem = { href: string; label: string };
type NavGroup = { label: string; items: NavItem[] };

export function AdminSidebarNav({ overview, groups }: { overview: NavItem; groups: NavGroup[] }) {
  const pathname = usePathname();
  const [manuallyToggled, setManuallyToggled] = useState<Record<string, boolean>>({});

  return (
    <>
      <SidebarItem href={overview.href}>{overview.label}</SidebarItem>
      {groups.map((group) => {
        const hasActiveItem = group.items.some((item) => pathname.startsWith(item.href));
        // A group containing the current page always stays open, even if the
        // admin previously collapsed it — navigation should never get hidden.
        const expanded = hasActiveItem || (manuallyToggled[group.label] ?? true);

        return (
          <div key={group.label} className="mt-2.5">
            <button
              type="button"
              onClick={() => setManuallyToggled((prev) => ({ ...prev, [group.label]: !expanded }))}
              className="flex w-full cursor-pointer items-center justify-between px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wide text-sidebar-inactive hover:text-white"
            >
              {group.label}
              <span className={cn("text-[9px] transition-transform", !expanded && "-rotate-90")}>▾</span>
            </button>
            {expanded ? (
              <div className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <SidebarItem key={item.href} href={item.href}>
                    {item.label}
                  </SidebarItem>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
}
