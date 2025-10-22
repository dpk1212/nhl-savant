/**
 * Advanced Matchup Details
 * Elite-level deep dive into 100+ advanced statistics
 * Bloomberg Terminal-inspired data storytelling platform
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, Zap, Target, TrendingUp, Trophy, Activity } from 'lucide-react';
import { VisualMetricsGenerator } from '../utils/visualMetricsGenerator';
import { ELEVATION, TYPOGRAPHY, GRADIENTS, MOBILE_SPACING, TRANSITIONS, getEVColorScale } from '../utils/designSystem';
import { getStatDisplayName, getStatTooltip } from '../utils/statDisplayNames';
import GoalieMatchupSection from './GoalieMatchupSection';

const AdvancedMatchupDetails = ({ 
  awayTeam, 
  homeTeam, 
  dangerZoneData,
  reboundData,
  physicalData,
  possessionData,
  regressionData,
  awayGoalie, // Goalie stats for away team
  homeGoalie, // Goalie stats for home team
  isMobile,
  bestEdge, // For bet-specific prioritization
  statsAnalyzer // For league context
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Generate bet-specific Quick Hits
  const generateQuickHits = () => {
    const hits = [];
    const betType = bestEdge?.type || 'TOTAL';
    
    // Prioritize based on bet type
    if (betType === 'TOTAL' || betType === 'OVER' || betType === 'UNDER') {
      // Danger Zone insight (HIGH IMPACT for totals)
      if (dangerZoneData && dangerZoneData.away && dangerZoneData.home) {
        const awayHighDanger = dangerZoneData.away.high?.shots || 0;
        const homeHighDanger = dangerZoneData.home.high?.shots || 0;
        if (Math.abs(awayHighDanger - homeHighDanger) > 2) {
          const leader = awayHighDanger > homeHighDanger ? awayTeam : homeTeam;
          const diff = Math.abs(awayHighDanger - homeHighDanger).toFixed(1);
          hits.push(`${leader} generates ${diff} more high-danger chances per game`);
        }
      }
      
      // Physical play insight (HIGH IMPACT for totals)
      if (physicalData && physicalData.length > 0) {
        const blockMetric = physicalData.find(m => m.stat === 'Shot Blocks');
        if (blockMetric) {
          const leader = blockMetric.advantage === 'away' ? awayTeam : homeTeam;
          hits.push(`${leader} blocks ${blockMetric.diff} more shots per game`);
        }
      }
    }
    
    // Regression insight (MODERATE IMPACT for all bet types)
    if (regressionData && regressionData.away && regressionData.home) {
      const awayPDO = regressionData.away.pdo || 100;
      const homePDO = regressionData.home.pdo || 100;
      if (awayPDO > 102) {
        hits.push(`${awayTeam}'s PDO (${awayPDO.toFixed(1)}) suggests regression due`);
      } else if (homePDO > 102) {
        hits.push(`${homeTeam}'s PDO (${homePDO.toFixed(1)}) suggests regression due`);
      } else if (awayPDO < 98) {
        hits.push(`${awayTeam}'s PDO (${awayPDO.toFixed(1)}) indicates potential bounce-back`);
      } else if (homePDO < 98) {
        hits.push(`${homeTeam}'s PDO (${homePDO.toFixed(1)}) indicates potential bounce-back`);
      }
    }
    
    // Possession insight (HIGH IMPACT for ML bets, MODERATE for totals)
    if (possessionData && possessionData.away && possessionData.home && hits.length < 3) {
      const awayCorsi = possessionData.away.corsiPct || 50;
      const homeCorsi = possessionData.home.corsiPct || 50;
      if (Math.abs(awayCorsi - homeCorsi) > 5) {
        const leader = awayCorsi > homeCorsi ? awayTeam : homeTeam;
        const value = Math.max(awayCorsi, homeCorsi).toFixed(1);
        hits.push(`${leader} controls ${value}% of shot attempts (elite possession)`);
      }
    }
    
    return hits.slice(0, 3); // Max 3 quick hits
  };
  
  const quickHits = !isExpanded ? generateQuickHits() : [];

  return (
    <div style={{
      background: GRADIENTS.factors,
      border: ELEVATION.raised.border,
      boxShadow: ELEVATION.raised.shadow,
      borderRadius: MOBILE_SPACING.borderRadius,
      overflow: 'hidden',
      marginBottom: isMobile ? MOBILE_SPACING.sectionGap : '1.5rem',
      transition: TRANSITIONS.normal
    }}>
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="advanced-metrics-content"
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} advanced metrics section`}
        style={{
          width: '100%',
          padding: isMobile ? MOBILE_SPACING.cardPadding : '1.25rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: TRANSITIONS.normal
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{
            fontSize: isMobile ? TYPOGRAPHY.body.size : TYPOGRAPHY.heading.size,
            fontWeight: TYPOGRAPHY.heading.weight,
            color: 'var(--color-text-primary)',
            marginBottom: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            letterSpacing: TYPOGRAPHY.heading.letterSpacing
          }}>
            <Target size={20} style={{ color: 'var(--color-accent)' }} />
            Deep Dive: Advanced Metrics
          </div>
          <div style={{
            fontSize: TYPOGRAPHY.caption.size,
            color: 'var(--color-text-muted)',
            fontWeight: TYPOGRAPHY.caption.weight,
            lineHeight: TYPOGRAPHY.caption.lineHeight
          }}>
            {isExpanded 
              ? '7 statistical categories expanded' 
              : 'Danger zones, goalies, special teams, and more'}
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--color-accent)'
        }}>
          <span style={{
            fontSize: TYPOGRAPHY.label.size,
            fontWeight: TYPOGRAPHY.label.weight,
            textTransform: TYPOGRAPHY.label.textTransform,
            letterSpacing: TYPOGRAPHY.label.letterSpacing
          }}>
            {isExpanded ? 'Collapse' : 'Expand'}
          </span>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      
      {/* Quick Hits - Show when collapsed */}
      {!isExpanded && quickHits.length > 0 && (
        <div style={{
          padding: isMobile ? MOBILE_SPACING.cardPadding : '1.25rem',
          paddingTop: 0,
          borderTop: ELEVATION.flat.border
        }}>
          <div style={{
            fontSize: TYPOGRAPHY.label.size,
            fontWeight: TYPOGRAPHY.label.weight,
            color: 'var(--color-accent)',
            marginBottom: '0.75rem',
            textTransform: TYPOGRAPHY.label.textTransform,
            letterSpacing: TYPOGRAPHY.label.letterSpacing,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Zap size={16} />
            Quick Hits
          </div>
          <ul style={{
            margin: 0,
            padding: 0,
            listStyle: 'none'
          }}>
            {quickHits.map((hit, idx) => (
              <li key={idx} style={{
                fontSize: TYPOGRAPHY.body.size,
                color: 'var(--color-text-primary)',
                marginBottom: idx < quickHits.length - 1 ? '0.5rem' : 0,
                paddingLeft: '1.25rem',
                position: 'relative',
                lineHeight: TYPOGRAPHY.body.lineHeight,
                fontWeight: TYPOGRAPHY.body.weight
              }}>
                <span style={{
                  position: 'absolute',
                  left: 0,
                  color: 'var(--color-accent)',
                  fontWeight: TYPOGRAPHY.heading.weight
                }}>
                  •
                </span>
                {hit}
              </li>
            ))}
          </ul>
          <div style={{
            marginTop: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: ELEVATION.flat.border,
            textAlign: 'center'
          }}>
            <button
              onClick={() => setIsExpanded(true)}
              style={{
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                fontSize: TYPOGRAPHY.label.size,
                fontWeight: TYPOGRAPHY.body.weight,
                color: 'var(--color-accent)',
                cursor: 'pointer',
                transition: TRANSITIONS.normal
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              View Full Breakdown →
            </button>
          </div>
        </div>
      )}

      {/* Expandable Content */}
      {isExpanded && (
        <div 
          id="advanced-metrics-content"
          role="region"
          aria-label="Advanced metrics detailed breakdown"
          style={{
            padding: isMobile ? MOBILE_SPACING.cardPadding : '1.5rem',
            paddingTop: 0,
            borderTop: ELEVATION.flat.border,
            maxHeight: isExpanded ? '10000px' : '0',
            overflow: isExpanded ? 'visible' : 'hidden',
            transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* Danger Zone Breakdown */}
          {dangerZoneData && (
            <DangerZoneSection 
              data={dangerZoneData} 
              awayTeam={awayTeam} 
              homeTeam={homeTeam} 
              isMobile={isMobile}
              statsAnalyzer={statsAnalyzer}
            />
          )}

          {/* Goaltender Matchup - Always show, component handles waiting states */}
          <GoalieMatchupSection
            awayGoalie={awayGoalie}
            homeGoalie={homeGoalie}
            awayTeam={awayTeam}
            homeTeam={homeTeam}
            isMobile={isMobile}
          />

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

// ======================
// RANK BADGE COMPONENT (Phase 2)
// ======================
const RankBadge = ({ rank, total = 32 }) => {
  if (!rank) return null;
  
  const tier = rank <= 3 ? 'ELITE' : rank <= 10 ? 'STRONG' : rank <= 22 ? 'AVERAGE' : 'WEAK';
  const color = tier === 'ELITE' ? '#10B981' : tier === 'STRONG' ? '#0EA5E9' : 
                tier === 'AVERAGE' ? '#8B5CF6' : '#EF4444';
  
  return (
    <span style={{
      fontSize: TYPOGRAPHY.caption.size,
      fontWeight: TYPOGRAPHY.label.weight,
      color,
      background: `${color}20`,
      padding: '0.125rem 0.375rem',
      borderRadius: '4px',
      textTransform: 'uppercase',
      letterSpacing: '0.03em'
    }}>
      #{rank} {tier}
    </span>
  );
};

// ======================
// DANGER ZONE SECTION WITH EDGE BADGE
// ======================
const DangerZoneSection = ({ data, awayTeam, homeTeam, isMobile, statsAnalyzer }) => {
  // Calculate edge
  const awayHighDanger = data.away.high?.shots || 0;
  const homeHighDanger = data.home.high?.shots || 0;
  const hdDiff = Math.abs(awayHighDanger - homeHighDanger);
  const leader = awayHighDanger > homeHighDanger ? awayTeam : homeTeam;
  const loser = awayHighDanger > homeHighDanger ? homeTeam : awayTeam;
  const goalImpact = hdDiff * 0.23; // High danger shots are ~23% more likely to score
  
  return (
    <Section title="Shot Danger Distribution" icon={<Target size={18} />} isMobile={isMobile} importance="HIGH">
      {/* Edge Badge - Always Show */}
      <div style={{
        padding: isMobile ? MOBILE_SPACING.innerPadding : '0.875rem',
        background: hdDiff > 2
          ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)'
          : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
        border: hdDiff > 2
          ? '1px solid rgba(239, 68, 68, 0.3)'
          : '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '8px',
        marginBottom: isMobile ? MOBILE_SPACING.innerPadding : '1rem',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '0.375rem'
        }}>
          <Target size={20} color={hdDiff > 2 ? '#EF4444' : '#8B5CF6'} />
          <span style={{
            fontSize: TYPOGRAPHY.body.size,
            fontWeight: TYPOGRAPHY.heading.weight,
            color: hdDiff > 2 ? '#EF4444' : '#8B5CF6'
          }}>
            {hdDiff > 2
              ? `${leader} GENERATES MORE HIGH-DANGER SHOTS`
              : 'PRETTY EVEN MATCHUP - HIGH-DANGER CHANCES'
            }
          </span>
        </div>
        <div style={{
          fontSize: TYPOGRAPHY.caption.size,
          color: 'var(--color-text-secondary)',
          lineHeight: TYPOGRAPHY.body.lineHeight,
          fontStyle: 'italic',
          textAlign: 'center'
        }}>
          {hdDiff > 2
            ? `${hdDiff.toFixed(1)} more HD shots/game vs ${loser} • ~${goalImpact.toFixed(2)} goal impact`
            : 'Both teams generate similar high-danger opportunities. Expect tight scoring chances.'
          }
        </div>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: isMobile ? MOBILE_SPACING.innerPadding : '1rem',
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
          isMobile={isMobile}
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
          isMobile={isMobile}
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
          isMobile={isMobile}
        />
      </div>

      {data.analysis && (
        <div style={{
          padding: isMobile ? MOBILE_SPACING.innerPadding : '0.75rem',
          background: 'rgba(59, 130, 246, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '6px',
          fontSize: TYPOGRAPHY.label.size,
          color: 'var(--color-text-secondary)',
          fontStyle: 'italic',
          lineHeight: TYPOGRAPHY.body.lineHeight
        }}>
          💡 {data.analysis}
        </div>
      )}
    </Section>
  );
};

// Danger Card - Enhanced with thicker bars (Phase 3)
const DangerCard = ({ title, color, awayShots, homeShots, awayXg, homeXg, awayTeam, homeTeam, isMobile }) => {
  const maxShots = Math.max(awayShots, homeShots);
  const awayPct = maxShots > 0 ? (awayShots / maxShots) * 100 : 0;
  const homePct = maxShots > 0 ? (homeShots / maxShots) * 100 : 0;

  return (
    <div style={{
      padding: isMobile ? MOBILE_SPACING.innerPadding : '1rem',
      background: GRADIENTS.factors,
      border: `1px solid ${color}40`,
      borderRadius: '8px',
      transition: TRANSITIONS.normal
    }}>
      <div style={{
        fontSize: TYPOGRAPHY.label.size,
        fontWeight: TYPOGRAPHY.heading.weight,
        textTransform: TYPOGRAPHY.label.textTransform,
        letterSpacing: TYPOGRAPHY.label.letterSpacing,
        color: color,
        marginBottom: isMobile ? '0.5rem' : '0.75rem'
      }}>
        {title}
      </div>

      {/* Away Team */}
      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{
          fontSize: TYPOGRAPHY.caption.size,
          color: 'var(--color-text-secondary)',
          marginBottom: '0.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: TYPOGRAPHY.body.weight
        }}>
          <span>{awayTeam} OFF</span>
          <span style={{ fontWeight: TYPOGRAPHY.heading.weight, fontFeatureSettings: "'tnum'" }}>
            {awayShots} shots ({awayXg.toFixed(2)} xG)
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '12px', // Increased from 6px to 12px (Phase 3)
          background: 'rgba(100, 116, 139, 0.2)',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${awayPct}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${color} 0%, ${color}CC 100%)`, // Gradient fill (Phase 3)
            borderRadius: '6px',
            transition: TRANSITIONS.normal
          }} />
        </div>
      </div>

      {/* Home Team */}
      <div>
        <div style={{
          fontSize: TYPOGRAPHY.caption.size,
          color: 'var(--color-text-secondary)',
          marginBottom: '0.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: TYPOGRAPHY.body.weight
        }}>
          <span>{homeTeam} DEF</span>
          <span style={{ fontWeight: TYPOGRAPHY.heading.weight, fontFeatureSettings: "'tnum'" }}>
            {homeShots} shots ({homeXg.toFixed(2)} xG)
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '12px', // Increased from 6px to 12px (Phase 3)
          background: 'rgba(100, 116, 139, 0.2)',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${homePct}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${color} 0%, ${color}CC 100%)`, // Gradient fill (Phase 3)
            borderRadius: '6px',
            transition: TRANSITIONS.normal
          }} />
        </div>
      </div>
    </div>
  );
};

// ======================
// REBOUND SECTION WITH EDGE BADGE
// ======================
const ReboundSection = ({ data, awayTeam, homeTeam, isMobile }) => {
  // Calculate matchup edge
  const awayConversion = parseFloat(data.awayOffense.conversion) || 0;
  const homeControl = data.homeDefense.control;
  const reboundEdge = data.matchupEdge.favors;
  const leagueAvgConversion = 15;
  
  return (
    <Section title="Second-Chance Opportunities" icon={<Activity size={18} />} isMobile={isMobile} importance="HIGH">
      {/* Edge Badge - Always Show */}
      <div style={{
        padding: isMobile ? MOBILE_SPACING.innerPadding : '0.875rem',
        background: reboundEdge === 'away'
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)'
          : reboundEdge === 'home'
          ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)'
          : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
        border: reboundEdge === 'away'
          ? '1px solid rgba(16, 185, 129, 0.3)'
          : reboundEdge === 'home'
          ? '1px solid rgba(14, 165, 233, 0.3)'
          : '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '8px',
        marginBottom: isMobile ? MOBILE_SPACING.innerPadding : '1rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '0.375rem'
        }}>
          <Activity size={20} color={reboundEdge === 'away' ? '#10B981' : reboundEdge === 'home' ? '#0EA5E9' : '#8B5CF6'} />
          <span style={{
            fontSize: TYPOGRAPHY.body.size,
            fontWeight: TYPOGRAPHY.heading.weight,
            color: reboundEdge === 'away' ? '#10B981' : reboundEdge === 'home' ? '#0EA5E9' : '#8B5CF6'
          }}>
            {reboundEdge === 'away'
              ? `${awayTeam} OFFENSE CREATES MORE SECOND CHANCES`
              : reboundEdge === 'home'
              ? `${homeTeam} DEFENSE CONTROLS REBOUND POSITIONING`
              : 'PRETTY EVEN MATCHUP - REBOUND CONTROL'
            }
          </span>
        </div>
        <div style={{
          fontSize: TYPOGRAPHY.caption.size,
          color: 'var(--color-text-secondary)',
          lineHeight: TYPOGRAPHY.body.lineHeight,
          fontStyle: 'italic',
          textAlign: 'center'
        }}>
          {reboundEdge !== 'neutral'
            ? data.matchupEdge.summary
            : 'Both teams balanced in creating and controlling rebounds. No significant advantage.'
          }
        </div>
      </div>
      
      {/* Head-to-Head Matchup Layout */}
      <div style={{
        padding: isMobile ? MOBILE_SPACING.innerPadding : '1rem',
        background: GRADIENTS.factors,
        border: ELEVATION.flat.border,
        borderRadius: '8px',
        marginBottom: isMobile ? MOBILE_SPACING.innerPadding : '1rem'
      }}>
        <div style={{
          fontSize: TYPOGRAPHY.caption.size,
          fontWeight: TYPOGRAPHY.heading.weight,
          color: 'var(--color-text-muted)',
          marginBottom: '0.75rem',
          textTransform: TYPOGRAPHY.label.textTransform,
          letterSpacing: TYPOGRAPHY.label.letterSpacing,
          textAlign: 'center'
        }}>
          {awayTeam} OFFENSE vs {homeTeam} DEFENSE
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {/* Away Offense */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: TYPOGRAPHY.body.size,
              fontWeight: TYPOGRAPHY.heading.weight,
              color: awayConversion > leagueAvgConversion ? '#10B981' : '#EF4444',
              marginBottom: '0.25rem',
              fontFeatureSettings: "'tnum'"
            }}>
              {data.awayOffense.conversion}%
            </div>
            <div style={{
              fontSize: TYPOGRAPHY.caption.size,
              color: 'var(--color-text-muted)',
              marginBottom: '0.375rem'
            }}>
              Conversion
            </div>
            <div style={{
              fontSize: TYPOGRAPHY.caption.size,
              fontWeight: TYPOGRAPHY.body.weight,
              color: 'var(--color-text-primary)'
            }}>
              {data.awayOffense.rebounds} reb • {data.awayOffense.reboundXg} xG
            </div>
            {data.awayOffense.status && (
              <div style={{
                marginTop: '0.375rem',
                display: 'inline-block',
                padding: '0.125rem 0.375rem',
                borderRadius: '3px',
                background: data.awayOffense.status === 'Hot' ? '#10B98120' : 
                           data.awayOffense.status === 'Cold' ? '#EF444420' : '#64748B20',
                color: data.awayOffense.status === 'Hot' ? '#10B981' :
                       data.awayOffense.status === 'Cold' ? '#EF4444' : '#64748B',
                fontSize: TYPOGRAPHY.caption.size,
                fontWeight: TYPOGRAPHY.label.weight,
                textTransform: 'uppercase'
              }}>
                {data.awayOffense.status}
              </div>
            )}
          </div>
          
          {/* VS Arrow */}
          <div style={{
            fontSize: TYPOGRAPHY.subheading.size,
            color: 'var(--color-accent)',
            fontWeight: TYPOGRAPHY.heading.weight
          }}>
            →
          </div>
          
          {/* Home Defense */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: TYPOGRAPHY.body.size,
              fontWeight: TYPOGRAPHY.heading.weight,
              color: homeControl === 'Excellent' ? '#10B981' : '#64748B',
              marginBottom: '0.25rem'
            }}>
              {homeControl}
            </div>
            <div style={{
              fontSize: TYPOGRAPHY.caption.size,
              color: 'var(--color-text-muted)',
              marginBottom: '0.375rem'
            }}>
              Control
            </div>
            <div style={{
              fontSize: TYPOGRAPHY.caption.size,
              fontWeight: TYPOGRAPHY.body.weight,
              color: 'var(--color-text-primary)'
            }}>
              {data.homeDefense.rebounds} reb • {data.homeDefense.reboundXg} xG
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

// ======================
// PHYSICAL PLAY SECTION
// ======================
const PhysicalPlaySection = ({ data, awayTeam, homeTeam, isMobile }) => {
  // Calculate winner for summary (Phase 3)
  let winningTeam = awayTeam;
  let awayAdvantages = 0;
  let homeAdvantages = 0;
  
  data.forEach(metric => {
    if (metric.advantage === 'away') awayAdvantages++;
    if (metric.advantage === 'home') homeAdvantages++;
  });
  
  winningTeam = awayAdvantages > homeAdvantages ? awayTeam : homeTeam;
  const blockMetric = data.find(m => m.stat === 'Shot Blocks');
  const hitMetric = data.find(m => m.stat === 'Hits');
  
  return (
    <Section title="Physical Play & Defense" icon={<Shield size={18} />} isMobile={isMobile} importance="MODERATE">
      {/* Physical Matchup Summary (Phase 3) */}
      {(awayAdvantages !== homeAdvantages) && (
        <div style={{
          padding: isMobile ? MOBILE_SPACING.innerPadding : '0.875rem',
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '8px',
          marginBottom: isMobile ? MOBILE_SPACING.innerPadding : '1rem',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '0.375rem'
          }}>
            <Trophy size={20} color="var(--color-accent)" />
            <span style={{
              fontSize: TYPOGRAPHY.body.size,
              fontWeight: TYPOGRAPHY.heading.weight,
              color: 'var(--color-accent)'
            }}>
              {winningTeam} has the PHYSICAL EDGE
            </span>
          </div>
          {blockMetric && hitMetric && (
            <div style={{
              fontSize: TYPOGRAPHY.caption.size,
              color: 'var(--color-text-muted)',
              fontWeight: TYPOGRAPHY.caption.weight
            }}>
              {Math.abs(parseFloat(blockMetric.diff))} more blocks, {Math.abs(parseFloat(hitMetric.diff))} more hits
            </div>
          )}
        </div>
      )}
      
      <div style={{
        display: 'grid',
        gap: isMobile ? MOBILE_SPACING.innerPadding : '0.75rem'
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
            isMobile={isMobile}
          />
        ))}
      </div>
    </Section>
  );
};

// Physical Metric Row
const PhysicalMetricRow = ({ stat, awayValue, awayLabel, homeValue, homeLabel, advantage, diff, awayTeam, homeTeam, isMobile }) => {
  return (
    <div style={{
      padding: isMobile ? MOBILE_SPACING.innerPadding : '0.875rem',
      background: GRADIENTS.factors,
      border: ELEVATION.flat.border,
      borderRadius: '6px',
      transition: TRANSITIONS.normal
    }}>
      <div style={{
        fontSize: TYPOGRAPHY.caption.size,
        fontWeight: TYPOGRAPHY.heading.weight,
        color: 'var(--color-text-muted)',
        marginBottom: '0.625rem',
        textTransform: TYPOGRAPHY.label.textTransform,
        letterSpacing: TYPOGRAPHY.label.letterSpacing
      }}>
        {stat}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: isMobile ? '0.5rem' : '1rem',
        alignItems: 'center'
      }}>
        {/* Away */}
        <div style={{
          textAlign: 'left',
          color: advantage === 'away' ? '#10B981' : 'var(--color-text-secondary)',
          fontWeight: advantage === 'away' ? TYPOGRAPHY.heading.weight : TYPOGRAPHY.body.weight
        }}>
          <div style={{ 
            fontSize: TYPOGRAPHY.body.size, 
            fontFeatureSettings: "'tnum'",
            lineHeight: TYPOGRAPHY.body.lineHeight
          }}>
            {awayValue}
          </div>
          <div style={{ 
            fontSize: TYPOGRAPHY.caption.size, 
            opacity: 0.7,
            fontWeight: TYPOGRAPHY.caption.weight
          }}>
            {awayLabel}
          </div>
        </div>

        {/* Diff */}
        <div style={{
          fontSize: TYPOGRAPHY.caption.size,
          fontWeight: TYPOGRAPHY.heading.weight,
          color: 'var(--color-text-muted)',
          textAlign: 'center'
        }}>
          Δ {diff}
        </div>

        {/* Home */}
        <div style={{
          textAlign: 'right',
          color: advantage === 'home' ? '#10B981' : 'var(--color-text-secondary)',
          fontWeight: advantage === 'home' ? TYPOGRAPHY.heading.weight : TYPOGRAPHY.body.weight
        }}>
          <div style={{ 
            fontSize: TYPOGRAPHY.body.size, 
            fontFeatureSettings: "'tnum'",
            lineHeight: TYPOGRAPHY.body.lineHeight
          }}>
            {homeValue}
          </div>
          <div style={{ 
            fontSize: TYPOGRAPHY.caption.size, 
            opacity: 0.7,
            fontWeight: TYPOGRAPHY.caption.weight
          }}>
            {homeLabel}
          </div>
        </div>
      </div>
    </div>
  );
};

// ======================
// POSSESSION SECTION - VISUAL FLOW CHART WITH EDGE BADGE (Phase 3 + 4)
// ======================
const PossessionSection = ({ data, awayTeam, homeTeam, isMobile }) => {
  const awayCorsi = data.away?.corsiPct || 50;
  const homeCorsi = data.home?.corsiPct || 50;
  const awayFenwick = data.away?.fenwickPct || 50;
  const homeFenwick = data.home?.fenwickPct || 50;
  const awayXG = data.away?.xGoalsPct || 50;
  const homeXG = data.home?.xGoalsPct || 50;
  const awayFO = data.away?.faceoffPct || 50;
  const homeFO = data.home?.faceoffPct || 50;
  
  // Determine winner
  const avgAwayPossession = (awayCorsi + awayFenwick + awayXG) / 3;
  const avgHomePossession = (homeCorsi + homeFenwick + homeXG) / 3;
  const possessionWinner = avgAwayPossession > avgHomePossession ? awayTeam : homeTeam;
  const possessionDiff = Math.abs(avgAwayPossession - avgHomePossession).toFixed(1);
  const possessionLoser = avgAwayPossession > avgHomePossession ? homeTeam : awayTeam;
  
  return (
    <Section title="Possession & Control" icon={<TrendingUp size={18} />} isMobile={isMobile} importance="MODERATE">
      {/* Edge Badge - Always Show */}
      <div style={{
        padding: isMobile ? MOBILE_SPACING.innerPadding : '0.875rem',
        background: possessionDiff > 3
          ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)'
          : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
        border: possessionDiff > 3
          ? '1px solid rgba(14, 165, 233, 0.3)'
          : '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '8px',
        marginBottom: isMobile ? MOBILE_SPACING.innerPadding : '1rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '0.375rem'
        }}>
          <TrendingUp size={20} color={possessionDiff > 3 ? '#0EA5E9' : '#8B5CF6'} />
          <span style={{
            fontSize: TYPOGRAPHY.body.size,
            fontWeight: TYPOGRAPHY.heading.weight,
            color: possessionDiff > 3 ? '#0EA5E9' : '#8B5CF6'
          }}>
            {possessionDiff > 3
              ? `${possessionWinner} CONTROLS POSSESSION`
              : 'PRETTY EVEN MATCHUP - POSSESSION'
            }
          </span>
        </div>
        <div style={{
          fontSize: TYPOGRAPHY.caption.size,
          color: 'var(--color-text-secondary)',
          lineHeight: TYPOGRAPHY.body.lineHeight,
          fontStyle: 'italic',
          textAlign: 'center'
        }}>
          {possessionDiff > 3
            ? `${possessionDiff}% advantage in shot attempts. More zone time = more scoring chances.`
            : 'Both teams control the puck equally. Possession unlikely to be a deciding factor.'
          }
        </div>
      </div>
      
      {/* Visual Flow Bars */}
      <PossessionFlowMetric
        label="Shot Attempts (Corsi)"
        awayValue={awayCorsi}
        homeValue={homeCorsi}
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        isMobile={isMobile}
      />
      <PossessionFlowMetric
        label="Unblocked Shots (Fenwick)"
        awayValue={awayFenwick}
        homeValue={homeFenwick}
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        isMobile={isMobile}
      />
      <PossessionFlowMetric
        label="Expected Goals Share"
        awayValue={awayXG}
        homeValue={homeXG}
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        isMobile={isMobile}
      />
      
      {/* Faceoff % as Circular Indicator */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: isMobile ? MOBILE_SPACING.innerPadding : '1rem',
        marginTop: isMobile ? MOBILE_SPACING.innerPadding : '1rem'
      }}>
        <FaceoffCircle team={awayTeam} percentage={awayFO} isMobile={isMobile} />
        <FaceoffCircle team={homeTeam} percentage={homeFO} isMobile={isMobile} />
      </div>
    </Section>
  );
};

// Possession Flow Metric - Visual horizontal bar
const PossessionFlowMetric = ({ label, awayValue, homeValue, awayTeam, homeTeam, isMobile }) => {
  const leagueAvg = 50;
  const awayColor = awayValue > homeValue ? '#10B981' : '#64748B';
  const homeColor = homeValue > awayValue ? '#10B981' : '#64748B';
  
  return (
    <div style={{
      marginBottom: isMobile ? MOBILE_SPACING.innerPadding : '1rem',
      padding: isMobile ? MOBILE_SPACING.innerPadding : '0.875rem',
      background: GRADIENTS.factors,
      border: ELEVATION.flat.border,
      borderRadius: '8px'
    }}>
      <div style={{
        fontSize: TYPOGRAPHY.caption.size,
        fontWeight: TYPOGRAPHY.heading.weight,
        color: 'var(--color-text-muted)',
        marginBottom: '0.75rem',
        textTransform: TYPOGRAPHY.label.textTransform,
        letterSpacing: TYPOGRAPHY.label.letterSpacing,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>{label}</span>
        <span style={{ fontSize: TYPOGRAPHY.caption.size, color: 'rgba(212, 175, 55, 0.8)' }}>
          League Avg: {leagueAvg}%
        </span>
      </div>
      
      {/* Away Team Bar */}
      <div style={{ marginBottom: '0.625rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0.25rem',
          fontSize: TYPOGRAPHY.caption.size
        }}>
          <span style={{ fontWeight: TYPOGRAPHY.body.weight, color: 'var(--color-text-primary)' }}>
            {awayTeam}
          </span>
          <span style={{ 
            fontWeight: TYPOGRAPHY.heading.weight, 
            color: awayColor,
            fontFeatureSettings: "'tnum'"
          }}>
            {awayValue.toFixed(1)}%
            {awayValue > leagueAvg && (
              <span style={{ color: '#10B981', marginLeft: '0.25rem' }}>↑</span>
            )}
            {awayValue < leagueAvg && (
              <span style={{ color: '#EF4444', marginLeft: '0.25rem' }}>↓</span>
            )}
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '10px',
          background: 'rgba(100, 116, 139, 0.2)',
          borderRadius: '5px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* League average marker */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'rgba(212, 175, 55, 0.6)',
            zIndex: 2
          }} />
          {/* Progress bar */}
          <div style={{
            width: `${awayValue}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${awayColor} 0%, ${awayColor}CC 100%)`,
            borderRadius: '5px',
            transition: TRANSITIONS.normal,
            position: 'relative',
            zIndex: 1
          }} />
        </div>
      </div>
      
      {/* Home Team Bar */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0.25rem',
          fontSize: TYPOGRAPHY.caption.size
        }}>
          <span style={{ fontWeight: TYPOGRAPHY.body.weight, color: 'var(--color-text-primary)' }}>
            {homeTeam}
          </span>
          <span style={{ 
            fontWeight: TYPOGRAPHY.heading.weight, 
            color: homeColor,
            fontFeatureSettings: "'tnum'"
          }}>
            {homeValue.toFixed(1)}%
            {homeValue > leagueAvg && (
              <span style={{ color: '#10B981', marginLeft: '0.25rem' }}>↑</span>
            )}
            {homeValue < leagueAvg && (
              <span style={{ color: '#EF4444', marginLeft: '0.25rem' }}>↓</span>
            )}
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '10px',
          background: 'rgba(100, 116, 139, 0.2)',
          borderRadius: '5px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* League average marker */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'rgba(212, 175, 55, 0.6)',
            zIndex: 2
          }} />
          {/* Progress bar */}
          <div style={{
            width: `${homeValue}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${homeColor} 0%, ${homeColor}CC 100%)`,
            borderRadius: '5px',
            transition: TRANSITIONS.normal,
            position: 'relative',
            zIndex: 1
          }} />
        </div>
      </div>
    </div>
  );
};

// Faceoff Circle - Circular progress indicator
const FaceoffCircle = ({ team, percentage, isMobile }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (percentage / 100) * circumference;
  const color = percentage > 50 ? '#10B981' : percentage < 50 ? '#EF4444' : '#8B5CF6';
  
  return (
    <div style={{
      padding: isMobile ? MOBILE_SPACING.innerPadding : '1rem',
      background: GRADIENTS.factors,
      border: ELEVATION.flat.border,
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        fontSize: TYPOGRAPHY.caption.size,
        fontWeight: TYPOGRAPHY.heading.weight,
        color: 'var(--color-text-muted)',
        marginBottom: '0.5rem',
        textTransform: TYPOGRAPHY.label.textTransform,
        letterSpacing: TYPOGRAPHY.label.letterSpacing
      }}>
        {team} Faceoffs
      </div>
      <svg width="100" height="100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(100, 116, 139, 0.2)"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: TRANSITIONS.slow }}
        />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: TYPOGRAPHY.subheading.size,
            fontWeight: TYPOGRAPHY.heading.weight,
            fill: color,
            fontFeatureSettings: "'tnum'"
          }}
        >
          {percentage.toFixed(1)}%
        </text>
      </svg>
    </div>
  );
};

// ======================
// REGRESSION SECTION - WITH EXPLANATIONS (Phase 3)
// ======================
const RegressionSection = ({ data, awayTeam, homeTeam, isMobile }) => {
  return (
    <Section title="Luck & Regression Indicators" icon={<TrendingUp size={18} />} isMobile={isMobile} importance="MODERATE">
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? MOBILE_SPACING.innerPadding : '1rem'
      }}>
        <RegressionCard
          team={awayTeam}
          pdo={data.away?.pdo || 100}
          shootingPct={data.away?.shootingPct || 10}
          savePct={data.away?.savePct || 90}
          goalsVsXg={data.away?.goalsVsExpected || 0}
          isMobile={isMobile}
        />
        <RegressionCard
          team={homeTeam}
          pdo={data.home?.pdo || 100}
          shootingPct={data.home?.shootingPct || 10}
          savePct={data.home?.savePct || 90}
          goalsVsXg={data.home?.goalsVsExpected || 0}
          isMobile={isMobile}
        />
      </div>
    </Section>
  );
};

// Regression Card - WITH CLEAR BETTER/WORSE INDICATORS
const RegressionCard = ({ team, pdo, shootingPct, savePct, goalsVsXg, isMobile }) => {
  // Determine regression direction and explanation
  const getRegressionOutlook = () => {
    if (pdo > 104) {
      return {
        status: 'LIKELY TO DECLINE',
        color: '#EF4444',
        icon: '📉',
        explanation: 'PDO >104 indicates unsustainable luck. Expect fewer goals.',
        arrow: '↘️'
      };
    } else if (pdo > 102) {
      return {
        status: 'MILD DECLINE LIKELY',
        color: '#F59E0B',
        icon: '⚠️',
        explanation: 'PDO >102 suggests slight overperformance. Some regression expected.',
        arrow: '↘️'
      };
    } else if (pdo < 96) {
      return {
        status: 'LIKELY TO IMPROVE',
        color: '#10B981',
        icon: '📈',
        explanation: 'PDO <96 indicates bad luck. Expect more goals.',
        arrow: '↗️'
      };
    } else if (pdo < 98) {
      return {
        status: 'MILD IMPROVEMENT LIKELY',
        color: '#0EA5E9',
        icon: '⬆️',
        explanation: 'PDO <98 suggests slight underperformance. Some improvement expected.',
        arrow: '↗️'
      };
    } else {
      return {
        status: 'SUSTAINABLE',
        color: '#8B5CF6',
        icon: '✓',
        explanation: 'PDO 98-102 indicates sustainable performance.',
        arrow: '→'
      };
    }
  };
  
  const outlook = getRegressionOutlook();
  
  return (
    <div style={{
      padding: isMobile ? MOBILE_SPACING.innerPadding : '1rem',
      background: GRADIENTS.factors,
      border: ELEVATION.flat.border,
      borderRadius: '8px'
    }}>
      <div style={{
        fontSize: TYPOGRAPHY.caption.size,
        fontWeight: TYPOGRAPHY.heading.weight,
        color: 'var(--color-text-muted)',
        marginBottom: '0.5rem',
        textTransform: TYPOGRAPHY.label.textTransform,
        letterSpacing: TYPOGRAPHY.label.letterSpacing
      }}>
        {team}
      </div>

      {/* Regression Outlook Banner */}
      <div style={{
        padding: isMobile ? MOBILE_SPACING.innerPadding : '0.75rem',
        background: `${outlook.color}15`,
        border: `1px solid ${outlook.color}40`,
        borderRadius: '6px',
        marginBottom: isMobile ? '0.5rem' : '0.75rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.375rem'
        }}>
          <span style={{ fontSize: TYPOGRAPHY.body.size }}>{outlook.icon}</span>
          <span style={{
            fontSize: TYPOGRAPHY.caption.size,
            fontWeight: TYPOGRAPHY.heading.weight,
            color: outlook.color,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {outlook.status}
          </span>
        </div>
        <div style={{
          fontSize: TYPOGRAPHY.caption.size,
          color: 'var(--color-text-secondary)',
          lineHeight: TYPOGRAPHY.body.lineHeight,
          fontStyle: 'italic'
        }}>
          {outlook.explanation}
        </div>
      </div>

      <StatRow 
        label={`PDO ${outlook.arrow}`}
        value={pdo.toFixed(1)}
        badge={pdo > 102 ? 'Hot' : pdo < 98 ? 'Cold' : 'Average'}
        badgeColor={outlook.color}
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

// ======================
// REUSABLE COMPONENTS
// ======================
const Section = ({ title, icon, children, isMobile, importance }) => {
  const importanceColors = {
    'HIGH': 'var(--color-accent)',
    'MODERATE': '#0EA5E9',
    'LOW': '#8B5CF6'
  };
  
  return (
    <div style={{ marginBottom: isMobile ? MOBILE_SPACING.sectionGap : '1.5rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.5rem',
        marginBottom: isMobile ? '0.5rem' : '1rem',
        paddingBottom: '0.5rem',
        borderBottom: ELEVATION.flat.border
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ color: 'var(--color-accent)' }}>{icon}</div>
          <h4 style={{
            fontSize: isMobile ? TYPOGRAPHY.body.size : TYPOGRAPHY.subheading.size,
            fontWeight: TYPOGRAPHY.heading.weight,
            color: 'var(--color-text-primary)',
            margin: 0,
            lineHeight: TYPOGRAPHY.heading.lineHeight
          }}>
            {title}
          </h4>
        </div>
        {importance && (
          <span style={{
            fontSize: TYPOGRAPHY.caption.size,
            fontWeight: TYPOGRAPHY.label.weight,
            color: importanceColors[importance],
            textTransform: TYPOGRAPHY.label.textTransform,
            letterSpacing: TYPOGRAPHY.label.letterSpacing
          }}>
            {importance}
          </span>
        )}
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
        fontSize: TYPOGRAPHY.caption.size,
        color: 'var(--color-text-muted)',
        fontWeight: TYPOGRAPHY.caption.weight,
        lineHeight: TYPOGRAPHY.caption.lineHeight
      }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{
          fontSize: TYPOGRAPHY.body.size,
          fontWeight: TYPOGRAPHY.heading.weight,
          color: 'var(--color-text-primary)',
          fontFeatureSettings: "'tnum'",
          lineHeight: TYPOGRAPHY.body.lineHeight
        }}>
          {value}
        </span>
        {badge && (
          <span style={{
            fontSize: TYPOGRAPHY.caption.size,
            fontWeight: TYPOGRAPHY.label.weight,
            textTransform: TYPOGRAPHY.label.textTransform,
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
