/**
 * testWNBAGrading.mjs — WNBA team resolve + date-guarded matching.
 *
 * Run: node tests/testWNBAGrading.mjs
 */
import { findMatchingGame } from '../scripts/gradeSharpActions.js';
import {
  resolveWNBATeam,
  makeWNBAGameKey,
  isWNBAMarketTitle,
  isMainWNBAGameSlug,
  wnbaTeamsMatch,
} from '../scripts/lib/wnbaTeams.js';

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log(`  ✅ ${name}`); }
  else { fail++; console.error(`  ❌ ${name}`); }
}

check('resolve Aces', resolveWNBATeam('Las Vegas Aces') === 'LVA');
check('resolve Liberty', resolveWNBATeam('New York Liberty') === 'NYL');
check('resolve Sun', resolveWNBATeam('Connecticut Sun') === 'CON');
check('resolve ESPN LV abbr via name', resolveWNBATeam('Las Vegas') === 'LVA');
check('game key', makeWNBAGameKey('Las Vegas Aces', 'New York Liberty') === 'lva_nyl');
check('teamsMatch', wnbaTeamsMatch('Aces', 'Las Vegas Aces') === true);
check('teamsMatch unequal', wnbaTeamsMatch('Aces', 'Liberty') === false);

check('title with wnba cue', isWNBAMarketTitle('WNBA: Las Vegas Aces vs. New York Liberty') === true);
check('title team pair', isWNBAMarketTitle('Las Vegas Aces vs. New York Liberty') === true);
check('Will the Aces win? is WNBA (resolvable team)', isWNBAMarketTitle('Will the Aces win?') === true);
check('NBA Knicks title is NOT WNBA', isWNBAMarketTitle('Will the Knicks win?') === false);
check('NBA Lakers vs Celtics is NOT WNBA', isWNBAMarketTitle('Lakers vs. Celtics') === false);

check('main slug ok', isMainWNBAGameSlug('wnba-lva-nyl-2026-07-09') === true);
check('championship slug rejected', isMainWNBAGameSlug('wnba-championship-winner-2026') === false);
check('total prop slug rejected', isMainWNBAGameSlug('wnba-lva-nyl-2026-07-09-total-points') === false);

const wnbaFinal = {
  dateET: '2026-07-09',
  awayCode: 'lva',
  homeCode: 'nyl',
  awayTeam: 'Las Vegas Aces',
  homeTeam: 'New York Liberty',
  awayScore: 88,
  homeScore: 82,
};
const wrongDay = { ...wnbaFinal, dateET: '2026-07-08' };
const nbaFinal = {
  dateET: '2026-07-09',
  awayCode: 'lal',
  homeCode: 'bos',
  awayTeam: 'Los Angeles Lakers',
  homeTeam: 'Boston Celtics',
  awayScore: 110,
  homeScore: 105,
};

const wnbaPos = {
  sport: 'WNBA',
  gameKey: 'lva_nyl',
  date: '2026-07-09',
  away: 'Las Vegas Aces',
  home: 'New York Liberty',
  marketType: 'ml',
};

const hit = findMatchingGame(wnbaPos, [], [], [], [], [], [], [wnbaFinal]);
check('WNBA key match grades', hit && hit.awayScore === 88 && hit.homeScore === 82);

check('WNBA wrong-day blocked by date guard',
  findMatchingGame(wnbaPos, [], [], [], [], [], [], [wrongDay]) === null);

check('WNBA does not match NBA finals bucket',
  findMatchingGame(wnbaPos, [], [], [], [nbaFinal], [], [], []) === null);

// NBA path unchanged with wnbaFinals present
const nbaPos = {
  sport: 'NBA', gameKey: 'lal_bos', date: '2026-07-09',
  away: 'Los Angeles Lakers', home: 'Boston Celtics',
};
check('NBA matching unchanged with WNBA finals present',
  findMatchingGame(nbaPos, [], [], [], [nbaFinal], [], [], [wnbaFinal]) === nbaFinal);

// MLB path still works with extra wnbaFinals arg
const mlbPos = {
  sport: 'MLB', gameKey: 'nyy_tbr', date: '2026-07-08',
  away: 'New York Yankees', home: 'Tampa Bay Rays',
};
const mlbFinal = {
  dateET: '2026-07-08', awayCode: 'nyy', homeCode: 'tbr',
  awayTeam: 'New York Yankees', homeTeam: 'Tampa Bay Rays',
  awayScore: 2, homeScore: 3,
};
check('MLB matching unchanged with WNBA finals present',
  findMatchingGame(mlbPos, [], [], [mlbFinal], [], [], [], [wnbaFinal]) === mlbFinal);

// UFC path still works (8th arg is WNBA; UFC is 7th)
const ufcPos = {
  sport: 'UFC',
  gameKey: 'maxholloway_conormcgregor',
  date: '2026-07-11',
  away: 'Max Holloway',
  home: 'Conor McGregor',
  marketType: 'ml',
  title: 'UFC 329: Max Holloway vs. Conor McGregor',
};
const ufcFinal = {
  dateET: '2026-07-11',
  awayCode: 'maxholloway',
  homeCode: 'conormcgregor',
  awayFighter: 'Max Holloway',
  homeFighter: 'Conor McGregor',
  awayScore: 1,
  homeScore: 0,
};
check('UFC matching unchanged with WNBA finals present',
  findMatchingGame(ufcPos, [], [], [], [], [], [ufcFinal], [wnbaFinal])?.awayScore === 1);

// SOC path unchanged
const socPos = {
  sport: 'SOC', gameKey: 'mex_pol', date: '2026-06-18',
  away: 'Mexico', home: 'Poland',
};
const socFinal = {
  awayCode: 'mex', homeCode: 'pol',
  awayTeam: 'Mexico', homeTeam: 'Poland',
  awayScore: 1, homeScore: 0, wentBeyond90: false,
};
check('SOC matching unchanged with WNBA finals present',
  findMatchingGame(socPos, [], [], [], [], [socFinal], [], [wnbaFinal]) === socFinal);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
