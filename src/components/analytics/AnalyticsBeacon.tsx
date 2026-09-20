"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { track } from "@/lib/track-client";

export function AnalyticsBeacon() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    track("page_view", pathname);
  }, [pathname, searchParams]);

  return null;
}
