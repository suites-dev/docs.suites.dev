#!/usr/bin/env node
/**
 * Triggers a re-crawl of the Algolia DocSearch crawler after a Netlify build.
 *
 * Runs only on production deploys. Skips silently for deploy previews,
 * branch deploys, and local builds. Skips with a warning if credentials
 * are missing instead of failing the build.
 *
 * Required environment variables (set in Netlify → Site settings → Environment):
 *   ALGOLIA_CRAWLER_USER_ID
 *   ALGOLIA_CRAWLER_API_KEY
 *   ALGOLIA_CRAWLER_ID            (the crawler UUID, currently 7ecdfe3f-744f-4633-9dd4-bc7c721b383b)
 */

const CONTEXT = process.env.CONTEXT ?? "local";
const USER_ID = process.env.ALGOLIA_CRAWLER_USER_ID;
const API_KEY = process.env.ALGOLIA_CRAWLER_API_KEY;
const CRAWLER_ID = process.env.ALGOLIA_CRAWLER_ID;

if (CONTEXT !== "production") {
  console.log(`[algolia-reindex] Skipping: CONTEXT=${CONTEXT} (production only).`);
  process.exit(0);
}

if (!USER_ID || !API_KEY || !CRAWLER_ID) {
  console.warn(
    "[algolia-reindex] Skipping: missing ALGOLIA_CRAWLER_USER_ID / " +
      "ALGOLIA_CRAWLER_API_KEY / ALGOLIA_CRAWLER_ID. Set them in Netlify env."
  );
  process.exit(0);
}

const auth = Buffer.from(`${USER_ID}:${API_KEY}`).toString("base64");
const url = `https://crawler.algolia.com/api/1/crawlers/${CRAWLER_ID}/reindex`;

try {
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}` },
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(
      `[algolia-reindex] Failed: ${res.status} ${res.statusText}\n${body}`
    );
    // Don't fail the deploy. Search staleness is not a build blocker.
    process.exit(0);
  }

  console.log("[algolia-reindex] Reindex triggered successfully.");
} catch (err) {
  console.error("[algolia-reindex] Network error:", err.message);
  process.exit(0);
}
