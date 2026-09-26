# PowerNexa social media strategy

The working playbook for @powernexas on Instagram, TikTok and X. Claude works to
it as brand and content strategist and senior social media manager. When the
owner types **"post for today"**, Claude makes one finished post (images plus
caption) by following the workflow at the bottom of this file.

## 1. Who we're talking to

| Who | What keeps them up at night | Where they are |
|---|---|---|
| Lagos homeowners and renters with families | NEPA takes light at night, the generator noise, the fuel bill, food spoiling | Lekki, Ajah, Sangotedo, Ikeja, VI, Mainland |
| Small business owners (shops, salons, clinics, pharmacies, offices) | Diesel eating the profit, customers leaving when light goes, equipment damage | Same areas, plus market streets |
| Estate managers and landlords | Tenants complaining, shared generator costs, maintenance wahala | Estates in Lekki, Ajah, VGC |

## 2. What we stand for

**Core message:** spend less on fuel, with a system sized for what you actually
power, and a team that doesn't disappear after installation.

**The villain:** NEPA wahala and the fuel bill. Every post takes a side against
it. We don't attack other installers by name.

**Our proof (only claims we can back):**
- The six written promises in `src/lib/promises.ts`: fixed price, 30-day carry
  guarantee, deposit covers equipment and the balance is paid after it's working,
  2-year workmanship warranty, free check-ups at 6 and 12 months, WhatsApp reply
  in 2 hours and a technician in 48.
- 125+ projects completed (the owner's own count, `PROJECTS_COMPLETED`).
- Install videos and posters in `public/videos/projects/` (Ikoyi, GRA Ikeja,
  Elegushi Lekki, Okun Aja, Mowe-Ibafo).
- We buy and bring every panel, inverter and battery. The customer sources nothing.

**Tagline we can use:** "Solar and inverter power that never blinks."

## 3. How pages grow from nothing to a household name

The common playbook behind pages that grew from zero followers to a name people
recognise, applied to us:

1. **Show up every day, same look.** Navy, orange and yellow, the same fonts and
   the same brand bar on every slide, so people know it's us before they read the
   name. Consistency beats one viral post.
2. **Pick a fight with a shared enemy.** NEPA, fuel queues, generator noise.
   People share posts that say what they already feel.
3. **Named series people come back for.** A series turns random posts into a show
   (see section 5). Keep the names exact every time.
4. **Give more than you ask.** Roughly 4 useful posts for every 1 that sells.
   Useful posts get saved and shared, and saves and shares are what the apps push.
5. **Talk like Lagos.** "NEPA take light", "up NEPA", "wahala", "can it carry",
   "gen". Light pidgin in hooks is fine, the body stays plain English.
6. **Proof over promises.** Real installs, real videos, real numbers. Never a
   stock photo of a white family on a roof.
7. **Ride the news the same day.** Tariff changes, fuel price jumps, national
   grid collapses, heatwaves. A quick, useful take the day it happens beats a
   perfect one a week later.
8. **Turn comments into content.** Every good question becomes a "You asked"
   post. Reply to every comment within the hour on posting day.
9. **One clear next step.** Every post ends with one action: save it, send it to
   someone, WhatsApp us, or get the free checklist (`/free-checklist`, link in bio).
10. **Post once, publish three times.** Each carousel goes to Instagram, TikTok
    photo mode and X with the same images and a caption fitted to each.

## 4. Content pillars and the weekly rotation

| Pillar | Share | What it does |
|---|---|---|
| Teach | 40% | Sizing, batteries, inverter faults, "can it carry". Gets saved. |
| Fuel vs sun | 20% | Money: fuel spend, payback, tariff. Gets shared. |
| Proof | 20% | Installs, videos, promises, how we work. Builds trust. |
| Relate | 10% | NEPA memes and moments everyone in Lagos knows. Gets reach. |
| Offer | 10% | Get a quote, the checklist, the six promises. Gets leads. |

| Day | Pillar | Default series |
|---|---|---|
| Monday | Teach | Can It Carry? |
| Tuesday | Fuel vs sun | Fuel vs Sun |
| Wednesday | Proof | Behind the Install |
| Thursday | Teach | Installer Red Flags |
| Friday | Relate | NEPA Diaries |
| Saturday | Proof or Offer | Our Promise / You Asked |
| Sunday | Teach (light) | One Tip Sunday |

Breaking news overrides the day.

## 5. Series

- **Can It Carry?** One inverter size, what it can and can't power. Numbers must
  match the blog posts (`src/lib/blog-seed-data.ts`) and `PACKAGES` in
  `src/lib/costing.ts`.
- **Fuel vs Sun.** Monthly fuel spend versus after solar, and payback months.
  Use the same maths as the customer quote (`fuelSavings()` in
  `src/lib/quote.ts`). Always say the figures are an example.
- **Behind the Install.** One project, one photo or video poster, what was done.
  Use only the owner's own captions for sizes.
- **Installer Red Flags.** One warning sign from the free checklist research.
  Ends with the checklist CTA.
- **NEPA Diaries.** A moment every Lagos home knows. Light, funny, no selling.
- **Our Promise.** One of the six promises per post, what it means for the customer.
- **You Asked.** A real question from comments or WhatsApp, answered.
- **One Tip Sunday.** A single maintenance or usage tip.

## 6. Format rules

- **Carousels have 3 slides at most.** Single images are fine.
- Size 1080 x 1350 (4:5). HTML slides link `templates/brand.css` and render to PNG
  with `node marketing/render.mjs <post-folder>`.
- **Slide 1 is the hook:** 8 words or fewer, big type, one idea. Slide 2 delivers
  the value. Slide 3 is the payoff plus one CTA.
- Every slide has the brand bar (logo chip and 1/3, 2/3, 3/3).
- Photos: use the owner's real photos from `public/images/` and video posters from
  `public/videos/projects/`. **Use no more than one owner photo per post.** On the
  site, two or more of these photos must never appear together, and posts follow
  the same rule.
- Don't show or name equipment brands from the photos (NG Power, Soltarc, Phoenix
  are placeholder brands, not what we install).

## 7. Copy rules

- House style from `COPYWRITING-PLAYBOOK.md` 0.1: no em dashes, plain 8th-grade
  words, short lines, every claim provable. Run all copy through the `humanizer`
  skill.
- **Never** write "free site visit", "free quote" or "free assessment". The site
  assessment has a small fee (don't give the reason). "Free check-ups" (after
  installation) and "free checklist" are fine.
- **No public prices** of our systems, and no price ranges. Fuel figures are the
  customer's side and are fine as clearly marked examples.
- Never use the placeholder testimonials from `src/lib/testimonials-data.ts`.
  Real reviews only, with the customer's permission.
- Don't change the hero line wording when using it.

**Caption formula (short):**
1. Hook line (restates slide 1 or adds a twist).
2. One to three short lines of value.
3. One CTA: "Save this for when NEPA strikes", "Send this to someone still
   buying fuel every week", "WhatsApp 0813 209 7317", or "Free checklist, link in bio".
4. 3 to 5 hashtags from the bank.

On X, drop the hashtags down to one or two and keep it to 280 characters.

**Hashtag bank:** #Lagos #LagosNigeria #SolarLagos #SolarNigeria #InverterLagos
#NEPA #LagosHomes #LekkiLagos #AjahLagos #IkejaLagos #SolarPower #PowerNexa

## 8. Folder layout

```
marketing/
  STRATEGY.md        this file
  POSTS-LOG.md       every post made, newest first, so series and topics rotate
  render.mjs         HTML slides to PNG (headless Edge)
  templates/
    brand.css        slide design system (colours, type, cards, brand bar)
  posts/
    YYYY-MM-DD-short-name/
      slide-1.html ... slide-3.html
      slide-1.png  ... slide-3.png   (upload these)
      caption.md     Instagram/TikTok caption, X version, alt text
```

## 9. Workflow for "post for today"

1. Read `POSTS-LOG.md` and pick today's pillar and series from the rotation,
   avoiding a topic used in the last 14 days.
2. Search the news for a same-day Lagos power or fuel story. If there's a strong
   one, it overrides the rotation.
3. Write the hook, the slides and the caption. Check every claim against the
   repo (promises, blog numbers, `PACKAGES`). Run the copy through `humanizer`.
4. Build `slide-N.html` (3 at most), render with
   `node marketing/render.mjs <folder>`, then open each PNG and check spacing,
   overflow and readability. Fix and re-render until clean.
5. Write `caption.md`: the IG/TikTok caption, the X version and alt text for each slide.
6. Add a row to `POSTS-LOG.md`, then commit and push the post folder.
7. In the reply, show the images and the caption ready to paste, with the best
   time to post (Lagos weekdays 7 to 9pm, weekends 11am to 1pm).
