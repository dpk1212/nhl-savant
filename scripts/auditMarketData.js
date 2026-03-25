/**
 * Market Data Audit — prints a human-readable summary of polymarket_data.json
 * and kalshi_data.json so workflow logs serve as a raw source-of-truth for the UI.
 *
 * Usage: node scripts/auditMarketData.js
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function loadJSON(file) {
  try {
    return JSON.parse(readFileSync(join(ROOT, 'public', file), 'utf8'));
  } catch { return {}; }
}

function fmtDollar(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${Math.round(n)}`;
}

function pad(s, len, right = false) {
  const str = String(s).substring(0, len);
  return right ? str.padStart(len) : str.padEnd(len);
}

const SEP = '═'.repeat(110);
const THIN = '─'.repeat(110);

function auditSport(sport, polyGames, kalshiGames) {
  const allKeys = new Set([...Object.keys(polyGames), ...Object.keys(kalshiGames)]);
  if (allKeys.size === 0) {
    console.log(`  (no ${sport} games)\n`);
    return;
  }

  let totalPolyVol = 0, totalKalshiVol = 0;
  let totalSampled = 0, totalWhales = 0, totalWhaleCash = 0;
  let totalTrades = 0;
  const rows = [];

  for (const key of [...allKeys].sort()) {
    const p = polyGames[key] || {};
    const k = kalshiGames[key] || {};
    const kFlow = k.tradeFlow || {};

    const away = p.awayTeam || k.awayTeam || key.split('_')[0] || '?';
    const home = p.homeTeam || k.homeTeam || key.split('_').slice(1).join('_') || '?';

    const polyVol = p.volume24h || p.liveVolume || 0;
    const kalshiVol = k.volume24h || 0;
    totalPolyVol += polyVol;
    totalKalshiVol += kalshiVol;

    const polyTrades = p.tradeCount || 0;
    const polyCash = p.sampleCash || 0;
    const kTrades = kFlow.tradeCount || 0;
    const kCash = kFlow.sampleCash || 0;
    const trades = polyTrades + kTrades;
    const sampled = polyCash + kCash;
    totalTrades += trades;
    totalSampled += sampled;

    const awayTicket = trades > 0
      ? Number((((p.awayTicketPct || 0) / 100 * polyTrades + (kFlow.awayTicketPct || 0) / 100 * kTrades) / trades * 100).toFixed(1))
      : p.awayTicketPct || kFlow.awayTicketPct || 0;
    const homeTicket = trades > 0 ? Number((100 - awayTicket).toFixed(1)) : 0;

    const awayMoney = sampled > 0
      ? Number((((p.awayMoneyPct || 0) / 100 * polyCash + (kFlow.awayMoneyPct || 0) / 100 * kCash) / sampled * 100).toFixed(1))
      : p.awayMoneyPct || kFlow.awayMoneyPct || 0;
    const homeMoney = sampled > 0 ? Number((100 - awayMoney).toFixed(1)) : 0;

    const whaleCount = (p.whales?.count || 0) + (k.whales?.count || 0);
    const whaleCash = (p.whales?.totalCash || 0) + (k.whales?.totalCash || 0);
    totalWhales += whaleCount;
    totalWhaleCash += whaleCash;

    const ticketFav = awayTicket >= homeTicket ? 'away' : 'home';
    const moneyFav = awayMoney >= homeMoney ? 'away' : 'home';
    const isReverse = ticketFav !== moneyFav && Math.abs(awayTicket - awayMoney) >= 10;

    const awayProb = p.awayProb ?? k.awayProb ?? null;
    const homeProb = p.homeProb ?? k.homeProb ?? null;

    const priceOpen = p.priceHistory?.open ?? k.priceHistory?.open ?? null;
    const priceCurrent = p.priceHistory?.current ?? k.priceHistory?.current ?? null;
    const priceChange = p.priceHistory?.change ?? k.priceHistory?.change ?? null;

    rows.push({
      key, away, home, polyVol, kalshiVol, trades, sampled,
      awayTicket, homeTicket, awayMoney, homeMoney,
      whaleCount, whaleCash, isReverse,
      awayProb, homeProb, priceOpen, priceCurrent, priceChange,
      polyTrades, polyCash, kTrades, kCash,
      whaleTopTrades: [
        ...(p.whales?.topTrades || []),
        ...(k.whales?.topTrades || []),
      ].sort((a, b) => b.amount - a.amount).slice(0, 5),
    });
  }

  // Sort by total volume descending
  rows.sort((a, b) => (b.polyVol + b.kalshiVol) - (a.polyVol + a.kalshiVol));

  // Header
  console.log(SEP);
  console.log(`  ${sport} GAMES (${rows.length})    |  Poly Vol: ${fmtDollar(totalPolyVol)}  |  Kalshi Vol: ${fmtDollar(totalKalshiVol)}  |  Sampled: ${fmtDollar(totalSampled)}  |  Trades: ${totalTrades}  |  Whales: ${totalWhales} (${fmtDollar(totalWhaleCash)})`);
  console.log(SEP);

  for (const r of rows) {
    const label = `${r.away} @ ${r.home}`;
    const probStr = r.awayProb != null ? `${r.awayProb}% / ${r.homeProb}%` : 'n/a';
    const priceStr = r.priceOpen != null ? `${r.priceOpen}→${r.priceCurrent} (${r.priceChange > 0 ? '+' : ''}${r.priceChange})` : 'n/a';
    const reverseTag = r.isReverse ? ' ⚡ REVERSE' : '';

    console.log(`\n  ${pad(label, 50)} | Prob: ${pad(probStr, 14)} | Price: ${priceStr}`);
    console.log(`  ${THIN.substring(0, 100)}`);
    console.log(`  Vol: Poly ${pad(fmtDollar(r.polyVol), 8, true)}  Kalshi ${pad(fmtDollar(r.kalshiVol), 8, true)}  |  Trades: ${pad(r.trades, 5)}  Sampled: ${pad(fmtDollar(r.sampled), 8, true)}  (Poly: ${r.polyTrades}/${fmtDollar(r.polyCash)}, Kal: ${r.kTrades}/${fmtDollar(r.kCash)})`);

    const awayShort = r.away.split(' ').pop();
    const homeShort = r.home.split(' ').pop();
    console.log(`  Tickets: ${pad(awayShort, 15)} ${pad(r.awayTicket + '%', 6, true)}  |  ${pad(r.homeTicket + '%', 6)} ${homeShort}`);
    console.log(`  Money:   ${pad(awayShort, 15)} ${pad(r.awayMoney + '%', 6, true)}  |  ${pad(r.homeMoney + '%', 6)} ${homeShort}${reverseTag}`);

    if (r.whaleCount > 0) {
      console.log(`  Whales:  ${r.whaleCount} trades, ${fmtDollar(r.whaleCash)} total`);
      for (const w of r.whaleTopTrades) {
        const outcomeShort = (w.outcome || '?').split(' ').pop();
        const time = w.ts ? new Date(w.ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York' }) : '';
        console.log(`           ${w.side} ${pad(outcomeShort, 18)} ${pad(fmtDollar(w.amount), 8, true)} @ ${w.price}¢  ${time}`);
      }
    }
  }

  console.log(`\n${SEP}\n`);
}

const poly = loadJSON('polymarket_data.json');
const kalshi = loadJSON('kalshi_data.json');

console.log('\n');
console.log('╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════╗');
console.log('║                              MARKET DATA AUDIT — RAW SOURCE OF TRUTH                                      ║');
console.log(`║                              ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET${' '.repeat(40)}║`);
console.log('╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════╝\n');

auditSport('CBB', poly.CBB || {}, kalshi.CBB || {});
auditSport('NHL', poly.NHL || {}, kalshi.NHL || {});
auditSport('MLB', poly.MLB || {}, kalshi.MLB || {});

// Divergence summary
console.log('DIVERGENCE SUMMARY (Reverse Signals — money ≠ tickets, ≥10pt split)');
console.log(THIN);
const allGames = [
  ...Object.keys(poly.CBB || {}).map(k => ({ key: k, sport: 'CBB' })),
  ...Object.keys(poly.NHL || {}).map(k => ({ key: k, sport: 'NHL' })),
  ...Object.keys(poly.MLB || {}).map(k => ({ key: k, sport: 'MLB' })),
];
let reverseCount = 0;
for (const { key, sport } of allGames) {
  const p = (poly[sport] || {})[key] || {};
  const k = (kalshi[sport] || {})[key] || {};
  const kFlow = k.tradeFlow || {};
  const polyTrades = p.tradeCount || 0;
  const kTrades = kFlow.tradeCount || 0;
  const trades = polyTrades + kTrades;
  const polyCash = p.sampleCash || 0;
  const kCash = kFlow.sampleCash || 0;
  const sampled = polyCash + kCash;
  if (trades === 0) continue;

  const awayTicket = Number((((p.awayTicketPct || 0) / 100 * polyTrades + (kFlow.awayTicketPct || 0) / 100 * kTrades) / trades * 100).toFixed(1));
  const awayMoney = sampled > 0
    ? Number((((p.awayMoneyPct || 0) / 100 * polyCash + (kFlow.awayMoneyPct || 0) / 100 * kCash) / sampled * 100).toFixed(1))
    : 0;
  const ticketFav = awayTicket >= 50 ? 'away' : 'home';
  const moneyFav = awayMoney >= 50 ? 'away' : 'home';
  if (ticketFav !== moneyFav && Math.abs(awayTicket - awayMoney) >= 10) {
    const away = p.awayTeam || k.awayTeam || key;
    const home = p.homeTeam || k.homeTeam || key;
    const awayShort = away.split(' ').pop();
    const homeShort = home.split(' ').pop();
    const moneyTeam = moneyFav === 'away' ? awayShort : homeShort;
    const ticketTeam = ticketFav === 'away' ? awayShort : homeShort;
    console.log(`  ⚡ ${sport} ${pad(away + ' @ ' + home, 45)} | Tickets→${ticketTeam}  Money→${moneyTeam}  (${awayTicket}% / ${awayMoney}%)`);
    reverseCount++;
  }
}
if (reverseCount === 0) console.log('  (none)');
console.log(`\n  Total reverse signals: ${reverseCount}\n`);
