"use client";

import { useEffect } from "react";

// Opens the print window as soon as the quote has loaded (fonts and logo
// included), for the builder's "Download PDF" button.
export function AutoPrint() {
  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      setTimeout(() => {
        if (!cancelled) window.print();
      }, 400);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}

// "Download PDF" is the browser's own print dialog: pick "Save as PDF" as the
// printer (on Android Chrome: Share > Print > Save as PDF).
export function PrintButton({ label = "Download PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-orange px-5 py-2 text-sm font-semibold text-white hover:bg-orange-dark"
    >
      {label}
    </button>
  );
}
