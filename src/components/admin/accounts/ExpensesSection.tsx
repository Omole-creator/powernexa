"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { deleteExpenseAction, saveExpenseAction, type AccountsFormState } from "@/actions/accounts";
import {
  EXPENSE_CATEGORIES,
  FOUNDERS,
  categoryLabel,
  expenseTotal,
  paidByLabel,
  todayIso,
  type ExpenseRecord,
} from "@/lib/accounts-math";
import { formatNaira } from "@/lib/costing";
import { inputClass } from "./JobsSection";

const initialState: AccountsFormState = {};

function ExpenseForm({ expense, onDone }: { expense?: ExpenseRecord; onDone?: () => void }) {
  const [state, formAction, pending] = useActionState(saveExpenseAction.bind(null, expense?.id ?? null), initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [amount, setAmount] = useState(expense ? String(expense.amount) : "");
  const [quantity, setQuantity] = useState(expense ? String(expense.quantity) : "1");
  const total = (Number(amount.replace(/[,\s]/g, "")) || 0) * (Number(quantity) || 0);

  // The form resets its own uncontrolled fields after the action; the
  // controlled amount and quantity are cleared here, during render, when a
  // new successful result comes in.
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.success && !onDone) {
      setAmount("");
      setQuantity("1");
    }
  }

  useEffect(() => {
    if (!state.success) return;
    if (onDone) onDone();
    else (formRef.current?.elements.namedItem("name") as HTMLInputElement | null)?.focus();
  }, [state, onDone]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
      <label className="text-xs font-semibold text-navy">
        Date
        <input type="date" name="date" required defaultValue={expense?.expense_date ?? todayIso()} className={`${inputClass} mt-1`} />
      </label>
      <label className="text-xs font-semibold text-navy lg:col-span-2">
        Name of expense
        <input name="name" required defaultValue={expense?.name} className={`${inputClass} mt-1`} placeholder="e.g. 16mm cable, 2 rolls" />
      </label>
      <label className="text-xs font-semibold text-navy">
        Category
        <select name="category" defaultValue={expense?.category ?? "equipment"} className={`${inputClass} mt-1`}>
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs font-semibold text-navy lg:col-span-2">
        Paid by
        <select name="paidBy" defaultValue={expense?.paid_by ?? "business"} className={`${inputClass} mt-1`}>
          <option value="business">Business account</option>
          {FOUNDERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label} ({f.role}), own money, business owes it back
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs font-semibold text-navy">
        Amount (₦ each)
        <input
          name="amount"
          required
          inputMode="numeric"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={`${inputClass} mt-1`}
        />
      </label>
      <label className="text-xs font-semibold text-navy">
        Quantity
        <input
          name="quantity"
          required
          inputMode="decimal"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className={`${inputClass} mt-1`}
        />
      </label>
      <div className="text-xs font-semibold text-navy">
        Total
        <p className="mt-1 rounded-xl bg-mist px-3 py-2 font-mono-num text-sm">{formatNaira(total)}</p>
      </div>
      <label className="text-xs font-semibold text-navy lg:col-span-3">
        Notes (optional)
        <input name="notes" defaultValue={expense?.notes ?? ""} className={`${inputClass} mt-1`} placeholder="e.g. for the Ajah job" />
      </label>
      <div className="flex flex-wrap items-center gap-3 lg:col-span-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-orange px-5 py-2 text-xs font-semibold text-white hover:bg-orange-dark disabled:opacity-60"
        >
          {pending ? "Saving..." : expense ? "Save" : "Add expense"}
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

function ExpenseRow({ expense }: { expense: ExpenseRecord }) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (editing) {
    return (
      <tr className="bg-mist/60">
        <td colSpan={8} className="px-4 py-4">
          <ExpenseForm expense={expense} onDone={() => setEditing(false)} />
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td className="whitespace-nowrap px-4 py-2.5 text-charcoal/60">{expense.expense_date}</td>
      <td className="px-4 py-2.5">
        <span className="font-medium text-navy">{expense.name}</span>
        {expense.notes ? <span className="block text-xs text-charcoal/50">{expense.notes}</span> : null}
      </td>
      <td className="px-4 py-2.5 text-xs text-charcoal/60">{categoryLabel(expense.category)}</td>
      <td className="px-4 py-2.5 text-xs">
        <span className={expense.paid_by === "business" ? "text-charcoal/50" : "rounded-full bg-yellow/30 px-2 py-0.5 font-semibold text-navy"}>
          {paidByLabel(expense.paid_by)}
        </span>
      </td>
      <td className="px-4 py-2.5 text-right font-mono-num text-charcoal/70">{formatNaira(expense.amount)}</td>
      <td className="px-4 py-2.5 text-right font-mono-num text-charcoal/70">{expense.quantity}</td>
      <td className="px-4 py-2.5 text-right font-mono-num font-semibold text-navy">{formatNaira(expenseTotal(expense))}</td>
      <td className="px-4 py-2.5">
        <div className="flex justify-end gap-3 whitespace-nowrap">
          <button type="button" onClick={() => setEditing(true)} className="text-xs font-semibold text-orange">
            Edit
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              if (confirm(`Delete "${expense.name}"?`)) {
                startTransition(() =>
                  deleteExpenseAction(expense.id, `${expense.name} ${formatNaira(expenseTotal(expense))}`)
                );
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

export function ExpensesSection({ expenses, periodLabel }: { expenses: ExpenseRecord[]; periodLabel: string }) {
  const total = expenses.reduce((sum, e) => sum + expenseTotal(e), 0);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line bg-white p-5">
        <h3 className="font-display text-base font-bold text-navy">Record an expense</h3>
        <p className="mt-1 text-xs text-charcoal/55">
          If a founder paid from their own pocket, pick their name under &quot;Paid by&quot;. It still counts as a
          business expense, and it is added to what the business owes that founder.
        </p>
        <div className="mt-4">
          <ExpenseForm />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-charcoal/45">
            <tr>
              <th className="px-4 py-2.5">Date</th>
              <th className="px-4 py-2.5">Expense</th>
              <th className="px-4 py-2.5">Category</th>
              <th className="px-4 py-2.5">Paid by</th>
              <th className="px-4 py-2.5 text-right">Amount</th>
              <th className="px-4 py-2.5 text-right">Qty</th>
              <th className="px-4 py-2.5 text-right">Total</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {expenses.map((expense) => (
              <ExpenseRow key={expense.id} expense={expense} />
            ))}
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-charcoal/50">
                  No expenses recorded for {periodLabel}.
                </td>
              </tr>
            ) : (
              <tr className="font-semibold text-navy">
                <td colSpan={6} className="px-4 py-2.5">
                  Total, {periodLabel}
                </td>
                <td className="px-4 py-2.5 text-right font-mono-num">{formatNaira(total)}</td>
                <td />
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
