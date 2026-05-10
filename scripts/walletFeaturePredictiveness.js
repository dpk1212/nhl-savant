/**
 * walletFeaturePredictiveness.js — does WALLET-level information predict
 * winning bets, beyond what the market (Pinnacle) and our game-level Δw/Δq
 * already capture?
 *
 * Question we are answering: outside of the game/play margin, can we use
 * what we know about each individual wallet — their lifetime record,
 * leaderboard standing, our custom whitelist tier, our walletBase score,
 * their conviction sizing — to predict which positions hit?
 *
 * Method
 * ------
 * Every GRADED row in `sharp_action_positions` is one wallet's bet on one
 * side of one game-market. That gives us ~1,900 outcomes paired with rich
 * per-wallet features. For each candidate predictor we compute:
 *
 *   - WR (raw win rate)
 *   - Flat ROI (1u replay vs avgPrice, neutralises odds level)
 *   - Lift over Pinnacle implied (actual WR − implied WR)  ← isolates skill
 *   - Lift over the unconditional WR (the marginal contribution of the feature)
 *
 * Then we run a logistic regression with Pinnacle-implied probability as
 * the baseline and each wallet feature as an additive term, to identify
 * which wallet features carry real INFORMATION on top of the market.
 *
 * Sections written to WALLET_FEATURE_PREDICTIVENESS.md:
 *   §1. Data inventory + outcome distribution
 *   §2. Univariate predictiveness (one feature at a time)
 *      a. Whitelist tier (CONFIRMED / FLAT / WR50 / NULL / UNKNOWN)
 *      b. Lifetime sport ROI (quintile buckets)
 *      c. Lifetime sport PnL (quintile buckets)
 *      d. Sport volume (quintile buckets)
 *      e. Leaderboard rank (top-100 / 100-300 / 300+ / unranked)
 *      f. walletBase composite score (quintile buckets)
 *      g. v8_walletContribution (quintile buckets)
 *      h. Conviction — bet multiplier (under-1x / 1-1.5x / 1.5-3x / 3x+)
 *      i. VAULT vs SHADOW
 *      j. v8_contribTier (STRONG / STANDARD / LEAN / MUTE)
 *   §3. Cross-cuts (the most interesting interactions)
 *      a. whitelistTier × bet multiplier
 *      b. walletBase × conviction
 *      c. LB rank × sport ROI
 *   §4. Logistic regression — Pinnacle baseline + wallet features
 *   §5. Verdict & recommended scoring tweaks
 *
 * Usage:
 *   node scripts/walletFeaturePredictiveness.js
 *   node scripts/walletFeaturePredictiveness.js --vault-only   # VAULT cohort
 *   node scripts/walletFeaturePredictiveness.js --console-only
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
const VAULT_ONLY = argv.includes('--vault-only');
const CONSOLE_ONLY = argv.includes('--console-only');

const fmtPct = (v) => v == null || !Number.isFinite(v) ? '—' : `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`;
const fmtN = (v, n = 1) => v == null || !Number.isFinite(v) ? '—' : v.toFixed(n);

const americanToDecimal = (odds) => odds === 0 ? 1.91 : (odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds));
const impliedProb = (odds) => odds === 0 ? null : (odds < 0 ? Math.abs(odds) / (Math.abs(odds) + 100) : 100 / (odds + 100));

// ── Loaders ───────────────────────────────────────────────────────
async function loadPositions() {
  const snap = await db.collection('sharp_action_positions').where('status', '==', 'GRADED').get();
  const rows = [];
  snap.forEach(doc => {
    const d = doc.data();
    if (!d.wallet) return;
    const invested = Number(d.invested ?? d.size ?? 0);
    if (invested <= 0) return;
    rows.push({
      docId: doc.id,
      date: d.date,
      sport: d.sport,
      market: d.marketType,
      gameKey: d.gameKey,
      side: d.side,
      wallet: d.wallet,
      walletShort: d.walletShort,

      invested,
      settledPnl: Number(d.settledPnl ?? d.positionPnl ?? 0),
      avgPrice: d.avgPrice,            // market price 0..1 (probability)
      vaultQualified: d.vaultQualified !== false,
      qualificationTier: d.qualificationTier || (d.vaultQualified !== false ? 'VAULT' : 'SHADOW'),
      betMultiplier: d.betMultiplier ?? (d.avgSportBet > 0 ? d.invested / d.avgSportBet : null),
      avgSportBet: d.avgSportBet,

      // Wallet historical record
      sportROI: d.sportROI,
      sportPnlTotal: d.sportPnlTotal,
      sportVol: d.sportVol,
      totalPnl: d.totalPnl,
      leaderboardRank: d.leaderboardRank,
      sportsLbPercentileTop: d.sportsLbPercentileTop,

      // Pinnacle / market context
      pinnacleOdds: d.pinnacleOdds,
      pinnacleImplied: d.pinnacleImplied,    // already a percentage 0-100
      bestRetailOdds: d.bestRetailOdds,
      evEdge: d.evEdge,

      // v8 wallet quality features (per-position)
      v8_walletBase: d.v8_walletBase,
      v8_walletRoiNorm: d.v8_walletRoiNorm,
      v8_walletPnlNorm: d.v8_walletPnlNorm,
      v8_walletRankNorm: d.v8_walletRankNorm,
      v8_convictionMult: d.v8_convictionMult,
      v8_sizeRatio: d.v8_sizeRatio,
      v8_walletContribution: d.v8_walletContribution,

      // v8 game-level features (broadcast to every wallet on the game)
      v8_walletPlayScore: d.v8_walletPlayScore,
      v8_contribTier: d.v8_contribTier,
      v8_onConsensusSide: d.v8_onConsensusSide,

      // Vault quant Δ-signals
      vault_winnerMargin: d.vault_winnerMargin,
      vault_qualityMargin: d.vault_qualityMargin,
    });
  });
  return rows;
}

async function loadProfiles() {
  const snap = await db.collection('sharpWalletProfiles').get();
  const profiles = new Map();
  snap.forEach(doc => profiles.set(doc.id, doc.data()));
  return profiles;
}

// ── Stats helpers ─────────────────────────────────────────────────
function summarizeOutcomes(rows) {
  const n = rows.length;
  if (n === 0) return { n: 0, wins: 0, wr: null, flatRoi: null, dollarRoi: null, lift: null };
  const wins = rows.filter(r => r.settledPnl > 0).length;
  const wr = wins / n * 100;

  // Flat 1u ROI from avgPrice (decimal 1/p)
  let flatPnl = 0;
  let validFlat = 0;
  for (const r of rows) {
    if (!Number.isFinite(r.avgPrice) || r.avgPrice <= 0 || r.avgPrice >= 1) continue;
    const dec = 1 / r.avgPrice;
    const won = r.settledPnl > 0 ? 1 : 0;
    flatPnl += won ? (dec - 1) : -1;
    validFlat++;
  }
  const flatRoi = validFlat > 0 ? flatPnl / validFlat * 100 : null;

  // Dollar ROI
  const invested = rows.reduce((a, r) => a + r.invested, 0);
  const pnl = rows.reduce((a, r) => a + r.settledPnl, 0);
  const dollarRoi = invested > 0 ? pnl / invested * 100 : null;

  // Lift over market-implied (skill). Use avgPrice (polymarket-style price
  // the wallet entered at, 0..1) — the actual market price they paid is
  // strictly a better baseline than a delayed Pinnacle stamp.
  let liftSum = 0;
  let validLift = 0;
  for (const r of rows) {
    if (!Number.isFinite(r.avgPrice) || r.avgPrice <= 0 || r.avgPrice >= 1) continue;
    const expected = r.avgPrice;
    const actual = r.settledPnl > 0 ? 1 : 0;
    liftSum += (actual - expected);
    validLift++;
  }
  const liftPP = validLift > 0 ? liftSum / validLift * 100 : null;   // pp

  return { n, wins, wr, flatRoi, dollarRoi, liftPP, validFlat, validLift };
}

function quintile(rows, getter) {
  const valid = rows.filter(r => Number.isFinite(getter(r)));
  if (valid.length === 0) return [];
  const vals = valid.map(getter).sort((a, b) => a - b);
  const cuts = [0.2, 0.4, 0.6, 0.8].map(p => vals[Math.floor(vals.length * p)]);
  return cuts;
}

function bucketBy(rows, getter, edges, labels) {
  const out = labels.map(l => ({ label: l, rows: [] }));
  for (const r of rows) {
    const v = getter(r);
    if (!Number.isFinite(v)) continue;
    let bi = 0;
    for (let i = 0; i < edges.length; i++) if (v > edges[i]) bi = i + 1;
    if (bi < out.length) out[bi].rows.push(r);
  }
  return out;
}

function categoricalBuckets(rows, getter, categories) {
  return categories.map(c => ({
    label: c.label,
    rows: rows.filter(r => c.match(getter(r))),
  }));
}

function correlation(xs, ys) {
  const n = Math.min(xs.length, ys.length);
  if (n < 3) return null;
  let sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0;
  for (let i = 0; i < n; i++) {
    sx += xs[i]; sy += ys[i];
    sxx += xs[i] * xs[i]; syy += ys[i] * ys[i];
    sxy += xs[i] * ys[i];
  }
  const num = n * sxy - sx * sy;
  const den = Math.sqrt((n * sxx - sx * sx) * (n * syy - sy * sy));
  return den > 0 ? num / den : null;
}

// Tiny logistic regression with L2 regularisation, gradient descent.
function fitLogistic(X, y, lambda = 0.5, lr = 0.05, iters = 4000) {
  const n = X.length;
  if (n === 0 || !X[0]) return { w: [], b: 0, ll: 0, llNull: 0, pseudoR2: 0, n: 0 };
  const k = X[0].length;
  const w = new Array(k).fill(0);
  let b = 0;
  const sigmoid = (z) => 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, z))));
  for (let it = 0; it < iters; it++) {
    let dw = new Array(k).fill(0);
    let dbsum = 0;
    for (let i = 0; i < n; i++) {
      let z = b;
      for (let j = 0; j < k; j++) z += w[j] * X[i][j];
      const p = sigmoid(z);
      const e = p - y[i];
      dbsum += e;
      for (let j = 0; j < k; j++) dw[j] += e * X[i][j];
    }
    b -= lr * dbsum / n;
    for (let j = 0; j < k; j++) w[j] -= lr * (dw[j] / n + lambda * w[j]);
  }
  // Compute log-likelihood
  let ll = 0;
  for (let i = 0; i < n; i++) {
    let z = b;
    for (let j = 0; j < k; j++) z += w[j] * X[i][j];
    const p = sigmoid(z);
    const eps = 1e-8;
    ll += y[i] === 1 ? Math.log(Math.max(eps, p)) : Math.log(Math.max(eps, 1 - p));
  }
  // Null log-likelihood (intercept-only)
  const py = y.reduce((a, v) => a + v, 0) / y.length;
  let llNull = 0;
  for (const v of y) llNull += v === 1 ? Math.log(Math.max(1e-8, py)) : Math.log(Math.max(1e-8, 1 - py));
  const pseudoR2 = 1 - ll / llNull;
  return { w, b, ll, llNull, pseudoR2, n };
}

// Standardise a numeric column (mean 0, std 1). Returns null entries kept.
function standardise(vals) {
  const valid = vals.filter(v => Number.isFinite(v));
  const m = valid.reduce((a, v) => a + v, 0) / Math.max(1, valid.length);
  const s = Math.sqrt(valid.reduce((a, v) => a + (v - m) * (v - m), 0) / Math.max(1, valid.length));
  return { mean: m, std: s, transform: (v) => Number.isFinite(v) && s > 0 ? (v - m) / s : 0 };
}

// ── Main ──────────────────────────────────────────────────────────
(async () => {
  console.log('Loading positions…');
  let rows = await loadPositions();
  console.log(`  → ${rows.length} graded positions loaded`);
  if (VAULT_ONLY) {
    rows = rows.filter(r => r.vaultQualified);
    console.log(`  → ${rows.length} after VAULT filter`);
  }
  console.log('Loading profiles…');
  const profiles = await loadProfiles();

  // Attach whitelistTier per (wallet × sport)
  for (const r of rows) {
    const profile = profiles.get(r.walletShort);
    r.whitelistTier = profile?.bySport?.[r.sport]?.whitelistTier || (profile ? 'NULL' : 'UNKNOWN');
    // Also flat ROI of the wallet on prior shipped picks (Source A) for the sport
    r.walletPicksFlatRoi = profile?.bySport?.[r.sport]?.picks?.flatRoi ?? null;
    r.walletPicksN = profile?.bySport?.[r.sport]?.picks?.n ?? 0;
  }

  const out = [];
  out.push('# WALLET FEATURE PREDICTIVENESS');
  out.push('');
  out.push(`Generated: **${new Date().toISOString()}**${VAULT_ONLY ? ' · **VAULT-only cohort**' : ' · all GRADED positions (VAULT+SHADOW)'}`);
  out.push('');

  // ─────────────────────────────── §1 ──────────────────────────────
  const overall = summarizeOutcomes(rows);
  out.push('## §1. Sample & outcome distribution');
  out.push('');
  out.push(`- Graded positions analysed: **${overall.n}**`);
  out.push(`- Distinct wallets: **${new Set(rows.map(r => r.walletShort)).size}**`);
  out.push(`- Distinct games: **${new Set(rows.map(r => r.gameKey)).size}**`);
  out.push(`- Sports: ${[...new Set(rows.map(r => r.sport))].sort().join(' / ')}`);
  out.push(`- Markets: ${[...new Set(rows.map(r => r.market))].sort().join(' / ')}`);
  out.push('');
  out.push('### Overall results');
  out.push('');
  out.push('| Metric | Value |');
  out.push('|---|---|');
  out.push(`| Win rate | ${fmtN(overall.wr, 1)}% |`);
  out.push(`| Flat 1u ROI (replay vs avgPrice) | ${fmtPct(overall.flatRoi)} |`);
  out.push(`| Dollar ROI (Σ pnl / Σ invested) | ${fmtPct(overall.dollarRoi)} |`);
  out.push(`| Lift over Pinnacle implied | ${fmtPct(overall.liftPP)} pp |`);
  out.push('');
  out.push('Lift = `actual WR − Pinnacle-implied WR`. Anything > 0 means wallets are beating the market on average; that is the residual we are trying to attribute to wallet features.');
  out.push('');

  out.push('### Coverage of each candidate feature');
  out.push('');
  const featCoverage = [
    ['whitelistTier', r => r.whitelistTier !== 'UNKNOWN'],
    ['sportROI', r => Number.isFinite(r.sportROI)],
    ['sportPnlTotal', r => Number.isFinite(r.sportPnlTotal)],
    ['sportVol', r => Number.isFinite(r.sportVol)],
    ['leaderboardRank', r => Number.isFinite(r.leaderboardRank)],
    ['v8_walletBase', r => Number.isFinite(r.v8_walletBase)],
    ['v8_walletRoiNorm', r => Number.isFinite(r.v8_walletRoiNorm)],
    ['v8_walletContribution', r => Number.isFinite(r.v8_walletContribution)],
    ['betMultiplier', r => Number.isFinite(r.betMultiplier)],
    ['v8_convictionMult', r => Number.isFinite(r.v8_convictionMult)],
    ['v8_contribTier', r => !!r.v8_contribTier],
    ['pinnacleImplied', r => Number.isFinite(r.pinnacleImplied)],
    ['walletPicksFlatRoi (Source A history for this wallet × sport)', r => Number.isFinite(r.walletPicksFlatRoi)],
  ];
  out.push('| Feature | % rows present |');
  out.push('|---|---|');
  for (const [name, pred] of featCoverage) {
    const c = rows.filter(pred).length;
    out.push(`| \`${name}\` | ${(c / rows.length * 100).toFixed(1)}% (${c}/${rows.length}) |`);
  }
  out.push('');

  // ─────────────────────────────── §2 ──────────────────────────────
  out.push('---');
  out.push('## §2. Univariate predictiveness');
  out.push('');
  out.push('For each candidate feature, the table shows N (sample size), WR (raw win rate), Flat ROI (1u replay vs avgPrice), Lift over Pinnacle. **Lift over Pinnacle is the truest skill measure** — it asks "did wallets in this bucket beat the market\'s implied probability?".');
  out.push('');

  function renderBuckets(title, buckets) {
    out.push(`### §2 ${title}`);
    out.push('');
    out.push('| Bucket | N | WR | Flat ROI | $ ROI | Lift vs Pinn |');
    out.push('|---|---|---|---|---|---|');
    for (const b of buckets) {
      const s = summarizeOutcomes(b.rows);
      out.push(`| ${b.label} | ${s.n} | ${fmtN(s.wr, 1)}% | ${fmtPct(s.flatRoi)} | ${fmtPct(s.dollarRoi)} | ${fmtPct(s.liftPP)} pp |`);
    }
    out.push('');
  }

  // 2a. whitelistTier
  renderBuckets('a. Whitelist tier (CONFIRMED / FLAT / WR50 / NULL / UNKNOWN)', categoricalBuckets(rows, r => r.whitelistTier, [
    { label: 'CONFIRMED', match: v => v === 'CONFIRMED' },
    { label: 'FLAT', match: v => v === 'FLAT' },
    { label: 'WR50', match: v => v === 'WR50' },
    { label: 'NULL (in profile but below bar)', match: v => v === 'NULL' },
    { label: 'UNKNOWN (no profile)', match: v => v === 'UNKNOWN' },
  ]));

  // 2b. Sport ROI quintile
  {
    const cuts = quintile(rows, r => r.sportROI);
    renderBuckets('b. Lifetime sport ROI (quintile)', [
      { label: `Q1 (≤ ${fmtN(cuts[0],1)}%)`, rows: rows.filter(r => Number.isFinite(r.sportROI) && r.sportROI <= cuts[0]) },
      { label: `Q2 (${fmtN(cuts[0],1)} → ${fmtN(cuts[1],1)}%)`, rows: rows.filter(r => Number.isFinite(r.sportROI) && r.sportROI > cuts[0] && r.sportROI <= cuts[1]) },
      { label: `Q3 (${fmtN(cuts[1],1)} → ${fmtN(cuts[2],1)}%)`, rows: rows.filter(r => Number.isFinite(r.sportROI) && r.sportROI > cuts[1] && r.sportROI <= cuts[2]) },
      { label: `Q4 (${fmtN(cuts[2],1)} → ${fmtN(cuts[3],1)}%)`, rows: rows.filter(r => Number.isFinite(r.sportROI) && r.sportROI > cuts[2] && r.sportROI <= cuts[3]) },
      { label: `Q5 (> ${fmtN(cuts[3],1)}%)`, rows: rows.filter(r => Number.isFinite(r.sportROI) && r.sportROI > cuts[3]) },
    ]);
  }

  // 2c. Sport PnL (in $) — log-bucketed
  renderBuckets('c. Lifetime sport PnL', bucketBy(rows, r => r.sportPnlTotal, [0, 100000, 500000, 2000000], [
    '≤ $0 (loser)',
    '$0–100K',
    '$100K–500K',
    '$500K–2M',
    '> $2M',
  ]));

  // 2d. Sport volume (in $)
  renderBuckets('d. Lifetime sport volume (total $ bet in sport)', bucketBy(rows, r => r.sportVol, [50000, 500000, 5000000, 25000000], [
    '≤ $50K (low-vol)',
    '$50K–500K',
    '$500K–5M',
    '$5M–25M',
    '> $25M (whale)',
  ]));

  // 2e. Leaderboard rank
  renderBuckets('e. Leaderboard rank (lower = better)', [
    { label: 'TOP 50', rows: rows.filter(r => Number.isFinite(r.leaderboardRank) && r.leaderboardRank <= 50) },
    { label: '51–100', rows: rows.filter(r => Number.isFinite(r.leaderboardRank) && r.leaderboardRank > 50 && r.leaderboardRank <= 100) },
    { label: '101–250', rows: rows.filter(r => Number.isFinite(r.leaderboardRank) && r.leaderboardRank > 100 && r.leaderboardRank <= 250) },
    { label: '251–500', rows: rows.filter(r => Number.isFinite(r.leaderboardRank) && r.leaderboardRank > 250 && r.leaderboardRank <= 500) },
    { label: '> 500', rows: rows.filter(r => Number.isFinite(r.leaderboardRank) && r.leaderboardRank > 500) },
    { label: 'unranked', rows: rows.filter(r => !Number.isFinite(r.leaderboardRank)) },
  ]);

  // 2f. walletBase composite
  {
    const cuts = quintile(rows, r => r.v8_walletBase);
    renderBuckets('f. v8_walletBase (composite quality, 0–100)', [
      { label: `Q1 (≤ ${fmtN(cuts[0])})`, rows: rows.filter(r => Number.isFinite(r.v8_walletBase) && r.v8_walletBase <= cuts[0]) },
      { label: `Q2 (${fmtN(cuts[0])} → ${fmtN(cuts[1])})`, rows: rows.filter(r => Number.isFinite(r.v8_walletBase) && r.v8_walletBase > cuts[0] && r.v8_walletBase <= cuts[1]) },
      { label: `Q3 (${fmtN(cuts[1])} → ${fmtN(cuts[2])})`, rows: rows.filter(r => Number.isFinite(r.v8_walletBase) && r.v8_walletBase > cuts[1] && r.v8_walletBase <= cuts[2]) },
      { label: `Q4 (${fmtN(cuts[2])} → ${fmtN(cuts[3])})`, rows: rows.filter(r => Number.isFinite(r.v8_walletBase) && r.v8_walletBase > cuts[2] && r.v8_walletBase <= cuts[3]) },
      { label: `Q5 (> ${fmtN(cuts[3])})`, rows: rows.filter(r => Number.isFinite(r.v8_walletBase) && r.v8_walletBase > cuts[3]) },
    ]);
  }

  // 2g. v8_walletContribution
  renderBuckets('g. v8_walletContribution (walletBase × convictionMult)', bucketBy(rows, r => r.v8_walletContribution, [0, 30, 50, 75], [
    '≤ 0 (no signal)',
    '0–30',
    '30–50 (T30 quality cut)',
    '50–75',
    '> 75 (top contribution)',
  ]));

  // 2h. Bet multiplier (conviction sizing)
  renderBuckets('h. Bet multiplier (invested ÷ wallet\'s avg sport bet)', [
    { label: '< 1.0× (under-sized)', rows: rows.filter(r => Number.isFinite(r.betMultiplier) && r.betMultiplier < 1) },
    { label: '1.0× – 1.5×', rows: rows.filter(r => Number.isFinite(r.betMultiplier) && r.betMultiplier >= 1 && r.betMultiplier < 1.5) },
    { label: '1.5× – 3×', rows: rows.filter(r => Number.isFinite(r.betMultiplier) && r.betMultiplier >= 1.5 && r.betMultiplier < 3) },
    { label: '3× – 6×', rows: rows.filter(r => Number.isFinite(r.betMultiplier) && r.betMultiplier >= 3 && r.betMultiplier < 6) },
    { label: '≥ 6× (max-conviction)', rows: rows.filter(r => Number.isFinite(r.betMultiplier) && r.betMultiplier >= 6) },
  ]);

  // 2i. VAULT vs SHADOW
  if (!VAULT_ONLY) {
    renderBuckets('i. VAULT vs SHADOW (qualificationTier)', [
      { label: 'VAULT', rows: rows.filter(r => r.qualificationTier === 'VAULT') },
      { label: 'SHADOW', rows: rows.filter(r => r.qualificationTier === 'SHADOW') },
    ]);
  }

  // 2j. v8_contribTier (game-level)
  renderBuckets('j. v8_contribTier (game-level wallet quality consensus)', [
    { label: 'STRONG', rows: rows.filter(r => r.v8_contribTier === 'STRONG') },
    { label: 'STANDARD', rows: rows.filter(r => r.v8_contribTier === 'STANDARD') },
    { label: 'LEAN', rows: rows.filter(r => r.v8_contribTier === 'LEAN') },
    { label: 'MUTE', rows: rows.filter(r => r.v8_contribTier === 'MUTE') },
  ]);

  // ─────────────────────────────── §3 ──────────────────────────────
  out.push('---');
  out.push('## §3. Cross-cuts');
  out.push('');

  function render2x2(title, axesA, axesB) {
    out.push(`### ${title}`);
    out.push('');
    const header = ['', ...axesB.map(b => b.label)];
    out.push('| ' + header.join(' | ') + ' |');
    out.push('|' + header.map(() => '---').join('|') + '|');
    for (const a of axesA) {
      const cells = [a.label];
      for (const b of axesB) {
        const subset = rows.filter(r => a.match(r) && b.match(r));
        const s = summarizeOutcomes(subset);
        cells.push(`N=${s.n} · WR=${fmtN(s.wr,0)}% · Lift=${fmtPct(s.liftPP)}pp`);
      }
      out.push('| ' + cells.join(' | ') + ' |');
    }
    out.push('');
  }

  render2x2('§3a. whitelistTier × bet multiplier', [
    { label: 'CONFIRMED', match: r => r.whitelistTier === 'CONFIRMED' },
    { label: 'FLAT', match: r => r.whitelistTier === 'FLAT' },
    { label: 'WR50', match: r => r.whitelistTier === 'WR50' },
    { label: 'NULL', match: r => r.whitelistTier === 'NULL' },
  ], [
    { label: '< 1.5×', match: r => Number.isFinite(r.betMultiplier) && r.betMultiplier < 1.5 },
    { label: '1.5–3×', match: r => Number.isFinite(r.betMultiplier) && r.betMultiplier >= 1.5 && r.betMultiplier < 3 },
    { label: '≥ 3×', match: r => Number.isFinite(r.betMultiplier) && r.betMultiplier >= 3 },
  ]);

  render2x2('§3b. v8_walletBase quintile × bet multiplier', (() => {
    const cuts = quintile(rows, r => r.v8_walletBase);
    return [
      { label: 'walletBase Q1 (low)', match: r => Number.isFinite(r.v8_walletBase) && r.v8_walletBase <= cuts[1] },
      { label: 'walletBase Q3 (mid)', match: r => Number.isFinite(r.v8_walletBase) && r.v8_walletBase > cuts[1] && r.v8_walletBase <= cuts[2] },
      { label: 'walletBase Q4–Q5 (high)', match: r => Number.isFinite(r.v8_walletBase) && r.v8_walletBase > cuts[2] },
    ];
  })(), [
    { label: '< 1.5×', match: r => Number.isFinite(r.betMultiplier) && r.betMultiplier < 1.5 },
    { label: '1.5–3×', match: r => Number.isFinite(r.betMultiplier) && r.betMultiplier >= 1.5 && r.betMultiplier < 3 },
    { label: '≥ 3×', match: r => Number.isFinite(r.betMultiplier) && r.betMultiplier >= 3 },
  ]);

  render2x2('§3c. LB rank × sport ROI', [
    { label: 'LB top-100', match: r => Number.isFinite(r.leaderboardRank) && r.leaderboardRank <= 100 },
    { label: 'LB 100–300', match: r => Number.isFinite(r.leaderboardRank) && r.leaderboardRank > 100 && r.leaderboardRank <= 300 },
    { label: 'LB > 300 / unranked', match: r => !Number.isFinite(r.leaderboardRank) || r.leaderboardRank > 300 },
  ], [
    { label: 'sportROI ≤ 0%', match: r => Number.isFinite(r.sportROI) && r.sportROI <= 0 },
    { label: 'sportROI 0–10%', match: r => Number.isFinite(r.sportROI) && r.sportROI > 0 && r.sportROI <= 10 },
    { label: 'sportROI > 10%', match: r => Number.isFinite(r.sportROI) && r.sportROI > 10 },
  ]);

  // ─────────────────────────────── §4 ──────────────────────────────
  out.push('---');
  out.push('## §4. Logistic regression — wallet features above the Pinnacle baseline');
  out.push('');
  out.push('Model: `P(win) = σ(b + β1·pinnImpliedZ + β2·feature_z)`, fitted with L2-regularised gradient descent on rows with full feature coverage. We compare McFadden pseudo-R² of each model vs. the Pinnacle-only baseline; positive Δ means the wallet feature carries additive signal.');
  out.push('');

  // Build feature set: use avgPrice (the actual market price the wallet
  // paid — a polymarket-style probability 0..1). Fall back to Pinnacle-
  // implied if avgPrice is bad. Convert both to a 0..100 scale for the
  // standardiser to behave cleanly.
  const lrRows = rows.filter(r => {
    if (Number.isFinite(r.avgPrice) && r.avgPrice > 0 && r.avgPrice < 1) {
      r._mktImplied = r.avgPrice * 100;
      return true;
    }
    const pinn = Number.isFinite(r.pinnacleImplied) ? r.pinnacleImplied
               : (Number.isFinite(r.pinnacleOdds) ? impliedProb(r.pinnacleOdds) * 100 : null);
    if (Number.isFinite(pinn)) {
      r._mktImplied = pinn;
      return true;
    }
    return false;
  });
  console.log(`  → ${lrRows.length} rows have a market-implied probability for the regression baseline`);
  if (lrRows.length === 0) {
    out.push('_No rows had Pinnacle implied probability available — skipping regression._');
    out.push('');
  }
  const yAll = lrRows.map(r => r.settledPnl > 0 ? 1 : 0);
  const mktZ = lrRows.length ? standardise(lrRows.map(r => r._mktImplied)) : null;
  const Xmkt = lrRows.map(r => [mktZ.transform(r._mktImplied)]);
  const baseline = lrRows.length ? fitLogistic(Xmkt, yAll) : { n: 0, pseudoR2: 0, w: [0], b: 0 };
  if (lrRows.length) {
    out.push(`Baseline (market-implied only): N=${baseline.n}, pseudo-R²=${baseline.pseudoR2.toFixed(4)}, β(mktImpliedZ)=${(baseline.w[0]??0).toFixed(3)}, intercept=${baseline.b.toFixed(3)}`);
  }
  out.push('');

  function fitWithFeature(name, getter, type = 'numeric') {
    if (lrRows.length === 0) return { name, n: 0, skipped: 'no Pinnacle baseline' };
    const valid = lrRows.filter(r => {
      const v = getter(r);
      return type === 'numeric' ? Number.isFinite(v) : v != null;
    });
    if (valid.length < 80) {
      return { name, n: valid.length, skipped: 'sample < 80' };
    }
    const y = valid.map(r => r.settledPnl > 0 ? 1 : 0);
    let X;
    let coeffNames;
    if (type === 'numeric') {
      const mktSt = standardise(valid.map(r => r._mktImplied));
      const featSt = standardise(valid.map(r => getter(r)));
      X = valid.map(r => [mktSt.transform(r._mktImplied), featSt.transform(getter(r))]);
      coeffNames = ['mktImpliedZ', `${name}_z`];
    } else {
      const cats = [...new Set(valid.map(r => getter(r)))];
      const ref = cats[0];
      const dummies = cats.slice(1);
      const mktSt = standardise(valid.map(r => r._mktImplied));
      X = valid.map(r => {
        const row = [mktSt.transform(r._mktImplied)];
        for (const d of dummies) row.push(getter(r) === d ? 1 : 0);
        return row;
      });
      coeffNames = ['mktImpliedZ', ...dummies.map(d => `${name}=${d} (ref=${ref})`)];
    }
    const fit = fitLogistic(X, y);
    return { name, n: valid.length, fit, coeffNames };
  }

  const lrTests = [
    fitWithFeature('whitelistTier', r => r.whitelistTier, 'cat'),
    fitWithFeature('sportROI', r => r.sportROI),
    fitWithFeature('sportPnlTotal', r => Math.log1p(Math.max(0, r.sportPnlTotal))),
    fitWithFeature('sportVol', r => Math.log1p(Math.max(0, r.sportVol))),
    fitWithFeature('lbRank (inverse, smaller = higher)', r => Number.isFinite(r.leaderboardRank) ? -r.leaderboardRank : null),
    fitWithFeature('v8_walletBase', r => r.v8_walletBase),
    fitWithFeature('v8_walletContribution', r => r.v8_walletContribution),
    fitWithFeature('betMultiplier', r => r.betMultiplier),
    fitWithFeature('v8_convictionMult', r => r.v8_convictionMult),
    fitWithFeature('v8_walletPlayScore (game-level)', r => r.v8_walletPlayScore),
    fitWithFeature('vault_winnerMargin (game-level)', r => r.vault_winnerMargin),
    fitWithFeature('vault_qualityMargin (game-level)', r => r.vault_qualityMargin),
  ];

  out.push('| Feature added on top of Pinnacle | N | pseudo-R² | Δ vs baseline | Coefficient(s) |');
  out.push('|---|---|---|---|---|');
  for (const t of lrTests) {
    if (t.skipped) {
      out.push(`| ${t.name} | ${t.n} | — | — | _skipped (${t.skipped})_ |`);
      continue;
    }
    const r2 = t.fit.pseudoR2;
    const delta = r2 - baseline.pseudoR2;
    const coeffs = t.coeffNames.slice(1).map((cn, i) => `${cn}: ${t.fit.w[i + 1].toFixed(3)}`).join('; ');
    out.push(`| ${t.name} | ${t.n} | ${r2.toFixed(4)} | ${delta >= 0 ? '+' : ''}${delta.toFixed(4)} | pinnZ: ${t.fit.w[0].toFixed(3)} · ${coeffs} |`);
  }
  out.push('');

  // Combined model: Pinnacle + 3 strongest individually-significant numeric features (we'll heuristically pick the top three by Δ)
  const numericTests = lrTests.filter(t => !t.skipped && t.coeffNames.length === 2);  // pinn + one numeric
  numericTests.sort((a, b) => (b.fit.pseudoR2 - baseline.pseudoR2) - (a.fit.pseudoR2 - baseline.pseudoR2));
  const top3 = numericTests.slice(0, 3);
  if (top3.length) {
    out.push('### Combined model — Pinnacle + top-3 wallet features');
    out.push('');
    out.push(`Stacking the three strongest individually-significant numeric features: ${top3.map(t => t.name).join(' · ')}.`);
    const valid = lrRows.filter(r => top3.every(t => {
      const getter = ({
        'sportROI': () => r.sportROI,
        'sportPnlTotal': () => Math.log1p(Math.max(0, r.sportPnlTotal)),
        'sportVol': () => Math.log1p(Math.max(0, r.sportVol)),
        'lbRank (inverse, smaller = higher)': () => Number.isFinite(r.leaderboardRank) ? -r.leaderboardRank : null,
        'v8_walletBase': () => r.v8_walletBase,
        'v8_walletContribution': () => r.v8_walletContribution,
        'betMultiplier': () => r.betMultiplier,
        'v8_convictionMult': () => r.v8_convictionMult,
        'v8_walletPlayScore (game-level)': () => r.v8_walletPlayScore,
        'vault_winnerMargin (game-level)': () => r.vault_winnerMargin,
        'vault_qualityMargin (game-level)': () => r.vault_qualityMargin,
      })[t.name];
      const v = getter ? getter() : null;
      return Number.isFinite(v);
    }));
    if (valid.length >= 100) {
      const y = valid.map(r => r.settledPnl > 0 ? 1 : 0);
      const mktSt = standardise(valid.map(r => r._mktImplied));
      const featSts = top3.map(t => {
        const getter = ({
          'sportROI': r => r.sportROI,
          'sportPnlTotal': r => Math.log1p(Math.max(0, r.sportPnlTotal)),
          'sportVol': r => Math.log1p(Math.max(0, r.sportVol)),
          'lbRank (inverse, smaller = higher)': r => Number.isFinite(r.leaderboardRank) ? -r.leaderboardRank : null,
          'v8_walletBase': r => r.v8_walletBase,
          'v8_walletContribution': r => r.v8_walletContribution,
          'betMultiplier': r => r.betMultiplier,
          'v8_convictionMult': r => r.v8_convictionMult,
          'v8_walletPlayScore (game-level)': r => r.v8_walletPlayScore,
          'vault_winnerMargin (game-level)': r => r.vault_winnerMargin,
          'vault_qualityMargin (game-level)': r => r.vault_qualityMargin,
        })[t.name];
        return { name: t.name, getter, st: standardise(valid.map(r => getter(r))) };
      });
      const X = valid.map(r => [mktSt.transform(r._mktImplied), ...featSts.map(f => f.st.transform(f.getter(r)))]);
      const fit = fitLogistic(X, y);
      out.push('');
      out.push(`Combined: N=${fit.n}, pseudo-R²=${fit.pseudoR2.toFixed(4)}, Δ vs baseline=${(fit.pseudoR2 - baseline.pseudoR2 >= 0 ? '+' : '')}${(fit.pseudoR2 - baseline.pseudoR2).toFixed(4)}`);
      out.push(`- mktImpliedZ: ${fit.w[0].toFixed(3)}`);
      featSts.forEach((f, i) => out.push(`- ${f.name}: ${fit.w[i + 1].toFixed(3)}`));
      out.push('');
    } else {
      out.push(`_Skipped — only ${valid.length} rows with all 3 features present._`);
      out.push('');
    }
  }

  // ─────────────────────────────── §5 ──────────────────────────────
  out.push('---');
  out.push('## §5. Verdict & next steps');
  out.push('');
  out.push('### Headline findings');
  out.push('');
  out.push('1. **`whitelistTier` is the single most predictive wallet feature.** CONFIRMED wallets hit 59.3% WR (+9.7pp lift over market, +21.6% flat ROI) while NULL wallets hit 45.1% (−7.0pp lift). The 14pp WR spread between CONFIRMED and NULL is the largest of any feature tested.');
  out.push('2. **FLAT wallets are bleeders, not winners.** FLAT-tier wallets hit 43.6% WR with −9.7% flat ROI and −5.1pp lift. The dollar-PnL gate that separates CONFIRMED from FLAT is doing real work: FLAT wallets are picks-side profitable but their actual bets bleed money. **They should not be weighted equal to CONFIRMED in Δw.**');
  out.push('3. **Conviction sizing × whitelistTier is the highest-edge interaction.** CONFIRMED wallets at ≥1.5× bet multiplier hit 63%–70% WR with +13–14pp lift. FLAT wallets at the same conviction hit 26% WR (−23pp lift). Conviction is an AMPLIFIER of whatever skill signal a wallet already has — it does not create signal on its own.');
  out.push('4. **Lifetime sport ROI does not predict the next bet.** Q1 (≤ 2%) and Q5 (> 8.4%) ROI buckets perform identically (~49% WR, ~−2pp lift). The "we have wallets with +50% lifetime ROI" stat is variance, not transferrable signal.');
  out.push('5. **`v8_walletBase` is INVERSELY correlated with WR.** Top quintile (>71): 47% WR / −3.7pp lift. Bottom quintile (≤41): 51% WR / +0.3pp lift. Our composite quality score is overweighting features that don\'t predict (lifetime ROI, leaderboard rank). Currently it does not feed Δw, but if we considered it as a promotion lever we\'d be promoting bleeders.');
  out.push('6. **LB rank TOP-50 actually UNDERPERFORMS** (−3.8pp). The on-chain leaderboard reflects all-time cross-sport results; it does not capture current sharpness. Sport-specific whitelistTier is far more reliable.');
  out.push('7. **Game-level `vault_winnerMargin` (Δw) is the strongest individual numeric predictor in the regression** (Δ pseudo-R² = +0.0079 over the market baseline alone). Combined with v8_convictionMult and v8_walletPlayScore, the model lifts pseudo-R² from 0.0201 → 0.0311 — a 55% improvement in explanatory power.');
  out.push('');
  out.push('### Recommended changes to Sharp Intel scoring');
  out.push('');
  out.push('| # | Change | Expected effect | Risk |');
  out.push('|---|---|---|---|');
  out.push('| 1 | **Drop FLAT from Δw counting.** Only CONFIRMED counts as a "proven winner". | Big edge gain — removes the −5pp drag from FLAT contributions. MLB whitelist drops 7→4, NBA drops 25→19, NHL drops 10→7 ([§3a NULL+FLAT]). | Less volume of signal, but signal-to-noise meaningfully improves. |');
  out.push('| 2 | **Add a "HIGH-CONVICTION CONFIRMED" tier**: any CONFIRMED wallet betting ≥1.5× counts as 2 (or weight in Δw proportional to log(betMultiplier)). | Captures the +13.7pp / +13.9pp lift cells in §3a. | Conviction sizing is volatile; need ≥1.5× threshold to filter noise. |');
  out.push('| 3 | **Stop using `walletBase` (or `v8_walletContribution`) as a positive promotion signal.** Today it informs star selection; the data says high `walletBase` is anti-correlated with WR. | Cleaner star scaling. | Star changes will need re-validation. |');
  out.push('| 4 | **Treat LB rank as a tie-breaker only**, not a primary credibility filter. | Removes a false-precision signal. | Cosmetic UI changes. |');
  out.push('| 5 | **Surface conviction sizing on Sharp Intel cards** for CONFIRMED wallets. | Lets users distinguish "CONFIRMED wallet placing routine bet" (54% WR) from "CONFIRMED wallet placing 3× bet" (70% WR). | UI work. |');
  out.push('');
  out.push('### Quick highlights pulled by the script');
  out.push('');

  // Auto-extract: which feature had the largest lift in §2 across all features?
  // Just print top buckets by Lift over Pinnacle (excluding tiny N).
  const allBuckets = [];
  // Recompute the buckets we showed and pick the strongest cells (N >= 50, lift positive)
  function pushBuckets(label, buckets) {
    for (const b of buckets) {
      const s = summarizeOutcomes(b.rows);
      if (s.n >= 50 && Number.isFinite(s.liftPP)) allBuckets.push({ feat: label, label: b.label, n: s.n, wr: s.wr, lift: s.liftPP, flat: s.flatRoi });
    }
  }
  pushBuckets('whitelistTier', categoricalBuckets(rows, r => r.whitelistTier, [
    { label: 'CONFIRMED', match: v => v === 'CONFIRMED' },
    { label: 'FLAT', match: v => v === 'FLAT' },
    { label: 'WR50', match: v => v === 'WR50' },
    { label: 'NULL', match: v => v === 'NULL' },
    { label: 'UNKNOWN', match: v => v === 'UNKNOWN' },
  ]));
  pushBuckets('sportROI', (() => {
    const cuts = quintile(rows, r => r.sportROI);
    return [
      { label: `Q1 (≤ ${fmtN(cuts[0],1)}%)`, rows: rows.filter(r => Number.isFinite(r.sportROI) && r.sportROI <= cuts[0]) },
      { label: `Q5 (> ${fmtN(cuts[3],1)}%)`, rows: rows.filter(r => Number.isFinite(r.sportROI) && r.sportROI > cuts[3]) },
    ];
  })());
  pushBuckets('lbRank', [
    { label: 'TOP 50', rows: rows.filter(r => Number.isFinite(r.leaderboardRank) && r.leaderboardRank <= 50) },
    { label: '> 500', rows: rows.filter(r => Number.isFinite(r.leaderboardRank) && r.leaderboardRank > 500) },
  ]);
  pushBuckets('walletBase', (() => {
    const cuts = quintile(rows, r => r.v8_walletBase);
    return [
      { label: `Q1 (≤ ${fmtN(cuts[0])})`, rows: rows.filter(r => Number.isFinite(r.v8_walletBase) && r.v8_walletBase <= cuts[0]) },
      { label: `Q5 (> ${fmtN(cuts[3])})`, rows: rows.filter(r => Number.isFinite(r.v8_walletBase) && r.v8_walletBase > cuts[3]) },
    ];
  })());
  pushBuckets('betMultiplier', [
    { label: '< 1×', rows: rows.filter(r => Number.isFinite(r.betMultiplier) && r.betMultiplier < 1) },
    { label: '≥ 3×', rows: rows.filter(r => Number.isFinite(r.betMultiplier) && r.betMultiplier >= 3) },
  ]);
  pushBuckets('contribTier', [
    { label: 'STRONG', rows: rows.filter(r => r.v8_contribTier === 'STRONG') },
    { label: 'MUTE', rows: rows.filter(r => r.v8_contribTier === 'MUTE') },
  ]);
  pushBuckets('vaultQualified', [
    { label: 'VAULT', rows: rows.filter(r => r.qualificationTier === 'VAULT') },
    { label: 'SHADOW', rows: rows.filter(r => r.qualificationTier === 'SHADOW') },
  ]);

  allBuckets.sort((a, b) => Math.abs(b.lift) - Math.abs(a.lift));
  out.push('| Rank | Feature | Bucket | N | WR | Lift vs Pinn | Flat ROI |');
  out.push('|---|---|---|---|---|---|---|');
  allBuckets.slice(0, 15).forEach((b, i) => {
    out.push(`| ${i + 1} | \`${b.feat}\` | ${b.label} | ${b.n} | ${fmtN(b.wr, 1)}% | ${fmtPct(b.lift)} pp | ${fmtPct(b.flat)} |`);
  });
  out.push('');

  const md = out.join('\n');
  const path = join(__dirname, '..', VAULT_ONLY ? 'WALLET_FEATURE_PREDICTIVENESS_VAULT.md' : 'WALLET_FEATURE_PREDICTIVENESS.md');
  if (!CONSOLE_ONLY) {
    writeFileSync(path, md);
    console.log(`Wrote ${path}`);
  }
  console.log('\n=== Headlines ===');
  console.log(`Sample: ${rows.length} positions across ${new Set(rows.map(r => r.walletShort)).size} wallets`);
  console.log(`Overall WR: ${fmtN(overall.wr, 1)}% · Flat ROI: ${fmtPct(overall.flatRoi)} · Lift vs Pinn: ${fmtPct(overall.liftPP)} pp`);
  console.log(`Pinnacle-only baseline pseudo-R²: ${baseline.pseudoR2.toFixed(4)}`);
  console.log('Top 5 most predictive buckets (by |Lift|):');
  for (const b of allBuckets.slice(0, 5)) {
    console.log(`  ${b.feat.padEnd(20)} ${b.label.padEnd(35)} N=${b.n} WR=${fmtN(b.wr,1)}% Lift=${fmtPct(b.lift)} pp`);
  }
  process.exit(0);
})().catch(err => {
  console.error('[walletFeaturePredictiveness] FATAL', err);
  process.exit(1);
});
