import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Padding = "none" | "sm" | "md" | "lg";

const paddingClasses: Record<Padding, string> = {
  none: "",
  sm: "p-5",
  md: "p-6",
  lg: "p-8",
};

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: Padding;
  highlight?: boolean;
};

export function Card({ padding = "md", highlight = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg shadow-[0_1px_2px_rgba(3,48,124,0.04),0_4px_12px_rgba(3,48,124,0.05)] transition-shadow",
        highlight
          ? "border-2 border-accent bg-gradient-to-b from-accent-soft to-accent-soft-2"
          : "border border-border bg-gradient-to-b from-surface to-surface-soft",
        paddingClasses[padding],
        className,
      )}
      {...props}
    />
  );
}
