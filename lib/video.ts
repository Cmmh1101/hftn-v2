export type VideoSource =
  | { kind: "youtube"; id: string }
  | { kind: "vimeo"; id: string; hash: string | null }
  | { kind: "file"; url: string };

/** Recognises YouTube and Vimeo links (any common form); anything else is treated as a direct video file. */
export function parseVideoUrl(url: string): VideoSource {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      if (id) return { kind: "youtube", id };
    }
    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const id =
        u.pathname === "/watch" ? u.searchParams.get("v") : (u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{6,})/)?.[1] ?? null);
      if (id) return { kind: "youtube", id };
    }

    if (host === "vimeo.com" || host === "player.vimeo.com") {
      // vimeo.com/123456789, vimeo.com/123456789/abcdef1234 (unlisted),
      // vimeo.com/channels/x/123456789, player.vimeo.com/video/123456789?h=abcdef1234
      const parts = u.pathname.split("/").filter(Boolean);
      const idIndex = parts.findIndex((p) => /^\d{5,}$/.test(p));
      if (idIndex !== -1) {
        const hash = u.searchParams.get("h") ?? (/^[0-9a-f]{8,}$/i.test(parts[idIndex + 1] ?? "") ? parts[idIndex + 1] : null);
        return { kind: "vimeo", id: parts[idIndex], hash };
      }
    }
  } catch {
    /* not a URL */
  }
  return { kind: "file", url };
}

/** Preview image for a video link, looked up on the server so the page can show it before anyone presses play. */
export async function getVideoPoster(url: string): Promise<string | null> {
  const source = parseVideoUrl(url);
  if (source.kind === "youtube") return `https://i.ytimg.com/vi/${source.id}/hqdefault.jpg`;
  if (source.kind === "vimeo") {
    try {
      const res = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(`https://vimeo.com/${source.id}${source.hash ? `/${source.hash}` : ""}`)}`, {
        next: { revalidate: 86400 },
      });
      if (!res.ok) return null;
      const data = (await res.json()) as { thumbnail_url?: string };
      return data.thumbnail_url ?? null;
    } catch {
      return null;
    }
  }
  return null;
}
