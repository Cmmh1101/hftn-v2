"use client";

import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export function NavDropdown({ label, items }: { label: string; items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const hasActive = items.some((item) => pathname.startsWith(item.href));

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex cursor-pointer items-center gap-1 text-sm font-semibold",
          hasActive ? "text-accent-deep" : "text-ink-soft hover:text-accent-deep",
        )}
      >
        {label}
        <span className={cn("text-[9px] transition-transform", open && "rotate-180")}>▾</span>
      </button>
      {open ? (
        <div className="absolute left-0 top-full mt-3 min-w-[170px] rounded-md border border-border bg-surface py-1.5 shadow-lg">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-surface-soft-2 hover:text-accent-deep"
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
