/**
 * Create the Stripe FALL50 promotion code if it is missing.
 * Uses the Stripe HTTP API so the root app does not need the stripe SDK.
 *
 * Coupon: 50% off once (first invoice after trial = first week or month).
 * Expires Wed Oct 28, 2026 12:00am ET. Restrict the code to weekly + monthly
 * prices in the Stripe dashboard (same as NHL40).
 *
 *   STRIPE_SECRET_KEY=sk_... node scripts/ensureFall50Promo.mjs
 */
const END = Math.floor(Date.parse('2026-10-28T04:00:00Z') / 1000);
const CODE = 'FALL50';
const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error('STRIPE_SECRET_KEY is required');
  process.exit(1);
}

function form(obj) {
  return new URLSearchParams(
    Object.entries(obj).filter(([, v]) => v != null && v !== ''),
  );
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

const existing = await stripe(`promotion_codes?code=${CODE}&limit=5`);
const live = (existing.data || []).find((p) => p.active);
if (live) {
  console.log(`FALL50 already live: ${live.id}`);
  process.exit(0);
}

const coupon = await stripe('coupons', {
  method: 'POST',
  body: {
    percent_off: '50',
    duration: 'once',
    name: 'FALL50 NBA tip-off',
    redeem_by: String(END),
  },
});
const promo = await stripe('promotion_codes', {
  method: 'POST',
  body: {
    coupon: coupon.id,
    code: CODE,
    active: 'true',
    expires_at: String(END),
  },
});
console.log(`Created coupon ${coupon.id} and promotion code ${promo.id} (${CODE})`);
console.log('Restrict FALL50 to weekly + monthly prices in Stripe (annual stays full price).');
