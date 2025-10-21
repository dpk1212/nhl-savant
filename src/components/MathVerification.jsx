import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const MathVerification = ({ dataProcessor }) => {
  const [expanded, setExpanded] = useState(null);

  if (!dataProcessor) return null;

  // Get a sample team for demonstration
  const sampleTeam = dataProcessor.processedData.find(d => d.situation === 'all') || dataProcessor.processedData[0];

  const calculations = [
    {
      id: 'pdo',
      title: 'PDO (Puck Luck Indicator)',
      formula: 'PDO = (Goals For / Shots On Goal) × 100 + (1 - Goals Against / Shots On Goal Against) × 100',
      example: `PDO = (${sampleTeam.goalsFor} / ${sampleTeam.shotsOnGoalFor}) × 100 + (1 - ${sampleTeam.goalsAgainst} / ${sampleTeam.shotsOnGoalAgainst}) × 100`,
      result: `PDO = ${sampleTeam.pdo.toFixed(1)} (100 = league average)`
    },
    {
      id: 'xgper60',
      title: 'xG Per 60 Minutes',
      formula: 'xG/60 = (Expected Goals / Ice Time in seconds) × 3600',
      example: `xG/60 = (${sampleTeam.xGoalsFor} / ${sampleTeam.iceTime}) × 3600`,
      result: `xG/60 = ${sampleTeam.xGF_per60?.toFixed(2) || 'N/A'} (offensive scoring chances per game hour)`
    },
    {
      id: 'shooting',
      title: 'Shooting Efficiency',
      formula: 'Shooting Efficiency = Actual Goals / Expected Goals',
      example: `Shooting Eff = ${sampleTeam.goalsFor} / ${sampleTeam.xGoalsFor}`,
      result: `Shooting Eff = ${sampleTeam.shooting_efficiency?.toFixed(2) || 'N/A'} (1.0 = luck-neutral, >1 = lucky, <1 = unlucky)`
    },
    {
      id: 'xgdiff',
      title: 'xG Differential Per 60',
      formula: 'xG Diff = (xG For / Ice Time × 3600) - (xG Against / Ice Time × 3600)',
      example: `xG Diff = ${sampleTeam.xGF_per60?.toFixed(2)} - ${sampleTeam.xGA_per60?.toFixed(2)}`,
      result: `xG Diff = ${sampleTeam.xGD_per60?.toFixed(2)} per 60 min (quality of play indicator)`
    }
  ];

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-blue-900/30 to-blue-900/5 p-4 border-b border-gray-700">
        <h3 className="font-bold text-white flex items-center">
          📊 Math Verification - Sample Team: {sampleTeam.name}
        </h3>
        <p className="text-xs text-gray-400 mt-1">Click any calculation to see the formula and step-by-step math</p>
      </div>

      <div className="divide-y divide-gray-700">
        {calculations.map(calc => (
          <div key={calc.id} className="hover:bg-gray-700/30 transition">
            <button
              onClick={() => setExpanded(expanded === calc.id ? null : calc.id)}
              className="w-full p-4 text-left flex items-center justify-between"
            >
              <div>
                <h4 className="font-semibold text-white">{calc.title}</h4>
                <p className="text-sm text-green-400 mt-1">{calc.result}</p>
              </div>
              {expanded === calc.id ? (
                <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
            </button>

            {expanded === calc.id && (
              <div className="px-4 pb-4 bg-gray-900/50">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-400 mb-1">Formula:</p>
                    <p className="font-mono bg-gray-900 p-2 rounded text-blue-300 text-xs">{calc.formula}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">With Real Data:</p>
                    <p className="font-mono bg-gray-900 p-2 rounded text-yellow-300 text-xs">{calc.example}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Result:</p>
                    <p className="font-mono bg-gray-900 p-2 rounded text-green-300 text-xs">{calc.result}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MathVerification;

