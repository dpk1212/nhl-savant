/**
 * Restore the Stripe FALL50 promotion code for the extended window.
 * Uses the Stripe HTTP API so the root app does not need the stripe SDK.
 *
 * Coupon: 50% off once (first invoice after trial = first week or month).
 * Expires Wed Nov 4, 2026 12:00am ET. An expired code cannot be turned
 * back on. If none is active, this creates a new coupon and a new FALL50
 * code. Active codes must be unique, so an expired FALL50 does not block it.
 *
 *   STRIPE_SECRET_KEY=sk_... node scripts/ensureFall50Promo.mjs
 */
const END_MS = Date.parse('2026-11-04T05:00:00Z');
const END = Math.floor(END_MS / 1000);
const CODE = 'FALL50';
const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error('STRIPE_SECRET_KEY is required');
  process.exit(1);
}

function form(entries) {
  const params = new URLSearchParams();
  for (const [name, value] of entries) {
    if (value != null && value !== '') params.append(name, String(value));
  }
  return params;
}

async function stripe(path, { method = 'GET', body } = {}) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body ? form(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.message || `${res.status} ${path}`);
  }
  return json;
}

function couponIdOf(promo) {
  if (!promo) return null;
  if (typeof promo.coupon === 'string') return promo.coupon;
  if (promo.coupon?.id) return promo.coupon.id;
  const nested = promo.promotion?.coupon;
  if (typeof nested === 'string') return nested;
  return nested?.id || null;
}

const existing = await stripe(`promotion_codes?code=${CODE}&limit=10`);
const codes = existing.data || [];
const coversWindow = codes.find((p) => p.active && (!p.expires_at || p.expires_at >= END));
if (coversWindow) {
  console.log(`FALL50 already covers this window: ${coversWindow.id}`);
  process.exit(0);
}
const stillActive = codes.find((p) => p.active);
if (stillActive) {
  console.error(`FALL50 ${stillActive.id} is active but ends before ${new Date(END_MS).toISOString()}. Stripe will not extend it. Deactivate that code, then rerun.`);
  process.exit(1);
}

let productIds = [];
const previousCouponId = couponIdOf(codes[0]);
if (previousCouponId) {
  try {
    const old = await stripe(`coupons/${previousCouponId}`);
    productIds = old.applies_to?.products || [];
  } catch (err) {
    console.warn(`Could not read the previous coupon: ${err.message}`);
  }
}

const couponBody = [
  ['percent_off', '50'],
  ['duration', 'once'],
  ['name', 'FALL50 another week'],
  ['redeem_by', String(END)],
];
productIds.forEach((id, i) => couponBody.push([`applies_to[products][${i}]`, id]));
const coupon = await stripe('coupons', { method: 'POST', body: couponBody });
const promo = await stripe('promotion_codes', {
  method: 'POST',
  body: [
    ['coupon', coupon.id],
    ['code', CODE],
    ['active', 'true'],
    ['expires_at', String(END)],
  ],
});
console.log(`Created coupon ${coupon.id} and promotion code ${promo.id} (${CODE})`);
if (!productIds.length) {
  console.log('Restrict FALL50 to weekly + monthly prices in Stripe (annual stays full price).');
}
