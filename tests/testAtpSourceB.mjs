/**
 * Source B round-trip: a Polymarket ATP moneyline position is matched,
 * sided, accepted onto the ML board, and graded from an ESPN singles final.
 */
import assert from 'node:assert/strict';
import {
  extractATPPlayersFromTitle,
  makeATPGameKey,
  matchATPPositionTitle,
} from '../scripts/lib/atpPlayers.js';
import { resolveBinarySide } from '../scripts/lib/resolvePositionSide.js';
import { acceptFullGameSidePosition } from '../scripts/lib/totalMarketFilter.js';
import { positionMatchesPolyEvent } from '../scripts/lib/positionEventMatch.js';
import { findMatchingGame, calculateOutcome } from '../scripts/gradeSharpActions.js';

const title = 'Shanghai: Nikoloz Basilashvili vs Andre Ilagan';
const slug = 'atp-basilashvili-ilagan-2026-10-13';
const away = 'Nikoloz Basilashvili';
const home = 'Andre Ilagan';
const gameKey = makeATPGameKey(away, home);

const polyGame = {
  awayTeam: away,
  homeTeam: home,
  eventId: '999',
  eventSlug: slug,
  polyGameDate: '2026-10-13',
  polyMl: { conditionId: '0xabc', slug },
};
const todays = {
  [`ATP:${gameKey}`]: { away, home, eventSlug: slug, commence: '2026-10-13T04:00:00Z' },
};

const pos = {
  title,
  slug,
  eventId: '999',
  outcome: home,
  outcomeIndex: 1,
  conditionId: '0xabc',
  curPrice: '0.62',
};

const match = matchATPPositionTitle(pos.title, todays, pos.slug);
assert.equal(match?.sport, 'ATP');
assert.equal(match?.key, gameKey);

const sided = resolveBinarySide({
  outcome: pos.outcome,
  outcomeIndex: pos.outcomeIndex,
  awayName: away,
  homeName: home,
  marketOutcomes: [away, home],
});
assert.deepEqual(sided, { side: 'home', source: 'outcomeIndex' });

const eventGate = positionMatchesPolyEvent(pos, polyGame, gameKey, {
  boardDate: '2026-10-13',
  sport: 'ATP',
});
assert.equal(eventGate.ok, true, eventGate.reason);

const board = acceptFullGameSidePosition({
  title: pos.title,
  slug: pos.slug,
  conditionId: pos.conditionId,
  fgConditionId: polyGame.polyMl.conditionId,
  marketType: 'ML',
  sport: 'ATP',
});
assert.equal(board.ok, true, board.reason);

const setPos = acceptFullGameSidePosition({
  title: 'Set 1 Winner: Nikoloz Basilashvili vs Andre Ilagan',
  slug: `${slug}-first-set-winner`,
  conditionId: '0xset',
  fgConditionId: '0xabc',
  marketType: 'ML',
  sport: 'ATP',
});
assert.equal(setPos.ok, false);
assert.equal(matchATPPositionTitle(title, todays, `${slug}-first-set-winner`), null);

const sourceB = {
  sport: 'ATP',
  date: '2026-10-13',
  gameKey,
  away,
  home,
  marketType: 'ML',
  side: 'home',
  slug,
  title,
};

const finals = [{
  dateET: '2026-10-13',
  awayCode: 'nikolozbasilashvili',
  homeCode: 'andreilagan',
  awayTeam: away,
  homeTeam: home,
  awayScore: 0,
  homeScore: 1,
}];
const graded = findMatchingGame(sourceB, [], [], [], [], [], [], [], [], [], finals);
assert.ok(graded);
assert.equal(calculateOutcome(graded, 'ML', 'home', null, 'ATP'), 'WIN');
assert.equal(calculateOutcome(graded, 'ML', 'away', null, 'ATP'), 'LOSS');

const spread = findMatchingGame({ ...sourceB, marketType: 'SPREAD' }, [], [], [], [], [], [], [], [], [], finals);
assert.equal(spread, null);

console.log('testAtpSourceB ok', gameKey);
