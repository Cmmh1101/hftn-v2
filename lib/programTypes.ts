// Fixed set of program types — stored in English regardless of UI locale
// (content data isn't translated). Covers every type value currently in use
// across all program categories, so switching the admin form from free text
// to a select doesn't lose any existing data. Also drives the public
// Jornadas page's dynamic type grouping.
export const PROGRAM_TYPES = [
  { dbValue: "Medical Care", labelKey: "medicalCare" },
  { dbValue: "Feeding", labelKey: "feeding" },
  { dbValue: "Medical + Feeding", labelKey: "medicalFeeding" },
  { dbValue: "Evangelization", labelKey: "evangelization" },
  { dbValue: "Youth Outreach", labelKey: "youthOutreach" },
  { dbValue: "Resource Drive", labelKey: "resourceDrive" },
  { dbValue: "Elderly Ministry", labelKey: "elderlyMinistry" },
  { dbValue: "Disaster Relief", labelKey: "disasterRelief" },
  { dbValue: "Continuous", labelKey: "continuous" },
  { dbValue: "Relief", labelKey: "relief" },
] as const;

export type ProgramTypeLabelKey = (typeof PROGRAM_TYPES)[number]["labelKey"];
