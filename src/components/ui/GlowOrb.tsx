export function GlowOrb({
  className = "",
  color = "orange",
}: {
  className?: string;
  color?: "orange" | "yellow" | "navy";
}) {
  const tint = {
    orange: "bg-orange/20",
    yellow: "bg-yellow/25",
    navy: "bg-navy/15",
  }[color];

  return <div aria-hidden="true" className={`pointer-events-none absolute rounded-full blur-3xl ${tint} ${className}`} />;
}
