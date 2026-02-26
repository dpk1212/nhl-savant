/**
 * CLV (Closing Line Value) Update Script
 * 
 * Supports both MONEYLINE and SPREAD bets:
 *   ML:  Compares original odds to current odds (implied prob shift)
 *   ATS: Compares original spread to current spread (points of value)
 * 
 * Positive CLV = Line moved in our favor = Good bet timing
 * Negative CLV = Line moved against us = Bought at wrong time
 * 
 * Usage: npm run update-clv
 */

import Firecrawl from '@mendable/firecrawl-js';
import admin from 'firebase-admin';
import fs from 'fs/promises';
import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { parseBasketballOdds } from '../src/utils/basketballOddsParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

// Initialize Firebase Admin
const serviceAccount = {
  project_id: process.env.VITE_FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// Initialize Firecrawl
const firecrawl = new Firecrawl({ 
  apiKey: process.env.FIRECRAWL_API_KEY
});

/**
 * Calculate CLV for MONEYLINE bets (implied prob shift)
 */
function calculateMLCLV(originalOdds, currentOdds) {
  const toImplied = (odds) => {
    if (odds > 0) return 100 / (odds + 100);
    return Math.abs(odds) / (Math.abs(odds) + 100);
  };
  
  const originalProb = toImplied(originalOdds);
  const currentProb = toImplied(currentOdds);
  const clv = (currentProb - originalProb) * 100;
  return parseFloat(clv.toFixed(2));
}

/**
 * Calculate CLV for SPREAD bets (points of value)
 * 
 * Positive CLV = spread moved in our favor (we got a better number)
 * Examples:
 *   Bet +5.5, now +4.5 → CLV = -1.0 (BAD, we could've gotten less)
 *   Bet +5.5, now +6.5 → CLV = +1.0 (GOOD, we locked in a better number... wait)
 * 
 * Actually for the bettor: a LARGER positive spread is better for dogs,
 * a SMALLER negative spread is better for favorites.
 *   Dog:  Bet +5.5, now +4.5 → line moved against us = CLV -1.0
 *   Dog:  Bet +5.5, now +6.5 → line moved for us   = CLV +1.0
 *   Fav:  Bet -5.5, now -6.5 → line moved against us = CLV -1.0
 *   Fav:  Bet -5.5, now -4.5 → line moved for us   = CLV +1.0
 */
function calculateSpreadCLV(originalSpread, currentSpread) {
  const clv = currentSpread - originalSpread;
  return parseFloat(clv.toFixed(1));
}

function calculateCLV(originalOdds, currentOdds) {
  return calculateMLCLV(originalOdds, currentOdds);
}

/**
 * Parse spread data from OddsTrader markdown
 */
function parseSpreadData(markdown) {
  const games = [];
  const lines = markdown.split('\n');

  const today = new Date();
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const todayDay = days[today.getDay()];
  const todayDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
  const todayDateAlt = `${today.getMonth() + 1}/${today.getDate()}`;

  let currentGame = null;
  let isToday = false;

  for (const line of lines) {
    const dateMatch = line.match(/(FRI|SAT|SUN|MON|TUE|WED|THU)\s+(\d{1,2}\/\d{1,2})/i);
    if (dateMatch) {
      const dayStr = dateMatch[1].toUpperCase();
      const dateStr = dateMatch[2];
      isToday = dayStr === todayDay && (dateStr === todayDate || dateStr === todayDateAlt);
    }

    if (line.includes('|') && line.includes('<br>')) {
      const teamMatch = line.match(/\.(?:png|PNG)\?d=100x100\)<br>([^<]+)<br>(\d{1,2}-\d{1,2})/);
      if (!teamMatch) continue;

      let teamName = teamMatch[1].trim().replace(/^#\d+/, '').trim();

      const spreadPatterns = line.match(/([+-]?\d+½?)\s+-?\d{3}/g);
      let spread = null;

      if (spreadPatterns && spreadPatterns.length > 0) {
        const spreadStr = spreadPatterns[0].split(/\s/)[0];
        spread = parseFloat(spreadStr.replace('½', '.5'));
      } else if (line.includes('PK')) {
        spread = 0;
      }

      if (!currentGame) {
        currentGame = { awayTeam: teamName, homeTeam: null, awaySpread: spread, homeSpread: null, isToday };
      } else if (!currentGame.homeTeam) {
        currentGame.homeTeam = teamName;
        currentGame.homeSpread = spread;
        if (currentGame.isToday && currentGame.awayTeam && currentGame.homeTeam) {
          games.push(currentGame);
        }
        currentGame = null;
      }
    }
  }

  return games;
}

/**
 * Determine line movement direction based on CLV
 * STEAM = Line moved IN our favor (positive CLV) - green
 * FADE = Line moved AGAINST us (negative CLV) - red/amber
 */
function getLineMovement(clv) {
  if (clv === 0) return 'UNCHANGED';
  return clv > 0 ? 'STEAM' : 'FADE';
}

/**
 * Get CLV tier based on value
 * Positive CLV = GOOD (green shades) - we got in before the line moved our way
 * Negative CLV = BAD (red/amber shades) - line moved against us
 */
function getCLVTier(clv) {
  if (clv >= 5) return { tier: 'ELITE', emoji: '🔥', label: 'Elite CLV' };
  if (clv >= 3) return { tier: 'GREAT', emoji: '💪', label: 'Great CLV' };
  if (clv >= 1) return { tier: 'GOOD', emoji: '✅', label: 'Good CLV' };
  if (clv > -0.5) return { tier: 'NEUTRAL', emoji: '➖', label: 'Neutral' };
  if (clv >= -2) return { tier: 'SLIGHT_FADE', emoji: '📉', label: 'Slight Fade' };
  return { tier: 'FADE', emoji: '🔴', label: 'Faded' };
}

/**
 * Main CLV update function
 */
async function updateCLV() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║           📈 CLV (CLOSING LINE VALUE) UPDATE 📈                               ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝');
  console.log('\n');

  try {
    const cacheBuster = Date.now();
    
    // 1a. Fetch current moneyline odds
    console.log('📊 Step 1a: Fetching current moneyline odds...');
    const oddsResult = await firecrawl.scrape(
      `https://www.oddstrader.com/ncaa-college-basketball/?eid=0&g=game&m=money&_=${cacheBuster}`,
      {
        formats: ['markdown'],
        onlyMainContent: true,
        waitFor: 3000,
        timeout: 300000,
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
      }
    );
    await fs.writeFile(join(__dirname, '../public/basketball_odds_clv.md'), oddsResult.markdown, 'utf8');
    console.log('   ✅ Moneyline odds fetched\n');
    
    // 1b. Fetch current spread odds
    console.log('📊 Step 1b: Fetching current spread lines...');
    const spreadResult = await firecrawl.scrape(
      `https://www.oddstrader.com/ncaa-college-basketball/?eid=0&g=game&m=spread&_=${cacheBuster}`,
      {
        formats: ['markdown'],
        onlyMainContent: true,
        waitFor: 3000,
        timeout: 300000,
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
      }
    );
    await fs.writeFile(join(__dirname, '../public/basketball_spreads_clv.md'), spreadResult.markdown, 'utf8');
    console.log('   ✅ Spread lines fetched\n');
    
    // 2. Parse both
    console.log('📋 Step 2: Parsing current odds and spreads...');
    const currentGames = parseBasketballOdds(oddsResult.markdown);
    const currentSpreads = parseSpreadData(spreadResult.markdown);
    console.log(`   ✅ Found ${currentGames.length} ML games, ${currentSpreads.length} spread games\n`);
    
    // 3. Get pending bets from Firebase
    console.log('🔥 Step 3: Fetching pending bets from Firebase...');
    const pendingBetsSnapshot = await db.collection('basketball_bets')
      .where('status', '==', 'PENDING')
      .get();
    
    const pendingBets = pendingBetsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`   ✅ Found ${pendingBets.length} pending bets\n`);
    
    if (pendingBets.length === 0) {
      console.log('⏭️  No pending bets to update CLV for. Exiting.\n');
      return;
    }
    
    // 4. Match and calculate CLV
    console.log('📈 Step 4: Calculating CLV for each bet...\n');
    console.log('┌─────────────────────────────────────────────────────────────────────────────────┐');
    console.log('│ GAME                              │ ORIGINAL │ CURRENT  │   CLV   │ MOVEMENT   │');
    console.log('├─────────────────────────────────────────────────────────────────────────────────┤');
    
    const batch = db.batch();
    let updatedCount = 0;
    let matchedCount = 0;
    
    const nameMatch = (a, b) => {
      const na = String(a || '').toLowerCase().replace(/[^a-z]/g, '');
      const nb = String(b || '').toLowerCase().replace(/[^a-z]/g, '');
      return na === nb || na.includes(nb) || nb.includes(na);
    };

    for (const bet of pendingBets) {
      const betTeam = bet.bet?.team || bet.bet?.pick || '';
      const awayTeam = String(bet.game?.awayTeam || bet.awayTeam || '');
      const homeTeam = String(bet.game?.homeTeam || bet.homeTeam || '');
      
      if (!betTeam || !awayTeam || !homeTeam) continue;
      
      const isSpreadBet = bet.bet?.market === 'SPREAD' || bet.isATSPick;
      const betTeamStr = String(betTeam);
      const isAwayBet = nameMatch(betTeamStr, awayTeam);
      
      if (isSpreadBet) {
        // ── SPREAD CLV ──
        const originalSpread = bet.spreadAnalysis?.spread ?? bet.bet?.spread ?? bet.betRecommendation?.atsSpread;
        if (originalSpread == null) continue;
        
        const matchedSpread = currentSpreads.find(sg =>
          nameMatch(awayTeam, sg.awayTeam) && nameMatch(homeTeam, sg.homeTeam)
        );
        if (!matchedSpread) continue;
        
        matchedCount++;
        const currentSpread = isAwayBet ? matchedSpread.awaySpread : matchedSpread.homeSpread;
        if (currentSpread == null) continue;
        
        const clv = calculateSpreadCLV(originalSpread, currentSpread);
        const movement = getLineMovement(clv);
        const tierInfo = getCLVTier(clv);
        
        const gameDisplay = `${awayTeam.substring(0, 15)} @ ${homeTeam.substring(0, 15)}`.padEnd(35);
        const origDisp = (originalSpread > 0 ? '+' : '') + originalSpread;
        const currDisp = (currentSpread > 0 ? '+' : '') + currentSpread;
        const clvDisp = (clv >= 0 ? '+' : '') + clv.toFixed(1) + ' pts';
        
        console.log(`│ ${gameDisplay} │ ${origDisp.padStart(8)} │ ${currDisp.padStart(8)} │ ${clvDisp.padStart(7)} │ ${tierInfo.emoji} ${movement.padEnd(7)} │ ATS`);
        
        const betRef = db.collection('basketball_bets').doc(bet.id);
        batch.update(betRef, {
          clv: {
            value: clv,
            originalSpread: originalSpread,
            currentSpread: currentSpread,
            originalOdds: bet.bet?.odds || -110,
            currentOdds: -110,
            movement: movement,
            tier: tierInfo.tier,
            market: 'SPREAD',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          }
        });
        updatedCount++;
        
      } else {
        // ── MONEYLINE CLV ──
        const originalOdds = bet.bet?.odds;
        if (!originalOdds) continue;
        
        const matchedGame = currentGames.find(game =>
          nameMatch(awayTeam, game.awayTeam) && nameMatch(homeTeam, game.homeTeam)
        );
        if (!matchedGame) continue;
        
        matchedCount++;
        const currentOdds = isAwayBet ? matchedGame.awayOdds : matchedGame.homeOdds;
        if (!currentOdds) continue;
        
        const clv = calculateMLCLV(originalOdds, currentOdds);
        const movement = getLineMovement(clv);
        const tierInfo = getCLVTier(clv);
        
        const gameDisplay = `${awayTeam.substring(0, 15)} @ ${homeTeam.substring(0, 15)}`.padEnd(35);
        const origDisp = (originalOdds > 0 ? '+' : '') + originalOdds;
        const currDisp = (currentOdds > 0 ? '+' : '') + currentOdds;
        const clvDisp = (clv >= 0 ? '+' : '') + clv.toFixed(1) + '%';
        
        console.log(`│ ${gameDisplay} │ ${origDisp.padStart(8)} │ ${currDisp.padStart(8)} │ ${clvDisp.padStart(7)} │ ${tierInfo.emoji} ${movement.padEnd(7)} │ ML`);
        
        const betRef = db.collection('basketball_bets').doc(bet.id);
        batch.update(betRef, {
          clv: {
            value: clv,
            originalOdds: originalOdds,
            currentOdds: currentOdds,
            movement: movement,
            tier: tierInfo.tier,
            market: 'MONEYLINE',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          }
        });
        updatedCount++;
      }
    }
    
    console.log('└─────────────────────────────────────────────────────────────────────────────────┘\n');
    
    // Commit batch
    if (updatedCount > 0) {
      await batch.commit();
      console.log(`✅ Updated CLV for ${updatedCount} bets in Firebase\n`);
    }
    
    // Summary
    console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                              CLV SUMMARY                                      ║');
    console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');
    
    console.log(`   📊 Pending bets checked: ${pendingBets.length}`);
    console.log(`   🎯 Games matched: ${matchedCount}`);
    console.log(`   ✅ CLV updated: ${updatedCount}`);
    console.log(`   ⏱️  Updated at: ${new Date().toLocaleString()}\n`);
    
    return { updatedCount, matchedCount };
    
  } catch (error) {
    console.error('❌ Error updating CLV:', error);
    throw error;
  }
}

// Run if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  updateCLV()
    .then(() => {
      console.log('🎉 CLV update complete!\n');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 CLV update failed:', error);
      process.exit(1);
    });
}

export { updateCLV, calculateCLV, getCLVTier };
