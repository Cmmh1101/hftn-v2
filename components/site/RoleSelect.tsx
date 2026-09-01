"use client";

import { useRef } from "react";
import { Select } from "@/components/ui/Field";

export function RoleSelect({
  action,
  defaultValue,
  options,
}: {
  action: (formData: FormData) => void;
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={action}>
      <Select
        name="role"
        defaultValue={defaultValue}
        onChange={() => formRef.current?.requestSubmit()}
        className="py-1.5 text-xs"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </form>
  );
}
