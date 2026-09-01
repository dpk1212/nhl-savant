/**
 * MLB DH grade guard — 2026-08-29 bos_nyy__2 incident:
 * G1 final must not grade G2 while G2 is still live.
 *
 * Run: node tests/testMlbDhGradeGuard.mjs
 */
import {
  findMatchingGame,
  pickMlbFinalForPick,
} from '../scripts/gradeSharpActions.js';

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log(`  ✅ ${name}`); }
  else { fail++; console.error(`  ❌ ${name}`); }
}

const g1 = {
  dateET: '2026-08-29',
  awayCode: 'bos', homeCode: 'nyy',
  awayTeam: 'Boston Red Sox', homeTeam: 'New York Yankees',
  awayScore: 6, homeScore: 0,
  commenceMs: Date.parse('2026-08-29T17:05:00Z'),
  gameNumber: 1,
};
const g2 = {
  ...g1,
  awayScore: 1, homeScore: 3,
  commenceMs: Date.parse('2026-08-29T23:15:00Z'),
  gameNumber: 2,
};

const g2Pos = {
  sport: 'MLB',
  gameKey: 'bos_nyy__2',
  date: '2026-08-29',
  away: 'Boston Red Sox',
  home: 'New York Yankees',
  commenceTime: Date.parse('2026-08-29T23:16:00Z'),
};
const g1Pos = {
  ...g2Pos,
  gameKey: 'bos_nyy',
  commenceTime: Date.parse('2026-08-29T17:06:00Z'),
};

check('INCIDENT: only G1 final → G2 pick returns null (no premature grade)',
  findMatchingGame(g2Pos, [], [], [g1], []) === null);
check('G1 pick still grades G1 final',
  findMatchingGame(g1Pos, [], [], [g1], []) === g1);
check('Both finals: G2 pick gets G2',
  findMatchingGame(g2Pos, [], [], [g1, g2], []) === g2);
check('Both finals: G1 pick gets G1',
  findMatchingGame(g1Pos, [], [], [g1, g2], []) === g1);
check('pickMlbFinalForPick: __2 + only gameNumber=1 → null',
  pickMlbFinalForPick([g1], { ...g2Pos, commenceTime: null }) === null);
check('Single non-DH final still matches',
  findMatchingGame({
    sport: 'MLB', gameKey: 'tex_mil', date: '2026-08-29',
    away: 'Texas Rangers', home: 'Milwaukee Brewers',
    commenceTime: Date.parse('2026-08-29T23:10:00Z'),
  }, [], [], [{
    dateET: '2026-08-29', awayCode: 'tex', homeCode: 'mil',
    awayTeam: 'Texas Rangers', homeTeam: 'Milwaukee Brewers',
    awayScore: 2, homeScore: 5,
    commenceMs: Date.parse('2026-08-29T23:10:00Z'),
    gameNumber: 1,
  }], [])?.awayScore === 2);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
