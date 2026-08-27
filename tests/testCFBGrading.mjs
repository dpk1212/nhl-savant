/**
 * testCFBGrading.mjs — CFB team resolve + date-guarded matching.
 *
 * Run: node tests/testCFBGrading.mjs
 */
import { findMatchingGame } from '../scripts/gradeSharpActions.js';
import {
  resolveCFBTeam,
  makeCFBGameKey,
  isCFBMarketTitle,
  isMainCFBGameSlug,
  cfbTeamsMatch,
} from '../scripts/lib/cfbTeams.js';

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log(`  ✅ ${name}`); }
  else { fail++; console.error(`  ❌ ${name}`); }
}

check('resolve Maine', resolveCFBTeam('Maine') === 'MNE');
check('resolve Maine Black Bears', resolveCFBTeam('Maine Black Bears') === 'MNE');
check('resolve Towson', resolveCFBTeam('Towson') === 'TOWS');
check('resolve Towson Tigers', resolveCFBTeam('Towson Tigers') === 'TOWS');
check('resolve Alabama', resolveCFBTeam('Alabama Crimson Tide') === 'ALA');
check('resolve Crimson Tide unique nick', resolveCFBTeam('Crimson Tide') === 'ALA');
check('generic Tigers is NOT a team', resolveCFBTeam('Tigers') == null);
check('generic Eagles is NOT a team', resolveCFBTeam('Eagles') == null);
check('Georgia Tech beats Georgia prefix', resolveCFBTeam('Georgia Tech Yellow Jackets') === 'GT');
check('Georgia Bulldogs', resolveCFBTeam('Georgia Bulldogs') === 'UGA');
check('Mississippi State beats Mississippi', resolveCFBTeam('Mississippi State Bulldogs') === 'MSST');
check('Ole Miss', resolveCFBTeam('Ole Miss') === 'MISS');
check('Miami (OH)', resolveCFBTeam('Miami (OH) RedHawks') === 'MIAOH');
check('Miami Hurricanes', resolveCFBTeam('Miami Hurricanes') === 'MIA');
check('Ohio State', resolveCFBTeam('Ohio State Buckeyes') === 'OSU');
check('Oklahoma State', resolveCFBTeam('Oklahoma State Cowboys') === 'OKST');
check('Mercyhurst', resolveCFBTeam('Mercyhurst') === 'MRCY');
check('Youngstown State', resolveCFBTeam('Youngstown St Penguins') === 'YSU');
check('Stony Brook', resolveCFBTeam('Stony Brook') === 'STBR');
check('Delaware State', resolveCFBTeam('Delaware State') === 'DELST');
check('UNLV truncated Poly title', resolveCFBTeam("UNLV Runnin'") === 'UNLV');
check('Central Arkansas is not Arkansas', resolveCFBTeam('Central Arkansas') == null);
check('North Carolina Central is not UNC', resolveCFBTeam('North Carolina Central') == null);
check('Eastern Washington is not Washington', resolveCFBTeam('Eastern Washington') == null);
check('Texas Southern is not Texas', resolveCFBTeam('Texas Southern') == null);
check('Northwestern (IA) is not Northwestern', resolveCFBTeam('Northwestern (IA)') == null);
check('Florida A&M is not Florida', resolveCFBTeam('Florida A&M') == null);

check('game key Maine@Towson', makeCFBGameKey('Maine', 'Towson') === 'mne_tows');
check('game key Stony Brook@Delaware State', makeCFBGameKey('Stony Brook', 'Delaware State') === 'stbr_delst');
check('teamsMatch', cfbTeamsMatch('Maine Black Bears', 'Maine') === true);
check('teamsMatch unequal', cfbTeamsMatch('Maine', 'Towson') === false);

check('title with cfb cue', isCFBMarketTitle('CFB: Maine vs. Towson') === true);
check('title team pair', isCFBMarketTitle('Maine vs. Towson') === true);
check('NBA Knicks title is NOT CFB', isCFBMarketTitle('Will the Knicks win?') === false);
check('NFL pair is NOT CFB', isCFBMarketTitle('Carolina Panthers vs. Arizona Cardinals') === false);
check('basketball cue rejected', isCFBMarketTitle('Duke vs. North Carolina basketball') === false);

check('main slug ok', isMainCFBGameSlug('cfb-maine-tows-2026-08-27') === true);
check('stony brook slug ok', isMainCFBGameSlug('cfb-stbr-delst-2026-08-27') === true);
check('heisman slug rejected', isMainCFBGameSlug('ncaa-football-2026-heisman-award-winner-20260731185656435') === false);
check('champion slug rejected', isMainCFBGameSlug('ncaa-football-2026-national-champion') === false);
check('nfl slug is not cfb', isMainCFBGameSlug('nfl-car-ari-2026-08-07') === false);
check('cbb slug is not cfb', isMainCFBGameSlug('cbb-tows-ncat-2026-01-24') === false);

const cfbFinal = {
  dateET: '2026-08-27',
  awayCode: 'mne',
  homeCode: 'tows',
  awayTeam: 'Maine Black Bears',
  homeTeam: 'Towson Tigers',
  awayScore: 17,
  homeScore: 24,
};
const wrongDay = { ...cfbFinal, dateET: '2026-08-26' };
const nflFinal = {
  dateET: '2026-08-27',
  awayCode: 'car',
  homeCode: 'ari',
  awayTeam: 'Carolina Panthers',
  homeTeam: 'Arizona Cardinals',
  awayScore: 10,
  homeScore: 20,
};

const cfbPos = {
  sport: 'CFB',
  gameKey: 'mne_tows',
  date: '2026-08-27',
  away: 'Maine',
  home: 'Towson',
  marketType: 'ml',
};

// findMatchingGame(..., soc, ufc, wnba, nfl, cfb)
const hit = findMatchingGame(cfbPos, [], [], [], [], [], [], [], [], [cfbFinal]);
check('CFB key match grades Maine@Towson', hit && hit.awayScore === 17 && hit.homeScore === 24);

const missDay = findMatchingGame(cfbPos, [], [], [], [], [], [], [], [], [wrongDay]);
check('wrong ET date does not grade', missDay == null);

const nflPos = {
  sport: 'NFL',
  gameKey: 'car_ari',
  date: '2026-08-27',
  away: 'Carolina Panthers',
  home: 'Arizona Cardinals',
  marketType: 'ml',
};
const nflHit = findMatchingGame(nflPos, [], [], [], [], [], [], [], [nflFinal], [cfbFinal]);
check('NFL matching unchanged with CFB finals present', nflHit && nflHit.awayScore === 10);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
