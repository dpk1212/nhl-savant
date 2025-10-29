/**
 * AI Insight Cards - Text-based insights from Perplexity
 * THE ONLY TEXT ON THE PAGE - Everything else is pure visual
 * 3-4 cards with icon, title, and 40-60 word insight
 */

import { useState, useEffect } from 'react';
import { getMatchupInsightCards } from '../../services/perplexityService';
import { RefreshCw, Target, Shield, Zap, Award, TrendingUp, Flame } from 'lucide-react';

const iconMap = {
  '🎯': Target,
  '🥅': Shield,
  '⚡': Zap,
  '🎖️': Award,
  '📊': TrendingUp,
  '🔥': Flame
};

export default function AIInsightCards({ awayTeam, homeTeam }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (awayTeam && homeTeam) {
      loadCards();
    }
  }, [awayTeam?.name, homeTeam?.name]);

  const loadCards = async (forceRefresh = false) => {
    if (forceRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const result = await getMatchupInsightCards(
        awayTeam.name,
        homeTeam.name,
        forceRefresh
      );
      setCards(result);
    } catch (error) {
      console.error('Error loading insight cards:', error);
      setCards([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {[1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              borderRadius: '16px',
              padding: '2rem',
              minHeight: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              color: '#64748B',
              fontSize: '0.875rem'
            }}>
              Loading insights...
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!cards || cards.length === 0) return null;

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Header with refresh */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#F1F5F9',
          background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Expert Analysis
        </h2>

        <button
          onClick={() => loadCards(true)}
          disabled={refreshing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: refreshing 
              ? 'rgba(59, 130, 246, 0.2)'
              : 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            color: '#3B82F6',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: refreshing ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <RefreshCw 
            size={16} 
            style={{
              animation: refreshing ? 'spin 1s linear infinite' : 'none'
            }}
          />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {cards.map((card, index) => {
          const IconComponent = iconMap[card.icon] || Target;
          
          return (
            <div
              key={index}
              style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: `slideInUp 0.5s ease-out ${index * 0.1}s both`,
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px 0 rgba(0, 0, 0, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.37)';
              }}
            >
              {/* Gradient Orb Background */}
              <div style={{
                position: 'absolute',
                top: '-30%',
                right: '-20%',
                width: '150px',
                height: '150px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                borderRadius: '50%',
                opacity: 0.1,
                filter: 'blur(40px)',
                pointerEvents: 'none'
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Icon */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                  borderRadius: '12px',
                  marginBottom: '1rem',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                }}>
                  <IconComponent size={24} color="white" strokeWidth={2.5} />
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: '#F1F5F9',
                  marginBottom: '0.75rem'
                }}>
                  {card.title}
                </h3>

                {/* Insight Text */}
                <p style={{
                  fontSize: '0.9375rem',
                  lineHeight: '1.6',
                  color: '#CBD5E1'
                }}>
                  {card.insight}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

