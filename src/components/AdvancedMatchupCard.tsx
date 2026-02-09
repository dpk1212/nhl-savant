/**
 * MATCHUP INTELLIGENCE v2 — Premium Redesign
 * Mobile-first, video-game inspired advanced analytics dashboard
 * 
 * Sections:
 *  1. Versus Banner (Hero)
 *  2. Edge Meter (Verdict)
 *  3. Shot Profile (PBP zones)
 *  4. Four Factors (2x2 grid)
 *  5. Analyst Verdict (Footer)
 */

import React, { useState, useEffect } from 'react';
import { ArrowRightLeft } from 'lucide-react';

const TOTAL_TEAMS = 365;

// D1 averages for context
const D1_AVG = {
  twoP: 50.0, threeP: 34.0, threePRate: 40.0, eFG: 50.0,
  oreb: 28.0, to: 17.0, ftRate: 32.0, tempo: 67.5,
  close2: 52.0, far2: 36.0, dunks: 70.0
};

// ─── Interfaces ───────────────────────────────────────────
interface TeamStats {
  rank: number; adjOff: number; adjOff_rank: number; adjDef: number; adjDef_rank: number;
  eFG_off: number; eFG_def: number; to_off: number; to_def: number;
  oreb_off: number; oreb_def: number; twoP_off: number; twoP_def?: number;
  threeP_off: number; threeP_def?: number; bartholomew?: number; bartholomew_rank?: number;
  adjTempo?: number; ftRate_off?: number; ftRate_def?: number;
  threeP_rate_off?: number; threeP_rate_def?: number;
  wab?: number; wab_rank?: number;
}

interface PBPTeamData {
  dunks_off_fg: number; dunks_off_share: number; dunks_def_fg: number; dunks_def_share: number;
  close2_off_fg: number; close2_off_share: number; close2_def_fg: number; close2_def_share: number;
  far2_off_fg: number; far2_off_share: number; far2_def_fg: number; far2_def_share: number;
  three_off_fg: number; three_off_share: number; three_def_fg: number; three_def_share: number;
}

interface AdvancedMatchupCardProps {
  barttorvik: {
    awayBartName?: string;
    homeBartName?: string;
    away: TeamStats;
    home: TeamStats;
    matchup: { rankAdvantage: 'away' | 'home'; rankDiff: number; };
  };
  awayTeam: string;
  homeTeam: string;
  pbpData?: Record<string, PBPTeamData>;
}

type ViewMode = 'awayOff_homeDef' | 'homeOff_awayDef';

// ─── Helpers ──────────────────────────────────────────────

const getTier = (rank: number) => {
  if (rank <= 25) return { label: 'ELITE', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' };
  if (rank <= 50) return { label: 'EXCELLENT', color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.10)' };
  if (rank <= 100) return { label: 'STRONG', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.10)' };
  if (rank <= 175) return { label: 'AVERAGE', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.10)' };
  if (rank <= 275) return { label: 'BELOW AVG', color: '#F97316', bg: 'rgba(249, 115, 22, 0.10)' };
  return { label: 'WEAK', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.10)' };
};

const getTeamAbbrev = (name: string, maxLen: number = 12): string => {
  if (name.length <= maxLen) return name;
  const known: Record<string, string> = {
    'North Carolina': 'UNC', 'South Carolina': 'S Carolina', 'Massachusetts': 'UMass',
    'Connecticut': 'UConn', 'Mississippi State': 'Miss St', 'Mississippi': 'Ole Miss',
    'Michigan State': 'Mich St', 'Ohio State': 'Ohio St', 'Penn State': 'Penn St',
    'Florida State': 'FSU', 'Arizona State': 'ASU', 'San Diego State': 'SDSU',
    'Kansas State': 'K-State', 'Oklahoma State': 'Okla St', 'Iowa State': 'Iowa St',
    'Virginia Tech': 'Va Tech', 'Georgia Tech': 'Ga Tech', 'Boston College': 'BC',
    'Wake Forest': 'Wake', 'Notre Dame': 'ND', 'Saint Louis': 'SLU',
    "Saint Mary's": "St Mary's", 'Northern Iowa': 'UNI', 'Middle Tennessee': 'MTSU',
    'Louisiana Tech': 'LA Tech', 'Western Kentucky': 'WKU', 'Bowling Green': 'BGSU',
    'Texas A&M': 'Texas A&M', 'Texas Tech': 'Texas Tech',
  };
  for (const [full, abbr] of Object.entries(known)) {
    if (name.toLowerCase().includes(full.toLowerCase()) && abbr.length <= maxLen) return abbr;
  }
  if (name.includes(' State') && name.replace(' State', ' St').length <= maxLen) return name.replace(' State', ' St');
  const dirMap: Record<string, string> = { 'North ': 'N ', 'South ': 'S ', 'East ': 'E ', 'West ': 'W ', 'Northern ': 'N ', 'Southern ': 'S ', 'Eastern ': 'E ', 'Western ': 'W ' };
  let s = name;
  for (const [full, abbr] of Object.entries(dirMap)) { if (s.startsWith(full)) { s = abbr + s.slice(full.length); break; } }
  if (s.length <= maxLen) return s;
  const w = name.split(' ');
  if (w[0].length >= 4 && w[0].length <= maxLen) return w[0];
  return name.slice(0, maxLen - 2) + '..';
};

const getStatColor = (value: number, avg: number, higherIsBetter: boolean = true) => {
  const diff = higherIsBetter ? value - avg : avg - value;
  if (diff > 4) return '#10B981';
  if (diff > 1) return '#22D3EE';
  if (diff > -2) return '#F59E0B';
  return '#EF4444';
};

// ─── Keyframe injection (once) ────────────────────────────
const ANIM_ID = 'matchup-intel-v2-anims';
if (typeof document !== 'undefined' && !document.getElementById(ANIM_ID)) {
  const style = document.createElement('style');
  style.id = ANIM_ID;
  style.textContent = `
    @keyframes mi2-slideRight { from { width: 0%; } }
    @keyframes mi2-fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes mi2-pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
    @keyframes mi2-glow { 0%, 100% { box-shadow: 0 0 8px rgba(16,185,129,0.3); } 50% { box-shadow: 0 0 20px rgba(16,185,129,0.6); } }
  `;
  document.head.appendChild(style);
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

export function AdvancedMatchupCard({ barttorvik, awayTeam, homeTeam, pbpData = {} }: AdvancedMatchupCardProps) {
  const [view, setView] = useState<ViewMode>('awayOff_homeDef');
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!barttorvik) return null;

  const { away, home } = barttorvik;
  const isAwayView = view === 'awayOff_homeDef';
  const offTeam = isAwayView ? away : home;
  const defTeam = isAwayView ? home : away;
  const offName = isAwayView ? awayTeam : homeTeam;
  const defName = isAwayView ? homeTeam : awayTeam;

  // Ranks
  const awayRank = away.bartholomew_rank || away.rank || 182;
  const homeRank = home.bartholomew_rank || home.rank || 182;
  const awayTier = getTier(awayRank);
  const homeTier = getTier(homeRank);
  const powerWinner = awayRank < homeRank ? 'away' : 'home';
  const powerGap = Math.abs(awayRank - homeRank);

  // Abbreviated names
  const ml = isMobile ? 10 : 14;
  const awayA = getTeamAbbrev(awayTeam, ml);
  const homeA = getTeamAbbrev(homeTeam, ml);
  const offA = getTeamAbbrev(offName, ml);
  const defA = getTeamAbbrev(defName, ml);

  // PBP data lookup
  const awayPBP = pbpData[barttorvik.awayBartName || ''] || null;
  const homePBP = pbpData[barttorvik.homeBartName || ''] || null;
  const hasPBP = !!(awayPBP && homePBP);

  // Edge calculations for verdict chips
  const aOffR = away.adjOff_rank || 182;
  const hOffR = home.adjOff_rank || 182;
  const aDefR = away.adjDef_rank || 182;
  const hDefR = home.adjDef_rank || 182;
  const edges = {
    power: { winner: powerWinner, gap: powerGap },
    offense: { winner: aOffR < hOffR ? 'away' : 'home', gap: Math.abs(aOffR - hOffR) },
    defense: { winner: aDefR < hDefR ? 'away' : 'home', gap: Math.abs(aDefR - hDefR) },
    shooting: { winner: away.eFG_off > home.eFG_off ? 'away' : 'home', gap: Math.abs(away.eFG_off - home.eFG_off) },
    turnovers: { winner: away.to_off < home.to_off ? 'away' : 'home', gap: Math.abs(away.to_off - home.to_off) },
    rebounding: { winner: away.oreb_off > home.oreb_off ? 'away' : 'home', gap: Math.abs(away.oreb_off - home.oreb_off) },
  };

  // Count category wins
  const awayWins = Object.values(edges).filter(e => e.winner === 'away').length;
  const homeWins = Object.values(edges).filter(e => e.winner === 'home').length;
  const edgePct = Math.round((awayWins / (awayWins + homeWins)) * 100);
  const overallWinner = awayWins > homeWins ? 'away' : 'home';
  const winnerName = overallWinner === 'away' ? awayA : homeA;
  const winCount = Math.max(awayWins, homeWins);

  // Stats for four factors
  const eFG = { off: offTeam.eFG_off || 50, def: defTeam.eFG_def || 50 };
  const to = { off: offTeam.to_off || 17, def: defTeam.to_def || 17 };
  const oreb = { off: offTeam.oreb_off || 28, def: defTeam.oreb_def || 28 };
  const ftRate = { off: offTeam.ftRate_off || 32, def: defTeam.ftRate_def || 32 };
  const tempo = { away: away.adjTempo || 67.5, home: home.adjTempo || 67.5 };

  // Insight generation
  const generateInsight = () => {
    const oW = overallWinner === 'away' ? awayA : homeA;
    const oL = overallWinner === 'away' ? homeA : awayA;
    const oWR = overallWinner === 'away' ? awayRank : homeRank;
    const allSame = edges.offense.winner === edges.defense.winner && edges.defense.winner === edges.power.winner;
    
    if (allSame && powerGap > 100) {
      return { headline: `${oW} should dominate this one.`, body: `Ranked #${oWR} overall with clear advantages on both ends of the floor, ${oW} outclasses ${oL} in every phase. This is a significant mismatch.`, confidence: 95 };
    }
    if (allSame && powerGap > 50) {
      return { headline: `${oW} holds meaningful advantages.`, body: `With a #${oWR} power rating and edges in both offense and defense, ${oW} should dictate pace. ${oL} will need to overperform to stay competitive.`, confidence: 80 };
    }
    if (allSame && powerGap > 25) {
      return { headline: `Lean ${oW}, but it's competitive.`, body: `The metrics favor ${oW} across the board, though margins are tight. A strong shooting night from ${oL} could flip the script.`, confidence: 65 };
    }
    if (winCount >= 4) {
      return { headline: `${oW} wins ${winCount} of 6 key matchups.`, body: `Despite not dominating everywhere, ${oW} has the edge in more categories than ${oL}. The cumulative advantage matters.`, confidence: 60 };
    }
    if (powerGap < 15) {
      return { headline: `This is a coin flip.`, body: `These teams are nearly identical by the numbers. Expect a tight game where execution and shooting variance decide it.`, confidence: 45 };
    }
    return { headline: `Split edges make this interesting.`, body: `Each team has clear strengths — ${oW} owns ${winCount} categories but ${oL} has counter-punches. Watch which style wins out.`, confidence: 55 };
  };

  const insight = generateInsight();
  const pad = isMobile ? '14px' : '20px';
  const gap = isMobile ? '10px' : '14px';

  return (
    <div style={{
      background: 'linear-gradient(180deg, #020617 0%, #0B1120 50%, #0F172A 100%)',
      borderRadius: isMobile ? '14px' : '18px',
      border: `1px solid rgba(99, 102, 241, 0.12)`,
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: VERSUS BANNER (Hero)
         ═══════════════════════════════════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(139, 92, 246, 0.08) 50%, rgba(99, 102, 241, 0.04) 100%)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.08)',
        padding: `${isMobile ? '16px' : '24px'} ${pad}`,
      }}>
        {/* Eyebrow */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '14px' : '18px' }}>
          <span style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(167, 139, 250, 0.6)', letterSpacing: '0.25em', textTransform: 'uppercase' }}>MATCHUP INTELLIGENCE</span>
        </div>

        {/* Team vs Team */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          {/* Away */}
          <div style={{
            flex: 1, textAlign: 'center',
            padding: isMobile ? '10px 4px' : '14px 8px', borderRadius: '12px',
            background: powerWinner === 'away' ? `${awayTier.color}06` : 'transparent',
            border: powerWinner === 'away' ? `1px solid ${awayTier.color}18` : '1px solid transparent',
            transition: 'all 0.5s ease',
          }}>
            <div style={{
              fontSize: isMobile ? '28px' : '36px', fontWeight: '900', color: awayTier.color,
              fontFamily: 'ui-monospace, SFMono-Regular, monospace', lineHeight: 1,
              textShadow: powerWinner === 'away' ? `0 0 20px ${awayTier.color}50` : 'none',
            }}>#{awayRank}</div>
            <div style={{
              fontSize: isMobile ? '13px' : '15px', fontWeight: '700', color: 'white', marginTop: '4px',
              opacity: powerWinner === 'away' ? 1 : 0.6,
            }}>{awayA}</div>
            <div style={{
              display: 'inline-block', marginTop: '6px',
              padding: '3px 10px', borderRadius: '20px',
              background: awayTier.bg, border: `1px solid ${awayTier.color}30`,
              fontSize: '9px', fontWeight: '700', color: awayTier.color, letterSpacing: '0.08em',
            }}>{awayTier.label}</div>
          </div>

          {/* VS */}
          <div style={{
            fontSize: isMobile ? '11px' : '13px', fontWeight: '800', color: 'rgba(255,255,255,0.15)',
            letterSpacing: '0.1em', flexShrink: 0,
          }}>VS</div>

          {/* Home */}
          <div style={{
            flex: 1, textAlign: 'center',
            padding: isMobile ? '10px 4px' : '14px 8px', borderRadius: '12px',
            background: powerWinner === 'home' ? `${homeTier.color}06` : 'transparent',
            border: powerWinner === 'home' ? `1px solid ${homeTier.color}18` : '1px solid transparent',
            transition: 'all 0.5s ease',
          }}>
            <div style={{
              fontSize: isMobile ? '28px' : '36px', fontWeight: '900', color: homeTier.color,
              fontFamily: 'ui-monospace, SFMono-Regular, monospace', lineHeight: 1,
              textShadow: powerWinner === 'home' ? `0 0 20px ${homeTier.color}50` : 'none',
            }}>#{homeRank}</div>
            <div style={{
              fontSize: isMobile ? '13px' : '15px', fontWeight: '700', color: 'white', marginTop: '4px',
              opacity: powerWinner === 'home' ? 1 : 0.6,
            }}>{homeA}</div>
            <div style={{
              display: 'inline-block', marginTop: '6px',
              padding: '3px 10px', borderRadius: '20px',
              background: homeTier.bg, border: `1px solid ${homeTier.color}30`,
              fontSize: '9px', fontWeight: '700', color: homeTier.color, letterSpacing: '0.08em',
            }}>{homeTier.label}</div>
          </div>
        </div>

        {/* Power Bar */}
        <div style={{ marginTop: isMobile ? '14px' : '18px' }}>
          <div style={{
            position: 'relative', height: '8px', borderRadius: '4px',
            background: 'rgba(0,0,0,0.5)', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, height: '100%',
              width: `${Math.round(((awayRank + homeRank - awayRank) / (awayRank + homeRank)) * 100)}%`,
              background: `linear-gradient(90deg, ${awayTier.color}40, ${awayTier.color})`,
              borderRadius: '4px 0 0 4px',
              animation: 'mi2-slideRight 1s cubic-bezier(0.4, 0, 0.2, 1)',
            }} />
            <div style={{
              position: 'absolute', right: 0, top: 0, height: '100%',
              width: `${Math.round(((awayRank + homeRank - homeRank) / (awayRank + homeRank)) * 100)}%`,
              background: `linear-gradient(270deg, ${homeTier.color}40, ${homeTier.color})`,
              borderRadius: '0 4px 4px 0',
            }} />
            <div style={{ position: 'absolute', left: '50%', top: 0, width: '2px', height: '100%', background: 'rgba(255,255,255,0.15)', transform: 'translateX(-50%)' }} />
          </div>
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <span style={{
              display: 'inline-block', padding: '3px 14px', borderRadius: '12px',
              background: powerGap > 50 ? 'rgba(16, 185, 129, 0.12)' : powerGap > 20 ? 'rgba(59, 130, 246, 0.10)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${powerGap > 50 ? 'rgba(16,185,129,0.25)' : powerGap > 20 ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.06)'}`,
              fontSize: '10px', fontWeight: '700',
              color: powerGap > 50 ? '#34D399' : powerGap > 20 ? '#60A5FA' : 'rgba(255,255,255,0.45)',
              fontFamily: 'ui-monospace, monospace',
            }}>
              {powerWinner === 'away' ? awayA : homeA} +{powerGap} ranks
            </span>
          </div>
        </div>

        {/* Stat Chips Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: isMobile ? '12px' : '16px', gap: '6px' }}>
          {/* Away chips */}
          <div style={{ display: 'flex', gap: '4px', flex: 1, justifyContent: 'center' }}>
            {[
              { label: 'OFF', value: `#${aOffR}`, good: aOffR <= 50 },
              { label: 'DEF', value: `#${aDefR}`, good: aDefR <= 50 },
              { label: 'TEMPO', value: (away.adjTempo || 67.5).toFixed(0), good: false },
            ].map(chip => (
              <div key={`a-${chip.label}`} style={{
                padding: isMobile ? '4px 6px' : '4px 8px', borderRadius: '6px',
                background: chip.good ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${chip.good ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)'}`,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '7px', fontWeight: '600', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>{chip.label}</div>
                <div style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '800', color: chip.good ? '#10B981' : 'rgba(255,255,255,0.6)', fontFamily: 'ui-monospace, monospace' }}>{chip.value}</div>
              </div>
            ))}
          </div>
          {/* Home chips */}
          <div style={{ display: 'flex', gap: '4px', flex: 1, justifyContent: 'center' }}>
            {[
              { label: 'OFF', value: `#${hOffR}`, good: hOffR <= 50 },
              { label: 'DEF', value: `#${hDefR}`, good: hDefR <= 50 },
              { label: 'TEMPO', value: (home.adjTempo || 67.5).toFixed(0), good: false },
            ].map(chip => (
              <div key={`h-${chip.label}`} style={{
                padding: isMobile ? '4px 6px' : '4px 8px', borderRadius: '6px',
                background: chip.good ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${chip.good ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)'}`,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '7px', fontWeight: '600', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>{chip.label}</div>
                <div style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '800', color: chip.good ? '#10B981' : 'rgba(255,255,255,0.6)', fontFamily: 'ui-monospace, monospace' }}>{chip.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: EDGE METER
         ═══════════════════════════════════════════════════════════ */}
      <div style={{ padding: `${pad}` }}>
        <div style={{
          padding: isMobile ? '14px' : '20px',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.3) 100%)',
          borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em' }}>WHO HAS THE EDGE?</span>
          </div>

          {/* Tug-of-war bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '700', color: awayWins >= homeWins ? awayTier.color : 'rgba(255,255,255,0.3)', minWidth: isMobile ? '40px' : '50px', textAlign: 'right' }}>{awayA}</span>
            <div style={{ flex: 1, position: 'relative', height: '10px', borderRadius: '5px', background: 'rgba(0,0,0,0.5)', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, height: '100%',
                width: `${edgePct}%`,
                background: `linear-gradient(90deg, ${awayTier.color}50, ${awayTier.color})`,
                borderRadius: '5px 0 0 5px',
                transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: awayWins > homeWins ? `0 0 12px ${awayTier.color}40` : 'none',
              }} />
              <div style={{
                position: 'absolute', right: 0, top: 0, height: '100%',
                width: `${100 - edgePct}%`,
                background: `linear-gradient(270deg, ${homeTier.color}50, ${homeTier.color})`,
                borderRadius: '0 5px 5px 0',
                boxShadow: homeWins > awayWins ? `0 0 12px ${homeTier.color}40` : 'none',
              }} />
              {/* Center marker */}
              <div style={{ position: 'absolute', left: '50%', top: '-1px', width: '2px', height: '12px', background: 'rgba(255,255,255,0.25)', transform: 'translateX(-50%)', borderRadius: '1px' }} />
            </div>
            <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '700', color: homeWins >= awayWins ? homeTier.color : 'rgba(255,255,255,0.3)', minWidth: isMobile ? '40px' : '50px' }}>{homeA}</span>
          </div>

          {/* Verdict Chips */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '6px',
            marginBottom: '12px',
          }}>
            {[
              { label: 'POWER', ...edges.power },
              { label: 'OFFENSE', ...edges.offense },
              { label: 'DEFENSE', ...edges.defense },
              { label: 'SHOOTING', ...edges.shooting },
              { label: 'TURNOVERS', ...edges.turnovers },
              { label: 'BOARDS', ...edges.rebounding },
            ].map(chip => {
              const chipWinner = chip.winner === 'away' ? awayA : homeA;
              const chipColor = chip.winner === 'away' ? awayTier.color : homeTier.color;
              const isClose = chip.gap < 15;
              return (
                <div key={chip.label} style={{
                  padding: isMobile ? '6px 4px' : '8px 6px',
                  borderRadius: '8px',
                  background: isClose ? 'rgba(255,255,255,0.02)' : `${chipColor}10`,
                  border: `1px solid ${isClose ? 'rgba(255,255,255,0.05)' : `${chipColor}25`}`,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '7px', fontWeight: '600', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', marginBottom: '2px' }}>{chip.label}</div>
                  <div style={{ fontSize: isMobile ? '9px' : '10px', fontWeight: '800', color: isClose ? 'rgba(255,255,255,0.4)' : chipColor }}>
                    {isClose ? '~EVEN' : chipWinner}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Verdict sentence */}
          <div style={{
            textAlign: 'center', padding: '8px 12px', borderRadius: '8px',
            background: 'rgba(16, 185, 129, 0.06)', borderLeft: '3px solid #10B98150',
          }}>
            <span style={{ fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.65)', fontWeight: '500' }}>
              {winnerName} wins <strong style={{ color: '#10B981' }}>{winCount} of 6</strong> key matchup categories
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: SHOT PROFILE (PBP data)
         ═══════════════════════════════════════════════════════════ */}
      {hasPBP && (
        <div style={{ padding: `0 ${pad} ${pad}` }}>
          <div style={{
            padding: isMobile ? '14px' : '20px',
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.3) 100%)',
            borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)',
          }}>
            {/* Header with FLIP */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: '800', color: '#FBBF24', letterSpacing: '0.12em' }}>SHOT PROFILE</div>
                <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
                  {offA} offense vs {defA} defense
                </div>
              </div>
              <button
                onClick={() => setView(v => v === 'awayOff_homeDef' ? 'homeOff_awayDef' : 'awayOff_homeDef')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: isMobile ? '8px 12px' : '6px 12px', borderRadius: '8px',
                  background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)',
                  color: '#A78BFA', fontSize: '9px', fontWeight: '700', cursor: 'pointer',
                  transition: 'all 0.2s', minHeight: '36px',
                }}
              >
                <ArrowRightLeft size={12} />
                FLIP
              </button>
            </div>

            {/* Shot Zone Cards */}
            {(() => {
              const offPBP = isAwayView ? awayPBP : homePBP;
              const defPBP = isAwayView ? homePBP : awayPBP;
              if (!offPBP || !defPBP) return null;

              const zones = [
                { label: 'DUNKS', icon: '🔥', offFg: offPBP.dunks_off_fg, offShare: offPBP.dunks_off_share, defFg: defPBP.dunks_def_fg, defShare: defPBP.dunks_def_share, avg: D1_AVG.dunks },
                { label: 'CLOSE 2', icon: '🎯', offFg: offPBP.close2_off_fg, offShare: offPBP.close2_off_share, defFg: defPBP.close2_def_fg, defShare: defPBP.close2_def_share, avg: D1_AVG.close2 },
                { label: 'MID-RANGE', icon: '📐', offFg: offPBP.far2_off_fg, offShare: offPBP.far2_off_share, defFg: defPBP.far2_def_fg, defShare: defPBP.far2_def_share, avg: D1_AVG.far2 },
                { label: '3-POINT', icon: '🏹', offFg: offPBP.three_off_fg, offShare: offPBP.three_off_share, defFg: defPBP.three_def_fg, defShare: defPBP.three_def_share, avg: D1_AVG.threeP },
              ];

              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {zones.map((zone) => {
                    const offColor = getStatColor(zone.offFg, zone.avg, true);
                    const defColor = getStatColor(zone.defFg, zone.avg, false); // For defense, lower = better for the defender
                    const edge = zone.offFg - zone.defFg;
                    const edgeColor = edge > 3 ? '#10B981' : edge > 0 ? '#22D3EE' : edge > -3 ? '#F59E0B' : '#EF4444';

                    return (
                      <div key={zone.label} style={{
                        padding: isMobile ? '10px' : '14px',
                        borderRadius: '10px',
                        background: 'rgba(0,0,0,0.25)',
                        border: `1px solid rgba(255,255,255,0.04)`,
                      }}>
                        {/* Zone header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>{zone.label}</span>
                          <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.25)' }}>{zone.offShare.toFixed(0)}% of shots</span>
                        </div>

                        {/* Offense FG% */}
                        <div style={{ marginBottom: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3px' }}>
                            <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.35)' }}>{offA} OFF</span>
                            <span style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '900', color: offColor, fontFamily: 'ui-monospace, monospace' }}>{zone.offFg.toFixed(1)}%</span>
                          </div>
                          <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min((zone.offFg / 100) * 100, 100)}%`, background: `linear-gradient(90deg, ${offColor}50, ${offColor})`, borderRadius: '2px', transition: 'width 0.8s ease' }} />
                          </div>
                        </div>

                        {/* Defense FG% Allowed */}
                        <div style={{ marginBottom: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3px' }}>
                            <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.35)' }}>{defA} DEF</span>
                            <span style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', fontFamily: 'ui-monospace, monospace' }}>{zone.defFg.toFixed(1)}%</span>
                          </div>
                          <div style={{ height: '3px', borderRadius: '2px', background: 'rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min((zone.defFg / 100) * 100, 100)}%`, background: `rgba(255,255,255,0.15)`, borderRadius: '2px' }} />
                          </div>
                        </div>

                        {/* Edge indicator */}
                        <div style={{
                          textAlign: 'center', padding: '3px 6px', borderRadius: '6px',
                          background: `${edgeColor}10`, border: `1px solid ${edgeColor}20`,
                        }}>
                          <span style={{ fontSize: '9px', fontWeight: '800', color: edgeColor, fontFamily: 'ui-monospace, monospace' }}>
                            {edge > 0 ? '+' : ''}{edge.toFixed(1)}
                          </span>
                          <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', marginLeft: '3px' }}>
                            {edge > 3 ? 'ADVANTAGE' : edge > 0 ? 'SLIGHT' : edge > -3 ? 'TOUGH' : 'MISMATCH'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* Shot Profile Insight */}
            {(() => {
              const offPBP = isAwayView ? awayPBP : homePBP;
              const defPBP = isAwayView ? homePBP : awayPBP;
              if (!offPBP || !defPBP) return null;

              const close2Edge = offPBP.close2_off_fg - defPBP.close2_def_fg;
              const threeEdge = offPBP.three_off_fg - defPBP.three_def_fg;
              const bestZone = offPBP.close2_off_share > offPBP.three_off_share ? 'inside' : 'perimeter';

              let shotInsight = '';
              if (bestZone === 'inside' && close2Edge > 3) {
                shotInsight = `${offA} attacks inside (${offPBP.close2_off_share.toFixed(0)}% close 2s at ${offPBP.close2_off_fg.toFixed(0)}%) and ${defA} allows ${defPBP.close2_def_fg.toFixed(0)}% there — clear path to score`;
              } else if (bestZone === 'perimeter' && threeEdge > 2) {
                shotInsight = `${offA} relies on 3PT shooting (${offPBP.three_off_share.toFixed(0)}% of shots) and ${defA} allows ${defPBP.three_def_fg.toFixed(0)}% from deep — favorable matchup`;
              } else if (close2Edge < -5) {
                shotInsight = `${defA} locks down close range (${defPBP.close2_def_fg.toFixed(0)}% allowed) — ${offA} may struggle inside`;
              } else {
                shotInsight = `${offA} shoots ${offPBP.close2_off_fg.toFixed(0)}% close / ${offPBP.three_off_fg.toFixed(0)}% from 3 vs ${defA}'s ${defPBP.close2_def_fg.toFixed(0)}% / ${defPBP.three_def_fg.toFixed(0)}% allowed`;
              }

              return (
                <div style={{
                  marginTop: '10px', padding: '8px 10px', borderRadius: '8px',
                  background: 'rgba(251, 191, 36, 0.06)', borderLeft: '3px solid rgba(251, 191, 36, 0.3)',
                }}>
                  <span style={{ fontSize: isMobile ? '9px' : '10px', color: 'rgba(255,255,255,0.55)', fontWeight: '500', lineHeight: '1.4' }}>{shotInsight}</span>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: FOUR FACTORS (2x2 Grid)
         ═══════════════════════════════════════════════════════════ */}
      <div style={{ padding: `0 ${pad} ${pad}` }}>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}>
            {offA} OFFENSE vs {defA} DEFENSE
          </span>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px',
        }}>
          {[
            {
              label: 'SHOOTING', stat: 'eFG%', offVal: eFG.off, defVal: eFG.def, avg: D1_AVG.eFG,
              higher: true, color: '#FBBF24',
            },
            {
              label: 'BALL CONTROL', stat: 'TO Rate', offVal: to.off, defVal: to.def, avg: D1_AVG.to,
              higher: false, color: '#F87171', // lower TO is better for offense
            },
            {
              label: 'BOARDS', stat: 'OReb%', offVal: oreb.off, defVal: oreb.def, avg: D1_AVG.oreb,
              higher: true, color: '#60A5FA',
            },
            {
              label: 'FREE THROWS', stat: 'FT Rate', offVal: ftRate.off, defVal: ftRate.def, avg: D1_AVG.ftRate,
              higher: true, color: '#34D399',
            },
          ].map((factor) => {
            const diff = factor.offVal - factor.defVal;
            const edge = factor.higher ? diff : -diff; // positive = good for offense
            const edgeColor = edge > 3 ? '#10B981' : edge > 0 ? '#22D3EE' : edge > -2 ? '#F59E0B' : '#EF4444';
            const edgeLabel = edge > 3 ? 'EDGE' : edge > 0 ? 'SLIGHT' : edge > -2 ? 'NEUTRAL' : 'TOUGH';
            const offColor = factor.higher
              ? getStatColor(factor.offVal, factor.avg, true)
              : getStatColor(factor.offVal, factor.avg, false);

            return (
              <div key={factor.label} style={{
                padding: isMobile ? '10px' : '14px',
                borderRadius: '10px',
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.5) 0%, rgba(15, 23, 42, 0.2) 100%)',
                border: `1px solid ${edgeColor}20`,
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Subtle glow on edge cards */}
                {edge > 3 && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${edgeColor}, transparent)` }} />
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '8px', fontWeight: '700', color: factor.color, letterSpacing: '0.08em' }}>{factor.label}</span>
                  <span style={{
                    fontSize: '8px', fontWeight: '700', color: edgeColor,
                    padding: '2px 6px', borderRadius: '4px', background: `${edgeColor}12`,
                  }}>{edgeLabel}</span>
                </div>

                {/* Values */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                  <div>
                    <span style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '900', color: offColor, fontFamily: 'ui-monospace, monospace' }}>
                      {factor.offVal.toFixed(1)}
                    </span>
                    <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', marginLeft: '3px' }}>off</span>
                  </div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)' }}>vs</div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: isMobile ? '14px' : '15px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', fontFamily: 'ui-monospace, monospace' }}>
                      {factor.defVal.toFixed(1)}
                    </span>
                    <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', marginLeft: '3px' }}>def</span>
                  </div>
                </div>

                {/* Comparison bar */}
                <div style={{ position: 'relative', height: '4px', borderRadius: '2px', background: 'rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(Math.max((factor.offVal / (factor.offVal + factor.defVal)) * 100, 15), 85)}%`,
                    background: `linear-gradient(90deg, ${edgeColor}60, ${edgeColor})`,
                    borderRadius: '2px',
                    transition: 'width 0.8s ease',
                  }} />
                </div>

                <div style={{ textAlign: 'center', marginTop: '4px' }}>
                  <span style={{ fontSize: '9px', fontWeight: '700', color: edgeColor, fontFamily: 'ui-monospace, monospace' }}>
                    {edge > 0 ? '+' : ''}{edge.toFixed(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pace badge */}
        <div style={{
          marginTop: '8px', padding: '8px 12px', borderRadius: '8px',
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>EXPECTED PACE</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#A78BFA', fontFamily: 'ui-monospace, monospace' }}>
              {((tempo.away + tempo.home) / 2).toFixed(1)}
            </span>
            <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)' }}>
              poss/40 ({tempo.away > tempo.home ? awayA : homeA} pushes)
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5: ANALYST VERDICT
         ═══════════════════════════════════════════════════════════ */}
      <div style={{
        padding: `${pad}`,
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(2, 6, 23, 0.8) 100%)',
        borderTop: '1px solid rgba(255,255,255,0.03)',
      }}>
        <div style={{
          padding: isMobile ? '14px' : '20px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.04) 0%, rgba(99, 102, 241, 0.04) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', animation: 'mi2-pulse 2s infinite' }} />
            <span style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em' }}>SAVANT ANALYSIS</span>
          </div>

          <div style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: 'white', marginBottom: '8px', lineHeight: '1.3' }}>
            {insight.headline}
          </div>

          <div style={{ fontSize: isMobile ? '11px' : '12px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.5', marginBottom: '14px' }}>
            {insight.body}
          </div>

          {/* Confidence meter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', flexShrink: 0 }}>CONFIDENCE</span>
            <div style={{ flex: 1, position: 'relative', height: '6px', borderRadius: '3px', background: 'rgba(0,0,0,0.4)', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${insight.confidence}%`,
                borderRadius: '3px',
                background: insight.confidence > 75
                  ? 'linear-gradient(90deg, #10B981, #34D399)'
                  : insight.confidence > 55
                    ? 'linear-gradient(90deg, #3B82F6, #60A5FA)'
                    : 'linear-gradient(90deg, #F59E0B, #FBBF24)',
                transition: 'width 1s ease',
                boxShadow: insight.confidence > 75 ? '0 0 8px rgba(16,185,129,0.4)' : 'none',
              }} />
            </div>
            <span style={{
              fontSize: '10px', fontWeight: '800', fontFamily: 'ui-monospace, monospace',
              color: insight.confidence > 75 ? '#10B981' : insight.confidence > 55 ? '#3B82F6' : '#F59E0B',
            }}>
              {insight.confidence > 75 ? 'HIGH' : insight.confidence > 55 ? 'MEDIUM' : 'LOW'}
            </span>
          </div>
        </div>

        {/* Footer branding */}
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <span style={{ fontSize: '7px', fontWeight: '600', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.2em' }}>SAVANT ANALYTICS</span>
        </div>
      </div>
    </div>
  );
}

export default AdvancedMatchupCard;
