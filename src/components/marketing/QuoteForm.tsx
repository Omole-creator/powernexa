"use client";

import { useActionState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { submitQuote, type QuoteFormState } from "@/actions/quote";
import { BUDGET_RANGES, LAGOS_AREAS, PROPERTY_TYPES, SERVICES } from "@/lib/constants";

const initialState: QuoteFormState = { success: false };

export function QuoteForm({ variant = "full" }: { variant?: "full" | "compact" }) {
  const pathname = usePathname();
  const [state, formAction, pending] = useActionState(submitQuote, initialState);
  const openedRef = useRef(false);
  const utmSourceRef = useRef<HTMLInputElement>(null);
  const utmMediumRef = useRef<HTMLInputElement>(null);
  const utmCampaignRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (utmSourceRef.current) utmSourceRef.current.value = params.get("utm_source") ?? "";
    if (utmMediumRef.current) utmMediumRef.current.value = params.get("utm_medium") ?? "";
    if (utmCampaignRef.current) utmCampaignRef.current.value = params.get("utm_campaign") ?? "";
  }, []);

  useEffect(() => {
    if (state.success && state.whatsappUrl && !openedRef.current) {
      openedRef.current = true;
      window.open(state.whatsappUrl, "_blank", "noopener,noreferrer");
    }
  }, [state]);

  if (state.success) {
    return (
      <div className="rounded-2xl border-2 border-orange/30 bg-orange/5 p-8 text-center">
        <h3 className="font-display text-2xl font-bold text-navy">Request received.</h3>
        <p className="mt-2 text-charcoal/75">
          We opened WhatsApp with your details filled in. If it didn&apos;t open, tap the button below to send it
          yourself, we reply fast during business hours.
        </p>
        <a
          href={state.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-[#25D366] px-7 py-3.5 font-semibold text-white transition hover:brightness-95"
        >
          Continue to WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="h-1.5 w-16 rounded-full bg-gradient-to-r from-orange to-yellow" />
      <input type="hidden" name="sourcePage" value={pathname} />
      <input type="hidden" name="utmSource" ref={utmSourceRef} defaultValue="" />
      <input type="hidden" name="utmMedium" ref={utmMediumRef} defaultValue="" />
      <input type="hidden" name="utmCampaign" ref={utmCampaignRef} defaultValue="" />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="name" error={state.fieldErrors?.name}>
          <input name="name" required className={inputClass} placeholder="e.g. Adaeze Okonkwo" />
        </Field>
        <Field label="Phone / WhatsApp number" name="phone" error={state.fieldErrors?.phone}>
          <input name="phone" required className={inputClass} placeholder="080..." inputMode="tel" />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Area in Lagos" name="area" error={state.fieldErrors?.area}>
          <select name="area" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Select your area
            </option>
            {LAGOS_AREAS.map((area) => (
              <option key={area.slug} value={area.name}>
                {area.name}
              </option>
            ))}
            <option value="Other Lagos area">Other Lagos area</option>
          </select>
        </Field>
        <Field label="Property type" name="propertyType" error={state.fieldErrors?.propertyType}>
          <select name="propertyType" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Select property type
            </option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Service needed" name="serviceInterest" error={state.fieldErrors?.serviceInterest}>
          <select name="serviceInterest" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Select a service
            </option>
            {SERVICES.map((service) => (
              <option key={service.slug} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Estimated budget (optional)" name="budgetRange">
          <select name="budgetRange" defaultValue="" className={inputClass}>
            <option value="">Prefer not to say</option>
            {BUDGET_RANGES.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {variant === "full" ? (
        <Field label="Tell us more (optional)" name="message">
          <textarea
            name="message"
            rows={3}
            className={inputClass}
            placeholder="e.g. I want backup for 2 ACs, a fridge, and lights for 8 hours."
          />
        </Field>
      ) : null}

      {state.error ? <p className="text-sm font-medium text-red-600">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-orange px-6 py-3.5 font-semibold text-white transition hover:bg-orange-dark disabled:opacity-60"
      >
        {pending ? "Sending..." : "Get my free quote on WhatsApp"}
      </button>
      <p className="text-center text-xs text-charcoal/50">
        We&apos;ll open WhatsApp with your details ready to send. No spam, ever.
      </p>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border-2 border-line bg-mist px-4 py-2.5 text-sm text-charcoal outline-none transition focus:border-orange focus:bg-white focus:ring-4 focus:ring-orange/15";

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={name} className="block text-sm">
      <span className="mb-1.5 block font-semibold text-navy">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs font-medium text-red-600">{error}</span> : null}
    </label>
  );
}
