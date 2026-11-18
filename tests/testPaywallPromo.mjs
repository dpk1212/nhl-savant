/**
 * Thanksgiving flash promo. 33% off the first week or first month.
 * Usage: node tests/testPaywallPromo.mjs
 */
import assert from 'assert';
import fs from 'fs';
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

eq(PAYWALL_PROMO.code, 'THANKSGIVING', 'code');
eq(PAYWALL_PROMO.discount, 0.33, '33%');
eq(PAYWALL_PROMO.label, 'Thanksgiving', 'label');
eq(DEFAULT_PROMO_CODE, 'THANKSGIVING', 'default code');
eq(PAYWALL_PROMO.endMs, Date.parse('2026-11-27T05:00:00Z'), 'ends Fri Nov 27 12:00am ET');
ok(Array.isArray(PAYWALL_PROMO.tiers) && PAYWALL_PROMO.tiers.includes('elite') && PAYWALL_PROMO.tiers.includes('scout'), 'weekly + monthly');
ok(!PAYWALL_PROMO.tiers.includes('pro'), 'annual excluded');

eq(promoPrice(25.99), '$17.41', 'monthly 33%');
eq(promoPrice(7.99), '$5.35', 'weekly 33%');

ok(isPaywallPromoLive(Date.parse('2026-11-18T13:00:00Z')), 'live the morning it went up');
ok(isPaywallPromoLive(Date.parse('2026-11-26T17:00:00Z')), 'live Thanksgiving afternoon');
ok(isPaywallPromoLive(PAYWALL_PROMO.endMs), 'live at the end instant');
ok(!isPaywallPromoLive(PAYWALL_PROMO.endMs + 1), 'dead after the end instant');

const thanks = PROMO_CODES.THANKSGIVING;
eq(thanks.discount, 33, 'pricing catalog 33');
ok(thanks.flash, 'flash');
ok(thanks.expires.getTime() === PAYWALL_PROMO.endMs, 'catalog expiry matches');

const fall = PROMO_CODES.FALL50;
ok(fall.expires.getTime() === Date.parse('2026-11-04T05:00:00Z'), 'FALL50 stays on its old end');
ok(fall.expires.getTime() < Date.parse('2026-11-18T00:00:00Z'), 'FALL50 already expired');

const nhl = PROMO_CODES.NHL40;
ok(nhl.expires.getTime() < Date.parse('2026-10-20T00:00:00Z'), 'NHL40 already expired');

const week = formatPromoCountdown(7 * 86400000);
eq(week.days, 7, '7-day remaining formats as 7 days');
eq(week.hours, 0, 'even days');
ok(week.remaining > 0, 'remaining positive');

const gone = formatPromoCountdown(-5);
eq(gone.remaining, 0, 'negative remaining clamps to 0');
eq(gone.days, 0, 'zero days after expiry');

const endLiteral = "Date.parse('2026-11-27T05:00:00Z')";
const checkout = fs.readFileSync(new URL('../functions/src/createCheckoutSession.js', import.meta.url), 'utf8');
const stripeScript = fs.readFileSync(new URL('../scripts/ensureThanksgivingPromo.mjs', import.meta.url), 'utf8');
ok(checkout.includes(endLiteral), 'checkout function uses the same end');
ok(checkout.includes("code: 'THANKSGIVING'"), 'checkout applies THANKSGIVING');
ok(stripeScript.includes(endLiteral), 'stripe script uses the same end');
ok(stripeScript.includes("['percent_off', '33']"), 'stripe coupon is 33% once');

console.log(`OK — ${n} assertions`);
