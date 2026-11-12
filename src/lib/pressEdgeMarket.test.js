import assert from 'node:assert/strict';
import test from 'node:test';
import { pressEdge, pressWalletRows } from './pressLadderOverlay.js';

const row = (over) => ({ dir: 'FOR', n: 40, wr: 60, mktN: 0, mktWr: null, ...over });

test('a moneyline press edge reads the sport book', () => {
  const edge = pressEdge([
    row({ n: 20, wr: 70 }),
    row({ n: 8, wr: 90, mktN: 30, mktWr: 40 }),
  ], 'ML', -110);
  assert.ok(Math.abs(edge - (70 - (110 / 210) * 100)) < 1e-9);
});

test('a spread press edge reads the market book and a missing book stays unedged', () => {
  const edge = pressEdge([
    row({ n: 40, wr: 70, mktN: 12, mktWr: 40 }),
    row({ n: 40, wr: 80, mktN: 20, mktWr: 60 }),
    row({ n: 4, wr: 100, mktN: 4, mktWr: 100 }),
  ], 'SPREAD', -110);
  assert.equal(edge, 50 - 52.4);

  const none = pressEdge([
    row({ n: 40, wr: 70, mktN: 9, mktWr: 80 }),
  ], 'TOTAL', -110);
  assert.equal(none, null);
});

test('the wallet row carries the sport market record', () => {
  const profiles = new Map([['abcdef', {
    bySport: {
      CBB: {
        positions: { n: 30, wr: 61 },
        byMarket: { SPREAD: { positions: { n: 12, wr: 41.7 } } },
      },
    },
  }]]);
  const rows = pressWalletRows(
    [{ wallet: '0xabcdef', side: 'home', invested: 100 }],
    'home',
    'CBB',
    profiles,
    'SPREAD',
  );
  assert.equal(rows[0].n, 30);
  assert.equal(rows[0].wr, 61);
  assert.equal(rows[0].mktN, 12);
  assert.equal(rows[0].mktWr, 41.7);
  assert.equal(pressEdge(rows, 'SPREAD', -110), 41.7 - 52.4);
});
