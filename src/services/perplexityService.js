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
    } else {
      console.warn('⚠️ Perplexity secret document not found in Firebase');
    }
  } catch (error) {
    console.warn('⚠️ Could not fetch Perplexity key from Firebase:', error.code);
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
        console.warn('⚠️ Cache read failed:', cacheError.code);
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
      console.warn('⚠️ Cache write failed (continuing without cache):', cacheError.code);
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
      console.log('ℹ️ Using fallback insight cards (no API key)');
      return [
        {
          icon: '🎯',
          title: 'Matchup Analysis',
          insight: `${awayTeam} and ${homeTeam} present contrasting styles. Check the detailed statistics below to identify key advantages in this matchup.`
        },
        {
          icon: '📊',
          title: 'Statistical Edge',
          insight: 'Advanced metrics reveal scoring opportunities. Review the visual analytics to understand expected goal differentials and shot quality advantages.'
        },
        {
          icon: '🥅',
          title: 'Key Factors',
          insight: 'Goaltending, special teams, and shot quality will determine this game. Explore the visual breakdowns for deeper insights.'
        }
      ];
    }

    console.log('⏳ Fetching fresh insight cards from Perplexity AI...');
    
    const prompt = `Generate 3-4 brief analytical insight cards (40-60 words each) for ${awayTeam} @ ${homeTeam} NHL game.

Return ONLY a valid JSON array with this exact format (no markdown, no explanation):
[
  {
    "icon": "🎯",
    "title": "Brief Title (2-4 words)",
    "insight": "40-60 word insight with specific numbers and analysis"
  }
]

Icon options: 🎯 (offense/scoring), 🥅 (goaltending), ⚡ (special teams), 🎖️ (advantage), 📊 (trends), 🔥 (momentum)

Focus on:
1. Biggest statistical edge (offense vs defense mismatch with numbers)
2. Goaltending advantage if significant (include SV% or GSAX)
3. Special teams or key trend (PP%, PK%, recent form)
4. Regression/momentum factor (if applicable)

Be specific with numbers. No generic statements. Each card should be actionable insight.`;

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
        max_tokens: 600,
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
    
    // Return fallback cards
    return [
      {
        icon: '🎯',
        title: 'Matchup Overview',
        insight: `${awayTeam} faces ${homeTeam} in what should be a competitive matchup. Review the statistical breakdowns below for detailed analysis.`
      },
      {
        icon: '📊',
        title: 'Key Metrics',
        insight: 'Expected goals, shot quality, and special teams effectiveness will be critical factors. Check the visual analytics for specific advantages.'
      },
      {
        icon: '🥅',
        title: 'Goaltending',
        insight: 'Goaltending performance could swing this game. Compare save percentages and recent form in the analysis below.'
      }
    ];
  }
}
