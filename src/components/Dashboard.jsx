import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Target, AlertTriangle, Zap, BarChart3 } from 'lucide-react';

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
        return 'bg-red-900/40 border-red-500/60 text-red-100';
      case 'SPECIAL_TEAMS':
        return 'bg-blue-900/40 border-blue-500/60 text-blue-100';
      default:
        return 'bg-gray-700/40 border-gray-500/60 text-gray-100';
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
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-yellow-400 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                NHL Savant
              </h1>
            </div>
            <p className="text-lg text-gray-300 mb-2">
              Advanced Analytics for Smart Bettors
            </p>
            <p className="text-gray-400">
              Mathematical edge detection through xG analysis and regression modeling
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* League Overview Stats */}
        {leagueStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm font-semibold">TEAMS ANALYZED</span>
                <BarChart3 className="w-5 h-5 text-yellow-400 opacity-50" />
              </div>
              <div className="text-3xl font-bold text-yellow-400">{leagueStats.totalTeams}</div>
              <div className="text-xs text-gray-500 mt-2">across all situations</div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm font-semibold">AVG PDO</span>
                <Zap className="w-5 h-5 text-blue-400 opacity-50" />
              </div>
              <div className="text-3xl font-bold text-blue-400">{leagueStats.avgPDO}</div>
              <div className="text-xs text-gray-500 mt-2">100 = neutral</div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm font-semibold">xG DIFF</span>
                <TrendingUp className="w-5 h-5 text-green-400 opacity-50" />
              </div>
              <div className="text-3xl font-bold text-green-400">{leagueStats.avgXGD}</div>
              <div className="text-xs text-gray-500 mt-2">per 60 minutes</div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm font-semibold">REGRESSION</span>
                <AlertTriangle className="w-5 h-5 text-orange-400 opacity-50" />
              </div>
              <div className="text-3xl font-bold text-orange-400">{leagueStats.overperformingTeams + leagueStats.underperformingTeams}</div>
              <div className="text-xs text-gray-500 mt-2">betting opportunities</div>
            </div>
          </div>
        )}

        {/* Top Betting Opportunities */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Target className="w-6 h-6 text-yellow-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Top Betting Opportunities</h2>
          </div>
          <p className="text-gray-400 mb-6">
            Mathematically identified edges based on regression analysis and special teams mismatches
          </p>

          {opportunities.length === 0 ? (
            <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-700">
              <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No significant opportunities found in current data</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {opportunities.slice(0, 6).map((opportunity, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-6 border transition hover:shadow-lg ${getRecommendationColor(opportunity.type)}`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getRecommendationIcon(opportunity.recommendation)}
                      <div>
                        <div className="font-bold text-lg text-white">{opportunity.team}</div>
                        <div className="text-xs text-gray-300">{opportunity.type.replace('_', ' ')}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-yellow-400">
                        {opportunity.confidence.toFixed(0)}% CONFIDENCE
                      </div>
                      <div className="text-xs text-gray-300 mt-1">
                        Edge: {(opportunity.edge * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-4 pb-4 border-b border-gray-600/50">
                    <div className="font-semibold text-base mb-2 text-white">
                      {opportunity.recommendation}
                    </div>
                    <div className="text-sm text-gray-200">
                      {opportunity.reason}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-xs text-gray-400">
                    Updated: {new Date().toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Analysis Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Regression Analysis */}
          <div className="bg-gray-900 rounded-lg border border-gray-700 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-red-900/20 to-red-900/5 p-4 border-b border-gray-700">
              <h3 className="text-lg font-bold text-white flex items-center">
                <TrendingDown className="w-5 h-5 mr-2 text-red-400" />
                Regression Analysis
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-red-900/20 rounded">
                  <span className="text-gray-300 font-medium">Overperforming Teams</span>
                  <span className="text-red-400 font-bold text-lg">
                    {leagueStats?.overperformingTeams || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-900/20 rounded">
                  <span className="text-gray-300 font-medium">Underperforming Teams</span>
                  <span className="text-green-400 font-bold text-lg">
                    {leagueStats?.underperformingTeams || 0}
                  </span>
                </div>
                <div className="text-sm text-gray-400 mt-4 p-3 bg-gray-800 rounded">
                  Teams with significant PDO or shooting efficiency deviations indicate strong regression opportunities.
                </div>
              </div>
            </div>
          </div>

          {/* Model Performance */}
          <div className="bg-gray-900 rounded-lg border border-gray-700 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900/20 to-blue-900/5 p-4 border-b border-gray-700">
              <h3 className="text-lg font-bold text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                Model Performance
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-900/20 rounded">
                  <span className="text-gray-300 font-medium">Data Points</span>
                  <span className="text-blue-400 font-bold text-lg">
                    {dataProcessor?.processedData?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-900/20 rounded">
                  <span className="text-gray-300 font-medium">Game Situations</span>
                  <span className="text-blue-400 font-bold text-lg">5</span>
                </div>
                <div className="text-sm text-gray-400 mt-4 p-3 bg-gray-800 rounded">
                  5v5, Power Play, Penalty Kill, All Situations, Other
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
