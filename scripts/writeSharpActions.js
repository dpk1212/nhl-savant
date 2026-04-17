/**
 * writeSharpActions.js — Persist Today's Action positions to Firebase
 *
 * Reads sharp_positions / spread / total JSONs + sports_sharps + pinnacle_history,
 * applies the same 0.75x avg-bet filter as the UI, and writes each qualifying
 * position to Firestore collection `sharp_action_positions`.
 *
 * Idempotent: skips documents that already exist for the same wallet/game/side/market.
 *
 * Usage: node scripts/writeSharpActions.js
 * Schedule: run after scan-sharp-positions (every 2h)
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '../public');
const COLLECTION = 'sharp_action_positions';
const MIN_BET_MULTIPLIER = 0.75;

function initFirebase() {
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
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}

function loadJSON(name) {
  const p = join(PUBLIC, name);
  if (!existsSync(p)) return null;
  return JSON.parse(readFileSync(p, 'utf8'));
}

function impliedProb(odds) {
  if (!odds || odds === 0) return null;
  return odds < 0 ? Math.abs(odds) / (Math.abs(odds) + 100) : 100 / (odds + 100);
}

function americanOddsFromProb(prob) {
  if (!prob || prob <= 0 || prob >= 1) return null;
  return prob >= 0.5
    ? Math.round(-prob / (1 - prob) * 100)
    : Math.round((1 - prob) / prob * 100);
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

async function main() {
  const db = initFirebase();
  const date = todayStr();
  console.log(`\n=== writeSharpActions — ${date} ===\n`);

  const sharpPositions = loadJSON('sharp_positions.json');
  const spreadPositions = loadJSON('sharp_spread_positions.json');
  const totalPositions = loadJSON('sharp_total_positions.json');
  const sportsSharps = loadJSON('sports_sharps.json') || {};
  const pinnacleHistory = loadJSON('pinnacle_history.json') || {};
  const excludedRaw = loadJSON('sharp_intel_excluded_wallets.json') || {};
  const excludedArr = Array.isArray(excludedRaw.excluded) ? excludedRaw.excluded : [];
  const excludedSet = new Set(excludedArr.map(w => (w || '').toLowerCase()));

  const posFiles = [
    { data: sharpPositions, mkt: 'ML' },
    { data: spreadPositions, mkt: 'SPREAD' },
    { data: totalPositions, mkt: 'TOTAL' },
  ];

  const positions = [];

  for (const { data: posData, mkt } of posFiles) {
    if (!posData) continue;
    for (const sport of ['NHL', 'NBA', 'MLB', 'CBB', 'NFL']) {
      const sportGames = posData[sport] || {};
      for (const [gameKey, gd] of Object.entries(sportGames)) {
        if (!gd.positions) continue;
        for (const pos of gd.positions) {
          const wLower = pos.wallet?.toLowerCase();
          if (!wLower) continue;
          if (excludedSet.has(wLower)) continue;

          const avgBet = pos.avgSportBet || 0;
          if (avgBet > 0 && pos.invested < avgBet * MIN_BET_MULTIPLIER) continue;

          const teamName = pos.side === 'home' || pos.side === 'over'
            ? (pos.side === 'over' ? 'Over' : gd.home)
            : (pos.side === 'under' ? 'Under' : gd.away);
          const mult = avgBet > 0 ? +(pos.invested / avgBet).toFixed(2) : 0;
          const displayRoi = Math.min(pos.sportROI || 0, 999.9);

          // Pinnacle odds + retail EV
          const pinnGame = pinnacleHistory?.[sport]?.[gameKey];
          let pinnOdds = null, bestRetail = null, bestBook = null, evEdge = null;
          let spreadLine = null, totalLine = null;
          if (pinnGame) {
            if (mkt === 'ML') {
              pinnOdds = pos.side === 'away' ? pinnGame.awayOdds : pinnGame.homeOdds;
              const books = pinnGame.books || {};
              for (const [bk, bkData] of Object.entries(books)) {
                const o = pos.side === 'away' ? bkData.awayOdds : bkData.homeOdds;
                if (o && pinnOdds) {
                  const retailP = impliedProb(o);
                  const pinnP = impliedProb(pinnOdds);
                  if (retailP && pinnP && pinnP > retailP) {
                    const edge = +((pinnP - retailP) * 100).toFixed(1);
                    if (!evEdge || edge > evEdge) { evEdge = edge; bestRetail = o; bestBook = bk; }
                  }
                }
              }
            } else if (mkt === 'SPREAD') {
              pinnOdds = pos.side === 'away' ? pinnGame.awaySpreadOdds : pinnGame.homeSpreadOdds;
              spreadLine = pos.side === 'away' ? pinnGame.awaySpread : pinnGame.homeSpread;
              const books = pinnGame.spreadBooks || {};
              for (const [bk, bkData] of Object.entries(books)) {
                const o = pos.side === 'away' ? bkData.awayOdds : bkData.homeOdds;
                if (o && pinnOdds) {
                  const retailP = impliedProb(o);
                  const pinnP = impliedProb(pinnOdds);
                  if (retailP && pinnP && pinnP > retailP) {
                    const edge = +((pinnP - retailP) * 100).toFixed(1);
                    if (!evEdge || edge > evEdge) { evEdge = edge; bestRetail = o; bestBook = bk; }
                  }
                }
              }
            } else {
              pinnOdds = pos.side === 'over' ? pinnGame.overOdds : pinnGame.underOdds;
              totalLine = pinnGame.totalLine || null;
              const books = pinnGame.totalBooks || {};
              for (const [bk, bkData] of Object.entries(books)) {
                const o = pos.side === 'over' ? bkData.overOdds : bkData.underOdds;
                if (o && pinnOdds) {
                  const retailP = impliedProb(o);
                  const pinnP = impliedProb(pinnOdds);
                  if (retailP && pinnP && pinnP > retailP) {
                    const edge = +((pinnP - retailP) * 100).toFixed(1);
                    if (!evEdge || edge > evEdge) { evEdge = edge; bestRetail = o; bestBook = bk; }
                  }
                }
              }
            }
          }

          const hasEV = evEdge != null && evEdge > 0;
          const isHighConviction = mult >= 3;
          const label = hasEV ? 'EV_OPPORTUNITY' : isHighConviction ? 'HIGH_CONVICTION' : 'SHARP_POSITION';

          // Wallet profile data
          const walletProfile = sportsSharps[pos.wallet] || sportsSharps[wLower] || {};

          positions.push({
            date,
            sport,
            gameKey,
            away: gd.away,
            home: gd.home,
            wallet: pos.wallet,
            walletShort: pos.wallet.slice(-6),
            tier: pos.tier || walletProfile.tier || 'SHARP',
            leaderboardRank: pos.leaderboardRank ?? walletProfile.leaderboardRank ?? null,
            sportsLbPercentileTop: pos.sportsLbPercentileTop ?? walletProfile.sportsLbPercentileTop ?? null,
            marketType: mkt,
            side: pos.side,
            teamName,
            outcome: pos.outcome || null,
            invested: pos.invested || 0,
            size: pos.size || 0,
            avgPrice: pos.avgPrice || 0,
            curPrice: pos.curPrice || 0,
            currentValue: pos.currentValue || 0,
            positionPnl: pos.pnl || 0,
            avgSportBet: avgBet,
            betMultiplier: mult,
            sportROI: displayRoi,
            totalPnl: pos.totalPnl || walletProfile.totalPnl || 0,
            sportPnlTotal: pos.sportPnlTotal || walletProfile.sportPnlTotal || 0,
            sportVol: pos.sportVol || walletProfile.vol || 0,
            pinnacleOdds: pinnOdds,
            pinnacleImplied: pinnOdds ? +(impliedProb(pinnOdds) * 100).toFixed(1) : null,
            bestRetailOdds: bestRetail,
            bestBook: bestBook,
            evEdge: evEdge,
            spreadLine: spreadLine,
            totalLine: totalLine,
            label,
            firstSeen: pos.firstSeen || null,
            status: 'PENDING',
            result: null,
            gradedAt: null,
            closingPinnacleOdds: null,
            clv: null,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      }
    }
  }

  console.log(`Found ${positions.length} qualifying positions for Today's Action`);

  // Write to Firebase in batches
  let written = 0, skipped = 0, updated = 0;
  const BATCH_SIZE = 400;

  for (let i = 0; i < positions.length; i += BATCH_SIZE) {
    const chunk = positions.slice(i, i + BATCH_SIZE);
    const batch = db.batch();
    let batchOps = 0;

    for (const pos of chunk) {
      const docId = `${pos.date}_${pos.sport}_${pos.gameKey}_${pos.wallet.slice(-8)}_${pos.marketType}_${pos.side}`;
      const ref = db.collection(COLLECTION).doc(docId);
      const existing = await ref.get();

      if (existing.exists) {
        const data = existing.data();
        if (data.status === 'GRADED') {
          skipped++;
          continue;
        }
        // Update live fields (price movement, position PnL) but don't overwrite core data
        batch.update(ref, {
          curPrice: pos.curPrice,
          currentValue: pos.currentValue,
          positionPnl: pos.positionPnl,
          pinnacleOdds: pos.pinnacleOdds,
          pinnacleImplied: pos.pinnacleImplied,
          bestRetailOdds: pos.bestRetailOdds,
          bestBook: pos.bestBook,
          evEdge: pos.evEdge,
          label: pos.label,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        updated++;
      } else {
        batch.set(ref, pos);
        written++;
      }
      batchOps++;
    }

    if (batchOps > 0) await batch.commit();
  }

  console.log(`\nResults:`);
  console.log(`  Written:  ${written} new positions`);
  console.log(`  Updated:  ${updated} existing positions (live fields)`);
  console.log(`  Skipped:  ${skipped} already graded`);
  console.log(`  Total:    ${positions.length}`);
  console.log(`\nDone.`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
