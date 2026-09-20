"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { NAV_LINKS, PHONE_DISPLAY, PHONE_E164 } from "@/lib/constants";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";
import { track } from "@/lib/track-client";

const noopSubscribe = () => () => {};

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  // True only once hydrated on the client, so the portal never renders during SSR.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative z-[70] flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-navy/15 bg-white"
      >
        <span
          className={`block h-0.5 w-5 bg-navy transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
        />
        <span className={`block h-0.5 w-5 bg-navy transition-opacity ${open ? "opacity-0" : ""}`} />
        <span
          className={`block h-0.5 w-5 bg-navy transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
        />
      </button>

      {mounted && open
        ? createPortal(
            <div className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-navy px-6 pb-10 pt-24">
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-white/10 py-4 font-display text-2xl font-semibold text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 flex flex-col gap-3">
                <a
                  href={`tel:${PHONE_E164}`}
                  onClick={() => track("call_click")}
                  className="rounded-full border-2 border-white py-3 text-center font-semibold text-white"
                >
                  Call {PHONE_DISPLAY}
                </a>
                <a
                  href={buildWhatsAppUrl(defaultWhatsAppMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("whatsapp_click")}
                  className="rounded-full bg-orange py-3 text-center font-semibold text-white"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
