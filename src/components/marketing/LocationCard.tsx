import Link from "next/link";
import type { LagosArea } from "@/lib/constants";
import { MapPinIcon } from "./Icons";

export function LocationCard({ area }: { area: LagosArea }) {
  return (
    <Link
      href={`/locations/${area.slug}`}
      className="group flex flex-col justify-between rounded-2xl border border-line bg-mist p-6 transition hover:border-orange/40 hover:bg-white hover:shadow-[0_20px_40px_-20px_rgba(9,43,76,0.2)]"
    >
      <div>
        <div className="flex items-center gap-2 text-orange">
          <MapPinIcon className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Lagos</span>
        </div>
        <h3 className="mt-3 font-display text-lg font-bold text-navy">{area.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{area.blurb}</p>
      </div>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy group-hover:text-orange">
        Solar installers in {area.name} <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
