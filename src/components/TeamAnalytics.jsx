import { useState, useEffect } from 'react';
import { ChevronDown, TrendingUp, TrendingDown, Target } from 'lucide-react';

const TeamAnalytics = ({ dataProcessor }) => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teamData, setTeamData] = useState(null);
  const [allTeams, setAllTeams] = useState([]);

  useEffect(() => {
    if (dataProcessor) {
      const teams = dataProcessor.getTeamsBySituation('all');
      setAllTeams(teams);
      if (teams.length > 0 && !selectedTeam) {
        setSelectedTeam(teams[0].team);
      }
    }
  }, [dataProcessor, selectedTeam]);

  useEffect(() => {
    if (dataProcessor && selectedTeam) {
      const team = dataProcessor.getTeamData(selectedTeam, 'all');
      setTeamData(team);
    }
  }, [dataProcessor, selectedTeam]);

  const getTeamAbbreviation = (teamName) => {
    const abbreviations = {
      'NYI': 'Islanders', 'NYR': 'Rangers', 'TOR': 'Maple Leafs',
      'VAN': 'Canucks', 'UTA': 'Utah', 'FLA': 'Panthers',
      'SEA': 'Kraken', 'NSH': 'Predators', 'BOS': 'Bruins',
      'SJS': 'Sharks', 'WSH': 'Capitals', 'STL': 'Blues',
      'MIN': 'Wild', 'PIT': 'Penguins', 'PHI': 'Flyers',
      'OTT': 'Senators', 'VGK': 'Golden Knights', 'TBL': 'Lightning',
      'MTL': 'Canadiens', 'LAK': 'Kings', 'CBJ': 'Blue Jackets',
      'ANA': 'Ducks', 'BUF': 'Sabres', 'CGY': 'Flames',
      'EDM': 'Oilers', 'DAL': 'Stars', 'NJD': 'Devils',
      'CAR': 'Hurricanes', 'DET': 'Red Wings', 'WPG': 'Jets',
      'CHI': 'Blackhawks', 'COL': 'Avalanche'
    };
    return abbreviations[teamName] || teamName;
  };

  const getPerformanceColor = (value, threshold = 0) => {
    if (value > threshold) return 'text-green-400';
    if (value < threshold) return 'text-red-400';
    return 'text-gray-400';
  };

  const getPerformanceIcon = (value, threshold = 0) => {
    if (value > threshold) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (value < threshold) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return null;
  };

  if (!teamData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Select a team to view analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Team Analytics</h1>
        <p className="text-gray-400">Deep dive into team performance metrics and regression analysis</p>
      </div>

      {/* Team Selector */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center space-x-4">
            <label className="text-white font-semibold">Select Team:</label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-nhl-blue focus:outline-none"
            >
              {allTeams.map((team) => (
                <option key={team.team} value={team.team}>
                  {getTeamAbbreviation(team.team)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="metric-value">{teamData.pdo.toFixed(1)}</div>
          <div className="metric-label">PDO (Puck Luck)</div>
          <div className="text-xs mt-2">
            {teamData.pdo > 102 ? 'Lucky' : teamData.pdo < 98 ? 'Unlucky' : 'Neutral'}
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">{teamData.xGD_per60.toFixed(2)}</div>
          <div className="metric-label">xG Differential/60</div>
          <div className="text-xs mt-2">
            {teamData.xGD_per60 > 0 ? 'Positive' : 'Negative'}
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">{teamData.shooting_efficiency.toFixed(2)}</div>
          <div className="metric-label">Shooting Efficiency</div>
          <div className="text-xs mt-2">
            {teamData.shooting_efficiency > 1.1 ? 'Overperforming' : 
             teamData.shooting_efficiency < 0.9 ? 'Underperforming' : 'Normal'}
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">{teamData.regression_score.toFixed(1)}</div>
          <div className="metric-label">Regression Score</div>
          <div className="text-xs mt-2">
            {Math.abs(teamData.regression_score) > 10 ? 'High Regression Expected' : 'Stable'}
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Offensive Metrics */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-bold text-white">Offensive Metrics</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">xGF per 60</span>
                <div className="flex items-center space-x-2">
                  <span className="text-nhl-gold font-bold">{teamData.xGF_per60.toFixed(2)}</span>
                  {getPerformanceIcon(teamData.xGF_per60, 2.5)}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">High Danger xGF/60</span>
                <div className="flex items-center space-x-2">
                  <span className="text-nhl-gold font-bold">{teamData.highDanger_xGF_per60.toFixed(2)}</span>
                  {getPerformanceIcon(teamData.highDanger_xGF_per60, 0.8)}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Score Adj xGF/60</span>
                <div className="flex items-center space-x-2">
                  <span className="text-nhl-gold font-bold">{teamData.scoreAdj_xGF_per60.toFixed(2)}</span>
                  {getPerformanceIcon(teamData.scoreAdj_xGF_per60, 2.5)}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Corsi per 60</span>
                <div className="flex items-center space-x-2">
                  <span className="text-nhl-gold font-bold">{teamData.corsi_per60.toFixed(1)}</span>
                  {getPerformanceIcon(teamData.corsi_per60, 50)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Defensive Metrics */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-bold text-white">Defensive Metrics</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">xGA per 60</span>
                <div className="flex items-center space-x-2">
                  <span className="text-nhl-gold font-bold">{teamData.xGA_per60.toFixed(2)}</span>
                  {getPerformanceIcon(teamData.xGA_per60, 2.5, true)}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">High Danger xGA/60</span>
                <div className="flex items-center space-x-2">
                  <span className="text-nhl-gold font-bold">{teamData.highDanger_xGA_per60.toFixed(2)}</span>
                  {getPerformanceIcon(teamData.highDanger_xGA_per60, 0.8, true)}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Save Performance</span>
                <div className="flex items-center space-x-2">
                  <span className="text-nhl-gold font-bold">{teamData.save_performance.toFixed(3)}</span>
                  {getPerformanceIcon(teamData.save_performance, 0)}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Fenwick per 60</span>
                <div className="flex items-center space-x-2">
                  <span className="text-nhl-gold font-bold">{teamData.fenwick_per60.toFixed(1)}</span>
                  {getPerformanceIcon(teamData.fenwick_per60, 50)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Regression Analysis */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-xl font-bold text-white">Regression Analysis</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-nhl-gold mb-2">
                {teamData.pdo.toFixed(1)}
              </div>
              <div className="text-sm text-gray-400 mb-2">PDO</div>
              <div className={`text-xs px-2 py-1 rounded ${
                teamData.pdo > 102 ? 'bg-red-500/20 text-red-300' :
                teamData.pdo < 98 ? 'bg-green-500/20 text-green-300' :
                'bg-gray-500/20 text-gray-300'
              }`}>
                {teamData.pdo > 102 ? 'Overperforming' :
                 teamData.pdo < 98 ? 'Underperforming' : 'Neutral'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-nhl-gold mb-2">
                {teamData.shooting_efficiency.toFixed(2)}
              </div>
              <div className="text-sm text-gray-400 mb-2">Shooting Efficiency</div>
              <div className={`text-xs px-2 py-1 rounded ${
                teamData.shooting_efficiency > 1.1 ? 'bg-red-500/20 text-red-300' :
                teamData.shooting_efficiency < 0.9 ? 'bg-green-500/20 text-green-300' :
                'bg-gray-500/20 text-gray-300'
              }`}>
                {teamData.shooting_efficiency > 1.1 ? 'Overperforming' :
                 teamData.shooting_efficiency < 0.9 ? 'Underperforming' : 'Normal'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-nhl-gold mb-2">
                {Math.abs(teamData.regression_score).toFixed(1)}
              </div>
              <div className="text-sm text-gray-400 mb-2">Regression Score</div>
              <div className={`text-xs px-2 py-1 rounded ${
                Math.abs(teamData.regression_score) > 10 ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-gray-500/20 text-gray-300'
              }`}>
                {Math.abs(teamData.regression_score) > 10 ? 'High Regression Expected' : 'Stable'}
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <h4 className="font-semibold text-white mb-2">Betting Recommendation:</h4>
            <p className="text-gray-300 text-sm">
              {teamData.regression_score > 10 ? 
                `BET UNDER/AGAINST ${getTeamAbbreviation(teamData.team)} - Team is overperforming and due for regression` :
               teamData.regression_score < -10 ?
                `BET OVER/WITH ${getTeamAbbreviation(teamData.team)} - Team is underperforming and due for positive regression` :
                `No significant edge detected for ${getTeamAbbreviation(teamData.team)}`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamAnalytics;
