/**
 * Advanced Matchup Details
 * Expandable deep dive into all 100+ advanced statistics
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, Zap, Target, TrendingUp } from 'lucide-react';
import { VisualMetricsGenerator } from '../utils/visualMetricsGenerator';

const AdvancedMatchupDetails = ({ 
  awayTeam, 
  homeTeam, 
  dangerZoneData,
  reboundData,
  physicalData,
  possessionData,
  regressionData,
  isMobile 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{
      background: 'rgba(26, 31, 46, 0.4)',
      border: '1px solid rgba(100, 116, 139, 0.25)',
      borderRadius: '12px',
      overflow: 'hidden',
      marginBottom: '1.5rem'
    }}>
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: isMobile ? '1rem' : '1.25rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'background 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(100, 116, 139, 0.1)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{
            fontSize: isMobile ? '1rem' : '1.125rem',
            fontWeight: '800',
            color: 'var(--color-text-primary)',
            marginBottom: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Target size={20} style={{ color: 'var(--color-accent)' }} />
            Deep Dive: Advanced Metrics
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            fontWeight: '500'
          }}>
            {isExpanded 
              ? 'Showing all 12+ statistical categories' 
              : 'Danger zones, rebounds, physical play, and more'}
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--color-accent)'
        }}>
          <span style={{
            fontSize: '0.688rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {isExpanded ? 'Collapse' : 'Expand'}
          </span>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div style={{
          padding: isMobile ? '1rem' : '1.5rem',
          paddingTop: 0,
          borderTop: '1px solid rgba(100, 116, 139, 0.2)'
        }}>
          {/* Danger Zone Breakdown */}
          {dangerZoneData && (
            <DangerZoneSection 
              data={dangerZoneData} 
              awayTeam={awayTeam} 
              homeTeam={homeTeam} 
              isMobile={isMobile} 
            />
          )}

          {/* Rebound Analysis */}
          {reboundData && (
            <ReboundSection 
              data={reboundData} 
              awayTeam={awayTeam} 
              homeTeam={homeTeam} 
              isMobile={isMobile} 
            />
          )}

          {/* Physical Play */}
          {physicalData && (
            <PhysicalPlaySection 
              data={physicalData} 
              awayTeam={awayTeam} 
              homeTeam={homeTeam} 
              isMobile={isMobile} 
            />
          )}

          {/* Possession Metrics */}
          {possessionData && (
            <PossessionSection 
              data={possessionData} 
              awayTeam={awayTeam} 
              homeTeam={homeTeam} 
              isMobile={isMobile} 
            />
          )}

          {/* Regression Indicators */}
          {regressionData && (
            <RegressionSection 
              data={regressionData} 
              awayTeam={awayTeam} 
              homeTeam={homeTeam} 
              isMobile={isMobile} 
            />
          )}
        </div>
      )}
    </div>
  );
};

// Danger Zone Section
const DangerZoneSection = ({ data, awayTeam, homeTeam, isMobile }) => {
  return (
    <Section title="🎯 Shot Danger Distribution" icon={<Target size={18} />} isMobile={isMobile}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        {/* Low Danger */}
        <DangerCard
          title="Low Danger"
          color="#64748B"
          awayShots={data.away.low.shots}
          homeShots={data.home.low.shots}
          awayXg={data.away.low.xGoals}
          homeXg={data.home.low.xGoals}
          awayTeam={awayTeam}
          homeTeam={homeTeam}
        />

        {/* Medium Danger */}
        <DangerCard
          title="Medium Danger"
          color="#F59E0B"
          awayShots={data.away.medium.shots}
          homeShots={data.home.medium.shots}
          awayXg={data.away.medium.xGoals}
          homeXg={data.home.medium.xGoals}
          awayTeam={awayTeam}
          homeTeam={homeTeam}
        />

        {/* High Danger */}
        <DangerCard
          title="High Danger"
          color="#EF4444"
          awayShots={data.away.high.shots}
          homeShots={data.home.high.shots}
          awayXg={data.away.high.xGoals}
          homeXg={data.home.high.xGoals}
          awayTeam={awayTeam}
          homeTeam={homeTeam}
        />
      </div>

      {data.analysis && (
        <div style={{
          padding: '0.75rem',
          background: 'rgba(59, 130, 246, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '6px',
          fontSize: '0.813rem',
          color: 'var(--color-text-secondary)',
          fontStyle: 'italic'
        }}>
          💡 {data.analysis}
        </div>
      )}
    </Section>
  );
};

// Danger Card
const DangerCard = ({ title, color, awayShots, homeShots, awayXg, homeXg, awayTeam, homeTeam }) => {
  const maxShots = Math.max(awayShots, homeShots);
  const awayPct = maxShots > 0 ? (awayShots / maxShots) * 100 : 0;
  const homePct = maxShots > 0 ? (homeShots / maxShots) * 100 : 0;

  return (
    <div style={{
      padding: '1rem',
      background: 'rgba(26, 31, 46, 0.6)',
      border: `1px solid ${color}40`,
      borderRadius: '8px'
    }}>
      <div style={{
        fontSize: '0.688rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: color,
        marginBottom: '0.75rem'
      }}>
        {title}
      </div>

      {/* Away Team */}
      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--color-text-secondary)',
          marginBottom: '0.25rem',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>{awayTeam} OFF</span>
          <span style={{ fontWeight: '700', fontFeatureSettings: "'tnum'" }}>
            {awayShots} shots ({awayXg.toFixed(2)} xG)
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '6px',
          background: 'rgba(100, 116, 139, 0.2)',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${awayPct}%`,
            height: '100%',
            background: color,
            borderRadius: '3px'
          }} />
        </div>
      </div>

      {/* Home Team */}
      <div>
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--color-text-secondary)',
          marginBottom: '0.25rem',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>{homeTeam} DEF</span>
          <span style={{ fontWeight: '700', fontFeatureSettings: "'tnum'" }}>
            {homeShots} shots ({homeXg.toFixed(2)} xG)
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '6px',
          background: 'rgba(100, 116, 139, 0.2)',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${homePct}%`,
            height: '100%',
            background: color,
            borderRadius: '3px'
          }} />
        </div>
      </div>
    </div>
  );
};

// Rebound Section
const ReboundSection = ({ data, awayTeam, homeTeam, isMobile }) => {
  return (
    <Section title="🔄 Second-Chance Opportunities" icon={<Zap size={18} />} isMobile={isMobile}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '1rem'
      }}>
        {/* Away Offense */}
        <div style={{
          padding: '1rem',
          background: 'rgba(26, 31, 46, 0.6)',
          border: '1px solid rgba(100, 116, 139, 0.3)',
          borderRadius: '8px'
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            color: 'var(--color-text-muted)',
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {awayTeam} Offense
          </div>

          <StatRow label="Rebounds" value={data.awayOffense.rebounds} />
          <StatRow label="Rebound xG" value={data.awayOffense.reboundXg} />
          <StatRow label="Rebound Goals" value={data.awayOffense.reboundGoals} />
          <StatRow 
            label="Conversion %" 
            value={`${data.awayOffense.conversion}%`}
            badge={data.awayOffense.status}
            badgeColor={
              data.awayOffense.status === 'Hot' ? '#10B981' :
              data.awayOffense.status === 'Cold' ? '#EF4444' : '#64748B'
            }
          />
        </div>

        {/* Home Defense */}
        <div style={{
          padding: '1rem',
          background: 'rgba(26, 31, 46, 0.6)',
          border: '1px solid rgba(100, 116, 139, 0.3)',
          borderRadius: '8px'
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            color: 'var(--color-text-muted)',
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {homeTeam} Defense
          </div>

          <StatRow label="Rebounds" value={data.homeDefense.rebounds} />
          <StatRow label="Rebound xG" value={data.homeDefense.reboundXg} />
          <StatRow label="Rebound Goals" value={data.homeDefense.reboundGoals} />
          <StatRow 
            label="Control" 
            value={data.homeDefense.control}
            badge={data.homeDefense.control}
            badgeColor={data.homeDefense.control === 'Excellent' ? '#10B981' : '#64748B'}
          />
        </div>
      </div>

      {data.matchupEdge.summary && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: 'rgba(59, 130, 246, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '6px',
          fontSize: '0.813rem',
          color: 'var(--color-text-secondary)',
          fontStyle: 'italic'
        }}>
          💡 {data.matchupEdge.summary}
        </div>
      )}
    </Section>
  );
};

// Physical Play Section
const PhysicalPlaySection = ({ data, awayTeam, homeTeam, isMobile }) => {
  return (
    <Section title="💪 Physical Play & Defense" icon={<Shield size={18} />} isMobile={isMobile}>
      <div style={{
        display: 'grid',
        gap: '0.75rem'
      }}>
        {data.map((metric, idx) => (
          <PhysicalMetricRow
            key={idx}
            stat={metric.stat}
            awayValue={metric.away.value}
            awayLabel={metric.away.label}
            homeValue={metric.home.value}
            homeLabel={metric.home.label}
            advantage={metric.advantage}
            diff={metric.diff}
            awayTeam={awayTeam}
            homeTeam={homeTeam}
          />
        ))}
      </div>
    </Section>
  );
};

// Physical Metric Row
const PhysicalMetricRow = ({ stat, awayValue, awayLabel, homeValue, homeLabel, advantage, diff, awayTeam, homeTeam }) => {
  return (
    <div style={{
      padding: '0.875rem',
      background: 'rgba(26, 31, 46, 0.6)',
      border: '1px solid rgba(100, 116, 139, 0.3)',
      borderRadius: '6px'
    }}>
      <div style={{
        fontSize: '0.75rem',
        fontWeight: '700',
        color: 'var(--color-text-muted)',
        marginBottom: '0.625rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {stat}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: '1rem',
        alignItems: 'center'
      }}>
        {/* Away */}
        <div style={{
          textAlign: 'left',
          color: advantage === 'away' ? '#10B981' : 'var(--color-text-secondary)',
          fontWeight: advantage === 'away' ? '700' : '600'
        }}>
          <div style={{ fontSize: '0.875rem', fontFeatureSettings: "'tnum'" }}>
            {awayValue}
          </div>
          <div style={{ fontSize: '0.688rem', opacity: 0.7 }}>
            {awayLabel}
          </div>
        </div>

        {/* Diff */}
        <div style={{
          fontSize: '0.688rem',
          fontWeight: '700',
          color: 'var(--color-text-muted)',
          textAlign: 'center'
        }}>
          Δ {diff}
        </div>

        {/* Home */}
        <div style={{
          textAlign: 'right',
          color: advantage === 'home' ? '#10B981' : 'var(--color-text-secondary)',
          fontWeight: advantage === 'home' ? '700' : '600'
        }}>
          <div style={{ fontSize: '0.875rem', fontFeatureSettings: "'tnum'" }}>
            {homeValue}
          </div>
          <div style={{ fontSize: '0.688rem', opacity: 0.7 }}>
            {homeLabel}
          </div>
        </div>
      </div>
    </div>
  );
};

// Possession Section
const PossessionSection = ({ data, awayTeam, homeTeam, isMobile }) => {
  return (
    <Section title="📊 Possession & Control" icon={<TrendingUp size={18} />} isMobile={isMobile}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '1rem'
      }}>
        <PossessionCard
          team={awayTeam}
          corsi={data.away?.corsiPct || 50}
          fenwick={data.away?.fenwickPct || 50}
          xGoalsPct={data.away?.xGoalsPct || 50}
          faceoffPct={data.away?.faceoffPct || 50}
        />
        <PossessionCard
          team={homeTeam}
          corsi={data.home?.corsiPct || 50}
          fenwick={data.home?.fenwickPct || 50}
          xGoalsPct={data.home?.xGoalsPct || 50}
          faceoffPct={data.home?.faceoffPct || 50}
        />
      </div>
    </Section>
  );
};

// Possession Card
const PossessionCard = ({ team, corsi, fenwick, xGoalsPct, faceoffPct }) => {
  return (
    <div style={{
      padding: '1rem',
      background: 'rgba(26, 31, 46, 0.6)',
      border: '1px solid rgba(100, 116, 139, 0.3)',
      borderRadius: '8px'
    }}>
      <div style={{
        fontSize: '0.75rem',
        fontWeight: '700',
        color: 'var(--color-text-muted)',
        marginBottom: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {team}
      </div>

      <StatRow label="Corsi %" value={`${corsi.toFixed(1)}%`} />
      <StatRow label="Fenwick %" value={`${fenwick.toFixed(1)}%`} />
      <StatRow label="xGoals %" value={`${xGoalsPct.toFixed(1)}%`} />
      <StatRow label="Faceoff %" value={`${faceoffPct.toFixed(1)}%`} />
    </div>
  );
};

// Regression Section
const RegressionSection = ({ data, awayTeam, homeTeam, isMobile }) => {
  return (
    <Section title="🎲 Luck & Regression Indicators" icon={<TrendingUp size={18} />} isMobile={isMobile}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '1rem'
      }}>
        <RegressionCard
          team={awayTeam}
          pdo={data.away?.pdo || 100}
          shootingPct={data.away?.shootingPct || 10}
          savePct={data.away?.savePct || 90}
          goalsVsXg={data.away?.goalsVsExpected || 0}
        />
        <RegressionCard
          team={homeTeam}
          pdo={data.home?.pdo || 100}
          shootingPct={data.home?.shootingPct || 10}
          savePct={data.home?.savePct || 90}
          goalsVsXg={data.home?.goalsVsExpected || 0}
        />
      </div>
    </Section>
  );
};

// Regression Card
const RegressionCard = ({ team, pdo, shootingPct, savePct, goalsVsXg }) => {
  const pdoColor = pdo > 102 ? '#EF4444' : pdo < 98 ? '#10B981' : '#64748B';
  
  return (
    <div style={{
      padding: '1rem',
      background: 'rgba(26, 31, 46, 0.6)',
      border: '1px solid rgba(100, 116, 139, 0.3)',
      borderRadius: '8px'
    }}>
      <div style={{
        fontSize: '0.75rem',
        fontWeight: '700',
        color: 'var(--color-text-muted)',
        marginBottom: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {team}
      </div>

      <StatRow 
        label="PDO" 
        value={pdo.toFixed(1)}
        badge={pdo > 102 ? 'Hot' : pdo < 98 ? 'Cold' : 'Average'}
        badgeColor={pdoColor}
      />
      <StatRow label="Shooting %" value={`${shootingPct.toFixed(1)}%`} />
      <StatRow label="Save %" value={`${savePct.toFixed(1)}%`} />
      <StatRow 
        label="Goals vs xG" 
        value={goalsVsXg >= 0 ? `+${goalsVsXg.toFixed(1)}` : goalsVsXg.toFixed(1)}
        badgeColor={goalsVsXg > 0 ? '#10B981' : goalsVsXg < 0 ? '#EF4444' : '#64748B'}
      />
    </div>
  );
};

// Reusable Components
const Section = ({ title, icon, children, isMobile }) => {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid rgba(100, 116, 139, 0.2)'
      }}>
        <div style={{ color: 'var(--color-accent)' }}>{icon}</div>
        <h4 style={{
          fontSize: isMobile ? '0.938rem' : '1rem',
          fontWeight: '800',
          color: 'var(--color-text-primary)',
          margin: 0
        }}>
          {title}
        </h4>
      </div>
      {children}
    </div>
  );
};

const StatRow = ({ label, value, badge, badgeColor }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.5rem'
    }}>
      <span style={{
        fontSize: '0.75rem',
        color: 'var(--color-text-muted)',
        fontWeight: '500'
      }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{
          fontSize: '0.875rem',
          fontWeight: '700',
          color: 'var(--color-text-primary)',
          fontFeatureSettings: "'tnum'"
        }}>
          {value}
        </span>
        {badge && (
          <span style={{
            fontSize: '0.625rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            padding: '0.125rem 0.375rem',
            borderRadius: '3px',
            background: `${badgeColor}20`,
            color: badgeColor
          }}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};

export default AdvancedMatchupDetails;

