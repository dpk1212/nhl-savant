/**
 * Seed Sports Sharps — builds a curated list of the top 250 most
 * profitable sports bettors on Polymarket, ranked purely by sport PnL.
 *
 * Separate from buildWhaleProfiles.js so the existing pipeline is untouched.
 * scanSharpPositions.js prefers this file when it exists and is ready.
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
const MAX_SHARPS = 250;
const MIN_SPORT_PNL = 5000;
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

async function fetchLeaderboard() {
  console.log(`Fetching sports leaderboard (top ${LB_DEPTH})...`);
  const all = [];
  for (let offset = 0; offset < LB_DEPTH; offset += 50) {
    const url = `${DATA_API}/v1/leaderboard?timePeriod=ALL&category=SPORTS&orderBy=PNL&limit=50&offset=${offset}`;
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
  console.log(`  Total leaderboard entries: ${all.length}`);
  return all.map(t => ({
    wallet: (t.proxyWallet || '').toLowerCase(),
    name: t.userName || null,
    pnl: t.pnl || 0,
    vol: t.vol || 0,
  })).filter(w => w.wallet.length > 0);
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
    return { totalPnl: 0, sportPnl: {}, sportPnlTotal: 0, marketsTraded: traded?.traded || 0, sportMarkets: {} };
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

  const roundedSportPnl = Object.fromEntries(
    Object.entries(sportPnl).map(([k, v]) => [k, Math.round(v)])
  );
  const sportPnlTotal = Object.values(roundedSportPnl).reduce((s, v) => s + v, 0);

  return {
    totalPnl: Math.round(totalPnl),
    sportPnl: roundedSportPnl,
    sportPnlTotal,
    marketsTraded: traded?.traded || positions.length,
    sportMarkets,
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

  const leaderboard = await fetchLeaderboard();
  console.log(`\nProfiling ${leaderboard.length} leaderboard wallets...\n`);

  const allWallets = { ...prevWallets };
  let profiled = 0;
  let skipped = 0;
  let errors = 0;

  for (const lb of leaderboard) {
    const prev = allWallets[lb.wallet];
    const isFresh = prev?.builtAt && prev.builtAt > refreshCutoff;

    if (isFresh) {
      skipped++;
      continue;
    }

    profiled++;
    const displayName = lb.name || lb.wallet.slice(0, 10) + '...';
    process.stdout.write(`  [${profiled}] ${displayName}: `);

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
        lastSeen: now,
        builtAt: now,
        source: 'leaderboard',
        vol: lb.vol || 0,
      };

      const sportLabel = profile.sportPnlTotal >= MIN_SPORT_PNL ? 'QUALIFIES' : 'below floor';
      console.log(`$${pnl.toLocaleString()} total, $${profile.sportPnlTotal.toLocaleString()} sport PnL → ${sportLabel}`);
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
          source: 'leaderboard',
          vol: lb.vol || 0,
        };
      }
    }
  }

  const qualified = Object.entries(allWallets)
    .filter(([, p]) => (p.sportPnlTotal || 0) >= MIN_SPORT_PNL)
    .sort((a, b) => (b[1].sportPnlTotal || 0) - (a[1].sportPnlTotal || 0))
    .slice(0, MAX_SHARPS);

  const output = { _meta: {} };
  for (const [addr, profile] of qualified) {
    output[addr] = profile;
  }

  const minPnl = qualified.length > 0
    ? qualified[qualified.length - 1][1].sportPnlTotal
    : 0;

  output._meta = {
    ready: qualified.length > 0,
    seededAt: now,
    walletCount: qualified.length,
    minSportPnl: minPnl,
    leaderboardDepth: leaderboard.length,
    profiledThisRun: profiled,
    skippedFresh: skipped,
    errors,
  };

  writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');

  console.log(`\n=== Results ===`);
  console.log(`Leaderboard depth: ${leaderboard.length}`);
  console.log(`Profiled this run: ${profiled} (${skipped} skipped as fresh, ${errors} errors)`);
  console.log(`Qualified sharps: ${qualified.length} (sport PnL >= $${MIN_SPORT_PNL.toLocaleString()})`);
  if (qualified.length > 0) {
    console.log(`Sport PnL range: $${qualified[0][1].sportPnlTotal.toLocaleString()} → $${minPnl.toLocaleString()}`);
  }
  console.log(`Ready: ${output._meta.ready}`);
  console.log(`Wrote ${outPath}`);
}

run().catch(e => { console.error(e); process.exit(1); });
