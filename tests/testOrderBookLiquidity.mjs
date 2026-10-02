/**
 * Run: node tests/testOrderBookLiquidity.mjs
 */
import {
  asksFromKalshiNoBids,
  asksFromPoly,
  walkAsks,
  bookRead,
  appendInsideTape,
  gapPp,
  OFF_GAP_PP,
} from '../src/lib/orderBookLiquidity.js';

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log(`  ✅ ${name}`); }
  else { fail++; console.error(`  ❌ ${name}`); }
}

const asks = asksFromKalshiNoBids([
  ['0.2000', '10.00'],
  ['0.4400', '100.00'],
]);
check('best YES ask is 1 − the highest NO bid', asks[0].prob === 0.56);
check('deeper NO bid is a worse YES ask', asks[1].prob === 0.8);
check('size is contracts × ask', asks[0].sizeUsd === 56);

const poly = asksFromPoly([
  { price: '0.62', size: '1000' },
  { price: '0.55', size: '200' },
]);
check('poly best ask is the lowest price', poly[0].prob === 0.55);

const walked = walkAsks(asks, 500);
check('walk keeps the inside', walked.insideProb === 0.56);
check('walk stops at the floor when the inside is thin', walked.sizeUsd === 56 + Math.round(0.8 * 10));

// Pinnacle −150 is 60%. Exchange 56% is 4pp softer — the refusal shape.
const gap = gapPp(-150, 0.56);
check('−150 vs 56% is about 4pp', gap >= OFF_GAP_PP && gap <= 4.1);
const off = bookRead({ pinAmerican: -150, insideProb: 0.56, sizeUsd: 49000, hourAgoProb: 0.56 });
check('fat book 4pp under Pinnacle reads off', off.read === 'off');
const withPin = bookRead({ pinAmerican: -127, insideProb: 0.559, sizeUsd: 8000, hourAgoProb: 0.53 });
check('inside on the number reads with', withPin.read === 'with');
check('a rising inside is a shorten', withPin.shortenedPp >= 1.5);
const thin = bookRead({ pinAmerican: -150, insideProb: 0.56, sizeUsd: 80, hourAgoProb: null });
check('dust size stays thin even when the price is off', thin.read === 'thin');

const now = 1_700_000_000_000;
const first = appendInsideTape([], { t: now - 70 * 60 * 1000, insideProb: 0.5 }, now);
const second = appendInsideTape(first.tape, { t: now, insideProb: 0.56 }, now);
check('hour-ago inside is the earlier print', second.hourAgoProb === 0.5);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
