@AGENTS.md

# PowerNexa Solutions — project brief

Full detail lives in `docs/PRD.md` and `docs/SPEC.md`. Read those before making
product or architecture changes. Summary:

- Lagos-only solar, inverter, and battery installation business.
- **Live site:** https://www.powernexasolutions.site (real domain, bought and registered through Vercel, DNS fully propagated). Apex domain redirects to the www version, which is the canonical URL used everywhere (`NEXT_PUBLIC_SITE_URL`).
- **Vercel project:** `omole-creator-s-projects/powernexa`, linked locally via `vercel link --repo`. Deploys automatically on every push to `main` on GitHub (`Omole-creator/powernexa`).
- Brand: navy `#092B4C`, orange `#F58220`, solar yellow `#FFC857`, white background, charcoal `#17212B` text. Fonts: Archivo (display, swapped from Space Grotesk per owner feedback), IBM Plex Sans (body), IBM Plex Mono (numbers, stats).
- Hero headline (final, owner-approved): "Solar and inverter power that never blinks." Do not change without being asked, the owner went through several rounds on this.
- Signature visual motif: the waveform (`src/components/marketing/Waveform.tsx`), a line that resolves from jagged grid power into a smooth sine curve. Used as the hero's bottom divider, section dividers elsewhere, and to explain pure vs modified sine wave inverters on the inverter service page.
- Real installation photos live in `public/images/`: `hero.jpg` (hero background) plus 6 owner-supplied photos (`solar-panel-inverter-wiring.jpg`, `inverter-battery-stack.jpg`, `inverter-wall-mounted.jpg`, `installation-battery-room-1.jpg`, `installation-battery-room-2.jpg`, `installation-distribution-board.jpg`). Per owner rule, **2+ of these images must never appear together in the same section/moment**. On the homepage they sit in 3 fully isolated single-image sections, each separated by at least one unrelated section (Services grid, "How it works", Locations grid, or Testimonials in between). About and each of the 5 service pages carry exactly one more, in its own isolated section. Alt text is intentionally generic ("a technician wiring...") since the source photos show placeholder brand names (NG Power, Soltarc, Phoenix) that are not confirmed real equipment brands PowerNexa installs, don't caption them as if they were.
- Phone/WhatsApp: 0813 209 7317 (`+2348132097317`), and a second number 0906 556 0594 (`+2349065560594`). Both numbers are shown side by side everywhere a phone number appears on the site (header, mobile menu, footer, CTA band, contact page, `/get-a-quote`, terms of service, privacy policy) via `PHONE_DISPLAY`/`PHONE_E164` and `PHONE_DISPLAY_2`/`PHONE_E164_2` in `src/lib/constants.ts`. General "chat with us" WhatsApp links (header, footer, float button, mobile menu, contact page, CtaBand) still open on the first number (`WHATSAPP_NUMBER`). The quote form is the exception: when `QuoteForm` submits, the WhatsApp message it opens (`src/actions/quote.ts`) is routed to the second number only, via `QUOTE_WHATSAPP_NUMBER` (`NEXT_PUBLIC_QUOTE_WHATSAPP_NUMBER` env override, same pattern as `NEXT_PUBLIC_WHATSAPP_NUMBER`), since 0906 556 0594 is the number the owner wants handling quote requests. Contact email: powernexas@gmail.com (also the admin login email).
- Office (service area, not a showroom): 11 Idris Ogunlaja Drive, Sangotedo, Lagos.
- Copy on this site follows `COPYWRITING-PLAYBOOK.md` section 0.1 house style: no em dashes, plain 8th-grade words, short paragraphs, every claim provable. Avoid AI-sounding filler ("real", "seamless", "delve", "crucial", bold mini-heading lists, forced triads). For headline/emotional copy, mine actual Lagos voice-of-customer language (Nairaland, Nigerian Twitter) before writing, terms like "NEPA take light," "up NEPA," "wahala" carry more weight than generic English. Run new copy through the `humanizer` skill before it ships.
- Testimonials on the site are placeholders (fake names, real Lagos neighborhoods), marked with `PLACEHOLDER TESTIMONIAL` comments in `src/lib/testimonials-data.ts`. Replace with real reviews when available. No Review/AggregateRating schema is attached to them while they're placeholders.
- Database is Supabase (Postgres), accessed only from the server via the service role key (`src/lib/supabase.ts`). Schema and dashboard SQL functions live in `supabase/schema.sql`, meant to be pasted once into the Supabase SQL editor. RLS is enabled on every table with no public policies, since the browser never talks to Supabase directly.
- Admin login is created by running `npm run seed:admin` (reads `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env.local`). Blog launch content is created by running `npm run seed:blog` (safe to re-run, skips existing slugs, does not update already-published posts, edit those directly in `/admin/blog` or patch Supabase if the seed data changes later).
- Admin dashboard shows human-only metrics with no toggle to include bots (owner explicitly asked for this, don't re-add an "include bots" switch). It also shows a "unique visits" stat: one visitor counts once per calendar day, a repeat visit the next day counts again. This is computed client-side in `getUniqueVisitCount()` (`src/lib/analytics.ts`) from raw rows, not a SQL function.
- Quote form (`src/components/marketing/QuoteForm.tsx`) is intentionally colored: mist-tinted inputs, thick orange focus ring, navy bold labels, gradient accent bar. Do not revert to plain white/gray styling.
- Scroll/load-in animation: wrap section content in `<Reveal>` (`src/components/ui/Reveal.tsx`) for a staggered fade-up on load and on scroll. Applied to the homepage, service pages, location pages, pricing, FAQ, testimonials, blog listing, contact, and about. `SectionHeading` (`src/components/ui/Container.tsx`) takes a `light` prop for use on navy/dark backgrounds, always pass it there or text is invisible.
- Design system is "elevated cards": `ServiceCard`, `LocationCard`, `TestimonialCard`, and `BlogCard` (all in `src/components/marketing/`) use soft ambient box-shadows (no visible border), `rounded-[28px]`, a gradient icon badge or decorative accent shape, and a hover lift + shadow-growth micro-interaction. `GlowOrb` (`src/components/ui/GlowOrb.tsx`) is a blurred background accent circle used behind key sections (Services, "How it works", Locations, the quote form) for ambient depth, keep new sections in this same visual language rather than reverting to flat bordered cards. `ServiceCard`'s `featured` variant (used once, for `SERVICES[0]` on the homepage) renders as a horizontal split card, icon/title/copy on the left and a navy-to-navy-ink visual panel with a large ghost icon + gradient icon badge on the right, sized to one grid row, `lg:col-span-2` with no `row-span` — it used to span 2 rows to match the height of the two cards beside it and left a large dead-white area under its short content; don't reintroduce a multi-row featured span without redesigning its internal content to actually fill that height. `TestimonialCard` gives each quote a gradient initials-avatar circle (derived from `testimonial.name`) and a faint decorative quote-mark, instead of plain name/location text, to avoid the generic "5 stars + quote + name" template look. `SectionHeading` (`src/components/ui/Container.tsx`) uses tight tracking/leading (`leading-[1.1] tracking-tight`) for a more premium type feel, keep new headings on that component rather than raw `<h2>` tags. The homepage's "How it works" section renders as four connected numbered circles (with a horizontal joining line on desktop) instead of a plain text list, since the steps are a genuine sequence.
- The brand logo source (`public/images/logo.png`) is a flat RGB PNG with a white background baked in, no alpha channel. Pages with a white background (header, admin login) use it directly. Anywhere with a navy background (footer, admin sidebar) uses `public/images/logo-transparent.png` (the same artwork with the white background alpha-matted out via a one-off `sharp` script) inside a small white rounded chip, not `brightness-0 invert` filter — that filter turns the whole non-transparent bounding box solid white, which is why both the footer and the admin sidebar logo were invisible white blocks before this was fixed. If the source logo is ever replaced, regenerate `logo-transparent.png` the same way (or export a proper transparent PNG from the design file) before wiring it into either spot.
- All 6 launch blog posts were audited against the site's own `computeSeoChecklist()` logic and score 71-88/100 with zero keyword-placement failures (title, meta description, slug, first 100 words, at least one heading, image alt all contain the focus keyword). If you add more posts, run the same check before publishing.
- Admin blog content editor (`src/components/admin/BlogContentEditor.tsx`, used by `PostEditorForm`) is a Markdown editor with a formatting toolbar (bold, italic, H2/H3, lists, quote, link), a Write/Preview tab (Preview renders through the same `MarkdownContent` component the public blog uses), and image insertion: the Image toolbar button, drag-and-drop onto the textarea, and pasting an image from the clipboard all upload to Supabase Storage and insert `![alt](url)` at the cursor. Posts are still stored as plain Markdown in `blog_posts.content`, this is not a WYSIWYG/HTML editor. Uploads go through `POST /api/admin/blog-image` (admin-session gated, 5MB cap, images only), into a public `blog-images` bucket that the route auto-creates on first use, no manual Supabase Storage setup needed. `MarkdownContent` renders Markdown images as a plain `<img>` (not `next/image`, since dimensions are unknown ahead of time) with rounded corners and a soft shadow to match the elevated-card look.
- Lead magnet: "21 Questions to Ask Before You Pay an Inverter Installer in Lagos" (`public/downloads/lagos-inverter-installer-checklist.pdf`, filename/slug kept as-is even after the title changed), a 2-page black-and-white checklist (navy used only for the title and stage headings, per owner instruction, everything else stays pure black and white) built from real Nairaland/X complaint research (installers vanishing after a deposit, no load calculation, no written warranty, counterfeit parts, wiring/changeover mistakes). The 21 in the title is a real count of the checklist's tick-boxes across its 5 stages (4+5+3+5+4), not a round number picked for effect, so don't add or remove a checklist item without updating the title (or vice versa). Gated behind `LeadMagnetGate` (`src/components/marketing/LeadMagnetGate.tsx`), placed at the end of every blog post and in its own homepage section between the locations grid and the "what you're buying" proof section. Submitting saves to a `lead_magnet_signups` table (separate from `leads`, since these are top-of-funnel email/phone captures with no property/budget data) and opens the PDF in a new tab. Admin view is `/admin/subscribers`, same CSV export pattern as `/admin/leads`. The registry of magnets (currently just one) lives in `src/lib/lead-magnets.ts`, add new entries there rather than hardcoding a slug/file path in a component. If you write more magnet content, run it through the `humanizer` skill and avoid "real," "actually," and similar filler the way the checklist copy does.
- The site now says explicitly, in three places, that PowerNexa buys and brings every panel, inverter, and battery itself, the customer never has to source parts: the homepage "How it works" step 3 body (`src/app/page.tsx`), a 5th card in the About page's "What you can expect from us" grid (`src/app/about/page.tsx`), and a 4th bullet in the "What happens next" list on `/get-a-quote`. This was an explicit owner request ("we handle everything while the client just sits and watch"), not inferred, keep it in these three spots rather than the hero (hero copy is locked) or as a new standalone section.
- Equipment price benchmarks (`/admin/pricing`) are pulled automatically every night from Itel Solar's public storefront API (`https://itelsolar.com/wp-json/wc/store/v1/products`, a public, unauthenticated WooCommerce endpoint, the same one their own shop page uses), never typed in by hand. `src/lib/itel-catalog.ts` fetches and parses their PV Panels, Inverters, and Solar Battery categories into ₦/watt, ₦/kVA (split by 1-phase/3-phase), and ₦/kWh (split by chemistry) medians; `src/lib/price-benchmarks.ts` writes them to the `equipment_price_benchmarks` table, replacing the prior snapshot for that source rather than upserting, so a subtype Itel stops stocking disappears instead of going stale. The cron route is `/api/cron/sync-equipment-prices` (`vercel.json`, nightly at 03:00 UTC), protected by the `CRON_SECRET` env var Vercel sends automatically on cron-triggered requests (already generated and set in Vercel for all three environments, and in `.env.local`, along with the `equipment_price_benchmarks` table already run in the Supabase SQL editor, so this is live, not an open item). Admin can also trigger a sync on demand from `/admin/pricing` (`src/actions/pricing.ts`). These are retail prices from a public catalog, not confirmed wholesale/trade rates, and are explicitly benchmarks for internal quote prep, not a literal per-item cost. **Cworth Solar Energy** (a second wholesaler the owner asked about, `cworthsolarenergy.com.ng`) is a client-rendered React/Supabase app with no server-rendered content and no public product API, don't attempt to scrape it or extract API keys from its JS bundle to query its backend directly, that would be unauthorized access to another company's database, not a public interface. The only legitimate way to get their pricing automatically would be an actual data-sharing agreement with them. The `/admin/pricing` calculator is for internal quote prep only, per owner instruction the customer never sees a price range or estimate; their number always comes from the site visit.

## Top 30 blog topics (SEO content roadmap)

Chosen to build topical authority around the three highest-value keyword clusters
from the Lagos keyword research (installation, local-provider, pricing), plus
location pages and trust/credibility content. Write these in roughly this order,
pricing and cost-guide posts first (highest existing search intent and easiest to
rank, per the low-competition keywords in the research), then location posts,
then technical/trust posts.

1. How Much Does Solar Panel Installation Cost in Lagos? (Price Guide)
2. Solar Panel Installation Cost in Lagos: A Full Breakdown by System Size
3. Best Solar Installers in Lagos: What to Check Before You Pay Anyone
4. Solar and Inverter Installation in Lagos: The Complete Homeowner's Guide
5. How to Choose the Right Inverter Size for Your Lagos Home
6. Solar Panels for Home in Lagos: Is It Worth It in 2026?
7. Inverter vs Generator: Which Saves You More Money in Lagos?
8. How Many Solar Panels Do You Need to Power a 3-Bedroom Flat in Lagos?
9. Solar Battery Types Explained: Lithium vs Tubular for Lagos Homes
10. Signs Your Inverter Battery Needs Replacement (And What It Costs)
11. Solar Installation in Victoria Island: What Homeowners Need to Know
12. Solar Installers in Lekki Phase 1: A Local Buyer's Guide
13. Solar Power for Ikoyi Homes: Backup Systems for Luxury Properties
14. Solar and Inverter Installation in Ajah: Affordable Options for Families
15. Solar Installation in VGC (Victoria Garden City): Estate-Wide Solutions
16. Best Solar Companies Near Sangotedo and Ajah
17. How to Size a Solar System for an Office or Clinic in Lagos
18. Commercial Solar for Business in Lagos: Cutting Diesel Costs at Scale
19. Solar for Estates in Lagos: Adding Power Backup From Day One
20. Off-Grid vs Hybrid Solar Systems: Which Is Right for Lagos Power Cuts?
21. How Long Does a Solar Panel Installation Take in Lagos?
22. Solar Panel Maintenance in Lagos: A Checklist for Harmattan and Rainy Season
23. Common Inverter Problems in Nigeria and How to Fix Them
24. How to Read Your Electricity Bill and Know If Solar Will Save You Money
25. Monocrystalline vs Polycrystalline Solar Panels: Which Suits Lagos Heat?
26. What Warranty Should You Expect From a Solar Installer in Lagos?
27. 7 Questions to Ask a Solar Installer Before You Sign a Contract
28. How Net Metering and Feed-in Policies Could Affect Lagos Homeowners
29. Solar Panel Installation for Rental Properties: A Landlord's Guide
30. Actual Cost of Running Generators vs Solar in Lagos: A 5-Year Comparison

The first 6 of these are seeded as full, published posts at launch (via `npm run seed:blog`) so the blog
is not empty. The rest are backlog for the owner/marketer to write using the
admin blog editor's built-in SEO checklist.

## Deployment (already done, for reference)

1. Supabase project created (`sxdhtbzzadbtsygwruyj`), `supabase/schema.sql` run in its SQL editor.
2. Env vars set in `.env.local` and in Vercel (`vercel env add`, all three environments: production, preview, development). See `.env.example` for the full list.
3. `npm run seed:admin` and `npm run seed:blog` run once locally against the live Supabase project.
4. Project linked to Vercel (`vercel link --repo`) and deployed. Custom domain `powernexasolutions.site` (and `www.`) purchased and attached through Vercel, DNS auto-configured since Vercel is the registrar.

To make further changes live: commit and push to `main`, Vercel auto-deploys.
To change an env var, use `vercel env rm <name> <environment>` then
`vercel env add <name> <environment>` (reads the value from stdin), for all
three environments, then push or redeploy to pick it up. The Vercel CLI is
occasionally flaky with transient "fetch failed" / "Not able to load teams"
errors, just retry the exact same command.

## Known open items

- `analytics_events` table may still contain test rows from development and
  smoke-testing (curl calls, manual verification). The owner asked for these
  to be cleared so the dashboard starts clean at launch. Bulk deletes against
  Supabase get blocked by Claude Code's auto-mode safety classifier; the owner
  was given `delete from analytics_events;` to run themselves in the Supabase
  SQL editor. Unconfirmed whether they've run it yet, check before assuming
  the dashboard is clean.
- Owner asked twice for more FAQs "based on research" beyond the current set
  (4 on the homepage, more on `/faq`). Not yet actioned, do proper Lagos-specific
  research (forums, common objections) before writing new ones, not invented Q&As.
- Leads can now be edited and archived from `/admin/leads` (archiving sets
  `archived_at` instead of deleting the row; hard delete was deliberately left
  out, per the owner, so the lead record stays trustworthy for both business
  partners, archived leads are viewable/restorable via the "View archived"
  link, never gone for good). This needs a one-time
  `alter table leads add column if not exists archived_at timestamptz;`
  (already in `supabase/schema.sql`) run in the Supabase SQL editor before
  it works, the service role key can't run DDL, only Data API queries.
  **Confirm this has been run before trusting `/admin/leads` or the
  dashboard in production** — until it is, both will 500, since the leads
  queries now select/filter on `archived_at`.
- Dashboard (`/admin`) has a Day/Month/Quarter/Year period dropdown
  (`src/components/admin/DashboardPeriodFilter.tsx`, ranges resolved in
  `src/lib/date-range.ts`), year options run from 2026 to (current year + 3)
  automatically. This needed the five `dashboard_*` SQL functions in
  `supabase/schema.sql` changed from a rolling `days int` window to an
  explicit `start_ts timestamptz, end_ts timestamptz` range, which needs the
  updated function definitions (including their `drop function if exists
  ...(int, boolean[, int])` lines, changing a function's argument types
  does not replace it in place) pasted into the Supabase SQL editor once.
  **Confirm this has been run before trusting `/admin`** — until it is, the
  dashboard 500s, since the app now calls the new signature only.
