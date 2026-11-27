/**
 * Black Friday. 50% off the first month on Monthly.
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

eq(PAYWALL_PROMO.code, 'BF50', 'code');
eq(PAYWALL_PROMO.discount, 0.5, '50%');
eq(PAYWALL_PROMO.label, 'Black Friday', 'label');
eq(DEFAULT_PROMO_CODE, 'BF50', 'default code');
eq(PAYWALL_PROMO.endMs, Date.parse('2026-11-28T05:00:00Z'), 'ends Sat Nov 28 12:00am ET');
ok(Array.isArray(PAYWALL_PROMO.tiers) && PAYWALL_PROMO.tiers.length === 1 && PAYWALL_PROMO.tiers.includes('elite'), 'monthly only');
ok(!PAYWALL_PROMO.tiers.includes('scout'), 'weekly stays full price');
ok(!PAYWALL_PROMO.tiers.includes('pro'), 'annual excluded');

eq(promoPrice(25.99), '$13.00', 'monthly 50%');

ok(isPaywallPromoLive(Date.parse('2026-11-27T15:00:00Z')), 'live Friday afternoon');
ok(isPaywallPromoLive(PAYWALL_PROMO.endMs), 'live at midnight');
ok(!isPaywallPromoLive(PAYWALL_PROMO.endMs + 1), 'dead after midnight');

const bf = PROMO_CODES.BF50;
eq(bf.discount, 50, 'pricing catalog 50');
ok(bf.flash, 'flash');
ok(bf.expires.getTime() === PAYWALL_PROMO.endMs, 'catalog expiry matches');
ok(bf.tiers.length === 1 && bf.tiers[0] === 'elite', 'catalog is monthly');

const thanks = PROMO_CODES.THANKSGIVING;
ok(thanks.expires.getTime() === Date.parse('2026-11-27T05:00:00Z'), 'Thanksgiving stays on Thursday midnight');
ok(thanks.expires.getTime() < Date.parse('2026-11-27T15:00:00Z'), 'Thanksgiving already expired Friday afternoon');

const fall = PROMO_CODES.FALL50;
ok(fall.expires.getTime() === Date.parse('2026-11-04T05:00:00Z'), 'FALL50 stays on its old end');

const nhl = PROMO_CODES.NHL40;
ok(nhl.expires.getTime() < Date.parse('2026-10-20T00:00:00Z'), 'NHL40 already expired');

const week = formatPromoCountdown(7 * 86400000);
eq(week.days, 7, '7-day remaining formats as 7 days');
eq(week.hours, 0, 'even days');
ok(week.remaining > 0, 'remaining positive');

const gone = formatPromoCountdown(-5);
eq(gone.remaining, 0, 'negative remaining clamps to 0');
eq(gone.days, 0, 'zero days after expiry');

const endLiteral = "Date.parse('2026-11-28T05:00:00Z')";
const checkout = fs.readFileSync(new URL('../functions/src/createCheckoutSession.js', import.meta.url), 'utf8');
ok(checkout.includes(endLiteral), 'checkout function uses the same end');
ok(checkout.includes("code: 'BF50'"), 'checkout applies BF50');
ok(checkout.includes("new Set(['elite'])"), 'checkout is monthly only');

console.log(`OK — ${n} assertions`);
