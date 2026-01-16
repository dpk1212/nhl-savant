/**
 * 📈 CLV (Closing Line Value) Update Script
 * 
 * Fetches current odds from OddsTrader, compares to stored bet odds,
 * calculates CLV, and stores in Firebase for analysis.
 * 
 * CLV = How much the line moved in our favor (or against us)
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

// No longer using teamCSVLoader - matching by name directly

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
 * Calculate CLV from original and current odds
 * 
 * CORRECT LOGIC:
 * - Positive CLV = Current implied prob > Original implied prob
 *   = More people now betting our side = We got VALUE before the move
 * 
 * Examples:
 * - Bet +285, now +250: implied went 26% → 28.6% = +2.6% CLV (GOOD! Got in early)
 * - Bet +285, now +300: implied went 26% → 25% = -1.0% CLV (BAD! Could've waited)
 * - Bet -150, now -180: implied went 60% → 64.3% = +4.3% CLV (GOOD! Line moved our way)
 * - Bet -190, now -190: implied same = 0% CLV (NEUTRAL)
 */
function calculateCLV(originalOdds, currentOdds) {
  // Convert American odds to implied probability
  const toImplied = (odds) => {
    if (odds > 0) return 100 / (odds + 100);
    return Math.abs(odds) / (Math.abs(odds) + 100);
  };
  
  const originalProb = toImplied(originalOdds);
  const currentProb = toImplied(currentOdds);
  
  // If currentProb > originalProb, more money is now on our side = POSITIVE CLV
  // We captured value BEFORE the line moved toward us
  const clv = (currentProb - originalProb) * 100;
  
  return parseFloat(clv.toFixed(2));
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
    // 1. Fetch current odds from OddsTrader
    console.log('📊 Step 1: Fetching current odds from OddsTrader...');
    console.log('   ⏳ This may take a minute...\n');
    
    const cacheBuster = Date.now();
    const oddsResult = await firecrawl.scrape(
      `https://www.oddstrader.com/ncaa-college-basketball/?eid=0&g=game&m=money&_=${cacheBuster}`,
      {
        formats: ['markdown'],
        onlyMainContent: true,
        waitFor: 3000,
        timeout: 300000,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      }
    );
    
    // Save for reference
    await fs.writeFile(
      join(__dirname, '../public/basketball_odds_clv.md'),
      oddsResult.markdown,
      'utf8'
    );
    
    console.log('   ✅ Current odds fetched successfully\n');
    
    // 2. Parse current odds
    console.log('📋 Step 2: Parsing current odds...');
    const currentGames = parseBasketballOdds(oddsResult.markdown);
    console.log(`   ✅ Found ${currentGames.length} games with current odds\n`);
    
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
    
    for (const bet of pendingBets) {
      const betTeam = bet.bet?.team || bet.bet?.pick || '';
      const originalOdds = bet.bet?.odds;
      const awayTeam = String(bet.game?.awayTeam || bet.awayTeam || '');
      const homeTeam = String(bet.game?.homeTeam || bet.homeTeam || '');
      
      if (!betTeam || !originalOdds || !awayTeam || !homeTeam) {
        continue;
      }
      
      // Find matching current game
      let matchedGame = currentGames.find(game => {
        const gameAway = String(game.awayTeam || '');
        const gameHome = String(game.homeTeam || '');
        
        // Try direct match first
        if (gameAway === awayTeam && gameHome === homeTeam) return true;
        
        // Try partial match
        if (gameAway && awayTeam && gameHome && homeTeam) {
          if ((gameAway.includes(awayTeam) || awayTeam.includes(gameAway)) &&
              (gameHome.includes(homeTeam) || homeTeam.includes(gameHome))) {
            return true;
          }
        }
        return false;
      });
      
      if (!matchedGame) {
        // Skip if no match found - game might not be today
        continue;
      }
      
      matchedCount++;
      
      // Determine which side we bet (away or home)
      const betTeamStr = String(betTeam);
      const isAwayBet = betTeamStr === awayTeam || 
                        awayTeam.includes(betTeamStr) || 
                        betTeamStr.includes(awayTeam);
      
      const currentOdds = isAwayBet ? matchedGame.awayOdds : matchedGame.homeOdds;
      
      if (!currentOdds) continue;
      
      // Calculate CLV
      const clv = calculateCLV(originalOdds, currentOdds);
      const movement = getLineMovement(clv);
      const tierInfo = getCLVTier(clv);
      
      // Display result
      const gameDisplay = `${awayTeam.substring(0, 15)} @ ${homeTeam.substring(0, 15)}`.padEnd(35);
      const originalDisplay = (originalOdds > 0 ? '+' : '') + originalOdds;
      const currentDisplay = (currentOdds > 0 ? '+' : '') + currentOdds;
      const clvDisplay = (clv >= 0 ? '+' : '') + clv.toFixed(1) + '%';
      
      console.log(`│ ${gameDisplay} │ ${originalDisplay.padStart(8)} │ ${currentDisplay.padStart(8)} │ ${clvDisplay.padStart(7)} │ ${tierInfo.emoji} ${movement.padEnd(7)} │`);
      
      // Update Firebase
      const betRef = db.collection('basketball_bets').doc(bet.id);
      batch.update(betRef, {
        clv: {
          value: clv,
          originalOdds: originalOdds,
          currentOdds: currentOdds,
          movement: movement,
          tier: tierInfo.tier,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }
      });
      
      updatedCount++;
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
