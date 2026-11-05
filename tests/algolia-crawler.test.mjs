import { afterEach, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { onPreBuild, onSuccess } from '../plugins/algolia-crawler/index.js';

const names = ['CONTEXT', 'ALGOLIA_CRAWLER_USER_ID', 'ALGOLIA_CRAWLER_API_KEY', 'ALGOLIA_CRAWLER_ID'];
let saved;
let originalFetch;
beforeEach(() => {
  saved = Object.fromEntries(names.map(name => [name, process.env[name]]));
  originalFetch = globalThis.fetch;
  process.env.CONTEXT = 'production';
  process.env.ALGOLIA_CRAWLER_USER_ID = 'test-user';
  process.env.ALGOLIA_CRAWLER_API_KEY = 'test-key';
  process.env.ALGOLIA_CRAWLER_ID = 'test-crawler';
});
afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const [name, value] of Object.entries(saved)) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
});

test('production rejects missing crawler credentials before publishing', () => {
  delete process.env.ALGOLIA_CRAWLER_API_KEY;
  assert.throws(onPreBuild, /ALGOLIA_CRAWLER_API_KEY/);
});

test('previews and local builds never modify the search index', async () => {
  globalThis.fetch = () => { throw new Error('Unexpected external request'); };
  for (const context of ['deploy-preview', 'branch-deploy', 'local']) {
    process.env.CONTEXT = context;
    delete process.env.ALGOLIA_CRAWLER_API_KEY;
    onPreBuild();
    await onSuccess();
  }
});

test('local Netlify builds skip production hooks even in production context', async () => {
  globalThis.fetch = () => { throw new Error('Unexpected external request'); };
  delete process.env.ALGOLIA_CRAWLER_API_KEY;
  const event = { constants: { IS_LOCAL: true } };
  onPreBuild(event);
  await onSuccess(event);
});

test('publication syncs Astro selectors before requesting a crawl', async () => {
  const requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push({ url, ...options });
    return { ok: true };
  };
  onPreBuild();
  assert.equal(requests.length, 0);
  await onSuccess();
  assert.deepEqual(requests.map(request => request.method), ['PATCH', 'POST']);
  assert.match(requests[0].url, /test-crawler\/config$/);
  assert.match(requests[1].url, /test-crawler\/reindex$/);
  const payload = JSON.parse(requests[0].body);
  assert.match(payload.actions[0].recordExtractor.source, /sidebar-nav/);
  assert.equal(payload.apiKey, undefined);
  assert.equal(payload.appId, undefined);
  assert.ok(payload.sitemaps.includes('https://suites.dev/sitemap-index.xml'));
});

test('failed configuration sync stops the recrawl', async () => {
  let calls = 0;
  globalThis.fetch = async () => { calls++; return { ok: false, status: 401, statusText: 'Unauthorized' }; };
  await assert.rejects(onSuccess(), /config sync failed: 401/);
  assert.equal(calls, 1);
});

test('failed recrawl is reported instead of silently claiming success', async () => {
  let calls = 0;
  globalThis.fetch = async () => ++calls === 1
    ? { ok: true } : { ok: false, status: 503, statusText: 'Unavailable' };
  await assert.rejects(onSuccess(), /reindex failed: 503/);
});

test('configuration dry run works without private credentials', () => {
  const env = { ...process.env };
  for (const name of names) delete env[name];
  const json = execFileSync(process.execPath, ['scripts/sync-algolia-config.mjs', '--dry-run'], { env, encoding: 'utf8' });
  const config = JSON.parse(json);
  assert.equal(config.actions[0].recordExtractor.__type, 'function');
  assert.equal(config.actions[0].recordProps, undefined);
});
