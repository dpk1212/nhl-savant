import { Calculator, TrendingUp, Target, AlertTriangle, BookOpen } from 'lucide-react';

const Methodology = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Methodology</h1>
        <p className="text-gray-400">The mathematical foundation behind NHL Savant's betting edge detection</p>
      </div>

      {/* Core Concepts */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-nhl-gold" />
            Core Mathematical Concepts
          </h2>
        </div>
        <div className="card-body space-y-6">
          {/* Expected Goals */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Expected Goals (xG)</h3>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-300 mb-3">
                Expected Goals measure the quality of scoring chances based on shot location, type, and context. 
                Unlike actual goals, xG is not affected by goaltender performance or shooting luck.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-nhl-gold font-semibold">Why xG &gt; Goals:</span>
                  <ul className="mt-2 space-y-1 text-gray-300">
                    <li>• Removes goaltender variance</li>
                    <li>• Eliminates shooting luck</li>
                    <li>• Predicts future performance</li>
                    <li>• Identifies regression candidates</li>
                  </ul>
                </div>
                <div>
                  <span className="text-nhl-gold font-semibold">Key Insight:</span>
                  <p className="mt-2 text-gray-300">
                    Teams with xG &gt; Goals are due for positive regression (bet OVER/WITH). 
                    Teams with Goals &gt; xG are due for negative regression (bet UNDER/AGAINST).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PDO */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">PDO (Puck Luck Indicator)</h3>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-300 mb-3">
                PDO = Shooting% + Save%. League average is 100. PDO is the most reliable indicator of unsustainable performance.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <span className="text-red-400 font-semibold">High PDO (&gt;102):</span>
                  <ul className="mt-2 space-y-1 text-gray-300">
                    <li>• Unsustainable shooting luck</li>
                    <li>• Due for negative regression</li>
                    <li>• BET UNDER/AGAINST</li>
                  </ul>
                </div>
                <div>
                    <span className="text-green-400 font-semibold">Low PDO (&lt;98):</span>
                  <ul className="mt-2 space-y-1 text-gray-300">
                    <li>• Unlucky shooting/saving</li>
                    <li>• Due for positive regression</li>
                    <li>• BET OVER/WITH</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Situational Analysis */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Situational Weighting</h3>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-300 mb-3">
                Different game situations have different impacts on outcomes. Our model weights each situation appropriately:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-nhl-gold">77%</div>
                  <div className="text-gray-400">5v5 Play</div>
                  <div className="text-xs text-gray-500 mt-1">Most important</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-nhl-gold">12%</div>
                  <div className="text-gray-400">Power Play</div>
                  <div className="text-xs text-gray-500 mt-1">High leverage</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-nhl-gold">11%</div>
                  <div className="text-gray-400">Penalty Kill</div>
                  <div className="text-xs text-gray-500 mt-1">Defensive impact</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Calculator className="w-6 h-6 mr-2 text-nhl-gold" />
            Key Metrics Explained
          </h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-3">Offensive Metrics</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-nhl-gold font-semibold">xGF per 60:</span>
                  <span className="text-gray-300 ml-2">Expected goals for per 60 minutes</span>
                </div>
                <div>
                  <span className="text-nhl-gold font-semibold">High Danger xGF:</span>
                  <span className="text-gray-300 ml-2">xG from high-danger areas (slot, crease)</span>
                </div>
                <div>
                  <span className="text-nhl-gold font-semibold">Score Adj xGF:</span>
                  <span className="text-gray-300 ml-2">xG adjusted for score effects</span>
                </div>
                <div>
                  <span className="text-nhl-gold font-semibold">Shooting Efficiency:</span>
                  <span className="text-gray-300 ml-2">Actual Goals / Expected Goals</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white mb-3">Defensive Metrics</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-nhl-gold font-semibold">xGA per 60:</span>
                  <span className="text-gray-300 ml-2">Expected goals against per 60 minutes</span>
                </div>
                <div>
                  <span className="text-nhl-gold font-semibold">High Danger xGA:</span>
                  <span className="text-gray-300 ml-2">xGA from high-danger areas</span>
                </div>
                <div>
                  <span className="text-nhl-gold font-semibold">Save Performance:</span>
                  <span className="text-gray-300 ml-2">1 - (Goals Against / xGoals Against)</span>
                </div>
                <div>
                  <span className="text-nhl-gold font-semibold">xG Differential:</span>
                  <span className="text-gray-300 ml-2">xGF per 60 - xGA per 60</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Betting Strategies */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Target className="w-6 h-6 mr-2 text-nhl-gold" />
            Betting Strategies
          </h2>
        </div>
        <div className="card-body space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-3">Regression Betting</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-300 mb-2">Overperforming Teams</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• PDO &gt; 102</li>
                  <li>• Shooting Efficiency &gt; 1.1</li>
                  <li>• BET UNDER team totals</li>
                  <li>• BET AGAINST on moneyline</li>
                </ul>
              </div>
              <div className="bg-green-500/20 border border-green-500/50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-300 mb-2">Underperforming Teams</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• PDO &lt; 98</li>
                  <li>• Shooting Efficiency &lt; 0.9</li>
                  <li>• BET OVER team totals</li>
                  <li>• BET WITH on moneyline</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-3">Special Teams Mismatches</h3>
            <div className="bg-blue-500/20 border border-blue-500/50 p-4 rounded-lg">
              <p className="text-gray-300 mb-3">
                Elite power plays vs weak penalty kills create high-value betting opportunities:
              </p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• BET OVER on team totals for strong PP teams</li>
                <li>• BET team totals when PP efficiency &gt; PK efficiency by 2+ per 60</li>
                <li>• Focus on games with high penalty frequency</li>
                <li>• Live betting opportunities during power plays</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Management */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2 text-nhl-gold" />
            Risk Management
          </h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-3">Bankroll Rules</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Never bet &gt;5% of bankroll on single game</li>
                <li>• Daily exposure limit = 15% of bankroll</li>
                <li>• Stop loss = -10% of bankroll in 1 week</li>
                <li>• Take profits at +20%, withdraw half</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-3">Edge Requirements</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Minimum 3% expected value</li>
                  <li>• Confidence level &gt;60%</li>
                  <li>• Sample size &gt;10 games</li>
                <li>• Avoid chasing losses</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Expectations */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-nhl-gold" />
            Performance Expectations
          </h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-nhl-gold mb-2">54-58%</div>
              <div className="text-gray-400 mb-2">Win Rate</div>
              <div className="text-xs text-gray-500">Excellent performance</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-nhl-gold mb-2">5-8%</div>
              <div className="text-gray-400 mb-2">Annual ROI</div>
              <div className="text-xs text-gray-500">Sustainable long-term</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-nhl-gold mb-2">100+</div>
              <div className="text-gray-400 mb-2">Bets Needed</div>
              <div className="text-xs text-gray-500">For statistical significance</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <h4 className="font-semibold text-white mb-2">Important Notes:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Expect 20-30% losing weeks - this is normal</li>
              <li>• Quality over quantity - only bet when you have a true edge</li>
              <li>• Never bet more than you can afford to lose</li>
              <li>• Keep detailed records of all bets and outcomes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Methodology;
