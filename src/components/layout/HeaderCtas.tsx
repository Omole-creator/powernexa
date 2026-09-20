"use client";

import { PHONE_DISPLAY, PHONE_E164 } from "@/lib/constants";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";
import { track } from "@/lib/track-client";

export function HeaderCtas() {
  return (
    <div className="hidden items-center gap-3 lg:flex">
      <a
        href={`tel:${PHONE_E164}`}
        onClick={() => track("call_click")}
        className="font-mono-num text-sm font-semibold text-navy hover:text-orange"
      >
        {PHONE_DISPLAY}
      </a>
      <a
        href={buildWhatsAppUrl(defaultWhatsAppMessage())}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("whatsapp_click")}
        className="inline-flex items-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-dark"
      >
        WhatsApp Us
      </a>
    </div>
  );
}
