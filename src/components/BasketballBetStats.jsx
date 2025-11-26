/**
 * Basketball Bet Performance Stats Component
 * Premium collapsible section with calendar view
 */

import React, { useState } from 'react';
import { useBasketballBetStats } from '../hooks/useBasketballBetStats';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';

// Premium Stat Box Component
function PremiumStatBox({ value, label, icon, color, isMobile, highlight = false }) {
  return (
    <div style={{
      background: highlight
        ? `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`
        : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${highlight ? `${color}40` : 'rgba(255,255,255,0.1)'}`,
      borderRadius: '16px',
      padding: isMobile ? '1rem' : '1.25rem',
      textAlign: 'center',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'default',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.3), 0 0 40px ${color}30`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      {/* Shimmer effect for highlights */}
      {highlight && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '200%',
          height: '100%',
          background: `linear-gradient(90deg, transparent, ${color}15, transparent)`,
          animation: 'shimmer 3s infinite',
          pointerEvents: 'none'
        }} />
      )}
      
      <div style={{ 
        fontSize: isMobile ? '1.75rem' : '2rem', 
        marginBottom: '0.5rem',
        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))'
      }}>
        {icon}
      </div>
      <div style={{ 
        fontSize: isMobile ? '1.75rem' : '2rem', 
        fontWeight: '900', 
        color: color, 
        marginBottom: '0.5rem',
        fontFeatureSettings: "'tnum'",
        letterSpacing: '-0.03em',
        textShadow: `0 2px 16px ${color}40`
      }}>
        {value}
      </div>
      <div style={{ 
        fontSize: isMobile ? '0.688rem' : '0.75rem', 
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        {label}
      </div>
    </div>
  );
}

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
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.05) 100%)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      borderRadius: '20px',
      padding: isMobile ? '1.125rem' : '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 80px rgba(16, 185, 129, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      overflow: 'hidden',
      position: 'relative'
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            flexShrink: 0
          }}>
            🏀
          </div>
          <div>
            <h2 style={{
              fontSize: isMobile ? '1.125rem' : '1.375rem',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.03em',
              margin: 0,
              lineHeight: 1.2
            }}>
              Basketball Performance
            </h2>
            <div style={{
              fontSize: '0.688rem',
              color: 'rgba(16, 185, 129, 0.7)',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginTop: '0.125rem'
            }}>
              Live Tracking
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Quick Stats Preview when collapsed */}
          {!isExpanded && (
            <div style={{ 
              fontSize: isMobile ? '0.875rem' : '0.938rem',
              fontWeight: '800',
              color: unitsWon > 0 ? '#10B981' : unitsWon < 0 ? '#EF4444' : '#94a3b8',
              background: unitsWon > 0 
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)'
                : unitsWon < 0
                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%)'
                : 'rgba(255,255,255,0.05)',
              border: `1px solid ${unitsWon > 0 ? 'rgba(16, 185, 129, 0.3)' : unitsWon < 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.1)'}`,
              padding: '0.5rem 0.875rem',
              borderRadius: '10px',
              fontFeatureSettings: "'tnum'"
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
        <PremiumStatBox
          value={gradedBets}
          label="Graded Bets"
          icon="🎯"
          color="#10B981"
          isMobile={isMobile}
        />

        {/* Record */}
        <PremiumStatBox
          value={`${wins}-${losses}`}
          label="Record"
          icon="📊"
          color="white"
          isMobile={isMobile}
        />

        {/* Win Rate */}
        <PremiumStatBox
          value={`${winRate.toFixed(1)}%`}
          label="Win Rate"
          icon={winRate >= 60 ? '🔥' : winRate >= 55 ? '⭐' : winRate >= 50 ? '📈' : '📉'}
          color={winRate >= 60 ? '#10B981' :
                 winRate >= 55 ? '#14B8A6' :
                 winRate >= 50 ? '#F59E0B' :
                 '#EF4444'}
          isMobile={isMobile}
        />

        {/* Units Won */}
        <PremiumStatBox
          value={`${unitsWon > 0 ? '+' : ''}${unitsWon.toFixed(2)}u`}
          label="Units"
          icon="💰"
          color={unitsWon > 0 ? '#10B981' : 
                 unitsWon < 0 ? '#EF4444' : 
                 '#94a3b8'}
          isMobile={isMobile}
          highlight={Math.abs(unitsWon) > 3}
        />

        {/* ROI */}
        <PremiumStatBox
          value={`${roi > 0 ? '+' : ''}${roi.toFixed(1)}%`}
          label="ROI"
          icon="💎"
          color={roi > 0 ? '#10B981' : 
                 roi < 0 ? '#EF4444' : 
                 '#94a3b8'}
          isMobile={isMobile}
          highlight={Math.abs(roi) > 20}
        />
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
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(16, 185, 129, 0.2)',
          position: 'relative'
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
                const isSignificant = Math.abs(units) > 1.5; // Highlight big days
                
                return (
                  <div
                    key={date}
                    style={{
                      background: isPositive 
                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(5, 150, 105, 0.1) 100%)'
                        : isNegative
                        ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.18) 0%, rgba(220, 38, 38, 0.1) 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: `1.5px solid ${
                        isSignificant && isPositive ? 'rgba(16, 185, 129, 0.6)' : 
                        isSignificant && isNegative ? 'rgba(239, 68, 68, 0.6)' :
                        isPositive ? 'rgba(16, 185, 129, 0.35)' : 
                        isNegative ? 'rgba(239, 68, 68, 0.35)' : 
                        'rgba(255,255,255,0.12)'
                      }`,
                      borderRadius: '12px',
                      padding: isMobile ? '0.625rem 0.375rem' : '0.75rem 0.5rem',
                      textAlign: 'center',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: isSignificant
                        ? (isPositive
                            ? '0 4px 16px rgba(16, 185, 129, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)'
                            : '0 4px 16px rgba(239, 68, 68, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)')
                        : 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                      e.currentTarget.style.boxShadow = isPositive 
                        ? '0 12px 32px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255,255,255,0.15)'
                        : isNegative
                        ? '0 12px 32px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255,255,255,0.15)'
                        : '0 8px 24px rgba(255,255,255,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = isSignificant
                        ? (isPositive
                            ? '0 4px 16px rgba(16, 185, 129, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)'
                            : '0 4px 16px rgba(239, 68, 68, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)')
                        : 'none';
                    }}
                  >
                    {/* Glow effect for significant wins */}
                    {isSignificant && isPositive && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15), transparent 70%)',
                        pointerEvents: 'none'
                      }} />
                    )}
                    
                    {/* Date */}
                    <div style={{
                      fontSize: isMobile ? '0.625rem' : '0.688rem',
                      fontWeight: '800',
                      color: 'rgba(255,255,255,0.7)',
                      marginBottom: isMobile ? '0.25rem' : '0.375rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}>
                      {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    
                    {/* Record */}
                    <div style={{
                      fontSize: isMobile ? '0.75rem' : '0.813rem',
                      fontWeight: '900',
                      color: 'white',
                      marginBottom: isMobile ? '0.125rem' : '0.25rem',
                      letterSpacing: '-0.01em'
                    }}>
                      {day.wins}-{day.losses}
                    </div>
                    
                    {/* Units */}
                    <div style={{
                      fontSize: isMobile ? '0.813rem' : '0.875rem',
                      fontWeight: '900',
                      color: isPositive ? '#10B981' : isNegative ? '#EF4444' : '#94a3b8',
                      fontFeatureSettings: "'tnum'",
                      textShadow: isPositive 
                        ? '0 2px 12px rgba(16, 185, 129, 0.5)'
                        : isNegative
                        ? '0 2px 12px rgba(239, 68, 68, 0.5)'
                        : 'none',
                      letterSpacing: '-0.02em'
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


