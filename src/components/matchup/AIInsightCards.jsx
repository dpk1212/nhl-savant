/**
 * Expert Insight Cards - Premium Analysis
 * Redesigned for shareability, visual impact, and engagement
 * Features: Viral hooks, structured sections, share functionality
 */

import { useState, useEffect } from 'react';
import { getMatchupInsightCards } from '../../services/perplexityService';
import { ChevronLeft, ChevronRight, Share2, Flame, Lightbulb, TrendingUp } from 'lucide-react';

export default function AIInsightCards({ awayTeam, homeTeam, prediction }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (awayTeam && homeTeam) {
      loadInsights();
    }
  }, [awayTeam?.name, homeTeam?.name, prediction]);

  const loadInsights = async () => {
    setLoading(true);

    try {
      // Try to get AI-generated content from Firebase first
      const result = await getMatchupInsightCards(
        awayTeam.name,
        homeTeam.name
      );
      
      // If no AI content, generate insights from our model predictions
      if (!result || result.length === 0) {
        if (prediction) {
          const generatedInsights = generateInsightsFromPrediction(awayTeam.name, homeTeam.name, prediction);
          setInsights(generatedInsights);
        } else {
          setInsights([]);
        }
      } else {
        setInsights(result);
      }
      setActiveIndex(0);
    } catch (error) {
      console.error('Error loading insights:', error);
      // Fall back to prediction-based insights
      if (prediction) {
        const generatedInsights = generateInsightsFromPrediction(awayTeam.name, homeTeam.name, prediction);
        setInsights(generatedInsights);
      } else {
        setInsights([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Generate insights from our model predictions
  const generateInsightsFromPrediction = (away, home, pred) => {
    const favorite = pred.homeWinProb > pred.awayWinProb ? home : away;
    const favoriteProb = Math.max(pred.homeWinProb, pred.awayWinProb);
    const underdog = favorite === home ? away : home;
    const underdogProb = Math.min(pred.homeWinProb, pred.awayWinProb);
    const predictedTotal = pred.awayScore + pred.homeScore;
    
    const insights = [];
    
    // Insight 1: Model Pick
    insights.push({
      hook: `${favorite} ${favoriteProb >= 60 ? 'Heavy Favorite' : 'Slight Edge'} at ${favoriteProb.toFixed(0)}%`,
      headline: 'Model Prediction',
      analysis: `Our advanced analytics give ${favorite} a ${favoriteProb.toFixed(1)}% chance to win. Projected score: ${away} ${pred.awayScore.toFixed(1)} - ${home} ${pred.homeScore.toFixed(1)}. ${favoriteProb >= 60 ? `Strong confidence in ${favorite} based on recent performance metrics.` : `Close matchup with ${underdog} having a real chance at ${underdogProb.toFixed(1)}%.`}`,
      data: `Win Prob: ${favoriteProb.toFixed(1)}% • Total: ${predictedTotal.toFixed(1)} goals`
    });
    
    // Insight 2: Scoring Outlook
    const totalDescription = predictedTotal >= 6.5 ? 'High-Scoring Affair' : predictedTotal <= 5.5 ? 'Defensive Battle' : 'Moderate Scoring';
    insights.push({
      hook: `Expect a ${totalDescription}`,
      headline: 'Scoring Projection',
      analysis: `Model projects ${predictedTotal.toFixed(1)} total goals. ${away} expected to score ${pred.awayScore.toFixed(1)} while ${home} projects at ${pred.homeScore.toFixed(1)}. ${predictedTotal >= 6.5 ? 'Both offenses showing strong metrics lately.' : predictedTotal <= 5.5 ? 'Goaltending and defense should dominate this matchup.' : 'Balanced offensive and defensive matchup expected.'}`,
      data: `Projected Total: ${predictedTotal.toFixed(1)} goals`
    });
    
    // Insight 3: Value Angle
    insights.push({
      hook: `${underdog} Underdog Value?`,
      headline: 'Betting Angle',
      analysis: `While ${favorite} is favored, ${underdog} at ${underdogProb.toFixed(1)}% creates potential value if odds are favorable. ${Math.abs(favoriteProb - underdogProb) < 15 ? 'This is a closer game than many expect.' : `${favorite} has clear advantages but upsets happen.`} Consider both ML and total plays based on current market odds.`,
      data: `${underdog}: ${underdogProb.toFixed(1)}% • Spread potential`
    });
    
    return insights;
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

  const handleShare = (insight) => {
    const shareText = `${insight.hook}\n\n${insight.headline}\n\n${insight.analysis}\n\n💡 ${insight.bettingAngle}\n\nAnalysis by NHL Savant`;
    
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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
      {/* Section Header */}
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.5rem',
          letterSpacing: '-0.02em'
        }}>
          Expert Analysis
        </h2>
        <p style={{
          fontSize: '0.9375rem',
          color: '#94A3B8',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Bold takes and hidden edges from our analytics team
        </p>
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
                  : 'rgba(16, 185, 129, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                opacity: activeIndex === 0 ? 0.3 : 1,
                transition: 'all 0.2s ease',
                boxShadow: activeIndex === 0 ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)'
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
                  : 'rgba(16, 185, 129, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: activeIndex === insights.length - 1 ? 'not-allowed' : 'pointer',
                opacity: activeIndex === insights.length - 1 ? 0.3 : 1,
                transition: 'all 0.2s ease',
                boxShadow: activeIndex === insights.length - 1 ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)'
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
              {/* Premium Insight Card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '2px solid',
                borderImage: 'linear-gradient(135deg, rgba(16, 185, 129, 0.4), rgba(59, 130, 246, 0.4)) 1',
                borderRadius: '16px',
                padding: '2rem',
                minHeight: '400px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Glowing accent */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #10B981, #3B82F6, #8B5CF6)',
                  opacity: 0.8
                }} />

                {/* HOT TAKE Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(245, 158, 11, 0.2))',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '20px',
                  padding: '0.5rem 1rem',
                  marginBottom: '1.5rem'
                }}>
                  <Flame size={16} color="#EF4444" />
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    color: '#EF4444',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Hot Take
                  </span>
                </div>

                {/* Hook - The Attention Grabber */}
                {insight.hook && (
                  <div style={{
                    fontSize: '1.375rem',
                    fontWeight: '900',
                    color: '#F1F5F9',
                    lineHeight: 1.3,
                    marginBottom: '1.5rem',
                    paddingBottom: '1.5rem',
                    borderBottom: '2px solid rgba(16, 185, 129, 0.2)'
                  }}>
                    "{insight.hook}"
                  </div>
                )}

                {/* Headline */}
                {insight.headline && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1rem'
                  }}>
                    <TrendingUp size={20} color="#10B981" />
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      color: '#10B981',
                      margin: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '0.02em'
                    }}>
                      {insight.headline}
                    </h3>
                  </div>
                )}

                {/* Analysis Paragraph */}
                {insight.analysis && (
                  <div style={{
                    fontSize: '1rem',
                    lineHeight: 1.8,
                    color: '#E2E8F0',
                    marginBottom: '1.5rem',
                    paddingBottom: '1.5rem',
                    borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
                  }}>
                    {insight.analysis}
                  </div>
                )}

                {/* The Edge Section */}
                {insight.bettingAngle && (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.75rem'
                    }}>
                      <Lightbulb size={18} color="#10B981" />
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: '800',
                        color: '#10B981',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        The Edge
                      </span>
                    </div>
                    <div style={{
                      fontSize: '0.9375rem',
                      lineHeight: 1.6,
                      color: '#F1F5F9',
                      fontWeight: '500'
                    }}>
                      {insight.bettingAngle}
                    </div>
                  </div>
                )}

                {/* Share Button */}
                <button
                  onClick={() => handleShare(insight)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.15)',
                    border: copied ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '0.75rem 1.25rem',
                    color: copied ? '#10B981' : '#3B82F6',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    width: '100%',
                    justifyContent: 'center'
                  }}
                >
                  <Share2 size={16} />
                  {copied ? 'Copied to Clipboard!' : 'Share This Analysis'}
                </button>
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
                  ? 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)'
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
