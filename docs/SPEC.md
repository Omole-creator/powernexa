# PowerNexa Solutions — Technical Specification

Companion to `PRD.md`. This document defines how the product is built.

## 1. Stack

- **Framework:** Next.js 16 (App Router, TypeScript), already scaffolded by `create-next-app`.
- **Styling:** Tailwind CSS v4 (already installed), custom theme tokens for the brand palette.
- **Database:** `node:sqlite` (Node's built-in synchronous SQLite driver, Node 22.5+/24 — no native module compilation required, works out of the box on Windows). File stored at `data/powernexa.db`, created and migrated automatically on first server start.
- **New npm dependencies (minimal, justified):**
  - `react-markdown`, `remark-gfm`, `rehype-slug` — safe Markdown rendering for blog posts, GFM tables/strikethrough, and auto-generated heading IDs for the table of contents. Everything else (auth, hashing, sessions, CSV export, SEO scoring) is hand-rolled with Node/Web built-ins to avoid unnecessary dependencies.
- **Rendering model:** default Next.js rendering (no Cache Components / `cacheComponents` flag). Static pages where possible, `revalidate` for the blog list/detail so new posts appear without a redeploy, fully dynamic for `/admin/*`.
- **Auth:** cookie-based session, HMAC-signed (Node `crypto`, no JWT library needed), `httpOnly`, `secure` in production, `sameSite=lax`. Passwords hashed with `crypto.scrypt` (built-in, no bcrypt dependency).
- **Request interception:** `proxy.ts` (Next 16's renamed `middleware.ts`) guards all `/admin` routes except `/admin/login`.

## 2. Directory structure

```
data/                          # sqlite db file lives here (gitignored)
docs/
  PRD.md
  SPEC.md
src/
  app/
    layout.tsx                 # root layout: fonts, header, footer, WhatsApp button, tracker
    page.tsx                   # Home
    about/page.tsx
    services/
      page.tsx                 # Services overview
      solar-panel-installation/page.tsx
      inverter-installation/page.tsx
      battery-replacement-storage/page.tsx
      solar-maintenance-repair/page.tsx
      commercial-solar-for-business/page.tsx
    locations/
      page.tsx                 # Locations overview
      [area]/page.tsx          # generateStaticParams over LAGOS_AREAS
    pricing/page.tsx
    faq/page.tsx
    testimonials/page.tsx
    blog/
      page.tsx                 # listing + pagination
      category/[category]/page.tsx
      [slug]/page.tsx
      [slug]/opengraph-image.tsx
    get-a-quote/page.tsx
    contact/page.tsx
    privacy-policy/page.tsx
    terms-of-service/page.tsx
    sitemap.ts
    robots.ts
    opengraph-image.tsx         # default OG image
    api/
      track/route.ts            # POST analytics events (public)
      leads/export/route.ts     # CSV export (admin only)
      analytics/export/route.ts # CSV export (admin only)
    admin/
      layout.tsx                 # admin shell (sidebar, nav, logout)
      login/page.tsx
      page.tsx                   # dashboard
      leads/page.tsx
      leads/[id]/page.tsx
      blog/page.tsx
      blog/new/page.tsx
      blog/[id]/edit/page.tsx
      audit-log/page.tsx
      settings/page.tsx
  components/
    layout/Header.tsx, Footer.tsx, WhatsAppFloatButton.tsx, MobileNav.tsx
    marketing/*  (Hero, ServiceCard, LocationCard, TestimonialCard, FaqAccordion,
                  QuoteForm, StatStrip, TrustBadges, BlogCard, Breadcrumbs, TableOfContents, CtaBand)
    admin/*      (SeoChecklist, MarkdownEditor, StatCard, DataTable, LeadStatusSelect, Sparkbars)
    analytics/AnalyticsBeacon.tsx  (client tracker mount)
  lib/
    db.ts               # DatabaseSync connection, schema migration, seed
    auth.ts             # session sign/verify, password hash/verify, cookie helpers
    dal.ts              # verifySession(), requireAdmin() data-access-layer
    leads.ts            # lead CRUD + audit logging
    blog.ts             # post CRUD, slugify, reading time, seo scoring
    analytics.ts        # event insert + dashboard aggregation queries
    audit.ts            # audit log writer/reader
    whatsapp.ts         # wa.me URL builder + message templates
    seo.ts              # JSON-LD builders (LocalBusiness, Service, BlogPosting, FAQPage, Breadcrumb)
    constants.ts        # NAP, service list, Lagos areas, nav links, site URL
    validation.ts       # small hand-rolled field validators
  actions/
    quote.ts            # 'use server' submitQuote()
    auth.ts             # 'use server' login()/logout()
    blog.ts             # 'use server' createPost/updatePost/deletePost/publishPost
    leads.ts            # 'use server' updateLeadStatus()
    settings.ts         # 'use server' changePassword()
  proxy.ts (project root, sibling of src per Next.js convention when using src/)
```

## 3. Database schema

```sql
CREATE TABLE admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,              -- markdown
  category TEXT NOT NULL,
  tags TEXT NOT NULL DEFAULT '[]',    -- JSON array
  focus_keyword TEXT NOT NULL DEFAULT '',
  meta_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  canonical_url TEXT,
  featured_image TEXT,
  featured_image_alt TEXT,
  author_name TEXT NOT NULL DEFAULT 'PowerNexa Solutions Team',
  status TEXT NOT NULL DEFAULT 'draft',   -- draft | published
  noindex INTEGER NOT NULL DEFAULT 0,
  reading_time_minutes INTEGER NOT NULL DEFAULT 1,
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  area TEXT NOT NULL,
  property_type TEXT NOT NULL,
  service_interest TEXT NOT NULL,
  budget_range TEXT,
  message TEXT,
  source_page TEXT,
  utm_source TEXT, utm_medium TEXT, utm_campaign TEXT,
  status TEXT NOT NULL DEFAULT 'new',  -- new | contacted | quoted | won | lost
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,     -- page_view | whatsapp_click | call_click | quote_form_submit | blog_view | cta_click
  page_path TEXT NOT NULL,
  referrer TEXT,
  utm_source TEXT, utm_medium TEXT, utm_campaign TEXT,
  device_type TEXT,             -- mobile | desktop | tablet
  visitor_id TEXT,               -- long-lived anonymous cookie id
  session_id TEXT,                -- short-lived session id
  is_bot INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_email TEXT NOT NULL,
  action TEXT NOT NULL,          -- login | create_post | update_post | publish_post | delete_post | update_lead_status | change_password
  detail TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

Indexes on `blog_posts(slug)`, `blog_posts(status, published_at)`, `analytics_events(event_type, created_at)`, `analytics_events(page_path)`, `leads(status, created_at)`.

## 4. Auth flow

1. `POST /admin/login` (Server Action `login`) — looks up `admin_users` by email, verifies password with `scrypt`, on success signs a payload `{ sub: userId, email }` with HMAC-SHA256 using `SESSION_SECRET`, sets it as an `httpOnly` cookie `pnx_session`, writes an `audit_log` row (`action: 'login'`), redirects to `/admin`.
2. `proxy.ts` matches `/admin/:path*`, allows `/admin/login` through, otherwise verifies the cookie signature and expiry; redirects to `/admin/login` if missing/invalid. This is the **optimistic** check per Next.js guidance.
3. Every Server Action and admin page additionally calls `requireAdmin()` from `lib/dal.ts` (the **secure** check) before touching the database, per Next.js's defense-in-depth recommendation — proxy alone is not trusted.
4. Admin users are seeded from `ADMIN_EMAIL` / `ADMIN_PASSWORD` environment variables on server boot (`lib/db.ts`); changing those env vars and restarting updates/creates the account. `/admin/settings` also allows changing the password from inside the app (writes directly to `admin_users` + audit log).

## 5. Analytics pipeline

- `components/analytics/AnalyticsBeacon.tsx` (Client Component, mounted once in root layout): on mount, ensures `pnx_vid` (1-year cookie) and `pnx_sid` (30-minute sliding cookie) exist, then `fetch('/api/track', { method: 'POST', keepalive: true, body: {...} })` for a `page_view` event with `path`, `referrer`, parsed `utm_*` from `location.search`, and a `device_type` guess from `navigator.userAgent`/viewport width.
- Buttons that matter for the anti-fraud requirement (`WhatsAppFloatButton`, header call button, in-page WhatsApp/call CTAs) call `navigator.sendBeacon('/api/track', ...)` in `onClick` before the `tel:`/`wa.me` navigation happens, tagged `whatsapp_click` or `call_click` with the current `page_path`.
- `app/api/track/route.ts` validates `event_type` against a whitelist, trims/limits string lengths, derives `is_bot` from a small known-crawler user-agent substring list (does not drop bot rows, just flags them so dashboard totals can be shown "all traffic" or "human only"), and inserts into `analytics_events`. No raw IP is ever stored.
- Quote form submissions are recorded server-side inside the `submitQuote` Server Action (not the client beacon), which is the tamper-resistant source of truth for conversions.
- `/admin` dashboard aggregates with simple `GROUP BY` SQL queries (counts per day for the last 30 days, counts per `event_type`, top 10 `page_path`, top referrers) rendered with a dependency-free CSS/SVG bar chart component (`Sparkbars`).

## 6. SEO implementation checklist

- `generateMetadata` on every dynamic route (services, locations, blog posts) builds unique `<title>`, `<meta description>`, canonical URL, and Open Graph tags from the page's own data.
- `app/sitemap.ts` enumerates all static routes + every published blog post + every location + every service, using `lastModified` from `updated_at` where available.
- `app/robots.ts` allows all crawlers on public routes, disallows `/admin` and `/api`.
- JSON-LD via a small `<JsonLd data={...} />` component rendering a `<script type="application/ld+json">`:
  - Root layout: `HomeAndConstructionBusiness` (NAP, areaServed, priceRange, openingHours).
  - Each service page: `Service` + `BreadcrumbList`.
  - Each location page: `Service` scoped to that `areaServed` + `BreadcrumbList`.
  - Each blog post: `BlogPosting` + `BreadcrumbList`.
  - `/faq`: `FAQPage`.
  - Testimonials are **not** marked up with `Review`/`AggregateRating` schema while they remain placeholders (Google policy risk for non-genuine review markup); revisit once real reviews replace them.
- `next/og` `ImageResponse` generates a branded OG image per blog post (navy background, orange accent bar, post title) and one default OG image for the rest of the site, so every shared link looks intentional with zero manual image work.
- Internal linking: every service page links to its relevant location pages and at least 2 blog posts; every blog post's editor surfaces an internal-link helper list.

## 7. Quote form → WhatsApp flow

1. `QuoteForm` (Client Component) collects name, phone, Lagos area, property type, service needed, optional budget range and message, plus hidden `utm_*`/`source_page` fields populated from `location.search`/`pathname` on mount.
2. Submits via `useActionState` to the `submitQuote` Server Action.
3. The action validates input, inserts a `leads` row (`status: 'new'`), inserts an `analytics_events` row (`quote_form_submit`), builds a WhatsApp deep link `https://wa.me/2348132097317?text=<encoded summary of the request>`, and returns `{ success: true, whatsappUrl }`.
4. On success, the client shows a confirmation panel and both auto-opens the WhatsApp link in a new tab (`window.open`) and displays it as a big fallback button (mobile popup blockers), so the lead reaches the owner's WhatsApp immediately while also being permanently recorded in `/admin/leads`.

## 8. Admin blog SEO checklist logic (`components/admin/SeoChecklist.tsx`)

Pure client-side string analysis, recalculated on every keystroke:

- Title length 50–60 chars → green; 40–70 → yellow; else red.
- Meta description length 140–160 chars → green; 120–170 → yellow; else red.
- Focus keyword found in: title, meta description, slug, first 100 words of content, at least one `##`/`###` heading, featured image alt text — each is a pass/fail checklist row.
- Word count: ≥1200 green, ≥600 yellow, else red.
- Heading count: at least 2 `##`/`###` headings.
- Internal link count: at least 2 markdown links starting with `/`.
- Simple readability estimate: average words per sentence + a vowel-group syllable heuristic to approximate a Flesch Reading Ease score, bucketed into "Easy / OK / Hard to read."
- Overall score (0–100) is a weighted sum of the above, shown as a labeled progress bar with a checklist underneath so the editor knows exactly what to fix.

## 9. Environment variables (`.env.local`, not committed)

```
ADMIN_EMAIL=
ADMIN_PASSWORD=
SESSION_SECRET=            # long random string; generate with `openssl rand -base64 32`
NEXT_PUBLIC_SITE_URL=https://powernexasolutions.com
NEXT_PUBLIC_WHATSAPP_NUMBER=2348132097317
NEXT_PUBLIC_GA_MEASUREMENT_ID=   # optional, leave blank until a GA4 property exists
```

## 10. Build & verification steps

1. `npm install` (adds the three Markdown packages).
2. `npm run build` must pass with no type errors.
3. `npm run dev`, manual curl/browser check of: home, one service page, one location page, blog list/detail, get-a-quote form happy path, admin login → dashboard → create/publish a post → verify it appears on `/blog`.
4. Confirm `sitemap.xml` and `robots.txt` render.
