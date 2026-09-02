"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Field";
import { subscribeNewsletter, type NewsletterFormState } from "@/app/[locale]/(public)/actions";

const initialState: NewsletterFormState = { status: "idle" };

export function NewsletterForm() {
  const t = useTranslations("footer");
  const [state, formAction, pending] = useActionState(subscribeNewsletter, initialState);

  if (state.status === "success") {
    return <p className="text-[13px] text-muted-2">{state.message}</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <Input
        type="email"
        name="email"
        placeholder={t("newsletterPlaceholder")}
        required
        className="text-[13px]"
      />
      <button
        type="submit"
        disabled={pending}
        className="w-fit cursor-pointer text-[13px] font-bold text-blue hover:text-blue-hover"
      >
        {pending ? t("newsletterSending") : t("newsletterButton")}
      </button>
      {state.status === "error" ? <p className="text-xs text-red-600">{state.message}</p> : null}
    </form>
  );
}
