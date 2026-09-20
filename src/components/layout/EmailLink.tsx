"use client";

import { track } from "@/lib/track-client";
import { CONTACT_EMAIL } from "@/lib/constants";

export function EmailLink({ className }: { className?: string }) {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} onClick={() => track("email_click")} className={className}>
      {CONTACT_EMAIL}
    </a>
  );
}
