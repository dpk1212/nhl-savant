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
  // Polymarket full legal name ↔ Odds/Pinnacle short form (UFC FN 2026-07-18)
  josemigueldelgado: 'josedelgado',
  josedelgado: 'josedelgado',
  levirodriguesjr: 'levirodrigues',
  levirodrigues: 'levirodrigues',
  seokhyeonko: 'seokhyunko',
  seokhyunko: 'seokhyunko',
  // Noche UFC 2026-09-12 — Odds/Pinnacle legal vs Poly card name
  tommygantt: 'thomasgantt',
  thomasgantt: 'thomasgantt',
  rongzhu: 'zhurong',
  zhurong: 'zhurong',
};

/**
 * Strip card branding so fighter A is not "Noche UFC: Jean Silva"
 * or "Dana White's Contender Series: Zevan Hunt".
 * Numbered cards, Fight Night, Apex, Noche, and DWCS all use `Brand:`.
 */
export function stripUFCEventPrefix(s) {
  return String(s || '')
    .replace(/^(?:noche\s+)?ufc(?:\s+(?:fight\s+night|on\s+[^:]+|\d+))?\s*:\s*/i, '')
    .replace(/^(?:dana\s+white['\u2019]?s?\s+)?contender\s+series\s*:\s*/i, '')
    .replace(/^dwcs\s*:\s*/i, '');
}

/** Same 6h-back / 72h-forward band as NFL Odds-API keep. */
export const UFC_POLY_ONLY_BACK_MS = 6 * 3600 * 1000;
export const UFC_POLY_ONLY_FWD_MS = 72 * 3600 * 1000;

/**
 * DWCS / Apex cards often have Poly ML markets with no US-book Odds API row.
 * Keep main-fight slugs whose startTime is in this short window.
 */
export function isUfcPolyOnlyWindow(startIso, nowMs = Date.now()) {
  const startMs = startIso ? new Date(startIso).getTime() : NaN;
  if (!Number.isFinite(startMs) || !Number.isFinite(nowMs)) return false;
  return startMs >= nowMs - UFC_POLY_ONLY_BACK_MS && startMs <= nowMs + UFC_POLY_ONLY_FWD_MS;
}

/** Resolve a raw fighter string to a canonical normalized key, or null. */
export function resolveUFCFighter(raw) {
  if (!raw) return null;
  const cleaned = stripUFCEventPrefix(String(raw)
    .replace(/\s*\([^)]*\)\s*$/g, '') // strip trailing (Welterweight) etc.
    .replace(/\s+,?\s*(jr\.?|sr\.?|ii|iii|iv)\s*$/i, ''))
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
 * Reverse a two-part UFC key (`patriciopitbull_doohochoi` → `doohochoi_patriciopitbull`).
 * Poly titles use card order; Odds API / Pinnacle use away_home. Exactly one `_`.
 */
export function flipUFCGameKey(key) {
  if (!key || typeof key !== 'string') return null;
  const i = key.indexOf('_');
  if (i <= 0 || i === key.length - 1) return null;
  if (key.indexOf('_', i + 1) !== -1) return null;
  const a = key.slice(0, i);
  const b = key.slice(i + 1);
  if (!a || !b || a === b) return null;
  return `${b}_${a}`;
}

/**
 * Prefer an Odds API / already-seeded UFC key when either order is present.
 * Falls back to title order so DWCS/Apex poly-only fights still ingest.
 */
export function resolveUFCScheduleKey(validSet, fighterA, fighterB) {
  const titleKey = makeUFCGameKey(fighterA, fighterB);
  const flipKey = makeUFCGameKey(fighterB, fighterA);
  if (titleKey && validSet?.has?.(titleKey)) return titleKey;
  if (flipKey && validSet?.has?.(flipKey)) return flipKey;
  return titleKey || flipKey || null;
}

function swapAwayHome(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const out = { ...obj };
  if ('away' in obj || 'home' in obj) {
    out.away = obj.home;
    out.home = obj.away;
  }
  if ('awayLine' in obj || 'homeLine' in obj) {
    out.awayLine = obj.homeLine;
    out.homeLine = obj.awayLine;
  }
  if ('awayOdds' in obj || 'homeOdds' in obj) {
    out.awayOdds = obj.homeOdds;
    out.homeOdds = obj.awayOdds;
  }
  return out;
}

/** Remap a tape row so away/home match the caller's gameKey orientation. */
export function remapUFCPinnSides(game) {
  if (!game || typeof game !== 'object') return game;
  const allBooks = {};
  for (const [k, v] of Object.entries(game.allBooks || {})) {
    allBooks[k] = swapAwayHome(v);
  }
  const allSpreadBooks = {};
  if (game.allSpreadBooks && typeof game.allSpreadBooks === 'object') {
    for (const [k, v] of Object.entries(game.allSpreadBooks)) {
      allSpreadBooks[k] = swapAwayHome(v);
    }
  }
  const dir = game.movement?.direction;
  return {
    ...game,
    current: swapAwayHome(game.current),
    opener: swapAwayHome(game.opener),
    bestAway: game.bestHome,
    bestHome: game.bestAway,
    bestAwayBook: game.bestHomeBook,
    bestHomeBook: game.bestAwayBook,
    movement: game.movement ? {
      ...game.movement,
      away: game.movement.home,
      home: game.movement.away,
      direction: dir === 'away' ? 'home' : dir === 'home' ? 'away' : dir,
    } : game.movement,
    ev: game.ev ? { ...game.ev, away: game.ev.home, home: game.ev.away } : game.ev,
    history: Array.isArray(game.history) ? game.history.map(swapAwayHome) : game.history,
    spreadHistory: Array.isArray(game.spreadHistory) ? game.spreadHistory.map(swapAwayHome) : game.spreadHistory,
    spreadCurrent: swapAwayHome(game.spreadCurrent),
    spreadOpener: swapAwayHome(game.spreadOpener),
    allBooks,
    ...(game.allSpreadBooks ? { allSpreadBooks } : {}),
    awayTeam: game.homeTeam,
    homeTeam: game.awayTeam,
  };
}

/**
 * One UFC fight can exist under both title order and Odds API away_home.
 * Prefer scan/live keys, then Poly, so leftover flip docs collapse.
 */
export function canonicalUFCKey(gameKey, { preferred = null, also = null } = {}) {
  if (!gameKey) return null;
  const flip = flipUFCGameKey(gameKey);
  const prefHas = (k) => !!k && preferred?.has?.(k);
  const alsoHas = (k) => !!k && also?.has?.(k);
  if (prefHas(gameKey) && prefHas(flip)) {
    if (alsoHas(gameKey) && !alsoHas(flip)) return gameKey;
    if (!alsoHas(gameKey) && alsoHas(flip)) return flip;
    return gameKey < flip ? gameKey : flip;
  }
  if (prefHas(gameKey)) return gameKey;
  if (prefHas(flip)) return flip;
  if (alsoHas(gameKey) && alsoHas(flip)) {
    return gameKey < flip ? gameKey : flip;
  }
  if (alsoHas(gameKey)) return gameKey;
  if (alsoHas(flip)) return flip;
  return gameKey;
}

export function isUFCFlipAlias(gameKey, opts = {}) {
  const canon = canonicalUFCKey(gameKey, opts);
  return !!(canon && gameKey && canon !== gameKey);
}

/**
 * Exact pinnacle_history lookup, then UFC key-flip with sides remapped.
 * Poly `Pitbull vs Choi` is `patriciopitbull_doohochoi`; Odds API stores
 * `doohochoi_patriciopitbull`. Without the flip, fair/steam/lock miss the tape.
 */
export function lookupPinnGame(pinnacleHistory, sport, gameKey) {
  if (!pinnacleHistory || !sport || !gameKey) return null;
  const bucket = pinnacleHistory[sport];
  if (!bucket || typeof bucket !== 'object') return null;
  if (bucket[gameKey]) return bucket[gameKey];
  if (String(sport).toUpperCase() !== 'UFC') return null;
  const flip = flipUFCGameKey(gameKey);
  if (!flip || !bucket[flip]) return null;
  return remapUFCPinnSides(bucket[flip]);
}

/**
 * Parse fighters from a Polymarket / Odds-style UFC title.
 *   "UFC 329: Max Holloway vs. Conor McGregor (Welterweight, Main Card)"
 *   "Max Holloway vs. Conor McGregor"
 */
export function extractUFCFightersFromTitle(title) {
  let t = (title || '').trim();
  if (!t) return null;
  // Numbered cards ("UFC 329:"), Fight Night / Apex ("UFC Fight Night:"),
  // and branded cards ("Noche UFC:") — without the prefix strip, fighter A
  // becomes "Noche UFC: Jean Silva" and the game key never matches Odds API
  // / Pinnacle, so the live UFC bucket fetches empty on Sharp Flow.
  t = stripUFCEventPrefix(t);
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

/** True for UFC-branded titles including DWCS (titles often omit the letters UFC). */
export function isUFCBrandedTitle(title) {
  const t = (title || '').toLowerCase();
  if (/\bufc\b/.test(t)) return true;
  if (/contender\s+series/.test(t) || /\bdwcs\b/.test(t)) return true;
  return false;
}

/**
 * Precise UFC-title classifier for wallet-universe sport tagging.
 * Requires UFC / DWCS branding — never bare "fight" (CBB Fighting Illini).
 */
export function isUFCMarketTitle(title) {
  const t = (title || '').toLowerCase();
  if (!isUFCBrandedTitle(t)) return false;
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
  if (!t || !isUFCBrandedTitle(t)) return null;

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

/** True when two raw fighter strings resolve to the same canonical key. */
export function fightersMatch(rawA, rawB) {
  const a = resolveUFCFighter(rawA);
  const b = resolveUFCFighter(rawB);
  return !!(a && b && a === b);
}

/**
 * Only main-fight moneyline positions are safe to grade as fight winner.
 * Method / distance / round props may attach to a fight with a fighter side
 * but must NOT be graded against the bout result.
 */
export function isGradableUFCMainML(pos) {
  if (!pos) return false;
  const mt = (pos.marketType || pos.market || 'ml').toString().toLowerCase();
  if (mt && mt !== 'ml' && mt !== 'moneyline' && mt !== 'h2h') return false;
  const blob = [
    pos.title, pos.marketTitle, pos.outcome, pos.teamName, pos.team, pos.sideLabel,
  ].filter(Boolean).join(' ');
  if (/win by|go the distance|method|ko\/?tko|submission|decision|rounds?\b|o\/u\s*\d|over\/under|parlay|champion|fight next/i.test(blob)) {
    return false;
  }
  return true;
}
