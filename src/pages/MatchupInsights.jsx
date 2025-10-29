/**
 * Matchup Insights Page - Advanced team vs team analysis
 * Isolated implementation - NO modifications to existing components
 * Props access pattern: Direct props. access for safety
 */

import { useState, useEffect, useMemo } from 'react';
import BattleBars from '../components/matchup/BattleBars';
import GoalieComparison from '../components/matchup/GoalieComparison';
import ShotDangerChart from '../components/matchup/ShotDangerChart';
import RecentFormTimeline from '../components/matchup/RecentFormTimeline';
import SEOHeader from '../components/matchup/SEOHeader';
import { 
  getTeamStats, 
  getGoalieStats,
  calculateXGoalsEdge,
  calculateGoalieEdge,
  calculateShotQualityEdge,
  calculateSpecialTeamsEdge,
  calculateOverallAdvantage,
  getRecentForm
} from '../utils/matchupCalculations';

export default function MatchupInsights(props) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [todaysGames, setTodaysGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load today's games
  useEffect(() => {
    if (!props || !props.dataProcessor || !props.todaysGames) {
      setLoading(false);
      return;
    }

    try {
      // Map todaysGames to expected format
      const games = props.todaysGames.map(game => ({
        awayTeam: game.away || game.awayTeam,
        homeTeam: game.home || game.homeTeam,
        gameTime: game.time || game.gameTime,
        date: new Date().toISOString().split('T')[0]
      }));

      setTodaysGames(games);
      if (games.length > 0 && !selectedGame) {
        setSelectedGame(games[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading games:', error);
      setLoading(false);
    }
  }, [props?.dataProcessor, props?.todaysGames, selectedGame, props]);

  // Calculate matchup data for selected game
  const matchupData = useMemo(() => {
    if (!selectedGame || !props?.dataProcessor || !props?.goalieData) return null;

    try {
      const teams = props.dataProcessor.teams;
      const goalies = props.goalieData;

      // Get team stats
      const awayStats = getTeamStats(teams, selectedGame.awayTeam, 'all');
      const homeStats = getTeamStats(teams, selectedGame.homeTeam, 'all');
      const awayStats5v5 = getTeamStats(teams, selectedGame.awayTeam, '5on5');
      const homeStats5v5 = getTeamStats(teams, selectedGame.homeTeam, '5on5');
      const awayPP = getTeamStats(teams, selectedGame.awayTeam, '5on4');
      const awayPK = getTeamStats(teams, selectedGame.awayTeam, '4on5');
      const homePP = getTeamStats(teams, selectedGame.homeTeam, '5on4');
      const homePK = getTeamStats(teams, selectedGame.homeTeam, '4on5');

      // Get goalie stats (use default names if not provided)
      const awayGoalie = getGoalieStats(goalies, `${selectedGame.awayTeam} Goalie`);
      const homeGoalie = getGoalieStats(goalies, `${selectedGame.homeTeam} Goalie`);

      // Calculate edges
      const xGoalsEdgeAway = calculateXGoalsEdge(awayStats, homeStats);
      const xGoalsEdgeHome = calculateXGoalsEdge(homeStats, awayStats);
      const goalieEdge = awayGoalie && homeGoalie ? calculateGoalieEdge(awayGoalie, homeGoalie) : 0;
      const shotQualityEdgeAway = calculateShotQualityEdge(awayStats, homeStats);
      const shotQualityEdgeHome = calculateShotQualityEdge(homeStats, awayStats);
      const specialTeamsEdge = calculateSpecialTeamsEdge(awayPP, homePK, homePP, awayPK);

      // Overall advantage
      const overallAdvantage = calculateOverallAdvantage(
        xGoalsEdgeAway,
        goalieEdge,
        shotQualityEdgeAway,
        specialTeamsEdge
      );

      // Get recent form (if available)
      let awayForm = null;
      let homeForm = null;
      try {
        if (props.dataProcessor.asPlayedData) {
          awayForm = getRecentForm(props.dataProcessor.asPlayedData, selectedGame.awayTeam, 10);
          homeForm = getRecentForm(props.dataProcessor.asPlayedData, selectedGame.homeTeam, 10);
        }
      } catch (error) {
        console.log('Recent form data not available:', error);
      }

      // Get team names (fallback to codes)
      const getTeamName = (code) => {
        const teamData = teams[code];
        return teamData?.teamName || code;
      };

      return {
        away: {
          code: selectedGame.awayTeam,
          name: getTeamName(selectedGame.awayTeam),
          stats: awayStats,
          stats5v5: awayStats5v5,
          powerPlay: awayPP,
          penaltyKill: awayPK,
          goalie: awayGoalie,
          form: awayForm
        },
        home: {
          code: selectedGame.homeTeam,
          name: getTeamName(selectedGame.homeTeam),
          stats: homeStats,
          stats5v5: homeStats5v5,
          powerPlay: homePP,
          penaltyKill: homePK,
          goalie: homeGoalie,
          form: homeForm
        },
        edges: {
          xGoalsAway: xGoalsEdgeAway,
          xGoalsHome: xGoalsEdgeHome,
          goalie: goalieEdge,
          shotQualityAway: shotQualityEdgeAway,
          shotQualityHome: shotQualityEdgeHome,
          specialTeams: specialTeamsEdge,
          overall: overallAdvantage
        },
        gameTime: selectedGame.gameTime,
        date: selectedGame.date
      };
    } catch (error) {
      console.error('Error calculating matchup data:', error);
      return null;
    }
  }, [selectedGame, props?.dataProcessor, props?.goalieData, props]);

  // Loading state
  if (!props || !props.dataProcessor || !props.goalieData || !props.todaysGames) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        color: '#94A3B8',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div>
          <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Loading data...</p>
          <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
            Please wait while we load team stats and schedule information.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        color: '#94A3B8'
      }}>
        <p>Loading matchup insights...</p>
      </div>
    );
  }

  if (todaysGames.length === 0) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: '#94A3B8'
      }}>
        <h2 style={{ color: '#F1F5F9', marginBottom: '1rem' }}>No Games Today</h2>
        <p>Check back when games are scheduled!</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem 1rem',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#F1F5F9',
          marginBottom: '0.5rem'
        }}>
          Matchup Insights
        </h1>
        <p style={{
          color: '#94A3B8',
          fontSize: '1rem'
        }}>
          Advanced analytics, expert analysis, and betting edges
        </p>
      </div>

      {/* Game Selector */}
      <div className="elevated-card" style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}>
        <h3 style={{
          fontSize: '0.875rem',
          fontWeight: '700',
          color: '#94A3B8',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '1rem'
        }}>
          Select Game
        </h3>

        <div style={{
          display: 'flex',
          gap: '0.75rem',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {todaysGames.map((game, index) => (
            <button
              key={`${game.awayTeam}-${game.homeTeam}-${index}`}
              onClick={() => setSelectedGame(game)}
              style={{
                background: selectedGame === game
                  ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                  : 'rgba(15, 23, 42, 0.5)',
                border: selectedGame === game
                  ? '1px solid rgba(59, 130, 246, 0.5)'
                  : '1px solid rgba(148, 163, 184, 0.1)',
                borderRadius: '12px',
                padding: '1rem 1.5rem',
                minWidth: '200px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
            >
              <div style={{
                fontSize: '1rem',
                fontWeight: '700',
                color: '#F1F5F9',
                marginBottom: '0.25rem'
              }}>
                {game.awayTeam} @ {game.homeTeam}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#94A3B8'
              }}>
                {game.gameTime || 'TBD'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Matchup Content */}
      {matchupData && (
        <div>
          {/* AI Analysis Header */}
          <SEOHeader matchupData={matchupData} />

          {/* Quick Stats Summary */}
          <div className="elevated-card" style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#F1F5F9',
              marginBottom: '1.5rem'
            }}>
              {matchupData.away.name} @ {matchupData.home.name}
            </h2>

            <div style={{
              fontSize: '0.875rem',
              fontWeight: '700',
              color: '#94A3B8',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem'
            }}>
              Overall Advantage
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: matchupData.edges.overall > 55 ? '#10B981' : matchupData.edges.overall < 45 ? '#EF4444' : '#94A3B8'
            }}>
              {matchupData.away.code} {matchupData.edges.overall.toFixed(0)}% - {(100 - matchupData.edges.overall).toFixed(0)}% {matchupData.home.code}
            </div>
          </div>

          {/* Battle Bars */}
          <BattleBars
            awayTeam={matchupData.away}
            homeTeam={matchupData.home}
            awayStats={matchupData.away.stats}
            homeStats={matchupData.home.stats}
            awayStats5v5={matchupData.away.stats5v5}
            homeStats5v5={matchupData.home.stats5v5}
            awayPP={matchupData.away.powerPlay}
            homePP={matchupData.home.powerPlay}
            awayPK={matchupData.away.penaltyKill}
            homePK={matchupData.home.penaltyKill}
          />

          {/* Goalie Comparison */}
          {matchupData.away.goalie && matchupData.home.goalie && (
            <GoalieComparison
              awayTeam={matchupData.away}
              homeTeam={matchupData.home}
              awayGoalie={matchupData.away.goalie}
              homeGoalie={matchupData.home.goalie}
              goalieEdge={matchupData.edges.goalie}
            />
          )}

          {/* Shot Danger Chart */}
          <ShotDangerChart
            awayTeam={matchupData.away}
            homeTeam={matchupData.home}
            awayStats={matchupData.away.stats}
            homeStats={matchupData.home.stats}
          />

          {/* Recent Form Timeline */}
          {matchupData.away.form && matchupData.home.form && (
            <RecentFormTimeline
              awayTeam={matchupData.away}
              homeTeam={matchupData.home}
              awayForm={matchupData.away.form}
              homeForm={matchupData.home.form}
            />
          )}
        </div>
      )}
    </div>
  );
}
