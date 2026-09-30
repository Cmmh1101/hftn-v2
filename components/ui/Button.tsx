import { Link } from "@/i18n/navigation";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "accent" | "accentOnDark" | "outline" | "outlineOnDark" | "link";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-ink-soft to-ink text-white shadow-[0_1px_2px_rgba(1,19,50,0.15),0_4px_10px_rgba(1,19,50,0.25)] hover:shadow-[0_2px_4px_rgba(1,19,50,0.2),0_6px_16px_rgba(1,19,50,0.3)] hover:-translate-y-px",
  accent:
    "bg-gradient-to-b from-accent-strong to-accent text-white shadow-[0_1px_2px_rgba(1,19,50,0.15),0_4px_10px_rgba(1,19,50,0.25)] hover:shadow-[0_2px_4px_rgba(1,19,50,0.2),0_6px_16px_rgba(1,19,50,0.3)] hover:-translate-y-px",
  accentOnDark: "bg-accent-strong text-accent-ink hover:brightness-105",
  outline: "border-[1.5px] border-ink text-ink bg-transparent hover:bg-ink/5",
  outlineOnDark: "border-[1.5px] border-white/70 text-white bg-transparent hover:bg-white/10",
  link: "text-blue hover:text-blue-hover bg-transparent p-0! font-bold",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-[13.5px] px-4 py-2.5 rounded-md",
  md: "text-[14px] px-[22px] py-3 rounded-md",
  lg: "text-[15px] px-[26px] py-3.5 rounded-md",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold cursor-pointer transition-all",
    variantClasses[variant],
    variant !== "link" && sizeClasses[size],
    className,
  );

  if ("href" in props && props.href) {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
