"use client";

import { useTransition } from "react";
import { updateLeadStatusAction } from "@/actions/leads";

const STATUSES = ["new", "contacted", "quoted", "won", "lost"];

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  quoted: "bg-purple-100 text-purple-700",
  won: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
};

export function LeadStatusSelect({ leadId, status }: { leadId: number; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => startTransition(() => updateLeadStatusAction(leadId, e.target.value))}
      className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none ${STATUS_STYLES[status] ?? "bg-mist text-navy"}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
