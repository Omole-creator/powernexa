const STATS = [
  { value: "100%", label: "Load-calculated, not guesswork" },
  { value: "Free", label: "Site visit & written quote" },
  { value: "Written", label: "Workmanship warranty" },
  { value: "Fast", label: "Response across Lagos" },
];

export function StatStrip({ light = false }: { light?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
      {STATS.map((stat) => (
        <div key={stat.label} className="text-center sm:text-left">
          <p className={`font-mono-num text-3xl font-bold sm:text-4xl ${light ? "text-white" : "text-navy"}`}>
            {stat.value}
          </p>
          <p
            className={`mt-1 text-xs font-medium uppercase tracking-wide sm:text-sm sm:normal-case sm:tracking-normal ${
              light ? "text-white/70" : "text-charcoal/55"
            }`}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
