/**
 * Special Teams Analysis - Battle Grid
 * Head-to-head matchup visualization with circular progress meters
 * Shows PP vs PK matchups for both teams
 */

import { Zap, Shield } from 'lucide-react';

export default function SpecialTeamsChart({ awayTeam, homeTeam, awayPP, awayPK, homePP, homePK }) {
  if (!awayPP || !awayPK || !homePP || !homePK) return null;

  // REAL DATA - Calculate percentages from xGoalsPercentage  
  const awayPPPct = awayPP.xGoalsPercentage ? (awayPP.xGoalsPercentage * 100).toFixed(1) : 'N/A';
  const awayPKPct = awayPK.xGoalsPercentage ? ((1 - awayPK.xGoalsPercentage) * 100).toFixed(1) : 'N/A';
  const homePPPct = homePP.xGoalsPercentage ? (homePP.xGoalsPercentage * 100).toFixed(1) : 'N/A';
  const homePKPct = homePK.xGoalsPercentage ? ((1 - homePK.xGoalsPercentage) * 100).toFixed(1) : 'N/A';

  // Check for small sample sizes
  const awayPPGames = awayPP.games_played || 0;
  const awayPKGames = awayPK.games_played || 0;
  const homePPGames = homePP.games_played || 0;
  const homePKGames = homePK.games_played || 0;
  const minGames = Math.min(awayPPGames, awayPKGames, homePPGames, homePKGames);
  const isSmallSample = minGames < 10;

  // Calculate advantages
  const awayPPvsHomePK = parseFloat(awayPPPct) - (100 - parseFloat(homePKPct));
  const homePPvsAwayPK = parseFloat(homePPPct) - (100 - parseFloat(awayPKPct));

  // Tier classification
  const getTier = (pct, isPK) => {
    const num = parseFloat(pct);
    if (isPK) {
      if (num >= 82) return { tier: 'ELITE', color: '#10B981' };
      if (num >= 80) return { tier: 'STRONG', color: '#3B82F6' };
      if (num >= 78) return { tier: 'AVERAGE', color: '#F59E0B' };
      return { tier: 'WEAK', color: '#EF4444' };
    } else {
      if (num >= 24) return { tier: 'ELITE', color: '#10B981' };
      if (num >= 21) return { tier: 'STRONG', color: '#3B82F6' };
      if (num >= 18) return { tier: 'AVERAGE', color: '#F59E0B' };
      return { tier: 'WEAK', color: '#EF4444' };
    }
  };

  // Circular Progress Component
  const CircularProgress = ({ percentage, color, size = 120 }) => {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(71, 85, 105, 0.3)"
          strokeWidth="12"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1s ease',
            filter: `drop-shadow(0 0 8px ${color})`
          }}
        />
      </svg>
    );
  };

  return (
    <div>
      <h4 style={{
        fontSize: window.innerWidth < 768 ? '0.875rem' : '1rem',
        fontWeight: '700',
        color: '#F1F5F9',
        marginBottom: '0.75rem'
      }}>
        Special Teams Battle Grid
      </h4>
      <p style={{
        fontSize: window.innerWidth < 768 ? '0.8125rem' : '0.875rem',
        color: '#94A3B8',
        marginBottom: '1rem',
        lineHeight: 1.5
      }}>
        Head-to-head special teams matchups. Green = advantage, Red = disadvantage.
      </p>

      {/* Data Source Label */}
      <div style={{
        fontSize: '0.75rem',
        color: '#64748B',
        marginBottom: '1rem',
        fontStyle: 'italic'
      }}>
        📊 Source: teams.csv (5on4 PP / 4on5 PK situations, 2025-26 season)
      </div>

      {/* Sample Size Warning */}
      {isSmallSample && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '8px',
          padding: '0.75rem',
          fontSize: '0.8125rem',
          color: '#F59E0B',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          ⚠️ <span>Small sample size ({minGames} games) - special teams stats may be volatile early in season</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Matchup 1: Away PP vs Home PK */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '2rem',
            alignItems: 'center'
          }}>
            {/* Away PP */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '900',
                color: '#F1F5F9',
                marginBottom: '1rem'
              }}>
                {awayTeam.code}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '1rem',
                position: 'relative'
              }}>
                <CircularProgress 
                  percentage={parseFloat(awayPPPct)} 
                  color={getTier(awayPPPct, false).color}
                />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '1.75rem',
                    fontWeight: '900',
                    color: '#F1F5F9'
                  }}>
                    {awayPPPct}%
                  </div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <Zap size={16} color={getTier(awayPPPct, false).color} />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  color: '#94A3B8',
                  textTransform: 'uppercase'
                }}>
                  Power Play
                </span>
              </div>
              <div style={{
                display: 'inline-block',
                background: `${getTier(awayPPPct, false).color}20`,
                border: `1px solid ${getTier(awayPPPct, false).color}`,
                borderRadius: '12px',
                padding: '0.375rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: '700',
                color: getTier(awayPPPct, false).color
              }}>
                {getTier(awayPPPct, false).tier}
              </div>
            </div>

            {/* VS Divider */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: '900',
                color: '#64748B'
              }}>
                VS
              </div>
              <div style={{
                background: awayPPvsHomePK > 2 ? 'rgba(16, 185, 129, 0.2)' : awayPPvsHomePK < -2 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                border: `1px solid ${awayPPvsHomePK > 2 ? '#10B981' : awayPPvsHomePK < -2 ? '#EF4444' : '#64748B'}`,
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                textAlign: 'center',
                minWidth: '120px'
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#94A3B8',
                  marginBottom: '0.25rem',
                  textTransform: 'uppercase'
                }}>
                  Advantage
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: '900',
                  color: awayPPvsHomePK > 2 ? '#10B981' : awayPPvsHomePK < -2 ? '#EF4444' : '#64748B'
                }}>
                  {awayPPvsHomePK > 0 ? awayTeam.code : homeTeam.code}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  color: awayPPvsHomePK > 2 ? '#10B981' : awayPPvsHomePK < -2 ? '#EF4444' : '#64748B'
                }}>
                  {awayPPvsHomePK > 0 ? '+' : ''}{awayPPvsHomePK.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Home PK */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '900',
                color: '#F1F5F9',
                marginBottom: '1rem'
              }}>
                {homeTeam.code}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '1rem',
                position: 'relative'
              }}>
                <CircularProgress 
                  percentage={parseFloat(homePKPct)} 
                  color={getTier(homePKPct, true).color}
                />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '1.75rem',
                    fontWeight: '900',
                    color: '#F1F5F9'
                  }}>
                    {homePKPct}%
                  </div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <Shield size={16} color={getTier(homePKPct, true).color} />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  color: '#94A3B8',
                  textTransform: 'uppercase'
                }}>
                  Penalty Kill
                </span>
              </div>
              <div style={{
                display: 'inline-block',
                background: `${getTier(homePKPct, true).color}20`,
                border: `1px solid ${getTier(homePKPct, true).color}`,
                borderRadius: '12px',
                padding: '0.375rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: '700',
                color: getTier(homePKPct, true).color
              }}>
                {getTier(homePKPct, true).tier}
              </div>
            </div>
          </div>
        </div>

        {/* Matchup 2: Home PP vs Away PK */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '2rem',
            alignItems: 'center'
          }}>
            {/* Home PP */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '900',
                color: '#F1F5F9',
                marginBottom: '1rem'
              }}>
                {homeTeam.code}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '1rem',
                position: 'relative'
              }}>
                <CircularProgress 
                  percentage={parseFloat(homePPPct)} 
                  color={getTier(homePPPct, false).color}
                />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '1.75rem',
                    fontWeight: '900',
                    color: '#F1F5F9'
                  }}>
                    {homePPPct}%
                  </div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <Zap size={16} color={getTier(homePPPct, false).color} />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  color: '#94A3B8',
                  textTransform: 'uppercase'
                }}>
                  Power Play
                </span>
              </div>
              <div style={{
                display: 'inline-block',
                background: `${getTier(homePPPct, false).color}20`,
                border: `1px solid ${getTier(homePPPct, false).color}`,
                borderRadius: '12px',
                padding: '0.375rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: '700',
                color: getTier(homePPPct, false).color
              }}>
                {getTier(homePPPct, false).tier}
              </div>
            </div>

            {/* VS Divider */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: '900',
                color: '#64748B'
              }}>
                VS
              </div>
              <div style={{
                background: homePPvsAwayPK > 2 ? 'rgba(16, 185, 129, 0.2)' : homePPvsAwayPK < -2 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                border: `1px solid ${homePPvsAwayPK > 2 ? '#10B981' : homePPvsAwayPK < -2 ? '#EF4444' : '#64748B'}`,
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                textAlign: 'center',
                minWidth: '120px'
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#94A3B8',
                  marginBottom: '0.25rem',
                  textTransform: 'uppercase'
                }}>
                  Advantage
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: '900',
                  color: homePPvsAwayPK > 2 ? '#10B981' : homePPvsAwayPK < -2 ? '#EF4444' : '#64748B'
                }}>
                  {homePPvsAwayPK > 0 ? homeTeam.code : awayTeam.code}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  color: homePPvsAwayPK > 2 ? '#10B981' : homePPvsAwayPK < -2 ? '#EF4444' : '#64748B'
                }}>
                  {homePPvsAwayPK > 0 ? '+' : ''}{homePPvsAwayPK.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Away PK */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '900',
                color: '#F1F5F9',
                marginBottom: '1rem'
              }}>
                {awayTeam.code}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '1rem',
                position: 'relative'
              }}>
                <CircularProgress 
                  percentage={parseFloat(awayPKPct)} 
                  color={getTier(awayPKPct, true).color}
                />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '1.75rem',
                    fontWeight: '900',
                    color: '#F1F5F9'
                  }}>
                    {awayPKPct}%
                  </div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <Shield size={16} color={getTier(awayPKPct, true).color} />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  color: '#94A3B8',
                  textTransform: 'uppercase'
                }}>
                  Penalty Kill
                </span>
              </div>
              <div style={{
                display: 'inline-block',
                background: `${getTier(awayPKPct, true).color}20`,
                border: `1px solid ${getTier(awayPKPct, true).color}`,
                borderRadius: '12px',
                padding: '0.375rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: '700',
                color: getTier(awayPKPct, true).color
              }}>
                {getTier(awayPKPct, true).tier}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .battle-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
