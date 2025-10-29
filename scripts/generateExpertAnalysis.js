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
// Note: fetch is built-in to Node.js 18+, no import needed

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
  const prompt = `Write 2-3 conversational analysis paragraphs (100-150 words each) for the ${awayTeam} @ ${homeTeam} NHL game.

Write like a human sports analyst writing a mini blog post, not a structured report. Use natural language, tell a story, provide context and conclusion. Be specific with player names, recent stats, and trends.

Return ONLY a valid JSON array with this format (no markdown, no explanation):
[
  {
    "analysis": "100-150 word paragraph in natural, conversational tone"
  }
]

Topics to cover (pick 2-3 most relevant):
1. Most significant matchup advantage - tell the story with recent context
2. Key factor that will determine the game - goaltending, special teams, momentum, injuries
3. Under-the-radar insight or betting angle - something casual bettors might miss

Write in complete sentences and paragraphs. Be conversational but analytical. Use player names and specific recent stats.`;

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
    
    let cards;
    try {
      cards = JSON.parse(content);
      if (!Array.isArray(cards)) {
        throw new Error('Response is not an array');
      }
      cards = cards.slice(0, 4); // Max 4 cards
      console.log(`✅ Parsed ${cards.length} cards from Perplexity`);
      
      // VALIDATE each card has only valid fields
      cards = cards.map((card, idx) => {
        if (!card || typeof card !== 'object') {
          throw new Error(`Card ${idx} is not an object: ${typeof card}`);
        }
        
        // Only allow 'analysis' field, remove any others
        return {
          analysis: String(card.analysis || '')
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

  // Generate analysis for each game
  let successCount = 0;
  let failureCount = 0;

  for (const game of games) {
    console.log(`⏳ Generating analysis: ${game.awayTeam} @ ${game.homeTeam}`);
    
    const cards = await generateAnalysis(game.awayTeam, game.homeTeam, PERPLEXITY_API_KEY);
    
    if (cards && cards.length > 0) {
      await cacheAnalysis(game.awayTeam, game.homeTeam, cards);
      successCount++;
      console.log('');
    } else {
      failureCount++;
      console.log(`⚠️ Skipped caching (generation failed)`);
      console.log('');
    }

    // Rate limiting: Wait 2 seconds between requests
    if (game !== games[games.length - 1]) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('');
  console.log('📈 Summary:');
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}`);
  console.log(`📊 Total: ${games.length}`);
  console.log('');
  console.log('✨ Expert Analysis Generation Complete');
}

// Run
main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});

