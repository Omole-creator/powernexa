const STATS = [
  { value: "100%", rest: "load-calculated, not guesswork" },
  { value: "Free", rest: "site visit & written quote" },
  { value: "Written", rest: "workmanship warranty" },
  { value: "Fast", rest: "response across Lagos" },
];

export function StatStrip({ light = false }: { light?: boolean }) {
  const valueColor = light ? "text-white" : "text-navy";
  const restColor = light ? "text-white/75" : "text-charcoal/70";

  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
      {STATS.map((stat) => (
        <li key={stat.rest} className="text-sm leading-snug sm:text-[15px]">
          <span className={`font-mono-num font-bold ${valueColor}`}>{stat.value}</span>{" "}
          <span className={restColor}>{stat.rest}</span>
        </li>
      ))}
    </ul>
  );
}
