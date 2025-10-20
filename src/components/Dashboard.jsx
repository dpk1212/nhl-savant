import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';

const Dashboard = ({ dataProcessor }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [leagueStats, setLeagueStats] = useState(null);

  useEffect(() => {
    if (dataProcessor) {
      const topOpportunities = dataProcessor.getTopBettingOpportunities();
      setOpportunities(topOpportunities);

      // Calculate league-wide stats
      const allTeams = dataProcessor.getTeamsBySituation('all');
      const avgPDO = allTeams.reduce((sum, team) => sum + team.pdo, 0) / allTeams.length;
      const avgXGD = allTeams.reduce((sum, team) => sum + team.xGD_per60, 0) / allTeams.length;
      const regressionCandidates = dataProcessor.findRegressionCandidates();
      
      setLeagueStats({
        totalTeams: allTeams.length,
        avgPDO: avgPDO.toFixed(1),
        avgXGD: avgXGD.toFixed(2),
        overperformingTeams: regressionCandidates.overperforming.length,
        underperformingTeams: regressionCandidates.underperforming.length
      });
    }
  }, [dataProcessor]);

  const getRecommendationColor = (type) => {
    switch (type) {
      case 'REGRESSION':
        return 'bg-red-500/20 border-red-500/50 text-red-300';
      case 'SPECIAL_TEAMS':
        return 'bg-blue-500/20 border-blue-500/50 text-blue-300';
      default:
        return 'bg-gray-500/20 border-gray-500/50 text-gray-300';
    }
  };

  const getRecommendationIcon = (recommendation) => {
    if (recommendation.includes('UNDER') || recommendation.includes('AGAINST')) {
      return <TrendingDown className="w-5 h-5 text-red-400" />;
    } else if (recommendation.includes('OVER') || recommendation.includes('WITH')) {
      return <TrendingUp className="w-5 h-5 text-green-400" />;
    }
    return <Target className="w-5 h-5 text-blue-400" />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          NHL Savant
        </h1>
        <p className="text-xl text-gray-300 mb-2">
          Advanced Analytics for Smart Bettors
        </p>
        <p className="text-gray-400">
          Mathematical edge detection through xG analysis and regression modeling
        </p>
      </div>

      {/* League Overview Stats */}
      {leagueStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="metric-card">
            <div className="metric-value">{leagueStats.totalTeams}</div>
            <div className="metric-label">Teams Analyzed</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{leagueStats.avgPDO}</div>
            <div className="metric-label">Avg PDO (100 = neutral)</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{leagueStats.avgXGD}</div>
            <div className="metric-label">Avg xG Differential</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{leagueStats.overperformingTeams + leagueStats.underperformingTeams}</div>
            <div className="metric-label">Regression Candidates</div>
          </div>
        </div>
      )}

      {/* Top Betting Opportunities */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Target className="w-6 h-6 mr-2 text-nhl-gold" />
            Top Betting Opportunities
          </h2>
          <p className="text-gray-400 mt-2">
            Mathematically identified edges based on regression analysis and special teams mismatches
          </p>
        </div>
        <div className="card-body">
          {opportunities.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No significant opportunities found in current data</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {opportunities.slice(0, 6).map((opportunity, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg border-2 ${getRecommendationColor(opportunity.type)}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getRecommendationIcon(opportunity.recommendation)}
                      <span className="font-bold text-lg">{opportunity.team}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-nhl-gold">
                        {opportunity.confidence.toFixed(0)}% Confidence
                      </div>
                      <div className="text-xs text-gray-400">
                        Edge: {(opportunity.edge * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="font-semibold text-lg mb-1">
                      {opportunity.recommendation}
                    </div>
                    <div className="text-sm opacity-90">
                      {opportunity.reason}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-gray-700 rounded">
                      {opportunity.type.replace('_', ' ')}
                    </span>
                    <div className="text-xs text-gray-400">
                      Updated: {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-bold text-white">Regression Analysis</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Overperforming Teams</span>
                <span className="text-red-400 font-bold">
                  {leagueStats?.overperformingTeams || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Underperforming Teams</span>
                <span className="text-green-400 font-bold">
                  {leagueStats?.underperformingTeams || 0}
                </span>
              </div>
              <div className="text-sm text-gray-400 mt-4">
                Teams with significant PDO or shooting efficiency deviations
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-bold text-white">Model Performance</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Data Points</span>
                <span className="text-nhl-gold font-bold">
                  {dataProcessor?.processedData?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Situations</span>
                <span className="text-nhl-gold font-bold">5</span>
              </div>
              <div className="text-sm text-gray-400 mt-4">
                5v5, Power Play, Penalty Kill, All Situations, Other
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
