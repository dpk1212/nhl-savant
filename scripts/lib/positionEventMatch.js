/**
 * Gate: a Polymarket position belongs to today's game only if its event
 * matches the poly cache for that game key.
 *
 * Title-only matching is unsafe — spread titles are often
 * "Spread: St. Louis Cardinals (-1.5)" with no opponent/date. A postponed
 * Cards–Reds market (still open under mlb-stl-cin-2026-05-24) then matches
 * today's Cards@Angels by the single team code "stl".
 *
 * Prefer eventId equality. Fall back to eventSlug date / MLB+WNBA team codes.
 */

import { resolveWNBATeam } from './wnbaTeams.js';

/**
 * @param {object} pos
 * @param {object|null} polyGame
 * @param {string|null} gameKey
 * @param {{ boardDate?: string|null }} [opts] boardDate = ET YYYY-MM-DD for the board day
 * @returns {{ ok: boolean, reason: string }}
 */
export function positionMatchesPolyEvent(pos, polyGame, gameKey = null, opts = {}) {
  const boardDate = opts?.boardDate != null ? String(opts.boardDate).slice(0, 10) : null;
  const slug = String(pos?.eventSlug || pos?.slug || '');
  const slugDate = (slug.match(/(20\d{2}-\d{2}-\d{2})/) || [])[1] || null;

  // Hard reject other-day markets even when poly cache is missing (WNBA overnight
  // leftovers: wnba-atl-wsh-2026-08-07 sitting on the 2026-08-08 board).
  if (boardDate && slugDate && slugDate !== boardDate) {
    return { ok: false, reason: 'slug_date_vs_board' };
  }

  if (!polyGame || typeof polyGame !== 'object') {
    return { ok: false, reason: 'no_poly_game' };
  }

  const posEventId = pos?.eventId != null && pos.eventId !== ''
    ? String(pos.eventId)
    : null;
  const gameEventId = polyGame.eventId != null && polyGame.eventId !== ''
    ? String(polyGame.eventId)
    : null;

  // Primary: Polymarket event id (authoritative)
  if (posEventId && gameEventId) {
    if (posEventId === gameEventId) return { ok: true, reason: 'eventId' };
    return { ok: false, reason: 'eventId_mismatch' };
  }

  const gameDate = polyGame.polyGameDate ? String(polyGame.polyGameDate).slice(0, 10) : null;

  if (slugDate && gameDate && slugDate !== gameDate) {
    return { ok: false, reason: 'slug_date_mismatch' };
  }

  // MLB slug codes: mlb-stl-cin-2026-05-24 vs gameKey stl_laa
  const mlbSlug = slug.match(/^mlb-([a-z0-9]+)-([a-z0-9]+)-(20\d{2}-\d{2}-\d{2})/i);
  if (mlbSlug && gameKey) {
    const a = mlbSlug[1].toLowerCase();
    const b = mlbSlug[2].toLowerCase();
    const gk = String(gameKey).toLowerCase();
    if (!gk.includes(a) || !gk.includes(b)) {
      return { ok: false, reason: 'slug_teams_mismatch' };
    }
  }

  // WNBA slug codes: wnba-atl-wsh-2026-08-07 (Polymarket uses wsh; we store was)
  const wnbaSlug = slug.match(/^wnba-([a-z0-9]+)-([a-z0-9]+)-(20\d{2}-\d{2}-\d{2})/i);
  if (wnbaSlug && gameKey) {
    const a = resolveWNBATeam(wnbaSlug[1])?.toLowerCase();
    const b = resolveWNBATeam(wnbaSlug[2])?.toLowerCase();
    const gk = String(gameKey).toLowerCase();
    if (!a || !b || !gk.includes(a) || !gk.includes(b)) {
      return { ok: false, reason: 'slug_teams_mismatch_wnba' };
    }
  }

  // Position names an event we can't verify against this game → skip
  if (posEventId && !gameEventId) {
    return { ok: false, reason: 'game_missing_eventId' };
  }

  if (slugDate && gameDate && slugDate === gameDate) {
    return { ok: true, reason: 'slug_date' };
  }

  // No eventId on the position (rare) — allow title match
  if (!posEventId) return { ok: true, reason: 'no_eventId_legacy' };

  return { ok: false, reason: 'unverified' };
}
