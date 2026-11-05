/** @param {(event: string, params?: Record<string, unknown>) => void} send */
export function createSearchAnalytics(send) {
  let isOpen = false;
  let query = '';
  let version = 0;
  let reported = '';
  /** @type {{ query: string, count: number } | undefined} */
  let pending;
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let timer;

  function cancel() {
    clearTimeout(timer);
    pending = undefined;
  }

  function flush() {
    clearTimeout(timer);
    if (!pending || pending.query === reported) return;
    const params = {
      search_term: pending.query,
      result_count: pending.count,
      search_source: 'docs',
    };
    send('view_search_results', params);
    if (pending.count === 0) send('search_no_results', params);
    reported = pending.query;
    pending = undefined;
  }

  return {
    open() {
      if (isOpen) return;
      cancel();
      isOpen = true;
      query = '';
      reported = '';
      version++;
      send('search_open', { search_source: 'docs' });
    },
    /** @param {string} value */
    change(value) {
      cancel();
      query = value.trim().slice(0, 64);
      return ++version;
    },
    /** @param {number} requestVersion @param {number} count */
    results(requestVersion, count) {
      if (!isOpen || requestVersion !== version || !query) return;
      pending = { query, count };
      // Report the settled query, rather than every intermediate keystroke.
      timer = setTimeout(flush, 700);
    },
    /** @param {string} url */
    select(url) {
      if (!isOpen) return;
      flush();
      const target = new URL(url, 'https://suites.dev');
      send('search_result_click', {
        search_term: query,
        link_url: `${target.origin}${target.pathname}${target.hash}`,
        search_source: 'docs',
      });
    },
    close() {
      flush();
      cancel();
      isOpen = false;
      version++;
    },
    dispose() {
      cancel();
      isOpen = false;
      version++;
    },
  };
}
