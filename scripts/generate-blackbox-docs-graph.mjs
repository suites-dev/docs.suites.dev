import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const docsRoot = path.join(repoRoot, 'src/content/docs');
const blackboxRoot = path.join(docsRoot, 'blackbox');
const sidebarPath = path.join(repoRoot, 'src/config/sidebar.ts');
const outputPath = path.join(repoRoot, '.design-research/blackbox-docs-link-graph.md');
const checkOnly = process.argv.includes('--check');

function walkMarkdownFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkMarkdownFiles(fullPath);
    return /\.mdx?$/.test(entry.name) ? [fullPath] : [];
  });
}

function routeForFile(filePath) {
  const rel = path.relative(docsRoot, filePath).replaceAll(path.sep, '/').replace(/\.mdx?$/, '');
  return `/docs/${rel}`;
}

function stripRouteSuffix(route) {
  return route.replace(/\.mdx?$/, '').replace(/\/$/, '');
}

function titleFor(content, filePath) {
  const match = content.match(/^title:\s*["']?([^"'\n]+)["']?/m);
  if (match) return match[1].trim();
  return path.basename(filePath).replace(/\.mdx?$/, '');
}

function extractBracketBlock(source, marker, startAt = 0) {
  const markerIndex = source.indexOf(marker, startAt);
  if (markerIndex === -1) {
    throw new Error(`Could not find ${marker} in sidebar.ts`);
  }

  const openIndex = source.indexOf('[', markerIndex);
  let depth = 0;
  let quote = null;
  let escaping = false;

  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (escaping) {
        escaping = false;
      } else if (char === '\\') {
        escaping = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }

    if (char === '[') depth += 1;
    if (char === ']') depth -= 1;
    if (depth === 0) return source.slice(openIndex + 1, index);
  }

  throw new Error(`Could not close ${marker} block in sidebar.ts`);
}

function extractPublicSidebar(source) {
  const sidebarStart = source.indexOf('const sidebar');
  if (sidebarStart === -1) {
    throw new Error('Could not find const sidebar in sidebar.ts');
  }

  const blackboxBlock = extractBracketBlock(source, 'blackbox:', sidebarStart);
  const groups = [];
  const publicRoutes = new Map();
  const groupRegex = /\{\s*label:\s*'([^']+)'\s*,\s*items:\s*\[([\s\S]*?)\]\s*,?\s*\}/g;
  const itemRegex = /\{\s*label:\s*'([^']+)'\s*,\s*href:\s*'([^']+)'\s*\}/g;

  for (const groupMatch of blackboxBlock.matchAll(groupRegex)) {
    const [, groupLabel, itemsSource] = groupMatch;
    const items = [];

    for (const itemMatch of itemsSource.matchAll(itemRegex)) {
      const [, label, href] = itemMatch;
      const route = stripRouteSuffix(href);
      if (!route.startsWith('/docs/blackbox/')) continue;
      const item = { label, route };
      items.push(item);
      publicRoutes.set(route, { group: groupLabel, label });
    }

    if (items.length > 0) groups.push({ label: groupLabel, items });
  }

  return { groups, publicRoutes };
}

function normalizeLink(raw, fromFile) {
  if (!raw || /^(https?:|mailto:|#)/.test(raw)) return null;

  let href = raw.split('#')[0].split('?')[0];
  if (!href) return null;

  if (href.startsWith('/docs/blackbox/')) return stripRouteSuffix(href);
  if (href.startsWith('/docs/')) return null;

  if (href.startsWith('./') || href.startsWith('../')) {
    const fromRouteDir = path.posix.dirname(routeForFile(fromFile));
    const resolved = path.posix.normalize(path.posix.join(fromRouteDir, href));
    return resolved.startsWith('/docs/blackbox/') ? stripRouteSuffix(resolved) : null;
  }

  return null;
}

function nodeId(route) {
  return route.replace('/docs/blackbox/', '').replace(/[^A-Za-z0-9]/g, '_');
}

function readDocs() {
  const docs = new Map();

  for (const filePath of walkMarkdownFiles(blackboxRoot).sort()) {
    const content = readFileSync(filePath, 'utf8');
    docs.set(routeForFile(filePath), {
      content,
      filePath,
      links: new Set(),
      route: routeForFile(filePath),
      title: titleFor(content, filePath),
    });
  }

  return docs;
}

function extractLinks(docs, publicRoutes) {
  const markdownLinkRegex = /(?<!!)\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  const hrefRegex = /href=["']([^"']+)["']/g;
  const offSidebarLinks = new Map();

  for (const doc of docs.values()) {
    if (!publicRoutes.has(doc.route)) continue;

    for (const regex of [markdownLinkRegex, hrefRegex]) {
      for (const match of doc.content.matchAll(regex)) {
        const target = normalizeLink(match[1], doc.filePath);
        if (!target || target === doc.route) continue;

        if (publicRoutes.has(target) && docs.has(target)) {
          doc.links.add(target);
        } else if (target.startsWith('/docs/blackbox/')) {
          if (!offSidebarLinks.has(doc.route)) offSidebarLinks.set(doc.route, new Set());
          offSidebarLinks.get(doc.route).add(target);
        }
      }
    }
  }

  return offSidebarLinks;
}

function render({ docs, groups, publicRoutes, offSidebarLinks }) {
  const publicDocs = [...docs.values()].filter((doc) => publicRoutes.has(doc.route));
  const incoming = new Map(publicDocs.map((doc) => [doc.route, 0]));
  let edgeCount = 0;

  for (const doc of publicDocs) {
    for (const target of doc.links) {
      incoming.set(target, incoming.get(target) + 1);
      edgeCount += 1;
    }
  }

  const lines = [];
  lines.push('# Blackbox Docs Link Graph');
  lines.push('');
  lines.push('Generated by `pnpm docs:graph` from the public Blackbox sidebar and internal Markdown/MDX links.');
  lines.push('');
  lines.push('- Source docs: `src/content/docs/blackbox`');
  lines.push('- Public IA source: `src/config/sidebar.ts`');
  lines.push(`- Public pages: ${publicDocs.length}`);
  lines.push(`- Internal public links: ${edgeCount}`);
  lines.push('');
  lines.push('## Graph');
  lines.push('');
  lines.push('```mermaid');
  lines.push('flowchart LR');

  for (const group of groups) {
    lines.push(`  subgraph ${nodeId(group.label)}["${group.label}"]`);
    for (const item of group.items) {
      const doc = docs.get(item.route);
      const label = doc?.title ?? item.label;
      lines.push(`    ${nodeId(item.route)}["${label.replaceAll('"', '\\"')}"]`);
    }
    lines.push('  end');
  }

  for (const doc of publicDocs.sort((a, b) => a.route.localeCompare(b.route))) {
    for (const target of [...doc.links].sort()) {
      lines.push(`  ${nodeId(doc.route)} --> ${nodeId(target)}`);
    }
  }

  lines.push('```');
  lines.push('');
  lines.push('## What The Graph Says');
  lines.push('');
  lines.push('- The graph only includes pages that are present in the public Blackbox sidebar.');
  lines.push('- Overview and Quickstart pages should point readers into concepts, guides, and reference pages when they need depth.');
  lines.push('- Reference and troubleshooting pages may be sinks, but they should usually offer a recovery or next-step link back to a workflow.');
  lines.push('- Pages with no incoming links are reachable from the sidebar, but not from the reading journey. That is a signal to add contextual links or confirm they are pure lookup pages.');
  lines.push('');
  lines.push('## Edges');
  lines.push('');

  for (const doc of publicDocs.sort((a, b) => a.route.localeCompare(b.route))) {
    if (doc.links.size === 0) continue;
    lines.push(`- ${doc.title}`);
    for (const target of [...doc.links].sort()) {
      lines.push(`  - ${docs.get(target).title}`);
    }
  }

  lines.push('');
  lines.push('## No Outgoing Internal Links');
  lines.push('');
  for (const doc of publicDocs.sort((a, b) => a.route.localeCompare(b.route))) {
    if (doc.links.size === 0) lines.push(`- ${doc.title} (${doc.route})`);
  }

  lines.push('');
  lines.push('## No Incoming Internal Links');
  lines.push('');
  for (const doc of publicDocs.sort((a, b) => a.route.localeCompare(b.route))) {
    if (incoming.get(doc.route) === 0) lines.push(`- ${doc.title} (${doc.route})`);
  }

  const missingSidebarDocs = [...publicRoutes.keys()].filter((route) => !docs.has(route)).sort();
  if (missingSidebarDocs.length > 0) {
    lines.push('');
    lines.push('## Sidebar Routes Missing Source Files');
    lines.push('');
    for (const route of missingSidebarDocs) lines.push(`- ${route}`);
  }

  const hiddenDocs = [...docs.values()].filter((doc) => !publicRoutes.has(doc.route)).sort((a, b) => a.route.localeCompare(b.route));
  if (hiddenDocs.length > 0) {
    lines.push('');
    lines.push('## Docs On Disk But Not In Public Sidebar');
    lines.push('');
    for (const doc of hiddenDocs) lines.push(`- ${doc.title} (${doc.route})`);
  }

  if (offSidebarLinks.size > 0) {
    lines.push('');
    lines.push('## Public Pages Linking Outside The Public Sidebar');
    lines.push('');
    for (const [route, targets] of [...offSidebarLinks.entries()].sort(([a], [b]) => a.localeCompare(b))) {
      lines.push(`- ${docs.get(route).title}`);
      for (const target of [...targets].sort()) lines.push(`  - ${target}`);
    }
  }

  lines.push('');
  return lines.join('\n');
}

const sidebarSource = readFileSync(sidebarPath, 'utf8');
const sidebar = extractPublicSidebar(sidebarSource);
const docs = readDocs();
const offSidebarLinks = extractLinks(docs, sidebar.publicRoutes);
const output = render({ docs, groups: sidebar.groups, publicRoutes: sidebar.publicRoutes, offSidebarLinks });

if (checkOnly) {
  const current = existsSync(outputPath) ? readFileSync(outputPath, 'utf8') : '';
  if (current !== output) {
    console.error('Blackbox docs link graph is stale. Run `pnpm docs:graph`.');
    process.exit(1);
  }
  console.log('Blackbox docs link graph is up to date.');
} else {
  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, output);
  console.log(`Wrote ${path.relative(repoRoot, outputPath)}`);
}
