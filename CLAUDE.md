@AGENTS.md

# PowerNexa Solutions — project brief

Full detail lives in `docs/PRD.md` and `docs/SPEC.md`. Read those before making
product or architecture changes. Summary:

- Lagos-only solar, inverter, and battery installation business.
- Brand: navy `#092B4C`, orange `#F58220`, solar yellow `#FFC857`, white background, charcoal `#17212B` text.
- Phone/WhatsApp: 0813 209 7317 (`+2348132097317`). No public email at launch (owner's choice).
- Office (service area, not a showroom): 11 Idris Ogunlaja Drive, Sangotedo, Lagos.
- Domain is a placeholder (`powernexasolutions.com`) until the owner buys a real one — find and replace before launch.
- Copy on this site follows `COPYWRITING-PLAYBOOK.md` section 0.1 house style: no em dashes, plain words, short paragraphs, every claim provable.
- Testimonials on the site are placeholders (fake names, real Lagos neighborhoods), marked with `PLACEHOLDER TESTIMONIAL` comments in the code. Replace with real reviews when available.
- Database is local SQLite (`data/powernexa.db`, `node:sqlite`). Fine for local dev and VPS-style hosting; needs migration to a hosted DB before deploying to a serverless platform with an ephemeral filesystem.
- Admin login is seeded from `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars — set real values in `.env.local` before go-live.

## Top 30 blog topics (SEO content roadmap)

Chosen to build topical authority around the three highest-value keyword clusters
from the Lagos keyword research (installation, local-provider, pricing), plus
location pages and trust/credibility content. Write these in roughly this order —
pricing and cost-guide posts first (highest existing search intent and easiest to
rank, per the Low-competition keywords in the research), then location posts,
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
30. Real Cost of Running Generators vs Solar in Lagos: A 5-Year Comparison

The first 6 of these are seeded as full, published posts at launch so the blog
is not empty. The rest are backlog for the owner/marketer to write using the
admin blog editor's built-in SEO checklist.
