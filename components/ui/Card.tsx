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
        "rounded-lg bg-surface",
        highlight
          ? "border-2 border-accent bg-accent-soft"
          : "border border-border",
        paddingClasses[padding],
        className,
      )}
      {...props}
    />
  );
}
