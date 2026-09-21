import "server-only";
import { supabase } from "./supabase";

export type LeadMagnetSignup = {
  id: number;
  name: string;
  email: string;
  phone: string;
  magnet_slug: string;
  source_page: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
};

export type NewLeadMagnetSignupInput = {
  name: string;
  email: string;
  phone: string;
  magnetSlug: string;
  sourcePage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

export async function createLeadMagnetSignup(input: NewLeadMagnetSignupInput): Promise<void> {
  const { error } = await supabase.from("lead_magnet_signups").insert({
    name: input.name,
    email: input.email,
    phone: input.phone,
    magnet_slug: input.magnetSlug,
    source_page: input.sourcePage ?? null,
    utm_source: input.utmSource ?? null,
    utm_medium: input.utmMedium ?? null,
    utm_campaign: input.utmCampaign ?? null,
  });
  if (error) throw error;
}

export async function listLeadMagnetSignups(): Promise<LeadMagnetSignup[]> {
  const { data, error } = await supabase
    .from("lead_magnet_signups")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export function leadMagnetSignupsToCsv(rows: LeadMagnetSignup[]): string {
  const headers = [
    "id",
    "name",
    "email",
    "phone",
    "magnet_slug",
    "source_page",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "created_at",
  ];
  const escape = (value: unknown) => {
    const str = value === null || value === undefined ? "" : String(value);
    if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };
  const rows_ = rows.map((r) => headers.map((h) => escape(r[h as keyof LeadMagnetSignup])).join(","));
  return [headers.join(","), ...rows_].join("\n");
}
