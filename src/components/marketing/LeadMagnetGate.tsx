"use client";

import { useActionState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { submitLeadMagnetSignup, type LeadMagnetFormState } from "@/actions/lead-magnet";
import { Eyebrow } from "@/components/ui/Container";
import type { LeadMagnet } from "@/lib/lead-magnets";

const initialState: LeadMagnetFormState = { success: false };

const inputClass =
  "w-full rounded-xl border-2 border-line bg-mist px-4 py-2.5 text-sm text-charcoal outline-none transition focus:border-orange focus:bg-white focus:ring-4 focus:ring-orange/15";

export function LeadMagnetGate({
  magnet,
  title,
  description,
}: {
  magnet: LeadMagnet;
  title: string;
  description: string;
}) {
  const pathname = usePathname();
  const [state, formAction, pending] = useActionState(submitLeadMagnetSignup, initialState);
  const openedRef = useRef(false);

  useEffect(() => {
    if (state.success && state.downloadUrl && !openedRef.current) {
      openedRef.current = true;
      window.open(state.downloadUrl, "_blank", "noopener,noreferrer");
    }
  }, [state]);

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-white p-7 shadow-[0_20px_50px_-24px_rgba(9,43,76,0.25)] sm:p-9">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-orange to-yellow" />

      {state.success && state.downloadUrl ? (
        <div className="text-center">
          <h3 className="font-display text-xl font-bold text-navy sm:text-2xl">Your checklist is ready.</h3>
          <p className="mt-2 text-sm text-charcoal/70">
            We opened it in a new tab. If it did not open, use the button below.
          </p>
          <a
            href={state.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-orange px-7 py-3 font-semibold text-white transition hover:bg-orange-dark"
          >
            Download the checklist
          </a>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 sm:items-center">
          <div>
            <Eyebrow>Free download</Eyebrow>
            <h3 className="mt-4 font-display text-xl font-bold text-navy sm:text-2xl">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{description}</p>
          </div>
          <form action={formAction} className="space-y-3">
            <input type="hidden" name="magnetSlug" value={magnet.slug} />
            <input type="hidden" name="sourcePage" value={pathname} />
            <input name="name" required placeholder="Full name" className={inputClass} />
            <input name="email" required type="email" placeholder="Email address" className={inputClass} />
            <input name="phone" required placeholder="Phone / WhatsApp number" inputMode="tel" className={inputClass} />
            {state.error ? <p className="text-sm font-medium text-red-600">{state.error}</p> : null}
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full bg-orange px-6 py-3 font-semibold text-white transition hover:bg-orange-dark disabled:opacity-60"
            >
              {pending ? "Sending..." : "Send me the checklist"}
            </button>
            <p className="text-center text-xs text-charcoal/50">
              We will only use this to send your checklist and occasional Lagos power tips. No spam.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
