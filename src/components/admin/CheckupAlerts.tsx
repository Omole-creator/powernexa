"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { formatDate } from "@/lib/quote";
import type { DueCheckup } from "@/lib/customer-systems";

const SEEN_KEY = "pnx-checkup-alert-seen";

const noSubscribe = () => () => {};
function readSeen(): string {
  try {
    return sessionStorage.getItem(SEEN_KEY) ?? "";
  } catch {
    return "";
  }
}

function when(daysLeft: number): string {
  if (daysLeft < 0) return `${-daysLeft} day${daysLeft === -1 ? "" : "s"} overdue`;
  if (daysLeft === 0) return "due today";
  return `due in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`;
}

// Blinking bell in the admin header. When check-ups are due or overdue it
// pops open by itself once per browser session (and again whenever the list
// changes), then stays one tap away.
export function CheckupAlerts({ items, windowDays }: { items: DueCheckup[]; windowDays: number }) {
  const signature = items.map((i) => `${i.systemId}:${i.number}`).join(",");
  // What this session last saw. null on the server, so the first render matches.
  const seen = useSyncExternalStore(noSubscribe, readSeen, () => null);
  // Set once the admin opens or closes the panel themselves.
  const [manual, setManual] = useState<boolean | null>(null);
  const autoOpen = signature !== "" && seen !== null && seen !== signature;
  const open = manual ?? autoOpen;

  const toggle = (next: boolean) => {
    try {
      sessionStorage.setItem(SEEN_KEY, signature);
    } catch {
      // Storage blocked: the panel just opens again next time.
    }
    setManual(next);
  };

  const overdue = items.some((i) => i.daysLeft < 0);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => toggle(!open)}
        aria-label={items.length ? `${items.length} check-up${items.length === 1 ? "" : "s"} to book` : "No check-ups due"}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-lg hover:border-orange"
      >
        <span aria-hidden="true">🔔</span>
        {items.length > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center">
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${overdue ? "bg-red-500" : "bg-orange"} opacity-75`} />
            <span
              className={`relative inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold text-white ${overdue ? "bg-red-600" : "bg-orange"}`}
            >
              {items.length}
            </span>
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-line bg-white p-4 shadow-[0_24px_60px_-20px_rgba(9,43,76,0.4)]">
          <div className="flex items-start justify-between gap-3">
            <p className="font-display text-sm font-bold text-navy">
              {items.length ? "Free check-ups to book" : "No check-ups due"}
            </p>
            <button type="button" onClick={() => toggle(false)} className="text-charcoal/40 hover:text-navy" aria-label="Close">
              ✕
            </button>
          </div>
          {items.length === 0 ? (
            <p className="mt-2 text-xs text-charcoal/55">Nothing due in the next {windowDays} days.</p>
          ) : (
            <ul className="mt-3 max-h-80 space-y-2 overflow-y-auto">
              {items.map((item) => (
                <li key={`${item.systemId}-${item.number}`}>
                  <Link
                    href={`/admin/systems/${item.systemId}`}
                    onClick={() => toggle(false)}
                    className={`block rounded-xl border px-3 py-2 text-sm hover:border-orange ${item.daysLeft < 0 ? "border-red-200 bg-red-50" : "border-line"}`}
                  >
                    <span className="font-semibold text-navy">{item.customerName}</span>
                    {item.address ? <span className="text-charcoal/50"> · {item.address}</span> : null}
                    <span className={`block text-xs ${item.daysLeft < 0 ? "font-semibold text-red-700" : "text-charcoal/60"}`}>
                      Check-up {item.number}, {when(item.daysLeft)} ({formatDate(item.dueOn)})
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-[11px] text-charcoal/45">
            Shows from {windowDays} days before each check-up until you log it as a &quot;Free check-up&quot;.
          </p>
        </div>
      ) : null}
    </div>
  );
}
