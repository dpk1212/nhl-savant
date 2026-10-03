/**
 * HARD+ counts in v12 on THIS market only.
 * Door 2 sport OR HARD+ on ticket market → hydrate / no-CONFIRMED / v11 Proven /
 * v12 quality (market book). Not sport CONFIRMED (HC / Q1 stay Door 2).
 * Usage: node tests/testMarketProvenCarve.mjs
 */
import assert from 'assert';
import {
  buildIsProvenFn,
  buildWalletPriorStatsFn,
  walletHoldsNoConfirmedOnMarket,
  walletHydratesOnScanMarket,
  walletPriorStatsForV12,
} from '../src/lib/marketProvenCarve.js';
import { countConfirmedOnSide } from '../src/lib/walletClvSkill.js';
import { isConfirmedSportRec, isProvenSportRec } from '../src/lib/whitelistTier.js';
import {
  agsV12WalletQuality,
  aggregateSideProven,
  aggregateSideV12,
  positionToWalletDetail,
} from '../src/lib/ags.js';
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

function door2AndHardMl() {
  return {
    bySport: {
      MLB: {
        whitelistTier: 'CONFIRMED',
        positions: { n: 20, wr: 60, dollarRoi: 8, positionFlatRoi: 8 },
        byMarket: {
          ML: { positions: pos(6, 75, 22) },
          SPREAD: { positions: pos(8, 50, 2) },
        },
      },
    },
  };
}

const profiles = new Map([
  ['hardml', hardMlNotDoor2()],
  ['door2x', door2NoHard()],
  ['d2hard', door2AndHardMl()],
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
  'WR50 sport still scores 0 v12 quality',
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
ok(
  agsV12WalletQuality({
    tier: 'HARD+',
    priorN: 5,
    priorRoi: 18,
    sizeRatio: 1.2,
  }) > 0,
  'HARD+ tier scores v12 quality from the market book',
);

const priorFn = buildWalletPriorStatsFn(profiles);
const hardMlStats = walletPriorStatsForV12(hardMlNotDoor2(), 'MLB', 'ML');
eq(hardMlStats?.tier, 'HARD+', 'HARD+ ML kid gets HARD+ prior tier');
eq(hardMlStats?.priorN, 5, 'HARD+ quality n is the market book, not the sport 8');
eq(hardMlStats?.priorSource, 'B-market', 'HARD+ quality source is B-market');
ok(hardMlStats?.priorRoi > 0, 'HARD+ quality ROI comes from the market book');
eq(
  walletPriorStatsForV12(hardMlNotDoor2(), 'MLB', 'SPREAD')?.tier,
  'WR50',
  'HARD+ ML does not lend quality to SPREAD',
);
eq(
  walletPriorStatsForV12(hardMlNotDoor2(), 'MLB', null)?.tier,
  'WR50',
  'HARD+ quality fail-closed without marketType',
);
eq(
  walletPriorStatsForV12(door2NoHard(), 'MLB', 'ML')?.tier,
  'CONFIRMED',
  'Door 2 and not HARD+ here still uses the sport book',
);
eq(
  walletPriorStatsForV12(door2NoHard(), 'MLB', 'ML')?.priorN,
  20,
  'Door 2-not-HARD+ priorN is the sport book',
);

{
  const both = walletPriorStatsForV12(door2AndHardMl(), 'MLB', 'ML');
  eq(both?.tier, 'HARD+', 'Door 2 + HARD+ on ML uses HARD+ prior tier');
  eq(both?.priorN, 6, 'Door 2 + HARD+ on ML uses market n, not sport 20');
  eq(both?.priorSource, 'B-market', 'Door 2 + HARD+ prior source is B-market');
  ok((both?.priorRoi || 0) >= 22, 'Door 2 + HARD+ ROI comes from the market book');
  const sp = walletPriorStatsForV12(door2AndHardMl(), 'MLB', 'SPREAD');
  eq(sp?.tier, 'CONFIRMED', 'Door 2 + HARD+ ML stays sport book on SPREAD');
  eq(sp?.priorN, 20, 'non-HARD+ market keeps sport n');
  eq(
    walletPriorStatsForV12(door2AndHardMl(), 'MLB', null)?.tier,
    'CONFIRMED',
    'Door 2 + HARD+ fail-closed to sport book without marketType',
  );
}
eq(
  priorFn('hardml', 'MLB', { marketType: 'ML' })?.tier,
  'HARD+',
  'prior fn third-arg marketType selects HARD+',
);
eq(
  priorFn('hardml', 'MLB')?.tier,
  'WR50',
  'prior fn without detail stays sport WR50 (quality 0)',
);
eq(
  priorFn('d2hard', 'MLB', { marketType: 'ML' })?.tier,
  'HARD+',
  'prior fn Door 2 + HARD+ on ML uses market book',
);
eq(
  priorFn('d2hard', 'MLB', { marketType: 'SPREAD' })?.tier,
  'CONFIRMED',
  'prior fn Door 2 + HARD+ on SPREAD stays sport',
);
eq(
  priorFn('d2hard', 'MLB')?.tier,
  'CONFIRMED',
  'prior fn Door 2 without marketType stays sport',
);

{
  const aggHard = aggregateSideV12(
    [{ wallet: 'hardml', side: 'home', marketType: 'ML', sizeRatio: 1.2 }],
    'home',
    'MLB',
    priorFn,
  );
  ok(aggHard && aggHard.score > 0 && aggHard.provenContributors === 1,
    'HARD+-only side scores v12 quality > 0 on ML');
  const aggSp = aggregateSideV12(
    [{ wallet: 'hardml', side: 'home', marketType: 'SPREAD', sizeRatio: 1.2 }],
    'home',
    'MLB',
    priorFn,
  );
  eq(aggSp?.provenContributors || 0, 0, 'HARD+ ML wallet contributes 0 quality on SPREAD');
  ok((aggSp?.score || 0) <= 0, 'HARD+ on the wrong market does not print a +score');

  const aggD2Hard = aggregateSideV12(
    [{ wallet: 'd2hard', side: 'home', marketType: 'ML', sizeRatio: 1.2 }],
    'home',
    'MLB',
    priorFn,
  );
  ok(aggD2Hard && aggD2Hard.score > 0 && aggD2Hard.provenContributors === 1,
    'Door 2 + HARD+ on ML still scores from the market book');
  const qMkt = agsV12WalletQuality({
    tier: 'HARD+', priorN: 6, priorRoi: 22, sizeRatio: 1.2,
  });
  const qSport = agsV12WalletQuality({
    tier: 'CONFIRMED', priorN: 20, priorRoi: 8, sizeRatio: 1.2,
  });
  ok(Math.abs((aggD2Hard.forQualities?.[0] || 0) - qMkt) < 1e-9,
    'Door 2 + HARD+ quality magnitude is the market book, not sport');
  ok(qMkt !== qSport, 'market and sport quality differ so the assertion is real');
}

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
