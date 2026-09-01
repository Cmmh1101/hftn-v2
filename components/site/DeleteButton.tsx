"use client";

import { cn } from "@/lib/cn";

export function DeleteButton({
  action,
  confirmMessage,
  label,
  hiddenFields = {},
  className,
}: {
  action: (formData: FormData) => void;
  confirmMessage: string;
  label: string;
  hiddenFields?: Record<string, string>;
  className?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      {Object.entries(hiddenFields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <button type="submit" className={cn("cursor-pointer font-bold text-red-600", className)}>
        {label}
      </button>
    </form>
  );
}
