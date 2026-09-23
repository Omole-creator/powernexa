"use client";

import { useEffect, useRef, useState } from "react";

// Counts from 1 up to `to` the first time it scrolls into view. Screen
// readers and crawlers get the final figure straight away via the sr-only
// copy; people who prefer reduced motion see the final figure with no count.
export function CountUp({ to, suffix = "", duration = 1800 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(1);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setValue(to);
          return;
        }
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.max(1, Math.round(1 + (to - 1) * eased)));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, duration]);

  return (
    <span ref={ref}>
      <span aria-hidden="true" className="tabular-nums">
        {value.toLocaleString("en-NG")}
        {suffix}
      </span>
      <span className="sr-only">
        {to.toLocaleString("en-NG")}
        {suffix}
      </span>
    </span>
  );
}
