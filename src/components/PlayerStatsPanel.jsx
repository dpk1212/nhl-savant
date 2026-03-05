import React, { useState, useEffect } from 'react';

const D1_AVG = { efg: 50.0, three: 34.0, ft: 72.0, ts: 55.0, usage: 20.0 };

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

function EfficiencyDuel({ away, home, awayName, homeName, isMobile }) {
  const aOff = away?.adjOff || 0;
  const aDef = away?.adjDef || 0;
  const hOff = home?.adjOff || 0;
  const hDef = home?.adjDef || 0;
  const aOffT = getTier(away?.adjOffRank);
  const aDefT = getTier(away?.adjDefRank);
  const hOffT = getTier(home?.adjOffRank);
  const hDefT = getTier(home?.adjDefRank);

  const CompRow = ({ label, aVal, aRank, aTier, hVal, hRank, hTier, higher }) => {
    const aWins = higher ? aVal > hVal : aVal < hVal;
    const hWins = !aWins;
    return (
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center', gap: '6px', padding: '4px 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
          {aWins && <span style={{ fontSize: '8px', color: '#10B981' }}>◀</span>}
          <span style={{
            fontSize: isMobile ? '11px' : '12px', fontWeight: '800',
            color: aTier.color, fontFamily: 'ui-monospace, monospace',
          }}>{aVal}</span>
          <span style={{
            fontSize: '8px', color: aTier.color, opacity: 0.6,
            fontFamily: 'ui-monospace, monospace',
          }}>#{aRank || '—'}</span>
        </div>
        <span style={{
          fontSize: isMobile ? '8px' : '9px', fontWeight: '700',
          color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em',
          minWidth: '32px', textAlign: 'center',
        }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{
            fontSize: '8px', color: hTier.color, opacity: 0.6,
            fontFamily: 'ui-monospace, monospace',
          }}>#{hRank || '—'}</span>
          <span style={{
            fontSize: isMobile ? '11px' : '12px', fontWeight: '800',
            color: hTier.color, fontFamily: 'ui-monospace, monospace',
          }}>{hVal}</span>
          {hWins && <span style={{ fontSize: '8px', color: '#10B981' }}>▶</span>}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)', borderRadius: '10px',
      border: '1px solid rgba(255,255,255,0.05)',
      padding: isMobile ? '8px 10px' : '10px 16px',
      marginBottom: '12px',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center', marginBottom: '6px',
      }}>
        <div style={{ textAlign: 'right', fontSize: isMobile ? '10px' : '11px', fontWeight: '800', color: '#60A5FA' }}>
          {getTeamAbbrev(awayName, isMobile ? 10 : 14)}
        </div>
        <span style={{
          fontSize: '8px', color: 'rgba(255,255,255,0.25)', padding: '0 8px',
          letterSpacing: '0.1em', fontWeight: '700',
        }}>EFFICIENCY</span>
        <div style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '800', color: '#F87171' }}>
          {getTeamAbbrev(homeName, isMobile ? 10 : 14)}
        </div>
      </div>
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '4px' }} />
      <CompRow label="OFF" aVal={aOff} aRank={away?.adjOffRank} aTier={aOffT} hVal={hOff} hRank={home?.adjOffRank} hTier={hOffT} higher />
      <CompRow label="DEF" aVal={aDef} aRank={away?.adjDefRank} aTier={aDefT} hVal={hDef} hRank={home?.adjDefRank} hTier={hDefT} higher={false} />
    </div>
  );
}

function PlayerTable({ players, teamName, side, isMobile }) {
  if (!players || players.length === 0) return null;
  const top = players.slice(0, 4);
  const maxUsage = Math.max(...top.map(p => p.usage || 0), 20);
  const abbrev = getTeamAbbrev(teamName, isMobile ? 10 : 14);
  const sideColor = side === 'away' ? '#60A5FA' : '#F87171';

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* Team label */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        marginBottom: '8px', paddingLeft: '2px',
      }}>
        <div style={{
          width: '3px', height: '14px', borderRadius: '2px',
          background: sideColor,
        }} />
        <span style={{
          fontSize: isMobile ? '11px' : '12px', fontWeight: '900',
          color: sideColor, letterSpacing: '0.03em',
        }}>{abbrev}</span>
        <span style={{
          fontSize: '8px', color: 'rgba(255,255,255,0.25)',
          fontWeight: '600', letterSpacing: '0.06em',
        }}>{side === 'away' ? 'AWAY' : 'HOME'}</span>
      </div>

      {/* Column headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 36px 28px 28px 50px' : '1fr 40px 32px 32px 60px',
        gap: '2px', padding: '0 4px 4px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '2px',
      }}>
        <span style={hdrStyle(isMobile)}>PLAYER</span>
        <span style={{ ...hdrStyle(isMobile), textAlign: 'center' }}>PPG</span>
        <span style={{ ...hdrStyle(isMobile), textAlign: 'center' }}>RPG</span>
        <span style={{ ...hdrStyle(isMobile), textAlign: 'center' }}>APG</span>
        <span style={{ ...hdrStyle(isMobile), textAlign: 'center' }}>eFG%</span>
      </div>

      {/* Player rows */}
      {top.map((p, i) => {
        const isAlpha = i === 0;
        const usagePct = Math.min(100, ((p.usage || 0) / maxUsage) * 100);
        const usageColor = (p.usage || 0) >= 28 ? '#FBBF24' : (p.usage || 0) >= 22 ? '#3B82F6' : '#475569';
        const efgColor = statColor(p.efgPct, D1_AVG.efg);
        const threeColor = statColor(p.threePct, D1_AVG.three);

        return (
          <div key={`${p.name}-${i}`} style={{
            display: 'flex', flexDirection: 'column', gap: '2px',
            padding: isMobile ? '6px 4px' : '7px 4px',
            background: isAlpha ? 'rgba(251,191,36,0.04)' : 'transparent',
            borderLeft: isAlpha ? '2px solid rgba(251,191,36,0.4)' : '2px solid transparent',
            borderRadius: '4px',
            transition: 'background 0.2s',
          }}>
            {/* Main stat row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 36px 28px 28px 50px' : '1fr 40px 32px 32px 60px',
              gap: '2px', alignItems: 'center',
            }}>
              {/* Name + position */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0 }}>
                {isAlpha && (
                  <span style={{ fontSize: '9px', lineHeight: 1 }}>★</span>
                )}
                <span style={{
                  fontSize: isMobile ? '10px' : '11px',
                  fontWeight: isAlpha ? '800' : '600',
                  color: isAlpha ? '#F1F5F9' : '#CBD5E1',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {p.name}
                </span>
                <span style={{
                  fontSize: '8px', fontWeight: '600',
                  color: 'rgba(255,255,255,0.3)',
                  flexShrink: 0,
                }}>{p.position}</span>
              </div>
              {/* PPG */}
              <div style={{
                textAlign: 'center',
                fontSize: isAlpha ? (isMobile ? '13px' : '14px') : (isMobile ? '11px' : '12px'),
                fontWeight: '800',
                color: isAlpha ? '#FBBF24' : '#E2E8F0',
                fontFamily: 'ui-monospace, monospace',
              }}>{p.ppg}</div>
              {/* RPG */}
              <div style={{
                textAlign: 'center',
                fontSize: isMobile ? '10px' : '11px', fontWeight: '600',
                color: '#94A3B8', fontFamily: 'ui-monospace, monospace',
              }}>{p.rpg}</div>
              {/* APG */}
              <div style={{
                textAlign: 'center',
                fontSize: isMobile ? '10px' : '11px', fontWeight: '600',
                color: '#94A3B8', fontFamily: 'ui-monospace, monospace',
              }}>{p.apg}</div>
              {/* eFG% */}
              <div style={{
                textAlign: 'center',
                fontSize: isMobile ? '10px' : '11px', fontWeight: '700',
                color: efgColor, fontFamily: 'ui-monospace, monospace',
              }}>{p.efgPct > 0 ? `${p.efgPct}` : '—'}</div>
            </div>

            {/* Usage + shooting micro-row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              paddingLeft: isAlpha ? '14px' : '0px',
            }}>
              {/* Usage bar */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '3px', flex: 1,
              }}>
                <div style={{
                  flex: 1, height: '3px', maxWidth: '60px',
                  background: 'rgba(255,255,255,0.06)', borderRadius: '2px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${usagePct}%`, height: '100%',
                    background: usageColor, borderRadius: '2px',
                  }} />
                </div>
                <span style={{
                  fontSize: '8px', fontWeight: '700', color: usageColor,
                  fontFamily: 'ui-monospace, monospace', minWidth: '20px',
                }}>{(p.usage || 0).toFixed(0)}%</span>
              </div>
              {/* Shooting badges */}
              <div style={{ display: 'flex', gap: '3px' }}>
                <ShootBadge label="3P" value={p.threePct} color={threeColor} isMobile={isMobile} />
                <ShootBadge label="FT" value={p.ftPct} color={statColor(p.ftPct, D1_AVG.ft)} isMobile={isMobile} />
              </div>
              {/* MPG */}
              <span style={{
                fontSize: '8px', color: 'rgba(255,255,255,0.2)',
                fontFamily: 'ui-monospace, monospace', minWidth: '24px', textAlign: 'right',
              }}>{p.mpg}m</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ShootBadge({ label, value, color, isMobile }) {
  if (!value || value === 0) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '2px',
      padding: '1px 4px', borderRadius: '3px',
      background: `${color}12`, border: `1px solid ${color}20`,
      fontSize: isMobile ? '7px' : '8px', fontWeight: '700',
      fontFamily: 'ui-monospace, monospace', color,
    }}>
      <span style={{ opacity: 0.7 }}>{label}</span>{value}
    </span>
  );
}

const hdrStyle = (isMobile) => ({
  fontSize: isMobile ? '7px' : '8px',
  fontWeight: '700', color: 'rgba(255,255,255,0.25)',
  letterSpacing: '0.08em', textTransform: 'uppercase',
});

export function PlayerStatsPanel({ awayStats, homeStats, awayTeam, homeTeam }) {
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
      padding: isMobile ? '14px 8px' : '20px 16px',
      color: '#E2E8F0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '8px', marginBottom: '12px',
      }}>
        <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.2))' }} />
        <span style={{
          fontSize: isMobile ? '10px' : '11px', fontWeight: '900',
          color: '#FBBF24', letterSpacing: '0.14em',
          textShadow: '0 0 16px rgba(251,191,36,0.15)',
        }}>KEY PLAYERS</span>
        <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(251,191,36,0.2), transparent)' }} />
      </div>

      {/* Efficiency head-to-head */}
      <EfficiencyDuel
        away={awayStats} home={homeStats}
        awayName={awayTeam} homeName={homeTeam}
        isMobile={isMobile}
      />

      {/* Player tables */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '14px' : '12px',
      }}>
        <PlayerTable
          players={awayStats?.players}
          teamName={awayTeam} side="away" isMobile={isMobile}
        />
        {!isMobile && (
          <div style={{
            width: '1px',
            background: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.2), transparent)',
          }} />
        )}
        <PlayerTable
          players={homeStats?.players}
          teamName={homeTeam} side="home" isMobile={isMobile}
        />
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center', marginTop: '10px', paddingTop: '6px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <span style={{
          fontSize: '8px', color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.06em',
        }}>
          ★ = #1 OPTION · SHOOTING COLOR-CODED VS D1 AVG · SOURCE: CBBD
        </span>
      </div>
    </div>
  );
}

export default PlayerStatsPanel;
