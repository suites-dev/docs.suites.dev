import { useEffect } from 'react';
import { DocSearch } from '@docsearch/react';
import '@docsearch/css';
import {
  ALGOLIA_APP_ID,
  ALGOLIA_API_KEY,
  ALGOLIA_INDEX_NAME,
} from '@/lib/algolia';

/*
 * DocSearch owns shortcuts, modal focus trapping, results and persistence.
 * Its current close handler does not restore focus to the search button.
 */
export default function DocSearchIsland() {
  useEffect(() => {
    let wasOpen = Boolean(document.querySelector('.DocSearch-Modal'));
    const observer = new MutationObserver(() => {
      const isOpen = Boolean(document.querySelector('.DocSearch-Modal'));
      if (wasOpen && !isOpen && document.activeElement === document.body) {
        document.querySelector<HTMLButtonElement>('[data-docsearch-root] .DocSearch-Button')
          ?.focus({ preventScroll: true });
      }
      wasOpen = isOpen;
    });
    // The modal is a direct portal child of body. Result updates stay nested.
    observer.observe(document.body, { childList: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="suites-docsearch" data-docsearch-root>
      <DocSearch
        appId={ALGOLIA_APP_ID}
        apiKey={ALGOLIA_API_KEY}
        indexName={ALGOLIA_INDEX_NAME}
        placeholder="Search documentation"
        insights={true}
        getMissingResultsUrl={({ query }) =>
          `https://github.com/suites-dev/suites/issues/new?title=${encodeURIComponent(
            `Docs search: no results for "${query}"`,
          )}&labels=docs`
        }
        // Cast: a few translation keys (clearButtonTitle, recentConversationsTitle,
        // backToSearchText) exist in newer @docsearch/react runtimes but are
        // not yet present in the installed type definitions. Algolia accepts
        // them at runtime; the cast lets us ship the strings without dropping
        // them on the floor or pinning to stale types.
        translations={{
          button: {
            buttonText: 'Search documentation',
            buttonAriaLabel: 'Search documentation (press / or Cmd K)',
          },
          modal: {
            searchBox: {
              clearButtonTitle: 'Clear',
              clearButtonAriaLabel: 'Clear the query',
              closeButtonText: 'Close',
              closeButtonAriaLabel: 'Close',
              placeholderText: 'Search documentation',
              placeholderTextAskAi: 'Ask AI a question',
              placeholderTextAskAiStreaming: 'Answering',
              searchInputLabel: 'Search',
              backToKeywordSearchButtonText: 'Back to keyword search',
              backToKeywordSearchButtonAriaLabel: 'Back to keyword search',
            },
            startScreen: {
              recentSearchesTitle: 'Recent',
              noRecentSearchesText: 'No recent searches',
              saveRecentSearchButtonTitle: 'Save this search',
              removeRecentSearchButtonTitle: 'Remove this search from history',
              favoriteSearchesTitle: 'Favorites',
              removeFavoriteSearchButtonTitle: 'Remove this search from favorites',
              recentConversationsTitle: 'Recent conversations',
              removeRecentConversationButtonTitle: 'Remove conversation from history',
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
              backToSearchText: 'Back to search',
            },
            noResultsScreen: {
              noResultsText: 'No results for',
              suggestedQueryText: 'Try searching for',
              reportMissingResultsText: 'Believe this query should return results?',
              reportMissingResultsLinkText: 'Let us know.',
            },
          },
        } as any}
      />
    </div>
  );
}
