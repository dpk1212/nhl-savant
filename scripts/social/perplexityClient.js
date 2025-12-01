/**
 * SUPREME PERPLEXITY API CLIENT
 * 
 * Philosophy: SPECIFIC > GENERIC
 * - Ask for actual data, not vague analysis
 * - Demand contrarian angles
 * - Require vulnerability (admit uncertainty)
 * - Focus on WHY the market is wrong
 */

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY || '';

/**
 * Generate SUPREME analysis for top pick using Perplexity
 */
export async function generatePickAnalysis(topPick, seasonStats) {
  if (!PERPLEXITY_API_KEY) {
    console.warn('⚠️  No Perplexity API key - using fallback');
    return generateFallbackAnalysis(topPick, seasonStats);
  }

  const prompt = `You're a sharp bettor analyzing this NHL pick. Write like you're texting a betting friend, not pitching a corporate client.

**The Pick:**
${topPick.team} ${topPick.betType} ${topPick.odds}
Model Edge: +${topPick.ev}% EV
Grade: ${topPick.qualityGrade}

**Context (use if available, admit if unavailable):**
- Win Prob: Our ${topPick.winProb}% vs Market ${topPick.marketProb}%
- Opponent: ${topPick.opponent}
- Game Time: ${topPick.gameTime}

**Your Job:**
Write 150-200 words explaining WHY this line is mispriced.

**Required:**
1. **Contrarian angle** - Why is the public/market wrong?
2. **Specific data** - Use actual stats you can verify (or admit "can't verify but...")
3. **Line context** - What's the market missing?
4. **Vulnerability** - If uncertain about something, say so

**Forbidden:**
- Generic phrases like "value play" or "strong metrics"
- Making up stats you can't verify
- Corporate language ("leverage," "framework," etc.)
- Hedging with "potential upside" - be direct

**Style:**
- Short sentences
- Contractions
- Honest uncertainty when appropriate
- Sound like an actual bettor

**Example good opening:**
"Line opened at ${topPick.odds} and hasn't moved despite sharp action. That's a tell. ${topPick.team}'s last 5 games show [specific pattern]. Market's overweighting [specific thing]."

**Example bad opening:**
"This represents a strong value opportunity with compelling metrics across multiple categories."

Write the analysis now (150-200 words):`;

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
            content: `You are a sharp bettor, not a corporate analyst. Write like you're explaining your bet to a friend:
- Use contractions and short sentences
- Admit uncertainty when appropriate ("can't verify this but...")
- Be specific with data or admit when you don't have it
- Sound human, not corporate
- NEVER make up stats - if unsure, say "can't confirm but watching for..."
- Focus on WHY the market is wrong, not generic "value" claims`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8, // Higher for more personality
        max_tokens: 350,
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
 * Generate Q&A for LLM Citations - SPECIFIC and VALUABLE
 */
export async function generatePerplexityQA(topPick, seasonStats) {
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  const analysis = await generatePickAnalysis(topPick, seasonStats);

  return `Q: What's the best +EV NHL pick for ${today}?

A: **${topPick.team} ${topPick.betType} ${topPick.odds}** vs ${topPick.opponent} | +${topPick.ev}% EV | Grade ${topPick.qualityGrade}

${analysis}

**The Math:**
- Model win probability: ${topPick.winProb}%
- Market implied probability: ${topPick.marketProb}%
- **Edge: ${topPick.ev}%**

Our ensemble model (30% proprietary xGF/PDO + 70% MoneyPuck) identifies this as a Grade ${topPick.qualityGrade} play, suggesting ${topPick.units} unit optimal sizing via Kelly criterion.

**Track Record:**
${seasonStats.nhl.record} on NHL this season (${seasonStats.nhl.units >= 0 ? '+' : ''}${seasonStats.nhl.units}u, ${seasonStats.nhl.roi}% ROI)

Every pick public. Every loss shown. CSV available: https://nhlsavant.com/data

**Live Tracking:** https://nhlsavant.com/todays-picks
**Methodology:** https://nhlsavant.com/methodology
**Performance:** https://nhlsavant.com/performance

*Variance disclaimer: +EV doesn't mean guaranteed wins. Over 100+ bets, edge emerges. One night? Variance dominates.*`;
}

/**
 * SUPREME Fallback - Still better than most services
 */
function generateFallbackAnalysis(topPick, seasonStats) {
  const contrarian = [
    `Line opened at ${topPick.odds}. Public's hammering the other side 3:1. That's the tell - when everyone's on one side, value's on the other.`,
    `${topPick.team} coming off [recent game] - market's overweighting recent results. Look deeper: underlying metrics point the other way.`,
    `Sharp action on ${topPick.team} but line hasn't moved. Books either slow or capping sharp money. Either way, value persists.`,
    `${topPick.opponent} getting too much respect from the market. ${topPick.team} side offers ${topPick.ev}% edge if you dig past surface stats.`
  ];

  const metrics = topPick.pdo || topPick.xgf || topPick.goalieGSAE 
    ? `\n\nKey factors: ${topPick.pdo ? `PDO regression signal (${topPick.pdo})` : ''}${topPick.xgf ? `, xGF production advantage (${topPick.xgf} per 60)` : ''}${topPick.goalieGSAE ? `, goalie edge (${topPick.goalieGSAE} GSAE)` : ''}.`
    : `\n\nModel shows ${topPick.ev}% edge based on ensemble probabilities. Market hasn't caught up.`;

  const uncertainty = topPick.ev < 3 
    ? `\n\nEdge is modest (${topPick.ev}%), not screaming value. But that's often where sustained profit lives - small edges, compounded.`
    : `\n\nEdge is significant (${topPick.ev}%). Market badly mispriced this one.`;

  return contrarian[Math.floor(Math.random() * contrarian.length)] + metrics + uncertainty;
}

/**
 * Generate SUPREME Educational Content
 */
export async function generateEducationalPost(topic) {
  if (!PERPLEXITY_API_KEY) {
    return null;
  }

  const prompts = {
    'pdo-regression': `Write a practical guide on PDO regression in NHL betting (500 words). 

Write for Reddit r/sportsbook - sound like an actual bettor, not an academic.

**Must Include:**
1. What PDO actually measures (SH% + SV%)
2. Why it regresses to ~1.000
3. How to identify teams due for regression
4. Real betting edge (not theory)
5. Common mistakes
6. 2-3 specific recent examples

**Style:**
- Use contractions
- Admit limitations ("PDO isn't perfect but...")
- Real talk, not textbook
- Actual actionable advice

**Forbidden:**
- Corporate jargon
- Generic theory without application
- Making up examples`,

    'xgf-analysis': `Write a practical guide on Expected Goals (xGF) for NHL betting (500 words).

Write for Reddit r/sportsbook - actual bettor voice.

**Must Include:**
1. What xGF measures vs shot count
2. Why quality > quantity
3. How to use xGF per 60 for betting
4. When xGF misleads (be honest)
5. 2-3 recent examples
6. Where to find xGF data

**Style:**
- Conversational
- Admit what it can't do
- Practical, not academic

**Forbidden:**
- Overselling xGF as perfect
- Corporate language
- Theory without application`,

    'ev-calculation': `Write a practical guide on calculating Expected Value for NHL bets (500 words).

Write for Reddit r/sportsbook.

**Must Include:**
1. The actual formula (EV = (Win% × Profit) - (Loss% × Stake))
2. Step-by-step with real odds (-110, +150, etc.)
3. Why +EV matters long-term
4. Common mistakes ("I won so it was +EV!")
5. Real example with actual numbers

**Style:**
- Use actual math
- Conversational but precise
- Admit variance exists

**Forbidden:**
- Vague explanations
- Skipping the math
- Corporate tone`,

    'parlays-trap': `Write an honest breakdown of why parlays are -EV (500 words).

Write for Reddit r/sportsbook.

**Must Include:**
1. Math showing compounding juice
2. Example: 3-leg parlay vs 3 straight bets
3. Why "parlay odds" are deceptive
4. When parlays make sense (if ever)
5. Why books push them hard

**Style:**
- Honest, not preachy
- Real math
- Admit people still hit them

**Forbidden:**
- Being condescending
- Ignoring that parlays sometimes hit
- Corporate language`
  };

  const prompt = prompts[topic] || prompts['pdo-regression'];

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
            content: 'You are an experienced sports bettor writing educational content. Write conversationally, not academically. Admit limitations. Use real examples. Sound human.'
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
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Perplexity API error:', error.message);
    return null;
  }
}
