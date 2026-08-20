/**
 * Gate: a Polymarket position belongs to today's game only if its event
 * matches the poly cache for that game key.
 *
 * Title-only matching is unsafe — spread titles are often
 * "Spread: St. Louis Cardinals (-1.5)" with no opponent/date. A postponed
 * Cards–Reds market (still open under mlb-stl-cin-2026-05-24) then matches
 * today's Cards@Angels by the single team code "stl".
 *
 * Prefer eventId equality. If IDs differ, prove the SAME GAME via slug date
 * + team codes — Gamma rebuilds the cache every cycle and the event that
 * wins a gameKey is not stable (live vs pregame, ML vs total sibling).
 * Raw ID inequality is cache churn, not a wrong-game ticket.
 *
 * Writer may EXIT only on WRONG_GAME_EXIT_REASONS (other-day / other-teams).
 * Never on eventId_mismatch.
 */

import { resolveWNBATeam } from './wnbaTeams.js';
import { BOARD_SPORT_SLUG, slugLeague, SOC_SLUG_LEAGUES } from '../../src/lib/sportSlug.js';

/** Real other-game leftovers. Cache ID churn is NOT in this set. */
export const WRONG_GAME_EXIT_REASONS = new Set([
  'slug_date_vs_board',
  'slug_date_mismatch',
  'slug_teams_mismatch',
  'slug_teams_mismatch_wnba',
  'slug_sport_mismatch',
]);

const FOREIGN_SLUG_LEAGUES = new Set([
  'mex', 'epl', 'lal', 'uefa', 'ucl', 'uel', 'mls', 'liga', 'serie', 'bundes',
  'fifa', 'fifwc', 'caf', 'afc', 'ufc', 'mma', 'atp', 'wta', 'canpl', 'cpl',
]);

/**
 * @param {object} pos
 * @param {object|null} polyGame
 * @param {string|null} gameKey
 * @param {{ boardDate?: string|null, sport?: string|null }} [opts] boardDate = ET YYYY-MM-DD; sport = WNBA/MLB/…
 * @returns {{ ok: boolean, reason: string }}
 */
export function positionMatchesPolyEvent(pos, polyGame, gameKey = null, opts = {}) {
  const boardDate = opts?.boardDate != null ? String(opts.boardDate).slice(0, 10) : null;
  const slug = String(pos?.eventSlug || pos?.slug || '');
  const slugDate = (slug.match(/(20\d{2}-\d{2}-\d{2})/) || [])[1] || null;
  const sport = opts?.sport || null;

  // Allowlist before eventId — poly cache often has no slug (Fever 2026-08-16).
  // canpl/mex on the same calendar day is not a WNBA moneyline.
  const posLeagueEarly = slugLeague(slug);
  const sportUpper = String(sport || '').toUpperCase();
  const boardLeagueEarly = slugLeague(polyGame?.slug || polyGame?.eventSlug || '')
    || BOARD_SPORT_SLUG[sportUpper]
    || null;
  if (posLeagueEarly && boardLeagueEarly && posLeagueEarly !== boardLeagueEarly) {
    return { ok: false, reason: 'slug_sport_mismatch' };
  }
  const socNative = sportUpper === 'SOC' && SOC_SLUG_LEAGUES.has(posLeagueEarly);
  if (posLeagueEarly && FOREIGN_SLUG_LEAGUES.has(posLeagueEarly) && !boardLeagueEarly && !socNative) {
    return { ok: false, reason: 'slug_sport_mismatch' };
  }

  if (!polyGame || typeof polyGame !== 'object') {
    // Hard reject other-day markets when poly cache is missing (WNBA overnight
    // leftovers: wnba-atl-wsh-2026-08-07 sitting on the 2026-08-08 board).
    if (boardDate && slugDate && slugDate !== boardDate) {
      return { ok: false, reason: 'slug_date_vs_board' };
    }
    return { ok: false, reason: 'no_poly_game' };
  }

  const posEventId = pos?.eventId != null && pos.eventId !== ''
    ? String(pos.eventId)
    : null;
  const gameEventId = polyGame.eventId != null && polyGame.eventId !== ''
    ? String(polyGame.eventId)
    : null;

  // Hard reject other-day slugs UNLESS this ticket is on the exact event the
  // board already kept. Polymarket reuses postponed slugs (Cards–Reds DH
  // 2026-08-17: mlb-stl-cin-2026-05-24, startTime moved to today). Event id
  // equality means the rainout market IS today's game — not a leftover on
  // a different matchup (that case still fails: ids differ).
  if (boardDate && slugDate && slugDate !== boardDate) {
    const reusedOnBoard = !!(posEventId && gameEventId && posEventId === gameEventId);
    if (!reusedOnBoard) {
      return { ok: false, reason: 'slug_date_vs_board' };
    }
  }

  const gameDate = polyGame.polyGameDate ? String(polyGame.polyGameDate).slice(0, 10) : null;

  // Primary: Polymarket event id. Equal IDs are sufficient. Unequal IDs
  // fall through — slug date/teams decide same-game vs wrong-game.
  if (posEventId && gameEventId && posEventId === gameEventId) {
    return { ok: true, reason: 'eventId' };
  }

  if (slugDate && gameDate && slugDate !== gameDate) {
    return { ok: false, reason: 'slug_date_mismatch' };
  }

  // Same calendar day is not the same game. Soccer/UFC slugs used to pass
  // this gate onto WNBA/MLB boards (mex-ame-asl-DATE → Fever ML +223).
  const posLeague = slugLeague(slug);
  const gameLeague = slugLeague(polyGame.slug || polyGame.eventSlug || '');
  if (posLeague && gameLeague && posLeague !== gameLeague) {
    return { ok: false, reason: 'slug_sport_mismatch' };
  }
  if (posLeague && FOREIGN_SLUG_LEAGUES.has(posLeague) && !gameLeague) {
    return { ok: false, reason: 'slug_sport_mismatch' };
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

  // Same calendar game, different Gamma event (cache churn / sibling market).
  if (slugDate && (slugDate === boardDate || slugDate === gameDate)) {
    return { ok: true, reason: posEventId && gameEventId && posEventId !== gameEventId
      ? 'same_game_event_churn'
      : 'slug_date' };
  }

  // Position names an event we can't verify against this game → skip
  if (posEventId && !gameEventId) {
    return { ok: false, reason: 'game_missing_eventId' };
  }

  // No eventId on the position (rare) — allow title match
  if (!posEventId) return { ok: true, reason: 'no_eventId_legacy' };

  if (posEventId && gameEventId && posEventId !== gameEventId) {
    return { ok: false, reason: 'eventId_mismatch' };
  }

  return { ok: false, reason: 'unverified' };
}
