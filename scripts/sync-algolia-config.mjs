#!/usr/bin/env node
/**
 * Pushes config/algolia-config.mjs up to the Algolia DocSearch crawler so the
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

import local from '../config/algolia-config.mjs';
import { pathToFileURL } from 'node:url';

const DRY_RUN = process.argv.includes("--dry-run");

// Convert the local config to the Crawler API shape:
//   - crawler-owned appId/apiKey are omitted to preserve its write credentials
//   - any `recordExtractor` function gets serialized as { __type, source }
// Notes on intentionally omitted fields:
//   - `externalUrlRegex`: rejected by the API as a forbidden field. URL
//     boundaries are enforced via `pathsToMatch` and `discoveryPatterns`.
//   - `appId` / `apiKey`: the local file holds the public *search* key used
//     by the docs frontend, not the *write* key the crawler needs to index.
//     The crawler already has the correct write key configured in the
//     dashboard. Leave it untouched.
export const payload = {
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

export async function syncCrawlerConfig() {
  const USER_ID = process.env.ALGOLIA_CRAWLER_USER_ID;
  const API_KEY = process.env.ALGOLIA_CRAWLER_API_KEY;
  const CRAWLER_ID = process.env.ALGOLIA_CRAWLER_ID;
  if (!USER_ID || !API_KEY || !CRAWLER_ID) throw new Error('Missing Algolia crawler credentials');
  const auth = Buffer.from(`${USER_ID}:${API_KEY}`).toString('base64');
  const url = `https://crawler.algolia.com/api/1/crawlers/${CRAWLER_ID}/config`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`Crawler config sync failed: ${res.status} ${res.statusText}`);
  console.log('Crawler config synced successfully.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (DRY_RUN) console.log(JSON.stringify(payload, null, 2));
  else await syncCrawlerConfig();
}
