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
      <form action={action} className="flex flex-col items-start gap-1.5 rounded-md border border-border bg-surface-soft-2 p-2">
        {Object.entries(hiddenFields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        <span className="text-[11px] italic text-muted-2">{confirmMessage}</span>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="cursor-pointer rounded-md bg-red-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-red-700"
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="cursor-pointer rounded-md border border-border px-2.5 py-1 text-xs font-bold text-muted-2 hover:bg-surface"
          >
            {cancelLabel}
          </button>
        </div>
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
