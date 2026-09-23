"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/dal";
import { syncAllPriceBenchmarks } from "@/lib/price-benchmarks";
import {
  addSupplierPrices,
  deleteSupplierPrice,
  listSupplierPrices,
  updateSupplierPrice,
} from "@/lib/supplier-prices";
import { NEXUS_PRICE_LIST } from "@/lib/supplier-seed-data";
import { logAudit } from "@/lib/audit";
import { optionalString, requiredString } from "@/lib/validation";

export type PricingSyncState = {
  error?: string;
  success?: string;
};

export async function syncEquipmentPricesNow(
  _prevState: PricingSyncState,
  _formData: FormData
): Promise<PricingSyncState> {
  const admin = await requireAdmin();

  try {
    const result = await syncAllPriceBenchmarks();
    await logAudit(admin.email, "sync_price_benchmarks", `Synced ${result.synced} benchmark rows from Itel Solar`);
    revalidatePath("/admin/pricing");
    return { success: `Updated ${result.synced} price benchmarks from Itel Solar's live catalog.` };
  } catch (error) {
    console.error("Manual price sync failed", error);
    const detail = error instanceof Error ? error.message : "Unknown error";
    return { error: `Sync failed, the previous prices were kept. ${detail}.` };
  }
}

export type SupplierPriceFormState = {
  error?: string;
  success?: string;
};

const CATEGORIES = ["inverter", "battery", "panel"] as const;

function parseNaira(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string") return null;
  const n = Number(value.replace(/[₦,\s]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

export async function addSupplierPriceAction(
  _prevState: SupplierPriceFormState,
  formData: FormData
): Promise<SupplierPriceFormState> {
  const admin = await requireAdmin();

  const supplier = requiredString(formData.get("supplier"), 80);
  const category = requiredString(formData.get("category"), 20) as (typeof CATEGORIES)[number] | null;
  const name = requiredString(formData.get("name"), 120);
  const size = parseNaira(formData.get("size"));
  const priceNgn = parseNaira(formData.get("price"));
  const voltage = optionalString(formData.get("voltage"), 20);
  const chemistry = optionalString(formData.get("chemistry"), 20);
  const notes = optionalString(formData.get("notes"), 300);

  if (!supplier || !name || !category || !CATEGORIES.includes(category)) {
    return { error: "Supplier, category and item name are required." };
  }
  if (!size) return { error: "Enter the size as a number (kVA, kWh or watts)." };
  if (!priceNgn) return { error: "Enter the price in naira." };
  if (category === "battery" && chemistry !== "lithium" && chemistry !== "tubular") {
    return { error: "Pick lithium or tubular for a battery." };
  }

  try {
    await addSupplierPrices(supplier, [
      {
        category,
        name,
        size,
        voltage,
        chemistry: chemistry as "lithium" | "tubular" | undefined,
        priceNgn,
        notes,
      },
    ]);
  } catch (error) {
    console.error("Add supplier price failed", error);
    return { error: "Could not save. Has the supplier price SQL been run in Supabase?" };
  }
  await logAudit(admin.email, "add_supplier_price", `${supplier}: ${name} at ₦${priceNgn.toLocaleString("en-NG")}`);
  revalidatePath("/admin/pricing");
  revalidatePath("/admin/leads");
  return { success: `Added ${name}.` };
}

export async function updateSupplierPriceAction(id: number, priceNgn: number, available: boolean) {
  const admin = await requireAdmin();
  if (!Number.isFinite(priceNgn) || priceNgn <= 0) return { error: "Price must be above zero." };
  await updateSupplierPrice(id, { priceNgn, available });
  await logAudit(
    admin.email,
    "update_supplier_price",
    `Item #${id} → ₦${priceNgn.toLocaleString("en-NG")}${available ? "" : " (marked unavailable)"}`
  );
  revalidatePath("/admin/pricing");
  revalidatePath("/admin/leads");
  return {};
}

export async function deleteSupplierPriceAction(id: number, name: string) {
  const admin = await requireAdmin();
  await deleteSupplierPrice(id);
  await logAudit(admin.email, "delete_supplier_price", `Item #${id} ${name}`);
  revalidatePath("/admin/pricing");
  revalidatePath("/admin/leads");
}

export async function importNexusPriceListAction(): Promise<SupplierPriceFormState> {
  const admin = await requireAdmin();
  const { items } = await listSupplierPrices();
  if (items.some((item) => item.supplier === NEXUS_PRICE_LIST.supplier)) {
    return { error: "Nexus prices are already loaded. Edit them in the table instead." };
  }
  try {
    await addSupplierPrices(NEXUS_PRICE_LIST.supplier, NEXUS_PRICE_LIST.items);
  } catch (error) {
    console.error("Nexus import failed", error);
    return { error: "Could not import. Has the supplier price SQL been run in Supabase?" };
  }
  await logAudit(admin.email, "import_supplier_prices", `Imported ${NEXUS_PRICE_LIST.items.length} Nexus items`);
  revalidatePath("/admin/pricing");
  revalidatePath("/admin/leads");
  return { success: `Loaded ${NEXUS_PRICE_LIST.items.length} Nexus prices.` };
}
