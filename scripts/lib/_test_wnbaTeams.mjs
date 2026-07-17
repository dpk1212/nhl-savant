/**
 * Regression tests for resolveWNBATeam / makeWNBAGameKey.
 * Run: node scripts/lib/_test_wnbaTeams.mjs
 */
import { resolveWNBATeam, makeWNBAGameKey } from './wnbaTeams.js';

let failed = 0;
function assert(cond, msg) {
  if (!cond) { console.error('FAIL:', msg); failed++; }
  else console.log('  ok:', msg);
}

console.log('Real WNBA teams');
assert(resolveWNBATeam('Portland Fire') === 'POR', 'Portland Fire → POR');
assert(resolveWNBATeam('PortlandFire') === 'POR', 'PortlandFire → POR');
assert(resolveWNBATeam('Minnesota Lynx') === 'MIN', 'Minnesota Lynx → MIN');
assert(resolveWNBATeam('Las Vegas Aces') === 'LVA', 'Las Vegas Aces → LVA');
assert(resolveWNBATeam('Golden State Valkyries') === 'GSV', 'GSV');
assert(resolveWNBATeam('Connecticut Sun') === 'CON', 'Sun');
assert(resolveWNBATeam('Los Angeles Sparks') === 'LAS', 'Sparks');
assert(resolveWNBATeam('SEA') === 'SEA', 'code SEA');

console.log('\nFalse-positive rejects (esports pollution)');
assert(resolveWNBATeam('Esports') === null, 'Esports → null');
assert(resolveWNBATeam('Gaming') === null, 'Gaming → null');
assert(resolveWNBATeam('PlayTime (BO3) - Esports World Cup Survival') === null, 'PlayTime Esports → null');
assert(resolveWNBATeam('Dota 2: Vici Gaming') === null, 'Dota Gaming → null');
assert(resolveWNBATeam('Vici Gaming') === null, 'Vici Gaming → null');

console.log('\nGame keys');
assert(
  makeWNBAGameKey('PortlandFire', 'Minnesota Lynx') === 'por_min',
  'PortlandFire vs Lynx → por_min',
);
assert(
  makeWNBAGameKey('PlayTime (BO3) - Esports World Cup Survival', 'Dota 2: Vici Gaming') === null,
  'Esports vs Dota → null key',
);

if (failed) {
  console.error(`\n${failed} failed`);
  process.exit(1);
}
console.log('\nAll passed');
