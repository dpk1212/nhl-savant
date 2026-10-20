/**
 * Live flash promo — NBA tip-off week.
 * First invoice only: first week on Weekly (scout), first month on Monthly
 * (elite). Annual stays full price. Stripe promotion code must match `code`
 * and stay restricted to those two prices.
 *
 * Window: opening night Tue Oct 20 → Tue Oct 27 night ET
 * (Wed Oct 28, 12:00am ET).
 */
export const PAYWALL_PROMO = {
  code: 'FALL50',
  discount: 0.50,
  label: 'NBA Tip-Off',
  endMs: Date.parse('2026-10-28T04:00:00Z'),
  endCopy: 'Tuesday night ET',
  seasonCopy: 'the start of the NBA season',
  tiers: ['elite', 'scout'],
};

export const PROMO_CODES = {
  FALL50: {
    code: 'FALL50',
    discount: 50,
    label: 'NBA Tip-Off',
    forLife: false,
    flash: true,
    durationLabel: 'your first week (Weekly) or first month (Monthly)',
    expires: new Date(PAYWALL_PROMO.endMs),
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
