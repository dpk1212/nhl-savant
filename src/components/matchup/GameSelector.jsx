/**
 * Game Selector Carousel - Top of Hot Takes Page
 * Swipeable cards for selecting which game to analyze
 */

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Trophy, Zap } from 'lucide-react';

export default function GameSelector({ games, selectedGame, onGameSelect, predictions }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Update active index when selected game changes
  useEffect(() => {
    if (selectedGame) {
      const index = games.findIndex(g => 
        g.awayTeam === selectedGame.awayTeam && g.homeTeam === selectedGame.homeTeam
      );
      if (index !== -1 && index !== activeIndex) {
        setActiveIndex(index);
        scrollToIndex(index);
      }
    }
  }, [selectedGame, games]);

  const scrollToIndex = (index) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = container.children[0]?.offsetWidth || 0;
    const gap = 16; // 1rem gap
    container.scrollTo({
      left: index * (cardWidth + gap),
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < maxScroll - 10);

    // Update active index based on scroll position
    const cardWidth = container.children[0]?.offsetWidth || 0;
    const gap = 16;
    const newIndex = Math.round(scrollLeft / (cardWidth + gap));
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < games.length) {
      setActiveIndex(newIndex);
      // FIX: Call onGameSelect when swiping to update Expert Analysis below
      onGameSelect(games[newIndex]);
    }
  };

  const goToNext = () => {
    if (activeIndex < games.length - 1) {
      const newIndex = activeIndex + 1;
      setActiveIndex(newIndex);
      scrollToIndex(newIndex);
      onGameSelect(games[newIndex]);
    }
  };

  const goToPrevious = () => {
    if (activeIndex > 0) {
      const newIndex = activeIndex - 1;
      setActiveIndex(newIndex);
      scrollToIndex(newIndex);
      onGameSelect(games[newIndex]);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [activeIndex]);

  if (!games || games.length === 0) return null;

  return (
    <div style={{ marginBottom: '2rem', position: 'relative' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#F1F5F9',
          margin: 0
        }}>
          Select Game
        </h2>
        <div style={{
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#64748B'
        }}>
          {games.length} game{games.length !== 1 ? 's' : ''} today
        </div>
      </div>

      {/* Carousel Container */}
      <div style={{ position: 'relative' }}>
        {/* Left Arrow - Desktop */}
        {showLeftArrow && games.length > 1 && (
          <button
            onClick={goToPrevious}
            className="desktop-arrow"
            style={{
              position: 'absolute',
              left: '-20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: 'rgba(16, 185, 129, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
          </button>
        )}

        {/* Right Arrow - Desktop */}
        {showRightArrow && games.length > 1 && (
          <button
            onClick={goToNext}
            className="desktop-arrow"
            style={{
              position: 'absolute',
              right: '-20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: 'rgba(16, 185, 129, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            <ChevronRight size={24} color="#FFFFFF" strokeWidth={2.5} />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="hide-scrollbar"
          style={{
            display: 'flex',
            gap: '1rem',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            padding: '0.5rem 0'
          }}
        >
          {games.map((game, index) => {
            const prediction = predictions?.[index];
            const isSelected = index === activeIndex;
            const awayWinProb = prediction?.awayWinProb || 50;
            const homeWinProb = prediction?.homeWinProb || 50;
            const favorite = awayWinProb > homeWinProb ? game.awayTeam : game.homeTeam;
            const favoriteProb = Math.max(awayWinProb, homeWinProb);
            
            return (
              <div
                key={`${game.awayTeam}-${game.homeTeam}`}
                onClick={() => {
                  setActiveIndex(index);
                  scrollToIndex(index);
                  onGameSelect(game);
                }}
                style={{
                  minWidth: 'calc(100% - 1rem)',
                  maxWidth: 'calc(100% - 1rem)',
                  scrollSnapAlign: 'start',
                  background: isSelected 
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.15) 100%)'
                    : 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)',
                  border: isSelected 
                    ? '2px solid rgba(16, 185, 129, 0.5)'
                    : '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isSelected 
                    ? '0 8px 24px rgba(16, 185, 129, 0.2)'
                    : '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                {/* Game Info */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: '900',
                    color: isSelected ? '#10B981' : '#F1F5F9'
                  }}>
                    {game.awayTeam} @ {game.homeTeam}
                  </div>
                  {game.gameTime && game.gameTime !== 'TBD' && (
                    <div style={{
                      background: isSelected 
                        ? 'rgba(16, 185, 129, 0.2)'
                        : 'rgba(100, 116, 139, 0.2)',
                      border: `1px solid ${isSelected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(100, 116, 139, 0.3)'}`,
                      borderRadius: '8px',
                      padding: '0.375rem 0.75rem',
                      fontSize: '0.8125rem',
                      fontWeight: '700',
                      color: isSelected ? '#10B981' : '#94A3B8',
                      whiteSpace: 'nowrap'
                    }}>
                      <Zap size={12} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
                      {game.gameTime}
                    </div>
                  )}
                </div>

                {/* Prediction Summary */}
                {prediction && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: isSelected 
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(30, 41, 59, 0.6)',
                    borderRadius: '10px',
                    padding: '0.875rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Trophy size={18} color={isSelected ? '#10B981' : '#64748B'} />
                      <div>
                        <div style={{
                          fontSize: '0.6875rem',
                          fontWeight: '600',
                          color: '#94A3B8',
                          textTransform: 'uppercase',
                          marginBottom: '0.125rem'
                        }}>
                          Projected Winner
                        </div>
                        <div style={{
                          fontSize: '1.125rem',
                          fontWeight: '900',
                          color: isSelected ? '#10B981' : '#F1F5F9'
                        }}>
                          {favorite}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '0.6875rem',
                        fontWeight: '600',
                        color: '#94A3B8',
                        textTransform: 'uppercase',
                        marginBottom: '0.125rem'
                      }}>
                        Win Prob
                      </div>
                      <div style={{
                        fontSize: '1.125rem',
                        fontWeight: '900',
                        color: isSelected ? '#10B981' : '#F1F5F9'
                      }}>
                        {favoriteProb.toFixed(0)}%
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '0.6875rem',
                        fontWeight: '600',
                        color: '#94A3B8',
                        textTransform: 'uppercase',
                        marginBottom: '0.125rem'
                      }}>
                        Score
                      </div>
                      <div style={{
                        fontSize: '1.125rem',
                        fontWeight: '900',
                        color: isSelected ? '#10B981' : '#F1F5F9'
                      }}>
                        {prediction.awayScore.toFixed(1)}-{prediction.homeScore.toFixed(1)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Selected Indicator */}
                {isSelected && (
                  <div style={{
                    marginTop: '0.75rem',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: '#10B981',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    ✓ Viewing This Game
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Dots - Mobile */}
      {games.length > 1 && (
        <div 
          className="mobile-dots"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '1rem'
          }}
        >
          {games.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveIndex(index);
                scrollToIndex(index);
                onGameSelect(games[index]);
              }}
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
              aria-label={`Go to game ${index + 1}`}
            />
          ))}
        </div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @media (max-width: 768px) {
          .desktop-arrow {
            display: none !important;
          }
        }
        
        @media (min-width: 769px) {
          .mobile-dots {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

