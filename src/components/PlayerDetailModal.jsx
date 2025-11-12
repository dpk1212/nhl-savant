import { X, ArrowUp, ArrowDown, Minus, TrendingUp, Zap, Shield, Clock, Target, Activity } from 'lucide-react';

/**
 * Player Detail Modal
 * 
 * Shows comprehensive matchup analysis for a player when clicked
 */
function PlayerDetailModal({ player, isOpen, onClose, isPremium }) {
  if (!isOpen || !player) return null;

  const { matchupFactors, reasons, playerStats } = player;

  const getFactorIndicator = (isFavorable) => {
    if (isFavorable) {
      return { icon: <ArrowUp size={18} />, color: '#10b981', label: 'FAVORABLE' };
    }
    return { icon: <Minus size={18} />, color: '#64748b', label: 'NEUTRAL' };
  };

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A+': return '#ef4444';
      case 'A': return '#fbbf24';
      case 'B+': return '#10b981';
      default: return '#64748b';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
          border: '1px solid rgba(100, 116, 139, 0.3)',
          borderRadius: '1rem',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(100, 116, 139, 0.2)',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.5rem',
            cursor: 'pointer',
            color: '#94a3b8',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
            e.currentTarget.style.color = '#ef4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(100, 116, 139, 0.2)';
            e.currentTarget.style.color = '#94a3b8';
          }}
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div style={{
          padding: '2rem',
          borderBottom: '1px solid rgba(100, 116, 139, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span style={{
              padding: '0.375rem 0.75rem',
              background: 'rgba(59, 130, 246, 0.2)',
              borderRadius: '0.375rem',
              color: '#60a5fa',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              {playerStats?.position || 'F'}
            </span>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#f1f5f9',
              margin: 0
            }}>
              {player.name}
            </h2>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            color: '#94a3b8',
            fontSize: '1rem'
          }}>
            <span>{player.team}</span>
            <span>vs</span>
            <span>{player.opponentTeamName}</span>
            <span>•</span>
            <span>{player.gameTime}</span>
          </div>
        </div>

        {/* Tonight's Matchup Summary */}
        <div style={{
          padding: '2rem',
          borderBottom: '1px solid rgba(100, 116, 139, 0.2)',
          background: 'rgba(59, 130, 246, 0.05)'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#f1f5f9',
            marginBottom: '1rem'
          }}>
            Tonight's Matchup
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.5rem'
          }}>
            {/* OddsTrader Baseline */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              padding: '1rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(100, 116, 139, 0.2)'
            }}>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                OddsTrader EV
              </div>
              <div style={{
                color: '#f1f5f9',
                fontSize: '1.5rem',
                fontWeight: '700'
              }}>
                {player.otEV}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                Cover Prob: {player.otCoverProb}%
              </div>
            </div>

            {/* Opponent Defense xGA */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              padding: '1rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(100, 116, 139, 0.2)'
            }}>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                Opponent xGA/60
              </div>
              <div style={{
                color: matchupFactors?.defense?.rank > 24 ? '#10b981' : matchupFactors?.defense?.rank > 16 ? '#fbbf24' : '#ef4444',
                fontSize: '1.5rem',
                fontWeight: '700'
              }}>
                {matchupFactors?.defense?.xGA_per60 || 'N/A'}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                Rank #{matchupFactors?.defense?.rank || 'N/A'} / 32 ({matchupFactors?.defense?.vsLeague || 'N/A'} vs avg)
              </div>
            </div>

            {/* Goalie GSAE */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              padding: '1rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(100, 116, 139, 0.2)'
            }}>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                Goalie: {player.opponentGoalieName}
              </div>
              <div style={{
                color: (matchupFactors?.goalie?.gsae || 0) < -2 ? '#10b981' : (matchupFactors?.goalie?.gsae || 0) < 2 ? '#94a3b8' : '#ef4444',
                fontSize: '1.5rem',
                fontWeight: '700'
              }}>
                {matchupFactors?.goalie?.gsae ? `${matchupFactors.goalie.gsae > 0 ? '+' : ''}${matchupFactors.goalie.gsae.toFixed(1)}` : 'N/A'} GSAE
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {matchupFactors?.goalie?.level || 'Unknown'} performance
              </div>
            </div>

            {/* Player Volume */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              padding: '1rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(100, 116, 139, 0.2)'
            }}>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                Player SOG/gm
              </div>
              <div style={{
                color: '#e2e8f0',
                fontSize: '1.5rem',
                fontWeight: '700'
              }}>
                {playerStats?.shotsPerGame?.toFixed(1) || 'N/A'}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {playerStats?.shootingPercentage?.toFixed(1) || 'N/A'}% shooting
              </div>
            </div>
          </div>
        </div>

        {/* Matchup Factors */}
        <div style={{ padding: '2rem' }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#f1f5f9',
            marginBottom: '1.5rem'
          }}>
            Matchup Factors
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Defense */}
            {matchupFactors?.defense && (
              <FactorCard
                icon={<Shield size={20} />}
                title="Opponent Defense"
                value={`#${matchupFactors.defense.rank} ranked (${matchupFactors.defense.vsLeague} vs league)`}
                indicator={getFactorIndicator(matchupFactors.defense.isFavorable)}
                description={matchupFactors.defense.rank > 24 ? 'Bottom-tier defense' : matchupFactors.defense.rank > 16 ? 'Average defense' : 'Elite defense'}
              />
            )}

            {/* Goalie */}
            {matchupFactors?.goalie && matchupFactors.goalie.name !== 'TBD' && (
              <FactorCard
                icon={<Target size={20} />}
                title="Goalie Quality"
                value={`${matchupFactors.goalie.name} (${matchupFactors.goalie.level})`}
                indicator={getFactorIndicator(matchupFactors.goalie.isFavorable)}
                description={`${matchupFactors.goalie.gsae} GSAE - ${matchupFactors.goalie.isFavorable ? 'Allowing more goals than expected' : 'Performing well'}`}
              />
            )}

            {/* Pace */}
            {matchupFactors?.pace && (
              <FactorCard
                icon={<Activity size={20} />}
                title="Game Pace"
                value={`${matchupFactors.pace.level} pace (${matchupFactors.pace.vsLeague} vs league)`}
                indicator={getFactorIndicator(matchupFactors.pace.isFavorable)}
                description={matchupFactors.pace.isFavorable ? 'More shots and opportunities' : 'Average pace game'}
              />
            )}

            {/* PP Opportunity */}
            {matchupFactors?.ppOpportunity && (
              <FactorCard
                icon={<Zap size={20} />}
                title="Power Play Opportunity"
                value={`${matchupFactors.ppOpportunity.pimPerGame} PIM/game (${matchupFactors.ppOpportunity.level})`}
                indicator={getFactorIndicator(matchupFactors.ppOpportunity.isFavorable)}
                description={matchupFactors.ppOpportunity.isFavorable ? 'High penalty rate = PP opportunities' : 'Average penalty rate'}
              />
            )}

            {/* Shot Blocking */}
            {matchupFactors?.shotBlocking && (
              <FactorCard
                icon={<Shield size={20} />}
                title="Shot Blocking"
                value={`${matchupFactors.shotBlocking.blocksPerGame} blocks/game (${matchupFactors.shotBlocking.level})`}
                indicator={getFactorIndicator(matchupFactors.shotBlocking.isFavorable)}
                description={matchupFactors.shotBlocking.isFavorable ? 'Low blocks = shots get through' : 'Average shot blocking'}
              />
            )}

            {/* Player Shots */}
            {matchupFactors?.playerShots && playerStats && (
              <FactorCard
                icon={<TrendingUp size={20} />}
                title="Player Shot Volume"
                value={`${matchupFactors.playerShots.shotsPerGame} SOG/game (${matchupFactors.playerShots.level})`}
                indicator={getFactorIndicator(matchupFactors.playerShots.isFavorable)}
                description={`${matchupFactors.playerShots.highDangerRate} high danger rate`}
              />
            )}
          </div>
        </div>

        {/* Why This Matchup */}
        {reasons && reasons.length > 0 && (
          <div style={{
            padding: '2rem',
            borderTop: '1px solid rgba(100, 116, 139, 0.2)',
            background: 'rgba(16, 185, 129, 0.05)'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#f1f5f9',
              marginBottom: '1rem'
            }}>
              Why This Matchup
            </h3>
            <ul style={{
              margin: 0,
              padding: '0 0 0 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              {reasons.map((reason, index) => (
                <li key={index} style={{
                  color: '#cbd5e1',
                  fontSize: '1rem',
                  lineHeight: '1.5'
                }}>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Player Stats (if available) */}
        {playerStats && (
          <div style={{
            padding: '2rem',
            borderTop: '1px solid rgba(100, 116, 139, 0.2)'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#f1f5f9',
              marginBottom: '1rem'
            }}>
              Season Stats
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              <StatBox label="Goals/Game" value={playerStats.goalsPerGame?.toFixed(2) || '0.00'} />
              <StatBox label="Shots/Game" value={playerStats.shotsPerGame?.toFixed(1) || '0.0'} />
              <StatBox label="xG/Game" value={playerStats.xGoalsPerGame?.toFixed(2) || '0.00'} />
              <StatBox label="High Danger %" value={`${(playerStats.highDangerRate * 100)?.toFixed(0) || '0'}%`} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component for matchup factors
function FactorCard({ icon, title, value, indicator, description }) {
  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(100, 116, 139, 0.2)',
      borderRadius: '0.5rem',
      padding: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#94a3b8' }}>{icon}</span>
          <span style={{ color: '#f1f5f9', fontWeight: '600', fontSize: '0.875rem' }}>
            {title}
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: '0.25rem 0.5rem',
          background: `${indicator.color}20`,
          borderRadius: '0.25rem',
          color: indicator.color,
          fontSize: '0.75rem',
          fontWeight: '600'
        }}>
          {indicator.icon}
          <span>{indicator.label}</span>
        </div>
      </div>
      <div style={{ color: '#cbd5e1', fontSize: '0.9375rem', marginBottom: '0.25rem' }}>
        {value}
      </div>
      <div style={{ color: '#64748b', fontSize: '0.8125rem' }}>
        {description}
      </div>
    </div>
  );
}

// Helper component for stats
function StatBox({ label, value }) {
  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(100, 116, 139, 0.2)',
      borderRadius: '0.5rem',
      padding: '1rem',
      textAlign: 'center'
    }}>
      <div style={{
        color: '#94a3b8',
        fontSize: '0.75rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '0.5rem'
      }}>
        {label}
      </div>
      <div style={{
        color: '#f1f5f9',
        fontSize: '1.5rem',
        fontWeight: '700'
      }}>
        {value}
      </div>
    </div>
  );
}

export default PlayerDetailModal;

