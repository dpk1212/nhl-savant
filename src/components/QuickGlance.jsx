import React from 'react';
import { TrendingUp, TrendingDown, Target, Zap, AlertCircle } from 'lucide-react';

// Get rating for EV percentage
const getRating = (evPercent) => {
  if (evPercent >= 10) return { grade: 'A+', tier: 'ELITE', color: '#10B981' };
  if (evPercent >= 7) return { grade: 'A', tier: 'EXCELLENT', color: '#059669' };
  if (evPercent >= 5) return { grade: 'B+', tier: 'STRONG', color: '#0EA5E9' };
  if (evPercent >= 3) return { grade: 'B', tier: 'GOOD', color: '#8B5CF6' };
  return { grade: 'C', tier: 'VALUE', color: '#64748B' };
};

export const QuickGlance = ({ game, bestEdge, isMobile = false }) => {
  if (!bestEdge) return null;
  
  const rating = getRating(bestEdge.evPercent);
  const isMoneyline = bestEdge.market === 'moneyline' || bestEdge.market === 'MONEYLINE';
  
  // Calculate implied probability from odds
  const calculateImpliedProb = (odds) => {
    if (odds > 0) {
      return 100 / (odds + 100);
    } else {
      return Math.abs(odds) / (Math.abs(odds) + 100);
    }
  };
  
  const impliedProb = calculateImpliedProb(bestEdge.odds);
  
  return (
    <div className="hover-glow" style={{
      background: `linear-gradient(135deg, ${rating.color}10 0%, ${rating.color}05 100%)`,
      border: `1px solid ${rating.color}40`,
      borderRadius: '12px',
      padding: isMobile ? '1.25rem' : '1.5rem',
      marginBottom: '1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Shimmer for elite opportunities */}
      {rating.tier === 'ELITE' && (
        <div className="shimmer-overlay" style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: `linear-gradient(90deg, transparent, ${rating.color}20, transparent)`,
          animation: 'shimmer 3s infinite'
        }} />
      )}
      
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} color={rating.color} />
          <span style={{ 
            fontSize: '0.75rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: rating.color
          }}>
            Quick Glance • Best Opportunity
          </span>
        </div>
        
        {/* Rating Badge */}
        <div style={{
          padding: '0.375rem 0.875rem',
          background: rating.color,
          color: 'white',
          borderRadius: '6px',
          fontSize: '0.875rem',
          fontWeight: '900',
          letterSpacing: '-0.01em',
          boxShadow: `0 4px 12px ${rating.color}40`
        }}>
          {rating.grade} • {rating.tier}
        </div>
      </div>
      
      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
        gap: isMobile ? '1rem' : '1.5rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Market Type */}
        <div>
          <div style={{ 
            fontSize: '0.688rem',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: '700',
            marginBottom: '0.5rem'
          }}>
            Market
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            fontSize: '1rem',
            fontWeight: '700',
            color: 'var(--color-text-primary)'
          }}>
            {isMoneyline ? <Zap size={16} color="#3B82F6" /> : <Target size={16} color="#A78BFA" />}
            <span>{isMoneyline ? 'Moneyline' : 'Total'}</span>
          </div>
        </div>
        
        {/* Pick */}
        <div>
          <div style={{ 
            fontSize: '0.688rem',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: '700',
            marginBottom: '0.5rem'
          }}>
            Recommendation
          </div>
          <div style={{ 
            fontSize: '1.125rem',
            fontWeight: '800',
            color: rating.color,
            letterSpacing: '-0.02em'
          }}>
            {bestEdge.pick}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            fontWeight: '500',
            marginTop: '0.25rem'
          }}>
            {bestEdge.odds > 0 ? '+' : ''}{bestEdge.odds}
          </div>
        </div>
        
        {/* Expected Value */}
        <div>
          <div style={{ 
            fontSize: '0.688rem',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: '700',
            marginBottom: '0.5rem'
          }}>
            Expected Value
          </div>
          <div style={{ 
            fontSize: '1.625rem',
            fontWeight: '900',
            color: rating.color,
            letterSpacing: '-0.03em',
            display: 'flex',
            alignItems: 'baseline',
            gap: '0.25rem'
          }}>
            <span>+{bestEdge.evPercent.toFixed(1)}%</span>
            {bestEdge.evPercent > 10 && <TrendingUp size={20} color={rating.color} />}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            fontWeight: '500',
            marginTop: '0.25rem'
          }}>
            {(impliedProb * 100).toFixed(1)}% implied → {(bestEdge.modelProb * 100).toFixed(1)}% model
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickGlance;

