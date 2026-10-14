/**
 * EPL / La Liga club resolve + slug gate. Run: node tests/testSoccerTeams.mjs
 */
import {
  resolveSOCTeam,
  makeSOCGameKey,
  isSoccerMarketTitle,
  isMainSoccerMatchSlug,
  isMainWorldCupMatchSlug,
  matchSoccerPositionTitle,
} from '../scripts/lib/soccerTeams.js';
import { positionMatchesPolyEvent } from '../scripts/lib/positionEventMatch.js';
import { positionFitsBoardSport, SOC_SLUG_LEAGUES } from '../src/lib/sportSlug.js';

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log(`  ✅ ${name}`); }
  else { fail++; console.error(`  ❌ ${name}`); }
}

check('Arsenal FC', resolveSOCTeam('Arsenal FC') === 'ARS');
check('Coventry City', resolveSOCTeam('Coventry City') === 'COV');
check('Man Utd', resolveSOCTeam('Man Utd') === 'MUN');
check('Manchester United FC', resolveSOCTeam('Manchester United FC') === 'MUN');
check('Man City', resolveSOCTeam('Manchester City FC') === 'MAC');
check('AFC Bournemouth', resolveSOCTeam('AFC Bournemouth') === 'BOU');
check('Brighton & Hove', resolveSOCTeam('Brighton & Hove Albion FC') === 'BRI');
check('Brighton and Hove Odds API', resolveSOCTeam('Brighton and Hove Albion') === 'BRI');
check('Spain stays ESP', resolveSOCTeam('Spain') === 'ESP');
check('Espanyol is EPY not Spain', resolveSOCTeam('Espanyol') === 'EPY');
check('RCD Espanyol de Barcelona', resolveSOCTeam('RCD Espanyol de Barcelona') === 'EPY');
check('ESP token is still Spain', resolveSOCTeam('ESP') === 'ESP');
check('Real Madrid CF', resolveSOCTeam('Real Madrid CF') === 'REA');
check('Atlético Madrid', resolveSOCTeam('Atlético Madrid') === 'MAD');
check('Athletic Club', resolveSOCTeam('Athletic Club') === 'BIL');
check('Rayo Vallecano de Madrid', resolveSOCTeam('Rayo Vallecano de Madrid') === 'RAY');
check('Deportivo Alavés', resolveSOCTeam('Deportivo Alavés') === 'ALA');
check('Mexico still KOR-safe', resolveSOCTeam('Mexico') === 'MEX');
check('Korea Republic still KOR', resolveSOCTeam('Korea Republic') === 'KOR');

check('epl key', makeSOCGameKey('Coventry City', 'Arsenal') === 'cov_ars');
check('lal key Espanyol vs Madrid', makeSOCGameKey('Espanyol', 'Real Madrid') === 'epy_rea');
check('same team rejected', makeSOCGameKey('Arsenal', 'Arsenal FC') === null);

check('main epl slug', isMainSoccerMatchSlug('epl-ars-cov-2026-08-21') === true);
check('main lal slug', isMainSoccerMatchSlug('lal-ray-ala-2026-08-20') === true);
check('ht prop dropped', isMainSoccerMatchSlug('epl-ars-cov-2026-08-21-halftime-result') === false);
check('champion future dropped', isMainSoccerMatchSlug('epl-2027-champion-20260701200428749') === false);
check('wc slug still main', isMainSoccerMatchSlug('fifwc-mex-kor-2026-06-18') === true);
check('wc-only helper', isMainWorldCupMatchSlug('epl-ars-cov-2026-08-21') === false);

check('title epl vs', isSoccerMarketTitle('Arsenal FC vs. Coventry City FC') === true);
check('title will arsenal win', isSoccerMarketTitle('Will Arsenal win on 2026-08-21?') === true);
check('title laliga keyword', isSoccerMarketTitle('LaLiga: 2027 Champion') === true);
check('cbb mexico not soccer', isSoccerMarketTitle('New Mexico vs. Colorado State') === false);

check('Portugal stays POR', resolveSOCTeam('Portugal') === 'POR');
check('FC Porto is FCP not Portugal', resolveSOCTeam('FC Porto') === 'FCP');
check('LASK Linz', resolveSOCTeam('LASK Linz') === 'LAS');
check('ESPN LASK', resolveSOCTeam('LASK Linz') === resolveSOCTeam('LASK'));
check('Feyenoord both sources', resolveSOCTeam('Feyenoord Rotterdam') === 'FEY' && resolveSOCTeam('Feyenoord Rotterdam') === resolveSOCTeam('Feyenoord'));
check('Como 1907 and ESPN Como', resolveSOCTeam('Como 1907') === 'COM' && resolveSOCTeam('Como') === 'COM');
check('Bodø and ESPN Bodo', resolveSOCTeam('FK Bodø/Glimt') === 'BOD' && resolveSOCTeam('Bodo/Glimt') === 'BOD');
check('Dortmund poly and ESPN', resolveSOCTeam('BV Borussia 09 Dortmund') === 'BVB' && resolveSOCTeam('Borussia Dortmund') === 'BVB');
check('Bayern poly and ESPN', resolveSOCTeam('FC Bayern München') === 'BAY' && resolveSOCTeam('Bayern Munich') === 'BAY');
check('Inter poly and ESPN', resolveSOCTeam('FC Internazionale Milano') === 'INT' && resolveSOCTeam('Internazionale') === 'INT');
check('Slovan poly and ESPN', resolveSOCTeam('ŠK Slovan Bratislava') === 'SLO' && resolveSOCTeam('Slovan Bratislava') === 'SLO');
check('Slavia poly and ESPN', resolveSOCTeam('SK Slavia Praha') === 'SLP' && resolveSOCTeam('Slavia Prague') === 'SLP');
check('Fenerbahce poly and ESPN', resolveSOCTeam('Fenerbahçe SK') === 'FEN' && resolveSOCTeam('Fenerbahce') === 'FEN');
check('PSG', resolveSOCTeam('Paris Saint-Germain FC') === 'PSG' && resolveSOCTeam('Paris Saint-Germain') === 'PSG');
check('ucl key LASK Liverpool', makeSOCGameKey('LASK Linz', 'Liverpool FC') === 'las_liv');
check('ucl key Feyenoord Como', makeSOCGameKey('Feyenoord Rotterdam', 'Como 1907') === 'fey_com');
const uclSlate = [
  ['LASK Linz', 'Liverpool FC', 'LASK Linz', 'Liverpool'],
  ['Feyenoord Rotterdam', 'Como 1907', 'Feyenoord Rotterdam', 'Como'],
  ['FK Shakhtar Donetsk', 'AEK', 'Shakhtar Donetsk', 'AEK Athens'],
  ['AS Roma', 'Real Madrid CF', 'AS Roma', 'Real Madrid'],
  ['Manchester City FC', 'Paris Saint-Germain FC', 'Manchester City', 'Paris Saint-Germain'],
  ['FK Bodø/Glimt', 'BV Borussia 09 Dortmund', 'Bodo/Glimt', 'Borussia Dortmund'],
  ['ŠK Slovan Bratislava', 'VfB Stuttgart', 'Slovan Bratislava', 'VfB Stuttgart'],
  ['Real Betis Balompié', 'FC Porto', 'Real Betis', 'FC Porto'],
  ['Aston Villa FC', 'Fenerbahçe SK', 'Aston Villa', 'Fenerbahce'],
];
for (const [polyA, polyB, espnA, espnB] of uclSlate) {
  const key = makeSOCGameKey(polyA, polyB);
  check(`ucl slate ${polyA} vs ${polyB}`, !!key
    && resolveSOCTeam(polyA) === resolveSOCTeam(espnA)
    && resolveSOCTeam(polyB) === resolveSOCTeam(espnB));
}

check('main ucl slug', isMainSoccerMatchSlug('ucl-lin2-liv-2026-10-14') === true);
check('ucl side market dropped', isMainSoccerMatchSlug('ucl-lin2-liv-2026-10-14-lin2') === false);
check('ucl corners dropped', isMainSoccerMatchSlug('ucl-oly-nec-2026-08-04-total-corners') === false);
check('ucl props dropped', isMainSoccerMatchSlug('ucl-int-bru-2026-10-13-player-props') === false);
check('ucl title', isSoccerMarketTitle('LASK Linz vs. Liverpool FC') === true);
check('ucl will-win', isSoccerMarketTitle('Will LASK Linz win on 2026-10-14?') === true);
check('ucl draw', isSoccerMarketTitle('Will LASK Linz vs. Liverpool FC end in a draw?') === true);

check('SOC_SLUG_LEAGUES has epl+lal', SOC_SLUG_LEAGUES.has('epl') && SOC_SLUG_LEAGUES.has('lal'));
check('SOC_SLUG_LEAGUES has ucl', SOC_SLUG_LEAGUES.has('ucl'));
check('ucl fits SOC board', positionFitsBoardSport({ slug: 'ucl-lin2-liv-2026-10-14' }, 'SOC') === true);
check('epl fits SOC board', positionFitsBoardSport({ slug: 'epl-ars-cov-2026-08-21' }, 'SOC') === true);
check('epl does not fit WNBA', positionFitsBoardSport({ slug: 'epl-ars-cov-2026-08-21' }, 'WNBA') === false);

{
  const gate = positionMatchesPolyEvent(
    { eventId: '1', slug: 'epl-ars-cov-2026-08-21' },
    { eventId: '1', slug: 'epl-ars-cov-2026-08-21', polyGameDate: '2026-08-21' },
    'cov_ars',
    { boardDate: '2026-08-21', sport: 'SOC' },
  );
  check('epl on SOC board ok', gate.ok === true);
}
{
  const games = {
    'SOC:las_liv': { away: 'LASK Linz', home: 'Liverpool FC', commence: '2026-10-14T16:45:00Z' },
  };
  const win = matchSoccerPositionTitle('Will Liverpool FC win on 2026-10-14?', games);
  const draw = matchSoccerPositionTitle('Will LASK Linz vs. Liverpool FC end in a draw?', games);
  check('ucl liverpool win side', win?.key === 'las_liv' && win?.socMarket === 'home');
  check('ucl draw side', draw?.key === 'las_liv' && draw?.socMarket === 'draw');
  const gate = positionMatchesPolyEvent(
    { eventId: '7', slug: 'ucl-lin2-liv-2026-10-14-liv', title: 'Will Liverpool FC win on 2026-10-14?' },
    { eventId: '7', eventSlug: 'ucl-lin2-liv-2026-10-14', polyGameDate: '2026-10-14' },
    'las_liv',
    { boardDate: '2026-10-14', sport: 'SOC' },
  );
  check('ucl side market on SOC board', gate.ok === true);
}
{
  const gate = positionMatchesPolyEvent(
    { eventId: '9', slug: 'epl-ars-cov-2026-08-21' },
    { eventId: '8', polyGameDate: '2026-08-21' },
    'ind_atl',
    { boardDate: '2026-08-21', sport: 'WNBA' },
  );
  check('epl rejected on WNBA', gate.ok === false && gate.reason === 'slug_sport_mismatch');
}

console.log(`\ntestSoccerTeams: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
