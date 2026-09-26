"use client";

import { useState, useTransition } from "react";
import { deleteSystemAction } from "@/actions/customer-systems";

export function SystemLinkCard({ link, whatsappUrl }: { link: string; whatsappUrl: string | null }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-2xl border-2 border-orange/30 bg-orange/5 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-orange">Customer&apos;s private link</p>
      <p className="mt-2 break-all font-mono text-sm text-navy">{link}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="rounded-full bg-navy px-4 py-1.5 text-xs font-semibold text-white"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#25D366] px-4 py-1.5 text-xs font-semibold text-white"
          >
            Send on WhatsApp
          </a>
        ) : (
          <span className="self-center text-xs text-charcoal/50">Add a phone number to send it on WhatsApp.</span>
        )}
        <a href={link} target="_blank" rel="noopener" className="self-center text-xs font-semibold text-orange">
          Open their page
        </a>
      </div>
      <p className="mt-3 text-xs text-charcoal/55">Anyone with this link can see the page, so only send it to the customer.</p>
    </div>
  );
}

export function DeleteSystemButton({ id, label, short = false }: { id: number; label: string; short?: boolean }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm(`Delete ${label}'s My System page, its log and photos? Their link will stop working.`)) {
          startTransition(() => deleteSystemAction(id, label));
        }
      }}
      className="rounded-full border border-red-200 bg-white px-4 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
    >
      {isPending ? "Deleting..." : short ? "Delete" : "Delete this page"}
    </button>
  );
}
