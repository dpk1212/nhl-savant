/**
 * Create the Stripe THANKSGIVING promotion code.
 * Uses the Stripe HTTP API so the root app does not need the stripe SDK.
 *
 * Coupon: 33% off once (first invoice after trial = first week or month).
 * Expires Fri Nov 27, 2026 12:00am ET (through Thanksgiving night).
 * Product restriction is copied from the prior FALL50 coupon so annual
 * stays full price.
 *
 *   STRIPE_SECRET_KEY=sk_... node scripts/ensureThanksgivingPromo.mjs
 */
const END_MS = Date.parse('2026-11-27T05:00:00Z');
const END = Math.floor(END_MS / 1000);
const CODE = 'THANKSGIVING';
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

// Weekly Scout and monthly Elite. Annual (SAVANT PRO) and Elite Edge stay full price.
const PRODUCT_IDS = ['prod_TNGHGrFyMPqi7e', 'prod_TNGjh2ReNN9r1o'];

async function couponOf(promo) {
  const couponId = couponIdOf(promo);
  if (!couponId) return null;
  return stripe(`coupons/${couponId}?expand[]=applies_to`);
}

function sameProducts(coupon) {
  const ids = [...(coupon?.applies_to?.products || [])].sort();
  return ids.length === PRODUCT_IDS.length && PRODUCT_IDS.every((id) => ids.includes(id));
}

const existing = await stripe(`promotion_codes?code=${CODE}&limit=10`);
const codes = existing.data || [];
for (const promo of codes) {
  if (!promo.active) continue;
  const coupon = await couponOf(promo);
  const covers = promo.expires_at >= END
    && coupon?.percent_off === 33
    && coupon?.duration === 'once'
    && sameProducts(coupon);
  if (covers) {
    console.log(`THANKSGIVING already covers this window: ${promo.id}`);
    process.exit(0);
  }
  await stripe(`promotion_codes/${promo.id}`, { method: 'POST', body: [['active', 'false']] });
  console.log(`Deactivated ${promo.code} ${promo.id} so the first-period code can replace it`);
}

const couponBody = [
  ['percent_off', '33'],
  ['duration', 'once'],
  ['name', 'Thanksgiving 33% first period'],
  ['redeem_by', String(END)],
];
PRODUCT_IDS.forEach((id, i) => couponBody.push([`applies_to[products][${i}]`, id]));
const recent = await stripe('coupons?limit=10&expand[]=data.applies_to');
let coupon = (recent.data || []).find((c) => c.name === 'Thanksgiving 33% first period'
  && c.percent_off === 33
  && c.duration === 'once'
  && c.valid !== false
  && sameProducts(c));
if (!coupon) coupon = await stripe('coupons', { method: 'POST', body: couponBody });
const promo = await stripe('promotion_codes', {
  method: 'POST',
  body: [
    ['promotion[type]', 'coupon'],
    ['promotion[coupon]', coupon.id],
    ['code', CODE],
    ['active', 'true'],
    ['expires_at', String(END)],
  ],
});
console.log(`Created coupon ${coupon.id} and promotion code ${promo.id} (${CODE})`);
