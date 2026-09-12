/**
 * Unit-tier EV × steam overlay (2026-09-11+; promote tightened 2026-09-12).
 * MUTE EV < −2 with no steam. PROMOTE 2–<4u → 4u on arriving / last-hour ≥ 3%,
 * unless fade, lock-EV < −1, or LEAN/FADE.
 * Usage: node tests/testUnitTierEvSteamOverlay.mjs
 */
import assert from 'assert';
import {
  applyUnitTierEvSteamOverlay,
  isUnitTierEvSteamLive,
  isSteamOn,
  UNIT_TIER_EV_STEAM_FROM,
  UNIT_TIER_EV_MUTED_BY,
  UNIT_TIER_EV_MUTE_MAX,
  UNIT_TIER_PROMOTE_UNITS,
  UNIT_TIER_LH_PROMOTE_MIN,
  UNIT_TIER_LOCK_EV_VETO,
} from '../src/lib/unitTierEvSteamOverlay.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

function run(args) {
  return applyUnitTierEvSteamOverlay({ pickDate: '2026-09-11', ...args });
}

ok(isUnitTierEvSteamLive('2026-09-11'), 'live on cutover');
ok(!isUnitTierEvSteamLive('2026-09-10'), 'not live before cutover');
ok(UNIT_TIER_EV_STEAM_FROM === '2026-09-11', 'cutover date');
ok(UNIT_TIER_EV_MUTE_MAX === -2, 'mute thr');
ok(UNIT_TIER_PROMOTE_UNITS === 4, 'promote floor');
ok(UNIT_TIER_LH_PROMOTE_MIN === 3, 'last-hour steam floor, not watch');
ok(UNIT_TIER_LOCK_EV_VETO === -1, 'lock-EV veto');
ok(UNIT_TIER_EV_MUTED_BY === 'ev-lt2-no-steam', 'mutedBy');
ok(isSteamOn({ steamTier: 'steam' }), 'steam tier is on');
ok(isSteamOn({ steamTier: 'gold' }), 'gold tier is on');
ok(isSteamOn({ tapeSteamOnLock: true }), 'tape lock steam is on');
ok(!isSteamOn({ steamTier: 'none' }), 'none is off');

{
  const r = run({ units: 5.4, currentEv: -2.1, steamTier: null });
  ok(r.action === 'MUTE' && r.units === 0, 'EV < −2 no steam → mute');
  ok(r.mutedBy === UNIT_TIER_EV_MUTED_BY, 'mute stamp');
  ok(r.unitsPrePolicy === 5.4, 'preserves pre units');
  ok(r.reason === 'unit_tier_ev_lt2', 'mute reason');
}
{
  const r = run({ units: 3, currentEv: -2.0, steamTier: null });
  ok(r.action !== 'MUTE' && r.units === 3, 'EV exactly −2 is not mute');
}
{
  const r = run({ units: 5.4, currentEv: -3, steamTier: 'steam' });
  ok(r.action === 'HOLD' && r.units === 5.4, 'steam-on fail-open even at EV < −2');
  ok(r.mutedBy == null, 'no mutedBy on steam fail-open');
}
{
  const r = run({ units: 3, currentEv: null, steamTier: null });
  ok(r.action === 'HOLD' && r.units === 3, 'missing EV fail-open (no mute)');
}
{
  const r = applyUnitTierEvSteamOverlay({
    units: 5.4, currentEv: -5, steamTier: null, pickDate: '2026-09-10',
  });
  ok(r.action === 'EXEMPT' && r.units === 5.4, 'pre-cutover does not rewrite history');
}
{
  const r = run({ units: 0, currentEv: -5 });
  ok(r.action === 'PASS' && r.units === 0, 'already 0u stays PASS');
}

{
  const r = run({ units: 2, steamArriving: true, lockTier: 'ELITE' });
  ok(r.action === 'PROMOTE' && r.units === 4, '2u arriving → 4u');
  ok(r.reason === 'unit_tier_promote_timing', 'timing promote reason');
}
{
  const r = run({ units: 3, lastHourPct: 3.1, lockTier: 'PREMIUM' });
  ok(r.action === 'PROMOTE' && r.units === 4, 'last-hour ≥ 3% → 4u');
}
{
  const r = run({ units: 3, lastHourPct: 2.1, steamTier: 'steam', lockTier: 'LOCK' });
  ok(r.action === 'HOLD' && r.units === 3, 'watch 2% + steam-on is not timing');
}
{
  const r = run({ units: 3, currentEv: 0.4, lockEv: 0.4, steamTier: null });
  ok(r.action === 'HOLD' && r.units === 3, 'tiny lock-EV alone does not promote');
}
{
  const r = run({ units: 2, steamTier: 'steam', lockTier: 'WEAK' });
  ok(r.action === 'HOLD' && r.units === 2, 'already-on steam alone does not promote');
}
{
  const r = run({
    units: 3, steamArriving: true, lastHourPct: -0.4, lockTier: 'ELITE',
  });
  ok(r.action === 'HOLD' && r.units === 3, 'last-hour < 0 blocks even arriving');
}
{
  const r = run({
    units: 3, steamArriving: true, lockEv: -1.4, lockTier: 'ELITE',
  });
  ok(r.action === 'HOLD' && r.units === 3, 'lock-EV < −1 vetoes arriving');
}
{
  const r = run({
    units: 3, steamArriving: true, lockEv: -1.0, lockTier: 'ELITE',
  });
  ok(r.action === 'PROMOTE' && r.units === 4, 'lock-EV exactly −1 is not the veto');
}
{
  const r = run({ units: 3, steamArriving: true, lockEv: null, lockTier: 'WEAK' });
  ok(r.action === 'PROMOTE' && r.units === 4, 'missing lock-EV fail-open on timing');
}
{
  const r = run({
    units: 3, steamArriving: true, lastHourPct: 3.5, lockTier: 'LEAN',
  });
  ok(r.action === 'HOLD' && r.units === 3, 'LEAN does not get fatter');
}
{
  const r = run({
    units: 2, lastHourPct: 3.1, lockTier: 'FADE',
  });
  ok(r.action === 'HOLD' && r.units === 2, 'FADE does not get fatter');
}
{
  const r = run({ units: 1, steamArriving: true, lastHourPct: 4, lockTier: 'ELITE' });
  ok(r.action === 'HOLD' && r.units === 1, 'does not rescue <2u');
}
{
  const r = run({ units: 5.4, steamArriving: true, lastHourPct: 4, lockTier: 'ELITE' });
  ok(r.action === 'HOLD' && r.units === 5.4, 'does not boost already-4u+');
}
{
  const r = run({ units: 3, currentEv: -1.4, steamTier: null });
  ok(r.action === 'HOLD' && r.units === 3, 'EV −1.4 no steam is not mute and not promote');
}

console.log(`ok — ${n} assertions (unit-tier EV × steam overlay)`);
