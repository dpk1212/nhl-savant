/**
 * EPL / La Liga club resolve + slug gate. Run: node tests/testSoccerTeams.mjs
 */
import {
  resolveSOCTeam,
  makeSOCGameKey,
  isSoccerMarketTitle,
  isMainSoccerMatchSlug,
  isMainWorldCupMatchSlug,
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

check('SOC_SLUG_LEAGUES has epl+lal', SOC_SLUG_LEAGUES.has('epl') && SOC_SLUG_LEAGUES.has('lal'));
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
