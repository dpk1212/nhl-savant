/**
 * Basketball Bet Performance Stats Component
 * Premium collapsible section with calendar view
 */

import React, { useState } from 'react';
import { useBasketballBetStats } from '../hooks/useBasketballBetStats';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';

export function BasketballBetStats() {
  const { stats, loading, dailyStats } = useBasketballBetStats();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

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
  const isMobile = window.innerWidth < 768;

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      borderRadius: '16px',
      padding: isMobile ? '1rem' : '1.25rem',
      marginBottom: '1.5rem',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), 0 0 40px rgba(16, 185, 129, 0.1)',
      overflow: 'hidden'
    }}>
      {/* Header - Collapsible */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ 
          width: '100%',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: isExpanded ? '1rem' : '0',
          gap: '0.75rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '4px',
            height: '32px',
            background: 'linear-gradient(to bottom, #10B981, #059669)',
            borderRadius: '4px'
          }}></div>
          <h2 style={{
            fontSize: isMobile ? '1.125rem' : '1.25rem',
            fontWeight: '900',
            color: 'white',
            letterSpacing: '-0.02em',
            margin: 0
          }}>
            🏀 Basketball Bet Performance
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Quick Stats Preview when collapsed */}
          {!isExpanded && (
            <div style={{ 
              fontSize: isMobile ? '0.813rem' : '0.875rem',
              fontWeight: '700',
              color: unitsWon > 0 ? '#10B981' : unitsWon < 0 ? '#EF4444' : '#94a3b8'
            }}>
              {wins}-{losses} • {unitsWon > 0 ? '+' : ''}{unitsWon.toFixed(1)}u
            </div>
          )}
          {isExpanded ? <ChevronUp size={20} color="#94a3b8" /> : <ChevronDown size={20} color="#94a3b8" />}
        </div>
      </button>

      {/* Expanded Stats Grid */}
      {isExpanded && (
        <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
        gap: isMobile ? '0.75rem' : '1rem'
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

      {/* Calendar Toggle Button */}
      {gradedBets > 0 && (
        <div style={{
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(71, 85, 105, 0.3)'
        }}>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            style={{
              width: '100%',
              background: showCalendar 
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)'
                : 'rgba(255,255,255,0.03)',
              border: showCalendar 
                ? '1px solid rgba(16, 185, 129, 0.3)'
                : '1px solid rgba(71, 85, 105, 0.3)',
              borderRadius: '10px',
              padding: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '700',
              color: showCalendar ? '#10B981' : '#94a3b8',
              transition: 'all 0.2s ease'
            }}
          >
            <Calendar size={16} />
            <span>{showCalendar ? 'Hide' : 'Show'} Daily Results</span>
            {showCalendar ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      )}

      {/* Calendar View */}
      {showCalendar && dailyStats && Object.keys(dailyStats).length > 0 && (
        <div style={{
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(71, 85, 105, 0.3)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : 'repeat(7, 1fr)',
            gap: isMobile ? '0.5rem' : '0.625rem'
          }}>
            {Object.entries(dailyStats)
              .sort(([dateA], [dateB]) => dateB.localeCompare(dateA)) // Most recent first
              .slice(0, isMobile ? 8 : 14) // Show last week/2 weeks
              .map(([date, day]) => {
                const units = day.unitsWon;
                const isPositive = units > 0;
                const isNegative = units < 0;
                
                return (
                  <div
                    key={date}
                    style={{
                      background: isPositive 
                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)'
                        : isNegative
                        ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%)'
                        : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isPositive ? 'rgba(16, 185, 129, 0.3)' : isNegative ? 'rgba(239, 68, 68, 0.3)' : 'rgba(71, 85, 105, 0.3)'}`,
                      borderRadius: '8px',
                      padding: isMobile ? '0.5rem 0.25rem' : '0.625rem 0.5rem',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      cursor: 'default'
                    }}
                  >
                    {/* Date */}
                    <div style={{
                      fontSize: isMobile ? '0.625rem' : '0.688rem',
                      fontWeight: '700',
                      color: 'rgba(255,255,255,0.5)',
                      marginBottom: isMobile ? '0.25rem' : '0.375rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.02em'
                    }}>
                      {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    
                    {/* Record */}
                    <div style={{
                      fontSize: isMobile ? '0.75rem' : '0.813rem',
                      fontWeight: '800',
                      color: 'white',
                      marginBottom: isMobile ? '0.125rem' : '0.25rem'
                    }}>
                      {day.wins}-{day.losses}
                    </div>
                    
                    {/* Units */}
                    <div style={{
                      fontSize: isMobile ? '0.813rem' : '0.875rem',
                      fontWeight: '900',
                      color: isPositive ? '#10B981' : isNegative ? '#EF4444' : '#94a3b8',
                      fontFeatureSettings: "'tnum'"
                    }}>
                      {units > 0 ? '+' : ''}{units.toFixed(1)}u
                    </div>
                  </div>
                );
              })}
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
        </>
      )}
    </div>
  );
}


