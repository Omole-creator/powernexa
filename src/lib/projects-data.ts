// Owner-supplied installation videos, watermarked with the PowerNexa logo
// (faint, centred) and compressed for the web before being committed to
// public/videos/projects. Specs come from the owner's own captions, never
// guessed from the footage. Mowe-Ibafo came with a location only, so its
// label names the parts visible in the video without sizes.
//
// Headline stats used by ProofCounters. PROJECTS_COMPLETED is the owner's
// own count. Update it here, not in the components.
export const PROJECTS_COMPLETED = 125;

export type ProjectVideo = {
  slug: string;
  title: string;
  specs: string;
  location: string;
  video: string;
  poster: string;
};

export const PROJECT_VIDEOS: ProjectVideo[] = [
  {
    slug: "elegushi-lekki",
    title: "22kVA hybrid system",
    specs: "2 x 11kVA hybrid inverters, 64kWh lithium bank (4 x 16kWh), 30 x 620W panels.",
    location: "Elegushi Estate, Lekki",
    video: "/videos/projects/elegushi-lekki.mp4",
    poster: "/videos/projects/elegushi-lekki.jpg",
  },
  {
    slug: "okun-aja",
    title: "16kVA solar system",
    specs: "6kVA and 10kVA inverters, 2 x 15kWh lithium batteries, 32 x 500W panels.",
    location: "Okun-Aja, Lagos",
    video: "/videos/projects/okun-aja.mp4",
    poster: "/videos/projects/okun-aja.jpg",
  },
  {
    slug: "ikoyi",
    title: "11kVA hybrid inverter",
    specs: "11kVA hybrid inverter with a 17kWh lithium battery.",
    location: "Ikoyi, Lagos",
    video: "/videos/projects/ikoyi.mp4",
    poster: "/videos/projects/ikoyi.jpg",
  },
  {
    slug: "gra-ikeja",
    title: "5kVA inverter backup",
    specs: "5kVA hybrid inverter on 8 x 220Ah tall tubular batteries. Charges from the grid, no panels.",
    location: "GRA Ikeja, Lagos",
    video: "/videos/projects/gra-ikeja.mp4",
    poster: "/videos/projects/gra-ikeja.jpg",
  },
  {
    slug: "mowe-ibafo",
    title: "Solar and lithium system",
    specs: "Hybrid inverter, lithium battery and solar panels.",
    location: "Mowe-Ibafo, Ogun State",
    video: "/videos/projects/mowe-ibafo.mp4",
    poster: "/videos/projects/mowe-ibafo.jpg",
  },
];
