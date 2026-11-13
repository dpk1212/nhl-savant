import assert from 'node:assert/strict';
import {
  createPacedJsonFetch,
  POSITION_START_GAP_MS,
  MAX_POSITION_PAGES,
  fetchOpenPositionsV2,
  fetchTwoPositionPages,
  mergePositionPages,
  positionFromV2,
  takeSecondPageCount,
  takeThirdPageCount,
} from '../scripts/lib/fetchPositionPages.js';

takeSecondPageCount();

const short = [{ asset: 'a', title: 'one' }, { asset: 'b', title: 'two' }];
const onlyFirst = await fetchTwoPositionPages(async (offset) => {
  assert.equal(offset, 0);
  return short;
});
assert.deepEqual(onlyFirst, short);
assert.equal(takeSecondPageCount(), 0);

const page = Array.from({ length: 500 }, (_, i) => ({ asset: `p${i}`, title: 'x' }));
const extra = [{ asset: 'p499', title: 'dup' }, { asset: 'live', title: 'Hurricanes' }];
const calls = [];
const merged = await fetchTwoPositionPages(async (offset) => {
  calls.push(offset);
  return offset === 0 ? page : extra;
});
assert.deepEqual(calls, [0, 500]);
assert.equal(merged.length, 501);
assert.equal(merged[499].asset, 'p499');
assert.equal(merged[500].asset, 'live');
assert.equal(takeSecondPageCount(), 1);

const kept = await fetchTwoPositionPages(async (offset) => {
  if (offset === 0) return page;
  return null;
});
assert.equal(kept.length, 500);
assert.equal(takeSecondPageCount(), 0);

const failed = await fetchTwoPositionPages(async () => null);
assert.equal(failed, null);

const deduped = mergePositionPages(
  [{ asset: 'a' }, { asset: '' }, { title: 'no-asset' }],
  [{ asset: 'a' }, { asset: 'b' }],
);
assert.equal(deduped.length, 4);
assert.equal(deduped.filter((p) => p.asset === 'a').length, 1);

console.log('fetchTwoPositionPages ok');

const mapped = positionFromV2({
  token_id: '99',
  condition_id: '0xabc',
  title: 'Hurricanes vs. Maple Leafs',
  slug: 'nhl-car-tor-2026-11-02-car',
  event_slug: 'nhl-car-tor-2026-11-02',
  outcome: 'Hurricanes',
  outcome_index: 0,
  current_size: 1200,
  avg_price: 0.46,
  current_price: 0.52,
  unrealized_pnl: 72,
  event_id: '123',
});
assert.equal(mapped.asset, '99');
assert.equal(mapped.eventSlug, 'nhl-car-tor-2026-11-02');
assert.equal(mapped.outcomeIndex, 0);
assert.equal(mapped.size, 1200);
assert.equal(mapped.curPrice, 0.52);
assert.equal(mapped.cashPnl, 72);
assert.equal(positionFromV2({ outcome_index: 999 }).outcomeIndex, null);

const urls = [];
const pageRows = Array.from({ length: 500 }, (_, i) => ({
  token_id: `t${i}`, title: 'x', outcome_index: 0, current_size: 1, avg_price: 0.5, current_price: 0.5,
}));
const v2 = await fetchOpenPositionsV2('0xabc', async (url) => {
  urls.push(url);
  if (urls.length === 1) {
    return { data: pageRows, pagination: { has_more: true, next_cursor: 'cursor/1' } };
  }
  return {
    data: [{ token_id: 't0', title: 'dup' }, { token_id: 'live', title: 'Leafs', outcome_index: 1, current_size: 10, avg_price: 0.4, current_price: 0.6, unrealized_pnl: 2, event_slug: 'nhl-car-tor-2026-11-02' }],
    pagination: { has_more: false, next_cursor: null },
  };
});
assert.equal(urls.length, 2);
assert.match(urls[0], /\/v2\/positions\?/);
assert.match(urls[0], /status=OPEN/);
assert.match(urls[1], /cursor=cursor/);
assert.equal(v2.length, 501);
assert.equal(v2[500].title, 'Leafs');
assert.equal(v2[500].eventSlug, 'nhl-car-tor-2026-11-02');
assert.equal(takeSecondPageCount(), 1);

const empty = await fetchOpenPositionsV2('0xnone', async () => ({ data: [], pagination: { has_more: false, next_cursor: null } }));
assert.deepEqual(empty, []);
const retired = await fetchOpenPositionsV2('0xold', async () => ({ error: 'Data API v1 has been retired' }));
assert.equal(retired, null);
const keptV2 = await fetchOpenPositionsV2('0xkeep', async (url) => (
  url.includes('cursor=')
    ? null
    : { data: pageRows, pagination: { has_more: true, next_cursor: 'c2' } }
));
assert.equal(keptV2.length, 500);
assert.equal(takeSecondPageCount(), 0);
assert.equal(takeThirdPageCount(), 0);

const urls3 = [];
const page2 = Array.from({ length: 500 }, (_, i) => ({
  token_id: `u${i}`, title: 'y', outcome_index: 0, current_size: 1, avg_price: 0.5, current_price: 0.5,
}));
const three = await fetchOpenPositionsV2('0xthree', async () => {
  urls3.push('p');
  if (urls3.length === 1) return { data: pageRows, pagination: { has_more: true, next_cursor: 'c2' } };
  if (urls3.length === 2) return { data: page2, pagination: { has_more: true, next_cursor: 'c3' } };
  return {
    data: [{ token_id: 'tail', title: 'Islanders', outcome_index: 1, current_size: 10, avg_price: 0.4, current_price: 0.5 }],
    pagination: { has_more: true, next_cursor: 'c4' },
  };
});
assert.equal(MAX_POSITION_PAGES, 3);
assert.equal(urls3.length, 3);
assert.equal(three.length, 1001);
assert.equal(three[1000].title, 'Islanders');
assert.equal(takeSecondPageCount(), 1);
assert.equal(takeThirdPageCount(), 1);

const keptThird = await fetchOpenPositionsV2('0xkeep3', async (url) => {
  if (url.includes('cursor=c3')) return null;
  if (url.includes('cursor=c2')) return { data: page2, pagination: { has_more: true, next_cursor: 'c3' } };
  return { data: pageRows, pagination: { has_more: true, next_cursor: 'c2' } };
});
assert.equal(keptThird.length, 1000);
assert.equal(takeSecondPageCount(), 1);
assert.equal(takeThirdPageCount(), 0);

console.log('fetchOpenPositionsV2 ok');

let clock = 1000;
const seenUa = [];
const starts = [];
const paced = createPacedJsonFetch(async (url, init) => {
  seenUa.push(init?.headers?.['User-Agent'] || '');
  starts.push(clock);
  if (starts.length === 1) {
    return { status: 429, ok: false, headers: { get: () => null } };
  }
  return { status: 200, ok: true, headers: { get: () => null }, json: async () => ({ ok: true }) };
}, {
  gapMs: 150,
  retries: 3,
  now: () => clock,
  sleep: async (ms) => { clock += ms; },
});
const first = await paced('https://data-api.polymarket.com/v2/positions?user=a');
assert.deepEqual(first, { ok: true });
assert.equal(starts.length, 2);
assert.ok(starts[1] - starts[0] >= 30000);
assert.match(seenUa[0], /Mozilla/);
assert.equal(POSITION_START_GAP_MS, 80);
console.log('createPacedJsonFetch ok');
