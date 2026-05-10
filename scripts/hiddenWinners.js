/**
 * hiddenWinners.js — surface wallets that exist ONLY in Source B
 * (sharp_action_positions) and never appeared in Source A
 * (peak.v8Scoring.walletDetails on graded picks). These are sharps we're
 * fully tracking via the on-chain feed but who can NEVER drive Δw under
 * the current rules — Δw is built from Source A only.
 *
 * For each sport, lists every B-only wallet with stats from positions:
 *   - N graded positions, VAULT vs SHADOW split
 *   - $ invested, $ PnL, $ ROI, WR
 *   - leaderboard rank
 *   - first/last activity date
 *
 * Categorises into:
 *   §A. Profitable hidden winners ($ ROI > 0 AND N ≥ 2)
 *   §B. Borderline ($ ROI between -5% and +5% OR N=1)
 *   §C. Hidden bleeders ($ ROI < -5% AND N ≥ 2)
 *
 * Writes HIDDEN_WINNERS.md.
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

const V6_CUTOVER = '2026-04-18';
const COLLECTIONS = ['sharpFlowPicks', 'sharpFlowSpreads', 'sharpFlowTotals'];
const SPORTS = ['MLB', 'NBA', 'NHL'];
const OPPOSITE = { home: 'away', away: 'home', over: 'under', under: 'over' };

const fmtPct = (v) => v == null ? '—' : `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`;
const fmtMoney = (v) => v == null ? '—' : (v >= 0 ? `+$${Math.round(v).toLocaleString()}` : `-$${Math.round(-v).toLocaleString()}`);

async function loadSourceAWallets() {
  // Just need the SET of wallets in source A per sport for the diff.
  const wallets = {};   // sport → Set of walletShort
  for (const sport of SPORTS) wallets[sport] = new Set();
  for (const col of COLLECTIONS) {
    const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sport = d.sport;
      if (!SPORTS.includes(sport)) continue;
      const sides = d.sides || {};
      for (const [, side] of Object.entries(sides)) {
        const peak = side.peak || side.lock || {};
        const wd = peak?.v8Scoring?.walletDetails;
        const oc = side?.result?.outcome;
        const graded = oc === 'WIN' || oc === 'LOSS' || oc === 'PUSH';
        if (!graded || !Array.isArray(wd)) continue;
        for (const w of wd) if (w.wallet) wallets[sport].add(w.wallet);
      }
    }
  }
  return wallets;
}

async function loadSourceBPositions() {
  const snap = await db.collection('sharp_action_positions').get();
  const positions = [];
  snap.forEach(doc => {
    const d = doc.data();
    if (!d.wallet) return;
    if (d.status !== 'GRADED') return;
    if (!SPORTS.includes(d.sport)) return;
    positions.push({
      docId: doc.id,
      date: d.date,
      sport: d.sport,
      market: d.marketType,
      walletShort: d.walletShort || String(d.wallet).slice(-6),
      vaultQualified: d.vaultQualified !== false,
      invested: Number(d.invested ?? d.size ?? 0),
      settledPnl: Number(d.settledPnl ?? d.positionPnl ?? 0),
      sportROI: d.sportROI,
      sportPnlTotal: d.sportPnlTotal,
      sportVol: d.sportVol,
      leaderboardRank: d.leaderboardRank,
    });
  });
  return positions;
}

async function loadProfiles() {
  const snap = await db.collection('sharpWalletProfiles').get();
  const profiles = new Map();
  snap.forEach(doc => profiles.set(doc.id, doc.data()));
  return profiles;
}

function aggregatePositions(rows) {
  const n = rows.length;
  const wins = rows.filter(p => p.settledPnl > 0).length;
  const invested = rows.reduce((a, p) => a + p.invested, 0);
  const pnl = rows.reduce((a, p) => a + p.settledPnl, 0);
  const vault = rows.filter(p => p.vaultQualified).length;
  const dates = rows.map(p => p.date).filter(Boolean).sort();
  return {
    n, wins,
    wr: n ? wins / n * 100 : 0,
    vault, shadow: n - vault,
    invested, pnl,
    dollarRoi: invested > 0 ? pnl / invested * 100 : null,
    firstDate: dates[0],
    lastDate: dates[dates.length - 1],
    daysActive: new Set(dates).size,
    lbRank: rows.find(p => p.leaderboardRank)?.leaderboardRank ?? null,
    sportROI: rows.find(p => p.sportROI != null)?.sportROI ?? null,
    sportPnlTotal: rows.find(p => p.sportPnlTotal != null)?.sportPnlTotal ?? null,
  };
}

(async () => {
  console.log('Loading Source A wallets…');
  const aWallets = await loadSourceAWallets();
  console.log('Loading Source B positions…');
  const positions = await loadSourceBPositions();
  console.log('Loading profiles…');
  const profiles = await loadProfiles();

  const out = [];
  out.push('# HIDDEN WINNERS — wallets visible only in Source B');
  out.push('');
  out.push(`Generated: **${new Date().toISOString()}** · v6 cutover=${V6_CUTOVER}`);
  out.push('');
  out.push('Wallets that are placing graded sharp positions on the on-chain feed (Source B = `sharp_action_positions`) but have **never appeared in Source A** (`peak.v8Scoring.walletDetails`) for that sport. Under the current rules, **these wallets cannot ever contribute to Δw** — the gate reads only Source A.');
  out.push('');
  out.push('A wallet ends up B-only when they exclusively bet games we did NOT feature on Sharp Intel. We pick ~6 MLB games / ~7 NBA games / ~3 NHL games per day; the on-chain feed sees every position regardless of feature status.');
  out.push('');

  const summary = { sports: {}, totalWinners: 0 };

  for (const sport of SPORTS) {
    const aSet = aWallets[sport];
    const sportPos = positions.filter(p => p.sport === sport);
    const byWallet = new Map();
    for (const p of sportPos) {
      if (!byWallet.has(p.walletShort)) byWallet.set(p.walletShort, []);
      byWallet.get(p.walletShort).push(p);
    }
    const bOnly = [...byWallet.keys()].filter(w => !aSet.has(w));
    const rows = bOnly.map(w => {
      const ps = byWallet.get(w);
      const agg = aggregatePositions(ps);
      const profile = profiles.get(w);
      const profileTier = profile?.bySport?.[sport]?.whitelistTier || null;
      return { wallet: w, profileTier, ...agg };
    });

    const winners   = rows.filter(r => r.n >= 2 && r.dollarRoi != null && r.dollarRoi >= 5).sort((a, b) => (b.dollarRoi || 0) - (a.dollarRoi || 0));
    const borderline= rows.filter(r => (r.n >= 2 && r.dollarRoi != null && r.dollarRoi > -5 && r.dollarRoi < 5) || r.n === 1).sort((a, b) => (b.dollarRoi || 0) - (a.dollarRoi || 0));
    const bleeders  = rows.filter(r => r.n >= 2 && r.dollarRoi != null && r.dollarRoi <= -5).sort((a, b) => (a.dollarRoi || 0) - (b.dollarRoi || 0));

    summary.sports[sport] = {
      total: rows.length,
      winners: winners.length,
      borderline: borderline.length,
      bleeders: bleeders.length,
    };
    summary.totalWinners += winners.length;

    out.push(`---`);
    out.push(`## ${sport} — ${rows.length} B-only wallets`);
    out.push('');
    out.push(`Hidden winners (N≥2, $ ROI ≥ +5%): **${winners.length}** · borderline: ${borderline.length} · bleeders: ${bleeders.length}`);
    out.push('');

    if (winners.length) {
      out.push(`### §A. Hidden winners — ${sport}`);
      out.push('');
      out.push('| # | Wallet | Pos N | Vault | Shadow | $ Invested | $ PnL | $ ROI | WR | LB rank | Days | First → Last | Profile tier |');
      out.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|');
      winners.forEach((w, i) => {
        out.push(`| ${i + 1} | \`${w.wallet}\` | ${w.n} | ${w.vault} | ${w.shadow} | ${fmtMoney(w.invested)} | ${fmtMoney(w.pnl)} | ${fmtPct(w.dollarRoi)} | ${w.wr.toFixed(0)}% | ${w.lbRank ?? '—'} | ${w.daysActive} | ${w.firstDate} → ${w.lastDate} | ${w.profileTier ?? 'NULL'} |`);
      });
      out.push('');
    } else {
      out.push(`### §A. Hidden winners — ${sport}`);
      out.push('');
      out.push(`_None._`);
      out.push('');
    }

    if (borderline.length) {
      out.push(`### §B. Borderline — ${sport} (N=1 OR -5% < $ ROI < +5%)`);
      out.push('');
      out.push('| Wallet | Pos N | $ Invested | $ PnL | $ ROI | WR | LB rank | Days | Tier |');
      out.push('|---|---|---|---|---|---|---|---|---|');
      borderline.slice(0, 20).forEach(w => {
        out.push(`| \`${w.wallet}\` | ${w.n} | ${fmtMoney(w.invested)} | ${fmtMoney(w.pnl)} | ${fmtPct(w.dollarRoi)} | ${w.wr.toFixed(0)}% | ${w.lbRank ?? '—'} | ${w.daysActive} | ${w.profileTier ?? 'NULL'} |`);
      });
      if (borderline.length > 20) out.push(`| _...${borderline.length - 20} more_ | | | | | | | | |`);
      out.push('');
    }

    if (bleeders.length) {
      out.push(`### §C. Hidden bleeders — ${sport} (N≥2, $ ROI ≤ -5%)`);
      out.push('');
      out.push('| Wallet | Pos N | $ Invested | $ PnL | $ ROI | WR | LB rank | Tier |');
      out.push('|---|---|---|---|---|---|---|---|');
      bleeders.slice(0, 15).forEach(w => {
        out.push(`| \`${w.wallet}\` | ${w.n} | ${fmtMoney(w.invested)} | ${fmtMoney(w.pnl)} | ${fmtPct(w.dollarRoi)} | ${w.wr.toFixed(0)}% | ${w.lbRank ?? '—'} | ${w.profileTier ?? 'NULL'} |`);
      });
      if (bleeders.length > 15) out.push(`| _...${bleeders.length - 15} more_ | | | | | | | |`);
      out.push('');
    }
  }

  // ─── Promotion eligibility analysis ───────────────────────────
  out.push('---');
  out.push('## Total addressable Δw expansion if we admit Source B alone');
  out.push('');
  out.push('| Sport | Currently Δw-eligible (CONFIRMED+FLAT) | + Hidden winners (B-only, N≥2, $ROI≥+5%) | New ceiling |');
  out.push('|---|---|---|---|');
  for (const sport of SPORTS) {
    let curr = 0;
    for (const [, p] of profiles) {
      const t = p.bySport?.[sport]?.whitelistTier;
      if (t === 'CONFIRMED' || t === 'FLAT') curr++;
    }
    const winnersN = summary.sports[sport].winners;
    out.push(`| ${sport} | ${curr} | +${winnersN} | **${curr + winnersN}** |`);
  }
  out.push('');

  out.push('### Caveats before promoting any of these');
  out.push('');
  out.push('1. **Selection bias.** Source B includes positions on every game on the books. A wallet might be +ROI in MLB only because they bet 3 dog totals in low-juice spots we never featured — that signal may not transfer to the high-public-attention games we DO feature.');
  out.push('2. **No flat-ROI cross-check.** The CONFIRMED tier requires both Source A flat ROI > 0 AND Source B $ ROI > 0. B-only wallets have only one signal — half the gating reduces robustness.');
  out.push('3. **Leaderboard rank is informative.** The hidden-winner rows above with sub-100 LB ranks (better than 100th place on the on-chain feed) are the strongest candidates; those with rank > 400 may be variance-driven.');
  out.push('4. **VAULT share matters.** A wallet whose +ROI comes from VAULT positions (full conviction) is more credible than one whose +ROI comes from SHADOW positions (small bets).');
  out.push('');

  const md = out.join('\n');
  const path = join(__dirname, '..', 'HIDDEN_WINNERS.md');
  writeFileSync(path, md);
  console.log(`Wrote ${path}`);
  console.log('');
  console.log('=== Summary ===');
  for (const sport of SPORTS) {
    const s = summary.sports[sport];
    console.log(`${sport}: ${s.total} B-only wallets · ${s.winners} hidden winners · ${s.borderline} borderline · ${s.bleeders} hidden bleeders`);
  }
  console.log(`\nTotal hidden winners across sports: ${summary.totalWinners}`);
  process.exit(0);
})().catch(err => {
  console.error('[hiddenWinners] FATAL', err);
  process.exit(1);
});
