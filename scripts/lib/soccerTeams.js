/**
 * Soccer (FIFA World Cup) team resolution — shared by fetchPolymarketData,
 * scanSharpPositions, scanWhitelistedWallets, seedSportsSharps, buildWhaleProfiles.
 *
 * Maps country-name variants from three different sources to FIFA 3-letter codes:
 *   - Polymarket match titles  ("Korea Republic", "Türkiye", "Côte d'Ivoire", "DR Congo")
 *   - Polymarket winner market ("South Korea", "Turkiye", "Ivory Coast", "Congo DR")
 *   - The Odds API h2h teams   ("South Korea", "Turkey", "Ivory Coast", "USA"/"United States")
 *
 * Game keys follow the existing pipeline convention: `${code}_${code}` lowercased,
 * e.g. "mex_kor". Do NOT trust Polymarket slug codes (fifwc-mex-kr) — they are
 * inconsistent (observed kr vs kor, and mis-slugged events).
 */

/** Fold diacritics then strip non-alphanumerics: "Côte d'Ivoire" -> "cotedivoire". */
export function normalizeSoccerName(s) {
  return (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

// Canonical name -> FIFA code, with alias arrays covering all observed source spellings.
const SOC_TEAMS = [
  { code: 'ALG', names: ['Algeria'] },
  { code: 'ARG', names: ['Argentina'] },
  { code: 'AUS', names: ['Australia'] },
  { code: 'AUT', names: ['Austria'] },
  { code: 'BEL', names: ['Belgium'] },
  { code: 'BIH', names: ['Bosnia-Herzegovina', 'Bosnia and Herzegovina', 'Bosnia'] },
  { code: 'BRA', names: ['Brazil'] },
  { code: 'CAN', names: ['Canada'] },
  { code: 'CPV', names: ['Cape Verde', 'Cabo Verde'] },
  { code: 'CIV', names: ["Côte d'Ivoire", "Cote d'Ivoire", 'Ivory Coast'] },
  { code: 'COD', names: ['DR Congo', 'Congo DR', 'Democratic Republic of the Congo', 'DR of Congo'] },
  { code: 'COL', names: ['Colombia'] },
  { code: 'CRO', names: ['Croatia'] },
  { code: 'CUW', names: ['Curaçao', 'Curacao'] },
  { code: 'CZE', names: ['Czechia', 'Czech Republic'] },
  { code: 'ECU', names: ['Ecuador'] },
  { code: 'EGY', names: ['Egypt'] },
  { code: 'ENG', names: ['England'] },
  { code: 'ESP', names: ['Spain'] },
  { code: 'FRA', names: ['France'] },
  { code: 'GER', names: ['Germany'] },
  { code: 'GHA', names: ['Ghana'] },
  { code: 'HAI', names: ['Haiti'] },
  { code: 'IRN', names: ['IR Iran', 'Iran'] },
  { code: 'IRQ', names: ['Iraq'] },
  { code: 'ITA', names: ['Italy'] },
  { code: 'JOR', names: ['Jordan'] },
  { code: 'JPN', names: ['Japan'] },
  { code: 'KOR', names: ['Korea Republic', 'South Korea', 'Republic of Korea'] },
  { code: 'KSA', names: ['Saudi Arabia'] },
  { code: 'MAR', names: ['Morocco'] },
  { code: 'MEX', names: ['Mexico'] },
  { code: 'NED', names: ['Netherlands', 'Holland'] },
  { code: 'NOR', names: ['Norway'] },
  { code: 'NZL', names: ['New Zealand'] },
  { code: 'PAN', names: ['Panama'] },
  { code: 'PAR', names: ['Paraguay'] },
  { code: 'PER', names: ['Peru'] },
  { code: 'POR', names: ['Portugal'] },
  { code: 'QAT', names: ['Qatar'] },
  { code: 'RSA', names: ['South Africa'] },
  { code: 'SCO', names: ['Scotland'] },
  { code: 'SEN', names: ['Senegal'] },
  { code: 'SUI', names: ['Switzerland'] },
  { code: 'SWE', names: ['Sweden'] },
  { code: 'TUN', names: ['Tunisia'] },
  { code: 'TUR', names: ['Türkiye', 'Turkiye', 'Turkey'] },
  { code: 'URU', names: ['Uruguay'] },
  { code: 'USA', names: ['USA', 'United States', 'United States of America'] },
  { code: 'UZB', names: ['Uzbekistan'] },
];

/** normalized alias -> FIFA code */
export const SOC_NAME_TO_CODE = {};
for (const { code, names } of SOC_TEAMS) {
  SOC_NAME_TO_CODE[normalizeSoccerName(code)] = code;
  for (const n of names) SOC_NAME_TO_CODE[normalizeSoccerName(n)] = code;
}

/** Canonical display names (first alias) keyed by code, e.g. SOC_CODE_TO_NAME.KOR = 'Korea Republic'. */
export const SOC_CODE_TO_NAME = {};
for (const { code, names } of SOC_TEAMS) SOC_CODE_TO_NAME[code] = names[0];

/**
 * Resolve a raw country string to a FIFA code, or null.
 * Exact normalized match only — no word-fallback, because single-word
 * fallbacks misfire on multi-word countries (South Korea vs South Africa).
 * Trailing noise like "(W)" or " National Team" is stripped first.
 */
export function resolveSOCTeam(raw) {
  if (!raw) return null;
  const cleaned = String(raw)
    .replace(/\s*\((?:w|women)\)\s*$/i, '')
    .replace(/\s+national team\s*$/i, '')
    .trim();
  return SOC_NAME_TO_CODE[normalizeSoccerName(cleaned)] || null;
}

/**
 * Precise soccer-title classifier for wallet-universe sport tagging
 * (seedSportsSharps / buildWhaleProfiles). Deliberately NOT a bare keyword
 * list: substring country matching misfires on US teams ("New Mexico" CBB
 * contains "mexico"). Requires either an explicit World Cup mention or a
 * recognized market-title shape where the team(s) resolve to countries.
 */
export function isSoccerMarketTitle(title) {
  const t = (title || '').toLowerCase();
  if (/world cup|fifa/.test(t)) return true;
  let m = t.match(/^will\s+(.+?)\s+win(?:\s+on\s+\d{4}-\d{2}-\d{2})?\s*\?*$/);
  if (m && resolveSOCTeam(m[1])) return true;
  m = t.match(/^will\s+(.+?)\s+vs\.?\s+(.+?)\s+end\s+in\s+a\s+draw/);
  if (m && resolveSOCTeam(m[1]) && resolveSOCTeam(m[2])) return true;
  m = t.match(/^(.+?)\s+vs\.?\s+(.+?)$/);
  if (m && resolveSOCTeam(m[1]) && resolveSOCTeam(m[2])) return true;
  return false;
}

/** True if a Polymarket event slug is a MAIN World Cup match event (not a prop/future). */
export function isMainWorldCupMatchSlug(slug) {
  return /^fifwc-[a-z]+-[a-z]+-\d{4}-\d{2}-\d{2}$/.test(slug || '');
}

function etDateOf(iso) {
  if (!iso) return null;
  try { return new Date(iso).toLocaleDateString('en-CA', { timeZone: 'America/New_York' }); } catch { return null; }
}

/**
 * Match a Polymarket position/market title to a SOC game in todaysGames
 * (keys are "SOC:awaycode_homecode", values have { away, home, commence }).
 *
 * Soccer markets are negRisk — one binary market per outcome — so position
 * titles name a single side, NOT both teams:
 *   "Will Mexico win on 2026-06-18?"                  -> team-win market
 *   "Will Mexico vs. Korea Republic end in a draw?"   -> draw market
 *   "Mexico vs. Korea Republic"                       -> event-level title (fallback)
 *
 * Returns { key, sport: 'SOC', side, socMarket, awayName, homeName } or null.
 * socMarket is 'away' | 'home' | 'draw' when the market itself determines the
 * side (caller must still check outcome === 'Yes'), or null for event-level
 * titles where the outcome name carries the side.
 */
export function matchSoccerPositionTitle(posTitle, todaysGames) {
  const t = (posTitle || '').trim();

  // Draw market
  let m = t.match(/^will\s+(.+?)\s+vs\.?\s+(.+?)\s+end\s+in\s+a\s+draw\b/i);
  if (m) {
    const a = resolveSOCTeam(m[1]);
    const b = resolveSOCTeam(m[2]);
    if (!a || !b) return null;
    const key = `${a.toLowerCase()}_${b.toLowerCase()}`;
    if (todaysGames[`SOC:${key}`]) {
      const g = todaysGames[`SOC:${key}`];
      return { key, sport: 'SOC', side: 'draw', socMarket: 'draw', awayName: g.away, homeName: g.home };
    }
    const rev = `${b.toLowerCase()}_${a.toLowerCase()}`;
    if (todaysGames[`SOC:${rev}`]) {
      const g = todaysGames[`SOC:${rev}`];
      return { key: rev, sport: 'SOC', side: 'draw', socMarket: 'draw', awayName: g.away, homeName: g.home };
    }
    return null;
  }

  // Team-win market (optionally dated)
  m = t.match(/^will\s+(.+?)\s+win(?:\s+on\s+(\d{4}-\d{2}-\d{2}))?\s*\?*$/i);
  if (m) {
    const code = resolveSOCTeam(m[1]);
    if (!code) return null;
    const c = code.toLowerCase();
    const titleDate = m[2] || null;
    let fallback = null;
    for (const [fullKey, g] of Object.entries(todaysGames)) {
      if (!fullKey.startsWith('SOC:')) continue;
      const gameKey = fullKey.slice(4);
      const [aw, hm] = gameKey.split('_');
      if (aw !== c && hm !== c) continue;
      const cand = {
        key: gameKey, sport: 'SOC',
        side: aw === c ? 'away' : 'home',
        socMarket: aw === c ? 'away' : 'home',
        awayName: g.away, homeName: g.home,
      };
      if (titleDate) {
        const gameDate = etDateOf(g.commence);
        if (gameDate === titleDate) return cand;       // exact date match wins
        if (!gameDate && !fallback) fallback = cand;   // no commence info — keep as fallback
      } else {
        return cand;
      }
    }
    return fallback; // dated title with no date-matching game: only accept undated candidates
  }

  // Event-level title fallback: "Mexico vs. Korea Republic"
  m = t.match(/^(.+?)\s+vs\.?\s+(.+?)$/i);
  if (m) {
    const a = resolveSOCTeam(m[1]);
    const b = resolveSOCTeam(m[2]);
    if (!a || !b) return null;
    const key = `${a.toLowerCase()}_${b.toLowerCase()}`;
    if (todaysGames[`SOC:${key}`]) {
      const g = todaysGames[`SOC:${key}`];
      return { key, sport: 'SOC', side: 'away', socMarket: null, awayName: g.away, homeName: g.home };
    }
    const rev = `${b.toLowerCase()}_${a.toLowerCase()}`;
    if (todaysGames[`SOC:${rev}`]) {
      const g = todaysGames[`SOC:${rev}`];
      return { key: rev, sport: 'SOC', side: 'away', socMarket: null, awayName: g.away, homeName: g.home };
    }
  }
  return null;
}

/**
 * Resolve the side of a SOC position from its matched market + outcome.
 * Returns 'away' | 'home' | 'draw', or null when the position is not
 * attributable to a single side (e.g. "No" on a 3-way binary market).
 */
export function resolveSoccerSide(match, outcome, awayName, homeName) {
  const o = normalizeSoccerName(outcome);
  if (match.socMarket) {
    return o === 'yes' ? match.socMarket : null;
  }
  // Event-level position: outcome names the side directly
  if (/^draw/.test(o)) return 'draw';
  const oCode = resolveSOCTeam(outcome);
  if (oCode) {
    if (oCode === resolveSOCTeam(awayName)) return 'away';
    if (oCode === resolveSOCTeam(homeName)) return 'home';
  }
  return null;
}
