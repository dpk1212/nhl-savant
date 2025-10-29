/**
 * Trend Momentum Chart - Recent Form Analysis
 * Shows team performance trends using REAL game-by-game data
 * NO FAKE DATA - Uses actual W/L results from nhl-202526-asplayed.csv
 */

import { TrendingUp, TrendingDown, Minus, Activity, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useMemo } from 'react';

export default function TrendMomentumChart({ awayTeam, homeTeam, awayStats, homeStats, scheduleHelper }) {
  if (!awayStats || !homeStats) return null;

  // Get REAL recent game data from scheduleHelper
  const awayRecentGames = useMemo(() => {
    if (!scheduleHelper) return [];
    try {
      return scheduleHelper.getTeamRecentGames(awayTeam.code, 10);
    } catch (error) {
      console.warn('Could not fetch recent games for', awayTeam.code);
      return [];
    }
  }, [scheduleHelper, awayTeam.code]);

  const homeRecentGames = useMemo(() => {
    if (!scheduleHelper) return [];
    try {
      return scheduleHelper.getTeamRecentGames(homeTeam.code, 10);
    } catch (error) {
      console.warn('Could not fetch recent games for', homeTeam.code);
      return [];
    }
  }, [scheduleHelper, homeTeam.code]);

  // Calculate REAL form metrics from actual games
  const awayXGF = awayStats.xGF_per60 || 0;
  const awayXGA = awayStats.xGA_per60 || 0;
  const homeXGF = homeStats.xGF_per60 || 0;
  const homeXGA = homeStats.xGA_per60 || 0;

  const awayGamesPlayed = awayStats.games_played || 0;
  const homeGamesPlayed = homeStats.games_played || 0;

  // Calculate momentum from recent W/L record (REAL DATA)
  const calculateRealMomentum = (recentGames) => {
    if (!recentGames || recentGames.length === 0) return 0;
    const wins = recentGames.filter(g => g.result === 'W').length;
    const losses = recentGames.filter(g => g.result === 'L').length;
    return (wins - losses) / recentGames.length; // Returns -1 to +1
  };

  const awayMomentum = calculateRealMomentum(awayRecentGames);
  const homeMomentum = calculateRealMomentum(homeRecentGames);

  // Determine trend direction based on REAL W/L record
  const getMomentumTrend = (momentum, recentGames) => {
    if (!recentGames || recentGames.length === 0) {
      return { icon: Minus, color: '#64748B', label: 'No Data', direction: 'flat' };
    }
    if (momentum > 0.2) return { icon: TrendingUp, color: '#10B981', label: 'Hot', direction: 'up' };
    if (momentum < -0.2) return { icon: TrendingDown, color: '#EF4444', label: 'Cold', direction: 'down' };
    return { icon: Minus, color: '#F59E0B', label: 'Neutral', direction: 'flat' };
  };

  const awayTrend = getMomentumTrend(awayMomentum, awayRecentGames);
  const homeTrend = getMomentumTrend(homeMomentum, homeRecentGames);

  // Convert REAL game data to chart format (goal differential trend)
  const awayTrendData = awayRecentGames.map((game, idx) => ({
    game: `G${idx + 1}`,
    goalDiff: game.goalDifferential || 0,
    result: game.result,
    opponent: game.opponent
  })).reverse(); // Reverse to show oldest to newest

  const homeTrendData = homeRecentGames.map((game, idx) => ({
    game: `G${idx + 1}`,
    goalDiff: game.goalDifferential || 0,
    result: game.result,
    opponent: game.opponent
  })).reverse();

  // Momentum badge component - NOW SHOWING REAL W/L DATA
  const MomentumBadge = ({ team, trend, momentum, recentGames, xgf, xga, gamesPlayed }) => {
    const Icon = trend.icon;
    
    // Calculate REAL record from recent games
    const wins = recentGames.filter(g => g.result === 'W').length;
    const losses = recentGames.filter(g => g.result === 'L').length;
    const otl = recentGames.filter(g => g.result === 'OTL' || g.result === 'SOL').length;
    
    return (
      <div style={{
        background: `linear-gradient(135deg, ${trend.color}15 0%, ${trend.color}08 100%)`,
        border: `2px solid ${trend.color}40`,
        borderRadius: '16px',
        padding: window.innerWidth < 768 ? '1rem' : '1.5rem',
        flex: 1
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <div style={{
            fontSize: window.innerWidth < 768 ? '1.25rem' : '1.5rem',
            fontWeight: '900',
            color: '#F1F5F9'
          }}>
            {team.code}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: `${trend.color}30`,
            border: `1px solid ${trend.color}`,
            borderRadius: '12px',
            padding: '0.5rem 1rem'
          }}>
            <Icon size={20} color={trend.color} />
            <span style={{
              fontSize: '0.875rem',
              fontWeight: '800',
              color: trend.color,
              textTransform: 'uppercase'
            }}>
              {trend.label}
            </span>
          </div>
        </div>

        {/* REAL Record Display */}
        <div style={{
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            color: '#94A3B8',
            textTransform: 'uppercase',
            marginBottom: '0.5rem'
          }}>
            Last {recentGames.length} Games
          </div>
          <div style={{
            fontSize: window.innerWidth < 768 ? '2rem' : '3rem',
            fontWeight: '900',
            background: `linear-gradient(135deg, ${trend.color} 0%, ${trend.color}80 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {recentGames.length > 0 ? `${wins}-${losses}${otl > 0 ? `-${otl}` : ''}` : 'N/A'}
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '8px',
            padding: '0.75rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.25rem' }}>
              xGF/60
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: '900', color: '#10B981' }}>
              {xgf.toFixed(2)}
            </div>
          </div>
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
            padding: '0.75rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.25rem' }}>
              xGA/60
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: '900', color: '#EF4444' }}>
              {xga.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Games Played */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem',
          color: '#64748B'
        }}>
          <Activity size={14} />
          <span>{gamesPlayed} total games</span>
        </div>
      </div>
    );
  };

  // Custom tooltip showing result and opponent
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const resultColor = data.result === 'W' ? '#10B981' : data.result === 'L' ? '#EF4444' : '#F59E0B';
      
      return (
        <div style={{
          background: 'rgba(15, 23, 42, 0.98)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '8px',
          padding: '0.75rem',
          fontSize: '0.875rem'
        }}>
          <div style={{ fontWeight: '700', color: '#F1F5F9', marginBottom: '0.25rem' }}>
            {label}
          </div>
          <div style={{ color: '#94A3B8' }}>
            vs {data.opponent}
          </div>
          <div style={{ color: resultColor, fontWeight: '700', marginTop: '0.25rem' }}>
            {data.result} (Goal Diff: {data.goalDiff > 0 ? '+' : ''}{data.goalDiff})
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 style={{
        fontSize: window.innerWidth < 768 ? '1.25rem' : '1.5rem',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '1rem'
      }}>
        Recent Form & Momentum
      </h2>
      <p style={{
        fontSize: window.innerWidth < 768 ? '0.8125rem' : '0.9375rem',
        color: '#94A3B8',
        marginBottom: '1.5rem',
        lineHeight: 1.6
      }}>
        Real game-by-game results from the 2025-26 season. Charts show goal differential per game.
      </p>

      {/* Data Source Label */}
      <div style={{
        fontSize: '0.75rem',
        color: '#64748B',
        marginBottom: '1.5rem',
        fontStyle: 'italic'
      }}>
        📊 Source: nhl-202526-asplayed.csv (Real game results)
      </div>

      {/* Momentum Badges */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <MomentumBadge
          team={awayTeam}
          trend={awayTrend}
          momentum={awayMomentum}
          recentGames={awayRecentGames}
          xgf={awayXGF}
          xga={awayXGA}
          gamesPlayed={awayGamesPlayed}
        />
        <MomentumBadge
          team={homeTeam}
          trend={homeTrend}
          momentum={homeMomentum}
          recentGames={homeRecentGames}
          xgf={homeXGF}
          xga={homeXGA}
          gamesPlayed={homeGamesPlayed}
        />
      </div>

      {/* Sample Size Warning for Early Season */}
      {(awayRecentGames.length < 10 || homeRecentGames.length < 10) && (
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
          ⚠️ <span>Small sample size - early season trends may be volatile</span>
        </div>
      )}

      {/* Trend Charts - Goal Differential Bar Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {/* Away Team Trend */}
        {awayTrendData.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: '16px',
            padding: window.innerWidth < 768 ? '1rem' : '1.5rem'
          }}>
            <div style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: '#F1F5F9',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              {awayTeam.code} - Goal Differential Trend
            </div>
            <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 200 : 250}>
              <BarChart data={awayTrendData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis 
                  dataKey="game" 
                  stroke="#94A3B8"
                  style={{ fontSize: window.innerWidth < 768 ? '0.625rem' : '0.75rem' }}
                />
                <YAxis 
                  stroke="#94A3B8"
                  style={{ fontSize: window.innerWidth < 768 ? '0.625rem' : '0.75rem' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="#64748B" strokeDasharray="3 3" />
                <Bar 
                  dataKey="goalDiff" 
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Home Team Trend */}
        {homeTrendData.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: '16px',
            padding: window.innerWidth < 768 ? '1rem' : '1.5rem'
          }}>
            <div style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: '#F1F5F9',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              {homeTeam.code} - Goal Differential Trend
            </div>
            <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 200 : 250}>
              <BarChart data={homeTrendData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis 
                  dataKey="game" 
                  stroke="#94A3B8"
                  style={{ fontSize: window.innerWidth < 768 ? '0.625rem' : '0.75rem' }}
                />
                <YAxis 
                  stroke="#94A3B8"
                  style={{ fontSize: window.innerWidth < 768 ? '0.625rem' : '0.75rem' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="#64748B" strokeDasharray="3 3" />
                <Bar 
                  dataKey="goalDiff" 
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* No Data Warning */}
      {awayTrendData.length === 0 && homeTrendData.length === 0 && (
        <div style={{
          background: 'rgba(71, 85, 105, 0.1)',
          border: '1px solid rgba(71, 85, 105, 0.3)',
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          color: '#94A3B8',
          fontSize: '0.9375rem'
        }}>
          Recent game data not available. Check back after teams have played a few games.
        </div>
      )}
    </div>
  );
}
