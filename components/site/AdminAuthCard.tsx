import Image from "next/image";
import { cn } from "@/lib/cn";

/** Shared frame for the signed-out admin screens (login, forgot/reset password). */
export function AdminAuthCard({
  tagline,
  as: Tag = "div",
  className,
  children,
  ...rest
}: {
  tagline: string;
  as?: "div" | "form";
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const Component = Tag as React.ElementType;
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-soft-2 px-6">
      <Component {...rest} className={cn("w-full max-w-sm rounded-lg border border-border bg-surface p-8", className)}>
        <Image src="/brand/logo.png" alt="" width={212} height={180} priority className="mb-3 h-14 w-auto" />
        <div className="mb-1 font-serif text-lg font-bold">
          Hope <span className="text-accent">Admin</span>
        </div>
        <div className="mb-7 text-[13px] tracking-wide text-label">{tagline}</div>
        {children}
      </Component>
    </main>
  );
}
