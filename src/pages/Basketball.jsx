import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parseBasketballOdds } from '../utils/basketballOddsParser';
import { parseHaslametrics } from '../utils/haslametricsParser';
import { parseDRatings } from '../utils/dratingsParser';
import { matchGamesWithCSV, filterByQuality } from '../utils/gameMatchingCSV';
import { BasketballEdgeCalculator } from '../utils/basketballEdgeCalculator';
import { useBasketballResultsGrader } from '../hooks/useBasketballResultsGrader';
import { loadTeamMappings } from '../utils/teamCSVLoader';
import { startScorePolling } from '../utils/ncaaAPI';
import { gradePrediction, calculateGradingStats } from '../utils/basketballGrading';
import { gradeBasketballBet } from '../utils/basketballBetGrader';
import { BasketballLiveScore, GameStatusFilter } from '../components/BasketballLiveScore';
import { GradeStats } from '../components/GradeBadge';
import { BasketballPerformanceDashboard } from '../components/BasketballPerformanceDashboard';
import { getUnitSize, getUnitDisplay, getUnitColor } from '../utils/staggeredUnits';
import { getConfidenceRating, getBetTier } from '../utils/abcUnits';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  ELEVATION, 
  TYPOGRAPHY, 
  MOBILE_SPACING, 
  GRADIENTS, 
  getGradeColorScale
} from '../utils/designSystem';
import { getBasketballContext } from '../utils/basketballContextGenerator';

const Basketball = () => {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Live scoring state
  const [gamesWithLiveScores, setGamesWithLiveScores] = useState([]);
  const [gameStatusFilter, setGameStatusFilter] = useState('all');
  const [teamMappings, setTeamMappings] = useState(null);
  const [gradingStats, setGradingStats] = useState(null);
  
  // Bet outcomes state
  const [betsMap, setBetsMap] = useState(new Map());
  
  // Track which bets we've already attempted to grade (prevent duplicates)
  const [gradedGameIds, setGradedGameIds] = useState(new Set());
  
  // Auto-grade bets when results are available (CLIENT-SIDE!)
  const { grading, gradedCount } = useBasketballResultsGrader();

  useEffect(() => {
    loadBasketballData();
  }, []);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Fetch bet outcomes from Firebase
  useEffect(() => {
    async function fetchBets() {
      try {
        const betsSnapshot = await getDocs(collection(db, 'basketball_bets'));
        const betsData = new Map();
        
        betsSnapshot.forEach((doc) => {
          const bet = doc.data();
          // Create a normalized key for matching: awayTeam_homeTeam
          const normalizeTeam = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
          const key = `${normalizeTeam(bet.game.awayTeam)}_${normalizeTeam(bet.game.homeTeam)}`;
          betsData.set(key, bet);
        });
        
        setBetsMap(betsData);
      } catch (err) {
        console.error('Error fetching bets:', err);
      }
    }
    
    fetchBets();
    
    // Refresh bets every 15 seconds to catch newly graded bets
    const interval = setInterval(fetchBets, 15000);
    return () => clearInterval(interval);
  }, [gradedCount]); // Re-fetch when bets are graded
  
  // Start live score polling when we have games and mappings
  useEffect(() => {
    if (!recommendations || recommendations.length === 0 || !teamMappings) {
      return;
    }
    
    const stopPolling = startScorePolling(
      recommendations,
      teamMappings,
      async (updatedGames) => {
        // 🎯 GRADE ALL FINAL GAMES FIRST (batch processing with error isolation)
        const finalGames = updatedGames.filter(g => g.liveScore?.status === 'final');
        
        for (const game of finalGames) {
          const gameId = `${game.awayTeam}_${game.homeTeam}`;
          
          // Only attempt to grade each game once
          if (!gradedGameIds.has(gameId)) {
            setGradedGameIds(prev => new Set(prev).add(gameId));
            
            try {
              const graded = await gradeBasketballBet(
                game.awayTeam, 
                game.homeTeam, 
                game.liveScore, 
                game.prediction
              );
              
              if (graded) {
                console.log(`✅ Successfully graded bet for ${gameId}`);
              }
            } catch (error) {
              console.error(`❌ Failed to grade ${gameId}:`, error);
              // Remove from set so we can retry on next poll
              setGradedGameIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(gameId);
                return newSet;
              });
            }
          }
        }
        
        // Add grades and bet outcomes for display
        const gamesWithGradesAndBets = updatedGames.map(game => {
          const gameData = { ...game };
          
          // Add prediction grade if game is final
          if (game.liveScore && game.liveScore.status === 'final') {
            gameData.grade = gradePrediction(game, game.liveScore);
          }
          
          // Match and attach bet outcome from Firebase
          const normalizeTeam = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
          const betKey = `${normalizeTeam(game.awayTeam)}_${normalizeTeam(game.homeTeam)}`;
          const bet = betsMap.get(betKey);
          
          if (bet && bet.result?.outcome) {
            gameData.betOutcome = {
              outcome: bet.result.outcome,
              profit: bet.result.profit
            };
          }
          
          return gameData;
        });
        
        setGamesWithLiveScores(gamesWithGradesAndBets);
        
        // Calculate grading stats
        const stats = calculateGradingStats(gamesWithGradesAndBets);
        setGradingStats(stats);
      },
      15000 // Poll every 15 seconds
    );
    
    return stopPolling;
  }, [recommendations, teamMappings, betsMap, gradedGameIds]);

  async function loadBasketballData() {
    try {
      setLoading(true);
      
      // Load data files
      const oddsResponse = await fetch('/basketball_odds.md');
      const haslaResponse = await fetch('/haslametrics.md');
      const drateResponse = await fetch('/dratings.md');
      const csvResponse = await fetch('/basketball_teams.csv');
      
      const oddsMarkdown = await oddsResponse.text();
      const haslaMarkdown = await haslaResponse.text();
      const drateMarkdown = await drateResponse.text();
      const csvContent = await csvResponse.text();
      
      // Parse data (odds parser filters for TODAY only)
      const oddsGames = parseBasketballOdds(oddsMarkdown);
      
      const haslaData = parseHaslametrics(haslaMarkdown);
      const dratePreds = parseDRatings(drateMarkdown);
      
      // Load team mappings for live score matching
      const mappings = loadTeamMappings(csvContent);
      setTeamMappings(mappings);
      
      // Match games using CSV mappings (OddsTrader as base)
      const matchedGames = matchGamesWithCSV(oddsGames, haslaData, dratePreds, csvContent);
      
      // TODAY'S GAMES ONLY (parser filters by today's date)
      const todaysGames = matchedGames.map(game => ({
        ...game,
        // Add verification fields
        hasOdds: !!game.odds,
        hasDRatings: !!game.dratings,
        hasHaslametrics: !!game.haslametrics,
        verificationStatus: game.dratings ? 'MATCHED' : 'MISSING'
      }));
      
      // Calculate predictions for TODAY'S games (even if they fail, we still show the game)
      const calculator = new BasketballEdgeCalculator();
      const gamesWithPredictions = todaysGames.map(game => {
        // Try to calculate prediction, but keep game even if it fails
        try {
          const prediction = calculator.calculateEnsemblePrediction(game);
          return { ...game, prediction };
        } catch (err) {
          // Keep the game, just mark prediction as failed
          return { 
            ...game, 
            prediction: { 
              error: 'Prediction failed',
              grade: 'N/A' 
            } 
          };
        }
      });
      
      // CRITICAL FILTER: Only show games with BOTH Haslametrics AND D-Ratings
      // Include ALL games where our model predicts a WIN (>50% win probability)
      // Grading reflects whether we're MORE confident than market (positive EV = good grades)
      const qualityGames = gamesWithPredictions.filter(game => {
        // Must have a valid prediction (no error)
        if (game.prediction?.error) return false;
        
        // Must have HIGH confidence (only happens with BOTH sources)
        if (game.prediction?.confidence !== 'HIGH') return false;
        
        // Must have a grade
        if (!game.prediction?.grade || game.prediction.grade === 'N/A') return false;
        
        // INCLUDE if our model predicts this team will WIN (>50%)
        // This includes BOTH:
        // - Positive EV picks (we're MORE confident than market) → A+, A, B+, B, C grades
        // - Negative EV picks (market MORE confident than us) → D, F grades
        // Sorting will prioritize positive EV picks at the top
        const modelProb = game.prediction?.ensembleProb || 0;
        if (modelProb <= 0.5) return false;  // Skip if model doesn't predict a win
        
        return true;
      });
      
      // SORT BY VALUE: Prioritize games where our model is MORE CONFIDENT than market
      // This ensures we recommend teams we believe in more than the market does
      const sortedGames = qualityGames.sort((a, b) => {
        // Calculate "model advantage" - how much more confident we are than market
        const getModelAdvantage = (game) => {
          const pred = game.prediction;
          if (!pred) return 0;
          
          // Get the probabilities for the team we're picking
          const modelProb = pred.bestBet === 'away' ? pred.ensembleAwayProb : pred.ensembleHomeProb;
          const marketProb = pred.bestBet === 'away' ? pred.marketAwayProb : pred.marketHomeProb;
          
          return modelProb - marketProb; // Positive = we're more confident than market
        };
        
        const advantageA = getModelAdvantage(a);
        const advantageB = getModelAdvantage(b);
        
        // PRIORITY 1: Sort by whether we're MORE confident than market
        const aHasAdvantage = advantageA > 0;
        const bHasAdvantage = advantageB > 0;
        
        if (aHasAdvantage !== bHasAdvantage) {
          return bHasAdvantage ? 1 : -1; // Games with advantage first
        }
        
        // PRIORITY 2: Among similar advantage types, sort by grade
        const gradeOrder = { 'A+': 4, 'A': 3, 'B+': 2, 'B': 1, 'C': 0 };
        const gradeA = gradeOrder[a.prediction?.grade] || 0;
        const gradeB = gradeOrder[b.prediction?.grade] || 0;
        
        if (gradeA !== gradeB) {
          return gradeB - gradeA; // Higher grade first
        }
        
        // PRIORITY 3: Among same grade, sort by size of advantage
        if (Math.abs(advantageA - advantageB) > 0.001) {
          return advantageB - advantageA; // Bigger advantage first
        }
        
        // PRIORITY 4: Finally sort by time
        const timeA = a.odds?.gameTime || '';
        const timeB = b.odds?.gameTime || '';
        
        if (timeA === 'TBD') return 1;
        if (timeB === 'TBD') return -1;
        if (!timeA || !timeB) return 0;
        
        const parseTime = (timeStr) => {
          const match = timeStr.match(/(\d+):(\d+)(am|pm)/i);
          if (!match) return 0;
          let [_, hours, mins, period] = match;
          hours = parseInt(hours);
          mins = parseInt(mins);
          if (period.toLowerCase() === 'pm' && hours !== 12) hours += 12;
          if (period.toLowerCase() === 'am' && hours === 12) hours = 0;
          return hours * 60 + mins;
        };
        
        return parseTime(timeA) - parseTime(timeB);
      });
      
      setRecommendations(sortedGames);
      setStats({
        totalGames: oddsGames.length,
        qualityPicks: sortedGames.length,
        displayedGames: sortedGames.length,
        gamesWithDRatings: todaysGames.filter(g => g.hasDRatings).length,
        gamesWithHasla: todaysGames.filter(g => g.hasHaslametrics).length,
        missingDRatings: todaysGames.filter(g => !g.hasDRatings).length,
        avgEV: sortedGames.length > 0 
          ? (sortedGames.reduce((sum, g) => sum + (g.prediction?.bestEV || 0), 0) / sortedGames.length).toFixed(1)
          : '0.0'
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading basketball data:', err);
      setError(err.message);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '24px', marginBottom: '20px' }}>🏀</div>
        <div>Loading basketball data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#ff6b6b' }}>
        <div style={{ fontSize: '24px', marginBottom: '20px' }}>❌</div>
        <div>Error: {error}</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: isMobile ? '1rem' : '20px' }}>
      {/* Header - NHL Standard */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: isMobile ? '1.5rem' : '2rem', padding: isMobile ? '1rem' : '0' }}>
        {/* Back to NHL Button */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1rem',
            marginBottom: '1.5rem',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontWeight: '600',
            textDecoration: 'none',
            color: 'rgba(212, 175, 55, 0.9)',
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-4px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.08) 100%)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)';
          }}
        >
          <span style={{ fontSize: '1.125rem' }}>←</span>
          <span>🏒 NHL Today's Games</span>
        </Link>
        
        <h1 style={{
          fontSize: isMobile ? TYPOGRAPHY.hero.size : '2rem',
          fontWeight: TYPOGRAPHY.hero.weight,
          color: '#FF8C42',
          marginBottom: '0.75rem',
          textAlign: 'center',
          letterSpacing: '-0.02em',
          lineHeight: TYPOGRAPHY.hero.lineHeight
        }}>
          🏀 Today's Best Picks
        </h1>
        <p style={{ 
          fontSize: TYPOGRAPHY.body.size,
          fontWeight: TYPOGRAPHY.body.weight,
          color: 'rgba(255,255,255,0.8)', 
          textAlign: 'center',
          marginBottom: '0.5rem'
        }}>
          Value-driven recommendations with 2%+ expected edge
        </p>
      </div>

      {/* Unit Sizing Explainer - Premium (No Emoji) */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto 1.5rem auto', 
        padding: isMobile ? '0 1rem' : '0' 
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.10) 0%, rgba(59, 130, 246, 0.10) 100%)',
          border: '2px solid rgba(16, 185, 129, 0.25)',
          borderRadius: isMobile ? '14px' : '16px',
          padding: isMobile ? '1rem 1.125rem' : '1.125rem 1.375rem',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 5px 18px rgba(16, 185, 129, 0.15), inset 0 1px 0 rgba(255,255,255,0.08)'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: isMobile ? '0.875rem' : '0.938rem',
              fontWeight: '900',
              color: '#10B981',
              marginBottom: '0.375rem',
              letterSpacing: '-0.01em',
              textTransform: 'uppercase'
            }}>
              Smart Unit Allocation
            </div>
            <div style={{
              fontSize: isMobile ? '0.75rem' : '0.813rem',
              color: 'rgba(255,255,255,0.80)',
              lineHeight: 1.5,
              fontWeight: '600'
            }}>
              {isMobile 
                ? 'Unit sizes based on historical pattern performance (0.5u-5.0u)' 
                : 'Every matchup is analyzed, but unit allocation is scaled by historical pattern performance. Strong patterns receive up to 5.0 units, while volatile patterns are allocated 0.5-1.0 units for optimal risk management.'}
            </div>
          </div>
        </div>
      </div>

      {/* Premium Performance Dashboard - NHL Style */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 2rem auto', padding: isMobile ? '0 1rem' : '0' }}>
        <BasketballPerformanceDashboard />
        
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: isMobile ? '1rem' : '1.5rem',
            marginTop: '1.5rem',
            padding: isMobile ? '1.5rem' : '2rem',
            background: GRADIENTS.hero,
            borderRadius: isMobile ? MOBILE_SPACING.borderRadius : '16px',
            border: ELEVATION.elevated.border,
            boxShadow: ELEVATION.elevated.shadow
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: isMobile ? '1.5rem' : TYPOGRAPHY.hero.size,
                fontWeight: TYPOGRAPHY.hero.weight,
                color: '#10B981',
                lineHeight: TYPOGRAPHY.hero.lineHeight
              }}>
                {stats.qualityPicks}
              </div>
              <div style={{ 
                fontSize: TYPOGRAPHY.label.size,
                fontWeight: TYPOGRAPHY.label.weight,
                color: 'rgba(255,255,255,0.7)',
                textTransform: TYPOGRAPHY.label.textTransform,
                letterSpacing: TYPOGRAPHY.label.letterSpacing
              }}>
                QUALITY PICKS
              </div>
            </div>
            
            {!isMobile && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: TYPOGRAPHY.hero.size,
                  fontWeight: TYPOGRAPHY.hero.weight,
                  color: '#3B82F6',
                  lineHeight: TYPOGRAPHY.hero.lineHeight
                }}>
                  +{stats.avgEV}%
                </div>
                <div style={{ 
                  fontSize: TYPOGRAPHY.label.size,
                  fontWeight: TYPOGRAPHY.label.weight,
                  color: 'rgba(255,255,255,0.7)',
                  textTransform: TYPOGRAPHY.label.textTransform,
                  letterSpacing: TYPOGRAPHY.label.letterSpacing
                }}>
                  AVG EDGE
                </div>
              </div>
            )}
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: isMobile ? '1.5rem' : TYPOGRAPHY.hero.size,
                fontWeight: TYPOGRAPHY.hero.weight,
                color: '#FF8C42',
                lineHeight: TYPOGRAPHY.hero.lineHeight
              }}>
                {stats.totalGames}
              </div>
              <div style={{ 
                fontSize: TYPOGRAPHY.label.size,
                fontWeight: TYPOGRAPHY.label.weight,
                color: 'rgba(255,255,255,0.7)',
                textTransform: TYPOGRAPHY.label.textTransform,
                letterSpacing: TYPOGRAPHY.label.letterSpacing
              }}>
                GAMES TODAY
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grading Stats (only show if we have graded games) */}
      {gradingStats && gradingStats.totalGames > 0 && (
        <div style={{ maxWidth: '1200px', margin: '0 auto 2rem auto' }}>
          <GradeStats stats={gradingStats} />
        </div>
      )}
      
      {/* Game Status Filter */}
      {gamesWithLiveScores.length > 0 && (
        <div style={{ maxWidth: '1200px', margin: '0 auto 1rem auto' }}>
          <GameStatusFilter
            currentFilter={gameStatusFilter}
            onFilterChange={setGameStatusFilter}
            counts={{
              all: gamesWithLiveScores.length,
              scheduled: gamesWithLiveScores.filter(g => !g.liveScore || g.liveScore.status === 'pre').length,
              live: gamesWithLiveScores.filter(g => g.liveScore && g.liveScore.status === 'live').length,
              final: gamesWithLiveScores.filter(g => g.liveScore && g.liveScore.status === 'final').length
            }}
          />
        </div>
      )}
      
      {/* Game Cards */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {recommendations.length === 0 ? (
          <div style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
            border: '2px dashed rgba(139, 92, 246, 0.3)',
            borderRadius: '20px',
            padding: isMobile ? '3rem 1.5rem' : '4rem 2rem',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{
              fontSize: isMobile ? '3rem' : '4rem',
              marginBottom: '1.5rem',
              opacity: 0.8
            }}>
              🏀
            </div>
            <div style={{
              fontSize: isMobile ? TYPOGRAPHY.heading.size : '1.5rem',
              fontWeight: '800',
              color: 'white',
              marginBottom: '0.75rem',
              letterSpacing: '-0.01em'
            }}>
              No Quality Picks Today
            </div>
            <div style={{
              fontSize: TYPOGRAPHY.body.size,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: '1.6',
              maxWidth: '400px',
              margin: '0 auto'
            }}>
              Our model hasn't found any games with 2%+ expected value today. Check back later for updated odds.
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: isMobile ? '1rem' : '1.5rem' }}>
            {(() => {
              // Use gamesWithLiveScores if available, otherwise use recommendations
              const gamesToShow = gamesWithLiveScores.length > 0 ? gamesWithLiveScores : recommendations;
              
              // Apply status filter
              const filteredGames = gamesToShow.filter(game => {
                if (gameStatusFilter === 'all') return true;
                if (!game.liveScore) return gameStatusFilter === 'pre';
                return game.liveScore.status === gameStatusFilter;
              });
              
              // 🎯 GROUP BY CONVICTION TIER (all are bets!)
              const gamesByTier = {
                max: [],
                moderate: [],
                small: []
              };
              
              filteredGames.forEach(game => {
                if (!game.prediction?.grade || !game.bet?.odds) {
                  gamesByTier.moderate.push(game); // Default to moderate if no tier data
                  return;
                }
                
                const tier = getBetTier(game.prediction.grade, game.bet.odds, game.prediction.unitSize);
                if (tier.tier === 1) gamesByTier.max.push(game);
                else if (tier.tier === 2) gamesByTier.moderate.push(game);
                else gamesByTier.small.push(game);
              });
              
              // Calculate tier statistics for enhanced header
              const allTiers = {
                maximum: {
                  count: gamesByTier.max.length,
                  totalUnits: gamesByTier.max.reduce((sum, g) => sum + (g.prediction?.unitSize || 0), 0),
                  games: gamesByTier.max
                },
                moderate: {
                  count: gamesByTier.moderate.length,
                  totalUnits: gamesByTier.moderate.reduce((sum, g) => sum + (g.prediction?.unitSize || 0), 0),
                  games: gamesByTier.moderate
                },
                small: {
                  count: gamesByTier.small.length,
                  totalUnits: gamesByTier.small.reduce((sum, g) => sum + (g.prediction?.unitSize || 0), 0),
                  games: gamesByTier.small
                }
              };
              
              let rankCounter = 1;
              
              return (
                <>
                  {/* TIER 1: MAXIMUM CONVICTION (5.0u) */}
                  {gamesByTier.max.length > 0 && (
                    <>
                      <TierHeader 
                        emoji="🔥" 
                        title={isMobile ? "MAX CONVICTION" : "MAXIMUM CONVICTION"}
                        subtitle={`${gamesByTier.max.length} game${gamesByTier.max.length !== 1 ? 's' : ''} • Top-tier opportunities with 5.0 unit allocation`}
                        color="#10B981"
                        unitRange="5.0u"
                        isMobile={isMobile}
                      />
                      {gamesByTier.max.map((game) => (
                        <BasketballGameCard 
                          key={rankCounter} 
                          game={game} 
                          rank={rankCounter++} 
                          isMobile={isMobile}
                          hasLiveScore={!!game.liveScore}
                        />
                      ))}
                    </>
                  )}
                  
                  {/* TIER 2: MODERATE CONVICTION (1.5-4.0u) */}
                  {gamesByTier.moderate.length > 0 && (
                    <>
                      <EnhancedTierHeader 
                        emoji="⚡" 
                        title="MODERATE CONVICTION" 
                        subtitle={`${gamesByTier.moderate.length} game${gamesByTier.moderate.length !== 1 ? 's' : ''} • Standard allocation between 1.5-4.0 units`}
                        color="#3B82F6"
                        unitRange="1.5-4.0u"
                        isMobile={isMobile}
                        tierGames={gamesByTier.moderate}
                        allTiers={allTiers}
                      />
                      {gamesByTier.moderate.map((game) => (
                        <BasketballGameCard 
                          key={rankCounter} 
                          game={game} 
                          rank={rankCounter++} 
                          isMobile={isMobile}
                          hasLiveScore={!!game.liveScore}
                        />
                      ))}
                    </>
                  )}
                  
                  {/* TIER 3: SMALL POSITION (0.5-1.0u) */}
                  {gamesByTier.small.length > 0 && (
                    <>
                      <TierHeader 
                        emoji="📊" 
                        title="SMALL POSITION" 
                        subtitle={`${gamesByTier.small.length} game${gamesByTier.small.length !== 1 ? 's' : ''} • Conservative 0.5-1.0 unit allocation for risk management`}
                        color="#8B5CF6"
                        unitRange="0.5-1.0u"
                        isMobile={isMobile}
                      />
                      {gamesByTier.small.map((game) => (
                        <BasketballGameCard 
                          key={rankCounter} 
                          game={game} 
                          rank={rankCounter++} 
                          isMobile={isMobile}
                          hasLiveScore={!!game.liveScore}
                        />
                      ))}
                    </>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components

// Tier Header Component - Premium Mobile-Optimized
// Enhanced Tier Header with Visual Distribution + Top Plays
const EnhancedTierHeader = ({ 
  emoji, 
  title, 
  subtitle, 
  color, 
  unitRange, 
  isMobile,
  tierGames,
  allTiers
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // Calculate tier stats
  const totalUnits = tierGames.reduce((sum, g) => sum + (g.prediction?.unitSize || 0), 0);
  const avgROI = tierGames.length > 0 
    ? tierGames.reduce((sum, g) => sum + (g.prediction?.historicalROI || 0), 0) / tierGames.length 
    : 0;
  const expectedProfit = totalUnits * (avgROI / 100);
  
  // Get top 3 plays by unit size
  const topPlays = [...tierGames]
    .sort((a, b) => (b.prediction?.unitSize || 0) - (a.prediction?.unitSize || 0))
    .slice(0, 3);
  
  // Calculate 5-tier granular distribution for PREMIUM visual
  const distributionTiers = {
    elite: { min: 5.0, max: 5.0, games: [], totalUnits: 0, color: '#10B981', label: 'Elite' },
    premium: { min: 4.0, max: 4.9, games: [], totalUnits: 0, color: '#14B8A6', label: 'Premium' },
    standard: { min: 2.5, max: 3.9, games: [], totalUnits: 0, color: '#3B82F6', label: 'Standard' },
    conservative: { min: 1.0, max: 2.4, games: [], totalUnits: 0, color: '#8B5CF6', label: 'Conservative' },
    minimal: { min: 0.5, max: 0.9, games: [], totalUnits: 0, color: '#6366F1', label: 'Minimal' }
  };
  
  // Distribute all games across tiers
  const allGames = [...allTiers.maximum.games, ...allTiers.moderate.games, ...allTiers.small.games];
  allGames.forEach(game => {
    const units = game.prediction?.unitSize || 0;
    
    if (units >= 5.0) {
      distributionTiers.elite.games.push(game);
      distributionTiers.elite.totalUnits += units;
    } else if (units >= 4.0) {
      distributionTiers.premium.games.push(game);
      distributionTiers.premium.totalUnits += units;
    } else if (units >= 2.5) {
      distributionTiers.standard.games.push(game);
      distributionTiers.standard.totalUnits += units;
    } else if (units >= 1.0) {
      distributionTiers.conservative.games.push(game);
      distributionTiers.conservative.totalUnits += units;
    } else if (units >= 0.5) {
      distributionTiers.minimal.games.push(game);
      distributionTiers.minimal.totalUnits += units;
    }
  });
  
  const grandTotal = Object.values(distributionTiers).reduce((sum, tier) => sum + tier.totalUnits, 0);
  
  return (
    <div style={{
      background: `linear-gradient(135deg, ${color}18 0%, ${color}10 100%)`,
      border: `2px solid ${color}40`,
      borderRadius: isMobile ? '14px' : '16px',
      padding: isMobile ? '1rem 1.125rem' : '1.125rem 1.375rem',
      marginBottom: isMobile ? '0.75rem' : '1rem',
      backdropFilter: 'blur(12px)',
      boxShadow: `0 6px 20px ${color}20, inset 0 1px 0 rgba(255,255,255,0.08)`,
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }}
    onClick={() => setExpanded(!expanded)}
    >
      {/* Subtle glow effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at top left, ${color}15 0%, transparent 60%)`,
        pointerEvents: 'none'
      }} />
      
      {/* Main Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: isMobile ? '0.875rem' : '1rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Emoji Badge */}
        <div style={{
          width: isMobile ? '42px' : '48px',
          height: isMobile ? '42px' : '48px',
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${color}30 0%, ${color}20 100%)`,
          border: `2px solid ${color}50`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isMobile ? '1.375rem' : '1.5rem',
          flexShrink: 0,
          boxShadow: `0 4px 12px ${color}25, inset 0 1px 0 rgba(255,255,255,0.15)`
        }}>
          {emoji}
        </div>
        
        {/* Text Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: isMobile ? '0.938rem' : '1.063rem',
            fontWeight: '900',
            color: color,
            letterSpacing: '-0.02em',
            marginBottom: '0.25rem',
            textShadow: `0 2px 16px ${color}35`,
            lineHeight: 1.15
          }}>
            {title}
          </div>
          <div style={{
            fontSize: isMobile ? '0.688rem' : '0.75rem',
            color: 'rgba(255,255,255,0.70)',
            lineHeight: 1.35,
            fontWeight: '600'
          }}>
            {tierGames.length} games • {totalUnits.toFixed(1)}u allocated • {avgROI >= 0 ? '+' : ''}{avgROI.toFixed(1)}% ROI
          </div>
        </div>
        
        {/* Expected Profit Badge - ONLY show if positive */}
        {expectedProfit >= 0 && (
          <div style={{
            padding: isMobile ? '0.375rem 0.625rem' : '0.5rem 0.875rem',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.25) 0%, rgba(16,185,129,0.15) 100%)',
            border: '1.5px solid rgba(16,185,129,0.40)',
            borderRadius: '10px',
            fontSize: isMobile ? '0.75rem' : '0.813rem',
            fontWeight: '900',
            color: '#10B981',
            fontFeatureSettings: "'tnum'",
            letterSpacing: '0.02em',
            boxShadow: '0 2px 8px rgba(16,185,129,0.20)',
            whiteSpace: 'nowrap'
          }}>
            +{expectedProfit.toFixed(1)}u
          </div>
        )}
      </div>
      
      {/* Expanded Content */}
      {expanded && (
        <div style={{
          marginTop: isMobile ? '0.875rem' : '1rem',
          paddingTop: isMobile ? '0.875rem' : '1rem',
          borderTop: `1px solid ${color}25`,
          position: 'relative',
          zIndex: 1
        }}>
          {/* Visual Distribution - 5-TIER PREMIUM GRANULAR */}
          <div style={{
            marginBottom: isMobile ? '1rem' : '1.25rem'
          }}>
            <div style={{
              fontSize: isMobile ? '0.688rem' : '0.75rem',
              color: 'rgba(255,255,255,0.85)',
              fontWeight: '900',
              marginBottom: isMobile ? '0.625rem' : '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: isMobile ? '3px' : '4px',
                height: isMobile ? '12px' : '14px',
                background: `linear-gradient(180deg, ${color} 0%, ${color}80 100%)`,
                borderRadius: '2px'
              }} />
              Today's Distribution
            </div>
            
            {/* Render 5 granular tiers */}
            {Object.entries(distributionTiers).map(([key, tier], idx) => {
              const percent = grandTotal > 0 ? (tier.totalUnits / grandTotal) * 100 : 0;
              const isLast = idx === Object.keys(distributionTiers).length - 1;
              
              // Only show tiers with games
              if (tier.games.length === 0) return null;
              
              return (
                <div key={key} style={{
                  background: 'rgba(0,0,0,0.25)',
                  borderRadius: '10px',
                  padding: isMobile ? '0.625rem 0.75rem' : '0.75rem 0.875rem',
                  border: `1px solid ${tier.color}20`,
                  backdropFilter: 'blur(8px)',
                  marginBottom: isLast ? 0 : (isMobile ? '0.5rem' : '0.625rem')
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{
                      fontSize: isMobile ? '0.625rem' : '0.688rem',
                      color: tier.color,
                      fontWeight: idx === 0 ? '800' : '700',
                      letterSpacing: '0.02em'
                    }}>
                      {tier.label.toUpperCase()} <span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: '600' }}>
                        ({tier.min === tier.max ? `${tier.min}u` : `${tier.min}-${tier.max}u`})
                      </span>
                    </div>
                    <div style={{
                      fontSize: isMobile ? '0.625rem' : '0.688rem',
                      fontWeight: '800',
                      color: tier.color,
                      fontFeatureSettings: "'tnum'",
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem'
                    }}>
                      <span style={{ color: 'rgba(255,255,255,0.60)', fontWeight: '600' }}>
                        {tier.games.length} game{tier.games.length !== 1 ? 's' : ''}
                      </span>
                      <span style={{
                        padding: '0.125rem 0.375rem',
                        background: `${tier.color}15`,
                        borderRadius: '4px',
                        border: `1px solid ${tier.color}30`
                      }}>
                        {tier.totalUnits.toFixed(1)}u
                      </span>
                    </div>
                  </div>
                  <div style={{
                    height: isMobile ? '7px' : '9px',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.04) 100%)',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.08)',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: `${percent}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${tier.color} 0%, ${tier.color}DD 100%)`,
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: `0 0 10px ${tier.color}40`,
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '50%',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
                        borderRadius: '6px 6px 0 0'
                      }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Top Plays - PREMIUM */}
          <div style={{
            background: 'rgba(0,0,0,0.25)',
            borderRadius: '12px',
            padding: isMobile ? '0.875rem' : '1rem',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{
              fontSize: isMobile ? '0.688rem' : '0.75rem',
              color: 'rgba(255,255,255,0.85)',
              fontWeight: '900',
              marginBottom: isMobile ? '0.75rem' : '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: isMobile ? '3px' : '4px',
                height: isMobile ? '12px' : '14px',
                background: `linear-gradient(180deg, ${color} 0%, ${color}80 100%)`,
                borderRadius: '2px'
              }} />
              Top Plays in This Tier
            </div>
            
            {topPlays.map((game, idx) => {
              const gradeColors = getGradeColorScale(game.prediction?.grade || 'B');
              const rankColors = ['#10B981', '#14B8A6', '#3B82F6'];
              const rankColor = rankColors[idx] || color;
              
              return (
                <div key={idx} style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '10px',
                  padding: isMobile ? '0.625rem 0.75rem' : '0.75rem 0.875rem',
                  marginBottom: idx < topPlays.length - 1 ? (isMobile ? '0.5rem' : '0.625rem') : 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '0.625rem' : '0.75rem',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.05) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
                >
                  {/* Rank Badge - Gradient */}
                  <div style={{
                    width: isMobile ? '26px' : '30px',
                    height: isMobile ? '26px' : '30px',
                    borderRadius: '8px',
                    background: `linear-gradient(135deg, ${rankColor}35 0%, ${rankColor}20 100%)`,
                    border: `2px solid ${rankColor}50`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? '0.688rem' : '0.75rem',
                    fontWeight: '900',
                    color: rankColor,
                    flexShrink: 0,
                    boxShadow: `0 4px 12px ${rankColor}25, inset 0 1px 0 rgba(255,255,255,0.15)`,
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `radial-gradient(circle at top, ${rankColor}20 0%, transparent 70%)`,
                      pointerEvents: 'none'
                    }} />
                    {idx + 1}
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: isMobile ? '0.75rem' : '0.813rem',
                      fontWeight: '900',
                      color: 'rgba(255,255,255,0.95)',
                      marginBottom: '0.25rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      letterSpacing: '-0.01em'
                    }}>
                      {game.awayTeam} @ {game.homeTeam}
                    </div>
                    <div style={{
                      fontSize: isMobile ? '0.625rem' : '0.688rem',
                      color: 'rgba(255,255,255,0.60)',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{
                        padding: '0.125rem 0.375rem',
                        background: `${gradeColors.borderColor}20`,
                        border: `1px solid ${gradeColors.borderColor}35`,
                        borderRadius: '4px',
                        color: gradeColors.color,
                        fontWeight: '800',
                        fontSize: isMobile ? '0.625rem' : '0.688rem'
                      }}>
                        {game.prediction?.grade}
                      </span>
                      <span style={{
                        color: 'rgba(255,255,255,0.55)',
                        fontFeatureSettings: "'tnum'"
                      }}>
                        {game.prediction?.bestOdds > 0 ? '+' : ''}{game.prediction?.bestOdds}
                      </span>
                    </div>
                  </div>
                  
                  {/* Unit Badge */}
                  <div style={{
                    padding: isMobile ? '0.375rem 0.625rem' : '0.5rem 0.75rem',
                    background: `linear-gradient(135deg, ${color}30 0%, ${color}20 100%)`,
                    border: `1.5px solid ${color}45`,
                    borderRadius: '8px',
                    fontSize: isMobile ? '0.75rem' : '0.813rem',
                    fontWeight: '900',
                    color: color,
                    whiteSpace: 'nowrap',
                    boxShadow: `0 2px 8px ${color}20, inset 0 1px 0 rgba(255,255,255,0.1)`,
                    fontFeatureSettings: "'tnum'",
                    letterSpacing: '-0.01em'
                  }}>
                    {game.prediction?.unitSize.toFixed(1)}u
                  </div>
                  
                  {/* ROI Badge */}
                  <div style={{
                    padding: isMobile ? '0.375rem 0.5rem' : '0.5rem 0.625rem',
                    background: game.prediction?.historicalROI >= 0 
                      ? 'linear-gradient(135deg, rgba(16,185,129,0.20) 0%, rgba(16,185,129,0.12) 100%)'
                      : 'linear-gradient(135deg, rgba(245,158,11,0.20) 0%, rgba(245,158,11,0.12) 100%)',
                    border: game.prediction?.historicalROI >= 0
                      ? '1.5px solid rgba(16,185,129,0.35)'
                      : '1.5px solid rgba(245,158,11,0.35)',
                    borderRadius: '8px',
                    fontSize: isMobile ? '0.688rem' : '0.75rem',
                    fontWeight: '900',
                    color: game.prediction?.historicalROI >= 0 ? '#10B981' : '#F59E0B',
                    whiteSpace: 'nowrap',
                    fontFeatureSettings: "'tnum'",
                    boxShadow: game.prediction?.historicalROI >= 0
                      ? '0 2px 8px rgba(16,185,129,0.15)'
                      : '0 2px 8px rgba(245,158,11,0.15)'
                  }}>
                    {game.prediction?.historicalROI >= 0 ? '+' : ''}{game.prediction?.historicalROI.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Click to collapse hint - PREMIUM */}
          <div style={{
            marginTop: isMobile ? '1rem' : '1.125rem',
            paddingTop: isMobile ? '0.875rem' : '1rem',
            borderTop: `1px solid ${color}15`,
            textAlign: 'center'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.375rem 0.875rem',
              background: `linear-gradient(135deg, ${color}12 0%, ${color}08 100%)`,
              border: `1px solid ${color}20`,
              borderRadius: '8px',
              fontSize: isMobile ? '0.625rem' : '0.688rem',
              color: 'rgba(255,255,255,0.55)',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${color}20 0%, ${color}12 100%)`;
              e.currentTarget.style.borderColor = `${color}35`;
              e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${color}12 0%, ${color}08 100%)`;
              e.currentTarget.style.borderColor = `${color}20`;
              e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
            }}
            >
              <span>Collapse Details</span>
              <span style={{ fontSize: isMobile ? '0.75rem' : '0.813rem' }}>↑</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Click to expand hint (when collapsed) - PREMIUM */}
      {!expanded && (
        <div style={{
          marginTop: isMobile ? '0.75rem' : '0.875rem',
          paddingTop: isMobile ? '0.75rem' : '0.875rem',
          borderTop: `1px solid ${color}15`,
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 0.875rem',
            background: `linear-gradient(135deg, ${color}12 0%, ${color}08 100%)`,
            border: `1px solid ${color}20`,
            borderRadius: '8px',
            fontSize: isMobile ? '0.625rem' : '0.688rem',
            color: 'rgba(255,255,255,0.55)',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `linear-gradient(135deg, ${color}20 0%, ${color}12 100%)`;
            e.currentTarget.style.borderColor = `${color}35`;
            e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `linear-gradient(135deg, ${color}12 0%, ${color}08 100%)`;
            e.currentTarget.style.borderColor = `${color}20`;
            e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
          }}
          >
            <span>View Details</span>
            <span style={{ fontSize: isMobile ? '0.75rem' : '0.813rem' }}>↓</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple Tier Header (for non-moderate tiers)
const TierHeader = ({ emoji, title, subtitle, color, unitRange, isMobile }) => {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${color}18 0%, ${color}10 100%)`,
      border: `2px solid ${color}40`,
      borderRadius: isMobile ? '14px' : '16px',
      padding: isMobile ? '1rem 1.125rem' : '1.125rem 1.375rem',
      marginBottom: isMobile ? '0.75rem' : '1rem',
      backdropFilter: 'blur(12px)',
      boxShadow: `0 6px 20px ${color}20, inset 0 1px 0 rgba(255,255,255,0.08)`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle glow effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at top left, ${color}15 0%, transparent 60%)`,
        pointerEvents: 'none'
      }} />
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: isMobile ? '0.875rem' : '1rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Emoji Badge */}
        <div style={{
          width: isMobile ? '42px' : '48px',
          height: isMobile ? '42px' : '48px',
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${color}30 0%, ${color}20 100%)`,
          border: `2px solid ${color}50`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isMobile ? '1.375rem' : '1.5rem',
          flexShrink: 0,
          boxShadow: `0 4px 12px ${color}25, inset 0 1px 0 rgba(255,255,255,0.15)`
        }}>
          {emoji}
        </div>
        
        {/* Text Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: isMobile ? '0.938rem' : '1.063rem',
            fontWeight: '900',
            color: color,
            letterSpacing: '-0.02em',
            marginBottom: '0.25rem',
            textShadow: `0 2px 16px ${color}35`,
            lineHeight: 1.15
          }}>
            {title}
          </div>
          <div style={{
            fontSize: isMobile ? '0.688rem' : '0.75rem',
            color: 'rgba(255,255,255,0.70)',
            lineHeight: 1.35,
            fontWeight: '600'
          }}>
            {subtitle}
          </div>
        </div>
        
        {/* Unit Range Badge (desktop only) */}
        {!isMobile && unitRange && (
          <div style={{
            padding: '0.5rem 0.875rem',
            background: `linear-gradient(135deg, ${color}25 0%, ${color}15 100%)`,
            border: `1.5px solid ${color}40`,
            borderRadius: '10px',
            fontSize: '0.813rem',
            fontWeight: '900',
            color: color,
            fontFeatureSettings: "'tnum'",
            letterSpacing: '0.02em',
            boxShadow: `0 2px 8px ${color}20`
          }}>
            {unitRange}
          </div>
        )}
      </div>
    </div>
  );
};

const BasketballGameCard = ({ game, rank, isMobile, hasLiveScore }) => {
  const [showDetails, setShowDetails] = useState(false);
  const pred = game.prediction;
  const odds = game.odds;
  const liveScore = game.liveScore;
  const grade = game.grade;
  
  // If no prediction, show minimal card with just game info
  if (!pred || pred.error) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
        borderRadius: isMobile ? MOBILE_SPACING.borderRadius : '20px',
        border: ELEVATION.elevated.border,
        boxShadow: ELEVATION.elevated.shadow,
        padding: isMobile ? '1rem' : '1.25rem',
        opacity: 0.6
      }}>
        <div style={{ color: 'white', fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          {game.awayTeam} @ {game.homeTeam}
        </div>
        <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
          {odds?.gameTime || 'TBD'}
        </div>
        {liveScore && (
          <div style={{ marginTop: '0.75rem', color: '#10B981', fontWeight: '700' }}>
            {liveScore.awayScore} - {liveScore.homeScore} ({liveScore.status})
          </div>
        )}
        {!pred && <div style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.5rem' }}>No prediction available</div>}
      </div>
    );
  }
  
  const gradeColors = getGradeColorScale(pred.grade);
  
  // Format game time (remove "ET" suffix for cleaner look)
  const formatGameTime = (time) => {
    if (!time || time === 'TBD') return 'TBD';
    return time.replace(/\s+ET$/i, '').trim();
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
      borderRadius: isMobile ? MOBILE_SPACING.borderRadius : '20px',
      border: pred.grade === 'A+' 
        ? `2px solid ${gradeColors.borderColor}` 
        : ELEVATION.elevated.border,
      boxShadow: pred.grade === 'A+' 
        ? `0 8px 32px ${gradeColors.borderColor}40, 0 0 60px ${gradeColors.borderColor}15`
        : ELEVATION.elevated.shadow,
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative'
    }}>
      {/* Animated gradient overlay for A+ picks */}
      {pred.grade === 'A+' && (
        <>
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '200%',
            height: '100%',
            background: `linear-gradient(90deg, transparent, ${gradeColors.borderColor}15, transparent)`,
            animation: 'shimmer 3s infinite',
            pointerEvents: 'none',
            zIndex: 1
          }} />
          <style>{`
            @keyframes shimmer {
              0% { transform: translateX(0); }
              100% { transform: translateX(50%); }
            }
          `}</style>
        </>
      )}
      
      {/* HEADER - Unit-First Design */}
      <div style={{ 
        padding: isMobile ? '1rem' : '1.125rem',
        borderBottom: ELEVATION.flat.border,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 100%)',
        position: 'relative',
        zIndex: 2
      }}>
        {/* 🎯 UNIT SIZE HERO + CONFIDENCE BADGE */}
        {(() => {
          const tierInfo = getBetTier(pred.grade, pred.bestOdds, pred.unitSize);
          const confidence = getConfidenceRating(pred.grade, pred.bestOdds, pred.unitSize);
          
          return (
            <div style={{
              marginBottom: isMobile ? '0.75rem' : '0.875rem'
            }}>
              {/* UNIT SIZE - HERO ELEMENT */}
              <div style={{
                marginBottom: '0.625rem',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: '0.75rem'
              }}>
                {/* Left: BET label + HUGE unit */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{
                    fontSize: isMobile ? '0.813rem' : '0.875rem',
                    color: 'rgba(255,255,255,0.6)',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em'
                  }}>
                    BET:
                  </span>
                  <span style={{
                    fontSize: isMobile ? '2rem' : '2.25rem',
                    fontWeight: '900',
                    color: tierInfo.color,
                    letterSpacing: '-0.04em',
                    fontFeatureSettings: "'tnum'",
                    textShadow: `0 2px 16px ${tierInfo.color}40, 0 0 40px ${tierInfo.color}20`,
                    lineHeight: 0.9
                  }}>
                    {pred.unitSize > 0 ? `${pred.unitSize}u` : '0.5u'}
                  </span>
                </div>
                
                {/* Right: Confidence badge (NO EMOJI - PREMIUM) */}
                <div style={{
                  background: `linear-gradient(135deg, ${confidence.color}20 0%, ${confidence.color}12 100%)`,
                  border: `2px solid ${confidence.color}50`,
                  borderRadius: '10px',
                  padding: isMobile ? '0.563rem 0.875rem' : '0.625rem 1rem',
                  boxShadow: `0 3px 12px ${confidence.color}22, inset 0 1px 0 rgba(255,255,255,0.08)`
                }}>
                  <span style={{
                    fontSize: isMobile ? '0.75rem' : '0.813rem',
                    fontWeight: '900',
                    color: confidence.color,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    textShadow: `0 1px 6px ${confidence.color}30`
                  }}>
                    {confidence.label}
                  </span>
                </div>
              </div>
              
              {/* Pattern Context */}
              <div style={{
                fontSize: isMobile ? '0.688rem' : '0.75rem',
                color: 'rgba(255,255,255,0.70)',
                fontWeight: '600',
                lineHeight: 1.4,
                letterSpacing: '0.01em'
              }}>
                {pred.oddsRangeName || 'Standard odds'} pattern
              </div>
            </div>
          );
        })()}
        
        {/* Top Row: Rank + Teams + Time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '0.75rem' }}>
          {/* Rank Badge */}
          <div style={{
            width: isMobile ? '28px' : '32px',
            height: isMobile ? '28px' : '32px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${gradeColors.borderColor}30 0%, ${gradeColors.borderColor}15 100%)`,
            border: `1.5px solid ${gradeColors.borderColor}50`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            fontWeight: '800',
            color: gradeColors.color,
            flexShrink: 0
          }}>
            {rank}
          </div>
          
          {/* Teams + Time */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ 
              fontSize: isMobile ? '0.938rem' : '1.063rem',
              fontWeight: '800',
              color: 'white',
              marginBottom: '0.188rem',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}>
              {game.awayTeam} @ {game.homeTeam}
            </div>
            <div style={{ 
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'rgba(255,255,255,0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem'
            }}>
              <span style={{ color: gradeColors.color, fontSize: '0.5rem' }}>●</span> {formatGameTime(odds?.gameTime)}
            </div>
          </div>
        </div>
        
        {/* Premium Result Bar - FINAL GAMES */}
          {game.betOutcome && (
            <div style={{
            marginTop: '0.75rem',
              background: game.betOutcome.outcome === 'WIN' 
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.06) 100%)'
              : 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(220, 38, 38, 0.06) 100%)',
            backdropFilter: 'blur(10px)',
            border: `1.5px solid ${game.betOutcome.outcome === 'WIN' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
              borderRadius: '10px',
            padding: isMobile ? '0.625rem 0.75rem' : '0.75rem 0.875rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            boxShadow: game.betOutcome.outcome === 'WIN'
              ? '0 4px 16px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255,255,255,0.06)'
              : '0 4px 16px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255,255,255,0.06)'
          }}>
            {/* Left: Grade + Units (compact) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {/* Grade */}
              <div style={{
                background: `linear-gradient(135deg, ${gradeColors.borderColor}20 0%, ${gradeColors.borderColor}10 100%)`,
                border: `1.5px solid ${gradeColors.borderColor}`,
                color: gradeColors.color,
                padding: isMobile ? '0.313rem 0.563rem' : '0.375rem 0.625rem',
                borderRadius: '7px',
              fontWeight: '900',
                fontSize: isMobile ? '0.813rem' : '0.875rem',
                letterSpacing: '-0.01em',
                boxShadow: `0 2px 8px ${gradeColors.borderColor}20`
              }}>
                {pred.grade}
              </div>
              
              {/* Units */}
              <div style={{
                background: `linear-gradient(135deg, ${getUnitColor(pred.grade)}15 0%, ${getUnitColor(pred.grade)}08 100%)`,
                border: `1.5px solid ${getUnitColor(pred.grade)}`,
                color: getUnitColor(pred.grade),
                padding: isMobile ? '0.313rem 0.563rem' : '0.375rem 0.625rem',
                borderRadius: '7px',
                fontWeight: '900',
                fontSize: isMobile ? '0.75rem' : '0.813rem',
                letterSpacing: '0.01em',
                fontFeatureSettings: "'tnum'",
                boxShadow: `0 2px 8px ${getUnitColor(pred.grade)}20`
              }}>
                {getUnitDisplay(pred.grade)}
              </div>
            </div>
            
            {/* Right: Profit (hero element) */}
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: isMobile ? '0.25rem 0.5rem' : '0.313rem 0.625rem',
              background: game.betOutcome.outcome === 'WIN'
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
              borderRadius: '8px',
              border: `1px solid ${game.betOutcome.outcome === 'WIN' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
            }}>
              <div style={{
                fontSize: isMobile ? '1rem' : '1.125rem',
                lineHeight: 1,
                filter: game.betOutcome.outcome === 'WIN'
                  ? 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.4))'
                  : 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.4))'
              }}>
                {game.betOutcome.outcome === 'WIN' ? '✅' : '❌'}
              </div>
              <div style={{
                fontSize: isMobile ? '1.063rem' : '1.188rem',
                fontWeight: '900',
                color: game.betOutcome.outcome === 'WIN' ? '#10B981' : '#EF4444',
                letterSpacing: '-0.02em',
                fontFeatureSettings: "'tnum'",
                textShadow: game.betOutcome.outcome === 'WIN'
                  ? '0 2px 10px rgba(16, 185, 129, 0.3)'
                  : '0 2px 10px rgba(239, 68, 68, 0.3)'
              }}>
                {game.betOutcome.profit > 0 ? '+' : ''}{game.betOutcome.profit.toFixed(2)}u
              </div>
            </div>
            </div>
          )}
          
        {/* Bet Details for PENDING games - PREMIUM MOBILE-OPTIMIZED */}
        {!game.betOutcome && (
          <div style={{
            marginTop: isMobile ? '0.75rem' : '0.875rem',
            background: (() => {
              const tierInfo = getBetTier(pred.grade, pred.bestOdds, pred.unitSize);
              return tierInfo.bgGradient;
            })(),
            border: (() => {
              const tierInfo = getBetTier(pred.grade, pred.bestOdds, pred.unitSize);
              return `2.5px solid ${tierInfo.borderColor}`;
            })(),
            borderRadius: isMobile ? '14px' : '16px',
            padding: isMobile ? '1rem 1.125rem' : '1.125rem 1.375rem',
            boxShadow: (() => {
              const tierInfo = getBetTier(pred.grade, pred.bestOdds, pred.unitSize);
              return `0 6px 22px ${tierInfo.color}28, inset 0 1px 0 rgba(255,255,255,0.12)`;
            })(),
            backdropFilter: 'blur(10px)'
          }}>
            {/* PREMIUM MOBILE-FIRST LAYOUT */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '0.875rem' : '1rem',
              marginBottom: isMobile ? '0.625rem' : '0.75rem'
            }}>
              {/* Grade Badge - HERO ELEMENT */}
              <div style={{
                background: `linear-gradient(135deg, ${gradeColors.borderColor}30 0%, ${gradeColors.borderColor}18 100%)`,
                border: `2.5px solid ${gradeColors.borderColor}`,
                color: gradeColors.color,
                padding: isMobile ? '0.625rem 0.875rem' : '0.688rem 1rem',
                borderRadius: '11px',
                fontWeight: '900',
                fontSize: isMobile ? '1.125rem' : '1.25rem',
                letterSpacing: '-0.03em',
                boxShadow: `0 4px 14px ${gradeColors.borderColor}35, inset 0 1px 0 rgba(255,255,255,0.15)`,
                flexShrink: 0,
                lineHeight: 0.9,
                minWidth: isMobile ? '42px' : '48px',
                textAlign: 'center'
              }}>
                {pred.grade}
              </div>
              
              {/* Unit Size - PROMINENT */}
              <div style={{
                flex: 1
              }}>
                <div style={{
                  fontSize: isMobile ? '0.875rem' : '0.938rem',
                  fontWeight: '800',
                  color: 'rgba(255,255,255,0.95)',
                  marginBottom: '0.25rem',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2
                }}>
                  {pred.unitSize} unit{pred.unitSize !== 1 ? 's' : ''} allocated
                </div>
                <div style={{
                  fontSize: isMobile ? '0.688rem' : '0.75rem',
                  color: pred.historicalROI >= 0 ? '#10B981' : '#F59E0B',
                  fontWeight: '700',
                  letterSpacing: '0.01em'
                }}>
                  Pattern ROI: {pred.historicalROI >= 0 ? '+' : ''}{pred.historicalROI?.toFixed(1) || '0.0'}%
                </div>
              </div>
            </div>
            
            {/* Rationale - TERTIARY INFO */}
            <div style={{
              fontSize: isMobile ? '0.688rem' : '0.75rem',
              color: 'rgba(255,255,255,0.70)',
              lineHeight: 1.45,
              fontWeight: '600',
              paddingTop: isMobile ? '0.625rem' : '0.75rem',
              borderTop: '1px solid rgba(255,255,255,0.12)',
              letterSpacing: '0.005em'
            }}>
              {(() => {
                const roi = pred.historicalROI || 0;
                
                // Custom premium descriptions based on unit size + ROI
                if (pred.unitSize >= 5.0) {
                  return roi > 20 
                    ? `Elite opportunity with strong historical performance`
                    : `Maximum allocation for highest conviction plays`;
                }
                if (pred.unitSize >= 4.0) {
                  return `Above-standard position backed by solid metrics`;
                }
                if (pred.unitSize >= 3.0) {
                  return roi > 15
                    ? `Strong pattern with proven profitability`
                    : `Standard allocation for balanced risk/reward`;
                }
                if (pred.unitSize >= 2.0) {
                  return roi > 0
                    ? `Moderate sizing for positive-expectation opportunity`
                    : `Measured approach to volatile pattern`;
                }
                if (pred.unitSize >= 1.0) {
                  return `Conservative sizing manages pattern volatility`;
                }
                return `Minimal allocation for tracking purposes`;
              })()}
            </div>
          </div>
        )}
      </div>
      
      {/* Live Score Display */}
      {liveScore && (
        <div style={{ padding: isMobile ? '0 0.875rem' : '0 1rem' }}>
          <BasketballLiveScore 
            liveScore={liveScore} 
            prediction={pred}
            awayTeam={game.awayTeam}
            homeTeam={game.homeTeam}
          />
        </div>
      )}

      {/* Compact Bet Card */}
      <div style={{ 
        background: GRADIENTS.hero,
        padding: isMobile ? '0.625rem 0.75rem' : '0.75rem 1rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Dynamic Pick Context */}
        {(() => {
          const isPositiveEV = pred.bestEV > 0;
          const context = getBasketballContext(game, pred, odds);
          
          return (
            <div style={{ 
              background: isPositiveEV
                ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)'
                : 'linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
              border: `1px solid ${isPositiveEV ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
              borderRadius: '8px',
              padding: isMobile ? '0.5rem 0.625rem' : '0.625rem 0.75rem',
              marginBottom: isMobile ? '0.5rem' : '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '0.5rem' : '0.625rem'
            }}>
              {/* Icon */}
              <div style={{ 
                fontSize: isMobile ? '1.375rem' : '1.5rem', 
                lineHeight: 1, 
                flexShrink: 0 
              }}>
                {context.icon}
              </div>
              
              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Title */}
                <div style={{ 
                  fontSize: isMobile ? '0.875rem' : '1rem',
                  fontWeight: '800',
                  color: isPositiveEV ? '#10B981' : '#EF4444',
                  marginBottom: '0.25rem',
                  letterSpacing: '-0.01em'
                }}>
                  {context.title}
                </div>
                
                {/* Subtitle */}
                <div style={{ 
                  fontSize: isMobile ? '0.688rem' : '0.75rem',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.4
                }}>
                  {context.subtitle}
                </div>
              </div>
            </div>
          );
        })()}
        
        {/* Compact Stats Grid - Mobile Optimized */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? '0.5rem' : '0.625rem',
          marginBottom: isMobile ? '0.5rem' : '0.75rem',
          position: 'relative',
          zIndex: 2
        }}>
          {/* OUR MODEL */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
            borderRadius: '8px',
            padding: isMobile ? '0.5rem' : '0.625rem',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{ 
              fontSize: isMobile ? '0.625rem' : '0.688rem',
              color: 'rgba(16, 185, 129, 0.8)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: '700',
              marginBottom: '0.375rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <span>📊</span> OUR MODEL
            </div>
            <div style={{ 
              fontSize: isMobile ? '1.25rem' : '1.375rem',
              fontWeight: '900',
              color: '#10B981', 
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '0.25rem'
            }}>
              {((pred.bestBet === 'away' ? pred.ensembleAwayProb : pred.ensembleHomeProb) * 100).toFixed(1)}%
            </div>
            <div style={{ 
              fontSize: isMobile ? '0.625rem' : '0.688rem',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.2
            }}>
              Win probability • <span style={{ color: '#10B981', fontWeight: '700' }}>{pred.bestEV > 0 ? '+' : ''}{pred.bestEV.toFixed(1)}% edge</span>
            </div>
          </div>

          {/* MARKET ODDS */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
            padding: isMobile ? '0.5rem' : '0.625rem',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
                <div style={{ 
              fontSize: isMobile ? '0.625rem' : '0.688rem',
                  color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
                  fontWeight: '700',
              marginBottom: '0.375rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
                }}>
              <span>💵</span> MARKET
                </div>
                <div style={{ 
                  fontSize: isMobile ? '1.125rem' : '1.25rem',
              fontWeight: '900',
              color: 'rgba(255,255,255,0.9)',
                  lineHeight: 1.1,
              letterSpacing: '-0.01em',
              marginBottom: '0.25rem'
                }}>
              {pred.bestOdds > 0 ? `+${pred.bestOdds}` : pred.bestOdds}
                </div>
                  <div style={{ 
              fontSize: isMobile ? '0.625rem' : '0.688rem',
                    color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.2
                  }}>
              {((pred.bestBet === 'away' ? pred.marketAwayProb : pred.marketHomeProb) * 100).toFixed(1)}% implied
                  </div>
        </div>
        
          {/* CONFIDENCE & UNIT SIZING */}
          <div style={{
            background: `linear-gradient(135deg, ${gradeColors.borderColor}15 0%, ${gradeColors.borderColor}08 100%)`,
            borderRadius: '8px',
            padding: isMobile ? '0.5rem' : '0.625rem',
            border: `1px solid ${gradeColors.borderColor}30`
          }}>
              <div style={{ 
              fontSize: isMobile ? '0.625rem' : '0.688rem',
              color: `${gradeColors.color}cc`,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              fontWeight: '700',
              marginBottom: '0.375rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              {(() => {
                const tierInfo = getBetTier(pred.grade, pred.bestOdds, pred.unitSize);
                return <span>{tierInfo.emoji}</span>;
              })()} GRADE / BET SIZE
              </div>
              <div style={{ 
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.5rem',
              marginBottom: '0.25rem'
            }}>
              <div style={{ 
                fontSize: isMobile ? '1.125rem' : '1.25rem',
                fontWeight: '900',
                color: gradeColors.color,
                lineHeight: 1.1,
                letterSpacing: '-0.01em'
              }}>
                {pred.grade}
              </div>
              <div style={{
                fontSize: isMobile ? '0.938rem' : '1rem',
                fontWeight: '900',
                color: (() => {
                  const tierInfo = getBetTier(pred.grade, pred.bestOdds, pred.unitSize);
                  return tierInfo.color;
                })(),
                fontFeatureSettings: "'tnum'"
              }}>
                → {pred.unitSize > 0 ? `${pred.unitSize}u` : 'No Bet'}
              </div>
            </div>
            <div style={{ 
              fontSize: isMobile ? '0.625rem' : '0.688rem',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.3
            }}>
              {pred.oddsRangeName || 'Unknown Odds'} • {pred.unitSize > 0 
                ? `Risk ${pred.unitSize} unit${pred.unitSize !== 1 ? 's' : ''}`
                : 'Below betting threshold'}
            </div>
              </div>
            </div>
            
        {/* Predicted Score - Compact Mobile */}
        {pred.ensembleTotal && (
            <div style={{ 
            background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 100%)',
            borderRadius: '8px',
            padding: isMobile ? '0.5rem 0.625rem' : '0.75rem',
            border: '1px solid rgba(255,255,255,0.08)',
            position: 'relative',
            zIndex: 2
          }}>
            {/* Label - Inline on Mobile */}
            <div style={{
              fontSize: isMobile ? '0.625rem' : '0.688rem',
              color: 'rgba(255,255,255,0.5)',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: isMobile ? '0.25rem' : '0.375rem',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem'
            }}>
              <span style={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>🔮</span>
              {isMobile ? 'Prediction' : 'Predicted Final Score'}
            </div>
            
            {/* Score Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              gap: isMobile ? '0.5rem' : '0.75rem',
              alignItems: 'center'
            }}>
              {/* Away Team */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                  fontSize: isMobile ? '0.625rem' : '0.688rem',
                  color: 'rgba(255,255,255,0.4)',
                fontWeight: '700',
                textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  marginBottom: isMobile ? '0.125rem' : '0.25rem'
              }}>
                  {isMobile && game.awayTeam.length > 8 ? game.awayTeam.substring(0, 7) + '...' : game.awayTeam.substring(0, 12)}
              </div>
              <div style={{ 
                  fontSize: isMobile ? '1.125rem' : '1.5rem',
                fontWeight: '900',
                color: 'white',
                lineHeight: 1,
                  letterSpacing: '-0.02em'
              }}>
                  {pred.ensembleAwayScore}
              </div>
            </div>
            
              {/* Separator */}
                <div style={{ 
                color: 'rgba(255,255,255,0.25)', 
                fontSize: isMobile ? '0.75rem' : '1rem',
                fontWeight: '700'
              }}>
                -
              </div>
              
              {/* Home Team */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                  fontSize: isMobile ? '0.625rem' : '0.688rem',
                  color: 'rgba(255,255,255,0.4)',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  marginBottom: isMobile ? '0.125rem' : '0.25rem'
                  }}>
                  {isMobile && game.homeTeam.length > 8 ? game.homeTeam.substring(0, 7) + '...' : game.homeTeam.substring(0, 12)}
                  </div>
                  <div style={{ 
                  fontSize: isMobile ? '1.125rem' : '1.5rem',
                    fontWeight: '900',
                  color: 'white',
                    lineHeight: 1,
                  letterSpacing: '-0.02em'
                  }}>
                  {pred.ensembleHomeScore}
                  </div>
                </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Collapsible Details - Micro */}
      <div style={{
        padding: isMobile ? '0.375rem 0.75rem' : '0.5rem 1rem',
        borderTop: ELEVATION.flat.border
      }}>
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            padding: isMobile ? '0.375rem 0' : '0.5rem 0',
            color: 'rgba(255,255,255,0.5)',
            fontSize: isMobile ? '0.688rem' : '0.75rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.375rem',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
        >
          <span style={{ fontSize: '0.625rem' }}>{showDetails ? '▼' : '▶'}</span>
          <span>Model Breakdown</span>
        </button>
        
        {showDetails && (
          <div style={{ 
            paddingTop: '1rem',
            display: 'grid',
            gap: '1rem'
          }}>
            {/* Market Odds Detail */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div style={{ 
                fontSize: TYPOGRAPHY.label.size,
                color: '#FF8C42',
                fontWeight: TYPOGRAPHY.label.weight,
                textTransform: TYPOGRAPHY.label.textTransform,
                marginBottom: '0.75rem'
              }}>
                💰 MARKET ODDS
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: TYPOGRAPHY.caption.size, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                    {game.awayTeam}
                  </div>
                  <div style={{ fontSize: TYPOGRAPHY.body.size, color: 'var(--color-text-primary)', fontWeight: TYPOGRAPHY.body.weight }}>
                    {odds.awayOdds > 0 ? '+' : ''}{odds.awayOdds}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: TYPOGRAPHY.caption.size, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                    {game.homeTeam}
                  </div>
                  <div style={{ fontSize: TYPOGRAPHY.body.size, color: 'var(--color-text-primary)', fontWeight: TYPOGRAPHY.body.weight }}>
                    {odds.homeOdds > 0 ? '+' : ''}{odds.homeOdds}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Basketball;

