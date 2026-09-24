@AGENTS.md

# PowerNexa Solutions — project brief

Full detail lives in `docs/PRD.md` and `docs/SPEC.md`. Read those before making
product or architecture changes. Summary:

- Lagos-only solar, inverter, and battery installation business.
- **Live site:** https://www.powernexasolutions.site (real domain, bought and registered through Vercel, DNS fully propagated). Apex domain redirects to the www version, which is the canonical URL used everywhere (`NEXT_PUBLIC_SITE_URL`).
- **Vercel project:** `omole-creator-s-projects/powernexa`, linked locally via `vercel link --repo`. Deploys automatically on every push to `main` on GitHub (`Omole-creator/powernexa`).
- Brand: navy `#092B4C`, orange `#F58220`, solar yellow `#FFC857`, white background, charcoal `#17212B` text. Fonts: Archivo (display, swapped from Space Grotesk per owner feedback), IBM Plex Sans (body), IBM Plex Mono (numbers, stats).
- Hero headline (final, owner-approved): "Solar and inverter power that never blinks." Do not change without being asked, the owner went through several rounds on this.
- Signature visual motif: the waveform (`src/components/marketing/Waveform.tsx`), a line that resolves from jagged grid power into a smooth sine curve. No longer in the homepage hero (the hero now fades into white under the photo collage, per the owner's template), still used in the CTA band, section dividers elsewhere, and to explain pure vs modified sine wave inverters on the inverter service page.
- Real installation photos live in `public/images/`: `hero.jpg` (hero background) plus 6 owner-supplied photos (`solar-panel-inverter-wiring.jpg`, `inverter-battery-stack.jpg`, `inverter-wall-mounted.jpg`, `installation-battery-room-1.jpg`, `installation-battery-room-2.jpg`, `installation-distribution-board.jpg`). Per owner rule, **2+ of these images must never appear together in the same section/moment**. **One owner-requested exception (Sept 2026):** the homepage hero shows `installation-battery-room-2.jpg`, `solar-panel-inverter-wiring.jpg` (middle) and `installation-battery-room-1.jpg` together as an overlapping 3-photo collage (`src/components/marketing/HeroCollage.tsx`). Don't reuse any of those three elsewhere on the homepage. The other homepage photos (`installation-distribution-board.jpg`, `inverter-battery-stack.jpg`) stay in their own isolated single-image sections. About and each of the 5 service pages carry exactly one more, in its own isolated section. Alt text is intentionally generic ("a technician wiring...") since the source photos show placeholder brand names (NG Power, Soltarc, Phoenix) that are not confirmed real equipment brands PowerNexa installs, don't caption them as if they were.
- Phone/WhatsApp: 0813 209 7317 (`+2348132097317`), and a second number 0708 695 0312 (`+2347086950312`, replaced 0906 556 0594 in Sept 2026, the old number must not appear anywhere). Both numbers are shown side by side everywhere a phone number appears on the site (header, mobile menu, footer, CTA band, contact page, `/get-a-quote`, terms of service, privacy policy) via `PHONE_DISPLAY`/`PHONE_E164` and `PHONE_DISPLAY_2`/`PHONE_E164_2` in `src/lib/constants.ts`. General "chat with us" WhatsApp links (header, footer, float button, mobile menu, contact page, CtaBand) still open on the first number (`WHATSAPP_NUMBER`). The quote form is the exception: when `QuoteForm` submits, the WhatsApp message it opens (`src/actions/quote.ts`) is routed to the second number only, via `QUOTE_WHATSAPP_NUMBER` (`NEXT_PUBLIC_QUOTE_WHATSAPP_NUMBER` env override, not set in Vercel, so the constant's fallback is what's live). Contact email: powernexas@gmail.com (also the admin login email).
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
- Admin blog content editor (`src/components/admin/BlogContentEditor.tsx`, used by `PostEditorForm`) is a Markdown editor with a formatting toolbar (bold, italic, H2/H3, lists, quote, link), a Write/Preview tab (Preview renders through the same `MarkdownContent` component the public blog uses), and image insertion: the Image toolbar button, drag-and-drop onto the textarea, and pasting an image from the clipboard all upload to Supabase Storage and insert `![alt](url)` at the cursor. Posts are still stored as plain Markdown in `blog_posts.content`, this is not a WYSIWYG/HTML editor. Uploads go through `POST /api/admin/blog-image` (admin-session gated, 5MB cap, images only), into a public `blog-images` bucket that the route auto-creates on first use, no manual Supabase Storage setup needed. `MarkdownContent` renders Markdown images as a plain `<img>` (not `next/image`, since dimensions are unknown ahead of time) with rounded corners and a soft shadow to match the elevated-card look. The featured image is uploaded the same way (`FeaturedImageField`, upload button or drag-and-drop, no URL box) and is used in three places: a 16:9 `rounded-[28px]` frame at the top of the post, the `BlogCard` thumbnail (cards without one keep the navy gradient header), and the social share preview. Uploads (body and featured) are scaled down in the browser to 1920px on the long edge as ~85% JPEG before sending (`src/lib/blog-image-upload.ts`), so phone photos fit under the 5MB cap; `sharp` isn't a direct dependency, so don't move resizing to the server without adding it. The field warns when an image is under 1200px wide, since that's what made the first featured image (a 610px Google Images thumbnail link on the inverter vs generator post) look blurry.
- Lead magnet: "21 Questions to Ask Before You Pay an Inverter Installer in Lagos" (`public/downloads/lagos-inverter-installer-checklist.pdf`, filename/slug kept as-is even after the title changed), a 2-page black-and-white checklist (navy used only for the title and stage headings, per owner instruction, everything else stays pure black and white) built from real Nairaland/X complaint research (installers vanishing after a deposit, no load calculation, no written warranty, counterfeit parts, wiring/changeover mistakes). The 21 in the title is a real count of the checklist's tick-boxes across its 5 stages (4+5+3+5+4), not a round number picked for effect, so don't add or remove a checklist item without updating the title (or vice versa). Gated behind `LeadMagnetGate` (`src/components/marketing/LeadMagnetGate.tsx`), placed at the end of every blog post and in its own homepage section between the locations grid and the "what you're buying" proof section. Submitting saves to a `lead_magnet_signups` table (separate from `leads`, since these are top-of-funnel email/phone captures with no property/budget data) and opens the PDF in a new tab. Admin view is `/admin/subscribers`, same CSV export pattern as `/admin/leads`. The registry of magnets (currently just one) lives in `src/lib/lead-magnets.ts`, add new entries there rather than hardcoding a slug/file path in a component. If you write more magnet content, run it through the `humanizer` skill and avoid "real," "actually," and similar filler the way the checklist copy does.
- The site now says explicitly, in three places, that PowerNexa buys and brings every panel, inverter, and battery itself, the customer never has to source parts: the homepage "How it works" step 3 body (`src/app/page.tsx`), a 5th card in the About page's "What you can expect from us" grid (`src/app/about/page.tsx`), and a 4th bullet in the "What happens next" list on `/get-a-quote`. This was an explicit owner request ("we handle everything while the client just sits and watch"), not inferred, keep it in these three spots rather than the hero (hero copy is locked) or as a new standalone section.
- Equipment pricing (`/admin/pricing`) has two parts. (1) **Job cost calculator** (`src/components/admin/PricingCalculator.tsx`, math in `src/lib/costing.ts`), built from the owner's `solar_pricing_guide.docx`: supplier cost plus owner-set markups (inverter 10%, battery 20%, panels 10%, mounting / cables and MC4 / breakers, isolators and SPD / earthing 35% each, set by the owner in Sept 2026, don't change without being asked), then labour, transport and site survey. Those three are editable per job in the calculator (they change job to job); the starting figures are labour ₦30k per kVA (min ₦60k), transport ₦60k, survey ₦20k. Final price = equipment price + labour + transport + survey. Warranty reserve, overhead, naira buffer, bank charges and the VAT checkbox were **removed at the owner's request (Sept 2026)**, customers push back on them, don't re-add them. Running costs are tracked in `/admin/accounts` instead. Package presets (`PACKAGES`) are the guide's 1.5/3.5/5/10kVA pairings plus a 5kVA tubular budget option. It picks the cheapest price on file per item (several units of one model allowed, up to 4). The inverter, battery and panel costs can also be typed in by hand per job (a collapsible "Type equipment costs by hand" block: inverter total, battery total, price of one panel; `manual` in `estimateJob()`), so a job can be priced without any supplier list. A blank box falls back to the price lists. Markups still apply to hand-typed costs. (2) **Supplier price lists** (`supplier_price_items` table, `src/lib/supplier-prices.ts`), typed in by hand, editable in the admin (price, in-stock toggle, delete, add item / new supplier). Each supplier's table is a collapsible `<details>` block, closed by default. Bundled lists live in `SUPPLIER_PRICE_LISTS` in `src/lib/supplier-seed-data.ts`, each gets a one-click import button until loaded. Nexus (owner's Sept 2026 sheet, 18 items) and **LUXSUN** (owner's Sept 2026 list plus LUXSUN's product flyer, 8 items, loaded live 23 Sept 2026) are in. LUXSUN sizes follow the flyer's exact models (4.2/6.2/8.2/12kVA hybrids, 5.12/10.24/16/17kWh lithium); the owner's 10kVA and 15kWh had no price and the flyer's 1.2kVA, 20kVA three-phase, 2.56/7.68/8kWh have none yet, add them when LUXSUN quotes. The 5.12kWh price needs confirming as 24V or 48V. **SRNE** (owner's Sept 2026 dealer list, 23 items: 13 inverters, 10 lithium batteries, loaded live 24 Sept 2026). SRNE rates inverters in kW, stored as the size the calculator reads as kVA; battery warranty (EOS05B/10B/15B 10 years, the rest 5) is in each item's notes. The **Itel Solar live-rate sync was removed (Sept 2026)**: Itel's Cloudflare blocked Vercel, so it never synced; the cron, `vercel.json`, `itel-catalog.ts` and `price-benchmarks.ts` are gone, the `equipment_price_benchmarks` table is unused. If Itel prices are wanted, type them in as a supplier list. **Cworth Solar Energy** (`cworthsolarenergy.com.ng`) is a client-rendered React/Supabase app with no public product API, don't scrape it or pull API keys from its JS bundle to query its backend, that's unauthorized access to another company's database. All of this is internal: the customer never sees a price range or estimate, their number always comes from the site visit.
- **Accounts** (`/admin/accounts`, labelled "Revenue & Expenses" in the admin menu and linked from a card on the Dashboard, owner request Sept 2026): work done (`business_jobs`: date, customer, work done, job value = revenue, paid so far, balance), expenses (`business_expenses`: date, name, category, amount x quantity, paid by) and founder loans (`founder_repayments`). Each record can be added, edited and deleted. Monthly / Quarterly / Yearly selector; shows revenue, expenses, net profit or loss, net and gross margin (gross = after job-cost categories: equipment, installer labour, transport), jobs done, average job, money customers still owe, money the business owes founders, growth vs the previous period (MoM / QoQ / YoY) and vs the same period last year, a revenue-vs-expenses bar chart, a profit/loss chart, a period table and an expense breakdown. Math is pure in `src/lib/accounts-math.ts`, data in `src/lib/accounts.ts`, actions in `src/actions/accounts.ts`, UI in `src/components/admin/accounts/`. **Founder loans:** the two founders are Omole (Founder A) and Idowu (Founder B) (`FOUNDERS`, keys `omole`/`idowu` are stored in the DB and in a SQL check constraint). An expense with "Paid by" set to a founder still counts as a business expense and is also a loan the business owes that founder; repayments reduce it. Shown all time, per founder, with what they paid for, so nobody is short-changed.
- The quote form has an optional "What do you want to power?" select (`LOAD_PROFILES` in `src/lib/costing.ts`), stored on `leads.load_profile` as a package key. `/admin/leads` shows an "Est. job value" column (the rounded in-house price for that package, linking to `/admin/pricing?package=...`). Offices/estates and "not sure" show "Needs visit". If the `load_profile` column is missing, `createLead` saves the lead anyway with the answer put into the message.
- Site visits are **not free** (owner decision, Sept 2026). Public copy calls it a "site assessment" with "a small fee" that comes off the installation price if the customer goes ahead, and says the amount is given before booking. Never state the reason for the fee on the site (it's to stop people taking the design to another installer, that's in-house only), and don't write "free site visit" or "free quote" anywhere, including blog posts (all 6 launch posts were patched in Supabase too). Asking questions by WhatsApp/phone is still free. CTAs read "Get a Quote".
- Homepage hero is modelled on designskonstruct.com (owner's chosen template, Sept 2026): centred pill badge, the locked headline (white-to-white/65 gradient text), subtext, "Get a Quote" and "See Our Services" on one line even on phones (`flex-nowrap`, `flex-1` below `sm`), then `HeroCollage`, three overlapping 4:5 photo cards (sides tilted ±6° and tucked behind a larger centre card) that rise in one by one and drift slightly on scroll, over a bottom fade to white. Entrance animations are the `.hero-fade-in` / `.hero-rise` / `.hero-zoom` classes in `globals.css` (reduced-motion safe). There is no stat strip under the hero any more. Section order after it: TrustedBy, Services, **Our track record** (`TrackRecord.tsx`, navy, 4 glass stat cards counting up from 1: 125+ projects completed, 99%+ customer satisfaction, 100% installation warranty, 24/7 customer support, the owner's own figures, don't point it at a single project), **Featured Projects** (`FeaturedProjects.tsx`, "A look at work we've completed", a scroll-snap video carousel with a prev/next arrow at each end, 4:5 cropped cards via `ProjectVideoCard compact`, starting one video pauses the others), then How it works, and so on. `Reveal` transitions `translate`/`scale`/`filter` (Tailwind v4 uses those standalone properties, not `transform`, so listing only `transform` made everything jump into place).
- Projects: `/projects` (in the main nav) shows the owner's install videos from `PROJECT_VIDEOS` in `src/lib/projects-data.ts`, framed as a small sample of the total (`PROJECTS_COMPLETED`, currently 125, the owner's count, also used by the track record). Videos in `public/videos/projects/` are 720p re-encodes with the PowerNexa logo burned in, faint (about 28% opacity) and centred, plus a poster JPG. Make new ones the same way (ffmpeg overlay of an alpha-faded crop of `logo-transparent.png` at 380px wide, `-crf 28 -maxrate 850k`, `+faststart`). Keep the source phone videos out of git (`/*.mp4` is gitignored). Labels use only the owner's own captions; Mowe-Ibafo came with a location only, so its label names visible parts without sizes.

## Blog topic roadmap (SEO content, re-validated Sept 2026)

Full evidence, the owner's top-50 keyword list, and the rules below are in
`docs/KEYWORD-RESEARCH.md`. The old "top 30" list was never checked against real
searches; in Sept 2026 each topic was checked against Nigerian Google autocomplete
(`gl=ng`), current search results and Nairaland, and the list below replaced it.
The owner's top-50 list is a Google Keyword Planner export set to Lagos (bucketed
50/500/5,000 volumes). Its broad 5,000/month terms ("solar panels for home",
"solar energy for home") are shop-heavy results, so they're targeted by the home
page, service pages and one pillar post (#3 below); the blog's long-tail posts
come from autocomplete evidence.

Rules for every post:
- Title says "Lagos" (or one specific area, only in that area's post). Never list
  several areas in one title; use area names in the body where they fit.
- "Near me" keywords belong on the home page, `/locations`, location pages and the
  Google Business Profile, not in blog titles.
- Use Nigerian phrasing: kVA sizes, "can it carry", "NEPA", "light", "pumping machine".
- Only write area posts for areas with search evidence: Lekki, Ajah, Victoria
  Island, Ikeja. Ikoyi, VGC and Sangotedo have none, their location pages cover them.
- No public price posts until the owner decides (see `docs/KEYWORD-RESEARCH.md` section 6).
- Run each post through `computeSeoChecklist()` and the `humanizer` skill before publishing.

**Published (10, all in `src/lib/blog-seed-data.ts`, seeded via `npm run seed:blog`):**
solar panel installation cost in Lagos; best solar installers in Lagos; solar and
inverter installation in Lagos (complete guide); inverter vs generator in Lagos;
lithium vs tubular battery in Lagos; how long solar installation takes in Lagos;
what can a 3.5kVA inverter carry (`/blog/what-can-a-3-5kva-inverter-carry`, SEO
score 92, the slug check warns only because slugify strips the dot); what can a
5kVA inverter carry (`/blog/what-can-a-5kva-inverter-carry`, score 100); solar
energy for home in Lagos (`/blog/solar-energy-for-home-in-lagos`, the pillar post
for the 5,000/month home terms, score 100); what size inverter do I need
(`/blog/what-size-inverter-do-i-need`, score 100). All four went live 23 Sept 2026.
Home-size starting points in these posts follow the owner's `PACKAGES` in
`src/lib/costing.ts` (1.5kVA + 2 panels, 3.5kVA + 4, 5kVA + 6, 10kVA + 12, all
550W), so keep future posts on the same pairings. The 5kVA post's panel range was
changed to 6 to 10 to match. Live posts are only updated by patching Supabase
(the seed script skips existing slugs), so edit both the seed file and the row. Their battery-runtime and panel-count figures
assume ~4 peak sun hours/day (about 3 in July/August), 75% panel yield, 10%
inverter loss, tubular used to 50% and lithium to ~85%; keep later kVA posts
(1.5kVA, 10kVA) on the same assumptions so the numbers agree across posts.

**Next, in this order** (focus keyword in brackets):

1. Inverter Not Charging? What to Check Before You Call a Technician in Lagos [inverter not charging]
2. Hybrid Inverter vs Normal Inverter: Which Is Better for Lagos Power Cuts? [hybrid inverter vs normal inverter] (also covers off-grid vs hybrid)
3. Band A Electricity Tariff in Lagos: Is Solar Now Cheaper Than NEPA? [band a electricity tariff in lagos]
4. Solar Company in Lekki: What to Check Before You Hire One [solar company in lekki]
5. Solar Company in Ajah: Solar and Inverter Options for Ajah and Sangotedo Homes [solar company in ajah]
6. How Long Does an Inverter Battery Last in Lagos? Per Night and in Years [how long does inverter battery last] (includes signs it needs replacing)
7. Why Is My Inverter Beeping? Beeps and Fault Lights Explained [inverter beeping]
8. Grade A Lithium Battery in Nigeria: How to Spot Fake or Used Cells [grade a lithium battery in nigeria]
9. Can Your Inverter Run a Pumping Machine? Borehole Power in Lagos [can inverter carry pumping machine]
10. Solar System for a 3-Bedroom House in Lagos: What Size You Need [solar system for 3 bedroom house]
11. What Can a 1.5kVA Inverter Carry? (Small Flats and Self-Contains in Lagos) [what can a 1.5kva inverter carry]
12. 10kVA Solar System in Lagos: What It Carries and Who Needs One [10kva solar system]
13. Solar Companies in Victoria Island: Backup Power for Homes and Offices [solar companies in victoria island]
14. Solar Companies in Ikeja: How to Choose an Installer [solar companies in ikeja]
15. Diesel Generator vs Solar for Businesses in Lagos [diesel generator vs solar power]
16. Solar for Offices, Shops and Clinics in Lagos: How to Size It [solar system for office]
17. Can Solar Power an AC in Lagos? [can solar power run ac]
18. Solar Warranty in Nigeria: What Your Installer Should Put in Writing [solar warranty]
19. Monocrystalline vs Polycrystalline Solar Panels in Lagos Heat [monocrystalline vs polycrystalline]
20. How Long Do Solar Panels Last in Lagos? [how long does solar panel last]

**Update, not a new post:** add "solar companies in lagos" / "best solar company in
lagos" as secondary keywords to the live "best solar installers in Lagos" post
(same search intent, a second post would compete with it).

**Brand comparisons are allowed** (owner: PowerNexa installs any brand):
"Felicity vs Deye Inverter", "Felicity vs Growatt", "Felicity vs Cworth lithium
battery" all have strong autocomplete. Compare on published specs and warranty.

**Needs owner input first:** any "Xkva inverter price in nigeria" post (price rule).

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

- Supplier price SQL (`supplier_price_items`, `leads.load_profile`) was run
  in Supabase and the Nexus Sept 2026 list (18 items) loaded, Sept 2026.
  Two Nexus entries still need owner confirmation: the 600W panel (sheet
  said ₦13,000, entered as ₦130,000) and the lithium batteries (sheet said
  "Not available" above them). Fix either in `/admin/pricing`.
- Accounts SQL (`business_jobs`, `business_expenses`, `founder_repayments`)
  was run in Supabase and confirmed on 23 Sept 2026.

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
- Leads can be edited and archived from `/admin/leads` (archiving sets
  `archived_at` instead of deleting the row, hard delete was deliberately left
  out). Dashboard (`/admin`) has a Day/Month/Quarter/Year period dropdown
  (`src/components/admin/DashboardPeriodFilter.tsx`, `src/lib/date-range.ts`).
  The SQL for both (`archived_at` column, `dashboard_*` functions taking
  `start_ts, end_ts`) was confirmed live in Sept 2026.
