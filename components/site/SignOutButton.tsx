"use client";

import { useTranslations } from "next-intl";
import { ActionForm, useFormPending } from "@/components/site/ActionForm";
import { Spinner } from "@/components/ui/Spinner";
import type { ActionResult } from "@/lib/action-result";

function Label({ children }: { children: React.ReactNode }) {
  const pending = useFormPending();
  const t = useTranslations("feedback");
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-1 flex min-h-11 w-full cursor-pointer items-center gap-2 py-2 text-left text-[13.5px] text-sidebar-inactive hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <>
          <Spinner className="h-3.5 w-3.5" />
          {t("signingOut")}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function SignOutButton({ action, label }: { action: () => Promise<ActionResult>; label: string }) {
  return (
    <ActionForm action={action}>
      <Label>{label}</Label>
    </ActionForm>
  );
}
