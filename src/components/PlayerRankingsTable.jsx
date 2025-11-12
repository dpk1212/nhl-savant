import { useState } from 'react';
import { Star, ArrowUp, ArrowDown, Minus, Flame, Award, Check, X } from 'lucide-react';
import PlayerDetailModal from './PlayerDetailModal';

/**
 * Player Rankings Table Component
 * 
 * Displays ranked list of players with matchup analysis in a professional table format
 */
function PlayerRankingsTable({ players, isPremium }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [bookmarkedPlayers, setBookmarkedPlayers] = useState(new Set());

  const toggleBookmark = (playerName) => {
    const newBookmarks = new Set(bookmarkedPlayers);
    if (newBookmarks.has(playerName)) {
      newBookmarks.delete(playerName);
    } else {
      newBookmarks.add(playerName);
    }
    setBookmarkedPlayers(newBookmarks);
  };

  const getMatchupIcon = (grade) => {
    switch(grade) {
      case 'A+': return <Flame size={20} color="#ef4444" />;
      case 'A': return <Award size={20} color="#fbbf24" />;
      case 'B+': return <Check size={20} color="#10b981" />;
      default: return <Minus size={20} color="#64748b" />;
    }
  };

  const getDefenseColor = (rank) => {
    if (rank > 24) return '#10b981'; // Green - weak defense (easy)
    if (rank > 16) return '#fbbf24'; // Yellow - average
    return '#ef4444'; // Red - elite defense (hard)
  };

  const getGoalieIndicator = (gsae) => {
    const gsaeNum = parseFloat(gsae);
    if (gsaeNum > 5) return { icon: <ArrowDown size={16} />, color: '#ef4444' }; // Elite (hard)
    if (gsaeNum < -2) return { icon: <ArrowUp size={16} />, color: '#10b981' }; // Struggling (easy)
    return { icon: <Minus size={16} />, color: '#94a3b8' }; // Average
  };

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A+': return '#ef4444';
      case 'A': return '#fbbf24';
      case 'B+': return '#10b981';
      default: return '#64748b';
    }
  };

  if (!players || players.length === 0) {
    return (
      <div style={{
        background: 'rgba(30, 41, 59, 0.5)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(100, 116, 139, 0.2)',
        borderRadius: '0.75rem',
        padding: '3rem',
        textAlign: 'center'
      }}>
        <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>
          No players match your filters
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div style={{
        display: 'block',
        '@media (max-width: 768px)': {
          display: 'none'
        }
      }}>
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(100, 116, 139, 0.2)',
          borderRadius: '0.75rem',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              {/* Table Header */}
              <thead>
                <tr style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  borderBottom: '1px solid rgba(100, 116, 139, 0.2)'
                }}>
                  <th style={headerCellStyle}>#</th>
                  <th style={headerCellStyle}>⭐</th>
                  <th style={{ ...headerCellStyle, textAlign: 'left', minWidth: '180px' }}>Player</th>
                  <th style={headerCellStyle}>Matchup</th>
                  <th style={{ ...headerCellStyle, minWidth: '110px' }}>Prop / Odds</th>
                  <th style={{ ...headerCellStyle, minWidth: '90px' }}>Opp xGA/60</th>
                  <th style={{ ...headerCellStyle, minWidth: '100px' }}>Goalie GSAE</th>
                  <th style={headerCellStyle}>SOG/gm</th>
                  <th style={headerCellStyle}>Pace</th>
                  <th style={headerCellStyle}>PP PIM</th>
                  <th style={headerCellStyle}>OT EV</th>
                  <th style={headerCellStyle}>Shot%</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {players.map((player, index) => {
                  const goalieIndicator = getGoalieIndicator(player.matchupFactors?.goalie?.gsae || 0);
                  
                  // Calculate matchup quality for row highlighting
                  const defRank = player.matchupFactors?.defense?.rank || 99;
                  const gsae = player.matchupFactors?.goalie?.gsae || 0;
                  const playerSOG = player.playerStats?.shotsPerGame || 0;
                  
                  // Count favorable factors
                  let favorableCount = 0;
                  if (defRank > 24) favorableCount++; // Weak defense
                  if (gsae < -2) favorableCount++; // Struggling goalie
                  if (playerSOG > 3.0) favorableCount++; // High volume shooter
                  if (player.matchupFactors?.pace?.isFavorable) favorableCount++; // Fast pace
                  
                  // Determine row highlight
                  let rowBg = 'transparent';
                  if (favorableCount >= 3 && playerSOG > 3.0) {
                    rowBg = 'rgba(16, 185, 129, 0.08)'; // Green tint for elite matchups
                  } else if (favorableCount >= 2 && playerSOG > 2.5) {
                    rowBg = 'rgba(251, 191, 36, 0.05)'; // Slight yellow for good matchups
                  }
                  
                  return (
                    <tr
                      key={`${player.name}-${index}`}
                      onClick={() => setSelectedPlayer(player)}
                      style={{
                        borderBottom: '1px solid rgba(100, 116, 139, 0.1)',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        background: rowBg
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = rowBg}
                    >
                      {/* Rank */}
                      <td style={cellStyle}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: index < 3 ? 'rgba(251, 191, 36, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                          color: index < 3 ? '#fbbf24' : '#94a3b8',
                          fontSize: '0.875rem',
                          fontWeight: '600'
                        }}>
                          {index + 1}
                        </span>
                      </td>

                      {/* Bookmark */}
                      <td style={cellStyle}>
                        {isPremium ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(player.name);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '0.25rem'
                            }}
                          >
                            <Star
                              size={18}
                              fill={bookmarkedPlayers.has(player.name) ? '#fbbf24' : 'none'}
                              color={bookmarkedPlayers.has(player.name) ? '#fbbf24' : '#64748b'}
                            />
                          </button>
                        ) : (
                          <span style={{ color: '#475569', fontSize: '0.75rem' }}>—</span>
                        )}
                      </td>

                      {/* Player Name & Position */}
                      <td style={{ ...cellStyle, textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.5rem',
                            background: 'rgba(59, 130, 246, 0.2)',
                            borderRadius: '0.25rem',
                            color: '#60a5fa',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            {player.playerStats?.position || 'F'}
                          </span>
                          <span style={{
                            color: '#f1f5f9',
                            fontWeight: '600',
                            fontSize: '0.9375rem'
                          }}>
                            {player.name}
                          </span>
                          {playerSOG > 3.5 && (
                            <span style={{
                              display: 'inline-block',
                              padding: '0.125rem 0.375rem',
                              background: 'rgba(16, 185, 129, 0.2)',
                              borderRadius: '0.25rem',
                              color: '#10b981',
                              fontSize: '0.625rem',
                              fontWeight: '700',
                              letterSpacing: '0.025em'
                            }}>
                              ELITE
                            </span>
                          )}
                          {playerSOG > 2.8 && playerSOG <= 3.5 && (
                            <span style={{
                              display: 'inline-block',
                              padding: '0.125rem 0.375rem',
                              background: 'rgba(59, 130, 246, 0.2)',
                              borderRadius: '0.25rem',
                              color: '#60a5fa',
                              fontSize: '0.625rem',
                              fontWeight: '700',
                              letterSpacing: '0.025em'
                            }}>
                              GOOD
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Matchup (Team vs Opp) */}
                      <td style={cellStyle}>
                        <span style={{
                          color: '#cbd5e1',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}>
                          {player.team} @ {player.opponent}
                        </span>
                      </td>

                      {/* Prop / Odds */}
                      <td style={cellStyle}>
                        <span style={{
                          color: '#e2e8f0',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          fontFamily: 'monospace'
                        }}>
                          {player.odds || 'N/A'}
                        </span>
                      </td>

                      {/* Opponent xGA/60 */}
                      <td style={cellStyle}>
                        {(() => {
                          const xGA = parseFloat(player.matchupFactors?.defense?.xGA_per60 || 0);
                          const rank = player.matchupFactors?.defense?.rank || 99;
                          
                          // Strong visual indicators
                          let bgColor, textColor, label;
                          if (rank > 24) {
                            bgColor = 'rgba(16, 185, 129, 0.2)';
                            textColor = '#10b981';
                            label = '🔥 WEAK';
                          } else if (rank > 16) {
                            bgColor = 'rgba(251, 191, 36, 0.15)';
                            textColor = '#fbbf24';
                            label = 'AVG';
                          } else {
                            bgColor = 'rgba(239, 68, 68, 0.15)';
                            textColor = '#ef4444';
                            label = '🛡️ STRONG';
                          }
                          
                          return (
                            <div style={{
                              background: bgColor,
                              padding: '0.375rem 0.5rem',
                              borderRadius: '0.375rem',
                              display: 'inline-block'
                            }}>
                              <div style={{
                                color: textColor,
                                fontSize: '0.9375rem',
                                fontWeight: '700',
                                marginBottom: '0.125rem'
                              }}>
                                {xGA.toFixed(2)}
                              </div>
                              <div style={{
                                color: textColor,
                                fontSize: '0.625rem',
                                fontWeight: '600',
                                opacity: 0.8
                              }}>
                                {label}
                              </div>
                            </div>
                          );
                        })()}
                      </td>

                      {/* Goalie GSAE */}
                      <td style={cellStyle}>
                        {(() => {
                          const gsae = player.matchupFactors?.goalie?.gsae || 0;
                          
                          // Strong visual indicators
                          let bgColor, textColor, label;
                          if (gsae < -2) {
                            bgColor = 'rgba(16, 185, 129, 0.2)';
                            textColor = '#10b981';
                            label = '🔥 COLD';
                          } else if (gsae < 2) {
                            bgColor = 'rgba(100, 116, 139, 0.15)';
                            textColor = '#94a3b8';
                            label = 'AVG';
                          } else {
                            bgColor = 'rgba(239, 68, 68, 0.15)';
                            textColor = '#ef4444';
                            label = '❄️ HOT';
                          }
                          
                          return (
                            <div style={{
                              background: bgColor,
                              padding: '0.375rem 0.5rem',
                              borderRadius: '0.375rem',
                              display: 'inline-block'
                            }}>
                              <div style={{
                                color: textColor,
                                fontSize: '0.9375rem',
                                fontWeight: '700',
                                marginBottom: '0.125rem'
                              }}>
                                {gsae > 0 ? '+' : ''}{gsae.toFixed(1)}
                              </div>
                              <div style={{
                                color: textColor,
                                fontSize: '0.625rem',
                                fontWeight: '600',
                                opacity: 0.8
                              }}>
                                {label}
                              </div>
                            </div>
                          );
                        })()}
                      </td>

                      {/* Player SOG/gm */}
                      <td style={cellStyle}>
                        {(() => {
                          const sog = player.playerStats?.shotsPerGame || 0;
                          
                          // Visual indicators for volume
                          let color, icon;
                          if (sog > 3.5) {
                            color = '#10b981';
                            icon = '⬆️';
                          } else if (sog > 2.8) {
                            color = '#60a5fa';
                            icon = '↗️';
                          } else if (sog > 2.0) {
                            color = '#94a3b8';
                            icon = '→';
                          } else {
                            color = '#64748b';
                            icon = '↘️';
                          }
                          
                          return (
                            <span style={{
                              color,
                              fontSize: '0.875rem',
                              fontWeight: '700'
                            }}>
                              {icon} {sog ? sog.toFixed(1) : 'N/A'}
                            </span>
                          );
                        })()}
                      </td>

                      {/* Pace (SA/60) */}
                      <td style={cellStyle}>
                        {(() => {
                          const pace = parseFloat(player.matchupFactors?.pace?.pace || 0);
                          const isFast = player.matchupFactors?.pace?.isFavorable;
                          return (
                            <span style={{
                              color: isFast ? '#10b981' : '#94a3b8',
                              fontSize: '0.875rem',
                              fontWeight: '500'
                            }}>
                              {pace.toFixed(1)}
                            </span>
                          );
                        })()}
                      </td>

                      {/* PP PIM (Penalty Minutes) */}
                      <td style={cellStyle}>
                        <span style={{
                          color: player.matchupFactors?.ppOpportunity?.isFavorable ? '#10b981' : '#94a3b8',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}>
                          {player.matchupFactors?.ppOpportunity?.pimPerGame || 'N/A'}
                        </span>
                      </td>

                      {/* OddsTrader EV */}
                      <td style={cellStyle}>
                        <span style={{
                          color: '#94a3b8',
                          fontSize: '0.875rem'
                        }}>
                          {player.otEV}
                        </span>
                      </td>

                      {/* Player Shooting % */}
                      <td style={cellStyle}>
                        <span style={{
                          color: '#e2e8f0',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}>
                          {player.playerStats?.shootingPercentage?.toFixed(1) || 'N/A'}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div style={{
        display: 'none',
        '@media (max-width: 768px)': {
          display: 'block'
        }
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {players.map((player, index) => (
            <div
              key={`${player.name}-${index}`}
              onClick={() => setSelectedPlayer(player)}
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(100, 116, 139, 0.2)',
                borderRadius: '0.75rem',
                padding: '1rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ color: '#f1f5f9', fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                    {player.name}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                    {player.team} @ {player.opponent}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem', fontFamily: 'monospace' }}>
                    {player.odds || 'N/A'}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-end' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>OT EV</span>
                  <span style={{ color: '#e2e8f0', fontSize: '0.875rem', fontWeight: '600' }}>{player.otEV}</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.25rem' }}>xGA/60</div>
                  <div style={{ color: getDefenseColor(player.matchupFactors?.defense?.rank), fontWeight: '600' }}>
                    {player.matchupFactors?.defense?.xGA_per60 || 'N/A'}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Goalie</div>
                  <div style={{ color: (player.matchupFactors?.goalie?.gsae || 0) < -2 ? '#10b981' : '#94a3b8', fontWeight: '600' }}>
                    {(player.matchupFactors?.goalie?.gsae || 0).toFixed(1)}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.25rem' }}>SOG/gm</div>
                  <div style={{ color: '#e2e8f0', fontWeight: '600' }}>
                    {player.playerStats?.shotsPerGame?.toFixed(1) || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <PlayerDetailModal
          player={selectedPlayer}
          isOpen={!!selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          isPremium={isPremium}
        />
      )}
    </>
  );
}

const headerCellStyle = {
  padding: '1rem',
  textAlign: 'center',
  fontSize: '0.75rem',
  fontWeight: '600',
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const cellStyle = {
  padding: '1rem',
  textAlign: 'center',
  fontSize: '0.875rem',
  color: '#cbd5e1'
};

export default PlayerRankingsTable;

