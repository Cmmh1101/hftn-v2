"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import { getPublicUrl } from "@/lib/storage";

export type VerseItem = { id: string; reference: string; text: string };

const ROTATE_MS = 10_000;

/**
 * Bible-verse banner. With several verses it rotates by itself every few
 * seconds — paused while the visitor hovers/focuses it or has chosen
 * reduced motion — and always has previous/next and dot controls.
 * All verses are laid out in the same grid cell, so the banner never changes
 * height when it switches.
 */
export function VerseBanner({ verses, backgroundPath }: { verses: VerseItem[]; backgroundPath?: string }) {
  const t = useTranslations("verses");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const count = verses.length;

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (count < 2 || paused || reducedMotion) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [count, paused, reducedMotion]);

  if (count === 0) return null;
  const go = (next: number) => setIndex((next + count) % count);
  const bg = getPublicUrl(backgroundPath);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t("label")}
      className="relative overflow-hidden bg-ink-dark text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {bg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={bg} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-40" />
      ) : null}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink-dark/70 via-ink/55 to-ink-dark/80" />
      <div className="relative mx-auto max-w-[900px] px-5 py-16 text-center sm:px-8 sm:py-24">
        <div aria-hidden className="mb-4 font-serif text-5xl leading-none text-accent-strong">“</div>
        <div className="grid">
          {verses.map((v, i) => (
            <figure
              key={v.id}
              aria-hidden={i !== index}
              className={cn(
                "col-start-1 row-start-1 flex flex-col items-center justify-center transition-opacity duration-700",
                i === index ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <blockquote className="font-serif text-xl font-medium italic leading-relaxed sm:text-2xl lg:text-[28px] lg:leading-[1.5]">
                {v.text}
              </blockquote>
              <figcaption className="mt-5 text-[15px] font-bold uppercase tracking-[2px] text-accent-strong">
                — {v.reference}
              </figcaption>
            </figure>
          ))}
        </div>

        {count > 1 ? (
          <div className="mt-8 flex items-center justify-center gap-2" role="group" aria-label={t("controls")}>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label={t("previous")}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-2xl text-white/80 hover:bg-white/10 hover:text-white"
            >
              ‹
            </button>
            {verses.map((v, i) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={t("goTo", { number: i + 1, total: count })}
                aria-current={i === index}
                className="flex h-11 w-6 cursor-pointer items-center justify-center"
              >
                <span className={cn("h-2.5 rounded-full transition-all", i === index ? "w-6 bg-accent-strong" : "w-2.5 bg-white/40")} />
              </button>
            ))}
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label={t("next")}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-2xl text-white/80 hover:bg-white/10 hover:text-white"
            >
              ›
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
