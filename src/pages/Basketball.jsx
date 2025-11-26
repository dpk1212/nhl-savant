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
import { BasketballBetStats } from '../components/BasketballBetStats';
import { getUnitSize, getUnitDisplay, getUnitColor } from '../utils/staggeredUnits';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  ELEVATION, 
  TYPOGRAPHY, 
  MOBILE_SPACING, 
  GRADIENTS, 
  getGradeColorScale
} from '../utils/designSystem';

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
        
        console.log(`📊 Loaded ${betsData.size} bets from Firebase`);
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
      (updatedGames) => {
        // Add grades and bet outcomes for completed games
        const gamesWithGradesAndBets = updatedGames.map(game => {
          const gameData = { ...game };
          
          // Add prediction grade if game is final
          if (game.liveScore && game.liveScore.status === 'final') {
            gameData.grade = gradePrediction(game, game.liveScore);
            
            // 🎯 INSTANT BET GRADING: Grade bet in Firebase using live NCAA API data
            gradeBasketballBet(game.awayTeam, game.homeTeam, game.liveScore)
              .then(wasGraded => {
                if (wasGraded) {
                  console.log(`🏀 Auto-graded bet: ${game.awayTeam} @ ${game.homeTeam}`);
                }
              })
              .catch(err => console.error('Error auto-grading bet:', err));
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
  }, [recommendations, teamMappings, betsMap]);

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
      
      // Parse data
      const oddsGames = parseBasketballOdds(oddsMarkdown);
      const haslaData = parseHaslametrics(haslaMarkdown);
      const dratePreds = parseDRatings(drateMarkdown);
      
      // Load team mappings for live score matching
      const mappings = loadTeamMappings(csvContent);
      setTeamMappings(mappings);
      
      // Match games using CSV mappings (OddsTrader as base)
      const matchedGames = matchGamesWithCSV(oddsGames, haslaData, dratePreds, csvContent);
      
      // CRITICAL: Show ALL 55 OddsTrader games - NO FILTERING!
      // User needs to verify D-Ratings matching for every game
      const allGames = matchedGames.map(game => ({
        ...game,
        // Add verification fields
        hasOdds: !!game.odds,
        hasDRatings: !!game.dratings,
        hasHaslametrics: !!game.haslametrics,
        verificationStatus: game.dratings ? 'MATCHED' : 'MISSING'
      }));
      
      // Calculate predictions for ALL games (even if they fail, we still show the game)
      const calculator = new BasketballEdgeCalculator();
      const gamesWithPredictions = allGames.map(game => {
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
        gamesWithDRatings: allGames.filter(g => g.hasDRatings).length,
        gamesWithHasla: allGames.filter(g => g.hasHaslametrics).length,
        missingDRatings: allGames.filter(g => !g.hasDRatings).length,
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

      {/* Clean Stats Section - NHL Style */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 2rem auto', padding: isMobile ? '0 1rem' : '0' }}>
        <BasketballBetStats />
        
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
              
              return filteredGames.map((game, index) => (
                <BasketballGameCard 
                  key={index} 
                  game={game} 
                  rank={index + 1} 
                  isMobile={isMobile}
                  hasLiveScore={!!game.liveScore}
                />
              ));
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components

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
      
      {/* HEADER - Ultra Compact */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: isMobile ? '0.625rem 0.75rem' : '0.875rem 1rem',
        borderBottom: ELEVATION.flat.border,
        background: 'rgba(0,0,0,0.2)',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '0.75rem' }}>
          {/* Rank Badge - Smaller */}
          <div style={{
            width: isMobile ? '26px' : '32px',
            height: isMobile ? '26px' : '32px',
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
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ 
              fontSize: isMobile ? '0.875rem' : '1rem',
              fontWeight: '700',
              color: 'white',
              marginBottom: '0.125rem',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}>
              {game.awayTeam} @ {game.homeTeam}
            </div>
            <div style={{ 
              fontSize: '0.688rem',
              fontWeight: '600',
              color: 'rgba(255,255,255,0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem'
            }}>
              <span style={{ color: gradeColors.color, fontSize: '0.5rem' }}>●</span> {formatGameTime(odds?.gameTime)}
            </div>
          </div>
        </div>
        
        {/* Grade Badge - Compact */}
        <div style={{ display: 'flex', gap: isMobile ? '0.375rem' : '0.5rem', alignItems: 'center' }}>
          {/* Bet Outcome (WIN/LOSS) - Compact */}
          {game.betOutcome && (
            <div style={{
              background: game.betOutcome.outcome === 'WIN' 
                ? 'linear-gradient(135deg, #10B981, #059669)'
                : 'linear-gradient(135deg, #EF4444, #DC2626)',
              color: 'white',
              border: `2px solid ${game.betOutcome.outcome === 'WIN' ? '#10B981' : '#EF4444'}`,
              padding: isMobile ? '0.375rem 0.625rem' : '0.5rem 0.875rem',
              borderRadius: '8px',
              fontWeight: '800',
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              boxShadow: `0 4px 12px ${game.betOutcome.outcome === 'WIN' ? '#10B98140' : '#EF444440'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              {game.betOutcome.outcome === 'WIN' ? '✅' : '❌'}
              {!isMobile && (game.betOutcome.outcome === 'WIN' ? 'WIN' : 'LOSS')}
            </div>
          )}
          
          {/* Prediction Quality Grade with Unit Sizing */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${gradeColors.bg} 0%, ${gradeColors.borderColor}20 100%)`,
              color: gradeColors.color,
              border: `2px solid ${gradeColors.borderColor}`,
              padding: isMobile ? '0.375rem 0.625rem' : '0.5rem 0.875rem',
              borderRadius: '8px',
              fontWeight: '800',
              fontSize: isMobile ? '0.875rem' : '1rem',
              letterSpacing: '-0.01em',
              boxShadow: `0 2px 12px ${gradeColors.borderColor}30`,
              minWidth: isMobile ? '42px' : '52px',
              textAlign: 'center'
            }}>
              {pred.grade}
            </div>
            
            {/* Unit Size Display */}
            <div style={{
              background: `linear-gradient(135deg, ${getUnitColor(pred.grade)}20 0%, ${getUnitColor(pred.grade)}10 100%)`,
              color: getUnitColor(pred.grade),
              border: `1.5px solid ${getUnitColor(pred.grade)}`,
              padding: isMobile ? '0.375rem 0.625rem' : '0.5rem 0.75rem',
              borderRadius: '8px',
              fontWeight: '900',
              fontSize: isMobile ? '0.813rem' : '0.938rem',
              letterSpacing: '0.02em',
              boxShadow: `0 2px 8px ${getUnitColor(pred.grade)}25`,
              fontFeatureSettings: "'tnum'"
            }}>
              {getUnitDisplay(pred.grade)}
            </div>
          </div>
        </div>
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
        {/* Value Proposition Banner */}
        {(() => {
          const isPositiveEV = pred.bestEV > 0;
          const modelProb = (pred.bestBet === 'away' ? pred.ensembleAwayProb : pred.ensembleHomeProb) * 100;
          const isUpsetTerritory = modelProb >= 45 && modelProb <= 65 && Math.abs(pred.bestEV) >= 2;
          
          return (
            <div style={{ 
              background: isPositiveEV 
                ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)'
                : 'linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
              border: `1px solid ${isPositiveEV ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
              borderRadius: '8px',
              padding: isMobile ? '0.5rem' : '0.625rem',
              marginBottom: isMobile ? '0.625rem' : '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', lineHeight: 1 }}>
                {isUpsetTerritory ? '🎯' : isPositiveEV ? '💡' : '⚠️'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: isMobile ? '0.813rem' : '0.875rem',
                  fontWeight: '700',
                  color: isPositiveEV ? '#10B981' : '#EF4444',
                  marginBottom: '0.125rem',
                  letterSpacing: '-0.01em'
                }}>
                  {pred.bestTeam} Moneyline {isUpsetTerritory && '• Upset Alert'}
                </div>
                <div style={{ 
                  fontSize: isMobile ? '0.688rem' : '0.75rem',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.3
                }}>
                  {isUpsetTerritory 
                    ? `Close game with ${Math.abs(pred.bestEV).toFixed(1)}% ${isPositiveEV ? 'edge' : 'disadvantage'} vs market`
                    : isPositiveEV
                      ? `Our model sees ${pred.bestEV.toFixed(1)}% more value than the market`
                      : `Market favors this ${Math.abs(pred.bestEV).toFixed(1)}% more than our model`
                  }
                </div>
              </div>
            </div>
          );
        })()}
        
        {/* Clearer Stats Grid with Helper Text */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? '0.5rem' : '0.625rem',
          marginBottom: isMobile ? '0.625rem' : '0.75rem',
          position: 'relative',
          zIndex: 2
        }}>
          {/* OUR MODEL */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
            borderRadius: '8px',
            padding: isMobile ? '0.5rem' : '0.625rem',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            gridColumn: isMobile ? 'span 2' : 'span 1'
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
              <span>⭐</span> GRADE / BET SIZE
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
                color: getUnitColor(pred.grade),
                fontFeatureSettings: "'tnum'"
              }}>
                → {getUnitDisplay(pred.grade)}
              </div>
            </div>
            <div style={{ 
              fontSize: isMobile ? '0.625rem' : '0.688rem',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.3
            }}>
              {gradeColors.tier.split(' ')[0]} • {getUnitSize(pred.grade) > 0 
                ? `Risk ${getUnitSize(pred.grade)} unit${getUnitSize(pred.grade) !== 1 ? 's' : ''}`
                : 'Below betting threshold'}
            </div>
          </div>
        </div>
        
        {/* Predicted Score with Label */}
        {pred.ensembleTotal && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 100%)',
            borderRadius: '10px',
            padding: isMobile ? '0.625rem' : '0.875rem',
            border: '1px solid rgba(255,255,255,0.08)',
            position: 'relative',
            zIndex: 2
          }}>
            {/* Label */}
            <div style={{
              fontSize: isMobile ? '0.625rem' : '0.688rem',
              color: 'rgba(255,255,255,0.5)',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: isMobile ? '0.375rem' : '0.5rem',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.375rem'
            }}>
              <span>🔮</span> Predicted Final Score
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
                  letterSpacing: '0.05em',
                  marginBottom: isMobile ? '0.25rem' : '0.375rem'
                }}>
                  {game.awayTeam.length > 12 ? game.awayTeam.substring(0, 10) + '...' : game.awayTeam}
                </div>
                <div style={{ 
                  fontSize: isMobile ? '1.25rem' : '1.5rem',
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
                fontSize: isMobile ? '0.875rem' : '1rem',
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
                  letterSpacing: '0.05em',
                  marginBottom: isMobile ? '0.25rem' : '0.375rem'
                }}>
                  {game.homeTeam.length > 12 ? game.homeTeam.substring(0, 10) + '...' : game.homeTeam}
                </div>
                <div style={{ 
                  fontSize: isMobile ? '1.25rem' : '1.5rem',
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

