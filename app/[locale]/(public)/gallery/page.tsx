import { getTranslations } from "next-intl/server";
import { Chip } from "@/components/ui/Chip";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { PageIntro } from "@/components/site/PageIntro";
import { getGalleryGroups } from "@/lib/queries";

type RegionKey = "sa" | "ca" | "na" | "eu";

// Matches the region string stored in Supabase (always English — content
// data isn't translated) regardless of the UI locale. Order here is the
// display order once a region has real photos.
const REGION_ORDER: { key: RegionKey; dbValue: string; labelKey: "southAmerica" | "centralAmerica" | "northAmerica" | "europe" }[] = [
  { key: "sa", dbValue: "South America", labelKey: "southAmerica" },
  { key: "ca", dbValue: "Central America", labelKey: "centralAmerica" },
  { key: "na", dbValue: "North America", labelKey: "northAmerica" },
  { key: "eu", dbValue: "Europe", labelKey: "europe" },
];

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const [t, tRegions, { region: rawRegion }, allGroups] = await Promise.all([
    getTranslations("gallery"),
    getTranslations("regions"),
    searchParams,
    getGalleryGroups(),
  ]);

  // Only show a region filter once a jornada has actually happened there —
  // no empty "Central America" / "Europe" tabs for work that hasn't started.
  const activeDbValues = new Set(allGroups.map((g) => g.region));
  const availableRegions = REGION_ORDER.filter((r) => activeDbValues.has(r.dbValue));

  const region = availableRegions.some((r) => r.key === rawRegion) ? (rawRegion as RegionKey) : "all";

  const REGION_FILTERS: { key: RegionKey | "all"; label: string }[] = [
    { key: "all", label: t("allRegions") },
    ...availableRegions.map((r) => ({ key: r.key, label: tRegions(r.labelKey) })),
  ];

  const activeDbValue = REGION_ORDER.find((r) => r.key === region)?.dbValue;
  const groups = activeDbValue ? allGroups.filter((g) => g.region === activeDbValue) : allGroups;

  return (
    <main className="mx-auto max-w-[1240px] px-8 pb-20 pt-14">
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      {REGION_FILTERS.length > 1 ? (
        <div className="mb-9 flex flex-wrap gap-2.5">
          {REGION_FILTERS.map((f) => (
            <Chip key={f.key} href={f.key === "all" ? "/gallery" : `/gallery?region=${f.key}`} selected={region === f.key}>
              {f.label}
            </Chip>
          ))}
        </div>
      ) : null}

      {groups.map((g) => (
        <div key={g.location} className="mb-10">
          <h3 className="mb-1 font-serif text-xl font-semibold">{g.location}</h3>
          <div className="mb-3.5 text-xs text-label">
            {g.region} · {g.caption}
          </div>
          <div className="grid grid-cols-3 gap-2.5 md:grid-cols-6">
            {Array.from({ length: Math.max(g.photoCount, 6) }).map((_, i) => (
              <PhotoPlaceholder key={i} aspect="1" label="PHOTO" rounded="6px" />
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}
