import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, TrendingUp, Lock, ArrowRight } from 'lucide-react';
import { 
  getPerformanceStats,
  getStartDate, 
  calculateDollarGrowth,
  getWeeksSinceStart 
} from '../../utils/performanceStats';
import DiscountLottery from '../DiscountLottery';

const WelcomePopupModal = ({ isOpen, onClose, todaysGames, isMobile }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roiCounter, setRoiCounter] = useState(0);
  const [discountCode, setDiscountCode] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Fetch ALL performance stats (same as Performance Dashboard)
      getPerformanceStats().then(perfStats => {
        console.log('📊 Welcome Popup - Performance Stats:', perfStats);
        setStats(perfStats);
        setLoading(false);
        
        // Animate Moneyline ROI counter
        if (perfStats?.moneylineROI) {
          let start = 0;
          const end = Math.round(perfStats.moneylineROI);
          const duration = 1000;
          const increment = end / (duration / 16);
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setRoiCounter(end);
              clearInterval(timer);
            } else {
              setRoiCounter(Math.floor(start));
            }
          }, 16);
          
          return () => clearInterval(timer);
        }
      });
    } else {
      setRoiCounter(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUnlock = () => {
    onClose();
    navigate('/pricing');
  };

  const handleViewPerformance = () => {
    onClose();
    navigate('/performance');
  };

  // Calculate dynamic stats (use Moneyline ROI, same as Performance page)
  const startDate = getStartDate();
  const weeks = getWeeksSinceStart();
  const roi = stats?.moneylineROI || 19.6; // Fallback to last known ML ROI
  const profit = stats?.totalProfit || 9.79;
  const betCount = stats?.moneylineBets || 120;
  const dollarGrowth = calculateDollarGrowth(1000, roi);
  const roiDisplay = `${roi.toFixed(1)}%`;

  // Get picks EXACTLY like TodaysGames does - filter games with edges >= 3%
  const picksToday = (todaysGames || []).filter(game => {
    if (!game.edges) return false;
    
    // Check moneyline edges
    if (game.edges.moneyline?.away?.evPercent >= 3 || game.edges.moneyline?.home?.evPercent >= 3) {
      return true;
    }
    
    // Check total edges
    if (game.edges.total?.over?.evPercent >= 3 || game.edges.total?.under?.evPercent >= 3) {
      return true;
    }
    
    return false;
  });

  // Calculate best edge for each game (for display in locked cards)
  const gamesWithBestEdge = picksToday.map(game => {
    let bestEV = 0;
    let bestEdge = null;
    
    // Check moneyline away
    if (game.edges?.moneyline?.away?.evPercent > bestEV) {
      bestEV = game.edges.moneyline.away.evPercent;
      bestEdge = {
        evPercent: game.edges.moneyline.away.evPercent,
        odds: game.edges.moneyline.away.odds,
        pick: `${game.awayTeam} ML`,
        market: 'MONEYLINE'
      };
    }
    
    // Check moneyline home
    if (game.edges?.moneyline?.home?.evPercent > bestEV) {
      bestEV = game.edges.moneyline.home.evPercent;
      bestEdge = {
        evPercent: game.edges.moneyline.home.evPercent,
        odds: game.edges.moneyline.home.odds,
        pick: `${game.homeTeam} ML`,
        market: 'MONEYLINE'
      };
    }
    
    // Check total over
    if (game.edges?.total?.over?.evPercent > bestEV) {
      bestEV = game.edges.total.over.evPercent;
      const line = game.edges.total.over.line || 'N/A';
      bestEdge = {
        evPercent: game.edges.total.over.evPercent,
        odds: game.edges.total.over.odds,
        pick: `OVER ${line}`,
        market: 'TOTAL'
      };
    }
    
    // Check total under
    if (game.edges?.total?.under?.evPercent > bestEV) {
      bestEV = game.edges.total.under.evPercent;
      const line = game.edges.total.under.line || 'N/A';
      bestEdge = {
        evPercent: game.edges.total.under.evPercent,
        odds: game.edges.total.under.odds,
        pick: `UNDER ${line}`,
        market: 'TOTAL'
      };
    }
    
    return { ...game, bestEdge };
  });

  // Helper function to get rating grade
  const getRatingGrade = (evPercent) => {
    if (evPercent >= 10) return 'A+';
    if (evPercent >= 7) return 'A';
    if (evPercent >= 5) return 'B+';
    return 'B';
  };

  // Sort games by EV (highest first) - prioritize A+, A, B+, B in that order
  const sortedGames = [...gamesWithBestEdge].sort((a, b) => {
    const evA = a.bestEdge?.evPercent || 0;
    const evB = b.bestEdge?.evPercent || 0;
    return evB - evA; // Descending order (highest EV first)
  });

  // Count A+ plays (EV >= 10%)
  const aPlusPlays = sortedGames.filter(g => g.bestEdge?.evPercent >= 10);
  const otherPlays = sortedGames.filter(g => g.bestEdge?.evPercent < 10);

  // Calculate total betting value estimate (assuming $100 units)
  const totalBettingValue = sortedGames.reduce((sum, game) => {
    return sum + (game.bestEdge?.evPercent || 0);
  }, 0).toFixed(0);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: isMobile ? '0.75rem' : '1.5rem',
        animation: 'backdropFadeIn 0.3s ease-out',
        overflow: 'auto'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1419 100%)',
          border: '2px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '16px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: isMobile ? '1.25rem 1rem' : '2rem 1.75rem',
          position: 'relative',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(212, 175, 55, 0.2)',
          color: '#ffffff',
          animation: 'modalSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both'
        }}
      >
        {/* Grid overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(212, 175, 55, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 175, 55, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
          opacity: 0.5,
          pointerEvents: 'none'
        }} />

        {/* Scanline */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.6), transparent)',
          animation: 'scanline 4s linear infinite',
          opacity: 0.5
        }} />

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: isMobile ? '1rem' : '1.5rem',
            right: isMobile ? '1rem' : '1.5rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(212, 175, 55, 0.6)',
            transition: 'all 0.3s ease',
            zIndex: 3,
            padding: '0.5rem',
            minWidth: '44px',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#D4AF37';
            e.currentTarget.style.transform = 'rotate(90deg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(212, 175, 55, 0.6)';
            e.currentTarget.style.transform = 'rotate(0deg)';
          }}
        >
          <X size={24} strokeWidth={2.5} />
        </button>

        {/* HERO: ROI - Proof First (CONDENSED) */}
        <div style={{
          textAlign: 'center',
          marginBottom: isMobile ? '1.25rem' : '1.75rem',
          animation: 'fadeInUp 0.5s ease-out 0.3s both',
          position: 'relative',
          zIndex: 1
        }}>
          <h1 style={{
            fontSize: isMobile ? '1.75rem' : '2.25rem',
            fontWeight: '800',
            color: '#10B981',
            margin: 0,
            marginBottom: isMobile ? '0.5rem' : '0.75rem',
            textShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
            letterSpacing: '-0.03em',
            lineHeight: '1.1'
          }}>
            {roiCounter}% ROI SINCE {startDate.toUpperCase()}
          </h1>
          
          <p style={{
            fontSize: isMobile ? '1rem' : '1.25rem',
            color: '#ffffff',
            fontWeight: '700',
            marginBottom: '0.25rem',
            lineHeight: '1.3'
          }}>
            {dollarGrowth} in {weeks} weeks
          </p>
          
          <button
            onClick={handleViewPerformance}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: isMobile ? '0.813rem' : '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '0.25rem',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
          >
            100% tracked publicly →
          </button>
        </div>

        {/* A+ PERFORMANCE BADGE */}
        <div style={{
          textAlign: 'center',
          marginBottom: isMobile ? '1.25rem' : '1.75rem',
          animation: 'fadeInUp 0.5s ease-out 0.4s both',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            padding: isMobile ? '0.625rem 1rem' : '0.75rem 1.25rem'
          }}>
            <span style={{ fontSize: isMobile ? '1rem' : '1.125rem' }}>🏆</span>
            <span style={{
              fontSize: isMobile ? '0.813rem' : '0.875rem',
              fontWeight: '700',
              color: '#10B981'
            }}>
              A+ PLAYS: +14.3% ROI
            </span>
            <span style={{
              fontSize: isMobile ? '0.75rem' : '0.813rem',
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: '500'
            }}>
              (69 bets tracked)
            </span>
          </div>
        </div>

        {/* TONIGHT'S PICKS - Teaser with cards */}
        <div style={{
          marginBottom: isMobile ? '1.25rem' : '1.75rem',
          animation: 'fadeInUp 0.5s ease-out 0.5s both',
          position: 'relative',
          zIndex: 1
        }}>
          <h3 style={{
            fontSize: isMobile ? '1rem' : '1.125rem',
            fontWeight: '700',
            color: '#D4AF37',
            marginTop: 0,
            marginBottom: isMobile ? '0.5rem' : '0.625rem',
            textAlign: 'center',
            textShadow: '0 2px 8px rgba(212, 175, 55, 0.3)',
            letterSpacing: '0.01em'
          }}>
            {aPlusPlays.length > 0 ? (
              <>
                TODAY: {aPlusPlays.length} A+ {aPlusPlays.length === 1 ? 'PLAY' : 'PLAYS'}
                {otherPlays.length > 0 && <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}> + {otherPlays.length} MORE</span>}
              </>
            ) : (
              <>TODAY: {sortedGames.length} {sortedGames.length === 1 ? 'PLAY' : 'PLAYS'} IDENTIFIED</>
            )}
          </h3>

          {sortedGames.length > 0 && (
            <p style={{
              fontSize: isMobile ? '0.75rem' : '0.813rem',
              color: 'rgba(255, 255, 255, 0.6)',
              textAlign: 'center',
              marginTop: 0,
              marginBottom: isMobile ? '0.75rem' : '1rem',
              fontWeight: '500'
            }}>
              Est. betting value: ${totalBettingValue} on $100 units
            </p>
          )}

          {sortedGames.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '0.75rem' : '1rem' }}>
              {sortedGames.slice(0, 2).map((game, index) => {
                  const bestEdge = game.bestEdge;
                  
                  return (
                    <div
                      key={index}
                      style={{
                        background: 'linear-gradient(135deg, #1a2a3a 0%, #101a20 100%)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '10px',
                      padding: isMobile ? '0.875rem' : '1rem',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Top row: Teams and Time */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      marginBottom: '0.625rem'
                      }}>
                        <span style={{
                        fontSize: isMobile ? '0.813rem' : '0.875rem',
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontWeight: '600'
                        }}>
                          {game.awayTeam} @ {game.homeTeam}
                        </span>
                        <span style={{
                        fontSize: isMobile ? '0.75rem' : '0.813rem',
                          color: 'rgba(255, 255, 255, 0.6)'
                        }}>
                          {game.gameTime}
                        </span>
                      </div>

                      {/* Bottom row: Pick and EV */}
                      <div style={{
                        display: 'flex',
                      gap: '0.625rem',
                        alignItems: 'center'
                      }}>
                        {/* Pick Box */}
                        <div style={{
                          background: 'rgba(139, 92, 246, 0.15)',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          borderRadius: '8px',
                        padding: isMobile ? '0.5rem 0.625rem' : '0.5rem 0.75rem',
                          flex: 1
                        }}>
                          <div style={{
                          fontSize: isMobile ? '0.688rem' : '0.75rem',
                            color: 'rgba(255, 255, 255, 0.6)',
                            marginBottom: '0.25rem'
                          }}>
                            {bestEdge.market}
                          </div>
                          <div style={{
                          fontSize: isMobile ? '0.875rem' : '0.938rem',
                            color: '#ffffff',
                            fontWeight: '700'
                          }}>
                            {bestEdge.pick} {bestEdge.odds > 0 ? '+' : ''}{bestEdge.odds}
                          </div>
                        </div>
                        
                        {/* EV Box */}
                        <div style={{
                          background: bestEdge.evPercent >= 8 ? 'rgba(16, 185, 129, 0.15)' : 
                                      bestEdge.evPercent >= 5 ? 'rgba(0, 217, 255, 0.15)' : 
                                      'rgba(139, 92, 246, 0.15)',
                          border: `1px solid ${bestEdge.evPercent >= 8 ? '#10B981' : 
                                                bestEdge.evPercent >= 5 ? '#00d9ff' : 
                                                '#8B5CF6'}`,
                          borderRadius: '8px',
                        padding: isMobile ? '0.5rem 0.625rem' : '0.5rem 0.75rem',
                          textAlign: 'center',
                        minWidth: isMobile ? '70px' : '80px'
                        }}>
                          <div style={{
                          fontSize: isMobile ? '0.938rem' : '1rem',
                            color: bestEdge.evPercent >= 8 ? '#10B981' : 
                                   bestEdge.evPercent >= 5 ? '#00d9ff' : 
                                   '#8B5CF6',
                            fontWeight: '800',
                            whiteSpace: 'nowrap'
                          }}>
                            +{bestEdge.evPercent.toFixed(1)}%
                          </div>
                          <div style={{
                          fontSize: isMobile ? '0.625rem' : '0.688rem',
                            color: 'rgba(255, 255, 255, 0.6)',
                            marginTop: '0.125rem'
                          }}>
                            EV
                          </div>
                        </div>
                      </div>

                      {/* Lock Overlay with Grade */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.85)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: isMobile ? '0.375rem' : '0.5rem',
                        borderRadius: '10px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.625rem'
                        }}>
                          <Lock size={isMobile ? 18 : 22} color="#D4AF37" strokeWidth={2.5} style={{
                            filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.6))',
                            animation: 'lockPulse 2s ease-in-out infinite'
                          }} />
                          <span style={{
                            color: '#D4AF37',
                            fontSize: isMobile ? '0.938rem' : '1.063rem',
                            fontWeight: '800',
                            letterSpacing: '0.05em',
                            textShadow: '0 2px 8px rgba(212, 175, 55, 0.5)'
                          }}>
                            {getRatingGrade(bestEdge.evPercent)} PLAY LOCKED
                          </span>
                        </div>
                        <div style={{
                          fontSize: isMobile ? '0.875rem' : '0.938rem',
                          fontWeight: '700',
                          color: bestEdge.evPercent >= 10 ? '#10B981' : 
                                 bestEdge.evPercent >= 7 ? '#3B82F6' : 
                                 bestEdge.evPercent >= 5 ? '#8B5CF6' : '#D4AF37',
                          textShadow: '0 2px 6px rgba(0, 0, 0, 0.5)'
                        }}>
                          +{bestEdge.evPercent.toFixed(1)}% EV
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
          ) : null}
        </div>

        {/* MODEL DIFFERENTIATION - NEW SECTION */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.03) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: '10px',
          padding: isMobile ? '1rem' : '1.25rem',
          marginBottom: isMobile ? '1.25rem' : '1.75rem',
          animation: 'fadeInUp 0.5s ease-out 0.7s both',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: isMobile ? '0.875rem' : '1rem'
          }}>
            {/* Left: What Loses */}
            <div>
              <h4 style={{
                fontSize: isMobile ? '0.813rem' : '0.875rem',
                fontWeight: '700',
                color: '#ff6b6b',
                marginTop: 0,
                marginBottom: isMobile ? '0.5rem' : '0.625rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Most Bettors Lose On:
              </h4>
              <ul style={{
                fontSize: isMobile ? '0.813rem' : '0.875rem',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.6',
                margin: 0,
                paddingLeft: 0,
                listStyle: 'none'
              }}>
                {[
                  "Parlays that never hit (-EV compounds)",
                  "Heavy favorites with no value (-150, -200)",
                  "Gut feelings and hype trains"
                ].map((item, i) => (
                  <li key={i} style={{ marginBottom: '0.375rem', display: 'flex', alignItems: 'flex-start', gap: '0.375rem' }}>
                    <span style={{ color: '#ff6b6b', fontWeight: '700', fontSize: '0.875rem' }}>❌</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Divider */}
            <div style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent)',
              margin: isMobile ? '0.25rem 0' : '0.5rem 0'
            }} />

            {/* Right: Our Model */}
            <div>
              <h4 style={{
                fontSize: isMobile ? '0.813rem' : '0.875rem',
                fontWeight: '700',
                color: '#10B981',
                marginTop: 0,
                marginBottom: isMobile ? '0.5rem' : '0.625rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Our Model Wins By Finding:
              </h4>
              <ul style={{
                fontSize: isMobile ? '0.813rem' : '0.875rem',
              color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.6',
                margin: 0,
                paddingLeft: 0,
                listStyle: 'none'
              }}>
                {[
                  "Market inefficiencies bookies miss",
                  "+EV on underdogs the public fades",
                  "Goalie/rest edges lines don't price in"
                ].map((item, i) => (
                  <li key={i} style={{ marginBottom: '0.375rem', display: 'flex', alignItems: 'flex-start', gap: '0.375rem' }}>
                    <span style={{ color: '#10B981', fontWeight: '700', fontSize: '0.875rem' }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Discount Lottery - Gamified conversion */}
        <div style={{ animation: 'fadeInUp 0.5s ease-out 0.8s both' }}>
          <DiscountLottery onCodeRevealed={(code) => setDiscountCode(code)} />
        </div>

        {/* CTA - MOVED UP */}
        <button
          onClick={handleUnlock}
          style={{
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            border: '2px solid #F59E0B',
            borderRadius: '12px',
            padding: isMobile ? '1rem 1.5rem' : '1.125rem 1.75rem',
            color: '#0a0e1a',
            fontSize: isMobile ? '1rem' : '1.125rem',
            fontWeight: '800',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            width: '100%',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
            letterSpacing: '0.02em',
            position: 'relative',
            overflow: 'hidden',
            animation: 'fadeInUp 0.5s ease-out 0.9s both',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.625rem',
            minHeight: '48px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.5)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(245, 158, 11, 0.4)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <ArrowRight size={isMobile ? 18 : 20} strokeWidth={3} />
          <span>{discountCode ? `Claim ${discountCode} Discount` : 'Start 3-Day Free Trial'}</span>
        </button>

        <p style={{
          fontSize: isMobile ? '0.813rem' : '0.875rem',
          color: 'rgba(255, 255, 255, 0.5)',
          textAlign: 'center',
          marginTop: isMobile ? '0.75rem' : '1rem',
          marginBottom: isMobile ? '1rem' : '1.25rem',
          animation: 'fadeInUp 0.5s ease-out 1.1s both'
        }}>
          3-day free trial • Cancel anytime
        </p>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent)',
          marginBottom: isMobile ? '1rem' : '1.25rem'
        }} />

        {/* WHY WE'RE DIFFERENT - Simplified with Stats */}
        <div style={{
          animation: 'fadeInUp 0.5s ease-out 1.3s both',
          position: 'relative',
          zIndex: 1
        }}>
          <h4 style={{
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            fontWeight: '700',
            color: '#D4AF37',
            marginTop: 0,
            marginBottom: isMobile ? '0.625rem' : '0.75rem',
            textAlign: 'center'
          }}>
            Unlike touts with fake records:
          </h4>
          <ul style={{
            fontSize: isMobile ? '0.813rem' : '0.875rem',
            color: 'rgba(255, 255, 255, 0.75)',
            lineHeight: '1.6',
            margin: 0,
            paddingLeft: 0,
            listStyle: 'none',
            textAlign: 'center'
          }}>
            {[
              { text: "100% transparent", link: "see Performance page" },
              { text: "Every loss tracked publicly" },
              { text: "+14.3% ROI on A+ plays", highlight: true }
            ].map((item, i) => (
              <li key={i} style={{ marginBottom: '0.375rem' }}>
                <span style={{ color: '#10B981' }}>✓</span>{' '}
                {item.highlight ? (
                  <strong style={{ color: '#10B981' }}>{item.text}</strong>
                ) : (
                  <>
                    {item.text}
                    {item.link && (
                      <span style={{ fontSize: isMobile ? '0.75rem' : '0.813rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                        {' '}({item.link})
                      </span>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Closing Question - Psychological Hook */}
        <div style={{
          textAlign: 'center',
          animation: 'fadeInUp 0.5s ease-out 1.5s both',
          padding: isMobile ? '0.875rem 0 0 0' : '1rem 0 0 0',
          borderTop: '1px solid rgba(212, 175, 55, 0.15)',
          marginTop: isMobile ? '1rem' : '1.25rem'
        }}>
          <p style={{
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0,
            lineHeight: '1.6',
            fontWeight: '500'
          }}>
            Ready to see what +EV actually looks like?
          </p>
          <p style={{
            fontSize: isMobile ? '0.813rem' : '0.875rem',
            color: 'rgba(255, 107, 107, 0.85)',
            marginTop: isMobile ? '0.5rem' : '0.625rem',
            marginBottom: 0,
            lineHeight: '1.5',
            fontStyle: 'italic'
          }}>
            Or keep losing with the public?
          </p>
        </div>

        {/* Keyframes */}
        <style>{`
          @keyframes backdropFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes modalSlideUp {
            from {
              opacity: 0;
              transform: translateY(40px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes scanline {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
          
          @keyframes lockPulse {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.1); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default WelcomePopupModal;
