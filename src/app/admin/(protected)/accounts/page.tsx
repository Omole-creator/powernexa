import type { Metadata } from "next";
import { ACCOUNTS_SQL, listAccounts } from "@/lib/accounts";
import {
  expensesByCategory,
  founderBalances,
  growth,
  margin,
  periodKey,
  periodLabel,
  periodsFor,
  previousPeriod,
  sameLastYear,
  todayIso,
  totalsFor,
  type AccountsView,
} from "@/lib/accounts-math";
import { formatNaira } from "@/lib/costing";
import { AccountsPeriodFilter } from "@/components/admin/accounts/AccountsPeriodFilter";
import { ProfitChart, RevenueExpenseChart, type ChartPoint } from "@/components/admin/accounts/FinanceCharts";
import { JobsSection } from "@/components/admin/accounts/JobsSection";
import { ExpensesSection } from "@/components/admin/accounts/ExpensesSection";
import { FounderLoans } from "@/components/admin/accounts/FounderLoans";

export const metadata: Metadata = { title: "Accounts", robots: { index: false } };

const VIEW_WORDS: Record<AccountsView, { prev: string; growth: string }> = {
  month: { prev: "last month", growth: "Month on month" },
  quarter: { prev: "last quarter", growth: "Quarter on quarter" },
  year: { prev: "last year", growth: "Year on year" },
};

const PERIOD_PATTERN: Record<AccountsView, RegExp> = {
  month: /^\d{4}-(0[1-9]|1[0-2])$/,
  quarter: /^\d{4}-Q[1-4]$/,
  year: /^\d{4}$/,
};

// Business records start in 2026.
const FIRST_YEAR = 2026;

function Change({ value, invert = false }: { value: number | null; invert?: boolean }) {
  if (value === null) return <span className="text-charcoal/40">no earlier figure</span>;
  const good = invert ? value <= 0 : value >= 0;
  return (
    <span className={good ? "font-semibold text-green-700" : "font-semibold text-red-600"}>
      {value >= 0 ? "▲" : "▼"} {Math.abs(value).toFixed(1)}%
    </span>
  );
}

function Kpi({
  label,
  value,
  tone,
  children,
}: {
  label: string;
  value: string;
  tone?: "good" | "bad";
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">{label}</p>
      <p
        className={`mt-2 font-mono-num text-2xl font-bold ${
          tone === "good" ? "text-green-700" : tone === "bad" ? "text-red-600" : "text-navy"
        }`}
      >
        {value}
      </p>
      {children ? <p className="mt-1 text-xs text-charcoal/50">{children}</p> : null}
    </div>
  );
}

function pct(value: number | null): string {
  return value === null ? "–" : `${value.toFixed(1)}%`;
}

export default async function AdminAccountsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; period?: string }>;
}) {
  const params = await searchParams;
  const view: AccountsView = params.view === "quarter" || params.view === "year" ? params.view : "month";
  const period = params.period && PERIOD_PATTERN[view].test(params.period) ? params.period : periodKey(todayIso(), view);
  const label = periodLabel(period, view);
  const words = VIEW_WORDS[view];

  const { jobs, expenses, repayments, tableMissing } = await listAccounts();

  const recordYears = [...jobs.map((j) => j.job_date), ...expenses.map((e) => e.expense_date)].map((d) => Number(d.slice(0, 4)));
  const lastYear = Math.max(Number(todayIso().slice(0, 4)), Number(period.slice(0, 4)), ...recordYears);
  const years: number[] = [];
  for (let y = FIRST_YEAR; y <= lastYear; y++) years.push(y);

  const current = totalsFor(period, view, jobs, expenses);
  const previous = totalsFor(previousPeriod(period, view), view, jobs, expenses);
  const lastYearSame = view === "year" ? null : totalsFor(sameLastYear(period), view, jobs, expenses);

  const rows = periodsFor(period, view, years).map((key) => {
    const totals = totalsFor(key, view, jobs, expenses);
    const before = totalsFor(previousPeriod(key, view), view, jobs, expenses);
    return { totals, revenueGrowth: growth(totals.revenue, before.revenue), profitGrowth: growth(totals.netProfit, before.netProfit) };
  });
  const chartData: ChartPoint[] = rows.map(({ totals }) => ({
    label: periodLabel(totals.key, view, true),
    fullLabel: periodLabel(totals.key, view),
    revenue: totals.revenue,
    expenses: totals.expenses,
    profit: totals.netProfit,
  }));

  const breakdown = expensesByCategory(period, view, expenses);
  const breakdownMax = Math.max(...breakdown.map((b) => b.total), 1);

  const owing = jobs.filter((j) => j.job_value > j.amount_paid);
  const totalOwedToUs = owing.reduce((sum, j) => sum + j.job_value - j.amount_paid, 0);
  const balances = founderBalances(expenses, repayments);
  const totalOwedToFounders = balances.reduce((sum, b) => sum + Math.max(b.owed, 0), 0);

  const periodJobs = jobs.filter((j) => periodKey(j.job_date, view) === period);
  const periodExpenses = expenses.filter((e) => periodKey(e.expense_date, view) === period);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Accounts</h1>
          <p className="text-sm text-charcoal/55">
            Work done, expenses, profit and founder loans for {label}. Both partners see the same numbers.
          </p>
        </div>
        <AccountsPeriodFilter view={view} period={period} />
      </div>

      {tableMissing ? (
        <div className="rounded-2xl border border-orange/40 bg-orange/5 p-5 text-sm text-navy">
          <p className="font-semibold">One-time setup needed for accounts</p>
          <p className="mt-1 text-charcoal/70">
            Paste this into the Supabase SQL editor and run it once. Until then, jobs and expenses can&apos;t be saved.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-navy p-4 text-xs text-white">{ACCOUNTS_SQL}</pre>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Revenue (work done)" value={formatNaira(current.revenue)}>
          <Change value={growth(current.revenue, previous.revenue)} /> vs {words.prev}
        </Kpi>
        <Kpi label="Expenses" value={formatNaira(current.expenses)}>
          <Change value={growth(current.expenses, previous.expenses)} invert /> vs {words.prev}
        </Kpi>
        <Kpi
          label={current.netProfit >= 0 ? "Net profit" : "Net loss"}
          value={formatNaira(Math.abs(current.netProfit))}
          tone={current.netProfit > 0 ? "good" : current.netProfit < 0 ? "bad" : undefined}
        >
          <Change value={growth(current.netProfit, previous.netProfit)} /> vs {words.prev}
        </Kpi>
        <Kpi label="Net margin" value={pct(margin(current.netProfit, current.revenue))}>
          Profit kept from every ₦100 of work
        </Kpi>
        <Kpi label="Gross profit" value={formatNaira(current.grossProfit)}>
          After equipment, installer labour and transport · {pct(margin(current.grossProfit, current.revenue))} margin
        </Kpi>
        <Kpi label="Jobs done" value={String(current.jobs)}>
          Average job {current.jobs > 0 ? formatNaira(current.revenue / current.jobs) : "–"}
        </Kpi>
        <Kpi label="Customers owe us" value={formatNaira(totalOwedToUs)} tone={totalOwedToUs > 0 ? "bad" : undefined}>
          {owing.length} unpaid {owing.length === 1 ? "balance" : "balances"}, all time
        </Kpi>
        <Kpi label="Business owes founders" value={formatNaira(totalOwedToFounders)}>
          Founder money not yet paid back
        </Kpi>
      </div>

      {lastYearSame ? (
        <p className="rounded-2xl border border-line bg-white px-5 py-3 text-sm text-charcoal/70">
          Same {view} last year ({periodLabel(sameLastYear(period), view)}): revenue {formatNaira(lastYearSame.revenue)},{" "}
          {lastYearSame.netProfit >= 0 ? "profit" : "loss"} {formatNaira(Math.abs(lastYearSame.netProfit))}. Revenue
          change year on year: <Change value={growth(current.revenue, lastYearSame.revenue)} />
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-lg font-bold text-navy">
            Revenue and expenses, {view === "year" ? "by year" : `${period.slice(0, 4)} by ${view}`}
          </h2>
          <div className="mt-4">
            <RevenueExpenseChart data={chartData} />
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-lg font-bold text-navy">
            Profit and loss, {view === "year" ? "by year" : `${period.slice(0, 4)} by ${view}`}
          </h2>
          <div className="mt-4">
            <ProfitChart data={chartData} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-charcoal/45">
            <tr>
              <th className="px-4 py-2.5">Period</th>
              <th className="px-4 py-2.5 text-right">Jobs</th>
              <th className="px-4 py-2.5 text-right">Revenue</th>
              <th className="px-4 py-2.5 text-right">Expenses</th>
              <th className="px-4 py-2.5 text-right">Profit / loss</th>
              <th className="px-4 py-2.5 text-right">Margin</th>
              <th className="px-4 py-2.5 text-right">{words.growth} revenue</th>
              <th className="px-4 py-2.5 text-right">{words.growth} profit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map(({ totals, revenueGrowth, profitGrowth }) => (
              <tr key={totals.key} className={totals.key === period ? "bg-orange/5" : ""}>
                <td className="px-4 py-2.5 font-medium text-navy">{periodLabel(totals.key, view)}</td>
                <td className="px-4 py-2.5 text-right font-mono-num text-charcoal/70">{totals.jobs}</td>
                <td className="px-4 py-2.5 text-right font-mono-num text-navy">{formatNaira(totals.revenue)}</td>
                <td className="px-4 py-2.5 text-right font-mono-num text-charcoal/70">{formatNaira(totals.expenses)}</td>
                <td
                  className={`px-4 py-2.5 text-right font-mono-num font-semibold ${
                    totals.netProfit > 0 ? "text-green-700" : totals.netProfit < 0 ? "text-red-600" : "text-charcoal/50"
                  }`}
                >
                  {totals.netProfit < 0 ? "-" : ""}
                  {formatNaira(Math.abs(totals.netProfit))}
                </td>
                <td className="px-4 py-2.5 text-right font-mono-num text-charcoal/70">
                  {pct(margin(totals.netProfit, totals.revenue))}
                </td>
                <td className="px-4 py-2.5 text-right text-xs">
                  <Change value={revenueGrowth} />
                </td>
                <td className="px-4 py-2.5 text-right text-xs">
                  <Change value={profitGrowth} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-lg font-bold text-navy">Where the money went, {label}</h2>
          <p className="mt-1 text-xs text-charcoal/55">Job costs are marked. Everything else is running costs.</p>
          {breakdown.length > 0 ? (
            <div className="mt-5 space-y-3">
              {breakdown.map((row) => (
                <div key={row.category}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate pr-2 text-charcoal/70">
                      {row.label}
                      {row.direct ? <span className="ml-1.5 text-[10px] font-semibold uppercase text-navy/50">job cost</span> : null}
                    </span>
                    <span className="font-mono-num font-semibold text-navy">
                      {formatNaira(row.total)} · {((row.total / current.expenses) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-mist">
                    <div className="h-1.5 rounded-full bg-navy" style={{ width: `${(row.total / breakdownMax) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm text-charcoal/50">No expenses recorded for {label}.</p>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-lg font-bold text-navy">Customers who still owe us</h2>
          <p className="mt-1 text-xs text-charcoal/55">All time, biggest balance first.</p>
          {owing.length > 0 ? (
            <ul className="mt-4 divide-y divide-line text-sm">
              {owing
                .sort((a, b) => b.job_value - b.amount_paid - (a.job_value - a.amount_paid))
                .slice(0, 10)
                .map((job) => (
                  <li key={job.id} className="flex justify-between gap-3 py-2">
                    <span>
                      <span className="font-medium text-navy">{job.customer}</span>{" "}
                      <span className="text-xs text-charcoal/50">
                        {job.job_date} · paid {formatNaira(job.amount_paid)} of {formatNaira(job.job_value)}
                      </span>
                    </span>
                    <span className="font-mono-num font-semibold text-red-600">{formatNaira(job.job_value - job.amount_paid)}</span>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-charcoal/50">Nobody owes us anything.</p>
          )}
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-lg font-bold text-navy">Founder loans</h2>
          <p className="text-sm text-charcoal/55">
            Money Omole or Idowu spent on the business from their own pocket, what the business has paid back, and
            what it still owes. All time, so nobody is short-changed.
          </p>
        </div>
        <FounderLoans balances={balances} repayments={repayments} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-lg font-bold text-navy">Work done, {label}</h2>
          <p className="text-sm text-charcoal/55">Change the period at the top to see other months or years.</p>
        </div>
        <JobsSection jobs={periodJobs} periodLabel={label} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-lg font-bold text-navy">Expenses, {label}</h2>
        </div>
        <ExpensesSection expenses={periodExpenses} periodLabel={label} />
      </section>
    </div>
  );
}
