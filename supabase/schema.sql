-- PowerNexa Solutions — Supabase schema
-- Run this once in the Supabase SQL editor (Project -> SQL Editor -> New query).
-- Safe to re-run: every statement uses IF NOT EXISTS / OR REPLACE.

create table if not exists admin_users (
  id bigint generated always as identity primary key,
  email text unique not null,
  password_hash text not null,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists blog_posts (
  id bigint generated always as identity primary key,
  slug text unique not null,
  title text not null,
  excerpt text not null,
  content text not null,
  category text not null,
  tags jsonb not null default '[]'::jsonb,
  focus_keyword text not null default '',
  meta_title text not null,
  meta_description text not null,
  canonical_url text,
  featured_image text,
  featured_image_alt text,
  author_name text not null default 'PowerNexa Solutions Team',
  status text not null default 'draft' check (status in ('draft', 'published')),
  noindex boolean not null default false,
  reading_time_minutes int not null default 1,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_posts_status on blog_posts (status, published_at);

create table if not exists leads (
  id bigint generated always as identity primary key,
  name text not null,
  phone text not null,
  area text not null,
  property_type text not null,
  service_interest text not null,
  budget_range text,
  message text,
  source_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'won', 'lost')),
  created_at timestamptz not null default now(),
  archived_at timestamptz
);

-- Added after launch so leads can be archived (hidden, never hard-deleted)
-- instead of removed outright. Safe to re-run against the already-created
-- table above.
alter table leads add column if not exists archived_at timestamptz;

-- Optional "what do you want to power?" answer from the quote form, stored as
-- a package key from src/lib/costing.ts (e.g. 'medium'). Lets /admin/leads
-- show an internal price estimate per lead. Never shown to the customer.
alter table leads add column if not exists load_profile text;

create index if not exists idx_leads_status on leads (status, created_at);
create index if not exists idx_leads_archived on leads (archived_at);

-- Lead magnet signups (gated downloads at the end of blog posts and on the
-- homepage). Kept separate from `leads`: these are top-of-funnel email/phone
-- captures with no property/budget/service data, not quote requests.
create table if not exists lead_magnet_signups (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  phone text not null,
  magnet_slug text not null,
  source_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_at timestamptz not null default now()
);

create index if not exists idx_lead_magnet_signups_created on lead_magnet_signups (created_at);
alter table lead_magnet_signups enable row level security;

create table if not exists analytics_events (
  id bigint generated always as identity primary key,
  event_type text not null,
  page_path text not null,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  device_type text,
  visitor_id text,
  session_id text,
  is_bot boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_events_type_date on analytics_events (event_type, created_at);
create index if not exists idx_events_path on analytics_events (page_path);

create table if not exists audit_log (
  id bigint generated always as identity primary key,
  actor_email text not null,
  action text not null,
  detail text,
  created_at timestamptz not null default now()
);

-- Auto-generated equipment price benchmarks, refreshed nightly by
-- /api/cron/sync-equipment-prices from Itel Solar's public storefront API
-- (their live retail catalog, the only wholesaler with a genuinely public,
-- machine-readable price list). Never hand-entered: a stale row just means
-- the last sync failed, not a manually typed guess. One row per
-- (source, category, subtype): panels are priced per watt, inverters per
-- kVA (split by 1-phase / 3-phase), batteries per kWh (split by chemistry).
-- Internal reference for admin quote prep only, never shown to a customer.
create table if not exists equipment_price_benchmarks (
  id bigint generated always as identity primary key,
  source text not null,
  category text not null check (category in ('panel', 'inverter', 'battery')),
  subtype text not null default 'standard',
  unit text not null check (unit in ('watt', 'kva', 'kwh')),
  rate_ngn numeric not null,
  min_rate_ngn numeric not null,
  max_rate_ngn numeric not null,
  sample_size int not null,
  synced_at timestamptz not null default now(),
  unique (source, category, subtype)
);

alter table equipment_price_benchmarks enable row level security;

-- Supplier price lists typed in from a company's own price sheet (e.g. Nexus),
-- for suppliers whose website has no usable public prices. One row per item.
-- Edited in /admin/pricing. Internal quote prep only, never shown to a customer.
-- size is kVA for inverters, kWh for batteries, watts for panels.
create table if not exists supplier_price_items (
  id bigint generated always as identity primary key,
  supplier text not null,
  category text not null check (category in ('inverter', 'battery', 'panel')),
  name text not null,
  size numeric not null check (size > 0),
  voltage text,
  chemistry text check (chemistry in ('lithium', 'tubular')),
  price_ngn numeric not null check (price_ngn > 0),
  available boolean not null default true,
  notes text,
  updated_at timestamptz not null default now()
);

create index if not exists idx_supplier_price_items_lookup on supplier_price_items (category, available);
alter table supplier_price_items enable row level security;

-- Row Level Security: enabled with no public policies on every table.
-- The Next.js server is the only client that ever talks to Supabase, using
-- the service role key, which bypasses RLS entirely. Nothing here is ever
-- reachable from the browser or the anon/authenticated Supabase roles.
alter table admin_users enable row level security;
alter table blog_posts enable row level security;
alter table leads enable row level security;
alter table analytics_events enable row level security;
alter table audit_log enable row level security;

-- Dashboard aggregate functions, called from the admin dashboard via
-- supabase.rpc(...). Kept as SQL functions so the heavy GROUP BY work runs
-- inside Postgres instead of being pulled row-by-row into the app.
--
-- Take an explicit [start_ts, end_ts) range rather than a rolling "last N
-- days" window, so the dashboard's Day/Month/Quarter/Year period picker can
-- ask for any calendar period (e.g. "March 2026" or "Q1 2027"), not only a
-- window ending at the current moment. Dropped first because changing a
-- function's argument types does not replace the old signature in place,
-- it would otherwise leave the old (days int, include_bots boolean)
-- overload behind.
drop function if exists dashboard_totals_by_event(int, boolean);
drop function if exists dashboard_daily_page_views(int, boolean);
drop function if exists dashboard_top_pages(int, boolean, int);
drop function if exists dashboard_top_referrers(int, boolean, int);
drop function if exists dashboard_device_breakdown(int, boolean);

create or replace function dashboard_totals_by_event(start_ts timestamptz, end_ts timestamptz, include_bots boolean)
returns table (event_type text, count bigint)
language sql stable as $$
  select event_type, count(*) as count
  from analytics_events
  where created_at >= start_ts and created_at < end_ts
    and (include_bots or is_bot = false)
  group by event_type
  order by count desc;
$$;

create or replace function dashboard_daily_page_views(start_ts timestamptz, end_ts timestamptz, include_bots boolean)
returns table (day date, count bigint)
language sql stable as $$
  select date(created_at) as day, count(*) as count
  from analytics_events
  where event_type = 'page_view'
    and created_at >= start_ts and created_at < end_ts
    and (include_bots or is_bot = false)
  group by day
  order by day asc;
$$;

create or replace function dashboard_top_pages(start_ts timestamptz, end_ts timestamptz, include_bots boolean, result_limit int default 10)
returns table (page_path text, count bigint)
language sql stable as $$
  select page_path, count(*) as count
  from analytics_events
  where event_type = 'page_view'
    and created_at >= start_ts and created_at < end_ts
    and (include_bots or is_bot = false)
  group by page_path
  order by count desc
  limit result_limit;
$$;

create or replace function dashboard_top_referrers(start_ts timestamptz, end_ts timestamptz, include_bots boolean, result_limit int default 8)
returns table (referrer text, count bigint)
language sql stable as $$
  select coalesce(nullif(referrer, ''), 'Direct / none') as referrer, count(*) as count
  from analytics_events
  where event_type = 'page_view'
    and created_at >= start_ts and created_at < end_ts
    and (include_bots or is_bot = false)
  group by referrer
  order by count desc
  limit result_limit;
$$;

create or replace function dashboard_device_breakdown(start_ts timestamptz, end_ts timestamptz, include_bots boolean)
returns table (device_type text, count bigint)
language sql stable as $$
  select coalesce(nullif(device_type, ''), 'unknown') as device_type, count(*) as count
  from analytics_events
  where event_type = 'page_view'
    and created_at >= start_ts and created_at < end_ts
    and (include_bots or is_bot = false)
  group by device_type
  order by count desc;
$$;
