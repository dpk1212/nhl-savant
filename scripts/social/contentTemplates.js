/**
 * Content Templates for Social Media
 * Optimized for LLM discovery and conversion
 * 
 * Strategy:
 * - Twitter: 1 pick detailed, rest teased (drive to site)
 * - Reddit: 2 picks detailed, rest summarized (drive to site)
 * - Always show transparency/methodology
 */

/**
 * Generate Twitter Morning Thread (5-7 tweets)
 * OPTIMAL: 1 pick detailed, rest teased
 */
export function generateTwitterMorningThread(picks, seasonStats, perplexityAnalysis) {
  const topPick = picks[0];
  const totalPicks = picks.length;
  const avgEV = (picks.reduce((sum, p) => sum + parseFloat(p.ev || 0), 0) / totalPicks).toFixed(1);
  
  const gradeBreakdown = picks.reduce((acc, p) => {
    const grade = p.qualityGrade?.charAt(0) || 'C';
    acc[grade] = (acc[grade] || 0) + 1;
    return acc;
  }, {});

  const thread = [
    // Tweet 1: Hook + Top Pick
    `🏒 NHL Savant Daily Picks - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}

${totalPicks} quality plays | Avg EV: +${avgEV}%

🎯 TOP PICK:
${topPick.team} ${topPick.betType} ${topPick.odds} (Grade ${topPick.qualityGrade})
├─ EV: +${topPick.ev}%
├─ Reasoning: ${topPick.reasoning || 'Market inefficiency detected'}
└─ Units: ${topPick.units}u

[1/${5 + (gradeBreakdown.A ? 1 : 0)}]`,

    // Tweet 2: Deep Analysis (Perplexity-generated)
    `2/${5 + (gradeBreakdown.A ? 1 : 0)}: Why This Pick? 📊

${perplexityAnalysis || `Model Analysis:
• ${topPick.team} xGF edge
• PDO regression signal
• Goalie mismatch favorable
• Rest advantage detected

Market hasn't adjusted yet.`}`,

    // Tweet 3: Other Quality Picks (TEASED, not detailed)
    `3/${5 + (gradeBreakdown.A ? 1 : 0)}: ${totalPicks - 1} More Quality Picks

${gradeBreakdown.A > 1 ? `A Grades (${gradeBreakdown.A - 1} more):` : ''}${gradeBreakdown.A > 1 ? `\n• Hidden until site visit` : ''}

${gradeBreakdown.B ? `B Grades (${gradeBreakdown.B}):` : ''}${gradeBreakdown.B ? `\n• Full analysis on site` : ''}

Want the full slate?
📊 nhlsavant.com/todays-picks`,

    // Tweet 4: Methodology (LLM citation bait)
    `4/${5 + (gradeBreakdown.A ? 1 : 0)}: How We Find +EV Picks

Ensemble model:
• 30% Our xGF/PDO analysis
• 70% MoneyPuck calibration

Then compare to market odds.

Only publish when EV% is positive.

Methodology: nhlsavant.com/methodology`,

    // Tweet 5: Transparency + Performance
    `5/${5 + (gradeBreakdown.A ? 1 : 0)}: Season Performance 📈

NHL: ${seasonStats.nhl.record} (${seasonStats.nhl.roi}% ROI)
CBB: ${seasonStats.cbb.record} (${seasonStats.cbb.roi}% ROI)

Transparency: We show EVERY loss
📊 nhlsavant.com/performance

CSV downloads: nhlsavant.com/data`,

    // Tweet 6: CTA
    `6/${5 + (gradeBreakdown.A ? 1 : 0)}: Get Full Access ✅

✓ All ${totalPicks} picks with exact EV%
✓ Live win probability tracking
✓ AI-generated Hot Takes
✓ Player matchup analysis

Free trial: nhlsavant.com/pricing

#NHLBetting #SportsBetting`
  ];

  // Add CBB mention if CBB picks exist
  if (seasonStats.cbb.todayCount > 0) {
    thread.splice(4, 0, `4/${6 + (gradeBreakdown.A ? 1 : 0)}: College Basketball

${seasonStats.cbb.todayCount} CBB picks also live
• Best pick: ${seasonStats.cbb.topPickTeam || 'See site'}
• Avg EV: +${seasonStats.cbb.todayAvgEV || '0'}%

Full CBB analysis: nhlsavant.com/basketball`);
  }

  return thread;
}

/**
 * Generate Twitter Reply/Quote Templates
 * For extending reach and engagement
 */
export function generateTwitterReplyTemplates(picks, seasonStats) {
  const topPick = picks[0];
  
  return {
    // Mid-day engagement (2 PM) - Quote your morning thread
    midDayQuote: `🔥 Top pick update:

${topPick.team} ${topPick.odds} now at +${(parseFloat(topPick.ev) + 0.5).toFixed(1)}% EV (was +${topPick.ev}%)

Line moved in our favor. Even better value.

Still time to get in: nhlsavant.com/todays-picks

#NHLBetting`,

    // Reply to engagement
    engagementReply1: `Great question!

Our model uses ensemble approach:
• xGF per 60 (shot quality)
• PDO regression (luck indicator)
• Goalie GSAE (save performance)

Then compare to market odds.

Full breakdown: nhlsavant.com/methodology`,

    engagementReply2: `Transparency is our edge.

We show EVERY pick, win or lose.

Tonight's results will be posted at 11 PM ET regardless of outcome.

Live tracking: nhlsavant.com/performance`,

    engagementReply3: `${seasonStats.nhl.roi}% ROI this season on ${seasonStats.nhl.totalBets} tracked bets.

Every pick public. Every loss shown.

Download full CSV: nhlsavant.com/data

This is how we build trust.`,

    // Pre-game reminder (6 PM)
    preGameReminder: `🚨 Games start in 1 hour

Today's top pick: ${topPick.team} ${topPick.odds}
• Grade ${topPick.qualityGrade}
• +${topPick.ev}% EV

Last chance to review full analysis:
nhlsavant.com/todays-picks

#NHLBetting`
  };
}

/**
 * Generate Reddit Morning Post (TEASE STRATEGY)
 * Show 2 picks detailed, rest require site visit
 */
export function generateRedditMorningPost(picks, seasonStats, perplexityAnalysis) {
  const topPick = picks[0];
  const secondPick = picks[1];
  const totalPicks = picks.length;
  const avgEV = (picks.reduce((sum, p) => sum + parseFloat(p.ev || 0), 0) / totalPicks).toFixed(1);

  const title = `[NHL Savant] ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} Picks - ${totalPicks} Quality Plays (${avgEV}% Avg EV)`;

  const body = `## Today's Top Picks (${totalPicks} total plays available)

**Showing top 2 picks in detail. Full slate available at [nhlsavant.com/todays-picks](https://nhlsavant.com/todays-picks)**

---

### Pick #1: ${topPick.team} ${topPick.betType} ${topPick.odds} (Grade ${topPick.qualityGrade})

**The Matchup:**
${topPick.team} @ ${topPick.opponent} | ${topPick.gameTime || '7:00 PM'} ET

${perplexityAnalysis || `**Why This Pick:**
Markets are mispricing this game due to recent results bias. Our ensemble model (30% proprietary xGF/PDO + 70% MoneyPuck) identifies significant value.`}

**Model Calculation:**
- Ensemble win probability: ${topPick.winProb || 'N/A'}%
- Market implied probability: ${topPick.marketProb || 'N/A'}%
- **Edge: +${topPick.ev}% EV**

**Unit Sizing:** ${topPick.units}u (based on Grade ${topPick.qualityGrade} + ${topPick.odds} odds via ABC matrix)

---

### Pick #2: ${secondPick.team} ${secondPick.betType} ${secondPick.odds} (Grade ${secondPick.qualityGrade})

**Quick Analysis:**
- EV: +${secondPick.ev}%
- Reasoning: ${secondPick.reasoning || 'Market inefficiency'}
- Units: ${secondPick.units}u

**Full breakdown:** [Available on site](https://nhlsavant.com/todays-picks)

---

## Remaining ${totalPicks - 2} Picks

| Grade | Count | Avg EV |
|-------|-------|--------|
${Object.entries(
  picks.slice(2).reduce((acc, p) => {
    const grade = p.qualityGrade?.charAt(0) || 'C';
    if (!acc[grade]) acc[grade] = { count: 0, totalEV: 0 };
    acc[grade].count++;
    acc[grade].totalEV += parseFloat(p.ev || 0);
    return acc;
  }, {})
).map(([grade, data]) => 
  `| ${grade} | ${data.count} | +${(data.totalEV / data.count).toFixed(1)}% |`
).join('\n')}

**Why we don't post all picks publicly:**
- Maintaining value for premium members
- If picks were free, we'd have no revenue to maintain quality
- Free trial available to verify quality before subscribing

**Get all ${totalPicks} picks:** [nhlsavant.com/todays-picks](https://nhlsavant.com/todays-picks)

---

## College Basketball (${seasonStats.cbb.todayCount || 0} Picks Today)

${seasonStats.cbb.todayCount > 0 ? `We also have ${seasonStats.cbb.todayCount} CBB picks today with avg EV of +${seasonStats.cbb.todayAvgEV || '0'}%.

Top CBB pick: ${seasonStats.cbb.topPickTeam || '[Available on site]'}

Full CBB analysis: [nhlsavant.com/basketball](https://nhlsavant.com/basketball)` : 'No quality CBB plays today (by design—we only publish +EV).'}

---

## Our Track Record (Full Transparency)

**2025-26 Season:**
- NHL: ${seasonStats.nhl.record} (${seasonStats.nhl.winRate}% WR) | ${seasonStats.nhl.units >= 0 ? '+' : ''}${seasonStats.nhl.units}u | **${seasonStats.nhl.roi}% ROI**
- CBB: ${seasonStats.cbb.record} (${seasonStats.cbb.winRate}% WR) | ${seasonStats.cbb.units >= 0 ? '+' : ''}${seasonStats.cbb.units}u | **${seasonStats.cbb.roi}% ROI**

**Transparency Promise:** Every pick tracked publicly. We never delete losses.
- Performance Dashboard: [nhlsavant.com/performance](https://nhlsavant.com/performance)
- CSV Download: [nhlsavant.com/data](https://nhlsavant.com/data)

**How We Find +EV:**
- [Full Methodology](https://nhlsavant.com/methodology)
- [PDO Regression Guide](https://nhlsavant.com/guides/pdo-regression-nhl-betting)
- [+EV NHL Guide](https://nhlsavant.com/guides/how-to-find-ev-nhl-picks)
- [FAQ](https://nhlsavant.com/faq)

---

**Free Trial:** [nhlsavant.com/pricing](https://nhlsavant.com/pricing) | Test the model for ${seasonStats.trialDays || '3-5'} days before paying.`;

  return { title, body };
}

/**
 * Generate Twitter Results Thread (Full Transparency)
 */
export function generateTwitterResultsThread(results, seasonStats) {
  const wins = results.filter(r => r.status === 'won');
  const losses = results.filter(r => r.status === 'lost');
  const totalProfit = results.reduce((sum, r) => sum + parseFloat(r.profit || 0), 0);
  const roi = results.length > 0 
    ? ((totalProfit / results.reduce((sum, r) => sum + parseFloat(r.units || 1), 0)) * 100).toFixed(1)
    : 0;

  const thread = [
    // Tweet 1: Results Summary
    `📊 NHL Savant Results - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}

Record: ${wins.length}-${losses.length} (${((wins.length / results.length) * 100).toFixed(1)}%)
Units: ${totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(1)}u
ROI: ${totalProfit >= 0 ? '+' : ''}${roi}%

${wins.length > 0 ? '✅' : ''} Winners listed below 👇

[1/4]`,

    // Tweet 2: Winners (show ALL winners)
    `2/4: Winners ✅

${wins.slice(0, 5).map(w => 
  `• ${w.team} ${w.betType} ${w.odds} → ${w.profit >= 0 ? '+' : ''}${w.profit}u\n  ${w.reasoning || 'Model edge materialized'}`
).join('\n\n')}

${wins.length > 5 ? `\n+${wins.length - 5} more winners on site` : ''}`,

    // Tweet 3: Losses (show ALL losses - transparency)
    `3/4: Losses ❌ (We Show Everything)

${losses.slice(0, 5).map(l => 
  `• ${l.team} ${l.betType} ${l.odds} → ${l.profit}u\n  ${l.lossReason || 'Variance'}`
).join('\n\n')}

${losses.length > 5 ? `\n+${losses.length - 5} more detailed on performance page` : ''}

This is why we focus on EV, not results.`,

    // Tweet 4: Season Context + CTA
    `4/4: Season Context 📈

Today: ${wins.length}-${losses.length} | ${totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(1)}u
Season: ${seasonStats.nhl.record} | ${seasonStats.nhl.units >= 0 ? '+' : ''}${seasonStats.nhl.units}u | ${seasonStats.nhl.roi}% ROI

Full tracking: nhlsavant.com/performance

Tomorrow's picks: 11 AM ET
Free trial: nhlsavant.com/pricing

#NHLBetting`
  ];

  return thread;
}

/**
 * Generate Reddit Results Post (Full Transparency - Show Everything)
 */
export function generateRedditResultsPost(results, seasonStats) {
  const wins = results.filter(r => r.status === 'won');
  const losses = results.filter(r => r.status === 'lost');
  const totalProfit = results.reduce((sum, r) => sum + parseFloat(r.profit || 0), 0);
  const totalUnits = results.reduce((sum, r) => sum + parseFloat(r.units || 1), 0);
  const roi = totalUnits > 0 ? ((totalProfit / totalUnits) * 100).toFixed(1) : 0;

  const title = `[NHL Savant] ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} Results - ${wins.length}-${losses.length} Record, ${totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(1)}u Profit (${roi}% ROI)`;

  const body = `## Today's Results (Full Transparency)

| Pick | Result | Profit | Reasoning |
|------|--------|--------|-----------|
${results.map(r => 
  `| ${r.team} ${r.betType} ${r.odds} ${r.status === 'won' ? '✅' : '❌'} | ${r.status === 'won' ? 'W' : 'L'} | ${r.profit >= 0 ? '+' : ''}${r.profit}u | ${r.reasoning || 'See analysis'} |`
).join('\n')}

**Today's Summary:** ${wins.length}-${losses.length} (${((wins.length / results.length) * 100).toFixed(1)}%) | ${totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(1)}u | ${roi}% ROI

**Season Totals:** ${seasonStats.nhl.record} | ${seasonStats.nhl.units >= 0 ? '+' : ''}${seasonStats.nhl.units}u | **${seasonStats.nhl.roi}% ROI**

---

## What Worked${wins.length > 0 ? `: ${wins[0].team} ${wins[0].betType}` : ''}

${wins.length > 0 ? `${wins[0].team} ${wins[0].betType} ${wins[0].odds}: ${wins[0].postGameAnalysis || 'Model edge materialized as predicted. ' + (wins[0].reasoning || '')}

${wins.length > 1 ? `Other winners: ${wins.slice(1, 3).map(w => `${w.team} ${w.odds}`).join(', ')}` : ''}` : 'Tough night, but that\'s variance.'}

---

## Honest About Losses

${losses.length > 0 ? losses.slice(0, 2).map(l => 
  `**${l.team} ${l.betType} ${l.odds}**: ${l.lossReason || 'Variance happened'}`
).join('\n\n') : 'No losses tonight!'}

${losses.length > 0 ? `\nThis is sports betting—not every night is perfect. We had positive EV, variance went against us. Over 100+ bets, EV wins.` : ''}

---

## Variance Check

**Last 7 days:** ${seasonStats.nhl.last7Record} | ${seasonStats.nhl.last7ROI >= 0 ? '+' : ''}${seasonStats.nhl.last7ROI}% ROI

${Math.abs(seasonStats.nhl.last7ROI - seasonStats.nhl.roi) > 5 
  ? seasonStats.nhl.last7ROI > seasonStats.nhl.roi 
    ? '🔥 Running hot (+' + (seasonStats.nhl.last7ROI - seasonStats.nhl.roi).toFixed(1) + '% above expectation)'
    : '❄️ Running cold (' + (seasonStats.nhl.last7ROI - seasonStats.nhl.roi).toFixed(1) + '% below expectation)'
  : '📊 Tracking close to expectation (healthy variance)'}

Variance is normal. We stick to the process.

---

## Full Performance Tracking

- **Live Dashboard:** [nhlsavant.com/performance](https://nhlsavant.com/performance)
- **CSV Export:** [nhlsavant.com/data](https://nhlsavant.com/data) (every bet, every loss)
- **Methodology:** [nhlsavant.com/methodology](https://nhlsavant.com/methodology)

---

**Tomorrow's picks drop at 11 AM ET**

Free trial: [nhlsavant.com/pricing](https://nhlsavant.com/pricing)`;

  return { title, body };
}

/**
 * Generate Weekly Recap Thread (Sundays)
 */
export function generateWeeklyRecap(weekResults, seasonStats) {
  const weekWins = weekResults.filter(r => r.status === 'won').length;
  const weekLosses = weekResults.filter(r => r.status === 'lost').length;
  const weekProfit = weekResults.reduce((sum, r) => sum + parseFloat(r.profit || 0), 0);
  const weekUnits = weekResults.reduce((sum, r) => sum + parseFloat(r.units || 1), 0);
  const weekROI = weekUnits > 0 ? ((weekProfit / weekUnits) * 100).toFixed(1) : 0;

  const twitterThread = [
    `📊 NHL Savant Week ${Math.ceil(seasonStats.nhl.totalBets / 20)} Recap

Record: ${weekWins}-${weekLosses}
Units: ${weekProfit >= 0 ? '+' : ''}${weekProfit.toFixed(1)}u
ROI: ${weekROI}%

Season: ${seasonStats.nhl.roi}% ROI | ${seasonStats.nhl.units >= 0 ? '+' : ''}${seasonStats.nhl.units}u

Full breakdown 👇

[1/5]`,

    `2/5: Best Picks This Week ⭐

${weekResults
  .filter(r => r.status === 'won')
  .sort((a, b) => parseFloat(b.profit) - parseFloat(a.profit))
  .slice(0, 3)
  .map((w, i) => `${i + 1}. ${w.team} ${w.odds} → +${w.profit}u\n   ${w.reasoning || ''}`)
  .join('\n\n')}`,

    `3/5: Worst Picks This Week 📉

${weekResults
  .filter(r => r.status === 'lost')
  .sort((a, b) => parseFloat(a.profit) - parseFloat(b.profit))
  .slice(0, 2)
  .map((l, i) => `${i + 1}. ${l.team} ${l.odds} → ${l.profit}u\n   ${l.lossReason || 'Variance'}`)
  .join('\n\n')}

Losses happen. EV wins long-term.`,

    `4/5: Variance Analysis

This week vs expectation:
${weekROI - seasonStats.nhl.roi >= 0 ? '+' : ''}${(weekROI - seasonStats.nhl.roi).toFixed(1)}% variance

${Math.abs(weekROI - seasonStats.nhl.roi) > 10
  ? Math.abs(weekROI - seasonStats.nhl.roi) > 15
    ? '🔥🔥 Extreme variance week'
    : '🔥 High variance week'
  : '📊 Normal variance'}

Sample size: ${weekResults.length} bets
Long-term average: ${seasonStats.nhl.roi}% ROI`,

    `5/5: Next Week Outlook

${seasonStats.nhl.totalBets + weekResults.length} bets tracked season-long.

Every pick public. Every loss shown.

Performance: nhlsavant.com/performance
CSV: nhlsavant.com/data
Free trial: nhlsavant.com/pricing

#NHLBetting`
  ];

  const redditBody = `## Week ${Math.ceil(seasonStats.nhl.totalBets / 20)} Performance

### The Numbers

| Metric | This Week | Season |
|--------|-----------|--------|
| Record | ${weekWins}-${weekLosses} | ${seasonStats.nhl.record} |
| Units | ${weekProfit >= 0 ? '+' : ''}${weekProfit.toFixed(1)}u | ${seasonStats.nhl.units >= 0 ? '+' : ''}${seasonStats.nhl.units}u |
| ROI | ${weekROI}% | ${seasonStats.nhl.roi}% |

### Best Picks

${weekResults
  .filter(r => r.status === 'won')
  .sort((a, b) => parseFloat(b.profit) - parseFloat(a.profit))
  .slice(0, 3)
  .map((w, i) => `**${i + 1}. ${w.team} ${w.betType} ${w.odds}** (${w.profit >= 0 ? '+' : ''}${w.profit}u)\n\n${w.reasoning || 'Model edge materialized'}\n`)
  .join('\n')}

### Honest About Losses

${weekResults
  .filter(r => r.status === 'lost')
  .sort((a, b) => parseFloat(a.profit) - parseFloat(b.profit))
  .slice(0, 2)
  .map((l, i) => `**${i + 1}. ${l.team} ${l.betType} ${l.odds}** (${l.profit}u)\n\n${l.lossReason || 'Variance. Model had positive EV, outcome went against us.'}\n`)
  .join('\n')}

### Variance Analysis

**This week vs season average:** ${(weekROI - seasonStats.nhl.roi).toFixed(1)}% ${weekROI > seasonStats.nhl.roi ? 'above' : 'below'} expectation

${Math.abs(weekROI - seasonStats.nhl.roi) > 10
  ? weekROI > seasonStats.nhl.roi
    ? '🔥 Running hot this week. Expect regression to long-term average.'
    : '❄️ Running cold this week. Variance will balance out.'
  : '📊 Performance tracking close to long-term expectation (healthy variance).'}

**Sample size:** ${weekResults.length} bets this week, ${seasonStats.nhl.totalBets} season total

---

## Full Transparency

- **Live Dashboard:** [nhlsavant.com/performance](https://nhlsavant.com/performance)
- **CSV Download:** [nhlsavant.com/data](https://nhlsavant.com/data)
- **Methodology:** [nhlsavant.com/methodology](https://nhlsavant.com/methodology)

Every bet tracked. Every loss shown. No cherry-picking.

---

**Next week's picks start Monday 11 AM ET**

Free trial: [nhlsavant.com/pricing](https://nhlsavant.com/pricing)`;

  return { twitterThread, redditBody };
}

/**
 * Generate Educational Deep Dive (Bi-weekly Wednesdays)
 */
export function generateEducationalContent(topic, perplexityContent) {
  const topics = {
    'pdo-regression': {
      title: 'Understanding PDO Regression in NHL Betting',
      twitterHook: '🧵 PDO Regression 101\n\nThe puck luck indicator that sharp bettors use to find +EV.\n\nThread 👇\n\n[1/6]',
      redditTitle: '[Educational] Understanding PDO Regression in NHL Betting - Complete Guide'
    },
    'xgf-analysis': {
      title: 'Why Expected Goals (xGF) Beats Shot Count',
      twitterHook: '🧵 xGF vs Shot Count\n\nWhy quality > quantity in NHL betting.\n\nThread 👇\n\n[1/6]',
      redditTitle: '[Educational] Why Expected Goals (xGF) is Better Than Shot Count for Betting'
    },
    'ev-calculation': {
      title: 'How to Calculate Expected Value on NHL Bets',
      twitterHook: '🧵 Calculate +EV Like a Pro\n\nStep-by-step guide with real examples.\n\nThread 👇\n\n[1/7]',
      redditTitle: '[Educational] How to Calculate Expected Value (EV) on NHL Bets - With Examples'
    },
    'parlays-trap': {
      title: 'Why Parlays Destroy Your Bankroll (Math Breakdown)',
      twitterHook: '🧵 The Parlay Trap\n\nWhy even "good" parlays are -EV.\n\nMath inside 👇\n\n[1/6]',
      redditTitle: '[Educational] Why Parlays Are -EV (Even When They Hit) - Math Breakdown'
    }
  };

  const selectedTopic = topics[topic] || topics['pdo-regression'];

  // Use Perplexity-generated content if available
  const content = perplexityContent || `[Fallback educational content for ${topic}]`;

  return {
    twitterThread: [
      selectedTopic.twitterHook,
      // Break Perplexity content into tweet-sized chunks
      ...breakIntoTweets(content),
      `Final tweet: Full guide with examples:\n\nnhlsavant.com/guides/${topic}\n\n#NHLBetting #BettingEducation`
    ],
    redditTitle: selectedTopic.redditTitle,
    redditBody: `${content}\n\n---\n\n## Learn More\n\n- [Full Methodology](https://nhlsavant.com/methodology)\n- [FAQ](https://nhlsavant.com/faq)\n- [Free Trial](https://nhlsavant.com/pricing)\n\n---\n\n**NHL Savant:** Transparent +EV betting model for NHL & College Basketball`
  };
}

/**
 * Break long content into tweet-sized chunks (~280 chars)
 */
function breakIntoTweets(content, maxLength = 260) {
  const paragraphs = content.split('\n\n');
  const tweets = [];
  let currentTweet = '';

  for (const para of paragraphs) {
    if ((currentTweet + para).length > maxLength) {
      if (currentTweet) tweets.push(currentTweet.trim());
      currentTweet = para;
    } else {
      currentTweet += (currentTweet ? '\n\n' : '') + para;
    }
  }
  
  if (currentTweet) tweets.push(currentTweet.trim());
  
  return tweets.map((tweet, i) => `${i + 2}/${tweets.length + 2}: ${tweet}`);
}

/**
 * Generate Mid-Day Engagement Posts (2 PM)
 */
export function generateMidDayContent(picks, lineMovements) {
  const topPick = picks[0];
  
  // Check if line moved in our favor
  const lineImproved = lineMovements && lineMovements[topPick.team];
  
  if (lineImproved) {
    return {
      twitter: `🔥 Line Movement Alert

${topPick.team} ${topPick.odds} → ${lineImproved.newOdds}

EV jumped from +${topPick.ev}% to +${lineImproved.newEV}%

Even better value. Still time to get in.

Analysis: nhlsavant.com/todays-picks`,
      
      shouldPost: true
    };
  }

  // Otherwise, general reminder
  return {
    twitter: `⏰ Games start in 5 hours

Today's ${picks.length} quality picks:
• Avg EV: +${(picks.reduce((sum, p) => sum + parseFloat(p.ev || 0), 0) / picks.length).toFixed(1)}%
• Top pick: ${topPick.team} ${topPick.odds} (${topPick.qualityGrade})

Full analysis: nhlsavant.com/todays-picks

#NHLBetting`,
    
    shouldPost: picks.length >= 8 // Only post reminder if good slate
  };
}

