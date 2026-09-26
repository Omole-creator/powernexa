import "server-only";
import { randomBytes } from "node:crypto";
import { supabase } from "./supabase";
import { parseQuote, type CustomerQuote, type LoadItem } from "./quote";

// My System pages: one private page per installed customer at
// /my-system/<token>, reached only through the link we send them. The token
// is 24 random characters, so pages can't be guessed or listed. Photos sit in
// a private storage bucket and are shown through short-lived signed links.

export const PHOTO_BUCKET = "system-photos";
const SIGNED_URL_SECONDS = 60 * 60;

export type EquipmentItem = { item: string; model?: string; serial?: string; warranty?: string };

export type SystemRecord = {
  id: number;
  token: string;
  customer_name: string;
  phone: string | null;
  address: string | null;
  system_summary: string | null;
  installed_on: string | null;
  equipment: EquipmentItem[];
  load_items: LoadItem[];
  quote: CustomerQuote | null;
  notes: string | null;
  created_at: string;
};

export type SystemEvent = { id: number; system_id: number; event_date: string; kind: string; description: string };

export type SystemPhoto = { id: number; system_id: number; path: string; caption: string | null; url: string | null };

export type SystemInput = {
  customerName: string;
  phone: string | null;
  address: string | null;
  systemSummary: string | null;
  installedOn: string | null;
  equipment: EquipmentItem[];
  loadItems: LoadItem[];
  notes: string | null;
};

export const CUSTOMER_SYSTEMS_SQL = `create table if not exists customer_systems (
  id bigint generated always as identity primary key,
  token text not null unique,
  customer_name text not null,
  phone text,
  address text,
  system_summary text,
  installed_on date,
  equipment jsonb not null default '[]',
  load_items jsonb not null default '[]',
  quote jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table customer_systems enable row level security;

create table if not exists customer_system_events (
  id bigint generated always as identity primary key,
  system_id bigint not null references customer_systems (id) on delete cascade,
  event_date date not null,
  kind text not null check (kind in ('checkup', 'repair', 'visit', 'note')),
  description text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_customer_system_events_system on customer_system_events (system_id, event_date);
alter table customer_system_events enable row level security;

create table if not exists customer_system_photos (
  id bigint generated always as identity primary key,
  system_id bigint not null references customer_systems (id) on delete cascade,
  path text not null,
  caption text,
  created_at timestamptz not null default now()
);
create index if not exists idx_customer_system_photos_system on customer_system_photos (system_id);
alter table customer_system_photos enable row level security;`;

function isMissingTable(error: { code?: string; message?: string }): boolean {
  return error.code === "42P01" || error.code === "PGRST205" || /does not exist|schema cache/i.test(error.message ?? "");
}

function toRecord(row: Record<string, unknown>): SystemRecord {
  return {
    ...(row as unknown as SystemRecord),
    equipment: Array.isArray(row.equipment) ? (row.equipment as EquipmentItem[]) : [],
    load_items: Array.isArray(row.load_items) ? (row.load_items as LoadItem[]) : [],
    quote: row.quote ? parseQuote(row.quote) : null,
  };
}

export function newSystemToken(): string {
  return randomBytes(18).toString("base64url");
}

export async function listSystems(): Promise<{
  systems: SystemRecord[];
  events: SystemEvent[];
  tableMissing: boolean;
}> {
  const [systemsResult, eventsResult] = await Promise.all([
    supabase.from("customer_systems").select("*").order("installed_on", { ascending: false, nullsFirst: true }),
    supabase.from("customer_system_events").select("id, system_id, event_date, kind, description"),
  ]);
  for (const result of [systemsResult, eventsResult]) {
    if (result.error) {
      if (isMissingTable(result.error)) return { systems: [], events: [], tableMissing: true };
      throw result.error;
    }
  }
  return { systems: (systemsResult.data ?? []).map(toRecord), events: eventsResult.data ?? [], tableMissing: false };
}

async function loadDetails(system: SystemRecord) {
  const [eventsResult, photosResult] = await Promise.all([
    supabase
      .from("customer_system_events")
      .select("id, system_id, event_date, kind, description")
      .eq("system_id", system.id)
      .order("event_date", { ascending: false }),
    supabase.from("customer_system_photos").select("id, system_id, path, caption").eq("system_id", system.id).order("id"),
  ]);
  if (eventsResult.error) throw eventsResult.error;
  if (photosResult.error) throw photosResult.error;

  const rows = photosResult.data ?? [];
  let urls: (string | null)[] = rows.map(() => null);
  if (rows.length > 0) {
    const { data } = await supabase.storage.from(PHOTO_BUCKET).createSignedUrls(
      rows.map((p) => p.path),
      SIGNED_URL_SECONDS
    );
    urls = rows.map((_, i) => data?.[i]?.signedUrl ?? null);
  }
  return {
    system,
    events: (eventsResult.data ?? []) as SystemEvent[],
    photos: rows.map((p, i) => ({ ...p, url: urls[i] })) as SystemPhoto[],
  };
}

export async function getSystem(id: number) {
  const { data, error } = await supabase.from("customer_systems").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? loadDetails(toRecord(data)) : null;
}

export async function getSystemByToken(token: string) {
  if (!/^[A-Za-z0-9_-]{20,40}$/.test(token)) return null;
  const { data, error } = await supabase.from("customer_systems").select("*").eq("token", token).maybeSingle();
  if (error) {
    if (isMissingTable(error)) return null;
    throw error;
  }
  return data ? loadDetails(toRecord(data)) : null;
}

function toRow(input: SystemInput) {
  return {
    customer_name: input.customerName,
    phone: input.phone,
    address: input.address,
    system_summary: input.systemSummary,
    installed_on: input.installedOn,
    equipment: input.equipment,
    load_items: input.loadItems,
    notes: input.notes,
  };
}

export async function createSystem(input: SystemInput, quote: CustomerQuote | null = null): Promise<number> {
  const { data, error } = await supabase
    .from("customer_systems")
    .insert({ ...toRow(input), token: newSystemToken(), quote })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function updateSystem(id: number, input: SystemInput): Promise<void> {
  const { error } = await supabase
    .from("customer_systems")
    .update({ ...toRow(input), updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteSystem(id: number): Promise<void> {
  const { data: photos } = await supabase.from("customer_system_photos").select("path").eq("system_id", id);
  if (photos && photos.length > 0) {
    await supabase.storage.from(PHOTO_BUCKET).remove(photos.map((p) => p.path));
  }
  const { error } = await supabase.from("customer_systems").delete().eq("id", id);
  if (error) throw error;
}

export async function addEvent(systemId: number, eventDate: string, kind: string, description: string): Promise<void> {
  const { error } = await supabase
    .from("customer_system_events")
    .insert({ system_id: systemId, event_date: eventDate, kind, description });
  if (error) throw error;
}

export async function deleteEvent(id: number): Promise<void> {
  const { error } = await supabase.from("customer_system_events").delete().eq("id", id);
  if (error) throw error;
}

export async function addPhoto(systemId: number, path: string, caption: string | null): Promise<void> {
  const { error } = await supabase.from("customer_system_photos").insert({ system_id: systemId, path, caption });
  if (error) throw error;
}

export async function deletePhoto(id: number): Promise<void> {
  const { data, error } = await supabase.from("customer_system_photos").delete().eq("id", id).select("path").maybeSingle();
  if (error) throw error;
  if (data?.path) await supabase.storage.from(PHOTO_BUCKET).remove([data.path]);
}
