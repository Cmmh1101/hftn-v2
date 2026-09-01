"use client";

import { useState } from "react";
import { NavLink } from "@/components/ui/NavLink";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { cn } from "@/lib/cn";

export function MobileNav({ navItems }: { navItems: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 shrink-0 flex-col items-center justify-center gap-[5px]"
      >
        <span
          className={cn(
            "h-0.5 w-5 bg-ink transition-transform",
            open && "translate-y-[7px] rotate-45",
          )}
        />
        <span className={cn("h-0.5 w-5 bg-ink transition-opacity", open && "opacity-0")} />
        <span
          className={cn(
            "h-0.5 w-5 bg-ink transition-transform",
            open && "-translate-y-[7px] -rotate-45",
          )}
        />
      </button>

      {open ? (
        <div className="absolute inset-x-0 top-full border-b border-border bg-bg px-8 py-6 shadow-lg">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} onClick={close} className="text-base">
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-6 border-t border-border pt-5">
            <LocaleSwitcher />
          </div>
        </div>
      ) : null}
    </div>
  );
}
