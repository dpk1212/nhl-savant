/**
 * Shot Quality Analysis - Danger Zone Heat Map
 * Visual representation of shot locations and danger levels
 * Shows percentage distribution across danger zones
 */

import { Target, AlertTriangle, Activity } from 'lucide-react';

export default function ShotQualityChart({ awayTeam, homeTeam, awayStats, homeStats }) {
  if (!awayStats || !homeStats) return null;

  // Calculate shot quality metrics
  const awayHD = awayStats.highDanger_xGF_per60 || 0;
  const awayTotal = awayStats.xGF_per60 || 0;
  const homeHD = homeStats.highDanger_xGF_per60 || 0;
  const homeTotal = homeStats.xGF_per60 || 0;

  // Calculate percentages
  const awayHDPct = awayTotal > 0 ? (awayHD / awayTotal * 100) : 0;
  const awayMediumPct = 100 - awayHDPct > 40 ? 40 : 100 - awayHDPct - 20; // Estimate
  const awayLowPct = 100 - awayHDPct - awayMediumPct;

  const homeHDPct = homeTotal > 0 ? (homeHD / homeTotal * 100) : 0;
  const homeMediumPct = 100 - homeHDPct > 40 ? 40 : 100 - homeHDPct - 20;
  const homeLowPct = 100 - homeHDPct - homeMediumPct;

  // Determine shot quality tier
  const getShotQualityTier = (hdPct) => {
    if (hdPct >= 40) return { tier: 'ELITE', color: '#10B981', desc: 'Elite shot quality' };
    if (hdPct >= 35) return { tier: 'STRONG', color: '#3B82F6', desc: 'Strong shot quality' };
    if (hdPct >= 30) return { tier: 'AVERAGE', color: '#F59E0B', desc: 'Average shot quality' };
    return { tier: 'WEAK', color: '#EF4444', desc: 'Weak shot quality' };
  };

  const awayTier = getShotQualityTier(awayHDPct);
  const homeTier = getShotQualityTier(homeHDPct);

  // Heat map visualization component
  const HeatZone = ({ percentage, label, color, icon: Icon }) => {
    const width = Math.max(percentage, 10); // Minimum 10% for visibility
    
    return (
      <div style={{
        position: 'relative',
        height: '80px',
        background: `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`,
        border: `2px solid ${color}`,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: `0 0 ${width}%`,
        minWidth: '80px',
        boxShadow: `0 4px 12px ${color}30`,
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          position: 'absolute',
          top: '-30px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          fontSize: '0.75rem',
          fontWeight: '700',
          color: color,
          textTransform: 'uppercase'
        }}>
          <Icon size={14} />
          {label}
        </div>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: '900',
          color: '#F1F5F9'
        }}>
          {percentage.toFixed(0)}%
        </div>
      </div>
    );
  };

  return (
    <div>
      <h4 style={{
        fontSize: '1rem',
        fontWeight: '700',
        color: '#F1F5F9',
        marginBottom: '0.75rem'
      }}>
        Shot Quality Distribution
      </h4>
      <p style={{
        fontSize: '0.875rem',
        color: '#94A3B8',
        marginBottom: '1.5rem',
        lineHeight: 1.5
      }}>
        Breakdown of shots by danger level. Higher % of high-danger shots = better offensive quality.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {/* Away Team */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: '900',
                color: '#F1F5F9',
                marginBottom: '0.25rem'
              }}>
                {awayTeam.code}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#94A3B8'
              }}>
                Total xG/60: {awayTotal.toFixed(2)}
              </div>
            </div>
            <div style={{
              display: 'inline-block',
              background: `${awayTier.color}20`,
              border: `1px solid ${awayTier.color}`,
              borderRadius: '12px',
              padding: '0.5rem 1rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: awayTier.color,
                textTransform: 'uppercase',
                marginBottom: '0.25rem'
              }}>
                {awayTier.tier}
              </div>
              <div style={{
                fontSize: '0.6875rem',
                color: '#94A3B8'
              }}>
                {awayTier.desc}
              </div>
            </div>
          </div>

          {/* Heat zones */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            position: 'relative',
            paddingTop: '35px'
          }}>
            <HeatZone
              percentage={awayHDPct}
              label="High Danger"
              color="#EF4444"
              icon={Target}
            />
            <HeatZone
              percentage={awayMediumPct}
              label="Medium"
              color="#F59E0B"
              icon={AlertTriangle}
            />
            <HeatZone
              percentage={awayLowPct}
              label="Low Danger"
              color="#3B82F6"
              icon={Activity}
            />
          </div>

          {/* Stats breakdown */}
          <div style={{
            marginTop: '1rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem'
          }}>
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '8px',
              padding: '0.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.25rem' }}>
                HD xG/60
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '900', color: '#EF4444' }}>
                {awayHD.toFixed(2)}
              </div>
            </div>
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '8px',
              padding: '0.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.25rem' }}>
                Med xG/60
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '900', color: '#F59E0B' }}>
                {(awayTotal * awayMediumPct / 100).toFixed(2)}
              </div>
            </div>
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '8px',
              padding: '0.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.25rem' }}>
                Low xG/60
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '900', color: '#3B82F6' }}>
                {(awayTotal * awayLowPct / 100).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Home Team */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: '900',
                color: '#F1F5F9',
                marginBottom: '0.25rem'
              }}>
                {homeTeam.code}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#94A3B8'
              }}>
                Total xG/60: {homeTotal.toFixed(2)}
              </div>
            </div>
            <div style={{
              display: 'inline-block',
              background: `${homeTier.color}20`,
              border: `1px solid ${homeTier.color}`,
              borderRadius: '12px',
              padding: '0.5rem 1rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: homeTier.color,
                textTransform: 'uppercase',
                marginBottom: '0.25rem'
              }}>
                {homeTier.tier}
              </div>
              <div style={{
                fontSize: '0.6875rem',
                color: '#94A3B8'
              }}>
                {homeTier.desc}
              </div>
            </div>
          </div>

          {/* Heat zones */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            position: 'relative',
            paddingTop: '35px'
          }}>
            <HeatZone
              percentage={homeHDPct}
              label="High Danger"
              color="#EF4444"
              icon={Target}
            />
            <HeatZone
              percentage={homeMediumPct}
              label="Medium"
              color="#F59E0B"
              icon={AlertTriangle}
            />
            <HeatZone
              percentage={homeLowPct}
              label="Low Danger"
              color="#3B82F6"
              icon={Activity}
            />
          </div>

          {/* Stats breakdown */}
          <div style={{
            marginTop: '1rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem'
          }}>
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '8px',
              padding: '0.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.25rem' }}>
                HD xG/60
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '900', color: '#EF4444' }}>
                {homeHD.toFixed(2)}
              </div>
            </div>
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '8px',
              padding: '0.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.25rem' }}>
                Med xG/60
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '900', color: '#F59E0B' }}>
                {(homeTotal * homeMediumPct / 100).toFixed(2)}
              </div>
            </div>
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '8px',
              padding: '0.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.25rem' }}>
                Low xG/60
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '900', color: '#3B82F6' }}>
                {(homeTotal * homeLowPct / 100).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Summary */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: '700',
            color: '#94A3B8',
            textTransform: 'uppercase',
            marginBottom: '0.75rem'
          }}>
            Shot Quality Advantage
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '900',
            color: awayHDPct > homeHDPct ? '#10B981' : homeHDPct > awayHDPct ? '#10B981' : '#94A3B8'
          }}>
            {awayHDPct > homeHDPct ? awayTeam.code : homeHDPct > awayHDPct ? homeTeam.code : 'Even'}
          </div>
          {awayHDPct !== homeHDPct && (
            <div style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: '#F1F5F9',
              marginTop: '0.5rem'
            }}>
              {awayHDPct > homeHDPct 
                ? `+${(awayHDPct - homeHDPct).toFixed(1)}% more high-danger shots`
                : `+${(homeHDPct - awayHDPct).toFixed(1)}% more high-danger shots`
              }
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .heat-zones {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}
