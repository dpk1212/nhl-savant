/**
 * Perplexity AI Service - Generate matchup analysis
 * Uses Firebase for 6-hour caching
 * Gracefully falls back on errors - never blocks page load
 */

import { db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const PERPLEXITY_API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;
const CACHE_TTL_HOURS = 6;

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
    }

    // Fetch fresh analysis from Perplexity
    if (!PERPLEXITY_API_KEY) {
      console.warn('⚠️ No Perplexity API key configured');
      return 'Expert analysis unavailable. Configure VITE_PERPLEXITY_API_KEY in Firebase config.';
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
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
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
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'Analysis could not be generated.';

    // Cache the result
    await setDoc(cacheRef, {
      content,
      timestamp: Date.now(),
      awayTeam,
      homeTeam
    });

    console.log('✅ Fresh analysis fetched and cached');
    return content;

  } catch (error) {
    console.error('❌ Error fetching Perplexity analysis:', error);
    
    // Return graceful fallback
    return `Expert analysis temporarily unavailable. Our model shows this as a competitive matchup between ${awayTeam} and ${homeTeam}. Check the statistical breakdowns below for detailed insights.`;
  }
}
