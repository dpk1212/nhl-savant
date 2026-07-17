/**
 * WNBA team resolution — shared by fetchPolymarketData, snapshotPinnacle,
 * scanSharpPositions, scanWhitelistedWallets, seedSportsSharps, buildWhaleProfiles.
 *
 * Polymarket game events look like:
 *   slug:  wnba-lva-nyl-2026-07-09  (or similar team-code + date)
 *   title: Las Vegas Aces vs. New York Liberty
 *   Markets: ML (2-way) + spreads + totals (NBA-style)
 *
 * Odds API sport key: basketball_wnba
 *
 * Game keys: `${code}_${code}` lowercased, e.g. "lva_nyl".
 * Do NOT reuse NBA_MAP / resolveNBATeam — shared nicknames (Sun, Sparks, etc.)
 * would collide. Classify WNBA before NBA in wallet tagging.
 */

/** Fold diacritics then strip non-alphanumerics. */
export function normalizeWNBAName(s) {
  return (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

// Canonical code + aliases covering Odds API, Polymarket, ESPN spellings.
const WNBA_TEAMS = [
  { code: 'ATL', names: ['Atlanta Dream', 'Atlanta', 'Dream'] },
  { code: 'CHI', names: ['Chicago Sky', 'Chicago', 'Sky'] },
  { code: 'CON', names: ['Connecticut Sun', 'Connecticut', 'Sun'] },
  { code: 'DAL', names: ['Dallas Wings', 'Dallas', 'Wings'] },
  { code: 'GSV', names: ['Golden State Valkyries', 'Golden State', 'Valkyries'] },
  { code: 'IND', names: ['Indiana Fever', 'Indiana', 'Fever'] },
  { code: 'LAS', names: ['Los Angeles Sparks', 'LA Sparks', 'Los Angeles', 'Sparks'] },
  { code: 'LVA', names: ['Las Vegas Aces', 'Las Vegas', 'Aces'] },
  { code: 'MIN', names: ['Minnesota Lynx', 'Minnesota', 'Lynx'] },
  { code: 'NYL', names: ['New York Liberty', 'New York', 'Liberty'] },
  { code: 'PHO', names: ['Phoenix Mercury', 'Phoenix', 'Mercury'] },
  { code: 'POR', names: ['Portland Fire', 'Portland', 'Fire'] },
  { code: 'SEA', names: ['Seattle Storm', 'Seattle', 'Storm'] },
  { code: 'TOR', names: ['Toronto Tempo', 'Toronto', 'Tempo'] },
  { code: 'WAS', names: ['Washington Mystics', 'Washington', 'Mystics'] },
];

/** normalized alias -> WNBA code */
export const WNBA_NAME_TO_CODE = {};
for (const { code, names } of WNBA_TEAMS) {
  WNBA_NAME_TO_CODE[normalizeWNBAName(code)] = code;
  for (const n of names) WNBA_NAME_TO_CODE[normalizeWNBAName(n)] = code;
}

/** Canonical display names (first alias) keyed by code. */
export const WNBA_CODE_TO_NAME = {};
for (const { code, names } of WNBA_TEAMS) WNBA_CODE_TO_NAME[code] = names[0];

/**
 * Resolve a raw team string to a WNBA code, or null.
 * Exact normalized match first, then longest safe prefix / whole-word
 * fallback for "Las Vegas Aces" / "PortlandFire" style titles.
 *
 * Never use bare substring includes on short aliases — `por` matches
 * inside "esports" and `min` inside "gaming", which polluted WNBA
 * game keys with Dota/Esports World Cup positions (2026-07).
 * Never returns an NBA code.
 */
export function resolveWNBATeam(raw) {
  if (!raw) return null;
  const cleaned = String(raw)
    .replace(/\s*\((?:w|women|wnba)\)\s*$/i, '')
    .replace(/^wnba\s*:\s*/i, '')
    .trim();
  // Hard reject non-basketball titles that used to false-match short codes.
  if (/\b(esports?|dota|csgo|counter[\s-]?strike|valorant|lol|league\s+of\s+legends|gaming)\b/i.test(cleaned)) {
    return null;
  }
  const n = normalizeWNBAName(cleaned);
  if (!n) return null;
  if (WNBA_NAME_TO_CODE[n]) return WNBA_NAME_TO_CODE[n];

  // Longest alias that is an exact match or a PREFIX of the full string.
  // Substring includes only for long aliases (≥6) so "minnesota"/"portland"
  // still hit inside glued names, but "por"/"min"/"sea" cannot.
  let best = null;
  let bestLen = 0;
  for (const [alias, code] of Object.entries(WNBA_NAME_TO_CODE)) {
    if (alias.length < 3) continue;
    const prefixHit = n === alias || n.startsWith(alias);
    const longContains = alias.length >= 6 && n.includes(alias);
    if ((prefixHit || longContains) && alias.length > bestLen) {
      best = code;
      bestLen = alias.length;
    }
  }
  if (best) return best;

  // Whole-word fallback for short nicknames (Fever, Lynx, Aces, …).
  // Split on spaces AND camelCase / glued boundaries ("PortlandFire").
  const words = cleaned
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/[\s/_.,\-]+/)
    .filter(Boolean);
  for (const w of words) {
    const wn = normalizeWNBAName(w);
    if (wn.length >= 3 && WNBA_NAME_TO_CODE[wn]) return WNBA_NAME_TO_CODE[wn];
  }
  return null;
}

/** Game key from two team name strings (away_home). */
export function makeWNBAGameKey(a, b) {
  const aa = resolveWNBATeam(a);
  const bb = resolveWNBATeam(b);
  if (!aa || !bb || aa === bb) return null;
  return `${aa.toLowerCase()}_${bb.toLowerCase()}`;
}

/**
 * True if a Polymarket event slug is a MAIN WNBA game (not futures/props).
 * Observed / expected shapes:
 *   ✅ wnba-lva-nyl-2026-07-09
 *   ✅ wnba-las-vegas-aces-new-york-liberty-2026-07-09
 *   ❌ wnba-championship-winner-2026
 *   ❌ wnba-lva-nyl-2026-07-09-total-points
 */
export function isMainWNBAGameSlug(slug) {
  const s = (slug || '').toLowerCase();
  if (!s.startsWith('wnba-')) return false;
  if (/champion|winner|mvp|award|futures?|series|playoff|draft/.test(s)) return false;
  if (/total|spread|o-u|over-under|player|points-scored|first-half/.test(s)) return false;
  // Must end with a calendar date
  if (!/\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  // At least two tokens between wnba- and the date
  const body = s.replace(/^wnba-/, '').replace(/-\d{4}-\d{2}-\d{2}$/, '');
  const parts = body.split('-').filter(Boolean);
  return parts.length >= 2;
}

/**
 * Precise WNBA-title classifier for wallet-universe sport tagging.
 * Prefer explicit "wnba" mention; also accept known team-pair vs titles.
 * Runs BEFORE NBA keyword match so "Liberty" / "Sun" don't become NBA.
 */
export function isWNBAMarketTitle(title) {
  const t = (title || '').toLowerCase();
  if (/\bwnba\b/.test(t)) return true;
  let m = t.match(/^will\s+(?:the\s+)?(.+?)\s+win(?:\s+on\s+\d{4}-\d{2}-\d{2})?\s*\?*$/);
  if (m && resolveWNBATeam(m[1])) return true;
  m = t.match(/^(.+?)\s+vs\.?\s+(.+?)$/);
  if (m && resolveWNBATeam(m[1]) && resolveWNBATeam(m[2])) return true;
  m = t.match(/^(.+?)\s+@\s+(.+?)$/);
  if (m && resolveWNBATeam(m[1]) && resolveWNBATeam(m[2])) return true;
  return false;
}

function etDateOf(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  } catch {
    return null;
  }
}

/**
 * Match a Polymarket position/market title to a WNBA game in todaysGames
 * (keys are "WNBA:awaycode_homecode").
 *
 * Returns { key, sport: 'WNBA', side, awayName, homeName } or null.
 */
export function matchWNBAPositionTitle(posTitle, todaysGames) {
  const t = (posTitle || '').trim();
  if (!t) return null;
  // Require WNBA cue or resolvable team pair — avoid bare NBA collisions
  const hasWnbaCue = /\bwnba\b/i.test(t);

  // Team-win market (optionally dated)
  let m = t.match(/^will\s+(?:the\s+)?(.+?)\s+win(?:\s+on\s+(\d{4}-\d{2}-\d{2}))?\s*\?*$/i);
  if (m) {
    const code = resolveWNBATeam(m[1]);
    if (!code) return null;
    if (!hasWnbaCue) {
      // Without "wnba" in title, only accept if a today's WNBA game has this team
      const c = code.toLowerCase();
      const any = Object.keys(todaysGames).some((k) => {
        if (!k.startsWith('WNBA:')) return false;
        const [aw, hm] = k.slice(5).split('_');
        return aw === c || hm === c;
      });
      if (!any) return null;
    }
    const c = code.toLowerCase();
    const titleDate = m[2] || null;
    let fallback = null;
    for (const [fullKey, g] of Object.entries(todaysGames)) {
      if (!fullKey.startsWith('WNBA:')) continue;
      const gameKey = fullKey.slice(5);
      const [aw, hm] = gameKey.split('_');
      if (aw !== c && hm !== c) continue;
      const cand = {
        key: gameKey,
        sport: 'WNBA',
        side: aw === c ? 'away' : 'home',
        awayName: g.away,
        homeName: g.home,
      };
      if (titleDate) {
        const gameDate = etDateOf(g.commence);
        if (gameDate === titleDate) return cand;
        if (!gameDate && !fallback) fallback = cand;
      } else {
        return cand;
      }
    }
    return fallback;
  }

  // Event-level: "Las Vegas Aces vs. New York Liberty"
  m = t.match(/^(.+?)\s+(?:vs\.?|@)\s+(.+?)$/i);
  if (m) {
    const a = resolveWNBATeam(m[1]);
    const b = resolveWNBATeam(m[2]);
    if (!a || !b) return null;
    const key = `${a.toLowerCase()}_${b.toLowerCase()}`;
    if (todaysGames[`WNBA:${key}`]) {
      const g = todaysGames[`WNBA:${key}`];
      return { key, sport: 'WNBA', side: null, awayName: g.away, homeName: g.home };
    }
    const rev = `${b.toLowerCase()}_${a.toLowerCase()}`;
    if (todaysGames[`WNBA:${rev}`]) {
      const g = todaysGames[`WNBA:${rev}`];
      return { key: rev, sport: 'WNBA', side: null, awayName: g.away, homeName: g.home };
    }
  }

  return null;
}

/** True when two raw team strings resolve to the same WNBA code. */
export function wnbaTeamsMatch(rawA, rawB) {
  const a = resolveWNBATeam(rawA);
  const b = resolveWNBATeam(rawB);
  return !!(a && b && a === b);
}
