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
      
      // Show ALL games - don't filter by quality for verification
      // User needs to see D-Ratings data for all 55 games
      const allGames = matchedGames.map(game => ({
        ...game,
        // Add verification fields
        hasOdds: !!game.odds,
        hasDRatings: !!game.dratings,
        hasHaslametrics: !!game.haslametrics,
        verificationStatus: game.dratings ? 'MATCHED' : 'MISSING'
      }));
      
      // Calculate predictions for games with D-Ratings
      const calculator = new BasketballEdgeCalculator();
      const gamesWithDRatings = allGames.filter(g => g.dratings);
      const gamesWithPredictions = calculator.processGames(gamesWithDRatings);
      
      // Sort by D-Ratings confidence (highest away win prob first)
      const sortedGames = gamesWithPredictions.sort((a, b) => {
        const aProb = Math.max(a.dratings?.awayWinProb || 0, a.dratings?.homeWinProb || 0);
        const bProb = Math.max(b.dratings?.awayWinProb || 0, b.dratings?.homeWinProb || 0);
        return bProb - aProb;
      });
      
      setRecommendations(sortedGames);
      setStats({
        totalGames: oddsGames.length,
        matchedGames: matchedGames.length,
        gamesWithDRatings: gamesWithDRatings.length,
        gamesWithHasla: allGames.filter(g => g.haslametrics).length,
        fullMatches: allGames.filter(g => g.dratings && g.haslametrics).length
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
              <div style={{ color: '#00ff88', fontSize: '24px', fontWeight: '700' }}>{stats.gamesWithDRatings}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>With D-Ratings</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#95e1d3', fontSize: '24px', fontWeight: '700' }}>{stats.gamesWithHasla}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>With Haslametrics</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#4ecdc4', fontSize: '24px', fontWeight: '700' }}>{stats.fullMatches}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Full Matches</div>
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
  
  // For verification: show ALL games, even without predictions
  const hasPrediction = pred && !pred.error;

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(255,140,66,0.1) 0%, rgba(78,205,196,0.1) 100%)',
      borderRadius: '15px',
      padding: '25px',
      border: dratings ? '2px solid rgba(78,205,196,0.3)' : '2px solid rgba(255,100,100,0.3)',
      transition: 'all 0.3s ease'
    }}>
      {/* Header with Game Number */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: '600' }}>
          GAME #{rank}
        </div>
        <div style={{
          background: dratings ? 'rgba(0,255,136,0.2)' : 'rgba(255,100,100,0.2)',
          color: dratings ? '#00ff88' : '#ff6464',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '700'
        }}>
          {dratings ? '✅ D-RATINGS MATCHED' : '❌ D-RATINGS MISSING'}
        </div>
      </div>

      {/* Matchup */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ color: 'white', fontSize: '22px', fontWeight: '700', marginBottom: '5px' }}>
          {game.awayTeam} @ {game.homeTeam}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
          {odds?.gameTime || 'TBD'}
        </div>
      </div>

      {/* D-RATINGS DATA - PROMINENT DISPLAY */}
      {dratings ? (
        <div style={{
          background: 'rgba(0,255,136,0.1)',
          border: '2px solid rgba(0,255,136,0.3)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '15px'
        }}>
          <div style={{ color: '#00ff88', fontSize: '14px', fontWeight: '700', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎯</span>
            <span>D-RATINGS PREDICTION</span>
          </div>
          
          {/* Away Team */}
          <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                {game.awayTeam} (Away)
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#00ff88', fontSize: '24px', fontWeight: '800' }}>
                  {(dratings.awayWinProb * 100).toFixed(1)}%
                </div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                  Score: {dratings.awayScore}
                </div>
              </div>
            </div>
          </div>

          {/* Home Team */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                {game.homeTeam} (Home)
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#00ff88', fontSize: '24px', fontWeight: '800' }}>
                  {(dratings.homeWinProb * 100).toFixed(1)}%
                </div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                  Score: {dratings.homeScore}
                </div>
              </div>
            </div>
          </div>

          {/* Predicted Total */}
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Predicted Total: </span>
            <span style={{ color: '#ff8c42', fontSize: '16px', fontWeight: '700' }}>
              {(dratings.awayScore + dratings.homeScore).toFixed(1)}
            </span>
          </div>
        </div>
      ) : (
        <div style={{
          background: 'rgba(255,100,100,0.1)',
          border: '2px solid rgba(255,100,100,0.3)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          <div style={{ color: '#ff6464', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
            ❌ D-Ratings Data Not Found
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
            This game needs manual CSV mapping
          </div>
        </div>
      )}

      {/* HASLAMETRICS DATA */}
      {hasla && (
        <div style={{
          background: 'rgba(149,225,211,0.1)',
          border: '1px solid rgba(149,225,211,0.2)',
          borderRadius: '10px',
          padding: '15px',
          marginBottom: '15px'
        }}>
          <div style={{ color: '#95e1d3', fontSize: '13px', fontWeight: '700', marginBottom: '10px' }}>
            📊 HASLAMETRICS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.6)' }}>{game.awayTeam}</div>
              <div style={{ color: '#95e1d3', fontWeight: '600' }}>Rating: {hasla.awayRating || 'N/A'}</div>
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.6)' }}>{game.homeTeam}</div>
              <div style={{ color: '#95e1d3', fontWeight: '600' }}>Rating: {hasla.homeRating || 'N/A'}</div>
            </div>
          </div>
        </div>
      )}

      {/* ODDS DATA */}
      {odds && (
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '10px',
          padding: '15px'
        }}>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '700', marginBottom: '10px' }}>
            💰 MARKET ODDS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '3px' }}>{game.awayTeam}</div>
              <div style={{ color: '#ff8c42', fontWeight: '700', fontSize: '16px' }}>
                {odds.awayOdds > 0 ? '+' : ''}{odds.awayOdds}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                ({(odds.awayProb * 100).toFixed(1)}%)
              </div>
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '3px' }}>{game.homeTeam}</div>
              <div style={{ color: '#ff8c42', fontWeight: '700', fontSize: '16px' }}>
                {odds.homeOdds > 0 ? '+' : ''}{odds.homeOdds}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                ({(odds.homeProb * 100).toFixed(1)}%)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ENSEMBLE PREDICTION (if available) */}
      {hasPrediction && pred.grade && (
        <div style={{
          marginTop: '15px',
          background: 'rgba(255,140,66,0.15)',
          border: '1px solid rgba(255,140,66,0.3)',
          borderRadius: '10px',
          padding: '15px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '4px' }}>
                ENSEMBLE PICK
              </div>
              <div style={{ color: 'white', fontSize: '16px', fontWeight: '700' }}>
                {pred.bestTeam}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                background: '#00ff88',
                color: '#1a1a2e',
                padding: '6px 12px',
                borderRadius: '6px',
                fontWeight: '800',
                fontSize: '16px',
                marginBottom: '4px'
              }}>
                {pred.grade}
              </div>
              <div style={{ color: '#ff8c42', fontSize: '14px', fontWeight: '700' }}>
                +{pred.bestEV.toFixed(1)}% EV
              </div>
            </div>
          </div>
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

