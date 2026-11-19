import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluatePressLadder } from './pressLadderOverlay.js';

const DAY = '2026-11-17';
const BEFORE = '2026-11-16';

function profile(sport, trust, positions = { n: 20, wr: 52, dollarRoi: 1, invested: 1000 }, marketTrust = null) {
  const rec = {
    positions: { ...positions, wins: 10, settledPnl: 0 },
    trust,
  };
  if (marketTrust) rec.byMarket = { SPREAD: { trust: marketTrust } };
  return { bySport: { [sport]: rec } };
}

const on = {
  status: 'STABLE_ON', tier: 4, n: 20, edge: 8, formOn: true, firstBetDate: '2026-10-01',
};

function run({
  sport = 'NHL', market = 'ML', odds = -130, invested = 200, trust = on,
  pickDate = DAY, steam = { lastHourPct: 1, sinceOpenPct: 0 }, wallet = 'aaaaaa',
  profiles, walletDetails,
} = {}) {
  return evaluatePressLadder({
    walletDetails: walletDetails || [{ wallet, side: 'home', invested }],
    side: 'home',
    sport,
    marketType: market,
    walletProfiles: profiles || new Map([[wallet.slice(-6), profile(sport, trust)]]),
    sideOdds: odds,
    steamOn: false,
    pickDate,
    steam,
  });
}

test('a tier-4 form-on book opens the band without money, Door-2, or a seasoned count', () => {
  const r = run();
  assert.equal(r.rung, 'PRESS');
  assert.equal(r.band, 5);
  assert.equal(r.units, 5);
  assert.equal(r.gate.pass, false);
  assert.equal(r.gate.door2For, false);
  assert.equal(r.pressFlat, false);
});

test('the same wallet on Nov 16 does not take the new path', () => {
  const r = run({ pickDate: BEFORE });
  assert.notEqual(r.rung, 'PRESS');
  assert.equal(r.units, 0);
});

test('flat is 0 and a shorten, a lengthened line, and a missing read stay', () => {
  assert.equal(run({ steam: { lastHourPct: 0, sinceOpenPct: 0 } }).units, 0);
  assert.equal(run({ steam: { lastHourPct: 0.04, sinceOpenPct: null } }).units, 0);
  assert.equal(run({ steam: { lastHourPct: 0.04, sinceOpenPct: null } }).pressFlat, true);
  assert.match(run({ steam: { lastHourPct: 0, sinceOpenPct: -1 } }).reason, /_flat$/);
  const up = run({ steam: { lastHourPct: 0.05, sinceOpenPct: -3 } });
  assert.equal(up.units, 5);
  assert.equal(up.pressFlat, false);
  assert.equal(run({ steam: { lastHourPct: -2, sinceOpenPct: -4 } }).units, 5);
  assert.equal(run({ steam: null }).units, 5);
});

test('tier 3, fallen form, a young book, and a ticket under 1.5× do not open a band', () => {
  assert.equal(run({ trust: { ...on, tier: 3 } }).units, 0);
  assert.equal(run({ trust: { ...on, status: 'FALLEN_ON' } }).units, 0);
  assert.equal(run({ trust: { ...on, firstBetDate: '2026-11-10' } }).units, 0);
  assert.equal(run({ trust: { ...on, firstBetDate: null, daysActive: null } }).units, 0);
  assert.equal(run({ invested: 60 }).units, 0);
});

test('the biggest qualifying ticket sets the band, and a 2× spread keeps 2u', () => {
  const sport = 'NBA';
  const trust = on;
  const profiles = new Map([
    ['aaaaaa', profile(sport, trust)],
    ['bbbbbb', profile(sport, { ...on, tier: 5 })],
  ]);
  const walletDetails = [
    { wallet: 'aaaaaa', side: 'home', invested: 80 },
    { wallet: 'bbbbbb', side: 'home', invested: 200 },
  ];
  const r = run({ sport, profiles, walletDetails, steam: { lastHourPct: 2 } });
  assert.equal(r.band, 5);
  assert.equal(r.presser.wallet, 'bbbbbb');
  const band4 = run({
    sport: 'NFL', market: 'SPREAD', odds: -250, invested: 100, steam: { sinceOpenPct: 1.2 },
    profiles: new Map([['aaaaaa', profile('NFL', { ...on, tier: 1 }, undefined, on)]]),
  });
  assert.equal(band4.band, 4);
  assert.equal(band4.units, 2);
});

test('a spread band reads the spread book, not the sport book', () => {
  const youngSpread = { ...on, firstBetDate: '2026-11-10' };
  const sportOnly = run({
    sport: 'NFL', market: 'SPREAD', odds: -110, invested: 200, steam: { sinceOpenPct: 2 },
  });
  assert.equal(sportOnly.units, 0);
  const young = run({
    sport: 'NFL', market: 'SPREAD', odds: -110, invested: 200, steam: { sinceOpenPct: 2 },
    profiles: new Map([['aaaaaa', profile('NFL', on, undefined, youngSpread)]]),
  });
  assert.equal(young.units, 0);
  const marketOnly = run({
    sport: 'NFL', market: 'SPREAD', odds: -110, invested: 200, steam: { sinceOpenPct: 2 },
    profiles: new Map([['aaaaaa', profile('NFL', youngSpread, undefined, on)]]),
  });
  assert.equal(marketOnly.rung, 'PRESS');
  assert.equal(marketOnly.band, 5);
  assert.equal(marketOnly.units, 2.5);
});

test('a dog shorten stays at 1u and a flat dog is 0, on CBB as on the other sports', () => {
  const up = run({ sport: 'CBB', odds: 150, steam: { lastHourPct: 6 } });
  assert.equal(up.band, 5);
  assert.equal(up.units, 1);
  const flat = run({ sport: 'CBB', odds: 150, steam: { lastHourPct: 0, sinceOpenPct: 0 } });
  assert.equal(flat.units, 0);
  assert.equal(flat.pressFlat, true);
});
