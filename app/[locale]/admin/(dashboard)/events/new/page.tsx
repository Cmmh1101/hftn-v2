import { getTranslations } from "next-intl/server";
import { EventForm } from "@/components/site/EventForm";
import { createEvent } from "../actions";

export default async function NewEventPage() {
  const t = await getTranslations("admin.events");

  return (
    <main className="p-8">
      <h1 className="mb-6 font-serif text-[26px] font-semibold">{t("newTitle")}</h1>
      <EventForm action={createEvent} />
    </main>
  );
}
