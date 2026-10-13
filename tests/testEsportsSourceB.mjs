/**
 * Source B round-trip for a CS2 and a LoL match moneyline.
 * BO3 lists teams in the opposite order from Polymarket; the grader flips.
 */
import assert from 'node:assert/strict';
import {
  extractEsportsTeamsFromTitle,
  makeEsportsGameKey,
  matchEsportsPositionTitle,
} from '../scripts/lib/esportsTeams.js';
import { resolveBinarySide } from '../scripts/lib/resolvePositionSide.js';
import { acceptFullGameSidePosition } from '../scripts/lib/totalMarketFilter.js';
import { positionMatchesPolyEvent } from '../scripts/lib/positionEventMatch.js';
import { findMatchingGame, calculateOutcome } from '../scripts/gradeSharpActions.js';

function roundTrip({ sport, title, slug, winnerOutcome, bo3First, bo3Second, bo3Winner }) {
  const extracted = extractEsportsTeamsFromTitle(title);
  const [away, home] = extracted.teams;
  const gameKey = makeEsportsGameKey(away, home);
  const polyGame = {
    awayTeam: away,
    homeTeam: home,
    eventId: '42',
    eventSlug: slug,
    polyMl: { conditionId: '0xml', slug },
  };
  const todays = {
    [`${sport}:${gameKey}`]: { away, home, eventSlug: slug },
  };
  const pos = {
    title, slug, eventId: '42', outcome: winnerOutcome, outcomeIndex: 0, conditionId: '0xml',
  };
  const match = matchEsportsPositionTitle(title, todays, slug);
  assert.equal(match?.sport, sport);
  assert.equal(match?.key, gameKey);
  const sided = resolveBinarySide({
    outcome: winnerOutcome,
    outcomeIndex: away === winnerOutcome ? 0 : 1,
    awayName: away,
    homeName: home,
    marketOutcomes: [away, home],
  });
  assert.equal(sided.side, away === winnerOutcome ? 'away' : 'home');
  const gate = positionMatchesPolyEvent(pos, polyGame, gameKey, { boardDate: '2026-10-13', sport });
  assert.equal(gate.ok, true, gate.reason);
  const board = acceptFullGameSidePosition({
    title, slug, conditionId: '0xml', fgConditionId: '0xml', marketType: 'ML', sport,
  });
  assert.equal(board.ok, true, board.reason);
  const child = acceptFullGameSidePosition({
    title, slug: `${slug}-game1`, conditionId: '0xmap', fgConditionId: '0xml', marketType: 'ML', sport,
  });
  assert.equal(child.ok, false);
  assert.equal(matchEsportsPositionTitle(title, todays, `${slug}-game1`), null);

  const firstWins = bo3Winner === bo3First;
  const finals = [{
    dateET: '2026-10-13',
    awayCode: bo3First.toLowerCase().replace(/[^a-z0-9]/g, ''),
    homeCode: bo3Second.toLowerCase().replace(/[^a-z0-9]/g, ''),
    awayTeam: bo3First,
    homeTeam: bo3Second,
    awayScore: firstWins ? 1 : 0,
    homeScore: firstWins ? 0 : 1,
  }];
  const doc = {
    sport, date: '2026-10-13', gameKey, away, home, marketType: 'ML', slug, title,
  };
  const graded = findMatchingGame(
    doc, [], [], [], [], [], [], [], [], [], [],
    sport === 'CS2' ? finals : [],
    sport === 'LOL' ? finals : [],
  );
  assert.ok(graded, sport);
  const winnerSide = sided.side;
  const loserSide = winnerSide === 'away' ? 'home' : 'away';
  assert.equal(calculateOutcome(graded, 'ML', winnerSide, null, sport), 'WIN');
  assert.equal(calculateOutcome(graded, 'ML', loserSide, null, sport), 'LOSS');
  const wrongDay = findMatchingGame(
    { ...doc, date: '2026-10-12' }, [], [], [], [], [], [], [], [], [], [],
    sport === 'CS2' ? finals : [],
    sport === 'LOL' ? finals : [],
  );
  assert.equal(wrongDay, null);
}

roundTrip({
  sport: 'LOL',
  title: 'LoL: Team WE vs FlyQuest (BO5) - Demacia Cup Global Invitational Playoffs',
  slug: 'lol-we-fly-2026-10-13',
  winnerOutcome: 'Team WE',
  bo3First: 'Team WE',
  bo3Second: 'FlyQuest',
  bo3Winner: 'Team WE',
});

roundTrip({
  sport: 'LOL',
  title: 'LoL: HANJIN BRION vs LGD Gaming (BO5) - Demacia Cup Global Invitational Playoffs',
  slug: 'lol-bro2-lgd-2026-10-13',
  winnerOutcome: 'HANJIN BRION',
  bo3First: 'Hanjin BRION',
  bo3Second: 'LGD Gaming',
  bo3Winner: 'Hanjin BRION',
});

roundTrip({
  sport: 'CS2',
  title: 'Counter-Strike: aimers vs PARTIZAN (BO1) - ESEA Advanced Europe Regular Season',
  slug: 'cs2-aimers-prtzn-2026-10-13',
  winnerOutcome: 'PARTIZAN',
  bo3First: 'aimers',
  bo3Second: 'PARTIZAN',
  bo3Winner: 'PARTIZAN',
});

console.log('testEsportsSourceB ok');
