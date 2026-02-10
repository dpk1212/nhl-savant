/**
 * 🔬 SPREAD EV ANALYSIS
 * 
 * Uses locally cached data from this morning's fetchPrimePicks run.
 * Explores: what if we found EV on the SPREAD line (ATS) rather than moneylines?
 * 
 * Approach:
 * - Our 90/10 blended model predicts a margin for each game
 * - The market sets a spread
 * - If our model says Team A wins by 8 but the spread is only -5.5,
 *   that's a 2.5pt edge on the spread
 * - Standard spread odds are -110 (implied 52.38%), so we need >52.38% 
 *   true probability to have +EV on spread bets
 * - We estimate spread cover probability from our model's margin edge
 * 
 * Question: What type of picks/success could we find from spread EV?
 */

import fs from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { parseBasketballOdds } from '../src/utils/basketballOddsParser.js';
import { parseHaslametrics } from '../src/utils/haslametricsParser.js';
import { parseDRatings } from '../src/utils/dratingsParser.js';
import { parseBarttorvik } from '../src/utils/barttorvik Parser.js';
import { matchGamesWithCSV } from '../src/utils/gameMatchingCSV.js';
import { BasketballEdgeCalculator } from '../src/utils/basketballEdgeCalculator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ═══════════════════════════════════════════════════════════════
// SPREAD EV HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Estimate spread cover probability from model edge over the spread.
 * 
 * In CBB, ~1 point of predicted margin over the spread ≈ ~3% additional
 * cover probability (rough empirical estimate from historical data).
 * Baseline is 50% (coin flip at the spread line).
 * 
 * More sophisticated: use a logistic/probit model, but this linear
 * approximation is reasonable for edges in the 0-6pt range.
 */
function estimateSpreadCoverProb(marginOverSpread) {
  // Each point of edge ≈ 3% cover probability above 50%
  const coverProb = 0.50 + (marginOverSpread * 0.03);
  return Math.max(0.01, Math.min(0.99, coverProb));
}

/**
 * Calculate EV for a spread bet at given odds
 * EV = (coverProb * payout) - (1 - coverProb) * stake
 * Expressed as % of stake
 */
function calculateSpreadEV(coverProb, odds = -110) {
  let payout;
  if (odds > 0) {
    payout = odds / 100;
  } else {
    payout = 100 / Math.abs(odds);
  }
  
  const ev = (coverProb * payout) - ((1 - coverProb) * 1);
  return ev * 100; // as percentage
}

/**
 * Parse spread data from OddsTrader markdown (same as fetchPrimePicks)
 */
function parseSpreadData(markdown) {
  const games = [];
  const lines = markdown.split('\n');
  
  const today = new Date();
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const todayDay = days[today.getDay()];
  const todayDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
  const todayDateAlt = `${today.getMonth() + 1}/${today.getDate()}`;
  
  let currentGame = null;
  let isTarget = false;
  
  for (const line of lines) {
    const dateMatch = line.match(/(FRI|SAT|SUN|MON|TUE|WED|THU)\s+(\d{1,2}\/\d{1,2})/i);
    if (dateMatch) {
      const dayStr = dateMatch[1].toUpperCase();
      const dateStr = dateMatch[2];
      isTarget = (dayStr === todayDay && (dateStr === todayDate || dateStr === todayDateAlt));
    }
    
    if (line.includes('|') && line.includes('<br>')) {
      const teamMatch = line.match(/\.(?:png|PNG)\?d=100x100\)<br>([^<]+)<br>(\d{1,2}-\d{1,2})/);
      if (!teamMatch) continue;
      
      let teamName = teamMatch[1].trim();
      teamName = teamName.replace(/^#\d+/, '').trim();
      
      const spreadPatterns = line.match(/([+-]?\d+½?)\s+-?\d{3}/g);
      let spread = null;
      let spreadOdds = -110; // default
      
      if (spreadPatterns && spreadPatterns.length > 0) {
        const parts = spreadPatterns[0].split(/\s/);
        const spreadStr = parts[0];
        const cleanSpread = spreadStr.replace('½', '.5');
        spread = parseFloat(cleanSpread);
        if (parts[1]) spreadOdds = parseInt(parts[1]);
      } else if (line.includes('PK')) {
        spread = 0;
      }
      
      if (!currentGame) {
        currentGame = { 
          awayTeam: teamName, 
          homeTeam: null, 
          awaySpread: spread, 
          homeSpread: null,
          awaySpreadOdds: spreadOdds,
          homeSpreadOdds: -110,
          isTarget: isTarget
        };
      } else if (!currentGame.homeTeam) {
        currentGame.homeTeam = teamName;
        currentGame.homeSpread = spread;
        currentGame.homeSpreadOdds = spreadOdds;
        
        if (currentGame.isTarget && currentGame.awayTeam && currentGame.homeTeam) {
          games.push(currentGame);
        }
        currentGame = null;
      }
    }
  }
  
  return games;
}


// ═══════════════════════════════════════════════════════════════
// MAIN ANALYSIS
// ═══════════════════════════════════════════════════════════════

async function analyzeSpreadEV() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║     🔬 SPREAD EV ANALYSIS — Model Edge vs. Spread Line                       ║');
  console.log('║     Using locally cached data from this morning\'s fetch                       ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝');
  console.log('\n');

  // Load cached files
  const oddsMarkdown = await fs.readFile(join(__dirname, '../public/basketball_odds.md'), 'utf8');
  const spreadMarkdown = await fs.readFile(join(__dirname, '../public/basketball_spreads.md'), 'utf8');
  const haslaMarkdown = await fs.readFile(join(__dirname, '../public/haslametrics.md'), 'utf8');
  const drateMarkdown = await fs.readFile(join(__dirname, '../public/dratings.md'), 'utf8');
  const bartMarkdown = await fs.readFile(join(__dirname, '../public/Bart.md'), 'utf8');
  const csvContent = await fs.readFile(join(__dirname, '../public/basketball_teams.csv'), 'utf8');

  // Parse data
  const oddsData = parseBasketballOdds(oddsMarkdown);
  const spreadGames = parseSpreadData(spreadMarkdown);
  const haslaData = parseHaslametrics(haslaMarkdown);
  const dratePreds = parseDRatings(drateMarkdown);
  const bartData = parseBarttorvik(bartMarkdown);

  // Match games
  const matchedGames = matchGamesWithCSV(oddsData, haslaData, dratePreds, bartData, csvContent);
  const edgeCalculator = new BasketballEdgeCalculator();

  console.log(`   📊 Matched games: ${matchedGames.length}`);
  console.log(`   📊 Spread games parsed: ${spreadGames.length}`);
  console.log('\n');

  // ═══════════════════════════════════════════════════════════
  // ANALYZE EVERY GAME: Spread Model Edge + Spread EV
  // ═══════════════════════════════════════════════════════════
  
  const normalizeTeam = (name) => name?.toLowerCase().replace(/[^a-z]/g, '') || '';

  const allAnalysis = [];

  for (const game of matchedGames) {
    if (!game.dratings || !game.haslametrics) continue;

    const dr = game.dratings;
    const hs = game.haslametrics;

    // Model predicted margins (positive = away wins)
    const drMarginRaw = dr.awayScore - dr.homeScore; // positive = away winning
    const hsMarginRaw = hs.awayScore - hs.homeScore;
    const blendedMarginRaw = (drMarginRaw * 0.90) + (hsMarginRaw * 0.10);

    // Do models agree on winner?
    const drPicksAway = drMarginRaw > 0;
    const hsPicksAway = hsMarginRaw > 0;
    const modelsAgree = drPicksAway === hsPicksAway;

    // Find matching spread game
    const spreadGame = spreadGames.find(sg => {
      const awayMatch = normalizeTeam(game.awayTeam).includes(normalizeTeam(sg.awayTeam)) ||
                        normalizeTeam(sg.awayTeam).includes(normalizeTeam(game.awayTeam));
      const homeMatch = normalizeTeam(game.homeTeam).includes(normalizeTeam(sg.homeTeam)) ||
                        normalizeTeam(sg.homeTeam).includes(normalizeTeam(game.homeTeam));
      return awayMatch && homeMatch;
    });

    if (!spreadGame) continue;

    // For each side (away spread, home spread), calculate edge
    // Away perspective: model predicts away wins by blendedMarginRaw
    // Away spread is spreadGame.awaySpread (e.g., -5.5 means away favored by 5.5)
    // Away covers if: actual margin > -awaySpread → model margin > -awaySpread
    // Edge over spread = blendedMarginRaw - (-awaySpread) = blendedMarginRaw + awaySpread

    const awaySpread = spreadGame.awaySpread;
    const homeSpread = spreadGame.homeSpread;
    const awaySpreadOdds = spreadGame.awaySpreadOdds || -110;
    const homeSpreadOdds = spreadGame.homeSpreadOdds || -110;

    if (awaySpread === null && homeSpread === null) continue;

    // Away model edge over spread
    // Model says away wins by blendedMarginRaw (positive = away better)
    // Away spread is awaySpread (negative means favored, e.g. -5.5)
    // Away covers when: actual_margin > -awaySpread  
    // Model predicts margin = blendedMarginRaw
    // Model edge over spread line = blendedMarginRaw - (-awaySpread) = blendedMarginRaw + awaySpread
    const awayEdgeOverSpread = awaySpread !== null ? blendedMarginRaw + awaySpread : null;
    
    // Home model edge over spread (from home perspective, margin is negative of raw)
    // Home margin = -blendedMarginRaw (positive = home better)
    // Home spread = homeSpread
    // Home covers when: home_margin > -homeSpread
    // Home edge = (-blendedMarginRaw) + homeSpread = homeSpread - blendedMarginRaw
    const homeEdgeOverSpread = homeSpread !== null ? homeSpread - blendedMarginRaw : null;

    // Determine which side has edge
    const sides = [];

    if (awayEdgeOverSpread !== null && awayEdgeOverSpread > 0) {
      const coverProb = estimateSpreadCoverProb(awayEdgeOverSpread);
      const spreadEV = calculateSpreadEV(coverProb, awaySpreadOdds);
      sides.push({
        side: 'AWAY',
        team: game.awayTeam,
        spread: awaySpread,
        spreadOdds: awaySpreadOdds,
        modelMargin: blendedMarginRaw,
        edgeOverSpread: awayEdgeOverSpread,
        coverProb,
        spreadEV,
        modelsAgree,
        drMargin: drMarginRaw,
        hsMargin: hsMarginRaw,
        drPicksSameSide: drMarginRaw > -awaySpread, // DR picks this side to cover
        hsPicksSameSide: hsMarginRaw > -awaySpread,
      });
    }

    if (homeEdgeOverSpread !== null && homeEdgeOverSpread > 0) {
      const coverProb = estimateSpreadCoverProb(homeEdgeOverSpread);
      const spreadEV = calculateSpreadEV(coverProb, homeSpreadOdds);
      sides.push({
        side: 'HOME',
        team: game.homeTeam,
        spread: homeSpread,
        spreadOdds: homeSpreadOdds,
        modelMargin: -blendedMarginRaw,
        edgeOverSpread: homeEdgeOverSpread,
        coverProb,
        spreadEV,
        modelsAgree,
        drMargin: -drMarginRaw,
        hsMargin: -hsMarginRaw,
        drPicksSameSide: (-drMarginRaw) > -(homeSpread || 0),
        hsPicksSameSide: (-hsMarginRaw) > -(homeSpread || 0),
      });
    }

    // Pick the side with the best edge
    if (sides.length > 0) {
      const best = sides.sort((a, b) => b.edgeOverSpread - a.edgeOverSpread)[0];
      allAnalysis.push({
        game: `${game.awayTeam} @ ${game.homeTeam}`,
        ...best,
        // Also compute ML EV for comparison
        mlPrediction: edgeCalculator.calculateEnsemblePrediction(game),
      });
    }
  }

  // Sort by spread EV descending
  allAnalysis.sort((a, b) => b.spreadEV - a.spreadEV);

  // ═══════════════════════════════════════════════════════════
  // DISPLAY: ALL GAMES WITH SPREAD ANALYSIS
  // ═══════════════════════════════════════════════════════════
  
  console.log('┌───────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ ALL GAMES: SPREAD MODEL EDGE vs SPREAD LINE                                   │');
  console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');

  console.log('   Game                                │ Side  │ Spread  │ Edge   │ CoverP │ SpreadEV │ ML EV   │ Models');
  console.log('   ────────────────────────────────────┼───────┼─────────┼────────┼────────┼──────────┼─────────┼────────');

  allAnalysis.forEach(a => {
    const mlEV = a.mlPrediction && !a.mlPrediction.error ? `${a.mlPrediction.bestEV >= 0 ? '+' : ''}${a.mlPrediction.bestEV.toFixed(1)}%` : 'N/A';
    const spreadEVStr = `${a.spreadEV >= 0 ? '+' : ''}${a.spreadEV.toFixed(1)}%`;
    const agreeStr = a.modelsAgree ? '✓ Agree' : '✗ Split';
    const bothCover = a.drPicksSameSide && a.hsPicksSameSide ? '✓ Both' : a.drPicksSameSide ? 'DR only' : a.hsPicksSameSide ? 'HS only' : '✗ None';
    
    const emoji = a.spreadEV >= 5 ? '🔥' : a.spreadEV >= 2 ? '🟢' : a.spreadEV >= 0 ? '🟡' : '🔴';
    
    console.log(`   ${emoji} ${a.game.padEnd(36)} │ ${a.side.padEnd(5)} │ ${String(a.spread).padStart(5)}   │ ${a.edgeOverSpread.toFixed(1).padStart(5)}  │ ${(a.coverProb * 100).toFixed(1).padStart(5)}% │ ${spreadEVStr.padStart(8)} │ ${mlEV.padStart(7)} │ ${bothCover}`);
  });

  // ═══════════════════════════════════════════════════════════
  // TIER ANALYSIS
  // ═══════════════════════════════════════════════════════════
  
  console.log('\n');
  console.log('┌───────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ SPREAD EV TIERS                                                               │');
  console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');

  const tiers = [
    { name: 'ELITE (5%+ Spread EV)',    filter: a => a.spreadEV >= 5 },
    { name: 'STRONG (3-5% Spread EV)',  filter: a => a.spreadEV >= 3 && a.spreadEV < 5 },
    { name: 'GOOD (1-3% Spread EV)',    filter: a => a.spreadEV >= 1 && a.spreadEV < 3 },
    { name: 'MARGINAL (0-1% Spread EV)',filter: a => a.spreadEV >= 0 && a.spreadEV < 1 },
    { name: 'NEGATIVE (<0% Spread EV)', filter: a => a.spreadEV < 0 },
  ];

  tiers.forEach(tier => {
    const picks = allAnalysis.filter(tier.filter);
    const avgEdge = picks.length > 0 ? picks.reduce((s, p) => s + p.edgeOverSpread, 0) / picks.length : 0;
    const avgEV = picks.length > 0 ? picks.reduce((s, p) => s + p.spreadEV, 0) / picks.length : 0;
    const avgCover = picks.length > 0 ? picks.reduce((s, p) => s + p.coverProb, 0) / picks.length : 0;
    const bothCoverCount = picks.filter(p => p.drPicksSameSide && p.hsPicksSameSide).length;
    const agreeCount = picks.filter(p => p.modelsAgree).length;
    
    console.log(`   ${tier.name}`);
    console.log(`      Picks: ${picks.length} | Avg Edge: ${avgEdge.toFixed(1)} pts | Avg Cover%: ${(avgCover * 100).toFixed(1)}% | Avg SpreadEV: ${avgEV >= 0 ? '+' : ''}${avgEV.toFixed(1)}%`);
    console.log(`      Both Models Cover: ${bothCoverCount}/${picks.length} | Models Agree Winner: ${agreeCount}/${picks.length}`);
    if (picks.length > 0 && picks.length <= 8) {
      picks.forEach(p => {
        console.log(`         → ${p.team} ${p.spread} (edge: +${p.edgeOverSpread.toFixed(1)}, EV: ${p.spreadEV >= 0 ? '+' : ''}${p.spreadEV.toFixed(1)}%)`);
      });
    }
    console.log();
  });

  // ═══════════════════════════════════════════════════════════
  // CROSS-REFERENCE: SPREAD EV vs ML EV
  // ═══════════════════════════════════════════════════════════
  
  console.log('┌───────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ CROSS-REFERENCE: Spread EV vs Moneyline EV                                    │');
  console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');

  const hasMLEV = allAnalysis.filter(a => a.mlPrediction && !a.mlPrediction.error);
  
  const bothPositive = hasMLEV.filter(a => a.spreadEV > 0 && a.mlPrediction.bestEV > 0);
  const spreadOnlyPos = hasMLEV.filter(a => a.spreadEV > 0 && a.mlPrediction.bestEV <= 0);
  const mlOnlyPos = hasMLEV.filter(a => a.spreadEV <= 0 && a.mlPrediction.bestEV > 0);
  const neitherPos = hasMLEV.filter(a => a.spreadEV <= 0 && a.mlPrediction.bestEV <= 0);

  console.log(`   📊 Games with model data: ${hasMLEV.length}`);
  console.log();
  console.log(`   🌟 BOTH +EV (Spread + ML):      ${bothPositive.length} games`);
  bothPositive.forEach(a => {
    console.log(`      → ${a.team} (${a.side}) | Spread: ${a.spread}, EV: +${a.spreadEV.toFixed(1)}% | ML: ${a.mlPrediction.bestOdds}, EV: +${a.mlPrediction.bestEV.toFixed(1)}%`);
  });
  
  console.log(`\n   📈 SPREAD ONLY +EV:               ${spreadOnlyPos.length} games`);
  spreadOnlyPos.forEach(a => {
    console.log(`      → ${a.team} (${a.side}) | Spread: ${a.spread}, EV: +${a.spreadEV.toFixed(1)}% | ML EV: ${a.mlPrediction.bestEV.toFixed(1)}%`);
  });
  
  console.log(`\n   💰 ML ONLY +EV:                   ${mlOnlyPos.length} games`);
  mlOnlyPos.forEach(a => {
    console.log(`      → ${a.mlPrediction.bestTeam} ML @ ${a.mlPrediction.bestOdds}, EV: +${a.mlPrediction.bestEV.toFixed(1)}% | Spread EV: ${a.spreadEV.toFixed(1)}%`);
  });
  
  console.log(`\n   ❌ NEITHER +EV:                    ${neitherPos.length} games`);

  // ═══════════════════════════════════════════════════════════
  // BEST COMBINED OPPORTUNITIES
  // ═══════════════════════════════════════════════════════════
  
  console.log('\n');
  console.log('┌───────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 🏆 BEST COMBINED OPPORTUNITIES (Spread EV + ML EV + Model Agreement)          │');
  console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');

  // Score = spreadEV + mlEV bonus + model agreement bonus + both cover bonus
  const scored = allAnalysis
    .filter(a => a.spreadEV > 0)
    .map(a => {
      const mlEV = a.mlPrediction && !a.mlPrediction.error ? a.mlPrediction.bestEV : 0;
      const mlBonus = mlEV > 2 ? 2 : mlEV > 0 ? 1 : 0;
      const agreeBonus = a.modelsAgree ? 1.5 : 0;
      const bothCoverBonus = (a.drPicksSameSide && a.hsPicksSameSide) ? 2 : 0;
      const compositeScore = a.spreadEV + mlBonus + agreeBonus + bothCoverBonus;
      
      return { ...a, mlEV, compositeScore };
    })
    .sort((a, b) => b.compositeScore - a.compositeScore);

  if (scored.length > 0) {
    console.log('   Rank │ Game                                │ Spread │ SpreadEV │ ML EV   │ Agree │ Both  │ Score');
    console.log('   ─────┼─────────────────────────────────────┼────────┼──────────┼─────────┼───────┼───────┼──────');

    scored.forEach((a, i) => {
      const mlStr = a.mlEV > 0 ? `+${a.mlEV.toFixed(1)}%` : `${a.mlEV.toFixed(1)}%`;
      const emoji = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `  ${i + 1}`;
      const agree = a.modelsAgree ? '✓' : '✗';
      const both = (a.drPicksSameSide && a.hsPicksSameSide) ? '✓' : '✗';

      console.log(`   ${String(emoji).padEnd(4)} │ ${(a.team + ' ' + a.spread).padEnd(35)} │ ${String(a.spread).padStart(5)}  │ +${a.spreadEV.toFixed(1).padStart(4)}%   │ ${mlStr.padStart(7)} │   ${agree}   │   ${both}   │ ${a.compositeScore.toFixed(1)}`);
    });
  } else {
    console.log('   No positive spread EV opportunities found.');
  }

  // ═══════════════════════════════════════════════════════════
  // KEY INSIGHT SUMMARY
  // ═══════════════════════════════════════════════════════════

  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                          KEY INSIGHTS                                         ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');

  const positiveSpreadEV = allAnalysis.filter(a => a.spreadEV > 0);
  const strongSpreadEV = allAnalysis.filter(a => a.spreadEV >= 3);
  const currentPrimeFilter = allAnalysis.filter(a => {
    if (!a.mlPrediction || a.mlPrediction.error) return false;
    return a.mlPrediction.bestEV >= 2 && a.modelsAgree && a.drPicksSameSide;
  });

  console.log(`   📊 Total games analyzed: ${allAnalysis.length}`);
  console.log(`   📈 Positive Spread EV: ${positiveSpreadEV.length} (${(positiveSpreadEV.length / allAnalysis.length * 100).toFixed(0)}% of games)`);
  console.log(`   🔥 Strong Spread EV (3%+): ${strongSpreadEV.length}`);
  console.log(`   🌟 Would pass current Prime filter: ${currentPrimeFilter.length}`);
  console.log();
  console.log(`   💡 OVERLAP: Games that are BOTH current Prime Picks AND have Spread EV:`);
  
  const overlap = allAnalysis.filter(a => {
    if (!a.mlPrediction || a.mlPrediction.error) return false;
    return a.mlPrediction.bestEV >= 2 && a.modelsAgree && a.drPicksSameSide && a.spreadEV > 0;
  });
  
  overlap.forEach(a => {
    console.log(`      🌟 ${a.team} — ML EV: +${a.mlPrediction.bestEV.toFixed(1)}% | Spread EV: +${a.spreadEV.toFixed(1)}% | Edge: +${a.edgeOverSpread.toFixed(1)} pts`);
  });
  if (overlap.length === 0) console.log('      (none)');

  console.log();
  console.log(`   💡 NEW OPPORTUNITIES: Positive Spread EV but NOT current Prime Picks:`);
  
  const newOpps = allAnalysis.filter(a => {
    if (!a.mlPrediction || a.mlPrediction.error) return a.spreadEV > 0;
    const isPrime = a.mlPrediction.bestEV >= 2 && a.modelsAgree && a.drPicksSameSide;
    return a.spreadEV > 0 && !isPrime;
  });
  
  newOpps.forEach(a => {
    const mlStr = a.mlPrediction && !a.mlPrediction.error ? `ML EV: ${a.mlPrediction.bestEV >= 0 ? '+' : ''}${a.mlPrediction.bestEV.toFixed(1)}%` : 'No ML data';
    console.log(`      📈 ${a.team} ${a.spread} — Spread EV: +${a.spreadEV.toFixed(1)}% | ${mlStr} | Edge: +${a.edgeOverSpread.toFixed(1)} pts`);
  });
  if (newOpps.length === 0) console.log('      (none)');

  console.log('\n');
}

analyzeSpreadEV()
  .then(() => {
    console.log('🎉 Spread EV analysis complete!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Failed:', error);
    process.exit(1);
  });
