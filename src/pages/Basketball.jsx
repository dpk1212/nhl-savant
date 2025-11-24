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
      
      // Sort by game time (chronological)
      const sortedGames = gamesWithPredictions.sort((a, b) => {
        const timeA = a.odds?.gameTime || '';
        const timeB = b.odds?.gameTime || '';
        
        // Parse times (format: "11:30pm ET" or "TBD")
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
        displayedGames: sortedGames.length,
        gamesWithDRatings: allGames.filter(g => g.hasDRatings).length,
        gamesWithHasla: allGames.filter(g => g.hasHaslametrics).length,
        missingDRatings: allGames.filter(g => !g.hasDRatings).length
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
          fontSize: '36px',
          fontWeight: '800',
          marginBottom: '10px',
          textAlign: 'center'
        }}>
          🏀 College Basketball
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', fontSize: '14px' }}>
          Development Preview - Not visible to users
        </p>
        
        {/* Stats Bar */}
        {stats && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            marginTop: '20px',
            padding: '15px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '10px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#ff8c42', fontSize: '24px', fontWeight: '700' }}>{stats.totalGames}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>OddsTrader Games</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#4ecdc4', fontSize: '24px', fontWeight: '700' }}>{stats.displayedGames}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Displayed</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#00ff88', fontSize: '24px', fontWeight: '700' }}>{stats.gamesWithDRatings}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>✅ D-Ratings Matched</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#ff6464', fontSize: '24px', fontWeight: '700' }}>{stats.missingDRatings}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>❌ D-Ratings Missing</div>
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
    <div style={{
      background: 'var(--color-card-bg, rgba(30, 41, 59, 0.4))',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid rgba(255,255,255,0.1)',
      transition: 'all 0.2s ease'
    }}>
      {/* HEADER - Compact teams, time, grade */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
            {game.awayTeam} @ {game.homeTeam}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
            🕐 {odds?.gameTime || 'TBD'}
          </div>
        </div>
        
        {/* Grade Badge */}
        {pred?.grade && (
          <div style={{
            background: gradeColors.bg,
            color: gradeColors.text,
            border: `1px solid ${gradeColors.border}`,
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: '800',
            fontSize: '18px',
            minWidth: '56px',
            textAlign: 'center'
          }}>
            {pred.grade}
          </div>
        )}
      </div>

      {/* THE PICK - Most Important Info First (NHL Pattern) */}
      {hasPrediction && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.08) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '16px'
        }}>
          <div style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.6)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: '700',
            marginBottom: '12px'
          }}>
            💰 RECOMMENDED BET
          </div>
          
          {/* Main Recommendation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            {/* Market Type */}
            <div>
              <div style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.5)',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Market
              </div>
              <div style={{ color: 'white', fontSize: '15px', fontWeight: '700' }}>
                Moneyline
              </div>
            </div>
            
            {/* The Pick */}
            <div>
              <div style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.5)',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Pick
              </div>
              <div style={{ color: gradeColors.text, fontSize: '16px', fontWeight: '800' }}>
                {pred.bestTeam}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginTop: '2px' }}>
                {pred.bestOdds > 0 ? '+' : ''}{pred.bestOdds}
              </div>
            </div>
            
            {/* Expected Value */}
            <div>
              <div style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.5)',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Expected Value
              </div>
              <div style={{ color: '#10b981', fontSize: '18px', fontWeight: '800' }}>
                +{pred.bestEV.toFixed(1)}%
              </div>
            </div>
          </div>
          
          {/* Quick Stats - Ensemble Prediction */}
          {pred.ensembleTotal && (
            <div style={{
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '4px' }}>
                  {game.awayTeam}
                </div>
                <div style={{ color: 'white', fontSize: '20px', fontWeight: '800' }}>
                  {pred.ensembleAwayScore}
                </div>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '20px', fontWeight: '300' }}>
                @
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '4px' }}>
                  {game.homeTeam}
                </div>
                <div style={{ color: 'white', fontSize: '20px', fontWeight: '800' }}>
                  {pred.ensembleHomeScore}
                </div>
              </div>
              <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '4px' }}>
                  Total
                </div>
                <div style={{ color: '#ff8c42', fontSize: '20px', fontWeight: '800' }}>
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

