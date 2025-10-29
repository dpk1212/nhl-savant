/**
 * AI Insight Cards - Blog-Style Human Analysis
 * Natural, conversational paragraphs (100-150 words each)
 * Swipeable carousel on mobile
 */

import { useState, useEffect } from 'react';
import { getMatchupInsightCards } from '../../services/perplexityService';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AIInsightCards({ awayTeam, homeTeam }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    if (awayTeam && homeTeam) {
      loadInsights();
    }
  }, [awayTeam?.name, homeTeam?.name]);

  const loadInsights = async (forceRefresh = false) => {
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
      setInsights(result);
      setActiveIndex(0);
    } catch (error) {
      console.error('Error loading insights:', error);
      setInsights([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe && activeIndex < insights.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
    
    if (isRightSwipe && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  const goToNext = () => {
    if (activeIndex < insights.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  if (loading) {
    return (
      <div style={{
        marginBottom: '2rem',
        padding: '3rem 2rem',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        borderRadius: '20px',
        textAlign: 'center'
      }}>
        <div style={{
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          color: '#64748B',
          fontSize: '1rem'
        }}>
          Loading expert analysis...
        </div>
      </div>
    );
  }

  if (!insights || insights.length === 0) return null;

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{
          fontSize: '1.875rem',
          fontWeight: '700',
          color: '#F1F5F9',
          background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          Expert Analysis
        </h2>

        <button
          onClick={() => loadInsights(true)}
          disabled={refreshing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            background: refreshing 
              ? 'rgba(59, 130, 246, 0.2)'
              : 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '10px',
            color: '#3B82F6',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: refreshing ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (!refreshing) {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
            }
          }}
          onMouseLeave={(e) => {
            if (!refreshing) {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
            }
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

      {/* Carousel Container */}
      <div style={{ position: 'relative' }}>
        {/* Navigation Arrows - Desktop */}
        {insights.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              disabled={activeIndex === 0}
              style={{
                position: 'absolute',
                left: '-20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                background: activeIndex === 0 ? 'rgba(71, 85, 105, 0.5)' : 'rgba(59, 130, 246, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                opacity: activeIndex === 0 ? 0.3 : 1,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              <ChevronLeft size={24} color="white" />
            </button>

            <button
              onClick={goToNext}
              disabled={activeIndex === insights.length - 1}
              style={{
                position: 'absolute',
                right: '-20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                background: activeIndex === insights.length - 1 ? 'rgba(71, 85, 105, 0.5)' : 'rgba(59, 130, 246, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: activeIndex === insights.length - 1 ? 'not-allowed' : 'pointer',
                opacity: activeIndex === insights.length - 1 ? 0.3 : 1,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              <ChevronRight size={24} color="white" />
            </button>
          </>
        )}

        {/* Carousel Slider */}
        <div
          style={{
            overflow: 'hidden',
            borderRadius: '20px'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            style={{
              display: 'flex',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: `translateX(-${activeIndex * 100}%)`
            }}
          >
            {insights.map((insight, index) => (
              <div
                key={index}
                style={{
                  minWidth: '100%',
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                  padding: '2.5rem',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Subtle gradient orb */}
                <div style={{
                  position: 'absolute',
                  top: '-20%',
                  right: '-10%',
                  width: '200px',
                  height: '200px',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                  borderRadius: '50%',
                  opacity: 0.05,
                  filter: 'blur(60px)',
                  pointerEvents: 'none'
                }} />

                {/* Blog-style paragraph */}
                <p style={{
                  position: 'relative',
                  zIndex: 1,
                  fontSize: '1.0625rem',
                  lineHeight: '1.75',
                  color: '#E2E8F0',
                  margin: 0,
                  fontWeight: '400',
                  letterSpacing: '0.01em'
                }}>
                  {insight.analysis}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        {insights.length > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '1.5rem'
          }}>
            {insights.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                style={{
                  width: index === activeIndex ? '32px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  border: 'none',
                  background: index === activeIndex 
                    ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                    : 'rgba(148, 163, 184, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0
                }}
                aria-label={`Go to insight ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .expert-analysis-header h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
