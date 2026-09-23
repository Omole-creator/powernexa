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
  | "sync_price_benchmarks"
  | "add_supplier_price"
  | "update_supplier_price"
  | "delete_supplier_price"
  | "import_supplier_prices";

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
