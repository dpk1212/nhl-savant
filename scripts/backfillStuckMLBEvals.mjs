// Backfill: promote stuck EVALUATION docs in mlb_bets to fully tracked
// bets, but ONLY for picks that are/were actually displayed to the user
// (i.e. that appear in public/mlb_model_picks.json). This keeps the
// contract: displayed pick ↔ tracked bet ↔ graded bet.
//
// Driven by the same root-cause fix in scripts/fetchMLBPicks.js — going
// forward, writePickToFirebase will promote on every cycle, so this
// backfill is only needed for already-stuck docs from before the fix.
//
// Usage:  node scripts/backfillStuckMLBEvals.mjs
//         node scripts/backfillStuckMLBEvals.mjs --apply

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APPLY = process.argv.includes('--apply');

const saPath = path.join(__dirname, '..', 'serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(saPath, 'utf8'))),
});
const db = admin.firestore();

const jsonPath = path.join(__dirname, '..', 'public', 'mlb_model_picks.json');
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const jsonDate = jsonData.date;
const jsonPickKeys = new Set(
  (jsonData.picks || []).map(p => `${p.awayCode}_${p.homeCode}`.toLowerCase()),
);

console.log(`Scanning mlb_bets for date=${jsonDate}`);
console.log(`JSON picks (${jsonPickKeys.size}): ${[...jsonPickKeys].join(', ')}`);
console.log(APPLY ? '\n>>> APPLY MODE — writes will be made.\n' : '\n>>> DRY RUN — no writes (use --apply to commit).\n');

const snap = await db.collection('mlb_bets').where('date', '==', jsonDate).get();

const toPromote = [];
for (const d of snap.docs) {
  const b = d.data();
  const key = `${(b.game?.awayCode || '').toLowerCase()}_${(b.game?.homeCode || '').toLowerCase()}`;
  const stuck = b.type === 'EVALUATION' && (b.bet?.units || b.units || 0) > 0;
  const inJson = jsonPickKeys.has(key);
  if (stuck && inJson) toPromote.push({ id: d.id, key, data: b });
}

if (toPromote.length === 0) {
  console.log('No stuck-EVAL-with-units docs match displayed picks. Nothing to do.');
  process.exit(0);
}

console.log(`Will promote ${toPromote.length} doc(s) to tracked bets:`);
for (const x of toPromote) console.log(`   • ${x.id}  (units=${x.data.bet?.units ?? x.data.units})`);

if (!APPLY) {
  console.log('\n(Dry run — re-run with --apply to commit.)');
  process.exit(0);
}

for (const x of toPromote) {
  // Reconstruct the bet shape that fetchMLBPicks.js writes for fresh
  // picks. Most fields are already on the EVAL doc — we just need to
  // add the bet envelope and the tracked-bet status fields.
  const b = x.data;
  const p = b.modelData || b.prediction || {};
  const o = b.odds || {};

  const ensembleAway = p.ensembleAwayProb ?? p.ensembleAwayProb;
  const ensembleHome = p.ensembleHomeProb ?? p.ensembleHomeProb;
  const side = (ensembleHome ?? 0) >= (ensembleAway ?? 0) ? 'home' : 'away';
  const sideOdds = side === 'home' ? (o.homeOdds ?? null) : (o.awayOdds ?? null);
  const sideBook = side === 'home' ? (o.homeBook ?? null) : (o.awayBook ?? null);
  const pickFull = side === 'home' ? b.game?.homeTeam : b.game?.awayTeam;
  const pickCode = side === 'home' ? b.game?.homeCode : b.game?.awayCode;

  const promotionPayload = {
    type: admin.firestore.FieldValue.delete(),
    isLocked: true,
    status: 'PENDING',
    betStatus: 'BET_NOW',
    isMLBPick: true,
    source: b.source || 'MLB_MODEL_V1',
    firstRecommendedAt: b.firstRecommendedAt || b.timestamp || Date.now(),
    lockedAt: b.lockedAt || b.timestamp || Date.now(),
    lastUpdatedAt: Date.now(),
    bet: b.bet || {
      market: 'MONEYLINE',
      pick: pickFull,
      pickCode,
      side,
      odds: sideOdds,
      book: sideBook || 'Best Available',
      units: b.units || 0,
    },
    prediction: b.prediction || {
      ensembleAwayProb: ensembleAway,
      ensembleHomeProb: ensembleHome,
      dratingsAwayProb: p.dratingsAwayProb ?? null,
      dratingsHomeProb: p.dratingsHomeProb ?? null,
      dimersAwayProb: p.dimersAwayProb ?? null,
      dimersHomeProb: p.dimersHomeProb ?? null,
      bestEV: b.edge?.bestEV ?? null,
      grade: b.edge?.grade ?? null,
      pinnacleEdge: b.edge?.pinnacleEdge ?? null,
      modelsAgree: p.modelsAgree ?? null,
      confidence: p.confidence ?? null,
    },
    pinnacle: (o.pinnacleAway != null) ? {
      awayOdds: o.pinnacleAway,
      homeOdds: o.pinnacleHome,
    } : (b.pinnacle || null),
    result: b.result || {
      awayScore: null,
      homeScore: null,
      totalScore: null,
      winner: null,
      outcome: null,
      profit: null,
      fetched: false,
      fetchedAt: null,
      source: null,
    },
  };

  await db.collection('mlb_bets').doc(x.id).set(promotionPayload, { merge: true });
  console.log(`   ✅ promoted ${x.id}`);
}

console.log(`\nDone. Promoted ${toPromote.length} doc(s).`);
process.exit(0);
