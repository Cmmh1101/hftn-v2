"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export function DeleteButton({
  action,
  confirmMessage,
  label,
  confirmLabel,
  cancelLabel,
  hiddenFields = {},
  className,
}: {
  action: (formData: FormData) => void;
  confirmMessage: string;
  label: string;
  confirmLabel: string;
  cancelLabel: string;
  hiddenFields?: Record<string, string>;
  className?: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <form action={action} className="flex items-center gap-2">
        {Object.entries(hiddenFields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        <span className="text-xs text-muted-2">{confirmMessage}</span>
        <button type="submit" className="cursor-pointer font-bold text-red-600">
          {confirmLabel}
        </button>
        <button type="button" onClick={() => setConfirming(false)} className="cursor-pointer font-bold text-muted-2">
          {cancelLabel}
        </button>
      </form>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className={cn("cursor-pointer font-bold text-red-600", className)}
    >
      {label}
    </button>
  );
}
