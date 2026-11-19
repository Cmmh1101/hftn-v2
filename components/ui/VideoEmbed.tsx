"use client";

import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { parseVideoUrl } from "@/lib/video";

/**
 * Responsive 16:9 video. YouTube and Vimeo videos stay a plain thumbnail until
 * clicked (no third-party player or cookies before the visitor chooses to play).
 * `poster` is the thumbnail for Vimeo (YouTube's is derived from the link).
 * For a direct file, an optional poster image is looked up next to it:
 * `…/overview.mp4` → `…/overview-poster.jpg`.
 */
export function VideoEmbed({ url, title, className, poster }: { url: string; title: string; className?: string; poster?: string | null }) {
  const t = useTranslations("a11y");
  const [playing, setPlaying] = useState(false);
  const source = parseVideoUrl(url);

  if (source.kind === "youtube" || source.kind === "vimeo") {
    const src =
      source.kind === "youtube"
        ? `https://www.youtube-nocookie.com/embed/${source.id}?autoplay=1&rel=0`
        : `https://player.vimeo.com/video/${source.id}?${source.hash ? `h=${source.hash}&` : ""}autoplay=1&dnt=1`;
    const thumb = source.kind === "youtube" ? `https://i.ytimg.com/vi/${source.id}/hqdefault.jpg` : (poster ?? null);
    return (
      <div className={cn("relative aspect-video w-full overflow-hidden rounded-xl bg-ink-dark", className)}>
        {playing ? (
          <iframe
            src={src}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`${t("playVideo")}: ${title}`}
            className="group absolute inset-0 cursor-pointer"
          >
            {thumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumb}
                alt=""
                className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
              />
            ) : null}
            <PlayBadge />
          </button>
        )}
      </div>
    );
  }

  return (
    <video
      controls
      playsInline
      preload="metadata"
      poster={url.replace(/\.(mp4|mov|webm)$/i, "-poster.jpg")}
      aria-label={title}
      className={cn("aspect-video w-full rounded-xl bg-ink-dark object-cover", className)}
    >
      <source src={url} />
    </video>
  );
}

function PlayBadge() {
  return (
    <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-ink shadow-lg transition-transform group-hover:scale-110">
      <Play aria-hidden className="ml-1 h-7 w-7 fill-current" />
    </span>
  );
}
