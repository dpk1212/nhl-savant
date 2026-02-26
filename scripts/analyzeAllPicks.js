/**
 * V6 PERFORMANCE ANALYSIS — MOS-Primary System
 * 
 * 5-tier MOS breakdown matching the new unit sizing:
 *   MAXIMUM (5u): MOS 4+
 *   ELITE   (4u): MOS 3-4
 *   STRONG  (3u): MOS 2.5-3
 *   SOLID   (2u): MOS 2.25-2.5
 *   BASE    (1u): MOS 2-2.25
 *
 * Includes fav/dog split and bothCover split for each tier.
 */

import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
});

const db = getFirestore(app);

// V6 unit sizing
function v6Units(mos) {
  if (mos >= 4)    return 5;
  if (mos >= 3)    return 4;
  if (mos >= 2.5)  return 3;
  if (mos >= 2.25) return 2;
  if (mos >= 2)    return 1;
  return 0;
}

function v6Tier(mos) {
  if (mos >= 4)    return 'MAXIMUM';
  if (mos >= 3)    return 'ELITE';
  if (mos >= 2.5)  return 'STRONG';
  if (mos >= 2.25) return 'SOLID';
  if (mos >= 2)    return 'BASE';
  return null;
}

function getETDate(offset = 0) {
  const now = new Date();
  const et = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  et.setDate(et.getDate() + offset);
  return `${et.getFullYear()}-${String(et.getMonth() + 1).padStart(2, '0')}-${String(et.getDate()).padStart(2, '0')}`;
}

function getMonday() {
  const now = new Date();
  const et = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const day = et.getDay();
  const diff = et.getDate() - day + (day === 0 ? -6 : 1);
  et.setDate(diff);
  return `${et.getFullYear()}-${String(et.getMonth() + 1).padStart(2, '0')}-${String(et.getDate()).padStart(2, '0')}`;
}

function calcStats(bets) {
  if (!bets.length) return null;
  const w = bets.filter(b => b.won).length;
  const l = bets.length - w;
  const u = bets.reduce((s, b) => s + b.units, 0);
  const p = bets.reduce((s, b) => s + b.profit, 0);
  const roi = u > 0 ? (p / u * 100) : 0;
  return { w, l, pct: w / (w + l) * 100, units: u, profit: p, roi };
}

function fmtRow(label, stats) {
  if (!stats) {
    console.log(`  ${label.padEnd(28)}│   --`);
    return;
  }
  const icon = stats.roi >= 5 ? '🟢' : stats.roi >= 0 ? '🟡' : '🔴';
  const record = `${stats.w}-${stats.l}`;
  console.log(`  ${icon} ${label.padEnd(26)}│ ${String(stats.w + stats.l).padStart(4)} │ ${record.padStart(7)} │ ${stats.pct.toFixed(1).padStart(5)}% │ ${stats.units.toFixed(0).padStart(5)}u │ ${(stats.profit >= 0 ? '+' : '') + stats.profit.toFixed(1) + 'u'}${' '.repeat(Math.max(1, 8 - ((stats.profit >= 0 ? '+' : '') + stats.profit.toFixed(1) + 'u').length))}│ ${(stats.roi >= 0 ? '+' : '') + stats.roi.toFixed(1)}%`);
}

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════
async function analyze() {
  const today = getETDate(0);
  const yesterday = getETDate(-1);
  const monday = getMonday();
  
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║              V6 PERFORMANCE ANALYSIS — MOS-Primary System                     ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝');
  console.log(`\n  Today: ${today} | Yesterday: ${yesterday} | Week start: ${monday}`);
  
  const snap = await getDocs(query(collection(db, 'basketball_bets'), where('status', '==', 'COMPLETED')));
  const snap2 = await getDocs(query(collection(db, 'basketball_bets'), where('status', '==', 'COMPLETEd')));
  const snap3 = await getDocs(query(collection(db, 'basketball_bets'), where('status', '==', 'COMPLETE')));
  
  const allBets = [];
  
  const processBet = (docSnap) => {
    const d = docSnap.data();
    const mos = d.spreadAnalysis?.marginOverSpread ?? null;
    const won = d.result?.outcome === 'WIN';
    const date = d.date || '';
    const spread = d.spreadAnalysis?.spread ?? d.bet?.spread ?? null;
    const isFavorite = d.spreadAnalysis?.isFavorite ?? (spread !== null ? spread < 0 : null);
    const bothCover = d.spreadAnalysis?.bothModelsCover ?? false;
    
    // Use V6 unit sizing for all bets with MOS data
    const units = (mos !== null) ? Math.max(1, v6Units(mos)) : (d.prediction?.unitSize || 1);
    
    // All V6 picks are ATS at -110; for legacy ML picks use stored odds
    const isATS = d.bet?.market === 'SPREAD' || d.isATSPick || d.betRecommendation?.type === 'ATS';
    const betOdds = isATS ? -110 : (d.bet?.odds || 0);
    const profit = won
      ? (betOdds > 0 ? units * (betOdds / 100) : units * (100 / Math.abs(betOdds)))
      : -units;
    
    allBets.push({
      date, mos: mos || 0, won, units, profit,
      isFavorite, bothCover, isATS,
      team: d.bet?.pick, id: docSnap.id,
      hasMOS: mos !== null,
      tier: mos !== null ? v6Tier(mos) : null,
    });
  };
  
  snap.forEach(processBet);
  snap2.forEach(processBet);
  snap3.forEach(processBet);
  
  console.log(`  Loaded ${allBets.length} completed bets\n`);
  
  const withMOS = (bets) => bets.filter(b => b.hasMOS);
  
  const allTime = allBets;
  const thisWeek = allBets.filter(b => b.date >= monday);
  const yest = allBets.filter(b => b.date === yesterday);
  
  const periods = [
    { label: 'ALL TIME', bets: allTime },
    { label: 'THIS WEEK', bets: thisWeek },
    { label: 'YESTERDAY', bets: yest },
  ];
  
  const MOS_TIERS = [
    { name: 'MAXIMUM (5u)', label: 'MOS 4+',      filter: b => b.mos >= 4 },
    { name: 'ELITE (4u)',   label: 'MOS 3-4',      filter: b => b.mos >= 3 && b.mos < 4 },
    { name: 'STRONG (3u)',  label: 'MOS 2.5-3',    filter: b => b.mos >= 2.5 && b.mos < 3 },
    { name: 'SOLID (2u)',   label: 'MOS 2.25-2.5', filter: b => b.mos >= 2.25 && b.mos < 2.5 },
    { name: 'BASE (1u)',    label: 'MOS 2-2.25',   filter: b => b.mos >= 2 && b.mos < 2.25 },
  ];
  
  const CUMULATIVE_TIERS = [
    { label: 'MOS 4+',   filter: b => b.mos >= 4 },
    { label: 'MOS 3+',   filter: b => b.mos >= 3 },
    { label: 'MOS 2.5+', filter: b => b.mos >= 2.5 },
    { label: 'MOS 2+',   filter: b => b.mos >= 2 },
    { label: 'MOS 1.5+', filter: b => b.mos >= 1.5 },
    { label: 'ALL',       filter: () => true },
  ];
  
  for (const period of periods) {
    const bets = withMOS(period.bets);
    
    console.log('\n' + '═'.repeat(100));
    console.log(`  ${period.label} (${period.bets.length} total, ${bets.length} with MOS data)`);
    console.log('═'.repeat(100));
    
    if (!bets.length) {
      console.log('  No data\n');
      continue;
    }
    
    // Overall
    const overall = calcStats(bets);
    console.log(`\n  OVERALL: ${overall.w}-${overall.l} (${overall.pct.toFixed(1)}%) | ${overall.units.toFixed(0)}u risked | ${overall.profit >= 0 ? '+' : ''}${overall.profit.toFixed(1)}u | ${overall.roi >= 0 ? '+' : ''}${overall.roi.toFixed(1)}% ROI\n`);
    
    // ── MOS TIER BREAKDOWN ──
    console.log('  ─── MOS TIER BREAKDOWN ──────────────────────────────────────────────────────');
    console.log('  Tier                        │ Bets │  Record │ Cover% │ Units │ Profit  │ ROI');
    console.log('  ' + '─'.repeat(96));
    
    for (const tier of MOS_TIERS) {
      const tierBets = bets.filter(tier.filter);
      fmtRow(`${tier.name} ${tier.label}`, calcStats(tierBets));
    }
    
    // Sub-floor tiers for historical context
    const below2 = bets.filter(b => b.mos >= 1.5 && b.mos < 2);
    const below15 = bets.filter(b => b.mos >= 1 && b.mos < 1.5);
    const below1 = bets.filter(b => b.mos < 1);
    if (below2.length) fmtRow('(below floor) MOS 1.5-2', calcStats(below2));
    if (below15.length) fmtRow('(below floor) MOS 1-1.5', calcStats(below15));
    if (below1.length) fmtRow('(below floor) MOS <1', calcStats(below1));
    
    // ── CUMULATIVE THRESHOLDS ──
    console.log('\n  ─── CUMULATIVE THRESHOLDS ────────────────────────────────────────────────────');
    console.log('  Threshold                   │ Bets │  Record │ Cover% │ Units │ Profit  │ ROI');
    console.log('  ' + '─'.repeat(96));
    
    for (const tier of CUMULATIVE_TIERS) {
      fmtRow(tier.label, calcStats(bets.filter(tier.filter)));
    }
    
    // ── FAV / DOG SPLIT ──
    console.log('\n  ─── FAVORITE vs UNDERDOG ─────────────────────────────────────────────────────');
    console.log('  Segment                     │ Bets │  Record │ Cover% │ Units │ Profit  │ ROI');
    console.log('  ' + '─'.repeat(96));
    
    const favs = bets.filter(b => b.isFavorite === true);
    const dogs = bets.filter(b => b.isFavorite === false);
    const unknown = bets.filter(b => b.isFavorite === null);
    
    fmtRow('ALL FAVORITES', calcStats(favs));
    fmtRow('ALL UNDERDOGS', calcStats(dogs));
    if (unknown.length) fmtRow('UNKNOWN', calcStats(unknown));
    
    // Fav/Dog within qualifying tiers
    const qualifying = bets.filter(b => b.mos >= 2);
    const qualFavs = qualifying.filter(b => b.isFavorite === true);
    const qualDogs = qualifying.filter(b => b.isFavorite === false);
    
    console.log('  ' + '─'.repeat(96));
    fmtRow('MOS 2+ FAVORITES', calcStats(qualFavs));
    fmtRow('MOS 2+ UNDERDOGS', calcStats(qualDogs));
    
    // ── BOTH COVER SPLIT ──
    console.log('\n  ─── BOTH MODELS COVER vs SINGLE ─────────────────────────────────────────────');
    console.log('  Segment                     │ Bets │  Record │ Cover% │ Units │ Profit  │ ROI');
    console.log('  ' + '─'.repeat(96));
    
    const both = bets.filter(b => b.bothCover && b.mos >= 2);
    const single = bets.filter(b => !b.bothCover && b.mos >= 2);
    
    fmtRow('MOS 2+ & Both Cover', calcStats(both));
    fmtRow('MOS 2+ & Single Cover', calcStats(single));
  }
  
  // ═══════════════════════════════════════════════════════════
  // DAILY TREND (last 7 days)
  // ═══════════════════════════════════════════════════════════
  console.log('\n' + '═'.repeat(100));
  console.log('  DAILY TREND (Last 7 Days)');
  console.log('═'.repeat(100));
  console.log();
  console.log('  Date          Picks   W-L       Cover%   Units    Profit     ROI%');
  console.log('  ' + '─'.repeat(75));
  
  for (let i = 1; i <= 7; i++) {
    const d = getETDate(-i);
    const dayBets = withMOS(allBets.filter(b => b.date === d));
    if (!dayBets.length) continue;
    
    const s = calcStats(dayBets);
    const icon = s.roi >= 5 ? '🟢' : s.roi >= 0 ? '🟡' : '🔴';
    const record = `${s.w}-${s.l}`;
    
    console.log(`  ${icon} ${d}    ${String(dayBets.length).padEnd(8)}${record.padEnd(10)}${s.pct.toFixed(1).padStart(5)}%    ${s.units.toFixed(0).padStart(5)}u    ${(s.profit >= 0 ? '+' : '') + s.profit.toFixed(1) + 'u'}${' '.repeat(Math.max(1, 8 - ((s.profit >= 0 ? '+' : '') + s.profit.toFixed(1) + 'u').length))}${(s.roi >= 0 ? '+' : '') + s.roi.toFixed(1)}%`);
  }
  
  console.log('\n' + '═'.repeat(100));
  console.log('  ANALYSIS COMPLETE');
  console.log('═'.repeat(100) + '\n');
  
  process.exit(0);
}

analyze().catch(err => {
  console.error('Analysis failed:', err.message);
  process.exit(1);
});
