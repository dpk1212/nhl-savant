/**
 * provenWinnersRoster.js — list every wallet currently qualified to drive
 * Δw (the "proven winner" margin) on Sharp Intel locks, plus the exact
 * criteria they had to clear, plus the near-miss bench.
 *
 * Source of truth: `sharpWalletProfiles` collection.  Δw is whitelist-gated
 * inside SharpFlow.jsx::computeWalletConsensus — only wallets whose
 * `bySport[sport].whitelistTier` ∈ {CONFIRMED, FLAT} count.  WR50 + NULL
 * are tracked but do NOT contribute to Δw.
 *
 * Writes PROVEN_WINNERS_ROSTER.md.
 *
 * Usage:
 *   node scripts/provenWinnersRoster.js
 *   node scripts/provenWinnersRoster.js --console-only
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
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

const argv = process.argv.slice(2);
const CONSOLE_ONLY = argv.includes('--console-only');

const SPORTS = ['MLB', 'NBA', 'NHL'];

const fmtPct = (v) => v == null ? '—' : `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`;
const fmtMoney = (v) => v == null ? '—' : v >= 0 ? `+$${Math.round(v)}` : `-$${Math.round(-v)}`;
const fmtSign = (v, d = 2) => v == null ? '—' : v >= 0 ? `+${v.toFixed(d)}` : v.toFixed(d);

(async () => {
  const snap = await db.collection('sharpWalletProfiles').get();
  const profiles = [];
  snap.forEach(doc => profiles.push({ id: doc.id, ...doc.data() }));

  const out = [];
  out.push('# PROVEN WINNERS ROSTER');
  out.push('');
  out.push(`Generated: **${new Date().toISOString()}**`);
  out.push('');
  out.push('Wallets that currently qualify to drive **Δw (proven winner margin)** on Sharp Intel locks. Only wallets in **CONFIRMED** or **FLAT** tiers count toward Δw — WR50 and NULL are tracked for reporting but do NOT contribute to lock decisions.');
  out.push('');

  out.push('---');
  out.push('## The bar — what a wallet has to clear');
  out.push('');
  out.push('Two independent data sources feed the gate. Both come from `exportWalletProfiles.js`, written to `sharpWalletProfiles`. The bar is per-sport (a wallet can be CONFIRMED in NBA but NULL in MLB).');
  out.push('');
  out.push('**Source A — Picks-side (flat 1u replay over `walletDetails`):**');
  out.push('');
  out.push('- For every graded `sharpFlow{Picks,Spreads,Totals}` doc since 2026-04-18, take every wallet that appears in `peak.v8Scoring.walletDetails[]` for any side');
  out.push('- Each wallet × sport row computes:');
  out.push('  - `n` = bets in that sport');
  out.push('  - `wr` = wins / n');
  out.push('  - `flatRoi` = sum of 1u flat PnL ÷ n × 100  (decimal-odds win pays `dec − 1`, loss pays `−1`)');
  out.push('');
  out.push('**Source B — Position-side (dollar-weighted PnL from `sharp_action_positions`):**');
  out.push('');
  out.push('- Every GRADED row from `sharp_action_positions` per wallet × sport');
  out.push('- Computes `dollarRoi` = `sum(settledPnl) / sum(invested) × 100`');
  out.push('');
  out.push('**Tier classification (per wallet × sport, exact code from `exportWalletProfiles.js`):**');
  out.push('');
  out.push('```');
  out.push('const WHITELIST_MIN_BETS = 2;');
  out.push('');
  out.push('flatOk   = picks.n   ≥ 2 AND picks.flatRoi   > 0     // Source A');
  out.push('dollarOk = positions.n ≥ 2 AND positions.dollarRoi > 0  // Source B');
  out.push('wr50Ok   = picks.n   ≥ 2 AND picks.wr ≥ 50%          // Source A only');
  out.push('');
  out.push('if (flatOk && dollarOk) return CONFIRMED;   // both sources profitable');
  out.push('if (flatOk)             return FLAT;        // picks profitable, positions not yet ≥2 bets OR not profitable');
  out.push('if (wr50Ok)             return WR50;        // hits ≥50% WR but bleeds on flat ROI (variance / line shopping)');
  out.push('return null;                                // below the bar');
  out.push('```');
  out.push('');
  out.push('**What gates Δw in production** (from `SharpFlow.jsx::computeWalletConsensus`):');
  out.push('');
  out.push('```');
  out.push('for (const d of walletDetails) {');
  out.push('  const tier = profiles.get(d.wallet)?.bySport?.[sport]?.whitelistTier;');
  out.push('  if (tier !== \'CONFIRMED\' && tier !== \'FLAT\') continue;  // <-- the gate');
  out.push('  if (d.side === sideKey) forW++; else if (d.side) agW++;');
  out.push('}');
  out.push('Δw = forW − agW');
  out.push('```');
  out.push('');
  out.push('Bottom line: **CONFIRMED + FLAT** is the universe of wallets whose vote moves Δw. WR50 wallets are surfaced in cards/tooltips but they do NOT bump Δw or trigger locks.');
  out.push('');
  out.push('---');

  // ── Per-sport rosters ─────────────────────────────────────────────
  out.push('## Active rosters (CONFIRMED + FLAT) by sport');
  out.push('');
  for (const sport of SPORTS) {
    const slice = [];
    for (const p of profiles) {
      const rec = p.bySport?.[sport];
      if (!rec) continue;
      const t = rec.whitelistTier;
      if (t !== 'CONFIRMED' && t !== 'FLAT') continue;
      slice.push({
        walletShort: p.walletShort,
        tier: t,
        firstDate: p.firstBetDate,
        lastDate: p.lastBetDate,
        rank: p.latestLbRank,
        walletBase: p.latest?.walletBase,
        n: rec.picks?.n || 0,
        wr: rec.picks?.wr || 0,
        flatPnl: rec.picks?.flatPnl,
        flatRoi: rec.picks?.flatRoi,
        posN: rec.positions?.n || 0,
        invested: rec.positions?.invested,
        settledPnl: rec.positions?.settledPnl,
        dollarRoi: rec.positions?.dollarRoi,
      });
    }
    slice.sort((a, b) => {
      if (a.tier !== b.tier) return a.tier === 'CONFIRMED' ? -1 : 1;
      return (b.flatRoi || 0) - (a.flatRoi || 0);
    });

    const conf = slice.filter(w => w.tier === 'CONFIRMED').length;
    const flat = slice.filter(w => w.tier === 'FLAT').length;
    out.push(`### ${sport} — ${slice.length} active (${conf} CONFIRMED · ${flat} FLAT)`);
    out.push('');
    if (!slice.length) {
      out.push('_No wallets currently qualified in this sport._');
      out.push('');
      continue;
    }
    out.push('| # | Wallet | Tier | LB rank | walletBase | Picks N | WR | Flat ROI | Flat PnL (u) | Pos N | $ Invested | $ PnL | $ ROI | First → Last |');
    out.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
    slice.forEach((w, i) => {
      out.push(`| ${i + 1} | \`${w.walletShort}\` | **${w.tier}** | ${w.rank ?? '—'} | ${w.walletBase ?? '—'} | ${w.n} | ${w.wr.toFixed(0)}% | ${fmtPct(w.flatRoi)} | ${fmtSign(w.flatPnl, 2)} | ${w.posN} | ${fmtMoney(w.invested)} | ${fmtMoney(w.settledPnl)} | ${fmtPct(w.dollarRoi)} | ${w.firstDate || '—'} → ${w.lastDate || '—'} |`);
    });
    out.push('');
  }

  out.push('---');
  out.push('## On the bench — WR50 (not yet promoted to Δw)');
  out.push('');
  out.push('These wallets are hitting ≥50% WR but their flat ROI is ≤ 0, so they fail the FLAT bar. Variance / line-quality issues. Tracked but inert.');
  out.push('');

  let benchTotal = 0;
  for (const sport of SPORTS) {
    const slice = [];
    for (const p of profiles) {
      const rec = p.bySport?.[sport];
      if (!rec || rec.whitelistTier !== 'WR50') continue;
      slice.push({
        walletShort: p.walletShort,
        rank: p.latestLbRank,
        n: rec.picks?.n || 0,
        wr: rec.picks?.wr || 0,
        flatRoi: rec.picks?.flatRoi,
        flatPnl: rec.picks?.flatPnl,
        dollarRoi: rec.positions?.dollarRoi,
        posN: rec.positions?.n || 0,
      });
    }
    slice.sort((a, b) => (b.wr || 0) - (a.wr || 0));
    if (!slice.length) continue;
    benchTotal += slice.length;
    out.push(`### ${sport} bench — ${slice.length}`);
    out.push('');
    out.push('| Wallet | LB rank | Picks N | WR | Flat ROI | Flat PnL (u) | Pos N | $ ROI |');
    out.push('|---|---|---|---|---|---|---|---|');
    for (const w of slice) {
      out.push(`| \`${w.walletShort}\` | ${w.rank ?? '—'} | ${w.n} | ${w.wr.toFixed(0)}% | ${fmtPct(w.flatRoi)} | ${fmtSign(w.flatPnl, 2)} | ${w.posN} | ${fmtPct(w.dollarRoi)} |`);
    }
    out.push('');
  }
  if (benchTotal === 0) {
    out.push('_No WR50 wallets in any tracked sport._');
    out.push('');
  }

  // ── On the verge — wallets at 1 bet (one more graded bet from the bar) ──
  out.push('---');
  out.push('## On the verge — N=1 in sport (one more graded bet from clearing the floor)');
  out.push('');
  out.push('Wallets with exactly 1 graded pick in a sport (`WHITELIST_MIN_BETS=2` blocks them). One more bet either confirms or clears them.');
  out.push('');
  for (const sport of SPORTS) {
    const slice = [];
    for (const p of profiles) {
      const rec = p.bySport?.[sport];
      if (!rec) continue;
      if ((rec.picks?.n || 0) !== 1) continue;
      slice.push({
        walletShort: p.walletShort,
        won: rec.picks?.wins || 0,
        flatPnl: rec.picks?.flatPnl,
        rank: p.latestLbRank,
        posN: rec.positions?.n || 0,
        dollarRoi: rec.positions?.dollarRoi,
      });
    }
    slice.sort((a, b) => (b.flatPnl || 0) - (a.flatPnl || 0));
    if (!slice.length) continue;
    out.push(`### ${sport} N=1 — ${slice.length}`);
    out.push('');
    out.push('| Wallet | Won? | Flat PnL (u) | LB rank | Pos N | $ ROI |');
    out.push('|---|---|---|---|---|---|');
    for (const w of slice) {
      out.push(`| \`${w.walletShort}\` | ${w.won ? 'W' : 'L'} | ${fmtSign(w.flatPnl, 2)} | ${w.rank ?? '—'} | ${w.posN} | ${fmtPct(w.dollarRoi)} |`);
    }
    out.push('');
  }

  // ── headline numbers ──────────────────────────────────────────────
  out.push('---');
  out.push('## At a glance');
  out.push('');
  let totalConf = 0, totalFlat = 0, totalWr50 = 0, totalNull = 0;
  for (const sport of SPORTS) {
    let c = 0, f = 0, w = 0, n = 0;
    for (const p of profiles) {
      const t = p.bySport?.[sport]?.whitelistTier;
      if (t === 'CONFIRMED') c++;
      else if (t === 'FLAT') f++;
      else if (t === 'WR50') w++;
      else if (p.bySport?.[sport]) n++;
    }
    totalConf += c; totalFlat += f; totalWr50 += w; totalNull += n;
  }
  out.push('| Sport | CONFIRMED | FLAT | **Δw eligible** | WR50 (bench) | NULL (tracked) |');
  out.push('|---|---|---|---|---|---|');
  for (const sport of SPORTS) {
    let c = 0, f = 0, w = 0, n = 0;
    for (const p of profiles) {
      const t = p.bySport?.[sport]?.whitelistTier;
      if (t === 'CONFIRMED') c++;
      else if (t === 'FLAT') f++;
      else if (t === 'WR50') w++;
      else if (p.bySport?.[sport]) n++;
    }
    out.push(`| ${sport} | ${c} | ${f} | **${c + f}** | ${w} | ${n} |`);
  }
  out.push(`| **Total** | **${totalConf}** | **${totalFlat}** | **${totalConf + totalFlat}** | **${totalWr50}** | **${totalNull}** |`);
  out.push('');

  const md = out.join('\n');
  if (!CONSOLE_ONLY) {
    const path = join(__dirname, '..', 'PROVEN_WINNERS_ROSTER.md');
    writeFileSync(path, md);
    console.log(`Wrote ${path}`);
  }
  console.log('\n=== Δw-eligible roster (CONFIRMED + FLAT) ===');
  for (const sport of SPORTS) {
    const winners = profiles
      .map(p => ({ w: p.walletShort, t: p.bySport?.[sport]?.whitelistTier, rec: p.bySport?.[sport] }))
      .filter(r => r.t === 'CONFIRMED' || r.t === 'FLAT')
      .sort((a, b) => (b.rec?.picks?.flatRoi || 0) - (a.rec?.picks?.flatRoi || 0));
    console.log(`\n${sport} (${winners.length} eligible):`);
    for (const r of winners) {
      const p = r.rec.picks || {};
      const q = r.rec.positions || {};
      console.log(`  ${r.t.padEnd(9)} ${r.w}  picks: n=${p.n} wr=${(p.wr||0).toFixed(0)}% flatROI=${(p.flatRoi||0).toFixed(1)}%  pos: n=${q.n||0} $ROI=${q.dollarRoi != null ? q.dollarRoi.toFixed(1) + '%' : '—'}`);
    }
  }
  console.log(`\nTotals — CONFIRMED ${totalConf}, FLAT ${totalFlat}, Δw-eligible ${totalConf + totalFlat}, WR50 bench ${totalWr50}.`);
  process.exit(0);
})().catch(err => {
  console.error('[provenWinnersRoster] FATAL', err);
  process.exit(1);
});
