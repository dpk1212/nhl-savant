/**
 * Polymarket Monitor — Volume & Price Movement
 *
 * Discovers events, polls volume/trades/prices, and surfaces
 * major volume spikes and price moves. No API key required.
 *
 * Usage:
 *   node scripts/polymarketMonitor.js              # one-shot, top events by volume
 *   node scripts/polymarketMonitor.js --sports    # filter to sports tag
 *   node scripts/polymarketMonitor.js --watch     # poll every 10 min (TODO)
 */

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

/** List active events. Omit tagSlug for all; use 'sports','nba','nhl' to filter. Sorts by volume client-side. */
async function listSportsEvents(tagSlug = null, limit = 20) {
  const params = new URLSearchParams({ active: 'true', closed: 'false', limit: '100' });
  if (tagSlug) params.set('tag_slug', tagSlug);
  const events = await get(`/events?${params}`);
  const arr = Array.isArray(events) ? events : [];
  arr.sort((a, b) => (b.volume_24hr ?? b.volume ?? 0) - (a.volume_24hr ?? a.volume ?? 0));
  return arr.slice(0, limit);
}

/** Get live volume for an event */
async function getLiveVolume(eventId) {
  const data = await get(`/live-volume?id=${eventId}`, DATA);
  return Array.isArray(data) ? data[0] : data;
}

/** Get recent trades for an event */
async function getTrades(eventId, limit = 100) {
  const params = new URLSearchParams({ eventId: String(eventId), limit: String(limit) });
  const trades = await get(`/trades?${params}`, DATA);
  return Array.isArray(trades) ? trades : [];
}

/** Get price history for a token (CLOB) */
async function getPriceHistory(tokenId, interval = '1h') {
  const params = new URLSearchParams({ market: tokenId, interval });
  const data = await get(`/prices-history?${params}`, CLOB);
  return data?.history || [];
}

/** Aggregate trade stats: total $, buy vs sell, outcome split */
function aggregateTrades(trades) {
  let totalCash = 0;
  let buyCash = 0;
  let sellCash = 0;
  const byOutcome = {};

  for (const t of trades) {
    const cash = (t.size || 0) * (t.price || 0);
    totalCash += cash;
    const out = t.outcome ?? `outcome_${t.outcomeIndex ?? 0}`;
    if (!byOutcome[out]) byOutcome[out] = { buy: 0, sell: 0 };
    if (t.side === 'BUY') {
      buyCash += cash;
      byOutcome[out].buy += cash;
    } else {
      sellCash += cash;
      byOutcome[out].sell += cash;
    }
  }

  return {
    totalCash,
    buyCash,
    sellCash,
    buyPct: totalCash > 0 ? (buyCash / totalCash * 100).toFixed(1) : 0,
    sellPct: totalCash > 0 ? (sellCash / totalCash * 100).toFixed(1) : 0,
    ticketCount: trades.length,
    byOutcome,
  };
}

/** Compute price move % from history */
function priceMovePct(history) {
  if (!history || history.length < 2) return null;
  const first = history[0].p;
  const last = history[history.length - 1].p;
  if (first <= 0) return null;
  return ((last - first) / first * 100).toFixed(1);
}

async function run() {
  console.log('\n📊 Polymarket Monitor — Volume & Price Movement\n');
  console.log('Fetching active sports events (by 24h volume)...\n');

  const tagSlug = process.argv.includes('--sports') ? 'sports' : null;
  const events = await listSportsEvents(tagSlug, 15);
  if (events.length === 0) {
    console.log('No events found. Try tag_slug: nba, nhl, or sports.');
    return;
  }

  for (const ev of events.slice(0, 5)) {
    const id = ev.id ?? ev.slug;
    const title = (ev.title || ev.question || '').substring(0, 60);
    const vol24 = ev.volume_24hr ?? ev.volume ?? 0;
    const vol = ev.volume ?? 0;

    console.log(`\n── ${title}`);
    console.log(`   Event ID: ${id} | 24h vol: $${Number(vol24).toLocaleString()} | Total: $${Number(vol).toLocaleString()}`);

    try {
      const live = await getLiveVolume(id);
      if (live?.total != null) {
        console.log(`   Live volume: $${Number(live.total).toLocaleString()}`);
      }

      const trades = await getTrades(id, 50);
      if (trades.length > 0) {
        const agg = aggregateTrades(trades);
        console.log(`   Recent trades: ${agg.ticketCount} | $${agg.totalCash.toFixed(0)} | Buy ${agg.buyPct}% / Sell ${agg.sellPct}%`);
      }

      // Price history for first market token (if available)
      const markets = ev.markets || [];
      const firstMarket = markets[0];
      let tokenIds = firstMarket?.clobTokenIds;
      if (typeof tokenIds === 'string') tokenIds = JSON.parse(tokenIds).filter(Boolean);
      else if (firstMarket?.tokens) tokenIds = firstMarket.tokens.map(t => t.token_id);
      if (Array.isArray(tokenIds) && tokenIds.length > 0) {
        const hist = await getPriceHistory(tokenIds[0], '1h');
        const move = priceMovePct(hist);
        if (move != null) {
          console.log(`   1h price move: ${Number(move) > 0 ? '+' : ''}${move}%`);
        }
      }
    } catch (e) {
      console.log(`   ⚠️ ${e.message}`);
    }
  }

  console.log('\n');
}

run().catch(e => { console.error(e); process.exit(1); });