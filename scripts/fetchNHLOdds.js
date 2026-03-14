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

    // Track best odds (highest value = best payout for bettor) and Pinnacle (sharpest line)
    let bestAwayML = null, bestHomeML = null;
    let bestAwayBook = null, bestHomeBook = null;
    let pinnAwayML = null, pinnHomeML = null;
    let totalLine = null, bestOverOdds = null, bestUnderOdds = null;
    const allAwayOdds = [];
    const allHomeOdds = [];

    for (const bk of event.bookmakers) {
      for (const market of bk.markets) {
        if (market.key === 'h2h') {
          const aw = market.outcomes.find(o => o.name === event.away_team);
          const hm = market.outcomes.find(o => o.name === event.home_team);
          if (aw) {
            allAwayOdds.push({ book: bk.title, price: aw.price });
            // Best = highest numeric value (best payout for bettor)
            if (bestAwayML === null || aw.price > bestAwayML) {
              bestAwayML = aw.price;
              bestAwayBook = bk.title;
            }
            if (bk.key === 'pinnacle') pinnAwayML = aw.price;
          }
          if (hm) {
            allHomeOdds.push({ book: bk.title, price: hm.price });
            if (bestHomeML === null || hm.price > bestHomeML) {
              bestHomeML = hm.price;
              bestHomeBook = bk.title;
            }
            if (bk.key === 'pinnacle') pinnHomeML = hm.price;
          }
        }
        if (market.key === 'totals') {
          const over = market.outcomes.find(o => o.name === 'Over');
          const under = market.outcomes.find(o => o.name === 'Under');
          if (over) {
            if (totalLine === null) totalLine = over.point;
            if (bestOverOdds === null || over.price > bestOverOdds) bestOverOdds = over.price;
          }
          if (under) {
            if (bestUnderOdds === null || under.price > bestUnderOdds) bestUnderOdds = under.price;
          }
        }
      }
    }

    // Consensus = Pinnacle if available, else median of all books
    const consensusAway = pinnAwayML ?? (allAwayOdds.length > 0
      ? allAwayOdds.sort((a, b) => a.price - b.price)[Math.floor(allAwayOdds.length / 2)].price
      : bestAwayML);
    const consensusHome = pinnHomeML ?? (allHomeOdds.length > 0
      ? allHomeOdds.sort((a, b) => a.price - b.price)[Math.floor(allHomeOdds.length / 2)].price
      : bestHomeML);

    const game = {
      awayTeam: away,
      homeTeam: home,
      gameTime,
      commenceTime: event.commence_time,
      moneyline: { away: bestAwayML, home: bestHomeML },
      consensus: { away: consensusAway, home: consensusHome },
      bestBooks: { away: bestAwayBook, home: bestHomeBook },
      total: {
        line: totalLine,
        over: bestOverOdds,
        under: bestUnderOdds,
      },
    };

    games.push(game);

    const fmtOdds = (v) => v > 0 ? `+${v}` : `${v}`;
    if (bestAwayML !== null) {
      const awayDiff = bestAwayML !== consensusAway ? ` (cons ${fmtOdds(consensusAway)})` : '';
      const homeDiff = bestHomeML !== consensusHome ? ` (cons ${fmtOdds(consensusHome)})` : '';
      console.log(`   ${away} @ ${home}  ${gameTime}  ${away} ${fmtOdds(bestAwayML)}${awayDiff} [${bestAwayBook}] / ${home} ${fmtOdds(bestHomeML)}${homeDiff} [${bestHomeBook}]  O/U ${totalLine || '-'}`);
    } else {
      console.log(`   ${away} @ ${home}  ${gameTime}  NO ODDS`);
    }
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
