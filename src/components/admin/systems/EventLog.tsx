"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
import { addEventAction, deleteEventAction, type SystemFormState } from "@/actions/customer-systems";
import { EVENT_KINDS, eventKindLabel, todayLagos } from "@/lib/aftercare";
import { formatDate } from "@/lib/quote";
import type { SystemEvent } from "@/lib/customer-systems";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20";

const initialState: SystemFormState = {};

export function EventLog({ systemId, events }: { systemId: number; events: SystemEvent[] }) {
  const [state, formAction, pending] = useActionState(addEventAction.bind(null, systemId), initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <div className="space-y-4">
      <form ref={formRef} action={formAction} className="grid gap-3 sm:grid-cols-[auto_auto_1fr_auto] sm:items-end">
        <label className="text-xs font-semibold text-navy">
          Date
          <input type="date" name="date" required defaultValue={todayLagos()} className={`${inputClass} mt-1`} />
        </label>
        <label className="text-xs font-semibold text-navy">
          Kind
          <select name="kind" defaultValue="checkup" className={`${inputClass} mt-1`}>
            {EVENT_KINDS.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-semibold text-navy">
          What was done (the customer sees this)
          <input
            name="description"
            required
            className={`${inputClass} mt-1`}
            placeholder="e.g. Cleaned panels, tightened battery terminals"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-orange px-5 py-2 text-xs font-semibold text-white hover:bg-orange-dark disabled:opacity-60"
        >
          {pending ? "Adding..." : "Add"}
        </button>
      </form>
      {state.error ? <p className="text-xs font-medium text-red-600">{state.error}</p> : null}

      {events.length === 0 ? (
        <p className="text-sm text-charcoal/50">Nothing logged yet. Log each free check-up here so the customer sees it done.</p>
      ) : (
        <ul className="divide-y divide-line rounded-xl border border-line">
          {events.map((event) => (
            <EventRow key={event.id} event={event} systemId={systemId} />
          ))}
        </ul>
      )}
    </div>
  );
}

function EventRow({ event, systemId }: { event: SystemEvent; systemId: number }) {
  const [isPending, startTransition] = useTransition();
  return (
    <li className="flex items-start justify-between gap-4 px-4 py-2.5 text-sm">
      <div>
        <span className="font-medium text-navy">{eventKindLabel(event.kind)}</span>
        <span className="text-charcoal/50"> · {formatDate(event.event_date)}</span>
        <p className="text-charcoal/70">{event.description}</p>
      </div>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (confirm("Delete this entry?")) startTransition(() => deleteEventAction(event.id, systemId));
        }}
        className="shrink-0 text-xs font-semibold text-charcoal/50 hover:text-red-600"
      >
        {isPending ? "Deleting..." : "Delete"}
      </button>
    </li>
  );
}
