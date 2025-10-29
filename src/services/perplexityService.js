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
      console.log('ℹ️ Using fallback analysis (Perplexity API key not available)');
      // Return generic but professional fallback analysis
      return `This ${awayTeam} vs ${homeTeam} matchup features two competitive NHL teams bringing unique strengths to the ice. Both teams will look to leverage their systems and capitalize on scoring opportunities. Check the detailed statistical breakdowns below for comprehensive insights into expected goals, shot quality metrics, special teams advantages, and goaltending matchups that will influence this game's outcome.`;
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
    
    // Return graceful fallback
    return `Expert analysis temporarily unavailable. Our model shows this as a competitive matchup between ${awayTeam} and ${homeTeam}. Check the statistical breakdowns below for detailed insights.`;
  }
}

/**
 * Get AI-generated insight cards (structured JSON)
 * @param {string} awayTeam - Away team name
 * @param {string} homeTeam - Home team name
 * @param {boolean} forceRefresh - Bypass cache
 * @returns {Promise<Array>} Array of insight card objects
 */
export async function getMatchupInsightCards(awayTeam, homeTeam, forceRefresh = false) {
  // Determine time of day for caching (morning vs pregame)
  const now = new Date();
  const hour = now.getHours();
  const timeKey = hour >= 10 && hour < 16 ? 'morning' : 'pregame'; // 10am-4pm = morning, else pregame
  
  const cacheKey = `${awayTeam}-${homeTeam}-${new Date().toISOString().split('T')[0]}-${timeKey}`;
  const cacheRef = doc(db, 'perplexityCache', cacheKey);

  try {
    // Check cache first
    if (!forceRefresh) {
      try {
        const cachedDoc = await getDoc(cacheRef);
        if (cachedDoc.exists()) {
          const data = cachedDoc.data();
          const age = Date.now() - data.timestamp;
          const maxAge = 6 * 60 * 60 * 1000; // 6 hours
          
          if (age < maxAge) {
            console.log('✅ Using cached insight cards');
            return JSON.parse(data.content);
          }
        }
      } catch (cacheError) {
        console.warn('⚠️ Cache read failed:', cacheError.code);
      }
    }

    // Fetch API key from Firebase
    const apiKey = await getPerplexityKey();
    
    if (!apiKey) {
      console.log('ℹ️ Using fallback blog-style insights (no API key)');
      return [
        {
          analysis: `This ${awayTeam} at ${homeTeam} matchup presents some intriguing contrasts in playing styles. Both teams bring unique strengths to the ice, and the outcome will likely hinge on which team can impose their game plan more effectively. Looking at the advanced analytics below, you'll find clear advantages in certain areas that could prove decisive. Pay special attention to the offensive and defensive metrics—they tell an interesting story about how these two teams match up.`
        },
        {
          analysis: `The goaltending and special teams battle could be the difference-maker tonight. Both areas have been crucial for these teams this season, and we're seeing some significant differentials in the underlying numbers. The team that can capitalize on power play opportunities while staying disciplined will have a major edge. Check out the detailed breakdowns below to see exactly where the advantages lie.`
        }
      ];
    }

    console.log('⏳ Fetching fresh blog-style insights from Perplexity AI...');
    
    const prompt = `Write 2-3 conversational analysis paragraphs (100-150 words each) for the ${awayTeam} @ ${homeTeam} NHL game.

Write like a human sports analyst writing a mini blog post, not a structured report. Use natural language, tell a story, provide context and conclusion. Be specific with player names, recent stats, and trends.

Return ONLY a valid JSON array with this format (no markdown, no explanation):
[
  {
    "analysis": "100-150 word paragraph in natural, conversational tone"
  }
]

Topics to cover (pick 2-3 most relevant):
1. Most significant matchup advantage - tell the story with recent context (e.g., "Columbus has been struggling defensively over the past two weeks, giving up 3.8 goals per game while Toronto's top line has been on fire...")
2. Key factor that will determine the game - goaltending, special teams, momentum, injuries (tell the story naturally)
3. Under-the-radar insight or betting angle - something casual bettors might miss

Write in complete sentences and paragraphs. Be conversational but analytical. Use player names and specific recent stats.`;

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
      console.error('❌ Perplexity API Error Details:', errorText);
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || '[]';
    
    // Clean up markdown formatting if present
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse JSON
    let cards;
    try {
      cards = JSON.parse(content);
      if (!Array.isArray(cards)) {
        throw new Error('Response is not an array');
      }
      // Limit to 4 cards max
      cards = cards.slice(0, 4);
    } catch (parseError) {
      console.error('❌ Failed to parse insight cards JSON:', content);
      throw parseError;
    }

    // Cache the result
    try {
      await setDoc(cacheRef, {
        content: JSON.stringify(cards),
        timestamp: Date.now(),
        awayTeam,
        homeTeam,
        timeKey
      });
      console.log(`✅ Fresh insight cards fetched and cached (${timeKey})`);
    } catch (cacheError) {
      console.warn('⚠️ Cache write failed:', cacheError.code);
    }

    return cards;

  } catch (error) {
    console.error('❌ Error fetching insight cards:', error);
    
    // Return fallback blog-style insights
    return [
      {
        analysis: `Tonight's ${awayTeam} at ${homeTeam} game sets up as an interesting matchup with both teams bringing different strengths to the ice. The advanced metrics below reveal some key areas where one team has a clear edge. While we couldn't fetch the latest real-time analysis, the statistical breakdowns will give you a comprehensive view of how these teams match up in terms of offense, defense, goaltending, and special teams.`
      },
      {
        analysis: `Dive into the visual analytics below to understand the key factors that could determine this game. Pay close attention to the expected goals differential, shot quality metrics, and how each team's strengths align against their opponent's weaknesses. The data tells a compelling story about where the value might lie in this matchup.`
      }
    ];
  }
}
