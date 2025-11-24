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
      
      // Filter to HIGH quality only (all 3 sources)
      const highQualityGames = filterByQuality(matchedGames, 'HIGH');
      
      // Calculate predictions
      const calculator = new BasketballEdgeCalculator();
      const gamesWithPredictions = calculator.processGames(highQualityGames);
      
      // Filter to quality recommendations
      const recs = calculator.filterRecommendations(gamesWithPredictions, 'B+');
      
      setRecommendations(recs);
      setStats({
        totalGames: oddsGames.length,
        matchedGames: matchedGames.length,
        highQualityGames: highQualityGames.length,
        recommendations: recs.length
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
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Games Today</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#4ecdc4', fontSize: '24px', fontWeight: '700' }}>{stats.matchedGames}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>With Data</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#95e1d3', fontSize: '24px', fontWeight: '700' }}>{stats.recommendations}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Recommendations</div>
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
  
  if (!pred || pred.error) {
    return null;
  }

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+': return '#00ff88';
      case 'A': return '#4ecdc4';
      case 'B+': return '#95e1d3';
      case 'B': return '#a0aec0';
      default: return '#666';
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(255,140,66,0.1) 0%, rgba(78,205,196,0.1) 100%)',
      borderRadius: '15px',
      padding: '25px',
      border: '1px solid rgba(255,255,255,0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            background: getGradeColor(pred.grade),
            color: '#1a1a2e',
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: '800',
            fontSize: '18px'
          }}>
            {pred.grade}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
            #{rank}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#ff8c42', fontSize: '20px', fontWeight: '700' }}>
            {pred.bestEV >= 0 ? '+' : ''}{pred.bestEV.toFixed(1)}% EV
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
            {pred.confidence} Confidence
          </div>
        </div>
      </div>

      {/* Debug: Component Predictions */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '15px',
        fontSize: '13px',
        color: 'rgba(255,255,255,0.7)'
      }}>
        <div style={{ marginBottom: '5px', fontWeight: '600', color: '#ff8c42' }}>Model Sources:</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            🎯 D-Ratings: {pred.dratingsProb ? `${(pred.dratingsProb * 100).toFixed(1)}%` : 'N/A'}
          </div>
          <div>
            📊 Haslametrics: {pred.haslametricsProb ? `${(pred.haslametricsProb * 100).toFixed(1)}%` : 'N/A'}
          </div>
        </div>
        <div style={{ marginTop: '5px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
          Ensemble (60/40): {(pred.ensembleProb * 100).toFixed(1)}% | Market: {(pred.marketProb * 100).toFixed(1)}%
        </div>
      </div>

      {/* Matchup */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ color: 'white', fontSize: '20px', fontWeight: '600', marginBottom: '5px' }}>
          {game.matchup}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
          {game.odds?.gameTime || 'TBD'}
        </div>
      </div>

      {/* Recommendation */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '15px'
      }}>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '5px' }}>
          RECOMMENDED BET
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: 'white', fontSize: '18px', fontWeight: '600' }}>
            {pred.bestTeam}
          </div>
          <div style={{
            color: '#ff8c42',
            fontSize: '18px',
            fontWeight: '700'
          }}>
            {pred.bestOdds > 0 ? '+' : ''}{pred.bestOdds}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', fontSize: '14px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}>Model</div>
          <div style={{ color: '#4ecdc4', fontWeight: '600' }}>
            {((pred.bestBet === 'away' ? pred.ensembleAwayProb : pred.ensembleHomeProb) * 100).toFixed(1)}%
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}>Market</div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>
            {((pred.bestBet === 'away' ? pred.marketAwayProb : pred.marketHomeProb) * 100).toFixed(1)}%
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}>Edge</div>
          <div style={{ color: '#95e1d3', fontWeight: '600' }}>
            {pred.bestEdge >= 0 ? '+' : ''}{(pred.bestEdge * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Data Quality Badge */}
      <div style={{
        marginTop: '15px',
        padding: '8px 12px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '6px',
        fontSize: '12px',
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center'
      }}>
        Data Quality: {game.dataQuality} | Sources: {game.sources.join(', ')}
      </div>
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

