/**
 * testNFLGrading.mjs — NFL team resolve + date-guarded matching.
 *
 * Run: node tests/testNFLGrading.mjs
 */
import { findMatchingGame } from '../scripts/gradeSharpActions.js';
import {
  resolveNFLTeam,
  makeNFLGameKey,
  isNFLMarketTitle,
  isMainNFLGameSlug,
  nflTeamsMatch,
} from '../scripts/lib/nflTeams.js';

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log(`  ✅ ${name}`); }
  else { fail++; console.error(`  ❌ ${name}`); }
}

check('resolve Panthers', resolveNFLTeam('Carolina Panthers') === 'CAR');
check('resolve Cardinals', resolveNFLTeam('Arizona Cardinals') === 'ARI');
check('resolve Packers', resolveNFLTeam('Green Bay Packers') === 'GB');
check('resolve ESPN GB abbr via name', resolveNFLTeam('Green Bay') === 'GB');
check('game key Panthers@Cardinals', makeNFLGameKey('Carolina Panthers', 'Arizona Cardinals') === 'car_ari');
check('teamsMatch', nflTeamsMatch('Panthers', 'Carolina Panthers') === true);
check('teamsMatch unequal', nflTeamsMatch('Panthers', 'Cardinals') === false);

check('title with nfl cue', isNFLMarketTitle('NFL: Panthers vs. Cardinals') === true);
check('title team pair', isNFLMarketTitle('Carolina Panthers vs. Arizona Cardinals') === true);
check('Will the Panthers win? is NFL (resolvable team)', isNFLMarketTitle('Will the Panthers win?') === true);
check('NBA Knicks title is NOT NFL', isNFLMarketTitle('Will the Knicks win?') === false);
check('NBA Lakers vs Celtics is NOT NFL', isNFLMarketTitle('Lakers vs. Celtics') === false);

check('main slug ok', isMainNFLGameSlug('nfl-car-ari-2026-08-07') === true);
check('super bowl slug rejected', isMainNFLGameSlug('nfl-super-bowl-winner-2026') === false);
check('total prop slug rejected', isMainNFLGameSlug('nfl-car-ari-2026-08-07-total-points') === false);

const nflFinal = {
  dateET: '2026-08-07',
  awayCode: 'car',
  homeCode: 'ari',
  awayTeam: 'Carolina Panthers',
  homeTeam: 'Arizona Cardinals',
  awayScore: 17,
  homeScore: 24,
};
const wrongDay = { ...nflFinal, dateET: '2026-08-06' };
const nbaFinal = {
  dateET: '2026-08-07',
  awayCode: 'lal',
  homeCode: 'bos',
  awayTeam: 'Los Angeles Lakers',
  homeTeam: 'Boston Celtics',
  awayScore: 110,
  homeScore: 105,
};
const wnbaFinal = {
  dateET: '2026-08-07',
  awayCode: 'lva',
  homeCode: 'nyl',
  awayTeam: 'Las Vegas Aces',
  homeTeam: 'New York Liberty',
  awayScore: 88,
  homeScore: 82,
};

const nflPos = {
  sport: 'NFL',
  gameKey: 'car_ari',
  date: '2026-08-07',
  away: 'Carolina Panthers',
  home: 'Arizona Cardinals',
  marketType: 'ml',
};

// findMatchingGame(..., soc, ufc, wnba, nfl)
const hit = findMatchingGame(nflPos, [], [], [], [], [], [], [], [nflFinal]);
check('NFL key match grades Panthers@Cardinals', hit && hit.awayScore === 17 && hit.homeScore === 24);

const flippedPos = { ...nflPos, gameKey: 'ari_car' };
const flippedHit = findMatchingGame(flippedPos, [], [], [], [], [], [], [], [nflFinal]);
check('NFL flipped key still grades with score swap',
  flippedHit && flippedHit.awayScore === 24 && flippedHit.homeScore === 17);

check('NFL wrong-day blocked by date guard',
  findMatchingGame(nflPos, [], [], [], [], [], [], [], [wrongDay]) === null);

check('NFL does not match NBA finals bucket',
  findMatchingGame(nflPos, [], [], [], [nbaFinal], [], [], [], []) === null);

check('NFL does not match WNBA finals bucket',
  findMatchingGame(nflPos, [], [], [], [], [], [], [wnbaFinal], []) === null);

// NBA path unchanged with nflFinals present
const nbaPos = {
  sport: 'NBA', gameKey: 'lal_bos', date: '2026-08-07',
  away: 'Los Angeles Lakers', home: 'Boston Celtics',
};
check('NBA matching unchanged with NFL finals present',
  findMatchingGame(nbaPos, [], [], [], [nbaFinal], [], [], [], [nflFinal]) === nbaFinal);

// MLB path still works with extra nflFinals arg
const mlbPos = {
  sport: 'MLB', gameKey: 'nyy_tbr', date: '2026-08-06',
  away: 'New York Yankees', home: 'Tampa Bay Rays',
};
const mlbFinal = {
  dateET: '2026-08-06', awayCode: 'nyy', homeCode: 'tbr',
  awayTeam: 'New York Yankees', homeTeam: 'Tampa Bay Rays',
  awayScore: 2, homeScore: 3,
};
check('MLB matching unchanged with NFL finals present',
  findMatchingGame(mlbPos, [], [], [mlbFinal], [], [], [], [], [nflFinal]) === mlbFinal);

// WNBA path still works (8th arg is WNBA; NFL is 9th)
const wnbaPos = {
  sport: 'WNBA',
  gameKey: 'lva_nyl',
  date: '2026-08-07',
  away: 'Las Vegas Aces',
  home: 'New York Liberty',
};
check('WNBA matching unchanged with NFL finals present',
  findMatchingGame(wnbaPos, [], [], [], [], [], [], [wnbaFinal], [nflFinal]) === wnbaFinal);

// UFC path still works (7th arg is UFC; NFL is 9th)
const ufcPos = {
  sport: 'UFC',
  gameKey: 'maxholloway_conormcgregor',
  date: '2026-08-07',
  away: 'Max Holloway',
  home: 'Conor McGregor',
  marketType: 'ml',
  title: 'UFC 329: Max Holloway vs. Conor McGregor',
};
const ufcFinal = {
  dateET: '2026-08-07',
  awayCode: 'maxholloway',
  homeCode: 'conormcgregor',
  awayFighter: 'Max Holloway',
  homeFighter: 'Conor McGregor',
  awayScore: 1,
  homeScore: 0,
};
check('UFC matching unchanged with NFL finals present',
  findMatchingGame(ufcPos, [], [], [], [], [], [ufcFinal], [], [nflFinal])?.awayScore === 1);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
