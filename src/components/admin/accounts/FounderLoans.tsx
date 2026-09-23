"use client";

import { useActionState, useTransition } from "react";
import { addRepaymentAction, deleteRepaymentAction, type AccountsFormState } from "@/actions/accounts";
import {
  FOUNDERS,
  expenseTotal,
  paidByLabel,
  todayIso,
  type ExpenseRecord,
  type RepaymentRecord,
} from "@/lib/accounts-math";
import { formatNaira } from "@/lib/costing";
import { inputClass } from "./JobsSection";

type Balance = (typeof FOUNDERS)[number] & {
  expenses: ExpenseRecord[];
  lent: number;
  repaid: number;
  owed: number;
};

const initialState: AccountsFormState = {};

function RepaymentRow({ repayment }: { repayment: RepaymentRecord }) {
  const [isPending, startTransition] = useTransition();
  return (
    <li className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-charcoal/60">
        {repayment.repaid_date}
        {repayment.notes ? ` · ${repayment.notes}` : ""}
      </span>
      <span className="flex items-center gap-3">
        <span className="font-mono-num text-green-700">{formatNaira(repayment.amount)}</span>
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            if (confirm("Delete this repayment?")) {
              startTransition(() =>
                deleteRepaymentAction(repayment.id, `${paidByLabel(repayment.founder)} ${formatNaira(repayment.amount)}`)
              );
            }
          }}
          className="text-[11px] font-semibold text-charcoal/40 hover:text-red-600"
        >
          Delete
        </button>
      </span>
    </li>
  );
}

function FounderCard({ balance, repayments }: { balance: Balance; repayments: RepaymentRecord[] }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-bold text-navy">{balance.label}</h3>
        <span className="text-xs font-semibold uppercase tracking-wide text-charcoal/45">{balance.role}</span>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-mist p-3">
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-charcoal/50">Spent</dt>
          <dd className="mt-1 font-mono-num text-sm font-bold text-navy">{formatNaira(balance.lent)}</dd>
        </div>
        <div className="rounded-xl bg-mist p-3">
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-charcoal/50">Paid back</dt>
          <dd className="mt-1 font-mono-num text-sm font-bold text-green-700">{formatNaira(balance.repaid)}</dd>
        </div>
        <div className={`rounded-xl p-3 ${balance.owed > 0 ? "bg-orange/10" : "bg-mist"}`}>
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-charcoal/50">Still owed</dt>
          <dd className={`mt-1 font-mono-num text-sm font-bold ${balance.owed > 0 ? "text-orange-dark" : "text-navy"}`}>
            {formatNaira(balance.owed)}
          </dd>
        </div>
      </dl>

      <h4 className="mt-5 text-xs font-semibold uppercase tracking-wide text-navy/70">What {balance.label} paid for</h4>
      {balance.expenses.length > 0 ? (
        <ul className="mt-2 max-h-64 divide-y divide-line overflow-y-auto text-sm">
          {balance.expenses.map((e) => (
            <li key={e.id} className="flex justify-between gap-3 py-1.5">
              <span>
                <span className="text-charcoal/50">{e.expense_date}</span> <span className="text-navy">{e.name}</span>
                {e.quantity !== 1 ? <span className="text-charcoal/50"> ({e.quantity} x {formatNaira(e.amount)})</span> : null}
              </span>
              <span className="font-mono-num text-navy">{formatNaira(expenseTotal(e))}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-charcoal/50">Nothing yet.</p>
      )}

      <h4 className="mt-5 text-xs font-semibold uppercase tracking-wide text-navy/70">Paid back by the business</h4>
      {repayments.length > 0 ? (
        <ul className="mt-2 divide-y divide-line text-sm">
          {repayments.map((r) => (
            <RepaymentRow key={r.id} repayment={r} />
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-charcoal/50">Nothing yet.</p>
      )}
    </div>
  );
}

function RepaymentForm() {
  const [state, formAction, pending] = useActionState(addRepaymentAction, initialState);
  return (
    <form action={formAction} className="grid gap-3 rounded-2xl border border-line bg-white p-5 sm:grid-cols-2 lg:grid-cols-5">
      <p className="text-xs text-charcoal/55 sm:col-span-2 lg:col-span-5">
        When the business pays a founder back, record it here. It comes off what the business owes them.
      </p>
      <label className="text-xs font-semibold text-navy">
        Date
        <input type="date" name="date" required defaultValue={todayIso()} className={`${inputClass} mt-1`} />
      </label>
      <label className="text-xs font-semibold text-navy">
        Paid back to
        <select name="founder" className={`${inputClass} mt-1`}>
          {FOUNDERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label} ({f.role})
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs font-semibold text-navy">
        Amount (₦)
        <input name="amount" required inputMode="numeric" className={`${inputClass} mt-1`} />
      </label>
      <label className="text-xs font-semibold text-navy">
        Notes (optional)
        <input name="notes" className={`${inputClass} mt-1`} placeholder="e.g. bank transfer" />
      </label>
      <div className="flex flex-wrap items-end gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-orange px-5 py-2 text-xs font-semibold text-white hover:bg-orange-dark disabled:opacity-60"
        >
          {pending ? "Saving..." : "Record repayment"}
        </button>
        {state.error ? <p className="text-xs font-medium text-red-600">{state.error}</p> : null}
        {state.success ? <p className="text-xs font-medium text-green-600">{state.success}</p> : null}
      </div>
    </form>
  );
}

export function FounderLoans({ balances, repayments }: { balances: Balance[]; repayments: RepaymentRecord[] }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {balances.map((balance) => (
          <FounderCard
            key={balance.value}
            balance={balance}
            repayments={repayments.filter((r) => r.founder === balance.value)}
          />
        ))}
      </div>
      <RepaymentForm />
    </div>
  );
}
