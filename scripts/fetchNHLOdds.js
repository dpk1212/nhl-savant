/**
 * fetchNHLOdds.js — Fetch NHL moneyline + totals from The Odds API
 *
 * Replaces the broken Firecrawl/OddsTrader scrape with a reliable API.
 * Writes public/nhl_odds.json consumed by the front-end EdgeCalculator.
 *
 * Usage: node scripts/fetchNHLOdds.js
 */
import * as dotenv from 'dotenv';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const API_KEY = process.env.ODDS_API_KEY;
if (!API_KEY) {
  console.error('❌ Missing ODDS_API_KEY in .env');
  process.exit(1);
}

const SPORT = 'icehockey_nhl';
const REGIONS = 'us';
const BOOKMAKERS = 'pinnacle,draftkings,fanduel,betmgm,caesars';

const ODDS_API_TO_CODE = {
  'Anaheim Ducks': 'ANA', 'Arizona Coyotes': 'ARI', 'Boston Bruins': 'BOS',
  'Buffalo Sabres': 'BUF', 'Calgary Flames': 'CGY', 'Carolina Hurricanes': 'CAR',
  'Chicago Blackhawks': 'CHI', 'Colorado Avalanche': 'COL', 'Columbus Blue Jackets': 'CBJ',
  'Dallas Stars': 'DAL', 'Detroit Red Wings': 'DET', 'Edmonton Oilers': 'EDM',
  'Florida Panthers': 'FLA', 'Los Angeles Kings': 'LAK', 'Minnesota Wild': 'MIN',
  'Montreal Canadiens': 'MTL', 'Montréal Canadiens': 'MTL', 'Nashville Predators': 'NSH', 'New Jersey Devils': 'NJD',
  'New York Islanders': 'NYI', 'New York Rangers': 'NYR', 'Ottawa Senators': 'OTT',
  'Philadelphia Flyers': 'PHI', 'Pittsburgh Penguins': 'PIT', 'San Jose Sharks': 'SJS',
  'Seattle Kraken': 'SEA', 'St. Louis Blues': 'STL', 'St Louis Blues': 'STL', 'Tampa Bay Lightning': 'TBL',
  'Toronto Maple Leafs': 'TOR', 'Utah Hockey Club': 'UTA', 'Utah Mammoth': 'UTA',
  'Vancouver Canucks': 'VAN', 'Vegas Golden Knights': 'VGK', 'Washington Capitals': 'WSH',
  'Winnipeg Jets': 'WPG',
};

function teamCode(name) {
  return ODDS_API_TO_CODE[name] || name;
}

function bestOdds(outcomes, teamName) {
  const matching = outcomes.filter(o => o.name === teamName);
  if (matching.length === 0) return null;
  return matching.reduce((best, o) => (o.price > best.price ? o : best), matching[0]).price;
}

function bestTotal(outcomes, side) {
  const matching = outcomes.filter(o => o.name === side);
  if (matching.length === 0) return null;
  return matching.reduce((best, o) => (o.price > best.price ? o : best), matching[0]);
}

async function main() {
  console.log('🏒 Fetching NHL odds from The Odds API...\n');

  const url = `https://api.the-odds-api.com/v4/sports/${SPORT}/odds/?apiKey=${API_KEY}&regions=${REGIONS}&markets=h2h,totals&oddsFormat=american&bookmakers=${BOOKMAKERS}`;

  const res = await fetch(url);
  if (!res.ok) {
    console.error(`❌ API error: ${res.status} ${res.statusText}`);
    const body = await res.text();
    console.error(body);
    process.exit(1);
  }

  const remaining = res.headers.get('x-requests-remaining');
  const used = res.headers.get('x-requests-used');
  console.log(`   Credits used: ${used} | remaining: ${remaining}`);

  const data = await res.json();
  console.log(`   Games returned: ${data.length}\n`);

  const now = new Date();
  const etNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const etDateStr = `${etNow.getFullYear()}-${String(etNow.getMonth() + 1).padStart(2, '0')}-${String(etNow.getDate()).padStart(2, '0')}`;

  const games = [];

  for (const event of data) {
    const away = teamCode(event.away_team);
    const home = teamCode(event.home_team);
    const commence = new Date(event.commence_time);
    const hours = commence.getHours();
    const minutes = commence.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const gameTime = `${displayHours}:${String(minutes).padStart(2, '0')} ${ampm}`;

    let awayML = null, homeML = null;
    let totalLine = null, overOdds = null, underOdds = null;

    for (const bk of event.bookmakers) {
      for (const market of bk.markets) {
        if (market.key === 'h2h') {
          const aw = market.outcomes.find(o => o.name === event.away_team);
          const hm = market.outcomes.find(o => o.name === event.home_team);
          if (aw && (awayML === null || Math.abs(aw.price) < Math.abs(awayML))) awayML = aw.price;
          if (hm && (homeML === null || Math.abs(hm.price) < Math.abs(homeML))) homeML = hm.price;
        }
        if (market.key === 'totals') {
          const over = market.outcomes.find(o => o.name === 'Over');
          const under = market.outcomes.find(o => o.name === 'Under');
          if (over && totalLine === null) {
            totalLine = over.point;
            overOdds = over.price;
          }
          if (under && underOdds === null) {
            underOdds = under.price;
          }
        }
      }
    }

    const game = {
      awayTeam: away,
      homeTeam: home,
      gameTime,
      commenceTime: event.commence_time,
      moneyline: { away: awayML, home: homeML },
      total: {
        line: totalLine,
        over: overOdds,
        under: underOdds,
      },
    };

    games.push(game);

    const mlStr = awayML !== null
      ? `${away} ${awayML > 0 ? '+' : ''}${awayML} / ${home} ${homeML > 0 ? '+' : ''}${homeML}`
      : 'NO ODDS';
    const totStr = totalLine !== null ? `O/U ${totalLine}` : '';
    console.log(`   ${away} @ ${home}  ${gameTime}  ${mlStr}  ${totStr}`);
  }

  const output = {
    lastUpdated: now.toISOString(),
    date: etDateStr,
    source: 'The Odds API',
    gamesCount: games.length,
    games,
  };

  const outPath = join(__dirname, '../public/nhl_odds.json');
  writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
  console.log(`\n✅ Wrote ${games.length} games to public/nhl_odds.json`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
