/**
 * Resolve Polymarket position → home/away (or over/under) for sports scans.
 *
 * Polymarket's data-api often returns a STALE `outcome` string (wrong team
 * name from a prior market). Blindly defaulting unresolved names to `away`
 * inverted real sides (e.g. Angels +1.5 stamped as Cardinals -1.5).
 *
 * Priority for binary ML/spread:
 *   1. outcomeIndex + market outcomes[]  (token index — trustworthy)
 *   2. outcome string matched to away/home names
 *   3. unresolved → null (caller MUST skip — never invent `away`)
 */

export function normalizeTeamKey(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Map a team label to 'away' | 'home' | null. */
export function teamNameToSide(teamName, awayName, homeName) {
  if (!teamName) return null;
  const o = normalizeTeamKey(teamName);
  const nAway = normalizeTeamKey(awayName);
  const nHome = normalizeTeamKey(homeName);
  if (!o) return null;
  if (nAway && (o.includes(nAway) || nAway.includes(o))) return 'away';
  if (nHome && (o.includes(nHome) || nHome.includes(o))) return 'home';
  for (const word of String(teamName).split(/\s+/)) {
    const w = normalizeTeamKey(word);
    if (w.length < 3) continue;
    if (nAway && nAway.includes(w)) return 'away';
    if (nHome && nHome.includes(w)) return 'home';
  }
  return null;
}

/**
 * @returns {{ side: 'away'|'home'|null, source: string }}
 */
export function resolveBinarySide({
  outcome = '',
  outcomeIndex = null,
  awayName,
  homeName,
  marketOutcomes = null,
} = {}) {
  const outs = Array.isArray(marketOutcomes) ? marketOutcomes : null;
  const idx = outcomeIndex != null && outcomeIndex !== ''
    ? Number(outcomeIndex)
    : NaN;

  // 1) Token index + published outcomes (canonical)
  if (outs && outs.length >= 2 && Number.isInteger(idx) && idx >= 0 && idx < outs.length) {
    const fromIdx = teamNameToSide(outs[idx], awayName, homeName);
    if (fromIdx) return { side: fromIdx, source: 'outcomeIndex' };
  }

  // 2) Outcome string (only when it actually names a side)
  const o = normalizeTeamKey(outcome);
  if (o === 'yes') {
    // Legacy binary: "Yes" ≈ first listed team. Only trust if outcomes exist.
    if (outs?.[0]) {
      const fromYes = teamNameToSide(outs[0], awayName, homeName);
      if (fromYes) return { side: fromYes, source: 'outcome_yes' };
    }
  } else if (o === 'no') {
    if (outs?.[1]) {
      const fromNo = teamNameToSide(outs[1], awayName, homeName);
      if (fromNo) return { side: fromNo, source: 'outcome_no' };
    }
  } else {
    const fromOutcome = teamNameToSide(outcome, awayName, homeName);
    if (fromOutcome) return { side: fromOutcome, source: 'outcome' };
  }

  // 3) Index-only fallback when outcomes[] missing but game away/home known.
  //    Polymarket sports binaries are almost always [away, home] in title order.
  //    Prefer skip over this when possible — used only as last resort.
  if ((!outs || outs.length < 2) && Number.isInteger(idx) && (idx === 0 || idx === 1)
      && awayName && homeName) {
    return { side: idx === 0 ? 'away' : 'home', source: 'outcomeIndex_assumed_ah' };
  }

  return { side: null, source: 'unresolved' };
}

/**
 * Spread entry line from the wallet's perspective (positive = that side getting runs/points).
 * Prefer outcomeIndex + polySpread.line; title parse uses resolved side for polarity.
 */
export function resolveSpreadEntryLine({
  title = '',
  outcome = '',
  outcomeIndex = null,
  side = null,
  awayName,
  homeName,
  polySpread = null,
  matchSpreadLine = null,
} = {}) {
  const ps = polySpread && typeof polySpread === 'object' ? polySpread : null;
  const idx = outcomeIndex != null && outcomeIndex !== ''
    ? Number(outcomeIndex)
    : NaN;

  // 1) Index + poly line (sign: idx0 = ps.line, idx1 = -ps.line)
  if (ps != null && Number.isFinite(Number(ps.line)) && Number.isInteger(idx)) {
    if (idx === 0) return Number(ps.line);
    if (idx === 1) return -Number(ps.line);
  }

  // 2) Title "Spread: Team (±line)" — polarity vs resolved side
  const titleLineMatch = String(title).match(/\(([+-]?\d+\.?\d*)\)/);
  const titleTeamMatch = String(title).match(/^Spread:\s+(.+?)\s*\(/i);
  if (titleLineMatch) {
    const titleLine = parseFloat(titleLineMatch[1]);
    if (Number.isFinite(titleLine) && titleTeamMatch) {
      const titleSide = teamNameToSide(titleTeamMatch[1], awayName, homeName);
      if (side && titleSide) {
        return titleSide === side ? titleLine : -titleLine;
      }
      // No resolved side: only trust title line if outcome names the title team
      const o = normalizeTeamKey(outcome);
      const t = normalizeTeamKey(titleTeamMatch[1]);
      if (o && t && (o.includes(t) || t.includes(o))) return titleLine;
    } else if (Number.isFinite(titleLine) && !titleTeamMatch) {
      return titleLine;
    }
  }

  // 3) Match-time spread line hint (weak)
  if (matchSpreadLine != null && Number.isFinite(Number(matchSpreadLine))) {
    return Number(matchSpreadLine);
  }
  return null;
}
