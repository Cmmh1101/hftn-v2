import { cn } from "@/lib/cn";

export type ProgressBarProps = {
  percent: number;
  color?: "accent" | "blue";
  thickness?: "sm" | "md";
};

export function ProgressBar({ percent, color = "accent", thickness = "sm" }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-full bg-border-softer",
        thickness === "sm" ? "h-[7px]" : "h-2",
      )}
    >
      <div
        className={cn("h-full rounded-full", color === "accent" ? "bg-accent" : "bg-blue")}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
