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
  for (const [sport, keywords] of Object.entries(SPORT_KEYWORDS)) {
    for (const kw of keywords) {
      if (t.includes(kw)) return sport;
    }
  }
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

async function fetchLeaderboard(timePeriod = 'ALL', depth = LB_DEPTH) {
  console.log(`Fetching sports leaderboard (${timePeriod}, top ${depth})...`);
  const all = [];
  for (let offset = 0; offset < depth; offset += 50) {
    const url = `${DATA_API}/v1/leaderboard?timePeriod=${timePeriod}&category=SPORTS&orderBy=PNL&limit=50&offset=${offset}`;
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
  })).filter(w => w.wallet.length > 0);
}

async function buildProfile(wallet) {
  // Paginate through all positions (API caps at 500 per page)
  let allPositions = [];
  for (let offset = 0; offset < 10000; offset += 500) {
    const page = await fetchWithRetry(
      `${DATA_API}/positions?user=${wallet}&sortBy=CASHPNL&limit=500&offset=${offset}`
    );
    await sleep(DELAY_MS);
    if (!page || !Array.isArray(page) || page.length === 0) break;
    allPositions.push(...page);
    if (page.length < 500) break;
  }

  const traded = await fetchWithRetry(
    `${DATA_API}/traded?user=${wallet}`
  );
  await sleep(DELAY_MS);

  if (allPositions.length === 0) {
    return { totalPnl: 0, sportPnl: {}, sportPnlTotal: 0, marketsTraded: traded?.traded || 0, sportMarkets: {},
      sportBets: 0, sportInvested: 0, sportROI: 0, avgSportBet: 0,
      sportRecord: { won: 0, lost: 0 }, sportWinRate: 0, perSport: {} };
  }

  let totalPnl = 0;
  const sportPnl = {};
  const sportMarkets = {};
  const perSport = {};
  let sportBets = 0, sportInvested = 0, sportTotalPnl = 0;
  let sportWon = 0, sportLost = 0;

  for (const p of allPositions) {
    const pnl = parseFloat(p.cashPnl || '0');
    const invested = parseFloat(p.initialValue || '0');
    totalPnl += pnl;

    const sport = classifySport(p.title || '');
    if (!sport) continue;

    const isResolved = p.curPrice === 0 || p.curPrice === 1;

    sportMarkets[sport] = (sportMarkets[sport] || 0) + 1;

    if (!isResolved) continue;

    sportPnl[sport] = (sportPnl[sport] || 0) + pnl;

    if (!perSport[sport]) perSport[sport] = { bets: 0, invested: 0, pnl: 0, won: 0, lost: 0 };
    perSport[sport].bets++;
    perSport[sport].invested += invested;
    perSport[sport].pnl += pnl;

    sportBets++;
    sportInvested += invested;
    sportTotalPnl += pnl;

    if (pnl > 0) { sportWon++; perSport[sport].won++; }
    if (pnl < 0) { sportLost++; perSport[sport].lost++; }
  }

  const roundedSportPnl = Object.fromEntries(
    Object.entries(sportPnl).map(([k, v]) => [k, Math.round(v)])
  );
  const sportPnlTotal = Object.values(roundedSportPnl).reduce((s, v) => s + v, 0);

  // Round per-sport stats
  for (const s of Object.values(perSport)) {
    s.invested = Math.round(s.invested);
    s.pnl = Math.round(s.pnl);
    s.roi = s.invested > 0 ? +((s.pnl / s.invested) * 100).toFixed(1) : 0;
    s.avgBet = s.bets > 0 ? Math.round(s.invested / s.bets) : 0;
  }

  const sportROI = sportInvested > 0 ? +((sportTotalPnl / sportInvested) * 100).toFixed(1) : 0;
  const avgSportBet = sportBets > 0 ? Math.round(sportInvested / sportBets) : 0;
  const sportWinRate = (sportWon + sportLost) > 0 ? +((sportWon / (sportWon + sportLost)) * 100).toFixed(1) : 0;

  return {
    totalPnl: Math.round(totalPnl),
    sportPnl: roundedSportPnl,
    sportPnlTotal,
    marketsTraded: traded?.traded || allPositions.length,
    sportMarkets,
    sportBets,
    sportInvested: Math.round(sportInvested),
    sportROI,
    avgSportBet,
    sportRecord: { won: sportWon, lost: sportLost },
    sportWinRate,
    perSport,
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

  // Fetch both all-time and monthly sports leaderboards
  const allTimeLB = await fetchLeaderboard('ALL', LB_DEPTH);
  const monthlyLB = await fetchLeaderboard('MONTH', 1000);

  // Monthly hot wallets: $20K+ monthly sports profit
  const monthlyHot = monthlyLB.filter(w => w.pnl >= MIN_MONTHLY_PNL);
  console.log(`\nMonthly hot bettors ($${(MIN_MONTHLY_PNL / 1000).toFixed(0)}K+): ${monthlyHot.length}`);

  // Merge: all-time first, then monthly-only wallets that aren't already in the list
  const seen = new Set(allTimeLB.map(w => w.wallet));
  const monthlyOnly = monthlyHot.filter(w => !seen.has(w.wallet));
  console.log(`Monthly-only wallets (not on all-time LB): ${monthlyOnly.length}`);

  const combined = [...allTimeLB, ...monthlyOnly];
  console.log(`\nProfiling ${combined.length} total wallets...\n`);

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
      skipped++;
      continue;
    }

    profiled++;
    const displayName = lb.name || lb.wallet.slice(0, 10) + '...';
    const monthlyTag = isMonthlyHot ? ` [MONTHLY +$${(monthlyPnlMap[lb.wallet] / 1000).toFixed(0)}K]` : '';
    process.stdout.write(`  [${profiled}] ${displayName}${monthlyTag}: `);

    try {
      const profile = await buildProfile(lb.wallet);
      const pnl = lb.pnl > profile.totalPnl ? lb.pnl : profile.totalPnl;

      allWallets[lb.wallet] = {
        name: lb.name || prev?.name || 'Anonymous',
        totalPnl: pnl,
        sportPnl: profile.sportPnl,
        sportPnlTotal: profile.sportPnlTotal,
        sportMarkets: profile.sportMarkets,
        marketsTraded: profile.marketsTraded,
        sportBets: profile.sportBets,
        sportInvested: profile.sportInvested,
        sportROI: profile.sportROI,
        avgSportBet: profile.avgSportBet,
        sportRecord: profile.sportRecord,
        sportWinRate: profile.sportWinRate,
        perSport: profile.perSport,
        lastSeen: now,
        builtAt: now,
        source: isMonthlyHot && !seen.has(lb.wallet) ? 'monthly_leaderboard' : 'leaderboard',
        vol: lb.vol || 0,
        ...(isMonthlyHot && { monthlyPnl: monthlyPnlMap[lb.wallet], monthlyQualified: true }),
      };

      const qualifiesLifetime = profile.sportPnlTotal >= MIN_SPORT_PNL;
      const sportMarketCount = Object.values(profile.sportMarkets || {}).reduce((s, v) => s + v, 0);
      const hasResolvedWin = (profile.sportRecord?.won || 0) > 0;
      const qualifiesMonthly = isMonthlyHot && sportMarketCount > 0 && hasResolvedWin;
      const label = qualifiesLifetime ? 'QUALIFIES (lifetime)' :
        qualifiesMonthly ? `QUALIFIES (monthly hot, ${sportMarketCount} markets, ${profile.sportRecord.won}W-${profile.sportRecord.lost}L)` :
        isMonthlyHot && sportMarketCount > 0 && !hasResolvedWin ? `SKIP (monthly hot, ${sportMarketCount} markets but 0 resolved wins)` :
        isMonthlyHot ? 'SKIP (monthly hot but no tracked sports)' : 'below floor';
      const statsLabel = profile.sportBets > 0 ? ` | ${profile.sportBets} bets, ${profile.sportROI}% ROI, $${profile.avgSportBet} avg` : '';
      console.log(`$${pnl.toLocaleString()} total, $${profile.sportPnlTotal.toLocaleString()} sport PnL → ${label}${statsLabel}`);
    } catch (e) {
      errors++;
      console.log(`error — ${e.message}`);
      if (!allWallets[lb.wallet]) {
        allWallets[lb.wallet] = {
          name: lb.name || 'Anonymous',
          totalPnl: lb.pnl || 0,
          sportPnl: {},
          sportPnlTotal: 0,
          sportMarkets: {},
          marketsTraded: 0,
          lastSeen: now,
          builtAt: now,
          source: isMonthlyHot ? 'monthly_leaderboard' : 'leaderboard',
          vol: lb.vol || 0,
          ...(isMonthlyHot && { monthlyPnl: monthlyPnlMap[lb.wallet], monthlyQualified: true }),
        };
      }
    }
  }

  // Qualify: lifetime sport PnL >= $5K OR (monthly hot AND has sport activity AND at least 1 resolved win)
  const hasSportActivity = (p) => Object.values(p.sportMarkets || {}).reduce((s, v) => s + v, 0) > 0;
  const hasResolvedWins = (p) => (p.sportRecord?.won || 0) > 0;
  const qualified = Object.entries(allWallets)
    .filter(([addr, p]) =>
      (p.sportPnlTotal || 0) >= MIN_SPORT_PNL ||
      (p.monthlyQualified === true && hasSportActivity(p) && hasResolvedWins(p))
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
