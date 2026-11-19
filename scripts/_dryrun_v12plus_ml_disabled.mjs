/**
 * Dry-run: apply V12PLUS_ML_DISABLED to the locked book for a date range.
 *
 * Simulates flag-OFF vs flag-ON on each stamped side and reports:
 *   - every ML ends at 0u + mutedBy=v12plus-ml-disabled
 *   - spreads/totals unchanged
 *   - exact field diffs (must be ⊆ V12PLUS_ML_DIFF_FIELDS)
 *
 * Reads via public client SDK when available. Falls back to a local
 * fixture contract check if Firestore is unreachable.
 *
 * Usage:
 *   node scripts/_dryrun_v12plus_ml_disabled.mjs
 *   node scripts/_dryrun_v12plus_ml_disabled.mjs --from=2026-11-16 --to=2026-11-18
 */
import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import {
  V12PLUS_ML_DIFF_FIELDS,
  V12PLUS_ML_DISABLED_MUTED_BY,
  V12PLUS_ML_DISABLED_REASON,
  V12PLUS_ML_STAKE_DISABLED_FIELD,
  applyV12plusMlStakeDisable,
  isV12plusMlDisabled,
} from '../src/lib/v12plusMlDisabled.js';

const FROM = (process.argv.find((a) => a.startsWith('--from=')) || '--from=2026-11-16').slice(7);
const TO = (process.argv.find((a) => a.startsWith('--to=')) || '--to=2026-11-18').slice(5);

function datesInclusive(from, to) {
  const out = [];
  const cur = new Date(`${from}T12:00:00Z`);
  const end = new Date(`${to}T12:00:00Z`);
  while (cur <= end) {
    out.push(cur.toISOString().slice(0, 10));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

function unitTierLabel(units) {
  if (units >= 2.5) return 'MAX';
  if (units >= 1.5) return 'STRONG';
  return 'STANDARD';
}

/** Apply flag-on overlay to a stamped side; keep all non-diff fields. */
function applyFlagOn(side, market) {
  const unitsBefore = Number(side.finalUnits);
  const u0 = Number.isFinite(unitsBefore) && unitsBefore > 0 ? unitsBefore : 0;
  const out = applyV12plusMlStakeDisable({ market, units: u0 });
  if (!out.applied) {
    return { side: { ...side }, diffs: [], out };
  }
  const next = {
    ...side,
    finalUnits: 0,
    mutedBy: V12PLUS_ML_DISABLED_MUTED_BY,
    peak: { ...(side.peak || {}), units: 0, unitTier: unitTierLabel(0) },
    lock: { ...(side.lock || {}), units: 0, unitTier: unitTierLabel(0) },
    v8_agsUnitsApplied: 0,
    v8_agsV12UnitsApplied: 0,
    health: {
      ...(side.health || {}),
      status: 'MUTED',
      reasons: [
        V12PLUS_ML_DISABLED_REASON,
        ...((side.health?.reasons || []).filter((r) => r !== V12PLUS_ML_DISABLED_REASON)),
      ],
    },
    ...out.marker,
  };
  return { side: next, diffs: diffSides(side, next), out };
}

function diffSides(a, b) {
  const diffs = [];
  const keys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
  for (const k of keys) {
    if (k === 'peak' || k === 'lock' || k === 'health') {
      const ak = a?.[k] || {};
      const bk = b?.[k] || {};
      for (const nk of new Set([...Object.keys(ak), ...Object.keys(bk)])) {
        if (JSON.stringify(ak[nk]) !== JSON.stringify(bk[nk])) diffs.push(`${k}.${nk}`);
      }
      continue;
    }
    if (JSON.stringify(a?.[k]) !== JSON.stringify(b?.[k])) diffs.push(k);
  }
  return diffs;
}

function summarize(rows) {
  const by = { ML: empty(), SPREAD: empty(), TOTAL: empty() };
  for (const r of rows) {
    const s = by[r.market];
    s.sides += 1;
    if (r.unitsBefore > 0) { s.stakedBefore += 1; s.unitsBefore += r.unitsBefore; }
    if (r.unitsAfter > 0) { s.stakedAfter += 1; s.unitsAfter += r.unitsAfter; }
    if (r.mutedBefore) s.mutedBefore += 1;
    if (r.mutedAfter) s.mutedAfter += 1;
    if (r.lockBefore === 'LOCKED') s.lockedBefore += 1;
    if (r.lockAfter === 'LOCKED') s.lockedAfter += 1;
  }
  return by;
}

function empty() {
  return {
    sides: 0, stakedBefore: 0, unitsBefore: 0, stakedAfter: 0, unitsAfter: 0,
    mutedBefore: 0, mutedAfter: 0, lockedBefore: 0, lockedAfter: 0,
  };
}

const FIXTURES = [
  {
    market: 'ML',
    id: 'fixture_nhl_ml',
    side: 'home',
    sport: 'NHL',
    data: {
      lockStage: 'LOCKED',
      finalUnits: 4,
      mutedBy: null,
      v8_pressUnits: 4,
      v8_pressApplied: true,
      v8_pressRung: 'PRESS',
      v8_mlMini: true,
      v8_mlMiniUnits: 3,
      v8_mlPress: true,
      v8_mlPressUnits: 4,
      v8_hcStakeTier: 'ML-PRESS',
      v8_agsUnitsApplied: 4,
      v8_agsV12UnitsApplied: 4,
      peak: { units: 4, unitTier: 'MAX', odds: -150 },
      lock: { units: 4, unitTier: 'MAX', odds: -150 },
      health: { status: 'ACTIVE' },
    },
  },
  {
    market: 'SPREAD',
    id: 'fixture_nba_spread',
    side: 'away',
    sport: 'NBA',
    data: {
      lockStage: 'LOCKED',
      finalUnits: 3,
      mutedBy: null,
      v8_pressUnits: 3,
      v8_hcStakeTier: 'PRESS',
      v8_agsUnitsApplied: 3,
      v8_agsV12UnitsApplied: 3,
      peak: { units: 3, unitTier: 'MAX', odds: -110 },
      lock: { units: 3, unitTier: 'MAX', odds: -110 },
      health: { status: 'ACTIVE' },
    },
  },
  {
    market: 'TOTAL',
    id: 'fixture_nfl_total',
    side: 'over',
    sport: 'NFL',
    data: {
      lockStage: 'LOCKED',
      finalUnits: 2,
      mutedBy: null,
      v8_pressUnits: 2,
      v8_hcStakeTier: 'PRESS',
      v8_agsUnitsApplied: 2,
      v8_agsV12UnitsApplied: 2,
      peak: { units: 2, unitTier: 'STRONG', odds: -105 },
      lock: { units: 2, unitTier: 'STRONG', odds: -105 },
      health: { status: 'ACTIVE' },
    },
  },
];

function withTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

async function loadLiveSides(dates) {
  if (process.argv.includes('--fixture-only')) return null;
  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
  };
  if (!firebaseConfig.projectId || !firebaseConfig.apiKey) return null;
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const COLS = [
      ['sharpFlowPicks', 'ML'],
      ['sharpFlowSpreads', 'SPREAD'],
      ['sharpFlowTotals', 'TOTAL'],
    ];
    const rows = [];
    for (const [col, market] of COLS) {
      const snap = await withTimeout(
        getDocs(query(collection(db, col), where('date', 'in', dates))),
        8000,
        col,
      );
      for (const docSnap of snap.docs) {
        const data = docSnap.data() || {};
        for (const [side, sd] of Object.entries(data.sides || {})) {
          if (!sd || typeof sd !== 'object') continue;
          rows.push({
            market, id: docSnap.id, side, sport: data.sport, data: sd,
          });
        }
      }
    }
    return rows;
  } catch (err) {
    console.warn(`Firestore read failed: ${err.message}`);
    return null;
  }
}

const dates = datesInclusive(FROM, TO);
console.log('=== V12PLUS_ML_DISABLED dry-run ===');
console.log(`Dates: ${dates.join(', ')}`);
console.log(`Flag default: ${isV12plusMlDisabled() ? 'ON' : 'OFF'}`);
console.log(`Allowed ML diff fields:\n  ${V12PLUS_ML_DIFF_FIELDS.join('\n  ')}\n`);

let source = 'firestore';
let live = await loadLiveSides(dates);
if (!live || live.length === 0) {
  source = 'fixture';
  live = FIXTURES;
  console.log('Firestore unreachable or empty — using local fixtures for contract check.\n');
} else {
  console.log(`Loaded ${live.length} side(s) from Firestore.\n`);
}

const rows = [];
const unexpected = [];
const mlSamples = [];

for (const row of live) {
  const { side: after, diffs, out } = applyFlagOn(row.data, row.market);
  const unitsBefore = Number(row.data.finalUnits);
  const u0 = Number.isFinite(unitsBefore) && unitsBefore > 0 ? unitsBefore : 0;
  const rec = {
    market: row.market,
    id: row.id,
    side: row.side,
    sport: row.sport,
    unitsBefore: u0,
    unitsAfter: Number(after.finalUnits) || 0,
    mutedBefore: row.data.mutedBy || null,
    mutedAfter: after.mutedBy || null,
    lockBefore: row.data.lockStage || null,
    lockAfter: after.lockStage || null,
    diffs,
    applied: out.applied,
  };
  rows.push(rec);
  for (const d of diffs) {
    if (!V12PLUS_ML_DIFF_FIELDS.includes(d)) {
      unexpected.push({ ...rec, field: d });
    }
  }
  if (row.market === 'ML' && (u0 > 0 || out.applied)) {
    mlSamples.push(rec);
  }
}

const summary = summarize(rows);
const fmt = (n) => Math.round(n * 100) / 100;

console.log(`── Summary by market (source=${source}) ──`);
for (const m of ['ML', 'SPREAD', 'TOTAL']) {
  const s = summary[m];
  console.log(
    `${m}: sides=${s.sides}`
    + ` | staked ${s.stakedBefore}→${s.stakedAfter}`
    + ` | units ${fmt(s.unitsBefore)}→${fmt(s.unitsAfter)}`
    + ` | muted ${s.mutedBefore}→${s.mutedAfter}`
    + ` | LOCKED ${s.lockedBefore}→${s.lockedAfter}`,
  );
}

console.log('\n── ML samples (first 30) ──');
for (const r of mlSamples.slice(0, 30)) {
  console.log(
    `  ${r.sport || '?'} ${r.id}/${r.side}: ${r.unitsBefore}u/${r.lockBefore || '∅'}/${r.mutedBefore || '—'}`
    + ` → ${r.unitsAfter}u/${r.lockAfter || '∅'}/${r.mutedAfter || '—'}`
    + ` diffs=[${r.diffs.join(', ')}]`,
  );
}
if (mlSamples.length > 30) console.log(`  … +${mlSamples.length - 30} more`);

console.log('\n── Unexpected field diffs (must be empty) ──');
if (unexpected.length === 0) {
  console.log('  none');
} else {
  for (const u of unexpected.slice(0, 40)) {
    console.log(`  ${u.market} ${u.id}/${u.side}: ${u.field}`);
  }
}

const mlOk = summary.ML.stakedAfter === 0
  && summary.ML.unitsAfter === 0
  && mlSamples.every((r) => r.mutedAfter === V12PLUS_ML_DISABLED_MUTED_BY
    && r.lockAfter === r.lockBefore
    && r.unitsAfter === 0);
const stOk = summary.SPREAD.stakedAfter === summary.SPREAD.stakedBefore
  && summary.SPREAD.unitsAfter === summary.SPREAD.unitsBefore
  && summary.TOTAL.stakedAfter === summary.TOTAL.stakedBefore
  && summary.TOTAL.unitsAfter === summary.TOTAL.unitsBefore
  && rows.filter((r) => r.market !== 'ML').every((r) => r.diffs.length === 0);
const diffsOk = unexpected.length === 0;

console.log('\n── Verdict ──');
console.log(`  ML all 0u + mutedBy=${V12PLUS_ML_DISABLED_MUTED_BY} + lockStage unchanged: ${mlOk ? 'PASS' : 'FAIL'}`);
console.log(`  Spread/Total byte-identical: ${stOk ? 'PASS' : 'FAIL'}`);
console.log(`  Diff fields ⊆ allowlist: ${diffsOk ? 'PASS' : 'FAIL'}`);
console.log(`  Marker field present on ML: ${V12PLUS_ML_STAKE_DISABLED_FIELD}`);

if (!mlOk || !stOk || !diffsOk || !isV12plusMlDisabled()) process.exit(2);
console.log('\nDone.');
