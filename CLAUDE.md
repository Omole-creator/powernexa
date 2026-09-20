@AGENTS.md

# PowerNexa Solutions — project brief

Full detail lives in `docs/PRD.md` and `docs/SPEC.md`. Read those before making
product or architecture changes. Summary:

- Lagos-only solar, inverter, and battery installation business.
- Brand: navy `#092B4C`, orange `#F58220`, solar yellow `#FFC857`, white background, charcoal `#17212B` text. Fonts: Space Grotesk (display), IBM Plex Sans (body), IBM Plex Mono (numbers, stats).
- Signature visual motif: the waveform (`src/components/marketing/Waveform.tsx`), a line that resolves from jagged grid power into a smooth sine curve. Used in the hero, as section dividers, and to explain pure vs modified sine wave inverters.
- Phone/WhatsApp: 0813 209 7317 (`+2348132097317`). Contact email: powernexas@gmail.com (also the admin login email).
- Office (service area, not a showroom): 11 Idris Ogunlaja Drive, Sangotedo, Lagos.
- Domain is a placeholder (`powernexasolutions.com`) until the owner buys a real one. Find and replace before launch.
- Copy on this site follows `COPYWRITING-PLAYBOOK.md` section 0.1 house style: no em dashes, plain 8th-grade words, short paragraphs, every claim provable. Avoid AI-sounding filler ("real", "seamless", "delve", "crucial", bold mini-heading lists, forced triads). Run new copy through the `humanizer` skill before it ships.
- Testimonials on the site are placeholders (fake names, real Lagos neighborhoods), marked with `PLACEHOLDER TESTIMONIAL` comments in `src/lib/testimonials-data.ts`. Replace with real reviews when available. No Review/AggregateRating schema is attached to them while they're placeholders.
- Database is Supabase (Postgres), accessed only from the server via the service role key (`src/lib/supabase.ts`). Schema and dashboard SQL functions live in `supabase/schema.sql`, meant to be pasted once into the Supabase SQL editor. RLS is enabled on every table with no public policies, since the browser never talks to Supabase directly.
- Admin login is created by running `npm run seed:admin` (reads `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env.local`). Blog launch content is created by running `npm run seed:blog`.
- Hero background photo is `public/images/hero.jpg` (owner-supplied). Beyond that, the site intentionally uses icon illustrations and the waveform motif instead of generic stock photography. Ask the owner for real project/team photos before adding more, since Unsplash/Pexels block automated scraping without an API key.
- Scroll/load-in animation: wrap section content in `<Reveal>` (`src/components/ui/Reveal.tsx`) for a staggered fade-up on load and on scroll. Already applied to the homepage, service pages, location pages, and the about page.

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

## Deployment

See the setup guide provided in chat (Supabase project creation, running
`supabase/schema.sql`, environment variables, then Vercel deploy) for the full
step-by-step. Short version: create the Supabase project, run
`supabase/schema.sql` in its SQL editor, set env vars from `.env.example` in
both `.env.local` and the Vercel project, run `npm run seed:admin` and
`npm run seed:blog` once locally, then deploy to Vercel.
