import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parseBasketballOdds } from '../utils/basketballOddsParser';
import { parseHaslametrics } from '../utils/haslametricsParser';
import { parseDRatings } from '../utils/dratingsParser';
import { matchGamesWithCSV, filterByQuality } from '../utils/gameMatchingCSV';
import { BasketballEdgeCalculator } from '../utils/basketballEdgeCalculator';
import { useBasketballResultsGrader } from '../hooks/useBasketballResultsGrader';
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
      
      // SECOND: Filter to ONLY show games where we have a prediction
      const qualityGames = realisticGames.filter(game => 
        game.prediction && 
        !game.prediction.error
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
      
      {/* HEADER - Compact with Rank Badge */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: isMobile ? '0.875rem 1rem' : '1rem 1.25rem',
        borderBottom: ELEVATION.flat.border,
        background: 'rgba(0,0,0,0.2)',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Rank Badge */}
          <div style={{
            width: isMobile ? '32px' : '40px',
            height: isMobile ? '32px' : '40px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${gradeColors.borderColor}30 0%, ${gradeColors.borderColor}15 100%)`,
            border: `2px solid ${gradeColors.borderColor}50`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: TYPOGRAPHY.body.size,
            fontWeight: TYPOGRAPHY.hero.weight,
            color: gradeColors.color,
            flexShrink: 0
          }}>
            {rank}
          </div>
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ 
              fontSize: isMobile ? TYPOGRAPHY.body.size : TYPOGRAPHY.heading.size,
              fontWeight: TYPOGRAPHY.hero.weight,
              color: 'white',
              marginBottom: '0.375rem',
              letterSpacing: '-0.015em',
              lineHeight: 1.2,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}>
              {game.awayTeam} @ {game.homeTeam}
            </div>
            <div style={{ 
              fontSize: TYPOGRAPHY.caption.size,
              fontWeight: TYPOGRAPHY.body.weight,
              color: 'rgba(255,255,255,0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ color: gradeColors.color }}>●</span> {formatGameTime(odds?.gameTime)}
            </div>
          </div>
        </div>
        
        {/* Grade Badge - floating with glow */}
        <div style={{
          background: `linear-gradient(135deg, ${gradeColors.bg} 0%, ${gradeColors.borderColor}20 100%)`,
          color: gradeColors.color,
          border: `2px solid ${gradeColors.borderColor}`,
          padding: isMobile ? '0.625rem 1rem' : '0.75rem 1.25rem',
          borderRadius: '12px',
          fontWeight: '900',
          fontSize: isMobile ? '1.125rem' : '1.5rem',
          letterSpacing: '-0.02em',
          boxShadow: `0 4px 20px ${gradeColors.borderColor}40, inset 0 1px 0 rgba(255,255,255,0.1)`,
          minWidth: isMobile ? '60px' : '72px',
          textAlign: 'center',
          textShadow: `0 0 10px ${gradeColors.borderColor}60`
        }}>
          {pred.grade}
        </div>
      </div>

      {/* Compact Bet Card */}
      <div style={{ 
        background: GRADIENTS.hero,
        padding: isMobile ? '1rem' : '1.25rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Best Value Heading */}
        <div style={{ 
          fontSize: isMobile ? '1rem' : '1.125rem',
          fontWeight: '700',
          marginBottom: '0.75rem',
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.01em'
        }}>
          💰 BEST VALUE: {pred.bestTeam} ML
        </div>
        
        {/* Compact Stats Grid - Remove Redundancy */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? '0.75rem' : '1rem',
          marginBottom: '1rem',
          position: 'relative',
          zIndex: 2
        }}>
          {[
            { 
              label: 'OUR PICK', 
              value: `${((pred.bestBet === 'away' ? pred.ensembleAwayProb : pred.ensembleHomeProb) * 100).toFixed(1)}% to win`, 
              subValue: `${pred.bestEV > 0 ? '+' : ''}${pred.bestEV.toFixed(1)}% edge`,
              color: '#10B981', 
              primary: true 
            },
            { 
              label: 'MARKET', 
              value: `${((pred.bestBet === 'away' ? pred.marketAwayProb : pred.marketHomeProb) * 100).toFixed(1)}%`, 
              subValue: `${pred.bestOdds > 0 ? '+' : ''}${pred.bestOdds}`, 
              color: 'rgba(255,255,255,0.7)' 
            },
            { 
              label: 'QUALITY', 
              value: gradeColors.tier, 
              color: gradeColors.color
            }
          ].map((stat, i) => (
              <div key={i} style={{
                background: stat.primary ? 'rgba(255,255,255,0.05)' : 'transparent',
                borderRadius: '8px',
                padding: stat.primary ? '0.75rem' : '0.5rem',
                border: stat.primary ? '1px solid rgba(255,255,255,0.1)' : 'none',
                transition: 'all 0.3s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                if (stat.primary) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (stat.primary) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
              >
                <div style={{ 
                  fontSize: TYPOGRAPHY.caption.size,
                  color: 'rgba(255,255,255,0.5)',
                  textTransform: TYPOGRAPHY.label.textTransform,
                  letterSpacing: '0.08em',
                  fontWeight: '700',
                  marginBottom: '0.375rem'
                }}>
                  {stat.label}
                </div>
                <div style={{ 
                  fontSize: isMobile ? '1.125rem' : '1.25rem',
                  fontWeight: '800',
                  color: stat.color,
                  lineHeight: 1.1,
                  letterSpacing: '-0.01em'
                }}>
                  {stat.value}
                </div>
                {stat.subValue && (
                  <div style={{ 
                    fontSize: TYPOGRAPHY.caption.size,
                    color: 'rgba(255,255,255,0.5)',
                    marginTop: '0.25rem',
                    fontWeight: '600'
                  }}>
                    {stat.subValue}
                  </div>
                )}
              </div>
            )
          )}
        </div>
        
        {/* Premium Score Prediction with Glass Morphism */}
        {pred.ensembleTotal && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)',
            backdropFilter: 'blur(10px)',
            borderRadius: '14px',
            padding: isMobile ? '1.25rem' : '1.5rem',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr auto 1fr' : '1fr auto 1fr auto 1fr',
            gap: isMobile ? '1rem' : '1.5rem',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2
          }}>
            {/* Away Team */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: TYPOGRAPHY.caption.size,
                color: 'rgba(255,255,255,0.5)',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.625rem'
              }}>
                {game.awayTeam}
              </div>
              <div style={{ 
                fontSize: isMobile ? '1.75rem' : '2rem',
                fontWeight: '900',
                color: 'white',
                lineHeight: 1,
                letterSpacing: '-0.03em',
                textShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}>
                {pred.ensembleAwayScore}
              </div>
            </div>
            
            {/* @ Symbol */}
            <div style={{ 
              color: 'rgba(255,255,255,0.3)', 
              fontSize: isMobile ? '1.25rem' : '1.5rem',
              fontWeight: '300'
            }}>
              @
            </div>
            
            {/* Home Team */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: TYPOGRAPHY.caption.size,
                color: 'rgba(255,255,255,0.5)',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.625rem'
              }}>
                {game.homeTeam}
              </div>
              <div style={{ 
                fontSize: isMobile ? '1.75rem' : '2rem',
                fontWeight: '900',
                color: 'white',
                lineHeight: 1,
                letterSpacing: '-0.03em',
                textShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}>
                {pred.ensembleHomeScore}
              </div>
            </div>
            
            {/* Total (hide on mobile) */}
            {!isMobile && (
              <>
                <div style={{ 
                  width: '2px', 
                  height: '60px',
                  background: 'linear-gradient(180deg, transparent 0%, rgba(255,140,66,0.4) 50%, transparent 100%)'
                }} />
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: TYPOGRAPHY.caption.size,
                    color: 'rgba(255,140,66,0.7)',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.625rem'
                  }}>
                    TOTAL
                  </div>
                  <div style={{ 
                    fontSize: '2rem',
                    fontWeight: '900',
                    color: '#FF8C42',
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                    textShadow: '0 2px 8px rgba(255,140,66,0.3)'
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

