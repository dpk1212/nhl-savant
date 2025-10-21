import { useState, useEffect } from 'react';
import { Save, RefreshCw, Download, Copy } from 'lucide-react';

/**
 * AdminGoalies Component
 * 
 * Allows admin to select starting goalies for today's games
 * Selections stored in localStorage and used for predictions
 * ±15% goalie adjustment is THE most important factor in NHL betting
 */
export default function AdminGoalies({ games, goalieData, onGoalieSelect }) {
  const [selectedGoalies, setSelectedGoalies] = useState({});
  const [isSaving, setIsSaving] = useState(false);

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
      <div className="p-8 text-center text-gray-500">
        <p>No games available for today</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin: Starting Goalies
        </h1>
        <p className="text-gray-600">
          Select starting goalies for today's games. Goalie quality has a <strong>±15% impact</strong> on predictions.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Locally
            </>
          )}
        </button>
        
        <button
          onClick={handleExportToJSON}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export for GitHub
        </button>
        
        <button
          onClick={handleCopyToClipboard}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Copy className="w-4 h-4" />
          Copy JSON
        </button>
        
        <button
          onClick={handleClear}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Games List */}
      <div className="space-y-4">
        {games.map((game, index) => {
          const gameId = `game_${index}`;
          const awayGoalies = getTeamGoalies(game.away);
          const homeGoalies = getTeamGoalies(game.home);
          
          const selectedAway = selectedGoalies[`${gameId}_${game.away}`];
          const selectedHome = selectedGoalies[`${gameId}_${game.home}`];

          return (
            <div key={gameId} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              {/* Game Header */}
              <div className="mb-4 pb-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {game.away} @ {game.home}
                </h3>
                <p className="text-sm text-gray-500">{game.time || 'Time TBD'}</p>
              </div>

              {/* Goalie Selectors */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Away Team */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {game.away} Starting Goalie
                  </label>
                  <select
                    value={selectedAway || ''}
                    onChange={(e) => handleGoalieSelect(gameId, game.away, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    <div className="mt-2">
                      {(() => {
                        const goalie = awayGoalies.find(g => g.name === selectedAway);
                        const tier = getGSAETier(goalie.gsae);
                        return (
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${tier.bg} ${tier.color}`}>
                            <span className="font-medium">{tier.label}</span>
                            <span>GSAE: {goalie.gsae > 0 ? '+' : ''}{goalie.gsae.toFixed(1)}</span>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* Home Team */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {game.home} Starting Goalie
                  </label>
                  <select
                    value={selectedHome || ''}
                    onChange={(e) => handleGoalieSelect(gameId, game.home, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    <div className="mt-2">
                      {(() => {
                        const goalie = homeGoalies.find(g => g.name === selectedHome);
                        const tier = getGSAETier(goalie.gsae);
                        return (
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${tier.bg} ${tier.color}`}>
                            <span className="font-medium">{tier.label}</span>
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
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    💡 Elite goalies reduce opponent goals by 15%, poor goalies increase by 15%
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">How Goalie Adjustment Works</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Elite (GSAE &gt; 10):</strong> Opponent's expected goals reduced by 15%</li>
          <li>• <strong>Poor (GSAE &lt; -10):</strong> Opponent's expected goals increased by 15%</li>
          <li>• <strong>Average (GSAE -10 to +10):</strong> No adjustment</li>
          <li>• GSAE = Goals Saved Above Expected (xGoals - Actual Goals)</li>
        </ul>
      </div>
    </div>
  );
}

