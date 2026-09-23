"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { deleteJobAction, saveJobAction, type AccountsFormState } from "@/actions/accounts";
import { todayIso, type JobRecord } from "@/lib/accounts-math";
import { formatNaira } from "@/lib/costing";

export const inputClass =
  "w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20";

const initialState: AccountsFormState = {};

function JobForm({ job, onDone }: { job?: JobRecord; onDone?: () => void }) {
  const [state, formAction, pending] = useActionState(saveJobAction.bind(null, job?.id ?? null), initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.success) return;
    if (onDone) onDone();
    else formRef.current?.reset();
  }, [state, onDone]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
      <label className="text-xs font-semibold text-navy">
        Date
        <input type="date" name="date" required defaultValue={job?.job_date ?? todayIso()} className={`${inputClass} mt-1`} />
      </label>
      <label className="text-xs font-semibold text-navy lg:col-span-2">
        Customer or job
        <input name="customer" required defaultValue={job?.customer} className={`${inputClass} mt-1`} placeholder="e.g. Mr Adeyemi, Lekki" />
      </label>
      <label className="text-xs font-semibold text-navy lg:col-span-3">
        Work done
        <input
          name="description"
          defaultValue={job?.description ?? ""}
          className={`${inputClass} mt-1`}
          placeholder="e.g. 5kVA inverter, 10kWh lithium, 6 panels"
        />
      </label>
      <label className="text-xs font-semibold text-navy">
        Job value (₦)
        <input name="jobValue" required inputMode="numeric" defaultValue={job?.job_value} className={`${inputClass} mt-1`} />
      </label>
      <label className="text-xs font-semibold text-navy">
        Paid so far (₦)
        <input name="amountPaid" inputMode="numeric" defaultValue={job?.amount_paid ?? ""} className={`${inputClass} mt-1`} placeholder="0" />
      </label>
      <label className="text-xs font-semibold text-navy lg:col-span-2">
        Notes (optional)
        <input name="notes" defaultValue={job?.notes ?? ""} className={`${inputClass} mt-1`} />
      </label>
      <div className="flex items-end gap-3 lg:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-orange px-5 py-2 text-xs font-semibold text-white hover:bg-orange-dark disabled:opacity-60"
        >
          {pending ? "Saving..." : job ? "Save" : "Add job"}
        </button>
        {onDone ? (
          <button type="button" onClick={onDone} className="text-xs font-semibold text-charcoal/50 hover:text-navy">
            Cancel
          </button>
        ) : null}
        {state.error ? <p className="text-xs font-medium text-red-600">{state.error}</p> : null}
        {state.success && !onDone ? <p className="text-xs font-medium text-green-600">{state.success}</p> : null}
      </div>
    </form>
  );
}

function JobRow({ job }: { job: JobRecord }) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const balance = job.job_value - job.amount_paid;

  if (editing) {
    return (
      <tr className="bg-mist/60">
        <td colSpan={7} className="px-4 py-4">
          <JobForm job={job} onDone={() => setEditing(false)} />
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td className="whitespace-nowrap px-4 py-2.5 text-charcoal/60">{job.job_date}</td>
      <td className="px-4 py-2.5">
        <span className="font-medium text-navy">{job.customer}</span>
        {job.notes ? <span className="block text-xs text-charcoal/50">{job.notes}</span> : null}
      </td>
      <td className="px-4 py-2.5 text-charcoal/70">{job.description}</td>
      <td className="px-4 py-2.5 text-right font-mono-num text-navy">{formatNaira(job.job_value)}</td>
      <td className="px-4 py-2.5 text-right font-mono-num text-charcoal/70">{formatNaira(job.amount_paid)}</td>
      <td className={`px-4 py-2.5 text-right font-mono-num ${balance > 0 ? "font-semibold text-red-600" : "text-charcoal/40"}`}>
        {balance > 0 ? formatNaira(balance) : "Paid"}
      </td>
      <td className="px-4 py-2.5">
        <div className="flex justify-end gap-3 whitespace-nowrap">
          <button type="button" onClick={() => setEditing(true)} className="text-xs font-semibold text-orange">
            Edit
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              if (confirm(`Delete the job for ${job.customer}?`)) {
                startTransition(() => deleteJobAction(job.id, `${job.customer} ${formatNaira(job.job_value)}`));
              }
            }}
            className="text-xs font-semibold text-charcoal/50 hover:text-red-600"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
}

export function JobsSection({ jobs, periodLabel }: { jobs: JobRecord[]; periodLabel: string }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line bg-white p-5">
        <h3 className="font-display text-base font-bold text-navy">Record work done</h3>
        <p className="mt-1 text-xs text-charcoal/55">
          One row per job. The job value counts as revenue on the job date. Update &quot;paid so far&quot; as the
          customer pays, anything left shows as money owed to us.
        </p>
        <div className="mt-4">
          <JobForm />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-charcoal/45">
            <tr>
              <th className="px-4 py-2.5">Date</th>
              <th className="px-4 py-2.5">Customer</th>
              <th className="px-4 py-2.5">Work done</th>
              <th className="px-4 py-2.5 text-right">Value</th>
              <th className="px-4 py-2.5 text-right">Paid</th>
              <th className="px-4 py-2.5 text-right">Balance</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {jobs.map((job) => (
              <JobRow key={job.id} job={job} />
            ))}
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-charcoal/50">
                  No jobs recorded for {periodLabel}.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
