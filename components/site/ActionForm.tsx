"use client";

import { createContext, useContext, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useToast } from "@/components/ui/Toast";
import { Button, type ButtonProps } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { ActionResult } from "@/lib/action-result";

const PendingContext = createContext(false);

/** True while the surrounding <ActionForm> is waiting for the server. */
export function useFormPending(): boolean {
  return useContext(PendingContext);
}

type Props = Omit<React.FormHTMLAttributes<HTMLFormElement>, "action" | "onSubmit"> & {
  ref?: React.Ref<HTMLFormElement>;
  action: (formData: FormData) => Promise<ActionResult | void>;
  /** Clear the fields after a successful save (for "add another" style forms). */
  resetOnSuccess?: boolean;
};

// Runs a server action and tells the user how it went:
//  - while it runs, `pending` is exposed so buttons can show a spinner
//  - on success it shows the action's message as a toast, then navigates if asked
//    (the toast lives in the root layout, so it survives the navigation)
//  - on failure it shows the error and KEEPS what the user typed
// Deliberately not <form action={fn}>: React 19 clears the form after such an
// action, which would wipe a long post the moment a save fails.
export function ActionForm({ action, resetOnSuccess, children, ...formProps }: Props) {
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();
  const t = useTranslations("feedback");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      let result: ActionResult | void;
      try {
        result = await action(formData);
      } catch {
        toast.error(typeof navigator !== "undefined" && !navigator.onLine ? t("networkError") : t("errorGeneric"));
        return;
      }
      if (!result) return;
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      if (result.message) toast.success(result.message);
      if (resetOnSuccess) form.reset();
      if (result.redirectTo) router.push(result.redirectTo);
    });
  }

  return (
    <PendingContext.Provider value={pending}>
      <form {...formProps} onSubmit={handleSubmit} aria-busy={pending}>
        {children}
      </form>
    </PendingContext.Provider>
  );
}

type SubmitProps = Omit<Extract<ButtonProps, { href?: undefined }>, "type" | "children"> & {
  children: React.ReactNode;
  /** Shown next to the spinner while saving. Defaults to "Saving…". */
  pendingLabel?: string;
};

export function SubmitButton({ children, pendingLabel, disabled, ...props }: SubmitProps) {
  const pending = useFormPending();
  const t = useTranslations("feedback");
  return (
    <Button type="submit" disabled={pending || disabled} {...props}>
      {pending ? (
        <>
          <Spinner />
          {pendingLabel ?? t("saving")}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
