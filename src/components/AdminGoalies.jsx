import { useState, useEffect } from 'react';
import { Save, RefreshCw, Download, Copy, Shield, TrendingUp } from 'lucide-react';

/**
 * AdminGoalies Component - Premium Edition
 * 
 * Allows admin to select starting goalies for today's games
 * Selections stored in localStorage and used for predictions
 * ±15% goalie adjustment is THE most important factor in NHL betting
 */
export default function AdminGoalies({ games, goalieData, onGoalieSelect }) {
  const [selectedGoalies, setSelectedGoalies] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load saved goalie selections from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('nhl_starting_goalies');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSelectedGoalies(parsed);
      } catch (e) {
        console.error('Error loading saved goalies:', e);
      }
    }
  }, []);

  // Get goalies for a specific team
  const getTeamGoalies = (teamName) => {
    if (!goalieData) return [];
    
    return goalieData
      .filter(g => g.team === teamName && g.situation === '5on5')
      .map(g => ({
        name: g.name,
        gamesPlayed: parseFloat(g.games_played) || 0,
        gsae: calculateGSAE(g)
      }))
      .sort((a, b) => b.gamesPlayed - a.gamesPlayed); // Sort by games played (starter first)
  };

  // Calculate GSAE for display
  const calculateGSAE = (goalie) => {
    const xGoals = parseFloat(goalie.xGoals) || 0;
    const actualGoals = parseFloat(goalie.goals) || 0;
    return xGoals - actualGoals;
  };

  // Get GSAE tier for color coding
  const getGSAETier = (gsae) => {
    if (gsae > 10) return { label: 'Elite', color: 'text-green-600', bg: 'bg-green-50' };
    if (gsae > 5) return { label: 'Above Avg', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (gsae > -5) return { label: 'Average', color: 'text-gray-600', bg: 'bg-gray-50' };
    if (gsae > -10) return { label: 'Below Avg', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { label: 'Poor', color: 'text-red-600', bg: 'bg-red-50' };
  };

  // Handle goalie selection
  const handleGoalieSelect = (gameId, team, goalieName) => {
    const updated = {
      ...selectedGoalies,
      [`${gameId}_${team}`]: goalieName
    };
    setSelectedGoalies(updated);
  };

  // Save selections to localStorage
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      localStorage.setItem('nhl_starting_goalies', JSON.stringify(selectedGoalies));
      
      // Notify parent component to refresh predictions
      if (onGoalieSelect) {
        onGoalieSelect(selectedGoalies);
      }
      
      setTimeout(() => {
        setIsSaving(false);
      }, 1000);
    } catch (e) {
      console.error('Error saving goalies:', e);
      setIsSaving(false);
    }
  };

  // Clear all selections
  const handleClear = () => {
    setSelectedGoalies({});
    localStorage.removeItem('nhl_starting_goalies');
    if (onGoalieSelect) {
      onGoalieSelect({});
    }
  };

  // Export selections to JSON file for GitHub
  const handleExportToJSON = () => {
    const today = new Date().toISOString().split('T')[0];
    
    const output = {
      date: today,
      lastUpdated: new Date().toISOString(),
      games: games.map((game, index) => {
        const gameId = `game_${index}`;
        const awayGoalie = selectedGoalies[`${gameId}_${game.away}`];
        const homeGoalie = selectedGoalies[`${gameId}_${game.home}`];
        
        return {
          gameId,
          matchup: `${game.away} @ ${game.home}`,
          time: game.time || 'TBD',
          away: {
            team: game.away,
            goalie: awayGoalie || null
          },
          home: {
            team: game.home,
            goalie: homeGoalie || null
          }
        };
      }).filter(g => g.away.goalie || g.home.goalie) // Only include games with selections
    };
    
    // Create downloadable JSON file
    const json = JSON.stringify(output, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'starting_goalies.json';
    a.click();
    URL.revokeObjectURL(url);
    
    alert(`✅ Exported ${output.games.length} games with goalie selections!\n\n📋 Next steps:\n1. Save file to /public folder\n2. git add public/starting_goalies.json\n3. git commit -m "Update starting goalies"\n4. git push\n5. npm run deploy`);
  };

  // Copy JSON to clipboard
  const handleCopyToClipboard = () => {
    const today = new Date().toISOString().split('T')[0];
    
    const output = {
      date: today,
      lastUpdated: new Date().toISOString(),
      games: games.map((game, index) => {
        const gameId = `game_${index}`;
        return {
          gameId,
          matchup: `${game.away} @ ${game.home}`,
          time: game.time || 'TBD',
          away: { team: game.away, goalie: selectedGoalies[`${gameId}_${game.away}`] || null },
          home: { team: game.home, goalie: selectedGoalies[`${gameId}_${game.home}`] || null }
        };
      }).filter(g => g.away.goalie || g.home.goalie)
    };
    
    navigator.clipboard.writeText(JSON.stringify(output, null, 2));
    alert('📋 JSON copied to clipboard!');
  };

  if (!games || games.length === 0) {
    return (
      <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', paddingTop: '4rem' }}>
        <div className="elevated-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
          <Shield size={48} color="var(--color-accent)" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>No games available for today</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }} className="animate-fade-in">
      {/* PREMIUM HEADER */}
      <div style={{
        padding: isMobile ? '2rem 1rem 1.5rem' : '3rem 2rem 2rem',
        borderBottom: '1px solid var(--color-border)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Glow */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)',
          opacity: 0.3,
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            {/* Icon with gradient */}
            <div style={{
              width: '44px',
              height: '44px',
              background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px var(--color-accent-glow)'
            }}>
              <Shield size={24} color="var(--color-background)" strokeWidth={2.5} />
            </div>
            <h1 className="text-gradient" style={{ 
              fontSize: isMobile ? '1.75rem' : '2.25rem',
              fontWeight: '800'
            }}>
              Admin: Starting Goalies
            </h1>
          </div>
          <p style={{ 
            color: 'var(--color-text-secondary)', 
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            lineHeight: '1.7',
            maxWidth: '800px',
            marginLeft: isMobile ? '0' : '60px'
          }}>
            Select starting goalies for today's games. Goalie quality has a <strong style={{ color: 'var(--color-accent)' }}>±15% impact</strong> on predictions.
            Elite goaltending can be the difference between profit and loss.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: isMobile ? '1rem' : '2rem'
      }}>

        {/* ACTION BUTTONS - PREMIUM CARD */}
        <div className="elevated-card" style={{ marginBottom: isMobile ? '1.5rem' : '2rem' }}>
          <h2 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '700', 
            color: 'var(--color-text-primary)',
            marginBottom: '1rem',
            letterSpacing: '0.025em'
          }}>
            Quick Actions
          </h2>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: isMobile ? '0.5rem' : '0.75rem'
          }}>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Locally
                </>
              )}
            </button>
            
            <button
              onClick={handleExportToJSON}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
            >
              <Download className="w-5 h-5" />
              Export for GitHub
            </button>
            
            <button
              onClick={handleCopyToClipboard}
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <Copy className="w-5 h-5" />
              Copy JSON
            </button>
            
            <button
              onClick={handleClear}
              className="px-6 py-3 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* GAMES LIST - PREMIUM CARDS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1rem' : '1.5rem' }}>
          {games.map((game, index) => {
            const gameId = `game_${index}`;
            const awayGoalies = getTeamGoalies(game.away);
            const homeGoalies = getTeamGoalies(game.home);
            
            const selectedAway = selectedGoalies[`${gameId}_${game.away}`];
            const selectedHome = selectedGoalies[`${gameId}_${game.home}`];

            return (
              <div 
                key={gameId} 
                className="game-card"
                style={{ marginBottom: 0 }}
              >
                {/* Game Header - Premium Gradient */}
                <div style={{ 
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(59, 130, 246, 0.10) 100%)',
                  borderBottom: '1px solid var(--color-border)', 
                  padding: isMobile ? '1rem 1.25rem' : '1.25rem 1.5rem',
                  borderTopLeftRadius: '8px',
                  borderTopRightRadius: '8px',
                  position: 'relative'
                }}>
                  <h3 style={{ 
                    fontSize: isMobile ? '1.25rem' : '1.5rem',
                    fontWeight: '700',
                    color: 'var(--color-text-primary)',
                    marginBottom: '0.25rem'
                  }}>
                    {game.away} @ {game.home}
                  </h3>
                  <p style={{ 
                    fontSize: '0.875rem',
                    color: 'var(--color-text-muted)',
                    fontWeight: '500'
                  }}>
                    {game.time || 'Time TBD'}
                  </p>
                </div>

                {/* Goalie Selectors */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                  gap: isMobile ? '1.5rem' : '2rem', 
                  padding: isMobile ? '1.25rem' : '1.5rem' 
                }}>
                  {/* Away Team */}
                  <div style={{ 
                    background: 'linear-gradient(135deg, var(--color-card) 0%, rgba(26, 31, 46, 0.8) 100%)',
                    border: '1px solid var(--color-border)',
                    padding: isMobile ? '1rem' : '1.25rem',
                    borderRadius: '8px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <label className="block" style={{ 
                      fontSize: '0.938rem',
                      fontWeight: '600',
                      color: 'var(--color-text-primary)', 
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span className="badge" style={{ 
                        backgroundColor: 'rgba(59, 130, 246, 0.2)', 
                        color: '#60A5FA',
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        AWAY
                      </span>
                      {game.away} Starting Goalie
                    </label>
                    <select
                      value={selectedAway || ''}
                      onChange={(e) => handleGoalieSelect(gameId, game.away, e.target.value)}
                      className="w-full focus:ring-2 focus:ring-blue-500"
                      style={{ 
                        background: 'var(--color-background)',
                        color: 'var(--color-text-primary)',
                        border: '1px solid var(--color-border)',
                        padding: '0.75rem 1rem',
                        borderRadius: '6px',
                        fontSize: '0.938rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="">Select goalie...</option>
                      {awayGoalies.map(goalie => {
                        const tier = getGSAETier(goalie.gsae);
                        return (
                          <option key={goalie.name} value={goalie.name}>
                            {goalie.name} - {tier.label} (GSAE: {goalie.gsae.toFixed(1)}, GP: {goalie.gamesPlayed})
                          </option>
                        );
                      })}
                    </select>
                    
                    {/* Selected Goalie Info */}
                    {selectedAway && awayGoalies.find(g => g.name === selectedAway) && (
                      <div className="mt-3">
                        {(() => {
                          const goalie = awayGoalies.find(g => g.name === selectedAway);
                          const tier = getGSAETier(goalie.gsae);
                          return (
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-base font-semibold ${tier.bg} ${tier.color} border-2`} style={{borderColor: 'currentColor'}}>
                              <span className="font-bold">{tier.label}</span>
                              <span>GSAE: {goalie.gsae > 0 ? '+' : ''}{goalie.gsae.toFixed(1)}</span>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Home Team */}
                  <div style={{ 
                    background: 'linear-gradient(135deg, var(--color-card) 0%, rgba(26, 31, 46, 0.8) 100%)',
                    border: '1px solid var(--color-border)',
                    padding: isMobile ? '1rem' : '1.25rem',
                    borderRadius: '8px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <label className="block" style={{ 
                      fontSize: '0.938rem',
                      fontWeight: '600',
                      color: 'var(--color-text-primary)', 
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span className="badge" style={{ 
                        backgroundColor: 'rgba(16, 185, 129, 0.2)', 
                        color: '#34D399',
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        HOME
                      </span>
                      {game.home} Starting Goalie
                    </label>
                    <select
                      value={selectedHome || ''}
                      onChange={(e) => handleGoalieSelect(gameId, game.home, e.target.value)}
                      className="w-full focus:ring-2 focus:ring-blue-500"
                      style={{ 
                        background: 'var(--color-background)',
                        color: 'var(--color-text-primary)',
                        border: '1px solid var(--color-border)',
                        padding: '0.75rem 1rem',
                        borderRadius: '6px',
                        fontSize: '0.938rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="">Select goalie...</option>
                      {homeGoalies.map(goalie => {
                        const tier = getGSAETier(goalie.gsae);
                        return (
                          <option key={goalie.name} value={goalie.name}>
                            {goalie.name} - {tier.label} (GSAE: {goalie.gsae.toFixed(1)}, GP: {goalie.gamesPlayed})
                          </option>
                        );
                      })}
                    </select>
                    
                    {/* Selected Goalie Info */}
                    {selectedHome && homeGoalies.find(g => g.name === selectedHome) && (
                      <div className="mt-3">
                        {(() => {
                          const goalie = homeGoalies.find(g => g.name === selectedHome);
                          const tier = getGSAETier(goalie.gsae);
                          return (
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-base font-semibold ${tier.bg} ${tier.color} border-2`} style={{borderColor: 'currentColor'}}>
                              <span className="font-bold">{tier.label}</span>
                              <span>GSAE: {goalie.gsae > 0 ? '+' : ''}{goalie.gsae.toFixed(1)}</span>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
              </div>

                {/* Impact Preview */}
                {(selectedAway || selectedHome) && (
                  <div className="px-6 pb-4">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                      <p className="text-sm text-blue-800 font-medium">
                        💡 Elite goalies reduce opponent goals by 15%, poor goalies increase by 15%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* INFO BOX - PREMIUM CARD */}
        <div className="elevated-card" style={{ marginTop: isMobile ? '1.5rem' : '2rem', position: 'relative', overflow: 'hidden' }}>
          {/* Background accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '120px',
            height: '120px',
            opacity: 0.1
          }}>
            <TrendingUp size={120} color="var(--color-accent)" />
          </div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h4 style={{ 
              fontSize: isMobile ? '1.125rem' : '1.25rem',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Shield size={24} color="var(--color-accent)" />
              How Goalie Adjustment Works
            </h4>
            <ul style={{ 
              fontSize: isMobile ? '0.875rem' : '0.938rem',
              color: 'var(--color-text-secondary)',
              lineHeight: '1.7',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-accent)', fontWeight: '700' }}>•</span>
                <span><strong style={{ color: 'var(--color-text-primary)' }}>Elite (GSAE &gt; 10):</strong> Opponent's expected goals reduced by 15%</span>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-accent)', fontWeight: '700' }}>•</span>
                <span><strong style={{ color: 'var(--color-text-primary)' }}>Poor (GSAE &lt; -10):</strong> Opponent's expected goals increased by 15%</span>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-accent)', fontWeight: '700' }}>•</span>
                <span><strong style={{ color: 'var(--color-text-primary)' }}>Average (GSAE -10 to +10):</strong> No adjustment</span>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-accent)', fontWeight: '700' }}>•</span>
                <span><strong style={{ color: 'var(--color-text-primary)' }}>GSAE</strong> = Goals Saved Above Expected (xGoals - Actual Goals)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

