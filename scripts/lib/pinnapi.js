/**
 * Thin pinnapi.com client — Pinnacle-native odds + max stake.
 *
 * Auth: header `x-portal-apikey: $PINNAPI_KEY`
 * Docs: https://pinnapi.com/docs
 *
 * Does not throw on missing key / rate limit — callers fall back to Odds API.
 */

const BASE = 'https://pinnapi.com/kit/v1';

/** In-process cache so NBA/CBB/WNBA (shared sport_id) don't triple-fetch. */
const _marketsCache = new Map(); // `${sportId}:${eventType}` → promise/result

/** Our sport label → pinnapi sport_id */
export const PINNAPI_SPORT_ID = {
  NHL: 4,
  CBB: 3,
  MLB: 6,
  NBA: 3,
  SOC: 1,
  UFC: 8,
  WNBA: 3,
  NFL: 5,
};

/**
 * League-name allowlists when multiple leagues share a sport_id.
 * Matching is case-insensitive substring / exact.
 */
const LEAGUE_FILTER = {
  NHL: [/^\s*NHL\s*$/i, /National Hockey/i],
  MLB: [/^\s*MLB\s*$/i, /Major League Baseball/i],
  NBA: [/^\s*NBA\s*$/i],
  WNBA: [/^\s*WNBA\s*$/i],
  CBB: [/NCAA/i, /College/i, /NCAAB/i],
  NFL: [/^\s*NFL\s*$/i, /National Football/i],
  UFC: [/UFC/i, /MMA/i, /Bellator/i],
  SOC: null, // accept all soccer leagues we can key
};

export function decimalToAmerican(dec) {
  if (dec == null || !Number.isFinite(dec) || dec <= 1) return null;
  if (dec >= 2) return Math.round((dec - 1) * 100);
  return Math.round(-100 / (dec - 1));
}

function leagueOk(label, leagueName) {
  const rules = LEAGUE_FILTER[label];
  if (!rules) return true;
  const name = String(leagueName || '');
  return rules.some((re) => re.test(name));
}

function pickMainSpread(spreads) {
  if (!spreads || typeof spreads !== 'object') return null;
  let best = null;
  let bestAbs = Infinity;
  for (const s of Object.values(spreads)) {
    if (!s || s.home == null || s.away == null) continue;
    const abs = Math.abs(Number(s.hdp) || 0);
    if (abs < bestAbs) {
      bestAbs = abs;
      best = s;
    }
  }
  return best;
}

function pickMainTotal(totals) {
  if (!totals || typeof totals !== 'object') return null;
  // Prefer the line with the highest max (most liquid main), else first.
  let best = null;
  let bestMax = -1;
  for (const t of Object.values(totals)) {
    if (!t || t.over == null || t.under == null) continue;
    const m = Number(t.max) || 0;
    if (m >= bestMax) {
      bestMax = m;
      best = t;
    }
  }
  return best;
}

/**
 * Extract period-0 (full game) quote + limits from a pinnapi event.
 */
export function extractPeriod0(event) {
  const periods = event?.periods || {};
  const p0 = periods.num_0 || periods['0'] || null;
  if (!p0 || typeof p0 !== 'object') return null;

  const ml = p0.money_line || null;
  const away = decimalToAmerican(ml?.away);
  const home = decimalToAmerican(ml?.home);
  const draw = decimalToAmerican(ml?.draw);
  if (away == null || home == null) return null;

  const meta = p0.meta || {};
  const spread = pickMainSpread(p0.spreads);
  const total = pickMainTotal(p0.totals);

  const maxMoneyLine = meta.max_money_line ?? null;
  const maxSpread = spread?.max ?? meta.max_spread ?? null;
  const maxTotal = total?.max ?? meta.max_total ?? null;
  // Prefer ML max; fall back to spread/total/meta for liquidity signal.
  const max = maxMoneyLine ?? maxSpread ?? maxTotal ?? meta.max_total ?? null;

  const out = {
    eventId: event.event_id,
    awayName: event.away,
    homeName: event.home,
    starts: event.starts,
    league: event.league_name,
    away,
    home,
    draw: draw ?? null,
    max: Number.isFinite(max) ? max : null,
    maxMoneyLine: Number.isFinite(maxMoneyLine) ? maxMoneyLine : null,
    maxSpread: Number.isFinite(maxSpread) ? maxSpread : null,
    maxTotal: Number.isFinite(maxTotal) ? maxTotal : null,
    fairSpread: null,
    fairTotal: null,
  };

  if (spread) {
    out.fairSpread = {
      awayLine: -Number(spread.hdp),
      awayOdds: decimalToAmerican(spread.away),
      homeLine: Number(spread.hdp),
      homeOdds: decimalToAmerican(spread.home),
    };
  }
  if (total) {
    out.fairTotal = {
      line: Number(total.points),
      overOdds: decimalToAmerican(total.over),
      underOdds: decimalToAmerican(total.under),
    };
  }

  return out;
}

/**
 * @returns {{ events: object[], last: any } | null}
 */
export async function fetchMarkets({ sportId, eventType = 'prematch', apiKey = process.env.PINNAPI_KEY }) {
  if (!apiKey) return null;
  const cacheKey = `${sportId}:${eventType}`;
  if (_marketsCache.has(cacheKey)) return _marketsCache.get(cacheKey);

  const url = `${BASE}/markets?sport_id=${sportId}&event_type=${eventType}`;
  const promise = (async () => {
    let res;
    try {
      res = await fetch(url, { headers: { 'x-portal-apikey': apiKey } });
    } catch (e) {
      console.warn(`  ⚠️ pinnapi ${sportId}/${eventType} network: ${e.message}`);
      return null;
    }
    if (res.status === 429) {
      console.warn(`  ⚠️ pinnapi rate limited (${eventType} sport_id=${sportId}) — skipping`);
      return null;
    }
    if (!res.ok) {
      console.warn(`  ⚠️ pinnapi ${sportId}/${eventType}: HTTP ${res.status}`);
      return null;
    }
    try {
      const data = await res.json();
      return { events: data.events || [], last: data.last };
    } catch (e) {
      console.warn(`  ⚠️ pinnapi parse error: ${e.message}`);
      return null;
    }
  })();

  _marketsCache.set(cacheKey, promise);
  const result = await promise;
  // Don't cache hard failures forever within a run — allow retry next label only on success/429/null.
  // (Keeping the promise avoids stampedes; null is fine for this cycle.)
  return result;
}

/**
 * Fetch prematch (+ live) for a sport label and index by gameKey.
 * @param {string} label  NHL | MLB | …
 * @param {(away:string, home:string, label:string) => string|null} makeGameKey
 * @returns {Promise<Map<string, object>>}
 */
export async function fetchPinnapiIndex(label, makeGameKey) {
  const sportId = PINNAPI_SPORT_ID[label];
  const map = new Map();
  if (!sportId || !process.env.PINNAPI_KEY) return map;

  const packs = [];
  const pre = await fetchMarkets({ sportId, eventType: 'prematch' });
  if (pre) packs.push(pre);
  const live = await fetchMarkets({ sportId, eventType: 'live' });
  if (live) packs.push(live);

  for (const pack of packs) {
    for (const ev of pack.events) {
      if (!leagueOk(label, ev.league_name)) continue;
      const quote = extractPeriod0(ev);
      if (!quote) continue;
      const gk = makeGameKey(quote.awayName, quote.homeName, label);
      if (!gk) continue;
      // Prefer live over prematch if both present (later pack wins when live).
      map.set(gk, quote);
    }
  }
  return map;
}
