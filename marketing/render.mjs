// Renders social slides (HTML, 1080 x 1350) to PNG with headless Microsoft Edge.
//
//   node marketing/render.mjs                       renders every post
//   node marketing/render.mjs 2026-09-27-fuel-math  renders one post folder
//
// Each post folder in marketing/posts/ holds slide-1.html ... slide-3.html
// (never more than 3) and gets slide-1.png ... next to them.

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const EDGE_PATHS = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
];
const browser = EDGE_PATHS.find((p) => existsSync(p));
if (!browser) {
  console.error("No Edge or Chrome found. Install one, or add its path to EDGE_PATHS.");
  process.exit(1);
}

const postsDir = resolve(import.meta.dirname, "posts");
const only = process.argv[2];
const folders = readdirSync(postsDir)
  .filter((name) => statSync(join(postsDir, name)).isDirectory())
  .filter((name) => !only || name === only);

if (folders.length === 0) {
  console.error(only ? `No post folder named ${only}` : "No posts yet.");
  process.exit(1);
}

for (const folder of folders) {
  const dir = join(postsDir, folder);
  const slides = readdirSync(dir).filter((f) => /^slide-\d+\.html$/.test(f)).sort();
  if (slides.length > 3) {
    console.error(`${folder}: ${slides.length} slides. Carousels are capped at 3.`);
    process.exit(1);
  }
  for (const slide of slides) {
    const out = join(dir, slide.replace(".html", ".png"));
    execFileSync(browser, [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--allow-file-access-from-files",
      "--virtual-time-budget=6000",
      "--window-size=1080,1350",
      `--screenshot=${out}`,
      pathToFileURL(join(dir, slide)).href,
    ], { stdio: "ignore" });
    console.log(`rendered ${folder}/${slide.replace(".html", ".png")}`);
  }
}
