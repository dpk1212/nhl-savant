/**
 * walletProvenGrowthBySport.js — proven-winner roster growth per sport,
 * day by day, with a funnel diagnostic for why some sports lag.
 *
 * "Proven winner" = CONFIRMED or FLAT in the same sense the live whitelist
 * uses (see scripts/exportWalletProfiles.js):
 *   • CONFIRMED = ≥2 bets in the sport AND flat ROI > 0 (Source A, walletDetails)
 *                   AND dollar ROI > 0 (Source B, sharp_action_positions)
 *   • FLAT      = ≥2 bets in the sport AND flat ROI > 0 (Source A only)
 *
 * The live engine reads CONFIRMED+FLAT to compute Δ_winner. So this script
 * is the exact growth curve that drives the lock floor.
 *
 * Sections produced (saved to WALLET_PROVEN_GROWTH.md, no git commit):
 *   §1  Current proven-winner snapshot per sport (now)
 *   §2  Daily cumulative growth per sport per day
 *   §3  Pipeline funnel — where each sport leaks (the "why does NHL lag?" answer)
 *   §4  Bubble wallets per sport — the next-up graduation pipeline
 *   §5  Slate density per sport — picks/day, wallets/pick, observations
 *   §6  Plain-English verdict per sport
 *
 * Local-only — does not push to Firestore, does not get committed by CI.
 *
 * Usage:  node scripts/walletProvenGrowthBySport.js
 *         node scripts/walletProvenGrowthBySport.js --min-bets=3   (default 2)
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!admin.apps.length) {
  const sakPath = join(__dirname, '..', 'serviceAccountKey.json');
  if (existsSync(sakPath)) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sakPath, 'utf8'))) });
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        project_id: process.env.VITE_FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
}

const db = admin.firestore();

const argv = process.argv.slice(2);
const MIN_BETS_ARG = argv.find(a => a.startsWith('--min-bets='));
const MIN_BETS = MIN_BETS_ARG ? parseInt(MIN_BETS_ARG.split('=')[1], 10) : 2;

const V8_CUTOVER = '2026-04-18';
const COLS = [
  ['sharpFlowPicks',   'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals',  'TOTAL'],
];
const OPPOSITE = { home: 'away', away: 'home', over: 'under', under: 'over' };

const americanToDecimal = (odds) => (odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds));
const flatProfit = (odds, won) => (won ? americanToDecimal(odds) - 1 : -1);
const sign = (v, d = 1) => (v == null || Number.isNaN(v) ? '—' : (v >= 0 ? '+' : '') + v.toFixed(d));
const pct = (v, d = 0) => v == null || Number.isNaN(v) ? '—' : `${v.toFixed(d)}%`;
const mdHeader = (cols) => `| ${cols.join(' | ')} |\n|${cols.map(() => '---').join('|')}|`;

// ─────────────────────────────────────────────────────────────────────
//  Source A — wallet-bets from graded picks (walletDetails)
// ─────────────────────────────────────────────────────────────────────
async function loadWalletBets() {
  const bets = [];
  for (const [col, market] of COLS) {
    const snap = await db.collection(col).where('date', '>=', V8_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sides = d.sides || {};
      const anyGraded = Object.values(sides).some(s => s.result?.outcome === 'WIN' || s.result?.outcome === 'LOSS');
      if (!anyGraded) continue;
      let winningSide = null;
      for (const sk of Object.keys(sides)) {
        const oc = sides[sk].result?.outcome;
        if (oc === 'WIN') { winningSide = sk; break; }
        if (oc === 'LOSS' && OPPOSITE[sk]) { winningSide = OPPOSITE[sk]; break; }
      }
      if (!winningSide) continue;
      const seen = new Map();
      for (const [sideKey, side] of Object.entries(sides)) {
        const peak = side.peak || side.lock;
        const wd = peak?.v8Scoring?.walletDetails;
        if (!Array.isArray(wd)) continue;
        const oddsForThisSide = peak.odds ?? 0;
        for (const w of wd) {
          if (!w.wallet || !w.side) continue;
          if (seen.has(`${doc.id}_${w.wallet}`)) continue;
          seen.set(`${doc.id}_${w.wallet}`, true);
          const betOdds = sides[w.side]?.peak?.odds ?? sides[w.side]?.lock?.odds ?? oddsForThisSide;
          const won = w.side === winningSide ? 1 : 0;
          bets.push({
            gameKey: doc.id,
            date: d.date,
            sport: d.sport || 'UNK',
            market,
            wallet: w.wallet,
            invested: w.invested ?? 0,
            won,
            flat: flatProfit(betOdds, won === 1),
          });
        }
      }
    }
  }
  return bets;
}

// ─────────────────────────────────────────────────────────────────────
//  Source B — graded position rows (dollar ROI from sharp_action_positions)
//  CRITICAL: the join key is `walletShort` (last 6 chars of wallet
//  address), because Source A's `walletDetails[].wallet` already stores
//  the short ID. Joining on the full 42-char address misses 100% of
//  wallets and silently zeroes out CONFIRMED graduations.
// ─────────────────────────────────────────────────────────────────────
async function loadPositions() {
  const snap = await db.collection('sharp_action_positions').where('status', '==', 'GRADED').get();
  const rows = [];
  snap.forEach(doc => {
    const d = doc.data();
    if (!d.wallet) return;
    const invested = Number(d.invested ?? d.size ?? 0);
    const settledPnl = Number(d.settledPnl ?? d.positionPnl ?? 0);
    if (invested <= 0) return;
    if (!d.date || d.date < V8_CUTOVER) return;
    const walletShort = d.walletShort || String(d.wallet).slice(-6).toLowerCase();
    rows.push({
      date: d.date,
      sport: d.sport || 'UNK',
      market: d.marketType,
      wallet: walletShort,
      invested,
      settledPnl,
      won: settledPnl > 0 ? 1 : 0,
    });
  });
  return rows;
}

// ─────────────────────────────────────────────────────────────────────
//  Live whitelist ground truth — what the engine actually uses RIGHT NOW.
// ─────────────────────────────────────────────────────────────────────
async function loadLiveWhitelist() {
  const snap = await db.collection('sharpWalletProfiles').get();
  const bySport = {};
  for (const doc of snap.docs) {
    const d = doc.data();
    for (const [sport, rec] of Object.entries(d.bySport || {})) {
      if (!bySport[sport]) bySport[sport] = { CONFIRMED: 0, FLAT: 0, WR50: 0 };
      if (rec.whitelistTier === 'CONFIRMED') bySport[sport].CONFIRMED++;
      else if (rec.whitelistTier === 'FLAT') bySport[sport].FLAT++;
      else if (rec.whitelistTier === 'WR50') bySport[sport].WR50++;
    }
  }
  return bySport;
}

// ─────────────────────────────────────────────────────────────────────
//  Per-wallet aggregation in one sport, restricted to date ≤ asOf.
//  Returns Map<wallet, { picksN, picksWins, flatPnl, posN, posInvested, posPnl }>.
// ─────────────────────────────────────────────────────────────────────
function aggregateBy(walletBets, positions, sport, asOf) {
  const out = new Map();
  for (const b of walletBets) {
    if (b.sport !== sport) continue;
    if (asOf && b.date > asOf) continue;
    const r = out.get(b.wallet) || {
      wallet: b.wallet, picksN: 0, picksWins: 0, flatPnl: 0,
      posN: 0, posInvested: 0, posPnl: 0,
    };
    r.picksN += 1;
    r.picksWins += b.won;
    r.flatPnl += b.flat;
    out.set(b.wallet, r);
  }
  for (const p of positions) {
    if (p.sport !== sport) continue;
    if (asOf && p.date > asOf) continue;
    const r = out.get(p.wallet) || {
      wallet: p.wallet, picksN: 0, picksWins: 0, flatPnl: 0,
      posN: 0, posInvested: 0, posPnl: 0,
    };
    r.posN += 1;
    r.posInvested += p.invested;
    r.posPnl += p.settledPnl;
    out.set(p.wallet, r);
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────
//  Whitelist tier classifier — exact mirror of exportWalletProfiles.js.
// ─────────────────────────────────────────────────────────────────────
function classifyTier(rec, minBets = MIN_BETS) {
  const flatRoi = rec.picksN >= minBets ? (rec.flatPnl / rec.picksN) * 100 : null;
  const dollarRoi = rec.posN >= minBets && rec.posInvested > 0 ? (rec.posPnl / rec.posInvested) * 100 : null;
  const wr = rec.picksN >= minBets ? (rec.picksWins / rec.picksN) * 100 : null;
  const flatOk = flatRoi != null && flatRoi > 0;
  const dollarOk = dollarRoi != null && dollarRoi > 0;
  const wr50Ok = wr != null && wr >= 50;
  if (flatOk && dollarOk) return 'CONFIRMED';
  if (flatOk) return 'FLAT';
  if (wr50Ok) return 'WR50';
  return null;
}

function provenCounts(map) {
  let confirmed = 0, flat = 0, wr50 = 0, none = 0;
  for (const rec of map.values()) {
    const t = classifyTier(rec);
    if (t === 'CONFIRMED') confirmed++;
    else if (t === 'FLAT') flat++;
    else if (t === 'WR50') wr50++;
    else none++;
  }
  return { confirmed, flat, wr50, none, proven: confirmed + flat, total: map.size };
}

// ─────────────────────────────────────────────────────────────────────
//  Main
// ─────────────────────────────────────────────────────────────────────
(async () => {
  console.log('Loading graded wallet-bets (Source A)…');
  const walletBets = await loadWalletBets();
  console.log(`  ${walletBets.length} wallet-bets across ${new Set(walletBets.map(b => b.wallet)).size} wallets.`);

  console.log('Loading sharp_action_positions (Source B)…');
  const positions = await loadPositions();
  console.log(`  ${positions.length} graded positions across ${new Set(positions.map(p => p.wallet)).size} wallets.`);

  console.log('Loading live whitelist (sharpWalletProfiles) for ground truth…');
  const liveWhitelist = await loadLiveWhitelist();
  const liveTotals = Object.values(liveWhitelist).reduce((acc, c) => ({
    CONFIRMED: acc.CONFIRMED + c.CONFIRMED,
    FLAT: acc.FLAT + c.FLAT,
    WR50: acc.WR50 + c.WR50,
  }), { CONFIRMED: 0, FLAT: 0, WR50: 0 });
  console.log(`  Live: ${liveTotals.CONFIRMED} CONFIRMED · ${liveTotals.FLAT} FLAT · ${liveTotals.WR50} WR50 across all sports.`);

  const sportsA = new Set(walletBets.map(b => b.sport));
  const sportsB = new Set(positions.map(p => p.sport));
  const sports = [...new Set([...sportsA, ...sportsB])].filter(Boolean).sort();
  const datesA = new Set(walletBets.map(b => b.date));
  const datesB = new Set(positions.map(p => p.date));
  const dates = [...new Set([...datesA, ...datesB])].filter(Boolean).sort();

  console.log(`Sports: ${sports.join(', ')} · Dates: ${dates[0]} → ${dates[dates.length - 1]} (${dates.length} graded days)\n`);

  const out = [];
  const nowET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  out.push('# Proven-Winner Roster Growth & Sport-Lag Diagnostic');
  out.push('');
  out.push(`Generated: ${nowET} ET`);
  out.push('');
  out.push(`**Definitions** — "proven winner" = whitelist tier **CONFIRMED** or **FLAT**, identical to what \`exportWalletProfiles.js\` writes and what \`backfillWalletConsensus.js\` reads when it computes Δ_winner. Specifically, in a single sport with ≥ ${MIN_BETS} graded bets:`);
  out.push('');
  out.push('- `CONFIRMED` — flat ROI > 0 in **Source A** (`v8Scoring.walletDetails` from graded picks) **AND** dollar ROI > 0 in **Source B** (`sharp_action_positions`)');
  out.push('- `FLAT`      — flat ROI > 0 in Source A (Source B may be missing or negative)');
  out.push('- `WR50`      — WR ≥ 50% only (not used for Δ_winner — included here as a leading indicator)');
  out.push('');
  out.push(`**Coverage** — V8 cutover **${V8_CUTOVER}** onward · ${walletBets.length} wallet-bets · ${positions.length} positions · sports: ${sports.join(', ')} · dates: ${dates[0]} → ${dates[dates.length - 1]} (${dates.length} graded days).`);
  out.push('');

  // ═════════════════════════════════════════════════════════════════
  // §1. Current snapshot — proven-winner roster per sport NOW
  // ═════════════════════════════════════════════════════════════════
  const snapshot = {};
  for (const sport of sports) {
    const map = aggregateBy(walletBets, positions, sport, null);
    snapshot[sport] = { map, counts: provenCounts(map) };
  }

  out.push('---');
  out.push('## §1. Current proven-winner roster per sport (snapshot now)');
  out.push('');
  out.push(`Roster as of ${dates[dates.length - 1]}. Tier counts assume ≥ ${MIN_BETS} bets in that sport.`);
  out.push('');
  out.push(mdHeader(['Sport', 'Wallets seen', 'Eligible (≥' + MIN_BETS + ' picks)', 'CONFIRMED', 'FLAT', '**Proven (C+F)**', 'WR50 only', 'Conv %']));
  let totalProven = 0;
  for (const sport of sports) {
    const map = snapshot[sport].map;
    const c = snapshot[sport].counts;
    const eligible = [...map.values()].filter(r => r.picksN >= MIN_BETS).length;
    const conv = c.total > 0 ? (c.proven / c.total * 100).toFixed(1) : '—';
    out.push(`| ${sport.toUpperCase()} | ${c.total} | ${eligible} | ${c.confirmed} | ${c.flat} | **${c.proven}** | ${c.wr50} | ${conv}% |`);
    totalProven += c.proven;
  }
  out.push('');
  out.push(`Total proven across sports: **${totalProven}** wallets (script reconstruction). \`Conv %\` is what fraction of all wallets seen in that sport graduated to CONFIRMED+FLAT — the bottom-line "yield" per sport.`);
  out.push('');

  // ── Ground-truth comparison: live whitelist (sharpWalletProfiles) ──
  out.push('### §1b. Ground-truth check vs live whitelist');
  out.push('');
  out.push('The live whitelist that the engine actually reads at lock time is `sharpWalletProfiles`, written by `scripts/exportWalletProfiles.js`. Reconstructed numbers above should track these closely. Drift = either the whitelist hasn\'t been re-exported recently, or this script has different cohort logic.');
  out.push('');
  out.push(mdHeader(['Sport', 'CONFIRMED (live · script)', 'FLAT (live · script)', 'WR50 (live · script)', 'Drift']));
  for (const sport of sports) {
    const live = liveWhitelist[sport] || { CONFIRMED: 0, FLAT: 0, WR50: 0 };
    const c = snapshot[sport].counts;
    const drift = (live.CONFIRMED - c.confirmed) + (live.FLAT - c.flat);
    const driftLbl = drift === 0 ? 'in sync' : drift > 0 ? `+${drift} live` : `${drift} live`;
    out.push(`| ${sport.toUpperCase()} | ${live.CONFIRMED} · ${c.confirmed} | ${live.FLAT} · ${c.flat} | ${live.WR50} · ${c.wr50} | ${driftLbl} |`);
  }
  const liveProvenTotal = Object.values(liveWhitelist).reduce((s, x) => s + x.CONFIRMED + x.FLAT, 0);
  out.push('');
  out.push(`Live whitelist totals: **${liveTotals.CONFIRMED} CONFIRMED + ${liveTotals.FLAT} FLAT = ${liveProvenTotal} proven** across all sports. Script reconstruction: **${totalProven} proven**. Differences are usually because \`exportWalletProfiles.js\` was last run on an older Source-B cut (positions arrive ~1 day after picks grade).`);
  out.push('');

  // ═════════════════════════════════════════════════════════════════
  // §2. Daily cumulative growth — proven roster per sport per day
  // ═════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §2. Daily cumulative proven-winner growth');
  out.push('');
  out.push('For each graded day D, the proven-winner roster is **recomputed using only data ≤ D**. This is the live whitelist you would have had at the end of that day. Format per cell: **proven** (CONFIRMED · FLAT).');
  out.push('');
  const headerCols = ['Date'];
  for (const sport of sports) headerCols.push(sport.toUpperCase());
  headerCols.push('TOTAL');
  out.push(mdHeader(headerCols));
  for (const D of dates) {
    const row = [D];
    let dayTotal = 0;
    for (const sport of sports) {
      const map = aggregateBy(walletBets, positions, sport, D);
      const c = provenCounts(map);
      row.push(`**${c.proven}** (${c.confirmed}·${c.flat})`);
      dayTotal += c.proven;
    }
    row.push(`**${dayTotal}**`);
    out.push(`| ${row.join(' | ')} |`);
  }
  out.push('');
  out.push('Day-over-day deltas are inferred from the column climbs. A flat sport across multiple days = no new graduations that week.');
  out.push('');

  // ═════════════════════════════════════════════════════════════════
  // §3. Pipeline funnel — why does sport X lag?
  // ═════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §3. Pipeline funnel — where each sport leaks');
  out.push('');
  out.push('Each row counts wallets surviving each gate, in order. The biggest drop tells you the bottleneck. Gates:');
  out.push('');
  out.push('1. **Seen** — wallet placed ≥ 1 bet in the sport (in any source)');
  out.push(`2. **Eligible** — wallet has ≥ ${MIN_BETS} graded picks (Source A) — required for FLAT/CONFIRMED`);
  out.push('3. **Flat-OK** — eligible AND flat ROI > 0 (becomes FLAT or better)');
  out.push('4. **$-OK** — Flat-OK AND has ≥' + MIN_BETS + ' positions with dollar ROI > 0 (CONFIRMED)');
  out.push('5. **Promoted** — final whitelisted: CONFIRMED + FLAT (also = §1 Proven)');
  out.push('');
  out.push(mdHeader(['Sport', '1·Seen', '2·Eligible (% of Seen)', '3·Flat-OK (% of Eligible)', '4·$-OK (% of Flat-OK)', '5·Promoted', 'Bottleneck']));
  for (const sport of sports) {
    const map = snapshot[sport].map;
    const seen = map.size;
    const eligible = [...map.values()].filter(r => r.picksN >= MIN_BETS).length;
    const flatOk   = [...map.values()].filter(r => r.picksN >= MIN_BETS && (r.flatPnl / r.picksN) > 0).length;
    const dollarOk = [...map.values()].filter(r => r.picksN >= MIN_BETS && (r.flatPnl / r.picksN) > 0
                                                    && r.posN >= MIN_BETS && r.posInvested > 0 && (r.posPnl / r.posInvested) > 0).length;
    const promoted = snapshot[sport].counts.proven;
    // Identify the largest %-drop.
    const drops = [
      { gate: 'sample (Seen→Eligible)', drop: seen > 0 ? 1 - eligible / seen : 0 },
      { gate: 'edge (Eligible→Flat-OK)', drop: eligible > 0 ? 1 - flatOk / eligible : 0 },
      // Flat→Promoted captures wallets that have flat-edge but no/insufficient
      // position data (Source B) — reframed as a "data-coverage" leakage.
      { gate: 'data (Flat-OK→Promoted)', drop: flatOk > 0 ? 1 - promoted / flatOk : 0 },
    ];
    const worst = drops.reduce((a, b) => b.drop > a.drop ? b : a);
    const cellPct = (n, base) => base > 0 ? `${n} (${(n / base * 100).toFixed(0)}%)` : `${n} (—)`;
    out.push(`| ${sport.toUpperCase()} | ${seen} | ${cellPct(eligible, seen)} | ${cellPct(flatOk, eligible)} | ${cellPct(dollarOk, flatOk)} | **${promoted}** | ${worst.gate} ${(worst.drop * 100).toFixed(0)}% |`);
  }
  out.push('');
  out.push('**Reading the bottleneck:**');
  out.push('- `sample` — too few wallets are placing ≥' + MIN_BETS + ' bets per sport. Slate density problem (more games / more whales needed).');
  out.push('- `edge` — wallets are getting reps but losing flat. The cohort placing here is just not sharp enough yet, OR variance is hiding signal in the small sample.');
  out.push('- `data` — wallets clear the flat bar in Source A but Source B (sharp_action_positions) is missing or negative. CONFIRMED requires both — FLAT-only wallets count toward proven even without dollar data.');
  out.push('');

  // ═════════════════════════════════════════════════════════════════
  // §4. Bubble wallets per sport — next-up graduation pipeline
  // ═════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §4. Bubble wallets — who graduates next');
  out.push('');
  out.push('Wallets currently NOT promoted but close enough that one or two more reps could push them over. Two flavors:');
  out.push('');
  out.push('- **One-bet-away** — has 1 graded bet in the sport (won), needs one more positive bet to clear MIN=' + MIN_BETS + ' AND flat-positive.');
  out.push('- **Just-under** — has ≥' + MIN_BETS + ' graded bets but flat ROI is between −10% and 0% (one win flips them).');
  out.push('');
  for (const sport of sports) {
    const map = snapshot[sport].map;
    const oneBet = [...map.values()].filter(r => r.picksN === 1 && r.picksWins === 1)
      .sort((a, b) => b.flatPnl - a.flatPnl).slice(0, 8);
    const justUnder = [...map.values()].filter(r => r.picksN >= MIN_BETS).map(r => {
      const fr = (r.flatPnl / r.picksN) * 100;
      return { ...r, flatRoi: fr };
    }).filter(r => r.flatRoi > -10 && r.flatRoi <= 0)
      .sort((a, b) => b.flatRoi - a.flatRoi).slice(0, 8);
    if (oneBet.length === 0 && justUnder.length === 0) continue;
    out.push(`### ${sport.toUpperCase()}`);
    out.push('');
    if (oneBet.length) {
      out.push('**One-bet-away (won the only bet)**');
      out.push('');
      out.push(mdHeader(['wallet', 'picksN', 'flat PnL', 'pos N', 'pos $ROI']));
      for (const r of oneBet) {
        const dr = r.posN > 0 && r.posInvested > 0 ? `${(r.posPnl / r.posInvested * 100).toFixed(0)}%` : '—';
        out.push(`| \`...${r.wallet.slice(-4)}\` | ${r.picksN} | ${sign(r.flatPnl, 2)} | ${r.posN} | ${dr} |`);
      }
      out.push('');
    }
    if (justUnder.length) {
      out.push('**Just-under (≥' + MIN_BETS + ' bets, flat ROI ∈ (−10%, 0%])**');
      out.push('');
      out.push(mdHeader(['wallet', 'picksN', 'WR', 'flat ROI', 'pos N', 'pos $ROI']));
      for (const r of justUnder) {
        const wr = (r.picksWins / r.picksN * 100).toFixed(0);
        const dr = r.posN > 0 && r.posInvested > 0 ? `${(r.posPnl / r.posInvested * 100).toFixed(0)}%` : '—';
        out.push(`| \`...${r.wallet.slice(-4)}\` | ${r.picksN} | ${wr}% | ${sign(r.flatRoi)}% | ${r.posN} | ${dr} |`);
      }
      out.push('');
    }
  }

  // ═════════════════════════════════════════════════════════════════
  // §5. Slate density — picks/day, wallets/pick, observations
  // ═════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §5. Slate density per sport (the structural reason)');
  out.push('');
  out.push('How much **wallet observation volume** each sport produces. A sport with 1.0 picks/day and 4 wallets/pick simply cannot graduate winners as fast as one with 6 picks/day and 9 wallets/pick — even if the underlying skill distribution is identical.');
  out.push('');
  out.push(mdHeader(['Sport', 'Graded picks', 'Days w/ activity', 'Picks/day', 'Wallet-bets', 'Wallets/pick', 'Avg wallet sample']));
  for (const sport of sports) {
    const sportBets = walletBets.filter(b => b.sport === sport);
    const gameKeys = new Set(sportBets.map(b => b.gameKey));
    const sportDates = new Set(sportBets.map(b => b.date));
    const picks = gameKeys.size;
    const days = sportDates.size;
    const obs = sportBets.length;
    const picksPerDay = days > 0 ? (picks / days).toFixed(2) : '—';
    const walletsPerPick = picks > 0 ? (obs / picks).toFixed(2) : '—';
    const map = snapshot[sport].map;
    const avgSample = map.size > 0 ? ([...map.values()].reduce((s, r) => s + r.picksN, 0) / map.size).toFixed(2) : '—';
    out.push(`| ${sport.toUpperCase()} | ${picks} | ${days} | ${picksPerDay} | ${obs} | ${walletsPerPick} | ${avgSample} |`);
  }
  out.push('');
  out.push('A sport with low **avg wallet sample** (< ~2.5) cannot graduate many wallets to FLAT/CONFIRMED no matter how good the wallets are — they simply haven\'t hit MIN=' + MIN_BETS + ' bets yet. This is the dominant lag mechanism early in a season.');
  out.push('');

  // ═════════════════════════════════════════════════════════════════
  // §6. Verdict — plain-English diagnosis per sport
  // ═════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §6. Plain-English verdict per sport');
  out.push('');
  // First find the leader to anchor relative comparisons.
  const sortedByProven = [...sports].sort((a, b) => snapshot[b].counts.proven - snapshot[a].counts.proven);
  const leader = sortedByProven[0];
  for (const sport of sortedByProven) {
    const c = snapshot[sport].counts;
    const map = snapshot[sport].map;
    const eligible = [...map.values()].filter(r => r.picksN >= MIN_BETS).length;
    const flatOk = [...map.values()].filter(r => r.picksN >= MIN_BETS && (r.flatPnl / r.picksN) > 0).length;
    const seen = map.size;
    const sportBets = walletBets.filter(b => b.sport === sport);
    const days = new Set(sportBets.map(b => b.date)).size;
    const picks = new Set(sportBets.map(b => b.gameKey)).size;
    const picksPerDay = days > 0 ? picks / days : 0;
    const avgSample = map.size > 0 ? [...map.values()].reduce((s, r) => s + r.picksN, 0) / map.size : 0;

    let verdict;
    if (sport === leader) {
      verdict = `**Leader.** ${c.proven} proven wallets (${c.confirmed} CONFIRMED · ${c.flat} FLAT). ${picksPerDay.toFixed(1)} picks/day with ${avgSample.toFixed(1)} avg wallet sample is comfortable — graduation curve is healthy.`;
    } else {
      const lag = snapshot[leader].counts.proven - c.proven;
      const reasons = [];
      if (avgSample < 2) reasons.push(`average wallet only has ${avgSample.toFixed(1)} graded bets — most aren't yet eligible (need ≥${MIN_BETS})`);
      if (eligible > 0 && flatOk / eligible < 0.5) reasons.push(`only ${(flatOk / eligible * 100).toFixed(0)}% of eligible wallets are flat-positive in this sample (variance or genuinely soft cohort)`);
      if (picksPerDay < 1.5) reasons.push(`slate density is light at ${picksPerDay.toFixed(1)} picks/day — fewer chances for wallets to accumulate sample`);
      if (flatOk > 0 && c.proven / flatOk < 0.7) reasons.push(`Source B (positions) coverage is thin — many flat-positive wallets don\'t have dollar-side data to upgrade to CONFIRMED`);
      if (reasons.length === 0) reasons.push('within striking distance of the leader; one more graded slate likely closes the gap');
      verdict = `Lags leader by **${lag}** wallets. ${reasons.join('; ')}.`;
    }
    out.push(`- **${sport.toUpperCase()}** — ${verdict}`);
  }
  out.push('');

  // ─── Write output ───
  const outPath = join(__dirname, '..', 'WALLET_PROVEN_GROWTH.md');
  writeFileSync(outPath, out.join('\n'));
  console.log(`\nReport written → ${outPath}`);
  console.log(`Sections: §1 snapshot · §2 daily growth · §3 funnel · §4 bubbles · §5 density · §6 verdict.`);

  // Terminal headline.
  console.log('\nProven-winner snapshot:');
  for (const sport of sortedByProven) {
    const c = snapshot[sport].counts;
    console.log(`  ${sport.toUpperCase().padEnd(4)} → ${String(c.proven).padStart(3)} proven (${c.confirmed} CONFIRMED · ${c.flat} FLAT)  out of ${c.total} wallets seen`);
  }

  process.exit(0);
})();
