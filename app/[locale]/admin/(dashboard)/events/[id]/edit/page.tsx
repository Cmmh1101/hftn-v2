import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { EventForm } from "@/components/site/EventForm";
import { createClient } from "@/lib/supabase/server";
import { updateEvent } from "../../actions";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [t, supabase] = await Promise.all([getTranslations("admin.events"), createClient()]);
  const { data: event } = await supabase.from("events").select("*").eq("id", id).single();

  if (!event) notFound();

  return (
    <main className="p-8">
      <h1 className="mb-6 font-serif text-[26px] font-semibold">{t("editTitle")}</h1>
      <EventForm action={updateEvent.bind(null, id)} event={event} />
    </main>
  );
}
