import Link from "next/link";
import type { ServiceItem } from "@/lib/constants";
import { SERVICE_ICON_MAP } from "./Icons";

export function ServiceCard({ service, featured = false }: { service: ServiceItem; featured?: boolean }) {
  const Icon = SERVICE_ICON_MAP[service.icon];

  if (featured) {
    return (
      <Link
        href={`/services/${service.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_1px_2px_rgba(9,43,76,0.06),0_12px_28px_-16px_rgba(9,43,76,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_1px_2px_rgba(9,43,76,0.08),0_28px_48px_-20px_rgba(9,43,76,0.32)] sm:flex-row"
      >
        <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-orange to-yellow transition-transform duration-300 group-hover:scale-x-100" />
        <div className="flex flex-1 flex-col p-7 sm:p-9">
          <div className="panel-notch flex h-14 w-14 shrink-0 items-center justify-center bg-gradient-to-br from-navy to-navy-ink text-white shadow-[0_10px_20px_-8px_rgba(9,43,76,0.5)]">
            <Icon className="h-7 w-7" />
          </div>
          <h3 className="mt-5 font-display text-2xl font-bold text-navy">{service.name}</h3>
          <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-charcoal/70">{service.summary}</p>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-orange transition-all group-hover:gap-2.5">
            Learn more <span aria-hidden="true">→</span>
          </span>
        </div>
        <div className="relative hidden w-56 shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-navy to-navy-ink sm:flex">
          <Icon className="pointer-events-none absolute -bottom-8 -right-8 h-44 w-44 text-white/10 transition-transform duration-500 group-hover:scale-110" />
          <div className="panel-notch relative flex h-20 w-20 items-center justify-center bg-gradient-to-br from-orange to-yellow text-white shadow-[0_14px_28px_-10px_rgba(245,130,32,0.55)] transition-transform duration-500 group-hover:scale-110">
            <Icon className="h-10 w-10" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[28px] bg-white p-7 shadow-[0_1px_2px_rgba(9,43,76,0.06),0_12px_28px_-16px_rgba(9,43,76,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_1px_2px_rgba(9,43,76,0.08),0_28px_48px_-20px_rgba(9,43,76,0.32)]"
    >
      <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-orange to-yellow transition-transform duration-300 group-hover:scale-x-100" />
      <div className="panel-notch flex h-14 w-14 shrink-0 items-center justify-center bg-gradient-to-br from-navy to-navy-ink text-white shadow-[0_10px_20px_-8px_rgba(9,43,76,0.5)]">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mt-5 font-display text-xl font-bold text-navy">{service.name}</h3>
      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-charcoal/70">{service.summary}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-orange transition-all group-hover:gap-2.5">
        Learn more <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
