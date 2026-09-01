// Fixed set of regions for the gallery — stored in English regardless of UI
// locale (content data isn't translated), matched against exactly by admin
// forms and the public gallery's region filter. Keeping this as a closed set
// (rather than free text) avoids duplicate regions from name variance.
export const GALLERY_REGIONS = [
  { dbValue: "South America", labelKey: "southAmerica" },
  { dbValue: "Central America", labelKey: "centralAmerica" },
  { dbValue: "North America", labelKey: "northAmerica" },
  { dbValue: "Europe", labelKey: "europe" },
] as const;

export type RegionLabelKey = (typeof GALLERY_REGIONS)[number]["labelKey"];

// Programs can also span more than one region or the whole org ("Multiple",
// "Global" — used by continuous/flagship programs), so this extends the
// gallery's continent list rather than reusing it directly.
export const PROGRAM_REGIONS = [
  ...GALLERY_REGIONS,
  { dbValue: "Multiple", labelKey: "multiple" },
  { dbValue: "Global", labelKey: "global" },
] as const;

