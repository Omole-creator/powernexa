// Tells Bing (and the other IndexNow engines) about every URL in the live
// sitemap. ChatGPT search leans on Bing's index, so run this after a deploy
// that adds or changes pages, e.g. a new blog post.
//
// Run with: npm run indexnow
// The key file public/a093c2344b29b2b23e3437cbd5675213.txt must stay live on the site.

const SITE_URL = "https://www.powernexasolutions.site";
const KEY = "a093c2344b29b2b23e3437cbd5675213";

async function main() {
  const sitemap = await fetch(`${SITE_URL}/sitemap.xml`).then((res) => res.text());
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (urls.length === 0) throw new Error("No URLs found in the live sitemap.");

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(SITE_URL).host,
      key: KEY,
      keyLocation: `${SITE_URL}/${KEY}.txt`,
      urlList: urls,
    }),
  });

  // 200 = accepted, 202 = accepted, key check pending.
  console.log(`Submitted ${urls.length} URLs to IndexNow: HTTP ${res.status}`);
  if (!res.ok) {
    console.log(await res.text());
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
