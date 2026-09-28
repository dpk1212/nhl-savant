/**
 * Action-tab Top play tag: T1–3 × unopposed × 1×+ usual.
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

assert.equal(isActionTopPlay(row()), true, 'A unopposed 1.2× is top play');
assert.equal(isActionTopPlay(row({ skillQ: 3, skillKey: 'low', displaySizeRatio: 1.0 })), true, 'C unopposed 1.0× is top play');
assert.equal(isActionTopPlay(row({ opposed: 'contested' })), false, 'contested is not top play');
assert.equal(isActionTopPlay(row({ displaySizeRatio: 0.9, sizeRatio: 0.9 })), false, 'lean is not top play');
assert.equal(isActionTopPlay(row({ skillQ: 4, skillKey: 'bottom', displaySizeRatio: 1.5 })), false, 'D unopposed press is not top play');
assert.equal(isActionTopPlay(row({ skillQ: null, skillKey: 'thin', displaySizeRatio: 2 })), false, 'thin unopposed press is not top play');
assert.equal(isActionTopPlay(null), false, 'null row');

const tickets = [
  { sport: 'NFL', team: 'Eagles', invested: 1200, skillQ: 1, skillKey: 'high', opposed: 'contested', displaySizeRatio: 1.2, sizeRatio: 1.2, pinMove: null, steam: null },
  { sport: 'NFL', team: 'Bears', invested: 2400, skillQ: 3, skillKey: 'low', opposed: 'clear', displaySizeRatio: 0.9, sizeRatio: 0.9, pinMove: 'with', steam: null },
  { sport: 'NFL', team: 'Over', invested: 3100, skillQ: 4, skillKey: 'bottom', opposed: 'clear', displaySizeRatio: 1.5, sizeRatio: 1.5, pinMove: 'against', steam: null },
  { sport: 'NFL', team: 'Chiefs', invested: 1800, skillQ: 1, skillKey: 'high', opposed: 'clear', displaySizeRatio: 1.2, sizeRatio: 1.2, pinMove: null, steam: null },
  { sport: 'NFL', team: 'Ravens', invested: 900, skillQ: 2, skillKey: 'mid', opposed: 'clear', displaySizeRatio: 1.5, sizeRatio: 1.5, pinMove: 'with', steam: null },
];

assert.deepEqual(
  filterActionRows(tickets, { sport: 'All', topPlayOnly: true, minInvested: 0 }).map((r) => r.team),
  ['Chiefs', 'Ravens'],
  'Top play filter keeps T1–3 unopposed 1×+',
);
assert.equal(
  filterActionRows(tickets, { sport: 'All', minInvested: 0 }).every((r) => r.team !== undefined),
  true,
  'filter without topPlayOnly still returns all $500+',
);

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
  },
};
const profiles = new Map([
  ['aa11bb', { bySport: { NFL: { whitelistTier: 'CONFIRMED' } } }],
  ['bb22cc', { bySport: { NFL: { whitelistTier: 'CONFIRMED' } } }],
]);
const { rows, stats } = buildConfirmedActionRows({
  spreadPositions: hard,
  walletProfiles: profiles,
});

const chiefs = rows.find((r) => r.team === 'Chiefs');
const eagles = rows.find((r) => r.team === 'Eagles');
assert.ok(chiefs, 'unopposed Chiefs row exists');
assert.ok(eagles, 'Eagles row exists');
assert.equal(chiefs.opposed, 'clear', 'solo ticket is unopposed');
assert.equal(eagles.opposed, 'contested', 'two-sided cluster is contested');
assert.equal(chiefs.topPlay, false, 'thin-sample CONFIRMED is not T1–3 even when unopposed 1×+');
assert.equal(eagles.topPlay, false, 'contested never top play');
assert.equal(stats.topPlay, 0, 'no Q → no top play stamps');

const stamped = rows.map((r) => ({ ...r, skillQ: 1, skillKey: 'high' }));
assert.equal(isActionTopPlay(stamped.find((r) => r.team === 'Chiefs')), true, 'A + unopposed + 1×+ after Q');
assert.equal(isActionTopPlay(stamped.find((r) => r.team === 'Eagles')), false, 'A + contested still out');
assert.equal(isActionTopPlay(stamped.find((r) => r.team === 'Cowboys')), false, 'A + unopposed but light size out');

console.log('testActionTopPlay: ok');
