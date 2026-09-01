"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-semibold",
        isActive ? "text-accent-deep" : "text-ink-soft hover:text-accent-deep",
      )}
    >
      {children}
    </Link>
  );
}
