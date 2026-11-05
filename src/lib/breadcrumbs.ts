import sidebar from '@/config/sidebar';

const sectionLabels: Record<string, string> = {
  'get-started': 'Get Started',
  guides: 'Guides',
  'api-reference': 'API Reference',
  'migration-guides': 'Migration Guides',
};

export function docsBreadcrumbs(slug: string, title?: string) {
  const segments = slug.split('/').filter(Boolean);
  const href = `/docs/${segments.join('/')}/`;
  const quickStart = sidebar.unit.find(group => group.label === 'Quick Start');
  const current = quickStart?.items.find(item => item.href === href);
  if (quickStart && current) {
    const overview = quickStart.items[0];
    return [
      ...(current === overview ? [] : [{ label: quickStart.label, href: overview.href, isLast: false }]),
      { label: title ?? current.label, href, isLast: true },
    ];
  }
  return segments.map((segment, index) => {
    const text = decodeURIComponent(segment).replace(/[-_]/g, ' ');
    const isLast = index === segments.length - 1;
    return {
      label: isLast && title ? title : sectionLabels[segment] ?? text.charAt(0).toUpperCase() + text.slice(1),
      href: `/docs/${segments.slice(0, index + 1).join('/')}/`,
      isLast,
    };
  });
}
