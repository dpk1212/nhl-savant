import assert from 'node:assert/strict';
import test from 'node:test';
import {
  EDGE_UNDER5_FROM,
  EDGE_UNDER5_MUTED_BY,
  applyEdgeUnder5Mute,
  blendEdgeFromWallets,
  blendWalletWr,
  edgeUnder5Owns,
  edgeUnder5Stamp,
  edgeUnder5Value,
  gapBandStays,
  inEdgeGapBand,
} from '../src/lib/edgeUnder5.js';
import { applyPressEdgeNetClamp } from '../src/lib/pressLadderOverlay.js';
const DAY = '2026-11-05';
const BEFORE = '2026-11-04';

test('missing edge counts as 0 and 4.95 stamps as 5', () => {
  assert.equal(edgeUnder5Value(null), 0);
  assert.equal(edgeUnder5Value(''), 0);
  assert.equal(edgeUnder5Value(4.95), 5);
  assert.equal(edgeUnder5Value(4.94), 4.9);
  assert.equal(edgeUnder5Value(-0.04), 0);
});

test('the 2-unit band is from 2 up to but not including 3', () => {
  assert.equal(inEdgeGapBand(1.99), false);
  assert.equal(inEdgeGapBand(2), true);
  assert.equal(inEdgeGapBand(2.5), true);
  assert.equal(inEdgeGapBand(2.99), true);
  assert.equal(inEdgeGapBand(3), false);
});

test('the rule owns the four sports from Nov 5', () => {
  assert.equal(EDGE_UNDER5_FROM, DAY);
  assert.equal(edgeUnder5Owns(DAY, 'NBA'), true);
  assert.equal(edgeUnder5Owns(DAY, 'NCAAF'), true);
  assert.equal(edgeUnder5Owns(DAY, 'CBB'), false);
  assert.equal(edgeUnder5Owns(BEFORE, 'NBA'), false);
});

test('steam off and a blended edge under 5 goes to 0', () => {
  const mute = applyEdgeUnder5Mute({
    units: 4, blendEdge: 3.2, steamOn: false, pickDate: DAY, sport: 'NFL',
  });
  assert.equal(mute.action, 'MUTE');
  assert.equal(mute.units, 0);
  assert.equal(mute.mutedBy, EDGE_UNDER5_MUTED_BY);
  assert.equal(mute.clause, 'under5');
  assert.equal(mute.unitsPrePolicy, 4);

  const negative = applyEdgeUnder5Mute({
    units: 2, blendEdge: -2, steamOn: false, pickDate: DAY, sport: 'NHL',
  });
  assert.equal(negative.units, 0);

  const kept = applyEdgeUnder5Mute({
    units: 4, blendEdge: 4.95, steamOn: false, pickDate: DAY, sport: 'NBA',
  });
  assert.equal(kept.action, 'PASS');
  assert.equal(kept.units, 4);
});

test('steam on stays at its size, and a missing blend or steam stays', () => {
  const steam = applyEdgeUnder5Mute({
    units: 2.5, blendEdge: 1.2, steamOn: true, pickDate: DAY, sport: 'CFB',
  });
  assert.equal(steam.action, 'PASS');
  assert.equal(steam.units, 2.5);
  assert.equal(steam.mutedBy, null);

  const missingBlend = applyEdgeUnder5Mute({
    units: 1.5, blendEdge: null, steamOn: false, pickDate: DAY, sport: 'NBA',
  });
  assert.equal(missingBlend.action, 'PASS');
  assert.equal(missingBlend.units, 1.5);

  const missingSteam = applyEdgeUnder5Mute({
    units: 3, blendEdge: 1, steamOn: null, pickDate: DAY, sport: 'NFL',
  });
  assert.equal(missingSteam.action, 'PASS');
  assert.equal(missingSteam.units, 3);
});

test('a gap or an NBA favorite is not a rescue when steam is off', () => {
  const gap = applyEdgeUnder5Mute({
    units: 2, blendEdge: 1.2, steamOn: false, pickDate: DAY, sport: 'CFB',
  });
  assert.equal(gap.action, 'MUTE');
  assert.equal(gap.units, 0);

  const fav = applyEdgeUnder5Mute({
    units: 1.5, blendEdge: 2, steamOn: false, pickDate: DAY, sport: 'NBA',
  });
  assert.equal(fav.units, 0);
});

test('a zero stays a zero, and a side already muted by this rule stays off', () => {
  const zero = applyEdgeUnder5Mute({
    units: 0, blendEdge: 1, steamOn: false, pickDate: DAY, sport: 'NBA',
  });
  assert.equal(zero.action, 'PASS');
  assert.equal(zero.units, 0);
  assert.equal(zero.mutedBy, null);

  const stay = applyEdgeUnder5Mute({
    units: 2.5, blendEdge: 1, steamOn: true, pickDate: DAY, sport: 'NBA', alreadyOff: true,
  });
  assert.equal(stay.action, 'MUTE');
  assert.equal(stay.units, 0);
  assert.equal(stay.reason, 'edge_under_5_stay');
  assert.equal(stay.mutedBy, EDGE_UNDER5_MUTED_BY);
  assert.equal(edgeUnder5Stamp(stay).v8_blendSteamOn, true);
});

test('Nov 4 and other sports are outside the mute', () => {
  const yesterday = applyEdgeUnder5Mute({
    units: 4, blendEdge: 1, steamOn: false, pickDate: BEFORE, sport: 'NBA',
  });
  assert.equal(yesterday.action, 'EXEMPT');
  assert.equal(yesterday.units, 4);
  const cbb = applyEdgeUnder5Mute({
    units: 3, blendEdge: 1, steamOn: false, pickDate: DAY, sport: 'CBB',
  });
  assert.equal(cbb.action, 'EXEMPT');
  assert.equal(cbb.units, 3);
});

test('the blend pulls the market win rate toward the rest of the sport', () => {
  const sport = { n: 20, wins: 12 };
  const market = { n: 8, wins: 6 };
  const wr = blendWalletWr(sport, market);
  assert.equal(Number(wr.toFixed(4)), Number((1100 / 18).toFixed(4)));
  assert.equal(blendWalletWr({ n: 9, wins: 7 }, market), null);
  assert.equal(blendWalletWr(sport, null), 60);

  const profiles = {
    aaaaaa: {
      bySport: {
        NHL: {
          positions: sport,
          byMarket: { ML: { positions: market } },
        },
      },
    },
    bbbbbb: {
      bySport: {
        NHL: {
          positions: { n: 10, wins: 8 },
          byMarket: { ML: { positions: { n: 10, wins: 8 } } },
        },
      },
    },
  };
  const edge = blendEdgeFromWallets({
    walletDetails: [
      { wallet: 'aaaaaa', side: 'home', invested: 100 },
      { wallet: 'aaaaaa', side: 'away', invested: 40 },
      { wallet: 'bbbbbb', side: 'away', invested: 80 },
      { wallet: 'cccccc', side: 'home', invested: 50 },
    ],
    side: 'home',
    sport: 'NHL',
    market: 'ML',
    walletProfiles: profiles,
    odds: -110,
  });
  const mean = 1100 / 18;
  const implied = (110 / 210) * 100;
  assert.equal(edge, Math.round((mean - implied) * 10) / 10);
  assert.equal(blendEdgeFromWallets({
    walletDetails: [{ wallet: 'aaaaaa', side: 'home', invested: 10 }],
    side: 'home', sport: 'NHL', market: 'ML', walletProfiles: profiles, odds: null,
  }), null);
});

test('the earlier press-edge hole still owns Oct 25 and steps aside on Nov 5', () => {
  const oldHole = applyPressEdgeNetClamp({
    units: 4, pressEdge: 3, netMeanPrior: 2, pickDate: '2026-10-25', sport: 'NBA',
  });
  assert.equal(oldHole.units, 0);
  assert.equal(oldHole.action, 'MUTE');
  const handedOff = applyPressEdgeNetClamp({
    units: 2, pressEdge: 1, netMeanPrior: -20, pickDate: DAY, sport: 'CFB',
  });
  assert.equal(handedOff.action, 'PASS');
  assert.equal(handedOff.units, 2);
  const otherSport = applyPressEdgeNetClamp({
    units: 4, pressEdge: 1, netMeanPrior: 0, pickDate: DAY, sport: 'ATP',
  });
  assert.equal(otherSport.units, 0);
});

test('the 2-unit band stays only when the edge is under 5 and the date is live', () => {
  assert.equal(gapBandStays({ units: 2, pressEdge: 1, pickDate: DAY }), true);
  assert.equal(gapBandStays({ units: 2, pressEdge: null, pickDate: DAY }), true);
  assert.equal(gapBandStays({ units: 2, pressEdge: 5, pickDate: DAY }), false);
  assert.equal(gapBandStays({ units: 2, pressEdge: 4.95, pickDate: DAY }), false);
  assert.equal(gapBandStays({ units: 1.5, pressEdge: 1, pickDate: DAY }), false);
  assert.equal(gapBandStays({ units: 3, pressEdge: 1, pickDate: DAY }), false);
  assert.equal(gapBandStays({ units: 2, pressEdge: 1, pickDate: BEFORE }), false);
});
