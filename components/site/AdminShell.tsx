"use client";

import { Menu, X } from "lucide-react";
import { createContext, useContext, useEffect, useId, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type Drawer = { open: boolean; setOpen: (open: boolean) => void; panelId: string };
const DrawerContext = createContext<Drawer | null>(null);

// From the lg breakpoint up the sidebar is a normal grid column. Below it, the
// sidebar becomes an off-canvas drawer opened by <AdminMenuButton /> in the top
// bar: it closes on navigation, Escape, or a tap on the backdrop.
export function AdminShell({
  sidebar,
  closeLabel,
  children,
}: {
  sidebar: React.ReactNode;
  closeLabel: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    // Keep the page behind the drawer from scrolling while it is open.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <DrawerContext.Provider value={{ open, setOpen, panelId }}>
      <div className="min-h-screen font-sans text-ink lg:grid lg:grid-cols-[240px_1fr]">
        {open ? (
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            className="modal-backdrop fixed inset-0 z-40 bg-ink-dark/60 backdrop-blur-sm lg:hidden"
          />
        ) : null}
        <aside
          id={panelId}
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-[272px] max-w-[85vw] flex-col gap-1 overflow-y-auto bg-ink-dark p-[18px] text-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "lg:static lg:w-auto lg:max-w-none lg:translate-x-0 lg:overflow-visible lg:transition-none",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={closeLabel}
            className="absolute right-2 top-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-md text-sidebar-inactive hover:text-white lg:hidden"
          >
            <X aria-hidden className="h-5 w-5" />
          </button>
          {sidebar}
        </aside>
        <div className="flex min-w-0 flex-col">{children}</div>
      </div>
    </DrawerContext.Provider>
  );
}

export function AdminMenuButton({ label }: { label: string }) {
  const drawer = useContext(DrawerContext);
  if (!drawer) return null;
  return (
    <button
      type="button"
      onClick={() => drawer.setOpen(!drawer.open)}
      aria-label={label}
      aria-expanded={drawer.open}
      aria-controls={drawer.panelId}
      className="-ml-2 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-md text-ink hover:bg-surface-soft lg:hidden"
    >
      <Menu aria-hidden className="h-5 w-5" />
    </button>
  );
}
