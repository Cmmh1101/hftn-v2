"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { getPublicUrl } from "@/lib/storage";
import { cn } from "@/lib/cn";

export type LightboxPhoto = { path: string; alt: string; caption?: string };

/**
 * A grid of photos that opens a full-screen viewer: arrow keys / buttons to
 * move, Escape to close. Used for a program's photo gallery.
 */
export function PhotoLightbox({ photos, className }: { photos: LightboxPhoto[]; className?: string }) {
  const t = useTranslations("a11y");
  const [current, setCurrent] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setCurrent(null), []);
  const move = useCallback(
    (delta: number) => setCurrent((c) => (c === null ? c : (c + delta + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (current === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") move(1);
      else if (e.key === "ArrowLeft") move(-1);
    };
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
    // Re-run only when the viewer opens/closes, not on every photo change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current === null]);

  useEffect(() => {
    if (current === null) opener.current?.focus?.();
  }, [current]);

  const photo = current === null ? null : photos[current];
  const url = photo ? getPublicUrl(photo.path) : null;

  return (
    <>
      <ul role="list" className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4", className)}>
        {photos.map((p, i) => {
          const src = getPublicUrl(p.path);
          if (!src) return null;
          return (
            <li key={p.path}>
              <button
                type="button"
                onClick={(e) => {
                  opener.current = e.currentTarget;
                  setCurrent(i);
                }}
                aria-label={t("openPhoto", { number: i + 1, total: photos.length })}
                aria-haspopup="dialog"
                className="group relative block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-lg bg-surface-soft-2"
              >
                <Image
                  src={src}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            </li>
          );
        })}
      </ul>

      {photo && url ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={photo.alt}
          className="modal-backdrop fixed inset-0 z-50 flex flex-col bg-ink-dark/95"
          onClick={close}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white/90">
            <span className="text-[15px] font-semibold" aria-live="polite">
              {(current ?? 0) + 1} / {photos.length}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label={t("close")}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full hover:bg-white/10"
            >
              <X aria-hidden className="h-6 w-6" />
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16" onClick={(e) => e.stopPropagation()}>
            {photos.length > 1 ? (
              <button
                type="button"
                onClick={() => move(-1)}
                aria-label={t("previous")}
                className="absolute left-1 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 sm:left-4"
              >
                <ChevronLeft aria-hidden className="h-6 w-6" />
              </button>
            ) : null}
            <div className="relative h-full w-full">
              <Image key={photo.path} src={url} alt={photo.alt} fill sizes="100vw" className="object-contain" priority />
            </div>
            {photos.length > 1 ? (
              <button
                type="button"
                onClick={() => move(1)}
                aria-label={t("next")}
                className="absolute right-1 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 sm:right-4"
              >
                <ChevronRight aria-hidden className="h-6 w-6" />
              </button>
            ) : null}
          </div>
          <p className="min-h-14 px-6 py-3 text-center text-[15px] text-white/85">{photo.caption}</p>
        </div>
      ) : null}
    </>
  );
}
