/**
 * Action lock pin — Source B is the book.
 *
 * Law:
 *   1. Census / skill / status read Source B (on-chain Action).
 *   2. Featured is a mirror of B. A ticket cannot appear on Featured
 *      unless Action has the same leg.
 *   3. T−15 is the hold line. Still PENDING at lock → stay on Action
 *      through grade, even if the scanner later drops the asset.
 *
 * minutesToCommence = (commence − now) / 60k
 *   > 15  sold before lock → drop
 *   ≤ 15  inside T−15 or after first pitch → hold / grade
 */

export const ACTION_LOCK_PIN_MIN = 15;
export const ACTION_LOCK_PIN_MS = ACTION_LOCK_PIN_MIN * 60 * 1000;
export const ACTION_PRIOR_B_MIN_N = 2;
export const RANK_RESCUE_MIN_BETS = 8;

const EXITED_SKIP_REASONS = new Set([
  'date_calendar_retag',
  'slug_date_vs_board',
  'slug_date_mismatch',
  'slug_teams_mismatch',
  'slug_teams_mismatch_wnba',
]);

const SCAN_DROP_EXIT_REASONS = new Set([
  'asset_absent',
  'soft_key_absent_legacy',
]);

function asFinite(v) {
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function parseActionTimeMs(v) {
  if (v == null) return null;
  if (typeof v.toMillis === 'function') {
    const ms = v.toMillis();
    return Number.isFinite(ms) ? ms : null;
  }
  if (Number.isFinite(v.seconds)) return v.seconds * 1000;
  if (typeof v === 'string') {
    const t = Date.parse(v);
    return Number.isFinite(t) ? t : null;
  }
  const n = Number(v);
  if (!Number.isFinite(n) || n === 0) return null;
  return n > 1e12 ? n : n * 1000;
}

export function minutesToCommence(commenceMs, nowMs = Date.now()) {
  const ct = asFinite(commenceMs);
  const now = asFinite(nowMs);
  if (ct == null || now == null) return null;
  return +((ct - now) / 60000).toFixed(1);
}

/** True once we are inside the T−15 freeze (or the game has started). */
export function isActionLockPinned(commenceMs, nowMs = Date.now()) {
  const ct = asFinite(commenceMs);
  const now = asFinite(nowMs);
  if (ct == null || now == null) return false;
  return now >= ct - ACTION_LOCK_PIN_MS;
}

/**
 * Do not stamp scan-drop EXITED after T−15. Wrong-game / period leftovers
 * still exit. Missing commence fail-opens (allow EXITED; grader may still hold).
 */
export function shouldSkipScanDropExit({
  commenceTime = null,
  exitReason = null,
  nowMs = Date.now(),
} = {}) {
  if (!SCAN_DROP_EXIT_REASONS.has(String(exitReason || ''))) return false;
  return isActionLockPinned(commenceTime, nowMs);
}

function etDateMinusDays(days) {
  return new Date(Date.now() - days * 86400000)
    .toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

/**
 * EXITED tickets that were still on at T−15 (or after first pitch) still
 * grade onto Their Action. Pre-lock sells and calendar retags do not.
 */
export function shouldGradeExited(pos) {
  if (!pos || pos.status !== 'EXITED') return false;
  if (EXITED_SKIP_REASONS.has(String(pos.exitReason || ''))) return false;

  const mtc = asFinite(pos.minutesToCommence);
  if (mtc != null) return mtc < ACTION_LOCK_PIN_MIN;

  const ct = asFinite(pos.commenceTime);
  const exited = parseActionTimeMs(pos.exitedAt);
  if (ct != null && ct > 1e11 && exited != null) {
    return exited >= ct - ACTION_LOCK_PIN_MS;
  }

  const reason = String(pos.exitReason || '');
  if (reason === 'asset_absent' || reason === 'soft_key_absent_legacy') {
    const floor = etDateMinusDays(5);
    if (pos.date && String(pos.date) >= floor) return true;
  }
  return false;
}

export function actionLegKey(leg) {
  if (!leg || typeof leg !== 'object') return '';
  const date = String(leg.date || '');
  const mkt = String(leg.marketType || leg.market || '').toUpperCase();
  const side = String(leg.side || '').toLowerCase();
  const gk = String(leg.gameKey || '')
    .toLowerCase()
    .replace(/^(nhl|nba|mlb|cbb|cfb|nfl|soc|ufc|wnba):/, '')
    .replace(/_\d{4}-\d{2}-\d{2}.*$/, '');
  return `${date}|${mkt}|${side}|${gk}`;
}

/** Featured list may only show legs that exist on Source B Action. */
export function restrictFeaturedToAction(featured, action) {
  const keys = new Set(
    (Array.isArray(action) ? action : []).map(actionLegKey).filter(Boolean),
  );
  return (Array.isArray(featured) ? featured : []).filter((leg) => {
    const k = actionLegKey(leg);
    return k && keys.has(k);
  });
}

/**
 * V12 quality / skill prior — Source B first when the Action book exists.
 * Source A (our card appearances) is fallback only when B is thin.
 */
export function walletPriorStatsPreferB(sportRec) {
  if (!sportRec) return null;
  const picksN = Number(sportRec.picks?.n) || 0;
  const posN = Number(sportRec.positions?.n) || 0;
  const picksFlat = Number(sportRec.picks?.flatRoi);
  const posFlat = Number(sportRec.positions?.positionFlatRoi);
  const dollarRoi = Number(sportRec.positions?.dollarRoi);
  const positiveB = [posFlat, dollarRoi].filter((x) => Number.isFinite(x) && x > 0);
  const tier = sportRec.whitelistTier || null;

  if (posN >= ACTION_PRIOR_B_MIN_N) {
    let priorRoi = Number.isFinite(posFlat) ? posFlat : 0;
    if (!(priorRoi > 0) && Number.isFinite(dollarRoi) && dollarRoi > 0) {
      priorRoi = dollarRoi;
    }
    return { tier, priorN: posN, priorRoi, priorSource: 'B' };
  }

  if (picksN >= ACTION_PRIOR_B_MIN_N) {
    let priorRoi = Number.isFinite(picksFlat) ? picksFlat : 0;
    if (!(priorRoi > 0) && positiveB.length > 0) {
      priorRoi = Math.max(...positiveB);
    }
    return { tier, priorN: picksN, priorRoi, priorSource: 'A' };
  }

  let priorRoi = Number.isFinite(posFlat) ? posFlat : 0;
  if (!(priorRoi > 0) && Number.isFinite(dollarRoi) && dollarRoi > 0) {
    priorRoi = dollarRoi;
  }
  return { tier, priorN: posN, priorRoi, priorSource: posN > 0 ? 'B' : null };
}

/** RANK rescue: Action book first, featured count only if B is thin. */
export function isRankEligibleOnSourceB(profile, sport) {
  const rec = profile?.bySport?.[sport];
  if (!rec) return false;
  const tier = rec.whitelistTier;
  if (tier !== 'CONFIRMED' && tier !== 'FLAT' && tier !== 'WR50') return false;
  const posN = Number(rec.positions?.n) || 0;
  const picksN = Number(rec.picks?.n) || 0;
  if (posN >= RANK_RESCUE_MIN_BETS) return true;
  if (posN > 0) return false;
  return picksN >= RANK_RESCUE_MIN_BETS;
}
