/**
 * Polymarket Data Fetcher — CBB & NHL
 *
 * Fetches events, volume, trades, price movement from Polymarket.
 * Matches to games using basketball_teams.csv (CBB) and NHL team map.
 * Outputs JSON to public/polymarket_data.json for UI consumption.
 *
 * Usage: node scripts/fetchPolymarketData.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const GAMMA = 'https://gamma-api.polymarket.com';
const DATA = 'https://data-api.polymarket.com';
const CLOB = 'https://clob.polymarket.com';

const httpFetch = typeof globalThis.fetch === 'function' ? globalThis.fetch : (await import('node-fetch')).default;

async function get(path, base = GAMMA) {
  const url = base + path;
  const res = await httpFetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

/** List active events by tag. Client-side sort by volume. */
async function listEvents(tagSlug, limit = 80) {
  const params = new URLSearchParams({ active: 'true', closed: 'false', limit: '100' });
  if (tagSlug) params.set('tag_slug', tagSlug);
  const events = await get(`/events?${params}`);
  const arr = Array.isArray(events) ? events : [];
  arr.sort((a, b) => (b.volume_24hr ?? b.volume ?? 0) - (a.volume_24hr ?? a.volume ?? 0));
  return arr.slice(0, limit);
}

async function getLiveVolume(eventId) {
  const data = await get(`/live-volume?id=${eventId}`, DATA);
  return Array.isArray(data) ? data[0] : data;
}

async function getTrades(eventId, limit = 100) {
  const params = new URLSearchParams({ eventId: String(eventId), limit: String(limit) });
  const trades = await get(`/trades?${params}`, DATA);
  return Array.isArray(trades) ? trades : [];
}

async function getPriceHistory(tokenId, interval = '1h') {
  const params = new URLSearchParams({ market: tokenId, interval });
  const data = await get(`/prices-history?${params}`, CLOB);
  return data?.history || [];
}

function aggregateTrades(trades) {
  let totalCash = 0, buyCash = 0, sellCash = 0;
  for (const t of trades) {
    const cash = (t.size || 0) * (t.price || 0);
    totalCash += cash;
    if (t.side === 'BUY') buyCash += cash;
    else sellCash += cash;
  }
  return {
    totalCash,
    buyCash,
    sellCash,
    buyPct: totalCash > 0 ? Number((buyCash / totalCash * 100).toFixed(1)) : 0,
    sellPct: totalCash > 0 ? Number((sellCash / totalCash * 100).toFixed(1)) : 0,
    ticketCount: trades.length,
  };
}

function priceMovePct(history) {
  if (!history || history.length < 2) return null;
  const first = history[0].p;
  const last = history[history.length - 1].p;
  if (first <= 0) return null;
  return Number(((last - first) / first * 100).toFixed(1));
}

function normalize(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

// ─── CBB: Team name mapping from basketball_teams.csv ──────────────────────
function loadCBBTeamMap() {
  const csvPath = join(ROOT, 'public', 'basketball_teams.csv');
  let csv;
  try {
    csv = readFileSync(csvPath, 'utf8');
  } catch { return new Map(); }
  const lines = csv.split('\n').filter(Boolean);
  const headers = lines[0].toLowerCase().split(',');
  const map = new Map(); // normalizedToken -> oddstrader_name (canonical)
  for (let i = 1; i < lines.length; i++) {
    const vals = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((h, j) => { row[h.trim()] = vals[j]?.trim() || ''; });
    const oddstrader = row.oddstrader_name || row.normalized_name || '';
    if (!oddstrader) continue;
    const names = [
      oddstrader,
      row.normalized_name,
      row.haslametrics_name,
      row.dratings_name,
      row.ncaa_name,
      row.espn_name,
      row.barttorvik_name,
      row.odds_api_name,
      row.cbbd_name,
    ].filter(Boolean);
    for (const n of names) {
      const nrm = normalize(n);
      if (nrm.length >= 2) map.set(nrm, oddstrader);
    }
  }
  return map;
}

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else current += char;
  }
  values.push(current.trim());
  return values;
}

// ─── NHL: Polymarket names -> OddsTrader city names ────────────────────────
const NHL_ODDS_CITIES = [
  'Boston', 'Toronto', 'Montreal', 'Ottawa', 'Buffalo', 'Detroit', 'Tampa Bay',
  'Florida', 'Carolina', 'Washington', 'Pittsburgh', 'Philadelphia', 'New Jersey',
  'Columbus', 'Nashville', 'Winnipeg', 'Chicago', 'Minnesota', 'Dallas', 'St. Louis',
  'Colorado', 'Arizona', 'Utah', 'Vegas', 'Los Angeles', 'Anaheim', 'San Jose',
  'Calgary', 'Edmonton', 'Vancouver', 'Seattle', 'N.Y. Rangers', 'N.Y. Islanders',
];
const NHL_MAP = {
  bruins: 'Boston', mapleleafs: 'Toronto', leafs: 'Toronto',
  rangers: 'N.Y. Rangers', islanders: 'N.Y. Islanders',
  canadiens: 'Montreal', habs: 'Montreal',
  senators: 'Ottawa', sabres: 'Buffalo', redwings: 'Detroit',
  lightning: 'Tampa Bay', bolts: 'Tampa Bay', tampabay: 'Tampa Bay',
  panthers: 'Florida', hurricanes: 'Carolina',
  capitals: 'Washington', caps: 'Washington',
  penguins: 'Pittsburgh', pens: 'Pittsburgh',
  flyers: 'Philadelphia', devils: 'New Jersey', newjersey: 'New Jersey',
  bluejackets: 'Columbus', jackets: 'Columbus',
  predators: 'Nashville', preds: 'Nashville',
  jets: 'Winnipeg', blackhawks: 'Chicago', hawks: 'Chicago',
  wild: 'Minnesota', stars: 'Dallas', blues: 'St. Louis', stlouis: 'St. Louis',
  avalanche: 'Colorado', avs: 'Colorado',
  coyotes: 'Arizona', utah: 'Utah',
  knights: 'Vegas', goldenknights: 'Vegas',
  kings: 'Los Angeles', losangeles: 'Los Angeles', la: 'Los Angeles',
  ducks: 'Anaheim', sharks: 'San Jose', sanjose: 'San Jose',
  flames: 'Calgary', oilers: 'Edmonton',
  canucks: 'Vancouver', kraken: 'Seattle',
};
NHL_ODDS_CITIES.forEach(c => {
  const n = normalize(c);
  if (!NHL_MAP[n]) NHL_MAP[n] = c;
});

function resolveNHLTeam(raw) {
  const n = normalize(raw);
  if (NHL_MAP[n]) return NHL_MAP[n];
  const words = raw.split(/\s+/);
  for (const w of words) {
    const wn = normalize(w);
    if (NHL_MAP[wn]) return NHL_MAP[wn];
  }
  return null;
}

// ─── Extract team names from Polymarket title ───────────────────────────────
function extractTeamsFromTitle(title) {
  const t = (title || '').trim();
  const patterns = [
    /(.+?)\s+vs\.?\s+(.+?)(?:\s*\([Ww]\))?\s*$/,
    /(.+?)\s+@\s+(.+?)\s*$/,
    /(.+?)\s+at\s+(.+?)\s*$/,
    /will\s+(?:the\s+)?(.+?)\s+beat\s+(?:the\s+)?(.+?)(?:\?|$)/i,
    /(.+?)\s+beat\s+(.+?)(?:\?|$)/i,
  ];
  for (const pattern of patterns) {
    const m = t.match(pattern);
    if (m) {
      const a = m[1].trim().replace(/\s+/g, ' ');
      const b = m[2].trim().replace(/\s+/g, ' ');
      if (a.length >= 2 && b.length >= 2) return [a, b];
    }
  }
  return null;
}

// Find CBB team: Polymarket "Boston College Eagles" -> "Boston College" via longest prefix
function findCBBTeam(cbbMap, polymarketStr) {
  const n = normalize(polymarketStr);
  let best = null;
  let bestLen = 0;
  for (const [key, canon] of cbbMap) {
    if (n.startsWith(key) && key.length > bestLen) {
      best = canon;
      bestLen = key.length;
    }
    if (n === key) return canon;
  }
  return best || cbbMap.get(n);
}

// ─── Match event to game key ───────────────────────────────────────────────
function matchToGameKey(teams, cbbMap, sport) {
  if (!teams || teams.length !== 2) return null;
  const [a, b] = teams;
  if (sport === 'CBB') {
    const aCanon = findCBBTeam(cbbMap, a);
    const bCanon = findCBBTeam(cbbMap, b);
    if (!aCanon || !bCanon) return null;
    return `${normalize(aCanon)}_${normalize(bCanon)}`;
  }
  if (sport === 'NHL') {
    const aRes = resolveNHLTeam(normalize(a)) || resolveNHLTeam(normalize(a.replace(/\s/g, '')));
    const bRes = resolveNHLTeam(normalize(b)) || resolveNHLTeam(normalize(b.replace(/\s/g, '')));
    if (!aRes || !bRes) return null;
    return `${normalize(aRes)}_${normalize(bRes)}`;
  }
  return null;
}

// ─── Main ─────────────────────────────────────────────────────────────────
async function run() {
  const out = { CBB: {}, NHL: {}, updatedAt: new Date().toISOString() };
  const cbbMap = loadCBBTeamMap();

  const tags = [
    { slug: 'sports', sport: null },
    { slug: 'ncaa', sport: 'CBB' },
    { slug: 'nba', sport: 'NBA' },
    { slug: 'nhl', sport: 'NHL' },
  ];

  const seen = new Set();
  const events = [];

  for (const { slug, sport } of tags) {
    try {
      const list = await listEvents(slug, 40);
      for (const ev of list) {
        events.push({ ...ev, _tag: slug, _sport: sport || slug });
      }
    } catch (e) {
      console.warn(`Failed to fetch ${slug}:`, e.message);
    }
  }

  // Dedupe by event id
  const byId = new Map();
  for (const ev of events) {
    const id = ev.id ?? ev.slug;
    if (!byId.has(id)) byId.set(id, ev);
  }

  for (const ev of byId.values()) {
    const id = ev.id ?? ev.slug;
    const title = ev.title || ev.question || '';
    const teams = extractTeamsFromTitle(title);
    if (!teams) continue;

    let sport = ev._sport === 'ncaa' ? 'CBB' : ev._sport === 'nhl' ? 'NHL' : ev._sport === 'nba' ? 'NBA' : null;
    if (!sport) {
      const t = title.toLowerCase();
      if (/ncaa|college|basketball/.test(t) && !/nba|champion|winner|tournament winner/.test(t)) sport = 'CBB';
      else if (/nhl|hockey/.test(t) && !/champion|winner|stanley/.test(t)) sport = 'NHL';
    }
    if (!sport || (sport !== 'CBB' && sport !== 'NHL')) continue;

    const key = matchToGameKey(teams, cbbMap, sport);
    if (!key || seen.has(key)) continue;
    seen.add(key);

    const sportKey = sport === 'CBB' ? 'CBB' : 'NHL';
    const bucket = out[sportKey];

    try {
      const live = await getLiveVolume(id);
      const trades = await getTrades(id, 80);
      const agg = aggregateTrades(trades);

      let priceMove1h = null;
      const markets = ev.markets || [];
      const firstMarket = markets[0];
      let tokenIds = firstMarket?.clobTokenIds;
      if (typeof tokenIds === 'string') tokenIds = JSON.parse(tokenIds || '[]').filter(Boolean);
      else if (firstMarket?.tokens) tokenIds = firstMarket.tokens.map(t => t.token_id);
      if (Array.isArray(tokenIds) && tokenIds.length > 0) {
        const hist = await getPriceHistory(tokenIds[0], '1h');
        priceMove1h = priceMovePct(hist);
      }

      const vol24 = ev.volume_24hr ?? ev.volume ?? 0;
      bucket[key] = {
        volume24h: Number(vol24),
        liveVolume: live?.total != null ? Number(live.total) : null,
        buyPct: agg.buyPct,
        sellPct: agg.sellPct,
        tradeCount: agg.ticketCount,
        priceMove1h,
        eventId: id,
        title: title.substring(0, 80),
      };
    } catch (e) {
      console.warn(`Failed to enrich ${title}:`, e.message);
    }
  }

  const outPath = join(ROOT, 'public', 'polymarket_data.json');
  writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${outPath} — CBB: ${Object.keys(out.CBB).length}, NHL: ${Object.keys(out.NHL).length}`);
}

run().catch(e => { console.error(e); process.exit(1); });
