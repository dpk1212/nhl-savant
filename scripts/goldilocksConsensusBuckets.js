/**
 * Local hypothesis drill: "Goldilocks" consensus — multiple sharps on the
 * same side (V8 consensus) with elevated per-wallet sizing (betMultiplier).
 *
 * Run from repo root (needs Firebase creds like other scripts):
 *   cd nhl-savant && node scripts/goldilocksConsensusBuckets.js
 *
 * Optional:
 *   node scripts/goldilocksConsensusBuckets.js --json
 *   node scripts/goldilocksConsensusBuckets.js --min-n=8   # hide sport/market cells below N
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

function initFirebase() {
  if (!admin.apps.length) {
    const sakPath = join(__dirname, '../serviceAccountKey.json');
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
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}

function avg(a) {
  return a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0;
}

function median(sortedCopy) {
  const a = [...sortedCopy].sort((x, y) => x - y);
  if (!a.length) return null;
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}

function quantile(sortedValues, q) {
  const a = [...sortedValues].sort((x, y) => x - y);
  if (a.length === 0) return null;
  const pos = (a.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  if (lo === hi) return a[lo];
  return a[lo] + (a[hi] - a[lo]) * (pos - lo);
}

function agg(rows) {
  if (!rows.length) return null;
  const wins = rows.filter(r => r.won).length;
  const inv = rows.reduce((s, r) => s + r.invested, 0);
  const pnl = rows.reduce((s, r) => s + r.settledPnl, 0);
  const stakedRois = rows.map(r => r.stakedRoi).filter(x => x != null && isFinite(x));
  const beats = rows.map(r => r.beatEntry).filter(x => x != null && isFinite(x));
  return {
    n: rows.length,
    wr: wins / rows.length,
    poolRoi: inv > 0 ? pnl / inv : null,
    meanStakedRoi: stakedRois.length ? avg(stakedRois) : null,
    meanBeatEntry: beats.length ? avg(beats) : null,
    meanMult: avg(rows.map(r => r.betMultiplier || 0)),
    meanWps: avg(rows.map(r => r.v8_walletPlayScore).filter(x => x != null && isFinite(x))),
  };
}

function fmtPct(x) {
  if (x == null || !isFinite(x)) return '—';
  return (x * 100).toFixed(2) + '%';
}

function rowLine(label, a) {
  if (!a) return `${label.padEnd(42)} | (empty)`;
  return [
    label.padEnd(42),
    String(a.n).padStart(4),
    fmtPct(a.wr).padStart(8),
    fmtPct(a.poolRoi).padStart(10),
    fmtPct(a.meanStakedRoi).padStart(12),
    fmtPct(a.meanBeatEntry).padStart(10),
    a.meanMult.toFixed(2).padStart(6),
    (Number.isFinite(a.meanWps) ? a.meanWps.toFixed(2) : '—').padStart(6),
  ].join(' | ');
}

async function loadGradedConsensus(db) {
  const snap = await db.collection('sharp_action_positions').where('status', '==', 'GRADED').get();
  const rows = [];
  snap.forEach((d) => {
    const data = d.data();
    if (!data.result || data.result === 'PUSH') return;
    // Vault-only goldilocks analysis — exclude SHADOW. Missing field (pre-
    // shadow docs) treated as VAULT for backward compatibility.
    if (data.vaultQualified === false) return;
    const won = data.result === 'WIN' ? 1 : 0;
    const inv = data.invested || 0;
    const side = data.side;
    const consensus = data.v8_consensusSide;
    if (consensus == null || side !== consensus) return;

    const wf = data.v8_walletCountFor;
    if (wf == null || wf < 2) return;

    const avgPrice = data.avgPrice ?? 0;
    rows.push({
      id: d.id,
      walletCountFor: wf,
      betMultiplier: data.betMultiplier || 0,
      invested: inv,
      settledPnl: data.settledPnl || 0,
      stakedRoi: inv > 0 ? (data.settledPnl || 0) / inv : null,
      beatEntry: avgPrice > 0 && avgPrice < 1 ? won - avgPrice : null,
      won,
      marketType: data.marketType || '—',
      sport: data.sport || '—',
      v8_walletPlayScore: data.v8_walletPlayScore ?? null,
    });
  });
  return rows;
}

function walletBand(n) {
  if (n === 2) return '2 wallets';
  if (n === 3) return '3 wallets';
  return '4+ wallets';
}

function argNum(name, def) {
  const raw = process.argv.find((a) => a.startsWith(`${name}=`));
  if (!raw) return def;
  const v = Number(raw.split('=')[1]);
  return Number.isFinite(v) ? v : def;
}

async function loadAllGraded(db) {
  const snap = await db.collection('sharp_action_positions').where('status', '==', 'GRADED').get();
  const rows = [];
  snap.forEach((d) => {
    const data = d.data();
    if (!data.result || data.result === 'PUSH') return;
    // Vault-only goldilocks analysis — exclude SHADOW. Missing field (pre-
    // shadow docs) treated as VAULT for backward compatibility.
    if (data.vaultQualified === false) return;
    const won = data.result === 'WIN' ? 1 : 0;
    const inv = data.invested || 0;
    const avgPrice = data.avgPrice ?? 0;
    rows.push({
      won,
      invested: inv,
      settledPnl: data.settledPnl || 0,
      stakedRoi: inv > 0 ? (data.settledPnl || 0) / inv : null,
      beatEntry: avgPrice > 0 && avgPrice < 1 ? won - avgPrice : null,
    });
  });
  return rows;
}

async function main() {
  const asJson = process.argv.includes('--json');
  const minN = argNum('--min-n', 3);
  const db = initFirebase();
  const allGraded = await loadAllGraded(db);
  const rows = await loadGradedConsensus(db);

  if (!rows.length) {
    console.log('No graded consensus positions with v8_walletCountFor >= 2.');
    process.exit(0);
  }

  const baselineAll = agg(allGraded);

  const mults = rows.map(r => r.betMultiplier).filter((x) => x > 0);
  const medMult = median(mults);
  const p60 = quantile(mults, 0.6);
  const p75 = quantile(mults, 0.75);
  const baseline = agg(rows);

  const sizingDefs = [
    { key: 'mult_ge_median', label: `betMult ≥ median (${medMult?.toFixed(2) ?? '—'})`, test: (r) => r.betMultiplier >= (medMult ?? Infinity) },
    { key: 'mult_ge_p60', label: `betMult ≥ 60th pct (${p60?.toFixed(2) ?? '—'})`, test: (r) => r.betMultiplier >= (p60 ?? Infinity) },
    { key: 'mult_ge_p75', label: `betMult ≥ 75th pct (${p75?.toFixed(2) ?? '—'})`, test: (r) => r.betMultiplier >= (p75 ?? Infinity) },
    { key: 'mult_ge_2', label: 'betMult ≥ 2× wallet avg', test: (r) => r.betMultiplier >= 2 },
    { key: 'mult_ge_3', label: 'betMult ≥ 3× wallet avg', test: (r) => r.betMultiplier >= 3 },
  ];

  const bands = [
    { label: '2 wallets', test: (r) => r.walletCountFor === 2 },
    { label: '3 wallets', test: (r) => r.walletCountFor === 3 },
    { label: '4+ wallets', test: (r) => r.walletCountFor >= 4 },
  ];

  if (!asJson) {
    console.log('\n=== Goldilocks drill: consensus-side only, walletCountFor >= 2 ===\n');
    console.log(`All graded (any side): N=${allGraded.length} | pool ROI ${fmtPct(baselineAll.poolRoi)} | mean (W−p) ${fmtPct(baselineAll.meanBeatEntry)}`);
    console.log(`Population: N=${rows.length} (graded, non-push, on V8 consensus side)`);
    console.log(`Baseline (all these rows): WR ${fmtPct(baseline.wr)} | pool ROI ${fmtPct(baseline.poolRoi)} | mean staked ROI ${fmtPct(baseline.meanStakedRoi)} | mean (W−p) ${fmtPct(baseline.meanBeatEntry)} | mean betMult ${baseline.meanMult.toFixed(2)}\n`);
    console.log('Note: `sharp_action_positions` has no game-level regime flag; split by sport/market below if useful.\n');
  }

  const table = [];

  for (const sz of sizingDefs) {
    const sized = rows.filter(sz.test);
    const aSized = agg(sized);
    if (!asJson) {
      console.log('—'.repeat(100));
      console.log(`Sizing: ${sz.label}  →  N=${sized.length}`);
      if (aSized) console.log(rowLine('  ALL wallet counts', aSized));
    }
    for (const b of bands) {
      const sub = sized.filter((r) => b.test(r));
      const a = agg(sub);
      table.push({ sizing: sz.key, band: b.label, ...a, label: `${sz.label} & ${b.label}` });
      if (!asJson && a && a.n > 0) console.log(rowLine(`  ${b.label}`, a));
    }
    if (!asJson) console.log('');
  }

  // Within-band median: "above typical sizing *for that depth*"
  if (!asJson) {
    console.log('—'.repeat(100));
    console.log('Within-band sizing: betMult ≥ median(betMult) **within each wallet-count band** (Goldilocks-style)\n');
    const hdr = ['Bucket'.padEnd(42), '  N', '      WR', '  pool ROI', ' mean stkROI', '  mean W−p', '  mult', '   WPS'].join(' | ');
    console.log(hdr);
    console.log('-'.repeat(hdr.length));
    for (const b of bands) {
      const bandRows = rows.filter((r) => b.test(r));
      const m = median(bandRows.map((r) => r.betMultiplier).filter((x) => x > 0));
      const hi = bandRows.filter((r) => r.betMultiplier >= (m ?? Infinity));
      const a = agg(hi);
      console.log(rowLine(`${b.label} & mult≥in-band med (${m?.toFixed(2) ?? '—'})`, a));
    }
    console.log('');
  }

  // Sport × market quick sanity (consensus, 3+, mult≥median global)
  if (!asJson) {
    console.log('—'.repeat(100));
    console.log('Slice: 3+ wallets on consensus + betMult ≥ global median (by sport / market)\n');
    const sub = rows.filter((r) => r.walletCountFor >= 3 && r.betMultiplier >= (medMult ?? Infinity));
    const sports = [...new Set(sub.map((r) => r.sport))].sort();
    const mkts = [...new Set(sub.map((r) => r.marketType))].sort();
    for (const sp of sports) {
      for (const m of mkts) {
        const cell = sub.filter((r) => r.sport === sp && r.marketType === m);
        const a = agg(cell);
        if (a && a.n >= minN) console.log(rowLine(`${sp} / ${m}`, a));
      }
    }
  }

  if (asJson) {
    console.log(JSON.stringify({ baseline, slices: table }, null, 2));
  }

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
