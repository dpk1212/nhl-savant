import { useState, useEffect } from 'react';
import { parseBasketballOdds } from '../utils/basketballOddsParser';
import { parseHaslametrics } from '../utils/haslametricsParser';
import { parseDRatings } from '../utils/dratingsParser';
import { matchGamesWithCSV } from '../utils/gameMatchingCSV';

/**
 * Basketball CSV Mapping Audit Tool
 * 
 * Shows game-by-game verification of team name mappings:
 * - OddsTrader name → CSV normalized name
 * - CSV → D-Ratings match status
 * - CSV → Haslametrics match status (when available)
 */

const BasketballMappingAudit = () => {
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [csvMappings, setCsvMappings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMappingData();
  }, []);

  async function loadMappingData() {
    try {
      setLoading(true);
      
      // Load all data files
      const [oddsResponse, haslaResponse, drateResponse, csvResponse] = await Promise.all([
        fetch('/basketball_odds.md'),
        fetch('/haslametrics.md'),
        fetch('/dratings.md'),
        fetch('/basketball_teams.csv')
      ]);
      
      const oddsMarkdown = await oddsResponse.text();
      const haslaMarkdown = await haslaResponse.text();
      const drateMarkdown = await drateResponse.text();
      const csvContent = await csvResponse.text();
      
      // Parse data
      const oddsGames = parseBasketballOdds(oddsMarkdown);
      const haslaData = parseHaslametrics(haslaMarkdown);
      const dratePreds = parseDRatings(drateMarkdown);
      
      // Parse CSV mappings
      const mappings = parseCSVMappings(csvContent);
      setCsvMappings(mappings);
      
      // Match games
      const matchedGames = matchGamesWithCSV(oddsGames, haslaData, dratePreds, csvContent);
      
      console.log('📊 Loaded:');
      console.log(`   ${oddsGames.length} OddsTrader games`);
      console.log(`   ${Object.keys(haslaData).length} Haslametrics teams`);
      console.log(`   ${dratePreds.length} D-Ratings predictions`);
      console.log(`   ${mappings.length} CSV mappings`);
      
      setGames(matchedGames);
      setLoading(false);
    } catch (err) {
      console.error('Error loading mapping data:', err);
      setError(err.message);
      setLoading(false);
    }
  }

  function parseCSVMappings(csvContent) {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      return {
        normalized: values[0],
        oddstrader: values[1],
        haslametrics: values[2],
        dratings: values[3],
        ncaa: values[5],
        notes: values[6]
      };
    });
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', color: '#fff', textAlign: 'center' }}>
        <h2>Loading mapping data...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', color: '#ef4444' }}>
        <h2>Error: {error}</h2>
      </div>
    );
  }

  const todayGames = games.length;
  const gamesWithDRatings = games.filter(g => g.dratings).length;
  const gamesWithHasla = games.filter(g => g.haslametrics).length;
  const missingDRatings = games.filter(g => !g.dratings).length;

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1400px',
      margin: '0 auto',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #f97316, #ea580c)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🏀 Basketball CSV Mapping Audit
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
          Game-by-game verification of team name mappings for TODAY's games
        </p>
      </div>

      {/* Summary Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <StatCard label="TODAY'S GAMES" value={todayGames} color="#3b82f6" />
        <StatCard label="✅ MAPPED (D-Ratings)" value={gamesWithDRatings} color="#10b981" />
        <StatCard label="⏳ HASLA (Coming Soon)" value={gamesWithHasla} color="#f59e0b" />
        <StatCard label="❌ MISSING" value={missingDRatings} color="#ef4444" />
      </div>

      {/* Game-by-Game Audit */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(71, 85, 105, 0.3)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid rgba(71, 85, 105, 0.3)',
          background: 'rgba(30, 41, 59, 0.5)'
        }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
            Game-by-Game Mapping Status
          </h2>
        </div>

        <div style={{ padding: '1rem' }}>
          {games.map((game, index) => (
            <GameMappingRow 
              key={index} 
              game={game} 
              index={index}
              csvMappings={csvMappings}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.6)',
      border: `1px solid ${color}40`,
      borderRadius: '8px',
      padding: '1rem',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: color }}>
        {value}
      </div>
      <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem' }}>
        {label}
      </div>
    </div>
  );
}

function GameMappingRow({ game, index, csvMappings }) {
  const hasDRatings = !!game.dratings;
  const hasHasla = !!game.haslametrics;
  
  // Find CSV mappings for both teams
  const awayMapping = csvMappings.find(m => 
    m.oddstrader === game.awayTeam || m.normalized === game.awayTeam
  );
  const homeMapping = csvMappings.find(m => 
    m.oddstrader === game.homeTeam || m.normalized === game.homeTeam
  );

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.4)',
      border: '1px solid rgba(71, 85, 105, 0.2)',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '0.75rem'
    }}>
      {/* Game Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.75rem'
      }}>
        <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>
          {index + 1}. {game.awayTeam} @ {game.homeTeam}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
          {game.odds?.gameTime || 'TBD'}
        </div>
      </div>

      {/* Mapping Status for Both Teams */}
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <TeamMapping 
          team={game.awayTeam}
          type="AWAY"
          mapping={awayMapping}
          dratingsData={game.dratings}
        />
        <TeamMapping 
          team={game.homeTeam}
          type="HOME"
          mapping={homeMapping}
          dratingsData={game.dratings}
        />
      </div>

      {/* Overall Status */}
      <div style={{
        marginTop: '0.75rem',
        padding: '0.5rem',
        background: hasDRatings 
          ? 'rgba(16, 185, 129, 0.1)' 
          : 'rgba(239, 68, 68, 0.1)',
        border: `1px solid ${hasDRatings ? '#10b981' : '#ef4444'}40`,
        borderRadius: '6px',
        fontSize: '0.875rem'
      }}>
        <strong style={{ color: hasDRatings ? '#10b981' : '#ef4444' }}>
          {hasDRatings ? '✅ D-RATINGS MATCHED' : '❌ D-RATINGS MISSING'}
        </strong>
        {' • '}
        <span style={{ color: '#94a3b8' }}>
          Haslametrics: {hasHasla ? '✅' : '⏳ Coming Soon'}
        </span>
      </div>
    </div>
  );
}

function TeamMapping({ team, type, mapping, dratingsData }) {
  if (!mapping) {
    return (
      <div style={{
        padding: '0.5rem',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '4px',
        fontSize: '0.813rem'
      }}>
        <strong style={{ color: '#ef4444' }}>❌ {type}:</strong> {team}
        <div style={{ color: '#94a3b8', marginTop: '0.25rem' }}>
          NOT FOUND IN CSV
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '0.5rem',
      background: 'rgba(71, 85, 105, 0.1)',
      border: '1px solid rgba(71, 85, 105, 0.3)',
      borderRadius: '4px',
      fontSize: '0.813rem'
    }}>
      <div style={{ marginBottom: '0.25rem' }}>
        <strong style={{ color: '#3b82f6' }}>{type}:</strong> {team}
      </div>
      <div style={{ color: '#94a3b8', display: 'grid', gap: '0.125rem', paddingLeft: '1rem' }}>
        <div>→ Normalized: <span style={{ color: '#cbd5e1' }}>{mapping.normalized}</span></div>
        <div>→ D-Ratings: <span style={{ color: '#cbd5e1' }}>{mapping.dratings}</span></div>
        <div>→ Haslametrics: <span style={{ color: '#cbd5e1' }}>{mapping.haslametrics}</span></div>
        <div>→ NCAA API: <span style={{ color: '#cbd5e1' }}>{mapping.ncaa}</span></div>
      </div>
    </div>
  );
}

export default BasketballMappingAudit;

