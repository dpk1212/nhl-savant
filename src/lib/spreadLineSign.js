/**
 * Wallet-perspective spread line (positive = that side getting points).
 *
 * Polymarket NFL titles name the listed side: "Spread: TEN (-4.5)" means
 * Titans lay 4.5. Buying the SEA token is Seahawks +4.5. Storing the title
 * number onto the held side inverts favorite/dog (SEA@TEN 2026-08-23).
 *
 * Display and scanners share this so a bad stored entryLine cannot paint
 * the card. Does not change side, juice, or stake.
 */
import { resolveNFLTeam } from '../../scripts/lib/nflTeams.js';
import { resolveWNBATeam } from '../../scripts/lib/wnbaTeams.js';

export function normalizeSpreadText(s) {
  return String(s || '').replace(/[\u2212\u2013\u2014]/g, '-');
}

export function normalizeTeamKey(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** TEN / Titans / Tennessee → same NFL code. */
export function sportTeamCode(name) {
  if (!name) return null;
  return resolveNFLTeam(name) || resolveWNBATeam(name) || null;
}

export function labelsAreSameTeam(a, b) {
  if (!a || !b) return false;
  const na = normalizeTeamKey(a);
  const nb = normalizeTeamKey(b);
  if (!na || !nb) return false;
  if (na === nb || na.includes(nb) || nb.includes(na)) return true;
  const ca = sportTeamCode(a);
  const cb = sportTeamCode(b);
  return !!(ca && cb && ca === cb);
}

export function labelsAreDistinctTeams(a, b) {
  const ca = sportTeamCode(a);
  const cb = sportTeamCode(b);
  return !!(ca && cb && ca !== cb);
}

/** Code identity only — TEN vs Seahawks/Titans → home. */
export function teamLabelToSide(teamName, awayName, homeName) {
  const c = sportTeamCode(teamName);
  if (!c) return null;
  const a = sportTeamCode(awayName);
  const h = sportTeamCode(homeName);
  if (c === a && c !== h) return 'away';
  if (c === h && c !== a) return 'home';
  return null;
}

export function parseSpreadTitle(title) {
  const t = normalizeSpreadText(title);
  const m = t.match(/^Spread:\s+(.+?)\s*\(([+-]?\d+\.?\d*)\)/i);
  if (!m) return null;
  const line = parseFloat(m[2]);
  if (!Number.isFinite(line)) return null;
  return { team: m[1].trim(), line };
}

/**
 * `nfl-sea-ten-2026-08-24-spread-home-4pt5` → named side lays that number.
 * Holding the other side flips.
 */
export function spreadLineFromMarketSlug(slug, side) {
  const s = String(slug || '').toLowerCase();
  const m = s.match(/spread-(home|away)-(\d+)(?:pt(\d+))?/);
  if (!m) return null;
  if (side !== 'home' && side !== 'away') return null;
  const named = m[1];
  const whole = Number(m[2]);
  const frac = m[3] != null ? Number(`0.${m[3]}`) : 0;
  const pts = whole + frac;
  if (!Number.isFinite(pts) || pts <= 0) return null;
  const namedLine = -pts;
  return side === named ? namedLine : -namedLine;
}

/** Copy title/slug onto peers that share conditionId (title-less lead wallet). */
export function inheritSpreadMarketHints(positions) {
  const byCid = new Map();
  for (const p of positions || []) {
    const cid = String(p.conditionId || '').toLowerCase();
    if (!cid) continue;
    const cur = byCid.get(cid) || {};
    if (p.title && !cur.title) cur.title = p.title;
    if (p.slug && !cur.slug) cur.slug = p.slug;
    if (p.eventSlug && !cur.eventSlug) cur.eventSlug = p.eventSlug;
    byCid.set(cid, cur);
  }
  return (positions || []).map((p) => {
    const hint = byCid.get(String(p.conditionId || '').toLowerCase());
    if (!hint) return p;
    return {
      ...p,
      title: p.title || hint.title,
      slug: p.slug || hint.slug || hint.eventSlug,
    };
  });
}

function substringTeamToSide(teamName, awayName, homeName) {
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

function titleSideOf(team, awayName, homeName) {
  return substringTeamToSide(team, awayName, homeName)
    || teamLabelToSide(team, awayName, homeName);
}

function flipTitleLine(titleLine, titleTeam, { side, outcome, awayName, homeName } = {}) {
  if (!Number.isFinite(titleLine)) return null;
  const titleSide = titleSideOf(titleTeam, awayName, homeName);
  if (side && titleSide) return titleSide === side ? titleLine : -titleLine;
  if (labelsAreSameTeam(outcome, titleTeam)) return titleLine;
  if (labelsAreDistinctTeams(outcome, titleTeam)) return -titleLine;
  return null;
}

/**
 * Signed handicap for the held token. Never returns the titled team's
 * raw number onto the other token.
 */
export function resolveSignedSpreadLine({
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
  const fromSlug = spreadLineFromMarketSlug(slug, side);
  if (Number.isFinite(fromSlug)) return fromSlug;

  const parsed = parseSpreadTitle(title);
  if (parsed) {
    const flipped = flipTitleLine(parsed.line, parsed.team, {
      side, outcome, awayName, homeName,
    });
    if (Number.isFinite(flipped)) return flipped;
    if (!parsed.team && Number.isFinite(parsed.line)) return parsed.line;
  } else {
    const loose = normalizeSpreadText(title).match(/\(([+-]?\d+\.?\d*)\)/);
    if (loose && !/^Spread:/i.test(String(title))) {
      const n = parseFloat(loose[1]);
      if (Number.isFinite(n)) return n;
    }
  }

  // matchSpreadTitle extracts the TITLED team's line.
  // With a title team: flip or drop. Without a title: caller already signed it.
  if (matchSpreadLine != null && Number.isFinite(Number(matchSpreadLine))) {
    const raw = Number(matchSpreadLine);
    if (parsed?.team) {
      const flipped = flipTitleLine(raw, parsed.team, {
        side, outcome, awayName, homeName,
      });
      if (Number.isFinite(flipped)) return flipped;
    } else {
      return raw;
    }
  }

  const ps = polySpread && typeof polySpread === 'object' ? polySpread : null;
  const idx = outcomeIndex != null && outcomeIndex !== ''
    ? Number(outcomeIndex)
    : NaN;
  if (ps != null && Number.isFinite(Number(ps.line))) {
    const line = Number(ps.line);
    const outs = Array.isArray(ps.outcomes) ? ps.outcomes : null;
    // Game-level polySpread.line belongs to outcomes[0]; the other token flips.
    // NFL mains list [TEN, SEA] — not away/home order (SEA@TEN 2026-08-23).
    if (outs && outs.length >= 2) {
      const lineOwner = titleSideOf(outs[0], awayName, homeName);
      if (side && lineOwner) return side === lineOwner ? line : -line;
      if (labelsAreSameTeam(outcome, outs[0])) return line;
      if (labelsAreDistinctTeams(outcome, outs[0])) return -line;
    }
    if (Number.isInteger(idx) && (idx === 0 || idx === 1)) {
      return idx === 0 ? line : -line;
    }
  }

  return null;
}

/** Re-sign a stored vault row. Title/slug win; stored entryLine is last resort. */
export function signedSpreadEntryLine(p, ctx = {}) {
  if (!p) return null;
  const side = ctx.side || p.side;
  const signed = resolveSignedSpreadLine({
    title: p.title || '',
    outcome: p.outcome || '',
    outcomeIndex: p.outcomeIndex,
    side,
    awayName: ctx.awayName || p.awayName || p.away,
    homeName: ctx.homeName || p.homeName || p.home,
    slug: p.slug || p.eventSlug || ctx.slug || '',
    matchSpreadLine: null,
    polySpread: ctx.polySpread || null,
  });
  if (Number.isFinite(signed)) return signed;
  const stored = Number(p.entryLine ?? p.spreadLine);
  return Number.isFinite(stored) ? stored : null;
}

export function isSpreadPolarityFlip(a, b) {
  return Number.isFinite(a)
    && Number.isFinite(b)
    && Math.abs(a) >= 0.5
    && Math.abs(a + b) < 0.051;
}
