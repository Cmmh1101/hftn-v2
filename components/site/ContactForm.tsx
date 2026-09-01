"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { submitContact, type ContactFormState } from "@/app/[locale]/(public)/contact/actions";

const initialState: ContactFormState = { status: "idle" };

export function ContactForm() {
  const t = useTranslations("contact");
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  if (state.status === "success") {
    return <p className="text-[15px] leading-relaxed text-muted">{state.message}</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-3.5">
      <Input placeholder={t("namePlaceholder")} name="name" required />
      <Input placeholder={t("emailPlaceholder")} name="email" type="email" required />
      <Textarea placeholder={t("messagePlaceholder")} name="message" rows={5} required />
      {state.status === "error" ? <p className="text-xs text-red-600">{state.message}</p> : null}
      <Button type="submit" variant="primary" className="w-fit" disabled={pending}>
        {pending ? t("sending") : t("send")}
      </Button>
    </form>
  );
}
