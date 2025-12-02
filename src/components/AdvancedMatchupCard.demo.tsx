/**
 * Demo/Preview for Advanced Matchup Card
 * Shows the component with sample data
 */

import React from 'react';
import { AdvancedMatchupCard } from './AdvancedMatchupCard';

// Sample data from Georgia vs Florida State
const sampleBarttorvik = {
  away: {
    rank: 73,
    adjOff: 117.7,
    adjDef: 99.2,
    eFG_off: 55.1,
    eFG_def: 44.2,
    to_off: 13.9,
    to_def: 22.8,
    oreb_off: 38.4,
    oreb_def: 33.2,
    twoP_off: 63.9,
    threeP_off: 30.2
  },
  home: {
    rank: 170,
    adjOff: 109.9,
    adjDef: 100.5,
    eFG_off: 51.1,
    eFG_def: 47.4,
    to_off: 15.1,
    to_def: 26.0,
    oreb_off: 29.8,
    oreb_def: 30.1,
    twoP_off: 59.0,
    threeP_off: 31.8
  },
  matchup: {
    rankAdvantage: 'away' as const,
    rankDiff: 97,
    offAdvantage: 'away' as const,
    offDiff: '7.8',
    defAdvantage: 'away' as const,
    awayOffVsHomeDef: '7.7',
    homeOffVsAwayDef: '6.9'
  }
};

export function AdvancedMatchupCardDemo() {
  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Advanced Matchup Card</h1>
          <p className="text-gray-400">Premium Statistical Analysis Component</p>
        </div>

        <AdvancedMatchupCard
          barttorvik={sampleBarttorvik}
          awayTeam="Georgia"
          homeTeam="Florida State"
        />

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-3">Component Features:</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span>White-labeled - no data source mentioned</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Switch between offense vs defense perspectives</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Expandable full statistics section</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Color-coded rankings (Top 25 = Gold, Top 75 = Green)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Visual progress bars for shooting percentages</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Auto-generated key factors with insights</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Premium dark theme matching NHL Savant brand</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdvancedMatchupCardDemo;

