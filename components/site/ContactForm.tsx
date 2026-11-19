"use client";

import { useActionState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { submitContact, type ContactFormState } from "@/app/[locale]/(public)/contact/actions";

const initialState: ContactFormState = { status: "idle" };

export function ContactForm() {
  const t = useTranslations("contact");
  const toast = useToast();
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  // The form is replaced by the thank-you text on success, so a toast makes the
  // confirmation hard to miss; errors keep the typed message and explain why.
  useEffect(() => {
    if (state.status === "success" && state.message) toast.success(state.message);
    if (state.status === "error" && state.message) toast.error(state.message);
  }, [state, toast]);

  if (state.status === "success") {
    return <p className="text-base leading-relaxed lg:text-[17px] text-muted">{state.message}</p>;
  }

  return (
    <form action={formAction} aria-busy={pending} className="flex flex-col gap-3.5">
      <Input placeholder={t("namePlaceholder")} name="name" required />
      <Input placeholder={t("emailPlaceholder")} name="email" type="email" required />
      <Textarea placeholder={t("messagePlaceholder")} name="message" rows={5} required />
      {state.status === "error" ? <p className="text-[13px] text-red-600">{state.message}</p> : null}
      <Button type="submit" variant="primary" className="w-fit" disabled={pending}>
        {pending ? (
          <>
            <Spinner />
            {t("sending")}
          </>
        ) : (
          t("send")
        )}
      </Button>
    </form>
  );
}
