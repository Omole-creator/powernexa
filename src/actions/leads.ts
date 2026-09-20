"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/dal";
import { updateLeadStatus, updateLead, setLeadArchived, type Lead, type LeadEditInput } from "@/lib/leads";
import { logAudit } from "@/lib/audit";
import { requiredString, optionalString, isValidNigerianPhone } from "@/lib/validation";

const VALID_STATUSES: Lead["status"][] = ["new", "contacted", "quoted", "won", "lost"];

export async function updateLeadStatusAction(leadId: number, status: string) {
  const admin = await requireAdmin();
  if (!VALID_STATUSES.includes(status as Lead["status"])) return;

  await updateLeadStatus(leadId, status as Lead["status"]);
  await logAudit(admin.email, "update_lead_status", `Lead #${leadId} → ${status}`);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export type LeadFormState = {
  error?: string;
};

export async function updateLeadAction(
  leadId: number,
  _prevState: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const admin = await requireAdmin();

  const name = requiredString(formData.get("name"), 120);
  const phone = requiredString(formData.get("phone"), 30);
  const area = requiredString(formData.get("area"), 80);
  const propertyType = requiredString(formData.get("propertyType"), 40);
  const serviceInterest = requiredString(formData.get("serviceInterest"), 120);
  const budgetRange = optionalString(formData.get("budgetRange"), 60);
  const message = optionalString(formData.get("message"), 1000);

  if (!name || !phone || !area || !propertyType || !serviceInterest) {
    return { error: "Name, phone, area, property type, and service are required." };
  }
  if (!isValidNigerianPhone(phone)) {
    return { error: "Please enter a valid Nigerian phone number." };
  }

  const input: LeadEditInput = { name, phone, area, propertyType, serviceInterest, budgetRange, message };
  await updateLead(leadId, input);
  await logAudit(admin.email, "update_lead", `Lead #${leadId} ${name}`);

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  redirect("/admin/leads");
}

export async function archiveLeadAction(leadId: number, name: string) {
  const admin = await requireAdmin();
  await setLeadArchived(leadId, true);
  await logAudit(admin.email, "archive_lead", `Lead #${leadId} ${name}`);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function unarchiveLeadAction(leadId: number, name: string) {
  const admin = await requireAdmin();
  await setLeadArchived(leadId, false);
  await logAudit(admin.email, "unarchive_lead", `Lead #${leadId} ${name}`);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}
