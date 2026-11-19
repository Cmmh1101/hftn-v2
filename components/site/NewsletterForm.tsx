"use client";

import { useActionState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { subscribeNewsletter, type NewsletterFormState } from "@/app/[locale]/(public)/actions";

const initialState: NewsletterFormState = { status: "idle" };

export function NewsletterForm() {
  const t = useTranslations("footer");
  const toast = useToast();
  const [state, formAction, pending] = useActionState(subscribeNewsletter, initialState);

  useEffect(() => {
    if (state.status === "success" && state.message) toast.success(state.message);
    if (state.status === "error" && state.message) toast.error(state.message);
  }, [state, toast]);

  if (state.status === "success") {
    return <p className="text-[15px] text-muted-2">{state.message}</p>;
  }

  return (
    <form action={formAction} aria-busy={pending} className="flex flex-col gap-2">
      <Input
        type="email"
        name="email"
        placeholder={t("newsletterPlaceholder")}
        required
      />
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 w-fit cursor-pointer text-[15px] font-bold text-blue hover:text-blue-hover"
      >
        {pending ? (
          <span className="inline-flex items-center gap-2">
            <Spinner className="h-3.5 w-3.5" />
            {t("newsletterSending")}
          </span>
        ) : (
          t("newsletterButton")
        )}
      </button>
      {state.status === "error" ? <p className="text-[13px] text-red-600">{state.message}</p> : null}
    </form>
  );
}
