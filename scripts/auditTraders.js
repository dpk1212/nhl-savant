/**
 * Audit Traders — local script to identify obvious bots, arb traders,
 * and non-directional wallets in our sharp universe.
 *
 * Targets only the most clear-cut cases:
 *   - Vol/PnL ratio > 100x (churning volume for tiny edge)
 *   - 500+ sport bets (likely automated)
 *   - Sport bets < 5% of total markets (Polymarket generalist, not sports bettor)
 *   - Both-sides positions on today's games (hedging, no directional opinion)
 *
 * Usage: node scripts/auditTraders.js
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function loadJSON(filename) {
  const path = join(ROOT, 'public', filename);
  if (!existsSync(path)) return null;
  try { return JSON.parse(readFileSync(path, 'utf8')); } catch { return null; }
}

const sportsSharps = loadJSON('sports_sharps.json');
const whaleProfiles = loadJSON('whale_profiles.json');
const sharpPos = loadJSON('sharp_positions.json');
const spreadPos = loadJSON('sharp_spread_positions.json');
const totalPos = loadJSON('sharp_total_positions.json');

if (!sportsSharps || !whaleProfiles) {
  console.log('Missing data files');
  process.exit(1);
}

const { _meta, ...sharps } = sportsSharps;

// ─── Signal 1: Both-sides positions today ────────────────────────────────────

const bothSidesWallets = {};
for (const posFile of [sharpPos, spreadPos, totalPos]) {
  if (!posFile) continue;
  for (const sport of ['NHL', 'CBB', 'MLB', 'NBA']) {
    for (const [key, gd] of Object.entries(posFile[sport] || {})) {
      const walletSides = {};
      for (const pos of gd.positions || []) {
        if (!walletSides[pos.wallet]) walletSides[pos.wallet] = { sides: new Set(), positions: [] };
        walletSides[pos.wallet].sides.add(pos.side);
        walletSides[pos.wallet].positions.push(pos);
      }
      for (const [w, data] of Object.entries(walletSides)) {
        if (data.sides.size > 1) {
          if (!bothSidesWallets[w]) bothSidesWallets[w] = { games: 0, hedgedGames: 0 };
          bothSidesWallets[w].games++;
          const byS = {};
          data.positions.forEach(p => { byS[p.side] = (byS[p.side] || 0) + (p.invested || 0); });
          const amounts = Object.values(byS);
          const ratio = Math.max(...amounts) / Math.max(Math.min(...amounts), 1);
          if (ratio < 3) bothSidesWallets[w].hedgedGames++;
        }
      }
    }
  }
}

// ─── Score each wallet ───────────────────────────────────────────────────────

const THRESHOLDS = {
  VOL_PNL_RATIO: 100,
  HIGH_BET_COUNT: 500,
  SPORT_MARKET_PCT: 0.05,
  BOTH_SIDES_GAMES: 3,
};

const results = Object.entries(sharps).map(([addr, w]) => {
  const flags = [];
  let score = 0;

  // Vol/PnL ratio
  const ratio = w.vol > 0 && w.sportPnlTotal > 0 ? w.vol / w.sportPnlTotal : 0;
  if (ratio > 200) { score += 30; flags.push(`vol/pnl ${ratio.toFixed(0)}x`); }
  else if (ratio > THRESHOLDS.VOL_PNL_RATIO) { score += 20; flags.push(`vol/pnl ${ratio.toFixed(0)}x`); }

  // High sport bet count (automated)
  if (w.sportBets > 1000) { score += 25; flags.push(`${w.sportBets} sport bets`); }
  else if (w.sportBets > THRESHOLDS.HIGH_BET_COUNT) { score += 15; flags.push(`${w.sportBets} sport bets`); }

  // Low sport concentration (generalist, not a sports bettor)
  if (w.marketsTraded > 100 && w.sportBets > 0) {
    const sportPct = w.sportBets / w.marketsTraded;
    if (sportPct < 0.02) { score += 20; flags.push(`${(sportPct * 100).toFixed(1)}% sport`); }
    else if (sportPct < THRESHOLDS.SPORT_MARKET_PCT) { score += 10; flags.push(`${(sportPct * 100).toFixed(1)}% sport`); }
  }

  // Low ROI with high volume (grinding)
  if (w.sportROI < 1 && w.vol > 10_000_000) { score += 15; flags.push(`ROI ${w.sportROI}%`); }

  // Both-sides positions today
  const bs = bothSidesWallets[addr];
  if (bs && bs.games >= THRESHOLDS.BOTH_SIDES_GAMES) {
    score += 20; flags.push(`both-sides ${bs.games} games (${bs.hedgedGames} hedged)`);
  } else if (bs && bs.hedgedGames >= 2) {
    score += 15; flags.push(`hedged ${bs.hedgedGames} games`);
  }

  // Win rate anomaly
  if (w.sportWinRate != null && w.sportWinRate < 5 && w.sportBets > 50) {
    score += 15; flags.push(`win rate ${w.sportWinRate}%`);
  }

  return {
    addr, score, flags,
    pnl: w.sportPnlTotal, roi: w.sportROI, bets: w.sportBets,
    ratio, marketsTraded: w.marketsTraded, vol: w.vol,
    wr: w.sportWinRate,
  };
});

// ─── Output ──────────────────────────────────────────────────────────────────

const FILTER_THRESHOLD = 40;

const flagged = results.filter(r => r.score >= FILTER_THRESHOLD).sort((a, b) => b.score - a.score);
const clean = results.filter(r => r.score < FILTER_THRESHOLD);
const suspect = results.filter(r => r.score >= 25 && r.score < FILTER_THRESHOLD);

console.log('═══════════════════════════════════════════════════════════');
console.log('  TRADER / BOT AUDIT — Most Obvious Cases');
console.log('═══════════════════════════════════════════════════════════\n');

console.log(`Thresholds: vol/pnl > ${THRESHOLDS.VOL_PNL_RATIO}x | bets > ${THRESHOLDS.HIGH_BET_COUNT} | sport% < ${THRESHOLDS.SPORT_MARKET_PCT * 100}% | both-sides >= ${THRESHOLDS.BOTH_SIDES_GAMES} games`);
console.log(`Filter score: >= ${FILTER_THRESHOLD} → flagged as trader\n`);

console.log('─── WOULD BE FILTERED (' + flagged.length + ' wallets) ───\n');

for (const r of flagged) {
  console.log(
    `  ***${r.addr.slice(-4)}  score:${r.score}  ` +
    `pnl:$${(r.pnl / 1000).toFixed(0)}K  roi:${r.roi}%  bets:${r.bets}  ` +
    `vol/pnl:${r.ratio > 0 ? r.ratio.toFixed(0) + 'x' : '?'}`
  );
  console.log(`    → ${r.flags.join(' | ')}`);
}

console.log('\n─── SUSPECT BUT NOT FILTERED (' + suspect.length + ' wallets, score 25-39) ───\n');

for (const r of suspect.sort((a, b) => b.score - a.score).slice(0, 15)) {
  console.log(
    `  ***${r.addr.slice(-4)}  score:${r.score}  ` +
    `pnl:$${(r.pnl / 1000).toFixed(0)}K  roi:${r.roi}%  bets:${r.bets}`
  );
  console.log(`    → ${r.flags.join(' | ')}`);
}
if (suspect.length > 15) console.log(`  ... and ${suspect.length - 15} more`);

// ─── Impact summary ─────────────────────────────────────────────────────────

const flaggedPnl = flagged.reduce((s, r) => s + r.pnl, 0);
const cleanPnl = clean.reduce((s, r) => s + r.pnl, 0);
const flaggedVol = flagged.reduce((s, r) => s + r.vol, 0);
const cleanVol = clean.reduce((s, r) => s + r.vol, 0);

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  IMPACT SUMMARY');
console.log('═══════════════════════════════════════════════════════════\n');

console.log(`  Total wallets in sports_sharps.json: ${results.length}`);
console.log(`  Would filter:    ${flagged.length} wallets (${(flagged.length / results.length * 100).toFixed(1)}%)`);
console.log(`  Would keep:      ${clean.length} wallets`);
console.log(`  Suspect (watch): ${suspect.length} wallets\n`);

console.log(`  Filtered P&L:  $${(flaggedPnl / 1_000_000).toFixed(1)}M across ${flagged.length} wallets`);
console.log(`  Clean P&L:     $${(cleanPnl / 1_000_000).toFixed(1)}M across ${clean.length} wallets`);
console.log(`  Avg P&L (filtered): $${flagged.length > 0 ? (flaggedPnl / flagged.length / 1000).toFixed(0) + 'K' : '0'}`);
console.log(`  Avg P&L (clean):    $${clean.length > 0 ? (cleanPnl / clean.length / 1000).toFixed(0) + 'K' : '0'}\n`);

console.log(`  Filtered volume: $${(flaggedVol / 1_000_000).toFixed(0)}M`);
console.log(`  Clean volume:    $${(cleanVol / 1_000_000).toFixed(0)}M\n`);

// Check today's positions impact
let flaggedPositionsToday = 0;
let totalPositionsToday = 0;
const flaggedAddrs = new Set(flagged.map(r => r.addr));
const suspectAddrs = new Set(suspect.map(r => r.addr));
let suspectPositionsToday = 0;
const suspectGameImpact = {};
const suspectWalletPositions = {};
for (const posFile of [sharpPos, spreadPos, totalPos]) {
  if (!posFile) continue;
  for (const sport of ['NHL', 'CBB', 'MLB', 'NBA']) {
    for (const [gameKey, gd] of Object.entries(posFile[sport] || {})) {
      for (const pos of gd.positions || []) {
        totalPositionsToday++;
        if (flaggedAddrs.has(pos.wallet)) flaggedPositionsToday++;
        if (suspectAddrs.has(pos.wallet)) {
          suspectPositionsToday++;
          const gk = `${sport}: ${gd.away} vs ${gd.home}`;
          if (!suspectGameImpact[gk]) suspectGameImpact[gk] = { positions: [], totalInGame: 0 };
          suspectGameImpact[gk].positions.push(pos);
          if (!suspectWalletPositions[pos.wallet]) suspectWalletPositions[pos.wallet] = [];
          suspectWalletPositions[pos.wallet].push({ ...pos, game: gk, sport });
        }
        if (suspectGameImpact[`${sport}: ${gd.away} vs ${gd.home}`]) {
          suspectGameImpact[`${sport}: ${gd.away} vs ${gd.home}`].totalInGame++;
        }
      }
    }
  }
}

console.log(`  Today's positions from flagged wallets: ${flaggedPositionsToday} / ${totalPositionsToday} (${(flaggedPositionsToday / Math.max(totalPositionsToday, 1) * 100).toFixed(1)}%)`);
console.log(`  Today's positions from suspect wallets: ${suspectPositionsToday} / ${totalPositionsToday} (${(suspectPositionsToday / Math.max(totalPositionsToday, 1) * 100).toFixed(1)}%)`);
console.log(`  Combined dirty positions: ${flaggedPositionsToday + suspectPositionsToday} / ${totalPositionsToday}\n`);

// ─── Score distribution analysis ───────────────────────────────────────────

console.log('═══════════════════════════════════════════════════════════');
console.log('  SCORE DISTRIBUTION — Where should the cutoff be?');
console.log('═══════════════════════════════════════════════════════════\n');

const buckets = [
  { label: '70+  (obvious bots)', min: 70, max: Infinity },
  { label: '60-69 (heavy traders)', min: 60, max: 69 },
  { label: '50-59 (likely traders)', min: 50, max: 59 },
  { label: '45-49 (probable traders)', min: 45, max: 49 },
  { label: '40-44 (borderline)', min: 40, max: 44 },
  { label: '35-39 (suspect)', min: 35, max: 39 },
  { label: '30-34 (watch)', min: 30, max: 34 },
  { label: '25-29 (mild)', min: 25, max: 29 },
  { label: '20-24', min: 20, max: 24 },
  { label: '15-19', min: 15, max: 19 },
  { label: '0-14  (clean)', min: 0, max: 14 },
];

for (const b of buckets) {
  const inBucket = results.filter(r => r.score >= b.min && r.score <= b.max);
  if (inBucket.length === 0) continue;
  const avgPnl = inBucket.reduce((s, r) => s + r.pnl, 0) / inBucket.length;
  const avgROI = inBucket.reduce((s, r) => s + (r.roi || 0), 0) / inBucket.length;
  const avgRatio = inBucket.filter(r => r.ratio > 0).reduce((s, r) => s + r.ratio, 0) / Math.max(inBucket.filter(r => r.ratio > 0).length, 1);
  const avgBets = inBucket.reduce((s, r) => s + r.bets, 0) / inBucket.length;

  let posToday = 0;
  const bucketAddrs = new Set(inBucket.map(r => r.addr));
  for (const posFile of [sharpPos, spreadPos, totalPos]) {
    if (!posFile) continue;
    for (const sport of ['NHL', 'CBB', 'MLB', 'NBA']) {
      for (const gd of Object.values(posFile[sport] || {})) {
        for (const pos of gd.positions || []) {
          if (bucketAddrs.has(pos.wallet)) posToday++;
        }
      }
    }
  }

  const bar = '█'.repeat(Math.min(inBucket.length, 40));
  console.log(`  ${b.label.padEnd(25)} ${String(inBucket.length).padStart(4)} wallets  avgPnl:$${(avgPnl / 1000).toFixed(0)}K  avgROI:${avgROI.toFixed(1)}%  avgVol/Pnl:${avgRatio.toFixed(0)}x  avgBets:${Math.round(avgBets)}  posToday:${posToday}`);
  console.log(`  ${''.padEnd(25)} ${bar}`);
}

// ─── Suspect wallets with positions today ─────────────────────────────────

if (suspectPositionsToday > 0) {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  SUSPECT WALLETS WITH POSITIONS TODAY (score 25-39)');
  console.log('═══════════════════════════════════════════════════════════\n');

  const suspectWithPos = suspect.filter(r => suspectWalletPositions[r.addr]);
  for (const r of suspectWithPos.sort((a, b) => b.score - a.score)) {
    const positions = suspectWalletPositions[r.addr] || [];
    const totalInv = positions.reduce((s, p) => s + (p.invested || 0), 0);
    console.log(
      `  ***${r.addr.slice(-4)}  score:${r.score}  ` +
      `pnl:$${(r.pnl / 1000).toFixed(0)}K  roi:${r.roi}%  bets:${r.bets}  ` +
      `vol/pnl:${r.ratio > 0 ? r.ratio.toFixed(0) + 'x' : '?'}`
    );
    console.log(`    → Flags: ${r.flags.join(' | ')}`);
    console.log(`    → ${positions.length} position(s) today, $${(totalInv / 1000).toFixed(1)}K invested:`);
    for (const p of positions) {
      console.log(`      ${p.game}  ${p.side}  $${(p.invested / 1000).toFixed(1)}K  tier:${p.tier}  sportPnl:$${((p.sportPnlTotal || 0) / 1000).toFixed(0)}K`);
    }
    console.log('');
  }
}

// ─── Game-level impact from suspects ──────────────────────────────────────

if (Object.keys(suspectGameImpact).length > 0) {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  GAMES AFFECTED BY SUSPECT WALLETS');
  console.log('═══════════════════════════════════════════════════════════\n');

  for (const [game, data] of Object.entries(suspectGameImpact).sort((a, b) => b[1].positions.length - a[1].positions.length)) {
    const suspInv = data.positions.reduce((s, p) => s + (p.invested || 0), 0);
    const sides = {};
    data.positions.forEach(p => { sides[p.side] = (sides[p.side] || 0) + (p.invested || 0); });
    const sideStr = Object.entries(sides).map(([s, v]) => `${s}: $${(v / 1000).toFixed(1)}K`).join(', ');
    console.log(`  ${game}`);
    console.log(`    ${data.positions.length} suspect positions / ~${data.totalInGame} total in game | $${(suspInv / 1000).toFixed(1)}K suspect $ | ${sideStr}`);
  }
}

// ─── Tightening analysis ────────────────────────────────────────────────────

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  TIGHTENING ANALYSIS — What happens if we lower the cutoff?');
console.log('═══════════════════════════════════════════════════════════\n');

for (const cutoff of [40, 35, 30, 25]) {
  const would = results.filter(r => r.score >= cutoff);
  const kept = results.filter(r => r.score < cutoff);
  const wouldPnl = would.reduce((s, r) => s + r.pnl, 0);
  const keptPnl = kept.reduce((s, r) => s + r.pnl, 0);

  let wouldPos = 0, keptPos = 0;
  const wouldSet = new Set(would.map(r => r.addr));
  for (const posFile of [sharpPos, spreadPos, totalPos]) {
    if (!posFile) continue;
    for (const sport of ['NHL', 'CBB', 'MLB', 'NBA']) {
      for (const gd of Object.values(posFile[sport] || {})) {
        for (const pos of gd.positions || []) {
          if (wouldSet.has(pos.wallet)) wouldPos++;
          else keptPos++;
        }
      }
    }
  }

  const safeHarborCount = would.filter(r => r.pnl > 10000 && r.roi > 10).length;
  console.log(`  Cutoff >= ${cutoff}: strip ${would.length} wallets (${wouldPos} positions today), keep ${kept.length} (${keptPos} positions)`);
  console.log(`    Strip $${(wouldPnl / 1e6).toFixed(1)}M P&L | Keep $${(keptPnl / 1e6).toFixed(1)}M P&L | ${safeHarborCount} would be saved by safe harbor`);
}

console.log('');

// Show the cleanest bettors for comparison
console.log('─── CLEANEST BETTORS (score 0, top 15 by P&L) ───\n');
const cleanest = results.filter(r => r.score === 0).sort((a, b) => b.pnl - a.pnl).slice(0, 15);
for (const r of cleanest) {
  console.log(
    `  ***${r.addr.slice(-4)}  ` +
    `pnl:$${(r.pnl / 1000).toFixed(0)}K  roi:${r.roi}%  bets:${r.bets}  ` +
    `vol/pnl:${r.ratio > 0 ? r.ratio.toFixed(0) + 'x' : '?'}  ` +
    `wr:${r.wr != null ? r.wr + '%' : '?'}`
  );
}
