export type PeriodType = "day" | "month" | "quarter" | "year";

export type DateRange = {
  type: PeriodType;
  value: string;
  start: Date;
  end: Date;
  label: string;
};

// The business launched in 2026, so there is nothing to report before it.
// The upper bound always keeps a few years of "beyond" selectable ahead of
// the current year, per the owner's request, without ever needing a code
// change to add a new year.
const START_YEAR = 2026;
const YEARS_AHEAD = 3;

export function availableYears(): number[] {
  const currentYear = new Date().getFullYear();
  const lastYear = Math.max(currentYear, START_YEAR) + YEARS_AHEAD;
  const years: number[] = [];
  for (let y = START_YEAR; y <= lastYear; y++) years.push(y);
  return years;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function monthOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  for (const year of availableYears()) {
    for (let m = 1; m <= 12; m++) {
      options.push({ value: `${year}-${pad2(m)}`, label: `${MONTH_NAMES[m - 1]} ${year}` });
    }
  }
  return options;
}

export function quarterOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  for (const year of availableYears()) {
    for (let q = 1; q <= 4; q++) {
      options.push({ value: `${year}-Q${q}`, label: `Q${q} ${year}` });
    }
  }
  return options;
}

export function yearOptions(): { value: string; label: string }[] {
  return availableYears().map((y) => ({ value: String(y), label: String(y) }));
}

export function dayOptions(count = 60): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    const value = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
    const dateLabel = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    options.push({ value, label: i === 0 ? `${dateLabel} (Today)` : i === 1 ? `${dateLabel} (Yesterday)` : dateLabel });
  }
  return options;
}

export function defaultValueFor(type: PeriodType): string {
  const now = new Date();
  if (type === "day") return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
  if (type === "month") return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}`;
  if (type === "quarter") return `${now.getFullYear()}-Q${Math.floor(now.getMonth() / 3) + 1}`;
  return String(now.getFullYear());
}

export function resolveDateRange(rawType: string | undefined, rawValue: string | undefined): DateRange {
  const type: PeriodType =
    rawType === "day" || rawType === "month" || rawType === "quarter" || rawType === "year" ? rawType : "month";
  const value = rawValue || defaultValueFor(type);

  if (type === "day") {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    const now = new Date();
    const [y, m, d] = match ? match.slice(1).map(Number) : [now.getFullYear(), now.getMonth() + 1, now.getDate()];
    const start = new Date(y, m - 1, d);
    const end = new Date(y, m - 1, d + 1);
    return { type, value, start, end, label: start.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) };
  }

  if (type === "quarter") {
    const match = /^(\d{4})-Q([1-4])$/.exec(value);
    const now = new Date();
    const y = match ? Number(match[1]) : now.getFullYear();
    const q = match ? Number(match[2]) : Math.floor(now.getMonth() / 3) + 1;
    const start = new Date(y, (q - 1) * 3, 1);
    const end = new Date(y, q * 3, 1);
    return { type, value, start, end, label: `Q${q} ${y}` };
  }

  if (type === "year") {
    const match = /^(\d{4})$/.exec(value);
    const y = match ? Number(match[1]) : new Date().getFullYear();
    const start = new Date(y, 0, 1);
    const end = new Date(y + 1, 0, 1);
    return { type, value, start, end, label: String(y) };
  }

  // month
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  const now = new Date();
  const y = match ? Number(match[1]) : now.getFullYear();
  const m = match ? Number(match[2]) : now.getMonth() + 1;
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 1);
  return { type, value, start, end, label: `${MONTH_NAMES[m - 1]} ${y}` };
}
