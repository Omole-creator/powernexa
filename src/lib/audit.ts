import "server-only";
import { supabase } from "./supabase";

export type AuditAction =
  | "login"
  | "logout"
  | "create_post"
  | "update_post"
  | "publish_post"
  | "unpublish_post"
  | "delete_post"
  | "update_lead_status"
  | "update_lead"
  | "archive_lead"
  | "unarchive_lead"
  | "change_password"
  | "add_teammate"
  | "add_supplier_price"
  | "update_supplier_price"
  | "delete_supplier_price"
  | "import_supplier_prices"
  | "add_job_record"
  | "update_job_record"
  | "delete_job_record"
  | "add_expense"
  | "update_expense"
  | "delete_expense"
  | "add_founder_repayment"
  | "delete_founder_repayment"
  | "add_customer_system"
  | "update_customer_system"
  | "delete_customer_system"
  | "add_system_event"
  | "delete_system_event"
  | "add_system_photo"
  | "delete_system_photo"
  | "save_customer_quote"
  | "delete_customer_quote";

export async function logAudit(actorEmail: string, action: AuditAction, detail?: string): Promise<void> {
  const { error } = await supabase.from("audit_log").insert({
    actor_email: actorEmail,
    action,
    detail: detail ?? null,
  });
  if (error) throw error;
}

export type AuditRow = {
  id: number;
  actor_email: string;
  action: string;
  detail: string | null;
  created_at: string;
};

export async function listAuditLog(limit = 200): Promise<AuditRow[]> {
  const { data, error } = await supabase
    .from("audit_log")
    .select("*")
    .order("id", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}
