import assert from 'node:assert/strict';
import {
  esportFromSlug,
  extractEsportsTeamsFromTitle,
  makeEsportsGameKey,
  classifyEsportsMarket,
  isGradableEsportsMainML,
  matchEsportsPositionTitle,
} from '../scripts/lib/esportsTeams.js';

const csSlug = 'cs2-fal2-nip-2026-10-14';
const lolSlug = 'lol-c9-kc-2026-10-15';
assert.equal(esportFromSlug(csSlug), 'CS2');
assert.equal(esportFromSlug(lolSlug), 'LOL');
assert.equal(esportFromSlug('cs2-fal2-nip-2026-10-14-game1'), null);
assert.equal(esportFromSlug('cs2-fal2-nip-2026-10-14-map-handicap-home-1pt5'), null);
assert.equal(esportFromSlug('lol-c9-kc-2026-10-15-game1'), null);
assert.equal(esportFromSlug('ewc-2026-cs2-winner'), null);

const falcons = extractEsportsTeamsFromTitle('Counter-Strike: Team Falcons vs NIP (BO3) - Thunderpick World Championship Group A');
assert.deepEqual(falcons.teams, ['Team Falcons', 'NIP']);
assert.equal(makeEsportsGameKey('9z', 'Aurora Gaming'), '9z_auroragaming');
assert.equal(extractEsportsTeamsFromTitle('Counter-Strike: STATE vs B8 Academy - Map 1 Winner'), null);
assert.equal(extractEsportsTeamsFromTitle('Games Total: O/U 2.5'), null);
assert.equal(extractEsportsTeamsFromTitle('LoL: Onion Team vs BRUTE - Game 1 Winner'), null);
assert.equal(extractEsportsTeamsFromTitle('Map Handicap: INF (-1.5) vs against All authority (+1.5)'), null);

const c9 = extractEsportsTeamsFromTitle('LoL: Cloud9 vs Karmine Corp (BO5) - Worlds Play-In');
assert.deepEqual(c9.teams, ['Cloud9', 'Karmine Corp']);
assert.equal(c9.sport, 'LOL');

assert.equal(classifyEsportsMarket('Counter-Strike: Team Falcons vs NIP (BO3) - Group A', csSlug), 'CS2');
assert.equal(classifyEsportsMarket('Counter-Strike: Team Falcons vs NIP - Map 1 Winner', `${csSlug}-game1`), 'CS2');
assert.equal(classifyEsportsMarket('LoL: Cloud9 vs Karmine Corp (BO5) - Worlds', lolSlug), 'LOL');
assert.equal(classifyEsportsMarket('Falcons vs Panthers', 'nfl-atl-car-2026-10-14'), null);

assert.equal(isGradableEsportsMainML({ sport: 'CS2', marketType: 'ML', title: 'Counter-Strike: Team Falcons vs NIP (BO3) - Group A', slug: csSlug }), true);
assert.equal(isGradableEsportsMainML({ sport: 'CS2', marketType: 'ML', title: 'Counter-Strike: Team Falcons vs NIP - Map 1 Winner', slug: `${csSlug}-game1` }), false);
assert.equal(isGradableEsportsMainML({ sport: 'LOL', marketType: 'SPREAD', slug: lolSlug, title: 'LoL: Cloud9 vs Karmine Corp (BO5) - Worlds' }), false);

const games = {
  'CS2:teamfalcons_nip': { away: 'Team Falcons', home: 'NIP', eventSlug: csSlug },
  'LOL:cloud9_karminecorp': { away: 'Cloud9', home: 'Karmine Corp', eventSlug: lolSlug },
};
const hit = matchEsportsPositionTitle('Counter-Strike: Team Falcons vs NIP (BO3) - Group A', games, csSlug);
assert.equal(hit.sport, 'CS2');
assert.equal(hit.key, 'teamfalcons_nip');
assert.equal(matchEsportsPositionTitle('Counter-Strike: Team Falcons vs NIP (BO3) - Group A', games, `${csSlug}-game1`), null);
assert.equal(matchEsportsPositionTitle('LoL: Cloud9 vs Karmine Corp (BO5) - Worlds Play-In', games, lolSlug).sport, 'LOL');

console.log('testEsportsTeams ok');
