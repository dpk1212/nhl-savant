#!/usr/bin/env node
/**
 * 4u+ infection audit — do sub-4 toxic patterns also live on 4u+ tickets?
 *
 * Flags (same family as flinch / maxSR sub-4 mutes, which EXEMPT units≥4):
 *   - tape FAIL_OPEN
 *   - max FOR sizeRatio < 1
 *   - tape BOOST (size-up signal)
 *   - EDGE ≥ 10
 *
 * Usage: node scripts/audit4uInfection.mjs
 * Needs FIREBASE_* env (same as dailyAgsUReport).
 */
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

function initDb() {
  if (admin.apps.length) return admin.firestore();
  const sakPath = join(REPO_ROOT, 'serviceAccountKey.json');
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
  return admin.firestore();
}

function maxForSR(walletDetails, sideKey) {
  if (sideKey == null || sideKey === '') return null;
  const list = Array.isArray(walletDetails)
    ? walletDetails
    : (walletDetails && typeof walletDetails === 'object' ? Object.values(walletDetails) : []);
  if (!list.length) return null;
  const side = String(sideKey);
  let mx = null;
  for (const w of list) {
    if (!w || typeof w !== 'object') continue;
    if (String(w.side || '') !== side) continue;
    if (w.direction != null && String(w.direction).toUpperCase() !== 'FOR') continue;
    const sr = Number(w.sizeRatio ?? w.v8_sizeRatio ?? w.betMultiplier);
    if (!Number.isFinite(sr)) continue;
    if (mx == null || sr > mx) mx = sr;
  }
  return mx;
}

function profitOf(units, odds, won) {
  if (!(units > 0) || !Number.isFinite(odds)) return 0;
  return won ? (odds < 0 ? units * (100 / Math.abs(odds)) : units * (odds / 100)) : -units;
}

function agg(rows) {
  const n = rows.length;
  if (!n) return { n: 0, w: 0, l: 0, wr: null, stake: 0, pnl: 0, roi: null };
  let w = 0, l = 0, stake = 0, pnl = 0;
  for (const r of rows) {
    if (r.won) w += 1; else l += 1;
    stake += r.units;
    pnl += r.profit;
  }
  const decided = w + l;
  return {
    n,
    w,
    l,
    wr: decided ? (100 * w) / decided : null,
    stake,
    pnl,
    roi: stake > 0 ? (100 * pnl) / stake : null,
  };
}

function fmt(a) {
  if (!a.n) return 'n=0';
  const wr = a.wr == null ? '—' : `${a.wr.toFixed(1)}%`;
  const roi = a.roi == null ? '—' : `${a.roi >= 0 ? '+' : ''}${a.roi.toFixed(1)}%`;
  return `n=${a.n}  ${a.w}-${a.l}  WR=${wr}  stake=${a.stake.toFixed(1)}u  PnL=${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(2)}u  ROI=${roi}`;
}

async function main() {
  const db = initDb();
  const cols = ['lockedPicks', 'lockedPicks_archive'];
  const rows = [];

  for (const col of cols) {
    let snap;
    try {
      snap = await db.collection(col).get();
    } catch (e) {
      console.warn(`skip ${col}: ${e.message}`);
      continue;
    }
    for (const doc of snap.docs) {
      const d = doc.data() || {};
      const date = d.date || d.pickDate || (doc.id || '').slice(0, 10);
      if (typeof date !== 'string' || date < '2026-06-01') continue;
      const status = d.status || d.result?.status || '';
      const outcome = d.result?.outcome || d.outcome || '';
      const wonRaw = d.result?.won ?? d.won;
      let won = null;
      if (wonRaw === true || outcome === 'WIN' || outcome === 'W') won = true;
      else if (wonRaw === false || outcome === 'LOSS' || outcome === 'L') won = false;
      if (won == null && status !== 'COMPLETED') continue;
      if (won == null) continue;

      const sideKey = d.side || d.pickSide || d.v8_side || null;
      const sides = d.sides || {};
      const sd = (sideKey && sides[sideKey]) || sides.home || sides.away || {};
      const units = Number(sd.finalUnits ?? sd.v8_agsUnitsApplied ?? d.units ?? 0);
      if (!(units > 0)) continue;

      const odds = Number(sd.odds ?? sd.v8_odds ?? d.odds ?? d.peakOdds);
      const tapeAction = String(sd.v8_tapeAction || d.v8_tapeAction || '').toUpperCase().replace(/-/g, '_');
      const edge = Number(sd.v8_winnerAlignEdge ?? sd.v8_edge ?? d.v8_winnerAlignEdge);
      const tier = sd.v8_agsTier || sd.tier || d.agsTier || d.tier || null;
      const maxSR = maxForSR(d.walletDetails || sd.walletDetails, sideKey || d.side);
      const profit = profitOf(units, odds, won);

      rows.push({
        id: doc.id,
        date,
        units,
        won,
        profit,
        odds,
        tapeAction,
        edge: Number.isFinite(edge) ? edge : null,
        tier,
        maxSR,
        path: sd.v8_stakePath || sd.stakePath || d.stakePath || null,
        ge4: units >= 4,
      });
    }
  }

  const ge4 = rows.filter((r) => r.ge4);
  const lt4 = rows.filter((r) => !r.ge4);
  const from = '2026-07-15'; // tape era
  const ge4Tape = ge4.filter((r) => r.date >= from);
  const lt4Tape = lt4.filter((r) => r.date >= from);

  const flag = {
    fail_open: (r) => r.tapeAction === 'FAIL_OPEN',
    maxsr_lt1: (r) => r.maxSR != null && r.maxSR < 1,
    boost: (r) => r.tapeAction === 'BOOST',
    edge_ge10: (r) => r.edge != null && r.edge >= 10,
    clean: (r) => r.tapeAction !== 'FAIL_OPEN' && !(r.maxSR != null && r.maxSR < 1),
  };

  const lines = [];
  const out = (s) => { lines.push(s); console.log(s); };

  out('# 4u+ infection audit');
  out(`Generated: ${new Date().toISOString()}`);
  out(`Graded staked rows ≥2026-06-01: ${rows.length} (4u+: ${ge4.length}, sub-4: ${lt4.length})`);
  out(`Tape-era window ≥${from}: 4u+ ${ge4Tape.length} · sub-4 ${lt4Tape.length}`);
  out('');
  out('## Code fence reminder');
  out('Flinch + maxSR mutes EXEMPT units≥4. Same flags can still ship on 4u+.');
  out('');

  out('## 4u+ vs sub-4 by flag (tape era)');
  out('| Flag | 4u+ | sub-4 |');
  out('|------|-----|-------|');
  for (const [name, fn] of Object.entries(flag)) {
    const a = agg(ge4Tape.filter(fn));
    const b = agg(lt4Tape.filter(fn));
    out(`| ${name} | ${fmt(a)} | ${fmt(b)} |`);
  }

  out('');
  out('## 4u+ ONLY — infection vs clean (tape era)');
  const infected = ge4Tape.filter((r) => flag.fail_open(r) || flag.maxsr_lt1(r));
  const clean4 = ge4Tape.filter(flag.clean);
  out(`Infected (FAIL_OPEN OR maxSR<1): ${fmt(agg(infected))}`);
  out(`Clean (not FAIL_OPEN and not maxSR<1): ${fmt(agg(clean4))}`);
  out(`All 4u+: ${fmt(agg(ge4Tape))}`);

  out('');
  out('## 4u+ FAIL_OPEN by tier/path (tape era)');
  const fo = ge4Tape.filter(flag.fail_open);
  const byTier = new Map();
  for (const r of fo) {
    const k = r.tier || r.path || 'unknown';
    if (!byTier.has(k)) byTier.set(k, []);
    byTier.get(k).push(r);
  }
  for (const [k, rs] of [...byTier.entries()].sort((a, b) => b[1].length - a[1].length)) {
    out(`- ${k}: ${fmt(agg(rs))}`);
  }

  out('');
  out('## 4u+ maxSR<1 by tier (tape era)');
  const weak = ge4Tape.filter(flag.maxsr_lt1);
  const byT2 = new Map();
  for (const r of weak) {
    const k = r.tier || r.path || 'unknown';
    if (!byT2.has(k)) byT2.set(k, []);
    byT2.get(k).push(r);
  }
  for (const [k, rs] of [...byT2.entries()].sort((a, b) => b[1].length - a[1].length)) {
    out(`- ${k}: ${fmt(agg(rs))}`);
  }

  out('');
  out('## Post sub-4-mute window (4u+ only, date≥2026-08-19)');
  const post = ge4.filter((r) => r.date >= '2026-08-19');
  out(`All 4u+ post: ${fmt(agg(post))}`);
  out(`Infected post: ${fmt(agg(post.filter((r) => flag.fail_open(r) || flag.maxsr_lt1(r))))}`);
  out(`Clean post: ${fmt(agg(post.filter(flag.clean)))}`);
  out(`FAIL_OPEN post: ${fmt(agg(post.filter(flag.fail_open)))}`);
  out(`maxSR<1 post: ${fmt(agg(post.filter(flag.maxsr_lt1)))}`);

  const outPath = join(REPO_ROOT, 'tmp_4u_infection_audit.md');
  writeFileSync(outPath, lines.join('\n') + '\n');
  out('');
  out(`Wrote ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
