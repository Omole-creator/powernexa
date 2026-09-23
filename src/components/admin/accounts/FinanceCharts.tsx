import { formatNaira } from "@/lib/costing";

// Two series only, checked with the dataviz palette validator: a mid blue
// for revenue (navy itself is too dark to read as a colour) and brand orange
// for expenses. Orange is below 3:1 on white, so every value is also in the
// table under the charts.
const REVENUE = "#1F6FB2";
const EXPENSES = "#F58220";
const PROFIT = "#1F8A5B";
const LOSS = "#D1453B";

export type ChartPoint = { label: string; fullLabel: string; revenue: number; expenses: number; profit: number };

export function compactNaira(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}₦${(abs / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1).replace(/\.0$/, "")}m`;
  if (abs >= 1_000) return `${sign}₦${Math.round(abs / 1_000)}k`;
  return `${sign}₦${Math.round(abs)}`;
}

function Tooltip({ point }: { point: ChartPoint }) {
  return (
    <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-navy px-3 py-2 text-[11px] leading-relaxed text-white opacity-0 shadow-lg transition group-hover:opacity-100">
      <p className="font-semibold">{point.fullLabel}</p>
      <p>Revenue: {formatNaira(point.revenue)}</p>
      <p>Expenses: {formatNaira(point.expenses)}</p>
      <p>
        {point.profit >= 0 ? "Profit" : "Loss"}: {formatNaira(Math.abs(point.profit))}
      </p>
    </div>
  );
}

function Legend({ items }: { items: { color: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-charcoal/70">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: item.color }} aria-hidden="true" />
          {item.label}
        </span>
      ))}
    </div>
  );
}

export function RevenueExpenseChart({ data }: { data: ChartPoint[] }) {
  const max = Math.max(...data.flatMap((d) => [d.revenue, d.expenses]), 1);

  return (
    <div>
      <Legend
        items={[
          { color: REVENUE, label: "Revenue" },
          { color: EXPENSES, label: "Expenses" },
        ]}
      />
      <div className="relative mt-4 h-56">
        {[1, 0.5].map((f) => (
          <div key={f} className="absolute inset-x-0 border-t border-dashed border-line" style={{ bottom: `${f * 100}%` }}>
            <span className="absolute -top-2 left-0 bg-white pr-1 text-[10px] text-charcoal/40">{compactNaira(max * f)}</span>
          </div>
        ))}
        <div className="absolute inset-x-0 bottom-0 border-t border-line" />
        <div className="absolute inset-0 flex items-end gap-2 pl-10">
          {data.map((point) => (
            <div key={point.label} className="group relative flex h-full flex-1 items-end justify-center gap-0.5">
              <div
                className="w-full max-w-5 rounded-t-[4px] transition group-hover:opacity-80"
                style={{ background: REVENUE, height: `${point.revenue > 0 ? Math.max((point.revenue / max) * 100, 1.5) : 0}%` }}
              />
              <div
                className="w-full max-w-5 rounded-t-[4px] transition group-hover:opacity-80"
                style={{ background: EXPENSES, height: `${point.expenses > 0 ? Math.max((point.expenses / max) * 100, 1.5) : 0}%` }}
              />
              <Tooltip point={point} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex gap-2 pl-10">
        {data.map((point) => (
          <span key={point.label} className="flex-1 text-center text-[10px] text-charcoal/50">
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// Profit above the zero line, loss below it, on one shared scale.
export function ProfitChart({ data }: { data: ChartPoint[] }) {
  const maxUp = Math.max(...data.map((d) => d.profit), 0);
  const maxDown = Math.max(...data.map((d) => -d.profit), 0);
  const range = maxUp + maxDown || 1;
  const zero = (maxDown / range) * 100; // % from the bottom

  return (
    <div>
      <Legend
        items={[
          { color: PROFIT, label: "Profit" },
          { color: LOSS, label: "Loss" },
        ]}
      />
      <div className="relative mt-4 h-40">
        <div className="absolute inset-x-0 border-t border-charcoal/30" style={{ bottom: `${zero}%` }}>
          <span className="absolute -top-2 left-0 bg-white pr-1 text-[10px] text-charcoal/40">₦0</span>
        </div>
        <div className="absolute inset-0 flex gap-2 pl-10">
          {data.map((point) => {
            const height = (Math.abs(point.profit) / range) * 100;
            const up = point.profit >= 0;
            return (
              <div key={point.label} className="group relative flex h-full flex-1 justify-center">
                {point.profit !== 0 ? (
                  <div
                    className={`absolute w-full max-w-8 transition group-hover:opacity-80 ${up ? "rounded-t-[4px]" : "rounded-b-[4px]"}`}
                    style={{
                      background: up ? PROFIT : LOSS,
                      height: `${Math.max(height, 1.5)}%`,
                      bottom: up ? `${zero}%` : `${zero - Math.max(height, 1.5)}%`,
                    }}
                  />
                ) : null}
                <Tooltip point={point} />
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-2 flex gap-2 pl-10">
        {data.map((point) => (
          <span key={point.label} className="flex-1 text-center text-[10px] text-charcoal/50">
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
}
