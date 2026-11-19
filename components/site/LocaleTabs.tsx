"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Lang = "en" | "es";

const LANGS: { id: Lang; label: string }[] = [
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
];

// Language tabs for the content editors. BOTH panels stay mounted (the inactive
// one is just `hidden`), so every field of both languages is always part of the
// form submission. Inputs marked `data-primary` (title / name) drive the
// "missing" badge on each tab, so an editor can see at a glance which language
// still needs writing. Standard tabs pattern: arrow keys move between tabs.
export function LocaleTabs({
  panels,
  missingLabel,
  hint,
}: {
  panels: Record<Lang, React.ReactNode>;
  missingLabel: string;
  hint?: string;
}) {
  const [active, setActive] = useState<Lang>("en");
  const [filled, setFilled] = useState<Record<Lang, boolean>>({ en: true, es: true });
  const rootRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => {
      const next = { en: true, es: true };
      for (const { id } of LANGS) {
        const primary = root.querySelector<HTMLInputElement>(`[data-lang-panel="${id}"] [data-primary]`);
        next[id] = primary ? primary.value.trim().length > 0 : true;
      }
      setFilled(next);
    };
    measure();
    root.addEventListener("input", measure);
    return () => root.removeEventListener("input", measure);
  }, []);

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const next =
      e.key === "Home" ? 0 : e.key === "End" ? LANGS.length - 1 : (index + (e.key === "ArrowRight" ? 1 : -1) + LANGS.length) % LANGS.length;
    setActive(LANGS[next].id);
    rootRef.current?.querySelector<HTMLButtonElement>(`#${CSS.escape(`${baseId}-tab-${LANGS[next].id}`)}`)?.focus();
  }

  return (
    <div ref={rootRef} className="rounded-lg border border-border bg-surface-soft">
      <div role="tablist" aria-label="Language" className="flex gap-1 border-b border-border px-2 pt-2">
        {LANGS.map(({ id, label }, i) => {
          const selected = active === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "-mb-px flex min-h-11 cursor-pointer items-center gap-2 rounded-t-md border border-b-0 px-4 text-[15px] font-bold",
                selected
                  ? "border-border bg-surface text-ink"
                  : "border-transparent text-muted-2 hover:bg-surface-soft-2",
              )}
            >
              {label}
              {!filled[id] ? (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[12px] font-bold text-amber-900">
                  {missingLabel}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      {hint ? <p className="px-4 pt-3 text-[13px] text-label">{hint}</p> : null}
      {LANGS.map(({ id }) => (
        <div
          key={id}
          role="tabpanel"
          id={`${baseId}-panel-${id}`}
          aria-labelledby={`${baseId}-tab-${id}`}
          data-lang-panel={id}
          lang={id}
          hidden={active !== id}
          className="flex flex-col gap-4 p-4"
        >
          {panels[id]}
        </div>
      ))}
    </div>
  );
}
