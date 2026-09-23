"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/dal";
import { logAudit } from "@/lib/audit";
import { optionalString, requiredString } from "@/lib/validation";
import {
  addExpense,
  addJob,
  addRepayment,
  deleteExpense,
  deleteJob,
  deleteRepayment,
  updateExpense,
  updateJob,
  type ExpenseInput,
  type JobInput,
} from "@/lib/accounts";
import { FOUNDERS, isExpenseCategory, isPaidBy, paidByLabel, type Founder } from "@/lib/accounts-math";

export type AccountsFormState = { error?: string; success?: string };

function parseAmount(value: FormDataEntryValue | null, allowZero = true): number | null {
  if (typeof value !== "string" || value.trim() === "") return allowZero ? 0 : null;
  const n = Number(value.replace(/[₦,\s]/g, ""));
  if (!Number.isFinite(n) || n < 0 || (!allowZero && n === 0)) return null;
  return n;
}

function parseDate(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  return Number.isNaN(Date.parse(value)) ? null : value;
}

function parseJob(formData: FormData): JobInput | string {
  const jobDate = parseDate(formData.get("date"));
  const customer = requiredString(formData.get("customer"), 120);
  const jobValue = parseAmount(formData.get("jobValue"), false);
  const amountPaid = parseAmount(formData.get("amountPaid"));
  if (!jobDate) return "Pick the date of the job.";
  if (!customer) return "Enter the customer or job name.";
  if (jobValue === null) return "Enter the job value in naira.";
  if (amountPaid === null) return "Amount paid must be a number.";
  return {
    jobDate,
    customer,
    description: optionalString(formData.get("description"), 200) ?? null,
    jobValue,
    amountPaid,
    notes: optionalString(formData.get("notes"), 500) ?? null,
  };
}

function parseExpense(formData: FormData): ExpenseInput | string {
  const expenseDate = parseDate(formData.get("date"));
  const name = requiredString(formData.get("name"), 120);
  const category = String(formData.get("category") ?? "other");
  const amount = parseAmount(formData.get("amount"), false);
  const quantity = parseAmount(formData.get("quantity") || "1", false);
  if (!expenseDate) return "Pick the date of the expense.";
  if (!name) return "Enter the name of the expense.";
  if (!isExpenseCategory(category)) return "Pick a category.";
  if (amount === null) return "Enter the amount in naira.";
  if (quantity === null) return "Quantity must be above zero.";
  const paidBy = String(formData.get("paidBy") ?? "business");
  if (!isPaidBy(paidBy)) return "Pick who paid.";
  return { expenseDate, name, category, amount, quantity, paidBy, notes: optionalString(formData.get("notes"), 500) ?? null };
}

function naira(n: number): string {
  return `₦${n.toLocaleString("en-NG")}`;
}

function refresh() {
  revalidatePath("/admin/accounts");
  revalidatePath("/admin");
}

export async function saveJobAction(
  id: number | null,
  _prevState: AccountsFormState,
  formData: FormData
): Promise<AccountsFormState> {
  const admin = await requireAdmin();
  const input = parseJob(formData);
  if (typeof input === "string") return { error: input };
  try {
    if (id === null) await addJob(input);
    else await updateJob(id, input);
  } catch (error) {
    console.error("Save job failed", error);
    return { error: "Could not save. Has the accounts SQL been run in Supabase?" };
  }
  await logAudit(
    admin.email,
    id === null ? "add_job_record" : "update_job_record",
    `${id === null ? "" : `#${id} `}${input.customer}, ${naira(input.jobValue)} on ${input.jobDate}`
  );
  refresh();
  return { success: id === null ? `Saved ${input.customer}.` : "Saved." };
}

export async function deleteJobAction(id: number, label: string) {
  const admin = await requireAdmin();
  await deleteJob(id);
  await logAudit(admin.email, "delete_job_record", `#${id} ${label}`);
  refresh();
}

export async function saveExpenseAction(
  id: number | null,
  _prevState: AccountsFormState,
  formData: FormData
): Promise<AccountsFormState> {
  const admin = await requireAdmin();
  const input = parseExpense(formData);
  if (typeof input === "string") return { error: input };
  try {
    if (id === null) await addExpense(input);
    else await updateExpense(id, input);
  } catch (error) {
    console.error("Save expense failed", error);
    return { error: "Could not save. Has the accounts SQL been run in Supabase?" };
  }
  await logAudit(
    admin.email,
    id === null ? "add_expense" : "update_expense",
    `${id === null ? "" : `#${id} `}${input.name}, ${input.quantity} x ${naira(input.amount)} on ${input.expenseDate}, paid by ${paidByLabel(input.paidBy)}`
  );
  refresh();
  return { success: id === null ? `Saved ${input.name}.` : "Saved." };
}

export async function deleteExpenseAction(id: number, label: string) {
  const admin = await requireAdmin();
  await deleteExpense(id);
  await logAudit(admin.email, "delete_expense", `#${id} ${label}`);
  refresh();
}

export async function addRepaymentAction(
  _prevState: AccountsFormState,
  formData: FormData
): Promise<AccountsFormState> {
  const admin = await requireAdmin();
  const repaidDate = parseDate(formData.get("date"));
  const founder = String(formData.get("founder") ?? "");
  const amount = parseAmount(formData.get("amount"), false);
  if (!repaidDate) return { error: "Pick the date of the repayment." };
  if (!FOUNDERS.some((f) => f.value === founder)) return { error: "Pick the founder who was paid back." };
  if (amount === null) return { error: "Enter the amount paid back." };
  try {
    await addRepayment({
      repaidDate,
      founder: founder as Founder,
      amount,
      notes: optionalString(formData.get("notes"), 300) ?? null,
    });
  } catch (error) {
    console.error("Save repayment failed", error);
    return { error: "Could not save. Has the accounts SQL been run in Supabase?" };
  }
  await logAudit(admin.email, "add_founder_repayment", `${paidByLabel(founder)} paid back ${naira(amount)} on ${repaidDate}`);
  refresh();
  return { success: "Repayment saved." };
}

export async function deleteRepaymentAction(id: number, label: string) {
  const admin = await requireAdmin();
  await deleteRepayment(id);
  await logAudit(admin.email, "delete_founder_repayment", `#${id} ${label}`);
  refresh();
}
