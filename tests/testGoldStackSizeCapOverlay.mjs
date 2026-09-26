/**
 * GOLD-stack size cap (2026-09-26+).
 * Off-stack tickets cannot publish above 4u. Stack keeps fat.
 * Usage: node tests/testGoldStackSizeCapOverlay.mjs
 */
import assert from 'node:assert/strict';
import {
  applyGoldStackSizeCapOverlay,
  isGoldStackSizeCapLive,
  GOLD_STACK_SIZE_CAP_FROM,
  GOLD_STACK_SIZE_CAP,
  GOLD_STACK_SIZE_CAPPED_BY,
} from '../src/lib/goldStackSizeCapOverlay.js';
import { classifyGoldStack } from '../src/lib/goldStack.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n += 1;
}

function door2() { return { n: 12, wr: 63, dollarRoi: 30 }; }
function notDoor2() { return { n: 8, wr: 52, dollarRoi: 2 }; }
function hardPos() { return { n: 8, wr: 70, dollarRoi: 20 }; }
function softPos() { return { n: 10, wr: 50, dollarRoi: 1 }; }

function prof({ hard = true, proven = true } = {}) {
  return {
    bySport: {
      CFB: {
        positions: proven ? door2() : notDoor2(),
        whitelistTier: proven ? 'CONFIRMED' : 'WR50',
        byMarket: { ML: { positions: hard ? hardPos() : softPos() } },
      },
    },
  };
}

const profiles = new Map([
  ['aaaaaa', prof({ hard: true, proven: true })],
  ['bbbbbb', prof({ hard: false, proven: true })],
  ['cccccc', prof({ hard: true, proven: true })],
  ['dddddd', prof({ hard: false, proven: false })],
]);

function cap(extra = {}) {
  return applyGoldStackSizeCapOverlay({
    pickDate: '2026-09-26',
    marketType: 'ML',
    sport: 'CFB',
    side: 'away',
    walletProfiles: profiles,
    ...extra,
  });
}

ok(isGoldStackSizeCapLive('2026-09-26'), 'live on cutover');
ok(!isGoldStackSizeCapLive('2026-09-25'), 'not live before cutover');
ok(GOLD_STACK_SIZE_CAP_FROM === '2026-09-26', 'cutover date');
ok(GOLD_STACK_SIZE_CAP === 4, 'cap is 4u');
ok(GOLD_STACK_SIZE_CAPPED_BY === 'gold-stack-cap', 'cappedBy stamp');

{
  // Ball State shape: HARD FOR, proven split ~53%, RANK walked to 6u.
  const details = [
    { wallet: 'aaaaaa', side: 'away', invested: 55000 },
    { wallet: 'bbbbbb', side: 'home', invested: 49000 },
  ];
  const stack = classifyGoldStack({
    marketType: 'ML', sport: 'CFB', side: 'away',
    walletDetails: details, walletProfiles: profiles,
  });
  ok(stack.gold === false && stack.reason === 'proven_lt75', 'Ball State is not in stack');
  const r = cap({ units: 6, walletDetails: details });
  ok(r.action === 'CAP' && r.units === 4 && r.cappedBy === 'gold-stack-cap', '6u off-stack → 4u');
  ok(r.unitsPrePolicy === 6 && r.reason === 'proven_lt75', 'keeps pre units + stack reason');
}

{
  const r = cap({
    units: 6,
    walletDetails: [
      { wallet: 'aaaaaa', side: 'away', invested: 62000 },
      { wallet: 'bbbbbb', side: 'home', invested: 10000 },
    ],
  });
  ok(r.action === 'HOLD' && r.units === 6 && r.gold === true, 'stack 6u stays 6u');
  ok(r.reason === 'in_stack' && !r.cappedBy, 'no cap stamp on stack');
}

{
  const r = cap({
    units: 5.4,
    walletDetails: [
      { wallet: 'dddddd', side: 'away', invested: 90000 },
      { wallet: 'bbbbbb', side: 'home', invested: 5000 },
    ],
  });
  ok(r.action === 'CAP' && r.units === 4, 'no HARD FOR 5.4u → 4u');
  ok(r.reason === 'no_hard_for', 'reason no_hard_for');
}

{
  const r = cap({
    units: 6,
    walletDetails: [
      { wallet: 'aaaaaa', side: 'away', invested: 40000 },
      { wallet: 'cccccc', side: 'home', invested: 40000 },
    ],
  });
  ok(r.action === 'CAP' && r.units === 4 && r.reason === 'hard_ag', 'HARD AG 6u → 4u');
}

{
  const r = cap({
    units: 3,
    walletDetails: [
      { wallet: 'aaaaaa', side: 'away', invested: 20000 },
      { wallet: 'bbbbbb', side: 'home', invested: 30000 },
    ],
  });
  ok(r.action === 'HOLD' && r.units === 3, 'already ≤4u is not raised or cut');
}

{
  const r = applyGoldStackSizeCapOverlay({
    units: 6,
    pickDate: '2026-09-25',
    marketType: 'ML',
    sport: 'CFB',
    side: 'away',
    walletDetails: [{ wallet: 'dddddd', side: 'away', invested: 90000 }],
    walletProfiles: profiles,
  });
  ok(r.action === 'EXEMPT' && r.units === 6, 'pre-cutover holds size');
}

{
  const r = cap({
    units: 6,
    walletProfiles: null,
    walletDetails: [{ wallet: 'aaaaaa', side: 'away', invested: 80000 }],
  });
  ok(r.action === 'HOLD' && r.units === 6 && r.reason === 'schema_missing', 'missing profiles fail open');
}

{
  const r = cap({ units: 0, walletDetails: [] });
  ok(r.action === 'PASS' && r.units === 0, '0u passes');
}

console.log(`ok — ${n} gold-stack size-cap checks`);
