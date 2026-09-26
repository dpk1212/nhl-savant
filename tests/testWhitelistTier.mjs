/**
 * Door 2 Proven bag (2026-09-26+).
 * CONFIRMED = Source B n≥6 WR≥55 $ROI>3. A-only cannot be Proven.
 * Usage: node tests/testWhitelistTier.mjs
 */
import assert from 'assert';
import {
  WHITELIST_VERSION,
  PROVEN_B_MIN_N,
  PROVEN_B_MIN_WR,
  PROVEN_B_MIN_DOLLAR_ROI,
  classifyWhitelistTier,
  classifyWhitelistTierWithSource,
  isDoor2ConfirmedPositions,
  isConfirmedSportRec,
  isProvenSportRec,
} from '../src/lib/whitelistTier.js';
import { countConfirmedOnSide } from '../src/lib/walletClvSkill.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}
function eq(a, b, msg) {
  assert.strictEqual(a, b, msg);
  n++;
}

eq(WHITELIST_VERSION, 5, 'whitelist v5');
eq(PROVEN_B_MIN_N, 6, 'n≥6');
eq(PROVEN_B_MIN_WR, 55, 'WR≥55');
eq(PROVEN_B_MIN_DOLLAR_ROI, 3, '$ROI>3');

eq(classifyWhitelistTier({ n: 20, wr: 70, flatRoi: 40 }, { n: 0 }), 'WR50', 'A-only flat+ is WR50, not Proven');
eq(
  classifyWhitelistTier({ n: 20, wr: 70, flatRoi: 40 }, { n: 3, wr: 80, dollarRoi: 50 }),
  'WR50',
  'thin B n=3 is WR50 from A, not Proven',
);

eq(
  classifyWhitelistTier({ n: 0 }, { n: 5, wr: 80, dollarRoi: 50, positionFlatRoi: 40 }),
  'WR50',
  'B n=5 is WR50, not Proven',
);
eq(
  classifyWhitelistTier({ n: 0 }, { n: 6, wr: 54.9, dollarRoi: 20 }),
  'WR50',
  'B WR 54.9 is WR50, not Proven',
);
eq(
  classifyWhitelistTier({ n: 0 }, { n: 6, wr: 55, dollarRoi: 3 }),
  'WR50',
  '$ROI = 3 is WR50 (must be > 3)',
);
eq(
  classifyWhitelistTier({ n: 0 }, { n: 6, wr: 55, dollarRoi: 3.1, positionFlatRoi: -10 }),
  'CONFIRMED',
  'B n=6 WR55 $3.1 CONFIRMED even if flat red',
);

const srcB = classifyWhitelistTierWithSource(
  { n: 0 },
  { n: 8, wr: 60, dollarRoi: 8 },
);
eq(srcB.tier, 'CONFIRMED', 'B-only source CONFIRMED');
eq(srcB.source, 'B', 'source B');
eq(srcB.whitelistRescue, null, 'no rescue stamp');

const srcAB = classifyWhitelistTierWithSource(
  { n: 4, wr: 40, flatRoi: -5 },
  { n: 10, wr: 58, dollarRoi: 4 },
);
eq(srcAB.source, 'A+B', 'featured activity tags A+B');

eq(
  classifyWhitelistTier({ n: 8, wr: 52, flatRoi: -2 }, { n: 4, wr: 50, dollarRoi: -1 }),
  'WR50',
  'WR50 still from A or B',
);
eq(
  classifyWhitelistTier({ n: 2, wr: 100, flatRoi: 80 }, { n: 4, wr: 25, dollarRoi: -20 }),
  'WR50',
  'A WR50 does not become FLAT or CONFIRMED',
);

ok(!isDoor2ConfirmedPositions({ n: 6, wr: 55, dollarRoi: 3 }), 'exact $3 is not Door 2');
ok(isDoor2ConfirmedPositions({ n: 6, wr: 55, dollarRoi: 3.01 }), 'just over $3 is Door 2');

ok(
  !isConfirmedSportRec({
    whitelistTier: 'CONFIRMED',
    positions: { n: 20, wr: 70, dollarRoi: 1 },
  }),
  'stale CONFIRMED stamp fails when B $ is 1',
);
ok(
  isProvenSportRec({
    whitelistTier: 'FLAT',
    positions: { n: 20, wr: 70, dollarRoi: 20 },
  }),
  'Door 2 B stats beat a stale FLAT stamp',
);
ok(
  !isProvenSportRec({
    whitelistTier: 'CONFIRMED',
    positions: { n: 2, wr: 100, dollarRoi: 80 },
  }),
  'A-only / thin B stamp is not Proven',
);
ok(
  isConfirmedSportRec({ whitelistTier: 'CONFIRMED' }),
  'fixture without positions falls back to stamp',
);
ok(
  !isProvenSportRec({ whitelistTier: 'FLAT' }),
  'FLAT stamp without positions is not Proven',
);

const profiles = new Map([
  ['aaaaaa', {
    bySport: {
      MLB: {
        whitelistTier: 'CONFIRMED',
        positions: { n: 20, wr: 60, dollarRoi: 8 },
      },
    },
  }],
  ['bbbbbb', {
    bySport: {
      MLB: {
        whitelistTier: 'CONFIRMED',
        positions: { n: 20, wr: 48, dollarRoi: 12 },
      },
    },
  }],
  ['cccccc', {
    bySport: { MLB: { whitelistTier: 'CONFIRMED' } },
  }],
]);
const details = [
  { walletShort: 'aaaaaa', side: 'home' },
  { walletShort: 'bbbbbb', side: 'home' },
  { walletShort: 'cccccc', side: 'home' },
];
eq(countConfirmedOnSide(details, 'home', 'MLB', profiles), 2, 'no-CONFIRMED uses Door 2 when B book exists');

ok(
  classifyWhitelistTierWithSource(
    { n: 10, wr: 80, flatRoi: 20 },
    { n: 80, wr: 51, dollarRoi: -2 },
    { recentWindow: { ok: true }, clvSkill: { n: 80, pctPos: 70 }, sizeLiftEval: { ok: true } },
  ).tier !== 'CONFIRMED',
  'rescues do not grant CONFIRMED',
);

console.log(`ok ${n} whitelist Door 2 tests`);
