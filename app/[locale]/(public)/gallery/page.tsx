import { getTranslations } from "next-intl/server";
import { Chip } from "@/components/ui/Chip";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { PageIntro } from "@/components/site/PageIntro";
import { getGalleryGroups } from "@/lib/queries";

type Region = "all" | "sa" | "ca" | "na" | "eu";

// Matches the region string stored in Supabase (always English — content
// data isn't translated) regardless of the UI locale.
const REGION_DB_VALUES: Record<Exclude<Region, "all">, string> = {
  sa: "South America",
  ca: "Central America",
  na: "North America",
  eu: "Europe",
};

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const [t, tRegions, { region: rawRegion }] = await Promise.all([
    getTranslations("gallery"),
    getTranslations("regions"),
    searchParams,
  ]);

  const region: Region = (["all", "sa", "ca", "na", "eu"] as Region[]).includes(rawRegion as Region)
    ? (rawRegion as Region)
    : "all";

  const REGION_FILTERS: { key: Region; label: string }[] = [
    { key: "all", label: t("allRegions") },
    { key: "sa", label: tRegions("southAmerica") },
    { key: "ca", label: tRegions("centralAmerica") },
    { key: "na", label: tRegions("northAmerica") },
    { key: "eu", label: tRegions("europe") },
  ];

  const allGroups = await getGalleryGroups();
  const groups =
    region === "all" ? allGroups : allGroups.filter((g) => g.region === REGION_DB_VALUES[region]);

  return (
    <main className="mx-auto max-w-[1240px] px-8 pb-20 pt-14">
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <div className="mb-9 flex flex-wrap gap-2.5">
        {REGION_FILTERS.map((f) => (
          <Chip key={f.key} href={f.key === "all" ? "/gallery" : `/gallery?region=${f.key}`} selected={region === f.key}>
            {f.label}
          </Chip>
        ))}
      </div>

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
