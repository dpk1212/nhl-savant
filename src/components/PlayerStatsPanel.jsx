import React, { useState, useEffect } from 'react';

const TOTAL_TEAMS = 365;

const D1_AVG_SHOOTING = { efg: 50.0, three: 34.0, ft: 72.0 };

const getTier = (rank) => {
  if (rank == null) return { label: '?', color: '#94A3B8', bg: 'rgba(148,163,184,0.10)' };
  if (rank <= 25) return { label: 'ELITE', color: '#10B981', bg: 'rgba(16,185,129,0.12)' };
  if (rank <= 50) return { label: 'EXCELLENT', color: '#06B6D4', bg: 'rgba(6,182,212,0.10)' };
  if (rank <= 100) return { label: 'STRONG', color: '#3B82F6', bg: 'rgba(59,130,246,0.10)' };
  if (rank <= 175) return { label: 'AVERAGE', color: '#F59E0B', bg: 'rgba(245,158,11,0.10)' };
  if (rank <= 275) return { label: 'BELOW AVG', color: '#F97316', bg: 'rgba(249,115,22,0.10)' };
  return { label: 'WEAK', color: '#EF4444', bg: 'rgba(239,68,68,0.10)' };
};

const shootColor = (val, avg) => {
  const diff = val - avg;
  if (diff > 5) return '#10B981';
  if (diff > 1) return '#22D3EE';
  if (diff > -2) return '#94A3B8';
  if (diff > -5) return '#F59E0B';
  return '#EF4444';
};

const getTeamAbbrev = (name, maxLen = 10) => {
  if (!name) return '?';
  if (name.length <= maxLen) return name;
  const known = {
    'North Carolina': 'UNC', 'South Carolina': 'S Carolina', 'Massachusetts': 'UMass',
    'Connecticut': 'UConn', 'Mississippi State': 'Miss St', 'Mississippi': 'Ole Miss',
    'Michigan State': 'Mich St', 'Ohio State': 'Ohio St', 'Penn State': 'Penn St',
    'Florida State': 'FSU', 'Arizona State': 'ASU', 'San Diego State': 'SDSU',
    'Kansas State': 'K-State', 'Oklahoma State': 'Okla St', 'Iowa State': 'Iowa St',
    'Virginia Tech': 'Va Tech', 'Georgia Tech': 'Ga Tech', 'Boston College': 'BC',
    'Middle Tennessee': 'MTSU', 'Louisiana Tech': 'LA Tech', 'Western Kentucky': 'WKU',
    'Northern Iowa': 'UNI', 'Southern Miss': 'So Miss',
  };
  for (const [full, abbr] of Object.entries(known)) {
    if (name.toLowerCase().includes(full.toLowerCase()) && abbr.length <= maxLen) return abbr;
  }
  if (name.includes(' State') && name.replace(' State', ' St').length <= maxLen) return name.replace(' State', ' St');
  const words = name.split(' ');
  if (words[0].length >= 4 && words[0].length <= maxLen) return words[0];
  return name.slice(0, maxLen - 2) + '..';
};

function UsageBar({ usage, isMobile }) {
  const width = Math.min(100, Math.max(0, (usage / 35) * 100));
  const color = usage >= 28 ? '#FBBF24' : usage >= 22 ? '#3B82F6' : '#475569';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ fontSize: isMobile ? '8px' : '9px', color: 'rgba(255,255,255,0.45)', minWidth: '24px' }}>USG</span>
      <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${width}%`, height: '100%', background: color, borderRadius: '2px', transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: isMobile ? '9px' : '10px', fontWeight: '700', color, fontFamily: 'ui-monospace, monospace', minWidth: '28px', textAlign: 'right' }}>
        {usage.toFixed(1)}%
      </span>
    </div>
  );
}

function PlayerRow({ player, isMobile }) {
  return (
    <div style={{
      padding: isMobile ? '8px 6px' : '10px 8px',
      background: 'rgba(255,255,255,0.02)',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.05)',
      marginBottom: '6px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            fontSize: isMobile ? '11px' : '12px', fontWeight: '800', color: '#F1F5F9',
            letterSpacing: '0.02em',
          }}>
            {player.name}
          </span>
          <span style={{
            fontSize: isMobile ? '8px' : '9px', fontWeight: '600',
            color: 'rgba(255,255,255,0.4)',
            padding: '1px 4px', borderRadius: '3px',
            background: 'rgba(255,255,255,0.06)',
          }}>
            {player.position}
          </span>
        </div>
        <span style={{
          fontSize: isMobile ? '8px' : '9px', color: 'rgba(255,255,255,0.35)',
          fontFamily: 'ui-monospace, monospace',
        }}>
          {player.mpg} mpg
        </span>
      </div>

      {/* Main stats row */}
      <div style={{
        display: 'flex', gap: isMobile ? '6px' : '10px',
        marginBottom: '6px',
      }}>
        <StatBubble label="PPG" value={player.ppg} primary isMobile={isMobile} />
        <StatBubble label="RPG" value={player.rpg} isMobile={isMobile} />
        <StatBubble label="APG" value={player.apg} isMobile={isMobile} />
        <StatBubble label="SPG" value={player.spg} isMobile={isMobile} />
        <StatBubble label="BPG" value={player.bpg} isMobile={isMobile} />
      </div>

      {/* Usage bar */}
      <UsageBar usage={player.usage || 0} isMobile={isMobile} />

      {/* Shooting splits */}
      <div style={{
        display: 'flex', gap: isMobile ? '6px' : '10px',
        marginTop: '5px',
      }}>
        <ShootingStat label="eFG%" value={player.efgPct} avg={D1_AVG_SHOOTING.efg} isMobile={isMobile} />
        <ShootingStat label="3PT%" value={player.threePct} avg={D1_AVG_SHOOTING.three} isMobile={isMobile} />
        <ShootingStat label="FT%" value={player.ftPct} avg={D1_AVG_SHOOTING.ft} isMobile={isMobile} />
        <ShootingStat label="TS%" value={player.tsPct} avg={55.0} isMobile={isMobile} />
      </div>
    </div>
  );
}

function StatBubble({ label, value, primary, isMobile }) {
  return (
    <div style={{ textAlign: 'center', flex: primary ? '1.3' : '1' }}>
      <div style={{
        fontSize: primary ? (isMobile ? '14px' : '16px') : (isMobile ? '11px' : '12px'),
        fontWeight: primary ? '900' : '700',
        color: primary ? '#FBBF24' : '#E2E8F0',
        fontFamily: 'ui-monospace, monospace',
      }}>
        {value}
      </div>
      <div style={{
        fontSize: isMobile ? '7px' : '8px',
        color: 'rgba(255,255,255,0.35)',
        fontWeight: '600',
        letterSpacing: '0.05em',
        marginTop: '1px',
      }}>
        {label}
      </div>
    </div>
  );
}

function ShootingStat({ label, value, avg, isMobile }) {
  const color = value > 0 ? shootColor(value, avg) : 'rgba(255,255,255,0.3)';
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{
        fontSize: isMobile ? '10px' : '11px',
        fontWeight: '700', color,
        fontFamily: 'ui-monospace, monospace',
      }}>
        {value > 0 ? `${value}%` : '—'}
      </div>
      <div style={{
        fontSize: isMobile ? '7px' : '8px',
        color: 'rgba(255,255,255,0.3)',
        fontWeight: '600',
      }}>
        {label}
      </div>
    </div>
  );
}

function TeamRatingsHeader({ data, teamName, isMobile }) {
  if (!data) return null;
  const offTier = getTier(data.adjOffRank);
  const defTier = getTier(data.adjDefRank);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: isMobile ? '6px' : '10px',
      padding: '4px 0 6px',
    }}>
      <RatingPill label="AdjO" value={data.adjOff} rank={data.adjOffRank} tier={offTier} isMobile={isMobile} />
      <RatingPill label="AdjD" value={data.adjDef} rank={data.adjDefRank} tier={defTier} isMobile={isMobile} />
      {data.netRank && (
        <span style={{
          fontSize: isMobile ? '8px' : '9px', color: 'rgba(255,255,255,0.35)',
          fontFamily: 'ui-monospace, monospace',
        }}>
          NET #{data.netRank}
        </span>
      )}
    </div>
  );
}

function RatingPill({ label, value, rank, tier, isMobile }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      padding: '2px 6px', borderRadius: '4px',
      background: tier.bg, border: `1px solid ${tier.color}25`,
      fontSize: isMobile ? '9px' : '10px', fontWeight: '700',
      fontFamily: 'ui-monospace, monospace',
    }}>
      <span style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</span>
      <span style={{ color: tier.color }}>{value}</span>
      {rank != null && (
        <span style={{ color: tier.color, opacity: 0.7 }}>#{rank}</span>
      )}
    </span>
  );
}

function TeamColumn({ data, teamName, side, isMobile }) {
  if (!data || !data.players || data.players.length === 0) {
    return (
      <div style={{
        flex: 1, minWidth: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 0',
        color: 'rgba(255,255,255,0.3)', fontSize: '11px',
      }}>
        No player data
      </div>
    );
  }

  const abbrev = getTeamAbbrev(teamName, isMobile ? 8 : 12);
  const topPlayers = data.players.slice(0, 4);

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* Team header */}
      <div style={{
        textAlign: 'center',
        padding: isMobile ? '6px 4px 4px' : '8px 6px 6px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '8px',
      }}>
        <div style={{
          fontSize: isMobile ? '12px' : '14px', fontWeight: '900',
          color: side === 'away' ? '#60A5FA' : '#F87171',
          letterSpacing: '0.04em',
        }}>
          {abbrev}
        </div>
        <TeamRatingsHeader data={data} teamName={teamName} isMobile={isMobile} />
      </div>

      {/* Player rows */}
      {topPlayers.map((player, i) => (
        <PlayerRow key={`${player.name}-${i}`} player={player} isMobile={isMobile} />
      ))}
    </div>
  );
}

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
        textAlign: 'center',
        marginBottom: isMobile ? '10px' : '14px',
      }}>
        <div style={{
          fontSize: isMobile ? '11px' : '12px', fontWeight: '900',
          color: '#FBBF24', letterSpacing: '0.12em',
          textShadow: '0 0 20px rgba(251,191,36,0.2)',
        }}>
          KEY PLAYERS
        </div>
        <div style={{
          fontSize: isMobile ? '9px' : '10px',
          color: 'rgba(255,255,255,0.4)', marginTop: '2px',
        }}>
          Top 4 by minutes · CBBD season stats
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.25), transparent)', marginBottom: '10px' }} />

      {/* Two columns */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '12px' : '12px',
      }}>
        <TeamColumn data={awayStats} teamName={awayTeam} side="away" isMobile={isMobile} />
        {!isMobile && (
          <div style={{ width: '1px', background: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.3), transparent)' }} />
        )}
        <TeamColumn data={homeStats} teamName={homeTeam} side="home" isMobile={isMobile} />
      </div>
    </div>
  );
}

export default PlayerStatsPanel;
