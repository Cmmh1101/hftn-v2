import { Play } from "lucide-react";

/** Small "play" mark laid over a card's photo to show the post has a video. */
export function VideoBadge({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full bg-ink-dark/75 px-2.5 py-1 text-[12px] font-bold text-white">
      <Play aria-hidden className="h-3.5 w-3.5 fill-current" />
      {label}
    </span>
  );
}
