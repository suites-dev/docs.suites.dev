import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSearchAnalytics } from '../src/lib/searchAnalytics.js';

function setup(t) {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const events = [];
  const tracker = createSearchAnalytics((name, params) => events.push({ name, params }));
  t.after(() => tracker.dispose());
  tracker.open();
  return { tracker, events };
}

test('reports a settled search once and ignores intermediate queries and stale responses', t => {
  const { tracker, events } = setup(t);
  const old = tracker.change('nest');
  tracker.results(old, 20);
  t.mock.timers.tick(400);
  const latest = tracker.change('nestjs');
  tracker.open();
  tracker.results(old, 20);
  tracker.results(latest, 12);
  t.mock.timers.tick(700);
  assert.deepEqual(events.map(e => e.name), ['search_open', 'view_search_results']);
  assert.equal(events[1].params.search_term, 'nestjs');
  assert.equal(events[1].params.result_count, 12);
  tracker.results(latest, 12);
  t.mock.timers.tick(700);
  assert.equal(events.length, 2);
});

test('empty results produce the search event and a separate missing-content signal', t => {
  const { tracker, events } = setup(t);
  const request = tracker.change('missing example');
  tracker.results(request, 0);
  t.mock.timers.tick(700);
  assert.deepEqual(events.map(e => e.name), ['search_open', 'view_search_results', 'search_no_results']);
  assert.equal(events[2].params.result_count, 0);
});

test('selecting before the debounce finishes records the query before the selected document', t => {
  const { tracker, events } = setup(t);
  const request = tracker.change('solitary');
  tracker.results(request, 10);
  tracker.select('https://suites.dev/docs/guides/solitary/?tracking=discard#example');
  tracker.close();
  t.mock.timers.tick(1000);
  assert.deepEqual(events.map(e => e.name), ['search_open', 'view_search_results', 'search_result_click']);
  assert.equal(events[2].params.link_url, 'https://suites.dev/docs/guides/solitary/#example');
});

test('clearing, closing, and reopening do not leak pending searches across sessions', t => {
  const { tracker, events } = setup(t);
  const old = tracker.change('old');
  tracker.results(old, 10);
  tracker.change('');
  tracker.close();
  tracker.open();
  tracker.results(old, 10);
  t.mock.timers.tick(1000);
  assert.deepEqual(events.map(e => e.name), ['search_open', 'search_open']);
  const next = tracker.change('old');
  tracker.results(next, 5);
  t.mock.timers.tick(700);
  assert.equal(events[2].params.result_count, 5);
});

test('unmounting ignores an outstanding search response', t => {
  const { tracker, events } = setup(t);
  const request = tracker.change('nestjs');
  tracker.dispose();
  tracker.results(request, 12);
  t.mock.timers.tick(1000);
  assert.deepEqual(events.map(e => e.name), ['search_open']);
});
