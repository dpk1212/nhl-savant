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

/**
 * Lock-create leftover guard.
 *
 * Writer (`positionMatchesPolyEvent`) already keeps a slug date ≠ board
 * date when the ticket is on the board event. TNF is the live case:
 * kickoff `2026-09-11T00:35:00Z` (8:35pm ET Sep 10) → Poly slug
 * `nfl-sf-la-2026-09-11` on the `2026-09-10` ET board, eventId match.
 * Action tab shows the CONFIRMED ticket; create-missing used to require
 * every slug date === TARGET_DATE and dropped the game before v12 stamped.
 *
 * Only reject when every slug is *before* the ET board date (true
 * leftovers, e.g. wnba-atl-wsh-2026-08-07 on the Aug 8 board). Tomorrow's
 * UTC slug on tonight's ET game is not a leftover. `gameDateET` still
 * blocks writing Friday's slate under Thursday's doc id.
 *
 * @param {string[]} slugDates
 * @param {string} boardDate ET YYYY-MM-DD
 * @returns {boolean}
 */
function utcDatePlus(iso, days) {
  const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

function instantMs(value) {
  const ms = typeof value === 'number' ? value : Date.parse(value);
  return Number.isFinite(ms) ? ms : null;
}

function etCalendarDate(value) {
  const ms = instantMs(value);
  if (ms == null) return null;
  return new Date(ms).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

function utcCalendarDate(value) {
  const ms = instantMs(value);
  if (ms == null) return null;
  return new Date(ms).toISOString().slice(0, 10);
}

function slugTeamPair(slug) {
  const m = String(slug || '').toLowerCase().match(
    /^[a-z0-9]+-([a-z0-9]+)-([a-z0-9]+)-20\d{2}-\d{2}-\d{2}/,
  );
  return m ? [m[1], m[2]] : null;
}

/**
 * An 8:15pm ET kickoff is already the next day in UTC, so Polymarket's slug
 * is dated tomorrow while the ticket is filed on tonight's ET board. That is
 * this game, not a leftover. Tomorrow's commence on today's board still fails.
 */
export function isUtcSlugOfThisKick(pos, boardDate, gameKey = null) {
  const board = String(boardDate || pos?.date || '').slice(0, 10);
  const slug = String(pos?.eventSlug || pos?.slug || '');
  const slugDate = (slug.match(/(20\d{2}-\d{2}-\d{2})/) || [])[1] || null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(board) || !slugDate) return false;
  if (slugDate !== utcDatePlus(board, 1)) return false;
  const kick = pos?.commenceTime ?? pos?.commence ?? pos?.startTime;
  if (etCalendarDate(kick) !== board) return false;
  // The slug day has to be this kickoff's own UTC date. A morning timestamp
  // on the board date does not explain a tomorrow slug.
  if (utcCalendarDate(kick) !== slugDate) return false;
  const pair = slugTeamPair(slug);
  const gk = String(gameKey || pos?.gameKey || '').toLowerCase();
  if (!pair || !gk) return false;
  return gk === `${pair[0]}_${pair[1]}` || gk === `${pair[1]}_${pair[0]}`;
}

export function slugDatesAreBoardLeftovers(slugDates, boardDate) {
  const target = String(boardDate || '').slice(0, 10);
  if (!/^20\d{2}-\d{2}-\d{2}$/.test(target)) return false;
  const dates = (slugDates || [])
    .map((d) => String(d || '').slice(0, 10))
    .filter((d) => /^20\d{2}-\d{2}-\d{2}$/.test(d));
  if (dates.length === 0) return false;
  return dates.every((d) => d < target);
}

const FOREIGN_SLUG_LEAGUES = new Set([
  'mex', 'epl', 'lal', 'uefa', 'ucl', 'uel', 'mls', 'liga', 'serie', 'bundes',
  'fifa', 'fifwc', 'caf', 'afc', 'ufc', 'mma', 'atp', 'wta', 'canpl', 'cpl',
  'unl', 'conl',
  'cs2', 'lol',
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
      if (isUtcSlugOfThisKick(pos, boardDate, gameKey)) {
        return { ok: true, reason: 'utc_slug_same_kick' };
      }
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
      if (isUtcSlugOfThisKick(pos, boardDate, gameKey)) {
        return { ok: true, reason: 'utc_slug_same_kick' };
      }
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
