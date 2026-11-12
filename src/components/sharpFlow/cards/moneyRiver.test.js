import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMoneyRiver } from './moneyRiver.js';

function face(wallet) {
  return { wallets: [wallet], mapWallets: [wallet] };
}

test('a winning record with red dollars is unproven, not a loser', () => {
  const river = buildMoneyRiver(face({
    short: '11f1d2',
    side: 'ours',
    invested: 217,
    wins: 57,
    losses: 46,
    bookPnl: -772,
    l30Roi: -1.9,
    whitelist: 'WR50',
    whitelisted: false,
  }));
  assert.equal(river.rows[0].kind, 'track');
  assert.equal(river.rows[0].record, '57-46');
  const captions = river.ourPill.lines.map((line) => line.caption || line.text);
  assert.equal(captions.includes('of loser money'), false);
  assert.equal(captions.includes('unproven'), true);
});

test('a losing record with a down book stays a loser', () => {
  const river = buildMoneyRiver(face({
    short: 'aa0001',
    side: 'ours',
    invested: 100,
    wins: 20,
    losses: 40,
    bookPnl: -500,
    whitelist: null,
    whitelisted: false,
  }));
  assert.equal(river.rows[0].kind, 'loser');
});
