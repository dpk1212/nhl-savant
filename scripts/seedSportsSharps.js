/**
 * Seed Sports Sharps — builds a curated list of the top sports bettors
 * on Polymarket by pulling both ALL-TIME and MONTHLY sports leaderboards.
 *
 * Qualification: lifetime sport PnL >= $5K OR monthly sport PnL >= $20K.
 * Monthly-hot wallets are always re-profiled (bypass stale check) so
 * currently-winning bettors are captured even if their all-time is negative.
 *
 * scanSharpPositions.js uses this file to build the sharp wallet universe.
 *
 * Usage: node scripts/seedSportsSharps.js
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { isSoccerMarketTitle } from './lib/soccerTeams.js';
import { isUFCMarketTitle } from './lib/ufcFighters.js';
import { isWNBAMarketTitle } from './lib/wnbaTeams.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_API = 'https://data-api.polymarket.com';

const httpFetch = typeof globalThis.fetch === 'function'
  ? globalThis.fetch
  : (await import('node-fetch')).default;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const LB_DEPTH = 1500;
const MAX_SHARPS = 500;
const MIN_SPORT_PNL = 5000;
const MIN_MONTHLY_PNL = 20000;
const REFRESH_HOURS = 48;
const DELAY_MS = 800;
const PAGE_DELAY_MS = 350;
const MAX_CLOSED_POSITIONS = 2000;
const RETRY_LIMIT = 3;

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
  // UFC before SOC: requires explicit "ufc" mention (never bare "fight").
  if (isUFCMarketTitle(title)) return 'UFC';
  // SOC last: precise shape-based matcher (no substring misfires on
  // US team names like "New Mexico"). See lib/soccerTeams.js.
  if (isSoccerMarketTitle(title)) return 'SOC';
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

async function fetchLeaderboard(timePeriod = 'ALL', depth = LB_DEPTH, category = 'SPORTS') {
  console.log(`Fetching ${category} leaderboard (${timePeriod}, top ${depth})...`);
  const all = [];
  for (let offset = 0; offset < depth; offset += 50) {
    const url = `${DATA_API}/v1/leaderboard?timePeriod=${timePeriod}&category=${category}&orderBy=PNL&limit=50&offset=${offset}`;
    const data = await fetchWithRetry(url);
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log(`  Leaderboard exhausted at offset ${offset} (${all.length} entries)`);
      break;
    }
    all.push(...data);
    if (offset % 200 === 0 && offset > 0) {
      console.log(`  ...fetched ${all.length} entries so far`);
    }
    await sleep(500);
  }
  console.log(`  Total ${timePeriod} entries: ${all.length}`);
  return all.map(t => ({
    wallet: (t.proxyWallet || '').toLowerCase(),
    name: t.userName || null,
    pnl: t.pnl || 0,
    vol: t.vol || 0,
    rank: parseInt(t.rank, 10) || null,
  })).filter(w => w.wallet.length > 0);
}

async function buildProfile(wallet) {
  let currentPositions = [];
  for (let offset = 0; offset < 10000; offset += 500) {
    const page = await fetchWithRetry(
      `${DATA_API}/positions?user=${wallet}&sortBy=CASHPNL&limit=500&offset=${offset}`
    );
    await sleep(PAGE_DELAY_MS);
    if (!page || !Array.isArray(page) || page.length === 0) break;
    currentPositions.push(...page);
    if (page.length < 500) break;
  }

  let closedPositions = [];
  for (let offset = 0; offset < MAX_CLOSED_POSITIONS; offset += 50) {
    const page = await fetchWithRetry(
      `${DATA_API}/closed-positions?user=${wallet}&limit=50&offset=${offset}`
    );
    await sleep(PAGE_DELAY_MS);
    if (!page || !Array.isArray(page) || page.length === 0) break;
    closedPositions.push(...page);
    if (page.length < 50) break;
  }
  const closedCapped = closedPositions.length >= MAX_CLOSED_POSITIONS;

  const traded = await fetchWithRetry(
    `${DATA_API}/traded?user=${wallet}`
  );
  await sleep(PAGE_DELAY_MS);

  const sportMarkets = {};
  const perSport = {};
  let sportInvested = 0;
  let sportPositionCount = 0;
  const recentSportBets = [];

  for (const p of closedPositions) {
    const sport = classifySport(p.title || '');
    if (!sport) continue;

    sportMarkets[sport] = (sportMarkets[sport] || 0) + 1;
    sportPositionCount++;
    const bought = parseFloat(p.totalBought || '0');
    const price = parseFloat(p.avgPrice || '0');
    const invested = (bought > 0 && price > 0) ? bought * price : 0;
    if (invested > 0) sportInvested += invested;
    const realizedPnl = parseFloat(p.realizedPnl || '0');

    if (!perSport[sport]) perSport[sport] = { bets: 0, invested: 0, pnl: 0 };
    perSport[sport].bets++;
    perSport[sport].invested += invested;
    perSport[sport].pnl += realizedPnl;

    const curPrice = parseFloat(p.curPrice || '0.5');
    const isSettled = curPrice >= 0.95 || curPrice <= 0.05;
    if (isSettled) {
      recentSportBets.push({
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

  for (const p of currentPositions) {
    const sport = classifySport(p.title || '');
    if (sport) {
      sportMarkets[sport] = (sportMarkets[sport] || 0) + 1;
      sportPositionCount++;
      const size = parseFloat(p.size || '0');
      const price = parseFloat(p.avgPrice || '0');
      if (size > 0 && price > 0) sportInvested += size * price;
    }
  }

  for (const sp of Object.keys(perSport)) {
    const s = perSport[sp];
    s.invested = Math.round(s.invested);
    s.pnl = Math.round(s.pnl);
    s.avgBet = s.bets > 0 ? Math.round(s.invested / s.bets) : 0;
    s.roi = s.invested > 0 ? +((s.pnl / s.invested) * 100).toFixed(1) : 0;
  }

  recentSportBets.sort((a, b) => b.timestamp - a.timestamp);
  const recentResults = recentSportBets.slice(0, 20);

  return {
    sportMarkets,
    marketsTraded: traded?.traded || (currentPositions.length + closedPositions.length),
    sportPositionCount,
    sportInvested: Math.round(sportInvested),
    perSport,
    recentResults,
    closedCapped,
    closedCount: closedPositions.length,
    openCount: currentPositions.length,
  };
}

async function run() {
  console.log('=== Seed Sports Sharps ===\n');

  const outPath = join(ROOT, 'public', 'sports_sharps.json');
  const existing = existsSync(outPath)
    ? JSON.parse(readFileSync(outPath, 'utf-8'))
    : {};

  const { _meta: prevMeta, ...prevWallets } = existing;
  const now = Date.now();
  const refreshCutoff = now - REFRESH_HOURS * 60 * 60 * 1000;

  // Fetch all 5 leaderboards in parallel
  console.log('Fetching all leaderboards in parallel...\n');
  const [allTimeLB, monthlyLB, overallLB, weeklyLB, dailyLB] = await Promise.all([
    fetchLeaderboard('ALL', LB_DEPTH),
    fetchLeaderboard('MONTH', 1000),
    fetchLeaderboard('ALL', LB_DEPTH, 'OVERALL'),
    fetchLeaderboard('WEEK', LB_DEPTH),
    fetchLeaderboard('DAY', LB_DEPTH),
  ]);

  const monthlyHot = monthlyLB.filter(w => w.pnl >= MIN_MONTHLY_PNL);
  console.log(`\nMonthly hot bettors ($${(MIN_MONTHLY_PNL / 1000).toFixed(0)}K+): ${monthlyHot.length}`);

  const overallLookup = Object.fromEntries(overallLB.map(w => [w.wallet, { pnl: w.pnl, vol: w.vol }]));
  console.log(`Overall leaderboard: ${overallLB.length} entries loaded for cross-reference`);

  const weeklyLookup = Object.fromEntries(weeklyLB.map(w => [w.wallet, { pnl: w.pnl, vol: w.vol, rank: w.rank }]));
  console.log(`Weekly leaderboard: ${weeklyLB.length} entries loaded`);

  const dailyLookup = Object.fromEntries(dailyLB.map(w => [w.wallet, { pnl: w.pnl, vol: w.vol, rank: w.rank }]));
  console.log(`Daily leaderboard: ${dailyLB.length} entries loaded`);

  // Merge: all-time first, then monthly-only wallets that aren't already in the list
  const seen = new Set(allTimeLB.map(w => w.wallet));
  const monthlyOnly = monthlyHot.filter(w => !seen.has(w.wallet));
  console.log(`Monthly-only wallets (not on all-time LB): ${monthlyOnly.length}`);

  const combined = [...allTimeLB, ...monthlyOnly];
  console.log(`\nProfiling ${combined.length} total wallets...\n`);

  const depthAllSports = allTimeLB.length;
  const depthMonthSports = monthlyLB.length;
  const percentileTop = (rank, depth) => {
    if (rank == null || rank <= 0 || !depth) return null;
    return +((100 * (depth - rank + 1) / depth)).toFixed(2);
  };

  // Track which wallets qualified via monthly
  const monthlyQualified = new Set(monthlyHot.map(w => w.wallet));
  const monthlyPnlMap = Object.fromEntries(monthlyHot.map(w => [w.wallet, w.pnl]));

  const allWallets = { ...prevWallets };
  let profiled = 0;
  let skipped = 0;
  let errors = 0;

  for (const lb of combined) {
    const prev = allWallets[lb.wallet];
    // Monthly-hot wallets always get refreshed regardless of staleness
    const isMonthlyHot = monthlyQualified.has(lb.wallet);
    const isFresh = prev?.builtAt && prev.builtAt > refreshCutoff;

    if (isFresh && !isMonthlyHot) {
      if (prev && lb.rank != null) {
        prev.leaderboardRank = lb.rank;
        prev.leaderboardScope = seen.has(lb.wallet) ? 'ALL' : 'MONTH';
      }
      const weekly = weeklyLookup[lb.wallet];
      const daily = dailyLookup[lb.wallet];
      if (prev && weekly) {
        prev.weeklyPnl = Math.round(weekly.pnl);
        prev.weeklyRank = weekly.rank || null;
      }
      if (prev && daily) {
        prev.dailyPnl = Math.round(daily.pnl);
        prev.dailyRank = daily.rank || null;
      }
      skipped++;
      continue;
    }

    profiled++;
    const displayName = lb.name || lb.wallet.slice(0, 10) + '...';
    const monthlyTag = isMonthlyHot ? ` [MONTHLY +$${(monthlyPnlMap[lb.wallet] / 1000).toFixed(0)}K]` : '';
    process.stdout.write(`  [${profiled}] ${displayName}${monthlyTag}: `);

    try {
      const profile = await buildProfile(lb.wallet);
      const pnl = Math.round(lb.pnl || 0);
      const lbVol = lb.vol || 0;
      const lbSportROI = lbVol > 0 ? +((lb.pnl / lbVol) * 100).toFixed(1) : 0;
      const sportMarketCount = Object.values(profile.sportMarkets || {}).reduce((s, v) => s + v, 0);
      const posAvgBet = profile.sportPositionCount > 0
        ? Math.round(profile.sportInvested / profile.sportPositionCount)
        : (sportMarketCount > 0 ? Math.round(lbVol / sportMarketCount) : 0);
      const overall = overallLookup[lb.wallet];

      const weekly = weeklyLookup[lb.wallet];
      const daily = dailyLookup[lb.wallet];
      const onAllTimeLb = seen.has(lb.wallet);
      const lbDepth = onAllTimeLb ? depthAllSports : depthMonthSports;
      const sportsLbPercentileTop = percentileTop(lb.rank, lbDepth);

      allWallets[lb.wallet] = {
        name: lb.name || prev?.name || 'Anonymous',
        totalPnl: pnl,
        sportPnlTotal: pnl,
        overallPnl: overall ? Math.round(overall.pnl) : null,
        overallVol: overall ? Math.round(overall.vol) : null,
        sportMarkets: profile.sportMarkets,
        marketsTraded: profile.marketsTraded,
        sportBets: sportMarketCount,
        sportBetCount: profile.sportPositionCount || sportMarketCount,
        sportROI: lbSportROI,
        avgSportBet: posAvgBet,
        leaderboardRank: lb.rank,
        leaderboardScope: onAllTimeLb ? 'ALL' : 'MONTH',
        leaderboardDepth: lbDepth,
        sportsLbPercentileTop,
        perSport: profile.perSport,
        recentResults: profile.recentResults,
        weeklyPnl: weekly ? Math.round(weekly.pnl) : null,
        weeklyVol: weekly ? Math.round(weekly.vol) : null,
        weeklyROI: weekly && weekly.vol > 0 ? +((weekly.pnl / weekly.vol) * 100).toFixed(1) : null,
        weeklyRank: weekly?.rank || null,
        dailyPnl: daily ? Math.round(daily.pnl) : null,
        dailyVol: daily ? Math.round(daily.vol) : null,
        dailyROI: daily && daily.vol > 0 ? +((daily.pnl / daily.vol) * 100).toFixed(1) : null,
        dailyRank: daily?.rank || null,
        lastSeen: now,
        builtAt: now,
        source: isMonthlyHot && !seen.has(lb.wallet) ? 'monthly_leaderboard' : 'leaderboard',
        vol: lbVol,
        ...(isMonthlyHot && { monthlyPnl: monthlyPnlMap[lb.wallet], monthlyQualified: true }),
      };

      const qualifiesLifetime = lb.pnl >= MIN_SPORT_PNL;
      const qualifiesMonthly = isMonthlyHot && sportMarketCount > 0;
      const label = qualifiesLifetime ? 'QUALIFIES (lifetime)' :
        qualifiesMonthly ? `QUALIFIES (monthly hot, ${sportMarketCount} markets)` :
        isMonthlyHot ? 'SKIP (monthly hot but no tracked sports)' : 'below floor';
      const statsLabel = sportMarketCount > 0 ? ` | ${sportMarketCount} mkts, ${lbSportROI}% ROI, $${posAvgBet.toLocaleString()} avg` : '';
      const cappedTag = profile.closedCapped ? ` [closed capped @ ${profile.closedCount}]` : '';
      console.log(`$${pnl.toLocaleString()} sport PnL → ${label}${statsLabel}${cappedTag}`);
    } catch (e) {
      errors++;
      console.log(`error — ${e.message}`);
      const overallFallback = overallLookup[lb.wallet];
      if (!allWallets[lb.wallet]) {
        allWallets[lb.wallet] = {
          name: lb.name || 'Anonymous',
          totalPnl: Math.round(lb.pnl || 0),
          sportPnlTotal: Math.round(lb.pnl || 0),
          overallPnl: overallFallback ? Math.round(overallFallback.pnl) : null,
          overallVol: overallFallback ? Math.round(overallFallback.vol) : null,
          sportMarkets: {},
          marketsTraded: 0,
          sportBetCount: 0,
          lastSeen: now,
          builtAt: now,
          source: isMonthlyHot ? 'monthly_leaderboard' : 'leaderboard',
          vol: lb.vol || 0,
          ...(isMonthlyHot && { monthlyPnl: monthlyPnlMap[lb.wallet], monthlyQualified: true }),
        };
      }
    }
  }

  // Qualify: lifetime sport PnL >= $5K OR (monthly hot AND has positions in our tracked sports)
  const hasSportActivity = (p) => Object.values(p.sportMarkets || {}).reduce((s, v) => s + v, 0) > 0;
  const qualified = Object.entries(allWallets)
    .filter(([addr, p]) =>
      (p.sportPnlTotal || 0) >= MIN_SPORT_PNL ||
      (p.monthlyQualified === true && hasSportActivity(p))
    )
    .sort((a, b) => (b[1].sportPnlTotal || 0) - (a[1].sportPnlTotal || 0))
    .slice(0, MAX_SHARPS);

  const output = { _meta: {} };
  for (const [addr, profile] of qualified) {
    output[addr] = profile;
  }

  const lifetimeCount = qualified.filter(([, p]) => (p.sportPnlTotal || 0) >= MIN_SPORT_PNL).length;
  const monthlyOnlyCount = qualified.filter(([, p]) => (p.sportPnlTotal || 0) < MIN_SPORT_PNL && p.monthlyQualified).length;
  const minPnl = qualified.length > 0
    ? qualified[qualified.length - 1][1].sportPnlTotal
    : 0;

  output._meta = {
    ready: qualified.length > 0,
    seededAt: now,
    walletCount: qualified.length,
    lifetimeQualified: lifetimeCount,
    monthlyHotQualified: monthlyOnlyCount,
    minSportPnl: minPnl,
    minMonthlyPnl: MIN_MONTHLY_PNL,
    leaderboardDepth: allTimeLB.length,
    leaderboardDepthSportsAll: depthAllSports,
    leaderboardDepthSportsMonth: depthMonthSports,
    monthlyLeaderboardDepth: monthlyLB.length,
    profiledThisRun: profiled,
    skippedFresh: skipped,
    errors,
  };

  writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');

  console.log(`\n=== Results ===`);
  console.log(`All-time LB: ${allTimeLB.length} | Monthly LB: ${monthlyLB.length} (${monthlyHot.length} with $${(MIN_MONTHLY_PNL / 1000).toFixed(0)}K+)`);
  console.log(`Profiled this run: ${profiled} (${skipped} skipped as fresh, ${errors} errors)`);
  console.log(`Qualified sharps: ${qualified.length} total`);
  console.log(`  Lifetime ($${MIN_SPORT_PNL.toLocaleString()}+ sport PnL): ${lifetimeCount}`);
  console.log(`  Monthly-only ($${MIN_MONTHLY_PNL.toLocaleString()}+ this month): ${monthlyOnlyCount}`);
  if (qualified.length > 0) {
    console.log(`Sport PnL range: $${qualified[0][1].sportPnlTotal.toLocaleString()} → $${minPnl.toLocaleString()}`);
  }
  console.log(`Ready: ${output._meta.ready}`);
  console.log(`Wrote ${outPath}`);
}

run().catch(e => { console.error(e); process.exit(1); });
