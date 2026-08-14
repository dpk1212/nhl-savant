/**
 * Pinnacle tape retention — keep git-pushable `pinnacle_history.json`.
 *
 * GitHub rejects blobs > 100 MB. The fetch loop used to pretty-print every
 * alt spread/total on every cycle for the entire NFL slate (regular season
 * games months out), which blew past that limit and stalled market deploys.
 *
 * Policy:
 *   • Compact JSON (no pretty-print).
 *   • Skip consecutive unchanged prints for the same line.
 *   • Full 7-day tape only for games commencing within DENSE_TAPE_HORIZON_HOURS.
 *   • Far-future slates keep opener/current/board + a short tail.
 *   • Hard cap well under GitHub's 100 MB limit.
 */

export const HISTORY_KEEP_HOURS = 168; // 7 days for imminent games
export const MAX_ML_HISTORY = 2500; // ~7d @ 4 min
export const MAX_MULTI_HISTORY = 4000; // mixed-line spread/total after change-only
export const DENSE_TAPE_HORIZON_HOURS = 8 * 24;
export const FAR_ML_KEEP = 8;
export const FAR_SPREAD_KEEP = 24;
export const FAR_TOTAL_KEEP = 40;
/** Stay under GitHub's 100 MB hard limit with headroom for one fat cycle. */
export const GIT_SAFE_MAX_BYTES = 80 * 1024 * 1024;

function pointSec(t) {
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n > 1e12 ? n / 1000 : n;
}

function lineKey(snap, kind) {
  if (kind === 'spread') {
    const n = Number(snap?.homeLine);
    return Number.isFinite(n) ? n.toFixed(3) : 'spread';
  }
  if (kind === 'total') {
    const n = Number(snap?.line);
    return Number.isFinite(n) ? n.toFixed(3) : 'total';
  }
  return 'ml';
}

function quoteEqual(a, b, kind) {
  if (!a || !b) return false;
  if (kind === 'spread') {
    return a.homeOdds === b.homeOdds
      && a.awayOdds === b.awayOdds
      && a.fairBook === b.fairBook
      && (a.max ?? null) === (b.max ?? null)
      && Number(a.homeLine) === Number(b.homeLine)
      && Number(a.awayLine) === Number(b.awayLine);
  }
  if (kind === 'total') {
    return a.overOdds === b.overOdds
      && a.underOdds === b.underOdds
      && a.fairBook === b.fairBook
      && (a.max ?? null) === (b.max ?? null)
      && Number(a.line) === Number(b.line);
  }
  return a.away === b.away
    && a.home === b.home
    && (a.draw ?? null) === (b.draw ?? null)
    && a.fairBook === b.fairBook
    && (a.max ?? null) === (b.max ?? null);
}

export function maxHistoryForKind(kind) {
  return kind === 'ml' ? MAX_ML_HISTORY : MAX_MULTI_HISTORY;
}

/** Keep tape points for HISTORY_KEEP_HOURS (and never more than maxKeep). */
export function trimHistorySeries(arr, nowSec, maxKeep = MAX_MULTI_HISTORY) {
  if (!Array.isArray(arr) || !arr.length) return [];
  const cutoff = nowSec - HISTORY_KEEP_HOURS * 3600;
  const kept = arr.filter((h) => {
    const sec = pointSec(h?.t);
    if (sec == null) return true;
    return sec >= cutoff;
  });
  if (kept.length > maxKeep) return kept.slice(kept.length - maxKeep);
  return kept;
}

/**
 * Append a tape point unless the last print for that line is unchanged.
 * Alts that sit still (most of an NFL board) store one row, not one per cycle.
 */
export function appendTapePoint(arr, snap, kind, nowSec) {
  const list = Array.isArray(arr) ? arr.slice() : [];
  if (!snap || typeof snap !== 'object') {
    return trimHistorySeries(list, nowSec, maxHistoryForKind(kind));
  }
  const id = lineKey(snap, kind);
  for (let i = list.length - 1; i >= 0; i--) {
    if (lineKey(list[i], kind) !== id) continue;
    if (quoteEqual(list[i], snap, kind)) {
      return trimHistorySeries(list, nowSec, maxHistoryForKind(kind));
    }
    break;
  }
  list.push(snap);
  return trimHistorySeries(list, nowSec, maxHistoryForKind(kind));
}

export function commenceEpochSec(gd) {
  if (!gd?.commence) return null;
  const ms = Date.parse(gd.commence);
  if (!Number.isFinite(ms)) return null;
  return Math.floor(ms / 1000);
}

/** Full 7-day tape only when the game is inside the horizon (or commence unknown). */
export function isDenseTapeGame(gd, nowSec, horizonHours = DENSE_TAPE_HORIZON_HOURS) {
  const c = commenceEpochSec(gd);
  if (c == null) return true;
  return c <= nowSec + horizonHours * 3600;
}

export function clipFarGameTape(gd) {
  if (!gd || typeof gd !== 'object') return gd;
  if (Array.isArray(gd.history) && gd.history.length > FAR_ML_KEEP) {
    gd.history = gd.history.slice(-FAR_ML_KEEP);
  }
  if (Array.isArray(gd.spreadHistory) && gd.spreadHistory.length > FAR_SPREAD_KEEP) {
    gd.spreadHistory = gd.spreadHistory.slice(-FAR_SPREAD_KEEP);
  }
  if (Array.isArray(gd.totalHistory) && gd.totalHistory.length > FAR_TOTAL_KEEP) {
    gd.totalHistory = gd.totalHistory.slice(-FAR_TOTAL_KEEP);
  }
  return gd;
}

export function pruneGameTape(gd, nowSec) {
  if (!gd || typeof gd !== 'object') return gd;
  gd.history = trimHistorySeries(gd.history, nowSec, MAX_ML_HISTORY);
  gd.spreadHistory = trimHistorySeries(gd.spreadHistory, nowSec, MAX_MULTI_HISTORY);
  gd.totalHistory = trimHistorySeries(gd.totalHistory, nowSec, MAX_MULTI_HISTORY);
  if (!isDenseTapeGame(gd, nowSec)) clipFarGameTape(gd);
  return gd;
}

export function pruneHistoryObject(history, nowSec = Math.floor(Date.now() / 1000)) {
  if (!history || typeof history !== 'object') return history || {};
  for (const games of Object.values(history)) {
    if (!games || typeof games !== 'object') continue;
    for (const gd of Object.values(games)) pruneGameTape(gd, nowSec);
  }
  return history;
}

function serialize(history) {
  return JSON.stringify(history);
}

/**
 * Guarantee a git-pushable payload. After normal prune, if still over budget,
 * clip furthest-commence games first.
 */
export function enforceGitSafeSize(history, nowSec = Math.floor(Date.now() / 1000)) {
  pruneHistoryObject(history, nowSec);
  let json = serialize(history);
  let bytes = Buffer.byteLength(json);
  if (bytes <= GIT_SAFE_MAX_BYTES) {
    return { json, bytes, emergencyClips: 0 };
  }

  const games = [];
  for (const [sport, map] of Object.entries(history)) {
    if (!map || typeof map !== 'object') continue;
    for (const [gk, gd] of Object.entries(map)) {
      games.push({ sport, gk, gd, c: commenceEpochSec(gd) ?? 0 });
    }
  }
  games.sort((a, b) => b.c - a.c);

  let emergencyClips = 0;
  for (const g of games) {
    if (bytes <= GIT_SAFE_MAX_BYTES) break;
    const before = (g.gd.history?.length || 0)
      + (g.gd.spreadHistory?.length || 0)
      + (g.gd.totalHistory?.length || 0);
    clipFarGameTape(g.gd);
    if (Array.isArray(g.gd.history)) g.gd.history = g.gd.history.slice(-2);
    if (Array.isArray(g.gd.spreadHistory)) g.gd.spreadHistory = g.gd.spreadHistory.slice(-4);
    if (Array.isArray(g.gd.totalHistory)) g.gd.totalHistory = g.gd.totalHistory.slice(-4);
    const after = (g.gd.history?.length || 0)
      + (g.gd.spreadHistory?.length || 0)
      + (g.gd.totalHistory?.length || 0);
    if (after < before) emergencyClips++;
    json = serialize(history);
    bytes = Buffer.byteLength(json);
  }

  return { json, bytes, emergencyClips };
}
