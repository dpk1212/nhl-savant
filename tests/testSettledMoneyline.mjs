import assert from 'node:assert/strict';
import { settledMoneyline, settledMoneylineWinner } from '../scripts/lib/settledMoneyline.js';

const event = {
  closed: true,
  markets: [
    { sportsMarketType: 'child_moneyline', closed: true, outcomes: '["Team Falcons","NIP"]', outcomePrices: '["0","1"]' },
    { sportsMarketType: 'moneyline', closed: true, outcomes: ['Team Falcons', 'NIP'], outcomePrices: ['1', '0'] },
    { sportsMarketType: 'totals', closed: true, outcomes: ['Over', 'Under'], outcomePrices: ['0', '1'] },
  ],
};
assert.equal(settledMoneylineWinner(event), 'Team Falcons');

assert.equal(settledMoneylineWinner({
  closed: true,
  markets: [{ sportsMarketType: 'moneyline', closed: true, outcomes: ['Hugo Dellien', 'Tristan Boyer'], outcomePrices: ['0', '1'] }],
}), 'Tristan Boyer');

assert.equal(settledMoneylineWinner({
  closed: true,
  markets: [{ sportsMarketType: 'moneyline', closed: true, outcomes: ['A', 'B'], outcomePrices: ['0.6', '0.4'] }],
}), null);

assert.deepEqual(settledMoneyline({
  closed: true,
  markets: [{ sportsMarketType: 'moneyline', closed: true, outcomes: ['Daniel Merida Aguilar', 'Alexander Blockx'], outcomePrices: ['0.5', '0.5'] }],
}), { voided: true });

assert.equal(settledMoneylineWinner({
  closed: false,
  markets: [{ sportsMarketType: 'moneyline', closed: true, outcomes: ['BOJONG', 'Younglings'], outcomePrices: ['1', '0'] }],
}), 'BOJONG');

assert.deepEqual(settledMoneyline({
  closed: false,
  markets: [{ sportsMarketType: 'moneyline', closed: true, outcomes: ['BOJONG', 'Younglings'], outcomePrices: ['0.5', '0.5'] }],
}), { voided: true });

assert.equal(settledMoneylineWinner({
  closed: true,
  markets: [{ sportsMarketType: 'child_moneyline', closed: true, outcomes: ['A', 'B'], outcomePrices: ['1', '0'] }],
}), null);

console.log('testSettledMoneyline ok');
