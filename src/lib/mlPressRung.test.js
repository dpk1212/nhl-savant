import assert from 'node:assert/strict';
import test from 'node:test';
import { buildMlMiniBook } from './mlMiniRung.js';
import {
  applyMlPressRung,
  exactBandSkill,
  pressFullSize,
  pressPriceZone,
  pressQuarterSize,
  steamCoversPress,
  steamIsPositiveTenth,
} from './mlPressRung.js';

const DAY = '2026-11-16';
const EDGE_DAY = '2026-11-17';

function prior(wallet, sport = 'NBA') {
  const rows = [];
  for (let i = 0; i < 20; i += 1) {
    const date = new Date(Date.parse('2026-08-01T00:00:00Z') + i * 86400000).toISOString().slice(0, 10);
    const won = i >= 4;
    rows.push({
      wallet, date, sport, marketType: 'ML', side: 'home', gameKey: `g${wallet}${i}`,
      invested: 100, avgPrice: 0.5, won, result: won ? 'WIN' : 'LOSS',
    });
  }
  return rows;
}

function book() {
  return buildMlMiniBook([
    ...prior('aaaaaa'),
    ...prior('bbbbbb', 'CBB'),
  ], DAY);
}

function pos(wallet, invested, price = 0.67) {
  return { wallet, side: 'home', invested, avgPrice: price, sport: 'NBA', marketType: 'ML' };
}

test('full size is the press band, and 4 when the band is missing', () => {
  assert.equal(pressFullSize(3.2), 5);
  assert.equal(pressFullSize(2), 4);
  assert.equal(pressFullSize(1.6), 3);
  assert.equal(pressFullSize(1.2), 4);
  assert.equal(pressFullSize(null), 4);
  assert.equal(pressQuarterSize(5), 3.75);
  assert.equal(pressQuarterSize(4), 3);
  assert.equal(pressQuarterSize(3), 2.25);
});

test('the price zones stop at the juice line and at +110', () => {
  assert.equal(pressPriceZone(-150), 'full');
  assert.equal(pressPriceZone(-200), 'full');
  assert.equal(pressPriceZone(-425), 'full');
  assert.equal(pressPriceZone(-426), 'juice');
  assert.equal(pressPriceZone(-149), 'middle');
  assert.equal(pressPriceZone(110), 'middle');
  assert.equal(pressPriceZone(111), 'out');
  assert.equal(pressPriceZone(null, 0.67), 'full');
  assert.equal(pressPriceZone(null, 0.5), 'middle');
  assert.equal(steamCoversPress(4.45), true);
  assert.equal(steamCoversPress(4.44), false);
  assert.equal(steamCoversPress(null), false);
  assert.equal(steamCoversPress(0), false);
});

test('a -200 press replaces the stake with the full band', () => {
  const index = book();
  const five = applyMlPressRung({
    units: 1, pickDate: DAY, sport: 'NBA', market: 'ML', side: 'home',
    positions: [pos('aaaaaa', 320)], odds: -200, steam: 0, book: index,
  });
  assert.equal(five.action, 'STAKE');
  assert.equal(five.units, 5);
  const four = applyMlPressRung({
    units: 0, pickDate: DAY, sport: 'NBA', market: 'ML', side: 'home',
    positions: [pos('aaaaaa', 220)], odds: -180, steam: null, book: index,
  });
  assert.equal(four.units, 4);
  const three = applyMlPressRung({
    units: 5, pickDate: DAY, sport: 'NBA', market: 'ML', side: 'home',
    positions: [pos('aaaaaa', 160)], odds: -160, book: index,
  });
  assert.equal(three.units, 3);
});

test('pickem through -150 is three quarters only when steam is 4.5 or more', () => {
  const index = book();
  const up = applyMlPressRung({
    units: 1, pickDate: DAY, sport: 'NBA', market: 'ML', side: 'home',
    positions: [pos('aaaaaa', 320, 0.55)], odds: -130, steam: 4.5, book: index,
  });
  assert.equal(up.action, 'STAKE');
  assert.equal(up.units, 3.75);
  const flat = applyMlPressRung({
    units: 2, pickDate: DAY, sport: 'NBA', market: 'ML', side: 'home',
    positions: [pos('aaaaaa', 220, 0.5)], odds: -110, steam: 0, book: index,
  });
  assert.equal(flat.action, 'MUTE');
  assert.equal(flat.units, 0);
  const dog = applyMlPressRung({
    units: 3, pickDate: DAY, sport: 'NBA', market: 'ML', side: 'home',
    positions: [pos('aaaaaa', 160, 0.4)], odds: 150, steam: 12, book: index,
  });
  assert.equal(dog.action, 'MUTE');
});

test('juice, a mini, CBB, and the exemptions stay on their own path', () => {
  const index = book();
  const juice = applyMlPressRung({
    units: 0, pickDate: DAY, sport: 'NBA', market: 'ML', side: 'home',
    positions: [pos('aaaaaa', 320)], odds: -450, book: index,
  });
  assert.equal(juice.action, 'PASS');
  assert.equal(juice.units, 0);
  const mini = applyMlPressRung({
    units: 3, pickDate: DAY, sport: 'NBA', market: 'ML', side: 'home',
    positions: [pos('aaaaaa', 100)], odds: -200, book: index,
  });
  assert.equal(mini.action, 'PASS');
  assert.equal(mini.units, 3);
  const cbb = applyMlPressRung({
    units: 0, pickDate: DAY, sport: 'NCAAB', market: 'ML', side: 'home',
    positions: [{ wallet: 'bbbbbb', side: 'home', invested: 160, avgPrice: 0.7 }],
    odds: -170, book: index,
  });
  assert.equal(cbb.action, 'STAKE');
  assert.equal(cbb.units, 3);
  const early = applyMlPressRung({
    units: 2, pickDate: '2026-11-15', sport: 'NBA', market: 'ML', side: 'home',
    positions: [pos('aaaaaa', 320)], odds: -200, book: index,
  });
  assert.equal(early.action, 'EXEMPT');
  assert.equal(early.units, 2);
  const manual = applyMlPressRung({
    units: 2, pickDate: DAY, sport: 'NBA', market: 'ML', side: 'home',
    positions: [pos('aaaaaa', 320)], odds: -200, manual: true, book: index,
  });
  assert.equal(manual.action, 'EXEMPT');
});

function rangeHistory(wallet) {
  const rows = [];
  for (let i = 0; i < 16; i += 1) {
    const date = new Date(Date.parse('2026-10-01T00:00:00Z') + i * 86400000).toISOString().slice(0, 10);
    const won = i !== 0;
    rows.push({
      wallet, date, sport: 'NBA', marketType: 'ML', side: 'home', gameKey: `r${wallet}${i}`,
      invested: 100, avgPrice: 0.62, won, result: won ? 'WIN' : 'LOSS',
    });
  }
  return rows;
}

test('from Nov 17 an edge of 5 or more is 4u at any steam and any price', () => {
  const index = buildMlMiniBook(rangeHistory('cccccc'), EDGE_DAY);
  const priced = { wallet: 'cccccc', side: 'home', invested: 40, avgPrice: 0.62 };
  const full = applyMlPressRung({
    units: 1, pickDate: EDGE_DAY, sport: 'NBA', market: 'ML', side: 'home',
    positions: [priced], odds: 140, steam: 0, edge: 5, book: index,
  });
  assert.equal(full.action, 'STAKE');
  assert.equal(full.units, 4);
  assert.equal(full.zone, 'full');
  const dog = applyMlPressRung({
    units: 0, pickDate: EDGE_DAY, sport: 'NBA', market: 'ML', side: 'home',
    positions: [priced], odds: -120, steam: -2, edge: 12, book: index,
  });
  assert.equal(dog.units, 4);
  const below = applyMlPressRung({
    units: 2, pickDate: EDGE_DAY, sport: 'NBA', market: 'ML', side: 'home',
    positions: [priced], odds: -180, steam: 6, edge: 4.9, book: index,
  });
  assert.equal(below.action, 'STAKE');
  assert.equal(below.zone, 'steam');
  assert.equal(below.units, 4);
  const flat = applyMlPressRung({
    units: 3, pickDate: EDGE_DAY, sport: 'NBA', market: 'ML', side: 'home',
    positions: [priced], odds: -180, steam: 0, edge: 4.9, book: index,
  });
  assert.equal(flat.action, 'MUTE');
  assert.equal(flat.units, 0);
  const missing = applyMlPressRung({
    units: 2, pickDate: EDGE_DAY, sport: 'NBA', market: 'ML', side: 'home',
    positions: [priced], odds: -180, steam: 3, edge: null, book: index,
  });
  assert.equal(missing.action, 'PASS');
  assert.equal(missing.units, 2);
  const juice = applyMlPressRung({
    units: 0, pickDate: EDGE_DAY, sport: 'NBA', market: 'ML', side: 'home',
    positions: [priced], odds: -450, steam: 3, edge: 12, book: index,
  });
  assert.equal(juice.action, 'PASS');
  assert.equal(juice.units, 0);
  assert.equal(steamIsPositiveTenth(0.04), false);
  assert.equal(steamIsPositiveTenth(0.05), true);
  const bands = index.get('NBA|cccccc').bands;
  assert.ok(exactBandSkill(bands, 0.62) >= 8);
  assert.equal(exactBandSkill(bands, 0.4), null);
  const otherBand = applyMlPressRung({
    units: 1, pickDate: EDGE_DAY, sport: 'NBA', market: 'ML', side: 'home',
    positions: [{ wallet: 'cccccc', side: 'home', invested: 200, avgPrice: 0.4 }],
    odds: 150, steam: 0, edge: 12, book: index,
  });
  assert.equal(otherBand.action, 'PASS');
  assert.equal(otherBand.units, 1);
});
