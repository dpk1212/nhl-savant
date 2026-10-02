/**
 * HARD+ margin size floor (2026-09-30+).
 * Unique HARD margin (FOR−AG) ≥ +1 and ≥1 HARD FOR at ≥1.0× → 2u floor.
 * 2 HARD FOR all-lean (Steelers 0.87× / 0.96×) does not size-clear.
 * Usage: node tests/testHardUnoppFloorOverlay.mjs
 */
import assert from 'node:assert/strict';
import {
  applyHardUnoppFloorOverlay,
  isHardUnoppFloorLive,
  hardUnoppFloorUnits,
  HARD_UNOPP_FLOOR_FROM,
  HARD_UNOPP_FLOOR_U,
  HARD_UNOPP_CAP_U,
  HARD_UNOPP_MIN_SR,
  HARD_UNOPP_FLOORED_BY,
  HARD_UNOPP_STAKE_TIER,
  HARD_UNOPP_RESTORE_MUTES,
} from '../src/lib/hardUnoppFloorOverlay.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n += 1;
}

function hardPos() {
  return { n: 8, wr: 70, dollarRoi: 20, invested: 5000 };
}
function softPos() {
  return { n: 10, wr: 50, dollarRoi: 1, invested: 4000 };
}

function prof({ hard = true, invested = 5000, nBets = 10 } = {}) {
  return {
    bySport: {
      MLB: {
        positions: { n: nBets, invested, wr: 60, dollarRoi: 12 },
        whitelistTier: 'CONFIRMED',
        byMarket: {
          ML: { positions: hard ? hardPos() : softPos() },
          TOTAL: { positions: hard ? hardPos() : softPos() },
          SPREAD: { positions: hard ? hardPos() : softPos() },
        },
      },
    },
  };
}

// usual = 500. 650 = 1.3×. 400 = 0.8×.
const profiles = new Map([
  ['aaaaaa', prof({ hard: true })],
  ['bbbbbb', prof({ hard: true })],
  ['cccccc', prof({ hard: false })],
  ['dddddd', prof({ hard: true })],
]);

function floor(extra = {}) {
  return applyHardUnoppFloorOverlay({
    pickDate: '2026-09-30',
    marketType: 'TOTAL',
    sport: 'MLB',
    side: 'under',
    walletProfiles: profiles,
    units: 0,
    ...extra,
  });
}

function under13() {
  return [{ wallet: 'aaaaaa', side: 'under', invested: 650 }];
}

ok(isHardUnoppFloorLive('2026-09-30'), 'live on cutover');
ok(!isHardUnoppFloorLive('2026-09-29'), 'not live before cutover');
ok(HARD_UNOPP_FLOOR_FROM === '2026-09-30', 'cutover date');
ok(HARD_UNOPP_FLOOR_U === 2 && HARD_UNOPP_CAP_U === 4, '2u floor / 4u cap');
ok(HARD_UNOPP_MIN_SR === 1.0, 'full-size bar is 1.0×');
ok(HARD_UNOPP_FLOORED_BY === 'hard-unopp-hold', 'flooredBy stamp');
ok(HARD_UNOPP_STAKE_TIER === 'HARD-UNOPP', 'MONITORING promote tier');
ok(HARD_UNOPP_RESTORE_MUTES.has('board-share'), 'board-share is on the restore set');
ok(!HARD_UNOPP_RESTORE_MUTES.has('ev-lt2-no-steam'), 'EV mute still skipped');
ok(hardUnoppFloorUnits(0, 0) === 2, 'native 0 → 2');
ok(hardUnoppFloorUnits(1, 0) === 2, 'live 1 → 2');
ok(hardUnoppFloorUnits(0, 3) === 3, 'muted 3 → 3');
ok(hardUnoppFloorUnits(0, 6) === 4, 'muted 6 → 4 cap');

{
  const r = floor({ walletDetails: under13() });
  ok(r.action === 'FLOOR' && r.units === 2 && r.flooredBy === 'hard-unopp-hold', 'Padres/Cubs Under shape → 2u');
  ok(r.reason === 'hard_margin_full' && r.hardForN === 1 && r.hardAgN === 0 && r.fullN === 1, '1-0 full');
  ok(r.unitsPrePolicy === 0, 'pre was 0');
}

{
  const r = floor({
    pickDate: '2026-09-29',
    walletDetails: under13(),
  });
  ok(r.action === 'EXEMPT' && r.units === 0, 'pre-cutover sealed');
}

{
  const r = floor({
    walletDetails: [{ wallet: 'aaaaaa', side: 'under', invested: 400 }],
  });
  ok(r.action === 'HOLD' && r.units === 0 && r.reason === 'no_full_size', '0.8× is not full');
}

{
  const r = floor({
    walletDetails: [
      { wallet: 'aaaaaa', side: 'under', invested: 650 },
      { wallet: 'bbbbbb', side: 'over', invested: 650 },
    ],
  });
  ok(r.action === 'HOLD' && r.units === 0 && r.reason === 'margin_lt_1', '1-1 does not invent');
}

{
  const r = applyHardUnoppFloorOverlay({
    pickDate: '2026-09-30',
    marketType: 'ML',
    sport: 'MLB',
    side: 'away',
    walletProfiles: profiles,
    units: 0,
    walletDetails: [
      { wallet: 'aaaaaa', side: 'away', invested: 650 },
      { wallet: 'bbbbbb', side: 'home', invested: 650 },
      { wallet: 'cccccc', side: 'home', invested: 400 },
    ],
  });
  ok(r.action === 'HOLD' && r.units === 0 && r.margin < 1, 'Padres ML 1-1 HARD stays 0');
}

{
  const r = applyHardUnoppFloorOverlay({
    pickDate: '2026-09-30',
    marketType: 'ML',
    sport: 'MLB',
    side: 'away',
    walletProfiles: profiles,
    units: 0,
    walletDetails: [
      { wallet: 'aaaaaa', side: 'away', invested: 650 },
      { wallet: 'bbbbbb', side: 'away', invested: 650 },
      { wallet: 'cccccc', side: 'home', invested: 400 },
    ],
  });
  ok(r.action === 'FLOOR' && r.units === 2 && r.margin === 2, '2-0 floors');
}

{
  const r = applyHardUnoppFloorOverlay({
    pickDate: '2026-09-30',
    marketType: 'ML',
    sport: 'MLB',
    side: 'away',
    walletProfiles: profiles,
    units: 0,
    walletDetails: [
      { wallet: 'aaaaaa', side: 'away', invested: 650 },
      { wallet: 'dddddd', side: 'away', invested: 650 },
      { wallet: 'bbbbbb', side: 'home', invested: 400 },
    ],
  });
  ok(r.action === 'FLOOR' && r.units === 2 && r.margin === 1 && r.hardAgN === 1, '2-1 margin +1 floors');
}

{
  const r = floor({
    walletDetails: [{ wallet: 'cccccc', side: 'under', invested: 650 }],
  });
  ok(r.action === 'HOLD' && r.units === 0 && r.reason === 'no_hard_for', 'soft specialist is not HARD+');
}

{
  const r = floor({
    mutedBy: 'steam-tail',
    unitsPreMute: 1.5,
    walletDetails: under13(),
  });
  ok(r.action === 'FLOOR' && r.units === 2, 'steam-tail 1-0 full → 2u (mid, not lean)');
}

{
  const r = floor({
    mutedBy: 'believed-cut',
    unitsPreMute: 3,
    walletDetails: under13(),
  });
  ok(r.action === 'FLOOR' && r.units === 3, 'leftover 3u restores 3 not 2');
}

{
  const r = floor({
    mutedBy: 'st-qual-wipe',
    unitsPreMute: 2,
    walletDetails: under13(),
  });
  ok(r.action === 'FLOOR' && r.units === 2, 'market-skill S/T wipe restores');
}

{
  const r = floor({
    mutedBy: 'ev-drift-edge',
    unitsPreMute: 3,
    walletDetails: under13(),
  });
  ok(r.action === 'HOLD' && r.units === 0 && r.reason === 'mute_not_excepted', 'ev-drift stays muted');
}

{
  const r = floor({
    mutedBy: 'fav-juice',
    unitsPreMute: 2,
    walletDetails: under13(),
  });
  ok(r.action === 'HOLD' && r.units === 0, 'fav-juice stays muted');
}

{
  const r = floor({
    mutedBy: 'ev-lt2-no-steam',
    unitsPreMute: 2,
    walletDetails: under13(),
  });
  ok(r.action === 'HOLD' && r.units === 0 && r.reason === 'mute_not_excepted',
    'unit-tier EV mute stays muted');
}

{
  const r = applyHardUnoppFloorOverlay({
    pickDate: '2026-10-01',
    marketType: 'ML',
    sport: 'MLB',
    side: 'away',
    walletProfiles: profiles,
    units: 0,
    mutedBy: 'board-share',
    unitsPreMute: 2,
    walletDetails: [{ wallet: 'aaaaaa', side: 'away', invested: 650 }],
  });
  ok(r.action === 'FLOOR' && r.units === 2 && r.flooredBy === 'hard-unopp-hold',
    'Steelers ML board-share 1-0 full punches through');
}

{
  const r = applyHardUnoppFloorOverlay({
    pickDate: '2026-10-01',
    marketType: 'ML',
    sport: 'MLB',
    side: 'away',
    walletProfiles: profiles,
    units: 0,
    mutedBy: 'board-share',
    unitsPreMute: 2,
    walletDetails: [
      { wallet: 'aaaaaa', side: 'away', invested: 650 },
      { wallet: 'bbbbbb', side: 'home', invested: 650 },
    ],
  });
  ok(r.action === 'HOLD' && r.units === 0 && r.reason === 'margin_lt_1',
    'board-share 1-1 still does not invent');
}

{
  const r = floor({
    units: 3,
    walletDetails: under13(),
  });
  ok(r.action === 'PASS' && r.units === 3, 'already ≥2u is not resized');
}

{
  const r = floor({
    units: 1,
    walletDetails: under13(),
  });
  ok(r.action === 'FLOOR' && r.units === 2, 'live lean 1u bumps to 2u');
}

{
  const r = applyHardUnoppFloorOverlay({
    pickDate: '2026-09-30',
    marketType: 'ML',
    sport: 'MLB',
    side: 'away',
    walletProfiles: profiles,
    units: 0,
    walletDetails: [{ wallet: 'aaaaaa', side: 'away', invested: 650 }],
  });
  ok(r.action === 'FLOOR' && r.units === 2, 'ML 1-0 full also floors');
}

{
  const r = floor({
    walletDetails: [
      { wallet: 'aaaaaa', side: 'under', invested: 650 },
      { wallet: 'bbbbbb', side: 'under', invested: 650 },
    ],
  });
  ok(r.action === 'FLOOR' && r.units === 2 && r.hardForN === 2, '2-0 MONITORING also floors 2u');
}

{
  const r = floor({
    walletProfiles: null,
    walletDetails: under13(),
  });
  ok(r.action === 'HOLD' && r.units === 0 && r.reason === 'schema_missing', 'fail-open does not invent');
}

{
  const r = floor({ marketType: 'PLAYER_PROP', walletDetails: under13() });
  ok(r.action === 'EXEMPT' && r.units === 0, 'non board market exempt');
}

{
  const r = applyHardUnoppFloorOverlay({
    pickDate: '2026-10-01',
    marketType: 'ML',
    sport: 'MLB',
    side: 'away',
    walletProfiles: profiles,
    units: 0,
    mutedBy: 'believed-cut',
    unitsPreMute: 2,
    walletDetails: [
      { wallet: 'aaaaaa', side: 'away', invested: 435 },
      { wallet: 'bbbbbb', side: 'away', invested: 480 },
    ],
  });
  ok(r.action === 'HOLD' && r.units === 0 && r.reason === 'no_full_size',
    'Steelers 2 HARD FOR at 0.87× / 0.96× stays 0u');
  ok(r.hardForN === 2 && r.fullN === 0 && r.leanN === 2 && r.margin === 2, '2-0 lean, no full');
}

{
  const r = floor({
    walletDetails: [
      { wallet: 'aaaaaa', side: 'under', invested: 300 },
      { wallet: 'bbbbbb', side: 'under', invested: 300 },
    ],
  });
  ok(r.action === 'HOLD' && r.reason === 'no_full_size' && r.units === 0,
    '2 HARD FOR at 0.6× / 0.6× stays 0u');
}

{
  const r = floor({
    walletDetails: [
      { wallet: 'aaaaaa', side: 'under', invested: 250 },
      { wallet: 'bbbbbb', side: 'under', invested: 250 },
    ],
  });
  ok(r.action === 'HOLD' && r.reason === 'no_full_size' && r.leanN === 2,
    '2 HARD FOR at exactly 0.5× stays 0u');
}

{
  const r = floor({
    walletDetails: [
      { wallet: 'aaaaaa', side: 'under', invested: 200 },
      { wallet: 'bbbbbb', side: 'under', invested: 450 },
    ],
  });
  ok(r.action === 'HOLD' && r.reason === 'no_full_size' && r.leanN === 1,
    '2 HARD FOR but only one ≥0.5× stays 0u');
}

{
  const r = floor({
    walletDetails: [{ wallet: 'aaaaaa', side: 'under', invested: 300 }],
  });
  ok(r.action === 'HOLD' && r.reason === 'no_full_size' && r.hardForN === 1,
    '1 HARD FOR at 0.6× is not enough');
}

{
  const r = applyHardUnoppFloorOverlay({
    pickDate: '2026-10-01',
    marketType: 'ML',
    sport: 'MLB',
    side: 'away',
    walletProfiles: profiles,
    units: 0,
    mutedBy: 'board-share',
    walletDetails: [
      { wallet: 'aaaaaa', side: 'away', invested: 300 },
      { wallet: 'dddddd', side: 'away', invested: 300 },
      { wallet: 'bbbbbb', side: 'home', invested: 300 },
    ],
  });
  ok(r.action === 'HOLD' && r.reason === 'no_full_size' && r.margin === 1 && r.leanN === 2,
    '2-1 both ≥0.5× does not floor through board-share');
}

console.log(`ok ${n} hard-unopp-floor checks`);
