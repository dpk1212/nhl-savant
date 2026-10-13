/**
 * CS2 and LoL match-moneyline resolution.
 *
 * Polymarket match events:
 *   cs2-fal2-nip-2026-10-14
 *   Counter-Strike: Team Falcons vs NIP (BO3) - Thunderpick World Championship Group A
 *   lol-c9-kc-2026-10-15
 *   LoL: Cloud9 vs Karmine Corp (BO5) - Worlds Play-In
 * The moneyline market slug equals the event slug. Map winners, game
 * winners, handicaps, and totals append past the date and never attach.
 *
 * Series: CS2 10310, LoL 10311. Valorant, Dota, and Wild Rift are not these.
 * Game keys are normalized team names (9z_auroragaming), not slug tokens.
 */

const ESPORTS_POLY_BACK_MS = 6 * 3600 * 1000;
const ESPORTS_POLY_FWD_MS = 72 * 3600 * 1000;

export const ESPORTS_SERIES = {
  CS2: '10310',
  LOL: '10311',
};

const PROP_TITLE = /\b(map\s*\d+|game\s*\d+|games?\s+total|map\s+handicap|game\s+handicap|o\/u|over\/under|odd\/even|baron|dragon|inhibitor|quadra|penta|total\s+kills|total\s+rounds|both\s+teams)\b/i;

export function normalizeEsportsTeam(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/** "9z" and "NIP" are real tags. One-character leftovers are not. */
export function resolveEsportsTeam(raw) {
  if (!raw) return null;
  const cleaned = String(raw)
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned || PROP_TITLE.test(cleaned)) return null;
  const n = normalizeEsportsTeam(cleaned);
  if (!n || n.length < 2) return null;
  return n;
}

export function makeEsportsGameKey(a, b) {
  const aa = resolveEsportsTeam(a);
  const bb = resolveEsportsTeam(b);
  if (!aa || !bb || aa === bb) return null;
  return `${aa}_${bb}`;
}

export function esportsTeamsMatch(rawA, rawB) {
  const a = resolveEsportsTeam(rawA);
  const b = resolveEsportsTeam(rawB);
  return !!(a && b && a === b);
}

/** Main match slug → 'CS2' | 'LOL'. Child markets and futures return null. */
export function esportFromSlug(slug) {
  const s = String(slug || '').toLowerCase();
  if (/^cs2-.+-\d{4}-\d{2}-\d{2}$/.test(s)) return 'CS2';
  if (/^lol-.+-\d{4}-\d{2}-\d{2}$/.test(s)) return 'LOL';
  return null;
}

/** Any cs2- / lol- slug, including map and game markets. */
export function esportFamilyFromSlug(slug) {
  const s = String(slug || '').toLowerCase();
  if (s.startsWith('cs2-')) return 'CS2';
  if (s.startsWith('lol-')) return 'LOL';
  return null;
}

export function isMainEsportsMatchSlug(slug) {
  return !!esportFromSlug(slug);
}

export function isEsportsPolyWindow(startIso, nowMs = Date.now()) {
  const startMs = startIso ? new Date(startIso).getTime() : NaN;
  if (!Number.isFinite(startMs) || !Number.isFinite(nowMs)) return false;
  return startMs >= nowMs - ESPORTS_POLY_BACK_MS && startMs <= nowMs + ESPORTS_POLY_FWD_MS;
}

/**
 * "LoL: Cloud9 vs Karmine Corp (BO5) - Worlds Play-In" → teams.
 * Map / game / total / handicap titles return null.
 */
export function extractEsportsTeamsFromTitle(title) {
  const raw = String(title || '').trim();
  if (!raw || PROP_TITLE.test(raw)) return null;
  const head = raw.match(/^(counter-strike|lol)\s*:\s*(.+)$/i);
  if (!head) return null;
  const sport = head[1].toLowerCase() === 'lol' ? 'LOL' : 'CS2';
  let body = head[2].trim();
  const dash = body.match(/^(.+?\s+vs\.?\s+.+?)\s+-\s+.+$/i);
  if (dash) body = dash[1].trim();
  body = body.replace(/\s*\(BO\d+\)\s*$/i, '').trim();
  if (PROP_TITLE.test(body)) return null;
  const vs = body.match(/^(.+?)\s+vs\.?\s+(.+?)\s*$/i);
  if (!vs) return null;
  const a = vs[1].trim().replace(/\s+/g, ' ');
  const b = vs[2].trim().replace(/\s+/g, ' ');
  if (!resolveEsportsTeam(a) || !resolveEsportsTeam(b)) return null;
  return { sport, teams: [a, b] };
}

/**
 * Wallet-universe tag. Any cs2-/lol- slug or Counter-Strike:/LoL: title
 * stays in that sport so "Falcons" and "magic" cannot fall through to NFL/NBA.
 * Returns 'CS2' | 'LOL' | null.
 */
export function classifyEsportsMarket(title, slug = '') {
  const family = esportFamilyFromSlug(slug);
  if (family) return family;
  const extracted = extractEsportsTeamsFromTitle(title);
  if (extracted) return extracted.sport;
  const t = String(title || '').trim();
  if (/^counter-strike\s*:/i.test(t)) return 'CS2';
  if (/^lol\s*:/i.test(t)) return 'LOL';
  return null;
}

export function isGradableEsportsMainML(pos) {
  if (!pos) return false;
  const sport = String(pos.sport || '').toUpperCase();
  if (sport !== 'CS2' && sport !== 'LOL') return false;
  const mt = (pos.marketType || pos.market || 'ml').toString().toLowerCase();
  if (mt && mt !== 'ml' && mt !== 'moneyline' && mt !== 'h2h') return false;
  const slug = pos.slug || pos.eventSlug || '';
  const family = esportFamilyFromSlug(slug);
  if (family && !esportFromSlug(slug)) return false;
  if (family && family !== sport) return false;
  if (pos.title && !extractEsportsTeamsFromTitle(pos.title)) return false;
  return true;
}

/**
 * Match a position to today's CS2 or LoL board. A child slug never attaches.
 * Slug wins when it is the main match slug.
 */
export function matchEsportsPositionTitle(posTitle, todaysGames, slug = '') {
  const games = todaysGames || {};
  const family = esportFamilyFromSlug(slug);
  if (family && !esportFromSlug(slug)) return null;
  if (esportFromSlug(slug)) {
    const want = String(slug).toLowerCase();
    for (const [fullKey, g] of Object.entries(games)) {
      if (!fullKey.startsWith('CS2:') && !fullKey.startsWith('LOL:')) continue;
      const gSlug = String(g?.eventSlug || g?.slug || '').toLowerCase();
      if (gSlug && gSlug === want) {
        return {
          key: fullKey.slice(fullKey.indexOf(':') + 1),
          sport: fullKey.slice(0, fullKey.indexOf(':')),
          side: null,
          awayName: g.away,
          homeName: g.home,
        };
      }
    }
  }
  const extracted = extractEsportsTeamsFromTitle(posTitle);
  if (!extracted) return null;
  const [a, b] = extracted.teams;
  const key = makeEsportsGameKey(a, b);
  const rev = makeEsportsGameKey(b, a);
  const sport = extracted.sport;
  if (key && games[`${sport}:${key}`]) {
    const g = games[`${sport}:${key}`];
    return { key, sport, side: null, awayName: g.away, homeName: g.home };
  }
  if (rev && games[`${sport}:${rev}`]) {
    const g = games[`${sport}:${rev}`];
    return { key: rev, sport, side: null, awayName: g.away, homeName: g.home };
  }
  return null;
}
