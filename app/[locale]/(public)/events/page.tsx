import { getTranslations, getLocale } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageIntro } from "@/components/site/PageIntro";
import { getEvents } from "@/lib/queries";
import { formatEventDay, formatEventMonth, toIntlLocale } from "@/lib/format";

export default async function EventsPage() {
  const contentLocale = await getLocale();
  const [t, locale, events] = await Promise.all([getTranslations("events"), getLocale(), getEvents(contentLocale)]);
  const intlLocale = toIntlLocale(locale);

  return (
    <main className="mx-auto max-w-[1240px] px-5 sm:px-8 pb-16 sm:pb-20 pt-10 sm:pt-14">
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <div className="flex flex-col gap-4">
        {events.map((e) => (
          <Card
            key={e.id}
            className="grid grid-cols-[64px_1fr] items-center gap-x-4 gap-y-5 sm:grid-cols-[120px_1fr_auto] sm:gap-6"
          >
            <div className="border-r border-border-softer pr-4 text-center sm:pr-5 max-sm:pr-3">
              <div className="text-[13px] font-bold uppercase text-accent-deep">
                {formatEventMonth(e.event_date, intlLocale)}
              </div>
              <div className="font-serif text-[30px] font-bold">{formatEventDay(e.event_date, intlLocale)}</div>
            </div>
            <div>
              <h3 className="font-serif text-[19px]">{e.name}</h3>
              <div className="mt-1.5 text-[15px] text-muted-2">{e.location}</div>
              <div className="mt-2 text-[15px] text-muted">{e.description}</div>
            </div>
            <Button variant="primary" size="sm" className="col-span-2 max-sm:w-full sm:col-span-1">
              {e.cta_label}
            </Button>
          </Card>
        ))}
      </div>
    </main>
  );
}
