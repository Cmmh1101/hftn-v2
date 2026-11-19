"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ActionForm, useFormPending } from "@/components/site/ActionForm";
import { Spinner } from "@/components/ui/Spinner";
import type { ActionResult } from "@/lib/action-result";
import { cn } from "@/lib/cn";

// Two-step delete: the first click only asks "are you sure?". The confirm
// button then shows a spinner while the server works, and the outcome
// (deleted / couldn't delete) arrives as a toast.
function ConfirmActions({
  confirmLabel,
  cancelLabel,
  onCancel,
}: {
  confirmLabel: string;
  cancelLabel: string;
  onCancel: () => void;
}) {
  const pending = useFormPending();
  const t = useTranslations("feedback");
  return (
    <div className="flex items-center gap-2">
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-md bg-red-600 px-3 py-1 text-[14px] font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? (
          <>
            <Spinner className="h-3.5 w-3.5" />
            {t("deleting")}
          </>
        ) : (
          confirmLabel
        )}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={pending}
        className="min-h-9 cursor-pointer rounded-md border border-border px-3 py-1 text-[14px] font-bold text-muted-2 hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
      >
        {cancelLabel}
      </button>
    </div>
  );
}

export function DeleteButton({
  action,
  confirmMessage,
  label,
  confirmLabel,
  cancelLabel,
  hiddenFields = {},
  className,
}: {
  action: (formData: FormData) => Promise<ActionResult | void>;
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
      <ActionForm
        action={action}
        role="group"
        aria-label={confirmMessage}
        className="flex flex-col items-start gap-1.5 rounded-md border border-border bg-surface-soft-2 p-2"
      >
        {Object.entries(hiddenFields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        <span className="text-[13.5px] italic text-muted-2">{confirmMessage}</span>
        <ConfirmActions confirmLabel={confirmLabel} cancelLabel={cancelLabel} onCancel={() => setConfirming(false)} />
      </ActionForm>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className={cn("min-h-9 cursor-pointer font-bold text-red-600", className)}
    >
      {label}
    </button>
  );
}
