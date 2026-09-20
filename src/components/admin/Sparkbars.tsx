export function Sparkbars({ data }: { data: { day: string; count: number }[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-charcoal/50">No page views recorded yet.</p>;
  }

  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex h-32 items-end gap-1">
      {data.map((point) => (
        <div key={point.day} className="group relative flex-1">
          <div
            className="w-full rounded-t bg-orange/80 transition group-hover:bg-orange"
            style={{ height: `${Math.max((point.count / max) * 100, 3)}%` }}
          />
          <div className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded bg-navy px-2 py-1 text-[11px] text-white opacity-0 transition group-hover:opacity-100">
            {point.day}: {point.count}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Barlist({ data, labelKey, countKey }: { data: Record<string, unknown>[]; labelKey: string; countKey: string }) {
  const max = Math.max(...data.map((d) => Number(d[countKey])), 1);

  if (data.length === 0) {
    return <p className="text-sm text-charcoal/50">No data yet.</p>;
  }

  return (
    <div className="space-y-3">
      {data.map((row, index) => {
        const label = String(row[labelKey]);
        const count = Number(row[countKey]);
        return (
          <div key={`${label}-${index}`}>
            <div className="flex items-center justify-between text-xs">
              <span className="truncate pr-2 text-charcoal/70">{label}</span>
              <span className="font-mono-num font-semibold text-navy">{count}</span>
            </div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-mist">
              <div className="h-1.5 rounded-full bg-navy" style={{ width: `${(count / max) * 100}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
