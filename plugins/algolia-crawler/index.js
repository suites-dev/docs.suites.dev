import { syncCrawlerConfig } from '../../scripts/sync-algolia-config.mjs';
import { reindexCrawler } from '../../scripts/algolia-reindex.mjs';

export function onPreBuild({ constants = {} } = {}) {
  if (constants.IS_LOCAL || process.env.CONTEXT !== 'production') return;
  const required = ['ALGOLIA_CRAWLER_USER_ID', 'ALGOLIA_CRAWLER_API_KEY', 'ALGOLIA_CRAWLER_ID'];
  const missing = required.filter(name => !process.env[name]);
  if (missing.length) throw new Error(`Set production build variables before publishing: ${missing.join(', ')}`);
}

export async function onSuccess({ constants = {} } = {}) {
  if (constants.IS_LOCAL || process.env.CONTEXT !== 'production') return;
  // onSuccess runs after the deploy is live, so the crawler sees this version.
  await syncCrawlerConfig();
  await reindexCrawler();
}
