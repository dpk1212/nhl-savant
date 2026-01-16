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
import { loadTeamMappings, findTeamMapping } from '../src/utils/teamCSVLoader.js';

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
 * Returns percentage value (positive = line moved in our favor)
 */
function calculateCLV(originalOdds, currentOdds, betSide) {
  // Convert American odds to implied probability
  const toImplied = (odds) => {
    if (odds > 0) return 100 / (odds + 100);
    return Math.abs(odds) / (Math.abs(odds) + 100);
  };
  
  const originalProb = toImplied(originalOdds);
  const currentProb = toImplied(currentOdds);
  
  // CLV = current implied prob - original implied prob
  // If we bet underdog and line moved toward them = positive CLV
  // If we bet favorite and line moved toward them = positive CLV
  const clv = (originalProb - currentProb) * 100;
  
  return parseFloat(clv.toFixed(2));
}

/**
 * Determine line movement direction
 */
function getLineMovement(originalOdds, currentOdds) {
  if (currentOdds === originalOdds) return 'UNCHANGED';
  
  // For positive odds (underdogs): lower number = line moved toward us
  // For negative odds (favorites): higher number (less negative) = line moved toward us
  
  const originalAbsValue = originalOdds > 0 ? originalOdds : -originalOdds;
  const currentAbsValue = currentOdds > 0 ? currentOdds : -currentOdds;
  
  // Check if we were underdog or favorite
  const wasUnderdog = originalOdds > 0;
  
  if (wasUnderdog) {
    // Underdog: line moving from +200 to +150 = moved in our favor
    return currentOdds < originalOdds ? 'STEAM' : 'FADE';
  } else {
    // Favorite: line moving from -150 to -180 = moved in our favor
    return currentOdds < originalOdds ? 'STEAM' : 'FADE';
  }
}

/**
 * Get CLV tier based on value
 */
function getCLVTier(clv) {
  if (clv >= 5) return { tier: 'ELITE', emoji: '🔥', label: 'Elite CLV' };
  if (clv >= 3) return { tier: 'GREAT', emoji: '💪', label: 'Great CLV' };
  if (clv >= 1) return { tier: 'GOOD', emoji: '✅', label: 'Good CLV' };
  if (clv >= 0) return { tier: 'NEUTRAL', emoji: '➖', label: 'Neutral' };
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
    
    // 3. Load team mappings
    console.log('🗺️  Step 3: Loading team mappings...');
    const csvPath = join(__dirname, '../public/team_mapping.csv');
    const csvContent = await fs.readFile(csvPath, 'utf8');
    const teamMappings = loadTeamMappings(csvContent);
    console.log(`   ✅ Loaded ${teamMappings.size} team mappings\n`);
    
    // 4. Get pending bets from Firebase
    console.log('🔥 Step 4: Fetching pending bets from Firebase...');
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
    
    // 5. Match and calculate CLV
    console.log('📈 Step 5: Calculating CLV for each bet...\n');
    console.log('┌─────────────────────────────────────────────────────────────────────────────────┐');
    console.log('│ GAME                              │ ORIGINAL │ CURRENT  │   CLV   │ MOVEMENT   │');
    console.log('├─────────────────────────────────────────────────────────────────────────────────┤');
    
    const batch = db.batch();
    let updatedCount = 0;
    let matchedCount = 0;
    
    for (const bet of pendingBets) {
      const betTeam = bet.bet?.team || bet.bet?.pick;
      const originalOdds = bet.bet?.odds;
      const awayTeam = bet.game?.awayTeam || bet.awayTeam;
      const homeTeam = bet.game?.homeTeam || bet.homeTeam;
      
      if (!betTeam || !originalOdds) {
        continue;
      }
      
      // Find matching current game
      const matchedGame = currentGames.find(game => {
        // Try direct match first
        if (game.awayTeam === awayTeam && game.homeTeam === homeTeam) return true;
        if (game.awayTeam.includes(awayTeam) || awayTeam.includes(game.awayTeam)) {
          if (game.homeTeam.includes(homeTeam) || homeTeam.includes(game.homeTeam)) return true;
        }
        return false;
      });
      
      if (!matchedGame) {
        // Try with normalized names
        const normalizedAway = findTeamMapping(awayTeam, teamMappings);
        const normalizedHome = findTeamMapping(homeTeam, teamMappings);
        
        // Skip if no match found
        continue;
      }
      
      matchedCount++;
      
      // Determine which side we bet (away or home)
      const isAwayBet = betTeam === awayTeam || 
                        awayTeam?.includes(betTeam) || 
                        betTeam?.includes(awayTeam);
      
      const currentOdds = isAwayBet ? matchedGame.awayOdds : matchedGame.homeOdds;
      
      if (!currentOdds) continue;
      
      // Calculate CLV
      const clv = calculateCLV(originalOdds, currentOdds, isAwayBet ? 'away' : 'home');
      const movement = getLineMovement(originalOdds, currentOdds);
      const tierInfo = getCLVTier(clv);
      
      // Display result
      const gameDisplay = `${awayTeam?.substring(0, 15)} @ ${homeTeam?.substring(0, 15)}`.padEnd(35);
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
