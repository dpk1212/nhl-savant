/**
 * exportTodaysPicks.mjs — dump the picks the SITE actually shows today into a
 * clean, writer-friendly JSON for the social Content Brief agent.
 *
 * This mirrors SharpFlow.jsx loadLockedPicks(): it reads the same Firestore
 * collections (sharpFlowPicks / sharpFlowSpreads / sharpFlowTotals) for today +
 * yesterday (ET) and emits each live side with its real stake, tier, odds, and
 * sharp proof. It does NOT use top_picks_ranked.json (that's a separate ranking
 * export and is not representative of the live board).
 *
 * Output: social_analysis/todays_picks.json
 *
 * Requires Firestore (serviceAccountKey.json). If unavailable, exits 0 and
 * writes nothing so the agent can fall back to the daily reports.
 *
 * Usage: node scripts/exportTodaysPicks.mjs
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  AGS_FALLBACK_CALIBRATION,
  aggregateSideProven,
  computeAgs,
} from '../src/lib/ags.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const OUT_DIR = join(REPO_ROOT, 'social_analysis');
mkdirSync(OUT_DIR, { recursive: true });

if (!admin.apps.length) {
  const sak = join(REPO_ROOT, 'serviceAccountKey.json');
  if (existsSync(sak)) {
    // Local dev — service account file on disk
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sak, 'utf8'))) });
  } else if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    // CI (GitHub Actions) — credentials from repo secrets
    admin.initializeApp({
      credential: admin.credential.cert({
        project_id: process.env.VITE_FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    console.warn('No Firestore credentials (serviceAccountKey.json or FIREBASE_* env). Skipping.');
    process.exit(0);
  }
}
const db = admin.firestore();

const etDate = (offsetDays = 0) =>
  new Date(Date.now() + offsetDays * 86400000).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
const TODAY = etDate(0);
const YESTERDAY = etDate(-1);
const NOW = Date.now();

// AGS calibration + proven-wallet tier map (mirrors syncPickStateAuthoritative.js)
let cal = AGS_FALLBACK_CALIBRATION;
const tierMap = new Map();
try {
  const calDoc = await db.collection('agsCalibration').doc('current').get();
  if (calDoc.exists && calDoc.data()?.normalizers) cal = calDoc.data();
  const profSnap = await db.collection('sharpWalletProfiles').get();
  for (const d of profSnap.docs) {
    const p = d.data();
    if (!p?.bySport) continue;
    const m = {};
    for (const [s, r] of Object.entries(p.bySport)) if (r?.whitelistTier) m[s] = r.whitelistTier;
    tierMap.set(d.id, m);
  }
} catch (e) {
  console.warn('Could not load calibration/profiles — proof fields will be limited:', e?.message || e);
}
const isProven = (short, sport) => {
  const t = tierMap.get(short)?.[sport];
  return t === 'CONFIRMED' || t === 'FLAT';
};

const COLLECTIONS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];

const toMillis = (ct) =>
  typeof ct === 'number' ? ct
  : ct?.toMillis ? ct.toMillis()
  : ct?._seconds ? ct._seconds * 1000
  : null;

const num = (v) => (Number.isFinite(v) ? v : null);

const picks = [];
for (const [col, mkt] of COLLECTIONS) {
  let snap;
  try {
    snap = await db.collection(col).where('date', 'in', [TODAY, YESTERDAY]).get();
  } catch (e) {
    console.warn(`Query ${col} failed:`, e?.message || e);
    continue;
  }
  for (const doc of snap.docs) {
    const d = doc.data();
    if (!d?.sides) continue;
    for (const [side, sd] of Object.entries(d.sides)) {
      if (!sd || sd.superseded) continue;
      const isLive = sd.lockStage === 'LOCKED' && sd.health?.status === 'ACTIVE';
      if (!isLive) continue;

      const ct = toMillis(d.commenceTime);
      const minsToGame = ct != null ? Math.round((ct - NOW) / 60000) : null;
      const units = num(sd.finalUnits) ?? num(sd.v8_agsUnitsApplied) ?? 0;

      // Human-readable, sign-correct selection string — SAME convention the site
      // renders (SharpFlow.jsx: `${team} ${line>0?'+':''}${line}`). The line is
      // stored SIGNED, so a positive run line is the UNDERDOG +1.5 (getting runs),
      // never -1.5. Emit this so downstream (the Twitter loop) never guesses the
      // sign and can't mislabel a play.
      const _team = sd.team || side;
      const _line = num(sd.peak?.line ?? sd.lock?.line);
      const _odds = num(sd.peak?.odds ?? sd.lock?.odds);
      const _oddsStr = _odds == null ? '' : (_odds > 0 ? `+${_odds}` : `${_odds}`);
      let selection;
      if (mkt === 'SPREAD') {
        selection = `${_team} ${_line > 0 ? '+' : ''}${_line}${_oddsStr ? ` (${_oddsStr})` : ''}`;
      } else if (mkt === 'TOTAL') {
        selection = `${_team}${_oddsStr ? ` (${_oddsStr})` : ''}`; // _team already "Under 8.5"/"Over 8.5"
      } else {
        selection = `${_team} ML${_oddsStr ? ` ${_oddsStr}` : ''}`;
      }

      // Sharp proof: proven winners for/against + AGS score
      const wd = sd.peak?.v8Scoring?.walletDetails || sd.lock?.v8Scoring?.walletDetails || [];
      let provenFor = null, provenAgainst = null, ags = null, agsTier = null;
      if (wd.length) {
        try {
          const agg = aggregateSideProven(wd, side, d.sport, isProven);
          const agsRes = agg ? computeAgs(agg, cal) : null;
          if (agsRes) {
            provenFor = agsRes.provenForCount ?? null;
            provenAgainst = agsRes.provenAgCount ?? null;
            ags = num(agsRes.ags);
          }
        } catch { /* leave proof null */ }
      }
      agsTier = sd.v8_agsTier || null;

      picks.push({
        date: d.date,
        isToday: d.date === TODAY,
        sport: d.sport,
        market: mkt,
        gameKey: d.gameKey,
        matchup: `${d.away} @ ${d.home}`,
        away: d.away,
        home: d.home,
        side,
        team: sd.team || side,
        selection,
        line: num(sd.peak?.line ?? sd.lock?.line),
        odds: num(sd.peak?.odds ?? sd.lock?.odds),
        units,
        shipped: units > 0,
        stakeTier: sd.v8_hcStakeTier || null,   // product tier: SUPER|TOP|RANK|MINI|CONFIRMED
        agsConvictionTier: sd.v8_lockTier || null, // AGS tier: ELITE|PREMIUM|...
        hcMargin: num(sd.v8_hcMargin),
        walletConsensusDelta: num(sd.v8_walletConsensusDelta),
        walletQualityMargin: num(sd.v8_walletConsensusQualityMargin),
        provenWinnersFor: provenFor,
        provenWinnersAgainst: provenAgainst,
        ags,
        agsTier,
        promotedBy: sd.promotedBy || null,
        commenceTime: ct != null ? new Date(ct).toISOString() : null,
        minsToGame,
      });
    }
  }
}

// Rank: today first, shipped first, biggest stake first, soonest game first
const tierRank = { SUPER: 0, TOP: 1, RANK: 2, MINI: 3, CONFIRMED: 4, MONITORING: 5 };
picks.sort((a, b) => {
  if (a.isToday !== b.isToday) return a.isToday ? -1 : 1;
  if (a.shipped !== b.shipped) return a.shipped ? -1 : 1;
  if ((b.units || 0) !== (a.units || 0)) return (b.units || 0) - (a.units || 0);
  const tr = (tierRank[a.stakeTier] ?? 9) - (tierRank[b.stakeTier] ?? 9);
  if (tr) return tr;
  return (a.minsToGame ?? 1e9) - (b.minsToGame ?? 1e9);
});

const todayPicks = picks.filter((p) => p.isToday);
const shippedToday = todayPicks.filter((p) => p.shipped);
const byTier = {};
for (const p of shippedToday) byTier[p.stakeTier || 'UNKNOWN'] = (byTier[p.stakeTier || 'UNKNOWN'] || 0) + 1;
const bySport = {};
for (const p of shippedToday) bySport[p.sport] = (bySport[p.sport] || 0) + 1;

const out = {
  generatedAt: new Date().toISOString(),
  today: TODAY,
  source: 'Firestore sharpFlowPicks/Spreads/Totals (same as site loadLockedPicks)',
  summary: {
    liveSidesToday: todayPicks.length,
    shippedToday: shippedToday.length,
    trackedOnlyToday: todayPicks.length - shippedToday.length,
    totalUnitsToday: +shippedToday.reduce((s, p) => s + (p.units || 0), 0).toFixed(2),
    byTier,
    bySport,
  },
  picks,
};

writeFileSync(join(OUT_DIR, 'todays_picks.json'), JSON.stringify(out, null, 2));
console.log(`Wrote social_analysis/todays_picks.json`);
console.log(`  ${TODAY}: ${todayPicks.length} live sides · ${shippedToday.length} shipped · ${out.summary.totalUnitsToday}u`);
console.log(`  Tiers: ${JSON.stringify(byTier)} · Sports: ${JSON.stringify(bySport)}`);
for (const p of shippedToday.slice(0, 8)) {
  console.log(`  ${p.sport} ${p.market} ${p.team} ${p.odds != null ? (p.odds > 0 ? '+' + p.odds : p.odds) : ''} · ${p.units}u ${p.stakeTier || ''} (${p.agsConvictionTier || '—'}) · HC ${p.hcMargin ?? '—'} · proven ${p.provenWinnersFor ?? '—'}-for/${p.provenWinnersAgainst ?? '—'}-against`);
}
process.exit(0);
