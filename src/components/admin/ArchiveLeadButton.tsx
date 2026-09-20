"use client";

import { useTransition } from "react";
import { archiveLeadAction, unarchiveLeadAction } from "@/actions/leads";

export function ArchiveLeadButton({
  leadId,
  name,
  archived,
}: {
  leadId: number;
  name: string;
  archived: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  if (archived) {
    return (
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => unarchiveLeadAction(leadId, name))}
        className="text-xs font-semibold text-navy hover:text-orange disabled:opacity-50"
      >
        {isPending ? "Restoring..." : "Restore"}
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm(`Archive the lead from "${name}"? It will be hidden from this list but not deleted.`)) {
          startTransition(() => archiveLeadAction(leadId, name));
        }
      }}
      className="text-xs font-semibold text-charcoal/60 hover:text-red-600 disabled:opacity-50"
    >
      {isPending ? "Archiving..." : "Archive"}
    </button>
  );
}
