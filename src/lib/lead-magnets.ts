export type LeadMagnet = {
  slug: string;
  title: string;
  fileUrl: string;
};

export const LEAD_MAGNETS: Record<string, LeadMagnet> = {
  "installer-vetting-checklist": {
    slug: "installer-vetting-checklist",
    title: "The Lagos Inverter Installer Checklist",
    fileUrl: "/downloads/lagos-inverter-installer-checklist.pdf",
  },
};

export const DEFAULT_LEAD_MAGNET = LEAD_MAGNETS["installer-vetting-checklist"];
