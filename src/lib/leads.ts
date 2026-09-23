import "server-only";
import { supabase } from "./supabase";
import { loadProfileLabel } from "./costing";

export type Lead = {
  id: number;
  name: string;
  phone: string;
  area: string;
  property_type: string;
  service_interest: string;
  budget_range: string | null;
  message: string | null;
  source_page: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  status: "new" | "contacted" | "quoted" | "won" | "lost";
  created_at: string;
  archived_at: string | null;
  load_profile?: string | null;
};

export type LeadEditInput = {
  name: string;
  phone: string;
  area: string;
  propertyType: string;
  serviceInterest: string;
  budgetRange?: string;
  message?: string;
};

export type NewLeadInput = {
  name: string;
  phone: string;
  area: string;
  propertyType: string;
  serviceInterest: string;
  budgetRange?: string;
  message?: string;
  loadProfile?: string;
  sourcePage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

export async function createLead(input: NewLeadInput): Promise<number> {
  const row = {
    name: input.name,
    phone: input.phone,
    area: input.area,
    property_type: input.propertyType,
    service_interest: input.serviceInterest,
    budget_range: input.budgetRange ?? null,
    message: input.message ?? null,
    source_page: input.sourcePage ?? null,
    utm_source: input.utmSource ?? null,
    utm_medium: input.utmMedium ?? null,
    utm_campaign: input.utmCampaign ?? null,
  };

  const { data, error } = await supabase
    .from("leads")
    .insert({ ...row, load_profile: input.loadProfile ?? null })
    .select("id")
    .single();
  if (!error) return data.id;

  // load_profile needs a one-time `alter table` in Supabase. Until it's run,
  // save the lead anyway and keep the answer in the message, so a quote
  // request is never lost over a missing column.
  if (!/load_profile/.test(error.message ?? "")) throw error;
  const label = loadProfileLabel(input.loadProfile);
  const message = [label ? `Wants to power: ${label}` : null, row.message].filter(Boolean).join("\n") || null;
  const retry = await supabase.from("leads").insert({ ...row, message }).select("id").single();
  if (retry.error) throw retry.error;
  return retry.data.id;
}

export async function listLeads(options?: { archived?: boolean | "all" }): Promise<Lead[]> {
  let query = supabase.from("leads").select("*").order("created_at", { ascending: false });
  if (options?.archived === "all") {
    // no filter, return every lead regardless of archived status
  } else if (options?.archived) {
    query = query.not("archived_at", "is", null);
  } else {
    query = query.is("archived_at", null);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getLeadById(id: number): Promise<Lead | null> {
  const { data, error } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateLeadStatus(id: number, status: Lead["status"]): Promise<void> {
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function updateLead(id: number, input: LeadEditInput): Promise<void> {
  const { error } = await supabase
    .from("leads")
    .update({
      name: input.name,
      phone: input.phone,
      area: input.area,
      property_type: input.propertyType,
      service_interest: input.serviceInterest,
      budget_range: input.budgetRange ?? null,
      message: input.message ?? null,
    })
    .eq("id", id);
  if (error) throw error;
}

export async function setLeadArchived(id: number, archived: boolean): Promise<void> {
  const { error } = await supabase
    .from("leads")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) throw error;
}

export function leadsToCsv(leads: Lead[]): string {
  const headers = [
    "id",
    "name",
    "phone",
    "area",
    "property_type",
    "service_interest",
    "budget_range",
    "load_profile",
    "message",
    "source_page",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "status",
    "created_at",
    "archived_at",
  ];
  const escape = (value: unknown) => {
    const str = value === null || value === undefined ? "" : String(value);
    if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };
  const rows = leads.map((lead) => headers.map((h) => escape(lead[h as keyof Lead])).join(","));
  return [headers.join(","), ...rows].join("\n");
}
