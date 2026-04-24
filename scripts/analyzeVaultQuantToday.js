/**
 * analyzeVaultQuantToday.js — read-only analysis of how today's graded
 * sharp_action_positions performed against the hidden vault_quantScore.
 *
 * Usage:
 *   node scripts/analyzeVaultQuantToday.js                  # today
 *   node scripts/analyzeVaultQuantToday.js --date=2026-04-20
 *   node scripts/analyzeVaultQuantToday.js --since=2026-04-19
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const argv = process.argv.slice(2);
const dateArg = argv.find(a => a.startsWith('--date='));
const sinceArg = argv.find(a => a.startsWith('--since='));
const TODAY = new Date().toISOString().slice(0, 10);
const DATE = dateArg ? dateArg.split('=')[1] : (sinceArg ? null : TODAY);
const SINCE = sinceArg ? sinceArg.split('=')[1] : null;

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

const americanToProfit = (odds, outcome, units = 1) => {
  if (outcome === 'PUSH') return 0;
  if (outcome !== 'WIN') return -units;
  return odds > 0 ? units * (odds / 100) : units * (100 / Math.abs(odds));
};

async function main() {
  const filter = SINCE ? `date >= ${SINCE}` : `date == ${DATE}`;
  console.log(`\n=== Vault Quant Score — graded picks (${filter}) ===\n`);

  let q = db.collection('sharp_action_positions').where('status', '==', 'GRADED');
  if (DATE) q = q.where('date', '==', DATE);
  if (SINCE) q = q.where('date', '>=', SINCE);

  const snap = await q.get();
  const all = [];
  snap.forEach(d => all.push({ _id: d.id, ...d.data() }));

  const scored = all.filter(p => p.vault_quantScore != null);
  const unscored = all.length - scored.length;

  console.log(`Loaded ${all.length} graded positions  (scored=${scored.length}, missing vault_*=${unscored})\n`);

  if (scored.length === 0) {
    console.log('No scored graded positions yet — backfill may not have run for this window.');
    return;
  }

  // Per-position outcome — use real settled odds (best retail) + 1u flat staking
  const enriched = scored.map(p => {
    const odds = p.bestRetailOdds ?? p.pinnacleOdds ?? -110;
    const outcome = p.result || (p.outcome || '').toUpperCase();
    const profit = americanToProfit(odds, outcome, 1);
    return { ...p, _odds: odds, _outcome: outcome, _profit: profit };
  });

  // Bucket by score
  const buckets = new Map();
  for (const p of enriched) {
    const k = p.vault_quantScore;
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k).push(p);
  }

  console.log('── By score bucket ──');
  console.log('score  label        N    W    L    P    WR%     u P/L     ROI%');
  const rows = Array.from(buckets.entries()).sort((a, b) => b[0] - a[0]);
  for (const [score, ps] of rows) {
    const label = ps[0].vault_quantLabel || '?';
    const w = ps.filter(p => p._outcome === 'WIN').length;
    const l = ps.filter(p => p._outcome === 'LOSS').length;
    const pu = ps.filter(p => p._outcome === 'PUSH').length;
    const wr = (w + l) > 0 ? ((w / (w + l)) * 100).toFixed(1) : 'n/a';
    const pnl = ps.reduce((s, p) => s + p._profit, 0);
    const stake = ps.length;
    const roi = stake > 0 ? ((pnl / stake) * 100).toFixed(1) : 'n/a';
    console.log(`${String(score).padEnd(6)} ${label.padEnd(11)} ${String(ps.length).padStart(4)} ${String(w).padStart(4)} ${String(l).padStart(4)} ${String(pu).padStart(4)} ${String(wr).padStart(6)}  ${pnl.toFixed(2).padStart(7)}u ${String(roi).padStart(7)}`);
  }

  // Tier rollup
  console.log('\n── By tier rollup ──');
  console.log('tier                 N    W    L    P    WR%     u P/L     ROI%');
  const tiers = [
    { name: 'ELITE+STRONG (4-5)',   min: 4.0 },
    { name: 'SOLID (3-3.5)',         min: 3.0, max: 3.5 },
    { name: 'DEVELOPING (2-2.5)',    min: 2.0, max: 2.5 },
    { name: 'MUTED (1-1.5)',         min: 1.0, max: 1.5 },
  ];
  for (const t of tiers) {
    const ps = enriched.filter(p => p.vault_quantScore >= (t.min ?? 0) && p.vault_quantScore <= (t.max ?? 99));
    const w = ps.filter(p => p._outcome === 'WIN').length;
    const l = ps.filter(p => p._outcome === 'LOSS').length;
    const pu = ps.filter(p => p._outcome === 'PUSH').length;
    const wr = (w + l) > 0 ? ((w / (w + l)) * 100).toFixed(1) : 'n/a';
    const pnl = ps.reduce((s, p) => s + p._profit, 0);
    const roi = ps.length > 0 ? ((pnl / ps.length) * 100).toFixed(1) : 'n/a';
    console.log(`${t.name.padEnd(20)} ${String(ps.length).padStart(4)} ${String(w).padStart(4)} ${String(l).padStart(4)} ${String(pu).padStart(4)} ${String(wr).padStart(6)}  ${pnl.toFixed(2).padStart(7)}u ${String(roi).padStart(7)}`);
  }

  // Total
  const totalW = enriched.filter(p => p._outcome === 'WIN').length;
  const totalL = enriched.filter(p => p._outcome === 'LOSS').length;
  const totalP = enriched.filter(p => p._outcome === 'PUSH').length;
  const totalPnl = enriched.reduce((s, p) => s + p._profit, 0);
  const totalWr = (totalW + totalL) > 0 ? ((totalW / (totalW + totalL)) * 100).toFixed(1) : 'n/a';
  const totalRoi = enriched.length > 0 ? ((totalPnl / enriched.length) * 100).toFixed(1) : 'n/a';
  console.log(`${'TOTAL'.padEnd(20)} ${String(enriched.length).padStart(4)} ${String(totalW).padStart(4)} ${String(totalL).padStart(4)} ${String(totalP).padStart(4)} ${String(totalWr).padStart(6)}  ${totalPnl.toFixed(2).padStart(7)}u ${String(totalRoi).padStart(7)}`);

  // Margin contribution breakdown
  console.log('\n── By winners margin (Δ_winner) ──');
  console.log('Δ_winner   N    W    L    WR%     u P/L     ROI%');
  const wmBuckets = new Map();
  for (const p of enriched) {
    const k = p.vault_winnerMargin;
    if (!wmBuckets.has(k)) wmBuckets.set(k, []);
    wmBuckets.get(k).push(p);
  }
  Array.from(wmBuckets.entries()).sort((a, b) => b[0] - a[0]).forEach(([k, ps]) => {
    const w = ps.filter(p => p._outcome === 'WIN').length;
    const l = ps.filter(p => p._outcome === 'LOSS').length;
    const wr = (w + l) > 0 ? ((w / (w + l)) * 100).toFixed(1) : 'n/a';
    const pnl = ps.reduce((s, p) => s + p._profit, 0);
    const roi = ps.length > 0 ? ((pnl / ps.length) * 100).toFixed(1) : 'n/a';
    console.log(`${String(k).padStart(7)}   ${String(ps.length).padStart(3)} ${String(w).padStart(4)} ${String(l).padStart(4)} ${String(wr).padStart(6)}  ${pnl.toFixed(2).padStart(7)}u ${String(roi).padStart(7)}`);
  });

  console.log('\n── By quality margin (Δ_quality, T=30) ──');
  console.log('Δ_qual    N    W    L    WR%     u P/L     ROI%');
  const qmBuckets = new Map();
  for (const p of enriched) {
    const k = p.vault_qualityMargin;
    if (!qmBuckets.has(k)) qmBuckets.set(k, []);
    qmBuckets.get(k).push(p);
  }
  Array.from(qmBuckets.entries()).sort((a, b) => b[0] - a[0]).forEach(([k, ps]) => {
    const w = ps.filter(p => p._outcome === 'WIN').length;
    const l = ps.filter(p => p._outcome === 'LOSS').length;
    const wr = (w + l) > 0 ? ((w / (w + l)) * 100).toFixed(1) : 'n/a';
    const pnl = ps.reduce((s, p) => s + p._profit, 0);
    const roi = ps.length > 0 ? ((pnl / ps.length) * 100).toFixed(1) : 'n/a';
    console.log(`${String(k).padStart(6)}   ${String(ps.length).padStart(3)} ${String(w).padStart(4)} ${String(l).padStart(4)} ${String(wr).padStart(6)}  ${pnl.toFixed(2).padStart(7)}u ${String(roi).padStart(7)}`);
  });

  // Pick-by-pick listing (sorted by score desc)
  console.log('\n── Pick-by-pick (sorted by score) ──');
  console.log('score  label        sport mkt  side  team           wallet  Δw  Δq   odds  outcome  profit');
  enriched
    .sort((a, b) => b.vault_quantScore - a.vault_quantScore || a.sport.localeCompare(b.sport))
    .forEach(p => {
      const out = p._outcome.padEnd(7);
      const profStr = p._profit >= 0 ? `+${p._profit.toFixed(2)}` : p._profit.toFixed(2);
      const team = (p.teamName || '').padEnd(14).slice(0, 14);
      console.log(
        `${String(p.vault_quantScore).padEnd(6)} ${(p.vault_quantLabel || '?').padEnd(11)} ${(p.sport || '').padEnd(5)} ${(p.marketType || '').padEnd(4)} ${(p.side || '').padEnd(5)} ${team} ${p.walletShort?.padEnd(7) || '???    '} ${String(p.vault_winnerMargin).padStart(2)}  ${String(p.vault_qualityMargin).padStart(2)}  ${String(p._odds).padStart(5)}  ${out}  ${profStr.padStart(6)}u`
      );
    });
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
