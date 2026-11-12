/**
 * CBB name resolution. Run: node scripts/lib/_test_cbbTeams.mjs
 */
import { cbbTeamsMatch, collapseSameCbbFinals, resolveCBBTeam } from './cbbTeams.js';

let failed = 0;
function assert(cond, msg) {
  if (!cond) { console.error('FAIL:', msg); failed++; }
  else console.log('  ok:', msg);
}

console.log('Short board names that were missing');
const same = [
  ['Connecticut Huskies', 'UConn'],
  ['Connecticut Huskies', 'UConn Huskies'],
  ['Florida Gulf Coast Eagles', 'FGCU'],
  ['Little Rock Trojans', 'Little Rock'],
  ['VCU Rams', 'VCU'],
  ['LSU Tigers', 'LSU'],
  ['Louisiana Tech Bulldogs', 'Louisiana Tech'],
  ['Merrimack College Warriors', 'Merrimack'],
  ['Albany Great Danes', 'UAlbany'],
  ['UNCG Spartans', 'UNC Greensboro'],
  ['North Carolina A&T Aggies', 'N.C. A&T'],
  ['North Carolina State Wolfpack', 'NC State'],
  ['Georgia Southern Eagles', 'Ga. Southern'],
  ['Charleston Southern Buccaneers', 'Charleston So.'],
  ['South Florida Bulls', 'South Fla.'],
  ['Northern Kentucky Norse', 'Northern Ky.'],
  ['Southeastern Louisiana Lions', 'Southeastern La.'],
  ['Bakersfield Roadrunners', 'CSU Bakersfield'],
  ['Central Connecticut State Blue Devils', 'Central Conn. St.'],
  ['Appalachian State Mountaineers', 'App State'],
  ['Louisiana-Monroe Warhawks', 'ULM'],
  ['Seattle Redhawks', 'Seattle U'],
  ['Hawaii Rainbow Warriors', 'Hawai\'i'],
  ['Boston Terriers', 'Boston U.'],
  ['Queens (NC) Royals', 'Queens (NC)'],
  ['Loyola Marymount Lions', 'LMU (CA)'],
  ['Grambling State Tigers', 'Grambling'],
  ['McNeese State Cowboys', 'McNeese'],
  ['Texas-Rio Grande Valley Vaqueros', 'UTRGV'],
  ['Arkansas-Pine Bluff Golden Lions', 'Ark.-Pine Bluff'],
  ['Massachusetts-Lowell River Hawks', 'UMass Lowell'],
  ['Florida A&M Rattlers', 'Florida A&M'],
  ['LIU Sharks', 'LIU'],
  ['Southern Jaguars', 'Southern U.'],
  ['Ball State Cardinals', 'Ball St.'],
  ['Miami Hurricanes', 'Miami (FL)'],
  ['Detroit Titans', 'Detroit Mercy Titans'],
  ['Detroit Titans', 'Detroit Mercy'],
  ['Army Black Knights', 'Army West Point'],
  ['Army Black Knights', 'Army'],
  ['Alcorn State Braves', 'Alcorn'],
  ['Alcorn State Braves', 'Alcorn St.'],
  ['Grand Canyon Antelopes', 'Grand Canyon'],
  ['Grand Canyon Antelopes', 'Grand Canyon Lopes'],
];
for (const [ours, board] of same) {
  assert(cbbTeamsMatch(ours, board), `${ours} = ${board}`);
}

console.log('\nDifferent schools that share a prefix');
const different = [
  ['Michigan Wolverines', 'Central Michigan Chippewas'],
  ['Michigan Wolverines', 'Michigan State Spartans'],
  ['Michigan Wolverines', 'Eastern Michigan Eagles'],
  ['Michigan Wolverines', 'Western Michigan Broncos'],
  ['Georgia Bulldogs', 'Georgia Tech Yellow Jackets'],
  ['Georgia Bulldogs', 'Georgia Southern Eagles'],
  ['Georgia Bulldogs', 'Georgia State Panthers'],
  ['Georgia Bulldogs', 'West Georgia Wolves'],
  ['Connecticut Huskies', 'Central Connecticut State Blue Devils'],
  ['UConn', 'Central Conn. St.'],
  ['LSU Tigers', 'LSU New Orleans Privateers'],
  ['LSU Tigers', 'Louisiana Tech Bulldogs'],
  ['LSU Tigers', 'Louisiana Ragin\' Cajuns'],
  ['Florida Gators', 'Florida State Seminoles'],
  ['Florida Gators', 'Florida Gulf Coast Eagles'],
  ['Florida Gators', 'South Florida Bulls'],
  ['Florida Gators', 'Florida A&M Rattlers'],
  ['North Carolina Tar Heels', 'NC State Wolfpack'],
  ['North Carolina Tar Heels', 'North Carolina A&T Aggies'],
  ['North Carolina Tar Heels', 'N.C. A&T'],
  ['North Carolina Tar Heels', 'UNC Greensboro Spartans'],
  ['Boston Terriers', 'Boston College Eagles'],
  ['Southern Jaguars', 'Southern Utah Thunderbirds'],
  ['Southern Jaguars', 'SE Louisiana Lions'],
  ['Texas Longhorns', 'Texas A&M Aggies'],
  ['Texas Longhorns', 'Texas Southern Tigers'],
  ['Texas Longhorns', 'UT Rio Grande Valley Vaqueros'],
  ['Arkansas Razorbacks', 'Arkansas-Pine Bluff Golden Lions'],
  ['Miami Hurricanes', 'Miami (OH) RedHawks'],
  ['Cal State Bakersfield Roadrunners', 'Cal State Fullerton Titans'],
];
for (const [a, b] of different) {
  assert(!cbbTeamsMatch(a, b), `${a} ≠ ${b}`);
  assert(resolveCBBTeam(a) && resolveCBBTeam(b), `${a} and ${b} both resolve`);
}

assert(resolveCBBTeam('Paine Lions') === null, 'Paine is not a D1 catalog school');
assert(!cbbTeamsMatch('Detroit Titans', 'Cal State Fullerton Titans'), 'Detroit Titans ≠ Fullerton');

console.log('\nBoth boards, one game');
const doubled = collapseSameCbbFinals([
  { dateET: '2026-11-10', awayTeam: 'Belmont', homeTeam: 'Lipscomb', awayScore: 75, homeScore: 88 },
  { dateET: '2026-11-10', awayTeam: 'Belmont Bruins', homeTeam: 'Lipscomb Bisons', awayScore: 75, homeScore: 88 },
  { dateET: '2026-11-10', awayTeam: 'Detroit Titans', homeTeam: 'Xavier Musketeers', awayScore: 70, homeScore: 80 },
  { dateET: '2026-11-10', awayTeam: 'Detroit Mercy', homeTeam: 'Xavier', awayScore: 70, homeScore: 80 },
  { dateET: '2026-11-10', awayTeam: 'Kansas', homeTeam: 'Kentucky', awayScore: 89, homeScore: 69 },
  { dateET: '2026-11-10', awayTeam: 'Kansas Jayhawks', homeTeam: 'Kentucky Wildcats', awayScore: 80, homeScore: 90 },
]);
assert(doubled.length === 4, `agreeing copies collapse, a split score stays (${doubled.length})`);

if (failed) {
  console.error(`\n${failed} failed`);
  process.exit(1);
}
console.log('\nAll passed');
