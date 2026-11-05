export default {
  appId: 'OR8PNMV0IL',
  apiKey: '28a25b54e18eb96f17089adf1f3ed295',
  indexName: 'suites',
  rateLimit: 8,
  maxDepth: 10,
  startUrls: ['https://suites.dev', 'https://suites.dev/docs'],
  sitemaps: ['https://suites.dev/sitemap-index.xml'],
  discoveryPatterns: ['https://suites.dev/docs/**'],
  externalUrlRegex: 'suites\\.dev',
  actions: [
    {
      indexName: 'suites',
      pathsToMatch: ['https://suites.dev/docs/**'],
      recordExtractor: ({ $, helpers }) => {
        // Navigation is excluded from article records. Keep the current sidebar
        // section as the top-level search category before removing page chrome.
        const active = $('.sidebar-nav a[aria-current="page"]').first();
        const lvl0 = active.closest('.sidebar-group').find('summary span').first().text().trim()
          || active.text().trim() || 'Documentation';
        if (!$('article.article').length) return [];
        $('.breadcrumb, .doc-pager, .doc-edit-link, .legacy-anchor').remove();

        return helpers.docsearch({
          recordProps: {
            lvl0: {
              selectors: '',
              defaultValue: lvl0,
            },
            lvl1: 'article h1',
            lvl2: 'article h2',
            lvl3: 'article h3',
            lvl4: 'article h4',
            lvl5: 'article h5, article td:first-child',
            lvl6: 'article h6',
            content: 'article p, article li, article td:last-child',
          },
          indexHeadings: true,
          aggregateContent: true,
          recordVersion: 'v3',
        });
      },
    },
  ],
  initialIndexSettings: {
    suites: {
      attributesForFaceting: [
        'type',
        'lang',
        'language',
        'version',
        'docusaurus_tag',
      ],
      attributesToRetrieve: [
        'hierarchy.lvl0',
        'hierarchy.lvl1',
        'hierarchy.lvl2',
        'hierarchy.lvl3',
        'hierarchy.lvl4',
        'hierarchy.lvl5',
        'hierarchy.lvl6',
        'hierarchy',
        'content',
        'anchor',
        'url',
        'url_without_anchor',
        'type',
      ],
      attributesToHighlight: ['hierarchy', 'content'],
      attributesToSnippet: ['content:10'],
      camelCaseAttributes: ['hierarchy', 'content'],
      searchableAttributes: [
        'unordered(hierarchy.lvl0)',
        'unordered(hierarchy.lvl1)',
        'unordered(hierarchy.lvl2)',
        'unordered(hierarchy.lvl3)',
        'unordered(hierarchy.lvl4)',
        'unordered(hierarchy.lvl5)',
        'unordered(hierarchy.lvl6)',
        'content',
      ],
      distinct: true,
      attributeForDistinct: 'pathname',
      customRanking: [
        'desc(weight.pageRank)',
        'desc(weight.level)',
        'asc(weight.position)',
      ],
      ranking: [
        'words',
        'filters',
        'typo',
        'attribute',
        'proximity',
        'exact',
        'custom',
      ],
      highlightPreTag: '<span class="algolia-docsearch-suggestion--highlight">',
      highlightPostTag: '</span>',
      minWordSizefor1Typo: 3,
      minWordSizefor2Typos: 7,
      allowTyposOnNumericTokens: false,
      minProximity: 1,
      ignorePlurals: true,
      advancedSyntax: true,
      attributeCriteriaComputedByMinProximity: true,
      removeWordsIfNoResults: 'allOptional',
      separatorsToIndex: '_',
    },
  },
};