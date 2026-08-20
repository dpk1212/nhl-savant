/**
 * Soccer team resolution — World Cup nations + EPL / La Liga clubs.
 * Shared by fetchPolymarketData, snapshotPinnacle, scanSharpPositions,
 * scanWhitelistedWallets, seedSportsSharps, buildWhaleProfiles, gradeSharpActions.
 *
 * Sport code stays `SOC` so the existing 3-way (home/draw/away) board, draw
 * side, and soccer sharp wallet list (`bySport.SOC`) reuse without a new
 * universe. World Cup is over; club soccer is the live schedule.
 *
 * Game keys: `${code}_${code}` lowercased from resolved names, not slug
 * tokens (fifwc-mex-kr used `kr`; Espanyol slug `esp` must not become Spain).
 * Espanyol is EPY so it never collides with FIFA Spain (ESP).
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

// Premier League + La Liga clubs. Codes follow Polymarket slug tokens when
// unique (ars, mun, mac, rea). Espanyol is EPY — slug `esp` is Spain's FIFA code.
const SOC_CLUBS = [
  // EPL
  { code: 'ARS', names: ['Arsenal', 'Arsenal FC'] },
  { code: 'AST', names: ['Aston Villa', 'Aston Villa FC'] },
  { code: 'BOU', names: ['Bournemouth', 'AFC Bournemouth'] },
  { code: 'BRE', names: ['Brentford', 'Brentford FC'] },
  { code: 'BRI', names: ['Brighton and Hove Albion', 'Brighton & Hove Albion', 'Brighton & Hove Albion FC', 'Brighton'] },
  { code: 'CHE', names: ['Chelsea', 'Chelsea FC'] },
  { code: 'COV', names: ['Coventry City', 'Coventry City FC', 'Coventry'] },
  { code: 'CRY', names: ['Crystal Palace', 'Crystal Palace FC'] },
  { code: 'EVE', names: ['Everton', 'Everton FC'] },
  { code: 'FUL', names: ['Fulham', 'Fulham FC'] },
  { code: 'HUL', names: ['Hull City', 'Hull City AFC', 'Hull'] },
  { code: 'IPS', names: ['Ipswich Town', 'Ipswich Town FC', 'Ipswich'] },
  { code: 'LEE', names: ['Leeds United', 'Leeds United FC', 'Leeds'] },
  { code: 'LIV', names: ['Liverpool', 'Liverpool FC'] },
  { code: 'MAC', names: ['Manchester City', 'Manchester City FC', 'Man City'] },
  { code: 'MUN', names: ['Manchester United', 'Manchester United FC', 'Man Utd', 'Man United'] },
  { code: 'NEW', names: ['Newcastle United', 'Newcastle United FC', 'Newcastle'] },
  { code: 'NOT', names: ['Nottingham Forest', 'Nottingham Forest FC', 'Nottingham'] },
  { code: 'SUN', names: ['Sunderland', 'Sunderland AFC'] },
  { code: 'TOT', names: ['Tottenham Hotspur', 'Tottenham Hotspur FC', 'Tottenham', 'Spurs'] },
  // La Liga — EPY not ESP (Spain). REA not "Madrid" (Atlético also Madrid).
  { code: 'ALA', names: ['Alavés', 'Alaves', 'Deportivo Alavés', 'Deportivo Alaves'] },
  { code: 'BIL', names: ['Athletic Bilbao', 'Athletic Club'] },
  { code: 'MAD', names: ['Atlético Madrid', 'Atletico Madrid', 'Club Atlético de Madrid', 'Club Atletico de Madrid', 'Atleti'] },
  { code: 'BAR', names: ['Barcelona', 'FC Barcelona'] },
  { code: 'OSA', names: ['Osasuna', 'CA Osasuna'] },
  { code: 'CEL', names: ['Celta Vigo', 'Celta de Vigo', 'RC Celta de Vigo', 'Celta'] },
  { code: 'DEP', names: ['Deportivo La Coruña', 'Deportivo La Coruna', 'Deportivo'] },
  { code: 'ELC', names: ['Elche', 'Elche CF'] },
  { code: 'EPY', names: ['Espanyol', 'RCD Espanyol', 'RCD Espanyol de Barcelona'] },
  { code: 'GET', names: ['Getafe', 'Getafe CF'] },
  { code: 'LEV', names: ['Levante', 'Levante UD'] },
  { code: 'MLG', names: ['Málaga', 'Malaga', 'Málaga CF', 'Malaga CF'] },
  { code: 'RAY', names: ['Rayo Vallecano', 'Rayo Vallecano de Madrid', 'Rayo'] },
  { code: 'BET', names: ['Real Betis', 'Real Betis Balompié', 'Real Betis Balompie', 'Betis'] },
  { code: 'REA', names: ['Real Madrid', 'Real Madrid CF'] },
  { code: 'RRC', names: ['Real Racing Club de Santander', 'Real Racing Club', 'Racing Santander', 'Racing Club'] },
  { code: 'RSO', names: ['Real Sociedad', 'Real Sociedad de Fútbol', 'Real Sociedad de Futbol'] },
  { code: 'SEV', names: ['Sevilla', 'Sevilla FC'] },
  { code: 'VAL', names: ['Valencia', 'Valencia CF'] },
  { code: 'VIL', names: ['Villarreal', 'Villarreal CF'] },
];

const ALL_SOC_TEAMS = [...SOC_TEAMS, ...SOC_CLUBS];

/** normalized alias -> FIFA / club code */
export const SOC_NAME_TO_CODE = {};
for (const { code, names } of ALL_SOC_TEAMS) {
  SOC_NAME_TO_CODE[normalizeSoccerName(code)] = code;
  for (const n of names) SOC_NAME_TO_CODE[normalizeSoccerName(n)] = code;
}
// Spain keeps ESP. Never let Espanyol's slug token steal it.
SOC_NAME_TO_CODE.esp = 'ESP';
SOC_NAME_TO_CODE.spain = 'ESP';
SOC_NAME_TO_CODE.epy = 'EPY';
SOC_NAME_TO_CODE.espanyol = 'EPY';

/** Canonical display names (first alias) keyed by code, e.g. SOC_CODE_TO_NAME.KOR = 'Korea Republic'. */
export const SOC_CODE_TO_NAME = {};
for (const { code, names } of ALL_SOC_TEAMS) SOC_CODE_TO_NAME[code] = names[0];

/**
 * Resolve a raw country string to a FIFA code, or null.
 * Exact normalized match only — no word-fallback, because single-word
 * fallbacks misfire on multi-word countries (South Korea vs South Africa).
 * Trailing noise like "(W)" or " National Team" is stripped first.
 */
function stripClubNoise(raw) {
  return String(raw || '')
    .replace(/\s*\((?:w|women)\)\s*$/i, '')
    .replace(/\s+national team\s*$/i, '')
    .replace(/^(?:the\s+)/i, '')
    .replace(/^(?:fc|cf|rcd|rc|ca|afc)\s+/i, '')
    .replace(/\s+(?:fc|cf|afc|cfc|sc)\s*$/i, '')
    .trim();
}

export function resolveSOCTeam(raw) {
  if (!raw) return null;
  const cleaned = stripClubNoise(raw);
  if (!cleaned) return null;
  return SOC_NAME_TO_CODE[normalizeSoccerName(cleaned)]
    || SOC_NAME_TO_CODE[normalizeSoccerName(String(raw).trim())]
    || null;
}

/** Game key from two team name strings (away_home). */
export function makeSOCGameKey(a, b) {
  const aa = resolveSOCTeam(a);
  const bb = resolveSOCTeam(b);
  if (!aa || !bb || aa === bb) return null;
  return `${aa.toLowerCase()}_${bb.toLowerCase()}`;
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
  if (/world cup|\bfifa\b|\bepl\b|premier league|la ?liga|laliga/.test(t)) return true;
  let m = t.match(/^will\s+(?:the\s+)?(.+?)\s+win(?:\s+on\s+\d{4}-\d{2}-\d{2})?\s*\?*$/);
  if (m && resolveSOCTeam(m[1])) return true;
  m = t.match(/^will\s+(.+?)\s+vs\.?\s+(.+?)\s+end\s+in\s+a\s+draw/);
  if (m && resolveSOCTeam(m[1]) && resolveSOCTeam(m[2])) return true;
  m = t.match(/^(.+?)\s+vs\.?\s+(.+?)$/);
  if (m && resolveSOCTeam(m[1]) && resolveSOCTeam(m[2])) return true;
  return false;
}

const MAIN_SOC_SLUG = /^(fifwc|epl|lal)-[a-z]+-[a-z]+-\d{4}-\d{2}-\d{2}$/;

/** MAIN match event — EPL, La Liga, leftover World Cup. Drops HT / exact-score / futures. */
export function isMainSoccerMatchSlug(slug) {
  return MAIN_SOC_SLUG.test(String(slug || '').toLowerCase());
}

/** World Cup-only MAIN slug. Prefer isMainSoccerMatchSlug for live schedule. */
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
  m = t.match(/^will\s+(?:the\s+)?(.+?)\s+win(?:\s+on\s+(\d{4}-\d{2}-\d{2}))?\s*\?*$/i);
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
