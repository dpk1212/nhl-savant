/**
 * NFL team resolution — shared by fetchPolymarketData, snapshotPinnacle,
 * scanSharpPositions, scanWhitelistedWallets, seedSportsSharps, buildWhaleProfiles.
 *
 * Polymarket game events look like:
 *   slug:  nfl-car-ari-2026-08-07
 *   title: Panthers vs. Cardinals
 *   Markets: ML (2-way) + spreads + totals (WNBA/MLB-style)
 *
 * Odds API sport keys:
 *   americanfootball_nfl_preseason  (Aug HoF / preseason)
 *   americanfootball_nfl            (regular season)
 *
 * Game keys: `${code}_${code}` lowercased, e.g. "car_ari".
 * Classify carefully vs CBB — nicknames (Eagles, Panthers, Tigers) collide.
 * Prefer nfl slug/tag or full "City Nickname" names.
 */

/** Fold diacritics then strip non-alphanumerics. */
export function normalizeNFLName(s) {
  return (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

// Canonical code + aliases covering Odds API, Polymarket, ESPN spellings.
const NFL_TEAMS = [
  { code: 'ARI', names: ['Arizona Cardinals', 'Arizona', 'Cardinals'] },
  { code: 'ATL', names: ['Atlanta Falcons', 'Atlanta', 'Falcons'] },
  { code: 'BAL', names: ['Baltimore Ravens', 'Baltimore', 'Ravens'] },
  { code: 'BUF', names: ['Buffalo Bills', 'Buffalo', 'Bills'] },
  { code: 'CAR', names: ['Carolina Panthers', 'Carolina', 'Panthers'] },
  { code: 'CHI', names: ['Chicago Bears', 'Chicago', 'Bears'] },
  { code: 'CIN', names: ['Cincinnati Bengals', 'Cincinnati', 'Bengals'] },
  { code: 'CLE', names: ['Cleveland Browns', 'Cleveland', 'Browns'] },
  { code: 'DAL', names: ['Dallas Cowboys', 'Dallas', 'Cowboys'] },
  { code: 'DEN', names: ['Denver Broncos', 'Denver', 'Broncos'] },
  { code: 'DET', names: ['Detroit Lions', 'Detroit', 'Lions'] },
  { code: 'GB', names: ['Green Bay Packers', 'Green Bay', 'Packers'] },
  { code: 'HOU', names: ['Houston Texans', 'Houston', 'Texans'] },
  { code: 'IND', names: ['Indianapolis Colts', 'Indianapolis', 'Colts'] },
  { code: 'JAX', names: ['Jacksonville Jaguars', 'Jacksonville', 'Jaguars'] },
  { code: 'KC', names: ['Kansas City Chiefs', 'Kansas City', 'Chiefs'] },
  { code: 'LV', names: ['Las Vegas Raiders', 'Las Vegas', 'Raiders', 'Oakland Raiders'] },
  { code: 'LAC', names: ['Los Angeles Chargers', 'LA Chargers', 'Chargers'] },
  { code: 'LAR', names: ['Los Angeles Rams', 'LA Rams', 'Rams'] },
  { code: 'MIA', names: ['Miami Dolphins', 'Miami', 'Dolphins'] },
  { code: 'MIN', names: ['Minnesota Vikings', 'Minnesota', 'Vikings'] },
  { code: 'NE', names: ['New England Patriots', 'New England', 'Patriots'] },
  { code: 'NO', names: ['New Orleans Saints', 'New Orleans', 'Saints'] },
  { code: 'NYG', names: ['New York Giants', 'NY Giants', 'Giants'] },
  { code: 'NYJ', names: ['New York Jets', 'NY Jets', 'Jets'] },
  { code: 'PHI', names: ['Philadelphia Eagles', 'Philadelphia', 'Eagles'] },
  { code: 'PIT', names: ['Pittsburgh Steelers', 'Pittsburgh', 'Steelers'] },
  { code: 'SEA', names: ['Seattle Seahawks', 'Seattle', 'Seahawks'] },
  { code: 'SF', names: ['San Francisco 49ers', 'San Francisco', '49ers', 'Niners'] },
  { code: 'TB', names: ['Tampa Bay Buccaneers', 'Tampa Bay', 'Buccaneers', 'Bucs'] },
  { code: 'TEN', names: ['Tennessee Titans', 'Tennessee', 'Titans'] },
  { code: 'WAS', names: ['Washington Commanders', 'Washington', 'Commanders', 'Football Team', 'Redskins'] },
];

/** normalized alias -> NFL code */
export const NFL_NAME_TO_CODE = {};
for (const { code, names } of NFL_TEAMS) {
  NFL_NAME_TO_CODE[normalizeNFLName(code)] = code;
  for (const n of names) NFL_NAME_TO_CODE[normalizeNFLName(n)] = code;
}

/** Canonical display names (first alias) keyed by code. */
export const NFL_CODE_TO_NAME = {};
for (const { code, names } of NFL_TEAMS) NFL_CODE_TO_NAME[code] = names[0];

/**
 * Resolve a raw team string to an NFL code, or null.
 * Exact normalized match first, then longest safe prefix / whole-word
 * fallback. Short nicknames alone are risky vs CBB — prefer full names
 * when no nfl cue is present (callers should gate on slug/tag).
 */
export function resolveNFLTeam(raw) {
  if (!raw) return null;
  const cleaned = String(raw)
    .replace(/\s*\((?:nfl|football|preseason)\)\s*$/i, '')
    .replace(/^nfl\s*:\s*/i, '')
    .trim();
  if (/\b(esports?|dota|csgo|valorant|lol|ncaa|college|wnba|nba|mlb|nhl|ufc|mma)\b/i.test(cleaned)
    && !/\bnfl\b/i.test(cleaned)) {
    // Allow "NFL: Carolina Panthers" style; reject pure other-sport titles.
    if (!/cardinals|falcons|ravens|bills|panthers|bears|bengals|browns|cowboys|broncos|lions|packers|texans|colts|jaguars|chiefs|raiders|chargers|rams|dolphins|vikings|patriots|saints|giants|jets|eagles|steelers|seahawks|49ers|buccaneers|titans|commanders/i.test(cleaned)) {
      return null;
    }
  }
  const n = normalizeNFLName(cleaned);
  if (!n) return null;
  if (NFL_NAME_TO_CODE[n]) return NFL_NAME_TO_CODE[n];

  let best = null;
  let bestLen = 0;
  for (const [alias, code] of Object.entries(NFL_NAME_TO_CODE)) {
    if (alias.length < 3) continue;
    const prefixHit = n === alias || n.startsWith(alias);
    const longContains = alias.length >= 6 && n.includes(alias);
    if ((prefixHit || longContains) && alias.length > bestLen) {
      best = code;
      bestLen = alias.length;
    }
  }
  if (best) return best;

  const words = cleaned
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/[\s/_.,\-]+/)
    .filter(Boolean);
  for (const w of words) {
    const wn = normalizeNFLName(w);
    if (wn.length >= 3 && NFL_NAME_TO_CODE[wn]) return NFL_NAME_TO_CODE[wn];
  }
  return null;
}

/** Game key from two team name strings (away_home). */
export function makeNFLGameKey(a, b) {
  const aa = resolveNFLTeam(a);
  const bb = resolveNFLTeam(b);
  if (!aa || !bb || aa === bb) return null;
  return `${aa.toLowerCase()}_${bb.toLowerCase()}`;
}

/**
 * True if a Polymarket event slug is a MAIN NFL game (not futures/props).
 * Observed / expected shapes:
 *   ✅ nfl-car-ari-2026-08-07
 *   ✅ nfl-carolina-panthers-arizona-cardinals-2026-08-07
 *   ❌ nfl-super-bowl-winner-2026
 *   ❌ nfl-car-ari-2026-08-07-total-points
 */
export function isMainNFLGameSlug(slug) {
  const s = (slug || '').toLowerCase();
  if (!s.startsWith('nfl-')) return false;
  if (/champion|winner|mvp|award|futures?|super-bowl|draft|coach|playoff-odds|season-series|series-winner/.test(s)) return false;
  if (/total|spread|o-u|over-under|player|passing|rushing|receiving|first-half|td-scorer/.test(s)) return false;
  if (!/\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const body = s.replace(/^nfl-/, '').replace(/-\d{4}-\d{2}-\d{2}$/, '');
  const parts = body.split('-').filter(Boolean);
  return parts.length >= 2;
}

/**
 * Precise NFL-title classifier for wallet-universe sport tagging.
 * Prefer explicit "nfl" mention; also accept known team-pair vs titles
 * when both sides resolve to NFL teams with distinctive nicknames.
 */
export function isNFLMarketTitle(title) {
  const t = (title || '').toLowerCase();
  if (/\bnfl\b/.test(t)) return true;
  if (/\b(super\s*bowl|preseason|hall\s+of\s+fame\s+game)\b/.test(t)) return true;
  let m = t.match(/^will\s+(?:the\s+)?(.+?)\s+win(?:\s+on\s+\d{4}-\d{2}-\d{2})?\s*\?*$/);
  if (m && resolveNFLTeam(m[1]) && /\b(cardinals|falcons|ravens|bills|panthers|bears|bengals|browns|cowboys|broncos|lions|packers|texans|colts|jaguars|chiefs|raiders|chargers|rams|dolphins|vikings|patriots|saints|giants|jets|eagles|steelers|seahawks|49ers|buccaneers|bucs|titans|commanders)\b/i.test(m[1])) {
    return true;
  }
  m = t.match(/^(.+?)\s+vs\.?\s+(.+?)$/);
  if (m && resolveNFLTeam(m[1]) && resolveNFLTeam(m[2])) return true;
  m = t.match(/^(.+?)\s+@\s+(.+?)$/);
  if (m && resolveNFLTeam(m[1]) && resolveNFLTeam(m[2])) return true;
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
 * Match a Polymarket position/market title to an NFL game in todaysGames
 * (keys are "NFL:awaycode_homecode").
 *
 * Returns { key, sport: 'NFL', side, awayName, homeName } or null.
 */
export function matchNFLPositionTitle(posTitle, todaysGames) {
  const t = (posTitle || '').trim();
  if (!t) return null;
  const hasNflCue = /\bnfl\b/i.test(t);

  let m = t.match(/^will\s+(?:the\s+)?(.+?)\s+win(?:\s+on\s+(\d{4}-\d{2}-\d{2}))?\s*\?*$/i);
  if (m) {
    const code = resolveNFLTeam(m[1]);
    if (!code) return null;
    if (!hasNflCue) {
      const c = code.toLowerCase();
      const any = Object.keys(todaysGames).some((k) => {
        if (!k.startsWith('NFL:')) return false;
        const [aw, hm] = k.slice(4).split('_');
        return aw === c || hm === c;
      });
      if (!any) return null;
    }
    const c = code.toLowerCase();
    const titleDate = m[2] || null;
    let fallback = null;
    for (const [fullKey, g] of Object.entries(todaysGames)) {
      if (!fullKey.startsWith('NFL:')) continue;
      const gameKey = fullKey.slice(4);
      const [aw, hm] = gameKey.split('_');
      if (aw !== c && hm !== c) continue;
      const cand = {
        key: gameKey,
        sport: 'NFL',
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

  m = t.match(/^(.+?)\s+(?:vs\.?|@)\s+(.+?)$/i);
  if (m) {
    const a = resolveNFLTeam(m[1]);
    const b = resolveNFLTeam(m[2]);
    if (!a || !b) return null;
    const key = `${a.toLowerCase()}_${b.toLowerCase()}`;
    if (todaysGames[`NFL:${key}`]) {
      const g = todaysGames[`NFL:${key}`];
      return { key, sport: 'NFL', side: null, awayName: g.away, homeName: g.home };
    }
    const rev = `${b.toLowerCase()}_${a.toLowerCase()}`;
    if (todaysGames[`NFL:${rev}`]) {
      const g = todaysGames[`NFL:${rev}`];
      return { key: rev, sport: 'NFL', side: null, awayName: g.away, homeName: g.home };
    }
  }

  return null;
}

/** True when two raw team strings resolve to the same NFL code. */
export function nflTeamsMatch(rawA, rawB) {
  const a = resolveNFLTeam(rawA);
  const b = resolveNFLTeam(rawB);
  return !!(a && b && a === b);
}
