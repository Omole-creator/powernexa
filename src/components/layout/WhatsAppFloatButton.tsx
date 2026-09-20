"use client";

import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";
import { track } from "@/lib/track-client";

export function WhatsAppFloatButton() {
  return (
    <a
      href={buildWhatsAppUrl(defaultWhatsAppMessage())}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_click")}
      aria-label="Chat with PowerNexa Solutions on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex h-15 w-15 items-center justify-center rounded-full bg-[#25D366] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.4)] transition-transform hover:scale-105 sm:bottom-7 sm:right-7"
      style={{ height: 60, width: 60 }}
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/50 motion-reduce:animate-none" />
      <svg viewBox="0 0 32 32" fill="white" className="h-8 w-8">
        <path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.3.63 4.45 1.73 6.3L4 29l7.86-1.7a12 12 0 0 0 4.16.74c6.62 0 12.02-5.4 12.02-12.02C28.04 8.4 22.64 3 16.02 3Zm0 21.9c-1.9 0-3.7-.5-5.26-1.44l-.38-.22-4.66 1 1.02-4.54-.25-.4a9.87 9.87 0 0 1-1.5-5.28c0-5.47 4.46-9.92 9.93-9.92 2.65 0 5.14 1.03 7.02 2.9a9.86 9.86 0 0 1 2.9 7.02c0 5.47-4.45 9.93-9.92 9.93Zm5.44-7.44c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.9-2.2-.24-.57-.48-.5-.67-.5-.17 0-.37-.02-.57-.02-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.13 3.25 5.16 4.55.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.76-.72 2-1.4.25-.7.25-1.3.17-1.4-.07-.13-.27-.2-.57-.35Z" />
      </svg>
    </a>
  );
}
