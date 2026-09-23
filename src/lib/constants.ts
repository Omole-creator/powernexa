export const SITE_NAME = "PowerNexa Solutions";
export const SITE_TAGLINE = "Solar, Inverter and Battery Solutions for Homes and Businesses";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.powernexasolutions.site";

export const PHONE_DISPLAY = "0813 209 7317";
export const PHONE_E164 = "+2348132097317";
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348132097317";

export const PHONE_DISPLAY_2 = "0708 695 0312";
export const PHONE_E164_2 = "+2347086950312";
export const QUOTE_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_QUOTE_WHATSAPP_NUMBER || "2347086950312";

export const CONTACT_EMAIL = "powernexas@gmail.com";

export const BUSINESS_ADDRESS = {
  street: "11 Idris Ogunlaja Drive",
  area: "Sangotedo",
  city: "Lagos",
  region: "Lagos State",
  country: "NG",
};

export const BUSINESS_HOURS = [
  { days: "Monday to Saturday", hours: "8:00 AM to 6:00 PM" },
  { days: "Sunday", hours: "Closed (WhatsApp still open for emergencies)" },
];

export type LagosArea = {
  slug: string;
  name: string;
  blurb: string;
};

export const LAGOS_AREAS: LagosArea[] = [
  {
    slug: "victoria-island",
    name: "Victoria Island",
    blurb:
      "High-rise apartments and corporate offices on VI need silent, reliable backup power that never interrupts a workday or a meeting.",
  },
  {
    slug: "lekki-phase-1",
    name: "Lekki Phase 1",
    blurb:
      "Lekki Phase 1 homes run big loads, air conditioning, pumps, entertainment systems, so sizing the right inverter and battery bank matters.",
  },
  {
    slug: "ikoyi",
    name: "Ikoyi",
    blurb:
      "Ikoyi's luxury homes and diplomatic residences need discreet, high-capacity solar and battery systems installed without disrupting daily life.",
  },
  {
    slug: "ajah",
    name: "Ajah",
    blurb:
      "Ajah's growing estates and family homes want dependable backup power at a fair price, without cutting corners on safety.",
  },
  {
    slug: "vgc",
    name: "VGC (Victoria Garden City)",
    blurb:
      "VGC's estate layout is ideal for coordinated solar installations across multiple homes, with shared maintenance visits that save everyone money.",
  },
  {
    slug: "sangotedo",
    name: "Sangotedo",
    blurb:
      "Sangotedo is home turf for our installation team, which means faster response times for installation, maintenance, and emergency repairs.",
  },
  {
    slug: "ikeja",
    name: "Ikeja",
    blurb:
      "Ikeja's mix of homes, clinics, and small offices needs flexible system sizes, from a single room backup to a full commercial installation.",
  },
  {
    slug: "lagos-mainland",
    name: "Lagos Mainland",
    blurb:
      "From Yaba to Surulere and beyond, Mainland households are switching from noisy petrol generators to quiet solar and inverter systems.",
  },
];

export type ServiceItem = {
  slug: string;
  name: string;
  shortName: string;
  summary: string;
  icon: "panel" | "inverter" | "battery" | "wrench" | "building";
};

export const SERVICES: ServiceItem[] = [
  {
    slug: "solar-panel-installation",
    name: "Solar Panel Installation",
    shortName: "Solar Panel Installation",
    summary:
      "Full solar panel installation for Lagos homes, sized to your actual power needs, not a one-size-fits-all package.",
    icon: "panel",
  },
  {
    slug: "inverter-installation",
    name: "Inverter Installation",
    shortName: "Inverter Installation",
    summary:
      "Pure sine wave inverter installation that runs your fridge, AC units, and electronics without the hum and flicker of cheap units.",
    icon: "inverter",
  },
  {
    slug: "battery-replacement-storage",
    name: "Battery Replacement & Storage",
    shortName: "Battery Replacement",
    summary:
      "Lithium and tubular battery supply, installation, and replacement, sized for the backup hours you actually need.",
    icon: "battery",
  },
  {
    slug: "solar-maintenance-repair",
    name: "Solar & Inverter Maintenance",
    shortName: "Maintenance & Repair",
    summary:
      "Scheduled maintenance and fast repairs that keep panels clean, batteries healthy, and inverters running for years, not months.",
    icon: "wrench",
  },
  {
    slug: "commercial-solar-for-business",
    name: "Commercial Solar for Business",
    shortName: "Commercial Solar",
    summary:
      "Load assessments and commercial-grade solar systems for offices, clinics, schools, and estates that cannot afford downtime.",
    icon: "building",
  },
];

export const PROPERTY_TYPES = ["Home", "Business", "Estate / Facility Manager"] as const;

export const BUDGET_RANGES = [
  "Not sure yet",
  "Under ₦1,000,000",
  "₦1,000,000 to ₦3,000,000",
  "₦3,000,000 to ₦7,000,000",
  "Above ₦7,000,000",
] as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/locations", label: "Locations" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;
