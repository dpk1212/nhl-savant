/**
 * NBA tip-off FALL50 flash promo.
 * Usage: node tests/testPaywallPromo.mjs
 */
import assert from 'assert';
import {
  PAYWALL_PROMO,
  PROMO_CODES,
  DEFAULT_PROMO_CODE,
  isPaywallPromoLive,
  promoPrice,
  formatPromoCountdown,
} from '../src/lib/paywallPromo.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}
function eq(a, b, msg) {
  assert.strictEqual(a, b, msg);
  n++;
}

eq(PAYWALL_PROMO.code, 'FALL50', 'code');
eq(PAYWALL_PROMO.discount, 0.50, '50%');
eq(DEFAULT_PROMO_CODE, 'FALL50', 'default code');
eq(PAYWALL_PROMO.endMs, Date.parse('2026-10-28T04:00:00Z'), 'ends Wed Oct 28 12:00am ET');
ok(Array.isArray(PAYWALL_PROMO.tiers) && PAYWALL_PROMO.tiers.includes('elite') && PAYWALL_PROMO.tiers.includes('scout'), 'weekly + monthly');
ok(!PAYWALL_PROMO.tiers.includes('pro'), 'annual excluded');

eq(promoPrice(25.99), '$13.00', 'monthly 50%');
eq(promoPrice(7.99), '$4.00', 'weekly 50%');

ok(isPaywallPromoLive(Date.parse('2026-10-20T19:00:00Z')), 'live on opening night');
ok(isPaywallPromoLive(PAYWALL_PROMO.endMs), 'live at the end instant');
ok(!isPaywallPromoLive(PAYWALL_PROMO.endMs + 1), 'dead after the end instant');

const fall = PROMO_CODES.FALL50;
eq(fall.discount, 50, 'pricing catalog 50');
ok(fall.flash, 'flash');
ok(fall.expires.getTime() === PAYWALL_PROMO.endMs, 'catalog expiry matches');

const nhl = PROMO_CODES.NHL40;
ok(nhl.expires.getTime() < Date.parse('2026-10-20T00:00:00Z'), 'NHL40 already expired');

const week = formatPromoCountdown(7 * 86400000);
eq(week.days, 7, '7-day remaining formats as 7 days');
eq(week.hours, 0, 'even days');
ok(week.remaining > 0, 'remaining positive');

const gone = formatPromoCountdown(-5);
eq(gone.remaining, 0, 'negative remaining clamps to 0');
eq(gone.days, 0, 'zero days after expiry');

console.log(`OK — ${n} assertions`);
