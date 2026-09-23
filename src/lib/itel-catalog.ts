import "server-only";

// Itel Solar's public storefront runs on WooCommerce, which exposes a public,
// unauthenticated JSON product API (the same one their own shop page uses for
// anonymous visitors). No API key, no login, nothing scraped from rendered
// HTML: this is the intended public interface for their catalog.
const ITEL_STORE_API = "https://itelsolar.com/wp-json/wc/store/v1/products";

const CATEGORY_IDS = {
  panel: 19, // "PV Panels"
  inverter: 54, // "Inverters"
  battery: 117, // "Solar Battery"
} as const;

type ItelProduct = {
  id: number;
  name: string;
  prices: {
    price: string; // minor units (kobo)
    currency_minor_unit: number;
  };
};

export type BenchmarkRow = {
  source: string;
  category: "panel" | "inverter" | "battery";
  subtype: string;
  unit: "watt" | "kva" | "kwh";
  rateNgn: number;
  minRateNgn: number;
  maxRateNgn: number;
  sampleSize: number;
};

// Identifies us honestly. Node's bare default user agent is the kind of
// request bot filters drop first.
const REQUEST_HEADERS = {
  Accept: "application/json",
  "User-Agent": "Mozilla/5.0 (compatible; PowerNexaPriceSync/1.0; +https://www.powernexasolutions.site)",
};

export class CatalogFetchError extends Error {
  constructor(
    message: string,
    readonly status?: number
  ) {
    super(message);
  }
}

// Throws on any non-200 response instead of quietly stopping. A silent stop
// used to report a "successful" sync of 0 rows and wipe the last good snapshot.
async function fetchCategoryProducts(categoryId: number): Promise<ItelProduct[]> {
  const products: ItelProduct[] = [];
  for (let page = 1; page <= 5; page++) {
    const res = await fetch(`${ITEL_STORE_API}?category=${categoryId}&per_page=100&page=${page}`, {
      cache: "no-store",
      headers: REQUEST_HEADERS,
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) {
      throw new CatalogFetchError(`Itel Solar returned HTTP ${res.status} for category ${categoryId}`, res.status);
    }
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("json")) {
      throw new CatalogFetchError(`Itel Solar returned ${contentType || "no content type"} instead of JSON (likely a bot challenge page)`);
    }
    const batch = (await res.json()) as ItelProduct[];
    products.push(...batch);
    if (batch.length < 100) break;
  }
  return products;
}

function priceInNaira(product: ItelProduct): number | null {
  const minorUnit = product.prices.currency_minor_unit ?? 2;
  const raw = Number(product.prices.price);
  if (!raw || Number.isNaN(raw)) return null;
  return raw / 10 ** minorUnit;
}

function parsePanelWatts(name: string): number | null {
  const match = name.match(/(\d{2,4}(?:\.\d+)?)\s*W\b/i);
  return match ? parseFloat(match[1]) : null;
}

function parseInverterKva(name: string): number | null {
  const kva = name.match(/(\d+(?:\.\d+)?)\s*kva\b/i);
  if (kva) return parseFloat(kva[1]);
  const kw = name.match(/(\d+(?:\.\d+)?)\s*kw\b/i);
  return kw ? parseFloat(kw[1]) : null;
}

function parseInverterPhase(name: string): "1-phase" | "3-phase" | "unspecified" {
  if (/3\s*-?\s*phase/i.test(name)) return "3-phase";
  if (/1\s*-?\s*phase/i.test(name)) return "1-phase";
  return "unspecified";
}

function parseBatteryKwh(name: string): number | null {
  const kwh = name.match(/(\d+(?:\.\d+)?)\s*kwh\b/i);
  if (kwh) return parseFloat(kwh[1]);
  const wh = name.match(/(\d+(?:\.\d+)?)\s*wh\b/i);
  return wh ? parseFloat(wh[1]) / 1000 : null;
}

function parseBatteryChemistry(name: string): "lithium" | "tubular" | "unspecified" {
  if (/lithium/i.test(name)) return "lithium";
  if (/tubular/i.test(name)) return "tubular";
  return "unspecified";
}

function median(values: number[]): { median: number; min: number; max: number } {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const med = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  return { median: med, min: sorted[0], max: sorted[sorted.length - 1] };
}

function buildRows(
  category: BenchmarkRow["category"],
  unit: BenchmarkRow["unit"],
  ratesBySubtype: Map<string, number[]>
): BenchmarkRow[] {
  const rows: BenchmarkRow[] = [];
  for (const [subtype, rates] of ratesBySubtype) {
    if (rates.length === 0) continue;
    const { median: rateNgn, min, max } = median(rates);
    rows.push({
      source: "itel_solar",
      category,
      subtype,
      unit,
      rateNgn: Math.round(rateNgn),
      minRateNgn: Math.round(min),
      maxRateNgn: Math.round(max),
      sampleSize: rates.length,
    });
  }
  return rows;
}

export async function fetchItelBenchmarks(): Promise<BenchmarkRow[]> {
  const [panels, inverters, batteries] = await Promise.all([
    fetchCategoryProducts(CATEGORY_IDS.panel),
    fetchCategoryProducts(CATEGORY_IDS.inverter),
    fetchCategoryProducts(CATEGORY_IDS.battery),
  ]);

  const panelRates = new Map<string, number[]>([["standard", []]]);
  for (const product of panels) {
    const price = priceInNaira(product);
    const watts = parsePanelWatts(product.name);
    if (!price || !watts) continue;
    panelRates.get("standard")!.push(price / watts);
  }

  const inverterRates = new Map<string, number[]>([
    ["1-phase", []],
    ["3-phase", []],
    ["unspecified", []],
  ]);
  for (const product of inverters) {
    const price = priceInNaira(product);
    const kva = parseInverterKva(product.name);
    if (!price || !kva) continue;
    inverterRates.get(parseInverterPhase(product.name))!.push(price / kva);
  }

  const batteryRates = new Map<string, number[]>([
    ["lithium", []],
    ["tubular", []],
    ["unspecified", []],
  ]);
  for (const product of batteries) {
    const price = priceInNaira(product);
    const kwh = parseBatteryKwh(product.name);
    if (!price || !kwh) continue;
    batteryRates.get(parseBatteryChemistry(product.name))!.push(price / kwh);
  }

  return [
    ...buildRows("panel", "watt", panelRates),
    ...buildRows("inverter", "kva", inverterRates),
    ...buildRows("battery", "kwh", batteryRates),
  ];
}
