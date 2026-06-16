import React, { useEffect } from 'react';
import { DocSearch } from '@docsearch/react';
import '@docsearch/css';
import {
  ALGOLIA_APP_ID,
  ALGOLIA_API_KEY,
  ALGOLIA_INDEX_NAME,
} from '@/lib/algolia';

/*
 * Algolia DocSearch island.
 *
 * Algolia handles the cmd+k / ctrl+k shortcut binding, the platform-aware hint
 * chip (Mac vs Windows/Linux), modal open/close, focus trap inside the modal,
 * escape-to-close, focus return to the trigger, recent-searches persistence,
 * and arrow-key navigation between hits. We do not re-implement those.
 *
 * Our job is:
 *   1. Scope the modal under a stable wrapper so .DocSearch-* overrides in
 *      components.css cannot leak.
 *   2. Provide a sensible "no results" fallback URL (GitHub issues) so users
 *      have a next step instead of a dead end (ui-ux-pro-max search/no-results).
 *   3. Localize the placeholder + button text so screen readers announce a
 *      useful label.
 *   4. Bind the extra "/" shortcut that the button aria-label advertises, since
 *      Algolia only binds cmd+k / ctrl+k natively. We ignore the keypress when
 *      the user is already typing in an input/textarea/contenteditable element.
 *
 * Hydration cost: this is the only search island in the header, mounted with
 * client:only="react". We deliberately do not import additional runtime deps.
 */
export default function DocSearchIsland() {
  // Bind "/" as a global open shortcut. Algolia's button is rendered inside our
  // wrapper, so we click it to inherit Algolia's own focus + a11y behaviour
  // (which restores focus to the button on close).
  useEffect(() => {
    const isEditable = (el: EventTarget | null): boolean => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
      if (el.isContentEditable) return true;
      return false;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== '/') return;
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isEditable(event.target)) return;
      // If the Algolia modal is already open, do not steal the keystroke.
      if (document.querySelector('.DocSearch-Modal')) return;

      const trigger = document.querySelector<HTMLButtonElement>(
        '.suites-docsearch .DocSearch-Button',
      );
      if (!trigger) return;
      event.preventDefault();
      trigger.click();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="suites-docsearch" data-theme="dark">
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
