#!/usr/bin/env node
/**
 * Pushes config/algolia-config.js up to the Algolia DocSearch crawler so the
 * dashboard config matches what's in the repo. Run manually after editing the
 * crawler config in this repo:
 *
 *   ALGOLIA_CRAWLER_USER_ID=... \
 *   ALGOLIA_CRAWLER_API_KEY=... \
 *   ALGOLIA_CRAWLER_ID=7ecdfe3f-744f-4633-9dd4-bc7c721b383b \
 *     node scripts/sync-algolia-config.mjs
 *
 * Pass --dry-run to print the JSON payload without sending it.
 */

import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const USER_ID = process.env.ALGOLIA_CRAWLER_USER_ID;
const API_KEY = process.env.ALGOLIA_CRAWLER_API_KEY;
const CRAWLER_ID = process.env.ALGOLIA_CRAWLER_ID;
const DRY_RUN = process.argv.includes("--dry-run");

if (!USER_ID || !API_KEY || !CRAWLER_ID) {
  console.error(
    "Missing required env: ALGOLIA_CRAWLER_USER_ID, ALGOLIA_CRAWLER_API_KEY, ALGOLIA_CRAWLER_ID"
  );
  process.exit(1);
}

const configPath = resolve(__dirname, "../config/algolia-config.js");
const local = require(configPath);

// Convert the local config to the Crawler API shape:
//   - top-level appId/apiKey stay
//   - any `recordExtractor` function gets serialized as { __type, source }
// Notes on intentionally omitted fields:
//   - `externalUrlRegex`: rejected by the API as a forbidden field. URL
//     boundaries are enforced via `pathsToMatch` and `discoveryPatterns`.
//   - `appId` / `apiKey`: the local file holds the public *search* key used
//     by the docs frontend, not the *write* key the crawler needs to index.
//     The crawler already has the correct write key configured in the
//     dashboard. Leave it untouched.
const payload = {
  rateLimit: local.rateLimit,
  maxDepth: local.maxDepth,
  startUrls: local.startUrls,
  sitemaps: local.sitemaps,
  discoveryPatterns: local.discoveryPatterns,
  initialIndexSettings: local.initialIndexSettings,
  actions: (local.actions ?? []).map((action) => ({
    ...action,
    recordExtractor:
      typeof action.recordExtractor === "function"
        ? { __type: "function", source: action.recordExtractor.toString() }
        : action.recordExtractor,
  })),
};

if (DRY_RUN) {
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

const auth = Buffer.from(`${USER_ID}:${API_KEY}`).toString("base64");
const url = `https://crawler.algolia.com/api/1/crawlers/${CRAWLER_ID}/config`;

const res = await fetch(url, {
  method: "PATCH",
  headers: {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});

const body = await res.text();

if (!res.ok) {
  console.error(`Failed: ${res.status} ${res.statusText}\n${body}`);
  process.exit(1);
}

console.log("Crawler config synced successfully.");
console.log(body);
