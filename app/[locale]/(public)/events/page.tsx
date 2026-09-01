import { getTranslations, getLocale } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageIntro } from "@/components/site/PageIntro";
import { getEvents } from "@/lib/queries";
import { formatEventDay, formatEventMonth, toIntlLocale } from "@/lib/format";

export default async function EventsPage() {
  const [t, locale, events] = await Promise.all([getTranslations("events"), getLocale(), getEvents()]);
  const intlLocale = toIntlLocale(locale);

  return (
    <main className="mx-auto max-w-[1240px] px-8 pb-20 pt-14">
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <div className="flex flex-col gap-4">
        {events.map((e) => (
          <Card
            key={e.id}
            className="grid grid-cols-[80px_1fr_auto] items-center gap-4 sm:grid-cols-[120px_1fr_auto] sm:gap-6"
          >
            <div className="border-r border-border-softer pr-4 text-center sm:pr-5">
              <div className="text-xs font-bold uppercase text-accent-deep">
                {formatEventMonth(e.event_date, intlLocale)}
              </div>
              <div className="font-serif text-[30px] font-bold">{formatEventDay(e.event_date, intlLocale)}</div>
            </div>
            <div>
              <h3 className="font-serif text-[19px]">{e.name}</h3>
              <div className="mt-1.5 text-[13.5px] text-muted-2">{e.location}</div>
              <div className="mt-2 text-[13px] text-muted">{e.description}</div>
            </div>
            <Button variant="primary" size="sm">
              {e.cta_label}
            </Button>
          </Card>
        ))}
      </div>
    </main>
  );
}
