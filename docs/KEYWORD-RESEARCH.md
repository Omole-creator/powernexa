# Keyword research and blog topic validation

Last updated: 23 Sept 2026. The blog roadmap in `CLAUDE.md` is built from this file.
Read this before adding or reordering blog topics.

## 1. Sources and how much to trust them

| Source | What it tells us | Limits |
|---|---|---|
| Owner's Google Keyword Planner export, location set to Lagos (`Keyword-Stats-2026-09-20.csv`, summarised below) | Lagos monthly search volume and competition | Volumes are Keyword Planner buckets (50 / 500 / 5,000), not exact. The CSV itself is not in the repo, only the owner's summary. (An AI summary of the CSV wrongly said it wasn't Lagos-filtered; the owner confirmed it is.) |
| Google autocomplete, Nigeria (`gl=ng`), pulled 23 Sept 2026 | Which exact phrases people in Nigeria type. If Google suggests it, enough people search it. | Shows that a phrase is searched, not how often. Some suggestions are global (India, US). |
| Web search results for each topic | Who ranks now and whether we can beat them | Results were served from a US search index, not a Lagos one. A Lagos-located check is still worth doing by hand. |
| Nairaland (thread titles and snippets) | How Nigerians word their questions and complaints | Nairaland blocks automated page reads (403), so only titles/snippets were used. We don't get around that block. |

**How the two sources fit together:** the Lagos export shows that broad terms
("solar panels for home", "solar energy for home", 5,000/month) carry the most
volume, but those results pages are mostly shops and product listings, so they are
targeted by the home page and service pages plus one pillar post. The long-tail
questions from autocomplete (kVA sizes, "can it carry", faults) have lower volume
but are where blog posts rank and where buyers are close to hiring someone.
A refreshed export that includes the kVA and fault phrases as seeds would give
their exact Lagos volumes.

## 2. Owner's top 50 keywords (Google Keyword Planner, Lagos)

| # | Keyword | Avg. monthly searches | Intent |
|---:|---|---:|---|
| 1 | Solar panels | 5,000 | Product/category |
| 2 | Solar panels for home | 5,000 | Residential purchase |
| 3 | Solar panel installation | 5,000 | Installation lead |
| 4 | Solar energy | 5,000 | Broad category |
| 5 | Solar power installation | 5,000 | Installation lead |
| 6 | Solar electricity for home | 5,000 | Residential solution |
| 7 | Solar energy for home | 5,000 | Residential solution |
| 8 | Solar power home panels | 5,000 | Residential purchase |
| 9 | Solar products for home | 5,000 | Product purchase |
| 10 | Sun King solar products | 5,000 | Branded product |
| 11 | Solar and inverter installation | 500 | Installation lead |
| 12 | Solar installation | 500 | Installation lead |
| 13 | Solar panel cost | 500 | Price research |
| 14 | Solar power | 500 | Broad category |
| 15 | Solar companies | 500 | Provider research |
| 16 | Solar panel price | 500 | Price research |
| 17 | Solar panels for house | 5,000 | Residential purchase |
| 18 | Solar for home | 5,000 | Residential solution |
| 19 | Home solar system | 500 | Residential purchase |
| 20 | Solar power system | 500 | System purchase |
| 21 | Solar power system for home | 500 | Residential purchase |
| 22 | Home solar power system | 500 | Residential purchase |
| 23 | Solar energy companies | 500 | Provider research |
| 24 | Solar electricity | 500 | Solution research |
| 25 | Solar energy near me | 500 | Local provider |
| 26 | Solar-powered generators | 500 | Product purchase |
| 27 | Solar generators for home | 500 | Residential purchase |
| 28 | Solar power for house | 500 | Residential solution |
| 29 | Solar power installation cost | 500 | Price/installation |
| 30 | Solar power inverter | 500 | Equipment purchase |
| 31 | Solar power inverter for home | 500 | Residential equipment |
| 32 | Solar inverter for home | 500 | Residential equipment |
| 33 | Solar inverter installation | 500 | Installation lead |
| 34 | Off-grid inverter | 500 | Equipment purchase |
| 35 | Off-grid solar power | 500 | System purchase |
| 36 | Solar power companies | 500 | Provider research |
| 37 | Solar energy system | 500 | System purchase |
| 38 | Solar panel inverter | 500 | Equipment purchase |
| 39 | Solar panel suppliers | 50 | Supplier/product |
| 40 | Solar panel suppliers near me | 50 | Local supplier |
| 41 | Solar panels near me | 50 | Local purchase |
| 42 | Solar installers near me | 50 | Local installation |
| 43 | Solar companies near me | 50 | Local provider |
| 44 | Solar panel installers near me | 50 | Local installation |
| 45 | Solar panel companies near me | 50 | Local provider |
| 46 | Solar power companies near me | 50 | Local provider |
| 47 | Solar power installers near me | 50 | Local installation |
| 48 | Solar energy installers near me | 50 | Local installation |
| 49 | Solar installation companies near me | 50 | Local installation |
| 50 | Solar inverter installers near me | 50 | Local installation |

Clusters from the same export: installation (money pages), local provider /
"near me" (location pages), pricing, home and business.

### Where each cluster belongs on the site

- **"Near me" keywords** go on the home page, `/locations`, the 8 location pages and
  the Google Business Profile. Google answers "near me" searches from the
  searcher's location plus the business profile, reviews and service-area data.
  Typing "near me" into a blog title does not help and reads as spam.
- **Installation keywords** go on the 5 service pages and the home page.
- **"Solar energy for home", "solar inverter for home", "solar panels for home"**
  can appear in blog titles and headings where they read naturally.
- **Pricing keywords** see section 6.

## 3. What Nigerian autocomplete shows (23 Sept 2026)

People in Nigeria search in their own terms, and the owner's export misses most of them:

- **They search by kVA size.** "how many solar panels for 3.5kva / 1.5kva / 5kva / 10kva
  inverter", "3.5kva inverter load capacity", "10kva solar system price in nigeria".
- **They ask "can it carry".** "can 3.5kva inverter carry ac / 1.5hp ac / pumping machine /
  deep freezer / washing machine / microwave", "can 5kva inverter carry 2hp ac / pressing
  iron / water heater".
- **They add "price in nigeria".** "5kva inverter price in nigeria", "3.5kva inverter with
  battery price", "solar panel price in nigeria 2026", "inverter battery price in lagos",
  "lithium battery for inverter price in nigeria".
- **Fault searches are big.** "why is my inverter not charging / showing fault / beeping /
  going on and off / not charging with generator", "inverter not charging battery with
  electricity".
- **Batteries.** "how long does inverter battery last during power cut",
  "grade a lithium battery in nigeria", "tubular battery vs lithium battery price in nigeria".
- **Inverter types.** "hybrid inverter vs normal inverter (which is better)",
  "off grid inverter vs hybrid inverter".
- **Grid costs.** "band a electricity tariff in lagos", "band a areas in lagos",
  "fuel price in lagos today", "why is there no light in lagos today".
- **Providers.** "solar installers in lagos", "solar companies in lagos",
  "best solar company in lagos", "top solar companies in lagos",
  "solar installation companies in lagos".
- **Brands.** "felicity vs deye inverter", "felicity vs growatt", "felicity vs cworth lithium battery".

### Lagos areas: which ones people search

| Area | Autocomplete evidence | Decision |
|---|---|---|
| Lekki | "solar company in lekki", "solar installer in lekki", "best solar company in lekki", "solar energy companies in lekki" | Blog post + location page |
| Ajah | "solar company in ajah", "solar installer in ajah", "solar shops in ajah", "solar panels in ajah" | Blog post + location page |
| Victoria Island | "solar companies in victoria island" | Blog post + location page |
| Ikeja | "solar companies in ikeja", "solar panel ikeja", "solar market ikeja" | Blog post + location page |
| Ikoyi | nothing | Location page only |
| VGC | nothing | Location page only |
| Sangotedo | nothing | Location page only (mention in the Ajah post, it's next door and it's where the office is) |
| Lekki Phase 1 | people type "lekki", not "lekki phase 1" | Use "Lekki" in titles |

**Area rule for titles:** one area per title, and only in posts about that area.
General posts say "Lagos" in the title and use area names in the body where they
fit ("a 3-bedroom flat in Ajah usually needs..."). Listing several areas in one
title reads as keyword stuffing and competes with our own location pages.

## 4. Old roadmap topics that were dropped

| Old topic | Why dropped |
|---|---|
| #2 Solar installation cost by system size | Same focus keyword as the live cost guide (would compete with it) and needs public prices (see section 5) |
| #6 Is solar worth it in 2026 | No autocomplete for "is solar worth it in nigeria". Replaced by the Band A tariff post |
| #13 Ikoyi luxury homes | No search evidence for Ikoyi |
| #15 VGC estate solutions | No search evidence for VGC |
| #19 Solar for estates | Autocomplete returns only foreign results |
| #22 Harmattan / rainy season maintenance | No autocomplete at all |
| #24 Read your electricity bill | Replaced by Band A tariff, which Lagos people search |
| #28 Net metering | Barely searched, and not live for homes in Lagos |
| #29 Rental properties / landlords | Only UK/Australia results |
| #16 Best solar companies near Sangotedo and Ajah | Merged into the Ajah post |
| #20 Off-grid vs hybrid | Merged into the hybrid vs normal inverter post |
| #10 Signs your battery needs replacing | Merged into "how long does an inverter battery last" |
| #30 Generators vs solar, 5-year cost | Merged into the diesel vs solar for business post (the home version is already live) |

## 5. Brands

PowerNexa can install any brand (owner, Sept 2026), so brand comparison posts
("felicity vs deye inverter", "felicity vs growatt", "felicity vs cworth lithium
battery") are fair game. Compare on published specs and warranty terms, don't
claim one brand is what PowerNexa "uses".

## 6. Open decision: public prices

Many of the most-searched phrases ask for a price ("5kva inverter price in nigeria",
"3.5kva inverter with battery price"). The site rule today is that customers never
see a price range, their number comes from the site assessment. So the roadmap has
no price posts. If the owner wants to go after these searches, the options are:

1. Market-price posts ("what a 5kVA inverter costs in Lagos markets this month"),
   quoting typical shop prices for the parts and saying the installed price comes
   from the assessment. This needs updating every month or it goes stale.
2. Keep the rule and skip these searches.

This is the owner's call. Don't write price posts until they decide.
