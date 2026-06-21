/**
 * RANK-RESCUE — today's qualifiers (read-only preview)
 *
 * Mirrors the PRODUCTION rule in syncPickStateAuthoritative.js exactly so this
 * prints what the cron will auto-promote. A side qualifies when v12 shipped it
 * (score > 0) but v12a's HC sizer muted it (hcMargin < 1 AND miniHcMargin < 1),
 * AND the FOR side is "2-for-0": ≥2 ELIGIBLE whitelist wallets backing, 0 against.
 * Eligible = whitelistTier ∈ {CONFIRMED,FLAT,WR50} AND bySport[sport].picks.n ≥ 8.
 * Qualifiers are auto-staked at 4u (tier RANK) by the cron — no manual step.
 *
 *   node scripts/_rank_today_qualifiers.mjs [YYYY-MM-DD]
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
if (!admin.apps.length) {
  const sak = join(REPO_ROOT, 'serviceAccountKey.json');
  if (existsSync(sak)) admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sak, 'utf8'))) });
  else admin.initializeApp({ credential: admin.credential.cert({
    project_id: process.env.VITE_FIREBASE_PROJECT_ID, client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }) });
}
const db = admin.firestore();
const COLS = [['sharpFlowPicks', 'ML'], ['sharpFlowSpreads', 'SPREAD'], ['sharpFlowTotals', 'TOTAL']];
const TODAY = process.argv[2] || new Date().toISOString().slice(0, 10);

// ── production eligibility (mirrors computeRankSlice / isRankEligible in sync) ──
const RANK_MIN_PICKS = 8, RANK_UNITS = 4;
const isElig = (profiles, short, sport) => {
  const p = profiles.get(short) || profiles.get(short.toUpperCase());
  const r = p?.bySport?.[sport];
  if (!r) return false;
  const t = r.whitelistTier;
  if (t !== 'CONFIRMED' && t !== 'FLAT' && t !== 'WR50') return false;
  return (Number(r.picks?.n) || 0) >= RANK_MIN_PICKS;
};
function rankSlice(profiles, wd, mySide, sport) {
  let backing = 0, against = 0; const seen = new Set(); const forW = [], agW = [];
  for (const w of wd) {
    const short = String(w.walletShort || w.wallet || '').slice(-6).toLowerCase();
    if (!short || seen.has(short)) continue; seen.add(short);
    if (!isElig(profiles, short, sport)) continue;
    if (w.side === mySide) { backing++; forW.push(short); }
    else if (w.side) { against++; agW.push(short); }
  }
  return { backing, against, qualifies: backing >= 2 && against === 0, forW, agW };
}

async function main() {
  console.log(`Loading (TODAY=${TODAY})…`);
  const profiles = new Map();
  (await db.collection('sharpWalletProfiles').get()).forEach(d => profiles.set(String(d.id).toLowerCase(), d.data()));

  const quals = [];
  for (const [col] of COLS) {
    const snap = await db.collection(col).where('date', '==', TODAY).get();
    for (const doc of snap.docs) {
      const data = doc.data(); if (!data.sides) continue;
      const sport = data.sport || 'NHL';
      for (const [sk, sd] of Object.entries(data.sides)) {
        if (sd?.superseded) continue;
        const wd = sd.peak?.v8Scoring?.walletDetails || sd.lock?.v8Scoring?.walletDetails;
        if (!Array.isArray(wd)) continue;
        const score = sd.v8_agsV12;
        if (!Number.isFinite(score) || score <= 0) continue;        // must be v12-shipped
        const hc = Number.isFinite(sd.v8_hcMargin) ? sd.v8_hcMargin : ((sd.v8_hcConfFor || 0) - (sd.v8_hcConfAg || 0));
        const mini = Number.isFinite(sd.v8_miniHcMargin) ? sd.v8_miniHcMargin : ((sd.v8_miniHcConfFor || 0) - (sd.v8_miniHcConfAg || 0));
        const hcMuted = hc < 1 && mini < 1;                          // v12a would mute → 0u
        const sl = rankSlice(profiles, wd, sk, sport);
        if (!sl.qualifies) continue;
        quals.push({
          col, docId: doc.id, sport, sk,
          matchup: data.matchup || data.game || `${data.away || ''}@${data.home || ''}` || doc.id,
          scoreV12: score, tier: sd.v8_agsV12Tier, hcMargin: hc, miniHcMargin: mini,
          finalUnits: sd.finalUnits, status: sd.status, hcStakeTier: sd.v8_hcStakeTier,
          odds: (sd.peak || sd.lock || {}).odds || 0,
          hcMuted, backing: sl.backing, forW: sl.forW, agW: sl.agW,
        });
      }
    }
  }

  const rescues = quals.filter(q => q.hcMuted);   // will be auto-staked at 4u
  const alreadyHc = quals.filter(q => !q.hcMuted); // slice but HC-staked → NOT rescued (no hammer)
  const L = [];
  L.push(`RANK-RESCUE PREVIEW for ${TODAY}  (≥2 eligible whitelist FOR · 0 against · whitelist + picks.n≥${RANK_MIN_PICKS}; mirrors cron)`);
  L.push(`2-for-0 sides found: ${quals.length}  →  RANK-RESCUE (HC-muted, auto-staked ${RANK_UNITS}u): ${rescues.length}`);
  L.push('');
  L.push(`── RANK-RESCUE → auto-staked ${RANK_UNITS}u by cron: ${rescues.length} ──`);
  for (const q of rescues) {
    L.push(`  ${q.sport} ${q.col.replace('sharpFlow', '')} ${q.matchup}  → SIDE "${q.sk}" @ ${q.odds}`);
    L.push(`     v12=${q.scoreV12?.toFixed?.(3) ?? q.scoreV12} tier=${q.tier} hcMargin=${q.hcMargin} mini=${q.miniHcMargin} | now: ${q.finalUnits ?? 0}u/${q.hcStakeTier ?? '—'}/${q.status}`);
    L.push(`     FOR eligible (${q.backing}): ${q.forW.join(', ')}  | AG: ${q.agW.join(', ') || 'none'}`);
    L.push(`     docId=${q.docId}`);
  }
  if (alreadyHc.length) {
    L.push('');
    L.push(`── 2-for-0 but HC-staked (NOT rescued — no hammer): ${alreadyHc.length} ──`);
    for (const q of alreadyHc) L.push(`  ${q.sport} ${q.matchup} "${q.sk}"  ${q.finalUnits ?? 0}u/${q.hcStakeTier ?? '—'}  hcMargin=${q.hcMargin}`);
  }
  const text = L.join('\n');
  console.log('\n' + text);
  writeFileSync(join(REPO_ROOT, `rank_qualifiers_${TODAY}.json`), JSON.stringify(quals, null, 2));
  console.log(`\n✓ wrote rank_qualifiers_${TODAY}.json (${quals.length} 2-for-0 sides, ${rescues.length} auto-rescued)`);
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => process.exit(0));
