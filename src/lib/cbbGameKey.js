/**
 * College basketball game keys.
 *
 * Odds API basketball_ncaab is the Division I slate. Opening week also puts
 * Division I vs non-Division I exhibitions on Polymarket (Reinhardt, Miami-
 * Middletown). Those schools are not in basketball_teams.csv. A resolved
 * school keeps its canonical name. An unknown school keeps the Polymarket
 * title, so the fetch and the wallet scan build the same key.
 */

export function normalizeCbb(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Longest whole-word prefix that is a map key.
 * "Miami" matches "Miami Hurricanes". It does not match
 * "Miami-Middletown ThunderHawks", because the hyphen is part of the school.
 */
export function findCbbTeamInMap(cbbMap, raw) {
  if (!cbbMap || raw == null) return null;
  const words = String(raw).trim().split(/\s+/).filter(Boolean);
  if (!words.length) return null;
  let best = null;
  let bestLen = 0;
  for (let i = 1; i <= words.length; i++) {
    const n = normalizeCbb(words.slice(0, i).join(' '));
    if (n.length < 2) continue;
    const canon = cbbMap.get(n);
    if (canon && n.length > bestLen) {
      best = canon;
      bestLen = n.length;
    }
  }
  return best;
}

/** Canonical school, or the Polymarket title when the map has no row. */
export function cbbSideLabel(canon, raw) {
  if (canon) return canon;
  const t = String(raw || '').replace(/\s+/g, ' ').trim();
  return t.length >= 2 ? t : null;
}

export function cbbPolyGameKey(cbbMap, rawA, rawB) {
  const a = cbbSideLabel(findCbbTeamInMap(cbbMap, rawA), rawA);
  const b = cbbSideLabel(findCbbTeamInMap(cbbMap, rawB), rawB);
  if (!a || !b) return null;
  return `${normalizeCbb(a)}_${normalizeCbb(b)}`;
}

/**
 * Main college basketball game slug. Futures and award markets are not games.
 *   cbb-winth-queen-2026-11-02
 *   cbb-rein-merc-2026-11-02
 */
export function isMainCBBGameSlug(slug) {
  const s = String(slug || '').toLowerCase();
  if (!s.startsWith('cbb-')) return false;
  if (/champion|naismith|mvp|award|futures?|conference|tournament|coach|player|spread|total|points|rebounds|assists|seed/.test(s)) {
    return false;
  }
  if (!/\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const body = s.replace(/^cbb-/, '').replace(/-\d{4}-\d{2}-\d{2}$/, '');
  const parts = body.split('-').filter(Boolean);
  return parts.length >= 2;
}
