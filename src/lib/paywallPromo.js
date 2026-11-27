/**
 * Live flash promo — Black Friday.
 * 50% off the first paid month on Monthly (elite). Weekly and annual
 * stay full price. Stripe promotion code must match `code` and stay
 * restricted to the monthly price.
 *
 * Window: through Friday night, Nov 27 ET
 * (Sat Nov 28, 12:00am ET). DST ended Nov 1, so that midnight is 05:00 UTC.
 */
export const PAYWALL_PROMO = {
  code: 'BF50',
  discount: 0.5,
  label: 'Black Friday',
  endMs: Date.parse('2026-11-28T05:00:00Z'),
  endCopy: 'midnight tonight ET',
  seasonCopy: 'Black Friday',
  tiers: ['elite'],
};

export const PROMO_CODES = {
  BF50: {
    code: 'BF50',
    discount: 50,
    label: 'Black Friday',
    forLife: false,
    flash: true,
    durationLabel: 'your first month',
    expires: new Date(PAYWALL_PROMO.endMs),
    tiers: ['elite'],
  },
  // Expired holiday code — old ?promo=THANKSGIVING links fail closed.
  THANKSGIVING: {
    code: 'THANKSGIVING',
    discount: 33,
    label: 'Thanksgiving',
    forLife: false,
    flash: true,
    durationLabel: 'your first week (Weekly) or first month (Monthly)',
    expires: new Date('2026-11-27T05:00:00Z'),
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
