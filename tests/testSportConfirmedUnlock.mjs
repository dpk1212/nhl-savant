/**
 * Sport Confirmed unlock ladder (NFL / CFB gated max-u).
 * Usage: node tests/testSportConfirmedUnlock.mjs
 */
import assert from 'assert';
import {
  SPORT_UNLOCK_GATE_FROM,
  SPORT_UNLOCK_GATE_SPORTS,
  isSportUnlockGateLive,
  isSportUnlockGatedSport,
  sportUnlockMaxUnits,
  countSportConfirmed,
  buildSportConfirmedCounts,
  applySportConfirmedUnlockOverlay,
} from '../src/lib/sportConfirmedUnlock.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

ok(SPORT_UNLOCK_GATE_FROM === '2026-08-29', 'cutover date');
ok(SPORT_UNLOCK_GATE_SPORTS.has('NFL') && SPORT_UNLOCK_GATE_SPORTS.has('CFB'), 'NFL+CFB gated');
ok(!SPORT_UNLOCK_GATE_SPORTS.has('MLB'), 'MLB not gated');
ok(isSportUnlockGateLive('2026-08-29'), 'live on cutover');
ok(!isSportUnlockGateLive('2026-08-28'), 'not live before');
ok(isSportUnlockGatedSport('nfl') && isSportUnlockGatedSport('CFB'), 'case-insensitive sport');
ok(!isSportUnlockGatedSport('MLB'), 'MLB exempt helper');

ok(sportUnlockMaxUnits(0) === 1, '<5 → 1u');
ok(sportUnlockMaxUnits(4) === 1, '4 → 1u');
ok(sportUnlockMaxUnits(5) === 2, '5 → 2u bridge');
ok(sportUnlockMaxUnits(9) === 2, '9 → 2u');
ok(sportUnlockMaxUnits(10) === 3, '10 → 3u half');
ok(sportUnlockMaxUnits(14) === 3, '14 → 3u');
ok(sportUnlockMaxUnits(15) === null, '15 → full');
ok(sportUnlockMaxUnits(100) === null, 'deep → full');

function cap(args) {
  return applySportConfirmedUnlockOverlay({ pickDate: '2026-08-29', ...args });
}

// ── CAP: NFL thin pool ───────────────────────────────────────────────────
{
  const r = cap({ units: 5.4, sport: 'NFL', nSportConfirmed: 3 });
  ok(r.action === 'CAP' && r.units === 1, 'NFL T=3 · 5.4u → 1u');
  ok(r.unitsPrePolicy === 5.4, 'preserves pre');
  ok(r.maxUnits === 1 && r.nSportConfirmed === 3, 'stamps');
  ok(String(r.reason).includes('sport_unlock_cap_1u'), 'reason');
}
{
  const r = cap({ units: 4, sport: 'CFB', nSportConfirmed: 0 });
  ok(r.action === 'CAP' && r.units === 1, 'CFB T=0 · 4u → 1u');
}
{
  const r = cap({ units: 5.4, sport: 'NFL', nSportConfirmed: 7 });
  ok(r.action === 'CAP' && r.units === 2, 'bridge 5–9 → 2u');
}
{
  const r = cap({ units: 5.4, sport: 'NFL', nSportConfirmed: 12 });
  ok(r.action === 'CAP' && r.units === 3, 'half 10–14 → 3u');
}

// ── HOLD: already under cap / full pool ──────────────────────────────────
{
  const r = cap({ units: 1, sport: 'NFL', nSportConfirmed: 3 });
  ok(r.action === 'HOLD' && r.units === 1, 'already 1u HOLD');
}
{
  const r = cap({ units: 5.4, sport: 'NFL', nSportConfirmed: 15 });
  ok(r.action === 'HOLD' && r.units === 5.4 && r.maxUnits == null, '≥15 full ladder');
}
{
  const r = cap({ units: 1.9, sport: 'NFL', nSportConfirmed: 8 });
  ok(r.action === 'HOLD' && r.units === 1.9, 'exact identity under 2u bridge');
}
{
  const r = cap({ units: 2.03, sport: 'NFL', nSportConfirmed: 8 });
  ok(r.action === 'CAP' && r.units === 2, '2.03 over bridge max → 2u');
}

// ── EXEMPT: MLB / deep sports / pre-cutover ──────────────────────────────
{
  const r = cap({ units: 5.4, sport: 'MLB', nSportConfirmed: 3 });
  ok(r.action === 'EXEMPT' && r.units === 5.4 && r.reason === 'sport_exempt', 'MLB untouched');
}
{
  const r = cap({ units: 6, sport: 'SOC', nSportConfirmed: 0 });
  ok(r.action === 'EXEMPT' && r.units === 6, 'SOC untouched');
}
{
  const r = applySportConfirmedUnlockOverlay({
    units: 5.4, sport: 'NFL', nSportConfirmed: 3, pickDate: '2026-08-28',
  });
  ok(r.action === 'EXEMPT' && r.units === 5.4 && r.reason === 'pre_cutover', 'history not rewritten');
}

// ── PASS: already 0u ─────────────────────────────────────────────────────
{
  const r = cap({ units: 0, sport: 'NFL', nSportConfirmed: 0 });
  ok(r.action === 'PASS' && r.units === 0, '0u stays PASS');
}

// ── countSportConfirmed ──────────────────────────────────────────────────
{
  const profiles = new Map([
    ['aaaaaa', { bySport: { NFL: { whitelistTier: 'CONFIRMED' }, MLB: { whitelistTier: 'CONFIRMED' } } }],
    ['bbbbbb', { bySport: { NFL: { whitelistTier: 'FLAT' }, CFB: { whitelistTier: 'CONFIRMED' } } }],
    ['cccccc', { bySport: { NFL: { whitelistTier: 'CONFIRMED' } } }],
    ['dddddd', { bySport: { MLB: { whitelistTier: 'CONFIRMED' } } }],
  ]);
  ok(countSportConfirmed('NFL', profiles) === 2, 'NFL Confirmed count');
  ok(countSportConfirmed('CFB', profiles) === 1, 'CFB Confirmed count');
  ok(countSportConfirmed('MLB', profiles) === 2, 'MLB Confirmed count');
  const built = buildSportConfirmedCounts(profiles);
  ok(built.get('NFL') === 2 && built.get('CFB') === 1, 'buildSportConfirmedCounts');
  ok(!built.has('MLB'), 'preload only gated sports');
}

console.log(`ok — ${n} assertions`);
