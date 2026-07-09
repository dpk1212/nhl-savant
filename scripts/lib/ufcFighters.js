/**
 * UFC fighter resolution — shared by fetchPolymarketData, snapshotPinnacle,
 * scanSharpPositions, scanWhitelistedWallets, seedSportsSharps, buildWhaleProfiles.
 *
 * Polymarket fight-card events look like:
 *   slug:  ufc-max1-con-2026-07-11
 *   title: UFC 329: Max Holloway vs. Conor McGregor (Welterweight, Main Card)
 *   ML market: 2-way outcomes ["Max Holloway", "Conor McGregor"] (NOT negRisk)
 *
 * Odds API sport key: mma_mixed_martial_arts (includes non-UFC orgs).
 * We gate to UFC by requiring a matching Polymarket main-fight slug.
 *
 * Game keys: normalized fighter names joined, e.g. "maxholloway_conormcgregor".
 * Do NOT use Polymarket short codes (max1/con) — they are opaque and unstable.
 */

/** Fold diacritics then strip non-alphanumerics: "Benoît Saint-Denis" -> "benoitsaintdenis". */
export function normalizeFighterName(s) {
  return (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Known Odds API ↔ Polymarket spelling mismatches → canonical normalized key.
 * Add rows as we observe misses in fetch logs.
 */
const UFC_ALIASES = {
  // Odds API often drops accents / uses hyphen variants
  benoitsaintdenis: 'benoitsaintdenis',
  terrancemckinney: 'terrancemckinney',
  // Nickname / legal-name bridges (expand as needed)
  bobbygreen: 'kinggreen',
  kinggreen: 'kinggreen',
};

/** Resolve a raw fighter string to a canonical normalized key, or null. */
export function resolveUFCFighter(raw) {
  if (!raw) return null;
  const cleaned = String(raw)
    .replace(/\s*\([^)]*\)\s*$/g, '') // strip trailing (Welterweight) etc.
    .replace(/^ufc\s*\d+\s*:\s*/i, '')
    .trim();
  const n = normalizeFighterName(cleaned);
  if (!n || n.length < 3) return null;
  return UFC_ALIASES[n] || n;
}

/** Game key from two fighter name strings (order = away_home / fighterA_fighterB). */
export function makeUFCGameKey(a, b) {
  const aa = resolveUFCFighter(a);
  const bb = resolveUFCFighter(b);
  if (!aa || !bb || aa === bb) return null;
  return `${aa}_${bb}`;
}

/**
 * Parse fighters from a Polymarket / Odds-style UFC title.
 *   "UFC 329: Max Holloway vs. Conor McGregor (Welterweight, Main Card)"
 *   "Max Holloway vs. Conor McGregor"
 */
export function extractUFCFightersFromTitle(title) {
  let t = (title || '').trim();
  if (!t) return null;
  t = t.replace(/^ufc\s*\d+\s*:\s*/i, '');
  t = t.replace(
    /\s*\([^)]*(?:weight|prelim|main\s*card|early\s*prelim|co-?main)[^)]*\)\s*$/i,
    '',
  );
  const m = t.match(/^(.+?)\s+vs\.?\s+(.+?)\s*$/i);
  if (!m) return null;
  const a = m[1].trim().replace(/\s+/g, ' ');
  const b = m[2].trim().replace(/\s+/g, ' ');
  if (a.length < 2 || b.length < 2) return null;
  // Reject futures / props that slipped through
  if (/champion|fight next|method|distance|round|parlay/i.test(a + ' ' + b)) return null;
  return [a, b];
}

/**
 * True if a Polymarket event slug is a MAIN UFC fight-card ML event.
 * Drops method-of-win, totals, futures, "who fights next", champion markets.
 *   ✅ ufc-max1-con-2026-07-11
 *   ❌ ufc-max1-con-2026-07-11-win-by-ko-tko
 *   ❌ who-will-be-ufc-lightweight-champion-at-the-end-of-2026
 */
export function isMainUFCFightSlug(slug) {
  return /^ufc-[a-z0-9]+-[a-z0-9]+-\d{4}-\d{2}-\d{2}$/i.test(slug || '');
}

/**
 * Precise UFC-title classifier for wallet-universe sport tagging.
 * Requires an explicit UFC mention — never bare "fight" (CBB Fighting Illini).
 */
export function isUFCMarketTitle(title) {
  const t = (title || '').toLowerCase();
  if (!/\bufc\b/.test(t)) return false;
  if (/\bvs\.?\b/.test(t)) return true;
  if (/win by|go the distance|method of|o\/u\s*\d|over\/under|rounds?\b/.test(t)) return true;
  if (/^will\s+.+\s+win\b/.test(t)) return true;
  if (/fight next|champion|pound.?for.?pound/.test(t)) return true;
  return false;
}

/**
 * Match a Polymarket position/market title to a UFC fight in todaysGames
 * (keys are "UFC:fighterA_fighterB").
 *
 * UFC ML is a single 2-way market (fighter names as outcomes), so titles are
 * usually the event title. Props ("Will Max Holloway win by KO?") still map
 * to the fight for sport classification / position attach when both fighters
 * can be inferred; otherwise single-fighter props need the fight in scope.
 *
 * Returns { key, sport: 'UFC', side, awayName, homeName } or null.
 * side is 'away' | 'home' when resolvable, else null (caller uses outcome).
 */
export function matchUFCPositionTitle(posTitle, todaysGames) {
  const t = (posTitle || '').trim();
  if (!t || !/\bufc\b/i.test(t)) return null;

  // Event-level / ML title with both fighters
  const pair = extractUFCFightersFromTitle(t);
  if (pair) {
    const key = makeUFCGameKey(pair[0], pair[1]);
    const rev = makeUFCGameKey(pair[1], pair[0]);
    if (key && todaysGames[`UFC:${key}`]) {
      const g = todaysGames[`UFC:${key}`];
      return { key, sport: 'UFC', side: null, awayName: g.away, homeName: g.home };
    }
    if (rev && todaysGames[`UFC:${rev}`]) {
      const g = todaysGames[`UFC:${rev}`];
      return { key: rev, sport: 'UFC', side: null, awayName: g.away, homeName: g.home };
    }
  }

  // Single-fighter prop: "Will Max Holloway win by KO or TKO?"
  const m = t.match(/^will\s+(.+?)\s+win\b/i);
  if (m) {
    const fighter = resolveUFCFighter(m[1]);
    if (!fighter) return null;
    let fallback = null;
    for (const [fullKey, g] of Object.entries(todaysGames)) {
      if (!fullKey.startsWith('UFC:')) continue;
      const key = fullKey.slice(4);
      const [a, b] = key.split('_');
      if (a !== fighter && b !== fighter) continue;
      const side = a === fighter ? 'away' : 'home';
      const hit = { key, sport: 'UFC', side, awayName: g.away, homeName: g.home };
      if (!fallback) fallback = hit;
      // Prefer unique match; if multiple fights share a fighter (rare same-card), keep first
      return hit;
    }
    return fallback;
  }

  return null;
}
