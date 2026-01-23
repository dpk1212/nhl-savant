/**
 * Spread-Based Moneyline Opportunity Finder
 * 
 * Strategy: Find games where BOTH models predict:
 * 1. Team COVERS the spread (predicted margin > spread)
 * 2. Team WINS the game (models aligned)
 * 
 * If both conditions are met, write MONEYLINE bet for that team.
 * This filters for high-conviction picks where models agree on both winner AND margin.
 * 
 * Usage: npm run find-spread-opportunities
 */

import Firecrawl from '@mendable/firecrawl-js';
import fs from 'fs/promises';
import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { parseHaslametrics } from '../src/utils/haslametricsParser.js';
import { parseDRatings } from '../src/utils/dratingsParser.js';
import { matchGamesWithCSV } from '../src/utils/gameMatchingCSV.js';
import { parseBarttorvik } from '../src/utils/barttorvik Parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

const firecrawl = new Firecrawl({ 
  apiKey: process.env.FIRECRAWL_API_KEY
});

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('🏀 SPREAD-BASED MONEYLINE OPPORTUNITY FINDER');
console.log('=============================================\n');

/**
 * Parse spread data from OddsTrader markdown
 * Format: Table rows with team info and spreads like "-6 -108" or "+6½ -117"
 */
function parseSpreadData(markdown) {
  const games = [];
  const lines = markdown.split('\n');
  
  // Today's date info
  const today = new Date();
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const todayDay = days[today.getDay()];
  const todayDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
  const todayDateAlt = `${today.getMonth() + 1}/${today.getDate()}`;
  
  let currentGame = null;
  let isToday = false;
  
  for (const line of lines) {
    // Check for date pattern in table row (FRI 01/23)
    const dateMatch = line.match(/(FRI|SAT|SUN|MON|TUE|WED|THU)\s+(\d{1,2}\/\d{1,2})/i);
    if (dateMatch) {
      const dayStr = dateMatch[1].toUpperCase();
      const dateStr = dateMatch[2];
      isToday = dayStr === todayDay && (dateStr === todayDate || dateStr === todayDateAlt);
    }
    
    // Look for table rows with team data
    // Format: | ...team info...<br>TeamName<br>Record<br>...spread info... |
    if (line.includes('|') && line.includes('<br>')) {
      // Extract team name - look for pattern after logo: TeamName<br>Record
      const teamMatch = line.match(/<br>([A-Za-z\s\-\.&'#\d]+?)<br>(\d{1,2}-\d{1,2})/);
      if (!teamMatch) continue;
      
      let teamName = teamMatch[1].trim();
      // Remove ranking prefix like "#22"
      teamName = teamName.replace(/^#\d+/, '').trim();
      
      // Extract spread from the line - look for patterns like "-6 -108" or "+6½ -117" or "PK"
      // The spread is usually the first number after the record
      const spreadPatterns = line.match(/([+-]?\d+½?)\s+-?\d{3}/g);
      let spread = null;
      
      if (spreadPatterns && spreadPatterns.length > 0) {
        // Get the first spread value
        const spreadStr = spreadPatterns[0].split(/\s/)[0];
        // Convert "½" to ".5"
        const cleanSpread = spreadStr.replace('½', '.5');
        spread = parseFloat(cleanSpread);
      } else if (line.includes('PK')) {
        spread = 0; // Pick'em
      }
      
      // Determine if this is away or home team
      if (!currentGame) {
        // First team = away
        currentGame = { 
          awayTeam: teamName, 
          homeTeam: null, 
          awaySpread: spread, 
          homeSpread: null,
          isToday: isToday
        };
      } else if (!currentGame.homeTeam) {
        // Second team = home
        currentGame.homeTeam = teamName;
        currentGame.homeSpread = spread;
        
        // Only add if it's today's game
        if (currentGame.isToday && currentGame.awayTeam && currentGame.homeTeam) {
          games.push(currentGame);
        }
        currentGame = null;
      }
    }
  }
  
  console.log(`📅 Found ${games.length} games for today (${todayDay} ${todayDate})`);
  
  // Debug: show parsed games
  for (const g of games) {
    console.log(`   ${g.awayTeam} (${g.awaySpread}) @ ${g.homeTeam} (${g.homeSpread})`);
  }
  
  return games;
}

/**
 * Match spread games with model predictions
 */
function matchSpreadWithModels(spreadGames, matchedGames) {
  const opportunities = [];
  
  const normalizeTeam = (name) => name?.toLowerCase().replace(/[^a-z]/g, '') || '';
  
  for (const spreadGame of spreadGames) {
    // Find matching game in our model data
    const modelGame = matchedGames.find(mg => {
      const awayMatch = normalizeTeam(mg.awayTeam).includes(normalizeTeam(spreadGame.awayTeam)) ||
                        normalizeTeam(spreadGame.awayTeam).includes(normalizeTeam(mg.awayTeam));
      const homeMatch = normalizeTeam(mg.homeTeam).includes(normalizeTeam(spreadGame.homeTeam)) ||
                        normalizeTeam(spreadGame.homeTeam).includes(normalizeTeam(mg.homeTeam));
      return awayMatch && homeMatch;
    });
    
    if (!modelGame) continue;
    if (!modelGame.dratings || !modelGame.haslametrics) continue;
    
    const dr = modelGame.dratings;
    const hs = modelGame.haslametrics;
    
    // Calculate predicted margins
    const drMargin = dr.awayScore - dr.homeScore; // Positive = away wins
    const hsMargin = hs.awayScore - hs.homeScore; // Positive = away wins
    
    // Determine if models agree on winner
    const drPicksAway = drMargin > 0;
    const hsPicksAway = hsMargin > 0;
    const modelsAgree = drPicksAway === hsPicksAway;
    
    if (!modelsAgree) continue; // Skip if models don't agree on winner
    
    // Determine which team both models pick
    const pickedTeam = drPicksAway ? 'away' : 'home';
    const pickedTeamName = drPicksAway ? modelGame.awayTeam : modelGame.homeTeam;
    
    // Get the spread for the picked team
    // If picking away, use awaySpread; if picking home, use homeSpread
    // Note: Spread is from the perspective of that team (negative = favorite)
    const spread = pickedTeam === 'away' ? spreadGame.awaySpread : spreadGame.homeSpread;
    
    if (spread === null || spread === undefined) continue;
    
    // Calculate if each model predicts covering the spread
    // For the picked team:
    // - If picking away: need margin > -spread (e.g., win by 8 when spread is -7.5)
    // - If picking home: need -margin > -spread (i.e., margin < spread if spread is positive)
    
    // Simplified: Convert everything to picked team's perspective
    const drPickedMargin = pickedTeam === 'away' ? drMargin : -drMargin;
    const hsPickedMargin = pickedTeam === 'away' ? hsMargin : -hsMargin;
    
    // To cover: margin must be greater than the spread
    // Spread is usually negative for favorite (e.g., -7.5 means must win by 8+)
    const drCovers = drPickedMargin > -spread;
    const hsCovers = hsPickedMargin > -spread;
    
    const bothCover = drCovers && hsCovers;
    
    opportunities.push({
      awayTeam: modelGame.awayTeam,
      homeTeam: modelGame.homeTeam,
      pickedTeam: pickedTeamName,
      pickedSide: pickedTeam,
      spread: spread,
      drMargin: Math.round(drPickedMargin * 10) / 10,
      hsMargin: Math.round(hsPickedMargin * 10) / 10,
      avgMargin: Math.round((drPickedMargin + hsPickedMargin) / 2 * 10) / 10,
      drCovers,
      hsCovers,
      bothCover,
      modelsAgree,
      odds: modelGame.odds,
      game: modelGame
    });
  }
  
  return opportunities;
}

/**
 * Calculate unit size based on margin over spread
 * Higher margin = higher conviction = more units
 */
function calculateSpreadUnits(marginOverSpread, odds) {
  // Filter extreme favorites (odds worse than -500)
  if (odds < -500) {
    return { units: 0, tier: 'FILTERED', reason: 'Extreme favorite' };
  }
  
  if (marginOverSpread >= 5) {
    return { units: 3.0, tier: 'HIGH', reason: 'Strong spread coverage' };
  } else if (marginOverSpread >= 3) {
    return { units: 2.5, tier: 'GOOD', reason: 'Solid spread coverage' };
  } else if (marginOverSpread >= 1.5) {
    return { units: 2.0, tier: 'MODERATE', reason: 'Moderate spread coverage' };
  } else {
    return { units: 1.5, tier: 'LOW', reason: 'Thin spread coverage' };
  }
}

/**
 * Generate context for spread opportunity
 */
function generateSpreadContext(opp, unitInfo) {
  const marginOver = opp.avgMargin - Math.abs(opp.spread);
  const roundedMargin = Math.round(marginOver * 10) / 10;
  
  if (unitInfo.tier === 'HIGH') {
    return {
      title: `${opp.pickedTeam} Strong Spread Play`,
      subtitle: `Models project +${roundedMargin} pts over spread • High conviction`
    };
  } else if (unitInfo.tier === 'GOOD') {
    return {
      title: `${opp.pickedTeam} Spread Value`,
      subtitle: `Both models cover by ${roundedMargin}+ pts • Solid edge`
    };
  } else if (unitInfo.tier === 'MODERATE') {
    return {
      title: `${opp.pickedTeam} Spread Opportunity`,
      subtitle: `Models aligned on spread coverage • Moderate conviction`
    };
  } else {
    return {
      title: `${opp.pickedTeam} Spread Lean`,
      subtitle: `Thin margin over spread • Reduced allocation`
    };
  }
}

/**
 * Save or update spread-based moneyline bet in Firebase
 * 
 * Strategy:
 * 1. Check if existing EV-based bet exists for this game
 * 2. If YES → Update with spreadConfirmed flag (extra significance!)
 * 3. If NO → Write new bet with same structure so it displays on UI
 */
async function saveSpreadOpportunityBet(opp) {
  const date = new Date().toISOString().split('T')[0];
  const awayNorm = opp.awayTeam.replace(/\s+/g, '_').toUpperCase();
  const homeNorm = opp.homeTeam.replace(/\s+/g, '_').toUpperCase();
  const teamNorm = opp.pickedTeam.replace(/\s+/g, '_').toUpperCase();
  const side = opp.pickedSide.toUpperCase();
  
  // Check for EXISTING EV-based bet (from normal fetch process)
  const evBetId = `${date}_${awayNorm}_${homeNorm}_MONEYLINE_${teamNorm}_(${side})`;
  const evBetRef = doc(db, 'basketball_bets', evBetId);
  const existingEvBet = await getDoc(evBetRef);
  
  const spreadAnalysis = {
    spreadConfirmed: true,
    spread: opp.spread,
    drMargin: opp.drMargin,
    hsMargin: opp.hsMargin,
    avgMargin: opp.avgMargin,
    marginOverSpread: Math.round((opp.avgMargin - Math.abs(opp.spread)) * 10) / 10,
    drCovers: opp.drCovers,
    hsCovers: opp.hsCovers,
    bothModelsCover: true
  };
  
  if (existingEvBet.exists()) {
    // ✅ EXISTING EV BET - Add spread confirmation as extra significance
    const existingData = existingEvBet.data();
    
    // Only update if not already spread-confirmed
    if (existingData.spreadAnalysis?.spreadConfirmed) {
      console.log(`   🔒 Already spread-confirmed: ${opp.pickedTeam}`);
      return { action: 'already_confirmed', betId: evBetId };
    }
    
    // ONLY add spreadAnalysis - DO NOT touch prediction or any other data!
    await setDoc(evBetRef, {
      spreadAnalysis: spreadAnalysis
    }, { merge: true });
    
    console.log(`   ⬆️  UPGRADED: ${opp.pickedTeam} - Added spread confirmation to existing EV bet`);
    console.log(`      Spread: ${opp.spread} | Models: +${opp.avgMargin} | Covers by: +${spreadAnalysis.marginOverSpread}`);
    return { action: 'upgraded', betId: evBetId };
  }
  
  // Get moneyline odds for picked team
  const mlOdds = opp.pickedSide === 'away' ? opp.odds?.awayOdds : opp.odds?.homeOdds;
  
  // Calculate margin over spread
  const marginOverSpread = Math.round((opp.avgMargin - Math.abs(opp.spread)) * 10) / 10;
  
  // Calculate units based on margin and filter extreme favorites
  const unitInfo = calculateSpreadUnits(marginOverSpread, mlOdds);
  
  // Filter out extreme favorites
  if (unitInfo.tier === 'FILTERED') {
    console.log(`   ❌ FILTERED: ${opp.pickedTeam} (${mlOdds} odds - extreme favorite)`);
    return { action: 'filtered', reason: unitInfo.reason };
  }
  
  // Generate context for UI
  const context = generateSpreadContext(opp, unitInfo);
  
  // Calculate win probability from odds for display
  const winProb = mlOdds < 0 
    ? Math.abs(mlOdds) / (Math.abs(mlOdds) + 100)
    : 100 / (mlOdds + 100);
  
  const spreadBetId = `${date}_${awayNorm}_${homeNorm}_MONEYLINE_${teamNorm}_(${side})`;
  
  // Create NEW bet with same structure as regular EV bets so it displays properly
  const betData = {
    id: spreadBetId,
    date: date,
    timestamp: Date.now(),
    sport: 'BASKETBALL',
    
    game: {
      awayTeam: opp.awayTeam,
      homeTeam: opp.homeTeam,
      gameTime: opp.odds?.gameTime || 'TBD'
    },
    
    bet: {
      market: 'MONEYLINE',
      pick: opp.pickedTeam,
      odds: mlOdds || 0,
      team: opp.pickedTeam
    },
    
    // Spread analysis data
    spreadAnalysis: {
      ...spreadAnalysis,
      marginOverSpread: marginOverSpread,
      unitTier: unitInfo.tier,
      context: context
    },
    
    prediction: {
      modelsAgree: true,
      spreadConfirmed: true,
      confidence: unitInfo.tier,
      unitSize: unitInfo.units,
      confidenceTier: unitInfo.tier,
      grade: unitInfo.tier === 'HIGH' ? 'A+' : unitInfo.tier === 'GOOD' ? 'A' : 'B+',
      simplifiedGrade: unitInfo.tier === 'HIGH' || unitInfo.tier === 'GOOD' ? 'A' : 'B',
      bestTeam: opp.pickedTeam,
      bestBet: opp.pickedSide,
      bestOdds: mlOdds || 0,
      bestEV: marginOverSpread, // Use margin as proxy for value
      // Model data for UI display
      ensembleAwayProb: opp.pickedSide === 'away' ? winProb : (1 - winProb),
      ensembleHomeProb: opp.pickedSide === 'home' ? winProb : (1 - winProb),
      marketAwayProb: opp.pickedSide === 'away' ? winProb : (1 - winProb),
      marketHomeProb: opp.pickedSide === 'home' ? winProb : (1 - winProb),
      dratingsAwayScore: opp.game?.dratings?.awayScore || null,
      dratingsHomeScore: opp.game?.dratings?.homeScore || null,
      haslametricsAwayScore: opp.game?.haslametrics?.awayScore || null,
      haslametricsHomeScore: opp.game?.haslametrics?.homeScore || null,
      ensembleAwayScore: opp.game?.dratings?.awayScore || null,
      ensembleHomeScore: opp.game?.dratings?.homeScore || null,
      // Spread-specific context for UI
      spreadContext: context
    },
    
    result: {
      awayScore: null,
      homeScore: null,
      outcome: null,
      profit: null,
      fetched: false
    },
    
    status: 'PENDING',
    source: 'SPREAD_OPPORTUNITY'
  };
  
  await setDoc(evBetRef, betData);
  console.log(`   ✅ NEW: ${opp.pickedTeam} ML @ ${mlOdds}`);
  console.log(`      Spread: ${opp.spread} | Margin: +${marginOverSpread} | ${unitInfo.units}u (${unitInfo.tier})`);
  return { action: 'created', betId: spreadBetId };
}

async function retryWithBackoff(fn, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`   ⚠️  Retry ${i + 1}: ${error.message}`);
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
}

async function findSpreadOpportunities() {
  try {
    const cacheBuster = Date.now();
    
    // 1. Fetch spread data from OddsTrader
    console.log('📊 Fetching NCAAB spreads from OddsTrader...');
    const spreadResult = await retryWithBackoff(async () => {
      return await firecrawl.scrape(
        `https://www.oddstrader.com/ncaa-college-basketball/?eid=0&g=game&m=spread&_=${cacheBuster}`,
        {
          formats: ['markdown'],
          onlyMainContent: true,
          waitFor: 3000,
          timeout: 300000
        }
      );
    });
    
    // Save spread data for reference
    await fs.writeFile(
      join(__dirname, '../public/basketball_spreads.md'),
      spreadResult.markdown,
      'utf8'
    );
    console.log('✅ Spread data saved to basketball_spreads.md\n');
    
    // 2. Parse spread data
    const spreadGames = parseSpreadData(spreadResult.markdown);
    console.log(`📋 Parsed ${spreadGames.length} games with spreads\n`);
    
    // 3. Load model predictions AND existing odds (use already-scraped data)
    console.log('📂 Loading model predictions and odds...');
    const haslaMarkdown = await fs.readFile(join(__dirname, '../public/haslametrics.md'), 'utf8');
    const drateMarkdown = await fs.readFile(join(__dirname, '../public/dratings.md'), 'utf8');
    const bartMarkdown = await fs.readFile(join(__dirname, '../public/Bart.md'), 'utf8');
    const csvContent = await fs.readFile(join(__dirname, '../public/basketball_teams.csv'), 'utf8');
    
    // Load existing moneyline odds from normal fetch
    const { parseBasketballOdds } = await import('../src/utils/basketballOddsParser.js');
    const oddsMarkdown = await fs.readFile(join(__dirname, '../public/basketball_odds.md'), 'utf8');
    const existingOdds = parseBasketballOdds(oddsMarkdown);
    console.log(`   📊 Loaded ${existingOdds.length} games with moneyline odds`);
    
    const haslaData = parseHaslametrics(haslaMarkdown);
    const dratePreds = parseDRatings(drateMarkdown);
    const bartData = parseBarttorvik(bartMarkdown);
    
    // Use existing odds for matching (has real moneyline odds)
    const matchedGames = matchGamesWithCSV(existingOdds, haslaData, dratePreds, bartData, csvContent);
    console.log(`✅ Matched ${matchedGames.length} games with model data\n`);
    
    // 4. Find spread opportunities
    console.log('🔍 Analyzing spread opportunities...');
    const opportunities = matchSpreadWithModels(spreadGames, matchedGames);
    
    console.log(`\n📊 SPREAD ANALYSIS RESULTS:`);
    console.log(`   Total analyzed: ${opportunities.length}`);
    
    // Filter for opportunities where BOTH models predict covering
    const qualityOpps = opportunities.filter(o => o.bothCover && o.modelsAgree);
    console.log(`   Both models cover spread: ${qualityOpps.length} ✅\n`);
    
    if (qualityOpps.length === 0) {
      console.log('⚠️  No spread opportunities found today.');
      return;
    }
    
    console.log('🎯 SPREAD-BASED MONEYLINE OPPORTUNITIES:\n');
    for (const opp of qualityOpps) {
      console.log(`   ${opp.awayTeam} @ ${opp.homeTeam}`);
      console.log(`   Pick: ${opp.pickedTeam} (spread: ${opp.spread})`);
      console.log(`   D-Ratings: ${opp.drCovers ? '✅' : '❌'} ${opp.drMargin > 0 ? '+' : ''}${opp.drMargin} pts`);
      console.log(`   Haslametrics: ${opp.hsCovers ? '✅' : '❌'} ${opp.hsMargin > 0 ? '+' : ''}${opp.hsMargin} pts`);
      console.log(`   Avg margin: ${opp.avgMargin > 0 ? '+' : ''}${opp.avgMargin} vs spread ${opp.spread}`);
      console.log();
    }
    
    // 5. Save opportunities to Firebase
    console.log('💾 Processing spread opportunities in Firebase...');
    let upgraded = 0;
    let created = 0;
    let skipped = 0;
    let filtered = 0;
    
    for (const opp of qualityOpps) {
      const result = await saveSpreadOpportunityBet(opp);
      if (result?.action === 'upgraded') upgraded++;
      else if (result?.action === 'created') created++;
      else if (result?.action === 'filtered') filtered++;
      else skipped++;
    }
    
    console.log(`\n📊 SPREAD OPPORTUNITY RESULTS:`);
    console.log(`   ⬆️  Upgraded existing EV bets: ${upgraded}`);
    console.log(`   ✅ New spread-only bets created: ${created}`);
    console.log(`   ❌ Filtered (extreme favorites): ${filtered}`);
    console.log(`   🔒 Already processed: ${skipped}`);
    console.log('=============================================\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

// Run
findSpreadOpportunities()
  .then(() => {
    console.log('🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Failed:', error);
    process.exit(1);
  });
