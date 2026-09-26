"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/dal";
import { logAudit } from "@/lib/audit";
import { optionalString, requiredString } from "@/lib/validation";
import {
  addEvent,
  createSystem,
  deleteEvent,
  deletePhoto,
  deleteSystem,
  setInstalledOn,
  updateSystem,
  type EquipmentItem,
  type SystemInput,
} from "@/lib/customer-systems";
import { EVENT_KINDS } from "@/lib/aftercare";
import { decodeQuote, type LoadItem } from "@/lib/quote";
import { linkQuoteToSystem } from "@/lib/saved-quotes";

export type SystemFormState = { error?: string; success?: string };

function parseDate(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  return Number.isNaN(Date.parse(value)) ? null : value;
}

function parseJsonList(value: FormDataEntryValue | null): Record<string, unknown>[] {
  if (typeof value !== "string" || !value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.slice(0, 40) : [];
  } catch {
    return [];
  }
}

const text = (v: unknown, max = 200) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined);
const positive = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

function parseSystem(formData: FormData): SystemInput | string {
  const customerName = requiredString(formData.get("customerName"), 120);
  if (!customerName) return "Enter the customer's name.";
  // Only the "add a customer" form has a date box; editing leaves the date to
  // the "Mark as installed" control.
  const installedRaw = formData.get("installedOn");
  const installedOn = !formData.has("installedOn") ? undefined : installedRaw ? parseDate(installedRaw) : null;
  if (installedRaw && !installedOn) return "The installation date isn't a valid date.";

  const equipment: EquipmentItem[] = parseJsonList(formData.get("equipment"))
    .map((row) => ({ item: text(row.item) ?? "", model: text(row.model), serial: text(row.serial), warranty: text(row.warranty) }))
    .filter((row) => row.item);
  const loadItems: LoadItem[] = parseJsonList(formData.get("loadItems"))
    .map((row) => ({
      appliance: text(row.appliance, 120) ?? "",
      quantity: positive(row.quantity) ?? 1,
      watts: positive(row.watts),
      hours: positive(row.hours) ?? 0,
    }))
    .filter((row) => row.appliance);

  return {
    customerName,
    phone: optionalString(formData.get("phone"), 40) ?? null,
    address: optionalString(formData.get("address"), 200) ?? null,
    systemSummary: optionalString(formData.get("systemSummary"), 200) ?? null,
    installedOn,
    equipment,
    loadItems,
    notes: optionalString(formData.get("notes"), 1000) ?? null,
  };
}

function refresh(id?: number) {
  revalidatePath("/admin/systems");
  if (id) revalidatePath(`/admin/systems/${id}`);
}

export async function saveSystemAction(
  id: number | null,
  _prevState: SystemFormState,
  formData: FormData
): Promise<SystemFormState> {
  const admin = await requireAdmin();
  const input = parseSystem(formData);
  if (typeof input === "string") return { error: input };

  let newId: number | null = null;
  try {
    if (id === null) newId = await createSystem(input);
    else await updateSystem(id, input);
  } catch (error) {
    console.error("Save customer system failed", error);
    return { error: "Could not save. Has the My System SQL been run in Supabase?" };
  }
  await logAudit(admin.email, id === null ? "add_customer_system" : "update_customer_system", input.customerName);
  refresh(id ?? undefined);
  if (newId !== null) redirect(`/admin/systems/${newId}`);
  return { success: "Saved." };
}

// Turns a customer quote from /admin/quote into a My System page, carrying
// over the customer details, equipment list and load list.
export async function createSystemFromQuoteAction(formData: FormData) {
  const admin = await requireAdmin();
  const quote = decodeQuote(String(formData.get("quote") ?? ""));
  if (!quote) redirect("/admin/systems?error=quote");

  let id: number;
  try {
    id = await createSystem(
      {
        customerName: quote.customer.name,
        phone: quote.customer.phone ?? null,
        address: quote.customer.address ?? null,
        systemSummary: quote.systemSummary || null,
        installedOn: null,
        equipment: quote.items.map((i) => ({ item: i.description, warranty: i.warranty })),
        loadItems: quote.load,
        notes: null,
      },
      quote
    );
  } catch (error) {
    console.error("Create system from quote failed", error);
    redirect("/admin/systems?error=save");
  }
  const quoteId = Number(formData.get("quoteId"));
  if (Number.isInteger(quoteId) && quoteId > 0) {
    await linkQuoteToSystem(quoteId, id).catch((error) => console.error("Link quote to system failed", error));
  }
  await logAudit(admin.email, "add_customer_system", `${quote.customer.name}, from quote ${quote.number}`);
  refresh();
  redirect(`/admin/systems/${id}`);
}

export async function setInstalledAction(id: number, installedOn: string | null): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  if (installedOn !== null && !parseDate(installedOn)) return { error: "Pick a valid date." };
  try {
    await setInstalledOn(id, installedOn);
  } catch (error) {
    console.error("Set installed date failed", error);
    return { error: "Could not save. Please try again." };
  }
  await logAudit(
    admin.email,
    "update_customer_system",
    installedOn ? `#${id} marked installed on ${installedOn}` : `#${id} marked not installed`
  );
  refresh(id);
  revalidatePath("/admin", "layout");
  return {};
}

export async function deleteSystemAction(id: number, label: string) {
  const admin = await requireAdmin();
  await deleteSystem(id);
  await logAudit(admin.email, "delete_customer_system", `#${id} ${label}`);
  refresh();
  redirect("/admin/systems");
}

export async function addEventAction(
  systemId: number,
  _prevState: SystemFormState,
  formData: FormData
): Promise<SystemFormState> {
  const admin = await requireAdmin();
  const eventDate = parseDate(formData.get("date"));
  const kind = String(formData.get("kind") ?? "");
  const description = requiredString(formData.get("description"), 500);
  if (!eventDate) return { error: "Pick the date." };
  if (!EVENT_KINDS.some((k) => k.value === kind)) return { error: "Pick what kind of entry this is." };
  if (!description) return { error: "Say what was done." };
  try {
    await addEvent(systemId, eventDate, kind, description);
  } catch (error) {
    console.error("Add system event failed", error);
    return { error: "Could not save. Please try again." };
  }
  await logAudit(admin.email, "add_system_event", `#${systemId} ${kind} on ${eventDate}`);
  refresh(systemId);
  return { success: "Added." };
}

export async function deleteEventAction(id: number, systemId: number) {
  const admin = await requireAdmin();
  await deleteEvent(id);
  await logAudit(admin.email, "delete_system_event", `#${id} on system #${systemId}`);
  refresh(systemId);
}

export async function deletePhotoAction(id: number, systemId: number) {
  const admin = await requireAdmin();
  await deletePhoto(id);
  await logAudit(admin.email, "delete_system_photo", `#${id} on system #${systemId}`);
  refresh(systemId);
}
