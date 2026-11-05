#!/usr/bin/env node
import { pathToFileURL } from 'node:url';

// The Netlify onSuccess hook calls this after publishing, never during a build.
export async function reindexCrawler() {
  const user = process.env.ALGOLIA_CRAWLER_USER_ID;
  const key = process.env.ALGOLIA_CRAWLER_API_KEY;
  const id = process.env.ALGOLIA_CRAWLER_ID;
  if (!user || !key || !id) throw new Error('Missing Algolia crawler credentials');
  const response = await fetch(`https://crawler.algolia.com/api/1/crawlers/${id}/reindex`, {
    method: 'POST',
    headers: { Authorization: `Basic ${Buffer.from(`${user}:${key}`).toString('base64')}` },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`Crawler reindex failed: ${response.status} ${response.statusText}`);
  console.log('[algolia-reindex] Reindex triggered after publication.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.env.CONTEXT !== 'production') console.log('[algolia-reindex] Skipping outside production.');
  else await reindexCrawler();
}
