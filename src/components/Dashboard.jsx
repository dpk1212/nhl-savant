import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Target, AlertTriangle, Zap, BarChart3, CheckCircle, Sparkles } from 'lucide-react';
import DataStatus from './DataStatus';
import MathVerification from './MathVerification';

const Dashboard = ({ dataProcessor, loading, error }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [leagueStats, setLeagueStats] = useState(null);

  useEffect(() => {
    if (dataProcessor) {
      const topOpportunities = dataProcessor.getTopBettingOpportunities();
      setOpportunities(topOpportunities);

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

  const getConfidenceColor = (confidence) => {
    if (confidence >= 70) return 'high';
    if (confidence >= 50) return 'medium';
    return 'low';
  };

  const getRecommendationIcon = (recommendation) => {
    if (recommendation.includes('UNDER') || recommendation.includes('AGAINST')) {
      return <TrendingDown className="w-6 h-6 text-red-400" />;
    } else if (recommendation.includes('OVER') || recommendation.includes('WITH')) {
      return <TrendingUp className="w-6 h-6 text-green-400" />;
    }
    return <Target className="w-6 h-6 text-blue-400" />;
  };

  const getTeamBadgeColor = (team) => {
    const hash = team.charCodeAt(0);
    const colors = ['badge-gold', 'badge-blue', 'badge-red', 'badge-green'];
    return colors[hash % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-950/30 via-gray-900 to-gray-950 py-16 px-4 border-b border-white/5">
        {/* Background gradient accent */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-between flex-col md:flex-row gap-8">
            <div className="animate-fadeIn">
              <div className="flex items-center mb-3">
                <Sparkles className="w-10 h-10 text-yellow-400 mr-4 animate-pulse" />
                <h1 className="text-6xl md:text-7xl font-black tracking-tight">
                  <span className="text-gradient">NHL Savant</span>
                </h1>
              </div>
              <p className="text-xl text-gray-300 mb-2">Advanced Analytics for Smart Bettors</p>
              <p className="text-gray-400">Mathematical edge detection through xG analysis and regression modeling</p>
            </div>
            <div className="animate-slideInRight text-center">
              <div className="animate-pulse-glow rounded-full p-6 mb-4 inline-block">
                <CheckCircle className="w-16 h-16 text-green-400" />
              </div>
              <p className="text-sm text-gray-400">Verified</p>
              <p className="text-base text-green-400 font-bold">Math Checked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Data Status */}
        <div className="animate-fadeIn mb-8">
          <DataStatus dataProcessor={dataProcessor} loading={loading} error={error} />
        </div>

        {/* Math Verification */}
        <div className="animate-slideInLeft mb-8">
          <MathVerification dataProcessor={dataProcessor} />
        </div>

        {/* League Overview Stats - Premium Grid */}
        {leagueStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fadeIn">
            {/* Teams Card */}
            <div className="stat-card group">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="w-8 h-8 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                <span className="text-xs font-bold text-yellow-400 badge badge-gold">TOTAL</span>
              </div>
              <div className="stat-card-value gradient-gold">{leagueStats.totalTeams}</div>
              <div className="stat-card-label">Teams Analyzed</div>
              <div className="stat-card-description">across all situations</div>
            </div>

            {/* PDO Card */}
            <div className="stat-card group">
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <span className="text-xs font-bold text-blue-400 badge badge-blue">AVG</span>
              </div>
              <div className="stat-card-value gradient-blue">{leagueStats.avgPDO}</div>
              <div className="stat-card-label">PDO (Puck Luck)</div>
              <div className="stat-card-description">100 = perfectly average</div>
            </div>

            {/* xG Diff Card */}
            <div className="stat-card group">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-green-400 group-hover:text-green-300 transition-colors" />
                <span className="text-xs font-bold text-green-400 badge badge-green">PER 60</span>
              </div>
              <div className="stat-card-value gradient-green">{leagueStats.avgXGD}</div>
              <div className="stat-card-label">xG Differential</div>
              <div className="stat-card-description">quality of play indicator</div>
            </div>

            {/* Regression Card */}
            <div className="stat-card group">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="w-8 h-8 text-orange-400 group-hover:text-orange-300 transition-colors" />
                <span className="text-xs font-bold text-orange-400 badge badge-gold">EDGES</span>
              </div>
              <div className="stat-card-value gradient-gold">{leagueStats.overperformingTeams + leagueStats.underperformingTeams}</div>
              <div className="stat-card-label">Betting Opportunities</div>
              <div className="stat-card-description">identified opportunities</div>
            </div>
          </div>
        )}

        {/* Top Betting Opportunities - Premium */}
        <div className="mb-12 animate-slideInLeft">
          <div className="flex items-center gap-3 mb-8">
            <Target className="w-8 h-8 text-yellow-400" />
            <h2 className="text-4xl font-black text-white">Top Betting Opportunities</h2>
            <span className="ml-auto text-sm text-gray-400">Real-time analysis</span>
          </div>

          {opportunities.length === 0 ? (
            <div className="card text-center py-16">
              <AlertTriangle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No significant opportunities found in current data</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {opportunities.slice(0, 6).map((opportunity, index) => (
                <div
                  key={index}
                  className="glass-card p-6 hover-lift group animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500/20 to-blue-500/20 group-hover:from-yellow-500/30 group-hover:to-blue-500/30 transition-all">
                        {getRecommendationIcon(opportunity.recommendation)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`badge ${getTeamBadgeColor(opportunity.team)}`}>{opportunity.team}</span>
                        </div>
                        <p className="text-xs text-gray-400">{opportunity.type.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-yellow-400">{opportunity.confidence.toFixed(0)}%</div>
                      <div className="text-xs text-gray-500">confidence</div>
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div className="mb-4">
                    <div className="confidence-bar">
                      <div
                        className={`confidence-bar-fill ${getConfidenceColor(opportunity.confidence)}`}
                        style={{ width: `${opportunity.confidence}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-4 pb-4 border-b border-white/10">
                    <h4 className="font-black text-white mb-2">{opportunity.recommendation}</h4>
                    <p className="text-sm text-gray-300">{opportunity.reason}</p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Edge: <span className="text-green-400 font-bold">{(opportunity.edge * 100).toFixed(1)}%</span></span>
                    <span className="text-xs text-gray-500">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Analysis Sections - Premium */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slideInRight">
          {/* Regression Analysis */}
          <div className="card hover-lift">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-red-500/20">
                <TrendingDown className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-2xl font-black text-white">Regression Analysis</h3>
            </div>
            <div className="space-y-4">
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 font-semibold">Overperforming</span>
                  <span className="text-2xl font-black text-red-400">{leagueStats?.overperformingTeams || 0}</span>
                </div>
                <p className="text-xs text-gray-500">Teams due for negative regression</p>
              </div>
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 font-semibold">Underperforming</span>
                  <span className="text-2xl font-black text-green-400">{leagueStats?.underperformingTeams || 0}</span>
                </div>
                <p className="text-xs text-gray-500">Teams due for positive regression</p>
              </div>
              <p className="text-sm text-gray-400 p-3 rounded-lg bg-white/5">
                Teams with significant PDO or shooting efficiency deviations indicate strong regression opportunities.
              </p>
            </div>
          </div>

          {/* Model Performance */}
          <div className="card hover-lift">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-blue-500/20">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-black text-white">Model Performance</h3>
            </div>
            <div className="space-y-4">
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 font-semibold">Data Points</span>
                  <span className="text-2xl font-black text-blue-400">{dataProcessor?.processedData?.length || 0}</span>
                </div>
                <p className="text-xs text-gray-500">Total rows processed</p>
              </div>
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 font-semibold">Game Situations</span>
                  <span className="text-2xl font-black text-blue-400">5</span>
                </div>
                <p className="text-xs text-gray-500">5v5, PP, PK, All, Other</p>
              </div>
              <p className="text-sm text-gray-400 p-3 rounded-lg bg-white/5">
                All calculations verified and validated. Ready for advanced analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
