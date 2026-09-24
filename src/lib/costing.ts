// In-house job costing, built from the owner's solar pricing guide
// (solar_pricing_guide.docx, steps 4 to 6) with the owner's own markups.
// Pure functions only, shared by the admin calculator (client) and the leads
// page (server). Internal figures: never shown to a customer, whose number
// always comes from the site visit.

// Owner-set markups on supplier cost. Big items are easy for customers to
// price online, so they carry less; accessories carry more.
export const MARKUPS = {
  inverter: 0.1,
  battery: 0.2,
  panel: 0.1,
  mounting: 0.35,
  cables: 0.35,
  protection: 0.35, // breakers, isolators, surge protection
  earthing: 0.35,
} as const;

// Starting figures for the service lines, from the guide's 5kVA worked
// example. They change from job to job (distance, roof, access), so the
// calculator lets each one be typed over. Labour follows the guide's
// "per kVA" option: ₦150,000 on a 5kVA job.
export const JOB_COSTS = {
  labourPerKva: 30_000,
  labourMinimum: 60_000,
  transport: 60_000,
  siteSurvey: 20_000,
} as const;

export type ServiceCosts = { labour: number; transport: number; siteSurvey: number };

export function defaultServiceCosts(inverterKva: number): ServiceCosts {
  return {
    labour: Math.max(JOB_COSTS.labourMinimum, inverterKva * JOB_COSTS.labourPerKva),
    transport: JOB_COSTS.transport,
    siteSurvey: JOB_COSTS.siteSurvey,
  };
}

// Accessory costs have no public price list, so they scale from the guide's
// 5kVA / 6-panel example (mounting ₦120k, cables ₦90k, breakers and SPD ₦110k,
// earthing ₦30k). Editable per job in the calculator.
export function defaultAccessoryCosts(inverterKva: number, panelCount: number) {
  return {
    mounting: panelCount * 20_000,
    cables: 40_000 + inverterKva * 10_000,
    protection: 60_000 + inverterKva * 10_000,
    earthing: inverterKva > 10 ? 45_000 : 30_000,
  };
}

export type Chemistry = "lithium" | "tubular";

export type SystemSpec = {
  inverterKva: number;
  batteryKwh: number;
  batteryChemistry: Chemistry;
  panelCount: number;
  panelWatts: number;
};

// Typical pairings from the guide (step 2), plus the tubular budget option.
// Keys are stored on leads.load_profile, so don't rename them.
export const PACKAGES = {
  starter: {
    label: "1.5kVA starter",
    spec: { inverterKva: 1.5, batteryKwh: 1.2, batteryChemistry: "lithium", panelCount: 2, panelWatts: 550 },
  },
  small: {
    label: "3.5kVA small home",
    spec: { inverterKva: 3.5, batteryKwh: 3.6, batteryChemistry: "lithium", panelCount: 4, panelWatts: 550 },
  },
  medium: {
    label: "5kVA family home",
    spec: { inverterKva: 5, batteryKwh: 5, batteryChemistry: "lithium", panelCount: 6, panelWatts: 550 },
  },
  "medium-tubular": {
    label: "5kVA budget (tubular)",
    // 4 x 200Ah 12V tubular = 9.6kWh nominal
    spec: { inverterKva: 5, batteryKwh: 9.6, batteryChemistry: "tubular", panelCount: 6, panelWatts: 550 },
  },
  large: {
    label: "10kVA large home",
    spec: { inverterKva: 10, batteryKwh: 10, batteryChemistry: "lithium", panelCount: 12, panelWatts: 550 },
  },
} as const satisfies Record<string, { label: string; spec: SystemSpec }>;

export type PackageKey = keyof typeof PACKAGES;

// Quote form answers to "What do you want to power?". Plain customer words,
// each mapped to the package it most likely needs. "business" and "unsure"
// have no package: those always need the site visit to size.
export const LOAD_PROFILES = [
  { value: "starter", label: "A few lights, fans, TV and laptops" },
  { value: "small", label: "Lights, fans, TV and a fridge" },
  { value: "medium", label: "A full flat, including 1 AC" },
  { value: "large", label: "A big house with 2 or more ACs" },
  { value: "business", label: "An office, shop or estate" },
  { value: "unsure", label: "Not sure yet" },
] as const;

export type LoadProfile = (typeof LOAD_PROFILES)[number]["value"];

export function loadProfileLabel(value: string | null | undefined): string | null {
  return LOAD_PROFILES.find((p) => p.value === value)?.label ?? null;
}

export function packageForLoadProfile(value: string | null | undefined): PackageKey | null {
  if (!value || !(value in PACKAGES)) return null;
  return value as PackageKey;
}

// One item from a typed-in supplier price list.
export type PriceSourceItem = {
  source: string; // supplier name
  category: "inverter" | "battery" | "panel";
  name: string;
  size: number; // kVA / kWh / W for one unit
  chemistry?: Chemistry | null;
  price: number; // for one unit
};

export type PickedItem = {
  source: string;
  name: string;
  quantity: number;
  unitPrice: number;
  cost: number;
  providedSize: number;
};

const MAX_UNITS = 4;

// Cheapest way to cover `needed` from the available items: several units of
// one model are allowed (e.g. 2 x 11kVA for a 22kVA job).
export function pickCheapest(items: PriceSourceItem[], needed: number): PickedItem | null {
  let best: PickedItem | null = null;
  for (const item of items) {
    const quantity = Math.ceil(needed / item.size - 1e-9);
    if (quantity < 1 || quantity > MAX_UNITS) continue;
    const candidate: PickedItem = {
      source: item.source,
      name: item.name,
      quantity,
      unitPrice: item.price,
      cost: item.price * quantity,
      providedSize: item.size * quantity,
    };
    if (!best || candidate.cost < best.cost) best = candidate;
  }
  return best;
}

// Panels are bought by count, so pick the model closest to the wattage asked
// for (cheapest on a tie) rather than the cheapest panel overall.
export function pickPanel(items: PriceSourceItem[], panelWatts: number, panelCount: number): PickedItem | null {
  let best: PriceSourceItem | null = null;
  for (const item of items) {
    if (!best) {
      best = item;
      continue;
    }
    const itemGap = Math.abs(item.size - panelWatts);
    const bestGap = Math.abs(best.size - panelWatts);
    if (itemGap < bestGap || (itemGap === bestGap && item.price < best.price)) best = item;
  }
  if (!best) return null;
  return {
    source: best.source,
    name: best.name,
    quantity: panelCount,
    unitPrice: best.price,
    cost: best.price * panelCount,
    providedSize: best.size * panelCount,
  };
}

export type CostLine = {
  key: string;
  label: string;
  detail?: string;
  cost: number;
  markupRate: number;
  price: number;
};

export type JobEstimate = {
  equipment: CostLine[];
  missing: string[]; // equipment we had no price for
  equipmentCost: number;
  equipmentPrice: number;
  labour: number;
  transport: number;
  siteSurvey: number;
  finalPrice: number;
  // What PowerNexa keeps from the equipment markups. Labour, transport and
  // the survey are paid out, so they're not counted here.
  expectedMargin: number;
};

export type AccessoryCosts = ReturnType<typeof defaultAccessoryCosts>;

// Costs typed in by hand for one job, used instead of the supplier price
// lists. Inverter and battery are the total cost; panels are the price of one.
export type ManualEquipmentCosts = Partial<{ inverter: number; battery: number; panelEach: number }>;

export function estimateJob(options: {
  spec: SystemSpec;
  priceBook: PriceSourceItem[];
  accessories?: AccessoryCosts;
  services?: ServiceCosts;
  sourceFilter?: string; // only use this supplier, e.g. "Nexus"
  manual?: ManualEquipmentCosts;
}): JobEstimate {
  const { spec } = options;
  const manual = options.manual ?? {};
  const book = options.sourceFilter
    ? options.priceBook.filter((item) => item.source === options.sourceFilter)
    : options.priceBook;

  const inverter: PickedItem | null =
    manual.inverter !== undefined
      ? handTyped(manual.inverter, 1, spec.inverterKva)
      : pickCheapest(
          book.filter((i) => i.category === "inverter"),
          spec.inverterKva
        );
  const battery: PickedItem | null =
    manual.battery !== undefined
      ? handTyped(manual.battery, 1, spec.batteryKwh)
      : pickCheapest(
          book.filter((i) => i.category === "battery" && (i.chemistry ?? null) === spec.batteryChemistry),
          spec.batteryKwh
        );
  const panels: PickedItem | null =
    manual.panelEach !== undefined
      ? handTyped(manual.panelEach, spec.panelCount, spec.panelWatts * spec.panelCount)
      : pickPanel(
          book.filter((i) => i.category === "panel"),
          spec.panelWatts,
          spec.panelCount
        );

  const equipment: CostLine[] = [];
  const missing: string[] = [];

  const addPicked = (key: "inverter" | "battery" | "panel", label: string, picked: PickedItem | null) => {
    if (!picked) {
      missing.push(label);
      return;
    }
    const detail = `${picked.quantity > 1 ? `${picked.quantity} x ` : ""}${picked.name} · ${picked.source}`;
    equipment.push({
      key,
      label,
      detail,
      cost: picked.cost,
      markupRate: MARKUPS[key],
      price: picked.cost * (1 + MARKUPS[key]),
    });
  };

  addPicked("inverter", `${spec.inverterKva}kVA inverter`, inverter);
  addPicked("battery", `${spec.batteryKwh}kWh ${spec.batteryChemistry} battery`, battery);
  addPicked("panel", `${spec.panelCount} x ${spec.panelWatts}W panels`, panels);

  const accessories = options.accessories ?? defaultAccessoryCosts(spec.inverterKva, spec.panelCount);
  const accessoryLabels: Record<keyof AccessoryCosts, string> = {
    mounting: "Mounting structure",
    cables: "Cables and MC4 connectors",
    protection: "Breakers, isolators and surge protection",
    earthing: "Earthing kit",
  };
  for (const key of Object.keys(accessoryLabels) as (keyof AccessoryCosts)[]) {
    const cost = accessories[key];
    equipment.push({ key, label: accessoryLabels[key], cost, markupRate: MARKUPS[key], price: cost * (1 + MARKUPS[key]) });
  }

  const equipmentCost = sum(equipment.map((l) => l.cost));
  const equipmentPrice = sum(equipment.map((l) => l.price));
  const { labour, transport, siteSurvey } = options.services ?? defaultServiceCosts(spec.inverterKva);

  return {
    equipment,
    missing,
    equipmentCost,
    equipmentPrice,
    labour,
    transport,
    siteSurvey,
    finalPrice: equipmentPrice + labour + transport + siteSurvey,
    expectedMargin: equipmentPrice - equipmentCost,
  };
}

// Final prices are rounded up to the nearest ₦50,000 when quoted, the way the
// guide rounds ₦4,364,100 to ₦4.4m.
export function roundQuote(value: number): number {
  return Math.ceil(value / 50_000) * 50_000;
}

export function formatNaira(value: number): string {
  return `₦${Math.round(value).toLocaleString("en-NG")}`;
}

function handTyped(unitPrice: number, quantity: number, providedSize: number): PickedItem {
  return {
    source: "typed in by hand",
    name: quantity > 1 ? `${formatNaira(unitPrice)} each` : "Your cost",
    quantity,
    unitPrice,
    cost: unitPrice * quantity,
    providedSize,
  };
}

function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}
