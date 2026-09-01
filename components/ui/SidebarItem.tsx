"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export function SidebarItem({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={cn(
        "rounded-md px-3 py-2.5 text-[13.5px] font-semibold",
        isActive ? "bg-accent-strong text-accent-ink" : "text-sidebar-inactive hover:bg-white/5",
      )}
    >
      {children}
    </Link>
  );
}
