"use client";

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
