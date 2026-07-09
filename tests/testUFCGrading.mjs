/**
 * testUFCGrading.mjs — UFC fight matching + prop guard for graders.
 *
 * Run: node tests/testUFCGrading.mjs
 */
import { findMatchingGame } from '../scripts/gradeSharpActions.js';
import {
  fightersMatch,
  isGradableUFCMainML,
  resolveUFCFighter,
  makeUFCGameKey,
} from '../scripts/lib/ufcFighters.js';

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log(`  ✅ ${name}`); }
  else { fail++; console.error(`  ❌ ${name}`); }
}

check('resolve Holloway', resolveUFCFighter('Max Holloway') === 'maxholloway');
check('resolve McGregor', resolveUFCFighter('Conor McGregor') === 'conormcgregor');
check('fightersMatch equal', fightersMatch('Max Holloway', 'max holloway') === true);
check('fightersMatch unequal', fightersMatch('Max Holloway', 'Conor McGregor') === false);
check('game key order preserved',
  makeUFCGameKey('Max Holloway', 'Conor McGregor') === 'maxholloway_conormcgregor');

check('main ML is gradable',
  isGradableUFCMainML({
    marketType: 'ml',
    title: 'UFC 329: Max Holloway vs. Conor McGregor',
    outcome: 'Max Holloway',
  }) === true);

check('KO prop is NOT gradable',
  isGradableUFCMainML({
    marketType: 'ml',
    title: 'Will Max Holloway win by KO or TKO?',
    outcome: 'Yes',
  }) === false);

check('distance prop is NOT gradable',
  isGradableUFCMainML({
    marketType: 'ml',
    outcome: 'Go the Distance',
  }) === false);

const hollowayWin = {
  dateET: '2026-07-11',
  awayCode: 'maxholloway',
  homeCode: 'conormcgregor',
  awayFighter: 'Max Holloway',
  homeFighter: 'Conor McGregor',
  awayScore: 1,
  homeScore: 0,
};
const flippedEspnOrder = {
  dateET: '2026-07-11',
  awayCode: 'conormcgregor',
  homeCode: 'maxholloway',
  awayFighter: 'Conor McGregor',
  homeFighter: 'Max Holloway',
  awayScore: 0,
  homeScore: 1, // Holloway won; ESPN listed McGregor first
};
const wrongDay = { ...hollowayWin, dateET: '2026-07-10' };

const pos = {
  sport: 'UFC',
  gameKey: 'maxholloway_conormcgregor',
  date: '2026-07-11',
  away: 'Max Holloway',
  home: 'Conor McGregor',
  marketType: 'ml',
  title: 'UFC 329: Max Holloway vs. Conor McGregor',
};

const hit = findMatchingGame(pos, [], [], [], [], [], [hollowayWin], []);
check('direct key match grades Holloway win',
  hit && hit.awayScore === 1 && hit.homeScore === 0);

const flipped = findMatchingGame(pos, [], [], [], [], [], [flippedEspnOrder], []);
check('ESPN fighter-order flip still grades Holloway win',
  flipped && flipped.awayScore === 1 && flipped.homeScore === 0);

check('wrong-day rematch blocked by date guard',
  findMatchingGame(pos, [], [], [], [], [], [wrongDay], []) === null);

check('prop position never matches even with final present',
  findMatchingGame({
    ...pos,
    title: 'Will Max Holloway win by KO or TKO?',
  }, [], [], [], [], [], [hollowayWin], []) === null);

// MLB path still works with extra ufcFinals/wnbaFinals args (no cross-sport bleed)
const mlbPos = {
  sport: 'MLB', gameKey: 'nyy_tbr', date: '2026-07-08',
  away: 'New York Yankees', home: 'Tampa Bay Rays',
};
const mlbFinal = {
  dateET: '2026-07-08', awayCode: 'nyy', homeCode: 'tbr',
  awayTeam: 'New York Yankees', homeTeam: 'Tampa Bay Rays',
  awayScore: 2, homeScore: 3,
};
check('MLB matching unchanged with UFC finals present',
  findMatchingGame(mlbPos, [], [], [mlbFinal], [], [], [hollowayWin], []) === mlbFinal);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
