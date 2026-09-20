"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/dal";
import { updateLeadStatus, type Lead } from "@/lib/leads";
import { logAudit } from "@/lib/audit";

const VALID_STATUSES: Lead["status"][] = ["new", "contacted", "quoted", "won", "lost"];

export async function updateLeadStatusAction(leadId: number, status: string) {
  const admin = await requireAdmin();
  if (!VALID_STATUSES.includes(status as Lead["status"])) return;

  await updateLeadStatus(leadId, status as Lead["status"]);
  await logAudit(admin.email, "update_lead_status", `Lead #${leadId} → ${status}`);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}
