"use client";

import { usePathname } from "next/navigation";
import { PHONE_DISPLAY_GBP, PHONE_E164_GBP } from "@/lib/constants";

// The Google Business Profile number, shown in the footer on the homepage only.
export function HomeFooterPhone() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <a href={`tel:${PHONE_E164_GBP}`} className="mt-0.5 block font-mono-num text-sm text-white hover:text-orange">
      {PHONE_DISPLAY_GBP}
    </a>
  );
}
