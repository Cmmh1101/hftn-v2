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
    <div className={cn(variant === "card" && "rounded-lg border border-border bg-surface p-5")}>
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
