import { useEffect, useMemo, type ComponentProps } from 'react';
import { DocSearch } from '@docsearch/react';
import '@docsearch/css';
import {
  ALGOLIA_APP_ID,
  ALGOLIA_API_KEY,
  ALGOLIA_INDEX_NAME,
} from '@/lib/algolia';
import { createSearchAnalytics } from '@/lib/searchAnalytics';
import { trackEvent } from '@/utils/analytics';

type SearchProps = ComponentProps<typeof DocSearch>;

/*
 * DocSearch owns shortcuts, modal focus trapping, results and persistence.
 * Its current close handler does not restore focus to the search button.
 */
export default function DocSearchIsland() {
  const analytics = useMemo(() => createSearchAnalytics(trackEvent), []);
  const transformSearchClient = useMemo<SearchProps['transformSearchClient']>(() => client => ({
    ...client,
    search: async (...args) => {
      analytics.open();
      const requests = Array.isArray(args[0]) ? args[0] : args[0].requests;
      const first = requests[0];
      const params = first && 'params' in first ? first.params : undefined;
      const query = typeof params === 'string'
        ? new URLSearchParams(params).get('query') ?? ''
        : params?.query ?? (first && 'query' in first ? first.query : '') ?? '';
      const requestVersion = analytics.change(query);
      const response = await client.search(...args);
      const result = response.results[0];
      if (result && 'nbHits' in result && typeof result.nbHits === 'number') {
        analytics.results(requestVersion, result.nbHits);
      }
      return response;
    },
  }), [analytics]);
  const hitComponent = useMemo<SearchProps['hitComponent']>(() => ({ hit, children }) => (
    <a href={hit.url} onClick={() => analytics.select(hit.url)}>{children}</a>
  ), [analytics]);
  const navigator = useMemo<SearchProps['navigator']>(() => ({
    navigate({ itemUrl }) {
      analytics.select(itemUrl);
      window.location.assign(itemUrl);
    },
    navigateNewTab({ itemUrl }) {
      analytics.select(itemUrl);
      window.open(itemUrl, '_blank', 'noopener,noreferrer');
    },
    navigateNewWindow({ itemUrl }) {
      analytics.select(itemUrl);
      window.open(itemUrl, '_blank', 'noopener,noreferrer');
    },
  }), [analytics]);

  useEffect(() => {
    let wasOpen = Boolean(document.querySelector('.DocSearch-Modal'));
    if (wasOpen) analytics.open();
    const observer = new MutationObserver(() => {
      const isOpen = Boolean(document.querySelector('.DocSearch-Modal'));
      if (!wasOpen && isOpen) analytics.open();
      if (wasOpen && !isOpen) analytics.close();
      if (wasOpen && !isOpen && document.activeElement === document.body) {
        document.querySelector<HTMLButtonElement>('[data-docsearch-root] .DocSearch-Button')
          ?.focus({ preventScroll: true });
      }
      wasOpen = isOpen;
    });
    // The modal is a direct portal child of body. Result updates stay nested.
    observer.observe(document.body, { childList: true });
    const onInput = (event: Event) => {
      if (event.target instanceof HTMLInputElement && event.target.matches('.DocSearch-Input')) {
        analytics.change(event.target.value);
      }
    };
    const onReset = (event: Event) => {
      if (event.target instanceof HTMLFormElement && event.target.matches('.DocSearch-Form')) {
        analytics.change('');
      }
    };
    document.addEventListener('input', onInput, true);
    document.addEventListener('reset', onReset, true);
    return () => {
      observer.disconnect();
      document.removeEventListener('input', onInput, true);
      document.removeEventListener('reset', onReset, true);
      analytics.dispose();
    };
  }, [analytics]);

  return (
    <div className="suites-docsearch" data-docsearch-root>
      <DocSearch
        appId={ALGOLIA_APP_ID}
        apiKey={ALGOLIA_API_KEY}
        indexName={ALGOLIA_INDEX_NAME}
        placeholder="Search documentation"
        insights={true}
        transformSearchClient={transformSearchClient}
        hitComponent={hitComponent}
        navigator={navigator}
        getMissingResultsUrl={({ query }) =>
          `https://github.com/suites-dev/suites/issues/new?title=${encodeURIComponent(
            `Docs search: no results for "${query}"`,
          )}&labels=docs`
        }
        translations={{
          button: {
            buttonText: 'Search documentation',
            buttonAriaLabel: 'Search documentation (press / or Cmd K)',
          },
          modal: {
            searchBox: {
              resetButtonTitle: 'Clear the query',
              resetButtonAriaLabel: 'Clear the query',
              cancelButtonText: 'Close',
              cancelButtonAriaLabel: 'Close search',
              searchInputLabel: 'Search Suites documentation',
            },
            startScreen: {
              recentSearchesTitle: 'Recent',
              noRecentSearchesText: 'Find a guide, framework, or API.',
              saveRecentSearchButtonTitle: 'Save this search',
              removeRecentSearchButtonTitle: 'Remove this search from history',
              favoriteSearchesTitle: 'Favorites',
              removeFavoriteSearchButtonTitle: 'Remove this search from favorites',
            },
            errorScreen: {
              titleText: 'Unable to fetch results',
              helpText: 'You might want to check your network connection.',
            },
            footer: {
              selectText: 'to select',
              selectKeyAriaLabel: 'Enter key',
              navigateText: 'to navigate',
              navigateUpKeyAriaLabel: 'Arrow up',
              navigateDownKeyAriaLabel: 'Arrow down',
              closeText: 'to close',
              closeKeyAriaLabel: 'Escape key',
            },
            noResultsScreen: {
              noResultsText: 'No results for',
              suggestedQueryText: 'Try searching for',
              reportMissingResultsText: 'Try a different term, or',
              reportMissingResultsLinkText: 'suggest missing documentation.',
            },
          },
        }}
      />
    </div>
  );
}
