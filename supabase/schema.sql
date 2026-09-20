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

create index if not exists idx_leads_status on leads (status, created_at);
create index if not exists idx_leads_archived on leads (archived_at);

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

create or replace function dashboard_totals_by_event(days int, include_bots boolean)
returns table (event_type text, count bigint)
language sql stable as $$
  select event_type, count(*) as count
  from analytics_events
  where created_at >= now() - (days || ' days')::interval
    and (include_bots or is_bot = false)
  group by event_type
  order by count desc;
$$;

create or replace function dashboard_daily_page_views(days int, include_bots boolean)
returns table (day date, count bigint)
language sql stable as $$
  select date(created_at) as day, count(*) as count
  from analytics_events
  where event_type = 'page_view'
    and created_at >= now() - (days || ' days')::interval
    and (include_bots or is_bot = false)
  group by day
  order by day asc;
$$;

create or replace function dashboard_top_pages(days int, include_bots boolean, result_limit int default 10)
returns table (page_path text, count bigint)
language sql stable as $$
  select page_path, count(*) as count
  from analytics_events
  where event_type = 'page_view'
    and created_at >= now() - (days || ' days')::interval
    and (include_bots or is_bot = false)
  group by page_path
  order by count desc
  limit result_limit;
$$;

create or replace function dashboard_top_referrers(days int, include_bots boolean, result_limit int default 8)
returns table (referrer text, count bigint)
language sql stable as $$
  select coalesce(nullif(referrer, ''), 'Direct / none') as referrer, count(*) as count
  from analytics_events
  where event_type = 'page_view'
    and created_at >= now() - (days || ' days')::interval
    and (include_bots or is_bot = false)
  group by referrer
  order by count desc
  limit result_limit;
$$;

create or replace function dashboard_device_breakdown(days int, include_bots boolean)
returns table (device_type text, count bigint)
language sql stable as $$
  select coalesce(nullif(device_type, ''), 'unknown') as device_type, count(*) as count
  from analytics_events
  where event_type = 'page_view'
    and created_at >= now() - (days || ' days')::interval
    and (include_bots or is_bot = false)
  group by device_type
  order by count desc;
$$;
