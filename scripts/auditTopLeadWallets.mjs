#!/usr/bin/env node
/**
 * TOP lead-wallet diagnosis — do winner vs loser TOP tickets differ on the
 * HC wallet that created hcMargin=1? Thin sample / young / bad sport book?
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { HC_RATIO } from '../src/lib/ags.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const FROM = '2026-06-15';
const AGSU = 'ags-unified';
const COLS = ['sharpFlowPicks', 'sharpFlowSpreads', 'sharpFlowTotals'];

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

function profitOf(u, o, won) {
  if (!(u > 0) || !Number.isFinite(o) || !o) return 0;
  return won ? (o < 0 ? u * (100 / Math.abs(o)) : u * (o / 100)) : -u;
}

function agg(rows) {
  let w = 0; let l = 0; let stake = 0; let pnl = 0;
  for (const r of rows) {
    if (!(r.units > 0)) continue;
    if (r.won) w += 1; else l += 1;
    stake += r.units;
    pnl += r.profit;
  }
  const n = w + l;
  return {
    n, w, l,
    wr: n ? (100 * w) / n : null,
    stake,
    pnl,
    roi: stake > 0 ? (100 * pnl) / stake : null,
  };
}

function mean(xs) {
  const v = xs.filter(Number.isFinite);
  if (!v.length) return null;
  return v.reduce((a, b) => a + b, 0) / v.length;
}
function med(xs) {
  const v = xs.filter(Number.isFinite).sort((a, b) => a - b);
  if (!v.length) return null;
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
}
function daysBetween(a, b) {
  if (!a || !b) return null;
  const ms = Date.parse(b) - Date.parse(a);
  if (!Number.isFinite(ms)) return null;
  return ms / 86400000;
}

function pathOf(sd) {
  return sd.v8_hcStakeTier || sd.v8_agsV12Tier || sd.v8_stakePath || sd.v8_agsTier || '—';
}

async function loadProfiles(db) {
  const map = new Map();
  const snap = await getDocs(collection(db, 'sharpWalletProfiles'));
  for (const d of snap.docs) {
    map.set(d.id.toLowerCase(), d.data());
  }
  return map;
}

function leadHcWallets(wd, sideKey, sport, profiles) {
  const leads = [];
  for (const w of wd || []) {
    if (!w || String(w.side) !== String(sideKey)) continue;
    const short = String(w.wallet || '').slice(-6).toLowerCase();
    const profile = profiles.get(short);
    const bs = profile?.bySport?.[sport] || {};
    const tier = bs.whitelistTier || null;
    const sr = Number(w.sizeRatio);
    // Match production HC: CONFIRMED + size ≥ 1.5 (stamped model SR; sport-local
    // may differ slightly but stamp is what we have on the ticket).
    if (tier !== 'CONFIRMED') continue;
    if (!(sr >= HC_RATIO)) continue;
    const picksN = Number(bs.picks?.n);
    const posN = Number(bs.positions?.n);
    const picksWr = Number(bs.picks?.wr);
    const posWr = Number(bs.positions?.wr);
    const dollarRoi = Number(bs.positions?.dollarRoi);
    const flatRoi = Number(bs.picks?.flatRoi);
    const globalN = Number(profile?.picks?.n);
    const globalPosN = Number(profile?.positions?.n);
    const globalWr = Number(profile?.picks?.wr);
    const globalDollarRoi = Number(profile?.positions?.dollarRoi);
    leads.push({
      wallet: short,
      sizeRatio: sr,
      invested: Number(w.invested) || 0,
      contribution: Number(w.contribution) || 0,
      source: w.source || null,
      gap: w.source === 'gap_enrichment',
      tier: profile?.tier || null,
      sportTier: tier,
      picksN: Number.isFinite(picksN) ? picksN : null,
      posN: Number.isFinite(posN) ? posN : null,
      picksWr: Number.isFinite(picksWr) ? picksWr : null,
      posWr: Number.isFinite(posWr) ? posWr : null,
      dollarRoi: Number.isFinite(dollarRoi) ? dollarRoi : null,
      flatRoi: Number.isFinite(flatRoi) ? flatRoi : null,
      globalN: Number.isFinite(globalN) ? globalN : null,
      globalPosN: Number.isFinite(globalPosN) ? globalPosN : null,
      globalWr: Number.isFinite(globalWr) ? globalWr : null,
      globalDollarRoi: Number.isFinite(globalDollarRoi) ? globalDollarRoi : null,
      firstBetDate: profile?.firstBetDate || null,
      lastBetDate: profile?.lastBetDate || null,
      confirmedSports: Array.isArray(profile?.confirmedSports) ? profile.confirmedSports : [],
      missingProfile: !profile,
    });
  }
  // Primary lead = highest sizeRatio among HC FOR (then invested)
  leads.sort((a, b) => (b.sizeRatio - a.sizeRatio) || (b.invested - a.invested));
  return leads;
}

async function loadTickets(db, profiles) {
  const rows = [];
  for (const col of COLS) {
    const snap = await getDocs(collection(db, col));
    for (const docSnap of snap.docs) {
      const data = docSnap.data() || {};
      const date = data.date;
      if (typeof date !== 'string' || date < FROM) continue;
      if (!data.sides) continue;
      const sport = data.sport || '';
      for (const [sideKey, sd] of Object.entries(data.sides)) {
        if (!sd || sd.superseded) continue;
        if (!(typeof sd.promotedBy === 'string' && sd.promotedBy.startsWith(AGSU))) continue;
        if ((sd.status || data.status) !== 'COMPLETED') continue;
        const res = sd.result || data.result || {};
        let won = null;
        if (res.outcome === 'WIN' || res.outcome === 'W') won = true;
        else if (res.outcome === 'LOSS' || res.outcome === 'L') won = false;
        if (won == null) continue;
        const units = Number(sd.finalUnits ?? sd.v8_agsUnitsApplied ?? 0);
        if (!(units >= 4)) continue;
        if (res.tracked === true) continue;

        const path = pathOf(sd);
        const isTop = path === 'TOP' || path === 'TOP+';
        if (!isTop && path !== 'SUPER' && path !== 'RANK') continue;

        const lock = sd.lock || {};
        const peak = sd.peak || lock;
        const odds = Number(peak.odds || lock.odds || 0);
        const wd = peak.v8Scoring?.walletDetails || lock.v8Scoring?.walletDetails || [];
        const leads = leadHcWallets(wd, sideKey, sport, profiles);
        const primary = leads[0] || null;
        const ageDays = primary ? daysBetween(primary.firstBetDate, date) : null;

        rows.push({
          id: docSnap.id,
          date,
          sport,
          team: sd.team || sideKey,
          path,
          isTop,
          units,
          odds,
          won,
          profit: profitOf(units, odds, won),
          hcMargin: Number(sd.v8_hcMargin),
          hcFor: Number(sd.v8_hcConfFor),
          leadN: leads.length,
          soleHc: leads.length === 1,
          primary,
          leads,
          ageDays,
          thinPicks8: primary && primary.picksN != null && primary.picksN < 8,
          thinPicks15: primary && primary.picksN != null && primary.picksN < 15,
          thinPos20: primary && primary.posN != null && primary.posN < 20,
          young30: ageDays != null && ageDays < 30,
          young60: ageDays != null && ageDays < 60,
          gapLead: primary?.gap === true,
          sportDollarNeg: primary && primary.dollarRoi != null && primary.dollarRoi < 0,
          sportWrLt50: primary && primary.picksWr != null && primary.picksWr < 50,
          sportWrLt55: primary && primary.picksWr != null && primary.picksWr < 55,
        });
      }
    }
  }
  return rows;
}

function featTable(lines, wins, losses, feats) {
  lines.push('| Feature (primary HC lead) | W n | W mean | W med | L n | L mean | L med | Δmean |');
  lines.push('|---------------------------|----:|-------:|------:|----:|-------:|------:|------:|');
  for (const [name, fn] of feats) {
    const wv = wins.map(fn).filter(Number.isFinite);
    const lv = losses.map(fn).filter(Number.isFinite);
    if (!wv.length && !lv.length) continue;
    const wm = mean(wv); const lm = mean(lv);
    const d = (wm ?? 0) - (lm ?? 0);
    lines.push(`| ${name} | ${wv.length} | ${wm?.toFixed(2) ?? '—'} | ${med(wv)?.toFixed(2) ?? '—'} | ${lv.length} | ${lm?.toFixed(2) ?? '—'} | ${med(lv)?.toFixed(2) ?? '—'} | ${d >= 0 ? '+' : ''}${d.toFixed(2)} |`);
  }
}

function rateTable(lines, rows, rules) {
  lines.push('| Flag on primary HC lead | Match n/W–L/ROI | Rest n/W–L/ROI |');
  lines.push('|------------------------|-----------------|----------------|');
  const base = agg(rows);
  for (const { name, fn } of rules) {
    const m = rows.filter(fn);
    const o = rows.filter((r) => !fn(r));
    const a = agg(m); const b = agg(o);
    if (!a.n) continue;
    const mark = (a.roi ?? 0) <= -10 ? '🔴' : (a.roi ?? 0) >= 15 ? '🟢' : '  ';
    lines.push(`| ${mark} ${name} | ${a.n} ${a.w}–${a.l} ${a.roi >= 0 ? '+' : ''}${a.roi.toFixed(0)}% ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(1)}u | ${b.n} ${b.w}–${b.l} ${b.roi == null ? '—' : `${b.roi >= 0 ? '+' : ''}${b.roi.toFixed(0)}%`} |`);
  }
  lines.push('');
  lines.push(`Baseline: ${base.n} ${base.w}–${base.l} ${base.roi >= 0 ? '+' : ''}${base.roi.toFixed(1)}% ${base.pnl >= 0 ? '+' : ''}${base.pnl.toFixed(1)}u`);
}

function out(lines, s = '') { lines.push(s); console.log(s); }

async function main() {
  const db = initDb();
  console.log('Loading profiles…');
  const profiles = await loadProfiles(db);
  console.log(`Profiles: ${profiles.size}`);
  console.log('Loading tickets…');
  const all = await loadTickets(db, profiles);
  const top = all.filter((r) => r.isTop);
  const topAug = top.filter((r) => r.date >= '2026-08-01');
  const topWithLead = top.filter((r) => r.primary);
  const topAugLead = topAug.filter((r) => r.primary);

  const lines = [];
  out(lines, '# TOP lead-wallet W vs L — thin / young / quality?');
  out(lines, `Generated: ${new Date().toISOString()}`);
  out(lines, `HC lead = FOR side + sport whitelistTier CONFIRMED + stamped sizeRatio ≥ ${HC_RATIO}`);
  out(lines, '');
  out(lines, `TOP ≥4u Jun15+: ${top.length} · with identifiable HC lead: **${topWithLead.length}**`);
  out(lines, `TOP ≥4u August: ${topAug.length} · with lead: **${topAugLead.length}**`);
  out(lines, `No-lead rate (can't resolve CONFIRMED+SR≥1.5 on stamp): ${top.length - topWithLead.length} / ${top.length}`);
  out(lines, '');

  // Coverage note
  const noLead = top.filter((r) => !r.primary);
  if (noLead.length) {
    out(lines, `No-lead examples (first 8): ${noLead.slice(0, 8).map((r) => `${r.date} ${r.team} hc=${r.hcFor}-${r.hcFor != null ? (r.hcFor - (r.hcMargin ?? 0)) : '?'}`).join(' · ')}`);
    out(lines, '');
  }

  out(lines, '## 1) Primary HC lead — continuous W vs L (all TOP ≥4u with lead)');
  out(lines, '');
  const wins = topWithLead.filter((r) => r.won);
  const losses = topWithLead.filter((r) => !r.won);
  featTable(lines, wins, losses, [
    ['sport picks.n', (r) => r.primary.picksN],
    ['sport positions.n', (r) => r.primary.posN],
    ['wallet age (days @ pick)', (r) => r.ageDays],
    ['sport picks WR', (r) => r.primary.picksWr],
    ['sport pos WR', (r) => r.primary.posWr],
    ['sport $ROI', (r) => r.primary.dollarRoi],
    ['sport flat ROI', (r) => r.primary.flatRoi],
    ['global picks.n', (r) => r.primary.globalN],
    ['global positions.n', (r) => r.primary.globalPosN],
    ['global picks WR', (r) => r.primary.globalWr],
    ['global $ROI', (r) => r.primary.globalDollarRoi],
    ['lead sizeRatio', (r) => r.primary.sizeRatio],
    ['lead invested $', (r) => r.primary.invested],
    ['# HC leads on ticket', (r) => r.leadN],
  ]);
  out(lines, '');

  out(lines, '## 2) Same features — August TOP only');
  out(lines, '');
  featTable(lines, topAugLead.filter((r) => r.won), topAugLead.filter((r) => !r.won), [
    ['sport picks.n', (r) => r.primary.picksN],
    ['sport positions.n', (r) => r.primary.posN],
    ['wallet age (days)', (r) => r.ageDays],
    ['sport picks WR', (r) => r.primary.picksWr],
    ['sport $ROI', (r) => r.primary.dollarRoi],
    ['global picks.n', (r) => r.primary.globalN],
    ['lead sizeRatio', (r) => r.primary.sizeRatio],
    ['# HC leads', (r) => r.leadN],
  ]);
  out(lines, '');

  out(lines, '## 3) Binary flags — does thin/young/bad sport book separate?');
  out(lines, '');
  out(lines, '### All TOP ≥4u with lead');
  out(lines, '');
  rateTable(lines, topWithLead, [
    { name: 'sport picks.n < 8', fn: (r) => r.thinPicks8 },
    { name: 'sport picks.n < 15', fn: (r) => r.thinPicks15 },
    { name: 'sport positions.n < 20', fn: (r) => r.thinPos20 },
    { name: 'wallet age < 30d', fn: (r) => r.young30 },
    { name: 'wallet age < 60d', fn: (r) => r.young60 },
    { name: 'sole HC lead (leadN=1)', fn: (r) => r.soleHc },
    { name: 'gap_enrichment lead', fn: (r) => r.gapLead },
    { name: 'sport $ROI < 0', fn: (r) => r.sportDollarNeg },
    { name: 'sport picks WR < 50', fn: (r) => r.sportWrLt50 },
    { name: 'sport picks WR < 55', fn: (r) => r.sportWrLt55 },
    { name: 'thin (<15 picks) AND young (<60d)', fn: (r) => r.thinPicks15 && r.young60 },
    { name: 'thin (<8) OR young (<30d)', fn: (r) => r.thinPicks8 || r.young30 },
    { name: 'sport $ROI < 0 AND picks.n < 15', fn: (r) => r.sportDollarNeg && r.thinPicks15 },
    { name: 'lead sizeRatio ≥ 3', fn: (r) => r.primary.sizeRatio >= 3 },
    { name: 'lead sizeRatio 1.5–2', fn: (r) => r.primary.sizeRatio >= 1.5 && r.primary.sizeRatio < 2 },
  ]);
  out(lines, '');
  out(lines, '### August TOP ≥4u with lead');
  out(lines, '');
  rateTable(lines, topAugLead, [
    { name: 'sport picks.n < 8', fn: (r) => r.thinPicks8 },
    { name: 'sport picks.n < 15', fn: (r) => r.thinPicks15 },
    { name: 'sport positions.n < 20', fn: (r) => r.thinPos20 },
    { name: 'wallet age < 30d', fn: (r) => r.young30 },
    { name: 'wallet age < 60d', fn: (r) => r.young60 },
    { name: 'sole HC lead', fn: (r) => r.soleHc },
    { name: 'gap_enrichment lead', fn: (r) => r.gapLead },
    { name: 'sport $ROI < 0', fn: (r) => r.sportDollarNeg },
    { name: 'sport picks WR < 55', fn: (r) => r.sportWrLt55 },
    { name: 'thin (<15) OR young (<60d)', fn: (r) => r.thinPicks15 || r.young60 },
  ]);

  out(lines, '');
  out(lines, '## 4) August TOP losses — primary lead wallet dump');
  out(lines, '');
  out(lines, '| Date | Pick | U | Lead | Age d | Sport n/WR/$ROI | Pos n | SR | Gap | R |');
  out(lines, '|------|------|--:|------|------:|-----------------|------:|---:|:--:|:-:|');
  for (const r of topAugLead.filter((x) => !x.won).sort((a, b) => a.date.localeCompare(b.date))) {
    const p = r.primary;
    out(lines, `| ${r.date} | ${String(r.team).replace(/\|/g, '/')} | ${r.units.toFixed(1)} | \`${p.wallet}\` | ${r.ageDays == null ? '—' : r.ageDays.toFixed(0)} | ${p.picksN ?? '—'}/${p.picksWr?.toFixed(0) ?? '—'}%/${p.dollarRoi?.toFixed(0) ?? '—'}% | ${p.posN ?? '—'} | ${p.sizeRatio.toFixed(2)} | ${p.gap ? 'Y' : ''} | L |`);
  }
  out(lines, '');
  out(lines, '## 5) August TOP wins — primary lead wallet dump');
  out(lines, '');
  out(lines, '| Date | Pick | U | Lead | Age d | Sport n/WR/$ROI | Pos n | SR | Gap | R |');
  out(lines, '|------|------|--:|------|------:|-----------------|------:|---:|:--:|:-:|');
  for (const r of topAugLead.filter((x) => x.won).sort((a, b) => a.date.localeCompare(b.date))) {
    const p = r.primary;
    out(lines, `| ${r.date} | ${String(r.team).replace(/\|/g, '/')} | ${r.units.toFixed(1)} | \`${p.wallet}\` | ${r.ageDays == null ? '—' : r.ageDays.toFixed(0)} | ${p.picksN ?? '—'}/${p.picksWr?.toFixed(0) ?? '—'}%/${p.dollarRoi?.toFixed(0) ?? '—'}% | ${p.posN ?? '—'} | ${p.sizeRatio.toFixed(2)} | ${p.gap ? 'Y' : ''} | W |`);
  }

  // Repeat leads — same wallet driving multiple TOP tickets
  out(lines, '');
  out(lines, '## 6) Repeat HC leads on TOP (Jun15+) — which wallets show up?');
  out(lines, '');
  const byWallet = new Map();
  for (const r of topWithLead) {
    const w = r.primary.wallet;
    if (!byWallet.has(w)) byWallet.set(w, []);
    byWallet.get(w).push(r);
  }
  const repeats = [...byWallet.entries()]
    .filter(([, rs]) => rs.length >= 2)
    .map(([w, rs]) => ({ w, a: agg(rs), rs, p: rs[0].primary }))
    .sort((a, b) => b.rs.length - a.rs.length || (a.a.roi ?? 0) - (b.a.roi ?? 0));
  out(lines, '| Wallet | TOP tickets | W–L | ROI | PnL | Sport n | Age@first | Sport $ROI |');
  out(lines, '|--------|------------:|:---:|----:|----:|--------:|----------:|-----------:|');
  for (const x of repeats.slice(0, 25)) {
    const first = x.rs.slice().sort((a, b) => a.date.localeCompare(b.date))[0];
    out(lines, `| \`${x.w}\` | ${x.rs.length} | ${x.a.w}–${x.a.l} | ${x.a.roi >= 0 ? '+' : ''}${x.a.roi.toFixed(0)}% | ${x.a.pnl >= 0 ? '+' : ''}${x.a.pnl.toFixed(1)}u | ${x.p.picksN ?? '—'} | ${first.ageDays?.toFixed(0) ?? '—'} | ${x.p.dollarRoi?.toFixed(0) ?? '—'}% |`);
  }

  // Compare SUPER leads for contrast
  out(lines, '');
  out(lines, '## 7) Contrast: SUPER primary HC lead (should be healthier)');
  out(lines, '');
  const superRows = all.filter((r) => r.path === 'SUPER' && r.primary);
  featTable(lines, superRows.filter((r) => r.won), superRows.filter((r) => !r.won), [
    ['sport picks.n', (r) => r.primary.picksN],
    ['wallet age', (r) => r.ageDays],
    ['sport $ROI', (r) => r.primary.dollarRoi],
    ['sport picks WR', (r) => r.primary.picksWr],
  ]);
  out(lines, '');
  out(lines, `SUPER with lead: ${agg(superRows).n} tickets · ${fmtShort(agg(superRows))}`);
  out(lines, `TOP lead sport picks.n mean: W ${mean(wins.map((r) => r.primary.picksN))?.toFixed(1)} vs L ${mean(losses.map((r) => r.primary.picksN))?.toFixed(1)}`);
  out(lines, `SUPER lead sport picks.n mean: ${mean(superRows.map((r) => r.primary.picksN))?.toFixed(1)}`);

  out(lines, '');
  out(lines, '## 8) Read');
  out(lines, '');
  const thin = agg(topWithLead.filter((r) => r.thinPicks15));
  const thick = agg(topWithLead.filter((r) => !r.thinPicks15));
  const young = agg(topWithLead.filter((r) => r.young60));
  const old = agg(topWithLead.filter((r) => !r.young60));
  out(lines, `- Thin sport sample (<15 picks): ${fmtShort(thin)} vs rest ${fmtShort(thick)}`);
  out(lines, `- Young wallet (<60d): ${fmtShort(young)} vs rest ${fmtShort(old)}`);
  out(lines, '- If Δ is large → lead-wallet quality/age is a real separator.');
  out(lines, '- If flat → TOP bleed is elsewhere (market mix / single-HC structure), not thin leads.');

  const md = join(REPO_ROOT, 'tmp_top_lead_wallets.md');
  writeFileSync(md, `${lines.join('\n')}\n`);
  writeFileSync(join(REPO_ROOT, 'tmp_top_lead_wallets.json'), JSON.stringify({
    generated: new Date().toISOString(),
    topWithLead,
    topAugLead,
  }, null, 2));
  console.log(`\nWrote ${md}`);
}

function fmtShort(a) {
  if (!a?.n) return 'n=0';
  return `${a.n} ${a.w}–${a.l} ${a.roi >= 0 ? '+' : ''}${a.roi.toFixed(0)}% ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(1)}u`;
}

main().catch((e) => { console.error(e); process.exit(1); });
