import assert from 'node:assert/strict';
import {
  fetchTwoPositionPages,
  mergePositionPages,
  takeSecondPageCount,
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
