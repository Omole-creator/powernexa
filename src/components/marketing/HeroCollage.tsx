"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

// Three overlapping installation photos under the hero CTAs, modelled on the
// reference site's hero: the centre card is larger and in front, the side
// cards tuck behind it tilted outwards. The owner chose these three photos
// to sit together here (an explicit exception to the one-photo-per-section
// rule), with the wiring photo in the middle.
const CARDS = [
  {
    src: "/images/installation-battery-room-2.jpg",
    alt: "A technician wiring a wall-mounted inverter to a battery rack",
    position: "object-[38%_center]",
    frame: "w-[38%] -mr-8 z-10 -rotate-6 translate-y-6",
    delay: 500,
    drift: 0.025,
  },
  {
    src: "/images/solar-panel-inverter-wiring.jpg",
    alt: "Rooftop solar panels wired to a wall-mounted inverter",
    position: "object-center",
    frame: "w-[42%] z-20 -translate-y-2",
    delay: 650,
    drift: -0.02,
  },
  {
    src: "/images/installation-battery-room-1.jpg",
    alt: "A technician connecting cables between an inverter and its batteries",
    position: "object-[68%_center]",
    frame: "w-[38%] -ml-8 z-10 rotate-6 translate-y-6",
    delay: 800,
    drift: 0.025,
  },
];

export function HeroCollage() {
  const ref = useRef<HTMLDivElement>(null);

  // Scroll-linked drift: the side cards sink and the centre card lifts at
  // slightly different speeds, which gives the stack some depth. Written to a
  // CSS variable on one element, once per frame, so React never re-renders.
  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      node.style.setProperty("--scroll", String(Math.min(window.scrollY, 900)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative mx-auto mt-14 flex w-full max-w-3xl items-center justify-center px-2 pb-16 sm:mt-16 sm:pb-24"
    >
      {CARDS.map((card, index) => (
        <div
          key={card.src}
          className={`hero-rise group relative shrink-0 transition-[rotate,translate] duration-500 ease-out hover:z-30 hover:rotate-0 hover:-translate-y-4 ${card.frame}`}
          style={{ animationDelay: `${card.delay}ms` }}
        >
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl shadow-black/30 outline outline-1 outline-white/20 will-change-transform"
            style={{ transform: `translate3d(0, calc(var(--scroll, 0) * ${card.drift}px), 0)` }}
          >
            <Image
              src={card.src}
              alt={card.alt}
              fill
              priority={index === 1}
              sizes="(min-width: 768px) 320px, 42vw"
              className={`object-cover ${card.position} transition-transform duration-700 ease-out group-hover:scale-105`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
