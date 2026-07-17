/**
 * Immediate honesty scrub for sports_sharps.json:
 * 1) Strip untrustworthy perSport.pnl / perSport.roi from ALL wallets
 * 2) Clear biased recentResults
 * 3) Re-profile TOP_N vault wallets with TIMESTAMP-sorted closed-positions
 *    so Sport Activity counts + Recent Settled are representative now
 *
 * Usage: node scripts/scrubSportsSharpsHonesty.js
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
const OUT = join(ROOT, 'public', 'sports_sharps.json');
const TOP_N = 25;
const MAX_CLOSED = 2000;
const PAGE_DELAY_MS = 350;
const MIN_RECENT = 5;
const MAX_RECENT = 20;

const httpFetch = globalThis.fetch;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
  if (isWNBAMarketTitle(title)) return 'WNBA';
  for (const [sport, keywords] of Object.entries(SPORT_KEYWORDS)) {
    for (const kw of keywords) {
      if (t.includes(kw)) return sport;
    }
  }
  if (isUFCMarketTitle(title)) return 'UFC';
  if (isSoccerMarketTitle(title)) return 'SOC';
  return null;
}

function parseCurPrice(raw) {
  if (raw === null || raw === undefined || raw === '') return null;
  const n = typeof raw === 'number' ? raw : parseFloat(raw);
  return Number.isFinite(n) ? n : null;
}

async function fetchJson(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await httpFetch(url, { headers: { Accept: 'application/json' } });
      if (res.status === 429) {
        await sleep(Math.pow(2, i + 1) * 1000);
        continue;
      }
      if (!res.ok) throw new Error(`${res.status}`);
      return await res.json();
    } catch (e) {
      if (i === 2) return null;
      await sleep(1000 * (i + 1));
    }
  }
  return null;
}

async function rebuildActivity(wallet) {
  const closed = [];
  for (let offset = 0; offset < MAX_CLOSED; offset += 50) {
    const page = await fetchJson(
      `${DATA_API}/closed-positions?user=${wallet}&limit=50&offset=${offset}&sortBy=TIMESTAMP&sortDirection=DESC`
    );
    await sleep(PAGE_DELAY_MS);
    if (!page?.length) break;
    closed.push(...page);
    if (page.length < 50) break;
  }

  const sportMarkets = {};
  const perSport = {};
  const recentResults = [];
  let sportInvested = 0;
  let sportPositionCount = 0;

  for (const p of closed) {
    const sport = classifySport(p.title || '');
    if (!sport) continue;
    sportMarkets[sport] = (sportMarkets[sport] || 0) + 1;
    sportPositionCount++;
    const bought = parseFloat(p.totalBought || '0');
    const price = parseFloat(p.avgPrice || '0');
    const invested = bought > 0 && price > 0 ? bought * price : 0;
    if (invested > 0) sportInvested += invested;
    if (!perSport[sport]) perSport[sport] = { bets: 0, invested: 0 };
    perSport[sport].bets++;
    perSport[sport].invested += invested;

    const cur = parseCurPrice(p.curPrice);
    if (cur != null && (cur >= 0.95 || cur <= 0.05) && recentResults.length < MAX_RECENT) {
      recentResults.push({
        title: p.title || '',
        sport,
        outcome: p.outcome || '',
        won: cur >= 0.95,
        entryPrice: Math.round(price * 100) / 100,
        size: Math.round(bought),
        invested: Math.round(invested),
        realizedPnl: Math.round(parseFloat(p.realizedPnl || '0')),
        timestamp: p.timestamp || 0,
      });
    }
  }

  for (const s of Object.values(perSport)) {
    s.invested = Math.round(s.invested);
    s.avgBet = s.bets > 0 ? Math.round(s.invested / s.bets) : 0;
  }

  return {
    sportMarkets,
    perSport,
    recentResults: recentResults.length >= MIN_RECENT ? recentResults : [],
    sportBetCount: sportPositionCount,
    sportBets: Object.values(sportMarkets).reduce((a, b) => a + b, 0),
    avgSportBet: sportPositionCount > 0 ? Math.round(sportInvested / sportPositionCount) : 0,
  };
}

function stripWallet(w) {
  if (w.perSport && typeof w.perSport === 'object') {
    for (const sp of Object.keys(w.perSport)) {
      const s = w.perSport[sp] || {};
      w.perSport[sp] = {
        bets: s.bets || 0,
        invested: Math.round(s.invested || 0),
        ...(s.bets > 0 ? { avgBet: Math.round(s.avgBet ?? ((s.invested || 0) / s.bets)) } : {}),
      };
    }
  }
  w.recentResults = [];
}

async function run() {
  if (!existsSync(OUT)) {
    console.error('Missing', OUT);
    process.exit(1);
  }
  const data = JSON.parse(readFileSync(OUT, 'utf-8'));
  const { _meta, ...wallets } = data;
  const addrs = Object.keys(wallets);
  console.log(`Scrubbing ${addrs.length} wallets…`);

  let strippedPnl = 0;
  for (const addr of addrs) {
    const before = JSON.stringify(wallets[addr].perSport || {});
    stripWallet(wallets[addr]);
    if (before.includes('"pnl"') || before.includes('"roi"')) strippedPnl++;
  }
  console.log(`Stripped perSport pnl/roi from ${strippedPnl} wallets; cleared recentResults`);

  const top = Object.entries(wallets)
    .sort(([, a], [, b]) => (b.sportPnlTotal || 0) - (a.sportPnlTotal || 0))
    .slice(0, TOP_N);

  console.log(`\nRe-profiling top ${TOP_N} by TIMESTAMP closed-positions…\n`);
  for (let i = 0; i < top.length; i++) {
    const [addr, w] = top[i];
    const label = w.name || addr.slice(-6);
    process.stdout.write(`  [${i + 1}/${TOP_N}] ${label}: `);
    try {
      const rebuilt = await rebuildActivity(addr);
      w.sportMarkets = rebuilt.sportMarkets;
      w.perSport = rebuilt.perSport;
      w.recentResults = rebuilt.recentResults;
      w.sportBetCount = rebuilt.sportBetCount;
      w.sportBets = rebuilt.sportBets;
      if (rebuilt.avgSportBet > 0) w.avgSportBet = rebuilt.avgSportBet;
      w.profileHonestyAt = Date.now();
      const wins = rebuilt.recentResults.filter((r) => r.won).length;
      const losses = rebuilt.recentResults.length - wins;
      console.log(
        `${Object.keys(rebuilt.perSport).length} sports, ` +
        `${rebuilt.recentResults.length ? `${wins}W-${losses}L` : 'no recent'}, ` +
        `${rebuilt.sportBetCount} closed sport legs`
      );
    } catch (e) {
      console.log(`error — ${e.message}`);
    }
  }

  const out = {
    _meta: {
      ...(_meta || {}),
      honestyScrubAt: new Date().toISOString(),
      honestyNote:
        'perSport is activity-only (no pnl/roi). recentResults are TIMESTAMP-sorted settled legs. Money stats from SPORTS LB only.',
    },
    ...wallets,
  };
  writeFileSync(OUT, JSON.stringify(out));
  console.log(`\nWrote ${OUT}`);

  // Quick catalog sanity
  let perfect = 0;
  let withPnl = 0;
  for (const w of Object.values(wallets)) {
    const rr = w.recentResults || [];
    if (rr.length >= 15 && rr.every((r) => r.won)) perfect++;
    if (Object.values(w.perSport || {}).some((s) => s && ('pnl' in s || 'roi' in s))) withPnl++;
  }
  console.log(`Sanity: wallets with perSport.pnl/roi left: ${withPnl}`);
  console.log(`Sanity: near-perfect ≥15W-0L recentResults: ${perfect}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
