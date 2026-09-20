import "server-only";
import { supabase } from "./supabase";

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
};

export type NewLeadInput = {
  name: string;
  phone: string;
  area: string;
  propertyType: string;
  serviceInterest: string;
  budgetRange?: string;
  message?: string;
  sourcePage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

export async function createLead(input: NewLeadInput): Promise<number> {
  const { data, error } = await supabase
    .from("leads")
    .insert({
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
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function listLeads(): Promise<Lead[]> {
  const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
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

export function leadsToCsv(leads: Lead[]): string {
  const headers = [
    "id",
    "name",
    "phone",
    "area",
    "property_type",
    "service_interest",
    "budget_range",
    "message",
    "source_page",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "status",
    "created_at",
  ];
  const escape = (value: unknown) => {
    const str = value === null || value === undefined ? "" : String(value);
    if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };
  const rows = leads.map((lead) => headers.map((h) => escape(lead[h as keyof Lead])).join(","));
  return [headers.join(","), ...rows].join("\n");
}
