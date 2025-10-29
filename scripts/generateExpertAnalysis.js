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

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
// Note: fetch is built-in to Node.js 18+, no import needed

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase (for writing cache only)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get Perplexity API key from environment variable (GitHub Secret)
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

if (!PERPLEXITY_API_KEY) {
  console.error('❌ PERPLEXITY_API_KEY environment variable not set');
  console.error('ℹ️ Add PERPLEXITY_API_KEY as a GitHub Secret');
  process.exit(1);
}

/**
 * Get today's NHL games from schedule
 */
function getTodaysGames() {
  try {
    const schedulePath = join(__dirname, '../public/schedule-2025-moneypuck.csv');
    const scheduleData = readFileSync(schedulePath, 'utf-8');
    const lines = scheduleData.trim().split('\n');
    const headers = lines[0].split(',');
    
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    const games = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const row = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index]?.trim();
      });
      
      if (row.game_date === today) {
        games.push({
          awayTeam: row.away_team,
          homeTeam: row.home_team,
          date: row.game_date
        });
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
    
    // Clean markdown formatting
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let cards;
    try {
      cards = JSON.parse(content);
      if (!Array.isArray(cards)) {
        throw new Error('Response is not an array');
      }
      cards = cards.slice(0, 4); // Max 4 cards
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
  const now = new Date();
  const hour = now.getHours();
  const timeKey = hour >= 10 && hour < 16 ? 'morning' : 'pregame';
  
  const cacheKey = `${awayTeam}-${homeTeam}-${new Date().toISOString().split('T')[0]}-${timeKey}`;
  const cacheRef = doc(db, 'perplexityCache', cacheKey);

  try {
    await setDoc(cacheRef, {
      content: JSON.stringify(cards),
      timestamp: Date.now(),
      awayTeam,
      homeTeam,
      timeKey,
      generatedBy: 'github-action'
    });
    console.log(`✅ Cached analysis for ${awayTeam} @ ${homeTeam}`);
  } catch (error) {
    console.error(`❌ Failed to cache analysis for ${awayTeam} @ ${homeTeam}:`, error.message);
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

