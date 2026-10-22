import { cn } from "@/lib/cn";

// Until real photography is uploaded these read as an intentional "dawn"
// field (a low sun and its rings) rather than a striped wireframe box. The
// sun sits low-right so a future caption/overlay has room on the left.
const sun = (core: string, glow: string, ring: string) =>
  [
    `radial-gradient(circle at 76% 82%, ${core} 0 5.5%, transparent 6%)`,
    `radial-gradient(circle at 76% 82%, transparent 0 15%, ${ring} 15.4% 16.2%, transparent 16.6%)`,
    `radial-gradient(circle at 76% 82%, transparent 0 27%, ${ring} 27.4% 28.2%, transparent 28.6%)`,
    `radial-gradient(ellipse 85% 75% at 76% 105%, ${glow} 0%, transparent 70%)`,
  ].join(", ");

const patterns = {
  neutral: `${sun("rgba(255,255,255,0.95)", "rgba(222,190,150,0.35)", "rgba(255,255,255,0.55)")}, linear-gradient(165deg, #fbf8f3 0%, #f0e8dc 100%)`,
  warm: `${sun("rgba(255,255,255,0.97)", "rgba(94,203,234,0.5)", "rgba(255,255,255,0.6)")}, linear-gradient(165deg, #f3faff 0%, #d3eaf8 55%, #bcdff3 100%)`,
  dark: `${sun("rgba(255,255,255,0.9)", "rgba(94,203,234,0.32)", "rgba(159,184,217,0.28)")}, linear-gradient(160deg, #234f89 0%, #12335d 100%)`,
};

export type PhotoPlaceholderProps = {
  tone?: keyof typeof patterns;
  aspect?: string;
  label?: string;
  rounded?: string;
  className?: string;
};

export function PhotoPlaceholder({
  tone = "neutral",
  aspect = "4/3",
  label = "PHOTO",
  rounded = "8px",
  className,
}: PhotoPlaceholderProps) {
  return (
    <div
      className={cn("relative flex items-end overflow-hidden p-4", className)}
      style={{ aspectRatio: aspect, background: patterns[tone], borderRadius: rounded }}
    >
      <span
        className={cn(
          "max-w-[60%] whitespace-pre-line text-[10.5px] font-semibold uppercase leading-snug tracking-[1.4px]",
          tone === "dark" ? "text-white/55" : "text-ink/45",
        )}
      >
        {label}
      </span>
    </div>
  );
}
