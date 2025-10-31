/**
 * Perplexity AI Service - Generate matchup analysis
 * Uses Firebase for 6-hour caching
 * Gracefully falls back on errors - never blocks page load
 */

import { db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const CACHE_TTL_HOURS = 6;
let PERPLEXITY_API_KEY = null; // Will be fetched from Firestore

/**
 * Fetch Perplexity API key from Firebase Secrets collection
 * Caches in memory after first fetch for performance
 */
async function getPerplexityKey() {
  if (PERPLEXITY_API_KEY) return PERPLEXITY_API_KEY; // Use cached key
  
  try {
    const secretDoc = await getDoc(doc(db, 'Secrets', 'Perplexity'));
    if (secretDoc.exists()) {
      PERPLEXITY_API_KEY = secretDoc.data().Key;
      console.log('✅ Perplexity API key loaded from Firebase');
      return PERPLEXITY_API_KEY;
    }
  } catch (error) {
    // Expected: Firestore rules block client access to Secrets collection
    // This is intentional for security - API key should only be accessed server-side
    // Silently fail and use fallback content
  }
  
  return null;
}

/**
 * Get AI-generated matchup analysis
 * @param {string} awayTeam - Away team name
 * @param {string} homeTeam - Home team name
 * @param {boolean} forceRefresh - Bypass cache
 * @returns {Promise<string>} Analysis text
 */
export async function getMatchupAnalysis(awayTeam, homeTeam, forceRefresh = false) {
  const cacheKey = `${awayTeam}-${homeTeam}-${new Date().toISOString().split('T')[0]}`;
  const cacheRef = doc(db, 'perplexityCache', cacheKey);

  try {
    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      try {
        const cachedDoc = await getDoc(cacheRef);
        if (cachedDoc.exists()) {
          const data = cachedDoc.data();
          const age = Date.now() - data.timestamp;
          const maxAge = CACHE_TTL_HOURS * 60 * 60 * 1000;
          
          if (age < maxAge) {
            console.log('✅ Using cached Perplexity analysis');
            return data.content;
          }
        }
      } catch (cacheError) {
        // Silently fail if cache read is blocked - will fetch fresh or use fallback
      }
    }

    // Fetch API key from Firebase Secrets
    const apiKey = await getPerplexityKey();
    
    if (!apiKey) {
      console.log('ℹ️ No Perplexity API key - waiting for scheduled generation');
      return null; // Return null so component shows "Waiting" state
    }

    console.log('⏳ Fetching fresh analysis from Perplexity AI...');
    
    const prompt = `Provide a concise, expert-level NHL matchup analysis (250-300 words) for today's game between the ${awayTeam} and the ${homeTeam}. Focus on:
- Recent team form and momentum
- Key player matchups and injuries
- Offensive/defensive strengths and weaknesses
- Goaltending matchup
- Special teams advantages
- Critical trends or patterns
Write in a professional, analytical tone suitable for sports bettors. Be specific and data-driven.`;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',  // Try base sonar model (most compatible)
        messages: [
          {
            role: 'system',
            content: 'You are an expert NHL analyst providing professional matchup analysis for sports bettors.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Perplexity API Error Details:', errorText);
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'Analysis could not be generated.';

    // Try to cache the result (ignore if permissions fail)
        try {
          await setDoc(cacheRef, {
            content,
            timestamp: Date.now(),
            awayTeam,
            homeTeam
          });
          console.log('✅ Fresh analysis fetched and cached');
        } catch (cacheError) {
          // Silently fail if cache write is blocked - analysis still returned successfully
        }

    return content;

  } catch (error) {
    console.error('❌ Error fetching Perplexity analysis:', error);
    return null; // Return null so component shows "Waiting" state
  }
}

/**
 * Get AI-generated insight cards (structured JSON)
 * CLIENT-SIDE: ONLY reads from cache, NEVER calls API
 * GitHub Action generates content and writes to cache
 * 
 * @param {string} awayTeam - Away team name
 * @param {string} homeTeam - Home team name
 * @returns {Promise<Array>} Array of insight card objects from cache, or empty array
 */
export async function getMatchupInsightCards(awayTeam, homeTeam) {
  // CLIENT-SIDE: ONLY reads from cache, NEVER calls API
  // GitHub Action generates content and writes to cache
  
  // SIMPLIFIED: No timeKey - just use date (we only generate once per day)
  const cacheKey = `${awayTeam}-${homeTeam}-${new Date().toISOString().split('T')[0]}`;
  const cacheRef = doc(db, 'perplexityCache', cacheKey);

  console.log('🔍 Looking for Expert Analysis:', {
    awayTeam,
    homeTeam,
    cacheKey
  });

  try {
    const cachedDoc = await getDoc(cacheRef);
    if (cachedDoc.exists()) {
      console.log('✅ Found cached document:', cachedDoc.data());
      const content = cachedDoc.data().content;
      console.log('📄 Content type:', typeof content);
      console.log('📄 Content preview:', content.substring(0, 100));
      
      const parsed = JSON.parse(content);
      console.log('✅ Parsed', parsed.length, 'insight cards');
      return parsed;
    } else {
      console.log('❌ No cached document found at:', cacheKey);
    }
  } catch (error) {
    console.error('❌ Error loading Expert Analysis:', error);
  }
  
  // NO API CALL - Client never generates content
  // Return empty array to show "Waiting" state
  return [];
}

/**
 * Fetch confirmed starting goalies for today's NHL games using Perplexity AI
 * Searches real-time sources: DailyFaceoff, beat reporters, team announcements
 * 
 * @param {string} date - Date in YYYY-MM-DD format (default: today)
 * @returns {Promise<Object>} Goalies data with games array
 */
export async function fetchStartingGoalies(date = null) {
  const targetDate = date || new Date().toISOString().split('T')[0];
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
        return data.goalies;
      }
    }

    // Fetch API key from Firebase
    const apiKey = await getPerplexityKey();
    if (!apiKey) {
      console.log('ℹ️ No Perplexity API key available');
      return null;
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
    
    // Clean up response - remove markdown code blocks if present
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
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
      goalies: goaliesData,
      timestamp: Date.now()
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
