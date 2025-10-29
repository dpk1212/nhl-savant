/**
 * AI Insight Cards - Expert Analysis
 * Matches CollapsibleGameCard branding: elevated-card, subtle gradients, clean design
 * NO rainbow gradients, NO sparkles, NO glow effects
 */

import { useState, useEffect } from 'react';
import { getMatchupInsightCards } from '../../services/perplexityService';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AIInsightCards({ awayTeam, homeTeam }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    if (awayTeam && homeTeam) {
      loadInsights();
    }
  }, [awayTeam?.name, homeTeam?.name]);

  const loadInsights = async () => {
    setLoading(true);

    try {
      const result = await getMatchupInsightCards(
        awayTeam.name,
        homeTeam.name
      );
      setInsights(result);
      setActiveIndex(0);
    } catch (error) {
      console.error('Error loading insights:', error);
      setInsights([]);
    } finally {
      setLoading(false);
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
      <div className="elevated-card" style={{
        marginBottom: '2rem',
        padding: '2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.15)',
        borderRadius: '10px'
      }}>
        <div style={{
          color: '#64748B',
          fontSize: '1rem'
        }}>
          Loading expert analysis...
        </div>
      </div>
    );
  }

  // Show "Waiting" state if no insights
  if (!insights || insights.length === 0) {
    return (
      <div className="elevated-card" style={{
        marginBottom: '2rem',
        padding: '2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.15)',
        borderRadius: '10px'
      }}>
        <div style={{
          color: '#F1F5F9',
          fontSize: '1.25rem',
          fontWeight: '700',
          marginBottom: '0.75rem'
        }}>
          Waiting for Expert Articles
        </div>
        <div style={{
          color: '#94A3B8',
          fontSize: '0.9375rem',
          maxWidth: '500px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          Expert analysis articles are generated daily before games. Check back closer to game time for professional insights.
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Header - Brand Matched */}
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#F1F5F9',
          margin: 0,
          letterSpacing: '-0.01em'
        }}>
          Expert Analysis
        </h2>
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
                background: activeIndex === 0 
                  ? 'rgba(71, 85, 105, 0.5)' 
                  : 'rgba(16, 185, 129, 0.8)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                opacity: activeIndex === 0 ? 0.3 : 1,
                transition: 'all 0.2s ease'
              }}
              className="desktop-only-arrow"
            >
              <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
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
                background: activeIndex === insights.length - 1 
                  ? 'rgba(71, 85, 105, 0.5)' 
                  : 'rgba(16, 185, 129, 0.8)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: activeIndex === insights.length - 1 ? 'not-allowed' : 'pointer',
                opacity: activeIndex === insights.length - 1 ? 0.3 : 1,
                transition: 'all 0.2s ease'
              }}
              className="desktop-only-arrow"
            >
              <ChevronRight size={24} color="#FFFFFF" strokeWidth={2.5} />
            </button>
          </>
        )}

        {/* Cards Container - Swipeable */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            display: 'flex',
            transition: 'transform 0.3s ease',
            transform: `translateX(-${activeIndex * 100}%)`,
            touchAction: 'pan-y'
          }}
        >
          {insights.map((insight, index) => (
            <div
              key={index}
              style={{
                minWidth: '100%',
                padding: '0 0.5rem'
              }}
            >
              <div className="elevated-card" style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                padding: '1.5rem',
                minHeight: '150px',
                transition: 'all 0.2s ease'
              }}>
                <div style={{
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: '#E2E8F0',
                  fontWeight: '400'
                }}>
                  {insight.analysis}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Dots */}
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
                width: activeIndex === index ? '32px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: activeIndex === index 
                  ? 'rgba(16, 185, 129, 0.8)'
                  : 'rgba(148, 163, 184, 0.3)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0
              }}
              aria-label={`Go to insight ${index + 1}`}
            />
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-only-arrow {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
