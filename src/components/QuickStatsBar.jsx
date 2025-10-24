/**
 * QuickStatsBar Component
 * Compact horizontal stats display for collapsed game cards
 * Shows key metrics at a glance: xGF, xGA, advantages, goalies
 */

import { Target, Shield, TrendingUp, Activity } from 'lucide-react';

const QuickStatsBar = ({ 
  game, 
  awayTeam, 
  homeTeam,
  dataProcessor,
  isMobile = false 
}) => {
  if (!game || !dataProcessor) return null;

  // Get stats from dataProcessor
  const awayStats = dataProcessor.getTeamStats(awayTeam);
  const homeStats = dataProcessor.getTeamStats(homeTeam);
  
  // Extract key stats
  const awayXGF = awayStats?.xGF || 0;
  const homeXGF = homeStats?.xGF || 0;
  const awayXGA = awayStats?.xGA || 0;
  const homeXGA = homeStats?.xGA || 0;
  
  // Get goalie info from game edges (if available)
  const awayGoalie = game.goalies?.away?.name || null;
  const homeGoalie = game.goalies?.home?.name || null;

  // Determine advantages
  const offenseLeader = awayXGF > homeXGF ? awayTeam : homeTeam;
  const offenseValue = Math.max(awayXGF, homeXGF).toFixed(2);
  const defenseLeader = awayXGA < homeXGA ? awayTeam : homeTeam;
  const defenseValue = Math.min(awayXGA, homeXGA).toFixed(2);

  const StatBadge = ({ icon: Icon, label, value, isAdvantage = false }) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: isMobile ? '0.375rem 0.5rem' : '0.375rem 0.625rem',
      background: isAdvantage 
        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)'
        : 'rgba(255, 255, 255, 0.05)',
      border: isAdvantage 
        ? '1px solid rgba(16, 185, 129, 0.3)'
        : '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '6px',
      fontSize: isMobile ? '0.688rem' : '0.75rem',
      fontWeight: '700',
      whiteSpace: 'nowrap'
    }}>
      <Icon size={isMobile ? 12 : 14} color={isAdvantage ? '#10B981' : '#94A3B8'} />
      <span style={{ 
        color: isAdvantage ? '#10B981' : 'var(--color-text-muted)',
        fontSize: isMobile ? '0.625rem' : '0.688rem',
        fontWeight: '600'
      }}>
        {label}:
      </span>
      <span style={{ 
        color: isAdvantage ? '#10B981' : 'var(--color-text-primary)',
        fontWeight: '800'
      }}>
        {value}
      </span>
    </div>
  );

  return (
    <div style={{
      padding: isMobile ? '0.5rem 0.75rem' : '0.625rem 1rem',
      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.15) 100%)',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '0.5rem' : '0.75rem',
      flexWrap: 'wrap',
      overflow: 'hidden'
    }}>
      {/* Offense Advantage */}
      {awayXGF > 0 && homeXGF > 0 && (
        <StatBadge 
          icon={Target} 
          label={`${offenseLeader} OFF`}
          value={offenseValue}
          isAdvantage={Math.abs(awayXGF - homeXGF) > 0.3}
        />
      )}
      
      {/* Defense Advantage */}
      {awayXGA > 0 && homeXGA > 0 && (
        <StatBadge 
          icon={Shield} 
          label={`${defenseLeader} DEF`}
          value={defenseValue}
          isAdvantage={Math.abs(awayXGA - homeXGA) > 0.3}
        />
      )}
      
      {/* Goalie Info */}
      {(awayGoalie || homeGoalie) && (
        <StatBadge 
          icon={Activity} 
          label="🥅"
          value={awayGoalie && homeGoalie ? 'Both confirmed' : 'TBD'}
          isAdvantage={awayGoalie && homeGoalie}
        />
      )}

      {/* Mobile: Show simplified version */}
      {isMobile && !awayXGF && (
        <div style={{
          fontSize: '0.688rem',
          color: 'var(--color-text-muted)',
          fontStyle: 'italic'
        }}>
          Stats loading...
        </div>
      )}
    </div>
  );
};

export default QuickStatsBar;

