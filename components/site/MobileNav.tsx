"use client";

import { useEffect, useId, useRef, useState } from "react";
import { NavLink } from "@/components/ui/NavLink";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { cn } from "@/lib/cn";

type Section = { title?: string; items: { href: string; label: string }[] };

export function MobileNav({ sections, menuLabel }: { sections: Section[]; menuLabel: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-label={menuLabel}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 w-11 shrink-0 cursor-pointer flex-col items-center justify-center gap-[5px]"
      >
        <span className={cn("h-0.5 w-5 bg-ink transition-transform", open && "translate-y-[7px] rotate-45")} />
        <span className={cn("h-0.5 w-5 bg-ink transition-opacity", open && "opacity-0")} />
        <span className={cn("h-0.5 w-5 bg-ink transition-transform", open && "-translate-y-[7px] -rotate-45")} />
      </button>

      {open ? (
        <div
          id={panelId}
          className="dropdown-panel absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-border bg-bg px-8 pb-6 pt-3 shadow-lg"
        >
          <nav aria-label={menuLabel}>
            {sections.map((section, i) => (
              <div key={i} className={cn(i > 0 && "mt-3 border-t border-border pt-3")}>
                {section.title ? (
                  <div className="px-1 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[1.5px] text-label">
                    {section.title}
                  </div>
                ) : null}
                <ul>
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <NavLink href={item.href} onClick={close} className="block rounded-lg px-1 py-3 text-base">
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className="mt-3 border-t border-border pt-5">
            <LocaleSwitcher />
          </div>
        </div>
      ) : null}
    </div>
  );
}
