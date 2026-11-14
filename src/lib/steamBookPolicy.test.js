import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MID_BAND_MUTED_BY,
  SHORT_MOVE_MUTED_BY,
  applyMidBand,
  applyShortMoveMute,
  applySteamBook,
  applySteamTenResize,
  t5MarketLead,
} from './steamBookPolicy.js';

const DAY = '2026-11-14';
const base = { pickDate: DAY, sport: 'NBA', market: 'SPREAD' };

function t5(wallet, tier = 5, status = 'STABLE_ON') {
  return { wallet, tier, status, n: 20, edge: 9, invested: 100, ratio: 1 };
}

test('a short move under edge 5 with no tier-5 lead goes to 0', () => {
  const out = applyShortMoveMute({ ...base, units: 2, m: 2, edge: 4.9, lead: false });
  assert.equal(out.action, 'MUTE');
  assert.equal(out.units, 0);
  assert.equal(out.mutedBy, SHORT_MOVE_MUTED_BY);
});

test('a flat price is inside the mute', () => {
  const out = applyShortMoveMute({ ...base, units: 2, m: 0, edge: 1, lead: false });
  assert.equal(out.action, 'MUTE');
});

test('exactly 4.5 and exactly 5 stay', () => {
  assert.equal(applyShortMoveMute({ ...base, units: 2, m: 4.5, edge: 1, lead: false }).action, 'PASS');
  assert.equal(applyShortMoveMute({ ...base, units: 2, m: 2, edge: 5, lead: false }).action, 'PASS');
});

test('a missing edge stays, and a tier-5 lead stays', () => {
  assert.equal(applyShortMoveMute({ ...base, units: 2, m: 2, edge: null, lead: false }).action, 'PASS');
  const kept = applyShortMoveMute({ ...base, units: 2, m: 2, edge: 1, lead: true });
  assert.equal(kept.action, 'PASS');
  assert.equal(kept.reason, 't5_lead');
  assert.equal(kept.units, 2);
});

test('a price that moved against is not this mute', () => {
  assert.equal(applyShortMoveMute({ ...base, units: 2, m: -1, edge: 1, lead: false }).action, 'PASS');
});

test('manual stake, a kill, and a date before the cut stay out', () => {
  assert.equal(applyShortMoveMute({ ...base, units: 2, m: 1, edge: 1, manual: true }).action, 'EXEMPT');
  assert.equal(applyShortMoveMute({ ...base, units: 2, m: 1, edge: 1, killed: true }).action, 'EXEMPT');
  assert.equal(applyShortMoveMute({ ...base, pickDate: '2026-11-13', units: 2, m: 1, edge: 1 }).action, 'EXEMPT');
});

test('a 10% shorten goes to one and a half, rounded to the half unit', () => {
  assert.equal(applySteamTenResize({ ...base, units: 2, m: 10 }).units, 3);
  assert.equal(applySteamTenResize({ ...base, units: 1.5, m: 12 }).units, 2.5);
  assert.equal(applySteamTenResize({ ...base, units: 2.5, m: 10 }).action, 'BOOST');
  assert.equal(applySteamTenResize({ ...base, units: 2.5, m: 10 }).units, 4);
});

test('the ceiling and the odds cap stop the increase and leave the current stake', () => {
  const capped = applySteamTenResize({ ...base, units: 2, m: 10, ceiling: 2 });
  assert.equal(capped.action, 'PASS');
  assert.equal(capped.units, 2);
  const dog = applySteamTenResize({ ...base, units: 2, m: 10, odds: 160 });
  assert.equal(dog.units, 2);
  const room = applySteamTenResize({ ...base, units: 2, m: 10, odds: 130 });
  assert.equal(room.units, 2.5);
});

test('a zero stake and a move under 10 do not resize', () => {
  assert.equal(applySteamTenResize({ ...base, units: 0, m: 12 }).action, 'PASS');
  assert.equal(applySteamTenResize({ ...base, units: 2, m: 9.9 }).action, 'PASS');
});

test('the mute and the resize do not both fire', () => {
  const muted = applySteamBook({ ...base, units: 2, m: 2, edge: 1, lead: false });
  assert.equal(muted.units, 0);
  assert.equal(muted.resize.action, 'PASS');
  const sized = applySteamBook({ ...base, units: 2, m: 11, edge: 1, lead: false });
  assert.equal(sized.mute.action, 'PASS');
  assert.equal(sized.units, 3);
});

test('4.5% up to 10% adds one unit under edge 5 and cuts one unit at 5 or more', () => {
  const add = applyMidBand({ ...base, units: 2, m: 4.5, edge: 4.9 });
  assert.equal(add.action, 'ADD');
  assert.equal(add.units, 3);
  const cut = applyMidBand({ ...base, units: 2.5, m: 9.9, edge: 5 });
  assert.equal(cut.action, 'CUT');
  assert.equal(cut.units, 1.5);
  assert.equal(cut.mutedBy, null);
});

test('the cut stops at zero and a missing edge stays', () => {
  const zero = applyMidBand({ ...base, units: 1, m: 6, edge: 8 });
  assert.equal(zero.units, 0);
  assert.equal(zero.mutedBy, MID_BAND_MUTED_BY);
  const half = applyMidBand({ ...base, units: 0.5, m: 6, edge: 8 });
  assert.equal(half.units, 0);
  assert.equal(applyMidBand({ ...base, units: 2, m: 6, edge: null }).action, 'PASS');
  assert.equal(applyMidBand({ ...base, units: 0, m: 6, edge: 1 }).action, 'PASS');
});

test('the ceiling and the odds cap can stop the extra unit', () => {
  assert.equal(applyMidBand({ ...base, units: 2, m: 6, edge: 1, ceiling: 2 }).action, 'PASS');
  assert.equal(applyMidBand({ ...base, units: 2, m: 6, edge: 1, odds: 160 }).units, 2);
  assert.equal(applyMidBand({ ...base, units: 2, m: 6, edge: 1, odds: 130 }).units, 2.5);
});

test('10% and a move under 4.5 are outside the middle band', () => {
  assert.equal(applyMidBand({ ...base, units: 2, m: 10, edge: 1 }).action, 'PASS');
  assert.equal(applyMidBand({ ...base, units: 2, m: 4.4, edge: 1 }).action, 'PASS');
  const book = applySteamBook({ ...base, units: 2, m: 7, edge: 1, lead: false });
  assert.equal(book.mute.action, 'PASS');
  assert.equal(book.resize.action, 'PASS');
  assert.equal(book.units, 3);
});

test('a tier-5 lead is for minus against, and a fallen wallet does not count', () => {
  assert.equal(t5MarketLead([t5('aaaaaa')], []), true);
  assert.equal(t5MarketLead([t5('aaaaaa', 5, 'FALLEN_ON')], []), false);
  assert.equal(t5MarketLead([t5('aaaaaa'), t5('bbbbbb')], [t5('cccccc')]), true);
  assert.equal(t5MarketLead([t5('aaaaaa')], [t5('bbbbbb')]), false);
  assert.equal(t5MarketLead([t5('aaaaaa')], [t5('aaaaaa')]), false);
  assert.equal(t5MarketLead([t5('aaaaaa', 4)], []), false);
});
