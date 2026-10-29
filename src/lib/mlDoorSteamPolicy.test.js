import assert from 'node:assert/strict';
import test from 'node:test';
import {
  applyMlDoorSteamPolicy,
  classifyMlDoorTiming,
  mlDoorIsGold,
  mlDoorSteamOn,
} from './mlDoorSteamPolicy.js';

const DAY = '2026-10-29';

function row(over) {
  return {
    gate: 'hourly',
    tier: 'flat',
    lastHourPct: null,
    sinceOpenPct: null,
    goldConfirmed: false,
    juiceSteam: null,
    ...over,
  };
}

const FIRST_OFF = row({ gate: 'first', tier: 'flat', sinceOpenPct: 0 });
const FIRST_ON = row({ gate: 'first', tier: 'steam', sinceOpenPct: 3.2 });
const LOCK_OFF = row({ gate: 't15', tier: 'flat', sinceOpenPct: 0.4 });
const LOCK_GOLD = row({ gate: 't15', tier: 'gold', sinceOpenPct: 5.1 });
const LOCK_STEAM = row({ gate: 't15', tier: 'steam', sinceOpenPct: 3.4 });

function apply(over) {
  return applyMlDoorSteamPolicy({
    units: 2,
    sport: 'NBA',
    marketType: 'ML',
    odds: -150,
    pickDate: DAY,
    door2For: 1,
    door2Ag: 0,
    door2Known: true,
    tapeLog: [FIRST_ON, LOCK_GOLD],
    pressGateMuted: false,
    ...over,
  });
}

test('steam-on ignores a walk when juice is explicitly off', () => {
  assert.equal(mlDoorSteamOn(row({ juiceSteam: false, tier: 'gold', sinceOpenPct: 6 })), false);
  assert.equal(mlDoorIsGold(row({ juiceSteam: false, tier: 'gold', sinceOpenPct: 6 })), false);
  assert.equal(mlDoorSteamOn(row({ tier: 'steam', sinceOpenPct: 3 })), true);
  assert.equal(mlDoorIsGold(row({ tier: 'steam', sinceOpenPct: 4.5 })), true);
  assert.equal(mlDoorIsGold(row({ tier: 'steam', sinceOpenPct: 3.2 })), false);
});

test('timing: already gold, never, fade, and no tape', () => {
  assert.equal(classifyMlDoorTiming([FIRST_ON, LOCK_GOLD]), 'already_gold');
  assert.equal(classifyMlDoorTiming([FIRST_ON, LOCK_STEAM]), 'already_steam');
  assert.equal(classifyMlDoorTiming([FIRST_OFF, LOCK_GOLD]), 'arriving_gold');
  assert.equal(classifyMlDoorTiming([FIRST_OFF, LOCK_OFF]), 'never');
  assert.equal(classifyMlDoorTiming([FIRST_ON, LOCK_OFF]), 'faded');
  assert.equal(classifyMlDoorTiming([]), null);
  assert.equal(classifyMlDoorTiming(null, LOCK_GOLD), null);
  assert.equal(
    classifyMlDoorTiming([FIRST_ON, LOCK_GOLD], { evPct: 1, steam: null }),
    'already_gold',
  );
});

test('boost +1u on a favorite with Door-2 margin +1 or +2 already gold', () => {
  assert.equal(apply().action, 'boost');
  assert.equal(apply().units, 3);
  assert.equal(apply({ door2For: 3, door2Ag: 1 }).units, 3);
  assert.equal(apply({ units: 5.5 }).units, 6);
  assert.equal(apply({ units: 6 }).action, 'hold');
});

test('boost does not fire on dogs, margin +3, 3% steam, fades, or other markets', () => {
  assert.equal(apply({ odds: 130 }).action, 'hold');
  assert.equal(apply({ door2For: 4, door2Ag: 1 }).action, 'hold');
  assert.equal(apply({ tapeLog: [FIRST_ON, LOCK_STEAM] }).action, 'hold');
  assert.equal(apply({ tapeLog: [FIRST_OFF, LOCK_GOLD] }).action, 'hold');
  assert.equal(apply({ tapeLog: [FIRST_ON, LOCK_OFF] }).action, 'hold');
  assert.equal(apply({ marketType: 'SPREAD' }).action, 'skip');
  assert.equal(apply({ sport: 'MLB' }).action, 'skip');
  assert.equal(apply({ pickDate: '2026-10-28' }).action, 'skip');
  assert.equal(apply({ door2Known: false }).action, 'skip');
  assert.equal(apply({ manualStake: true }).action, 'skip');
});

test('cut to 0u: never, Door-2 margin exactly +1, price under +200', () => {
  const cut = apply({
    units: 2.5,
    odds: 150,
    tapeLog: [FIRST_OFF, LOCK_OFF],
  });
  assert.equal(cut.action, 'cut');
  assert.equal(cut.units, 0);
  assert.equal(cut.mutedBy, 'ml-door-never');
  assert.equal(apply({
    units: 3,
    odds: -110,
    door2For: 2,
    door2Ag: 0,
    tapeLog: [FIRST_OFF, LOCK_OFF],
  }).action, 'hold');
  assert.equal(apply({
    units: 1,
    odds: 200,
    tapeLog: [FIRST_OFF, LOCK_OFF],
  }).action, 'hold');
  assert.equal(apply({
    units: 1,
    odds: null,
    tapeLog: [FIRST_OFF, LOCK_OFF],
  }).action, 'hold');
  assert.equal(apply({
    units: 1,
    tapeLog: [FIRST_ON, LOCK_OFF],
  }).action, 'hold');
});

test('rescue 1u only for a press-gate favorite, never, Door-2 even or +2', () => {
  const even = apply({
    units: 0,
    door2For: 0,
    door2Ag: 0,
    tapeLog: [FIRST_OFF, LOCK_OFF],
    pressGateMuted: true,
  });
  assert.equal(even.action, 'rescue');
  assert.equal(even.units, 1);
  assert.equal(even.rescuedBy, 'ml-door-rescue');
  assert.equal(apply({
    units: 0,
    door2For: 2,
    door2Ag: 0,
    tapeLog: [FIRST_OFF, LOCK_OFF],
    pressGateMuted: true,
  }).action, 'rescue');
  assert.equal(apply({
    units: 0,
    door2For: 1,
    door2Ag: 0,
    tapeLog: [FIRST_OFF, LOCK_OFF],
    pressGateMuted: true,
  }).action, 'hold');
  assert.equal(apply({
    units: 0,
    door2For: 0,
    door2Ag: 0,
    tapeLog: [FIRST_OFF, LOCK_OFF],
    pressGateMuted: false,
  }).action, 'hold');
  assert.equal(apply({
    units: 0,
    odds: 140,
    door2For: 0,
    door2Ag: 0,
    tapeLog: [FIRST_OFF, LOCK_OFF],
    pressGateMuted: true,
  }).action, 'hold');
  assert.equal(apply({
    units: 2,
    door2For: 0,
    door2Ag: 0,
    tapeLog: [FIRST_OFF, LOCK_OFF],
    pressGateMuted: false,
  }).action, 'hold');
});
