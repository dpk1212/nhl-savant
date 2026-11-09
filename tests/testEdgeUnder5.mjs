import assert from 'node:assert/strict';
import test from 'node:test';
import {
  EDGE_UNDER5_FROM,
  EDGE_UNDER5_MUTED_BY,
  applyEdgeUnder5Mute,
  blendEdgeForSide,
  blendEdgeFromWrs,
  blendWalletWr,
  edgeUnder5Owns,
  edgeUnder5Stamp,
  edgeUnder5Value,
  gapBandStays,
  inEdgeGapBand,
} from '../src/lib/edgeUnder5.js';
import { applyPressEdgeNetClamp } from '../src/lib/pressLadderOverlay.js';
const DAY = '2026-11-05';
const TODAY = '2026-11-06';
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

test('edge under 5 goes to 0 except the two holds', () => {
  const mute = applyEdgeUnder5Mute({
    units: 4, pressEdge: 3.2, pickDate: DAY, sport: 'NFL', market: 'ML', odds: -150,
  });
  assert.equal(mute.action, 'MUTE');
  assert.equal(mute.units, 0);
  assert.equal(mute.mutedBy, EDGE_UNDER5_MUTED_BY);
  assert.equal(mute.unitsPrePolicy, 4);

  const small = applyEdgeUnder5Mute({
    units: 1, pressEdge: 1, pickDate: DAY, sport: 'CFB', market: 'SPREAD', odds: -110,
  });
  assert.equal(small.units, 0);

  const negative = applyEdgeUnder5Mute({
    units: 2, pressEdge: -2, pickDate: DAY, sport: 'NHL', market: 'ML', odds: -130, gapFires: false,
  });
  assert.equal(negative.units, 0);

  const missing = applyEdgeUnder5Mute({
    units: 1.5, pressEdge: null, pickDate: DAY, sport: 'NBA', market: 'SPREAD', odds: -110,
  });
  assert.equal(missing.units, 0);

  const kept = applyEdgeUnder5Mute({
    units: 4, pressEdge: 4.95, pickDate: DAY, sport: 'NBA', market: 'ML', odds: -150,
  });
  assert.equal(kept.action, 'PASS');
  assert.equal(kept.units, 4);
});

test('a morning gap already in the 2-unit band is held', () => {
  const held = applyEdgeUnder5Mute({
    units: 2, pressEdge: 1.2, pickDate: DAY, sport: 'CFB', market: 'SPREAD', odds: -110, gapFires: true,
  });
  assert.equal(held.action, 'HOLD');
  assert.equal(held.units, 2);
  assert.equal(held.clause, 'gap2');
  assert.equal(held.mutedBy, null);

  const half = applyEdgeUnder5Mute({
    units: 2.5, pressEdge: 0, pickDate: DAY, sport: 'NFL', market: 'TOTAL', odds: -105, gapFires: true,
  });
  assert.equal(half.units, 2.5);

  const otherSize = applyEdgeUnder5Mute({
    units: 3, pressEdge: 1, pickDate: DAY, sport: 'CFB', market: 'SPREAD', odds: -110, gapFires: true,
  });
  assert.equal(otherSize.units, 0);

  const noGap = applyEdgeUnder5Mute({
    units: 2, pressEdge: 1, pickDate: DAY, sport: 'CFB', market: 'SPREAD', odds: -110, gapFires: false,
  });
  assert.equal(noGap.units, 0);
});

test('an NBA moneyline juicier than -100 is held at any size', () => {
  const fav = applyEdgeUnder5Mute({
    units: 1.5, pressEdge: 2, pickDate: DAY, sport: 'NBA', market: 'ML', odds: -150,
  });
  assert.equal(fav.action, 'HOLD');
  assert.equal(fav.units, 1.5);
  assert.equal(fav.clause, 'nba-ml-fav');

  const pick = applyEdgeUnder5Mute({
    units: 2, pressEdge: 2, pickDate: DAY, sport: 'NBA', market: 'ML', odds: -100,
  });
  assert.equal(pick.units, 0);

  const nhl = applyEdgeUnder5Mute({
    units: 2, pressEdge: 2, pickDate: DAY, sport: 'NHL', market: 'ML', odds: -150,
  });
  assert.equal(nhl.units, 0);

  const total = applyEdgeUnder5Mute({
    units: 2, pressEdge: 2, pickDate: DAY, sport: 'NBA', market: 'TOTAL', odds: -150,
  });
  assert.equal(total.units, 0);
});

test('a zero stays a zero so an earlier mute keeps the reason', () => {
  const zero = applyEdgeUnder5Mute({
    units: 0, pressEdge: 1, pickDate: DAY, sport: 'NBA', market: 'ML', odds: -500,
  });
  assert.equal(zero.action, 'PASS');
  assert.equal(zero.units, 0);
  assert.equal(zero.mutedBy, null);
});

test('Nov 4 and other sports are outside the mute', () => {
  const yesterday = applyEdgeUnder5Mute({
    units: 4, pressEdge: 1, pickDate: BEFORE, sport: 'NBA', market: 'ML', odds: -110,
  });
  assert.equal(yesterday.action, 'EXEMPT');
  assert.equal(yesterday.units, 4);
  const cbb = applyEdgeUnder5Mute({
    units: 3, pressEdge: 1, pickDate: DAY, sport: 'CBB', market: 'SPREAD', odds: -110,
  });
  assert.equal(cbb.action, 'EXEMPT');
  assert.equal(cbb.units, 3);
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

test('from Nov 6 only a blended edge under 5 with steam off comes off', () => {
  const off = applyEdgeUnder5Mute({
    units: 2.5, pressEdge: 8, blendEdge: 2.6, steamOn: false,
    pickDate: TODAY, sport: 'NHL', market: 'ML', odds: -150,
    gapFires: true,
  });
  assert.equal(off.action, 'MUTE');
  assert.equal(off.units, 0);
  assert.equal(off.reason, 'edge_under_5_steam_off');
  assert.equal(off.mutedBy, EDGE_UNDER5_MUTED_BY);

  const steam = applyEdgeUnder5Mute({
    units: 2.5, blendEdge: 1.2, steamOn: true,
    pickDate: TODAY, sport: 'NBA', market: 'ML', odds: -180,
  });
  assert.equal(steam.action, 'PASS');
  assert.equal(steam.units, 2.5);
  assert.equal(steam.clause, 'steam-on');
  assert.equal(steam.mutedBy, null);

  const stay = applyEdgeUnder5Mute({
    units: 2.5, blendEdge: 1.2, steamOn: true,
    pickDate: TODAY, sport: 'CFB', market: 'SPREAD', odds: -110,
    alreadyOff: true,
  });
  assert.equal(stay.action, 'MUTE');
  assert.equal(stay.units, 0);
  assert.equal(stay.reason, 'edge_under_5_stay');
  assert.equal(stay.mutedBy, EDGE_UNDER5_MUTED_BY);

  const high = applyEdgeUnder5Mute({
    units: 4, blendEdge: 4.95, steamOn: false,
    pickDate: TODAY, sport: 'NFL', market: 'SPREAD', odds: -110,
  });
  assert.equal(high.action, 'PASS');
  assert.equal(high.units, 4);

  const missing = applyEdgeUnder5Mute({
    units: 1.5, blendEdge: null, steamOn: false,
    pickDate: TODAY, sport: 'NHL', market: 'ML', odds: -130,
  });
  assert.equal(missing.action, 'PASS');
  assert.equal(missing.units, 1.5);
  assert.equal(missing.clause, 'no-blend');

  const alreadyOff = applyEdgeUnder5Mute({
    units: 0, blendEdge: 1, steamOn: true,
    pickDate: TODAY, sport: 'CFB', market: 'TOTAL', odds: -110,
  });
  assert.equal(alreadyOff.action, 'PASS');
  assert.equal(alreadyOff.units, 0);

  const fav = applyEdgeUnder5Mute({
    units: 3, blendEdge: 2, steamOn: false,
    pickDate: TODAY, sport: 'NBA', market: 'ML', odds: -150, gapFires: true,
  });
  assert.equal(fav.units, 0);

  const stamp = edgeUnder5Stamp(steam);
  assert.equal(stamp.v8_blendEdge, 1.2);
  assert.equal(stamp.v8_edgeUnder5SteamOn, true);
  assert.equal(stamp.v8_edgeUnder5Action, 'PASS');
});

test('the blend pulls a thin market toward the other markets and subtracts the price', () => {
  assert.equal(blendWalletWr(9, 6, 4, 3), null);
  assert.equal(blendWalletWr(20, 12, 0, 0), 60);
  const pulled = blendWalletWr(20, 12, 4, 3);
  assert.ok(Math.abs(pulled - ((4 * 75) + (10 * 56.3)) / 14) < 1e-9);
  assert.equal(blendEdgeFromWrs([60], 'SPREAD', -110), 7.6);
  assert.equal(blendEdgeFromWrs([55], 'TOTAL', null), 2.6);
  assert.equal(blendEdgeFromWrs([], 'ML', -110), null);
  assert.equal(blendEdgeFromWrs([55], 'ML', null), null);

  const profiles = new Map([
    ['aaaaaa', {
      bySport: {
        NHL: {
          positions: { n: 20, wins: 12 },
          byMarket: { ML: { positions: { n: 4, wins: 3 } } },
        },
      },
    }],
  ]);
  const edge = blendEdgeForSide({
    walletDetails: [{ wallet: '0xaaaaaa', side: 'away', invested: 100 }],
    side: 'away',
    sport: 'NHL',
    market: 'ML',
    walletProfiles: profiles,
    odds: -110,
  });
  const implied = (110 / 210) * 100;
  const expect = Math.round((pulled - implied) * 10) / 10;
  assert.equal(edge, expect);
});

test('no tier 5 on the other side stays on, even when already off', () => {
  const keep = applyEdgeUnder5Mute({
    units: 3, blendEdge: 1.2, steamOn: false,
    pickDate: TODAY, sport: 'NBA', market: 'ML', odds: -150,
    oppHasT5: false,
  });
  assert.equal(keep.action, 'PASS');
  assert.equal(keep.units, 3);
  assert.equal(keep.reason, 'no_t5_against');

  const stay = applyEdgeUnder5Mute({
    units: 3, blendEdge: 1.2, steamOn: true,
    pickDate: TODAY, sport: 'CFB', market: 'SPREAD', odds: -110,
    alreadyOff: true, oppHasT5: false,
  });
  assert.equal(stay.action, 'PASS');
  assert.equal(stay.units, 3);

  const mute = applyEdgeUnder5Mute({
    units: 3, blendEdge: 1.2, steamOn: false,
    pickDate: TODAY, sport: 'NHL', market: 'ML', odds: -150,
    oppHasT5: true,
  });
  assert.equal(mute.action, 'MUTE');
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
