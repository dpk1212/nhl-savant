#!/usr/bin/env node
// scripts/walletReceipts.mjs — THE RECEIPT STACK
//
// Rebuilds the exact receipt format from our own highest-performing tweets
// (April 2026, bookmarked by the owner 7/7 as proof — 7.2K/11K/10.2K
// impressions, 2-5x tonight's baseline). That format disappeared when the
// loop pivoted to aggregate-only language ("89% of sharp dollars"). This
// script restores it as a one-command lookup so every hero can carry it.
//
// Usage:
//   node scripts/walletReceipts.mjs <gameKey> <marketType: ml|spread|total> [outcome]
//   node scripts/walletReceipts.mjs sea_mia ml               # both sides
//   node scripts/walletReceipts.mjs sea_mia ml "Seattle Mariners"  # one side
//
// Reads public/sharp_positions.json (ml), sharp_spread_positions.json,
// sharp_total_positions.json — whichever matches marketType.
//
// Output per side: sharp count, $ invested, % of matchup total, combined
// P&L of that wallet pool, top-4 named receipts (wallet last-4 hex + $),
// and the single largest bet's ROI + size-vs-their-own-average multiple.

import fs from 'fs';

const [, , gameKeyArg, marketTypeArg, outcomeArg] = process.argv;
if (!gameKeyArg || !marketTypeArg) {
  console.error('Usage: node scripts/walletReceipts.mjs <gameKey> <ml|spread|total> [outcome]');
  process.exit(1);
}
const marketType = marketTypeArg.toLowerCase();
const FILE = { ml: 'sharp_positions.json', spread: 'sharp_spread_positions.json', total: 'sharp_total_positions.json' }[marketType];
if (!FILE) { console.error('marketType must be ml, spread, or total'); process.exit(1); }

const path = `public/${FILE}`;
if (!fs.existsSync(path)) { console.error('Missing ' + path); process.exit(1); }
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

let game = null, sport = null;
for (const s of ['MLB', 'NBA', 'NHL', 'CBB', 'SOC']) {
  if (data[s] && data[s][gameKeyArg]) { game = data[s][gameKeyArg]; sport = s; break; }
}
if (!game) {
  console.error(`gameKey "${gameKeyArg}" not found in ${FILE}. Available keys:`);
  for (const s of ['MLB', 'NBA', 'NHL', 'CBB', 'SOC']) {
    if (data[s]) console.error(`  ${s}: ${Object.keys(data[s]).join(', ')}`);
  }
  process.exit(1);
}

console.log(`Scan: ${data.scannedAt} · ${data.walletsScanned} wallets scanned`);
console.log(`${game.away} @ ${game.home} (${sport} ${marketType.toUpperCase()})`);
console.log('');

const positions = (game.positions || []).filter(p => p.marketType === marketType);
const bySide = {};
for (const p of positions) {
  bySide[p.outcome] = bySide[p.outcome] || [];
  bySide[p.outcome].push(p);
}
const grandTotal = positions.reduce((s, p) => s + (p.invested || 0), 0);

const fmtK = (n) => {
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(1)}K`;
  return `${sign}$${Math.round(abs)}`;
};

const sides = outcomeArg ? [outcomeArg] : Object.keys(bySide);
for (const side of sides) {
  const rows = bySide[side];
  if (!rows || !rows.length) { console.log(`(no positions on "${side}")`); continue; }
  const invested = rows.reduce((s, p) => s + (p.invested || 0), 0);
  const wallets = new Set(rows.map(p => p.wallet));
  const pctOfMatchup = grandTotal > 0 ? (100 * invested / grandTotal).toFixed(1) : '?';
  const combinedPnl = rows.reduce((sum, p, i, arr) => {
    // count each unique wallet's sportPnlTotal once
    if (arr.findIndex(x => x.wallet === p.wallet) !== i) return sum;
    return sum + (p.sportPnlTotal || 0);
  }, 0);

  const byWallet = {};
  for (const p of rows) {
    if (!byWallet[p.wallet]) byWallet[p.wallet] = { ...p, invested: 0 };
    byWallet[p.wallet].invested += p.invested || 0;
  }
  const top = Object.values(byWallet).sort((a, b) => b.invested - a.invested);

  console.log(`── ${side} ──`);
  console.log(`${wallets.size} sharps · ${fmtK(invested)} invested · ${pctOfMatchup}% of matchup total`);
  console.log(`combined P&L of this pool: ${combinedPnl >= 0 ? '+' : ''}${fmtK(combinedPnl).replace('$-', '-$')}`);
  console.log('Best receipts (RT-ready, copy verbatim):');
  for (const w of top.slice(0, 4)) {
    console.log(`  ${w.wallet.slice(-4)}  ${fmtK(w.invested)}`);
  }
  const biggest = top[0];
  if (biggest && biggest.avgSportBet) {
    const mult = (biggest.invested / biggest.avgSportBet).toFixed(1);
    console.log(`Largest bet — ${biggest.wallet.slice(-4)}: ${fmtK(biggest.invested)} · ${biggest.sportROI != null ? (biggest.sportROI >= 0 ? '+' : '') + biggest.sportROI + '% ROI' : ''} · ${mult}x their own avg bet size`);
  }
  console.log('');
}
console.log('COPY RULE: use ONLY the last-4 hex tag (never the full wallet address, never a display name) — that is our house anonymization standard, proven in the bookmarked exemplars.');
