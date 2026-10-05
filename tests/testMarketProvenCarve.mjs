/**
 * HARD+ does not feed v12. Door 2 sport book only.
 * Rolled back 2026-10-05 (#276/#277 presence, #290 market prior).
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

ok(!walletHoldsNoConfirmedOnMarket(hardMlNotDoor2(), 'MLB', 'ML'),
  'HARD+ ML does not hold no-CONFIRMED');
ok(!walletHoldsNoConfirmedOnMarket(hardMlNotDoor2(), 'MLB', 'SPREAD'),
  'HARD+ ML does not hold SPREAD');
ok(!walletHoldsNoConfirmedOnMarket(hardMlNotDoor2(), 'MLB', null),
  'HARD+ without market still does not hold');
ok(walletHoldsNoConfirmedOnMarket(door2NoHard(), 'MLB', 'SPREAD'), 'Door 2 holds any market');
ok(walletHoldsNoConfirmedOnMarket(door2NoHard(), 'MLB', null), 'Door 2 holds even without market');

ok(!walletHydratesOnScanMarket(hardMlNotDoor2(), 'MLB', 'ML'), 'do not hydrate HARD+ on ML scan');
ok(!walletHydratesOnScanMarket(hardMlNotDoor2(), 'MLB', 'SPREAD'), 'do not hydrate HARD+ on SPREAD');
ok(walletHydratesOnScanMarket(door2NoHard(), 'MLB', 'SPREAD'), 'hydrate Door 2 on every market');

const isProven = buildIsProvenFn(profiles);
ok(isProven('door2x', 'MLB', { marketType: 'ML', sizeRatio: 0.4 }), 'Door 2 Proven without HARD');
ok(!isProven('hardml', 'MLB', { marketType: 'ML', sizeRatio: 0.4 }), 'HARD+ ML is not Proven on ML');
ok(!isProven('hardml', 'MLB', { marketType: 'SPREAD' }), 'HARD+ ML is not Proven on SPREAD');
ok(!isProven('hardml', 'MLB', {}), 'HARD+ is not Proven without marketType');
ok(!isProven('hardml', 'NBA', { marketType: 'ML' }), 'wrong sport');

eq(
  countConfirmedOnSide(
    [{ side: 'home', walletShort: 'hardml', marketType: 'ML' }],
    'home', 'MLB', profiles,
  ),
  0,
  'no-CONFIRMED ignores HARD+ even with marketType on the detail',
);
eq(
  countConfirmedOnSide(
    [{ side: 'home', walletShort: 'hardml' }],
    'home', 'MLB', profiles, 'ML',
  ),
  0,
  'no-CONFIRMED 5th-arg marketType does not count HARD+',
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
eq(stamped.marketType, 'ML', 'positionToWalletDetail still stamps marketType for overlays');
ok(!isProven(stamped.wallet, 'MLB', stamped), 'stamped ML HARD+ detail is not Proven');

const aggMl = aggregateSideProven(
  [
    { wallet: 'hardml', side: 'home', marketType: 'ML', sizeRatio: 1, contribution: 50, convictionMult: 1, rankNorm: 0 },
    { wallet: 'door2x', side: 'home', marketType: 'ML', sizeRatio: 1, contribution: 50, convictionMult: 1, rankNorm: 0 },
  ],
  'home',
  'MLB',
  isProven,
);
eq(aggMl.forCount, 1, 'v11 dCount is Door 2 only — HARD+ on this market is out');

const aggSpread = aggregateSideProven(
  [
    { wallet: 'hardml', side: 'home', marketType: 'SPREAD', sizeRatio: 1, contribution: 50, convictionMult: 1, rankNorm: 0 },
    { wallet: 'door2x', side: 'home', marketType: 'SPREAD', sizeRatio: 1, contribution: 50, convictionMult: 1, rankNorm: 0 },
  ],
  'home',
  'MLB',
  isProven,
);
eq(aggSpread.forCount, 1, 'v11 dCount on SPREAD is Door 2 only');

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
eq(
  agsV12WalletQuality({
    tier: 'HARD+',
    priorN: 5,
    priorRoi: 18,
    sizeRatio: 1.2,
  }),
  0,
  'HARD+ tier does not score v12 quality',
);

const priorFn = buildWalletPriorStatsFn(profiles);
const hardMlStats = walletPriorStatsForV12(hardMlNotDoor2(), 'MLB', 'ML');
eq(hardMlStats?.tier, 'WR50', 'HARD+ ML kid stays sport WR50, not HARD+');
eq(hardMlStats?.priorN, 8, 'HARD+ quality n is the sport book, not market 5');
ok(hardMlStats?.priorSource !== 'B-market', 'HARD+ does not switch to B-market');
eq(
  walletPriorStatsForV12(hardMlNotDoor2(), 'MLB', 'SPREAD')?.tier,
  'WR50',
  'wrong market still sport WR50',
);
eq(
  walletPriorStatsForV12(hardMlNotDoor2(), 'MLB', null)?.tier,
  'WR50',
  'missing market stays sport WR50',
);
eq(
  walletPriorStatsForV12(door2NoHard(), 'MLB', 'ML')?.tier,
  'CONFIRMED',
  'Door 2 uses the sport book',
);
eq(
  walletPriorStatsForV12(door2NoHard(), 'MLB', 'ML')?.priorN,
  20,
  'Door 2 priorN is the sport book',
);

{
  const both = walletPriorStatsForV12(door2AndHardMl(), 'MLB', 'ML');
  eq(both?.tier, 'CONFIRMED', 'Door 2 + HARD+ on ML uses CONFIRMED sport tier');
  eq(both?.priorN, 20, 'Door 2 + HARD+ on ML uses sport n, not market 6');
  ok(both?.priorSource !== 'B-market', 'Door 2 + HARD+ is not B-market');
  const sp = walletPriorStatsForV12(door2AndHardMl(), 'MLB', 'SPREAD');
  eq(sp?.tier, 'CONFIRMED', 'Door 2 + HARD+ on SPREAD stays sport');
  eq(sp?.priorN, 20, 'non-HARD+ market keeps sport n');
  eq(
    walletPriorStatsForV12(door2AndHardMl(), 'MLB', null)?.tier,
    'CONFIRMED',
    'Door 2 + HARD+ without marketType stays sport',
  );
}
eq(
  priorFn('hardml', 'MLB', { marketType: 'ML' })?.tier,
  'WR50',
  'prior fn ignores marketType for HARD+-only',
);
eq(
  priorFn('hardml', 'MLB')?.tier,
  'WR50',
  'prior fn without detail stays sport WR50 (quality 0)',
);
eq(
  priorFn('d2hard', 'MLB', { marketType: 'ML' })?.tier,
  'CONFIRMED',
  'prior fn Door 2 + HARD+ on ML stays sport',
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
  eq(aggHard?.provenContributors || 0, 0, 'HARD+-only side contributes 0 v12 quality');
  ok((aggHard?.score || 0) <= 0, 'HARD+-only does not print a +score');

  const aggD2Hard = aggregateSideV12(
    [{ wallet: 'd2hard', side: 'home', marketType: 'ML', sizeRatio: 1.2 }],
    'home',
    'MLB',
    priorFn,
  );
  ok(aggD2Hard && aggD2Hard.score > 0 && aggD2Hard.provenContributors === 1,
    'Door 2 + HARD+ still scores from the sport book');
  const qSport = agsV12WalletQuality({
    tier: 'CONFIRMED', priorN: 20, priorRoi: 8, sizeRatio: 1.2,
  });
  const qMkt = agsV12WalletQuality({
    tier: 'HARD+', priorN: 6, priorRoi: 22, sizeRatio: 1.2,
  });
  ok(Math.abs((aggD2Hard.forQualities?.[0] || 0) - qSport) < 1e-9,
    'Door 2 + HARD+ quality magnitude is the sport book, not market');
  eq(qMkt, 0, 'HARD+ tier weight is 0 so market book cannot sneak in');
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
                { wallet: '0xdoor2x', side: 'home', invested: 500, avgSportBet: 100 },
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
  const mlHard = scan.filter((r) => r.marketType === 'ML' && r.walletShort === 'hardml');
  const mlDoor = scan.filter((r) => r.marketType === 'ML' && r.walletShort === 'door2x');
  const sp = scan.filter((r) => r.marketType === 'SPREAD');
  eq(mlHard.length, 0, 'hydrate skips HARD+ on ML scan');
  eq(mlDoor.length, 1, 'hydrate still collects Door 2 on ML scan');
  eq(sp.length, 0, 'hydrate skips HARD+ on SPREAD scan');
}

console.log(`ok ${n} market Proven carve tests`);
