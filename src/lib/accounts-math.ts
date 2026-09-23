// Business accounts: work done (revenue) and expenses, rolled up by month,
// quarter or year. Pure functions only, shared by the accounts page (server)
// and its record tables (client). Dates are plain "YYYY-MM-DD" strings, so
// bucketing is string slicing with no timezone surprises.

export type JobRecord = {
  id: number;
  job_date: string;
  customer: string;
  description: string | null;
  job_value: number; // what the customer agreed to pay, counted as revenue
  amount_paid: number; // collected so far
  notes: string | null;
};

export type ExpenseRecord = {
  id: number;
  expense_date: string;
  name: string;
  category: ExpenseCategory;
  amount: number; // for one unit
  quantity: number;
  paid_by: PaidBy;
  notes: string | null;
};

// Money a founder put into the business out of their own pocket is a loan
// the business owes back. Repayments are recorded separately, so each
// founder can see what they spent, what came back, and what is still owed.
export const FOUNDERS = [
  { value: "omole", label: "Omole", role: "Founder A" },
  { value: "idowu", label: "Idowu", role: "Founder B" },
] as const;

export type Founder = (typeof FOUNDERS)[number]["value"];
export type PaidBy = "business" | Founder;

export function isPaidBy(value: string): value is PaidBy {
  return value === "business" || FOUNDERS.some((f) => f.value === value);
}

export function paidByLabel(value: string): string {
  const founder = FOUNDERS.find((f) => f.value === value);
  return founder ? `${founder.label} (${founder.role})` : "Business account";
}

export type RepaymentRecord = {
  id: number;
  repaid_date: string;
  founder: Founder;
  amount: number;
  notes: string | null;
};

export function founderBalances(expenses: ExpenseRecord[], repayments: RepaymentRecord[]) {
  return FOUNDERS.map((founder) => {
    const spent = expenses.filter((e) => e.paid_by === founder.value);
    const lent = spent.reduce((total, e) => total + expenseTotal(e), 0);
    const repaid = repayments.filter((r) => r.founder === founder.value).reduce((total, r) => total + r.amount, 0);
    return { ...founder, expenses: spent, lent, repaid, owed: lent - repaid };
  });
}

// "direct" costs are spent to deliver a job (cost of sales), the rest keep
// the business running. Gross profit takes off direct costs only, net profit
// takes off everything. Keys are stored in the database, so don't rename them.
export const EXPENSE_CATEGORIES = [
  { value: "equipment", label: "Equipment and materials", direct: true },
  { value: "labour", label: "Installer labour", direct: true },
  { value: "transport", label: "Transport and fuel", direct: true },
  { value: "salaries", label: "Salaries", direct: false },
  { value: "rent", label: "Rent and office", direct: false },
  { value: "marketing", label: "Marketing and adverts", direct: false },
  { value: "tools", label: "Tools", direct: false },
  { value: "phone", label: "Phone, data and internet", direct: false },
  { value: "bank", label: "Bank charges", direct: false },
  { value: "tax", label: "Tax and levies", direct: false },
  { value: "other", label: "Other", direct: false },
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]["value"];

export function isExpenseCategory(value: string): value is ExpenseCategory {
  return EXPENSE_CATEGORIES.some((c) => c.value === value);
}

export function categoryLabel(value: string): string {
  return EXPENSE_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

function isDirect(category: string): boolean {
  return EXPENSE_CATEGORIES.find((c) => c.value === category)?.direct ?? false;
}

export function expenseTotal(expense: Pick<ExpenseRecord, "amount" | "quantity">): number {
  return expense.amount * expense.quantity;
}

export type AccountsView = "month" | "quarter" | "year";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// The key of the period a date falls in: "2026-09", "2026-Q3" or "2026".
export function periodKey(date: string, view: AccountsView): string {
  const year = date.slice(0, 4);
  if (view === "year") return year;
  const month = Number(date.slice(5, 7));
  if (view === "quarter") return `${year}-Q${Math.ceil(month / 3)}`;
  return `${year}-${date.slice(5, 7)}`;
}

export function periodLabel(key: string, view: AccountsView, short = false): string {
  if (view === "year") return key;
  const year = key.slice(0, 4);
  if (view === "quarter") return `${key.slice(5)} ${year}`;
  const month = MONTHS[Number(key.slice(5, 7)) - 1];
  return short ? month : `${month} ${year}`;
}

// The period just before this one (for month-on-month / quarter-on-quarter /
// year-on-year growth).
export function previousPeriod(key: string, view: AccountsView): string {
  const year = Number(key.slice(0, 4));
  if (view === "year") return String(year - 1);
  if (view === "quarter") {
    const q = Number(key.slice(6));
    return q === 1 ? `${year - 1}-Q4` : `${year}-Q${q - 1}`;
  }
  const m = Number(key.slice(5, 7));
  return m === 1 ? `${year - 1}-12` : `${year}-${String(m - 1).padStart(2, "0")}`;
}

// Same month or quarter one year earlier.
export function sameLastYear(key: string): string {
  return `${Number(key.slice(0, 4)) - 1}${key.slice(4)}`;
}

// The periods the chart and table show for a selected period: every month
// or quarter of its year, or every year the business has records for.
export function periodsFor(selected: string, view: AccountsView, years: number[]): string[] {
  if (view === "year") return years.map(String);
  const year = selected.slice(0, 4);
  if (view === "quarter") return [1, 2, 3, 4].map((q) => `${year}-Q${q}`);
  return MONTHS.map((_, i) => `${year}-${String(i + 1).padStart(2, "0")}`);
}

export type PeriodTotals = {
  key: string;
  revenue: number;
  collected: number;
  jobs: number;
  directCosts: number;
  overheads: number;
  expenses: number;
  grossProfit: number;
  netProfit: number;
};

export function totalsFor(
  key: string,
  view: AccountsView,
  jobs: JobRecord[],
  expenses: ExpenseRecord[]
): PeriodTotals {
  let revenue = 0;
  let collected = 0;
  let jobCount = 0;
  for (const job of jobs) {
    if (periodKey(job.job_date, view) !== key) continue;
    revenue += job.job_value;
    collected += job.amount_paid;
    jobCount += 1;
  }
  let directCosts = 0;
  let overheads = 0;
  for (const expense of expenses) {
    if (periodKey(expense.expense_date, view) !== key) continue;
    if (isDirect(expense.category)) directCosts += expenseTotal(expense);
    else overheads += expenseTotal(expense);
  }
  const expenseSum = directCosts + overheads;
  return {
    key,
    revenue,
    collected,
    jobs: jobCount,
    directCosts,
    overheads,
    expenses: expenseSum,
    grossProfit: revenue - directCosts,
    netProfit: revenue - expenseSum,
  };
}

// Percentage change from `before` to `now`. Null when there's nothing to
// compare against (a zero base makes any percentage meaningless).
export function growth(now: number, before: number): number | null {
  if (before === 0) return null;
  return ((now - before) / Math.abs(before)) * 100;
}

export function margin(profit: number, revenue: number): number | null {
  if (revenue === 0) return null;
  return (profit / revenue) * 100;
}

export function expensesByCategory(
  key: string,
  view: AccountsView,
  expenses: ExpenseRecord[]
): { category: string; label: string; direct: boolean; total: number }[] {
  const totals = new Map<string, number>();
  for (const expense of expenses) {
    if (periodKey(expense.expense_date, view) !== key) continue;
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + expenseTotal(expense));
  }
  return [...totals.entries()]
    .map(([category, total]) => ({ category, label: categoryLabel(category), direct: isDirect(category), total }))
    .sort((a, b) => b.total - a.total);
}

export function todayIso(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });
}
