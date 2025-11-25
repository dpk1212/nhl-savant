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
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      borderRadius: '16px',
      padding: '1.25rem',
      marginBottom: '1.5rem',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), 0 0 40px rgba(16, 185, 129, 0.1)'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '1rem',
        gap: '0.75rem'
      }}>
        <div style={{
          width: '4px',
          height: '32px',
          background: 'linear-gradient(to bottom, #10B981, #059669)',
          borderRadius: '4px'
        }}></div>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '900',
          color: 'white',
          letterSpacing: '-0.02em'
        }}>
          🏀 Basketball Bet Performance
        </h2>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth < 768 ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
        gap: '1rem'
      }}>
        {/* Total Bets */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '1.75rem',
            fontWeight: '900',
            color: 'white',
            fontFeatureSettings: "'tnum'"
          }}>
            {gradedBets}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#94a3b8',
            marginTop: '0.25rem',
            fontWeight: '600'
          }}>
            Graded Bets
          </div>
        </div>

        {/* Record */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '1.75rem',
            fontWeight: '900',
            color: 'white',
            fontFeatureSettings: "'tnum'"
          }}>
            {wins}-{losses}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#94a3b8',
            marginTop: '0.25rem',
            fontWeight: '600'
          }}>
            Win-Loss Record
          </div>
        </div>

        {/* Win Rate */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '1.75rem',
            fontWeight: '900',
            color: winRate >= 60 ? '#10B981' :
                   winRate >= 55 ? '#14B8A6' :
                   winRate >= 50 ? '#F59E0B' :
                   '#EF4444',
            fontFeatureSettings: "'tnum'"
          }}>
            {winRate.toFixed(1)}%
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#94a3b8',
            marginTop: '0.25rem',
            fontWeight: '600'
          }}>
            Win Rate
          </div>
        </div>

        {/* Units Won */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '1.75rem',
            fontWeight: '900',
            color: unitsWon > 0 ? '#10B981' : 
                   unitsWon < 0 ? '#EF4444' : 
                   '#94a3b8',
            fontFeatureSettings: "'tnum'"
          }}>
            {unitsWon > 0 ? '+' : ''}{unitsWon.toFixed(2)}u
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#94a3b8',
            marginTop: '0.25rem',
            fontWeight: '600'
          }}>
            Units Won
          </div>
        </div>

        {/* ROI */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '1.75rem',
            fontWeight: '900',
            color: roi > 0 ? '#10B981' : 
                   roi < 0 ? '#EF4444' : 
                   '#94a3b8',
            fontFeatureSettings: "'tnum'"
          }}>
            {roi > 0 ? '+' : ''}{roi.toFixed(1)}%
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#94a3b8',
            marginTop: '0.25rem',
            fontWeight: '600'
          }}>
            ROI
          </div>
        </div>
      </div>

      {/* Pending Bets Indicator */}
      {pending > 0 && (
        <div style={{
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(71, 85, 105, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            color: '#94a3b8'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#F59E0B',
              borderRadius: '50%',
              marginRight: '8px',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}></div>
            {pending} pending bet{pending !== 1 ? 's' : ''} awaiting results
          </div>
        </div>
      )}

      {/* Performance Indicator */}
      {gradedBets >= 10 && (
        <div style={{
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(71, 85, 105, 0.3)'
        }}>
          <div style={{
            textAlign: 'center',
            fontSize: '0.875rem',
            fontWeight: '700'
          }}>
            {winRate >= 60 ? (
              <span style={{ color: '#10B981' }}>🔥 Elite Performance!</span>
            ) : winRate >= 55 ? (
              <span style={{ color: '#14B8A6' }}>⭐ Strong Performance</span>
            ) : winRate >= 50 ? (
              <span style={{ color: '#F59E0B' }}>📈 Building Momentum</span>
            ) : (
              <span style={{ color: '#94a3b8' }}>Keep grinding! Sample size: {gradedBets}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


