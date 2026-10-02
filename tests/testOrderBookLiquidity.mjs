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
  pickCardBook,
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

const pitt = {
  games: {
    'CFB|pitt_vt': {
      spreads: [
        {
          line: 2.5,
          label: 'Pittsburgh wins by over 2.5 points',
          yesSide: 'away',
          pinAmerican: -107,
          venues: { kalshi: { levels: [{ american: 138, prob: 0.42, sizeUsd: 1800 }] } },
          noVenues: { kalshi: { levels: [{ american: -144, prob: 0.59, sizeUsd: 1000 }] } },
        },
        {
          line: 2.5,
          label: 'Virginia Tech wins by over 2.5 points',
          yesSide: 'home',
          pinAmerican: -105,
          venues: { kalshi: { levels: [{ american: -100, prob: 0.5, sizeUsd: 5000 }] } },
          noVenues: { kalshi: { levels: [{ american: -104, prob: 0.51, sizeUsd: 9000 }] } },
        },
      ],
    },
  },
};
const plus = pickCardBook(pitt, { sport: 'CFB', gameKey: 'pitt_vt', marketType: 'spread', side: 'away', line: 2.5 });
check('plus spread uses the opponent No book', plus.ours.venues.kalshi.levels[0].american === -104);
check('plus spread keeps this side’s Pinnacle price', plus.ours.pinAmerican === -107);
const minus = pickCardBook(pitt, { sport: 'CFB', gameKey: 'pitt_vt', marketType: 'spread', side: 'home', line: -2.5 });
check('minus spread uses this team’s Yes book', minus.ours.venues.kalshi.levels[0].american === -100);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
