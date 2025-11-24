import { useState, useEffect } from 'react';
import { parseBasketballOdds } from '../utils/basketballOddsParser';
import { parseHaslametrics } from '../utils/haslametricsParser';
import { parseDRatings } from '../utils/dratingsParser';
import { matchGamesWithCSV, filterByQuality } from '../utils/gameMatchingCSV';
import { BasketballEdgeCalculator } from '../utils/basketballEdgeCalculator';
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

  useEffect(() => {
    loadBasketballData();
  }, []);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      
      // FIRST: Remove extreme underdogs (unrealistic picks like +1850, +94% EV)
      const realisticGames = gamesWithPredictions.filter(game => {
        const odds = game.odds;
        if (!odds) return false;
        
        // Calculate implied probability for both teams
        const awayProb = odds.awayOdds > 0 
          ? 100 / (odds.awayOdds + 100) 
          : Math.abs(odds.awayOdds) / (Math.abs(odds.awayOdds) + 100);
        
        const homeProb = odds.homeOdds > 0 
          ? 100 / (odds.homeOdds + 100) 
          : Math.abs(odds.homeOdds) / (Math.abs(odds.homeOdds) + 100);
        
        // Filter: Both teams must have at least 15% implied probability
        // This removes extreme longshots (+566 or higher)
        return awayProb >= 0.15 && homeProb >= 0.15;
      });
      
      // SECOND: Filter to ONLY show games with 2%+ positive EV from realistic games
      const qualityGames = realisticGames.filter(game => 
        game.prediction && 
        !game.prediction.error && 
        game.prediction.bestEV >= 2.0
      );
      
      // Sort by grade (best picks first), then by game time
      const sortedGames = qualityGames.sort((a, b) => {
        // Grade order: A+, A, B+, B
        const gradeOrder = { 'A+': 4, 'A': 3, 'B+': 2, 'B': 1 };
        const gradeA = gradeOrder[a.prediction?.grade] || 0;
        const gradeB = gradeOrder[b.prediction?.grade] || 0;
        
        if (gradeA !== gradeB) {
          return gradeB - gradeA; // Higher grade first
        }
        
        // If same grade, sort by time
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
        
        {/* Stats Bar - NHL Standard */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '0.75rem' : '1.5rem',
            marginTop: '1.5rem',
            padding: isMobile ? '1rem' : '1.5rem',
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
                Quality Picks
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
                  Avg Edge
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
                Games Today
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Game Cards */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {recommendations.length === 0 ? (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: isMobile ? '2rem 1rem' : '40px',
            borderRadius: '15px',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.7)'
          }}>
            No quality recommendations found for today.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: isMobile ? '1rem' : '1.5rem' }}>
            {recommendations.map((game, index) => (
              <BasketballGameCard key={index} game={game} rank={index + 1} isMobile={isMobile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components

const BasketballGameCard = ({ game, rank, isMobile }) => {
  const [showDetails, setShowDetails] = useState(false);
  const pred = game.prediction;
  const odds = game.odds;
  
  if (!pred || pred.error) return null;
  
  const gradeColors = getGradeColorScale(pred.grade);

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.6)',
      borderRadius: isMobile ? MOBILE_SPACING.borderRadius : '16px',
      border: ELEVATION.elevated.border,
      boxShadow: ELEVATION.elevated.shadow,
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    }}>
      {/* HEADER - Compact NHL Style */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: isMobile ? MOBILE_SPACING.cardPadding : '1.5rem',
        borderBottom: ELEVATION.flat.border
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontSize: isMobile ? TYPOGRAPHY.body.size : TYPOGRAPHY.heading.size,
            fontWeight: TYPOGRAPHY.heading.weight,
            color: 'var(--color-text-primary)',
            marginBottom: '0.375rem',
            letterSpacing: TYPOGRAPHY.heading.letterSpacing,
            lineHeight: TYPOGRAPHY.heading.lineHeight
          }}>
            {game.awayTeam} @ {game.homeTeam}
          </div>
          <div style={{ 
            fontSize: TYPOGRAPHY.caption.size,
            fontWeight: TYPOGRAPHY.caption.weight,
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🕐 {odds?.gameTime || 'TBD'}
          </div>
        </div>
        
        {/* Grade Badge - NHL Style */}
        <div style={{
          background: gradeColors.bg,
          color: gradeColors.color,
          border: `2px solid ${gradeColors.borderColor}`,
          padding: isMobile ? '0.5rem 0.875rem' : '0.625rem 1rem',
          borderRadius: '10px',
          fontWeight: TYPOGRAPHY.hero.weight,
          fontSize: isMobile ? TYPOGRAPHY.heading.size : '1.375rem',
          letterSpacing: '-0.02em',
          boxShadow: `0 4px 16px ${gradeColors.borderColor}30`,
          minWidth: isMobile ? '56px' : '64px',
          textAlign: 'center'
        }}>
          {pred.grade}
        </div>
      </div>

      {/* HERO BET CARD - Exact NHL Pattern */}
      <div style={{ 
        background: GRADIENTS.hero,
        padding: isMobile ? MOBILE_SPACING.cardPadding : '1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Best Value Heading */}
        <div style={{ 
          fontSize: isMobile ? TYPOGRAPHY.heading.size : '1.25rem',
          fontWeight: TYPOGRAPHY.heading.weight,
          marginBottom: '1rem',
          color: 'var(--color-text-primary)',
          letterSpacing: TYPOGRAPHY.heading.letterSpacing
        }}>
          💰 BEST VALUE: {pred.bestTeam} ML
        </div>
        
        {/* Stats Grid - NHL Standard */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: isMobile ? '0.75rem' : '1rem',
          marginBottom: '1rem'
        }}>
          {/* Model Win Prob */}
          <div>
            <div style={{ 
              fontSize: TYPOGRAPHY.label.size,
              color: 'var(--color-text-muted)',
              textTransform: TYPOGRAPHY.label.textTransform,
              letterSpacing: TYPOGRAPHY.label.letterSpacing,
              fontWeight: TYPOGRAPHY.label.weight,
              marginBottom: '0.25rem'
            }}>
              Model
            </div>
            <div style={{ 
              fontSize: isMobile ? TYPOGRAPHY.heading.size : TYPOGRAPHY.hero.size,
              fontWeight: TYPOGRAPHY.hero.weight,
              color: gradeColors.color,
              lineHeight: TYPOGRAPHY.hero.lineHeight
            }}>
              {((pred.bestBet === 'away' ? pred.ensembleAwayProb : pred.ensembleHomeProb) * 100).toFixed(1)}%
            </div>
          </div>
          
          {/* Market Implied Probability */}
          <div>
            <div style={{ 
              fontSize: TYPOGRAPHY.label.size,
              color: 'var(--color-text-muted)',
              textTransform: TYPOGRAPHY.label.textTransform,
              letterSpacing: TYPOGRAPHY.label.letterSpacing,
              fontWeight: TYPOGRAPHY.label.weight,
              marginBottom: '0.25rem'
            }}>
              Market
            </div>
            <div style={{ 
              fontSize: isMobile ? TYPOGRAPHY.heading.size : TYPOGRAPHY.hero.size,
              fontWeight: TYPOGRAPHY.hero.weight,
              color: 'var(--color-text-secondary)',
              lineHeight: TYPOGRAPHY.hero.lineHeight
            }}>
              {((pred.bestBet === 'away' ? pred.marketAwayProb : pred.marketHomeProb) * 100).toFixed(1)}%
            </div>
            <div style={{ 
              fontSize: TYPOGRAPHY.caption.size,
              color: 'var(--color-text-muted)',
              marginTop: '0.25rem'
            }}>
              {pred.bestOdds > 0 ? '+' : ''}{pred.bestOdds}
            </div>
          </div>
          
          {/* Our Edge */}
          <div>
            <div style={{ 
              fontSize: TYPOGRAPHY.label.size,
              color: 'var(--color-text-muted)',
              textTransform: TYPOGRAPHY.label.textTransform,
              letterSpacing: TYPOGRAPHY.label.letterSpacing,
              fontWeight: TYPOGRAPHY.label.weight,
              marginBottom: '0.25rem'
            }}>
              Our Edge
            </div>
            <div style={{ 
              fontSize: isMobile ? TYPOGRAPHY.heading.size : TYPOGRAPHY.hero.size,
              fontWeight: TYPOGRAPHY.hero.weight,
              color: '#10B981',
              lineHeight: TYPOGRAPHY.hero.lineHeight
            }}>
              +{pred.bestEV.toFixed(1)}%
            </div>
          </div>
          
          {/* Quality */}
          {!isMobile && (
            <div>
              <div style={{ 
                fontSize: TYPOGRAPHY.label.size,
                color: 'var(--color-text-muted)',
                textTransform: TYPOGRAPHY.label.textTransform,
                letterSpacing: TYPOGRAPHY.label.letterSpacing,
                fontWeight: TYPOGRAPHY.label.weight,
                marginBottom: '0.25rem'
              }}>
                Quality
              </div>
              <div style={{ 
                fontSize: TYPOGRAPHY.heading.size,
                fontWeight: TYPOGRAPHY.heading.weight,
                color: gradeColors.color,
                lineHeight: TYPOGRAPHY.heading.lineHeight
              }}>
                {gradeColors.tier}
              </div>
            </div>
          )}
        </div>
        
        {/* Score Prediction - Cleaner */}
        {pred.ensembleTotal && (
          <div style={{
            background: 'rgba(0,0,0,0.25)',
            borderRadius: '10px',
            padding: isMobile ? '0.875rem' : '1rem',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr auto 1fr' : '1fr auto 1fr auto auto',
            gap: isMobile ? '0.75rem' : '1rem',
            alignItems: 'center'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: TYPOGRAPHY.caption.size,
                color: 'var(--color-text-muted)',
                fontWeight: TYPOGRAPHY.caption.weight,
                marginBottom: '0.375rem'
              }}>
                {game.awayTeam}
              </div>
              <div style={{ 
                fontSize: isMobile ? TYPOGRAPHY.heading.size : '1.375rem',
                fontWeight: TYPOGRAPHY.hero.weight,
                color: 'var(--color-text-primary)',
                lineHeight: TYPOGRAPHY.hero.lineHeight
              }}>
                {pred.ensembleAwayScore}
              </div>
            </div>
            
            <div style={{ 
              color: 'var(--color-text-muted)', 
              fontSize: TYPOGRAPHY.heading.size
            }}>
              @
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: TYPOGRAPHY.caption.size,
                color: 'var(--color-text-muted)',
                fontWeight: TYPOGRAPHY.caption.weight,
                marginBottom: '0.375rem'
              }}>
                {game.homeTeam}
              </div>
              <div style={{ 
                fontSize: isMobile ? TYPOGRAPHY.heading.size : '1.375rem',
                fontWeight: TYPOGRAPHY.hero.weight,
                color: 'var(--color-text-primary)',
                lineHeight: TYPOGRAPHY.hero.lineHeight
              }}>
                {pred.ensembleHomeScore}
              </div>
            </div>
            
            {!isMobile && (
              <>
                <div style={{ 
                  width: '1px', 
                  height: '40px',
                  background: 'rgba(255,255,255,0.15)'
                }} />
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: TYPOGRAPHY.caption.size,
                    color: '#FF8C42',
                    fontWeight: TYPOGRAPHY.caption.weight,
                    marginBottom: '0.375rem',
                    textTransform: TYPOGRAPHY.label.textTransform
                  }}>
                    Total
                  </div>
                  <div style={{ 
                    fontSize: '1.375rem',
                    fontWeight: TYPOGRAPHY.hero.weight,
                    color: '#FF8C42',
                    lineHeight: TYPOGRAPHY.hero.lineHeight
                  }}>
                    {pred.ensembleTotal}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Collapsible Details - Simplified */}
      <div style={{
        padding: isMobile ? MOBILE_SPACING.cardPadding : '1rem 1.5rem',
        borderTop: ELEVATION.flat.border
      }}>
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            padding: '0.75rem 0',
            color: 'var(--color-text-muted)',
            fontSize: TYPOGRAPHY.body.size,
            fontWeight: TYPOGRAPHY.body.weight,
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'color 0.2s ease'
          }}
        >
          <span>{showDetails ? '▼' : '▶'} View Details</span>
          <span style={{ fontSize: TYPOGRAPHY.caption.size }}>
            Model Breakdown
          </span>
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

