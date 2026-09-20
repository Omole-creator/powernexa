export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">{label}</p>
      <p className="mt-2 font-mono-num text-3xl font-bold text-navy">{value}</p>
      {hint ? <p className="mt-1 text-xs text-charcoal/45">{hint}</p> : null}
    </div>
  );
}
