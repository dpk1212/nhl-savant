import assert from 'node:assert/strict';
import { calculateOutcome } from '../scripts/gradeSharpActions.js';
import {
  matchFromPolyMarket,
  orientMatch,
  parseJsonField,
} from '../scripts/_grade_finished_atp.mjs';

assert.deepEqual(parseJsonField('["0","1"]'), ['0', '1']);
assert.deepEqual(parseJsonField(['Jan-Lennard Struff', 'Casper Ruud']), [
  'Jan-Lennard Struff',
  'Casper Ruud',
]);

const poly = matchFromPolyMarket({
  closed: true,
  umaResolutionStatus: 'resolved',
  outcomes: '["Jan-Lennard Struff","Casper Ruud"]',
  outcomePrices: '["0","1"]',
}, { slug: 'atp-struff-ruud-2026-11-05' });
assert.equal(poly.awayTeam, 'Jan-Lennard Struff');
assert.equal(poly.homeTeam, 'Casper Ruud');
assert.equal(poly.awayScore, 0);
assert.equal(poly.homeScore, 1);

const pos = {
  gameKey: 'janlennardstruff_casperruud',
  date: '2026-11-05',
  away: 'Jan-Lennard Struff',
  home: 'Casper Ruud',
};

const espnFlipped = [{
  source: 'ESPN_ATP_API',
  dateET: '2026-11-05',
  awayCode: 'casperruud',
  homeCode: 'janlennardstruff',
  awayTeam: 'Casper Ruud',
  homeTeam: 'Jan-Lennard Struff',
  awayScore: 1,
  homeScore: 0,
}];
const oriented = orientMatch(pos, espnFlipped, { requireDate: true });
assert.equal(oriented.awayScore, 0);
assert.equal(oriented.homeScore, 1);
assert.equal(calculateOutcome(oriented, 'ML', 'home', null, 'ATP'), 'WIN');
assert.equal(calculateOutcome(oriented, 'ML', 'away', null, 'ATP'), 'LOSS');

const hijikata = orientMatch({
  gameKey: 'rinkyhijikata_tomasetcheverry',
  date: '2026-11-05',
  away: 'Rinky Hijikata',
  home: 'Tomas Etcheverry',
}, [{
  dateET: '2026-11-05',
  awayCode: 'tomasmartinetcheverry',
  homeCode: 'rinkyhijikata',
  awayTeam: 'Tomas Martin Etcheverry',
  homeTeam: 'Rinky Hijikata',
  awayScore: 0,
  homeScore: 1,
}], { requireDate: true });
assert.equal(hijikata.awayScore, 1);
assert.equal(hijikata.homeScore, 0);
assert.equal(calculateOutcome(hijikata, 'ML', 'away', null, 'ATP'), 'WIN');

const walkover = orientMatch({
  gameKey: 'carlosalcaraz_matteoberrettini',
  date: '2026-11-05',
  away: 'Carlos Alcaraz',
  home: 'Matteo Berrettini',
}, [{
  dateET: '2026-11-05',
  awayCode: 'carlosalcaraz',
  homeCode: 'matteoberrettini',
  awayTeam: 'Carlos Alcaraz',
  homeTeam: 'Matteo Berrettini',
  awayScore: 1,
  homeScore: 0,
  statusName: 'STATUS_WALKOVER',
}], { requireDate: true });
assert.equal(calculateOutcome(walkover, 'ML', 'away', null, 'ATP'), 'WIN');

assert.equal(matchFromPolyMarket({
  closed: false,
  outcomes: '["A","B"]',
  outcomePrices: '["0.52","0.48"]',
}), null);

console.log('testGradeFinishedAtp ok');
