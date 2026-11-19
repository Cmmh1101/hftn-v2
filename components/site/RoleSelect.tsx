"use client";

import { useRef } from "react";
import { ActionForm, useFormPending } from "@/components/site/ActionForm";
import { Select } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/Spinner";
import type { ActionResult } from "@/lib/action-result";

// Changing the role saves immediately, so the select locks and shows a spinner
// while it saves, and a toast confirms (or reports the failure).
function RoleField({
  defaultValue,
  options,
  onChange,
}: {
  defaultValue: string;
  options: { value: string; label: string }[];
  onChange: () => void;
}) {
  const pending = useFormPending();
  return (
    <div className="flex items-center gap-2">
      <Select
        name="role"
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={pending}
        className="py-1.5 text-[15px]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
      {pending ? <Spinner className="text-blue" /> : null}
    </div>
  );
}

export function RoleSelect({
  action,
  defaultValue,
  options,
}: {
  action: (formData: FormData) => Promise<ActionResult | void>;
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <ActionForm ref={formRef} action={action}>
      <RoleField defaultValue={defaultValue} options={options} onChange={() => formRef.current?.requestSubmit()} />
    </ActionForm>
  );
}
