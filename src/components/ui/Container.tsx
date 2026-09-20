import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-orange/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-orange-dark">
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow ? (
        <div className="mb-4">
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      ) : null}
      <h2
        className={`font-display text-3xl font-bold leading-tight sm:text-4xl ${light ? "text-white" : "text-navy"}`}
      >
        {title}
      </h2>
      {description ? (
        <p className={`mt-4 text-base leading-relaxed ${light ? "text-white/75" : "text-charcoal/75"}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
