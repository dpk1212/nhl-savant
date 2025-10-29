/**
 * Advanced Metrics Carousel - Swipeable Premium Charts
 * Mobile-first horizontal scroll with premium styling
 */

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ExpectedGoalsChart from './AdvancedMetrics/ExpectedGoalsChart';
import ShotQualityChart from './AdvancedMetrics/ShotQualityChart';
import SpecialTeamsChart from './AdvancedMetrics/SpecialTeamsChart';
import GoalieChart from './AdvancedMetrics/GoalieChart';
import PossessionChart from './AdvancedMetrics/PossessionChart';

export default function AdvancedMetricsCarousel({ matchupData, dataProcessor }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const charts = [
    {
      id: 'xgoals',
      title: 'Expected Goals',
      component: (
        <ExpectedGoalsChart
          awayTeam={matchupData.away}
          homeTeam={matchupData.home}
          awayStats={matchupData.away.stats5v5}
          homeStats={matchupData.home.stats5v5}
          dataProcessor={dataProcessor}
        />
      )
    },
    {
      id: 'shotquality',
      title: 'Shot Quality',
      component: (
        <ShotQualityChart
          awayTeam={matchupData.away}
          homeTeam={matchupData.home}
          awayStats={matchupData.away.stats5v5}
          homeStats={matchupData.home.stats5v5}
        />
      )
    },
    {
      id: 'specialteams',
      title: 'Special Teams',
      component: (
        <SpecialTeamsChart
          awayTeam={matchupData.away}
          homeTeam={matchupData.home}
          awayPP={matchupData.away.powerPlay}
          awayPK={matchupData.away.penaltyKill}
          homePP={matchupData.home.powerPlay}
          homePK={matchupData.home.penaltyKill}
        />
      )
    },
    {
      id: 'goalie',
      title: 'Goaltending',
      component: (
        <GoalieChart
          awayTeam={matchupData.away}
          homeTeam={matchupData.home}
          awayGoalie={matchupData.away.goalie}
          homeGoalie={matchupData.home.goalie}
        />
      )
    },
    {
      id: 'possession',
      title: 'Possession',
      component: (
        <PossessionChart
          awayTeam={matchupData.away}
          homeTeam={matchupData.home}
          awayStats={matchupData.away.stats5v5}
          homeStats={matchupData.home.stats5v5}
        />
      )
    }
  ];

  const scrollToIndex = (index) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const card = container.children[index];
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      setActiveIndex(index);
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < maxScroll - 10);

    // Update active index based on scroll position
    const cardWidth = container.children[0]?.offsetWidth || 0;
    const newIndex = Math.round(scrollLeft / cardWidth);
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div style={{ marginTop: '2rem', position: 'relative' }}>
      {/* Premium Header */}
      <div style={{
        marginBottom: '1.5rem',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 50%, #8B5CF6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.5rem',
          letterSpacing: '-0.02em'
        }}>
          Advanced Analytics
        </h2>
        <p style={{
          fontSize: '0.9375rem',
          color: '#94A3B8',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Deep dive into the underlying metrics that drive our predictions
        </p>
      </div>

      {/* Desktop Navigation Tabs - Hidden on mobile */}
      <div 
        className="metrics-tabs"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}
      >
        {charts.map((chart, index) => (
          <button
            key={chart.id}
            onClick={() => scrollToIndex(index)}
            style={{
              padding: '0.5rem 1rem',
              background: activeIndex === index 
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)'
                : 'rgba(30, 41, 59, 0.6)',
              border: activeIndex === index 
                ? '2px solid rgba(16, 185, 129, 0.5)'
                : '1px solid rgba(148, 163, 184, 0.1)',
              borderRadius: '10px',
              color: activeIndex === index ? '#10B981' : '#94A3B8',
              fontSize: '0.8125rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            {chart.title}
          </button>
        ))}
      </div>

      {/* Swipeable Container */}
      <div style={{ position: 'relative' }}>
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            <ChevronLeft size={24} color="#FFFFFF" strokeWidth={3} />
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scrollToIndex(Math.min(charts.length - 1, activeIndex + 1))}
            style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            <ChevronRight size={24} color="#FFFFFF" strokeWidth={3} />
          </button>
        )}

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          style={{
            display: 'flex',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            gap: '1.5rem',
            paddingBottom: '1rem',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
          className="hide-scrollbar"
        >
          {charts.map((chart, index) => (
            <div
              key={chart.id}
              style={{
                minWidth: '100%',
                scrollSnapAlign: 'center',
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                transition: 'transform 0.3s ease, opacity 0.3s ease',
                opacity: activeIndex === index ? 1 : 0.7,
                transform: activeIndex === index ? 'scale(1)' : 'scale(0.95)'
              }}
            >
              {chart.component}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Progress Dots */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem',
        marginTop: '1.5rem'
      }}>
        {charts.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
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
          />
        ))}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Mobile Optimizations */
        @media (max-width: 768px) {
          /* Hide desktop tabs on mobile */
          .metrics-tabs {
            display: none !important;
          }
          
          /* Hide desktop navigation arrows on mobile */
          .carousel-arrows {
            display: none !important;
          }
          
          /* Make dots bigger for touch targets (48px minimum) */
          .mobile-progress-dots button {
            min-width: 48px !important;
            min-height: 48px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
}

