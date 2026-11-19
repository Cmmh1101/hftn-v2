import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";
import { getSponsors } from "@/lib/queries";
import { getPublicUrl } from "@/lib/storage";

/** Logo wall of sponsors and partners; renders nothing while there are none. */
export async function SponsorsStrip({ className }: { className?: string }) {
  const [t, tA11y, sponsors] = await Promise.all([
    getTranslations("sponsors"),
    getTranslations("a11y"),
    getSponsors(),
  ]);
  const visible = sponsors.filter((s) => getPublicUrl(s.logo_path));
  if (visible.length === 0) return null;

  return (
    <section aria-labelledby="sponsors-heading" className={className}>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12 md:py-[72px]">
        <div className="mx-auto max-w-[680px] text-center">
          <h2 id="sponsors-heading" className="font-serif text-[26px] font-semibold sm:text-[30px]">
            {t("title")}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted lg:text-[17px]">{t("intro")}</p>
        </div>
        <ul role="list" className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {visible.map((s, i) => {
            const logo = (
              <span className="flex h-28 items-center justify-center rounded-lg border border-border-soft bg-white p-4 transition-shadow group-hover:shadow-[0_6px_20px_rgba(3,48,124,0.12)] sm:h-32">
                <span className="relative block h-full w-full">
                  <Image
                    src={getPublicUrl(s.logo_path)!}
                    alt={s.name}
                    fill
                    sizes="(max-width: 640px) 45vw, 180px"
                    className="object-contain opacity-90 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                  />
                </span>
              </span>
            );
            return (
              <li key={s.id}>
                <Reveal delay={(i % 6) * 60}>
                  {s.website_url ? (
                    <a href={s.website_url} target="_blank" rel="noopener noreferrer" className="group block">
                      {logo}
                      <span className="sr-only">{tA11y("opensInNewTab")}</span>
                    </a>
                  ) : (
                    <div className="group">{logo}</div>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
