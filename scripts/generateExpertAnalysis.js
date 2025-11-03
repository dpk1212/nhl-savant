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

  // Format pick description (MONEYLINE ONLY)
  const pickDesc = `${bestEdge.team} ML`;

  // Format top 3 factors (bullets are already formatted strings)
  const topFactors = factors.slice(0, 3).join('\n');

  const modelProb = (bestEdge.modelProb * 100).toFixed(1);
  const impliedProb = ((1 / (bestEdge.odds < 0 
    ? (1 + (100 / Math.abs(bestEdge.odds)))
    : (1 + (bestEdge.odds / 100)))) * 100).toFixed(1);

  // Log exact numbers being sent to Perplexity
  console.log(`   📊 Sending to Perplexity: EV=${bestEdge.evPercent.toFixed(1)}%, Model=${modelProb}%, Market=${impliedProb}%`);

  const prompt = `GAME: ${game.awayTeam} @ ${game.homeTeam}
OUR MODEL'S PICK: ${pickDesc} at ${bestEdge.odds > 0 ? '+' : ''}${bestEdge.odds}

⚠️ CRITICAL - USE THESE EXACT NUMBERS ⚠️
EXPECTED VALUE: +${bestEdge.evPercent.toFixed(1)}% EV (MUST USE THIS EXACT NUMBER)
MODEL PROBABILITY: ${modelProb}% (MUST USE THIS EXACT NUMBER)
MARKET IMPLIED PROBABILITY: ${impliedProb}% (MUST USE THIS EXACT NUMBER)

KEY FACTORS FROM OUR MODEL:
${topFactors}

INSTRUCTIONS:
Write 1-2 compelling sentences (30-50 words) that hook the reader with WHY this bet has value. Lead with the edge/mispricing. Use insider language like "the market is undervaluing...", "our model sees...", "this creates an inefficiency...". Be confident and contrarian.

⚠️ DATA INTEGRITY RULES ⚠️
1. You MUST use the EXACT percentages shown above (EV%, Model%, Market%)
2. Do NOT invent, change, or round these numbers
3. Do NOT reference ANY stats not explicitly provided (no records, shooting %, recent results)
4. If you mention probabilities, use THE EXACT numbers marked "MUST USE THIS EXACT NUMBER"
5. Focus ONLY on the factors provided in the bullet points

Return plain text only (no markdown, no JSON, no bold/italic).`;

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
            content: 'You are a top 1% sharp sports bettor explaining value to serious players. Write with confidence, specificity, and insider language. Never invent stats—only use what is provided.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 150,
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
 * Generate full story (2 paragraphs, 150-200 words, premium tone)
 */
async function generateFullStory(game, bestEdge, altBet, factors, altFactors, apiKey) {
  if (!bestEdge || !factors || factors.length === 0) {
    console.log(`⚠️ No edge data available for full story`);
    return null;
  }

  // Format primary bet (MONEYLINE ONLY)
  const primaryPick = `${bestEdge.team} ML`;

  // Format factors (bullets are already formatted strings)
  const primaryFactors = factors.slice(0, 5).map(f => `  ${f}`).join('\n');

  // Format alternative bet (MONEYLINE ONLY)
  let altSection = '';
  if (altBet && altFactors && altFactors.length > 0) {
    const altPick = `${altBet.team} ML`;
    const altFactorList = altFactors.slice(0, 5).map(f => `  ${f}`).join('\n');

    altSection = `
ALTERNATIVE BET: ${altPick} at ${altBet.odds > 0 ? '+' : ''}${altBet.odds} with +${altBet.evPercent.toFixed(1)}% EV
Supporting factors:
${altFactorList}`;
  }

  const modelProb = (bestEdge.modelProb * 100).toFixed(1);
  const impliedProb = ((1 / (bestEdge.odds < 0 
    ? (1 + (100 / Math.abs(bestEdge.odds)))
    : (1 + (bestEdge.odds / 100)))) * 100).toFixed(1);

  // Log exact numbers for debugging
  console.log(`   📊 Full Story: EV=${bestEdge.evPercent.toFixed(1)}%, Model=${modelProb}%, Market=${impliedProb}%`);

  const prompt = `GAME: ${game.awayTeam} @ ${game.homeTeam}

PRIMARY BET: ${primaryPick} at ${bestEdge.odds > 0 ? '+' : ''}${bestEdge.odds}

⚠️ CRITICAL - USE THESE EXACT NUMBERS ⚠️
EXPECTED VALUE: +${bestEdge.evPercent.toFixed(1)}% EV (MUST USE THIS EXACT NUMBER)
MODEL PROBABILITY: ${modelProb}% (MUST USE THIS EXACT NUMBER)
MARKET IMPLIED PROBABILITY: ${impliedProb}% (MUST USE THIS EXACT NUMBER)

KEY FACTORS FROM OUR MODEL:
${primaryFactors}${altSection}

INSTRUCTIONS:
Write EXACTLY 2 paragraphs (150-200 words total) that make readers feel they're getting premium betting service insights:

PARAGRAPH 1 (~80-100 words): Lead with THE EDGE. Explain why our model identifies value and what mispricing the market has. Use the factors above to show WHY this creates betting value. Be contrarian—what is the market missing?

PARAGRAPH 2 (~70-100 words): Supporting context and conviction. ${altBet ? 'Mention the alternative bet opportunity.' : 'Add supporting dynamics from the factors.'} End with conviction about the value at these odds.

TONE: Confident, insider, contrarian—like a top 1% sharp bettor. Use language like "our model sees...", "the market undervalues...", "this creates an inefficiency...". Focus on VALUE, not just analysis.

⚠️ DATA INTEGRITY RULES - EXTREMELY IMPORTANT ⚠️
1. You MUST use the EXACT percentages marked "MUST USE THIS EXACT NUMBER" - do not round or change them
2. If you mention EV%, Model%, or Market%, use ONLY those exact numbers from above
3. Do NOT invent ANY stats: no team records, shooting percentages, recent game results, player stats
4. Do NOT reference specific player names unless they appear in the factors above
5. If a stat wasn't provided above, DO NOT mention it
6. Focus ONLY on: xGF/60, xGA/60, GSAE, the EV%, probabilities above, and bullet point factors
7. Every number you write must come from the sections marked "MUST USE THIS EXACT NUMBER" or the bullet points

Return plain text only (no JSON, no markdown, no bold/italic, no **asterisks**).`;

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
            content: 'You are a top 1% sharp sports bettor providing premium analysis to serious players. Write with confidence and insider language. Never invent stats—only use provided data. Focus on VALUE and market inefficiencies.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 400,
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
            
            // Return BOTH allEdges and edgeCalculator so we can use getTopEdges() (same as UI)
            return { allEdges, dataProcessor, edgeCalculator };
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
    const { allEdges, dataProcessor, edgeCalculator } = edgeData;
    
    // Import generateBetNarrative dynamically to get factors array
    const { generateBetNarrative } = await import('../src/utils/narrativeGenerator.js');
    
    // Get topEdges using EXACT SAME LOGIC as the UI
    const topEdges = edgeCalculator.getTopEdges(0); // 0 = all edges, not just positive EV
    console.log(`✅ Got ${topEdges.length} total edge opportunities`);
    
    let narrativesSuccessCount = 0;
    let narrativesFailureCount = 0;

    for (const gameEdge of allEdges) {
      const gameInfo = games.find(g => 
        g.awayTeam === gameEdge.awayTeam && g.homeTeam === gameEdge.homeTeam
      );
      
      if (!gameInfo) continue;

      console.log(`⏳ Generating narratives: ${gameEdge.awayTeam} @ ${gameEdge.homeTeam}`);
      
      // Find best edge using EXACT SAME LOGIC as UI (TodaysGames.jsx line 2612)
      const bestEdge = topEdges
        .filter(e => e.game === gameEdge.game && e.evPercent > 0)
        .sort((a, b) => b.evPercent - a.evPercent)[0];

      if (!bestEdge || bestEdge.evPercent <= 0) {
        console.log('   ⚠️ No positive EV bet found - skipping');
        continue;
      }
      
      // Log the exact bestEdge data we're using (should match UI exactly)
      console.log(`   ✓ Best Edge: ${bestEdge.pick} at ${bestEdge.odds > 0 ? '+' : ''}${bestEdge.odds}`);
      console.log(`   ✓ EV: ${bestEdge.evPercent.toFixed(1)}%, Model: ${(bestEdge.modelProb * 100).toFixed(1)}%`);

      // Generate narrative data to get bullets (supporting factors)
      const narrativeData = generateBetNarrative(gameEdge, bestEdge, dataProcessor);
      
      if (!narrativeData || !narrativeData.bullets || narrativeData.bullets.length === 0) {
        console.log('   ⚠️ No narrative bullets available - skipping');
        narrativesFailureCount++;
        continue;
      }
      
      // Extract bullets (formatted factor strings) for Perplexity prompts
      const factors = narrativeData.bullets;

      // Find alternative bet using EXACT SAME LOGIC as UI
      const altBet = topEdges
        .filter(e => e.game === gameEdge.game && e.evPercent > 0 && e.team !== bestEdge.team)
        .sort((a, b) => b.evPercent - a.evPercent)[0];

      // Generate bet hook
      const betHook = await generateBetHook(gameInfo, bestEdge, factors, PERPLEXITY_API_KEY);
      if (betHook) {
        await cacheBetNarrative(gameEdge.awayTeam, gameEdge.homeTeam, betHook, 'bet-hook');
      }

      // Generate full story
      const fullStory = await generateFullStory(
        gameInfo, 
        bestEdge, 
        altBet, 
        factors,
        altBet ? factors : null,
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

