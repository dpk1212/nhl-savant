/**
 * Action-tab Top play tag: HARD+ unopposed by HARD+.
 * Usage: node tests/testActionTopPlay.mjs
 */
import assert from 'node:assert/strict';
import {
  isActionT13,
  actionSizeAtLeast1x,
  isActionTopPlay,
  filterActionRows,
  buildConfirmedActionRows,
} from '../src/lib/confirmedActionDesk.js';

function row(extra = {}) {
  return {
    sport: 'NFL',
    invested: 1200,
    skillQ: 1,
    skillKey: 'high',
    opposed: 'clear',
    displaySizeRatio: 1.2,
    sizeRatio: 1.2,
    hardMarket: true,
    hardAgN: 0,
    ...extra,
  };
}

assert.equal(isActionT13(row()), true, 'A is T1');
assert.equal(isActionT13(row({ skillQ: 2, skillKey: 'mid' })), true, 'B is T2');
assert.equal(isActionT13(row({ skillQ: 3, skillKey: 'low' })), true, 'C is T3');
assert.equal(isActionT13(row({ skillQ: 4, skillKey: 'bottom' })), false, 'D is not T1–3');
assert.equal(isActionT13(row({ skillQ: null, skillKey: 'thin' })), false, 'thin sample is not T1–3');
assert.equal(isActionT13(row({ skillQ: 4, skillKey: 'high' })), false, 'skillQ 4 wins over stale key');
assert.equal(isActionT13(row({ skillQ: null, skillKey: 'low' })), true, 'C via skillKey when Q missing');

assert.equal(actionSizeAtLeast1x(row({ displaySizeRatio: 1.0 })), true, '1.0× Usual counts');
assert.equal(actionSizeAtLeast1x(row({ displaySizeRatio: 1.5 })), true, '1.5× press counts');
assert.equal(actionSizeAtLeast1x(row({ displaySizeRatio: 0.9 })), false, '0.9× lean is out');
assert.equal(actionSizeAtLeast1x(row({ displaySizeRatio: 0.1 })), false, '0.1× light is out');
assert.equal(actionSizeAtLeast1x({ sizeRatio: 1.1 }), true, 'model size fallback ≥1');
assert.equal(actionSizeAtLeast1x({ sizeRatio: 0.6 }), false, 'model lean is not 1×+');
assert.equal(actionSizeAtLeast1x({}), false, 'missing size is not 1×+');

assert.equal(isActionTopPlay(row()), true, 'HARD+ unopposed is top play');
assert.equal(
  isActionTopPlay(row({ skillQ: 4, skillKey: 'bottom', opposed: 'contested', displaySizeRatio: 0.4 })),
  true,
  'HARD+ unopposed by HARD+ still tops even if Sharp D / CONFIRMED-contested / light',
);
assert.equal(isActionTopPlay(row({ hardAgN: 1 })), false, 'HARD+ faded by HARD+ is not top play');
assert.equal(isActionTopPlay(row({ hardMarket: false })), false, 'non-HARD+ unopposed is not top play');
assert.equal(isActionTopPlay(row({ hardAgN: undefined })), false, 'missing hardAgN is not top play');
assert.equal(isActionTopPlay({ opposed: 'clear', skillQ: 1, displaySizeRatio: 2 }), false, 'old A/B/C stamp is not enough');
assert.equal(isActionTopPlay(null), false, 'null row');

const tickets = [
  { sport: 'NFL', team: 'Eagles', invested: 1200, skillQ: 1, skillKey: 'high', opposed: 'contested', displaySizeRatio: 1.2, sizeRatio: 1.2, hardMarket: true, hardAgN: 1, pinMove: null, steam: null },
  { sport: 'NFL', team: 'Bears', invested: 2400, skillQ: 3, skillKey: 'low', opposed: 'clear', displaySizeRatio: 0.9, sizeRatio: 0.9, hardMarket: true, hardAgN: 0, pinMove: 'with', steam: null },
  { sport: 'NFL', team: 'Over', invested: 3100, skillQ: 1, skillKey: 'high', opposed: 'clear', displaySizeRatio: 1.5, sizeRatio: 1.5, hardMarket: false, hardAgN: 0, pinMove: 'against', steam: null },
  { sport: 'NFL', team: 'Chiefs', invested: 1800, skillQ: 4, skillKey: 'bottom', opposed: 'clear', displaySizeRatio: 1.2, sizeRatio: 1.2, hardMarket: true, hardAgN: 0, pinMove: null, steam: null },
  { sport: 'NFL', team: 'Ravens', invested: 900, skillQ: 2, skillKey: 'mid', opposed: 'clear', displaySizeRatio: 1.5, sizeRatio: 1.5, hardMarket: true, hardAgN: 0, pinMove: 'with', steam: null },
];

assert.deepEqual(
  filterActionRows(tickets, { sport: 'All', topPlayOnly: true, minInvested: 0 }).map((r) => r.team),
  ['Bears', 'Chiefs', 'Ravens'],
  'Top play filter keeps HARD+ unopposed by HARD+',
);
assert.equal(
  filterActionRows(tickets, { sport: 'All', minInvested: 0 }).every((r) => r.team !== undefined),
  true,
  'filter without topPlayOnly still returns all $500+',
);

const HARD_POS = { n: 8, wr: 70, dollarRoi: 20 };
const SOFT_POS = { n: 8, wr: 50, dollarRoi: 0 };

const hard = {
  NFL: {
    phi_chi: {
      away: 'Eagles',
      home: 'Bears',
      positions: [
        {
          wallet: '0xaaaaaaaaaaaaaa11bb',
          side: 'away',
          invested: 1800,
          avgSportBet: 1200,
          v8_sizeRatio: 1.5,
        },
        {
          wallet: '0xbbbbbbbbbbbbbb22cc',
          side: 'home',
          invested: 900,
          avgSportBet: 2000,
          v8_sizeRatio: 0.45,
        },
      ],
    },
    kc_bal: {
      away: 'Chiefs',
      home: 'Ravens',
      positions: [
        {
          wallet: '0xaaaaaaaaaaaaaa11bb',
          side: 'away',
          invested: 2000,
          avgSportBet: 1200,
          v8_sizeRatio: 1.67,
        },
      ],
    },
    dal_nyg: {
      away: 'Cowboys',
      home: 'Giants',
      positions: [
        {
          wallet: '0xbbbbbbbbbbbbbb22cc',
          side: 'away',
          invested: 900,
          avgSportBet: 2000,
          v8_sizeRatio: 0.45,
        },
      ],
    },
    sea_lar: {
      away: 'Seahawks',
      home: 'Rams',
      positions: [
        {
          wallet: '0xaaaaaaaaaaaaaa11bb',
          side: 'away',
          invested: 1600,
          avgSportBet: 1200,
          v8_sizeRatio: 1.3,
        },
        {
          wallet: '0xcccccccccccccccc33dd',
          side: 'home',
          invested: 2200,
          avgSportBet: 1400,
          v8_sizeRatio: 1.6,
        },
      ],
    },
    buf_mia: {
      away: 'Bills',
      home: 'Dolphins',
      positions: [
        {
          wallet: '0xaaaaaaaaaaaaaa11bb',
          side: 'away',
          invested: 1700,
          avgSportBet: 1200,
          v8_sizeRatio: 1.4,
        },
        {
          wallet: '0xdddddddddddddd44ee',
          side: 'home',
          invested: 800,
          avgSportBet: 1500,
          v8_sizeRatio: 0.53,
        },
      ],
    },
  },
};
const profiles = new Map([
  ['aa11bb', {
    bySport: {
      NFL: {
        whitelistTier: 'CONFIRMED',
        byMarket: { SPREAD: { positions: HARD_POS } },
      },
    },
  }],
  ['bb22cc', {
    bySport: {
      NFL: {
        whitelistTier: 'CONFIRMED',
        byMarket: { SPREAD: { positions: HARD_POS } },
      },
    },
  }],
  ['cc33dd', {
    bySport: {
      NFL: {
        whitelistTier: 'CONFIRMED',
        byMarket: { SPREAD: { positions: SOFT_POS } },
      },
    },
  }],
  ['dd44ee', {
    bySport: {
      NFL: {
        whitelistTier: 'WATCH',
        byMarket: { SPREAD: { positions: HARD_POS } },
      },
    },
  }],
]);
const { rows, stats } = buildConfirmedActionRows({
  spreadPositions: hard,
  walletProfiles: profiles,
});

const chiefs = rows.find((r) => r.team === 'Chiefs');
const eagles = rows.find((r) => r.team === 'Eagles');
const bears = rows.find((r) => r.team === 'Bears');
const cowboys = rows.find((r) => r.team === 'Cowboys');
const seahawks = rows.find((r) => r.team === 'Seahawks');
const rams = rows.find((r) => r.team === 'Rams');
const bills = rows.find((r) => r.team === 'Bills');
const dolphins = rows.find((r) => r.team === 'Dolphins');

assert.ok(chiefs, 'unopposed Chiefs row exists');
assert.ok(eagles, 'Eagles row exists');
assert.ok(bears, 'Bears row exists');
assert.ok(cowboys, 'Cowboys row exists');
assert.ok(seahawks, 'Seahawks row exists');
assert.ok(rams, 'Rams (soft CONFIRMED fade) exists');
assert.ok(bills, 'Bills row exists');
assert.equal(dolphins, undefined, 'non-CONFIRMED HARD+ fade is not an Action row');

assert.equal(chiefs.hardMarket, true, 'Chiefs wallet is HARD+');
assert.equal(chiefs.hardAgN, 0, 'solo HARD+ has no HARD+ fade');
assert.equal(chiefs.opposed, 'clear', 'solo ticket is CONFIRMED-unopposed');
assert.equal(chiefs.topPlay, true, 'HARD+ unopposed by HARD+ is top play');

assert.equal(eagles.hardMarket, true);
assert.equal(bears.hardMarket, true);
assert.equal(eagles.hardAgN, 1, 'Eagles faded by one HARD+');
assert.equal(bears.hardAgN, 1, 'Bears faded by one HARD+');
assert.equal(eagles.opposed, 'contested', 'two-sided CONFIRMED cluster is contested');
assert.equal(eagles.topPlay, false, 'HARD+ vs HARD+ is not top play');
assert.equal(bears.topPlay, false, 'HARD+ vs HARD+ is not top play');

assert.equal(cowboys.hardMarket, true);
assert.equal(cowboys.hardAgN, 0);
assert.equal(cowboys.topPlay, true, 'HARD+ unopposed light size is still top play');

assert.equal(seahawks.hardMarket, true);
assert.equal(seahawks.hardAgN, 0, 'soft CONFIRMED fade is not HARD+ opposition');
assert.equal(seahawks.opposed, 'contested', 'soft CONFIRMED fade still marks Sharp contested');
assert.equal(seahawks.topPlay, true, 'HARD+ faded only by non-HARD+ CONFIRMED is top play');
assert.equal(rams.hardMarket, false);
assert.equal(rams.topPlay, false, 'soft CONFIRMED is not top play');

assert.equal(bills.hardMarket, true);
assert.equal(bills.hardAgN, 1, 'non-CONFIRMED HARD+ fade still counts');
assert.equal(bills.opposed, 'clear', 'WATCH fade is not Sharp contested');
assert.equal(bills.topPlay, false, 'HARD+ faded by off-desk HARD+ is not top play');

assert.equal(stats.topPlay, 3, 'Chiefs + Cowboys + Seahawks');

console.log('testActionTopPlay: ok');
