// scripts/_agsu_wallet_inventory.mjs
//
// AGS-U WALLET POOL INVENTORY + METRIC AUDIT
// ────────────────────────────────────────────────────────────────────────────
// Phase 1: How many wallets do we have? How many qualify under each rule?
// Phase 2: Complete inventory of every metric we keep per wallet × sport.
//
// Output: AGSU_WALLET_INVENTORY.md
// ────────────────────────────────────────────────────────────────────────────
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

if (!admin.apps.length) {
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
}
const db = admin.firestore();

// Whitelist thresholds (these mirror exportWalletProfiles.js policy v2)
const A_MIN_BETS = 2;       // Source A whitelist threshold (featured picks)
const B_MIN_BETS = 5;       // Source B-only threshold (raw positions)

async function main() {
  console.log('[inv] loading all wallet profiles…');
  const snap = await db.collection('sharpWalletProfiles').get();
  console.log(`[inv] total wallet profiles: ${snap.size}`);

  const SPORTS = ['MLB', 'NBA', 'NHL'];
  const sportCounts = {};
  for (const sp of SPORTS) {
    sportCounts[sp] = {
      hasProfile:           0,
      // Source A criteria
      a_haveEnoughPicks:    0,   // picks.n >= A_MIN_BETS
      a_flatRoiPos:         0,   // picks.flatRoi > 0
      a_wr50:               0,   // picks.wr >= 50
      a_qualifyFlat:        0,   // n>=A_MIN_BETS AND flatRoi>0
      a_qualifyWR:          0,   // n>=A_MIN_BETS AND wr>=50
      // Source B criteria
      b_haveEnoughPos:      0,   // positions.n >= B_MIN_BETS
      b_flatRoiPos:         0,   // positions.positionFlatRoi > 0
      b_dollarRoiPos:       0,   // positions.dollarRoi > 0
      b_wr50:               0,   // positions.wr >= 50
      b_qualifyFlatOnly:    0,   // n>=B_MIN_BETS AND positionFlatRoi>0 (no A)
      b_qualifyDollar:      0,   // n>=B_MIN_BETS AND dollarRoi>0
      // Combined / overlap
      qualifyEitherSource:  0,
      qualifyBothSources:   0,
      qualifyAOnly:         0,
      qualifyBOnly:         0,
      // Whitelist tier outcomes (from profile policy v2)
      tierCONFIRMED:        0,
      tierFLAT:             0,
      tierWR50:             0,
      tierNULL:             0,
      // sample-size distribution
      picksN_dist: { '0': 0, '1-2': 0, '3-5': 0, '6-10': 0, '11-20': 0, '20+': 0 },
      positionsN_dist: { '0-4': 0, '5-19': 0, '20-99': 0, '100-499': 0, '500+': 0 },
    };
  }
  let totalQualifying_any = 0;

  for (const docSnap of snap.docs) {
    const p = docSnap.data();
    if (!p?.bySport) continue;
    for (const sp of SPORTS) {
      const rec = p.bySport[sp];
      if (!rec) continue;
      const c = sportCounts[sp];
      c.hasProfile += 1;

      // sample-size buckets
      const picks = rec.picks || {};
      const positions = rec.positions || {};
      const pN = Number(picks.n) || 0;
      const pPos = Number(positions.n) || 0;
      if (pN === 0) c.picksN_dist['0']++;
      else if (pN <= 2) c.picksN_dist['1-2']++;
      else if (pN <= 5) c.picksN_dist['3-5']++;
      else if (pN <= 10) c.picksN_dist['6-10']++;
      else if (pN <= 20) c.picksN_dist['11-20']++;
      else c.picksN_dist['20+']++;
      if (pPos < 5) c.positionsN_dist['0-4']++;
      else if (pPos < 20) c.positionsN_dist['5-19']++;
      else if (pPos < 100) c.positionsN_dist['20-99']++;
      else if (pPos < 500) c.positionsN_dist['100-499']++;
      else c.positionsN_dist['500+']++;

      // Source A
      const aN     = Number(picks.n) || 0;
      const aRoi   = Number(picks.flatRoi);
      const aWr    = Number(picks.wr);
      if (aN >= A_MIN_BETS) c.a_haveEnoughPicks++;
      if (Number.isFinite(aRoi) && aRoi > 0) c.a_flatRoiPos++;
      if (Number.isFinite(aWr) && aWr >= 50) c.a_wr50++;
      const aFlat = (aN >= A_MIN_BETS) && Number.isFinite(aRoi) && aRoi > 0;
      const aWrOk = (aN >= A_MIN_BETS) && Number.isFinite(aWr) && aWr >= 50;
      if (aFlat) c.a_qualifyFlat++;
      if (aWrOk) c.a_qualifyWR++;

      // Source B
      const bN      = Number(positions.n) || 0;
      const bDollar = Number(positions.dollarRoi);
      const bFlat   = Number(positions.positionFlatRoi);
      const bWr     = Number(positions.wr);
      if (bN >= B_MIN_BETS) c.b_haveEnoughPos++;
      if (Number.isFinite(bFlat) && bFlat > 0) c.b_flatRoiPos++;
      if (Number.isFinite(bDollar) && bDollar > 0) c.b_dollarRoiPos++;
      if (Number.isFinite(bWr) && bWr >= 50) c.b_wr50++;
      const bFlatOnly = (bN >= B_MIN_BETS) && Number.isFinite(bFlat) && bFlat > 0;
      const bDollarOk = (bN >= B_MIN_BETS) && Number.isFinite(bDollar) && bDollar > 0;
      if (bFlatOnly) c.b_qualifyFlatOnly++;
      if (bDollarOk) c.b_qualifyDollar++;

      // Combined
      const qualifiesA = aFlat || aWrOk;
      const qualifiesB = bFlatOnly || bDollarOk;
      if (qualifiesA && qualifiesB) c.qualifyBothSources++;
      if (qualifiesA && !qualifiesB) c.qualifyAOnly++;
      if (!qualifiesA && qualifiesB) c.qualifyBOnly++;
      if (qualifiesA || qualifiesB) c.qualifyEitherSource++;

      // Tier
      const t = rec.whitelistTier;
      if (t === 'CONFIRMED') c.tierCONFIRMED++;
      else if (t === 'FLAT') c.tierFLAT++;
      else if (t === 'WR50') c.tierWR50++;
      else c.tierNULL++;
    }
  }

  // Schema inventory: a sample of profile.bySport[sport] showing all fields
  let sampleProfile = null;
  for (const docSnap of snap.docs) {
    const p = docSnap.data();
    if (p?.bySport?.MLB?.whitelistTier) { sampleProfile = p; break; }
  }

  // Inventory walletDetails fields
  console.log('[inv] sampling recent pick walletDetails…');
  const picksSnap = await db.collection('sharpFlowPicks').orderBy('date', 'desc').limit(3).get();
  let sampleWD = null;
  for (const docSnap of picksSnap.docs) {
    const d = docSnap.data();
    for (const side of Object.values(d.sides || {})) {
      const wd = side?.peak?.v8Scoring?.walletDetails;
      if (Array.isArray(wd) && wd.length) { sampleWD = wd[0]; break; }
    }
    if (sampleWD) break;
  }

  // Print + write report
  const lines = [];
  const stamp = new Date().toISOString();
  lines.push('# AGS-U Wallet Pool Inventory + Metric Audit');
  lines.push('');
  lines.push(`_Generated: ${stamp}_`);
  lines.push('');
  lines.push(`Total wallet profiles in collection: **${snap.size}**`);
  lines.push('');
  lines.push(`Whitelist thresholds (from policy v2): Source A requires n ≥ ${A_MIN_BETS} featured picks. Source B-only requires n ≥ ${B_MIN_BETS} raw positions.`);
  lines.push('');
  lines.push('---');
  lines.push('');

  lines.push('## Per-sport qualifying wallet counts');
  lines.push('');
  lines.push('| sport | has profile rec | A: n≥thr | A: flatRoi>0 | A: wr≥50% | **A: flat-qual** | **A: wr-qual** | B: n≥thr | B: positionFlatRoi>0 | B: dollarRoi>0 | B: wr≥50% | **B-only flat-qual** | **B: dollar-qual** | qualify A only | qualify B only | qualify both | qualify either |');
  lines.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const sp of SPORTS) {
    const c = sportCounts[sp];
    lines.push(`| **${sp}** | ${c.hasProfile} | ${c.a_haveEnoughPicks} | ${c.a_flatRoiPos} | ${c.a_wr50} | **${c.a_qualifyFlat}** | **${c.a_qualifyWR}** | ${c.b_haveEnoughPos} | ${c.b_flatRoiPos} | ${c.b_dollarRoiPos} | ${c.b_wr50} | **${c.b_qualifyFlatOnly}** | **${c.b_qualifyDollar}** | ${c.qualifyAOnly} | ${c.qualifyBOnly} | ${c.qualifyBothSources} | **${c.qualifyEitherSource}** |`);
  }
  lines.push('');

  lines.push('## Per-sport whitelist tier breakdown (live, current state)');
  lines.push('');
  lines.push('| sport | CONFIRMED | FLAT | WR50 | NULL (excluded) | total qualifying |');
  lines.push('|---|---|---|---|---|---|');
  for (const sp of SPORTS) {
    const c = sportCounts[sp];
    const totalQual = c.tierCONFIRMED + c.tierFLAT + c.tierWR50;
    lines.push(`| ${sp} | ${c.tierCONFIRMED} | ${c.tierFLAT} | ${c.tierWR50} | ${c.tierNULL} | **${totalQual}** |`);
  }
  lines.push('');

  lines.push('## Per-sport sample-size distributions');
  lines.push('');
  lines.push('### Source A: featured-pick history (`picks.n`)');
  lines.push('');
  lines.push('| sport | n=0 | n=1-2 | n=3-5 | n=6-10 | n=11-20 | n>20 |');
  lines.push('|---|---|---|---|---|---|---|');
  for (const sp of SPORTS) {
    const c = sportCounts[sp].picksN_dist;
    lines.push(`| ${sp} | ${c['0']} | ${c['1-2']} | ${c['3-5']} | ${c['6-10']} | ${c['11-20']} | ${c['20+']} |`);
  }
  lines.push('');
  lines.push('### Source B: position history (`positions.n`)');
  lines.push('');
  lines.push('| sport | n<5 | n=5-19 | n=20-99 | n=100-499 | n≥500 |');
  lines.push('|---|---|---|---|---|---|');
  for (const sp of SPORTS) {
    const c = sportCounts[sp].positionsN_dist;
    lines.push(`| ${sp} | ${c['0-4']} | ${c['5-19']} | ${c['20-99']} | ${c['100-499']} | ${c['500+']} |`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // Metric inventory
  lines.push('## METRIC INVENTORY — what we know per wallet × sport');
  lines.push('');
  lines.push('### `sharpWalletProfiles[walletShort].bySport[sport]` schema');
  lines.push('');
  if (sampleProfile?.bySport?.MLB) {
    lines.push('```json');
    lines.push(JSON.stringify(sampleProfile.bySport.MLB, null, 2));
    lines.push('```');
  } else {
    lines.push('(no sample available)');
  }
  lines.push('');
  lines.push('Key fields:');
  lines.push('');
  lines.push('| field path | meaning | currently used by AGS-U? |');
  lines.push('|---|---|---|');
  lines.push('| `picks.n` | # of OUR featured picks the wallet has bet on | NO |');
  lines.push('| `picks.wins` / `losses` | combined W/L on featured picks | NO |');
  lines.push('| `picks.wr` | win rate on featured picks (%) | NO |');
  lines.push('| `picks.flatRoi` | flat ROI on featured picks (%) | NO |');
  lines.push('| `picks.flatPnl` | flat PnL on featured picks (u) | NO |');
  lines.push('| `positions.n` | total leaderboard positions | NO directly (used via `roi`/`pnl` on walletDetail) |');
  lines.push('| `positions.wins` / `losses` | combined W/L on all positions | NO |');
  lines.push('| `positions.wr` | WR across all positions (%) | NO |');
  lines.push('| `positions.dollarRoi` | $-weighted ROI across positions | NO directly |');
  lines.push('| `positions.positionFlatRoi` | flat ROI across positions | NO |');
  lines.push('| `positions.settledPnl` | total $ won across positions | NO directly |');
  lines.push('| `positions.invested` | total $ deployed | NO |');
  lines.push('| `whitelistTier` | CONFIRMED / FLAT / WR50 / null | YES (drives `isProven` + `isHcEligible`) |');
  lines.push('| `isFlatProfitable` | A: flatRoi > 0 with n ≥ 2 | NO (computed inside tier logic) |');
  lines.push('| `isDollarProfitable` | B: dollarRoi > 0 with n ≥ 2 | NO |');
  lines.push('| `isPositionFlatProfitable` | B-only: positionFlatRoi > 0 with n ≥ 5 | NO |');
  lines.push('| `isWR50` / `isWR50_B` | A: wr ≥ 50 / B-only: wr ≥ 50 | NO |');
  lines.push('| `whitelistSource` | "A" / "A+B" / "B" / null | NO |');
  lines.push('');
  lines.push('### Per-pick `walletDetails[]` schema (frozen at scoring time)');
  lines.push('');
  if (sampleWD) {
    lines.push('```json');
    lines.push(JSON.stringify(sampleWD, null, 2));
    lines.push('```');
  } else {
    lines.push('(no sample available)');
  }
  lines.push('');
  lines.push('| field | meaning | currently used? |');
  lines.push('|---|---|---|');
  lines.push('| `wallet` | walletShort (last 6 hex) | YES |');
  lines.push('| `side` | bet side (home/away/over/under) | YES |');
  lines.push('| `invested` | $ on this position | NO (informational only) |');
  lines.push('| `roi` | wallet `positions.dollarRoi` (Source B, all-sports) at scoring time | NO directly |');
  lines.push('| `pnl` | wallet `positions.settledPnl` at scoring time | NO |');
  lines.push('| `rank` | leaderboard rank (lower = better; sparse — only some wallets) | NO |');
  lines.push('| `source` | "leaderboard" or null | NO |');
  lines.push('| `roiNorm` | normalized 0-100 of `roi` (percentile) | NO directly |');
  lines.push('| `pnlNorm` | normalized 0-100 of `pnl` (percentile) | NO directly |');
  lines.push('| `rankNorm` | normalized 0-100 of `rank` (higher = better) | NO |');
  lines.push('| `walletBase` | percentile-derived base contribution score | YES (drives `contribution`) |');
  lines.push('| `sizeRatio` | invested / avgSportBet | YES (drives `convictionMult`, HC gate) |');
  lines.push('| `convictionMult` | clamped log(sizeRatio), range [0.70, 1.60] | YES (current AGS-U feature) |');
  lines.push('| `contribution` | walletBase × convictionMult | YES (current AGS-U feature) |');
  lines.push('');
  lines.push('### Currently used by AGS-U v10 (5 features)');
  lines.push('');
  lines.push('| feature | what it captures | uses |');
  lines.push('|---|---|---|');
  lines.push('| `dCount` | (# qualifying wallets FOR) − (# qualifying wallets AGAINST) | wallet `side` + whitelist tier |');
  lines.push('| `dHcCount` | (# CONFIRMED tier wallets w/ sizeRatio ≥ HC_RATIO FOR) − AGAINST | `whitelistTier === CONFIRMED` + `sizeRatio` |');
  lines.push('| `dConvictionAvg` | avg(`convictionMult`) FOR − AGAINST | `convictionMult` |');
  lines.push('| `dHcSizeRatio` | sum(`sizeRatio` of HC wallets) FOR − AGAINST | `sizeRatio` for HC wallets |');
  lines.push('| `forContribShare` | sum(`contribution`) FOR / total | `contribution` |');
  lines.push('');
  lines.push('### NOT currently used — candidates for v11');
  lines.push('');
  lines.push('Per-wallet quality (from profile.bySport[sport]):');
  lines.push('');
  lines.push('- **Source A**: `picks.wr`, `picks.flatRoi`, `picks.n`, `picks.flatPnl`');
  lines.push('- **Source B**: `positions.wr`, `positions.dollarRoi`, `positions.positionFlatRoi`, `positions.settledPnl`, `positions.invested`, `positions.n`');
  lines.push('- **Top-level aggregate** (across sports): `picks.flatRoi`, `picks.wr`, etc.');
  lines.push('');
  lines.push('Per-wallet quality (from walletDetails, frozen at scoring):');
  lines.push('');
  lines.push('- `roi` (Source B all-sports), `pnl`, `rank`, `roiNorm`, `pnlNorm`, `rankNorm`');
  lines.push('');
  lines.push('---');
  lines.push(`_Generated by \`scripts/_agsu_wallet_inventory.mjs\` · ${stamp}_`);
  writeFileSync(join(REPO_ROOT, 'AGSU_WALLET_INVENTORY.md'), lines.join('\n'));
  console.log('[inv] → AGSU_WALLET_INVENTORY.md');

  console.log('\n[inv] QUICK SUMMARY:');
  for (const sp of SPORTS) {
    const c = sportCounts[sp];
    console.log(`  ${sp}: profile rec=${c.hasProfile}  qualA=${c.a_qualifyFlat}  qualB=${c.b_qualifyFlatOnly}  qualEither=${c.qualifyEitherSource}  tier(C+F+WR50)=${c.tierCONFIRMED + c.tierFLAT + c.tierWR50}`);
  }
  process.exit(0);
}

main().catch(err => { console.error('[inv] fatal:', err); process.exit(1); });
