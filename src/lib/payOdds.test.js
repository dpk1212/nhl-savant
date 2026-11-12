import assert from 'node:assert/strict';
import test from 'node:test';
import { stakePriceOdds } from './payOdds.js';

test('a polymarket receipt yields the book on the card', () => {
  assert.equal(stakePriceOdds({
    stampedOdds: -100,
    bookOnLine: -3233,
    oddsSource: 'poly_avgPrice',
    bookLabel: 'Polymarket',
  }), -3233);
  assert.equal(stakePriceOdds({
    stampedOdds: -100,
    bookOnLine: -257,
    oddsSource: 'poly_avgPrice',
    bookLabel: 'Polymarket',
  }), -257);
  assert.equal(stakePriceOdds({
    stampedOdds: -100,
    bookOnLine: -6150,
    oddsSource: 'poly_avgPrice',
  }), -6150);
});

test('a receipt with no book, and a book stamp, stay put', () => {
  assert.equal(stakePriceOdds({
    stampedOdds: -110,
    bookOnLine: null,
    oddsSource: 'poly_avgPrice',
  }), -110);
  assert.equal(stakePriceOdds({
    stampedOdds: -110,
    bookOnLine: -108,
    oddsSource: 'pinnacle',
    bookLabel: 'Pinnacle',
  }), -110);
  assert.equal(stakePriceOdds({
    stampedOdds: -100,
    bookOnLine: -100,
    oddsSource: 'poly_avgPrice',
  }), -100);
  assert.equal(stakePriceOdds({}), null);
});
