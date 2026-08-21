/**
 * Pinnapi soccer: index the 90-min 1X2, not child specials.
 * Usage: node tests/testPinnapiSoccer.mjs
 */
import assert from 'node:assert/strict';
import {
  decimalToAmerican,
  extractPeriod0,
  isMainPinnapiEvent,
  preferPinnapiQuote,
} from '../scripts/lib/pinnapi.js';

assert.equal(decimalToAmerican(1.2), -500);
assert.equal(decimalToAmerican(16), 1500);
assert.equal(decimalToAmerican(7.5), 650);
assert.equal(decimalToAmerican(2.42), 142);

const main = {
  event_id: 1632011611,
  parent_id: null,
  league_name: 'England - Premier League',
  home: 'Arsenal',
  away: 'Coventry City',
  periods: {
    num_0: {
      money_line: { home: 1.2, away: 16, draw: 7.5 },
      meta: { max_money_line: 10000 },
    },
  },
};
const dnbChild = {
  event_id: 1634012956,
  parent_id: 1632011611,
  league_name: 'England - Premier League',
  home: 'Arsenal',
  away: 'Coventry City',
  periods: {
    num_0: {
      money_line: { home: 2.42, away: 1.578, draw: null },
      meta: { max_money_line: 1500 },
    },
  },
};
const corners = {
  event_id: 1634012302,
  parent_id: 1632011611,
  league_name: 'England - Premier League Corners',
  home: 'Arsenal (Corners)',
  away: 'Coventry City (Corners)',
  periods: { num_0: { money_line: {}, meta: {} } },
};

assert.equal(isMainPinnapiEvent(main), true);
assert.equal(isMainPinnapiEvent(dnbChild), false);
assert.equal(isMainPinnapiEvent(corners), false);

const mainQ = extractPeriod0(main);
assert.equal(mainQ.home, -500);
assert.equal(mainQ.away, 1500);
assert.equal(mainQ.draw, 650);

const childQ = extractPeriod0(dnbChild);
assert.equal(childQ.home, 142);
assert.equal(preferPinnapiQuote(mainQ, childQ).home, -500);
assert.equal(preferPinnapiQuote(childQ, mainQ).home, -500);

console.log('testPinnapiSoccer: ok');
