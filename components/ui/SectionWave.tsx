import { cn } from "@/lib/cn";

// A soft horizon curve that "cuts" the edge of a coloured section into the
// page background. Filled with currentColor (set to the page background by
// default), so it sits on top of any section regardless of its gradient.
export function SectionWave({
  position,
  className,
}: {
  position: "top" | "bottom";
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 64"
      preserveAspectRatio="none"
      className={cn(
        "pointer-events-none absolute inset-x-0 z-10 block h-[34px] w-full text-bg md:h-[56px]",
        position === "top" ? "-top-px" : "-bottom-px rotate-180",
        className,
      )}
    >
      <path d="M0,0 L1440,0 L1440,18 C1180,66 940,4 700,30 C440,58 220,8 0,38 Z" fill="currentColor" />
    </svg>
  );
}
