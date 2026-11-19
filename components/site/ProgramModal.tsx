"use client";

import { ArrowRight, Images } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/cn";

export type ProgramCardData = {
  id: string;
  /** Present once the program has its own page. */
  slug: string | null;
  name: string;
  categoryLabel: string;
  typeLabel: string;
  regionLabel: string;
  participants: number;
  summary: string;
  photo_path: string | null;
  /** Extra photos (storage paths) shown in the modal's gallery. */
  photos: string[];
  websiteUrl: string | null;
};

function ProgramModal({ program, onClose }: { program: ProgramCardData; onClose: () => void }) {
  const t = useTranslations("programs");
  const tA11y = useTranslations("a11y");
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  // The cover photo first, then the rest, without showing the same file twice.
  const gallery = Array.from(new Set([program.photo_path, ...program.photos].filter((p): p is string => Boolean(p))));
  const [active, setActive] = useState(0);

  // Dialog basics: Escape closes, the page behind does not scroll, and focus
  // returns to whatever opened the dialog.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-ink-dark/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="modal-panel flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-surface shadow-[0_30px_80px_rgba(1,19,50,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border-soft p-5">
          <div>
            <span className="text-[12.5px] font-bold tracking-wide text-blue">
              {program.categoryLabel.toUpperCase()} · {program.typeLabel.toUpperCase()}
            </span>
            <h3 id={titleId} className="mt-1.5 font-serif text-xl font-semibold">
              {program.name}
            </h3>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="-mr-2 -mt-1 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center text-2xl leading-none text-muted-2 hover:text-ink"
            aria-label={tA11y("close")}
          >
            ×
          </button>
        </div>
        <div className="overflow-y-auto p-5">
          <Photo
            key={gallery[active] ?? "none"}
            path={gallery[active] ?? null}
            alt={program.name}
            aspect="16/9"
            rounded="8px"
            className="mb-3"
            sizes="(max-width: 640px) 100vw, 512px"
          />
          {gallery.length > 1 ? (
            <ul role="list" className="mb-4 flex gap-2 overflow-x-auto pb-1">
              {gallery.map((path, i) => (
                <li key={path} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={t("showPhoto", { number: i + 1 })}
                    aria-current={i === active}
                    className={cn(
                      "block w-16 cursor-pointer overflow-hidden rounded-md border-2 transition-opacity sm:w-20",
                      i === active ? "border-blue" : "border-transparent opacity-70 hover:opacity-100",
                    )}
                  >
                    <Photo path={path} alt="" aspect="4/3" rounded="0" sizes="80px" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mb-1" />
          )}
          <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted-2">
            <span>
              {t("fieldRegion")}: <strong className="text-ink">{program.regionLabel}</strong>
            </span>
            {program.participants > 0 ? (
              <span>
                {t("fieldParticipants")}: <strong className="text-ink">{program.participants.toLocaleString()}</strong>
              </span>
            ) : null}
          </div>
          <p className="text-base leading-relaxed text-muted lg:text-[17px]">{program.summary}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-1">
            {program.slug ? (
              <Button href={`/programs/${program.slug}`} variant="primary" size="sm" onClick={onClose}>
                {t("viewFullProgram")}
                <ArrowRight aria-hidden className="h-4 w-4" />
              </Button>
            ) : null}
            {program.websiteUrl ? (
              <a
                href={program.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-[15px] font-bold text-blue hover:text-blue-hover max-sm:min-h-11"
              >
                {t("visitWebsite")} →
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/** A program card in the grid; opens the details dialog. */
export function ProgramCard({ program }: { program: ProgramCardData }) {
  const [open, setOpen] = useState(false);
  const photoCount = new Set([program.photo_path, ...program.photos].filter(Boolean)).size;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="text-left" aria-haspopup="dialog">
        <Card padding="none" className="card-lift h-full cursor-pointer overflow-hidden">
          <div className="relative">
            <Photo path={program.photo_path ?? program.photos[0]} alt={program.name} aspect="4/3" label={`PHOTO — ${program.name}`} rounded="0" />
            {photoCount > 1 ? (
              <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-full bg-ink-dark/75 px-2.5 py-1 text-[12px] font-bold text-white">
                <Images aria-hidden className="h-3.5 w-3.5" />
                {photoCount}
              </span>
            ) : null}
          </div>
          <div className="p-5">
            <span className="text-[12.5px] font-bold tracking-wide text-blue">{program.categoryLabel.toUpperCase()}</span>
            <h3 className="mt-2 font-serif text-[19px]">{program.name}</h3>
            <p className="mt-2 text-[15px] leading-normal text-muted">{program.summary}</p>
          </div>
        </Card>
      </button>
      {open ? <ProgramModal program={program} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

/** "See more" button for the featured program: opens the same details dialog. */
export function ProgramMoreButton({ program, children }: { program: ProgramCardData; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="button" variant="primary" onClick={() => setOpen(true)} aria-haspopup="dialog">
        {children}
      </Button>
      {open ? <ProgramModal program={program} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
