/**
 * HARD+ counts in v12 presence on THIS market only.
 * Door 2 sport OR HARD+ on ticket market → hydrate / no-CONFIRMED / v11 Proven.
 * Not sport CONFIRMED (v12 quality / HC / Q1 stay Door 2).
 * Usage: node tests/testMarketProvenCarve.mjs
 */
import assert from 'assert';
import {
  buildIsProvenFn,
  walletHoldsNoConfirmedOnMarket,
  walletHydratesOnScanMarket,
} from '../src/lib/marketProvenCarve.js';
import { countConfirmedOnSide } from '../src/lib/walletClvSkill.js';
import { isConfirmedSportRec, isProvenSportRec } from '../src/lib/whitelistTier.js';
import { agsV12WalletQuality, aggregateSideProven, positionToWalletDetail } from '../src/lib/ags.js';
import { collectScanBoardProvenPositions } from '../scripts/lib/hydrateLivePositionsFromScan.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}
function eq(a, b, msg) {
  assert.strictEqual(a, b, msg);
  n++;
}

function pos(nBets, wr, dollarRoi) {
  return { n: nBets, wr, dollarRoi };
}

function hardMlNotDoor2() {
  return {
    bySport: {
      MLB: {
        whitelistTier: 'WR50',
        positions: { n: 8, wr: 48, dollarRoi: -9 },
        byMarket: {
          ML: { positions: pos(5, 70, 18) },
          SPREAD: { positions: pos(4, 40, -12) },
        },
      },
    },
  };
}

function door2NoHard() {
  return {
    bySport: {
      MLB: {
        whitelistTier: 'CONFIRMED',
        positions: { n: 20, wr: 60, dollarRoi: 8 },
        byMarket: {
          ML: { positions: pos(10, 50, 2) },
        },
      },
    },
  };
}

const profiles = new Map([
  ['hardml', hardMlNotDoor2()],
  ['door2x', door2NoHard()],
]);

ok(!isProvenSportRec(hardMlNotDoor2().bySport.MLB), 'losing sport book is not Door 2');
ok(!isConfirmedSportRec(hardMlNotDoor2().bySport.MLB), 'HARD+ ML kid is not sport CONFIRMED');
ok(isProvenSportRec(door2NoHard().bySport.MLB), 'Door 2 still Proven');

ok(walletHoldsNoConfirmedOnMarket(hardMlNotDoor2(), 'MLB', 'ML'), 'HARD+ ML holds no-CONFIRMED on ML');
ok(!walletHoldsNoConfirmedOnMarket(hardMlNotDoor2(), 'MLB', 'SPREAD'), 'HARD+ ML does not hold SPREAD');
ok(!walletHoldsNoConfirmedOnMarket(hardMlNotDoor2(), 'MLB', null), 'missing market fail-closed');
ok(walletHoldsNoConfirmedOnMarket(door2NoHard(), 'MLB', 'SPREAD'), 'Door 2 holds any market');
ok(walletHoldsNoConfirmedOnMarket(door2NoHard(), 'MLB', null), 'Door 2 holds even without market');

ok(walletHydratesOnScanMarket(hardMlNotDoor2(), 'MLB', 'ML'), 'hydrate HARD+ on ML scan');
ok(!walletHydratesOnScanMarket(hardMlNotDoor2(), 'MLB', 'SPREAD'), 'do not hydrate HARD+ ML onto SPREAD scan');
ok(walletHydratesOnScanMarket(door2NoHard(), 'MLB', 'SPREAD'), 'hydrate Door 2 on every market');

const isProven = buildIsProvenFn(profiles);
ok(isProven('door2x', 'MLB', { marketType: 'ML', sizeRatio: 0.4 }), 'Door 2 Proven without HARD');
ok(isProven('hardml', 'MLB', { marketType: 'ML', sizeRatio: 0.4 }), 'HARD+ ML is Proven on ML');
ok(!isProven('hardml', 'MLB', { marketType: 'SPREAD' }), 'HARD+ ML is not Proven on SPREAD');
ok(!isProven('hardml', 'MLB', {}), 'HARD+ fail-closed without marketType');
ok(!isProven('hardml', 'NBA', { marketType: 'ML' }), 'wrong sport');

eq(
  countConfirmedOnSide(
    [{ side: 'home', walletShort: 'hardml', marketType: 'ML' }],
    'home', 'MLB', profiles,
  ),
  1,
  'no-CONFIRMED counts HARD+ from detail.marketType',
);
eq(
  countConfirmedOnSide(
    [{ side: 'home', walletShort: 'hardml', marketType: 'SPREAD' }],
    'home', 'MLB', profiles,
  ),
  0,
  'no-CONFIRMED ignores HARD+ on the other market',
);
eq(
  countConfirmedOnSide(
    [{ side: 'home', walletShort: 'hardml' }],
    'home', 'MLB', profiles, 'ML',
  ),
  1,
  'no-CONFIRMED 5th-arg marketType counts HARD+',
);
eq(
  countConfirmedOnSide(
    [{ side: 'home', walletShort: 'hardml' }],
    'home', 'MLB', profiles,
  ),
  0,
  'no-CONFIRMED fail-closed when neither arg nor detail has market',
);
eq(
  countConfirmedOnSide(
    [{ side: 'home', walletShort: 'door2x' }],
    'home', 'MLB', profiles,
  ),
  1,
  'Door 2 still holds no-CONFIRMED without marketType',
);

const stamped = positionToWalletDetail({
  walletShort: 'hardml',
  side: 'home',
  invested: 100,
  avgSportBet: 50,
  marketType: 'ML',
});
eq(stamped.marketType, 'ML', 'positionToWalletDetail stamps marketType');
ok(isProven(stamped.wallet, 'MLB', stamped), 'stamped ML detail is Proven via HARD+');

const aggMl = aggregateSideProven(
  [
    { wallet: 'hardml', side: 'home', marketType: 'ML', sizeRatio: 1, contribution: 50, convictionMult: 1, rankNorm: 0 },
    { wallet: 'door2x', side: 'home', marketType: 'ML', sizeRatio: 1, contribution: 50, convictionMult: 1, rankNorm: 0 },
  ],
  'home',
  'MLB',
  isProven,
);
eq(aggMl.forCount, 2, 'v11 dCount includes Door 2 + HARD+ on this market');

const aggSpread = aggregateSideProven(
  [
    { wallet: 'hardml', side: 'home', marketType: 'SPREAD', sizeRatio: 1, contribution: 50, convictionMult: 1, rankNorm: 0 },
    { wallet: 'door2x', side: 'home', marketType: 'SPREAD', sizeRatio: 1, contribution: 50, convictionMult: 1, rankNorm: 0 },
  ],
  'home',
  'MLB',
  isProven,
);
eq(aggSpread.forCount, 1, 'v11 dCount on SPREAD is Door 2 only — not the ML HARD+ wallet');

eq(
  agsV12WalletQuality({
    tier: 'WR50',
    priorN: 8,
    priorRoi: 18,
    sizeRatio: 1.2,
  }),
  0,
  'v12 quality still 0 for non-CONFIRMED/FLAT (HARD+ does not enter the score)',
);
ok(
  agsV12WalletQuality({
    tier: 'CONFIRMED',
    priorN: 20,
    priorRoi: 10,
    sizeRatio: 1.2,
  }) > 0,
  'Door 2 CONFIRMED still scores v12 quality',
);

{
  const scan = collectScanBoardProvenPositions({
    posFiles: [
      {
        mkt: 'ML',
        data: {
          MLB: {
            a_b: {
              away: 'A',
              home: 'B',
              positions: [
                { wallet: '0xhardml', side: 'home', invested: 500, avgSportBet: 100 },
              ],
            },
          },
        },
      },
      {
        mkt: 'SPREAD',
        data: {
          MLB: {
            a_b: {
              away: 'A',
              home: 'B',
              positions: [
                { wallet: '0xhardml', side: 'home', invested: 500, avgSportBet: 100 },
              ],
            },
          },
        },
      },
    ],
    walletProfiles: profiles,
    date: '2026-10-02',
  });
  const ml = scan.filter((r) => r.marketType === 'ML');
  const sp = scan.filter((r) => r.marketType === 'SPREAD');
  eq(ml.length, 1, 'hydrate collects HARD+ on ML scan');
  eq(sp.length, 0, 'hydrate skips HARD+ ML wallet on SPREAD scan');
}

console.log(`ok ${n} market Proven carve tests`);
