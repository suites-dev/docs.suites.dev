import pages from '@/config/legacy-anchors.json';

// Retain externally shared fragments without adding obsolete headings to the TOC.
export function addLegacyAnchors(slug: string, html: string): string {
  const aliases = pages.find(page => page.slug === slug.replace(/\/$/, ''))?.aliases ?? [];
  const groups = new Map<string, string[]>();
  for (const { old, target } of aliases) {
    if (html.includes(`id="${old}"`)) continue;
    groups.set(target, [...(groups.get(target) ?? []), old]);
  }
  let result = html;
  for (const [target, ids] of groups) {
    const anchors = ids.map(id => `<span id="${id}" class="legacy-anchor" aria-hidden="true"></span>`).join('');
    if (!target) {
      result = anchors + result;
      continue;
    }
    const heading = [...result.matchAll(/<h[1-6]\b[^>]*\bid="([^"]+)"[^>]*>/g)]
      .find(match => match[1] === target);
    if (!heading || heading.index === undefined) throw new Error(`Missing legacy anchor target: ${slug}#${target}`);
    result = result.slice(0, heading.index) + anchors + result.slice(heading.index);
  }
  return result;
}
