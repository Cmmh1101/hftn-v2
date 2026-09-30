import { cn } from "@/lib/cn";

export type StatTileProps = {
  value: string;
  label: string;
  trend?: string;
  trendTone?: "up" | "neutral";
  size?: "sm" | "lg";
  tone?: "ink" | "accent";
  variant?: "plain" | "card";
};

export function StatTile({
  value,
  label,
  trend,
  trendTone = "neutral",
  size = "sm",
  tone = "ink",
  variant = "plain",
}: StatTileProps) {
  return (
    <div
      className={cn(
        variant === "card" &&
          "relative overflow-hidden rounded-lg border border-border bg-gradient-to-b from-surface to-surface-soft p-5 shadow-[0_1px_2px_rgba(3,48,124,0.04),0_4px_12px_rgba(3,48,124,0.05)] before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-accent-strong before:to-blue before:content-['']",
      )}
    >
      {variant === "card" ? <div className="text-xs font-semibold text-label">{label}</div> : null}
      <div
        className={cn(
          "font-serif font-bold",
          tone === "accent" ? "text-accent-deep" : "text-ink",
          size === "lg" ? "text-[38px]" : "text-[28px]",
          variant === "card" && "mt-1.5",
        )}
      >
        {value}
      </div>
      {variant === "plain" ? (
        <div className="mt-1 text-[13px] text-muted-2">{label}</div>
      ) : trend ? (
        <div className={cn("mt-1 text-xs", trendTone === "up" ? "text-success-text" : "text-label")}>
          {trend}
        </div>
      ) : null}
    </div>
  );
}
