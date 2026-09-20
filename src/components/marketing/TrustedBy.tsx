import { LAGOS_AREAS } from "@/lib/constants";

const ITEMS = LAGOS_AREAS.map((area) => area.name);

export function TrustedBy() {
  const track = [...ITEMS, ...ITEMS];

  return (
    <div className="border-y border-line bg-white py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 sm:flex-row sm:gap-6 sm:px-8">
        <p className="shrink-0 text-xs font-bold uppercase tracking-[0.14em] text-charcoal/45">
          Trusted across Lagos
        </p>
        <div className="group relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-8 group-hover:[animation-play-state:paused]">
            {track.map((name, index) => (
              <span key={`${name}-${index}`} className="shrink-0 text-sm font-semibold text-navy/70">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
