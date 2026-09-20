/**
 * User-facing unit book: Full (1–6u) vs Conservative (half size, 1–3 ladder).
 * Display-only. Cron `finalUnits`, grader profit, and Record stay on the full book.
 */

export const UNIT_DISPLAY_SCALE = {
  FULL: 'full',
  CONSERVATIVE: 'conservative',
};

export const UNIT_DISPLAY_SCALE_STORAGE_KEY = 'sf_unit_display_scale';
export const CONSERVATIVE_UNIT_FACTOR = 0.5;

export function isUnitDisplayScale(value) {
  return value === UNIT_DISPLAY_SCALE.FULL || value === UNIT_DISPLAY_SCALE.CONSERVATIVE;
}

export function normalizeUnitDisplayScale(value) {
  return value === UNIT_DISPLAY_SCALE.CONSERVATIVE
    ? UNIT_DISPLAY_SCALE.CONSERVATIVE
    : UNIT_DISPLAY_SCALE.FULL;
}

/** Map cron/full units onto the user's selected book. */
export function scaleUnits(units, scale = UNIT_DISPLAY_SCALE.FULL) {
  const u = Number(units);
  if (!Number.isFinite(u)) return 0;
  if (u === 0) return 0;
  if (normalizeUnitDisplayScale(scale) !== UNIT_DISPLAY_SCALE.CONSERVATIVE) return u;
  return Math.round(u * CONSERVATIVE_UNIT_FACTOR * 100) / 100;
}

export function readStoredUnitDisplayScale() {
  try {
    if (typeof localStorage === 'undefined') return UNIT_DISPLAY_SCALE.FULL;
    return normalizeUnitDisplayScale(localStorage.getItem(UNIT_DISPLAY_SCALE_STORAGE_KEY));
  } catch {
    return UNIT_DISPLAY_SCALE.FULL;
  }
}

export function writeStoredUnitDisplayScale(scale) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(UNIT_DISPLAY_SCALE_STORAGE_KEY, normalizeUnitDisplayScale(scale));
  } catch {
    /* private mode */
  }
}
