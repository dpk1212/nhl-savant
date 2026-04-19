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

// ── V8 Wallet-Contribution Scoring (server-side port) ────────────────────────

const V8_STAR_THRESHOLDS = {
  p30: -3.0, p50: 0.0, p65: 1.5, p78: 3.0, p88: 4.5, p95: 6.0, p98: 7.5,
};

function buildV8Normalization(sportsSharps) {
  if (!sportsSharps) return null;
  const addrs = Object.keys(sportsSharps).filter(k => k !== '_meta');
  if (addrs.length === 0) return null;

  const roiArr = addrs.map(a => sportsSharps[a].sportROI || 0).sort((a, b) => a - b);
  const pnlArr = addrs.map(a => sportsSharps[a].sportPnlTotal || sportsSharps[a].totalPnl || 0).sort((a, b) => a - b);

  const withRank = addrs
    .filter(a => sportsSharps[a].leaderboardRank != null)
    .sort((a, b) => sportsSharps[a].leaderboardRank - sportsSharps[b].leaderboardRank);
  const K = withRank.length;
  const internalRankMap = {};
  withRank.forEach((addr, i) => { internalRankMap[addr] = i + 1; });

  return { roiArr, pnlArr, internalRankMap, K, walletCount: addrs.length, sportsSharps };
}

function percentileOf(sortedArr, val) {
  let count = 0;
  for (let i = 0; i < sortedArr.length; i++) {
    if (sortedArr[i] < val) count++;
    else break;
  }
  return (count / sortedArr.length) * 100;
}

function computeGameWPS(gamePositions, v8Norm) {
  if (!v8Norm || !gamePositions || gamePositions.length === 0) {
    return { walletPlayScore: 0, stars: 1, label: 'MONITORING', forSide: 0, againstSide: 0, netEdge: 0, breadthBonus: 0, concPenalty: 0, topShare: 0, walletCountFor: 0, walletCountAgainst: 0, consensusSide: null, walletDetails: [] };
  }

  const { roiArr, pnlArr, internalRankMap, K, sportsSharps: ss } = v8Norm;

  const sideTotals = {};
  for (const p of gamePositions) {
    sideTotals[p.side] = (sideTotals[p.side] || 0) + (p.invested || 0);
  }
  const consensusSide = Object.entries(sideTotals).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (!consensusSide) {
    return { walletPlayScore: 0, stars: 1, label: 'MONITORING', forSide: 0, againstSide: 0, netEdge: 0, breadthBonus: 0, concPenalty: 0, topShare: 0, walletCountFor: 0, walletCountAgainst: 0, consensusSide: null, walletDetails: [] };
  }

  const dedup = (arr) => {
    const m = new Map();
    for (const p of arr) {
      const ex = m.get(p.wallet);
      if (!ex || (p.invested || 0) > (ex.invested || 0)) m.set(p.wallet, p);
    }
    return [...m.values()];
  };

  const conRaw = gamePositions.filter(p => p.side === consensusSide);
  const oppRaw = gamePositions.filter(p => p.side && p.side !== consensusSide);
  const conDeduped = dedup(conRaw);
  const oppDeduped = dedup(oppRaw);

  const conMap = new Map(conDeduped.map(p => [p.wallet, p]));
  const oppMap = new Map(oppDeduped.map(p => [p.wallet, p]));
  const allWallets = new Set([...conMap.keys(), ...oppMap.keys()]);
  const conWallets = [];
  const oppWallets = [];
  for (const w of allWallets) {
    const c = conMap.get(w);
    const o = oppMap.get(w);
    if (c && !o) { conWallets.push(c); continue; }
    if (o && !c) { oppWallets.push(o); continue; }
    const cInv = c.invested || 0;
    const oInv = o.invested || 0;
    const net = Math.abs(cInv - oInv);
    if (net < 1) continue;
    if (cInv > oInv) conWallets.push({ ...c, invested: net });
    else oppWallets.push({ ...o, invested: net });
  }

  function walletContributionDetail(p) {
    const w = ss[p.wallet] || {};
    const roi = p.sportROI ?? w.sportROI ?? 0;
    const pnl = p.sportPnl ?? w.sportPnlTotal ?? p.totalPnl ?? w.totalPnl ?? 0;
    const roiNorm = percentileOf(roiArr, roi);
    const pnlNorm = percentileOf(pnlArr, pnl);

    const hasRank = (w.leaderboardRank != null) && internalRankMap[p.wallet];
    let walletBase, rankNorm = null;
    if (hasRank) {
      const ir = internalRankMap[p.wallet];
      rankNorm = K > 1 ? 100 * (1 - (ir - 1) / (K - 1)) : 50;
      walletBase = 0.60 * roiNorm + 0.25 * rankNorm + 0.15 * pnlNorm;
    } else {
      walletBase = 0.65 * roiNorm + 0.35 * pnlNorm;
    }

    const avgBet = p.avgSportBet || w.avgSportBet || 0;
    const sizeRatio = avgBet > 0 ? (p.invested || 0) / avgBet : 1;
    const convictionMult = Math.max(0.70, Math.min(1.60, 1 + 0.30 * Math.log(sizeRatio)));
    const contribution = walletBase * convictionMult;

    return {
      contribution,
      detail: {
        wallet: p.wallet?.slice(-6) || '???',
        side: p.side,
        invested: Math.round(p.invested || 0),
        roi: +roi.toFixed(1),
        pnl: Math.round(pnl),
        rank: w.leaderboardRank || null,
        roiNorm: +roiNorm.toFixed(1),
        pnlNorm: +pnlNorm.toFixed(1),
        rankNorm: rankNorm != null ? +rankNorm.toFixed(1) : null,
        walletBase: +walletBase.toFixed(1),
        sizeRatio: +sizeRatio.toFixed(2),
        convictionMult: +convictionMult.toFixed(3),
        contribution: +contribution.toFixed(1),
      },
    };
  }

  let forSide = 0, maxContrib = 0;
  const walletDetails = [];
  for (const p of conWallets) {
    const { contribution, detail } = walletContributionDetail(p);
    forSide += contribution;
    maxContrib = Math.max(maxContrib, contribution);
    walletDetails.push(detail);
  }

  let againstSide = 0;
  for (const p of oppWallets) {
    const { contribution, detail } = walletContributionDetail(p);
    againstSide += contribution;
    walletDetails.push(detail);
  }

  const walletCountFor = conWallets.length;
  const topShare = forSide > 0 ? maxContrib / forSide : 1;
  const netEdge = (forSide - 0.85 * againstSide) / 100;
  const breadthBonus = 2 * Math.log(1 + walletCountFor);
  const concCoeff = walletCountFor <= 2 ? 4 : 5;
  const concPenalty = concCoeff * topShare;
  const walletPlayScore = netEdge + breadthBonus - concPenalty;

  let stars;
  if (walletCountFor <= 1) {
    const isWhaleOverride = conWallets.length === 1 && conWallets[0] &&
      (conWallets[0].invested || 0) >= 25000 &&
      (conWallets[0].sportPnl ?? ss[conWallets[0].wallet]?.sportPnlTotal ?? 0) >= 500000;
    if (isWhaleOverride) {
      stars = Math.min(3.5, walletPlayScore >= V8_STAR_THRESHOLDS.p95 ? 3.5
        : walletPlayScore >= V8_STAR_THRESHOLDS.p88 ? 3
        : walletPlayScore >= V8_STAR_THRESHOLDS.p78 ? 2.5 : 2);
    } else {
      stars = Math.min(2.5, walletPlayScore >= V8_STAR_THRESHOLDS.p78 ? 2.5
        : walletPlayScore >= V8_STAR_THRESHOLDS.p65 ? 2
        : walletPlayScore >= V8_STAR_THRESHOLDS.p50 ? 1.5 : 1);
    }
  } else {
    stars = walletPlayScore >= V8_STAR_THRESHOLDS.p98 ? 5
      : walletPlayScore >= V8_STAR_THRESHOLDS.p95 ? 4.5
      : walletPlayScore >= V8_STAR_THRESHOLDS.p88 ? 4
      : walletPlayScore >= V8_STAR_THRESHOLDS.p78 ? 3.5
      : walletPlayScore >= V8_STAR_THRESHOLDS.p65 ? 3
      : walletPlayScore >= V8_STAR_THRESHOLDS.p50 ? 2.5
      : walletPlayScore >= V8_STAR_THRESHOLDS.p30 ? 2 : 1;
  }

  const starLabels = { 5: 'ELITE PLAY', 4.5: 'ELITE PLAY', 4: 'STRONG PLAY', 3.5: 'STRONG PLAY', 3: 'SOLID PLAY', 2.5: 'SOLID PLAY', 2: 'LEAN', 1.5: 'DEVELOPING', 1: 'MONITORING' };

  return {
    walletPlayScore: +walletPlayScore.toFixed(4),
    stars,
    label: starLabels[stars] || 'MONITORING',
    forSide: +forSide.toFixed(1),
    againstSide: +againstSide.toFixed(1),
    netEdge: +netEdge.toFixed(4),
    breadthBonus: +breadthBonus.toFixed(4),
    concPenalty: +concPenalty.toFixed(4),
    topShare: +topShare.toFixed(4),
    walletCountFor,
    walletCountAgainst: oppWallets.length,
    consensusSide,
    walletDetails,
  };
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

  // Build V8 normalization from sports_sharps (same as UI)
  const v8Norm = buildV8Normalization(sportsSharps);

  // Phase 1: collect qualifying positions and group by game+market for WPS
  const positions = [];
  const gameMarketGroups = {}; // key → [index into positions]

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
          if (avgBet <= 0) continue;
          if (pos.invested < avgBet * MIN_BET_MULTIPLIER) continue;

          const teamName = pos.side === 'home' || pos.side === 'over'
            ? (pos.side === 'over' ? 'Over' : gd.home)
            : (pos.side === 'under' ? 'Under' : gd.away);
          const mult = avgBet > 0 ? +(pos.invested / avgBet).toFixed(2) : 0;
          const displayRoi = Math.min(pos.sportROI || 0, 999.9);

          // Pinnacle odds + retail EV
          const pinnGame = pinnacleHistory?.[sport]?.[gameKey];
          let pinnOdds = null, bestRetail = null, bestBook = null, evEdge = null;
          let spreadLine = mkt === 'SPREAD' ? (pos.entryLine ?? null) : null;
          let totalLine = mkt === 'TOTAL' ? (pos.entryLine ?? null) : null;
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
              if (spreadLine == null) {
                const sc = pinnGame.spreadCurrent || pinnGame.spreadOpener;
                spreadLine = pos.side === 'away' ? (sc?.awayLine ?? pinnGame.awaySpread) : (sc?.homeLine ?? pinnGame.homeSpread);
              }
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
              if (totalLine == null) {
                const tc = pinnGame.totalCurrent || pinnGame.totalOpener;
                totalLine = tc?.line ?? pinnGame.totalLine ?? null;
              }
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

          const idx = positions.length;
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
            entryLine: pos.entryLine ?? null,
            spreadLine: spreadLine,
            totalLine: totalLine,
            label,
            firstSeen: pos.firstSeen || null,
            // V8 fields — populated in phase 2
            v8_walletPlayScore: null,
            v8_stars: null,
            v8_starLabel: null,
            v8_forSide: null,
            v8_againstSide: null,
            v8_netEdge: null,
            v8_breadthBonus: null,
            v8_concPenalty: null,
            v8_topShare: null,
            v8_walletCountFor: null,
            v8_walletCountAgainst: null,
            v8_consensusSide: null,
            v8_walletContribution: null,
            v8_walletRoiNorm: null,
            v8_walletPnlNorm: null,
            v8_walletRankNorm: null,
            v8_walletBase: null,
            v8_convictionMult: null,
            v8_sizeRatio: null,
            status: 'PENDING',
            result: null,
            gradedAt: null,
            closingPinnacleOdds: null,
            clv: null,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          const gmKey = `${sport}_${gameKey}_${mkt}`;
          if (!gameMarketGroups[gmKey]) gameMarketGroups[gmKey] = [];
          gameMarketGroups[gmKey].push(idx);
        }
      }
    }
  }

  // Phase 2: compute WPS per game+market and stamp each position
  if (v8Norm) {
    for (const [, indices] of Object.entries(gameMarketGroups)) {
      const groupPositions = indices.map(i => positions[i]);
      const wps = computeGameWPS(groupPositions, v8Norm);

      for (const idx of indices) {
        const pos = positions[idx];
        pos.v8_walletPlayScore = wps.walletPlayScore;
        pos.v8_stars = wps.stars;
        pos.v8_starLabel = wps.label;
        pos.v8_forSide = wps.forSide;
        pos.v8_againstSide = wps.againstSide;
        pos.v8_netEdge = wps.netEdge;
        pos.v8_breadthBonus = wps.breadthBonus;
        pos.v8_concPenalty = wps.concPenalty;
        pos.v8_topShare = wps.topShare;
        pos.v8_walletCountFor = wps.walletCountFor;
        pos.v8_walletCountAgainst = wps.walletCountAgainst;
        pos.v8_consensusSide = wps.consensusSide;

        const myDetail = wps.walletDetails.find(d => d.wallet === pos.walletShort && d.side === pos.side);
        if (myDetail) {
          pos.v8_walletContribution = myDetail.contribution;
          pos.v8_walletRoiNorm = myDetail.roiNorm;
          pos.v8_walletPnlNorm = myDetail.pnlNorm;
          pos.v8_walletRankNorm = myDetail.rankNorm;
          pos.v8_walletBase = myDetail.walletBase;
          pos.v8_convictionMult = myDetail.convictionMult;
          pos.v8_sizeRatio = myDetail.sizeRatio;
        }
      }
    }
    console.log(`V8 scoring computed for ${Object.keys(gameMarketGroups).length} game-market groups`);
  } else {
    console.log('WARNING: Could not build V8 normalization (sports_sharps.json may be empty)');
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
        const updatePayload = {
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
          // V8 scoring — always update to latest snapshot
          v8_walletPlayScore: pos.v8_walletPlayScore,
          v8_stars: pos.v8_stars,
          v8_starLabel: pos.v8_starLabel,
          v8_forSide: pos.v8_forSide,
          v8_againstSide: pos.v8_againstSide,
          v8_netEdge: pos.v8_netEdge,
          v8_breadthBonus: pos.v8_breadthBonus,
          v8_concPenalty: pos.v8_concPenalty,
          v8_topShare: pos.v8_topShare,
          v8_walletCountFor: pos.v8_walletCountFor,
          v8_walletCountAgainst: pos.v8_walletCountAgainst,
          v8_consensusSide: pos.v8_consensusSide,
          v8_walletContribution: pos.v8_walletContribution,
          v8_walletRoiNorm: pos.v8_walletRoiNorm,
          v8_walletPnlNorm: pos.v8_walletPnlNorm,
          v8_walletRankNorm: pos.v8_walletRankNorm,
          v8_walletBase: pos.v8_walletBase,
          v8_convictionMult: pos.v8_convictionMult,
          v8_sizeRatio: pos.v8_sizeRatio,
        };
        if (pos.entryLine != null) updatePayload.entryLine = pos.entryLine;
        if (pos.spreadLine != null && !data.spreadLine) updatePayload.spreadLine = pos.spreadLine;
        if (pos.totalLine != null && !data.totalLine) updatePayload.totalLine = pos.totalLine;
        batch.update(ref, updatePayload);
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
