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

import {
  normalizeTeamKey as signNormalizeTeamKey,
  resolveSignedSpreadLine,
  teamLabelToSide,
} from '../../src/lib/spreadLineSign.js';

export function normalizeTeamKey(s) {
  return signNormalizeTeamKey(s);
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
  // NFL/WNBA codes: "TEN" vs board nicknames "Titans" (SEA@TEN 2026-08-23)
  return teamLabelToSide(teamName, awayName, homeName);
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

  // 1) Token index + published outcomes (canonical for that market)
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
 * Spread side for a wallet position.
 *
 * Do NOT trust game-level polySpread.outcomes[] + outcomeIndex alone: alt /
 * away-1.5 markets reuse index 0/1 with a different team order. CLE@CWS
 * 2026-08-09: title "Spread: Guardians (-1.5)" + outcome Guardians, but main
 * poly outcomes [Sox, Guardians] + idx0 stamped side=home (Sox).
 *
 * Priority:
 *   1. outcome team (held token — covers other side of "Spread: Fav (-1.5)")
 *   2. title team when outcome missing/unresolved
 *   3. binary index helper (last resort; unsafe across alt markets)
 */
export function resolveSpreadSide({
  title = '',
  outcome = '',
  outcomeIndex = null,
  awayName,
  homeName,
  marketOutcomes = null,
} = {}) {
  const fromOutcome = teamNameToSide(outcome, awayName, homeName);
  if (fromOutcome) return { side: fromOutcome, source: 'outcome' };

  const titleTeamMatch = String(title).match(/^Spread:\s+(.+?)\s*\(/i);
  if (titleTeamMatch) {
    const fromTitle = teamNameToSide(titleTeamMatch[1], awayName, homeName);
    if (fromTitle) return { side: fromTitle, source: 'spread_title' };
  }

  return resolveBinarySide({
    outcome,
    outcomeIndex,
    awayName,
    homeName,
    marketOutcomes,
  });
}

/**
 * Spread entry line from the wallet's perspective (positive = that side getting runs/points).
 *
 * Priority:
 *   1. Market slug `spread-(home|away)-NptN` — exact alt.
 *   2. Position title `Spread: Team (±line)` — flip when held token ≠ titled team.
 *   3. matchSpreadLine only after the same flip (it is the titled team's number).
 *   4. polySpread.line + outcomeIndex / side (main market only).
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
  slug = '',
} = {}) {
  return resolveSignedSpreadLine({
    title,
    outcome,
    outcomeIndex,
    side,
    awayName,
    homeName,
    polySpread,
    matchSpreadLine,
    slug,
  });
}
