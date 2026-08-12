/**
 * Full-game vs derivative total market classification for Polymarket.
 *
 * Sharp-flow TOTAL picks must track game O/U only. Polymarket events list
 * many Over/Under contracts per game (F5, team totals, 1H, NRFI, alts).
 * Outcome is still "Over"/"Under", so scanners that key only on outcome
 * mix F5 money into the game-total board (DET@SEA 2026-08-06: lead Over
 * wallet was "1st 5 Innings O/U 3.5", not game total).
 */

/** True when title/slug is clearly NOT a full-game combined total. */
export function isNonFullGameTotalMarket(title = '', slug = '') {
  const s = `${title || ''} ${slug || ''}`.toLowerCase();
  if (!s.trim()) return false;

  // MLB first-5 innings
  if (/\bf5\b|f5-total|1st\s*5|first\s*5|first\s*five|1st\s*five/.test(s)) return true;

  // Team totals / player-ish totals mislabeled as O/U
  if (/team\s*total|\btt\b|batter|pitcher|hits?\s*o\/?u|strikeouts|player\s*total/.test(s)) return true;

  // Halves / periods / quarters
  if (
    /1st\s*half|first\s*half|\b1h\b|2nd\s*half|second\s*half|\b2h\b/.test(s)
    || /1st\s*period|2nd\s*period|3rd\s*period|first\s*period/.test(s)
    || /1st\s*quarter|2nd\s*quarter|3rd\s*quarter|4th\s*quarter|\bq[1-4]\b/.test(s)
  ) return true;

  // First-inning run markets
  if (/\bnrfi\b|\byrfi\b|no\s*run\s*first|run\s*first\s*inning/.test(s)) return true;

  return false;
}

/**
 * Parse the O/U number from a Polymarket total title/question.
 * Prefer the number after O/U|Over|Under|Total so "1st 5 Innings O/U 3.5"
 * yields 3.5 (caller still rejects via isNonFullGameTotalMarket).
 */
export function parseTotalEntryLine(title = '') {
  const m = String(title || '').match(/(?:O\/U|Over|Under|Total)[^\d]*(\d+\.?\d*)/i);
  if (!m) return null;
  const n = parseFloat(m[1]);
  return Number.isFinite(n) ? n : null;
}

/**
 * Keep alt full-game lines near the event's main poly/Pinnacle total.
 * Without this, Over 6.5 + Under 7.5 mix into one board and can invent
 * a side with no real main-line money.
 *
 * @param {number|null|undefined} entryLine
 * @param {number|null|undefined} mainLine  — polyTotal.line when known
 * @param {{ maxDiff?: number }} [opts]
 */
export function isMainishTotalLine(entryLine, mainLine, { maxDiff = 2.5 } = {}) {
  if (!Number.isFinite(entryLine)) return false;
  if (!Number.isFinite(mainLine)) return true; // no anchor → allow FG positions
  return Math.abs(Number(entryLine) - Number(mainLine)) <= maxDiff;
}

/**
 * Defense-in-depth when title/slug were not persisted on a position record.
 * MLB F5 lines cluster ~3–5.5; full-game totals are almost always ≥ 6.
 * Only applied when sport is MLB and we lack a title to classify.
 */
export function looksLikeMlbF5Line(entryLine) {
  return Number.isFinite(entryLine) && entryLine < 5.5;
}

/**
 * Should this total position count toward sharp-flow game TOTAL?
 * @returns {{ ok: boolean, reason?: string }}
 */
export function acceptFullGameTotalPosition({
  title = '',
  slug = '',
  entryLine = null,
  mainLine = null,
  sport = null,
  // Keep near-main full-game alts (MLB opens 7.5 → books steam to 9.5).
  // F5 / team totals still rejected via title/slug + MLB F5 heuristic.
  maxDiff = 2.5,
} = {}) {
  if (isNonFullGameTotalMarket(title, slug)) {
    return { ok: false, reason: 'non_full_game_total' };
  }
  const line = Number.isFinite(entryLine) ? entryLine : parseTotalEntryLine(title);
  if (!title && !slug && (sport || '').toUpperCase() === 'MLB' && looksLikeMlbF5Line(line)) {
    return { ok: false, reason: 'mlb_f5_line_heuristic' };
  }
  if (Number.isFinite(line) && Number.isFinite(mainLine) && !isMainishTotalLine(line, mainLine, { maxDiff })) {
    return { ok: false, reason: 'alt_line_off_main' };
  }
  return { ok: true };
}
