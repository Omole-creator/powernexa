// PLACEHOLDER TESTIMONIAL DATA
// These are illustrative reviews (fake names, real Lagos neighborhoods) used
// to show how the testimonials section will look once real customer reviews
// exist. Replace every entry below with genuine customer feedback before
// launch. No Review/AggregateRating structured data is attached to this
// content anywhere on the site until it is replaced with real reviews.

export type Testimonial = {
  name: string;
  location: string;
  quote: string;
  service: string;
  rating: number;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Adaeze Nwosu",
    location: "Victoria Island, Lagos",
    quote:
      "Our office used to shut down every time NEPA took light. PowerNexa sized a system that carries our AC units and servers for a full workday. No more lost hours.",
    service: "Commercial Solar for Business",
    rating: 5,
  },
  {
    name: "Tunde Bakare",
    location: "Lekki Phase 1, Lagos",
    quote:
      "They came, measured our actual load instead of guessing, and explained every naira on the quote. Installation took two days, exactly as promised.",
    service: "Solar Panel Installation",
    rating: 5,
  },
  {
    name: "Chiamaka Eze",
    location: "Ikoyi, Lagos",
    quote:
      "I was tired of generator fumes in the compound. The new inverter and battery setup is silent, and my electricity bill dropped within the first month.",
    service: "Inverter Installation",
    rating: 5,
  },
  {
    name: "Segun Adeyemi",
    location: "Ajah, Lagos",
    quote:
      "My old batteries died every year. PowerNexa's lithium battery replacement has held up through two rainy seasons with zero issues so far.",
    service: "Battery Replacement & Storage",
    rating: 5,
  },
  {
    name: "Folake Ogunleye",
    location: "VGC, Lagos",
    quote:
      "We coordinated with three other households on our street and PowerNexa handled each install without disrupting the estate. Professional from quote to commissioning.",
    service: "Solar Panel Installation",
    rating: 5,
  },
  {
    name: "Ibrahim Yusuf",
    location: "Lekki Phase 1, Lagos",
    quote:
      "Their maintenance visit caught a loose connection before it became a bigger problem. That kind of attention is why we signed a yearly plan with them.",
    service: "Solar & Inverter Maintenance",
    rating: 5,
  },
];
