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

// Non-equipment costs, defaults from the guide's 5kVA worked example.
// Labour follows the guide's "per kVA" option: ₦150,000 on a 5kVA job.
export const JOB_COSTS = {
  labourPerKva: 30_000,
  labourMinimum: 60_000,
  transport: 60_000,
  siteSurvey: 20_000,
  warrantyReserveRate: 0.02, // of equipment cost
  overheadRate: 0.05, // tools, insurance, adverts, phone and data
  nairaBufferRate: 0.03, // protects the quote when the dollar moves
  bankCharges: 40_000,
  vatRate: 0.075, // only once the business is VAT registered
} as const;

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

// A supplier item (typed-in price list) or a benchmark rate (Itel, per unit).
export type PriceSourceItem = {
  source: string; // supplier name, or "Itel Solar (benchmark)"
  category: "inverter" | "battery" | "panel";
  name: string;
  size: number; // kVA / kWh / W for one unit
  chemistry?: Chemistry | null;
  price: number; // for one unit
  perUnitRate?: boolean; // true for benchmarks: price is per kVA/kWh/W, sized exactly
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
// one model are allowed (e.g. 2 x 11kVA for a 22kVA job). Benchmarks are
// priced for the exact size.
export function pickCheapest(items: PriceSourceItem[], needed: number): PickedItem | null {
  let best: PickedItem | null = null;
  for (const item of items) {
    let candidate: PickedItem;
    if (item.perUnitRate) {
      candidate = {
        source: item.source,
        name: item.name,
        quantity: 1,
        unitPrice: item.price * needed,
        cost: item.price * needed,
        providedSize: needed,
      };
    } else {
      const quantity = Math.ceil(needed / item.size - 1e-9);
      if (quantity < 1 || quantity > MAX_UNITS) continue;
      candidate = {
        source: item.source,
        name: item.name,
        quantity,
        unitPrice: item.price,
        cost: item.price * quantity,
        providedSize: item.size * quantity,
      };
    }
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
    const itemSize = item.perUnitRate ? panelWatts : item.size;
    const bestSize = best.perUnitRate ? panelWatts : best.size;
    const itemGap = Math.abs(itemSize - panelWatts);
    const bestGap = Math.abs(bestSize - panelWatts);
    const itemUnit = item.perUnitRate ? item.price * panelWatts : item.price;
    const bestUnit = best.perUnitRate ? best.price * panelWatts : best.price;
    if (itemGap < bestGap || (itemGap === bestGap && itemUnit < bestUnit)) best = item;
  }
  if (!best) return null;
  const unitPrice = best.perUnitRate ? best.price * panelWatts : best.price;
  const unitWatts = best.perUnitRate ? panelWatts : best.size;
  return {
    source: best.source,
    name: best.perUnitRate ? `${panelWatts}W panel (benchmark rate)` : best.name,
    quantity: panelCount,
    unitPrice,
    cost: unitPrice * panelCount,
    providedSize: unitWatts * panelCount,
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
  warrantyReserve: number;
  subtotalBeforeOverhead: number;
  overhead: number;
  subtotalBeforeBuffer: number;
  nairaBuffer: number;
  bankCharges: number;
  finalPrice: number;
  vat: number;
  finalPriceWithVat: number;
  // What PowerNexa keeps: markup earned plus the overhead/buffer lines, after
  // labour, transport, survey and bank charges are paid out. The warranty
  // reserve is money set aside, so it's not counted as profit.
  expectedMargin: number;
};

export type AccessoryCosts = ReturnType<typeof defaultAccessoryCosts>;

export function estimateJob(options: {
  spec: SystemSpec;
  priceBook: PriceSourceItem[];
  accessories?: AccessoryCosts;
  sourceFilter?: string; // only use this supplier/benchmark, e.g. "Nexus"
}): JobEstimate {
  const { spec } = options;
  const book = options.sourceFilter
    ? options.priceBook.filter((item) => item.source === options.sourceFilter)
    : options.priceBook;

  const inverter = pickCheapest(
    book.filter((i) => i.category === "inverter"),
    spec.inverterKva
  );
  const battery = pickCheapest(
    book.filter((i) => i.category === "battery" && (i.chemistry ?? null) === spec.batteryChemistry),
    spec.batteryKwh
  );
  const panels = pickPanel(
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
  const labour = Math.max(JOB_COSTS.labourMinimum, spec.inverterKva * JOB_COSTS.labourPerKva);
  const transport = JOB_COSTS.transport;
  const siteSurvey = JOB_COSTS.siteSurvey;
  const warrantyReserve = equipmentCost * JOB_COSTS.warrantyReserveRate;

  const subtotalBeforeOverhead = equipmentPrice + labour + transport + siteSurvey + warrantyReserve;
  const overhead = subtotalBeforeOverhead * JOB_COSTS.overheadRate;
  const subtotalBeforeBuffer = subtotalBeforeOverhead + overhead;
  const nairaBuffer = subtotalBeforeBuffer * JOB_COSTS.nairaBufferRate;
  const bankCharges = JOB_COSTS.bankCharges;
  const finalPrice = subtotalBeforeBuffer + nairaBuffer + bankCharges;
  const vat = finalPrice * JOB_COSTS.vatRate;

  return {
    equipment,
    missing,
    equipmentCost,
    equipmentPrice,
    labour,
    transport,
    siteSurvey,
    warrantyReserve,
    subtotalBeforeOverhead,
    overhead,
    subtotalBeforeBuffer,
    nairaBuffer,
    bankCharges,
    finalPrice,
    vat,
    finalPriceWithVat: finalPrice + vat,
    expectedMargin: equipmentPrice - equipmentCost + overhead + nairaBuffer,
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

function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}
