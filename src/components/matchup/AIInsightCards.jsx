/**
 * AI Insight Cards - Blog-Style Human Analysis
 * Natural, conversational paragraphs (100-150 words each)
 * Swipeable carousel on mobile
 * PREMIUM STYLED - Top section showcase
 */

import { useState, useEffect } from 'react';
import { getMatchupInsightCards } from '../../services/perplexityService';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

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
        homeTeam.name,
        false
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
      <div style={{
        marginBottom: '3rem',
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 50%, rgba(139, 92, 246, 0.15) 100%)',
        backdropFilter: 'blur(20px)',
        border: '2px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(16, 185, 129, 0.2), 0 0 0 1px rgba(16, 185, 129, 0.1)'
      }}>
        {/* Premium glow background */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'pulse 3s ease-in-out infinite'
        }}></div>
        
        <div style={{
          position: 'relative',
          zIndex: 1
        }}>
          <Sparkles size={48} color="#10B981" strokeWidth={2} style={{ marginBottom: '1rem' }} />
          <div style={{
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            color: '#10B981',
            fontSize: '1.25rem',
            fontWeight: '700',
            marginBottom: '0.5rem'
          }}>
            Loading Expert Analysis...
          </div>
          <div style={{
            color: '#94A3B8',
            fontSize: '0.9375rem'
          }}>
            Powered by AI insights and real-time data
          </div>
        </div>
      </div>
    );
  }

  // Show "Waiting" state if no insights
  if (!insights || insights.length === 0) {
    return (
      <div style={{
        marginBottom: '3rem',
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 50%, rgba(139, 92, 246, 0.15) 100%)',
        backdropFilter: 'blur(20px)',
        border: '2px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(16, 185, 129, 0.2), 0 0 0 1px rgba(16, 185, 129, 0.1)'
      }}>
        {/* Premium glow background */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}></div>
        
        <div style={{
          position: 'relative',
          zIndex: 1
        }}>
          <Sparkles size={48} color="#10B981" strokeWidth={2} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <div style={{
            color: '#10B981',
            fontSize: '1.5rem',
            fontWeight: '900',
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em'
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
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '3rem' }}>
      {/* PREMIUM HEADER */}
      <div style={{
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '0.75rem'
        }}>
          <Sparkles size={32} color="#10B981" strokeWidth={2.5} />
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 50%, #8B5CF6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0,
            letterSpacing: '-0.03em'
          }}>
            Expert Analysis
          </h2>
          <Sparkles size={32} color="#8B5CF6" strokeWidth={2.5} />
        </div>
        <p style={{
          fontSize: '0.9375rem',
          color: '#94A3B8',
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          AI-powered insights and professional analysis to inform your betting decisions
        </p>
      </div>

      {/* PREMIUM CAROUSEL CONTAINER */}
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
                  : 'linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%)',
                border: 'none',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                opacity: activeIndex === 0 ? 0.3 : 1,
                boxShadow: activeIndex === 0 ? 'none' : '0 8px 24px rgba(16, 185, 129, 0.4)',
                transition: 'all 0.3s ease'
              }}
            >
              <ChevronLeft size={28} color="#FFFFFF" strokeWidth={3} />
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
                  : 'linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%)',
                border: 'none',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: activeIndex === insights.length - 1 ? 'not-allowed' : 'pointer',
                opacity: activeIndex === insights.length - 1 ? 0.3 : 1,
                boxShadow: activeIndex === insights.length - 1 ? 'none' : '0 8px 24px rgba(16, 185, 129, 0.4)',
                transition: 'all 0.3s ease'
              }}
            >
              <ChevronRight size={28} color="#FFFFFF" strokeWidth={3} />
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
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 50%, rgba(139, 92, 246, 0.15) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '2px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '20px',
                padding: '2.5rem',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(16, 185, 129, 0.2), 0 0 0 1px rgba(16, 185, 129, 0.1)',
                minHeight: '200px'
              }}>
                {/* Premium glow background */}
                <div style={{
                  position: 'absolute',
                  top: '-30%',
                  right: '-10%',
                  width: '300px',
                  height: '300px',
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
                  pointerEvents: 'none'
                }}></div>
                
                {/* Content */}
                <div style={{
                  position: 'relative',
                  zIndex: 1,
                  fontSize: '1.0625rem',
                  lineHeight: 1.8,
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
          gap: '0.75rem',
          marginTop: '2rem'
        }}>
          {insights.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              style={{
                width: activeIndex === index ? '48px' : '12px',
                height: '12px',
                borderRadius: '6px',
                background: activeIndex === index 
                  ? 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)'
                  : 'rgba(148, 163, 184, 0.3)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
                boxShadow: activeIndex === index ? '0 4px 12px rgba(16, 185, 129, 0.4)' : 'none'
              }}
              aria-label={`Go to insight ${index + 1}`}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: translateX(-50%) scale(1);
          }
          50% {
            opacity: 0.7;
            transform: translateX(-50%) scale(1.05);
          }
        }

        @media (max-width: 768px) {
          .ai-insight-cards h2 {
            font-size: 2rem !important;
          }
          .ai-insight-cards-card {
            padding: 1.5rem !important;
            font-size: 0.9375rem !important;
          }
        }
      `}</style>
    </div>
  );
}
