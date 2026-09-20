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
- Phone/WhatsApp: 0813 209 7317 (`+2348132097317`). Contact email: powernexas@gmail.com (also the admin login email).
- Office (service area, not a showroom): 11 Idris Ogunlaja Drive, Sangotedo, Lagos.
- Copy on this site follows `COPYWRITING-PLAYBOOK.md` section 0.1 house style: no em dashes, plain 8th-grade words, short paragraphs, every claim provable. Avoid AI-sounding filler ("real", "seamless", "delve", "crucial", bold mini-heading lists, forced triads). For headline/emotional copy, mine actual Lagos voice-of-customer language (Nairaland, Nigerian Twitter) before writing, terms like "NEPA take light," "up NEPA," "wahala" carry more weight than generic English. Run new copy through the `humanizer` skill before it ships.
- Testimonials on the site are placeholders (fake names, real Lagos neighborhoods), marked with `PLACEHOLDER TESTIMONIAL` comments in `src/lib/testimonials-data.ts`. Replace with real reviews when available. No Review/AggregateRating schema is attached to them while they're placeholders.
- Database is Supabase (Postgres), accessed only from the server via the service role key (`src/lib/supabase.ts`). Schema and dashboard SQL functions live in `supabase/schema.sql`, meant to be pasted once into the Supabase SQL editor. RLS is enabled on every table with no public policies, since the browser never talks to Supabase directly.
- Admin login is created by running `npm run seed:admin` (reads `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env.local`). Blog launch content is created by running `npm run seed:blog` (safe to re-run, skips existing slugs, does not update already-published posts, edit those directly in `/admin/blog` or patch Supabase if the seed data changes later).
- Admin dashboard shows human-only metrics with no toggle to include bots (owner explicitly asked for this, don't re-add an "include bots" switch). It also shows a "unique visits" stat: one visitor counts once per calendar day, a repeat visit the next day counts again. This is computed client-side in `getUniqueVisitCount()` (`src/lib/analytics.ts`) from raw rows, not a SQL function.
- Quote form (`src/components/marketing/QuoteForm.tsx`) is intentionally colored: mist-tinted inputs, thick orange focus ring, navy bold labels, gradient accent bar. Do not revert to plain white/gray styling.
- Scroll/load-in animation: wrap section content in `<Reveal>` (`src/components/ui/Reveal.tsx`) for a staggered fade-up on load and on scroll. Applied to the homepage, service pages, location pages, pricing, FAQ, testimonials, blog listing, contact, and about. `SectionHeading` (`src/components/ui/Container.tsx`) takes a `light` prop for use on navy/dark backgrounds, always pass it there or text is invisible.
- Design system is "elevated cards": `ServiceCard`, `LocationCard`, `TestimonialCard`, and `BlogCard` (all in `src/components/marketing/`) use soft ambient box-shadows (no visible border), `rounded-[28px]`, a gradient icon badge or decorative accent shape, and a hover lift + shadow-growth micro-interaction. `GlowOrb` (`src/components/ui/GlowOrb.tsx`) is a blurred background accent circle used behind key sections (Services, "How it works", Locations, the quote form) for ambient depth, keep new sections in this same visual language rather than reverting to flat bordered cards. `ServiceCard` takes an optional `featured` prop for the larger bento-style spot in the homepage services grid. The homepage's "How it works" section renders as four connected numbered circles (with a horizontal joining line on desktop) instead of a plain text list, since the steps are a genuine sequence.
- All 6 launch blog posts were audited against the site's own `computeSeoChecklist()` logic and score 71-88/100 with zero keyword-placement failures (title, meta description, slug, first 100 words, at least one heading, image alt all contain the focus keyword). If you add more posts, run the same check before publishing.

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

- Admin blog editor still uses a plain markdown textarea. Owner asked twice for a
  proper rich text/image-insertion editor, not yet built.
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
