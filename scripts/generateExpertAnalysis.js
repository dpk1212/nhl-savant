/**
 * Generate Expert Analysis - GitHub Action Script
 * 
 * PURPOSE:
 * - Runs daily at 9 AM ET (before games)
 * - Fetches today's NHL games
 * - Generates AI analysis for each matchup using Perplexity API
 * - Caches results in Firebase for instant page loads
 * 
 * USAGE:
 * - Scheduled: GitHub Actions runs automatically daily
 * - Manual: npm run generate-analysis
 * - Local: node scripts/generateExpertAnalysis.js
 * 
 * REQUIREMENTS:
 * - PERPLEXITY_API_KEY environment variable
 * - Firebase credentials (VITE_FIREBASE_*)
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';
// Note: fetch is built-in to Node.js 18+, no import needed

// Note: Import edge calculator and data processor only when needed
// (dynamically imported in loadOddsAndCalculateEdges function)

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin SDK (bypasses security rules, better for server-side)
const serviceAccount = {
  project_id: process.env.VITE_FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

// Validate credentials before initializing
if (!serviceAccount.project_id) {
  console.error('❌ VITE_FIREBASE_PROJECT_ID environment variable not set');
  process.exit(1);
}
if (!serviceAccount.client_email) {
  console.error('❌ FIREBASE_CLIENT_EMAIL environment variable not set');
  process.exit(1);
}
if (!serviceAccount.private_key) {
  console.error('❌ FIREBASE_PRIVATE_KEY environment variable not set');
  process.exit(1);
}

console.log(`✅ Service account loaded: ${serviceAccount.client_email}`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Get Perplexity API key from environment variable (GitHub Secret)
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

if (!PERPLEXITY_API_KEY) {
  console.error('❌ PERPLEXITY_API_KEY environment variable not set');
  console.error('ℹ️ Add PERPLEXITY_API_KEY as a GitHub Secret');
  process.exit(1);
}

/**
 * Team name mapping (from ScheduleHelper - KEEP IN SYNC)
 */
const TEAM_NAME_TO_CODE = {
  'Anaheim Ducks': 'ANA',
  'Boston Bruins': 'BOS',
  'Buffalo Sabres': 'BUF',
  'Calgary Flames': 'CGY',
  'Carolina Hurricanes': 'CAR',
  'Chicago Blackhawks': 'CHI',
  'Colorado Avalanche': 'COL',
  'Columbus Blue Jackets': 'CBJ',
  'Dallas Stars': 'DAL',
  'Detroit Red Wings': 'DET',
  'Edmonton Oilers': 'EDM',
  'Florida Panthers': 'FLA',
  'Los Angeles Kings': 'LAK',
  'Minnesota Wild': 'MIN',
  'Montreal Canadiens': 'MTL',
  'Nashville Predators': 'NSH',
  'New Jersey Devils': 'NJD',
  'New York Islanders': 'NYI',
  'New York Rangers': 'NYR',
  'Ottawa Senators': 'OTT',
  'Philadelphia Flyers': 'PHI',
  'Pittsburgh Penguins': 'PIT',
  'San Jose Sharks': 'SJS',
  'Seattle Kraken': 'SEA',
  'St. Louis Blues': 'STL',
  'Tampa Bay Lightning': 'TBL',
  'Toronto Maple Leafs': 'TOR',
  'Utah Mammoth': 'UTA',
  'Vancouver Canucks': 'VAN',
  'Vegas Golden Knights': 'VGK',
  'Washington Capitals': 'WSH',
  'Winnipeg Jets': 'WPG'
};

/**
 * Get today's NHL games from schedule (SAME AS APP.JSX)
 * Uses nhl-202526-asplayed.csv with columns: Date, Visitor, Home
 */
function getTodaysGames() {
  try {
    // SAME FILE AS PRODUCTION APP
    const schedulePath = join(__dirname, '../public/nhl-202526-asplayed.csv');
    const scheduleData = readFileSync(schedulePath, 'utf-8');
    const lines = scheduleData.trim().split('\n');
    
    // CSV Format: Date,Start Time (Sask),Start Time (ET),Visitor,Score,Home,Score,Status
    const today = new Date();
    const month = today.getMonth() + 1; // 0-indexed, add 1
    const day = today.getDate();
    const year = today.getFullYear();
    const todayStr = `${month}/${day}/${year}`; // Format: "10/29/2025"
    
    console.log(`🔍 Looking for games on: ${todayStr}`);
    
    const games = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      
      const values = line.split(',');
      const gameDate = values[0]?.trim();
      const visitorName = values[3]?.trim(); // Full name like "Toronto Maple Leafs"
      const homeName = values[5]?.trim(); // Full name like "Columbus Blue Jackets"
      
      if (gameDate === todayStr && visitorName && homeName) {
        // Convert full names to team codes (SAME AS PRODUCTION)
        const awayTeam = TEAM_NAME_TO_CODE[visitorName];
        const homeTeam = TEAM_NAME_TO_CODE[homeName];
        
        if (awayTeam && homeTeam) {
          games.push({
            awayTeam,
            homeTeam,
            date: todayStr
          });
          console.log(`   ✓ Found: ${awayTeam} @ ${homeTeam}`);
        } else {
          console.warn(`   ⚠️ Could not map teams: ${visitorName} vs ${homeName}`);
        }
      }
    }
    
    return games;
  } catch (error) {
    console.error('❌ Error reading schedule:', error);
    return [];
  }
}

/**
 * Generate analysis using Perplexity API
 */
async function generateAnalysis(awayTeam, homeTeam, apiKey) {
  const prompt = `You are NHL Savant's expert analyst. Write compelling, shareable matchup analysis for ${awayTeam} @ ${homeTeam}.

CRITICAL REQUIREMENTS:
1. Start with a BOLD, CONTROVERSIAL, or SURPRISING hook (1 sentence)
2. Follow with 2-3 analysis paragraphs (80-120 words each)
3. End with a specific betting angle or "hidden edge" insight
4. Use player names, recent stats (last 3-5 games), and specific numbers
5. Write like you're trying to go viral on Twitter - be confident, specific, controversial

STRUCTURE (JSON format):
[
  {
    "hook": "One sentence that makes people stop scrolling - controversial, surprising, or bold prediction",
    "headline": "5-7 word attention-grabbing headline (not generic)",
    "analysis": "Main analysis paragraph with specific stats and player names",
    "bettingAngle": "The hidden edge or specific betting insight casual fans would miss"
  }
]

EXAMPLES OF GOOD HOOKS:
- "The market is WRONG about Toronto's road defense - here's why"
- "Columbus's power play is a trap bet tonight, and the numbers prove it"
- "Matthews vs Werenski is the mismatch nobody's talking about"

AVOID:
- Generic observations everyone knows
- "Both teams are trending up/down" nonsense
- Safe, boring analysis
- Lack of specific numbers or player names

Return ONLY valid JSON. Be bold. Be specific. Give users a reason to screenshot and share this.`;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'You are an expert NHL analyst. Return ONLY valid JSON arrays, no markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || '[]';
    
    console.log(`📥 Raw Perplexity response (first 500 chars):`, content.substring(0, 500));
    
    // Clean markdown formatting
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // CRITICAL FIX: Unescape quotes that Perplexity sometimes adds
    // Replace \" with " but only within JSON values, not the structure
    content = content.replace(/\\"/g, '"');
    
    // Also handle escaped backslashes
    content = content.replace(/\\\\/g, '\\');
    
    console.log(`🔧 Cleaned content (first 500 chars):`, content.substring(0, 500));
    
    let cards;
    try {
      cards = JSON.parse(content);
      if (!Array.isArray(cards)) {
        throw new Error('Response is not an array');
      }
      cards = cards.slice(0, 4); // Max 4 cards
      console.log(`✅ Parsed ${cards.length} cards from Perplexity`);
      
      // VALIDATE each card has required fields for new structure
      cards = cards.map((card, idx) => {
        if (!card || typeof card !== 'object') {
          throw new Error(`Card ${idx} is not an object: ${typeof card}`);
        }
        
        // Validate and structure the new format
        return {
          hook: String(card.hook || ''),
          headline: String(card.headline || ''),
          analysis: String(card.analysis || ''),
          bettingAngle: String(card.bettingAngle || '')
        };
      });
      
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', content);
      throw parseError;
    }

    return cards;
  } catch (error) {
    console.error(`❌ Error generating analysis for ${awayTeam} @ ${homeTeam}:`, error.message);
    return null;
  }
}

/**
 * Cache analysis in Firebase
 */
async function cacheAnalysis(awayTeam, homeTeam, cards) {
  // VALIDATE INPUT DATA
  if (!awayTeam || !homeTeam) {
    console.error('❌ Invalid team names:', { awayTeam, homeTeam });
    throw new Error('Team names cannot be empty');
  }
  
  if (!cards || !Array.isArray(cards) || cards.length === 0) {
    console.error('❌ Invalid cards data:', { cards });
    throw new Error('Cards must be a non-empty array');
  }
  
  const now = new Date();
  
  // SIMPLIFIED: No timeKey - just use date (we only generate once per day)
  const cacheKey = `${awayTeam}-${homeTeam}-${now.toISOString().split('T')[0]}`;
  const cacheRef = db.collection('perplexityCache').doc(cacheKey);
  
  // VALIDATE DOCUMENT ID
  if (cacheKey.includes('/') || cacheKey.startsWith('.') || cacheKey.startsWith('__')) {
    console.error('❌ Invalid document ID:', cacheKey);
    throw new Error('Invalid document ID format');
  }

  try {
    // Prepare data object with validation
    const dataToWrite = {
      content: JSON.stringify(cards),
      timestamp: Date.now(),
      awayTeam: String(awayTeam),
      homeTeam: String(homeTeam),
      generatedBy: 'github-action'
    };
    
    console.log(`💾 Writing to Firebase: ${cacheKey}`);
    console.log(`   Data size: ${dataToWrite.content.length} characters`);
    console.log(`   Content preview: ${dataToWrite.content.substring(0, 200)}...`);
    
    // VALIDATE: Check for undefined or null values
    for (const [key, value] of Object.entries(dataToWrite)) {
      if (value === undefined) {
        throw new Error(`Field '${key}' is undefined`);
      }
      if (value === null) {
        throw new Error(`Field '${key}' is null`);
      }
    }
    
    await cacheRef.set(dataToWrite);
    console.log(`✅ Cached analysis for ${awayTeam} @ ${homeTeam}`);
  } catch (error) {
    console.error(`❌ Failed to cache analysis for ${awayTeam} @ ${homeTeam}:`);
    console.error(`   Error code: ${error.code}`);
    console.error(`   Error message: ${error.message}`);
    console.error(`   Document ID: ${cacheKey}`);
    if (error.stack) {
      console.error(`   Stack trace:`, error.stack);
    }
    throw error; // Re-throw to stop execution
  }
}

/**
 * Generate bet hook (1-2 sentences affirming our model's pick)
 */
async function generateBetHook(game, bestEdge, factors, apiKey) {
  if (!bestEdge || !factors || factors.length === 0) {
    console.log(`⚠️ No edge data available for bet hook`);
    return null;
  }

  // Format pick description
  const pickDesc = bestEdge.market === 'MONEYLINE' 
    ? `${bestEdge.team} ML` 
    : bestEdge.market === 'PUCKLINE'
    ? `${bestEdge.team} ${bestEdge.line > 0 ? '+' : ''}${bestEdge.line}`
    : `${bestEdge.pick}`;

  // Format top 3 factors
  const topFactors = factors.slice(0, 3).map(f => {
    const impact = Math.abs(f.impact).toFixed(2);
    return `- ${f.name}: ${f.impact > 0 ? '+' : ''}${impact} goal impact`;
  }).join('\n');

  const modelProb = (bestEdge.modelProb * 100).toFixed(1);
  const impliedProb = ((1 / (bestEdge.odds < 0 
    ? (1 + (100 / Math.abs(bestEdge.odds)))
    : (1 + (bestEdge.odds / 100)))) * 100).toFixed(1);

  const prompt = `You are affirming NHL Savant's model prediction. Our model picks: ${pickDesc} at ${bestEdge.odds > 0 ? '+' : ''}${bestEdge.odds} with +${bestEdge.evPercent.toFixed(1)}% EV.

Our model projects ${modelProb}% probability vs market's ${impliedProb}%.

Top supporting factors:
${topFactors}

Write 1-2 compelling sentences explaining WHY this is the smart bet. Be confident, specific, and data-driven. Use the factors and probabilities above. Return plain text (no JSON, no markdown).`;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'You are an expert NHL analyst affirming betting recommendations. Be confident and data-driven.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 200,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Clean up any markdown or extra formatting
    const cleaned = content.replace(/```/g, '').replace(/\*\*/g, '').trim();
    
    console.log(`✅ Generated bet hook (${cleaned.length} chars)`);
    return cleaned;
  } catch (error) {
    console.error(`❌ Error generating bet hook:`, error.message);
    return null;
  }
}

/**
 * Generate full story (2-3 paragraphs covering primary and alternative bets)
 */
async function generateFullStory(game, bestEdge, altBet, factors, altFactors, apiKey) {
  if (!bestEdge || !factors || factors.length === 0) {
    console.log(`⚠️ No edge data available for full story`);
    return null;
  }

  // Format primary bet
  const primaryPick = bestEdge.market === 'MONEYLINE' 
    ? `${bestEdge.team} ML` 
    : bestEdge.market === 'PUCKLINE'
    ? `${bestEdge.team} ${bestEdge.line > 0 ? '+' : ''}${bestEdge.line}`
    : `${bestEdge.pick}`;

  const primaryFactors = factors.slice(0, 3).map(f => {
    const impact = Math.abs(f.impact).toFixed(2);
    return `  - ${f.name}: ${f.impact > 0 ? '+' : ''}${impact} goal impact`;
  }).join('\n');

  // Format alternative bet
  let altSection = '';
  if (altBet && altFactors && altFactors.length > 0) {
    const altPick = altBet.market === 'MONEYLINE' 
      ? `${altBet.team} ML` 
      : altBet.market === 'PUCKLINE'
      ? `${altBet.team} ${altBet.line > 0 ? '+' : ''}${altBet.line}`
      : `${altBet.pick}`;

    const altFactorList = altFactors.slice(0, 3).map(f => {
      const impact = Math.abs(f.impact).toFixed(2);
      return `  - ${f.name}: ${f.impact > 0 ? '+' : ''}${impact} goal impact`;
    }).join('\n');

    altSection = `
ALTERNATIVE BET: ${altPick} at ${altBet.odds > 0 ? '+' : ''}${altBet.odds} with +${altBet.evPercent.toFixed(1)}% EV
Supporting factors:
${altFactorList}`;
  }

  const prompt = `You are providing deep analysis for NHL Savant's betting recommendations for ${game.awayTeam} @ ${game.homeTeam}.

PRIMARY BET: ${primaryPick} at ${bestEdge.odds > 0 ? '+' : ''}${bestEdge.odds} with +${bestEdge.evPercent.toFixed(1)}% EV
Supporting factors:
${primaryFactors}${altSection}

Write 2-3 paragraphs of in-depth analysis covering:
1. Why the primary bet has strong value (use specific stats and factors)
2. ${altBet ? 'How the alternative bet provides additional opportunity' : 'Additional context about this matchup'}
3. Key matchup dynamics that create these edges

Be analytical, confident, and data-driven. Write in a professional tone for serious bettors. Return plain text (no JSON, no markdown formatting, no bold/italic markers).`;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'You are an expert NHL analyst providing detailed betting analysis. Be analytical and confident.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 600,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Clean up any markdown or extra formatting
    const cleaned = content.replace(/```/g, '').replace(/\*\*/g, '').replace(/\*/g, '').trim();
    
    console.log(`✅ Generated full story (${cleaned.length} chars)`);
    return cleaned;
  } catch (error) {
    console.error(`❌ Error generating full story:`, error.message);
    return null;
  }
}

/**
 * Cache bet narrative in Firebase
 */
async function cacheBetNarrative(awayTeam, homeTeam, content, type) {
  if (!awayTeam || !homeTeam || !content) {
    console.error('❌ Invalid narrative data');
    return false;
  }

  const now = new Date();
  const cacheKey = `${awayTeam}-${homeTeam}-${now.toISOString().split('T')[0]}-${type}`;
  const cacheRef = db.collection('perplexityCache').doc(cacheKey);

  try {
    await cacheRef.set({
      content: String(content),
      timestamp: Date.now(),
      awayTeam: String(awayTeam),
      homeTeam: String(homeTeam),
      type: String(type),
      generatedBy: 'github-action'
    });
    console.log(`✅ Cached ${type} for ${awayTeam} @ ${homeTeam}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to cache ${type}:`, error.message);
    return false;
  }
}

/**
 * Load odds data and calculate edges for bet narratives
 */
async function loadOddsAndCalculateEdges(games) {
  try {
    // Look for odds files (they're named odds_money.md and odds_total.md, NOT odds_puck.md!)
    const oddsMoneyPath = join(__dirname, '../public/odds_money.md');
    const oddsTotalPath = join(__dirname, '../public/odds_total.md');
    
    console.log(`📂 Looking for odds files:`);
    console.log(`   Money: ${oddsMoneyPath}`);
    console.log(`   Total: ${oddsTotalPath}`);
    
    let oddsMoneyData, oddsTotalData;
    try {
      oddsMoneyData = readFileSync(oddsMoneyPath, 'utf-8');
      console.log(`✅ Loaded odds_money.md (${oddsMoneyData.length} chars)`);
    } catch (error) {
      console.log(`❌ Could not read odds_money.md: ${error.message}`);
      return null;
    }
    
    try {
      oddsTotalData = readFileSync(oddsTotalPath, 'utf-8');
      console.log(`✅ Loaded odds_total.md (${oddsTotalData.length} chars)`);
    } catch (error) {
      console.log(`❌ Could not read odds_total.md: ${error.message}`);
      return null;
    }

    // Dynamically import modules (avoids loading them when odds aren't available)
    const { EdgeCalculator } = await import('../src/utils/edgeCalculator.js');
    const { NHLDataProcessor } = await import('../src/utils/dataProcessing.js');
    const { GoalieProcessor } = await import('../src/utils/goalieProcessor.js');
    const { ScheduleHelper } = await import('../src/utils/scheduleHelper.js');
    
    // Load and PARSE required data files (they need arrays, not raw CSV strings!)
    console.log('📊 Loading CSV files...');
    const teamsCSV = readFileSync(join(__dirname, '../public/teams.csv'), 'utf-8');
    const goaliesCSV = readFileSync(join(__dirname, '../public/goalies.csv'), 'utf-8');
    const scheduleCSV = readFileSync(join(__dirname, '../public/nhl-202526-asplayed.csv'), 'utf-8');

    // Parse teams.csv
    const teamsData = Papa.parse(teamsCSV, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value) => {
        if (value === '' || value === null) return null;
        const trimmed = value.toString().trim();
        if (!isNaN(trimmed) && !isNaN(parseFloat(trimmed))) return parseFloat(trimmed);
        return trimmed;
      }
    }).data.filter(row => row && Object.keys(row).some(key => row[key] !== null));
    
    console.log(`✅ Parsed teams.csv: ${teamsData.length} rows`);

    // Parse goalies.csv
    const goaliesData = Papa.parse(goaliesCSV, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim()
    }).data.filter(row => row && Object.keys(row).some(key => row[key] !== null));
    
    console.log(`✅ Parsed goalies.csv: ${goaliesData.length} rows`);

    // Parse schedule.csv
    const scheduleData = Papa.parse(scheduleCSV, {
      header: true,
      skipEmptyLines: true
    }).data.filter(row => row && Object.keys(row).some(key => row[key] !== null));
    
    console.log(`✅ Parsed schedule.csv: ${scheduleData.length} rows`);

    // Initialize processors with PARSED data (arrays, not strings!)
    const goalieProcessor = new GoalieProcessor(goaliesData);
    const scheduleHelper = new ScheduleHelper(scheduleData);
    const dataProcessor = new NHLDataProcessor(teamsData, goalieProcessor, scheduleHelper);
    
    // Initialize edge calculator (use 'total' not 'puck')
    const edgeCalculator = new EdgeCalculator(
      dataProcessor,
      { moneyText: oddsMoneyData, totalText: oddsTotalData },
      null // Starting goalies (optional)
    );

    const allEdges = edgeCalculator.calculateAllEdges();
    console.log(`✅ Calculated edges for ${allEdges.length} games`);
    
    return { allEdges, dataProcessor };
  } catch (error) {
    console.error('❌ Error loading odds data:', error.message);
    console.error(error.stack);
    return null;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Expert Analysis Generation');
  console.log(`📅 Date: ${new Date().toISOString()}`);
  console.log('✅ Perplexity API key loaded from environment');
  console.log('');

  // Get today's games
  const games = getTodaysGames();
  console.log(`📊 Found ${games.length} games today`);
  console.log('');

  if (games.length === 0) {
    console.log('ℹ️ No games scheduled for today');
    return;
  }

  // Generate matchup insights for each game
  let insightsSuccessCount = 0;
  let insightsFailureCount = 0;

  console.log('📰 PHASE 1: Generating Matchup Insights');
  console.log('='.repeat(50));
  
  for (const game of games) {
    console.log(`⏳ Generating insights: ${game.awayTeam} @ ${game.homeTeam}`);
    
    const cards = await generateAnalysis(game.awayTeam, game.homeTeam, PERPLEXITY_API_KEY);
    
    if (cards && cards.length > 0) {
      await cacheAnalysis(game.awayTeam, game.homeTeam, cards);
      insightsSuccessCount++;
      console.log('');
    } else {
      insightsFailureCount++;
      console.log(`⚠️ Skipped caching (generation failed)`);
      console.log('');
    }

    // Rate limiting: Wait 2 seconds between requests
    if (game !== games[games.length - 1]) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('');
  console.log('📊 Phase 1 Summary:');
  console.log(`✅ Insights Success: ${insightsSuccessCount}`);
  console.log(`❌ Insights Failed: ${insightsFailureCount}`);
  console.log('');

  // PHASE 2: Generate bet narratives (if odds data available)
  console.log('🎯 PHASE 2: Generating Bet Narratives');
  console.log('='.repeat(50));
  
  const edgeData = await loadOddsAndCalculateEdges(games);
  
  if (!edgeData) {
    console.log('⏭️ Skipping bet narratives - odds data not available');
    console.log('   (This is normal if running before odds are scraped)');
  } else {
    const { allEdges, dataProcessor } = edgeData;
    
    // Import generateDeepAnalytics dynamically
    const { generateDeepAnalytics } = await import('../src/utils/narrativeGenerator.js');
    
    let narrativesSuccessCount = 0;
    let narrativesFailureCount = 0;

    for (const gameEdge of allEdges) {
      const gameInfo = games.find(g => 
        g.awayTeam === gameEdge.awayTeam && g.homeTeam === gameEdge.homeTeam
      );
      
      if (!gameInfo) continue;

      console.log(`⏳ Generating narratives: ${gameEdge.awayTeam} @ ${gameEdge.homeTeam}`);
      
      // Find best edge
      const bestEdge = [
        ...(gameEdge.edges.moneyline ? [
          { ...gameEdge.edges.moneyline.away, market: 'MONEYLINE', team: gameEdge.awayTeam },
          { ...gameEdge.edges.moneyline.home, market: 'MONEYLINE', team: gameEdge.homeTeam }
        ] : []),
        ...(gameEdge.edges.puckLine ? [
          { ...gameEdge.edges.puckLine.away, market: 'PUCKLINE', team: gameEdge.awayTeam },
          { ...gameEdge.edges.puckLine.home, market: 'PUCKLINE', team: gameEdge.homeTeam }
        ] : [])
      ].sort((a, b) => b.evPercent - a.evPercent)[0];

      if (!bestEdge || bestEdge.evPercent <= 0) {
        console.log('   ⚠️ No positive EV bet found - skipping');
        continue;
      }

      // Generate analytics data to get factors
      const analyticsData = generateDeepAnalytics(gameEdge, bestEdge, dataProcessor);
      
      if (!analyticsData || !analyticsData.factors || analyticsData.factors.length === 0) {
        console.log('   ⚠️ No factors available - skipping');
        narrativesFailureCount++;
        continue;
      }

      // Find alternative bet
      const altBet = [
        ...(gameEdge.edges.moneyline ? [
          { ...gameEdge.edges.moneyline.away, market: 'MONEYLINE', team: gameEdge.awayTeam },
          { ...gameEdge.edges.moneyline.home, market: 'MONEYLINE', team: gameEdge.homeTeam }
        ] : []),
        ...(gameEdge.edges.puckLine ? [
          { ...gameEdge.edges.puckLine.away, market: 'PUCKLINE', team: gameEdge.awayTeam },
          { ...gameEdge.edges.puckLine.home, market: 'PUCKLINE', team: gameEdge.homeTeam }
        ] : [])
      ].filter(e => e.evPercent > 0 && e !== bestEdge)
        .sort((a, b) => b.evPercent - a.evPercent)[0];

      // Generate bet hook
      const betHook = await generateBetHook(gameInfo, bestEdge, analyticsData.factors, PERPLEXITY_API_KEY);
      if (betHook) {
        await cacheBetNarrative(gameEdge.awayTeam, gameEdge.homeTeam, betHook, 'bet-hook');
      }

      // Generate full story
      const fullStory = await generateFullStory(
        gameInfo, 
        bestEdge, 
        altBet, 
        analyticsData.factors,
        altBet ? analyticsData.factors : null,
        PERPLEXITY_API_KEY
      );
      if (fullStory) {
        await cacheBetNarrative(gameEdge.awayTeam, gameEdge.homeTeam, fullStory, 'full-story');
      }

      if (betHook && fullStory) {
        narrativesSuccessCount++;
      } else {
        narrativesFailureCount++;
      }

      console.log('');

      // Rate limiting: Wait 2 seconds between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('');
    console.log('📊 Phase 2 Summary:');
    console.log(`✅ Narratives Success: ${narrativesSuccessCount}`);
    console.log(`❌ Narratives Failed: ${narrativesFailureCount}`);
  }

  console.log('');
  console.log('='.repeat(50));
  console.log('✨ Expert Analysis Generation Complete');
  console.log('='.repeat(50));
}

// Run
main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});

