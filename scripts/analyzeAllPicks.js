/**
 * V5 PERFORMANCE MATRIX — MOS × EV Star System Analysis
 * 
 * Clean output: Matrix view for ALL PICKS, ML, ATS UPGRADED, ATS STANDALONE
 * Time periods: ALL TIME, THIS WEEK, YESTERDAY
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

// ═══════════════════════════════════════════════════════════
// V5 SCORING
// ═══════════════════════════════════════════════════════════
function v5Score(mos, ev) {
  const mosPts = mos >= 3 ? 3 : mos >= 2 ? 2 : 0;
  const evPts = (ev >= 3 && ev < 5) ? 2 : (ev >= 5 && ev < 10) ? 1 : 0;
  const score = mosPts + evPts;
  const stars = Math.max(1, Math.min(5, score));
  return { mosPts, evPts, score, stars, units: stars };
}

function mosBucket(mos) {
  if (mos >= 3) return 'MOS 3+';
  if (mos >= 2) return 'MOS 2-3';
  if (mos >= 1.6) return 'MOS 1.6-2';
  return null;
}

function evBucket(ev) {
  if (ev >= 10) return 'EV 10%+';
  if (ev >= 5) return 'EV 5-10%';
  if (ev >= 3) return 'EV 3-5%';
  return null;
}

// ═══════════════════════════════════════════════════════════
// DATE HELPERS
// ═══════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════
// MATRIX PRINTER
// ═══════════════════════════════════════════════════════════
const MOS_ROWS = ['MOS 3+', 'MOS 2-3', 'MOS 1.6-2'];
const EV_COLS = ['EV 3-5%', 'EV 5-10%', 'EV 10%+'];

function buildMatrix(bets) {
  const m = {};
  for (const mr of MOS_ROWS) for (const ec of EV_COLS) m[`${mr}|${ec}`] = [];
  
  for (const b of bets) {
    const mr = mosBucket(b.mos);
    const ec = evBucket(b.ev);
    if (!mr || !ec) continue;
    const key = `${mr}|${ec}`;
    if (m[key]) m[key].push(b);
  }
  return m;
}

function cellStr(bets, stars) {
  if (!bets.length) return '  --                       ';
  const w = bets.filter(b => b.won).length;
  const l = bets.length - w;
  const u = bets.reduce((s, b) => s + b.units, 0);
  const p = bets.reduce((s, b) => s + b.profit, 0);
  const roi = u > 0 ? (p / u * 100) : 0;
  const icon = roi >= 5 ? '🟢' : roi >= 0 ? '🟡' : '🔴';
  return `${icon} ${stars}★ ${w}-${l}`.padEnd(14) + `${p >= 0 ? '+' : ''}${p.toFixed(1)}u ${roi >= 0 ? '+' : ''}${roi.toFixed(1)}%`;
}

function printMatrix(label, bets) {
  if (!bets.length) {
    console.log(`\n  ${label}: No data\n`);
    return;
  }
  
  const matrix = buildMatrix(bets);
  
  // Summary line
  const w = bets.filter(b => b.won).length;
  const l = bets.length - w;
  const u = bets.reduce((s, b) => s + b.units, 0);
  const p = bets.reduce((s, b) => s + b.profit, 0);
  const roi = u > 0 ? (p / u * 100) : 0;
  const roiIcon = roi >= 5 ? '🟢' : roi >= 0 ? '🟡' : '🔴';
  
  console.log(`\n  ┌─ ${label}`);
  console.log(`  │  ${roiIcon} ${w}-${l} (${(w/(w+l)*100).toFixed(1)}%) | ${u.toFixed(0)}u risked | ${p >= 0 ? '+' : ''}${p.toFixed(1)}u | ${roi >= 0 ? '+' : ''}${roi.toFixed(1)}% ROI`);
  console.log(`  │`);
  console.log(`  │  ${''.padEnd(20)}│  EV 3-5% (+2pts)          │  EV 5-10% (+1pt)          │  EV 10%+ (0pts)`);
  console.log(`  │  ${'─'.repeat(20)}┼${'─'.repeat(28)}┼${'─'.repeat(28)}┼${'─'.repeat(28)}`);
  
  for (const mr of MOS_ROWS) {
    const cells = EV_COLS.map(ec => {
      const key = `${mr}|${ec}`;
      const mosPts = mr === 'MOS 3+' ? 3 : mr === 'MOS 2-3' ? 2 : 0;
      const evPts = ec === 'EV 3-5%' ? 2 : ec === 'EV 5-10%' ? 1 : 0;
      const stars = Math.max(1, Math.min(5, mosPts + evPts));
      return cellStr(matrix[key], stars);
    });
    const pts = mr === 'MOS 3+' ? '3pts' : mr === 'MOS 2-3' ? '2pts' : '0pts';
    console.log(`  │  ${(mr + ' (' + pts + ')').padEnd(20)}│  ${cells[0].padEnd(27)}│  ${cells[1].padEnd(27)}│  ${cells[2]}`);
  }
  console.log(`  └${'─'.repeat(110)}`);
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
  console.log('║              V5 PERFORMANCE MATRIX — MOS × EV Star System                     ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝');
  console.log(`\n  Today: ${today} | Yesterday: ${yesterday} | Week start: ${monday}`);
  
  // Fetch all completed bets
  const snap = await getDocs(query(collection(db, 'basketball_bets'), where('status', '==', 'COMPLETED')));
  
  // Also check for alternate status values
  const snap2 = await getDocs(query(collection(db, 'basketball_bets'), where('status', '==', 'COMPLETEd')));
  const snap3 = await getDocs(query(collection(db, 'basketball_bets'), where('status', '==', 'COMPLETE')));
  
  const allBets = [];
  
  const processBet = (docSnap) => {
    const d = docSnap.data();
    const mos = d.spreadAnalysis?.marginOverSpread ?? null;
    const ev = d.prediction?.evPercent ?? null;
    const odds = d.bet?.odds || 0;
    const won = d.result?.outcome === 'WIN';
    const date = d.date || '';
    
    const isATSUpgrade = d.betRecommendation?.type === 'ATS' && d.isPrimePick;
    const isATSStandalone = d.isATSPick && !d.isPrimePick;
    const isML = !isATSUpgrade && !isATSStandalone;
    
    // V5 units (based on composite score)
    const v5 = (mos !== null && ev !== null) ? v5Score(mos, ev) : null;
    const units = v5 ? v5.units : (d.prediction?.unitSize || 1);
    
    // For ATS bets, odds are always -110
    const betOdds = (isATSUpgrade || isATSStandalone) ? -110 : odds;
    const profit = won
      ? (betOdds > 0 ? units * (betOdds / 100) : units * (100 / Math.abs(betOdds)))
      : -units;
    
    allBets.push({
      date, mos: mos || 0, ev: ev || 0, odds: betOdds, won, units, profit,
      isML, isATSUpgrade, isATSStandalone,
      team: d.bet?.pick, id: docSnap.id,
      hasMOS: mos !== null
    });
  };
  
  snap.forEach(processBet);
  snap2.forEach(processBet);
  snap3.forEach(processBet);
  
  console.log(`  Loaded ${allBets.length} completed bets\n`);
  
  // Filter by time period
  const allTime = allBets;
  const thisWeek = allBets.filter(b => b.date >= monday);
  const yest = allBets.filter(b => b.date === yesterday);
  
  // Filter by bet type
  const filterType = (bets, type) => {
    if (type === 'all') return bets;
    if (type === 'ml') return bets.filter(b => b.isML);
    if (type === 'ats_upgrade') return bets.filter(b => b.isATSUpgrade);
    if (type === 'ats_standalone') return bets.filter(b => b.isATSStandalone);
    return bets;
  };
  
  // Only include bets with MOS data for matrix view
  const withMOS = (bets) => bets.filter(b => b.hasMOS);
  
  const betTypes = [
    { key: 'all', label: 'ALL PICKS' },
    { key: 'ml', label: 'ML ONLY' },
    { key: 'ats_upgrade', label: 'ATS UPGRADED' },
    { key: 'ats_standalone', label: 'ATS STANDALONE' },
  ];
  
  const periods = [
    { key: 'allTime', label: 'ALL TIME', bets: allTime },
    { key: 'thisWeek', label: 'THIS WEEK', bets: thisWeek },
    { key: 'yesterday', label: 'YESTERDAY', bets: yest },
  ];
  
  for (const period of periods) {
    console.log('\n' + '═'.repeat(112));
    console.log(`  ${period.label} (${period.bets.length} bets total, ${withMOS(period.bets).length} with MOS data)`);
    console.log('═'.repeat(112));
    
    for (const type of betTypes) {
      const bets = withMOS(filterType(period.bets, type.key));
      printMatrix(`${type.label}`, bets);
    }
  }
  
  // ═══════════════════════════════════════════════════════════
  // DAILY TREND (last 7 days)
  // ═══════════════════════════════════════════════════════════
  console.log('\n' + '═'.repeat(112));
  console.log('  DAILY TREND (Last 7 Days)');
  console.log('═'.repeat(112));
  console.log();
  console.log('  Date          Picks   W-L       Win%     Units    Profit     ROI%');
  console.log('  ' + '─'.repeat(75));
  
  for (let i = 1; i <= 7; i++) {
    const d = getETDate(-i);
    const dayBets = withMOS(allBets.filter(b => b.date === d));
    if (!dayBets.length) continue;
    
    const w = dayBets.filter(b => b.won).length;
    const l = dayBets.length - w;
    const u = dayBets.reduce((s, b) => s + b.units, 0);
    const p = dayBets.reduce((s, b) => s + b.profit, 0);
    const roi = u > 0 ? (p / u * 100) : 0;
    const icon = roi >= 5 ? '🟢' : roi >= 0 ? '🟡' : '🔴';
    
    console.log(`  ${icon} ${d}    ${String(dayBets.length).padEnd(8)}${(w + '-' + l).padEnd(10)}${(w/(w+l)*100).toFixed(1).padStart(5)}%    ${u.toFixed(0).padStart(5)}u    ${(p >= 0 ? '+' : '') + p.toFixed(1) + 'u'}${' '.repeat(Math.max(1, 8 - ((p >= 0 ? '+' : '') + p.toFixed(1) + 'u').length))}${(roi >= 0 ? '+' : '') + roi.toFixed(1)}%`);
  }
  
  console.log('\n' + '═'.repeat(112));
  console.log('  ANALYSIS COMPLETE');
  console.log('═'.repeat(112) + '\n');
  
  process.exit(0);
}

analyze().catch(err => {
  console.error('❌ Analysis failed:', err.message);
  process.exit(1);
});
