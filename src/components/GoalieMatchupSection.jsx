import React from 'react';
import { Shield } from 'lucide-react';
import { ELEVATION, TYPOGRAPHY, MOBILE_SPACING, GRADIENTS, TRANSITIONS } from '../utils/designSystem';

const GoalieMatchupSection = ({ awayGoalie, homeGoalie, awayTeam, homeTeam, isMobile }) => {
  // Check if goalies are confirmed
  const awayConfirmed = awayGoalie && awayGoalie.name;
  const homeConfirmed = homeGoalie && homeGoalie.name;
  
  // If neither goalie confirmed, show waiting state
  if (!awayConfirmed && !homeConfirmed) {
    return (
      <Section title="Goaltender Matchup" icon={<Shield size={18} />} isMobile={isMobile} importance="HIGH">
        <div style={{
          padding: isMobile ? MOBILE_SPACING.innerPadding : '1.5rem',
          textAlign: 'center',
          background: GRADIENTS.factors,
          border: ELEVATION.flat.border,
          borderRadius: '8px'
        }}>
          <div style={{
            fontSize: '2.5rem',
            marginBottom: '0.75rem'
          }}>
            ⏳
          </div>
          <div style={{
            fontSize: TYPOGRAPHY.subheading.size,
            fontWeight: TYPOGRAPHY.heading.weight,
            color: 'var(--color-text-primary)',
            marginBottom: '0.5rem'
          }}>
            Waiting for Goalie Confirmation
          </div>
          <div style={{
            fontSize: TYPOGRAPHY.body.size,
            color: 'var(--color-text-muted)',
            lineHeight: TYPOGRAPHY.body.lineHeight
          }}>
            Starting goalies typically confirmed 1-2 hours before game time.
            Check back closer to puck drop.
          </div>
        </div>
      </Section>
    );
  }
  
  // If only one goalie confirmed, show partial state
  if (!awayConfirmed || !homeConfirmed) {
    return (
      <Section title="Goaltender Matchup" icon={<Shield size={18} />} isMobile={isMobile} importance="HIGH">
        <div style={{
          padding: isMobile ? MOBILE_SPACING.innerPadding : '1.5rem',
          textAlign: 'center',
          background: GRADIENTS.factors,
          border: ELEVATION.flat.border,
          borderRadius: '8px'
        }}>
          <div style={{
            fontSize: '2rem',
            marginBottom: '0.75rem'
          }}>
            ⏳
          </div>
          <div style={{
            fontSize: TYPOGRAPHY.body.size,
            color: 'var(--color-text-muted)',
            marginBottom: '1rem'
          }}>
            {awayConfirmed ? `✅ ${awayTeam} goalie confirmed` : `⏳ ${awayTeam} goalie TBD`}
            {' • '}
            {homeConfirmed ? `✅ ${homeTeam} goalie confirmed` : `⏳ ${homeTeam} goalie TBD`}
          </div>
          
          {/* Show confirmed goalie if available */}
          {awayConfirmed && (
            <div style={{
              fontSize: TYPOGRAPHY.subheading.size,
              fontWeight: TYPOGRAPHY.heading.weight,
              color: 'var(--color-text-primary)',
              marginTop: '0.5rem'
            }}>
              {awayGoalie.name} ({awayTeam})
            </div>
          )}
          {homeConfirmed && (
            <div style={{
              fontSize: TYPOGRAPHY.subheading.size,
              fontWeight: TYPOGRAPHY.heading.weight,
              color: 'var(--color-text-primary)',
              marginTop: '0.5rem'
            }}>
              {homeGoalie.name} ({homeTeam})
            </div>
          )}
        </div>
      </Section>
    );
  }
  
  // Both goalies confirmed - check if we have stats for both
  const awayHasStats = awayGoalie && awayGoalie.gsae !== undefined;
  const homeHasStats = homeGoalie && homeGoalie.gsae !== undefined;
  
  // If ONLY ONE goalie has stats, show single goalie breakdown
  if ((awayHasStats && !homeHasStats) || (!awayHasStats && homeHasStats)) {
    const goalie = awayHasStats ? awayGoalie : homeGoalie;
    const team = awayHasStats ? awayTeam : homeTeam;
    const opponent = awayHasStats ? homeTeam : awayTeam;
    const opponentGoalie = awayHasStats ? homeGoalie : awayGoalie;
    
    const gsae = parseFloat(goalie.gsae) || 0;
    const tier = gsae > 10 ? 'ELITE' : gsae > 5 ? 'STRONG' : gsae > -5 ? 'AVERAGE' : 'WEAK';
    const tierColor = gsae > 10 ? '#10B981' : gsae > 5 ? '#60A5FA' : gsae > -5 ? '#8B5CF6' : '#EF4444';
    
    return (
      <Section title="Goaltender Matchup" icon={<Shield size={18} />} isMobile={isMobile} importance="HIGH">
        {/* Edge Badge */}
        <div style={{
          padding: isMobile ? MOBILE_SPACING.innerPadding : '1rem',
          background: `linear-gradient(135deg, ${tierColor}15 0%, ${tierColor}08 100%)`,
          border: `1px solid ${tierColor}40`,
          borderRadius: '8px',
          marginBottom: isMobile ? MOBILE_SPACING.innerPadding : '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem'
          }}>
            <Shield size={20} color={tierColor} />
            <span style={{
              fontSize: TYPOGRAPHY.body.size,
              fontWeight: TYPOGRAPHY.heading.weight,
              color: tierColor
            }}>
              {tier} GOALTENDER - {team}
            </span>
          </div>
          <div style={{
            fontSize: TYPOGRAPHY.caption.size,
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            {goalie.name} • {gsae >= 0 ? '+' : ''}{gsae.toFixed(2)} GSAE • {opponent} goalie stats unavailable
          </div>
        </div>
        
        {/* Single Goalie Card - Enhanced */}
        <GoalieCard goalie={goalie} team={team} isMobile={isMobile} isAway={false} />
        
        {/* Opponent Status */}
        <div style={{
          marginTop: isMobile ? MOBILE_SPACING.innerPadding : '1rem',
          padding: isMobile ? '0.75rem' : '1rem',
          background: 'rgba(139, 92, 246, 0.08)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: TYPOGRAPHY.body.size,
            color: 'var(--color-text-secondary)',
            marginBottom: '0.25rem'
          }}>
            <strong>{opponent}</strong> {opponentGoalie?.name || 'Goalie'}
          </div>
          <div style={{
            fontSize: TYPOGRAPHY.caption.size,
            color: 'var(--color-text-muted)',
            fontStyle: 'italic'
          }}>
            Advanced stats not yet available
          </div>
        </div>
      </Section>
    );
  }
  
  // If NEITHER goalie has stats, show waiting message
  if (!awayHasStats && !homeHasStats) {
    return (
      <Section title="Goaltender Matchup" icon={<Shield size={18} />} isMobile={isMobile} importance="HIGH">
        <div style={{
          padding: isMobile ? MOBILE_SPACING.innerPadding : '1.5rem',
          textAlign: 'center',
          background: GRADIENTS.factors,
          border: ELEVATION.flat.border,
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📊</div>
          <div style={{
            fontSize: TYPOGRAPHY.subheading.size,
            fontWeight: TYPOGRAPHY.heading.weight,
            color: 'var(--color-text-primary)',
            marginBottom: '0.5rem'
          }}>
            {awayTeam} {awayGoalie?.name || 'TBD'} vs {homeTeam} {homeGoalie?.name || 'TBD'}
          </div>
          <div style={{
            fontSize: TYPOGRAPHY.body.size,
            color: 'var(--color-text-muted)',
            lineHeight: TYPOGRAPHY.body.lineHeight
          }}>
            Advanced goalie statistics not yet available for these netminders. Check back later for detailed analytics.
          </div>
        </div>
      </Section>
    );
  }
  
  // Both goalies confirmed with stats - show full analytics section
  // Calculate matchup edge
  const awayGSAE = parseFloat(awayGoalie.gsae) || 0;
  const homeGSAE = parseFloat(homeGoalie.gsae) || 0;
  const gsaeDiff = Math.abs(awayGSAE - homeGSAE);
  const goalieEdgeTeam = awayGSAE > homeGSAE ? awayTeam : homeTeam;
  const expectedGoalImpact = gsaeDiff / 10; // Rough estimate: 10 GSAE = 1 goal per game
  
  // Determine tier for both goalies
  const awayTier = awayGSAE > 10 ? 'ELITE' : awayGSAE > 5 ? 'STRONG' : awayGSAE > -5 ? 'AVERAGE' : 'WEAK';
  const homeTier = homeGSAE > 10 ? 'ELITE' : homeGSAE > 5 ? 'STRONG' : homeGSAE > -5 ? 'AVERAGE' : 'WEAK';
  
  return (
    <Section title="Goaltender Matchup" icon={<Shield size={18} />} isMobile={isMobile} importance="HIGH">
      {/* Enhanced Edge Badge */}
      <div style={{
        padding: isMobile ? MOBILE_SPACING.innerPadding : '1.125rem',
        background: gsaeDiff > 5
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.06) 100%)'
          : 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(139, 92, 246, 0.06) 100%)',
        border: gsaeDiff > 5
          ? '1px solid rgba(16, 185, 129, 0.35)'
          : '1px solid rgba(139, 92, 246, 0.35)',
        borderRadius: '10px',
        marginBottom: isMobile ? MOBILE_SPACING.innerPadding : '1.25rem',
        boxShadow: gsaeDiff > 5
          ? '0 4px 12px rgba(16, 185, 129, 0.1)'
          : '0 4px 12px rgba(139, 92, 246, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.625rem',
          marginBottom: '0.5rem'
        }}>
          <Shield size={22} color={gsaeDiff > 5 ? '#10B981' : '#8B5CF6'} strokeWidth={2.5} />
          <span style={{
            fontSize: isMobile ? '0.95rem' : '1.05rem',
            fontWeight: '700',
            color: gsaeDiff > 5 ? '#10B981' : '#8B5CF6',
            letterSpacing: '0.5px'
          }}>
            {gsaeDiff > 5
              ? `${goalieEdgeTeam} HAS GOALIE ADVANTAGE`
              : 'PRETTY EVEN GOALIE MATCHUP'
            }
          </span>
        </div>
        <div style={{
          fontSize: TYPOGRAPHY.caption.size,
          color: 'var(--color-text-secondary)',
          lineHeight: TYPOGRAPHY.body.lineHeight,
          fontStyle: 'italic',
          textAlign: 'center',
          paddingTop: '0.25rem',
          borderTop: gsaeDiff > 5 
            ? '1px solid rgba(16, 185, 129, 0.2)' 
            : '1px solid rgba(139, 92, 246, 0.2)'
        }}>
          {gsaeDiff > 5
            ? `${gsaeDiff.toFixed(1)} GSAE difference • Expected impact: ~${expectedGoalImpact.toFixed(2)} goals`
            : 'Both goalies performing at similar levels. Goaltending unlikely to be deciding factor.'
          }
        </div>
      </div>
      
      {/* Head-to-Head Goalie Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr auto 1fr',
        gap: isMobile ? MOBILE_SPACING.innerPadding : '1.5rem',
        alignItems: 'stretch'
      }}>
        {/* Away Goalie */}
        <GoalieCard goalie={awayGoalie} team={awayTeam} isMobile={isMobile} isAway={true} />
        
        {/* VS Divider */}
        {!isMobile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: TYPOGRAPHY.heading.size,
            fontWeight: TYPOGRAPHY.heading.weight,
            color: 'var(--color-accent)',
            padding: '0 0.5rem'
          }}>
            VS
          </div>
        )}
        
        {/* Home Goalie */}
        <GoalieCard goalie={homeGoalie} team={homeTeam} isMobile={isMobile} isAway={false} />
      </div>
      
      {/* Advanced Breakdown - Danger Zone Save % */}
      <div style={{
        marginTop: isMobile ? MOBILE_SPACING.innerPadding : '1rem',
        padding: isMobile ? MOBILE_SPACING.innerPadding : '1rem',
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
          letterSpacing: TYPOGRAPHY.label.letterSpacing
        }}>
          SAVE PERCENTAGE BY DANGER ZONE
        </div>
        
        <DangerZoneSaveComparison
          awayGoalie={awayGoalie}
          homeGoalie={homeGoalie}
          awayTeam={awayTeam}
          homeTeam={homeTeam}
          isMobile={isMobile}
        />
      </div>
    </Section>
  );
};

// Goalie Card Component
const GoalieCard = ({ goalie, team, isMobile, isAway }) => {
  const gsae = parseFloat(goalie.gsae) || 0;
  const rankData = getGoalieRank(gsae);
  const isElite = rankData.tier === 'ELITE';
  const isStrong = rankData.tier === 'STRONG';
  
  return (
    <div style={{
      padding: isMobile ? MOBILE_SPACING.innerPadding : '1rem',
      background: GRADIENTS.factors,
      border: ELEVATION.flat.border,
      borderRadius: '8px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Goalie Name Header */}
      <div style={{
        marginBottom: '0.75rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '0.5rem'
      }}>
        <div style={{
          fontSize: TYPOGRAPHY.subheading.size,
          fontWeight: TYPOGRAPHY.heading.weight,
          color: 'var(--color-text-primary)',
          marginBottom: '0.25rem'
        }}>
          {goalie.name}
        </div>
        <div style={{
          fontSize: TYPOGRAPHY.caption.size,
          color: 'var(--color-text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          <span>{team}</span>
          <span>•</span>
          <span>{goalie.gamesPlayed} GP</span>
          {goalie.recentForm && goalie.recentForm !== 'Limited Sample' && (
            <>
              <span>•</span>
              <span style={{
                color: goalie.recentForm === 'Hot' ? '#10B981' : 
                       goalie.recentForm === 'Cold' ? '#EF4444' : '#8B5CF6',
                fontWeight: TYPOGRAPHY.label.weight
              }}>
                {goalie.recentForm}
              </span>
            </>
          )}
        </div>
      </div>
      
      {/* GSAE - Primary Metric */}
      <div style={{
        textAlign: 'center',
        marginBottom: '1rem',
        padding: '0.75rem',
        background: isElite ? 'rgba(16, 185, 129, 0.1)' :
                    isStrong ? 'rgba(14, 165, 233, 0.1)' :
                    'rgba(139, 92, 246, 0.05)',
        borderRadius: '6px'
      }}>
        <div style={{
          fontSize: TYPOGRAPHY.caption.size,
          color: 'var(--color-text-muted)',
          marginBottom: '0.25rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Goals Saved Above Expected
        </div>
        <div style={{
          fontSize: '2rem',
          fontWeight: TYPOGRAPHY.heading.weight,
          color: isElite ? '#10B981' :
                 isStrong ? '#0EA5E9' :
                 gsae > 0 ? '#8B5CF6' : '#EF4444',
          fontFeatureSettings: "'tnum'",
          marginBottom: '0.25rem'
        }}>
          {gsae > 0 ? '+' : ''}{goalie.gsae}
        </div>
        <RankBadge rank={rankData.rank} tier={rankData.tier} />
      </div>
      
      {/* Key Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.5rem',
        marginBottom: '0.75rem'
      }}>
        <StatBox label="Save %" value={`${goalie.savePct}%`} />
        <StatBox label="HD Sv%" value={`${goalie.hdSavePct}%`} isHighlight={true} />
        <StatBox label="xGA/GP" value={goalie.xGoalsAgainst} />
        <StatBox label="GA/GP" value={goalie.goalsAgainst} />
      </div>
      
      {/* Rebound Control */}
      <div style={{
        padding: '0.5rem',
        background: 'rgba(59, 130, 246, 0.08)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '4px',
        fontSize: TYPOGRAPHY.caption.size,
        textAlign: 'center'
      }}>
        <span style={{ color: 'var(--color-text-muted)' }}>Rebound Control: </span>
        <span style={{
          color: goalie.reboundControl === 'Excellent' ? '#10B981' :
                 goalie.reboundControl === 'Poor' ? '#EF4444' : '#8B5CF6',
          fontWeight: TYPOGRAPHY.label.weight
        }}>
          {goalie.reboundControl}
        </span>
      </div>
    </div>
  );
};

// Danger Zone Save Comparison
const DangerZoneSaveComparison = ({ awayGoalie, homeGoalie, awayTeam, homeTeam, isMobile }) => {
  const zones = [
    { 
      label: 'Low Danger', 
      away: parseFloat(awayGoalie.lowDangerSavePct) || 97.0, 
      home: parseFloat(homeGoalie.lowDangerSavePct) || 97.0, 
      color: '#64748B' 
    },
    { 
      label: 'Medium Danger', 
      away: parseFloat(awayGoalie.mediumDangerSavePct) || 92.0, 
      home: parseFloat(homeGoalie.mediumDangerSavePct) || 92.0, 
      color: '#F59E0B' 
    },
    { 
      label: 'High Danger', 
      away: parseFloat(awayGoalie.hdSavePct) || 85.0, 
      home: parseFloat(homeGoalie.hdSavePct) || 85.0, 
      color: '#EF4444' 
    }
  ];
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {zones.map((zone, idx) => (
        <div key={idx}>
          <div style={{
            fontSize: TYPOGRAPHY.caption.size,
            color: zone.color,
            marginBottom: '0.375rem',
            fontWeight: TYPOGRAPHY.label.weight
          }}>
            {zone.label}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '0.5rem',
            alignItems: 'center'
          }}>
            <div style={{ textAlign: 'right', fontSize: TYPOGRAPHY.body.size, fontWeight: TYPOGRAPHY.body.weight }}>
              <span style={{ 
                color: zone.away > zone.home ? '#10B981' : 'var(--color-text-secondary)',
                fontFeatureSettings: "'tnum'"
              }}>
                {zone.away.toFixed(1)}%
              </span>
              <span style={{ fontSize: TYPOGRAPHY.caption.size, color: 'var(--color-text-muted)', marginLeft: '0.25rem' }}>
                {awayTeam}
              </span>
            </div>
            <div style={{ fontSize: TYPOGRAPHY.caption.size, color: 'var(--color-text-muted)' }}>
              vs
            </div>
            <div style={{ textAlign: 'left', fontSize: TYPOGRAPHY.body.size, fontWeight: TYPOGRAPHY.body.weight }}>
              <span style={{ fontSize: TYPOGRAPHY.caption.size, color: 'var(--color-text-muted)', marginRight: '0.25rem' }}>
                {homeTeam}
              </span>
              <span style={{ 
                color: zone.home > zone.away ? '#10B981' : 'var(--color-text-secondary)',
                fontFeatureSettings: "'tnum'"
              }}>
                {zone.home.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper Components
const StatBox = ({ label, value, isHighlight }) => (
  <div style={{
    padding: '0.5rem',
    background: isHighlight ? 'rgba(239, 68, 68, 0.1)' : 'rgba(26, 31, 46, 0.4)',
    borderRadius: '4px',
    textAlign: 'center'
  }}>
    <div style={{
      fontSize: TYPOGRAPHY.caption.size,
      color: 'var(--color-text-muted)',
      marginBottom: '0.125rem'
    }}>
      {label}
    </div>
    <div style={{
      fontSize: TYPOGRAPHY.body.size,
      fontWeight: TYPOGRAPHY.heading.weight,
      color: isHighlight ? '#EF4444' : 'var(--color-text-primary)',
      fontFeatureSettings: "'tnum'"
    }}>
      {value}
    </div>
  </div>
);

const RankBadge = ({ rank, tier }) => (
  <span style={{
    fontSize: TYPOGRAPHY.caption.size,
    fontWeight: TYPOGRAPHY.label.weight,
    color: tier === 'ELITE' ? '#10B981' :
           tier === 'STRONG' ? '#0EA5E9' :
           tier === 'AVERAGE' ? '#8B5CF6' : '#EF4444',
    background: tier === 'ELITE' ? 'rgba(16, 185, 129, 0.2)' :
                tier === 'STRONG' ? 'rgba(14, 165, 233, 0.2)' :
                tier === 'AVERAGE' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)',
    padding: '0.125rem 0.375rem',
    borderRadius: '4px',
    textTransform: 'uppercase'
  }}>
    #{rank} {tier}
  </span>
);

const Section = ({ title, icon, children, isMobile, importance }) => (
  <div style={{
    marginBottom: isMobile ? MOBILE_SPACING.sectionGap : '1.5rem'
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: isMobile ? MOBILE_SPACING.innerPadding : '1rem',
      paddingBottom: '0.5rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {icon}
        <span style={{
          fontSize: TYPOGRAPHY.subheading.size,
          fontWeight: TYPOGRAPHY.heading.weight,
          color: 'var(--color-text-primary)'
        }}>
          {title}
        </span>
      </div>
      {importance && (
        <span style={{
          fontSize: TYPOGRAPHY.caption.size,
          fontWeight: TYPOGRAPHY.label.weight,
          color: importance === 'HIGH' ? '#10B981' :
                 importance === 'MODERATE' ? '#F59E0B' : '#64748B',
          textTransform: 'uppercase'
        }}>
          {importance}
        </span>
      )}
    </div>
    {children}
  </div>
);

function getGoalieRank(gsae) {
  if (gsae > 10) return { rank: 5, tier: 'ELITE' };
  if (gsae > 5) return { rank: 12, tier: 'STRONG' };
  if (gsae > -5) return { rank: 18, tier: 'AVERAGE' };
  return { rank: 28, tier: 'WEAK' };
}

export default GoalieMatchupSection;

