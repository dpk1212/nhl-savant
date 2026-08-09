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
 *   1. Position title `Spread: Team (±line)` — the wallet's actual market (incl. alts).
 *      Must beat game-level polySpread: main is often "Spread -1.5" while the wallet
 *      bought e.g. Sox +1.5 @ +150 (CLE@CWS 2026-08-09).
 *   2. matchSpreadLine from matchSpreadTitle (same title parse, already team-signed).
 *   3. polySpread.line + outcomeIndex / side (main market only; idx0 gets ps.line).
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

  // 1) Title "Spread: Team (±line)" — wallet market, including alternate lines
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

  // 2) matchSpreadTitle already extracted the team-signed line from the title
  if (matchSpreadLine != null && Number.isFinite(Number(matchSpreadLine))) {
    return Number(matchSpreadLine);
  }

  // 3) Main-market polySpread — idx0 / outcomes[0] carries ps.line; other side flips
  if (ps != null && Number.isFinite(Number(ps.line))) {
    const line = Number(ps.line);
    if (Number.isInteger(idx) && (idx === 0 || idx === 1)) {
      return idx === 0 ? line : -line;
    }
    // Side + outcomes[] when index missing
    const outs = Array.isArray(ps.outcomes) ? ps.outcomes : null;
    if (side && outs && outs.length >= 2) {
      const sideIdx = outs.findIndex((name) => teamNameToSide(name, awayName, homeName) === side);
      if (sideIdx === 0) return line;
      if (sideIdx === 1) return -line;
    }
  }

  return null;
}
