import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Audit rendered output, including metadata that is shared across layouts.
const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const site = 'https://suites.dev';
const preview = process.argv.includes('--preview') || ['deploy-preview', 'branch-deploy'].includes(process.env.CONTEXT ?? '');
const errors = [];
const warnings = [];
const indexed = new Set();
const titles = new Map();
const descriptions = new Map();
const imageCache = new Map();
let pages = 0;

const decode = (value = '') => value
  .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

function attributes(tag) {
  const attrs = {};
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    attrs[match[1].toLowerCase()] = decode(match[2] ?? match[3] ?? match[4]);
  }
  return attrs;
}

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => entry.isDirectory()
    ? files(path.join(directory, entry.name)) : [path.join(directory, entry.name)]));
  return nested.flat();
}

function duplicate(map, value, route, label) {
  if (map.has(value)) errors.push(`${route}: ${label} duplicates ${map.get(value)}`);
  else map.set(value, route);
}

async function localFile(url) {
  const parsed = new URL(url, site);
  if (parsed.origin !== site) throw new Error(`unexpected asset origin ${parsed.origin}`);
  const relative = decodeURIComponent(parsed.pathname).replace(/^\//, '');
  const file = path.resolve(dist, relative);
  if (!file.startsWith(`${dist}${path.sep}`)) throw new Error('asset escapes output directory');
  return readFile(file);
}

async function checkImage(url, width, height, type) {
  if (new URL(url).origin !== site) {
    if (!imageCache.has(url)) warnings.push(`social image hosted externally; verify dimensions and availability: ${url}`);
    imageCache.set(url, null);
    return;
  }
  if (!imageCache.has(url)) imageCache.set(url, await localFile(url));
  const bytes = imageCache.get(url);
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    if (type !== 'image/png') throw new Error('PNG social card must declare image/png');
    if (Number(width) !== bytes.readUInt32BE(16) || Number(height) !== bytes.readUInt32BE(20)) {
      throw new Error('social-image dimensions do not match the PNG');
    }
  }
}

const output = await files(dist).catch(() => {
  throw new Error('Build the site before running check:seo.');
});

for (const file of output.filter((file) => file.endsWith('.html'))) {
  pages++;
  const relative = path.relative(dist, file).split(path.sep).join('/');
  const route = relative === 'index.html' ? '/'
    : relative.endsWith('/index.html') ? `/${relative.slice(0, -10)}` : `/${relative}`;
  const expectedUrl = new URL(route, site).href;
  const html = await readFile(file, 'utf8');
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
  const meta = new Map();
  const check = (condition, message) => { if (!condition) errors.push(`${route}: ${message}`); };
  for (const tag of head.matchAll(/<meta\b[^>]*>/gi)) {
    const attr = attributes(tag[0]);
    const key = attr.name ?? attr.property;
    if (!key) continue;
    check(!meta.has(key), `duplicate ${key} tag`);
    meta.set(key, attr.content ?? '');
  }
  const pageTitles = [...head.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
  const title = decode(pageTitles[0]?.[1] ?? '');
  const description = meta.get('description') ?? '';
  check(pageTitles.length === 1 && title.trim(), 'expected one nonempty document title');
  check(description.trim(), 'missing description');
  check(title.split(/\s*\|\s*/).filter((part) => part === 'Suites').length <= 1, 'repeated site name in title');
  check(attributes(html.match(/<html\b[^>]*>/i)?.[0] ?? '').lang === 'en', 'missing English language declaration');
  check((html.match(/<h1\b/gi) ?? []).length === 1, 'expected one H1');

  for (const [key, value] of [
    ['og:title', title], ['twitter:title', title],
    ['og:description', description], ['twitter:description', description],
    ['og:site_name', 'Suites'], ['og:locale', 'en_US'], ['twitter:card', 'summary_large_image'],
  ]) check(meta.get(key) === value, `${key} is missing or inconsistent`);

  const robots = meta.get('robots') ?? '';
  const noIndex = /(?:^|[,\s])noindex(?:$|[,\s])/.test(robots);
  const statusPage = relative === '404.html';
  check(robots && meta.get('googlebot') === robots, 'robots directives are missing or inconsistent');
  if (preview || statusPage) check(noIndex, 'must be noindex');
  if (!preview && route === '/') check(!noIndex, 'production homepage must be indexable');

  const canonicals = [...head.matchAll(/<link\b[^>]*>/gi)].map((match) => attributes(match[0]))
    .filter((link) => link.rel === 'canonical');
  if (statusPage) check(canonicals.length === 0, '404 page must not advertise a canonical');
  else {
    check(canonicals.length === 1 && canonicals[0].href === expectedUrl, 'canonical must be the production URL with a trailing slash');
    check(meta.get('og:url') === expectedUrl, 'og:url differs from the canonical URL');
  }

  const image = meta.get('og:image');
  check(image?.startsWith('https://'), 'social card must have an absolute HTTPS URL');
  check(meta.get('og:image:secure_url') === image && meta.get('twitter:image') === image, 'social-image URLs differ');
  check(meta.get('og:image:alt') && meta.get('twitter:image:alt') === meta.get('og:image:alt'), 'missing or inconsistent social-image alt text');
  if (image) {
    try { await checkImage(image, meta.get('og:image:width'), meta.get('og:image:height'), meta.get('og:image:type')); }
    catch (error) { errors.push(`${route}: ${error.message}`); }
  }
  for (const link of [...head.matchAll(/<link\b[^>]*>/gi)].map((match) => attributes(match[0]))) {
    if (link.href?.startsWith('/') && ['icon', 'shortcut icon', 'apple-touch-icon', 'preload'].includes(link.rel)) {
      try { await localFile(link.href); } catch (error) { errors.push(`${route}: missing head asset ${link.href}`); }
    }
  }

  const schemas = [...head.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter((match) => attributes(match[1]).type === 'application/ld+json');
  if (noIndex) check(schemas.length === 0, 'noindex pages should omit search structured data');
  else {
    indexed.add(expectedUrl);
    duplicate(titles, title, route, 'title');
    duplicate(descriptions, description, route, 'description');
    if (title.length > 70) warnings.push(`${route}: review long title (${title.length} characters)`);
    if (description.length < 70 || description.length > 180) warnings.push(`${route}: review description length (${description.length} characters)`);
    check(schemas.length === 1, 'expected one structured-data graph');
    try {
      const data = JSON.parse(schemas[0]?.[2] ?? 'null');
      check(data?.['@context'] === 'https://schema.org' && Array.isArray(data?.['@graph']), 'invalid structured-data graph');
      const graph = data?.['@graph'] ?? [];
      for (const type of ['Organization', 'WebSite']) check(graph.some((node) => node['@type'] === type), `missing ${type} schema`);
      const isArticle = route.startsWith('/docs/') && route !== '/docs/';
      const type = isArticle ? 'TechArticle' : 'WebPage';
      const page = graph.find((node) => node['@type'] === type);
      check(page?.url === expectedUrl && page?.name === title && page?.description === description, 'page schema differs from metadata');
      check(meta.get('og:type') === (isArticle ? 'article' : 'website'), 'incorrect Open Graph page type');
      if (isArticle) {
        const breadcrumbs = graph.find((node) => node['@type'] === 'BreadcrumbList')?.itemListElement ?? [];
        check(breadcrumbs.length >= 2, 'missing breadcrumb hierarchy');
        check(breadcrumbs.at(-1)?.item === expectedUrl, 'last breadcrumb differs from canonical');
        for (const [index, item] of breadcrumbs.entries()) {
          check(item.position === index + 1 && item.name, 'invalid breadcrumb position or label');
          const target = new URL(item.item);
          check(target.origin === site && target.pathname.endsWith('/'), 'breadcrumb URL must be production and slash-terminated');
          await readFile(path.join(dist, target.pathname, 'index.html'));
        }
      }
    } catch (error) { errors.push(`${route}: structured-data validation failed: ${error.message}`); }
  }
}

const sitemapFiles = output.filter((file) => /sitemap.*\.xml$/.test(file));
const sitemapUrls = new Set();
for (const file of sitemapFiles) {
  const xml = await readFile(file, 'utf8');
  if (!xml.includes('<urlset')) continue;
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) sitemapUrls.add(decode(match[1]));
}
for (const url of indexed) if (!sitemapUrls.has(url)) errors.push(`sitemap: missing indexable URL ${url}`);
for (const url of sitemapUrls) if (!indexed.has(url)) errors.push(`sitemap: unexpected or noindex URL ${url}`);
if (!preview && indexed.size === 0) errors.push('production build has no indexable pages');

const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8');
const advertised = [...robots.matchAll(/^Sitemap:\s*(\S+)/gm)];
if (!advertised.length) errors.push('robots.txt: missing sitemap URL');
for (const [, url] of advertised) {
  try {
    if (!url.startsWith(`${site}/`)) throw new Error('sitemap must use production HTTPS origin');
    if (!preview) await localFile(url);
  } catch (error) { errors.push(`robots.txt: ${error.message}`); }
}
const llms = await readFile(path.join(dist, 'llms.txt'), 'utf8');
for (const match of llms.matchAll(/\]\((https:\/\/suites\.dev\/[^)#]*)[^)]*\)/g)) {
  const url = new URL(match[1]);
  const target = path.join(dist, url.pathname, 'index.html');
  try { await readFile(target); } catch { errors.push(`llms.txt: missing route ${url.pathname}`); }
}

for (const warning of warnings) console.warn(`Review: ${warning}`);
for (const error of errors) console.error(`Error: ${error}`);
console.log(`${pages} pages checked, ${indexed.size} indexable, ${sitemapUrls.size} sitemap URLs, ${errors.length} errors, ${warnings.length} review notes${preview ? ' (preview mode)' : ''}`);
if (errors.length) process.exitCode = 1;
