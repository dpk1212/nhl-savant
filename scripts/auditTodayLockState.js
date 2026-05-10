/**
 * auditTodayLockState.js — Validate today's Sharp Intel locks against v7.3 spec
 *
 * Pulls every side from sharpFlowPicks/Spreads/Totals for today (or --date=YYYY-MM-DD),
 * reconstructs live wallet consensus from sharp_action_positions + sharpWalletProfiles,
 * and flags any inconsistency between the stamped state and what the v7.3 policy
 * should produce.
 *
 * Checks:
 *   [HC_OVERRIDE_FAIL]   live HC_m ≥ +1 AND status is MUTED with a reason that
 *                        v7.3 should have rescued (winners_below_floor,
 *                        quality_below_floor, sum_below_floor).
 *   [HC_RESCUE_STALE]    promotedBy = 'v73-hc-rescue' but live HC_m has dropped
 *                        below +1 (rescue is now unjustified).
 *   [LEAN_NONZERO]       lockTier = LEAN but units > 0.
 *   [SIGMA_LOCK_MISSED]  date ≥ cutover, Σ ∈ {1,2}, HC_m ≥ +1, but lockStage =
 *                        SHADOW (should be LOCKED per v7.3).
 *   [DOWNSIZED_WITH_HC]  showDownsize true (live stars < peak stars) AND live
 *                        HC_m ≥ +1 — likely HC override should re-upsize.
 *   [STALE_STAMP]        v8_systemVersion < 9 (v7.3) but pick date ≥ v7.3
 *                        cutover — stamp is from before policy update.
 *   [MISSING_HC]         v8_hcMargin missing; can't reason about HC promotion.
 *
 * Usage:
 *   node scripts/auditTodayLockState.js                     # today, all checks
 *   node scripts/auditTodayLockState.js --date=2026-05-01
 *   node scripts/auditTodayLockState.js --verbose           # dump every side
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Constants (mirror src/pages/SharpFlow.jsx) ───────────────────────────────
const HC_RATIO = 1.5;
const QUALITY_CONTRIB_CUT = 30;
const V6_CUTOVER = '2026-04-18';
const V7_1_CUTOVER_DATE = '2026-04-30';
const V7_2_CUTOVER_DATE = '2026-04-30';
const V7_3_CUTOVER_DATE = '2026-04-30';

const argv = process.argv.slice(2);
const dateArg = argv.find(a => a.startsWith('--date='));
const TARGET_DATE = dateArg ? dateArg.split('=')[1] : new Date().toISOString().slice(0, 10);
const VERBOSE = argv.includes('--verbose');

function initFirebase() {
  if (!admin.apps.length) {
    const sakPath = join(__dirname, '..', 'serviceAccountKey.json');
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

const isV73Eligible = (d) => d >= V7_3_CUTOVER_DATE;

// Mirror evaluatePickHealth's mute/cancel ladder.
function deriveExpectedHealthStatus({ dwLive, dqLive, hcMarginLive, pickDate }) {
  const v73HcOverride = isV73Eligible(pickDate) && hcMarginLive >= 1;
  if (dwLive <= -2) return { status: 'CANCELLED', reason: 'winners_killed' };
  if (dwLive === -1) return { status: 'MUTED', reason: 'winners_faded' };
  if (dwLive === 0 && !v73HcOverride) return { status: 'MUTED', reason: 'winners_below_floor' };
  if (dwLive >= 1 && dqLive <= 0 && !v73HcOverride) return { status: 'MUTED', reason: 'quality_below_floor' };
  if (dwLive >= 1 && dqLive >= 1 && (dwLive + dqLive) < 3 && !v73HcOverride) return { status: 'MUTED', reason: 'sum_below_floor' };
  return { status: 'ACTIVE', reason: v73HcOverride && (dwLive === 0 || dqLive <= 0 || (dwLive + dqLive) < 3) ? 'v73_hc_rescue' : null };
}

// Group sharp_action_positions by (sport, gameKey, marketType) so we can
// reconstruct walletConsensus for each pick.
function buildPositionGroups(positions) {
  const groups = new Map();
  for (const p of positions) {
    const k = `${p.sport}|${p.gameKey}|${p.marketType}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(p);
  }
  return groups;
}

// Reconstruct walletConsensus relative to mySide. Uses the SAME logic as
// SharpFlow.jsx → computeWalletConsensus, with sharpWalletProfiles for tier.
function computeLiveConsensus(group, mySide, sport, walletProfiles) {
  // Dedupe by wallet+side, keep max invested per side.
  const seen = new Map();
  for (const p of group) {
    if (!p.wallet || !p.side) continue;
    const k = `${String(p.wallet).toLowerCase()}|${p.side}`;
    const cur = seen.get(k);
    if (!cur || (p.invested || 0) > (cur.invested || 0)) seen.set(k, p);
  }

  let qFor = 0, qAg = 0;
  let forW = 0, agW = 0;
  let hcConfFor = 0, hcConfAg = 0;
  for (const p of seen.values()) {
    const short = String(p.walletShort || p.wallet || '').slice(-6).toLowerCase();
    const profile = walletProfiles.get(short) || walletProfiles.get(short.toUpperCase());
    const tier = profile?.bySport?.[sport]?.whitelistTier || null;
    const sr = p.v8_sizeRatio != null ? p.v8_sizeRatio : (p.avgSportBet > 0 ? (p.invested || 0) / p.avgSportBet : 0);
    const c = p.v8_walletContribution ?? 0;

    // Quality margin (whitelist-independent — contribution ≥ T30 IS the gate).
    if (c >= QUALITY_CONTRIB_CUT) {
      if (p.side === mySide) qFor++;
      else if (p.side) qAg++;
    }
    // Winner margin (CONFIRMED + FLAT).
    if (tier === 'CONFIRMED' || tier === 'FLAT') {
      if (p.side === mySide) forW++;
      else if (p.side) agW++;
    }
    // HC margin (CONFIRMED + sizeRatio ≥ HC_RATIO).
    if (tier === 'CONFIRMED' && sr >= HC_RATIO) {
      if (p.side === mySide) hcConfFor++;
      else if (p.side) hcConfAg++;
    }
  }
  return {
    forW, agW, delta: forW - agW,
    qualityForT30: qFor, qualityAgT30: qAg, qualityMargin: qFor - qAg,
    hcConfFor, hcConfAg, hcMargin: hcConfFor - hcConfAg,
    hcDominant: hcConfFor >= 1 && hcConfAg === 0,
  };
}

// Pad helpers.
const pad = (s, n) => String(s == null ? '' : s).padStart(n);
const padR = (s, n) => String(s == null ? '' : s).padEnd(n);
const sign = (n) => n == null ? '?' : n > 0 ? `+${n}` : `${n}`;

async function main() {
  const db = initFirebase();
  console.log(`\n=== Sharp Intel lock-state audit — ${TARGET_DATE} ===\n`);

  // 1. Load wallet profiles.
  const walletProfiles = new Map();
  const profilesSnap = await db.collection('sharpWalletProfiles').get();
  profilesSnap.forEach(d => walletProfiles.set(d.id.toLowerCase(), d.data()));
  console.log(`Loaded ${walletProfiles.size} sharpWalletProfiles`);

  // 2. Load today's positions (live wallet activity).
  const posSnap = await db.collection('sharp_action_positions')
    .where('date', '==', TARGET_DATE)
    .get();
  const positions = [];
  posSnap.forEach(d => positions.push({ _id: d.id, ...d.data() }));
  const groups = buildPositionGroups(positions);
  console.log(`Loaded ${positions.length} sharp_action_positions in ${groups.size} game-market clusters\n`);

  // 3. Load today's picks across ML/Spreads/Totals.
  const collections = ['sharpFlowPicks', 'sharpFlowSpreads', 'sharpFlowTotals'];
  const picks = [];
  for (const col of collections) {
    const snap = await db.collection(col).where('date', '==', TARGET_DATE).get();
    snap.forEach(d => picks.push({ _id: d.id, _collection: col, ...d.data() }));
  }
  console.log(`Loaded ${picks.length} pick docs across ML / Spreads / Totals\n`);

  // 4. Walk every side on every pick.
  const findings = [];
  const everySide = [];
  for (const pick of picks) {
    const mkt = pick._collection === 'sharpFlowSpreads' ? 'SPREAD'
      : pick._collection === 'sharpFlowTotals' ? 'TOTAL' : 'ML';
    const sides = pick.sides || {};
    for (const [sideKey, sd] of Object.entries(sides)) {
      if (!sd) continue;
      const lockStage = sd.lockStage || 'UNCLAIMED';
      const lockTier = sd.v8_lockTier || sd.contribTier || null;
      const peakStars = sd.peak?.stars ?? null;
      const peakUnits = sd.peak?.units ?? null;
      // Health status — `status` on a side doc; `health.status` is set by
      // syncPickHealth from evaluatePickHealth on every UI render.
      const status = sd.health?.status || sd.status || pick.status || null;
      const topPickStamp = sd.v8_topPick ?? null;
      const superTopPickStamp = sd.v8_superTopPick ?? null;
      const promotedBy = sd.promotedBy || null;
      // Frozen at-lock stamps live under v8_* prefix (see stampWalletConsensus).
      const dwStamp = sd.v8_walletConsensusDelta ?? sd.walletConsensusDelta ?? null;
      const dqStamp = sd.v8_walletConsensusQualityMargin ?? sd.walletConsensusQualityMargin ?? null;
      const forWStamp = sd.v8_walletConsensusForW ?? null;
      const agWStamp = sd.v8_walletConsensusAgW ?? null;
      const hcStamp = sd.v8_hcMargin ?? null;
      const hcConfForStamp = sd.v8_hcConfFor ?? sd.hcConfFor ?? null;
      const hcConfAgStamp = sd.v8_hcConfAg ?? sd.hcConfAg ?? null;
      const systemVersion = sd.v8_systemVersion ?? null;
      const consensusVersion = sd.v8_walletConsensusVersion ?? null;
      const rescuedFlag = !!sd.v8_v73HcRescue;
      const pickDate = pick.date || TARGET_DATE;
      // Try several possible places team name lives.
      const team = sd.peak?.team
        || sd.lock?.team
        || sd.team
        || (sideKey === 'away' ? pick.away
          : sideKey === 'home' ? pick.home
          : sideKey === 'over' ? `Over ${sd.peak?.line ?? sd.line ?? '?'}`
          : sideKey === 'under' ? `Under ${sd.peak?.line ?? sd.line ?? '?'}`
          : sideKey);

      // Live consensus from sharp_action_positions.
      const groupKey = `${pick.sport}|${pick.gameKey}|${mkt}`;
      const group = groups.get(groupKey) || [];
      const live = computeLiveConsensus(group, sideKey, pick.sport, walletProfiles);
      const expected = deriveExpectedHealthStatus({
        dwLive: live.delta,
        dqLive: live.qualityMargin,
        hcMarginLive: live.hcMargin,
        pickDate,
      });

      const row = {
        gameKey: pick.gameKey,
        sport: pick.sport,
        mkt,
        side: sideKey,
        team,
        date: pickDate,
        lockStage,
        lockTier,
        peakStars,
        peakUnits,
        status,
        promotedBy,
        topPickStamp,
        superTopPickStamp,
        dwStamp,
        dqStamp,
        forWStamp,
        agWStamp,
        hcStamp,
        hcConfForStamp,
        hcConfAgStamp,
        systemVersion,
        consensusVersion,
        rescuedFlag,
        reasons: sd.health?.reasons || [],
        live,
        expected,
        flags: [],
      };

      // ── Check 1: HC_OVERRIDE_FAIL ────────────────────────────────────────
      // Live HC_m ≥ +1 AND status MUTED with rescuable reason.
      const reasons = sd.health?.reasons || [];
      const isMuted = (status || '').toUpperCase() === 'MUTED' || reasons.some(r =>
        ['winners_below_floor', 'quality_below_floor', 'sum_below_floor'].includes(r));
      if (isV73Eligible(pickDate) && live.hcMargin >= 1 && live.delta >= 0 && isMuted) {
        const rescuableReasons = ['winners_below_floor', 'quality_below_floor', 'sum_below_floor'];
        const matches = reasons.filter(r => rescuableReasons.includes(r));
        row.flags.push({
          code: 'HC_OVERRIDE_FAIL',
          msg: `Live HC_m=+${live.hcMargin} (≥+1) AND dw_live=${live.delta}≥0 — should be ACTIVE per v7.3 but found MUTED${matches.length ? ` (reasons: ${matches.join(', ')})` : ''}`,
        });
      }

      // ── Check 1b: STALE_MUTE (live state recovered, doc still MUTED) ───
      // Doc says MUTED but live wallet consensus puts the pick at ACTIVE
      // per the v6.6 floor (no HC override needed). The mute happened at a
      // worse moment and never restamped when consensus recovered.
      if (isMuted && expected.status === 'ACTIVE'
          && (status || '').toUpperCase() !== 'CANCELLED') {
        row.flags.push({
          code: 'STALE_MUTE',
          msg: `Doc=MUTED${reasons.length ? ` (${reasons.join(', ')})` : ''} but live state ${expected.reason === 'v73_hc_rescue' ? '(HC rescue)' : '(passes v6.6 floor)'} — dw=${sign(live.delta)} dq=${sign(live.qualityMargin)} Σ=${sign(live.delta + live.qualityMargin)} HC_m=${sign(live.hcMargin)} — health stamp not refreshed`,
        });
      }

      // ── Check 1c: STALE_CANCEL (live state recovered after a flicker) ─
      // Doc says CANCELLED but live dw is no longer ≤ -2. Cancels are
      // designed to be sticky, but a transient dip can wreck a strong
      // pick — surface for manual review.
      if ((status || '').toUpperCase() === 'CANCELLED'
          && live.delta > -2) {
        row.flags.push({
          code: 'STALE_CANCEL',
          msg: `CANCELLED at lock (likely transient dw≤-2 flicker) but live dw=${sign(live.delta)} > -2; live Σ=${sign(live.delta + live.qualityMargin)} HC_m=${sign(live.hcMargin)} — possibly a flicker-cancel that lost a winning signal`,
        });
      }

      // ── Check 2: HC_RESCUE_STALE ─────────────────────────────────────────
      if (rescuedFlag && live.hcMargin < 1) {
        row.flags.push({
          code: 'HC_RESCUE_STALE',
          msg: `promotedBy=v73-hc-rescue at lock (HC_m=${sign(hcStamp)}) but live HC_m=${sign(live.hcMargin)} dropped below +1 — rescue justification gone`,
        });
      }

      // ── Check 3: LEAN_NONZERO ───────────────────────────────────────────
      if (lockTier === 'LEAN' && (peakUnits || 0) > 0.001) {
        row.flags.push({
          code: 'LEAN_NONZERO',
          msg: `lockTier=LEAN but peak.units=${peakUnits} (must be 0u for LEAN)`,
        });
      }

      // ── Check 4: SIGMA_LOCK_MISSED ─────────────────────────────────────
      // Σ ∈ {1, 2} ∧ HC_m ≥ +1 should LOCK per v7.3.
      const sigmaLive = live.delta + live.qualityMargin;
      if (isV73Eligible(pickDate)
          && (sigmaLive === 1 || sigmaLive === 2)
          && live.hcMargin >= 1
          && live.delta >= 0 && live.qualityMargin >= 0
          && lockStage === 'SHADOW'
          && (status || '').toUpperCase() !== 'CANCELLED') {
        row.flags.push({
          code: 'SIGMA_LOCK_MISSED',
          msg: `Σ_live=${sign(sigmaLive)} ∧ HC_m=+${live.hcMargin} should LOCK per v7.3 — currently SHADOW`,
        });
      }

      // ── Check 5: STALE_STAMP ───────────────────────────────────────────
      // v8_walletConsensusVersion is the numeric stamp (v7.3 = 9). A
      // post-cutover pick stamped < 9 means the syncer didn't re-evaluate.
      if (isV73Eligible(pickDate) && consensusVersion != null && consensusVersion < 9
          && (lockStage === 'LOCKED' || lockStage === 'LEAN')) {
        row.flags.push({
          code: 'STALE_STAMP',
          msg: `pickDate=${pickDate} ≥ v7.3 cutover but v8_walletConsensusVersion=${consensusVersion} (<9) — pick stamped under older policy`,
        });
      }

      // ── Check 6: MISSING_HC ───────────────────────────────────────────
      if ((lockStage === 'LOCKED' || lockStage === 'LEAN') && hcStamp == null) {
        row.flags.push({
          code: 'MISSING_HC',
          msg: `lockStage=${lockStage} but v8_hcMargin not stamped — can't reason about HC tier`,
        });
      }

      // ── Check 7: HC_FROZEN_VS_LIVE_DRIFT ─────────────────────────────────
      // HC margin frozen at lock vs live differs by >= 2 — surface for review.
      if (hcStamp != null && Math.abs((hcStamp || 0) - live.hcMargin) >= 2) {
        row.flags.push({
          code: 'HC_DRIFT',
          msg: `HC margin drifted: lock=${sign(hcStamp)} → live=${sign(live.hcMargin)} (Δ=${sign(live.hcMargin - hcStamp)})`,
        });
      }

      // ── Check 8: DW_FROZEN_VS_LIVE_DRIFT (high signal) ─────────────────
      if (dwStamp != null && Math.abs((dwStamp || 0) - live.delta) >= 2) {
        row.flags.push({
          code: 'DW_DRIFT',
          msg: `dw drifted: lock=${sign(dwStamp)} → live=${sign(live.delta)} (Δ=${sign(live.delta - dwStamp)})`,
        });
      }

      everySide.push(row);
      if (row.flags.length > 0) findings.push(row);
    }
  }

  // 5. Print results.
  const lockedSides = everySide.filter(r => ['LOCKED', 'LEAN'].includes(r.lockStage));
  console.log(`Total sides examined:   ${everySide.length}`);
  console.log(`  LOCKED / LEAN:        ${lockedSides.length}`);
  console.log(`  Other (SHADOW/etc):   ${everySide.length - lockedSides.length}`);
  console.log(`Sides with findings:    ${findings.length}\n`);

  // Distribution of flag codes.
  const codeCounts = {};
  for (const r of findings) {
    for (const f of r.flags) {
      codeCounts[f.code] = (codeCounts[f.code] || 0) + 1;
    }
  }
  console.log(`── Flag distribution ──`);
  Object.entries(codeCounts).sort((a, b) => b[1] - a[1]).forEach(([code, n]) => {
    console.log(`  ${padR(code, 22)} ${pad(n, 4)}`);
  });
  console.log('');

  // Print every flagged side with full evidence.
  if (findings.length > 0) {
    console.log(`══════════════════════════════════════════════════════════════════════`);
    console.log(`FINDINGS (${findings.length} sides)`);
    console.log(`══════════════════════════════════════════════════════════════════════`);
    for (const r of findings) {
      console.log(`\n${r.sport} ${r.mkt} ${padR(r.team, 24)} | ${r.gameKey}`);
      console.log(`  Stage:    ${padR(r.lockStage, 8)} tier=${padR(r.lockTier || '-', 8)} stars=${r.peakStars ?? '-'} units=${r.peakUnits ?? '-'} status=${r.status || '-'} promotedBy=${r.promotedBy || '-'} v73Rescued=${r.rescuedFlag} top=${r.topPickStamp} super=${r.superTopPickStamp}`);
      console.log(`  Stamped:  dw=${sign(r.dwStamp)}(for=${r.forWStamp}/ag=${r.agWStamp})  dq=${sign(r.dqStamp)}  HC_m=${sign(r.hcStamp)}  sysVer=${r.systemVersion ?? '-'}  consVer=${r.consensusVersion ?? '-'}`);
      console.log(`  Live:     dw=${sign(r.live.delta)}(for=${r.live.forW}/ag=${r.live.agW})  dq=${sign(r.live.qualityMargin)}  HC_m=${sign(r.live.hcMargin)}  Σ=${sign(r.live.delta + r.live.qualityMargin)}`);
      if (r.reasons.length > 0) console.log(`  Reasons:  ${r.reasons.join(', ')}`);
      console.log(`  Expected: status=${r.expected.status}${r.expected.reason ? ` (${r.expected.reason})` : ''}`);
      for (const f of r.flags) {
        console.log(`  ⚠  [${f.code}] ${f.msg}`);
      }
    }
  }

  // Verbose dump of every side (if requested).
  if (VERBOSE) {
    console.log(`\n\n══════════════════════════════════════════════════════════════════════`);
    console.log(`VERBOSE — every LOCKED / LEAN side`);
    console.log(`══════════════════════════════════════════════════════════════════════`);
    for (const r of lockedSides) {
      console.log(`${r.sport} ${r.mkt} ${padR(r.team, 24)}: stage=${padR(r.lockStage, 7)} tier=${padR(r.lockTier || '-', 8)} stars=${r.peakStars} units=${r.peakUnits} status=${padR(r.status || '-', 9)} | LOCK dw=${sign(r.dwStamp)}/dq=${sign(r.dqStamp)}/HC=${sign(r.hcStamp)} | LIVE dw=${sign(r.live.delta)}/dq=${sign(r.live.qualityMargin)}/HC=${sign(r.live.hcMargin)} (for=${r.live.forW}/ag=${r.live.agW}) ${r.reasons.length ? '· ' + r.reasons.join(', ') : ''}`);
    }
  }

  console.log(`\nDone.\n`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
