/**
 * Enrich Gap Wallets — profiles whale_profiles wallets that have sport
 * positions but are NOT in sports_sharps.json (i.e. not on the leaderboard).
 *
 * Without this, these wallets show $0 P&L / $0 volume / no rank in the UI
 * because scanSharpPositions has no data for them.
 *
 * Runs as a separate lightweight workflow so scanSharpPositions stays fast.
 *
 * Usage: node scripts/enrichGapWallets.js
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { isWNBAMarketTitle } from './lib/wnbaTeams.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_API = 'https://data-api.polymarket.com';

const httpFetch = typeof globalThis.fetch === 'function'
  ? globalThis.fetch
  : (await import('node-fetch')).default;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const PAGE_DELAY_MS = 350;
const MAX_CLOSED_POSITIONS = 2000;
const RETRY_LIMIT = 3;
const REFRESH_HOURS = 48;

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
  // WNBA before NBA keyword loop — shared nicknames (Liberty, Sun, Sparks, …).
  if (isWNBAMarketTitle(title)) return 'WNBA';
  for (const [sport, keywords] of Object.entries(SPORT_KEYWORDS)) {
    for (const kw of keywords) {
      if (t.includes(kw)) return sport;
    }
  }
  // UFC: require explicit "ufc" — never bare "fight" (CBB Fighting Illini).
  if (/\bufc\b/.test(t)) return 'UFC';
  return null;
}

async function fetchWithRetry(url, retries = RETRY_LIMIT) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await httpFetch(url, { headers: { Accept: 'application/json' } });
      if (res.status === 429) {
        const wait = Math.pow(2, i + 1) * 1000;
        console.warn(`  Rate limited, waiting ${wait / 1000}s...`);
        await sleep(wait);
        continue;
      }
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      return await res.json();
    } catch (e) {
      if (i === retries) {
        console.warn(`  Failed after ${retries + 1} attempts: ${e.message}`);
        return null;
      }
      await sleep(1000 * (i + 1));
    }
  }
  return null;
}

function parseCurPrice(raw) {
  if (raw === null || raw === undefined || raw === '') return null;
  const n = typeof raw === 'number' ? raw : parseFloat(raw);
  return Number.isFinite(n) ? n : null;
}

async function buildProfile(wallet) {
  // TIMESTAMP DESC — never default REALIZEDPNL (winner-bias).
  let closedPositions = [];
  for (let offset = 0; offset < MAX_CLOSED_POSITIONS; offset += 50) {
    const page = await fetchWithRetry(
      `${DATA_API}/closed-positions?user=${wallet}&limit=50&offset=${offset}&sortBy=TIMESTAMP&sortDirection=DESC`
    );
    await sleep(PAGE_DELAY_MS);
    if (!page || !Array.isArray(page) || page.length === 0) break;
    closedPositions.push(...page);
    if (page.length < 50) break;
  }

  const traded = await fetchWithRetry(`${DATA_API}/traded?user=${wallet}`);
  await sleep(PAGE_DELAY_MS);

  const sportMarkets = {};
  const perSport = {};
  let sportInvested = 0;
  let sportPositionCount = 0;
  const recentResults = [];
  const MIN_RECENT_RESULTS = 5;
  const MAX_RECENT_RESULTS = 20;

  for (const p of closedPositions) {
    const sport = classifySport(p.title || '');
    if (!sport) continue;

    sportMarkets[sport] = (sportMarkets[sport] || 0) + 1;
    sportPositionCount++;
    const bought = parseFloat(p.totalBought || '0');
    const price = parseFloat(p.avgPrice || '0');
    const invested = (bought > 0 && price > 0) ? bought * price : 0;
    if (invested > 0) sportInvested += invested;

    if (!perSport[sport]) perSport[sport] = { bets: 0, invested: 0 };
    perSport[sport].bets++;
    perSport[sport].invested += invested;

    const curPrice = parseCurPrice(p.curPrice);
    const isSettled = curPrice != null && (curPrice >= 0.95 || curPrice <= 0.05);
    if (isSettled && recentResults.length < MAX_RECENT_RESULTS) {
      const realizedPnl = parseFloat(p.realizedPnl || '0');
      recentResults.push({
        title: p.title || '',
        sport,
        outcome: p.outcome || '',
        won: curPrice >= 0.95,
        entryPrice: Math.round(price * 100) / 100,
        size: Math.round(bought),
        invested: Math.round(invested),
        realizedPnl: Math.round(realizedPnl),
        timestamp: p.timestamp || 0,
      });
    }
  }

  for (const sp of Object.keys(perSport)) {
    const s = perSport[sp];
    s.invested = Math.round(s.invested);
    s.avgBet = s.bets > 0 ? Math.round(s.invested / s.bets) : 0;
  }

  return {
    sportMarkets,
    marketsTraded: traded?.traded || closedPositions.length,
    sportPositionCount,
    sportInvested: Math.round(sportInvested),
    perSport,
    recentResults: recentResults.length >= MIN_RECENT_RESULTS ? recentResults : [],
    closedCount: closedPositions.length,
  };
}

async function run() {
  console.log('=== Enrich Gap Wallets ===\n');

  const wpPath = join(ROOT, 'public', 'whale_profiles.json');
  const ssPath = join(ROOT, 'public', 'sports_sharps.json');

  if (!existsSync(wpPath)) { console.log('No whale_profiles.json — nothing to do'); return; }
  if (!existsSync(ssPath)) { console.log('No sports_sharps.json — nothing to do'); return; }

  const whaleProfiles = JSON.parse(readFileSync(wpPath, 'utf-8'));
  const sportsSharps = JSON.parse(readFileSync(ssPath, 'utf-8'));
  const { _meta, ...existingWallets } = sportsSharps;
  const existingSet = new Set(Object.keys(existingWallets).map(k => k.toLowerCase()));

  const now = Date.now();
  const refreshCutoff = now - REFRESH_HOURS * 60 * 60 * 1000;

  const gapWallets = [];
  for (const [addr, wp] of Object.entries(whaleProfiles)) {
    if (existingSet.has(addr.toLowerCase())) continue;
    const aggSportPnl = Object.values(wp.sportPnl || {}).reduce((s, v) => s + v, 0);
    if (aggSportPnl <= 0) continue;
    if ((wp.mmScore || 0) > 40) continue;
    const prev = existingWallets[addr];
    if (prev?.builtAt && prev.builtAt > refreshCutoff) continue;
    gapWallets.push({ addr, name: wp.name || 'Anonymous', tier: wp.tier, aggSportPnl });
  }

  gapWallets.sort((a, b) => b.aggSportPnl - a.aggSportPnl);

  console.log(`Found ${gapWallets.length} gap wallets (in whale_profiles, not in sports_sharps, sport PnL > 0)\n`);
  if (gapWallets.length === 0) { console.log('Nothing to enrich.'); return; }

  let profiled = 0;
  let errors = 0;

  for (const gw of gapWallets) {
    profiled++;
    process.stdout.write(`  [${profiled}/${gapWallets.length}] ${gw.name || gw.addr.slice(0, 10)} (${gw.tier}, $${gw.aggSportPnl.toLocaleString()} sport PnL): `);

    try {
      const profile = await buildProfile(gw.addr);
      const sportMarketCount = Object.values(profile.sportMarkets || {}).reduce((s, v) => s + v, 0);
      // Money stats from whale_profiles aggregate — NOT closed-position realized sums
      // (those do not reconcile to Polymarket SPORTS leaderboard accounting).
      const totalPnl = Math.round(gw.aggSportPnl || 0);
      const vol = profile.sportInvested || 0;
      const roi = vol > 0 ? +((totalPnl / vol) * 100).toFixed(1) : 0;

      if (totalPnl <= 0) {
        console.log(`SKIP — non-positive agg sport PnL`);
        continue;
      }
      if (vol > 0 && roi > 50) {
        console.log(`SKIP — unrealistic ROI (${roi}%) vs closed invested sample`);
        continue;
      }

      existingWallets[gw.addr] = {
        name: gw.name,
        totalPnl,
        sportPnlTotal: totalPnl,
        overallPnl: null,
        overallVol: null,
        sportMarkets: profile.sportMarkets,
        marketsTraded: profile.marketsTraded,
        sportBets: sportMarketCount,
        sportBetCount: profile.sportPositionCount || sportMarketCount,
        sportROI: roi,
        avgSportBet: profile.sportPositionCount > 0 ? Math.round(vol / profile.sportPositionCount) : 0,
        leaderboardRank: null,
        leaderboardScope: null,
        leaderboardDepth: null,
        sportsLbPercentileTop: null,
        perSport: profile.perSport,
        recentResults: profile.recentResults,
        weeklyPnl: null,
        weeklyVol: null,
        weeklyROI: null,
        weeklyRank: null,
        dailyPnl: null,
        dailyVol: null,
        dailyROI: null,
        dailyRank: null,
        lastSeen: now,
        builtAt: now,
        source: 'gap_enrichment',
        vol,
      };

      console.log(`${sportMarketCount} sport mkts, ${roi}% ROI, ${profile.closedCount} closed positions`);
    } catch (e) {
      errors++;
      console.log(`error — ${e.message}`);
    }
  }

  const output = { _meta: _meta || {}, ...existingWallets };
  output._meta.lastGapEnrichment = new Date().toISOString();
  output._meta.gapWalletsEnriched = profiled - errors;

  writeFileSync(ssPath, JSON.stringify(output, null, 2), 'utf8');

  console.log(`\n=== Results ===`);
  console.log(`Gap wallets profiled: ${profiled} (${errors} errors)`);
  console.log(`Total wallets in sports_sharps.json: ${Object.keys(output).filter(k => k !== '_meta').length}`);
  console.log(`Wrote ${ssPath}`);
}

run().catch(e => { console.error(e); process.exit(1); });
