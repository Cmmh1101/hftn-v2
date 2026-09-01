import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const fieldClasses =
  "border border-border-soft rounded-md px-3.5 py-3 text-sm font-sans placeholder:text-label focus:outline-none focus:border-blue";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClasses, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldClasses, "resize-y", className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldClasses, "bg-surface", className)} {...props}>
      {children}
    </select>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-xs font-bold tracking-wide text-label">{children}</label>;
}

export function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
