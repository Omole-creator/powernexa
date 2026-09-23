import type { PostInput } from "./blog";

type SeedPost = Omit<PostInput, "status" | "noindex"> & { publishedDaysAgo: number };

export const BLOG_SEED_POSTS: SeedPost[] = [
  {
    slug: "solar-panel-installation-cost-in-lagos",
    title: "How Much Does Solar Panel Installation Cost in Lagos? (Price Guide)",
    excerpt:
      "A clear look at what actually drives solar and inverter installation cost in Lagos, so you can budget before you call anyone.",
    category: "Pricing",
    tags: ["pricing", "solar panels", "budgeting"],
    focusKeyword: "solar panel installation cost in lagos",
    metaTitle: "Solar Panel Installation Cost in Lagos (What Drives the Price)",
    metaDescription:
      "What actually determines solar panel installation cost in Lagos: load size, battery type, inverter rating, and more. Get a realistic budget before you request a quote.",
    featuredImageAlt: "Solar panel installation cost factors in Lagos, Nigeria",
    authorName: "PowerNexa Solutions Team",
    publishedDaysAgo: 60,
    content: `If you've searched for solar panel installation cost in Lagos, you've probably noticed something frustrating. Every installer quotes a different number, and none of the numbers explain themselves. This guide fixes that. We'll walk through exactly what drives the price up or down, so you can budget realistically before you request a quote.

## Why there's no single price

Two homes with the same number of bedrooms can need completely different systems. A family running two air conditioners, a deep freezer, and a home office draws far more power than a family running lights, a fridge, and a TV. Since the system is built around what you actually use, the price follows the load, not the size of your house.

This is also why we don't publish a fixed price list on this site. A number that doesn't apply to your situation isn't useful, it's misleading. Instead, here's what actually goes into your final quote.

## The six factors that set your price

### 1. Your load (what you're powering)

This is the single biggest driver of cost. Before anything else, we calculate the combined wattage of what you want to run at the same time: lights, fans, a fridge, a TV, a router, possibly an air conditioner or two, a washing machine, or office equipment. More load means a bigger inverter, more panels, and more battery capacity, which means a higher price.

### 2. Battery type and capacity

You'll usually choose between lithium (LiFePO4) and tubular batteries. Lithium costs more upfront but lasts significantly longer, charges faster, and needs almost no maintenance. Tubular costs less to buy today but needs regular attention and typically gets replaced more often. Read our full [lithium vs tubular battery comparison](/blog/solar-battery-types-lithium-vs-tubular) for a detailed breakdown. On top of chemistry, capacity (measured in Ah, or amp-hours) directly affects price: more backup hours means more battery capacity means a higher cost.

### 3. Inverter size and wave type

Inverters are rated in kVA. A small home running lights and a fridge might need a modest inverter, while a home running multiple air conditioners needs a much larger one. We only install pure sine wave inverters, which cost more than cheap modified sine wave units but protect your appliances properly. See our [inverter installation](/services/inverter-installation) page for more on why wave shape matters.

### 4. Panel wattage and count

More panels, or higher-wattage panels, generate more electricity and reduce how much you depend on the grid or a generator, but they also cost more upfront. Roof space and budget both play into how many panels make sense for your property.

### 5. Roof and installation conditions

The type of roof, how easy it is to access, and the distance between your panels, inverter, and battery room all affect labour and material costs. A straightforward bungalow roof is quicker and cheaper to work with than a complex multi-level roof with limited access.

### 6. Warranty and backup duration

A longer written warranty and a system designed to carry you through extended outages, not just a few hours, typically costs more than a basic short-backup setup. This is a trade-off worth discussing openly with your installer rather than discovering later.

## Three common starting points

Instead of fake prices, most Lagos households and businesses fall into one of three groups. Studio flats and small apartments usually go for essential backup: lights, fans, a fridge, and device charging, at a lower cost with a shorter backup time. Three to five bedroom homes usually want a whole-home system that also covers a TV, a router, and one or two air conditioners, at a mid-range cost with longer backup. Offices, clinics, schools, and multi-home estates fall under commercial and estate systems, which have critical equipment that can't afford downtime and get priced per project after a load assessment.

See our full [pricing guide](/pricing) for more detail on these tiers.

## How to get an accurate number

The only way to get a price that actually applies to you is a load assessment. We do a site assessment where we look at your appliances, your electricity bill, and your property, then hand you a written quote with everything explained. No pressure, no hidden line items.

If you're ready, [get a quote](/get-a-quote) or message us on WhatsApp with what you're trying to power, and we'll tell you what it will realistically take.

## A quick word on comparing installers

When you get quotes from different installers, don't just compare the bottom-line number. Ask what's included: panel brand and wattage, inverter brand and kVA rating, battery chemistry and capacity, warranty length, and installation timeline. Two quotes that look similar on price can be very different systems. For more on that, read [what to check before you hire a solar installer in Lagos](/blog/best-solar-installers-in-lagos-what-to-check).`,
  },
  {
    slug: "best-solar-installers-in-lagos-what-to-check",
    title: "Best Solar Installers in Lagos: What to Check Before You Pay Anyone",
    excerpt:
      "Solar is an expensive, long-term investment. Here's exactly what to check before you hand your money to any installer in Lagos.",
    category: "Guides",
    tags: ["installers", "trust", "checklist"],
    focusKeyword: "solar installers in lagos",
    metaTitle: "Best Solar Installers in Lagos: A Buyer's Checklist",
    metaDescription:
      "Before you hire any of the solar installers in Lagos, check their load calculation, written quotes, warranty terms, and battery specifics first.",
    featuredImageAlt: "Checklist for choosing among solar installers in Lagos",
    authorName: "PowerNexa Solutions Team",
    publishedDaysAgo: 55,
    content: `Solar installers in Lagos are easy to find and hard to tell apart. Solar and inverter systems are a serious investment, and Lagos has no shortage of installers competing for your money. Some are excellent. Some will sell you whatever is sitting in their store, regardless of whether it fits your home. Here's how to tell the difference before you pay a deposit.

## 1. Do they calculate your load, or just ask "how many rooms"?

A proper installer asks about your actual appliances: how many air conditioners, whether you run a freezer, how many hours of backup you want, whether you work from home. If an installer quotes you a system based only on the number of bedrooms in your house, that's a warning sign. Room count tells you almost nothing about power consumption.

## 2. Do they give you a written quote?

A verbal number is not a quote. A proper quote is written down and includes panel wattage and count, inverter brand and kVA rating, battery chemistry and capacity, labour cost, and timeline. If an installer is reluctant to put things in writing, ask yourself why.

## 3. Do they explain the trade-offs?

Every solar decision involves a trade-off: lithium costs more but lasts longer than tubular, more panels cost more but reduce grid dependence faster, a bigger battery bank costs more but gets you through longer outages. A trustworthy installer walks you through these trade-offs instead of just pushing the most expensive option, or the cheapest one.

## 4. What warranty do they actually offer?

Ask specifically: what's covered, for how long, and what voids it? A vague "we give warranty" answer isn't good enough. You want a written workmanship warranty separate from the manufacturer's warranty on the panels, inverter, and batteries. Read more in our guide on [what warranty to expect from a Lagos solar installer](/blog/solar-panel-installation-cost-in-lagos).

## 5. Can they show you how they'll wire the system?

Poor wiring is one of the most common causes of solar system failures and, in worse cases, fire risk. Ask how they plan to handle the changeover between grid and inverter power, how they'll earth the system, and whether they isolate circuits properly. An installer who can't answer clearly hasn't done this enough times.

## 6. Do they offer maintenance, or disappear after installation?

Solar and inverter systems need occasional maintenance: panel cleaning, connection checks, battery health tests. Ask whether the installer offers a maintenance plan or only shows up again if something breaks. See our [maintenance and repair service](/services/solar-maintenance-repair) for what a proper maintenance visit should include.

## 7. Are they actually based in Lagos?

Response time matters. If your inverter starts beeping at 11pm or a battery connection comes loose, you want an installer who can reach you quickly, not one juggling jobs across multiple states. Ask where their team is actually based and how they handle emergency callouts.

## 8. Do they size for your area's specific conditions?

Lagos has its own quirks: harmattan dust that builds up on panels, heavy rainy-season downpours that test roof mounting and waterproofing, and estate-specific wiring rules in places like [VGC](/locations/vgc) or [Lekki Phase 1](/locations/lekki-phase-1). An installer who has actually worked in Lagos will factor these in without being asked.

## A simple test before you commit

Ask the installer this one question: "If I only wanted to power my fridge, lights, and phone charging for now, and add more later, could you design for that?" A good installer will say yes and explain how, because they understand systems can be designed to expand. An installer who only sells one fixed package, take that as a signal.

## Ready to compare?

If you want a written, load-based quote to compare against what you've already received, [request a quote](/get-a-quote) or message us on WhatsApp. We'll walk you through exactly what we're proposing and why, so you can make an informed decision either way.`,
  },
  {
    slug: "solar-and-inverter-installation-lagos-complete-guide",
    title: "Solar and Inverter Installation in Lagos: The Complete Homeowner's Guide",
    excerpt:
      "Everything a Lagos homeowner needs to know before installing solar panels, an inverter, and battery backup, in one guide.",
    category: "Guides",
    tags: ["solar", "inverter", "guide"],
    focusKeyword: "solar and inverter installation in lagos",
    metaTitle: "Solar and Inverter Installation in Lagos: Complete Guide",
    metaDescription:
      "A complete guide to solar and inverter installation in Lagos: how the components work together, what it costs, and how the process runs from start to finish.",
    featuredImageAlt: "Homeowner's guide to solar and inverter installation in Lagos",
    authorName: "PowerNexa Solutions Team",
    publishedDaysAgo: 50,
    content: `If you're starting to research solar and inverter installation in Lagos, you've probably realized there's more to it than picking a package off a price list. This guide covers the whole picture: how the components work together, what decisions you'll need to make, and how the installation process actually runs.

## The three components, explained simply

A backup power system for a Lagos home has three main parts, and it's worth understanding how they relate before you talk to any installer.

Solar panels generate electricity from sunlight. On their own, they don't store power or run your appliances directly, they just produce electricity while the sun is up.

The inverter does two jobs. It converts electricity into the form your appliances use, and it manages switching between power sources, solar, battery, generator, or grid, depending on what's available. See our [inverter installation](/services/inverter-installation) page for more detail.

The battery stores power so you have backup when the sun isn't shining or the grid is down. Without a battery, solar panels only help you during daylight hours while the sun is actually out.

Many Lagos homes start with just an inverter and battery for grid backup, then add solar panels later to reduce how much they depend on the grid and to extend backup time. Either approach is valid, and a good installer will tell you honestly which order makes sense for your budget.

## Step 1: Work out your load

Before you think about brands or specs, list out what you actually want to run: lights, fans, a fridge, a TV, a router, air conditioners, a washing machine, office equipment. Add up the wattage (usually printed on the appliance or its manual) and think about how many hours a day you'd realistically run each one. This single exercise saves more money than any negotiation on price, because it stops you from paying for capacity you'll never use, or worse, buying a system that can't actually carry your home.

## Step 2: Decide on backup duration

How many hours of backup do you want during an outage? A few hours to get through the evening is very different from wanting to run your whole home overnight. This decision drives your battery capacity directly.

## Step 3: Choose your battery type

Lithium (LiFePO4) batteries cost more upfront, last significantly longer, charge faster, and need almost no maintenance. Tubular batteries cost less to buy but need regular water top-ups and typically last fewer years before replacement. We cover this in detail in our [battery type comparison](/blog/solar-battery-types-lithium-vs-tubular).

## Step 4: Size your inverter

Your inverter's kVA rating needs to comfortably cover your combined load, with margin for appliances that draw extra power when they start up (like air conditioners and fridges). An undersized inverter trips constantly. An oversized one wastes money. This is exactly the kind of calculation a proper site visit is for.

## Step 5: Decide how many solar panels, if any

If you're adding panels, the count and wattage depend on how much of your daily consumption you want to offset, your roof space, and your budget. More panels mean faster payback on fuel and grid costs, but a higher upfront investment.

## What the installation process actually looks like

A properly run installation follows a predictable sequence:

1. Load and site assessment. An installer visits, reviews your appliances and electricity bill, and inspects your roof and wiring.
2. Written quote. You receive a document showing exactly what's being installed and why, with pricing broken down.
3. Mounting and wiring. Panels are mounted and earthed, the inverter and battery are installed, and the changeover wiring is set up.
4. Testing. The system is tested under its actual load before the installer calls the job complete.
5. Handover. You get a walkthrough of the system, your warranty documents, and a maintenance schedule.

Most residential jobs take one to three days on-site once equipment has arrived. Read more in our guide on [how long solar installation actually takes](/blog/how-long-does-solar-installation-take-in-lagos).

## Common mistakes to avoid

A roof full of panels is wasted if your inverter can't handle the output or your battery can't store it, so never buy panels without matching them to the rest of the system. Choosing based on price alone is another common trap: the cheapest quote often means the cheapest components, and that usually shows up later as more frequent repairs. Skipping the load calculation and guessing your system size from your house size or your old generator's kVA rating leads to systems that are either undersized or oversized. And always ask about warranty terms before you pay a deposit, not after something breaks.

## Where PowerNexa fits in

We install and maintain solar, inverter, and battery systems across Lagos, including [Victoria Island](/locations/victoria-island), [Lekki Phase 1](/locations/lekki-phase-1), [Ikoyi](/locations/ikoyi), [Ajah](/locations/ajah), and beyond. Every project starts with the load calculation described above, not a generic package. If you're ready to get specific numbers for your home, [request a quote](/get-a-quote) and we'll take it from there.`,
  },
  {
    slug: "inverter-vs-generator-lagos",
    title: "Inverter vs Generator in Lagos: Which Saves You More Money?",
    excerpt:
      "A honest comparison of inverter and battery systems against petrol and diesel generators for Lagos homes and businesses.",
    category: "Comparisons",
    tags: ["inverter", "generator", "comparison"],
    focusKeyword: "inverter vs generator in lagos",
    metaTitle: "Inverter vs Generator in Lagos: An Honest Comparison",
    metaDescription:
      "Comparing an inverter vs generator in Lagos: running cost, noise, maintenance, and lifespan, side by side, so you know which fits your home.",
    featuredImageAlt: "Comparing inverter systems and generators for Lagos homes",
    authorName: "PowerNexa Solutions Team",
    publishedDaysAgo: 45,
    content: `Choosing between an inverter vs generator in Lagos comes down to more than the price tag on day one. Almost every Lagos household has owned or currently owns a generator. It's a familiar, understood technology. An inverter and battery system is a bigger upfront decision, so it's worth comparing the two honestly, without exaggerating either side.

## Inverter vs generator in Lagos: upfront cost

Generators are cheaper to buy upfront, often by a wide margin, especially small petrol units. An inverter and battery system costs more to install initially, and that gap grows if you add solar panels on top. This is the main reason generators remain common despite their downsides.

## Running cost

This is where the comparison shifts. A generator needs fuel every single time you run it, petrol or diesel, and Lagos fuel prices are not something you control. An inverter and battery system draws its stored charge from the grid (topping up when power is available) or from solar panels if installed, with no daily fuel purchase. Over time, the ongoing fuel cost of a generator adds up in a way that a one-time equipment investment doesn't.

## Noise and fumes

A generator running in a compound is loud. Diesel or petrol fumes are also a genuine health concern, especially for households with children, the elderly, or anyone with respiratory issues. An inverter and battery system is silent. This alone is why many households upgrade after their first generator wears out.

## Maintenance

Generators need regular servicing, oil changes, and eventually part replacements as the engine wears from mechanical use. Inverter and battery systems need far less hands-on maintenance, mainly periodic checks on connections and battery health, covered in our [maintenance service](/services/solar-maintenance-repair). There's no engine, so there's no oil to change or spark plug to replace.

## Lifespan

A well-maintained generator can last for years, but engine wear is constant with use and heavy daily running shortens its life considerably. A quality inverter, paired with the right battery (especially lithium), can run for many years with proper care. There are no moving engine parts, so daily wear is much lower.

## Reliability during outages

Both systems provide backup, but they behave differently. A generator needs to be manually started, or has an auto-start feature on higher-end units. Either way, it needs fuel on hand at all times, and that isn't always guaranteed during a fuel scarcity period. An inverter and battery system switches over automatically and instantly, with no dependence on having fuel in stock.

## Environmental impact

Generators burn fossil fuel directly in your compound. An inverter and battery system, especially paired with solar panels, has a much smaller day-to-day environmental footprint, since it either draws stored grid power or generates electricity from sunlight.

## Which one actually saves you money?

It depends on your time horizon and how often you experience outages. If outages are rare and short in your area, a generator's lower upfront cost might make sense for occasional use. If outages are frequent, as they are in most of Lagos, the ongoing fuel cost of a generator adds up quickly against the one-time cost of an inverter and battery system. Many households run both: an inverter and battery for daily, frequent backup, with a generator kept as a backup for extended outages or high-demand periods.

## A realistic middle ground

You don't have to choose one and abandon the other overnight. A common, sensible path is to install an inverter and battery system sized for your daily needs. Keep an existing generator as an occasional backup, then add solar panels later to cut how much you rely on either the grid or fuel. This spreads the investment out and lets you feel the benefit immediately without overcommitting upfront.

## Getting a system sized for your actual usage

If you're considering the switch, the right next step is a load assessment, not a guess based on your current generator's kVA rating. See our [inverter installation](/services/inverter-installation) service or [request a quote](/get-a-quote) to get a system sized around what you actually run, with pricing explained in writing.`,
  },
  {
    slug: "solar-battery-types-lithium-vs-tubular",
    title: "Lithium vs Tubular Battery in Lagos: Which Should You Choose?",
    excerpt:
      "Lithium or tubular battery for your solar or inverter system? Here's a straightforward comparison for Lagos conditions.",
    category: "Guides",
    tags: ["batteries", "lithium", "tubular"],
    focusKeyword: "lithium vs tubular battery in lagos",
    metaTitle: "Lithium vs Tubular Battery in Lagos: Which Is Right for You?",
    metaDescription:
      "A clear comparison of lithium vs tubular battery in Lagos for solar and inverter systems: cost, lifespan, maintenance, and which suits your budget.",
    featuredImageAlt: "Lithium vs tubular battery comparison for Lagos solar systems",
    authorName: "PowerNexa Solutions Team",
    publishedDaysAgo: 40,
    content: `Choosing between a lithium vs tubular battery in Lagos is the biggest decision left once you've settled on solar panels and an inverter. Both work. They just serve different budgets and priorities.

## Lithium vs tubular battery: how each type works, briefly

Tubular batteries are a type of lead-acid battery built with tube-shaped plates that improve durability compared to older flat-plate designs. They're a familiar technology in Nigeria and widely available.

Lithium (LiFePO4) batteries use lithium iron phosphate chemistry. It's one of the safer, more stable lithium chemistries available, with a strong track record for solar and backup power use.

## Upfront cost

Tubular batteries cost less to purchase initially, which is why they remain a popular starting point for households on a tighter budget. Lithium batteries cost more upfront, sometimes significantly more, for the same usable capacity.

## Lifespan

This is where lithium usually pulls ahead. Tubular batteries typically need replacement more frequently than lithium batteries under similar usage patterns, especially if they aren't maintained properly. Lithium batteries are generally rated for a much higher number of charge cycles, which translates to a longer usable life under normal, day-to-day backup use.

## Maintenance

Tubular batteries need regular attention: topping up with distilled water, keeping terminals clean, and monitoring for signs of sulfation if they're left discharged for long periods. Skipping this maintenance shortens their life considerably. Lithium batteries need essentially no manual maintenance, since they don't use liquid electrolyte that needs topping up.

## Weight and space

Lithium batteries are considerably lighter and more compact than tubular batteries of similar capacity. That matters if you're tight on space or installing somewhere harder to access.

## Charging speed and efficiency

Lithium batteries generally charge faster and use the energy put into them more efficiently than tubular batteries, which lose more energy as heat during charging and discharging.

## Depth of discharge

Here's a technical point worth understanding. Tubular batteries are usually only discharged to around 50% of their capacity to protect their lifespan. In practice, that means you only get to use about half of the rated capacity regularly. Lithium batteries can typically be discharged much deeper, often to 80-90%, without meaningfully shortening their life. This means a lithium battery's usable capacity is often much closer to its rated capacity than a tubular battery's.

## Lithium vs tubular battery in Lagos: which one should you choose?

Tubular makes sense if your upfront budget is tight, you don't mind regular maintenance, and you want a familiar, widely serviceable technology. Lithium makes sense if you want the lowest cost per year of use, minimal maintenance, and a longer lifespan, and you don't mind paying more today to get that.

Many Lagos homeowners who started with tubular batteries switch to lithium when it's time to replace, once they've felt the cost and hassle of maintenance and shorter lifespan firsthand.

## A note on safety

Not all lithium chemistries are equal. LiFePO4 is widely regarded as one of the safest lithium battery chemistries for home energy storage, more thermally stable than some other lithium types you may have heard about in other contexts (like consumer electronics). When we recommend lithium for a home installation, LiFePO4 is what we mean and what we install.

## Getting the right battery for your situation

The right choice depends on your budget, how much backup capacity you need, and how much ongoing maintenance you're willing to do. See our [battery replacement and storage service](/services/battery-replacement-storage) for details on both options, or [request a quote](/get-a-quote) and we'll recommend based on your specific situation, not just push whichever is more profitable for us.`,
  },
  {
    slug: "how-long-does-solar-installation-take-in-lagos",
    title: "How Long Does Solar Panel Installation Take in Lagos?",
    excerpt:
      "A realistic timeline for solar and inverter installation in Lagos, from first site visit to a fully commissioned system.",
    category: "Guides",
    tags: ["installation", "timeline", "process"],
    focusKeyword: "how long does solar panel installation take in lagos",
    metaTitle: "How Long Does Solar Panel Installation Take in Lagos?",
    metaDescription:
      "How long does solar panel installation take in Lagos? A realistic timeline from the first site visit to a fully tested, commissioned system.",
    featuredImageAlt: "Timeline showing how long solar panel installation takes in Lagos",
    authorName: "PowerNexa Solutions Team",
    publishedDaysAgo: 35,
    content: `How long does solar panel installation take in Lagos? That's one of the most common questions we get, right after "how much does this cost." Here's a realistic breakdown, not a marketing promise.

## The solar panel installation timeline in Lagos, stage by stage

## Stage 1: First contact to site visit (same day to a few days)

Once you reach out by phone, WhatsApp, or our [quote form](/get-a-quote), we confirm details fast. A site assessment is usually booked within the same business day, depending on our current schedule. During the visit, we review your appliances, your electricity bill, and inspect your roof and wiring.

## Stage 2: Written quote (usually within a day or two of the visit)

After the site visit, we put together a written quote covering panel count and wattage, inverter size, battery type and capacity, labour, and timeline. This isn't instant because it involves actually calculating your load properly rather than reading off a price list.

## Stage 3: Decision and scheduling (your pace)

There's no pressure to decide on the spot. Once you're ready to proceed, we schedule the installation date, which depends on equipment availability and our current job queue.

## Stage 4: Equipment sourcing (varies)

If the specific panels, inverter, or batteries you've chosen need to be sourced, this can add time before installation begins. Standard, commonly stocked equipment moves faster than custom or less common specifications.

## Stage 5: Installation (1 to 3 days for most homes)

This is the part people usually mean when they ask "how long will it take." For most residential installations, the on-site work, mounting panels, running wiring, installing the inverter and battery, takes one to three days. The exact time depends on system size and roof complexity. A simple inverter and battery installation without panels can sometimes be completed in a single day. A larger system with many panels and a complex roof can take longer.

Commercial and estate projects, covered under our [commercial solar for business](/services/commercial-solar-for-business) service, vary more widely based on scope and are scheduled individually.

## Stage 6: Testing and commissioning (part of the final day)

Before we consider a job finished, we test the system with your own appliances running, not a simulated test, to confirm everything performs as expected. This is also when you get a full walkthrough of your system and your warranty documents.

## What can extend the timeline

Heavy rain can delay roof work for safety reasons. Difficult roof access or a building management approval process, common in some estates and high-rises, can add time before work even starts. A request for a specific brand or spec that isn't in regular stock takes longer to source. And every so often, an installer finds an existing wiring issue on-site that needs attention before a new system can be safely connected. We flag this during the site visit wherever we can, so it isn't a surprise later.

## What doesn't need to slow things down

A well-organized installer with your load calculation already done, equipment confirmed, and a clear installation day plan should not need to "figure things out" once the team is on-site. If an installation is dragging on for reasons that were foreseeable at the quote stage, that's usually a sign of poor planning rather than a genuinely difficult job.

## Planning around your schedule

If you run a business, see our note on [scheduling installation around business hours](/services/commercial-solar-for-business) to minimize disruption. For homes, we work with you to pick installation days that fit your schedule, including weekends where needed.

Ready to get a specific timeline for your property? [Request a quote](/get-a-quote) and we'll give you a realistic date range based on your system size and our current schedule, not an optimistic guess.`,
  },
  {
    slug: "what-can-a-3-5kva-inverter-carry",
    title: "What Can a 3.5kVA Inverter Carry? AC, Freezer and Pumping Machine",
    excerpt:
      "Which ACs, freezers, pumping machines and irons a 3.5kVA inverter can run in a Lagos home, how long the batteries last, and how many solar panels it needs.",
    category: "Guides",
    tags: ["inverter", "sizing", "3.5kva"],
    focusKeyword: "what can a 3.5kva inverter carry",
    metaTitle: "What Can a 3.5kVA Inverter Carry? A Lagos Home Guide",
    metaDescription:
      "What can a 3.5kVA inverter carry? See what AC, freezer, pumping machine and iron it runs in a Lagos home, how long batteries last, and how many panels it needs.",
    featuredImageAlt: "What can a 3.5kVA inverter carry: an inverter and battery bank in a Lagos home",
    authorName: "PowerNexa Solutions Team",
    publishedDaysAgo: 0,
    content: `"Can my 3.5kVA carry AC?" Lagos homeowners ask this a lot before they buy an inverter. This guide answers what can a 3.5kVA inverter carry, appliance by appliance: the AC, the freezer, the pumping machine, the pressing iron. It also covers how long the batteries will last when NEPA takes light, and how many solar panels you need to charge them.

The short answer: a 3.5kVA inverter runs a normal family home well. It can carry fans, lights, TVs, a fridge, a freezer and one small inverter AC. It struggles when heavy appliances start at the same time.

## First, what 3.5kVA means in watts

Inverters are sold in kVA, but your appliances are labelled in watts. They are not the same number.

Many older 3.5kVA inverters give about 2,800 watts (3.5 × 0.8). Many newer ones give 3,000 watts or a bit more. Check the "rated output power" line on the inverter's label or manual. That watts figure is your true limit.

Don't plan to use all of it. Keep your normal load under about 80% of the rated watts, so around 2,300 to 2,500 watts at a time. That leaves room for motors to start and keeps the inverter from running hot.

Most 3.5kVA inverters run on a 24V battery bank. That usually means two 12V batteries, or one 24V lithium battery.

## So, what can a 3.5kVA inverter carry?

Here are typical figures for common Lagos appliances. Your own appliance labels are the final word, since models differ.

| Appliance | Typical running watts | Can a 3.5kVA carry it? |
|---|---|---|
| LED bulbs (10 of them) | 70 to 100W | Yes |
| Standing or ceiling fans (3) | 150 to 250W | Yes |
| TV and decoder | 80 to 150W | Yes |
| Wi-Fi router and phone chargers | 20 to 50W | Yes |
| Laptop | 50 to 90W | Yes |
| Fridge | 100 to 200W | Yes |
| Chest freezer | 100 to 200W | Yes |
| Washing machine (no hot wash) | 400 to 800W | Yes, when the AC is off |
| Microwave | 1,000 to 1,500W | Yes, for short use |
| Pressing iron | 1,000 to 1,200W | Yes, but it drains the battery fast |
| 1HP inverter AC | 600 to 900W | Yes |
| 1HP non-inverter AC | 900 to 1,200W, with a big start-up surge | Risky |
| 1.5HP inverter AC | 900 to 1,300W | Yes, alone, for a short time |
| 2HP AC | 1,500W and up | No |
| 0.5HP pumping machine | about 400 to 500W, with a start-up surge | Yes |
| 1HP pumping machine | about 750 to 1,000W, with a big start-up surge | Only with other heavy loads off |
| Electric kettle, hot plate, water heater | 1,500 to 3,000W | No |

### Can a 3.5kVA inverter carry AC?

Yes, if it's the right AC.

An inverter AC starts slowly. It ramps its compressor up instead of jumping to full power, so its start-up draw stays low. A 1HP inverter AC runs comfortably on a 3.5kVA inverter alongside your fans, lights and fridge.

A non-inverter AC (the older, cheaper type) is different. When its compressor kicks in, it can pull three to five times its running power for a moment. On a 3.5kVA inverter, that surge can trip the overload alarm or shut the inverter down, especially if other things are already on.

A 1.5HP inverter AC will run on a 3.5kVA inverter, but it takes a big share of the capacity. It will also empty a small battery bank in a couple of hours. A 2HP AC is too much for a 3.5kVA inverter. If you want AC most nights, look at a [5kVA inverter](/blog/what-can-a-5kva-inverter-carry) instead.

### Can a 3.5kVA inverter carry a freezer?

Yes. A fridge and a chest freezer together are well within a 3.5kVA inverter's limit. Both have a short start-up surge when the compressor kicks in, but it's small enough for a 3.5kVA to handle.

Watch the battery instead. A freezer runs all night, so it slowly uses stored power while you sleep.

### Can a 3.5kVA inverter carry a pumping machine?

A 0.5HP pumping machine, yes. A 1HP pumping machine can start on many 3.5kVA inverters, but only when the AC, iron and microwave are off. Water pumps pull a large surge at start-up, and that surge plus an AC can go over the limit.

The easy fix is to pump water in the afternoon when the sun is strong or when NEPA is on, with the AC off.

### Pressing iron and microwave

A 3.5kVA inverter can carry both, one at a time. The problem is the battery. A pressing iron uses about 1,000 to 1,200 watts, so 30 minutes of ironing can use a big chunk of a small battery bank. Iron when there's light or strong sun, not at 10pm on battery.

## What a 3.5kVA inverter should not carry

Anything that heats with electricity. Electric kettles, hot plates, electric cookers and water heaters use 1,500 to 3,000 watts each. They either overload a 3.5kVA inverter or empty the batteries in minutes. Keep these on gas or on NEPA.

## How long will the batteries last?

This depends on the battery bank, not the inverter. Here is a rough guide for a typical night load of about 500 watts (fans, lights, TV, fridge and router):

- Two 12V 200Ah tubular batteries store about 4.8kWh. You should only use about half of that to protect them, so roughly 2.4kWh. That's about 4 hours at 500 watts.
- One 24V 200Ah lithium battery also stores about 4.8kWh, but you can safely use most of it, around 4kWh. That's about 7 hours at 500 watts.

Add a 1HP inverter AC and the load climbs to around 1,200 watts. The same batteries then last less than half as long.

Our guide on [lithium vs tubular batteries](/blog/solar-battery-types-lithium-vs-tubular) explains the trade-offs in more detail.

## How many solar panels for a 3.5kVA inverter?

For most Lagos homes, 4 to 6 panels of 450 to 550 watts each is a good range. That gives about 2,000 to 3,000 watts of panels.

Lagos gets about 4 peak sun hours a day across the year. In July and August it can drop to about 3. After losses from heat, dust and wiring, a 450-watt panel gives around 1 to 1.4kWh a day. Six of them can refill a 4.8kWh battery bank and run your daytime load on most days.

Two things can change your number:

1. Your inverter's solar input limit. Check this first. Some 3.5kVA inverters only accept about 1,000 to 1,600 watts of panels. Others take 4,000 watts or more. Check the "max PV input power" on the label before buying panels. Extra panels past this limit do nothing.
2. When you use power. If your family is home in the daytime running fans and a freezer, you need more panels than a home that's empty until evening.

## Signs your load is too big for a 3.5kVA

- The inverter beeps or shows "overload" when the AC or pump starts
- The inverter shuts down, then restarts, when a big appliance switches on
- The batteries are flat long before morning
- The inverter or battery area feels very hot

If you see these, the fix may be moving one or two heavy appliances to NEPA-only times. Or it may be time for a bigger inverter or more battery storage.

## Get your load checked before you buy

Adding up your appliances on paper is a good start. But an installer should also check your wiring, your changeover, where the inverter will sit, and what you really run at night. That's what our [inverter installation](/services/inverter-installation) visit is for.

You can send us your list of appliances on WhatsApp and ask questions at no cost. When you're ready, [get a quote](/get-a-quote) and we'll book a site assessment and give you a written plan for your home.`,
  },
  {
    slug: "what-can-a-5kva-inverter-carry",
    title: "What Can a 5kVA Inverter Carry? AC, Pumping Machine and More",
    excerpt:
      "Which ACs, pumping machines and home appliances a 5kVA inverter can run in Lagos, how long different battery banks last, and how many solar panels it needs.",
    category: "Guides",
    tags: ["inverter", "sizing", "5kva"],
    focusKeyword: "what can a 5kva inverter carry",
    metaTitle: "What Can a 5kVA Inverter Carry? A Lagos Home Guide",
    metaDescription:
      "What can a 5kVA inverter carry? See if it runs a 1.5HP or 2HP AC and a pumping machine in a Lagos home, how long batteries last, and how many panels it needs.",
    featuredImageAlt: "What can a 5kVA inverter carry: an inverter and lithium battery setup in a Lagos home",
    authorName: "PowerNexa Solutions Team",
    publishedDaysAgo: 0,
    content: `A 5kVA inverter is the size to look at when you want to run AC on backup, not only fans and lights. But "5kVA" on the box doesn't tell you what you can switch on when NEPA takes light. This guide covers what can a 5kVA inverter carry, appliance by appliance, how long the batteries last, and how many solar panels you need.

The short answer: a 5kVA inverter can carry a whole family home, including a 1.5HP inverter AC, a freezer and a pumping machine. What limits it most is battery size, not the inverter.

## What 5kVA means in watts

Inverters are rated in kVA, but appliances are labelled in watts.

Older 5kVA inverters give about 4,000 watts (5 × 0.8). Many newer hybrid inverters give the full 5,000 watts. Look for "rated output power" on the label or in the manual. That watts figure is your true limit.

For everyday use, keep your running load under about 80% of it. That's roughly 3,200 watts on an older unit and 4,000 watts on a newer one. The spare room lets motors start without tripping the inverter.

Most 5kVA inverters run on a 48V battery bank. That's usually four 12V batteries in series, or one 48V lithium battery.

## So, what can a 5kVA inverter carry?

These are typical figures. Check your own appliance labels, since models differ.

| Appliance | Typical running watts | Can a 5kVA carry it? |
|---|---|---|
| Lights, fans, TVs, router, chargers | 300 to 600W together | Yes |
| Fridge and chest freezer | 200 to 400W together | Yes |
| Washing machine (no hot wash) | 400 to 800W | Yes |
| Microwave | 1,000 to 1,500W | Yes |
| Pressing iron | 1,000 to 1,200W | Yes |
| 1HP inverter AC | 600 to 900W | Yes |
| 1.5HP inverter AC | 900 to 1,300W | Yes |
| 1.5HP non-inverter AC | 1,100 to 1,500W, with a big start-up surge | Usually, if little else is starting at the same time |
| 2HP inverter AC | 1,400 to 1,900W | Yes, but it drains the battery fast |
| Two 1HP inverter ACs | 1,200 to 1,800W together | Yes, with a large battery bank |
| 1HP to 1.5HP pumping machine | 750 to 1,100W, with a big start-up surge | Yes, with the ACs off while it starts |
| Water heater | 1,500 to 3,000W | Not on battery |
| Electric cooker or hot plate | 1,500 to 2,000W per ring | No |

### Can a 5kVA inverter carry a 1.5HP AC?

Yes. If you want a 1.5HP AC on backup, this is the size to look at. A 1.5HP inverter AC runs comfortably, with room left for fans, lights, the fridge and the freezer.

A non-inverter AC pulls a large surge each time its compressor starts, often three to five times its running power. A 5kVA inverter can usually handle one of these. Trouble starts when the AC kicks in at the same moment as a pump or a microwave. If you're buying a new AC, an inverter type is kinder to your backup system.

### Can a 5kVA inverter carry a 2HP AC?

It can start and run one. A 2HP inverter AC uses around 1,400 to 1,900 watts. Add the rest of the house and you are near the limit of an older 4,000-watt unit. The bigger issue is storage. At that load, a four-battery tubular bank will be flat in about two hours.

If you want a 2HP AC, or two ACs, running through the night, plan the battery bank around that first. A single 5kVA inverter can't make up for too little storage.

### Can a 5kVA inverter carry a pumping machine?

Yes. A 1HP or 1.5HP pumping machine is fine on a 5kVA inverter. Pumps have a heavy start-up surge, so it's still wise to pump when the ACs are off, or during the day when the sun is strong and the panels are doing the work.

### Pressing iron, microwave and washing machine

A 5kVA inverter carries all of these. You can run the washing machine and iron at the same time as your fans and fridge. Each of them takes a big bite out of the battery, so heavy chores are best done while there's light or sun.

## What a 5kVA inverter should not carry

Water heaters, electric cookers, hot plates and electric kettles use 1,500 to 3,000 watts each. A 5kVA inverter may carry one briefly, but the batteries will drain very fast. Keep these on gas or on NEPA.

## How long will the batteries last?

Here are rough figures for three common battery banks and two evening loads. The small load is about 500 watts (fans, lights, TV, fridge, router). The AC load adds a 1HP inverter AC, for about 1,200 watts total.

| Battery bank | Usable storage | 500W load | 1,200W load (with AC) |
|---|---|---|---|
| Four 12V 200Ah tubular | about 4.8kWh (half of 9.6kWh) | about 8 hours | about 3 to 4 hours |
| 48V 100Ah lithium | about 4.3kWh | about 7 to 8 hours | about 3 hours |
| 48V 200Ah lithium | about 8.5kWh | about 15 hours | about 6 to 7 hours |

Tubular batteries should only be run down to about half, or they wear out quickly. Lithium batteries can be run much lower. So a lithium battery gives more usable power for its size. For more detail, see our guide on [lithium vs tubular batteries](/blog/solar-battery-types-lithium-vs-tubular).

If you want AC all night, the 48V 200Ah lithium bank (or two 100Ah units) is the practical minimum.

## How many solar panels for a 5kVA inverter?

For most Lagos homes, 8 to 12 panels of 450 to 550 watts each is a good range. That's about 3,600 to 6,000 watts of panels.

Lagos gets around 4 peak sun hours a day over the year. In the rainy months of July and August that can fall to about 3. After heat, dust and wiring losses, each 550-watt panel gives around 1.2 to 1.6kWh a day. Ten of them can refill a large battery bank and run daytime loads, including an AC, on most days.

Check two things before buying panels:

1. The inverter's solar input limit. Look for "max PV input power" on the label. Many 5kVA hybrids accept 5,000 to 6,500 watts of panels, but some accept less. Panels above the limit add nothing.
2. The voltage limit. Panels are wired in strings, and each string's voltage must stay under the inverter's maximum PV voltage. This is a job for your installer, not guesswork, because going over it can damage the inverter.

## 5kVA or 3.5kVA?

Choose a 3.5kVA if your home runs fans, lights, TVs, a fridge and a freezer, with maybe one small inverter AC now and then. Our [3.5kVA inverter guide](/blog/what-can-a-3-5kva-inverter-carry) covers that size in full.

Choose a 5kVA if you want a 1.5HP AC on backup, run a pumping machine often, or have a large family with lots going on at once. Also choose it if you plan to add more batteries or panels later. Moving up to 5kVA later usually means replacing the inverter, so buying the right size once saves money.

## Signs your 5kVA is overloaded

- An "overload" warning or beeping when the AC or pump starts
- The inverter switching off, then back on
- Batteries flat hours before NEPA comes back
- Heat or a burning smell near the inverter, batteries or cables

The last one needs attention straight away. Switch off the heavy loads and call your installer. Our [maintenance and repair service](/services/solar-maintenance-repair) covers inverter checks like this.

## Size the system around your home

A 5kVA inverter is a good fit for many Lagos homes, but the right system depends on what you run and when. The battery bank and panels matter as much as the inverter.

You can send us your appliance list on WhatsApp and ask questions for free. When you're ready, [get a quote](/get-a-quote). We'll book a site assessment, look at your wiring and load, and give you a written plan for your [inverter installation](/services/inverter-installation).`,
  },
];
