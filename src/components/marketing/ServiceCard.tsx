import Link from "next/link";
import type { ServiceItem } from "@/lib/constants";
import { SERVICE_ICON_MAP } from "./Icons";

export function ServiceCard({ service }: { service: ServiceItem }) {
  const Icon = SERVICE_ICON_MAP[service.icon];
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col rounded-2xl border border-line bg-white p-7 transition hover:-translate-y-1 hover:border-orange/40 hover:shadow-[0_20px_40px_-20px_rgba(9,43,76,0.25)]"
    >
      <div className="panel-notch flex h-14 w-14 items-center justify-center bg-navy text-white">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mt-5 font-display text-xl font-bold text-navy">{service.name}</h3>
      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-charcoal/70">{service.summary}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-orange group-hover:gap-2.5">
        Learn more <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
