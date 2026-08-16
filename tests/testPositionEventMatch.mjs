/**
 * Same-game eventId churn is a match. Other-day / other-team slugs are not.
 * Usage: node tests/testPositionEventMatch.mjs
 */
import assert from 'node:assert/strict';
import {
  positionMatchesPolyEvent,
  WRONG_GAME_EXIT_REASONS,
} from '../scripts/lib/positionEventMatch.js';

const board = { boardDate: '2026-08-15' };
const poly = { eventId: '999999', polyGameDate: '2026-08-15' };

assert.equal(
  positionMatchesPolyEvent(
    { eventId: '999999', slug: 'mlb-wsh-nym-2026-08-15' },
    poly,
    'wsh_nym',
    board,
  ).reason,
  'eventId',
  'equal eventId still matches',
);

const churn = positionMatchesPolyEvent(
  { eventId: '111111', slug: 'mlb-wsh-nym-2026-08-15' },
  poly,
  'wsh_nym',
  board,
);
assert.equal(churn.ok, true, 'same-game cache churn is a match');
assert.equal(churn.reason, 'same_game_event_churn');
assert.equal(WRONG_GAME_EXIT_REASONS.has(churn.reason), false, 'churn is not an exit reason');

const postponed = positionMatchesPolyEvent(
  { eventId: '111111', slug: 'mlb-stl-cin-2026-05-24' },
  { eventId: '999999', polyGameDate: '2026-08-15' },
  'stl_laa',
  board,
);
assert.equal(postponed.ok, false);
assert.equal(postponed.reason, 'slug_date_vs_board');
assert.equal(WRONG_GAME_EXIT_REASONS.has(postponed.reason), true);

const wrongTeams = positionMatchesPolyEvent(
  { eventId: '111111', slug: 'mlb-stl-cin-2026-08-15' },
  poly,
  'stl_laa',
  board,
);
assert.equal(wrongTeams.ok, false);
assert.equal(wrongTeams.reason, 'slug_teams_mismatch');

assert.equal(
  positionMatchesPolyEvent(
    { eventId: '111111' },
    poly,
    'wsh_nym',
    board,
  ).ok,
  false,
  'ID churn with no slug stays unverified',
);

console.log('testPositionEventMatch: ok');
