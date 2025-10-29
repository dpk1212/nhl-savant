/**
 * Quick Stats Cards - Premium visual highlighting of 3 biggest edges
 * PURE VISUAL - Icons + Numbers only, no description text
 */

import { Target, Shield, Zap, TrendingUp } from 'lucide-react';

export default function QuickStatsCards({ awayTeam, homeTeam, edges, matchupData }) {
  if (!edges || !matchupData) return null;

  // Determine the 3 biggest edges
  const cards = [];

  // 1. xGoals Edge (always show)
  const xGEdge = Math.abs(edges.xGoalsAway || 0);
  const xGTeam = (edges.xGoalsAway || 0) > 0 ? awayTeam : homeTeam;
  if (xGEdge > 0.5) {
    cards.push({
      icon: Target,
      title: 'xGoals Edge',
      team: xGTeam.name,
      value: `+${xGEdge.toFixed(2)}`,
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      glow: '0 0 30px rgba(16, 185, 129, 0.4)'
    });
  }

  // 2. Goalie Edge
  if (edges.goalie && Math.abs(edges.goalie) > 2) {
    const goalieTeam = edges.goalie > 0 ? awayTeam : homeTeam;
    const goalieAdvantage = edges.goalie > 0 ? matchupData.away.goalie : matchupData.home.goalie;
    if (goalieAdvantage && !goalieAdvantage.isDefault) {
      cards.push({
        icon: Shield,
        title: 'Goaltending',
        team: goalieTeam.name,
        value: `${((goalieAdvantage.savePct || 0.905) * 100).toFixed(1)}%`,
        color: '#3B82F6',
        gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
        glow: '0 0 30px rgba(59, 130, 246, 0.4)'
      });
    }
  }

  // 3. Special Teams Edge
  if (edges.specialTeams && Math.abs(edges.specialTeams) > 0.5) {
    const stTeam = edges.specialTeams > 0 ? awayTeam : homeTeam;
    cards.push({
      icon: Zap,
      title: 'Special Teams',
      team: stTeam.name,
      value: `+${Math.abs(edges.specialTeams).toFixed(1)}`,
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      glow: '0 0 30px rgba(245, 158, 11, 0.4)'
    });
  }

  // 4. Overall Win Probability (if high confidence)
  if (edges.overall && edges.overall.confidence !== 'low') {
    const favTeam = edges.overall.favorite === 'away' ? awayTeam : homeTeam;
    const winProb = edges.overall.favorite === 'away' ? edges.overall.awayAdvantage : edges.overall.homeAdvantage;
    cards.push({
      icon: TrendingUp,
      title: 'Win Probability',
      team: favTeam.name,
      value: `${winProb}%`,
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      glow: '0 0 30px rgba(139, 92, 246, 0.4)'
    });
  }

  // Show top 3
  const topCards = cards.slice(0, 3);

  if (topCards.length === 0) return null;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    }}>
      {topCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="quick-stat-card"
            style={{
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              border: `1px solid ${card.color}30`,
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.37), ${card.glow}`,
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: `slideInUp 0.5s ease-out ${index * 0.1}s both`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = `0 20px 60px 0 rgba(0, 0, 0, 0.5), ${card.glow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 8px 32px 0 rgba(0, 0, 0, 0.37), ${card.glow}`;
            }}
          >
            {/* Gradient Orb Background */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-20%',
              width: '200px',
              height: '200px',
              background: card.gradient,
              borderRadius: '50%',
              opacity: 0.1,
              filter: 'blur(40px)',
              pointerEvents: 'none'
            }} />

            {/* Icon */}
            <div style={{
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: card.gradient,
              borderRadius: '16px',
              marginBottom: '1rem',
              boxShadow: card.glow
            }}>
              <Icon size={28} color="white" strokeWidth={2.5} />
            </div>

            {/* Title */}
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#94A3B8',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem'
            }}>
              {card.title}
            </div>

            {/* Team */}
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#F1F5F9',
              marginBottom: '0.25rem'
            }}>
              {card.team}
            </div>

            {/* Value */}
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '900',
              background: card.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {card.value}
            </div>
          </div>
        );
      })}

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
      `}</style>
    </div>
  );
}

