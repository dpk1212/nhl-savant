/**
 * Unit-tier EV × steam overlay (2026-09-11+).
 * MUTE EV < −2 with no steam. PROMOTE 2–<4u → 4u on steam / lock-EV 0..1 / lh≥2.
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
  const r = run({ units: 3, currentEv: -2.5, steamTier: 'gold' });
  ok(r.action === 'PROMOTE' && r.units === 4, 'gold fail-open mute then 3u steam promote');
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
  const r = run({ units: 2, currentEv: -0.5, steamTier: 'steam' });
  ok(r.action === 'PROMOTE' && r.units === 4, '2u steam-on → 4u');
  ok(r.reason === 'unit_tier_promote_4u', 'promote reason');
}
{
  const r = run({ units: 3, currentEv: 0.4, steamTier: null });
  ok(r.action === 'PROMOTE' && r.units === 4, 'lock-EV 0..1 → 4u');
}
{
  const r = run({ units: 2.5, currentEv: -0.4, lastHourPct: 2.1, steamTier: null });
  ok(r.action === 'PROMOTE' && r.units === 4, 'last-hour ≥ 2% → 4u');
}
{
  const r = run({ units: 3, currentEv: 0.2, lastHourPct: -0.4, steamTier: 'steam' });
  ok(r.action === 'HOLD' && r.units === 3, 'last-hour < 0 blocks promote even with steam');
}
{
  const r = run({ units: 1, currentEv: 0.4, steamTier: 'steam' });
  ok(r.action === 'HOLD' && r.units === 1, 'does not rescue <2u');
}
{
  const r = run({ units: 5.4, currentEv: 0.4, steamTier: 'steam' });
  ok(r.action === 'HOLD' && r.units === 5.4, 'does not boost already-4u+');
}
{
  const r = run({ units: 3, currentEv: 1.0, steamTier: null });
  ok(r.action === 'HOLD' && r.units === 3, 'lock-EV exactly 1 is not the band');
}
{
  const r = run({ units: 3, currentEv: -1.4, steamTier: null });
  ok(r.action === 'HOLD' && r.units === 3, 'EV −1.4 no steam is not mute and not promote');
}

console.log(`ok — ${n} assertions (unit-tier EV × steam overlay)`);
