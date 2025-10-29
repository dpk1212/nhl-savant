/**
 * Swipeable Advanced Metrics Carousel
 * Premium horizontal swipe experience for deep analytics
 */

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ExpectedGoalsChart from './AdvancedMetrics/ExpectedGoalsChart';
import ShotQualityChart from './AdvancedMetrics/ShotQualityChart';
import SpecialTeamsChart from './AdvancedMetrics/SpecialTeamsChart';
import GoalieChart from './AdvancedMetrics/GoalieChart';
import PossessionChart from './AdvancedMetrics/PossessionChart';

export default function SwipeableMetrics({ awayTeam, homeTeam, matchupData }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef(null);

  const metrics = [
    {
      id: 'xgoals',
      title: 'Expected Goals',
      subtitle: 'Offensive & Defensive xG Analysis',
      component: <ExpectedGoalsChart
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayStats={matchupData.away.stats5v5}
        homeStats={matchupData.home.stats5v5}
      />
    },
    {
      id: 'shotquality',
      title: 'Shot Quality',
      subtitle: 'High Danger Chances Breakdown',
      component: <ShotQualityChart
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayStats={matchupData.away.stats5v5}
        homeStats={matchupData.home.stats5v5}
      />
    },
    {
      id: 'specialteams',
      title: 'Special Teams',
      subtitle: 'Power Play & Penalty Kill',
      component: <SpecialTeamsChart
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayPP={matchupData.away.powerPlay}
        awayPK={matchupData.away.penaltyKill}
        homePP={matchupData.home.powerPlay}
        homePK={matchupData.home.penaltyKill}
      />
    },
    {
      id: 'goalie',
      title: 'Goaltending',
      subtitle: 'GSAX & Save Percentage',
      component: <GoalieChart
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayGoalie={matchupData.away.goalie}
        homeGoalie={matchupData.home.goalie}
      />
    },
    {
      id: 'possession',
      title: 'Possession & Pace',
      subtitle: 'Corsi & Fenwick Analysis',
      component: <PossessionChart
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayStats={matchupData.away.stats5v5}
        homeStats={matchupData.home.stats5v5}
      />
    }
  ];

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    
    if (Math.abs(distance) < minSwipeDistance) return;
    
    if (distance > 0) {
      // Swiped left
      nextMetric();
    } else {
      // Swiped right
      prevMetric();
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  const nextMetric = () => {
    setActiveIndex((prev) => (prev + 1) % metrics.length);
  };

  const prevMetric = () => {
    setActiveIndex((prev) => (prev - 1 + metrics.length) % metrics.length);
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      {/* Premium Section Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        padding: '0 0.5rem'
      }}>
        <div>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.25rem',
            letterSpacing: '-0.02em'
          }}>
            Advanced Analytics
          </h2>
          <p style={{
            fontSize: '0.875rem',
            color: '#64748B',
            fontWeight: '500'
          }}>
            Swipe to explore deep metrics
          </p>
        </div>
        
        {/* Desktop Navigation */}
        <div style={{
          display: 'flex',
          gap: '0.5rem'
        }}
        className="desktop-only">
          <button
            onClick={prevMetric}
            disabled={activeIndex === 0}
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: activeIndex === 0 ? 'rgba(100, 116, 139, 0.1)' : 'rgba(59, 130, 246, 0.15)',
              border: `1px solid ${activeIndex === 0 ? 'rgba(100, 116, 139, 0.2)' : 'rgba(59, 130, 246, 0.3)'}`,
              borderRadius: '10px',
              cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: activeIndex === 0 ? 0.5 : 1
            }}
          >
            <ChevronLeft size={20} color={activeIndex === 0 ? '#64748B' : '#3B82F6'} />
          </button>
          <button
            onClick={nextMetric}
            disabled={activeIndex === metrics.length - 1}
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: activeIndex === metrics.length - 1 ? 'rgba(100, 116, 139, 0.1)' : 'rgba(59, 130, 246, 0.15)',
              border: `1px solid ${activeIndex === metrics.length - 1 ? 'rgba(100, 116, 139, 0.2)' : 'rgba(59, 130, 246, 0.3)'}`,
              borderRadius: '10px',
              cursor: activeIndex === metrics.length - 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: activeIndex === metrics.length - 1 ? 0.5 : 1
            }}
          >
            <ChevronRight size={20} color={activeIndex === metrics.length - 1 ? '#64748B' : '#3B82F6'} />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
        }}
      >
        {/* Active Metric Header */}
        <div style={{
          padding: '1.5rem 1.5rem 1rem 1.5rem',
          borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#F1F5F9',
            marginBottom: '0.25rem'
          }}>
            {metrics[activeIndex].title}
          </h3>
          <p style={{
            fontSize: '0.8125rem',
            color: '#94A3B8',
            fontWeight: '500'
          }}>
            {metrics[activeIndex].subtitle}
          </p>
        </div>

        {/* Content */}
        <div style={{
          padding: '1.5rem',
          minHeight: '400px'
        }}>
          {metrics[activeIndex].component}
        </div>

        {/* Progress Dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '1rem',
          borderTop: '1px solid rgba(148, 163, 184, 0.1)'
        }}>
          {metrics.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              style={{
                width: index === activeIndex ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: index === activeIndex 
                  ? 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)'
                  : 'rgba(100, 116, 139, 0.3)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: 0
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
        }
        
        @media (min-width: 769px) {
          .desktop-only {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}

