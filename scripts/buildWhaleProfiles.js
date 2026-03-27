/**
 * Build Whale Profiles — aggregates P&L and activity data for
 * Polymarket wallets seen in whale trades.
 *
 * Reads polymarket_data.json for unique wallet addresses, then
 * queries the Polymarket Data API for each wallet's positions
 * and trade count. Merges with existing whale_profiles.json.
 *
 * Usage: node scripts/buildWhaleProfiles.js
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_API = 'https://data-api.polymarket.com';

const httpFetch = typeof globalThis.fetch === 'function'
  ? globalThis.fetch
  : (await import('node-fetch')).default;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const isSeedMode = process.argv.includes('--seed');
const MAX_WALLETS_PER_RUN = isSeedMode ? 150 : 100;
const MAX_PROFILES = 1000;
const STALE_DAYS = 30;
const RETRY_LIMIT = 3;
const DELAY_MS = isSeedMode ? 800 : 1200;

const SPORT_KEYWORDS = {
  NHL: ['nhl', 'hockey', 'stanley cup', 'bruins', 'rangers', 'maple leafs', 'canadiens',
    'oilers', 'panthers', 'avalanche', 'stars', 'jets', 'hurricanes', 'devils',
    'islanders', 'penguins', 'capitals', 'lightning', 'flames', 'senators',
    'predators', 'blues', 'wild', 'kraken', 'ducks', 'sharks', 'blackhawks',
    'sabres', 'flyers', 'kings', 'red wings', 'blue jackets', 'coyotes'],
  CBB: ['ncaa', 'march madness', 'college basketball', 'tournament', 'bulldogs',
    'wildcats', 'tigers', 'eagles', 'bears', 'blue devils', 'tar heels',
    'jayhawks', 'spartans', 'wolverines', 'buckeyes', 'crimson tide',
    'gators', 'seminoles', 'cavaliers', 'huskies', 'boilermakers'],
  NBA: ['nba', 'lakers', 'celtics', 'warriors', 'bucks', 'nuggets', 'heat',
    'suns', '76ers', 'sixers', 'nets', 'knicks', 'clippers', 'mavericks',
    'grizzlies', 'timberwolves', 'pelicans', 'rockets', 'spurs', 'raptors',
    'pacers', 'hawks', 'hornets', 'pistons', 'wizards', 'magic', 'trail blazers'],
  NFL: ['nfl', 'super bowl', 'chiefs', 'eagles', 'ravens', 'bills', 'dolphins',
    'cowboys', 'packers', 'lions', 'steelers', 'bengals', 'chargers',
    'broncos', 'raiders', 'saints', 'buccaneers', 'seahawks', 'rams',
    'cardinals', 'commanders', 'bears', 'vikings', 'jaguars', 'titans',
    'colts', 'texans', 'patriots', 'jets', 'giants', 'browns', 'falcons', 'panthers'],
  MLB: ['mlb', 'baseball', 'world series', 'yankees', 'dodgers', 'braves',
    'astros', 'phillies', 'padres', 'mets', 'cubs', 'red sox', 'cardinals',
    'brewers', 'guardians', 'orioles', 'twins', 'mariners', 'rays',
    'rangers', 'blue jays', 'white sox', 'reds', 'pirates', 'diamondbacks',
    'giants', 'rockies', 'royals', 'angels', 'tigers', 'marlins', 'nationals', 'athletics'],
};

function classifySport(title) {
  const t = title.toLowerCase();
  for (const [sport, keywords] of Object.entries(SPORT_KEYWORDS)) {
    for (const kw of keywords) {
      if (t.includes(kw)) return sport;
    }
  }
  return null;
}

function calculateMMScore(profile, leaderboardVol) {
  let score = 0;

  // Factor 1: Volume/PnL ratio — MMs have massive volume relative to profit
  const vol = leaderboardVol || 0;
  const pnl = Math.abs(profile.totalPnl || 1);
  if (vol > 0) {
    const ratio = vol / pnl;
    if (ratio > 50) score += 20;
    else if (ratio > 20) score += 12;
    else if (ratio > 10) score += 5;
  }

  // Factor 2: Market breadth — MMs are generalists across 100+ markets
  const markets = profile.marketsTraded || 0;
  if (markets > 200) score += 15;
  else if (markets > 100) score += 8;
  else if (markets > 50) score += 4;

  // Factor 3: Sport concentration — low concentration = MM (generalist)
  const sportMarkets = profile.sportMarkets || {};
  const totalSportMarkets = Object.values(sportMarkets).reduce((s, v) => s + v, 0);
  const maxSportMarkets = Math.max(...Object.values(sportMarkets), 0);
  const concentration = totalSportMarkets > 0 ? maxSportMarkets / totalSportMarkets : 0;
  if (concentration < 0.3) score += 15;
  else if (concentration < 0.5) score += 8;

  // Factor 4: PnL consistency — MMs have tiny steady gains (low variance)
  const pnlHistory = profile.pnlHistory || [];
  if (pnlHistory.length >= 5) {
    const deltas = [];
    for (let i = 1; i < pnlHistory.length; i++) {
      deltas.push(Math.abs(pnlHistory[i].pnl - pnlHistory[i - 1].pnl));
    }
    const avgDelta = deltas.reduce((s, d) => s + d, 0) / deltas.length;
    const pnlMag = Math.abs(profile.totalPnl || 1);
    if (avgDelta / pnlMag < 0.01) score += 15;
    else if (avgDelta / pnlMag < 0.03) score += 8;
  }

  // Factor 5: Negative sport PnL — wallet profits from non-sport markets
  // but LOSES money on sports. Strongest disqualifier.
  const sportPnl = profile.sportPnl || {};
  const totalSportPnl = Object.values(sportPnl).reduce((s, v) => s + v, 0);
  if (totalSportPnl < -100000) score += 35;
  else if (totalSportPnl < -25000) score += 25;
  else if (totalSportPnl < -5000) score += 15;
  else if (totalSportPnl < 0) score += 5;

  return Math.min(score, 100);
}

function tierFromStats(totalPnl, marketsTraded) {
  if (totalPnl > 100000 && marketsTraded > 50) return 'ELITE';
  if (totalPnl > 25000 && marketsTraded > 20) return 'PROVEN';
  if (totalPnl > 5000 && marketsTraded > 10) return 'ACTIVE';
  if (totalPnl < -50000) return 'DEGEN';
  if (totalPnl < -10000) return 'LOSING';
  return 'UNKNOWN';
}

async function fetchWithRetry(url, retries = RETRY_LIMIT) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await httpFetch(url, { headers: { Accept: 'application/json' } });
      if (res.status === 429) {
        const wait = Math.pow(2, i + 1) * 1000;
        console.warn(`  ⏳ Rate limited, waiting ${wait / 1000}s...`);
        await sleep(wait);
        continue;
      }
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      return await res.json();
    } catch (e) {
      if (i === retries) {
        console.warn(`  ❌ Failed after ${retries + 1} attempts: ${e.message}`);
        return null;
      }
      await sleep(1000 * (i + 1));
    }
  }
  return null;
}

function loadJSON(filename) {
  const path = join(ROOT, 'public', filename);
  if (!existsSync(path)) return null;
  try { return JSON.parse(readFileSync(path, 'utf8')); } catch { return null; }
}

function extractWallets(polyData) {
  const walletMap = new Map();
  for (const sport of Object.values(polyData)) {
    if (typeof sport !== 'object' || sport === null) continue;
    for (const game of Object.values(sport)) {
      const trades = game?.whales?.topTrades || [];
      for (const t of trades) {
        if (!t.wallet) continue;
        const w = t.wallet.toLowerCase();
        const existing = walletMap.get(w);
        if (!existing || (t.ts && t.ts > (existing.lastSeen || 0))) {
          walletMap.set(w, {
            wallet: w,
            name: t.traderName || existing?.name || null,
            lastSeen: Math.max(t.ts || 0, existing?.lastSeen || 0),
          });
        }
      }
    }
  }
  return [...walletMap.values()].sort((a, b) => b.lastSeen - a.lastSeen);
}

async function buildProfile(wallet) {
  const positions = await fetchWithRetry(
    `${DATA_API}/positions?user=${wallet}&sortBy=CASHPNL&limit=500`
  );
  await sleep(DELAY_MS);

  const traded = await fetchWithRetry(
    `${DATA_API}/traded?user=${wallet}`
  );
  await sleep(DELAY_MS);

  if (!positions || !Array.isArray(positions)) {
    return { totalPnl: 0, sportPnl: {}, marketsTraded: traded?.traded || 0, sportMarkets: {} };
  }

  let totalPnl = 0;
  const sportPnl = {};
  const sportMarkets = {};

  for (const p of positions) {
    const pnl = parseFloat(p.cashPnl || '0');
    totalPnl += pnl;

    const sport = classifySport(p.title || '');
    if (sport) {
      sportPnl[sport] = (sportPnl[sport] || 0) + pnl;
      sportMarkets[sport] = (sportMarkets[sport] || 0) + 1;
    }
  }

  return {
    totalPnl: Math.round(totalPnl),
    sportPnl: Object.fromEntries(Object.entries(sportPnl).map(([k, v]) => [k, Math.round(v)])),
    marketsTraded: traded?.traded || positions.length,
    sportMarkets,
  };
}

async function fetchLeaderboard() {
  const LB_DEPTH = 1000;
  console.log(`🏆 Fetching sports leaderboard (top ${LB_DEPTH})...`);
  const all = [];
  for (let offset = 0; offset < LB_DEPTH; offset += 50) {
    const url = `${DATA_API}/v1/leaderboard?timePeriod=ALL&category=SPORTS&orderBy=PNL&limit=50&offset=${offset}`;
    const data = await fetchWithRetry(url);
    if (!data || !Array.isArray(data) || data.length === 0) break;
    all.push(...data);
    await sleep(500);
  }
  const profitable = all.filter(t => (t.pnl || 0) > 2000);
  console.log(`  Found ${profitable.length} profitable sports traders on leaderboard`);
  if (profitable.length > 0) {
    console.log(`  Range: $${Math.round(profitable[0].pnl).toLocaleString()} → $${Math.round(profitable[profitable.length - 1].pnl).toLocaleString()}\n`);
  }
  return profitable.map(t => ({
    wallet: (t.proxyWallet || '').toLowerCase(),
    name: t.userName || null,
    pnl: t.pnl || 0,
    vol: t.vol || 0,
    source: 'leaderboard',
  }));
}

async function run() {
  console.log('🐋 Building whale profiles...\n');

  const polyData = loadJSON('polymarket_data.json');
  const wallets = polyData ? extractWallets(polyData) : [];
  console.log(`Found ${wallets.length} unique wallets in whale trades`);

  const leaderboard = await fetchLeaderboard();

  const existing = loadJSON('whale_profiles.json') || {};
  const now = Date.now();
  const staleCutoff = now - STALE_DAYS * 24 * 60 * 60 * 1000;

  for (const [addr, profile] of Object.entries(existing)) {
    if (profile.source !== 'leaderboard' && (profile.lastSeen || 0) < staleCutoff) {
      delete existing[addr];
    }
  }

  // Check CLI flag for leaderboard-only mode (used by seed workflow)
  const seedOnly = process.argv.includes('--seed');
  const refreshHours = seedOnly ? 24 : 12;

  // Leaderboard wallets — prioritize unprocessed, then stale
  const leaderboardToProcess = leaderboard
    .filter(w => {
      const ex = existing[w.wallet];
      if (!ex) return true;
      return !ex.builtAt || (now - ex.builtAt) > refreshHours * 60 * 60 * 1000;
    })
    .slice(0, seedOnly ? MAX_WALLETS_PER_RUN : 25);

  // Trade wallets (skip in seed-only mode)
  const tradeToProcess = seedOnly ? [] : wallets
    .filter(w => {
      if (leaderboardToProcess.some(l => l.wallet === w.wallet)) return false;
      const ex = existing[w.wallet];
      if (!ex) return true;
      return !ex.builtAt || (now - ex.builtAt) > refreshHours * 60 * 60 * 1000;
    })
    .slice(0, MAX_WALLETS_PER_RUN - leaderboardToProcess.length);

  const toProcess = [...leaderboardToProcess, ...tradeToProcess];
  const unseeded = leaderboard.filter(w => !existing[w.wallet]).length;
  console.log(`Processing ${toProcess.length} wallets (${leaderboardToProcess.length} leaderboard, ${tradeToProcess.length} trades)`);
  console.log(`Leaderboard coverage: ${leaderboard.length - unseeded}/${leaderboard.length} seeded\n`);

  for (const w of toProcess) {
    const displayName = w.name || w.wallet.slice(0, 10) + '...';
    const isLB = w.source === 'leaderboard';
    process.stdout.write(`  ${isLB ? '🏆' : '📊'} ${displayName}: `);

    try {
      const profile = await buildProfile(w.wallet);
      const pnl = isLB && w.pnl > profile.totalPnl ? w.pnl : profile.totalPnl;
      const tier = tierFromStats(pnl, profile.marketsTraded);

      const prev = existing[w.wallet];
      const pnlHistory = prev?.pnlHistory || [];
      const lastPnl = pnlHistory.length > 0 ? pnlHistory[pnlHistory.length - 1].pnl : null;
      if (lastPnl !== pnl) {
        pnlHistory.push({ t: now, pnl });
        if (pnlHistory.length > 30) pnlHistory.splice(0, pnlHistory.length - 30);
      }

      const mmScore = calculateMMScore(
        { totalPnl: pnl, marketsTraded: profile.marketsTraded, sportMarkets: profile.sportMarkets, pnlHistory },
        isLB ? (w.vol || 0) : (prev?.vol || 0)
      );

      existing[w.wallet] = {
        name: w.name || prev?.name || 'Anonymous',
        totalPnl: pnl,
        sportPnl: profile.sportPnl,
        marketsTraded: profile.marketsTraded,
        sportMarkets: profile.sportMarkets,
        lastSeen: w.lastSeen || now,
        tier,
        builtAt: now,
        pnlHistory,
        source: isLB ? 'leaderboard' : (prev?.source || 'trade'),
        vol: isLB ? (w.vol || 0) : (prev?.vol || 0),
        mmScore,
      };

      const mmLabel = mmScore > 50 ? ' ⚠️ LIKELY MM' : mmScore > 25 ? ' 🔶 SUSPECT' : '';
      console.log(`$${pnl.toLocaleString()} P&L, ${profile.marketsTraded} markets → ${tier} (MM:${mmScore})${mmLabel}`);
    } catch (e) {
      console.log(`error — ${e.message}`);
      if (!existing[w.wallet]) {
        existing[w.wallet] = {
          name: w.name || 'Anonymous',
          totalPnl: isLB ? (w.pnl || 0) : 0,
          sportPnl: {}, marketsTraded: 0, sportMarkets: {},
          lastSeen: w.lastSeen || now, tier: isLB ? 'PROVEN' : 'UNKNOWN',
          builtAt: now, source: isLB ? 'leaderboard' : 'trade',
        };
      }
    }
  }

  // Cap at MAX_PROFILES, prioritizing useful tiers then recency
  const tierPriority = { ELITE: 0, PROVEN: 1, ACTIVE: 2, UNKNOWN: 3, LOSING: 4, DEGEN: 5 };
  const entries = Object.entries(existing)
    .sort((a, b) => {
      const ta = tierPriority[a[1].tier] ?? 6;
      const tb = tierPriority[b[1].tier] ?? 6;
      if (ta !== tb) return ta - tb;
      return (b[1].lastSeen || 0) - (a[1].lastSeen || 0);
    })
    .slice(0, MAX_PROFILES);
  const output = Object.fromEntries(entries);

  const outPath = join(ROOT, 'public', 'whale_profiles.json');
  writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');

  const totalProfiles = Object.keys(output).length;
  const eliteCount = entries.filter(([, p]) => p.tier === 'ELITE').length;
  const provenCount = entries.filter(([, p]) => p.tier === 'PROVEN').length;
  const mmCount = entries.filter(([, p]) => (p.mmScore || 0) > 40).length;
  const sportLoserCount = entries.filter(([, p]) => {
    if ((p.mmScore || 0) > 40) return false;
    const sp = Object.values(p.sportPnl || {}).reduce((s, v) => s + v, 0);
    return sp < -100000;
  }).length;
  console.log(`\n✅ Wrote ${outPath} — ${totalProfiles} profiles (${eliteCount} ELITE, ${provenCount} PROVEN)`);
  console.log(`   Filtering: ${mmCount} MMs + ${sportLoserCount} sport losers excluded, ${eliteCount + provenCount - mmCount - sportLoserCount} clean sharps`);
}

run().catch(e => { console.error(e); process.exit(1); });
