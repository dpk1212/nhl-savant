/**
 * Full-game vs derivative market classification for Polymarket.
 *
 * Sharp-flow TOTAL picks must track game O/U only. Polymarket events list
 * many Over/Under contracts per game (F5, team totals, 1H, NRFI, alts).
 * Outcome is still "Over"/"Under", so scanners that key only on outcome
 * mix F5 money into the game-total board (DET@SEA 2026-08-06: lead Over
 * wallet was "1st 5 Innings O/U 3.5", not game total).
 *
 * ML / spread have the same hole on CFB (and NBA/NFL) quarter & half
 * contracts. Anything that isn't spread/total is classified `ml`, so
 * "Toledo vs. Michigan State: 4Q Moneyline" title-matches the game and
 * locks as full-game ML. `\bq[1-4]\b` does not match titles like `4Q`.
 */

/**
 * True when title/slug is a period, half, or quarter contract — not the
 * full-game ML / spread / total. Covers Polymarket shapes:
 *   title  "Toledo vs. Michigan State: 4Q Moneyline"
 *   slug   cfb-toledo-mst-2026-09-04-4q-moneyline
 *   title  "1Q Spread: Michigan State (-0.5)"
 *   slug   …-1h-spread-home-4pt5
 */
export function isPeriodOrSegmentMarket(title = '', slug = '') {
  const t = String(title || '').toLowerCase();
  const sl = String(slug || '').toLowerCase();
  const blob = `${t} ${sl}`.trim();
  if (!blob) return false;

  // 1Q/4Q and Q1/Q4 (word-boundary; hyphens in slugs count as boundaries)
  if (/\b[1-4]q\b|\bq[1-4]\b/.test(blob)) return true;
  if (/\b(?:1st|2nd|3rd|4th|first|second|third|fourth)\s+quarter\b/.test(blob)) return true;

  // 1H/2H
  if (/\b[12]h\b/.test(blob)) return true;
  if (/\b(?:1st|2nd|first|second)\s+half\b/.test(blob)) return true;

  // NHL periods
  if (/\b(?:1st|2nd|3rd|first|second|third)\s+period\b/.test(blob)) return true;

  // Slug segments: …-4q-moneyline, …-1h-spread-home-4pt5
  if (/(?:^|-)(?:[1-4]q|[12]h)(?:-|$)/.test(sl)) return true;
  if (/(?:first|second)-half|(?:1st|2nd|3rd|4th)-quarter/.test(sl)) return true;

  return false;
}

function marketTitleBlob(m) {
  return `${m?.groupItemTitle || ''} ${m?.question || ''}`;
}

function parseOutcomes(m) {
  let outs = m?.outcomes;
  if (typeof outs === 'string') {
    try { outs = JSON.parse(outs); } catch { outs = []; }
  }
  return Array.isArray(outs) ? outs : [];
}

function isSpreadContract(m) {
  const git = (m?.groupItemTitle || '').toLowerCase();
  const q = (m?.question || '').toLowerCase();
  return git.includes('spread') || q.includes('spread:');
}

function isOuContract(m) {
  const git = (m?.groupItemTitle || '').toLowerCase();
  const q = (m?.question || '').toLowerCase();
  const outs = parseOutcomes(m);
  const hasOverUnder = outs.some((o) => /^(over|under)$/i.test(o));
  return hasOverUnder && (git.includes('o/u') || git.includes('over') || git.includes('under') || q.includes('o/u'));
}

/**
 * Full-game moneyline among an event's markets.
 * Prefers slug === event slug (CFB: `cfb-toledo-mst-2026-09-04`) so a
 * 4Q/1H moneyline listed earlier cannot win first-match.
 */
export function pickFullGameMlMarket(markets = [], eventSlug = '') {
  const ev = String(eventSlug || '').toLowerCase();
  const cands = [];
  for (const m of markets || []) {
    if (isSpreadContract(m) || isOuContract(m)) continue;
    if (isPeriodOrSegmentMarket(marketTitleBlob(m), m?.slug)) continue;
    cands.push(m);
  }
  if (!cands.length) return null;
  if (ev) {
    const exact = cands.find((m) => String(m.slug || '').toLowerCase() === ev);
    if (exact) return exact;
  }
  return cands[0];
}

/**
 * First full-game spread (skip 1Q/1H/… spreads). First remaining match
 * preserves today's "main line listed first" behaviour.
 */
export function pickFullGameSpreadMarket(markets = []) {
  for (const m of markets || []) {
    if (!isSpreadContract(m)) continue;
    if (isPeriodOrSegmentMarket(marketTitleBlob(m), m?.slug)) continue;
    return m;
  }
  return null;
}

/** True when title/slug is clearly NOT a full-game combined total. */
export function isNonFullGameTotalMarket(title = '', slug = '') {
  const s = `${title || ''} ${slug || ''}`.toLowerCase();
  if (!s.trim()) return false;

  // MLB first-5 innings
  if (/\bf5\b|f5-total|1st\s*5|first\s*5|first\s*five|1st\s*five/.test(s)) return true;

  // Team totals / player-ish totals mislabeled as O/U
  if (/team\s*total|\btt\b|batter|pitcher|hits?\s*o\/?u|strikeouts|player\s*total/.test(s)) return true;

  // Halves / periods / quarters (including `4Q` / `-4q-` slug forms)
  if (isPeriodOrSegmentMarket(title, slug)) return true;

  // First-inning run markets
  if (/\bnrfi\b|\byrfi\b|no\s*run\s*first|run\s*first\s*inning/.test(s)) return true;

  return false;
}

/**
 * Should this ML/spread position count toward the full-game board?
 * Period / half / quarter contracts must not lock as game ML or spread.
 * @returns {{ ok: boolean, reason?: string }}
 */
export function acceptFullGameSidePosition({
  title = '',
  slug = '',
  conditionId = null,
  fgConditionId = null,
  marketType = 'ml',
  sport = null,
} = {}) {
  if (isPeriodOrSegmentMarket(title, slug)) {
    return { ok: false, reason: 'period_or_segment_market' };
  }
  const mt = String(marketType || 'ml').toLowerCase();
  const sp = String(sport || '').toUpperCase();
  // Soccer is one binary market per side — do not require a single FG condition.
  if (sp !== 'SOC' && (mt === 'ml' || mt === 'moneyline')) {
    const a = String(conditionId || '').toLowerCase();
    const b = String(fgConditionId || '').toLowerCase();
    if (a && b && a !== b) {
      return { ok: false, reason: 'ml_condition_mismatch' };
    }
  }
  return { ok: true };
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
