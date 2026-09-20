import Link from "next/link";
import type { LagosArea } from "@/lib/constants";
import { MapPinIcon } from "./Icons";

export function LocationCard({ area }: { area: LagosArea }) {
  return (
    <Link
      href={`/locations/${area.slug}`}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] bg-white p-6 shadow-[0_1px_2px_rgba(9,43,76,0.06),0_10px_24px_-16px_rgba(9,43,76,0.16)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_1px_2px_rgba(9,43,76,0.08),0_24px_40px_-18px_rgba(9,43,76,0.3)]"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange/5 transition-transform duration-500 group-hover:scale-150" />
      <div className="relative">
        <div className="flex items-center gap-2 text-orange">
          <MapPinIcon className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Lagos</span>
        </div>
        <h3 className="mt-3 font-display text-lg font-bold text-navy">{area.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{area.blurb}</p>
      </div>
      <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy transition-all group-hover:gap-2.5 group-hover:text-orange">
        Solar installers in {area.name} <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
