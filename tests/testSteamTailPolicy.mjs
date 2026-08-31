/**
 * Steam-tail size policy T (2026-08-31+).
 * Usage: node tests/testSteamTailPolicy.mjs
 */
import assert from 'assert';
import {
  applySteamTailPolicy,
  applySteamTailPolicyFromTicket,
  countSourceAbOnSide,
  isSteamTailPolicyLive,
  resolveSteamLifecycle,
  steamTailBand,
  STEAM_TAIL_POLICY_FROM,
  STEAM_TAIL_MUTED_BY,
  STEAM_TAIL_ARRIVING_FLOOR,
} from '../src/lib/steamTailPolicy.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

ok(STEAM_TAIL_POLICY_FROM === '2026-08-31', 'cutover date');
ok(STEAM_TAIL_MUTED_BY === 'steam-tail', 'mutedBy stamp');
ok(STEAM_TAIL_ARRIVING_FLOOR === 2, 'arriving floor');
ok(isSteamTailPolicyLive('2026-08-31'), 'live on cutover');
ok(!isSteamTailPolicyLive('2026-08-30'), 'not live before cutover');
ok(steamTailBand(1) === 'lean' && steamTailBand(3) === 'mid', 'lean/mid bands');
ok(steamTailBand(4) === 'u4' && steamTailBand(5) === 'u5' && steamTailBand(5.4) === 'fat', '4/5/fat bands');

function T(args) {
  return applySteamTailPolicy({ pickDate: '2026-08-31', steamObservable: true, ...args });
}

// ── 1u junk ──────────────────────────────────────────────────────────────
{
  const r = T({ units: 1, steamOnLock: false, steamArriving: false, sharpAB: true });
  ok(r.action === 'MUTE' && r.units === 0, 'junk 1u muted even with A/B');
  ok(r.mutedBy === STEAM_TAIL_MUTED_BY && r.reason === 'lean_no_arriving', 'lean stamp');
  ok(r.unitsPrePolicy === 1, 'preserves pre units');
}
{
  const r = T({ units: 0.5, steamArriving: true, sharpAB: false, steamOnLock: true });
  ok(r.action === 'MUTE' && r.units === 0, 'arriving without A/B still cut');
}

// ── arriving 1u → 2u ─────────────────────────────────────────────────────
{
  const r = T({ units: 1, steamArriving: true, steamOnLock: true, sharpAB: true });
  ok(r.action === 'FLOOR' && r.units === 2, 'A/B arriving 1u floors to 2u');
  ok(r.mutedBy == null && r.reason === 'arriving_floor', 'floor is not a mute');
}
{
  const r = applySteamTailPolicy({
    units: 0.5, bandUnits: 1, pickDate: '2026-08-31',
    steamObservable: true, steamArriving: true, steamOnLock: true, sharpAB: true,
  });
  ok(r.action === 'FLOOR' && r.units === 2, 'halved arriving lean still floors to 2u');
}

// ── 2–3u / 5u untouched ──────────────────────────────────────────────────
{
  const r = T({ units: 3, steamOnLock: false, sharpAB: false });
  ok(r.action === 'HOLD' && r.units === 3 && r.mutedBy == null, '2–3u no steam keep');
}
{
  const r = T({ units: 5, steamOnLock: false, sharpAB: false });
  ok(r.action === 'HOLD' && r.units === 5, '5u keep without steam');
}

// ── 4u steam confirm ─────────────────────────────────────────────────────
{
  const r = T({ units: 4, steamOnLock: false, sharpAB: true });
  ok(r.action === 'MUTE' && r.units === 0 && r.reason === 'unconfirmed_4u', '4u no steam mute');
}
{
  const r = T({ units: 4, steamOnLock: true, sharpAB: false });
  ok(r.action === 'MUTE' && r.units === 0, '4u steam without A/B mute');
}
{
  const r = T({ units: 4, steamOnLock: true, sharpAB: true });
  ok(r.action === 'HOLD' && r.units === 4, '4u A/B steam keep');
}

// ── 5.4u+ steam confirm ──────────────────────────────────────────────────
{
  const r = T({ units: 5.4, steamOnLock: false, sharpAB: true });
  ok(r.action === 'MUTE' && r.reason === 'unconfirmed_fat', 'fat no steam mute');
}
{
  const r = T({ units: 6, steamOnLock: true, sharpAB: true });
  ok(r.action === 'HOLD' && r.units === 6, '6u A/B steam keep');
}

// ── fail-open / pre-cutover / already 0u ─────────────────────────────────
{
  const r = applySteamTailPolicy({
    units: 5.4, pickDate: '2026-08-31', steamObservable: false,
    steamOnLock: false, sharpAB: false,
  });
  ok(r.action === 'FAIL_OPEN' && r.units === 5.4, 'no steam observation fail-open fat');
}
{
  const r = applySteamTailPolicy({
    units: 1, pickDate: '2026-08-31', steamObservable: false,
    steamArriving: false, sharpAB: false,
  });
  ok(r.action === 'MUTE' && r.units === 0, '1u still cut when steam unobserved');
}
{
  const r = applySteamTailPolicy({
    units: 5.4, pickDate: '2026-08-30', steamObservable: true,
    steamOnLock: false, sharpAB: false,
  });
  ok(r.action === 'EXEMPT' && r.units === 5.4, 'pre-cutover does not rewrite history');
}
{
  const r = T({ units: 0, steamOnLock: false });
  ok(r.action === 'PASS' && r.units === 0, 'already 0u stays PASS');
}

// ── climate-halved fat still mutes ───────────────────────────────────────
{
  const r = applySteamTailPolicy({
    units: 2, bandUnits: 4, pickDate: '2026-08-31',
    steamObservable: true, steamOnLock: false, sharpAB: true,
  });
  ok(r.action === 'MUTE' && r.reason === 'unconfirmed_4u', 'halved unconfirmed 4u still mute');
}
{
  const r = applySteamTailPolicy({
    units: 2.7, bandUnits: 5.4, pickDate: '2026-08-31',
    steamObservable: true, steamOnLock: true, sharpAB: true,
  });
  ok(r.action === 'HOLD' && r.units === 2.7, 'halved confirmed fat keeps current size');
}

// ── lifecycle: first-cycle steam ON is already-on, not arriving ───────────
{
  const live = { steam: { tier: 'steam' } };
  const life = resolveSteamLifecycle([], live);
  ok(life.steamOnLock && life.steamOnFirst && !life.steamArriving, 'create-cycle steam is already-on');
}
{
  const log = [{ gate: 'first', tier: null, evPct: 1, fair: -110 }];
  const life = resolveSteamLifecycle(log, { steam: { tier: 'gold' } });
  ok(life.steamArriving && life.steamOnLock && !life.steamOnFirst, 'off→on arriving');
}
{
  const log = [{ gate: 'first', tier: 'steam', evPct: 1, fair: -110 }];
  const life = resolveSteamLifecycle(log, { steam: { tier: 'steam' } });
  ok(!life.steamArriving && life.steamOnLock, 'on→on not arriving');
}

// ── Source A/B from wallet profiles ──────────────────────────────────────
{
  const profiles = new Map([
    ['aaaaaa', { bySport: { MLB: { whitelistTier: 'CONFIRMED', whitelistSource: 'A' } } }],
    ['bbbbbb', { bySport: { MLB: { whitelistTier: 'CONFIRMED', whitelistSource: 'B' } } }],
    ['ffffff', { bySport: { MLB: { whitelistTier: 'FLAT', whitelistSource: 'A' } } }],
  ]);
  const wd = [
    { side: 'home', wallet: '0xaaaaaa' },
    { side: 'home', wallet: '0xbbbbbb' },
    { side: 'away', wallet: '0xaaaaaa' },
  ];
  const ab = countSourceAbOnSide(wd, 'home', 'MLB', profiles);
  ok(ab.forA === 1 && ab.forB === 1 && ab.sharpAB, 'A+B on FOR');
  const ag = countSourceAbOnSide(wd, 'away', 'MLB', profiles);
  ok(ag.forA === 1 && ag.forB === 0 && ag.sharpAB, 'A only on AG');
  const flat = countSourceAbOnSide(
    [{ side: 'home', wallet: '0xffffff' }], 'home', 'MLB', profiles,
  );
  ok(!flat.sharpAB, 'FLAT is not Source A/B CONFIRMED');
}

{
  const profiles = new Map([
    ['aaaaaa', { bySport: { MLB: { whitelistTier: 'CONFIRMED', whitelistSource: 'A+B' } } }],
  ]);
  const r = applySteamTailPolicyFromTicket({
    units: 1,
    pickDate: '2026-08-31',
    walletDetails: [{ side: 'home', walletShort: 'aaaaaa' }],
    side: 'home',
    sport: 'MLB',
    walletProfiles: profiles,
    existingLog: [{ gate: 'first', tier: null, fair: -110, evPct: 0 }],
    liveSnap: { steam: { tier: 'steam' } },
    hasPinnGame: true,
  });
  ok(r.action === 'FLOOR' && r.units === 2 && r.sharpAB, 'from-ticket arriving floor');
}

{
  const r = applySteamTailPolicyFromTicket({
    units: 5.4,
    pickDate: '2026-08-31',
    walletDetails: [],
    existingLog: null,
    liveSnap: null,
    hasPinnGame: false,
  });
  ok(r.action === 'FAIL_OPEN' && r.units === 5.4, 'from-ticket no pinn and no log fail-open fat');
}

console.log(`ok — ${n} assertions (steam-tail policy T)`);
