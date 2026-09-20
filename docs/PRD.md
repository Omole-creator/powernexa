# PowerNexa Solutions — Product Requirements Document

**Owner:** Omole Usuangbon (business owner)
**Prepared by:** Claude Code, acting as product/growth lead, copywriter, frontend designer, and SEO lead
**Date:** 2026-09-20
**Status:** Approved for build

---

## 1. Business summary

PowerNexa Solutions is a solar, inverter, and battery installation business serving homes and businesses across Lagos, Nigeria. The company installs, maintains, and repairs solar panels, inverters, and battery backup systems for homeowners, estates, offices, clinics, and small businesses.

- **Tagline:** Solar, Inverter and Battery Solutions for Homes and Businesses
- **Service area:** Lagos only (Victoria Island, Lekki Phase 1, Ikoyi, Ajah, VGC, Sangotedo, Ikeja, Lagos Mainland, and surrounding areas)
- **Office:** 11 Idris Ogunlaja Drive, Sangotedo, Lagos (service-area business, not a retail showroom)
- **Phone / WhatsApp:** 0813 209 7317
- **Domain:** placeholder `powernexasolutions.com` until a real domain is purchased
- **Primary contact channel:** phone call and WhatsApp (no public email at launch, by owner's choice)

## 2. Problem statement

Nigeria's unreliable grid power means Lagos homes and businesses need solar, inverter, and battery systems, but the market is full of unlicensed installers with no way to verify quality, pricing, or reliability. Buyers actively search Google for installers, pricing, and comparisons before they call anyone. A business with no credible, fast, mobile-friendly website loses these buyers to competitors who show up first and look more trustworthy.

## 3. Goals

1. **Rank on page 1 of Google** for high-intent Lagos solar/inverter keywords within 3 months.
2. **Convert visitors into leads** through phone calls, WhatsApp chats, and quote-form submissions.
3. **Build trust fast** — a visitor should believe PowerNexa is a real, competent, Lagos-based installer within 5 seconds of landing.
4. **Give both business partners equal, tamper-evident visibility** into leads and traffic, so neither party can dispute or hide what the site is generating.
5. **Give the business a blog it can actually win with** — an editor with built-in on-page SEO guidance, not just a text box.

## 4. Target audience

| Segment | Description | Primary intent |
|---|---|---|
| Homeowners | Middle/upper-income households in VI, Lekki, Ikoyi, Ajah, VGC | Stop buying fuel for generators; want quiet, reliable backup |
| Estates & facility managers | Gated estates, serviced apartments | Shared backup infrastructure, maintenance contracts |
| SMEs / offices / clinics | Small businesses that lose money during outages | Commercial-grade systems, uptime guarantees |
| Property developers | Building new homes/estates | Solar pre-installation during construction |

## 5. Success metrics

- Organic keyword rankings (top 30 target list, see `CLAUDE.md`) reach page 1 within 90 days.
- Month-over-month growth in: page views, WhatsApp clicks, call clicks, quote form submissions.
- Lead-to-contact rate (leads marked "contacted" within 24h).
- Blog posts indexed by Google within 7 days of publish (verified via Search Console once connected).
- Zero disputes between partners about lead/traffic counts (audit log resolves any question).

## 6. Scope

### 6.1 In scope (v1)
- Multipage marketing site: Home, About, Services (overview + 5 detail pages), Locations (overview + area pages), Pricing/cost guide, FAQ, Testimonials, Blog (listing, category, post), Get a Quote, Contact, Privacy Policy, Terms of Service.
- Quote form that stores the lead AND hands the visitor to WhatsApp with a prefilled message.
- Floating WhatsApp button and click-to-call on every page.
- First-party analytics (page views, WhatsApp clicks, call clicks, form submits, blog reads, traffic source, device type) stored in the site's own database, visible to both partners in `/admin`.
- Admin panel: login, dashboard, leads inbox (with CSV export), blog CMS with an on-page SEO checklist, audit log, password management.
- Full technical SEO: metadata, sitemap, robots.txt, JSON-LD structured data, semantic headings, fast Core Web Vitals.
- Placeholder testimonials (fake full names + real Lagos neighborhoods) clearly marked in code comments for later replacement with genuine reviews.
- 30 SEO-strategic blog topics documented in `CLAUDE.md` for future content production.

### 6.2 Out of scope (v1) — noted for later
- Real customer photos, project galleries, and video (business has none yet).
- Payment processing / online checkout (leads are quoted manually).
- Multi-city expansion (Lagos only).
- Native mobile app.
- Third-party review platform integrations (Google Reviews embed) — recommended once real reviews exist.
- Login for customers (only admin/staff accounts exist).
- Email as a contact channel (owner chose WhatsApp/phone-only at launch).

## 7. Brand

| Token | Value |
|---|---|
| Primary (navy) | `#092B4C` |
| Accent (orange) | `#F58220` |
| Secondary accent (solar yellow) | `#FFC857` |
| Background | `#FFFFFF` |
| Text (charcoal) | `#17212B` |

Logo: `logo.png`, placed top-left of the header on every page, linked to the homepage.

## 8. Content & copywriting standard

All on-site copy follows the house style already checked into this repo (`COPYWRITING-PLAYBOOK.md`, section 0.1): no em dashes, plain conversational words, short paragraphs (1–3 lines), every claim provable, no filler, no jargon a normal person wouldn't say. Copy leads with the reader's problem (unreliable power, fuel costs, generator noise) before pitching the solution.

## 9. SEO strategy summary

Based on the Lagos-only keyword research provided (50-keyword export), the site targets three keyword clusters as **money pages**:

1. **Installation cluster** — solar panel installation, solar power installation, solar and inverter installation, solar system installation (all Low competition, 500–5,000 monthly searches).
2. **Local-provider cluster** — solar installers near me, solar companies near me, solar installation companies near me (Low competition, used on location pages).
3. **Pricing cluster** — solar installation cost, solar panel price, solar system cost (used on the Pricing page, captures buyers before they contact a competitor).

Location pages (VI, Lekki, Ikoyi, Ajah, VGC, Sangotedo, Ikeja, Lagos Mainland) exist only because PowerNexa can genuinely serve these areas — no fake location pages for areas outside Lagos.

The top 30 blog topics chosen to build topical authority, trust, and long-tail traffic are documented in `CLAUDE.md`.

## 10. Analytics & anti-fraud requirement

Because two partners share this business, the site tracks its own first-party metrics (not solely a Google Analytics account one partner could control alone):

- Every page view, WhatsApp click, call click, and quote submission is written to the site's database with a timestamp.
- Records are **insert-only** from the admin UI — there is no delete button for leads or analytics events, only status updates (e.g., lead marked "contacted").
- An **audit log** records every admin login and every content/lead change (who, what, when), viewable by both accounts.
- Both partners get their own login (or a shared login, per the owner's final decision) with identical read access to leads and analytics — no partner sees a different number than the other.
- CSV export is available so either partner can keep an independent copy outside the admin panel.

## 11. Admin / blog CMS requirements

The blog editor must give a non-technical marketer everything needed to rank a post, without leaving the admin panel:

- Title, slug (auto-generated, editable), excerpt, body (Markdown with live preview).
- Meta title + meta description fields with live character counters (Google's practical display limits).
- Focus keyword field, checked live against: title, meta description, URL slug, first 100 words, at least one subheading, and image alt text.
- Live on-page SEO score (0–100) with a pass/fail checklist, plus word count and a simple readability estimate.
- Featured image URL + required alt text field (no fake stock photos are bundled; admin supplies real images as they're taken).
- Category, tags, canonical URL, "noindex" toggle, scheduled publish date, author name, auto-computed reading time.
- Internal-link helper listing other published posts and service pages the admin can link to.
- Auto-generated social share image (OG image) per post, built at request time from the title (no manual image needed).

## 12. Risks & open items

- **Domain not yet purchased.** All URLs use `https://powernexasolutions.com` as a placeholder. Find-and-replace once the real domain is live (documented in README).
- **No email channel.** Some SEO/schema fields (e.g., `LocalBusiness.email`) are omitted; this can be revisited if the owner adds an email later.
- **Testimonials are placeholders.** Fake full names and real Lagos neighborhoods, clearly marked with a code comment (`PLACEHOLDER TESTIMONIAL — replace with real customer review`) so they're easy to find and swap.
- **SQLite storage.** The database is a local file (`data/powernexa.db`). This works for local development and traditional/VM hosting. If the site is deployed to a serverless platform with an ephemeral filesystem (e.g., Vercel's default), the database must be migrated to a hosted database (documented in README) before go-live, or deployed to a host with persistent disk (e.g., a VPS, Render, Railway, Fly.io).
- **Admin credentials.** Seeded from environment variables (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) so the owner can set real credentials without a code change.
