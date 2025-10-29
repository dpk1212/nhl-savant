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
import KeyInsights from '../components/matchup/KeyInsights';
import QuickStatsCards from '../components/matchup/QuickStatsCards';
import HeadToHeadTable from '../components/matchup/HeadToHeadTable';
import RadarComparison from '../components/matchup/RadarComparison';
import StickySummaryBar from '../components/matchup/StickySummaryBar';
import { 
  getTeamStats, 
  getGoalieStats,
  calculateXGoalsEdge,
  calculateGoalieEdge,
  calculateShotQualityEdge,
  calculateSpecialTeamsEdge,
  calculateOverallAdvantage,
  getRecentForm,
  calculatePercentileRank
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
      const dataProc = props.dataProcessor;
      const goalies = props.goalieData;

      // Get team stats
      const awayStats = getTeamStats(dataProc, selectedGame.awayTeam, 'all');
      const homeStats = getTeamStats(dataProc, selectedGame.homeTeam, 'all');
      const awayStats5v5 = getTeamStats(dataProc, selectedGame.awayTeam, '5on5');
      const homeStats5v5 = getTeamStats(dataProc, selectedGame.homeTeam, '5on5');
      const awayPP = getTeamStats(dataProc, selectedGame.awayTeam, '5on4');
      const awayPK = getTeamStats(dataProc, selectedGame.awayTeam, '4on5');
      const homePP = getTeamStats(dataProc, selectedGame.homeTeam, '5on4');
      const homePK = getTeamStats(dataProc, selectedGame.homeTeam, '4on5');

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
        try {
          const allTeams = dataProc.getTeamsBySituation('all');
          const teamData = allTeams?.find(t => t.name === code);
          return teamData?.teamName || code;
        } catch {
          return code;
        }
      };

      // Generate key insights
      const insights = [];

      // 1. Offensive Strength Analysis
      const awayXGFRank = calculatePercentileRank(dataProc, selectedGame.awayTeam, 'xGoalsFor', '5on5', true);
      const homeXGARank = calculatePercentileRank(dataProc, selectedGame.homeTeam, 'xGoalsAgainst', '5on5', false);
      
      if (awayXGFRank && homeXGARank) {
        const awayName = getTeamName(selectedGame.awayTeam);
        const homeName = getTeamName(selectedGame.homeTeam);
        
        if (awayXGFRank.percentile >= 70 && homeXGARank.percentile < 50) {
          insights.push({
            type: 'offense',
            title: `${awayName} Offensive Firepower`,
            description: `${awayName} ranks ${awayXGFRank.rank} in xGoals For (Top ${awayXGFRank.percentile}%) facing a ${homeName} defense ranked ${homeXGARank.rank} (${homeXGARank.tier})`,
            stat: `${(awayStats5v5?.xGoalsFor / ((awayStats5v5?.iceTime || 1) / 60)).toFixed(2)} xGF/60`
          });
        } else if (homeXGARank.percentile >= 70) {
          insights.push({
            type: 'defense',
            title: `${homeName} Defensive Wall`,
            description: `${homeName} allows 13.16 xGA/60 (Top ${homeXGARank.percentile}%), making it difficult for ${awayName} offense`,
            stat: `Rank ${homeXGARank.rank} in defensive efficiency`
          });
        }
      }

      // 2. High Danger Shots Analysis
      const awayHDRank = calculatePercentileRank(dataProc, selectedGame.awayTeam, 'highDangerShotsFor', '5on5', true);
      const homeHDRank = calculatePercentileRank(dataProc, selectedGame.homeTeam, 'highDangerShotsAgainst', '5on5', false);
      
      if (awayHDRank && awayHDRank.percentile >= 75) {
        insights.push({
          type: 'offense',
          title: 'High Danger Scoring Chances',
          description: `${getTeamName(selectedGame.awayTeam)} generates quality scoring opportunities from dangerous areas (${awayHDRank.tier} tier)`,
          stat: `${((awayStats5v5?.highDangerShotsFor || 0) / ((awayStats5v5?.iceTime || 1) / 60)).toFixed(2)} HD Shots/60`
        });
      }

      // 3. Special Teams Impact
      if (specialTeamsEdge !== 0 && Math.abs(specialTeamsEdge) > 0.5) {
        const advantageTeam = specialTeamsEdge > 0 ? getTeamName(selectedGame.awayTeam) : getTeamName(selectedGame.homeTeam);
        insights.push({
          type: 'special',
          title: 'Special Teams Mismatch',
          description: `${advantageTeam} has a significant power play/penalty kill advantage that could swing this game`,
          stat: `${Math.abs(specialTeamsEdge).toFixed(2)} goal advantage expected from special teams`
        });
      }

      // 4. Goalie Analysis
      if (goalieEdge !== 0 && Math.abs(goalieEdge) > 3) {
        const advantageTeam = goalieEdge > 0 ? getTeamName(selectedGame.awayTeam) : getTeamName(selectedGame.homeTeam);
        const goalieAdvantage = goalieEdge > 0 ? awayGoalie : homeGoalie;
        if (goalieAdvantage && !goalieAdvantage.isDefault) {
          insights.push({
            type: 'positive',
            title: 'Goaltending Advantage',
            description: `${advantageTeam}'s ${goalieAdvantage.name} provides a significant edge with elite save percentage`,
            stat: `${((goalieAdvantage.savePct || 0.905) * 100).toFixed(1)}% Save% | ${(goalieAdvantage.gsax || 0).toFixed(1)} GSAX`
          });
        }
      }

      // 5. Overall Prediction
      if (overallAdvantage) {
        const leadTeam = overallAdvantage.awayAdvantage > overallAdvantage.homeAdvantage 
          ? getTeamName(selectedGame.awayTeam)
          : getTeamName(selectedGame.homeTeam);
        const winProb = Math.max(overallAdvantage.awayAdvantage, overallAdvantage.homeAdvantage);
        
        if (winProb >= 60) {
          insights.push({
            type: winProb >= 70 ? 'positive' : 'offense',
            title: 'Model Prediction',
            description: `Advanced metrics favor ${leadTeam} with ${winProb.toFixed(0)}% win probability based on xGoals, shot quality, and matchup edges`,
            stat: `${leadTeam} ${winProb.toFixed(0)}-${(100 - winProb).toFixed(0)}`
          });
        }
      }

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
        insights: insights,
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

          {/* Sticky Summary Bar - follows scroll */}
          <StickySummaryBar
            awayTeam={matchupData.away}
            homeTeam={matchupData.home}
            matchupData={matchupData}
          />

          {/* Overall Advantage - Premium Display */}
          {matchupData.edges.overall && (
            <div className="elevated-card" style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              borderRadius: '20px',
              padding: '2.5rem',
              marginBottom: '2rem',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Gradient Background */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                pointerEvents: 'none'
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#F1F5F9',
                  marginBottom: '0.5rem',
                  background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {matchupData.away.name} @ {matchupData.home.name}
                </h2>

                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#64748B',
                  marginBottom: '2rem'
                }}>
                  {matchupData.gameTime || 'Game Time TBD'}
                </div>

                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '1rem'
                }}>
                  Model Win Probability
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    flex: 1,
                    textAlign: 'right'
                  }}>
                    <div style={{
                      fontSize: '3rem',
                      fontWeight: '900',
                      background: matchupData.edges.overall.favorite === 'away'
                        ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {matchupData.edges.overall.awayAdvantage}%
                    </div>
                    <div style={{
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      color: '#F1F5F9',
                      marginTop: '0.5rem'
                    }}>
                      {matchupData.away.code}
                    </div>
                  </div>

                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#64748B'
                  }}>
                    -
                  </div>

                  <div style={{
                    flex: 1,
                    textAlign: 'left'
                  }}>
                    <div style={{
                      fontSize: '3rem',
                      fontWeight: '900',
                      background: matchupData.edges.overall.favorite === 'home'
                        ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {matchupData.edges.overall.homeAdvantage}%
                    </div>
                    <div style={{
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      color: '#F1F5F9',
                      marginTop: '0.5rem'
                    }}>
                      {matchupData.home.code}
                    </div>
                  </div>
                </div>

                {/* Confidence Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.75rem 1.5rem',
                  background: 
                    matchupData.edges.overall.confidence === 'high' ? 'rgba(16, 185, 129, 0.1)' :
                    matchupData.edges.overall.confidence === 'medium' ? 'rgba(245, 158, 11, 0.1)' :
                    'rgba(100, 116, 139, 0.1)',
                  borderRadius: '12px',
                  border: `1px solid ${
                    matchupData.edges.overall.confidence === 'high' ? 'rgba(16, 185, 129, 0.3)' :
                    matchupData.edges.overall.confidence === 'medium' ? 'rgba(245, 158, 11, 0.3)' :
                    'rgba(100, 116, 139, 0.3)'
                  }`
                }}>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color:
                      matchupData.edges.overall.confidence === 'high' ? '#10B981' :
                      matchupData.edges.overall.confidence === 'medium' ? '#F59E0B' :
                      '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {matchupData.edges.overall.confidence} Confidence Prediction
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats Cards - 3 Biggest Edges */}
          <QuickStatsCards
            awayTeam={matchupData.away}
            homeTeam={matchupData.home}
            edges={matchupData.edges}
            matchupData={matchupData}
          />

          {/* Key Insights */}
          {matchupData.insights && matchupData.insights.length > 0 && (
            <KeyInsights insights={matchupData.insights} />
          )}

          {/* Head-to-Head Comparison Table */}
          <HeadToHeadTable
            awayTeam={matchupData.away}
            homeTeam={matchupData.home}
            matchupData={matchupData}
            dataProcessor={props.dataProcessor}
          />

          {/* Radar Comparison Chart */}
          <RadarComparison
            awayTeam={matchupData.away}
            homeTeam={matchupData.home}
            matchupData={matchupData}
            dataProcessor={props.dataProcessor}
          />

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
