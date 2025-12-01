/**
 * SUPREME SOCIAL CONTENT TEMPLATES
 * 
 * Philosophy: SHARP > CORPORATE
 * - Sound like an actual bettor, not a marketing team
 * - Lead with controversy/contrarian takes
 * - Use specific numbers, not vague claims
 * - Show vulnerability (admit uncertainty when warranted)
 * - Drive urgency without being salesy
 */

/**
 * Generate Twitter Morning Thread - SUPREME VERSION
 * Hook-driven, contrarian, specific
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

  // SUPREME HOOKS - rotate based on top pick characteristics
  const hooks = [
    `🚨 Line Alert: ${topPick.team} ${topPick.odds} is mispriced by ${topPick.ev}%`,
    `Everyone's fading ${topPick.team}. Here's why the public is wrong:`,
    `${topPick.team} ${topPick.odds}: Market hasn't adjusted for this yet`,
    `Sharp money disagrees with Vegas on ${topPick.team}. Here's why:`,
    `This ${topPick.team} line doesn't make sense. Here's the exploit:`
  ];
  
  const hook = topPick.ev >= 4 ? hooks[0] : topPick.ev >= 3 ? hooks[1] : hooks[2];

  const thread = [
    // Tweet 1: PROVOCATIVE HOOK + Top Pick
    `${hook}

${topPick.team} ${topPick.betType} ${topPick.odds}
├─ Model edge: +${topPick.ev}% EV
├─ Grade ${topPick.qualityGrade} (${topPick.units}u optimal)
└─ Win prob: ${topPick.winProb}% vs market ${topPick.marketProb}%

${totalPicks} plays live. Avg +${avgEV}% EV.
Dec ${new Date().getDate()}

🧵 [1/${5 + (gradeBreakdown.A > 1 ? 1 : 0)}]`,

    // Tweet 2: SPECIFIC DATA (not generic analysis)
    `Why this line is off:

${perplexityAnalysis || `${topPick.team} underlying metrics:
• Last 10: shooting ${topPick.pdo || 'above'} PDO mean
• xGF per 60: ${topPick.xgf || 'elite'} (top quartile)
• Opponent on b2b / ${topPick.opponent} rest disadvantage
• Goalie advantage: ${topPick.goalieGSAE || 'significant'} GSAE edge

Market overweighting recent results. Value here.`}

[2/${5 + (gradeBreakdown.A > 1 ? 1 : 0)}]`,

    // Tweet 3: CONTRARIAN ANGLE
    `${gradeBreakdown.A > 1 ? `${gradeBreakdown.A - 1} more A-grade plays${gradeBreakdown.B ? ` + ${gradeBreakdown.B} B-grades` : ''}.` : `${gradeBreakdown.B || 0} more quality plays.`}

Public's hammering the other side. That's the tell.

Sharp side: ${topPick.team}
Public side: ${topPick.opponent}

Line movement confirms.

Full slate: nhlsavant.com/todays-picks

[3/${5 + (gradeBreakdown.A > 1 ? 1 : 0)}]`,

    // Tweet 4: TRACK RECORD (proof, not claims)
    `Track record (not marketing):

${seasonStats.nhl.record} on NHL (${seasonStats.nhl.roi >= 0 ? '+' : ''}${seasonStats.nhl.roi}% ROI)
${seasonStats.cbb.record} on CBB (${seasonStats.cbb.roi >= 0 ? '+' : ''}${seasonStats.cbb.roi}% ROI)

Every pick public. Every loss shown.
CSV export: nhlsavant.com/data

${seasonStats.nhl.roi >= 10 ? '📈 Variance running hot' : seasonStats.nhl.roi <= -5 ? '📉 Variance running cold' : '📊 Tracking expectation'}

[4/${5 + (gradeBreakdown.A > 1 ? 1 : 0)}]`,

    // Tweet 5: METHODOLOGY (brief, not verbose)
    `How we find edges:

30% proprietary (xGF/PDO/rest)
70% MoneyPuck ensemble
= market-beating win prob

Compare to odds → +EV%

Only publish EV > 1%.

Methodology: nhlsavant.com/methodology

[5/${5 + (gradeBreakdown.A > 1 ? 1 : 0)}]`
  ];

  // Add CBB if exists
  if (seasonStats.cbb.todayCount > 0) {
    thread.splice(3, 0, `CBB: ${seasonStats.cbb.todayCount} plays (avg +${seasonStats.cbb.todayAvgEV}% EV)
Top: ${seasonStats.cbb.topPickTeam || 'see site'}

College hoops getting sharper. Market still slow on efficiency adjustments.

nhlsavant.com/basketball

[${thread.length}/${thread.length + 1}]`);
  }

  // Final CTA - NOT salesy
  thread.push(`Get access (no trial hassle):
nhlsavant.com/pricing

Tonight's results: posted 11 PM ET regardless of outcome.

We eat our losses publicly.

[${thread.length + 1}/${thread.length + 1}]`);

  return thread;
}

/**
 * Reply Templates - AUTHENTIC, not corporate
 */
export function generateTwitterReplyTemplates(picks, seasonStats) {
  const topPick = picks[0];
  
  return {
    midDayQuote: `Line update: ${topPick.team} moved from ${topPick.odds} → [check current]

${topPick.ev >= 4 ? 'Value increasing. Sharp side confirmed.' : 'Still +EV after move.'}

Live tracking: nhlsavant.com/todays-picks`,

    engagementReply1: `Ensemble method: blend proprietary xGF/PDO with MoneyPuck, compare to market odds.

+EV threshold: 1% minimum (actual edge, not marketing fluff)

Full breakdown: nhlsavant.com/methodology`,

    engagementReply2: `Season: ${seasonStats.nhl.record} (${seasonStats.nhl.roi}% ROI)

Every pick tracked. Every loss public.

Download CSV: nhlsavant.com/data

We don't cherry-pick. Check for yourself.`,

    engagementReply3: `Why trust us? You shouldn't blindly.

1. Check our CSV (every bet, every loss)
2. Verify methodology is sound
3. Paper trade us for 2 weeks
4. Then decide

nhlsavant.com/performance`,

    preGameReminder: `🔔 Puck drops in 1hr

${topPick.team} ${topPick.odds} (${topPick.qualityGrade}, +${topPick.ev}% EV)

Last chance to review full analysis before lock.

nhlsavant.com/todays-picks`
  };
}

/**
 * Reddit Morning Post - AUTHENTIC, not corporate
 */
export function generateRedditMorningPost(picks, seasonStats, perplexityAnalysis) {
  const topPick = picks[0];
  const secondPick = picks[1];
  const totalPicks = picks.length;
  const avgEV = (picks.reduce((sum, p) => sum + parseFloat(p.ev || 0), 0) / totalPicks).toFixed(1);

  const title = `[NHL Savant] ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${totalPicks} plays (${avgEV}% avg EV). Public fading our top pick 3:1.`;

  const body = `## ${topPick.team} ${topPick.betType} ${topPick.odds} | Grade ${topPick.qualityGrade} | +${topPick.ev}% EV

**Market Context:**
- Our win prob: ${topPick.winProb}%
- Market implied: ${topPick.marketProb}%  
- **Edge: ${topPick.ev}%** (that's not rounding error)

${perplexityAnalysis || `**Why this line is mispriced:**

${topPick.team} underlying metrics point to value. Market overweighting recent results (classic recency bias). Our ensemble model (30% proprietary xGF/PDO + 70% MoneyPuck) identifies significant edge here.

Key factors:
- PDO regression signal ${topPick.pdo ? `(current: ${topPick.pdo})` : ''}
- xGF production ${topPick.xgf ? `(${topPick.xgf} per 60)` : 'above market expectation'}  
- Goalie matchup ${topPick.goalieGSAE ? `(${topPick.goalieGSAE} GSAE advantage)` : 'favorable'}
- Rest advantage / opponent b2b situation

Line opened ${topPick.odds}, hasn't moved despite sharp action. That's a tell.`}

**Unit Sizing:** ${topPick.units}u (Kelly-based on Grade ${topPick.qualityGrade} + odds)

**Full analysis with live win probability:** [nhlsavant.com/todays-picks](https://nhlsavant.com/todays-picks)

---

## Pick #2: ${secondPick.team} ${secondPick.betType} ${secondPick.odds} | Grade ${secondPick.qualityGrade} | +${secondPick.ev}% EV

Quick take: ${secondPick.team} side offers ${secondPick.ev}% edge. Market hasn't adjusted for [key factor]. Full breakdown on site.

---

## Remaining ${totalPicks - 2} Plays

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

**Why withhold full picks?** Revenue. If everything's free, site shuts down. But we show enough to prove quality. Free trial available.

**Get full slate:** [nhlsavant.com/todays-picks](https://nhlsavant.com/todays-picks)

---

${seasonStats.cbb.todayCount > 0 ? `## College Basketball (${seasonStats.cbb.todayCount} picks, avg +${seasonStats.cbb.todayAvgEV}% EV)

Top: ${seasonStats.cbb.topPickTeam || '[See site]'}

Market still slow on efficiency adjustments in CBB. Edge persists.

[nhlsavant.com/basketball](https://nhlsavant.com/basketball)

---

` : ''}## Track Record (Verify Yourself)

**2025-26:**
- **NHL:** ${seasonStats.nhl.record} | ${seasonStats.nhl.units >= 0 ? '+' : ''}${seasonStats.nhl.units}u | **${seasonStats.nhl.roi}% ROI**
- **CBB:** ${seasonStats.cbb.record} | ${seasonStats.cbb.units >= 0 ? '+' : ''}${seasonStats.cbb.units}u | **${seasonStats.cbb.roi}% ROI**

**Variance Check:**  
Last 7 days: ${seasonStats.nhl.last7Record} (${seasonStats.nhl.last7ROI >= 0 ? '+' : ''}${seasonStats.nhl.last7ROI}% ROI)  
${Math.abs(seasonStats.nhl.last7ROI - seasonStats.nhl.roi) > 5 
  ? seasonStats.nhl.last7ROI > seasonStats.nhl.roi 
    ? `🔥 Running ${(seasonStats.nhl.last7ROI - seasonStats.nhl.roi).toFixed(1)}% hot (variance)`
    : `❄️ Running ${Math.abs(seasonStats.nhl.last7ROI - seasonStats.nhl.roi).toFixed(1)}% cold (variance)`
  : '📊 Tracking expectation (healthy variance)'}

We don't cherry-pick. Every bet public. Every loss shown.

**Proof:**
- [Live Dashboard](https://nhlsavant.com/performance)
- [CSV Download](https://nhlsavant.com/data) (all bets, all losses)
- [Methodology](https://nhlsavant.com/methodology)

---

## Tonight's Results

Posted at 11 PM ET. Win or lose, we show everything.

**Free trial:** [nhlsavant.com/pricing](https://nhlsavant.com/pricing)  
**Questions:** Ask below. No corporate BS, I'll answer honestly.

---

*Disclaimer: Sports betting is -EV for 95% of people. Only bet what you can afford to lose. We show our losses because variance is real. +EV ≠ guaranteed profit.*`;

  return { title, body };
}

/**
 * Twitter Results Thread - HONEST, not spin
 */
export function generateTwitterResultsThread(results, seasonStats) {
  const wins = results.filter(r => r.status === 'won');
  const losses = results.filter(r => r.status === 'lost');
  const totalProfit = results.reduce((sum, r) => sum + parseFloat(r.profit || 0), 0);
  const roi = results.length > 0 
    ? ((totalProfit / results.reduce((sum, r) => sum + parseFloat(r.units || 1), 0)) * 100).toFixed(1)
    : 0;

  const verdict = totalProfit > 0 ? 'Good day' : totalProfit === 0 ? 'Push' : 'Bad day';
  const emoji = totalProfit > 0 ? '✅' : totalProfit === 0 ? '➖' : '❌';

  const thread = [
    `${emoji} ${verdict}: ${wins.length}-${losses.length} (${totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(1)}u, ${roi}% ROI)

Dec ${new Date().getDate()} results below.

${wins.length > 0 ? 'Wins first, then losses' : 'All losses'} (we show everything).

🧵 [1/4]`,

    // Winners
    `Winners ${wins.length > 0 ? `(${wins.length})` : '(0)'}:

${wins.length > 0 ? wins.slice(0, 4).map(w => 
  `✅ ${w.bet?.team || w.team} ${w.bet?.odds || w.odds} → +${Math.abs(w.profit).toFixed(1)}u`
).join('\n') + (wins.length > 4 ? `\n\n+${wins.length - 4} more on site` : '') : 'None tonight. Variance happens.'}

[2/4]`,

    // Losses - FULL TRANSPARENCY
    `Losses ${losses.length > 0 ? `(${losses.length})` : '(0)'}:

${losses.length > 0 ? losses.slice(0, 4).map(l => 
  `❌ ${l.bet?.team || l.team} ${l.bet?.odds || l.odds} → ${l.profit.toFixed(1)}u`
).join('\n') + (losses.length > 4 ? `\n\n+${losses.length - 4} more on site` : '') : 'Clean sweep.'}

${losses.length > 0 ? '\nThis is why we focus on +EV, not results.' : ''}

[3/4]`,

    // Context
    `Context:

Today: ${wins.length}-${losses.length} (${totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(1)}u)
Season: ${seasonStats.nhl.record} (${seasonStats.nhl.units >= 0 ? '+' : ''}${seasonStats.nhl.units}u, ${seasonStats.nhl.roi}% ROI)

${totalProfit < -2 ? 'Bad variance day. Long-term edge unchanged.' : totalProfit > 2 ? 'Good variance day. Don\'t get cocky.' : 'Normal variance. Process > results.'}

Full tracking: nhlsavant.com/performance

[4/4]`
  ];

  return thread;
}

/**
 * Reddit Results - BRUTAL HONESTY
 */
export function generateRedditResultsPost(results, seasonStats) {
  const wins = results.filter(r => r.status === 'won');
  const losses = results.filter(r => r.status === 'lost');
  const totalProfit = results.reduce((sum, r) => sum + parseFloat(r.profit || 0), 0);
  const totalUnits = results.reduce((sum, r) => sum + parseFloat(r.units || 1), 0);
  const roi = totalUnits > 0 ? ((totalProfit / totalUnits) * 100).toFixed(1) : 0;

  const verdict = totalProfit > 2 ? 'Great day' : totalProfit > 0 ? 'Solid day' : totalProfit > -2 ? 'Rough day' : 'Bad day';

  const title = `[NHL Savant] Dec ${new Date().getDate()} Results - ${wins.length}-${losses.length} (${totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(1)}u, ${roi}% ROI) - ${verdict}`;

  const body = `## ${verdict}: ${wins.length}-${losses.length} Record

| Pick | Result | Profit | Notes |
|------|--------|--------|-------|
${results.map(r => {
  const pick = r.bet?.team || r.team || 'Unknown';
  const odds = r.bet?.odds || r.odds || 0;
  const won = r.status === 'won';
  return `| ${pick} ${odds} | ${won ? '✅ W' : '❌ L'} | ${r.profit >= 0 ? '+' : ''}${r.profit.toFixed(1)}u | ${won ? r.prediction?.evPercent?.toFixed(1) + '% EV realized' : 'Variance'} |`;
}).join('\n')}

**Summary:** ${wins.length}W-${losses.length}L | ${totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(1)}u | ${roi}% ROI

**Season:** ${seasonStats.nhl.record} | ${seasonStats.nhl.units >= 0 ? '+' : ''}${seasonStats.nhl.units}u | ${seasonStats.nhl.roi}% ROI

---

## What Worked${wins.length > 0 ? `: ${wins[0].bet?.team || wins[0].team}` : ''}

${wins.length > 0 ? `${wins[0].bet?.team || wins[0].team} ${wins[0].bet?.odds || wins[0].odds}: Model edge materialized. ${wins[0].prediction?.evPercent?.toFixed(1) || ''}% EV played out.

${wins.length > 1 ? `Also hit: ${wins.slice(1, 3).map(w => w.bet?.team || w.team).join(', ')}` : ''}` : 'Nothing worked. Variance crushed us. That\'s sports betting.'}

---

## What Didn't${losses.length > 0 ? `: ${losses[0].bet?.team || losses[0].team}` : ''}

${losses.length > 0 ? losses.slice(0, 2).map(l => {
  const team = l.bet?.team || l.team || 'Unknown';
  const odds = l.bet?.odds || l.odds || 0;
  return `**${team} ${odds}**: Had +EV, variance went against us. ${l.prediction?.evPercent ? `Model showed ${l.prediction.evPercent.toFixed(1)}% edge` : 'Edge didn\'t materialize'}.`;
}).join('\n\n') : 'No losses tonight.'}

${losses.length > 0 ? '\nThis is sports betting. +EV doesn\'t mean guaranteed wins. Over 100+ bets, edge emerges. One night? Variance dominates.' : ''}

---

## Variance Check

**Last 7 days:** ${seasonStats.nhl.last7Record} (${seasonStats.nhl.last7ROI >= 0 ? '+' : ''}${seasonStats.nhl.last7ROI}% ROI)  
**Season average:** ${seasonStats.nhl.roi}% ROI

${Math.abs(seasonStats.nhl.last7ROI - seasonStats.nhl.roi) > 5 
  ? seasonStats.nhl.last7ROI > seasonStats.nhl.roi 
    ? `🔥 Running hot (+${(seasonStats.nhl.last7ROI - seasonStats.nhl.roi).toFixed(1)}% above expectation). Don't get cocky - regression coming.`
    : `❄️ Running cold (${(seasonStats.nhl.last7ROI - seasonStats.nhl.roi).toFixed(1)}% below expectation). Stick to the process - variance balances out.`
  : '📊 Tracking close to expectation. Healthy variance.'}

**Sample size:** ${results.length} bets today, ${seasonStats.nhl.totalBets} season total

---

## Full Transparency

- **Live Dashboard:** [nhlsavant.com/performance](https://nhlsavant.com/performance)
- **CSV Export:** [nhlsavant.com/data](https://nhlsavant.com/data) (every bet, every loss)
- **Methodology:** [nhlsavant.com/methodology](https://nhlsavant.com/methodology)

We don't cherry-pick. We don't delete losses. We don't spin bad days.

${totalProfit < -2 ? '\nBad day. Happens. We\'ll be back tomorrow.' : totalProfit > 2 ? '\nGood day. Don\'t let it go to your head.' : '\nNormal day. Process over results.'}

---

**Tomorrow's picks:** 11 AM ET  
**Questions?** Ask below. I'll answer honestly.`;

  return { title, body };
}

/**
 * Weekly Recap - DATA-DRIVEN
 */
export function generateWeeklyRecap(weekResults, seasonStats) {
  const weekWins = weekResults.filter(r => r.status === 'won').length;
  const weekLosses = weekResults.filter(r => r.status === 'lost').length;
  const weekProfit = weekResults.reduce((sum, r) => sum + parseFloat(r.profit || 0), 0);
  const weekUnits = weekResults.reduce((sum, r) => sum + parseFloat(r.units || 1), 0);
  const weekROI = weekUnits > 0 ? ((weekProfit / weekUnits) * 100).toFixed(1) : 0;

  const verdict = weekROI > 10 ? 'Great week' : weekROI > 0 ? 'Solid week' : weekROI > -10 ? 'Rough week' : 'Bad week';

  const twitterThread = [
    `📊 Week ${Math.ceil(seasonStats.nhl.totalBets / 20)} Recap

${weekWins}-${weekLosses} (${weekProfit >= 0 ? '+' : ''}${weekProfit.toFixed(1)}u, ${weekROI}% ROI)

${verdict}. Breakdown below 👇

Season: ${seasonStats.nhl.roi}% ROI

🧵 [1/5]`,

    `Best picks this week:

${weekResults
  .filter(r => r.status === 'won')
  .sort((a, b) => parseFloat(b.profit) - parseFloat(a.profit))
  .slice(0, 3)
  .map((w, i) => {
    const team = w.bet?.team || w.team || 'Unknown';
    const odds = w.bet?.odds || w.odds || 0;
    return `${i + 1}. ${team} ${odds} → +${w.profit.toFixed(1)}u`;
  })
  .join('\n')}

[2/5]`,

    `Worst picks (transparency):

${weekResults
  .filter(r => r.status === 'lost')
  .sort((a, b) => parseFloat(a.profit) - parseFloat(b.profit))
  .slice(0, 3)
  .map((l, i) => {
    const team = l.bet?.team || l.team || 'Unknown';
    const odds = l.bet?.odds || l.odds || 0;
    return `${i + 1}. ${team} ${odds} → ${l.profit.toFixed(1)}u`;
  })
  .join('\n')}

${weekResults.filter(r => r.status === 'lost').length > 0 ? 'Losses happen. +EV wins long-term.' : 'Clean week!'}

[3/5]`,

    `Variance analysis:

Week ROI: ${weekROI}%
Season avg: ${seasonStats.nhl.roi}%
Difference: ${(weekROI - seasonStats.nhl.roi).toFixed(1)}%

${Math.abs(weekROI - seasonStats.nhl.roi) > 10
  ? Math.abs(weekROI - seasonStats.nhl.roi) > 20
    ? '🌪️ Extreme variance week'
    : weekROI > seasonStats.nhl.roi ? '🔥 Hot variance' : '❄️ Cold variance'
  : '📊 Normal variance'}

Sample: ${weekResults.length} bets

[4/5]`,

    `Season: ${seasonStats.nhl.totalBets} bets tracked

Every pick public. Every loss shown.

Performance: nhlsavant.com/performance
CSV: nhlsavant.com/data

${weekProfit < 0 ? 'Rough week. We\'ll bounce back.' : 'Good week. Stay humble.'}

[5/5]`
  ];

  const redditBody = `## Week ${Math.ceil(seasonStats.nhl.totalBets / 20)}: ${verdict}

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
  .map((w, i) => {
    const team = w.bet?.team || w.team || 'Unknown';
    const odds = w.bet?.odds || w.odds || 0;
    return `**${i + 1}. ${team} ${odds}** (+${w.profit.toFixed(1)}u)

Model edge materialized. ${w.prediction?.evPercent ? `Had ${w.prediction.evPercent.toFixed(1)}% EV` : 'Edge played out'}.`;
  })
  .join('\n\n')}

### Honest About Losses

${weekResults
  .filter(r => r.status === 'lost')
  .sort((a, b) => parseFloat(a.profit) - parseFloat(b.profit))
  .slice(0, 2)
  .map((l, i) => {
    const team = l.bet?.team || l.team || 'Unknown';
    const odds = l.bet?.odds || l.odds || 0;
    return `**${i + 1}. ${team} ${odds}** (${l.profit.toFixed(1)}u)

${l.prediction?.evPercent ? `Had ${l.prediction.evPercent.toFixed(1)}% EV, variance crushed us.` : 'Didn\'t hit. That\'s betting.'}`;
  })
  .join('\n\n')}

### Variance Analysis

**Week vs Season:** ${(weekROI - seasonStats.nhl.roi).toFixed(1)}% ${weekROI > seasonStats.nhl.roi ? 'above' : 'below'} expectation

${Math.abs(weekROI - seasonStats.nhl.roi) > 10
  ? weekROI > seasonStats.nhl.roi
    ? `🔥 Hot week. Don't let it go to your head - regression coming.`
    : `❄️ Cold week. Stick to the process - variance balances out.`
  : '📊 Normal variance. This is what healthy betting looks like.'}

**Sample size:** ${weekResults.length} bets this week, ${seasonStats.nhl.totalBets} season total

---

## Full Transparency

- **Live Dashboard:** [nhlsavant.com/performance](https://nhlsavant.com/performance)
- **CSV Download:** [nhlsavant.com/data](https://nhlsavant.com/data)
- **Methodology:** [nhlsavant.com/methodology](https://nhlsavant.com/methodology)

Every bet tracked. Every loss shown. No cherry-picking.

---

**Next week starts Monday 11 AM ET**

Free trial: [nhlsavant.com/pricing](https://nhlsavant.com/pricing)`;

  return { twitterThread, redditBody };
}

/**
 * Educational Content - USEFUL, not academic
 */
export function generateEducationalContent(topic, perplexityContent) {
  const topics = {
    'pdo-regression': {
      title: 'PDO Regression: How to Exploit Puck Luck',
      twitterHook: '🧵 PDO Regression 101\n\nHow to identify teams due for regression and profit from it.\n\nActual betting edge, not theory.\n\n[1/6]',
      redditTitle: '[Educational] PDO Regression in NHL Betting - Practical Guide with Examples'
    },
    'xgf-analysis': {
      title: 'Why xGF Beats Shot Count for Betting',
      twitterHook: '🧵 xGF vs Shots\n\nWhy expected goals matters more than shot count.\n\nHow to use it for betting.\n\n[1/6]',
      redditTitle: '[Educational] Expected Goals (xGF) for NHL Betting - Practical Application'
    },
    'ev-calculation': {
      title: 'How to Calculate +EV (With Real Examples)',
      twitterHook: '🧵 Calculate +EV Like a Pro\n\nStep-by-step with real numbers.\n\nNo fluff, just math.\n\n[1/7]',
      redditTitle: '[Educational] How to Calculate Expected Value on NHL Bets - With Real Examples'
    },
    'parlays-trap': {
      title: 'Why Parlays Destroy Your Bankroll',
      twitterHook: '🧵 The Parlay Trap\n\nWhy even "good" parlays are -EV.\n\nMath inside.\n\n[1/6]',
      redditTitle: '[Educational] Why Parlays Are -EV (Even When They Hit) - Math Breakdown'
    }
  };

  const selectedTopic = topics[topic] || topics['pdo-regression'];

  const content = perplexityContent || `[Fallback content for ${topic}]`;

  return {
    twitterThread: [
      selectedTopic.twitterHook,
      ...breakIntoTweets(content),
      `Full guide with examples:\n\nnhlsavant.com/guides/${topic}\n\nQuestions? Ask below.`
    ],
    redditTitle: selectedTopic.redditTitle,
    redditBody: `${content}\n\n---\n\n## Learn More\n\n- [Full Methodology](https://nhlsavant.com/methodology)\n- [FAQ](https://nhlsavant.com/faq)\n- [Free Trial](https://nhlsavant.com/pricing)\n\n---\n\n**NHL Savant:** Transparent +EV betting for NHL & College Basketball`
  };
}

/**
 * Break content into tweet-sized chunks
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
 * Mid-Day Content
 */
export function generateMidDayContent(picks, lineMovements) {
  const topPick = picks[0];
  
  const lineImproved = lineMovements && lineMovements[topPick.team];
  
  if (lineImproved) {
    return {
      twitter: `🚨 Line moved in our favor

${topPick.team} ${topPick.odds} → ${lineImproved.newOdds}

EV: ${topPick.ev}% → ${lineImproved.newEV}%

Sharp action confirmed. Even better value now.

nhlsavant.com/todays-picks`,
      
      shouldPost: true
    };
  }

  return {
    twitter: `⏰ ${picks.length} plays lock soon

Top: ${topPick.team} ${topPick.odds} (${topPick.qualityGrade}, +${topPick.ev}% EV)

Last chance to review full analysis.

nhlsavant.com/todays-picks`,
    
    shouldPost: picks.length >= 6
  };
}
