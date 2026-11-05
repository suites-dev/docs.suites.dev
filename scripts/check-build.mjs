import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const origin = 'https://suites.dev';
const errors = [];
const pages = new Map();
let references = 0;
let links = 0;

const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)]
    .map(match => [match[1].toLowerCase(), decode(match[2] ?? match[3])]));
}
async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? files(path.join(directory, entry.name)) : path.join(directory, entry.name)))).flat();
}
const output = await files(dist);
const available = new Set(output.map(file => '/' + path.relative(dist, file).split(path.sep).join('/')));
function asset(url, base, owner) {
  if (!url || url.startsWith('#') || /^(?:data:|blob:)/i.test(url)) return;
  const target = new URL(decode(url), new URL(base, origin));
  if (target.origin !== origin) return;
  references++;
  if (!available.has(decodeURIComponent(target.pathname))) errors.push(`${owner}: missing asset ${target.pathname}`);
}
for (const file of output.filter(file => file.endsWith('.html'))) {
  const relative = '/' + path.relative(dist, file).split(path.sep).join('/');
  const route = relative.endsWith('/index.html') ? relative.slice(0, -10) : relative;
  const html = await readFile(file, 'utf8');
  // Markdown copy payloads and inline scripts are text, not DOM references.
  const markup = html.replace(/<script\b([^>]*)>[\s\S]*?<\/script>/gi, '<script$1></script>');
  const ids = new Set();
  const hrefs = [];
  for (const match of markup.matchAll(/<([a-z][\w:-]*)\b[^>]*>/gi)) {
    const tag = match[1].toLowerCase();
    const attr = attributes(match[0]);
    if (attr.id) {
      if (ids.has(attr.id)) errors.push(`${route}: duplicate id ${attr.id}`);
      ids.add(attr.id);
    }
    if (tag === 'a' && attr.href) hrefs.push(attr.href);
    if (['script', 'img', 'source', 'video', 'audio'].includes(tag)) asset(attr.src, route, route);
    if (tag === 'video') asset(attr.poster, route, route);
    if (tag === 'link' && ['stylesheet', 'preload', 'modulepreload', 'icon', 'apple-touch-icon'].includes(attr.rel)) {
      asset(attr.href, route, route);
    }
    if (['img', 'source'].includes(tag) && attr.srcset && !attr.srcset.startsWith('data:')) {
      for (const source of attr.srcset.split(',')) asset(source.trim().split(/\s+/)[0], route, route);
    }
  }
  const analytics = html.includes('https://www.googletagmanager.com/gtag/js');
  if (analytics !== (process.env.CONTEXT === 'production')) errors.push(`${route}: analytics must run only in production`);
  pages.set(route, { ids, hrefs });
}
for (const file of output.filter(file => file.endsWith('.css'))) {
  const relative = '/' + path.relative(dist, file).split(path.sep).join('/');
  const css = await readFile(file, 'utf8');
  for (const match of css.matchAll(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/g)) asset(match[2], relative, relative);
}
for (const [route, page] of pages) {
  for (const href of page.hrefs) {
    if (/^(?:mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    const target = new URL(href, new URL(route, origin));
    if (target.origin !== origin) continue;
    const pathname = decodeURIComponent(target.pathname);
    if (available.has(pathname) && !pathname.endsWith('.html')) continue;
    const targetRoute = pathname.endsWith('.html') || pathname.endsWith('/') ? pathname : pathname + '/';
    const destination = pages.get(targetRoute);
    links++;
    if (!destination) errors.push(`${route}: missing linked page ${href}`);
    else if (target.hash && !destination.ids.has(decodeURIComponent(target.hash.slice(1)))) {
      errors.push(`${route}: missing linked anchor ${href}`);
    }
  }
}
const legacy = JSON.parse(await readFile(path.join(root, 'src/config/legacy-anchors.json'), 'utf8'));
let aliases = 0;
for (const page of legacy) {
  const route = `/docs/${page.slug}/`;
  for (const { old, target } of page.aliases) {
    aliases++;
    if (!pages.get(route)?.ids.has(old)) errors.push(`${route}: missing legacy fragment #${old}`);
    if (target && !pages.get(route)?.ids.has(target)) errors.push(`${route}: missing legacy destination #${target}`);
  }
}
for (const error of errors) console.error(`Error: ${error}`);
console.log(`${pages.size} pages, ${references} asset references, ${links} internal links, ${aliases} legacy fragments, ${errors.length} errors`);
if (errors.length) process.exitCode = 1;
