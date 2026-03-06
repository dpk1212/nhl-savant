import React, { useState, useEffect } from 'react';

const D1_AVG = { efg: 50.0, three: 34.0, ft: 72.0, ts: 55.0, usage: 20.0 };

function getPlayerMatchups(player, oppDefense) {
  if (!player || !oppDefense) return [];
  const matchups = [];
  const bd = player.shotProfile?.breakdown || {};
  const sp = player.shotProfile || {};

  // 3PT sniper vs weak perimeter defense
  if (player.threePct >= 35 && bd.threePointJumpers >= 35 && oppDefense.threeP_def_rank > 180) {
    const severity = oppDefense.threeP_def_rank > 280 ? 'hot' : 'warm';
    matchups.push({
      type: '3PT MISMATCH',
      detail: `Shoots ${player.threePct}% from 3 • Opp 3P def #${oppDefense.threeP_def_rank}`,
      color: '#FBBF24',
      severity,
    });
  }

  // Rim attacker vs weak interior defense
  if (sp.layups?.pct >= 50 && bd.layups >= 25 && oppDefense.twoP_def_rank > 180) {
    const severity = oppDefense.twoP_def_rank > 280 ? 'hot' : 'warm';
    matchups.push({
      type: 'RIM ADVANTAGE',
      detail: `${sp.layups.pct}% at rim • Opp 2P def #${oppDefense.twoP_def_rank}`,
      color: '#10B981',
      severity,
    });
  }

  // Rebounder vs poor defensive rebounding
  if (player.rpg >= 5 && oppDefense.oreb_def_rank > 200) {
    matchups.push({
      type: 'BOARDS EDGE',
      detail: `${player.rpg} RPG • Opp reb def #${oppDefense.oreb_def_rank}`,
      color: '#22D3EE',
      severity: 'warm',
    });
  }

  // High-usage scorer vs overall bad defense
  if (player.usage >= 24 && player.ppg >= 12 && oppDefense.adjDef_rank > 200) {
    matchups.push({
      type: 'EXPLOITABLE D',
      detail: `${player.usage}% USG • Opp def #${oppDefense.adjDef_rank}`,
      color: '#A78BFA',
      severity: oppDefense.adjDef_rank > 300 ? 'hot' : 'warm',
    });
  }

  // FT merchant vs foul-prone defense
  if (player.ftPct >= 75 && oppDefense.ftRate_def_rank > 220) {
    matchups.push({
      type: 'FT UPSIDE',
      detail: `${player.ftPct}% FT • Opp FT rate def #${oppDefense.ftRate_def_rank}`,
      color: '#F97316',
      severity: 'warm',
    });
  }

  return matchups;
}

const getTier = (rank) => {
  if (rank == null) return { label: '—', color: '#94A3B8', bg: 'rgba(148,163,184,0.08)' };
  if (rank <= 25) return { label: 'ELITE', color: '#10B981', bg: 'rgba(16,185,129,0.12)' };
  if (rank <= 75) return { label: 'STRONG', color: '#22D3EE', bg: 'rgba(6,182,212,0.10)' };
  if (rank <= 175) return { label: 'AVG', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' };
  if (rank <= 275) return { label: 'WEAK', color: '#F97316', bg: 'rgba(249,115,22,0.08)' };
  return { label: 'POOR', color: '#EF4444', bg: 'rgba(239,68,68,0.08)' };
};

const statColor = (val, avg) => {
  if (val == null || val === 0) return '#475569';
  const d = val - avg;
  if (d > 6) return '#10B981';
  if (d > 2) return '#22D3EE';
  if (d > -2) return '#94A3B8';
  if (d > -6) return '#F59E0B';
  return '#EF4444';
};

const statLabel = (val, avg) => {
  if (val == null || val === 0) return '';
  const d = val - avg;
  if (d > 6) return 'Elite';
  if (d > 2) return 'Above Avg';
  if (d > -2) return '';
  if (d > -6) return 'Below Avg';
  return 'Poor';
};

const getTeamAbbrev = (name, maxLen = 14) => {
  if (!name) return '?';
  if (name.length <= maxLen) return name;
  const known = {
    'North Carolina': 'UNC', 'South Carolina': 'S Carolina', 'Massachusetts': 'UMass',
    'Connecticut': 'UConn', 'Mississippi State': 'Miss St', 'Mississippi': 'Ole Miss',
    'Michigan State': 'Mich St', 'Ohio State': 'Ohio St', 'Penn State': 'Penn St',
    'Florida State': 'FSU', 'Arizona State': 'ASU', 'San Diego State': 'SDSU',
    'Middle Tennessee': 'MTSU', 'Louisiana Tech': 'LA Tech', 'Western Kentucky': 'WKU',
    'Northern Iowa': 'UNI', 'Southern Miss': 'So Miss', 'Florida International': 'FIU',
    'Sam Houston State': 'Sam Houston', 'Southeast Missouri State': 'SEMO',
    'South Dakota State': 'SDSU', 'North Dakota State': 'NDSU',
    'Cal State Bakersfield': 'CSU Bako', 'Cal State Northridge': 'CSUN',
    'Cal State Fullerton': 'CSU Full', 'California Baptist': 'Cal Baptist',
  };
  for (const [full, abbr] of Object.entries(known)) {
    if (name.toLowerCase().includes(full.toLowerCase()) && abbr.length <= maxLen) return abbr;
  }
  if (name.includes(' State')) return name.replace(' State', ' St');
  const w = name.split(' ');
  if (w[0].length >= 4 && w[0].length <= maxLen) return w[0];
  return name.slice(0, maxLen - 1) + '.';
};

function EfficiencyComparison({ away, home, awayName, homeName, isMobile }) {
  const metrics = [
    {
      label: 'OFF',
      away: { val: away?.adjOff || 0, rank: away?.adjOffRank },
      home: { val: home?.adjOff || 0, rank: home?.adjOffRank },
      higher: true,
    },
    {
      label: 'DEF',
      away: { val: away?.adjDef || 0, rank: away?.adjDefRank },
      home: { val: home?.adjDef || 0, rank: home?.adjDefRank },
      higher: false,
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: isMobile ? '8px' : '12px',
      marginBottom: isMobile ? '16px' : '20px',
    }}>
      {metrics.map((m) => {
        const awayTier = getTier(m.away.rank);
        const homeTier = getTier(m.home.rank);
        const awayBetter = m.higher ? m.away.val > m.home.val : m.away.val < m.home.val;

        return (
          <div key={m.label} style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '10px',
            padding: isMobile ? '10px' : '12px 16px',
          }}>
            <div style={{
              fontSize: '9px', fontWeight: '700', letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
              marginBottom: '8px', textAlign: 'center',
            }}>
              {m.label === 'OFF' ? 'Adj. Offense' : 'Adj. Defense'}
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{
                  fontSize: '9px', fontWeight: '800', color: '#60A5FA',
                  marginBottom: '4px', letterSpacing: '0.02em',
                }}>
                  {getTeamAbbrev(awayName, isMobile ? 8 : 12)}
                </div>
                <div style={{
                  fontSize: isMobile ? '16px' : '18px', fontWeight: '900',
                  color: awayTier.color,
                  fontFamily: 'ui-monospace, monospace',
                  lineHeight: 1.2,
                }}>
                  {m.away.val}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                  marginTop: '3px',
                }}>
                  <span style={{
                    fontSize: '8px', fontWeight: '700', color: awayTier.color, opacity: 0.7,
                    fontFamily: 'ui-monospace, monospace',
                  }}>#{m.away.rank || '—'}</span>
                  {awayBetter && <span style={{ fontSize: '7px', color: '#10B981' }}>●</span>}
                </div>
              </div>
              <div style={{
                width: '1px', height: '36px',
                background: 'rgba(255,255,255,0.06)',
                margin: '0 8px',
              }} />
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{
                  fontSize: '9px', fontWeight: '800', color: '#F87171',
                  marginBottom: '4px', letterSpacing: '0.02em',
                }}>
                  {getTeamAbbrev(homeName, isMobile ? 8 : 12)}
                </div>
                <div style={{
                  fontSize: isMobile ? '16px' : '18px', fontWeight: '900',
                  color: homeTier.color,
                  fontFamily: 'ui-monospace, monospace',
                  lineHeight: 1.2,
                }}>
                  {m.home.val}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                  marginTop: '3px',
                }}>
                  {!awayBetter && <span style={{ fontSize: '7px', color: '#10B981' }}>●</span>}
                  <span style={{
                    fontSize: '8px', fontWeight: '700', color: homeTier.color, opacity: 0.7,
                    fontFamily: 'ui-monospace, monospace',
                  }}>#{m.home.rank || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ShootingStat({ label, value, avg, isMobile }) {
  if (!value || value === 0) return null;
  const color = statColor(value, avg);
  const pct = Math.min(100, (value / (avg * 1.5)) * 100);

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: '3px',
      }}>
        <span style={{
          fontSize: '9px', fontWeight: '600', color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.04em',
        }}>{label}</span>
        <span style={{
          fontSize: isMobile ? '11px' : '12px', fontWeight: '800',
          color, fontFamily: 'ui-monospace, monospace',
        }}>{value}%</span>
      </div>
      <div style={{
        height: '4px', borderRadius: '2px',
        background: 'rgba(255,255,255,0.06)',
        overflow: 'hidden', position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          left: `${Math.min(100, (avg / (avg * 1.5)) * 100)}%`,
          top: 0, bottom: 0, width: '1px',
          background: 'rgba(255,255,255,0.15)',
          zIndex: 1,
        }} />
        <div style={{
          width: `${pct}%`, height: '100%',
          background: color, borderRadius: '2px',
          transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  );
}

function GameLogRow({ game, isMobile }) {
  const fgPct = game.fga > 0 ? ((game.fgm / game.fga) * 100).toFixed(0) : '—';
  const dateStr = game.date ? game.date.slice(5).replace('-', '/') : '?';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '38px 1fr 30px 24px 24px 42px' : '42px 1fr 32px 26px 26px 48px',
      gap: '3px', alignItems: 'center',
      padding: '4px 0',
      borderBottom: '1px solid rgba(255,255,255,0.03)',
      fontSize: isMobile ? '9px' : '10px',
      fontFamily: 'ui-monospace, monospace',
    }}>
      <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: '600' }}>{dateStr}</span>
      <span style={{
        color: 'rgba(255,255,255,0.5)', fontWeight: '600',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>vs {game.opp}</span>
      <span style={{ textAlign: 'center', fontWeight: '800', color: game.pts >= 20 ? '#FBBF24' : game.pts >= 15 ? '#E2E8F0' : '#94A3B8' }}>
        {game.pts}
      </span>
      <span style={{ textAlign: 'center', color: '#94A3B8' }}>{game.reb}</span>
      <span style={{ textAlign: 'center', color: '#94A3B8' }}>{game.ast}</span>
      <span style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
        {game.fgm}-{game.fga}
      </span>
    </div>
  );
}

function ShotProfileBar({ label, data, isMobile }) {
  if (!data || data.att === 0) return null;
  const pctVal = data.pct || 0;
  const color = pctVal >= 55 ? '#10B981' : pctVal >= 40 ? '#22D3EE' : pctVal >= 30 ? '#F59E0B' : '#EF4444';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
      <span style={{
        fontSize: '9px', fontWeight: '600', color: 'rgba(255,255,255,0.35)',
        minWidth: isMobile ? '42px' : '50px',
      }}>{label}</span>
      <div style={{
        flex: 1, height: '6px', borderRadius: '3px',
        background: 'rgba(255,255,255,0.06)',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${Math.min(100, pctVal)}%`, height: '100%',
          background: color, borderRadius: '3px',
        }} />
      </div>
      <span style={{
        fontSize: isMobile ? '10px' : '11px', fontWeight: '800',
        color, fontFamily: 'ui-monospace, monospace',
        minWidth: '36px', textAlign: 'right',
      }}>{pctVal}%</span>
      <span style={{
        fontSize: '8px', color: 'rgba(255,255,255,0.2)',
        fontFamily: 'ui-monospace, monospace',
        minWidth: '28px', textAlign: 'right',
      }}>{data.made}/{data.att}</span>
    </div>
  );
}

function MatchupBadge({ matchup, isMobile }) {
  const isHot = matchup.severity === 'hot';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      padding: isMobile ? '5px 8px' : '6px 10px',
      borderRadius: '8px',
      background: `${matchup.color}0A`,
      border: `1px solid ${matchup.color}25`,
      animation: isHot ? 'matchupPulse 2s ease-in-out infinite' : 'none',
    }}>
      <div style={{
        width: '6px', height: '6px', borderRadius: '50%',
        background: matchup.color,
        boxShadow: isHot ? `0 0 6px ${matchup.color}` : 'none',
        flexShrink: 0,
      }} />
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: '9px', fontWeight: '800', color: matchup.color,
          letterSpacing: '0.06em',
        }}>{matchup.type}</div>
        <div style={{
          fontSize: '8px', fontWeight: '500', color: 'rgba(255,255,255,0.35)',
          marginTop: '1px',
        }}>{matchup.detail}</div>
      </div>
    </div>
  );
}

function PlayerCard({ player, index, isMobile, maxUsage, sideColor, matchups }) {
  const [expanded, setExpanded] = useState(false);
  const isAlpha = index === 0;
  const usagePct = Math.min(100, ((player.usage || 0) / maxUsage) * 100);
  const usageColor = (player.usage || 0) >= 28 ? '#FBBF24' : (player.usage || 0) >= 22 ? '#3B82F6' : '#64748B';
  const hasDetail = !!(player.recentGames?.length || player.shotProfile);

  return (
    <div
      onClick={() => hasDetail && setExpanded(!expanded)}
      style={{
        background: isAlpha
          ? 'linear-gradient(135deg, rgba(251,191,36,0.06) 0%, rgba(251,191,36,0.02) 100%)'
          : 'rgba(255,255,255,0.015)',
        border: isAlpha
          ? '1px solid rgba(251,191,36,0.2)'
          : expanded
          ? `1px solid ${sideColor}30`
          : '1px solid rgba(255,255,255,0.05)',
        borderRadius: '10px',
        padding: isMobile ? '10px 12px' : '12px 14px',
        transition: 'all 0.2s ease',
        cursor: hasDetail ? 'pointer' : 'default',
      }}
    >
      {/* Player identity row */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1 }}>
          {isAlpha ? (
            <div style={{
              width: '18px', height: '18px', borderRadius: '5px',
              background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(251,191,36,0.08))',
              border: '1px solid rgba(251,191,36,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: '9px', lineHeight: 1, color: '#FBBF24' }}>★</span>
            </div>
          ) : player.jersey ? (
            <div style={{
              minWidth: '20px', height: '18px', borderRadius: '4px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              padding: '0 3px',
            }}>
              <span style={{
                fontSize: '9px', fontWeight: '800', lineHeight: 1,
                color: 'rgba(255,255,255,0.35)',
                fontFamily: 'ui-monospace, monospace',
              }}>#{player.jersey}</span>
            </div>
          ) : null}
          <span style={{
            fontSize: isMobile ? '12px' : '13px',
            fontWeight: isAlpha ? '800' : '600',
            color: isAlpha ? '#F8FAFC' : '#CBD5E1',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {player.name}
          </span>
          {isAlpha && player.jersey && (
            <span style={{
              fontSize: '9px', fontWeight: '800',
              color: 'rgba(251,191,36,0.5)',
              fontFamily: 'ui-monospace, monospace',
              flexShrink: 0,
            }}>#{player.jersey}</span>
          )}
          <span style={{
            fontSize: '9px', fontWeight: '700',
            color: sideColor, opacity: 0.6,
            background: `${sideColor}12`,
            padding: '1px 5px', borderRadius: '4px',
            flexShrink: 0,
          }}>{player.position}</span>
        </div>

        {/* Hero PPG */}
        <div style={{
          textAlign: 'right', flexShrink: 0, marginLeft: '8px',
        }}>
          <div style={{
            fontSize: isAlpha ? (isMobile ? '20px' : '22px') : (isMobile ? '16px' : '18px'),
            fontWeight: '900',
            color: isAlpha ? '#FBBF24' : '#F1F5F9',
            fontFamily: 'ui-monospace, monospace',
            lineHeight: 1,
          }}>{player.ppg}</div>
          <div style={{
            fontSize: '8px', fontWeight: '600', color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.06em', marginTop: '1px',
          }}>PPG</div>
        </div>
      </div>

      {/* Secondary stats row */}
      <div style={{
        display: 'flex', gap: isMobile ? '6px' : '8px',
        marginBottom: '10px',
      }}>
        {[
          { label: 'RPG', value: player.rpg },
          { label: 'APG', value: player.apg },
          { label: 'MPG', value: player.mpg },
        ].map((s) => (
          <div key={s.label} style={{
            flex: 1,
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '6px',
            padding: '5px 0',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: isMobile ? '12px' : '13px', fontWeight: '800',
              color: '#E2E8F0',
              fontFamily: 'ui-monospace, monospace',
              lineHeight: 1.2,
            }}>{s.value}</div>
            <div style={{
              fontSize: '8px', fontWeight: '600',
              color: 'rgba(255,255,255,0.25)',
              letterSpacing: '0.06em', marginTop: '1px',
            }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Shooting profile */}
      <div style={{
        display: 'flex', gap: isMobile ? '8px' : '10px',
        marginBottom: '8px',
      }}>
        <ShootingStat label="eFG" value={player.efgPct} avg={D1_AVG.efg} isMobile={isMobile} />
        <ShootingStat label="3P" value={player.threePct} avg={D1_AVG.three} isMobile={isMobile} />
        <ShootingStat label="FT" value={player.ftPct} avg={D1_AVG.ft} isMobile={isMobile} />
      </div>

      {/* Usage */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <span style={{
          fontSize: '9px', fontWeight: '600', color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.04em', flexShrink: 0,
        }}>USG</span>
        <div style={{
          flex: 1, height: '5px', borderRadius: '3px',
          background: 'rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${usagePct}%`, height: '100%',
            background: `linear-gradient(90deg, ${usageColor}80, ${usageColor})`,
            borderRadius: '3px',
            transition: 'width 0.5s ease',
          }} />
        </div>
        <span style={{
          fontSize: '10px', fontWeight: '800',
          color: usageColor,
          fontFamily: 'ui-monospace, monospace',
          minWidth: '28px', textAlign: 'right',
        }}>{(player.usage || 0).toFixed(0)}%</span>
      </div>

      {/* Matchup badges */}
      {matchups && matchups.length > 0 && (
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '4px',
          marginTop: '8px',
        }}>
          {matchups.map((m, i) => (
            <MatchupBadge key={i} matchup={m} isMobile={isMobile} />
          ))}
        </div>
      )}

      {/* Tap hint */}
      {hasDetail && !expanded && (
        <div style={{
          textAlign: 'center', marginTop: '6px',
          fontSize: '8px', color: 'rgba(255,255,255,0.15)',
          letterSpacing: '0.04em',
        }}>
          TAP FOR DETAILS ▾
        </div>
      )}

      {/* Expanded detail panel */}
      {expanded && hasDetail && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            marginTop: '10px', paddingTop: '10px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Recent game log */}
          {player.recentGames && player.recentGames.length > 0 && (
            <div style={{ marginBottom: player.shotProfile ? '12px' : 0 }}>
              <div style={{
                fontSize: '9px', fontWeight: '700', letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
                marginBottom: '6px',
              }}>Last {player.recentGames.length} Games</div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '38px 1fr 30px 24px 24px 42px' : '42px 1fr 32px 26px 26px 48px',
                gap: '3px', padding: '0 0 3px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                marginBottom: '2px',
              }}>
                {['DATE', 'OPP', 'PTS', 'REB', 'AST', 'FG'].map((h) => (
                  <span key={h} style={{
                    fontSize: '7px', fontWeight: '700', color: 'rgba(255,255,255,0.2)',
                    letterSpacing: '0.06em', textAlign: h === 'DATE' || h === 'OPP' ? 'left' : 'center',
                  }}>{h}</span>
                ))}
              </div>
              {player.recentGames.map((g, i) => (
                <GameLogRow key={i} game={g} isMobile={isMobile} />
              ))}
              {/* Averages row */}
              {player.recentGames.length > 1 && (() => {
                const n = player.recentGames.length;
                const avg = (arr, key) => (arr.reduce((s, g) => s + (g[key] || 0), 0) / n).toFixed(1);
                return (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '38px 1fr 30px 24px 24px 42px' : '42px 1fr 32px 26px 26px 48px',
                    gap: '3px', alignItems: 'center',
                    padding: '4px 0 0',
                    fontSize: isMobile ? '9px' : '10px',
                    fontFamily: 'ui-monospace, monospace',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: '700', fontSize: '8px' }}>AVG</span>
                    <span />
                    <span style={{ textAlign: 'center', fontWeight: '800', color: '#E2E8F0' }}>{avg(player.recentGames, 'pts')}</span>
                    <span style={{ textAlign: 'center', color: '#94A3B8' }}>{avg(player.recentGames, 'reb')}</span>
                    <span style={{ textAlign: 'center', color: '#94A3B8' }}>{avg(player.recentGames, 'ast')}</span>
                    <span />
                  </div>
                );
              })()}
            </div>
          )}

          {/* Shot profile */}
          {player.shotProfile && (
            <div>
              <div style={{
                fontSize: '9px', fontWeight: '700', letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
                marginBottom: '6px',
              }}>Shot Profile</div>
              <ShotProfileBar label="At Rim" data={player.shotProfile.layups} isMobile={isMobile} />
              <ShotProfileBar label="Mid-Range" data={player.shotProfile.midRange} isMobile={isMobile} />
              <ShotProfileBar label="3-Point" data={player.shotProfile.threes} isMobile={isMobile} />
              <ShotProfileBar label="Dunks" data={player.shotProfile.dunks} isMobile={isMobile} />
              {player.shotProfile.breakdown && (
                <div style={{
                  display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap',
                }}>
                  {Object.entries(player.shotProfile.breakdown)
                    .filter(([, v]) => v > 0)
                    .sort(([, a], [, b]) => b - a)
                    .map(([key, val]) => {
                      const labels = {
                        layups: 'Rim', threePointJumpers: '3PT', twoPointJumpers: 'Mid',
                        dunks: 'Dunks', tipIns: 'Tips',
                      };
                      return (
                        <span key={key} style={{
                          fontSize: '8px', fontWeight: '700',
                          color: 'rgba(255,255,255,0.35)',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '4px', padding: '2px 6px',
                          fontFamily: 'ui-monospace, monospace',
                        }}>
                          {labels[key] || key} {val.toFixed(0)}%
                        </span>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* Collapse hint */}
          <div style={{
            textAlign: 'center', marginTop: '8px',
            fontSize: '8px', color: 'rgba(255,255,255,0.15)',
            letterSpacing: '0.04em',
          }}>
            TAP TO COLLAPSE ▴
          </div>
        </div>
      )}
    </div>
  );
}

function TeamColumn({ players, teamName, side, isMobile, oppDefense }) {
  if (!players || players.length === 0) return null;
  const top = players.slice(0, 4);
  const maxUsage = Math.max(...top.map(p => p.usage || 0), 25);
  const abbrev = getTeamAbbrev(teamName, isMobile ? 12 : 16);
  const sideColor = side === 'away' ? '#60A5FA' : '#F87171';
  const matchupCount = oppDefense
    ? top.reduce((sum, p) => sum + getPlayerMatchups(p, oppDefense).length, 0)
    : 0;

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* Team header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        marginBottom: '10px', paddingLeft: '2px',
      }}>
        <div style={{
          width: '4px', height: '16px', borderRadius: '2px',
          background: sideColor,
          boxShadow: `0 0 8px ${sideColor}40`,
        }} />
        <span style={{
          fontSize: isMobile ? '13px' : '14px', fontWeight: '900',
          color: sideColor, letterSpacing: '-0.01em',
        }}>{abbrev}</span>
        <span style={{
          fontSize: '9px', fontWeight: '700',
          color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em',
        }}>{side === 'away' ? 'AWAY' : 'HOME'}</span>
        {matchupCount > 0 && (
          <span style={{
            fontSize: '8px', fontWeight: '800',
            color: '#FBBF24', letterSpacing: '0.06em',
            padding: '2px 6px', borderRadius: '4px',
            background: 'rgba(251,191,36,0.1)',
            border: '1px solid rgba(251,191,36,0.2)',
          }}>{matchupCount} MATCHUP{matchupCount > 1 ? 'S' : ''}</span>
        )}
      </div>

      {/* Player cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {top.map((p, i) => (
          <PlayerCard
            key={`${p.name}-${i}`}
            player={p} index={i} isMobile={isMobile}
            maxUsage={maxUsage} sideColor={sideColor}
            matchups={oppDefense ? getPlayerMatchups(p, oppDefense) : []}
          />
        ))}
      </div>
    </div>
  );
}

export function PlayerStatsPanel({ awayStats, homeStats, awayTeam, homeTeam, barttorvik }) {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!awayStats && !homeStats) return null;

  return (
    <div style={{
      background: 'linear-gradient(180deg, #020617 0%, #0B1120 50%, #0F172A 100%)',
      borderRadius: isMobile ? '14px' : '18px',
      padding: isMobile ? '16px 10px' : '24px 20px',
      color: '#E2E8F0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '10px', marginBottom: isMobile ? '14px' : '18px',
      }}>
        <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.15))' }} />
        <span style={{
          fontSize: isMobile ? '11px' : '12px', fontWeight: '900',
          color: '#FBBF24', letterSpacing: '0.14em',
        }}>KEY PLAYERS</span>
        <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(251,191,36,0.15), transparent)' }} />
      </div>

      {/* Team efficiency comparison */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center', gap: '6px',
        marginBottom: '6px', padding: '0 4px',
      }}>
        <div style={{
          textAlign: 'right',
          fontSize: isMobile ? '12px' : '13px', fontWeight: '800',
          color: '#60A5FA',
        }}>
          {getTeamAbbrev(awayTeam, isMobile ? 10 : 14)}
        </div>
        <span style={{
          fontSize: '9px', color: 'rgba(255,255,255,0.2)',
          fontWeight: '700', letterSpacing: '0.08em',
          padding: '0 6px',
        }}>VS</span>
        <div style={{
          fontSize: isMobile ? '12px' : '13px', fontWeight: '800',
          color: '#F87171',
        }}>
          {getTeamAbbrev(homeTeam, isMobile ? 10 : 14)}
        </div>
      </div>

      <EfficiencyComparison
        away={awayStats} home={homeStats}
        awayName={awayTeam} homeName={homeTeam}
        isMobile={isMobile}
      />

      {/* Matchup intel banner */}
      {barttorvik && (() => {
        const awayPlayers = awayStats?.players?.slice(0, 4) || [];
        const homePlayers = homeStats?.players?.slice(0, 4) || [];
        const awayMatchups = awayPlayers.flatMap(p => getPlayerMatchups(p, barttorvik.home));
        const homeMatchups = homePlayers.flatMap(p => getPlayerMatchups(p, barttorvik.away));
        const hotCount = [...awayMatchups, ...homeMatchups].filter(m => m.severity === 'hot').length;
        const total = awayMatchups.length + homeMatchups.length;
        if (total === 0) return null;
        return (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', marginBottom: '12px', padding: '8px 12px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(251,191,36,0.06), rgba(139,92,246,0.06))',
            border: '1px solid rgba(251,191,36,0.1)',
          }}>
            <span style={{ fontSize: '12px' }}>🎯</span>
            <span style={{
              fontSize: '10px', fontWeight: '800',
              color: '#FBBF24', letterSpacing: '0.06em',
            }}>MATCHUP INTEL</span>
            <span style={{
              fontSize: '9px', fontWeight: '600',
              color: 'rgba(255,255,255,0.35)',
            }}>
              {total} matchup{total > 1 ? 's' : ''} detected
              {hotCount > 0 && ` • ${hotCount} high-value`}
            </span>
          </div>
        );
      })()}

      {/* Player columns */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '18px' : '16px',
      }}>
        <TeamColumn
          players={awayStats?.players}
          teamName={awayTeam} side="away" isMobile={isMobile}
          oppDefense={barttorvik?.home}
        />
        {!isMobile && (
          <div style={{
            width: '1px',
            background: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.15), transparent)',
          }} />
        )}
        <TeamColumn
          players={homeStats?.players}
          teamName={homeTeam} side="home" isMobile={isMobile}
          oppDefense={barttorvik?.away}
        />
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: isMobile ? '8px' : '14px', flexWrap: 'wrap',
        marginTop: isMobile ? '14px' : '18px', paddingTop: '10px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <LegendItem color="#FBBF24" label="★ #1 Option" />
        <LegendDot color="#10B981" label="Above D1 Avg" />
        <LegendDot color="#94A3B8" label="Average" />
        <LegendDot color="#EF4444" label="Below D1 Avg" />
        <span style={{
          fontSize: '8px', color: 'rgba(255,255,255,0.15)',
          letterSpacing: '0.04em',
        }}>
          SOURCE: CBBD
        </span>
      </div>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ fontSize: '9px', color }}>{label.startsWith('★') ? '★' : '●'}</span>
      <span style={{
        fontSize: '8px', fontWeight: '600',
        color: 'rgba(255,255,255,0.25)', letterSpacing: '0.02em',
      }}>{label.startsWith('★') ? label.slice(2) : label}</span>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <div style={{
        width: '5px', height: '5px', borderRadius: '50%',
        background: color,
      }} />
      <span style={{
        fontSize: '8px', fontWeight: '600',
        color: 'rgba(255,255,255,0.25)', letterSpacing: '0.02em',
      }}>{label}</span>
    </div>
  );
}

export default PlayerStatsPanel;
