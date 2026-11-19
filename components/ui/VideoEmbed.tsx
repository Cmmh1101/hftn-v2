"use client";

import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/cn";

// Accepts a YouTube link (watch, youtu.be, shorts, embed) or a direct video file.
function youTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    if (u.hostname.endsWith("youtube.com") || u.hostname.endsWith("youtube-nocookie.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      const m = u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{6,})/);
      return m ? m[1] : null;
    }
  } catch {
    /* not a URL */
  }
  return null;
}

/**
 * Responsive 16:9 video. YouTube videos stay a plain thumbnail until clicked
 * (no third-party requests or cookies before the visitor chooses to play).
 * For a direct file, an optional poster image is looked up next to it:
 * `…/overview.mp4` → `…/overview-poster.jpg`.
 */
export function VideoEmbed({ url, title, className }: { url: string; title: string; className?: string }) {
  const t = useTranslations("a11y");
  const [playing, setPlaying] = useState(false);
  const id = youTubeId(url);

  if (id) {
    return (
      <div className={cn("relative aspect-video w-full overflow-hidden rounded-xl bg-ink-dark", className)}>
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
            />
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
