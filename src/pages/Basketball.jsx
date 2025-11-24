import { useState, useEffect } from 'react';
import { parseBasketballOdds } from '../utils/basketballOddsParser';
import { parseHaslametrics } from '../utils/haslametricsParser';
import { parseDRatings } from '../utils/dratingsParser';
import { matchGamesWithCSV, filterByQuality } from '../utils/gameMatchingCSV';
import { BasketballEdgeCalculator } from '../utils/basketballEdgeCalculator';

const Basketball = () => {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBasketballData();
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
      
      // Filter to ONLY show games with 2%+ positive EV (quality picks only)
      const qualityGames = gamesWithPredictions.filter(game => 
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '20px' }}>
      {/* Dev Badge */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: '#ff6b6b',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        zIndex: 1000
      }}>
        🔧 HIDDEN FROM USERS
      </div>

      {/* Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '30px' }}>
        <h1 style={{
          color: '#ff8c42',
          fontSize: '42px',
          fontWeight: '900',
          marginBottom: '12px',
          textAlign: 'center',
          letterSpacing: '-0.02em'
        }}>
          🏀 College Basketball Picks
        </h1>
        <p style={{ 
          color: 'rgba(255,255,255,0.8)', 
          textAlign: 'center', 
          fontSize: '16px',
          fontWeight: '500',
          marginBottom: '6px'
        }}>
          Premium picks with 2%+ Expected Value
        </p>
        <p style={{ 
          color: 'rgba(255,255,255,0.5)', 
          textAlign: 'center', 
          fontSize: '13px',
          fontStyle: 'italic'
        }}>
          60% D-Ratings · 40% Haslametrics · Market Ensemble
        </p>
        
        {/* Stats Bar */}
        {stats && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            marginTop: '24px',
            padding: '20px 32px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(16, 185, 129, 0.15)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#10b981', fontSize: '32px', fontWeight: '900', letterSpacing: '-0.02em' }}>
                {stats.qualityPicks}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Quality Picks
              </div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#3b82f6', fontSize: '32px', fontWeight: '900', letterSpacing: '-0.02em' }}>
                +{stats.avgEV}%
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Avg EV
              </div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#ff8c42', fontSize: '32px', fontWeight: '900', letterSpacing: '-0.02em' }}>
                {stats.totalGames}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
            padding: '40px',
            borderRadius: '15px',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.7)'
          }}>
            No quality recommendations found for today.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {recommendations.map((game, index) => (
              <BasketballGameCard key={index} game={game} rank={index + 1} />
            ))}
          </div>
        )}
      </div>

      {/* Development Roadmap */}
      <div style={{
        maxWidth: '1200px',
        margin: '40px auto',
        background: 'rgba(255,255,255,0.05)',
        padding: '30px',
        borderRadius: '15px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h3 style={{ color: '#ff8c42', marginBottom: '20px' }}>📋 Development Roadmap</h3>
        <div style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
          <RoadmapItem done text="Page structure & routing" />
          <RoadmapItem done text="Data fetching (Firecrawl)" />
          <RoadmapItem done text="Parse OddsTrader, Haslametrics, D-Ratings" />
          <RoadmapItem done text="Game matching across sources" />
          <RoadmapItem done text="60/40 ensemble model (D-Ratings/Haslametrics)" />
          <RoadmapItem done text="Edge calculation & grading" />
          <RoadmapItem done text="Basic game card UI" />
          <RoadmapItem text="Refine parsing (fix 100% probabilities)" />
          <RoadmapItem text="Add spread/total predictions" />
          <RoadmapItem text="AI narratives (Perplexity)" />
          <RoadmapItem text="Live scores integration" />
          <RoadmapItem text="Add navigation link (public launch)" />
        </div>
      </div>
    </div>
  );
};

// Helper Components

const BasketballGameCard = ({ game, rank }) => {
  const pred = game.prediction;
  const dratings = game.dratings;
  const hasla = game.haslametrics;
  const odds = game.odds;
  const [showDetails, setShowDetails] = useState(false);
  
  // For verification: show ALL games, even without predictions
  const hasPrediction = pred && !pred.error;
  
  // Get grade color
  const getGradeColor = (grade) => {
    if (!grade) return { bg: 'rgba(128,128,128,0.2)', text: '#808080', border: 'rgba(128,128,128,0.3)' };
    if (grade === 'A+') return { bg: 'rgba(0,255,136,0.2)', text: '#00ff88', border: 'rgba(0,255,136,0.4)' };
    if (grade === 'A') return { bg: 'rgba(16,185,129,0.2)', text: '#10b981', border: 'rgba(16,185,129,0.4)' };
    if (grade === 'B+') return { bg: 'rgba(251,191,36,0.2)', text: '#fbbf24', border: 'rgba(251,191,36,0.4)' };
    if (grade === 'B') return { bg: 'rgba(249,115,22,0.2)', text: '#f97316', border: 'rgba(249,115,22,0.4)' };
    return { bg: 'rgba(128,128,128,0.2)', text: '#808080', border: 'rgba(128,128,128,0.3)' };
  };
  
  const gradeColors = getGradeColor(pred?.grade);

  return (
    <div 
      style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
        borderRadius: '16px',
        padding: '24px',
        border: `2px solid ${gradeColors.border}`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.2), 0 0 0 1px ${gradeColors.border}`,
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.3), 0 0 0 2px ${gradeColors.border}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 4px 24px rgba(0,0,0,0.2), 0 0 0 1px ${gradeColors.border}`;
      }}
    >
      {/* HEADER - Premium teams, time, grade */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ 
            color: 'white', 
            fontSize: '22px', 
            fontWeight: '800',
            letterSpacing: '-0.01em',
            marginBottom: '8px',
            lineHeight: '1.2'
          }}>
            {game.awayTeam} @ {game.homeTeam}
          </div>
          <div style={{ 
            color: 'rgba(255,255,255,0.6)', 
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '16px' }}>🕐</span>
            {odds?.gameTime || 'TBD'}
          </div>
        </div>
        
        {/* Grade Badge */}
        {pred?.grade && (
          <div style={{
            background: gradeColors.bg,
            color: gradeColors.text,
            border: `2px solid ${gradeColors.border}`,
            padding: '12px 20px',
            borderRadius: '12px',
            fontWeight: '900',
            fontSize: '24px',
            minWidth: '72px',
            textAlign: 'center',
            letterSpacing: '-0.02em',
            boxShadow: `0 4px 16px ${gradeColors.border}40`
          }}>
            {pred.grade}
          </div>
        )}
      </div>

      {/* THE PICK - HERO SECTION */}
      {hasPrediction && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)',
          border: '2px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '16px',
          padding: '28px',
          marginBottom: '16px',
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.15)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: '20px'
          }}>
            <div style={{
              fontSize: '12px',
              color: 'rgba(16, 185, 129, 0.9)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: '800'
            }}>
              💰 RECOMMENDED BET
            </div>
            
            {/* Confidence Badge */}
            {pred.confidence === 'HIGH' && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.25)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '800',
                color: '#10b981',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                border: '1px solid rgba(16, 185, 129, 0.4)'
              }}>
                ⚡ HIGH CONFIDENCE
              </div>
            )}
          </div>
          
          {/* HERO Pick Display */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: '28px', 
                fontWeight: '900',
                color: 'white',
                letterSpacing: '-0.02em',
                marginBottom: '8px'
              }}>
                {pred.bestTeam} ML
              </div>
              <div style={{ 
                color: 'rgba(255,255,255,0.7)', 
                fontSize: '18px',
                fontWeight: '700'
              }}>
                {pred.bestOdds > 0 ? '+' : ''}{pred.bestOdds}
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                color: 'rgba(255,255,255,0.6)', 
                fontSize: '13px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '6px'
              }}>
                Expected Value
              </div>
              <div style={{ 
                fontSize: '36px',
                fontWeight: '900',
                color: '#10b981',
                letterSpacing: '-0.03em'
              }}>
                +{pred.bestEV.toFixed(1)}%
              </div>
              <div style={{ 
                fontSize: '13px',
                color: 'rgba(255,255,255,0.5)',
                marginTop: '4px'
              }}>
                Model: {(pred.ensembleAwayProb * 100).toFixed(1)}% · Market: {(pred.marketAwayProb * 100).toFixed(1)}%
              </div>
            </div>
          </div>
          
          {/* Premium Score Prediction */}
          {pred.ensembleTotal && (
            <div style={{
              background: 'rgba(0,0,0,0.25)',
              borderRadius: '12px',
              padding: '20px',
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr auto 1fr',
              gap: '20px',
              alignItems: 'center'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  color: 'rgba(255,255,255,0.6)', 
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '8px'
                }}>
                  {game.awayTeam}
                </div>
                <div style={{ 
                  color: 'white', 
                  fontSize: '28px', 
                  fontWeight: '900',
                  letterSpacing: '-0.02em'
                }}>
                  {pred.ensembleAwayScore}
                </div>
              </div>
              
              <div style={{ 
                color: 'rgba(255,255,255,0.3)', 
                fontSize: '24px', 
                fontWeight: '300'
              }}>
                @
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  color: 'rgba(255,255,255,0.6)', 
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '8px'
                }}>
                  {game.homeTeam}
                </div>
                <div style={{ 
                  color: 'white', 
                  fontSize: '28px', 
                  fontWeight: '900',
                  letterSpacing: '-0.02em'
                }}>
                  {pred.ensembleHomeScore}
                </div>
              </div>
              
              <div style={{ 
                width: '2px', 
                height: '50px',
                background: 'linear-gradient(180deg, transparent 0%, rgba(255,140,66,0.3) 50%, transparent 100%)'
              }} />
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  color: 'rgba(255,140,66,0.8)', 
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '8px'
                }}>
                  Total
                </div>
                <div style={{ 
                  color: '#ff8c42', 
                  fontSize: '28px', 
                  fontWeight: '900',
                  letterSpacing: '-0.02em'
                }}>
                  {pred.ensembleTotal}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Collapsible Model Breakdown */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '12px',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
      >
        <span>{showDetails ? '▼' : '▶'} Model Breakdown</span>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
          60% D-Ratings + 40% Haslametrics
        </span>
      </button>
      
      {showDetails && (
        <div style={{ marginTop: '12px', display: 'grid', gap: '12px' }}>
          {/* D-Ratings Detail */}
          {dratings && (
            <div style={{
              background: 'rgba(0,255,136,0.05)',
              border: '1px solid rgba(0,255,136,0.2)',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ color: '#00ff88', fontSize: '12px', fontWeight: '700', marginBottom: '10px' }}>
                🎯 D-RATINGS (60% weight)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)' }}>{game.awayTeam}</div>
                  <div style={{ color: 'white', fontWeight: '700', marginTop: '4px' }}>
                    {(dratings.awayWinProb * 100).toFixed(1)}% • {dratings.awayScore} pts
                  </div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)' }}>{game.homeTeam}</div>
                  <div style={{ color: 'white', fontWeight: '700', marginTop: '4px' }}>
                    {(dratings.homeWinProb * 100).toFixed(1)}% • {dratings.homeScore} pts
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Haslametrics Detail */}
          {hasla && (
            <div style={{
              background: 'rgba(149,225,211,0.05)',
              border: '1px solid rgba(149,225,211,0.2)',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ color: '#95e1d3', fontSize: '12px', fontWeight: '700', marginBottom: '10px' }}>
                📊 HASLAMETRICS (40% weight)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)' }}>{game.awayTeam}</div>
                  <div style={{ color: 'white', fontWeight: '700', marginTop: '4px' }}>
                    {hasla.awayScore} pts
                  </div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)' }}>{game.homeTeam}</div>
                  <div style={{ color: 'white', fontWeight: '700', marginTop: '4px' }}>
                    {hasla.homeScore} pts
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Market Odds */}
          {odds && (
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: '700', marginBottom: '10px' }}>
                💰 MARKET ODDS
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)' }}>{game.awayTeam}</div>
                  <div style={{ color: '#ff8c42', fontWeight: '700', marginTop: '4px' }}>
                    {odds.awayOdds > 0 ? '+' : ''}{odds.awayOdds} ({(odds.awayProb * 100).toFixed(1)}%)
                  </div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)' }}>{game.homeTeam}</div>
                  <div style={{ color: '#ff8c42', fontWeight: '700', marginTop: '4px' }}>
                    {odds.homeOdds > 0 ? '+' : ''}{odds.homeOdds} ({(odds.homeProb * 100).toFixed(1)}%)
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const RoadmapItem = ({ done, text }) => (
  <div style={{ marginBottom: '8px', paddingLeft: '10px' }}>
    <span style={{ color: done ? '#4ecdc4' : 'rgba(255,255,255,0.5)' }}>
      {done ? '✅' : '🔄'} {text}
    </span>
  </div>
);

export default Basketball;

