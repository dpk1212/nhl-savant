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

/** Every FG total line Pinnacle is quoting (alts + main). */
export function extractAllTotals(totals) {
  if (!totals || typeof totals !== 'object') return [];
  const out = [];
  const seen = new Set();
  for (const t of Object.values(totals)) {
    if (!t || t.over == null || t.under == null) continue;
    const line = Number(t.points);
    const overOdds = decimalToAmerican(t.over);
    const underOdds = decimalToAmerican(t.under);
    if (!Number.isFinite(line) || !Number.isFinite(overOdds) || !Number.isFinite(underOdds)) continue;
    const key = line.toFixed(3);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      line,
      overOdds,
      underOdds,
      max: Number.isFinite(Number(t.max)) ? Number(t.max) : null,
    });
  }
  return out.sort((a, b) => a.line - b.line);
}

/** Every FG spread Pinnacle is quoting (alts + main). */
export function extractAllSpreads(spreads) {
  if (!spreads || typeof spreads !== 'object') return [];
  const out = [];
  const seen = new Set();
  for (const s of Object.values(spreads)) {
    if (!s || s.home == null || s.away == null) continue;
    const homeLine = Number(s.hdp);
    const awayLine = -homeLine;
    const homeOdds = decimalToAmerican(s.home);
    const awayOdds = decimalToAmerican(s.away);
    if (!Number.isFinite(homeLine) || !Number.isFinite(homeOdds) || !Number.isFinite(awayOdds)) continue;
    const key = homeLine.toFixed(3);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      homeLine,
      awayLine,
      homeOdds,
      awayOdds,
      max: Number.isFinite(Number(s.max)) ? Number(s.max) : null,
    });
  }
  return out.sort((a, b) => Math.abs(a.homeLine) - Math.abs(b.homeLine));
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
  const allTotals = extractAllTotals(p0.totals);
  const allSpreads = extractAllSpreads(p0.spreads);

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
    allTotals,
    allSpreads,
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

/**
 * Pull recent odds drops (REST buffer — Edge/Drops plans).
 * Prefer this in cron over long-lived SSE; same drop events as /odds-drop.
 *
 * @param {object} [opts]
 * @param {'prematch'|'live'} [opts.mode]
 * @param {number} [opts.sportId]
 * @param {number} [opts.minDropPct]
 * @param {number} [opts.maxAgeSec]
 * @param {string} [opts.markets]  csv: moneyline,spread,total
 * @returns {Promise<object[]>}
 */
export async function fetchRecentDrops({
  mode = 'prematch',
  sportId = null,
  minDropPct = 3,
  maxAgeSec = 7200,
  markets = 'moneyline,spread,total',
  periods = '0',
  limit = 500,
  apiKey = process.env.PINNAPI_KEY,
} = {}) {
  if (!apiKey) return [];
  const qs = new URLSearchParams({
    mode,
    min_drop_pct: String(minDropPct),
    max_age_sec: String(maxAgeSec),
    markets,
    periods,
    limit: String(limit),
  });
  if (sportId != null) qs.set('sport_id', String(sportId));
  const url = `https://pinnapi.com/api/drops?${qs}`;
  let res;
  try {
    res = await fetch(url, { headers: { 'x-portal-apikey': apiKey } });
  } catch (e) {
    console.warn(`  ⚠️ pinnapi drops network: ${e.message}`);
    return [];
  }
  if (res.status === 401 || res.status === 403) {
    console.warn(`  ⚠️ pinnapi drops: HTTP ${res.status} (need Edge/Drops plan)`);
    return [];
  }
  if (res.status === 429) {
    console.warn('  ⚠️ pinnapi drops rate limited — skipping');
    return [];
  }
  if (!res.ok) {
    console.warn(`  ⚠️ pinnapi drops: HTTP ${res.status}`);
    return [];
  }
  try {
    const data = await res.json();
    return Array.isArray(data?.drops) ? data.drops : [];
  } catch (e) {
    console.warn(`  ⚠️ pinnapi drops parse: ${e.message}`);
    return [];
  }
}

/** Decimal (European) → American for drop from/to prices. */
export function normalizeDrop(raw, nowSec = Math.floor(Date.now() / 1000)) {
  if (!raw || typeof raw !== 'object') return null;
  const fromDec = Number(raw.from ?? raw.from_price);
  const toDec = Number(raw.to ?? raw.to_price);
  const dropPct = Number(raw.drop_pct);
  const age = Number(raw.age_s);
  const mktRaw = String(raw.market || raw.sect || '').toLowerCase();
  let market = null;
  if (mktRaw.includes('total') || mktRaw === 'ou' || mktRaw === 'o/u') market = 'total';
  else if (mktRaw.includes('spread') || mktRaw.includes('handicap')) market = 'spread';
  else if (mktRaw.includes('money') || mktRaw === 'ml' || mktRaw === 'moneyline') market = 'ml';
  const sideRaw = String(raw.side || raw.outcome || '').toLowerCase();
  let side = null;
  if (sideRaw === 'over' || sideRaw.startsWith('over')) side = 'over';
  else if (sideRaw === 'under' || sideRaw.startsWith('under')) side = 'under';
  else if (sideRaw === 'home' || sideRaw === '1') side = 'home';
  else if (sideRaw === 'away' || sideRaw === '2') side = 'away';
  else if (sideRaw === 'draw' || sideRaw === 'x') side = 'draw';
  const t = Number.isFinite(age) ? nowSec - age : nowSec;
  return {
    eventId: raw.event_id ?? raw.id ?? null,
    sportName: raw.sport_name || raw.sport || null,
    league: raw.league || null,
    home: raw.home || null,
    away: raw.away || null,
    market,
    side,
    points: Number.isFinite(Number(raw.points)) ? Number(raw.points) : null,
    fromDec: Number.isFinite(fromDec) ? fromDec : null,
    toDec: Number.isFinite(toDec) ? toDec : null,
    fromOdds: decimalToAmerican(fromDec),
    toOdds: decimalToAmerican(toDec),
    dropPct: Number.isFinite(dropPct) ? dropPct : null,
    nvp: Number.isFinite(Number(raw.nvp)) ? Number(raw.nvp) : null,
    t,
    isLive: !!raw.is_live,
  };
}

/**
 * Optional long-lived SSE consumer (Edge). Prefer fetchRecentDrops in Actions cron.
 * Yields normalized drop objects. Caller must abort via signal.
 */
export async function* streamOddsDrops({
  prematch = true,
  minDrop = 3,
  apiKey = process.env.PINNAPI_KEY,
  signal = null,
} = {}) {
  if (!apiKey) return;
  const path = prematch ? '/odds-drop-prematch' : '/odds-drop';
  const url = `https://pinnapi.com${path}?key=${encodeURIComponent(apiKey)}&min_drop=${minDrop}`;
  let res;
  try {
    res = await fetch(url, {
      headers: { Accept: 'text/event-stream', 'x-portal-apikey': apiKey },
      signal,
    });
  } catch (e) {
    console.warn(`  ⚠️ pinnapi SSE connect: ${e.message}`);
    return;
  }
  if (!res.ok || !res.body) {
    console.warn(`  ⚠️ pinnapi SSE HTTP ${res.status}`);
    return;
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const parts = buf.split('\n');
    buf = parts.pop() || '';
    for (const line of parts) {
      if (!line.startsWith('data:')) continue;
      const raw = line.slice(5).trim();
      if (!raw) continue;
      let payload;
      try { payload = JSON.parse(raw); } catch { continue; }
      if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
        if (payload.type === 'connected' || payload.type === 'error') continue;
      }
      const list = Array.isArray(payload) ? payload : [payload];
      for (const d of list) {
        const n = normalizeDrop(d);
        if (n) yield n;
      }
    }
  }
}
