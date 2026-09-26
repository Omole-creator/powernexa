// PowerNexa's written promises to every customer (owner-approved Sept 2026).
// One source for the website, every customer quote and every My System page,
// so the figures can't drift apart. Change a number here and it changes
// everywhere. Working hours come from BUSINESS_HOURS in constants.ts.

export const PROMISE_TERMS = {
  // Owner decision (Sept 2026): the warranty covers the same first year as
  // the two free check-ups.
  workmanshipYears: 1,
  checkupMonths: [6, 12],
  replyHours: 2,
  onSiteHours: 48,
  carryGuaranteeDays: 30,
  quoteValidDays: 7,
} as const;

// "your first year" / "your first 2 years", for sentences.
export const WARRANTY_PERIOD =
  PROMISE_TERMS.workmanshipYears === 1 ? "your first year" : `your first ${PROMISE_TERMS.workmanshipYears} years`;

export type CustomerPromise = { key: string; title: string; body: string };

export const PROMISES: CustomerPromise[] = [
  {
    key: "fixed-price",
    title: "The price on your quote is the price you pay",
    body: "No extra charge for cable, transport or anything else once work starts. The price only changes if you add appliances to the list.",
  },
  {
    key: "carry",
    title: "It carries what we said it would, or we fix it",
    body: `Your quote lists every appliance the system will power and for how many hours. If it can't do that in the first ${PROMISE_TERMS.carryGuaranteeDays} days, we adjust it or add to it at our own cost.`,
  },
  {
    key: "payment",
    title: "Pay the balance when it's working",
    body: "Your deposit covers the equipment. You pay the rest after we install it and you see it working.",
  },
  {
    key: "warranty",
    title: `${PROMISE_TERMS.workmanshipYears}-year workmanship warranty, in writing`,
    body: `If a fault comes from our work, like a loose connection, bad wiring or poor mounting, we fix it free for ${WARRANTY_PERIOD}. That's on top of the maker's warranty on your equipment.`,
  },
  {
    key: "checkups",
    title: "Two free check-ups in your first year",
    body: `We come back at ${PROMISE_TERMS.checkupMonths[0]} months and ${PROMISE_TERMS.checkupMonths[1]} months to check your panels, inverter, battery and wiring, so a small problem doesn't turn into a big one.`,
  },
  {
    key: "response",
    title: `A reply in ${PROMISE_TERMS.replyHours} hours, a technician in ${PROMISE_TERMS.onSiteHours}`,
    body: `Message us on WhatsApp any time, day or night, and we reply within ${PROMISE_TERMS.replyHours} hours. If something is wrong, a technician comes to you within ${PROMISE_TERMS.onSiteHours} hours.`,
  },
];

// The fine print that goes on the written quote under the promises.
export const CARRY_GUARANTEE_TERMS =
  "Covers the appliances and hours on this list only. It doesn't cover appliances added after the assessment, appliances used for longer than listed, or faulty appliances. Backup hours assume a fully charged battery; long rainy spells slow solar charging.";

export const WORKMANSHIP_TERMS =
  "Covers faults caused by our installation. Equipment faults are covered by each maker's own warranty. Damage from floods, fire, lightning, power surges from the grid, or work done on the system by anyone else is not covered.";
