/**
 * Same-day MLB DH must not share away_home — Game 2 money would paint Game 1.
 * Usage: node tests/testDoubleheaderKey.mjs
 */
import assert from 'node:assert/strict';
import {
  dhSecondKey,
  baseGameKey,
  allocateScheduleKey,
  pickScheduleKeyByStart,
  resolveDoubleheaderMatch,
} from '../scripts/lib/doubleheaderKey.js';

const valid = new Set();
const commence = {};
assert.equal(
  allocateScheduleKey(valid, commence, 'MLB', 'stl_cin', '2026-08-17T17:41:00Z'),
  'stl_cin',
);
assert.equal(
  allocateScheduleKey(valid, commence, 'MLB', 'stl_cin', '2026-08-17T22:40:00Z'),
  'stl_cin__2',
);
assert.equal(
  allocateScheduleKey(valid, commence, 'MLB', 'nyy_bos', '2026-08-17T23:10:00Z'),
  'nyy_bos',
);
assert.deepEqual([...valid], ['stl_cin', 'stl_cin__2', 'nyy_bos']);
assert.equal(commence['MLB:stl_cin'], '2026-08-17T17:41:00Z');
assert.equal(commence['MLB:stl_cin__2'], '2026-08-17T22:40:00Z');

assert.equal(
  pickScheduleKeyByStart('MLB', 'stl_cin', '2026-08-17T17:45:00Z', commence, valid),
  'stl_cin',
);
assert.equal(
  pickScheduleKeyByStart('MLB', 'stl_cin', '2026-08-17T22:38:00Z', commence, valid),
  'stl_cin__2',
);

const polyData = {
  MLB: {
    stl_cin: { eventId: '498285', commence: '2026-08-17T17:41:00Z', polyGameTime: '2026-08-17T17:41:00Z' },
    stl_cin__2: { eventId: '833246', commence: '2026-08-17T22:40:00Z', polyGameTime: '2026-08-17T22:40:00Z' },
  },
};

const titleHit = { sport: 'MLB', key: 'stl_cin', side: 'away' };
const night = resolveDoubleheaderMatch(titleHit, { eventId: '833246' }, polyData);
assert.equal(night.key, 'stl_cin__2', 'Game 2 eventId must leave the 1:41 card');
assert.equal(
  resolveDoubleheaderMatch(titleHit, { eventId: '498285' }, polyData).key,
  'stl_cin',
);

const byStart = resolveDoubleheaderMatch(
  titleHit,
  { startTime: '2026-08-17T22:40:00Z' },
  polyData,
);
assert.equal(byStart.key, 'stl_cin__2', 'no eventId: closer startTime still splits');

assert.equal(baseGameKey('stl_cin__2'), 'stl_cin');
assert.equal(dhSecondKey('stl_cin'), 'stl_cin__2');

console.log('testDoubleheaderKey: ok');
