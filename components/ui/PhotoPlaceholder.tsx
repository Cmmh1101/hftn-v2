import { cn } from "@/lib/cn";

const patterns = {
  neutral:
    "repeating-linear-gradient(45deg, oklch(0.93 0.01 60) 0px, oklch(0.93 0.01 60) 10px, oklch(0.97 0.006 60) 10px, oklch(0.97 0.006 60) 20px)",
  warm: "repeating-linear-gradient(45deg, #dceefa 0px, #dceefa 12px, #eef7fd 12px, #eef7fd 24px)",
  dark: "repeating-linear-gradient(45deg, #1b4270 0px, #1b4270 12px, #163a63 12px, #163a63 24px)",
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
  const textColor = tone === "dark" ? "#9fb8d9" : "oklch(0.5 0.015 60)";
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      style={{ aspectRatio: aspect, background: patterns[tone], borderRadius: rounded }}
    >
      <span
        className="text-center px-2"
        style={{ font: "12px ui-monospace, Menlo, monospace", color: textColor }}
      >
        {label}
      </span>
    </div>
  );
}
