"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type DropdownItem = { href: string; label: string; description?: string };

// Disclosure-style menu (button + list of links), not an ARIA "menu": these are
// navigation links, so Tab moves through them naturally. Adds what a plain
// click-menu lacks: aria-expanded/controls, Escape to close (focus returns to
// the button), aria-current on the active page, and hover-to-open for mouse
// users only (touch and keyboard keep click/Enter behaviour).
export function NavDropdown({ label, items }: { label: string; items: DropdownItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const openedByHover = useRef(false);
  const panelId = useId();

  // The most specific matching item wins, so /about/team doesn't also light up "Our story" (/about).
  const activeHref = items
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        clearTimeout(closeTimer.current);
        if (!open) {
          openedByHover.current = true;
          setOpen(true);
        }
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        closeTimer.current = setTimeout(() => setOpen(false), 160);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          // A click right after hover-open pins the menu instead of closing it.
          if (openedByHover.current) {
            openedByHover.current = false;
            return;
          }
          setOpen((o) => !o);
        }}
        className={cn(
          "flex cursor-pointer items-center gap-1 text-sm font-semibold",
          activeHref ? "text-accent-deep" : "text-ink-soft hover:text-accent-deep",
        )}
      >
        {label}
        <ChevronDown aria-hidden className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open ? (
        // pt-3 (not a margin) keeps the hover path from button to panel unbroken.
        <div className="dropdown-panel absolute left-0 top-full z-50 pt-3">
          <ul
            id={panelId}
            className="w-[290px] rounded-xl border border-border bg-surface p-2 shadow-[0_18px_40px_rgba(3,48,124,0.16)]"
          >
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={item.href === activeHref ? "page" : undefined}
                  onClick={() => {
                    openedByHover.current = false;
                    setOpen(false);
                  }}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 hover:bg-surface-soft-2",
                    item.href === activeHref && "bg-surface-soft-2",
                  )}
                >
                  <span className="block text-sm font-bold text-ink">{item.label}</span>
                  {item.description ? (
                    <span className="mt-0.5 block text-xs font-medium leading-snug text-muted-2">{item.description}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
