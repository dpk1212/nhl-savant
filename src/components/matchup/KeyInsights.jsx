/**
 * Key Insights Panel - Quick summary of matchup factors
 * Shows 3-5 most important insights with icons
 */

import { Target, Shield, Zap, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

export default function KeyInsights({ insights }) {
  if (!insights || insights.length === 0) {
    return null;
  }

  const getIcon = (type) => {
    switch (type) {
      case 'offense': return <Target size={20} />;
      case 'defense': return <Shield size={20} />;
      case 'special': return <Zap size={20} />;
      case 'positive': return <TrendingUp size={20} />;
      case 'negative': return <TrendingDown size={20} />;
      default: return <AlertCircle size={20} />;
    }
  };

  const getColorClass = (type) => {
    switch (type) {
      case 'offense':
      case 'positive':
        return '#10B981';
      case 'defense':
        return '#3B82F6';
      case 'special':
        return '#F59E0B';
      case 'negative':
        return '#EF4444';
      default:
        return '#94A3B8';
    }
  };

  return (
    <div className="elevated-card" style={{
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
      backdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      borderRadius: '16px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#F1F5F9',
        marginBottom: '0.5rem'
      }}>
        Key Matchup Factors
      </h2>
      <p style={{
        fontSize: '0.875rem',
        color: '#94A3B8',
        marginBottom: '1.5rem'
      }}>
        The most important insights from our advanced analytics
      </p>

      <div style={{
        display: 'grid',
        gap: '1rem'
      }}>
        {insights.map((insight, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              padding: '1rem',
              background: 'rgba(15, 23, 42, 0.3)',
              borderLeft: `3px solid ${getColorClass(insight.type)}`,
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(15, 23, 42, 0.5)';
              e.currentTarget.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(15, 23, 42, 0.3)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <div style={{
              flexShrink: 0,
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `${getColorClass(insight.type)}20`,
              borderRadius: '8px',
              color: getColorClass(insight.type)
            }}>
              {getIcon(insight.type)}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#F1F5F9',
                marginBottom: '0.25rem'
              }}>
                {insight.title}
              </div>
              <div style={{
                fontSize: '0.8125rem',
                color: '#94A3B8',
                lineHeight: '1.5'
              }}>
                {insight.description}
              </div>
              {insight.stat && (
                <div style={{
                  marginTop: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: getColorClass(insight.type),
                  fontFamily: 'monospace'
                }}>
                  {insight.stat}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

