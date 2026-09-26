/**
 * GOLD hero tag = HARD+ FOR only · proven ≥75%.
 * Display-only — EDGE does not grant GOLD.
 * Usage: node tests/testGoldStack.mjs
 */
import assert from 'node:assert/strict';
import {
  GOLD_STACK_PROVEN_MIN,
  classifyGoldStack,
  goldStackProvenShare,
  goldStackTip,
  walletDetailsForGoldStack,
} from '../src/lib/goldStack.js';
import { mapLockedPickToCardFixture } from '../src/components/sharpFlow/cards/mapPositionCard.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n += 1;
}

ok(GOLD_STACK_PROVEN_MIN === 0.75, 'proven floor is 75%');

function hardPos() {
  return { n: 8, wr: 70, dollarRoi: 20 };
}
function softPos() {
  return { n: 10, wr: 50, dollarRoi: 1 };
}
function door2Pos() {
  return { n: 12, wr: 63, dollarRoi: 30 };
}
function notDoor2Pos() {
  return { n: 8, wr: 52, dollarRoi: 2 };
}

function prof({ sport = 'CFB', market = 'ML', hard = true, proven = true } = {}) {
  return {
    bySport: {
      [sport]: {
        positions: proven ? door2Pos() : notDoor2Pos(),
        whitelistTier: proven ? 'CONFIRMED' : 'WR50',
        byMarket: {
          [market]: { positions: hard ? hardPos() : softPos() },
        },
      },
    },
  };
}

const stackProf = new Map([
  ['aaaaaa', prof({ hard: true, proven: true })],
  ['bbbbbb', prof({ hard: false, proven: true })],
  ['cccccc', prof({ hard: true, proven: true })],
  ['dddddd', prof({ hard: false, proven: false })],
]);

function classify(extra = {}) {
  return classifyGoldStack({
    marketType: 'ML',
    sport: 'CFB',
    side: 'home',
    walletProfiles: stackProf,
    ...extra,
  });
}

{
  const r = classify({
    walletDetails: [
      { wallet: 'aaaaaa', side: 'home', invested: 80000 },
      { wallet: 'bbbbbb', side: 'away', invested: 10000 },
    ],
  });
  ok(r.gold === true && r.reason === 'in_stack', 'stack is GOLD');
  ok(r.hardForN === 1 && r.hardAgN === 0 && r.hardForOnly, 'HARD+ FOR only');
  ok(r.provenShare != null && r.provenShare >= 0.75, 'proven ≥75%');
  ok(goldStackTip(r).includes('HARD+ FOR only'), 'tip names the stack');
  ok(goldStackTip(r).includes('89%') || goldStackTip(r).includes('88%'), `tip shows proven pct, got ${goldStackTip(r)}`);
}

{
  const r = classify({
    walletDetails: [
      { wallet: 'dddddd', side: 'home', invested: 90000 },
      { wallet: 'bbbbbb', side: 'away', invested: 10000 },
    ],
  });
  ok(r.gold === false && r.reason === 'no_hard_for', 'no HARD FOR is not GOLD');
}

{
  const r = classify({
    walletDetails: [
      { wallet: 'aaaaaa', side: 'home', invested: 40000 },
      { wallet: 'cccccc', side: 'away', invested: 40000 },
    ],
  });
  ok(r.gold === false && r.reason === 'hard_ag', 'HARD+ AG is not GOLD');
  ok(r.hardForN === 1 && r.hardAgN === 1, 'counts both HARD sides');
}

{
  const r = classify({
    walletDetails: [
      { wallet: 'aaaaaa', side: 'home', invested: 20000 },
      { wallet: 'bbbbbb', side: 'away', invested: 30000 },
    ],
  });
  ok(r.gold === false && r.reason === 'proven_lt75', 'HARD FOR with proven <75% is not GOLD');
  ok(r.hardForOnly === true, 'still HARD+ FOR only');
  ok(r.provenShare != null && r.provenShare < 0.75, 'share under the floor');
}

{
  const r = classifyGoldStack({
    marketType: 'ML',
    sport: 'CFB',
    side: 'home',
    walletDetails: [{ wallet: 'aaaaaa', side: 'home', invested: 80000 }],
    walletProfiles: null,
  });
  ok(r.gold === false && r.reason === 'schema_missing', 'missing profiles fail closed');
}

{
  const r = classifyGoldStack({ marketType: 'PROP', sport: 'CFB', side: 'home', walletProfiles: stackProf });
  ok(r.gold === false && r.reason === 'market_exempt', 'non ML/S/T is not GOLD');
}

{
  const share = goldStackProvenShare(
    [
      { wallet: 'aaaaaa', side: 'home', invested: 75000 },
      { wallet: 'bbbbbb', side: 'away', invested: 25000 },
    ],
    'home',
    'CFB',
    stackProf,
  );
  ok(Math.abs(share.shareP - 0.75) < 1e-9, 'exact 75% counts');
  const r = classify({
    walletDetails: [
      { wallet: 'aaaaaa', side: 'home', invested: 75000 },
      { wallet: 'bbbbbb', side: 'away', invested: 25000 },
    ],
  });
  ok(r.gold === true, 'proven 75% inclusive is GOLD');
}

{
  ok(walletDetailsForGoldStack({ boardWallets: [{ wallet: 'x' }] })[0].wallet === 'x', 'prefers boardWallets');
  ok(walletDetailsForGoldStack({ walletDetails: [{ wallet: 'y' }] })[0].wallet === 'y', 'falls back to walletDetails');
  ok(walletDetailsForGoldStack({ v8Scoring: { walletDetails: [{ wallet: 'z' }] } })[0].wallet === 'z', 'falls back to v8');
}

const profiles = stackProf;
function card(pickExtra = {}, edge = 14) {
  return mapLockedPickToCardFixture({
    key: '2026-09-26_CFB_miss_fla_ml:home',
    sport: 'CFB',
    gameKey: 'miss_fla',
    marketType: 'ml',
    side: 'home',
    pickSide: 'home',
    team: 'Florida',
    odds: -160,
    units: 5.4,
    winnerAlignEdge: edge,
    book: 'Pinnacle',
    gameTime: Date.now() + (3 * 60 * 60 * 1000),
    status: 'PENDING',
    away: 'Missouri',
    home: 'Florida',
    boardWallets: [
      { wallet: 'aaaaaa', side: 'home', invested: 62000 },
      { wallet: 'bbbbbb', side: 'away', invested: 10000 },
    ],
    ...pickExtra,
  }, { walletProfiles: profiles });
}

{
  const f = card();
  ok(f.goldStack === true, 'mapped stack ticket is GOLD');
  ok(f.goldStackReason === 'in_stack', 'mapped reason in_stack');
  ok(typeof f.goldStackTip === 'string' && f.goldStackTip.includes('HARD+ FOR'), 'mapped tip');
  ok(f.edge === 14, 'EDGE is still stamped for the meter');
}

{
  const f = card({
    boardWallets: [
      { wallet: 'dddddd', side: 'home', invested: 90000 },
      { wallet: 'bbbbbb', side: 'away', invested: 5000 },
    ],
    winnerAlignEdge: 18,
  }, 18);
  ok(f.edge === 18, 'high EDGE is present');
  ok(f.goldStack === false, 'high EDGE without the stack is not GOLD');
  ok(f.goldStackReason === 'no_hard_for', 'mapped reason no_hard_for');
}

{
  const f = mapLockedPickToCardFixture({
    key: '2026-09-26_CFB_bsu_kent_ml:away',
    sport: 'CFB',
    gameKey: 'bsu_kent',
    marketType: 'ml',
    side: 'away',
    pickSide: 'away',
    team: 'Ball State',
    odds: 128,
    units: 6,
    winnerAlignEdge: 16,
    book: 'Pinnacle',
    gameTime: Date.now() + (60 * 60 * 1000),
    status: 'PENDING',
    away: 'Ball State',
    home: 'Kent State',
    boardWallets: [
      { wallet: 'aaaaaa', side: 'away', invested: 55000 },
      { wallet: 'bbbbbb', side: 'home', invested: 49000 },
    ],
  }, { walletProfiles: profiles });
  ok(f.goldStack === false, '53% proven board is not GOLD even with HARD FOR + high EDGE');
  ok(f.goldStackReason === 'proven_lt75', `got ${f.goldStackReason}`);
}

console.log(`ok — ${n} gold-stack checks`);
