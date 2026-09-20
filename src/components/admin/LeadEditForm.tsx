"use client";

import { useActionState } from "react";
import { updateLeadAction, type LeadFormState } from "@/actions/leads";
import { LAGOS_AREAS, PROPERTY_TYPES, SERVICES, BUDGET_RANGES } from "@/lib/constants";
import type { Lead } from "@/lib/leads";

const initialState: LeadFormState = {};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20";

export function LeadEditForm({ lead }: { lead: Lead }) {
  const action = updateLeadAction.bind(null, lead.id);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-5 rounded-2xl border border-line bg-white p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-charcoal/80">Full name</label>
          <input name="name" required defaultValue={lead.name} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal/80">Phone / WhatsApp number</label>
          <input name="phone" required defaultValue={lead.phone} className={inputClass} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-charcoal/80">Area in Lagos</label>
          <select name="area" required defaultValue={lead.area} className={inputClass}>
            {LAGOS_AREAS.map((area) => (
              <option key={area.slug} value={area.name}>
                {area.name}
              </option>
            ))}
            <option value="Other Lagos area">Other Lagos area</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal/80">Property type</label>
          <select name="propertyType" required defaultValue={lead.property_type} className={inputClass}>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-charcoal/80">Service needed</label>
          <select name="serviceInterest" required defaultValue={lead.service_interest} className={inputClass}>
            {SERVICES.map((service) => (
              <option key={service.slug} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal/80">Estimated budget</label>
          <select name="budgetRange" defaultValue={lead.budget_range ?? ""} className={inputClass}>
            <option value="">Prefer not to say</option>
            {BUDGET_RANGES.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal/80">Notes / message</label>
        <textarea name="message" rows={3} defaultValue={lead.message ?? ""} className={inputClass} />
      </div>

      {state.error ? <p className="text-sm font-medium text-red-600">{state.error}</p> : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-orange px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-dark disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save changes"}
        </button>
        <a href="/admin/leads" className="text-sm font-semibold text-charcoal/60 hover:text-navy">
          Cancel
        </a>
      </div>
    </form>
  );
}
