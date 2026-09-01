import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export function Chip({
  href,
  selected,
  children,
}: {
  href: string;
  selected: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border border-border px-4.5 py-2.5 text-[13px] font-bold",
        selected ? "bg-ink text-white" : "bg-surface text-muted",
      )}
    >
      {children}
    </Link>
  );
}
