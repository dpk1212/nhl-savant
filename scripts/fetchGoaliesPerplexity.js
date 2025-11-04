/**
 * Fetch Starting Goalies - Using Perplexity AI
 * 
 * PURPOSE:
 * - Fetches confirmed starting goalies for today's games
 * - Uses Perplexity AI to search DailyFaceoff, beat reporters, team announcements
 * - Caches in Firebase and saves to public/starting_goalies.json
 * 
 * USAGE:
 * - Manual: npm run fetch-goalies
 * - Local: node scripts/fetchGoaliesPerplexity.js [YYYY-MM-DD]
 * 
 * REQUIREMENTS:
 * - .env file with Firebase credentials
 * - Perplexity API key in Firebase Secrets collection OR PERPLEXITY_API_KEY env var
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
dotenv.config();

// Initialize Firebase using .env credentials (SAME AS CLIENT APP)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Missing Firebase credentials in .env file');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log(`✅ Firebase initialized: ${firebaseConfig.projectId}`);

/**
 * Get Perplexity API key from Firebase or environment
 */
async function getPerplexityKey() {
  // Try environment variable first
  if (process.env.PERPLEXITY_API_KEY) {
    console.log('✅ Using Perplexity API key from environment variable');
    return process.env.PERPLEXITY_API_KEY;
  }

  // Try Firebase Secrets collection
  try {
    const secretsRef = doc(db, 'Secrets', 'Perplexity');
    const secretDoc = await getDoc(secretsRef);
    
    if (secretDoc.exists()) {
      const key = secretDoc.data().Key;
      if (key) {
        console.log('✅ Using Perplexity API key from Firebase Secrets');
        return key;
      }
    }
  } catch (error) {
    console.warn('⚠️  Could not fetch from Firebase Secrets:', error.message);
  }

  return null;
}

/**
 * Fetch confirmed starting goalies using Perplexity AI
 */
async function fetchStartingGoalies(targetDate, apiKey) {
  const cacheKey = `starting-goalies-${targetDate}`;
  const cacheRef = doc(db, 'perplexityCache', cacheKey);

  try {
    // Check cache first (30 min TTL for goalie data - they update frequently)
    const cachedDoc = await getDoc(cacheRef);
    if (cachedDoc.exists()) {
      const data = cachedDoc.data();
      const age = Date.now() - data.timestamp;
      const maxAge = 30 * 60 * 1000; // 30 minutes
      
      if (age < maxAge) {
        console.log('✅ Using cached goalie data');
        const goaliesData = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
        return goaliesData;
      }
    }

    console.log(`⏳ Fetching starting goalies for ${targetDate} from Perplexity AI...`);
    
    const prompt = `List ALL confirmed starting goalies for NHL games on ${targetDate}. 
For each game, provide:
- Away team code (3 letters, e.g., BUF)
- Away goalie full name
- Home team code (3 letters, e.g., BOS)  
- Home goalie full name

Search DailyFaceoff, team beat reporters on Twitter/X, and official team announcements.
Format as JSON array:
[
  {"awayTeam": "BUF", "awayGoalie": "Alex Lyon", "homeTeam": "BOS", "homeGoalie": "Joonas Korpisalo"},
  {"awayTeam": "CGY", "awayGoalie": "Dan Vladar", "homeTeam": "OTT", "homeGoalie": "Linus Ullmark"}
]

IMPORTANT: 
- Only include games with confirmed starters
- If a goalie is not yet confirmed, set to null
- Use proper team codes (TOR not TO, TBL not TB, LAK not LA, SJS not SJ, VGK not VEG)
- Return ONLY the JSON array, no other text`;

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
            content: 'You are an NHL data assistant. Always return valid JSON arrays with no markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2, // Low temperature for factual data
        max_tokens: 1500,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Perplexity API Error:', errorText);
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || '[]';
    
    console.log(`📥 Raw Perplexity response (first 300 chars):`, content.substring(0, 300));
    
    // Clean up response - remove markdown code blocks if present
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    console.log(`🔧 Cleaned content (first 300 chars):`, content.substring(0, 300));
    
    // Parse JSON response
    const gamesArray = JSON.parse(content);
    
    console.log(`📊 Parsed ${gamesArray.length} games from Perplexity`);
    
    // Format for starting_goalies.json
    const goaliesData = {
      date: targetDate,
      lastUpdated: new Date().toISOString(),
      source: 'Perplexity AI (DailyFaceoff, beat reporters)',
      games: gamesArray.map((game, idx) => ({
        gameId: `game_${idx}`,
        matchup: `${game.awayTeam} @ ${game.homeTeam}`,
        time: 'TBD',
        away: {
          team: game.awayTeam,
          goalie: game.awayGoalie
        },
        home: {
          team: game.homeTeam,
          goalie: game.homeGoalie
        }
      }))
    };

    // Cache the result
    await setDoc(cacheRef, {
      content: JSON.stringify(goaliesData),
      timestamp: Date.now(),
      date: targetDate,
      generatedBy: 'fetch-goalies-script'
    });

    console.log(`✅ Fetched ${goaliesData.games.length} games with starting goalies`);
    
    // Log confirmation summary
    let confirmedCount = 0;
    goaliesData.games.forEach(game => {
      if (game.away.goalie) confirmedCount++;
      if (game.home.goalie) confirmedCount++;
    });
    console.log(`🥅 ${confirmedCount}/${goaliesData.games.length * 2} goalies confirmed`);
    
    return goaliesData;

  } catch (error) {
    console.error('❌ Error fetching goalies from Perplexity:', error);
    return null;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🥅 PERPLEXITY - NHL Starting Goalies Fetch');
  console.log('='.repeat(70));
  console.log('');

  // Get Perplexity API key
  const apiKey = await getPerplexityKey();
  
  if (!apiKey) {
    console.error('❌ No Perplexity API key available');
    console.error('');
    console.error('Options:');
    console.error('1. Add PERPLEXITY_API_KEY to your .env file');
    console.error('2. Add to Firebase: Secrets collection → Perplexity document → Key field');
    console.error('');
    process.exit(1);
  }

  // Get target date from args or use today (ET)
  // CRITICAL FIX: Use ET date for consistency
  let targetDate = process.argv[2];
  if (!targetDate) {
    const etDateStr = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const [month, day, year] = etDateStr.split('/');
    targetDate = `${year}-${month}-${day}`;
  }
  console.log(`📅 Fetching starting goalies for ${targetDate} (ET)\n`);

  // Fetch goalies using Perplexity AI
  const goaliesData = await fetchStartingGoalies(targetDate, apiKey);

  if (goaliesData) {
    // Save to public/starting_goalies.json
    const filePath = join(__dirname, '../public/starting_goalies.json');
    writeFileSync(filePath, JSON.stringify(goaliesData, null, 2), 'utf8');
    console.log(`\n💾 Saved to: ${filePath}\n`);
    console.log('✅ SUCCESS - Goalie data updated!');
  } else {
    console.log('\n❌ FAILED to fetch goalie data.');
    process.exit(1);
  }
}

// Run
main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
