import Image from "next/image";
import { getTranslations } from "next-intl/server";
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
  // Repeat short lists so one copy is always wider than the screen.
  const items = Array.from({ length: Math.ceil(10 / visible.length) }, () => visible).flat();

  return (
    <section aria-labelledby="sponsors-heading" className={className}>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 pt-12 md:pt-[72px]">
        <div className="mx-auto max-w-[680px] text-center">
          <h2 id="sponsors-heading" className="font-serif text-[26px] font-semibold sm:text-[30px]">
            {t("title")}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted lg:text-[17px]">{t("intro")}</p>
        </div>
      </div>
      {/* One continuous line of logos. The set is rendered twice and slid by
          exactly half its width, so the loop has no visible seam. The second
          copy is hidden from assistive tech and skipped by Tab, but (unlike
          `inert`) still reacts to the mouse, so hover shows the colour logo. */}
      <div className="sponsors-marquee relative mt-9 overflow-hidden pb-12 md:pb-[72px] motion-reduce:overflow-x-auto">
        <div
          className="sponsors-track flex w-max motion-reduce:animate-none"
          style={{ animationDuration: `${Math.max(24, items.length * 4)}s` }}
        >
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              role={copy === 0 ? "list" : undefined}
              aria-hidden={copy === 1 ? true : undefined}
              className="flex shrink-0"
            >
              {items.map((s, i) => {
                const logo = (
                  <span className="flex h-28 w-44 items-center justify-center rounded-lg border border-border-soft bg-white p-4 transition-shadow group-hover:shadow-[0_6px_20px_rgba(3,48,124,0.12)] sm:h-32 sm:w-48">
                    <span className="relative block h-full w-full">
                      <Image
                        src={getPublicUrl(s.logo_path)!}
                        alt={copy === 0 ? s.name : ""}
                        fill
                        loading="eager"
                        sizes="192px"
                        className="object-contain opacity-90 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                      />
                    </span>
                  </span>
                );
                return (
                  <li key={`${s.id}-${i}`} className="mr-4 shrink-0">
                    {s.website_url ? (
                      <a href={s.website_url} target="_blank" rel="noopener noreferrer" tabIndex={copy === 1 ? -1 : undefined} className="group block">
                        {logo}
                        <span className="sr-only">{tA11y("opensInNewTab")}</span>
                      </a>
                    ) : (
                      <div className="group">{logo}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
