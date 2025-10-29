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
  
  const now = new Date();
  const hour = now.getHours();
  const timeKey = hour >= 10 && hour < 16 ? 'morning' : 'pregame';
  
  const cacheKey = `${awayTeam}-${homeTeam}-${new Date().toISOString().split('T')[0]}-${timeKey}`;
  const cacheRef = doc(db, 'perplexityCache', cacheKey);

  try {
    const cachedDoc = await getDoc(cacheRef);
    if (cachedDoc.exists()) {
      console.log('✅ Loaded Expert Analysis from cache');
      return JSON.parse(cachedDoc.data().content);
    } else {
      console.log('ℹ️ Expert Analysis not yet generated for this game');
    }
  } catch (error) {
    console.log('ℹ️ Expert Analysis not available:', error.code);
  }
  
  // NO API CALL - Client never generates content
  // Return empty array to show "Waiting" state
  return [];
}
