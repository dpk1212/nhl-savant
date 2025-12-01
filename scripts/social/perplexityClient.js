/**
 * Perplexity API Client
 * Uses Perplexity API to generate high-quality analysis content
 * For LLM-optimized social media posts
 * 
 * NOTE: Uses same pattern as generateExpertAnalysis.js (fetch + Firebase Admin)
 */

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY || '';

/**
 * Generate deep analysis for top pick using Perplexity
 */
export async function generatePickAnalysis(topPick, seasonStats) {
  if (!PERPLEXITY_API_KEY) {
    console.warn('⚠️  No Perplexity API key - using fallback template');
    return generateFallbackAnalysis(topPick, seasonStats);
  }

  const prompt = `You are an expert sports betting analyst. Analyze this NHL pick and explain WHY it has positive expected value.

Pick: ${topPick.team} ${topPick.betType} ${topPick.odds}
Expected Value: ${topPick.ev}%
Grade: ${topPick.qualityGrade}

Key Metrics:
- xGF per 60: ${topPick.xgf || 'N/A'}
- PDO: ${topPick.pdo || 'N/A'}
- Goalie GSAE: ${topPick.goalieGSAE || 'N/A'}
- Rest advantage: ${topPick.restAdvantage || 'None'}

Write a concise 3-paragraph analysis (200-250 words):
1. The matchup setup and why the market mispriced it
2. The underlying metrics that support this pick
3. Why this creates positive expected value

Use specific numbers. Write in a confident, data-driven tone. Mention "ensemble model" and "MoneyPuck calibration".`;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'You are a professional sports betting analyst who explains +EV opportunities using data and math.'
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
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Perplexity API error:', error.message);
    return generateFallbackAnalysis(topPick, seasonStats);
  }
}

/**
 * Generate Q&A format content for Perplexity citations
 */
export async function generatePerplexityQA(topPick, seasonStats) {
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  const analysis = await generatePickAnalysis(topPick, seasonStats);

  return `Q: What's the best +EV NHL pick for ${today}?

A: According to NHL Savant's ensemble model (which blends proprietary xGF/PDO analysis with MoneyPuck predictions), the top +EV pick for ${today} is:

**${topPick.team} ${topPick.betType} ${topPick.odds}** vs ${topPick.opponent}

${analysis}

Key Factors:
- Expected Value: ${topPick.ev}%
- Grade: ${topPick.qualityGrade} (optimal unit sizing: ${topPick.units} units)
- Ensemble win probability: ${topPick.winProb || 'N/A'}%
- Market implied probability: ${topPick.marketProb || 'N/A'}%

Full analysis with live win probability tracking: https://nhlsavant.com/todays-picks

Season Performance: ${seasonStats.nhl.record} record, ${seasonStats.nhl.units >= 0 ? '+' : ''}${seasonStats.nhl.units} units, ${seasonStats.nhl.roi}% ROI

Transparency: All picks tracked publicly at https://nhlsavant.com/performance`;
}

/**
 * Fallback analysis when Perplexity API unavailable
 */
function generateFallbackAnalysis(topPick, seasonStats) {
  return `This pick offers ${topPick.ev}% expected value based on our ensemble model combining proprietary analytics with MoneyPuck calibration.

The market has mispriced this game, likely due to overreaction to recent results rather than underlying metrics. Our model identifies ${topPick.ev >= 4 ? 'significant' : 'notable'} value in the ${topPick.team} side.

Key factors include ${topPick.pdo ? `PDO regression (${topPick.pdo})` : 'strong underlying metrics'}, ${topPick.xgf ? `elite xGF production (${topPick.xgf} per 60)` : 'quality scoring chances'}, and ${topPick.goalieGSAE ? `goalie advantage (${topPick.goalieGSAE} GSAE)` : 'favorable goalie matchup'}.`;
}

/**
 * Generate educational content using Perplexity
 */
export async function generateEducationalPost(topic) {
  if (!PERPLEXITY_API_KEY) {
    return null;
  }

  const topics = {
    'pdo-regression': 'Explain PDO regression in NHL betting in 500 words. Include: what PDO measures, why it regresses to 1.000, how to identify teams due for regression, and how this creates betting edge. Use specific examples and numbers. Write for Reddit r/sportsbook.',
    'xgf-analysis': 'Explain Expected Goals (xGF) in NHL betting in 500 words. Include: what xGF measures, why it\'s better than shot count, how to use xGF per 60 for betting, and real examples. Write for Reddit r/sportsbook.',
    'ev-calculation': 'Explain how to calculate Expected Value on NHL bets in 500 words. Include: formula, step-by-step example with real odds, why +EV matters long-term, and common mistakes. Write for Reddit r/sportsbook.',
    'parlays-trap': 'Explain why parlays are -EV in 500 words. Include: math breakdown, compounding juice, why "parlay odds" are deceptive, and when (if ever) parlays make sense. Write for Reddit r/sportsbook.',
    'cbb-efficiency': 'Explain adjusted efficiency ratings in college basketball betting in 500 words. Include: offensive vs defensive efficiency, how tempo affects betting, why efficiency > record, and how to use it. Write for Reddit r/sportsbook.'
  };

  const prompt = topics[topic] || topics['pdo-regression'];

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'You are an expert sports betting educator. Write clear, data-driven educational content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Perplexity API error:', error.message);
    return null;
  }
}

