/**
 * Live flash promo — Thanksgiving.
 * First invoice only: first week on Weekly (scout), first month on Monthly
 * (elite). Annual stays full price. Stripe promotion code must match `code`
 * and stay restricted to those two prices.
 *
 * Window: through Thanksgiving night, Thu Nov 26 ET
 * (Fri Nov 27, 12:00am ET). DST ended Nov 1, so that midnight is 05:00 UTC.
 */
export const PAYWALL_PROMO = {
  code: 'THANKSGIVING',
  discount: 0.33,
  label: 'Thanksgiving',
  endMs: Date.parse('2026-11-27T05:00:00Z'),
  endCopy: 'Thursday, November 26',
  seasonCopy: 'Thanksgiving',
  tiers: ['elite', 'scout'],
};

export const PROMO_CODES = {
  THANKSGIVING: {
    code: 'THANKSGIVING',
    discount: 33,
    label: 'Thanksgiving',
    forLife: false,
    flash: true,
    durationLabel: 'your first week (Weekly) or first month (Monthly)',
    expires: new Date(PAYWALL_PROMO.endMs),
    tiers: ['scout', 'elite'],
  },
  // Expired tip-off code — old ?promo=FALL50 links fail closed.
  FALL50: {
    code: 'FALL50',
    discount: 50,
    label: 'NBA Tip-Off',
    forLife: false,
    flash: true,
    durationLabel: 'your first week (Weekly) or first month (Monthly)',
    expires: new Date('2026-11-04T05:00:00Z'),
    tiers: ['scout', 'elite'],
  },
  // Expired opening-week code — old ?promo=NHL40 links fail closed.
  NHL40: {
    code: 'NHL40',
    discount: 40,
    label: 'NHL Opening',
    forLife: false,
    flash: true,
    durationLabel: 'your first week (Weekly) or first month (Monthly)',
    expires: new Date('2026-10-05T04:00:00Z'),
    tiers: ['scout', 'elite'],
  },
};

export const DEFAULT_PROMO_CODE = PAYWALL_PROMO.code;

export function isPaywallPromoLive(now = Date.now()) {
  return Number.isFinite(PAYWALL_PROMO.endMs) && now <= PAYWALL_PROMO.endMs;
}

export function promoPrice(full) {
  const n = Math.round(Number(full) * (1 - PAYWALL_PROMO.discount) * 100) / 100;
  return `$${n.toFixed(2)}`;
}

export function formatPromoCountdown(remainingMs) {
  const remaining = Math.max(0, Number(remainingMs) || 0);
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return { remaining, days, hours, minutes, seconds };
}
