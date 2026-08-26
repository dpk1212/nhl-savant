#!/usr/bin/env node
/**
 * Sub-4 mute counterfactual + 4u+ infection counterfactual
 *
 * Dale ask (2026-08-26):
 *  1) Sub-4 WITH current mutes vs AS IF no mute change
 *  2) Same window: 4u+ ACTUAL vs what it could have been
 *     (apply FAIL_OPEN / maxSR<1 cuts that today only hit sub-4)
 *  3) Clear list of picks muted / would-mute + results
 *
 * Window: pick date >= 2026-08-19 (flinch live; maxSR from 2026-08-20)
 *
 * Reads sharpFlow* via Firebase CLIENT SDK (public rules) — no Admin key needed.
 * Usage: node scripts/auditSub4And4uCounterfactual.mjs
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import {
  FLINCH_FAIL_OPEN_MUTE_FROM,
  MAX_SR_SUB4_MUTE_FROM,
  FLINCH_MUTED_BY,
  FAIL_OPEN_SUB4_MUTED_BY,
  MAX_SR_SUB4_MUTED_BY,
  maxForSizeRatio,
} from '../src/lib/walletClvSkill.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const WINDOW_FROM = FLINCH_FAIL_OPEN_MUTE_FROM; // 2026-08-19
const AGSU_PREFIX = 'ags-unified';
const SUB4_MUTES = new Set([FLINCH_MUTED_BY, FAIL_OPEN_SUB4_MUTED_BY, MAX_SR_SUB4_MUTED_BY]);
const PICK_COLLECTIONS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];

function initClientDb() {
  const app = initializeApp({
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
  });
  return getFirestore(app);
}

function profitOf(units, odds, won) {
  if (!(units > 0) || !Number.isFinite(odds) || !odds) return 0;
  return won ? (odds < 0 ? units * (100 / Math.abs(odds)) : units * (odds / 100)) : -units;
}

function agg(rows, unitKey = 'units', pnlKey = 'profit') {
  let w = 0; let l = 0; let stake = 0; let pnl = 0;
  for (const r of rows) {
    const u = Number(r[unitKey]);
    if (!(u > 0)) continue;
    if (r.won) w += 1; else l += 1;
    stake += u;
    pnl += Number(r[pnlKey]) || 0;
  }
  const decided = w + l;
  return {
    n: decided,
    w,
    l,
    wr: decided ? (100 * w) / decided : null,
    stake,
    pnl,
    roi: stake > 0 ? (100 * pnl) / stake : null,
  };
}

function fmt(a, label = '') {
  if (!a || !a.n) return `${label}n=0`.trim();
  const wr = a.wr == null ? '—' : `${a.wr.toFixed(1)}%`;
  const roi = a.roi == null ? '—' : `${a.roi >= 0 ? '+' : ''}${a.roi.toFixed(1)}%`;
  const pnl = `${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(2)}u`;
  return `${label}n=${a.n}  ${a.w}–${a.l}  WR ${wr}  stake ${a.stake.toFixed(1)}u  PnL ${pnl}  ROI ${roi}`.trim();
}

function matchupOf(data, sd, sideKey) {
  if (sd.team) return sd.team;
  if (sideKey === 'home') return data.home || 'home';
  if (sideKey === 'away') return data.away || 'away';
  if (sideKey === 'over' || sideKey === 'under') {
    const line = sd.lock?.line ?? sd.peak?.line ?? '';
    return `${String(sideKey)[0].toUpperCase()}${String(sideKey).slice(1)}${line !== '' && line != null ? ` ${line}` : ''}`;
  }
  return `${data.away || '?'} @ ${data.home || '?'}`;
}

async function loadRows(db) {
  const rows = [];
  for (const [colName, mkt] of PICK_COLLECTIONS) {
    const snap = await getDocs(collection(db, colName));
    for (const docSnap of snap.docs) {
      const data = docSnap.data() || {};
      const date = data.date;
      if (typeof date !== 'string' || date < WINDOW_FROM) continue;
      if (!data.sides) continue;

      for (const [sideKey, sd] of Object.entries(data.sides)) {
        if (!sd || typeof sd !== 'object') continue;
        if (sd.superseded) continue;
        if (!(typeof sd.promotedBy === 'string' && sd.promotedBy.startsWith(AGSU_PREFIX))) continue;
        if ((sd.status || data.status) !== 'COMPLETED') continue;

        const res = sd.result || data.result || {};
        let won = null;
        if (res.outcome === 'WIN' || res.outcome === 'W') won = true;
        else if (res.outcome === 'LOSS' || res.outcome === 'L') won = false;
        else if (res.won === true) won = true;
        else if (res.won === false) won = false;
        if (won == null) continue;

        const lock = sd.lock || {};
        const peak = sd.peak || lock;
        const published = Number(sd.finalUnits ?? sd.v8_agsUnitsApplied ?? 0);
        const odds = Number(peak.odds || lock.odds || sd.odds || 0);
        const tapeAction = String(sd.v8_tapeAction || '').toUpperCase().replace(/-/g, '_');
        const edge = Number(sd.v8_winnerAlignEdge);
        const path = sd.v8_hcStakeTier || sd.v8_agsV12Tier || sd.v8_agsTier || '—';
        const mutedBy = sd.mutedBy || null;
        const walletDetails = (peak.v8Scoring?.walletDetails || lock.v8Scoring?.walletDetails || [])
          .filter((w) => w && w.side);
        const maxSR = maxForSizeRatio(walletDetails, sideKey);

        const preFlinch = Number(sd.v8_unitsPreFlinchFailOpen);
        const preMaxSr = Number(sd.v8_unitsPreMaxSrSub4);
        const preMuteUnits = Number.isFinite(preFlinch) && preFlinch > 0
          ? preFlinch
          : (Number.isFinite(preMaxSr) && preMaxSr > 0 ? preMaxSr : 0);

        const wasSub4Muted = published === 0
          && SUB4_MUTES.has(mutedBy)
          && preMuteUnits > 0
          && preMuteUnits < 4;

        // 4u+ infection: same flags sub-4 mutes use, but without ≥4 exempt
        let wouldMute4u = false;
        let wouldMute4uReason = null;
        if (published >= 4) {
          if (tapeAction === 'FAIL_OPEN') {
            wouldMute4u = true;
            wouldMute4uReason = 'fail_open';
          } else if (maxSR != null && Number.isFinite(maxSR) && maxSR < 1) {
            wouldMute4u = true;
            wouldMute4uReason = 'maxsr_lt1';
          }
        }

        rows.push({
          id: docSnap.id,
          date,
          sport: data.sport || '',
          mkt,
          matchup: matchupOf(data, sd, sideKey),
          side: sideKey,
          path,
          odds,
          won,
          published,
          preMuteUnits,
          mutedBy: mutedBy || '',
          tapeAction: tapeAction || '—',
          edge: Number.isFinite(edge) ? edge : null,
          maxSR,
          wasSub4Muted,
          actualProfit: profitOf(published, odds, won),
          wouldMute4u,
          wouldMute4uReason,
        });
      }
    }
  }
  return rows;
}

async function main() {
  if (!process.env.VITE_FIREBASE_API_KEY || !process.env.VITE_FIREBASE_PROJECT_ID) {
    console.error('Missing VITE_FIREBASE_* client config');
    process.exit(1);
  }
  const db = initClientDb();
  const rows = await loadRows(db);
  const lines = [];
  const out = (s = '') => { lines.push(s); console.log(s); };

  out('# Sub-4 mute vs 4u+ infection — counterfactual');
  out(`Window: pick date ≥ **${WINDOW_FROM}** (flinch live; maxSR mute from ${MAX_SR_SUB4_MUTE_FROM})`);
  out(`Generated: ${new Date().toISOString()}`);
  out(`AGS-U graded sides in window: **${rows.length}**`);
  out('');
  out('Rules:');
  out('- **Sub-4 ACTUAL** = shipped `finalUnits` in (0, 4)');
  out('- **Sub-4 as-if-no-mute** = ACTUAL + restored picks muted by `believed-cut` / `fail-open-sub4` / `maxsr-sub4` at pre-mute units');
  out('- **4u+ ACTUAL** = shipped `finalUnits ≥ 4`');
  out('- **4u+ cleaned** = drop FAIL_OPEN OR maxSR&lt;1 (the ≥4 exempt infection)');

  // ─── A) SUB-4 ─────────────────────────────────────────────
  out('');
  out('## A) Sub-4 — ACTUAL (with mutes) vs AS-IF no mute');
  out('');

  const sub4Actual = rows.filter((r) => r.published > 0 && r.published < 4);
  const mutedList = rows.filter((r) => r.wasSub4Muted);

  const cfNoMuteRows = [
    ...sub4Actual.map((r) => ({ won: r.won, units: r.published, profit: r.actualProfit })),
    ...mutedList.map((r) => ({
      won: r.won,
      units: r.preMuteUnits,
      profit: profitOf(r.preMuteUnits, r.odds, r.won),
    })),
  ];

  const aAct = agg(sub4Actual.map((r) => ({ won: r.won, units: r.published, profit: r.actualProfit })));
  const aCf = agg(cfNoMuteRows);
  const aMuted = agg(mutedList.map((r) => ({
    won: r.won,
    units: r.preMuteUnits,
    profit: profitOf(r.preMuteUnits, r.odds, r.won),
  })));

  out('### With current change (ACTUAL shipped sub-4)');
  out(fmt(aAct));
  out('');
  out('### As if no change (shipped sub-4 + restored mutes at pre-mute units)');
  out(fmt(aCf));
  out('');
  out('### Muted picks only (what we cut — CF flat at pre-mute size)');
  out(fmt(aMuted));
  out(`Muted count: **${mutedList.length}**`);
  out('');
  out('### Improvement (actual − as-if-no-mute)');
  const dSub = aAct.pnl - aCf.pnl;
  out(`ΔPnL: **${dSub >= 0 ? '+' : ''}${dSub.toFixed(2)}u** (positive = mutes helped)`);
  out(`ΔWR: actual ${aAct.wr?.toFixed(1) ?? '—'}% vs no-mute ${aCf.wr?.toFixed(1) ?? '—'}%`);
  out(`ΔROI: actual ${aAct.roi == null ? '—' : `${aAct.roi >= 0 ? '+' : ''}${aAct.roi.toFixed(1)}%`} vs no-mute ${aCf.roi == null ? '—' : `${aCf.roi >= 0 ? '+' : ''}${aCf.roi.toFixed(1)}%`}`);

  // by mute reason
  out('');
  out('### Muted by reason');
  out('| mutedBy | n | W–L | WR | CF stake | CF PnL | CF ROI |');
  out('|---------|--:|:---:|---:|---------:|-------:|-------:|');
  for (const reason of [FLINCH_MUTED_BY, FAIL_OPEN_SUB4_MUTED_BY, MAX_SR_SUB4_MUTED_BY]) {
    const rs = mutedList.filter((r) => r.mutedBy === reason);
    const a = agg(rs.map((r) => ({
      won: r.won,
      units: r.preMuteUnits,
      profit: profitOf(r.preMuteUnits, r.odds, r.won),
    })));
    if (!a.n) continue;
    out(`| ${reason} | ${a.n} | ${a.w}–${a.l} | ${a.wr.toFixed(1)}% | ${a.stake.toFixed(2)}u | ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(2)}u | ${a.roi >= 0 ? '+' : ''}${a.roi.toFixed(1)}% |`);
  }

  out('');
  out('## A2) Sub-4 muted pick list (results)');
  out('');
  out('| Date | Sport | Pick | Path | Pre-u | mutedBy | Tape | maxSR | Odds | R | CF PnL |');
  out('|------|-------|------|------|------:|---------|------|------:|-----:|:-:|-------:|');
  for (const r of mutedList.sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))) {
    const cf = profitOf(r.preMuteUnits, r.odds, r.won);
    out(`| ${r.date} | ${r.sport} | ${String(r.matchup).replace(/\|/g, '/')} | ${r.path} | ${r.preMuteUnits.toFixed(2)} | ${r.mutedBy} | ${r.tapeAction} | ${r.maxSR == null ? '—' : r.maxSR.toFixed(2)} | ${Number.isFinite(r.odds) ? r.odds : '—'} | ${r.won ? 'W' : 'L'} | ${cf >= 0 ? '+' : ''}${cf.toFixed(2)}u |`);
  }

  // ─── B) 4u+ ───────────────────────────────────────────────
  out('');
  out('## B) 4u+ same window — ACTUAL vs if we muted FAIL_OPEN / maxSR&lt;1');
  out('');

  const ge4 = rows.filter((r) => r.published >= 4);
  const ge4WouldMute = ge4.filter((r) => r.wouldMute4u);
  const ge4Keep = ge4.filter((r) => !r.wouldMute4u);

  const bAct = agg(ge4.map((r) => ({ won: r.won, units: r.published, profit: r.actualProfit })));
  const bCf = agg(ge4Keep.map((r) => ({ won: r.won, units: r.published, profit: r.actualProfit })));
  const bInf = agg(ge4WouldMute.map((r) => ({ won: r.won, units: r.published, profit: r.actualProfit })));

  out('### ACTUAL 4u+ (what we shipped)');
  out(fmt(bAct));
  out('');
  out('### Counterfactual 4u+ (remove FAIL_OPEN + maxSR&lt;1)');
  out(fmt(bCf));
  out('');
  out('### Would-mute 4u+ only (infection candidates)');
  out(fmt(bInf));
  out(`Would-mute count: **${ge4WouldMute.length}**`);
  out('');
  out('### Lift if we had cut them');
  const d4 = bCf.pnl - bAct.pnl;
  out(`ΔPnL: **${d4 >= 0 ? '+' : ''}${d4.toFixed(2)}u** (positive = cutting infection helps)`);
  out(`ΔWR: actual ${bAct.wr?.toFixed(1) ?? '—'}% → cleaned ${bCf.wr?.toFixed(1) ?? '—'}%`);
  out(`ΔROI: actual ${bAct.roi == null ? '—' : `${bAct.roi >= 0 ? '+' : ''}${bAct.roi.toFixed(1)}%`} → cleaned ${bCf.roi == null ? '—' : `${bCf.roi >= 0 ? '+' : ''}${bCf.roi.toFixed(1)}%`}`);

  out('');
  out('### Would-mute by reason');
  out('| Reason | n | W–L | WR | Stake | PnL | ROI |');
  out('|--------|--:|:---:|---:|------:|----:|----:|');
  for (const reason of ['fail_open', 'maxsr_lt1']) {
    const rs = ge4WouldMute.filter((r) => r.wouldMute4uReason === reason);
    const a = agg(rs.map((r) => ({ won: r.won, units: r.published, profit: r.actualProfit })));
    if (!a.n) continue;
    out(`| ${reason} | ${a.n} | ${a.w}–${a.l} | ${a.wr.toFixed(1)}% | ${a.stake.toFixed(2)}u | ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(2)}u | ${a.roi >= 0 ? '+' : ''}${a.roi.toFixed(1)}% |`);
  }

  out('');
  out('## B2) 4u+ picks we WOULD have muted (results)');
  out('');
  out('| Date | Sport | Pick | Path | Units | Reason | Tape | maxSR | Odds | R | Actual PnL |');
  out('|------|-------|------|------|------:|--------|------|------:|-----:|:-:|-----------:|');
  for (const r of ge4WouldMute.sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))) {
    out(`| ${r.date} | ${r.sport} | ${String(r.matchup).replace(/\|/g, '/')} | ${r.path} | ${r.published.toFixed(2)} | ${r.wouldMute4uReason} | ${r.tapeAction} | ${r.maxSR == null ? '—' : r.maxSR.toFixed(2)} | ${Number.isFinite(r.odds) ? r.odds : '—'} | ${r.won ? 'W' : 'L'} | ${r.actualProfit >= 0 ? '+' : ''}${r.actualProfit.toFixed(2)}u |`);
  }

  out('');
  out('## C) Side-by-side summary');
  out('');
  out('| Book | Actual | Counterfactual | ΔPnL |');
  out('|------|--------|----------------|------|');
  out(`| Sub-4 | ${fmt(aAct)} | no-mute ${fmt(aCf)} | ${dSub >= 0 ? '+' : ''}${dSub.toFixed(2)}u |`);
  out(`| 4u+ | ${fmt(bAct)} | cleaned ${fmt(bCf)} | ${d4 >= 0 ? '+' : ''}${d4.toFixed(2)}u |`);
  out('');
  out('Read:');
  out(`- Sub-4 mutes ${dSub >= 0 ? '**helped**' : '**hurt**'} by ${Math.abs(dSub).toFixed(2)}u vs shipping those leftovers.`);
  out(`- Extending FAIL_OPEN/maxSR&lt;1 mute to 4u+ would have ${d4 >= 0 ? '**helped**' : '**hurt**'} by ${Math.abs(d4).toFixed(2)}u in this window.`);

  const outPath = join(REPO_ROOT, 'tmp_sub4_4u_counterfactual.md');
  writeFileSync(outPath, `${lines.join('\n')}\n`);
  out('');
  out(`Wrote ${outPath}`);

  // also dump JSON for artifacts
  const jsonPath = join(REPO_ROOT, 'tmp_sub4_4u_counterfactual.json');
  writeFileSync(jsonPath, JSON.stringify({
    windowFrom: WINDOW_FROM,
    generated: new Date().toISOString(),
    summary: {
      sub4Actual: aAct,
      sub4NoMute: aCf,
      sub4MutedOnly: aMuted,
      sub4DeltaPnl: dSub,
      ge4Actual: bAct,
      ge4Cleaned: bCf,
      ge4Infection: bInf,
      ge4DeltaPnl: d4,
      mutedCount: mutedList.length,
      wouldMute4uCount: ge4WouldMute.length,
    },
    mutedList,
    wouldMute4uList: ge4WouldMute,
  }, null, 2));
  out(`Wrote ${jsonPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
