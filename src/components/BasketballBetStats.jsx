/**
 * Basketball Bet Performance Stats Component
 * Displays aggregated betting performance at the top of Basketball page
 */

import React from 'react';
import { useBasketballBetStats } from '../hooks/useBasketballBetStats';

export function BasketballBetStats() {
  const { stats, loading } = useBasketballBetStats();

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-400"></div>
          <span className="ml-3 text-slate-400">Loading bet stats...</span>
        </div>
      </div>
    );
  }

  // Don't show if no bets yet
  if (stats.totalBets === 0) {
    return null;
  }

  const { wins, losses, pending, winRate, unitsWon, roi, gradedBets } = stats;

  return (
    <div className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center mb-4">
        <div className="w-2 h-8 bg-gradient-to-b from-teal-400 to-cyan-500 rounded-full mr-3"></div>
        <h2 className="text-xl font-bold text-white">
          🏀 Basketball Bet Performance
        </h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Total Bets */}
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {gradedBets}
          </div>
          <div className="text-sm text-slate-400 mt-1">
            Graded Bets
          </div>
        </div>

        {/* Record */}
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {wins}-{losses}
          </div>
          <div className="text-sm text-slate-400 mt-1">
            Win-Loss Record
          </div>
        </div>

        {/* Win Rate */}
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            winRate >= 60 ? 'text-green-400' :
            winRate >= 55 ? 'text-teal-400' :
            winRate >= 50 ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {winRate.toFixed(1)}%
          </div>
          <div className="text-sm text-slate-400 mt-1">
            Win Rate
          </div>
        </div>

        {/* Units Won */}
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            unitsWon > 0 ? 'text-green-400' : 
            unitsWon < 0 ? 'text-red-400' : 
            'text-slate-400'
          }`}>
            {unitsWon > 0 ? '+' : ''}{unitsWon.toFixed(2)}u
          </div>
          <div className="text-sm text-slate-400 mt-1">
            Units Won
          </div>
        </div>

        {/* ROI */}
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            roi > 0 ? 'text-green-400' : 
            roi < 0 ? 'text-red-400' : 
            'text-slate-400'
          }`}>
            {roi > 0 ? '+' : ''}{roi.toFixed(1)}%
          </div>
          <div className="text-sm text-slate-400 mt-1">
            ROI
          </div>
        </div>
      </div>

      {/* Pending Bets Indicator */}
      {pending > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex items-center justify-center text-sm text-slate-400">
            <div className="animate-pulse w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
            {pending} pending bet{pending !== 1 ? 's' : ''} awaiting results
          </div>
        </div>
      )}

      {/* Performance Indicator */}
      {gradedBets >= 10 && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="text-center text-sm">
            {winRate >= 60 ? (
              <span className="text-green-400 font-semibold">🔥 Elite Performance!</span>
            ) : winRate >= 55 ? (
              <span className="text-teal-400 font-semibold">⭐ Strong Performance</span>
            ) : winRate >= 50 ? (
              <span className="text-yellow-400 font-semibold">📈 Building Momentum</span>
            ) : (
              <span className="text-slate-400">Keep grinding! Sample size: {gradedBets}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

