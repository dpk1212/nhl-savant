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
  etDateOf,
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

// Consecutive nights, same 10:11 PM ET clock, are not a doubleheader.
// Wed Sep 23 10:11 PM ET = 2026-09-24T02:11Z. Thu Sep 24 10:11 PM ET = 2026-09-25T02:11Z.
const padres = new Set();
const padresCommence = {};
const thursdayAfternoon = new Date('2026-09-24T17:43:00Z');
assert.equal(etDateOf('2026-09-24T02:11:00Z'), '2026-09-23');
assert.equal(etDateOf('2026-09-25T02:11:00Z'), '2026-09-24');
assert.equal(
  allocateScheduleKey(padres, padresCommence, 'MLB', 'sdp_lad', '2026-09-24T02:11:00Z', thursdayAfternoon),
  'sdp_lad',
);
assert.equal(
  allocateScheduleKey(padres, padresCommence, 'MLB', 'sdp_lad', '2026-09-25T02:11:00Z', thursdayAfternoon),
  'sdp_lad',
);
assert.equal(padres.has('sdp_lad__2'), false);
assert.equal(padresCommence['MLB:sdp_lad'], '2026-09-25T02:11:00Z');

const wednesdayAfternoon = new Date('2026-09-23T17:00:00Z');
const padresWed = new Set();
const padresWedCommence = {};
allocateScheduleKey(padresWed, padresWedCommence, 'MLB', 'sdp_lad', '2026-09-24T02:11:00Z', wednesdayAfternoon);
allocateScheduleKey(padresWed, padresWedCommence, 'MLB', 'sdp_lad', '2026-09-25T02:11:00Z', wednesdayAfternoon);
assert.equal(padresWedCommence['MLB:sdp_lad'], '2026-09-24T02:11:00Z');
assert.equal(padresWed.has('sdp_lad__2'), false);

console.log('testDoubleheaderKey: ok');
