import "server-only";
import { supabase } from "./supabase";
import type { ExpenseCategory, ExpenseRecord, Founder, JobRecord, PaidBy, RepaymentRecord } from "./accounts-math";

// Postgres "relation does not exist", i.e. the accounts SQL in
// supabase/schema.sql hasn't been pasted into the Supabase SQL editor yet.
function isMissingTable(error: { code?: string; message?: string }): boolean {
  return error.code === "42P01" || error.code === "PGRST205" || /does not exist|schema cache/i.test(error.message ?? "");
}

export async function listAccounts(): Promise<{
  jobs: JobRecord[];
  expenses: ExpenseRecord[];
  repayments: RepaymentRecord[];
  tableMissing: boolean;
}> {
  const [jobsResult, expensesResult, repaymentsResult] = await Promise.all([
    supabase.from("business_jobs").select("*").order("job_date", { ascending: false }).order("id", { ascending: false }),
    supabase
      .from("business_expenses")
      .select("*")
      .order("expense_date", { ascending: false })
      .order("id", { ascending: false }),
    supabase
      .from("founder_repayments")
      .select("*")
      .order("repaid_date", { ascending: false })
      .order("id", { ascending: false }),
  ]);
  for (const result of [jobsResult, expensesResult, repaymentsResult]) {
    if (result.error) {
      if (isMissingTable(result.error)) return { jobs: [], expenses: [], repayments: [], tableMissing: true };
      throw result.error;
    }
  }
  return {
    jobs: (jobsResult.data ?? []).map((row) => ({
      ...row,
      job_value: Number(row.job_value),
      amount_paid: Number(row.amount_paid),
    })),
    expenses: (expensesResult.data ?? []).map((row) => ({
      ...row,
      amount: Number(row.amount),
      quantity: Number(row.quantity),
    })),
    repayments: (repaymentsResult.data ?? []).map((row) => ({ ...row, amount: Number(row.amount) })),
    tableMissing: false,
  };
}

export type JobInput = {
  jobDate: string;
  customer: string;
  description: string | null;
  jobValue: number;
  amountPaid: number;
  notes: string | null;
};

function jobRow(input: JobInput) {
  return {
    job_date: input.jobDate,
    customer: input.customer,
    description: input.description,
    job_value: input.jobValue,
    amount_paid: input.amountPaid,
    notes: input.notes,
    updated_at: new Date().toISOString(),
  };
}

export async function addJob(input: JobInput): Promise<void> {
  const { error } = await supabase.from("business_jobs").insert(jobRow(input));
  if (error) throw error;
}

export async function updateJob(id: number, input: JobInput): Promise<void> {
  const { error } = await supabase.from("business_jobs").update(jobRow(input)).eq("id", id);
  if (error) throw error;
}

export async function deleteJob(id: number): Promise<void> {
  const { error } = await supabase.from("business_jobs").delete().eq("id", id);
  if (error) throw error;
}

export type ExpenseInput = {
  expenseDate: string;
  name: string;
  category: ExpenseCategory;
  amount: number;
  quantity: number;
  paidBy: PaidBy;
  notes: string | null;
};

function expenseRow(input: ExpenseInput) {
  return {
    expense_date: input.expenseDate,
    name: input.name,
    category: input.category,
    amount: input.amount,
    quantity: input.quantity,
    paid_by: input.paidBy,
    notes: input.notes,
    updated_at: new Date().toISOString(),
  };
}

export async function addExpense(input: ExpenseInput): Promise<void> {
  const { error } = await supabase.from("business_expenses").insert(expenseRow(input));
  if (error) throw error;
}

export async function updateExpense(id: number, input: ExpenseInput): Promise<void> {
  const { error } = await supabase.from("business_expenses").update(expenseRow(input)).eq("id", id);
  if (error) throw error;
}

export async function deleteExpense(id: number): Promise<void> {
  const { error } = await supabase.from("business_expenses").delete().eq("id", id);
  if (error) throw error;
}

export async function addRepayment(input: {
  repaidDate: string;
  founder: Founder;
  amount: number;
  notes: string | null;
}): Promise<void> {
  const { error } = await supabase.from("founder_repayments").insert({
    repaid_date: input.repaidDate,
    founder: input.founder,
    amount: input.amount,
    notes: input.notes,
  });
  if (error) throw error;
}

export async function deleteRepayment(id: number): Promise<void> {
  const { error } = await supabase.from("founder_repayments").delete().eq("id", id);
  if (error) throw error;
}

export const ACCOUNTS_SQL = `create table if not exists business_jobs (
  id bigint generated always as identity primary key,
  job_date date not null,
  customer text not null,
  description text,
  job_value numeric not null check (job_value >= 0),
  amount_paid numeric not null default 0 check (amount_paid >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_business_jobs_date on business_jobs (job_date);
alter table business_jobs enable row level security;

create table if not exists business_expenses (
  id bigint generated always as identity primary key,
  expense_date date not null,
  name text not null,
  category text not null default 'other',
  amount numeric not null check (amount >= 0),
  quantity numeric not null default 1 check (quantity > 0),
  paid_by text not null default 'business' check (paid_by in ('business', 'omole', 'idowu')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_business_expenses_date on business_expenses (expense_date);
alter table business_expenses enable row level security;

create table if not exists founder_repayments (
  id bigint generated always as identity primary key,
  repaid_date date not null,
  founder text not null check (founder in ('omole', 'idowu')),
  amount numeric not null check (amount > 0),
  notes text,
  created_at timestamptz not null default now()
);
alter table founder_repayments enable row level security;`;
