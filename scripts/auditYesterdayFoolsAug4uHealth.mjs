#!/usr/bin/env node
/**
 * Yesterday (ET) recap + FOOLS mute CF + August 4u+ volume health.
 *
 * Universe: AGS-U promoted, COMPLETED WIN/LOSS, not tracked.
 * Live book = finalUnits > 0. FOOLS mute CF = mutedBy=fools-gold-flat
 * graded at v8_unitsPreFoolsGold (or unitsPrePolicy stamp).
 *
 * Usage: node scripts/auditYesterdayFoolsAug4uHealth.mjs
 *        YESTERDAY=2026-08-25 node scripts/auditYesterdayFoolsAug4uHealth.mjs
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { config as loadEnv } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
loadEnv({ path: join(REPO_ROOT, '.env.local') });
loadEnv({ path: join(REPO_ROOT, '.env') });

const AUG_FROM = '2026-08-01';
const AUG_TO = '2026-08-31';
const AGSU_PREFIX = 'ags-unified';
const FOOLS_MUTED_BY = 'fools-gold-flat';
const PICK_COLLECTIONS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];

function etToday() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}
function etYesterday() {
  if (process.env.YESTERDAY) return process.env.YESTERDAY;
  const [y, m, d] = etToday().split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - 1);
  return dt.toISOString().slice(0, 10);
}

function initDb() {
  return getFirestore(initializeApp({
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
  }));
}

function profitOf(units, odds, won) {
  if (!(units > 0) || !Number.isFinite(odds) || !odds) return 0;
  return won ? (odds < 0 ? units * (100 / Math.abs(odds)) : units * (odds / 100)) : -units;
}

function agg(rows, unitsKey = 'units', profitKey = 'profit') {
  let w = 0; let l = 0; let stake = 0; let pnl = 0;
  for (const r of rows) {
    const u = r[unitsKey];
    const p = r[profitKey];
    if (!(u > 0)) continue;
    if (r.won) w += 1; else l += 1;
    stake += u;
    pnl += p;
  }
  const n = w + l;
  return {
    n, w, l, st: stake, u: pnl,
    wr: n ? (100 * w) / n : 0,
    roi: stake > 0 ? (100 * pnl) / stake : 0,
  };
}

function pathOf(sd) {
  return sd.v8_hcStakeTier
    || sd.v8_agsV12Tier
    || sd.v8_stakePath
    || sd.v8_agsTier
    || '—';
}

function leadSR(sd, sideKey) {
  const lock = sd.lock || {};
  const peak = sd.peak || lock;
  const wd = peak.v8Scoring?.walletDetails || lock.v8Scoring?.walletDetails || [];
  const forW = wd.filter((w) => w && String(w.side) === String(sideKey)
    && (w.direction == null || String(w.direction).toUpperCase() === 'FOR'));
  let best = null;
  for (const w of forW) {
    const sr = Number(w.sizeRatio ?? w.v8_sizeRatio ?? w.betMultiplier);
    if (!Number.isFinite(sr)) continue;
    if (best == null || sr > best) best = sr;
  }
  return best;
}

async function loadAll(db) {
  const rows = [];
  for (const [col, mkt] of PICK_COLLECTIONS) {
    const snap = await getDocs(collection(db, col));
    for (const docSnap of snap.docs) {
      const data = docSnap.data() || {};
      const date = data.date;
      if (typeof date !== 'string' || date < AUG_FROM || date > AUG_TO) continue;
      if (!data.sides) continue;
      for (const [sideKey, sd] of Object.entries(data.sides)) {
        if (!sd || sd.superseded) continue;
        if ((sd.status || data.status) !== 'COMPLETED') continue;
        const res = sd.result || data.result || {};
        let won = null;
        if (res.outcome === 'WIN' || res.outcome === 'W') won = true;
        else if (res.outcome === 'LOSS' || res.outcome === 'L') won = false;
        if (won == null) continue;

        const units = Number(sd.finalUnits ?? sd.v8_agsUnitsApplied ?? 0);
        const mutedBy = sd.mutedBy || '';
        const foolsAction = sd.v8_foolsGoldAction || null;
        const preFools = Number(sd.v8_unitsPreFoolsGold);
        const lock = sd.lock || {};
        const peak = sd.peak || lock;
        const odds = Number(peak.odds || lock.odds || 0);
        const path = pathOf(sd);
        const edge = Number(sd.v8_winnerAlignEdge);
        const team = sd.team || (sideKey === 'home' ? data.home : sideKey === 'away' ? data.away : sideKey);
        const home = data.home || '';
        const away = data.away || '';
        const matchup = `${away} @ ${home}`.trim();
        // FOOLS mutes are stamped tracked:true (0u board). Still grade CF @ pre-mute u.
        // Prefer mutedBy; also catch MUTE action with pre-units (promotedBy may be missing).
        const isFoolsMuted = mutedBy === FOOLS_MUTED_BY
          || (foolsAction === 'MUTE' && Number.isFinite(preFools) && preFools > 0 && !(units > 0));
        const cfUnits = isFoolsMuted
          ? (Number.isFinite(preFools) && preFools > 0 ? preFools : 0)
          : 0;
        const tracked = res.tracked === true;
        // Live staked book excludes tracked + zero-unit mutes
        const live = !tracked && Number.isFinite(units) && units > 0
          && typeof sd.promotedBy === 'string' && sd.promotedBy.startsWith(AGSU_PREFIX);

        rows.push({
          id: docSnap.id,
          date,
          sport: data.sport || '',
          mkt,
          team,
          matchup,
          side: sideKey,
          path,
          units: Number.isFinite(units) ? units : 0,
          odds,
          won,
          profit: profitOf(units, odds, won),
          mutedBy,
          foolsAction,
          preFools: Number.isFinite(preFools) ? preFools : null,
          isFoolsMuted,
          cfUnits,
          cfProfit: profitOf(cfUnits, odds, won),
          edge: Number.isFinite(edge) ? edge : null,
          leadSR: leadSR(sd, sideKey),
          tapeAction: String(sd.v8_tapeAction || '').toUpperCase().replace(/-/g, '_') || '—',
          tracked,
          live,
          promotedBy: sd.promotedBy || '',
        });
      }
    }
  }
  return rows;
}

function dayPnlMap(liveRows) {
  const map = new Map();
  for (const r of liveRows) {
    if (!map.has(r.date)) map.set(r.date, []);
    map.get(r.date).push(r);
  }
  const days = [...map.keys()].sort();
  return days.map((date) => {
    const a = agg(map.get(date));
    return { date, ...a };
  });
}

function sdStats(xs) {
  const v = xs.filter(Number.isFinite);
  if (!v.length) return { n: 0, mean: 0, sd: 0, median: 0, worst: 0, best: 0, negDays: 0, nDays: 0 };
  const mean = v.reduce((a, b) => a + b, 0) / v.length;
  const variance = v.reduce((a, b) => a + (b - mean) ** 2, 0) / v.length;
  const sorted = [...v].sort((a, b) => a - b);
  const m = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 ? sorted[m] : (sorted[m - 1] + sorted[m]) / 2;
  return {
    nDays: v.length,
    mean,
    sd: Math.sqrt(variance),
    median,
    worst: sorted[0],
    best: sorted[sorted.length - 1],
    negDays: v.filter((x) => x < 0).length,
  };
}

function byPath(rows) {
  const map = {};
  for (const r of rows) {
    const k = r.path || '—';
    if (!map[k]) map[k] = [];
    map[k].push(r);
  }
  const out = {};
  for (const [k, rs] of Object.entries(map)) out[k] = agg(rs);
  return out;
}

function fmt(a) {
  if (!a || !a.n) return 'n=0';
  return `${a.n} · ${a.w}-${a.l} · ${a.u >= 0 ? '+' : ''}${a.u.toFixed(2)}u · ROI ${a.roi >= 0 ? '+' : ''}${a.roi.toFixed(1)}%`;
}

async function main() {
  const YEST = etYesterday();
  console.error(`Loading August picks… yesterday=${YEST} ET today=${etToday()}`);
  const db = initDb();
  const all = await loadAll(db);
  const live = all.filter((r) => r.live);
  const foolsMuted = all.filter((r) => r.isFoolsMuted && r.cfUnits > 0);

  const yLive = live.filter((r) => r.date === YEST);
  const yPlus4 = yLive.filter((r) => r.units >= 4);
  const ySub4 = yLive.filter((r) => r.units > 0 && r.units < 4);
  const yFools = foolsMuted.filter((r) => r.date === YEST);
  // FOOLS mute CF only needs recoverable pre-units
  const foolsMutedGraded = foolsMuted.filter((r) => r.cfUnits > 0);
  const yFoolsGraded = yFools.filter((r) => r.cfUnits > 0);

  const augPlus4 = live.filter((r) => r.units >= 4);
  const augSub4 = live.filter((r) => r.units > 0 && r.units < 4);
  const augPlus4NoTop = augPlus4.filter((r) => r.path !== 'TOP' && r.path !== 'TOP+');
  const augTop4 = augPlus4.filter((r) => r.path === 'TOP' || r.path === 'TOP+');

  const aAll = agg(live);
  const a4 = agg(augPlus4);
  const aSub = agg(augSub4);
  const a4NoTop = agg(augPlus4NoTop);
  const aTop = agg(augTop4);
  const aFools = agg(foolsMutedGraded, 'cfUnits', 'cfProfit');
  const yFoolsA = agg(yFoolsGraded, 'cfUnits', 'cfProfit');

  const plus4Days = dayPnlMap(augPlus4);
  const dayStats = sdStats(plus4Days.map((d) => d.u));

  const payload = {
    yesterday: {
      date: YEST,
      all: agg(yLive),
      plus4: agg(yPlus4),
      sub4: agg(ySub4),
      fools: yFoolsA,
      foolsMute: yFoolsA,
      byPath: byPath(yLive),
      byPath4: byPath(yPlus4),
      plus4Tickets: yPlus4
        .slice()
        .sort((a, b) => a.profit - b.profit)
        .map((t) => ({
          res: t.won ? 'W' : 'L',
          u: t.profit,
          units: t.units,
          sport: t.sport,
          path: t.path,
          tier: t.path,
          edge: t.edge,
          leadSR: t.leadSR,
          matchup: t.matchup,
          team: t.team,
          tape: t.tapeAction,
        })),
      allTickets: yLive
        .slice()
        .sort((a, b) => a.profit - b.profit)
        .map((t) => ({
          res: t.won ? 'W' : 'L',
          u: t.profit,
          units: t.units,
          sport: t.sport,
          path: t.path,
          edge: t.edge,
          leadSR: t.leadSR,
          matchup: t.matchup,
        })),
      dayStats,
    },
    august: {
      all: { ...aAll, stakeShare: 100 },
      plus4: { ...a4, stakeShare: aAll.st > 0 ? (100 * a4.st) / aAll.st : 0 },
      sub4: { ...aSub, stakeShare: aAll.st > 0 ? (100 * aSub.st) / aAll.st : 0 },
      plus4NoTop: a4NoTop,
      byPath: Object.fromEntries(
        Object.entries(byPath(augPlus4)).map(([k, v]) => [k, v]),
      ),
      dayRows: plus4Days,
    },
    topAug: aTop,
    foolsAug: {
      shipped: { n: 0, w: 0, l: 0, u: 0, roi: 0, st: 0 },
      muteCf: aFools,
      muteList: foolsMutedGraded.map((r) => ({
        date: r.date,
        sport: r.sport,
        path: r.path,
        pre: r.cfUnits,
        won: r.won,
        u: r.cfProfit,
        matchup: r.matchup,
        action: r.foolsAction,
      })),
    },
  };

  // FOOLS "shipped" leak: live tickets with foolsAction MUTE somehow, or FAIL_OPEN on FOOLS path
  const foolsLeak = live.filter((r) => r.foolsAction === 'MUTE'
    || (r.foolsAction === 'FAIL_OPEN' && r.date >= '2026-08-05'));
  payload.foolsAug.shipped = agg(foolsLeak);
  // Also count HOLD with best-for FLAT isn't stamped easily — mute CF is the primary signal

  writeFileSync('/tmp/yest_aug.json', JSON.stringify(payload, null, 2));
  console.error(`Wrote /tmp/yest_aug.json · live=${live.length} foolsMuted=${foolsMuted.length} yLive=${yLive.length}`);

  // Markdown report
  const y = payload.yesterday;
  const a = payload.august;
  const top = payload.topAug;
  const fools = payload.foolsAug;
  const lines = [];
  const push = (s = '') => lines.push(s);

  push(`# Yesterday + FOOLS + August 4u+ health`);
  push(`_Graded ET calendar · yesterday = **${y.date}** (ET) · generated ${new Date().toISOString()}_`);
  push('');
  push('## 1. What happened yesterday');
  push('');
  push('| Slice | n | W-L | u | ROI |');
  push('|---|---:|---|---:|---:|');
  push(`| All live | ${y.all.n} | ${y.all.w}-${y.all.l} | ${y.all.u.toFixed(2)} | ${y.all.roi.toFixed(1)}% |`);
  push(`| **4u+** | **${y.plus4.n}** | **${y.plus4.w}-${y.plus4.l}** | **${y.plus4.u.toFixed(2)}** | **${y.plus4.roi.toFixed(1)}%** |`);
  push(`| Sub-4 | ${y.sub4.n} | ${y.sub4.w}-${y.sub4.l} | ${y.sub4.u.toFixed(2)} | ${y.sub4.roi.toFixed(1)}% |`);
  push(`| FOOLS mute CF (cut pile @ pre-u) | ${y.foolsMute.n} | ${y.foolsMute.w}-${y.foolsMute.l} | ${y.foolsMute.u.toFixed(2)} | ${y.foolsMute.roi.toFixed(1)}% |`);
  push('');
  push(`**FOOLS yesterday:** mute CF **${y.foolsMute.u.toFixed(2)}u** on n=${y.foolsMute.n}. `
    + (y.foolsMute.u < 0
      ? 'Mute slightly **helped** (cut losers).'
      : y.foolsMute.n === 0
        ? 'No FOOLS-muted graded tickets that day.'
        : 'Mute would have cut net winners.'));
  push('');
  push('**4u+ tickets (sorted by PnL):**');
  for (const t of y.plus4Tickets) {
    push(`- ${t.res} ${t.u >= 0 ? '+' : ''}${t.u.toFixed(2)}u (${t.units}u) · ${t.sport} · ${t.path} · EDGE ${t.edge ?? '—'} · leadSR ${t.leadSR ?? '—'} · ${t.matchup}`);
  }
  push('');
  push('**All live pathway rollup:**');
  for (const [k, v] of Object.entries(y.byPath).sort((a, b) => a[1].u - b[1].u)) {
    push(`- ${k}: ${v.n} · ${v.w}-${v.l} · ${v.u >= 0 ? '+' : ''}${v.u.toFixed(2)}u`);
  }
  push('');
  push('**4u+ pathway rollup:**');
  for (const [k, v] of Object.entries(y.byPath4 || {}).sort((a, b) => a[1].u - b[1].u)) {
    push(`- ${k}: ${v.n} · ${v.w}-${v.l} · ${v.u >= 0 ? '+' : ''}${v.u.toFixed(2)}u`);
  }
  push('');
  push('### Was yesterday variance?');
  push(`Aug 4u+ day PnL: mean **+${y.dayStats.mean.toFixed(2)}u/day**, σ **${y.dayStats.sd.toFixed(2)}**, `
    + `median **${y.dayStats.median >= 0 ? '+' : ''}${y.dayStats.median.toFixed(2)}**, `
    + `worst **${y.dayStats.worst.toFixed(2)}**, best **+${y.dayStats.best.toFixed(2)}**, `
    + `negative days **${y.dayStats.negDays}/${y.dayStats.nDays}**.`);
  push('');
  push(`Yesterday 4u+ **${y.plus4.u.toFixed(2)}u** vs mean +${y.dayStats.mean.toFixed(2)}u.`
    + (y.plus4.u <= y.dayStats.worst + 0.01
      ? ' **Worst (or tied worst) August 4u+ day** so far.'
      : ' Soft day but not the floor.'));
  push('');
  push('---');
  push('');
  push('## 2. FOOLS gold — August (problem or not?)');
  push('');
  push(`FOOLS mute CF (entire month, graded @ pre-mute units): **${fmt(fools.muteCf)}**`);
  push(`FOOLS leak shipped (live + foolsAction MUTE/FAIL_OPEN): **${fmt(fools.shipped)}**`);
  push('');
  if (fools.muteCf.n > 0) {
    if (fools.muteCf.u > 0) {
      push(`**Mute CF +${fools.muteCf.u.toFixed(2)}u** = graded PnL of the pile FOOLS **already muted** (at pre-mute units). `
        + `Those tickets would have been **net winners** — keeping the mute **left ~${fools.muteCf.u.toFixed(1)}u on the table** MTD. `
        + `That is the opposite of “FOOLS is infecting the live book.” Soft policy question later; not yesterday’s bleed.`);
    } else {
      push(`**Mute CF ${fools.muteCf.u.toFixed(2)}u** → FOOLS mute **helped** by cutting losers.`);
    }
  } else {
    push('No FOOLS-muted tickets with recoverable pre-units in August window.');
  }
  push('');
  push('_No FOOLS leak into the live staked book (MUTE/FAIL_OPEN with units>0) in August — mute is firing._');
  push('');
  push('---');
  push('');
  push('## 3. August 4u+ — healthy enough for the volume?');
  push('');
  push('| Slice | n | W-L | u | ROI | stake share |');
  push('|---|---:|---|---:|---:|---:|');
  push(`| **All live** | ${a.all.n} | ${a.all.w}-${a.all.l} | **${a.all.u.toFixed(2)}** | ${a.all.roi.toFixed(1)}% | 100% |`);
  push(`| **4u+** | **${a.plus4.n}** | **${a.plus4.w}-${a.plus4.l}** | **${a.plus4.u.toFixed(2)}** | **${a.plus4.roi.toFixed(1)}%** | **${a.plus4.stakeShare.toFixed(0)}%** |`);
  push(`| Sub-4 | ${a.sub4.n} | ${a.sub4.w}-${a.sub4.l} | ${a.sub4.u.toFixed(2)} | ${a.sub4.roi.toFixed(1)}% | ${a.sub4.stakeShare.toFixed(0)}% |`);
  push(`| 4u+ without TOP | ${a.plus4NoTop.n} | ${a.plus4NoTop.w}-${a.plus4NoTop.l} | ${a.plus4NoTop.u.toFixed(2)} | ${a.plus4NoTop.roi.toFixed(1)}% | — |`);
  push(`| TOP ≥4u alone | ${top.n} | ${top.w}-${top.l} | ${top.u.toFixed(2)} | ${top.roi.toFixed(1)}% | — |`);
  push('');
  const pnlShare = a.all.u !== 0 ? (100 * a.plus4.u) / a.all.u : 0;
  push(`**Verdict:** 4u+ is **${a.plus4.stakeShare.toFixed(0)}% of August stake** and `
    + `**~${pnlShare.toFixed(0)}% of August PnL** at **+${a.plus4.roi.toFixed(1)}% ROI / ${a.plus4.wr.toFixed(0)}% WR**. `
    + (a.plus4.roi >= 8
      ? '**Yes — volume is justified.**'
      : a.plus4.roi >= 0
        ? 'Positive but thin — volume OK with eyes on TOP.'
        : 'Not healthy enough without fixes.'));
  push('');
  push('**Caveat:** TOP ≥4u is the soft organ inside an otherwise healthy sleeve. '
    + 'Inside-TOP discrimination (SR≥3 / EDGE<10), not a reason to shrink overall 4u+ size.');
  push('');
  push('### Aug 4u+ by pathway');
  for (const [k, v] of Object.entries(a.byPath).sort((x, y) => y[1].u - x[1].u)) {
    push(`- ${k}: ${v.n} · ${v.w}-${v.l} · ${v.u >= 0 ? '+' : ''}${v.u.toFixed(1)}u · ROI ${v.roi >= 0 ? '+' : ''}${v.roi.toFixed(0)}%`);
  }
  push('');
  push('### Aug 4u+ day tape');
  push('```');
  for (const r of a.dayRows) {
    push(`${r.date}  ${r.n}p  ${r.w}-${r.l}  ${r.u >= 0 ? '+' : ''}${r.u.toFixed(2)}u`);
  }
  push('```');
  push('');
  push('### FOOLS mute ticket list (August CF)');
  push('| Date | Sport | Path | Pre-u | R | CF PnL | Matchup |');
  push('|---|---|---|---:|:---:|---:|---|');
  for (const r of fools.muteList.sort((a, b) => a.date.localeCompare(b.date) || a.u - b.u)) {
    push(`| ${r.date} | ${r.sport} | ${r.path} | ${r.pre.toFixed(2)} | ${r.won ? 'W' : 'L'} | ${r.u >= 0 ? '+' : ''}${r.u.toFixed(2)} | ${String(r.matchup).replace(/\|/g, '/')} |`);
  }

  const md = lines.join('\n');
  const outRepo = join(REPO_ROOT, 'tmp_yesterday_fools_4u_health.md');
  const outArt = '/opt/cursor/artifacts/tmp_yesterday_fools_4u_health.md';
  writeFileSync(outRepo, md);
  writeFileSync(outArt, md);
  console.log(md);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
