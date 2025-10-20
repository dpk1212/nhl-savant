import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Target, AlertCircle, Star } from 'lucide-react';

const BettingOpportunities = ({ dataProcessor }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [regressionCandidates, setRegressionCandidates] = useState({ overperforming: [], underperforming: [] });
  const [specialTeamsMismatches, setSpecialTeamsMismatches] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (dataProcessor) {
      const opportunities = dataProcessor.getTopBettingOpportunities();
      setOpportunities(opportunities);

      const regression = dataProcessor.findRegressionCandidates();
      setRegressionCandidates(regression);

      const mismatches = dataProcessor.findSpecialTeamsMismatches();
      setSpecialTeamsMismatches(mismatches);
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

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getEdgeColor = (edge) => {
    if (edge >= 0.3) return 'text-green-400';
    if (edge >= 0.1) return 'text-yellow-400';
    return 'text-red-400';
  };

  const renderOpportunityCard = (opportunity, index) => (
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
          <div className={`text-sm font-semibold ${getConfidenceColor(opportunity.confidence)}`}>
            {opportunity.confidence.toFixed(0)}% Confidence
          </div>
          <div className={`text-xs ${getEdgeColor(opportunity.edge)}`}>
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
  );

  const renderRegressionCandidate = (team, type) => (
    <div key={`${team.team}-${type}`} className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {type === 'overperforming' ? 
            <TrendingDown className="w-5 h-5 text-red-400" /> :
            <TrendingUp className="w-5 h-5 text-green-400" />
          }
          <span className="font-bold text-lg">{team.team}</span>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-nhl-gold">
            Score: {team.regression_score.toFixed(1)}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-400">PDO:</span>
          <span className={`ml-2 font-semibold ${
            team.pdo > 102 ? 'text-red-400' : team.pdo < 98 ? 'text-green-400' : 'text-gray-300'
          }`}>
            {team.pdo.toFixed(1)}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Shooting Eff:</span>
          <span className={`ml-2 font-semibold ${
            team.shooting_efficiency > 1.1 ? 'text-red-400' : 
            team.shooting_efficiency < 0.9 ? 'text-green-400' : 'text-gray-300'
          }`}>
            {team.shooting_efficiency.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-gray-400">xG Diff/60:</span>
          <span className="ml-2 font-semibold text-nhl-gold">
            {team.xGD_per60.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Games:</span>
          <span className="ml-2 font-semibold text-gray-300">
            {team.games_played}
          </span>
        </div>
      </div>
      
      <div className="mt-3 p-3 bg-gray-700 rounded">
        <div className="font-semibold text-sm mb-1">
          {type === 'overperforming' ? 'BET UNDER/AGAINST' : 'BET OVER/WITH'}
        </div>
        <div className="text-xs text-gray-300">
          {type === 'overperforming' ? 
            'Team is overperforming and due for negative regression' :
            'Team is underperforming and due for positive regression'
          }
        </div>
      </div>
    </div>
  );

  const renderSpecialTeamsMismatch = (mismatch, index) => (
    <div key={index} className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-lg">{mismatch.ppTeam} vs {mismatch.pkTeam}</span>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-blue-400">
            Mismatch: {mismatch.mismatch.toFixed(1)}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
        <div>
          <span className="text-gray-400">{mismatch.ppTeam} PP:</span>
          <span className="ml-2 font-semibold text-green-400">
            {mismatch.ppEfficiency.toFixed(2)}/60
          </span>
        </div>
        <div>
          <span className="text-gray-400">{mismatch.pkTeam} PK:</span>
          <span className="ml-2 font-semibold text-red-400">
            {mismatch.pkEfficiency.toFixed(2)}/60
          </span>
        </div>
      </div>
      
      <div className="p-3 bg-blue-500/20 rounded">
        <div className="font-semibold text-sm text-blue-300 mb-1">
          {mismatch.recommendation}
        </div>
        <div className="text-xs text-gray-300">
          Significant power play vs penalty kill efficiency mismatch
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Betting Opportunities</h1>
        <p className="text-gray-400">Mathematically identified edges through regression analysis and special teams mismatches</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        {[
          { id: 'all', label: 'All Opportunities' },
          { id: 'regression', label: 'Regression Analysis' },
          { id: 'special', label: 'Special Teams' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-nhl-blue text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* All Opportunities */}
      {activeTab === 'all' && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Star className="w-6 h-6 mr-2 text-nhl-gold" />
              Top Betting Opportunities
            </h2>
            <p className="text-gray-400 mt-2">
              Ranked by mathematical edge and confidence level
            </p>
          </div>
          <div className="card-body">
            {opportunities.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No significant opportunities found in current data</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {opportunities.map((opportunity, index) => renderOpportunityCard(opportunity, index))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Regression Analysis */}
      {activeTab === 'regression' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <TrendingDown className="w-6 h-6 mr-2 text-red-400" />
                Overperforming Teams (Bet Against)
              </h2>
              <p className="text-gray-400 mt-2">
                Teams with high PDO and shooting efficiency - due for negative regression
              </p>
            </div>
            <div className="card-body">
              {regressionCandidates.overperforming.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No overperforming teams identified</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regressionCandidates.overperforming.map((team, index) => 
                    renderRegressionCandidate(team, 'overperforming')
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-green-400" />
                Underperforming Teams (Bet With)
              </h2>
              <p className="text-gray-400 mt-2">
                Teams with low PDO and shooting efficiency - due for positive regression
              </p>
            </div>
            <div className="card-body">
              {regressionCandidates.underperforming.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No underperforming teams identified</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regressionCandidates.underperforming.map((team, index) => 
                    renderRegressionCandidate(team, 'underperforming')
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Special Teams Mismatches */}
      {activeTab === 'special' && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Target className="w-6 h-6 mr-2 text-blue-400" />
              Special Teams Mismatches
            </h2>
            <p className="text-gray-400 mt-2">
              Elite power plays vs weak penalty kills - high-value betting opportunities
            </p>
          </div>
          <div className="card-body">
            {specialTeamsMismatches.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No significant special teams mismatches found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specialTeamsMismatches.map((mismatch, index) => 
                  renderSpecialTeamsMismatch(mismatch, index)
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Methodology Note */}
      <div className="card">
        <div className="card-body">
          <h3 className="text-lg font-bold text-white mb-3">Methodology</h3>
          <div className="text-sm text-gray-300 space-y-2">
            <p>
              <strong>Regression Analysis:</strong> Identifies teams with significant PDO and shooting efficiency deviations from league average. 
              Overperforming teams (PDO &gt; 102, Shooting Eff &gt; 1.1) are due for negative regression. 
              Underperforming teams (PDO &lt; 98, Shooting Eff &lt; 0.9) are due for positive regression.
            </p>
            <p>
              <strong>Special Teams Mismatches:</strong> Finds games where elite power plays face weak penalty kills, 
              creating exploitable betting opportunities on team totals and moneyline bets.
            </p>
            <p>
              <strong>Confidence Levels:</strong> Based on sample size, magnitude of deviation, and historical regression patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BettingOpportunities;
