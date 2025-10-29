/**
 * Matchup Insights Page - Deep Analytics Platform
 * Mobile-first, full nerd stats, visual context
 */

import { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import AIInsightCards from '../components/matchup/AIInsightCards';
import PredictionSummary from '../components/matchup/PredictionSummary';
import DominanceMatrix from '../components/matchup/DominanceMatrix';
import ExpectedGoalsChart from '../components/matchup/AdvancedMetrics/ExpectedGoalsChart';
import ShotQualityChart from '../components/matchup/AdvancedMetrics/ShotQualityChart';
import SpecialTeamsChart from '../components/matchup/AdvancedMetrics/SpecialTeamsChart';
import GoalieChart from '../components/matchup/AdvancedMetrics/GoalieChart';
import PossessionChart from '../components/matchup/AdvancedMetrics/PossessionChart';
import { getTeamStats, getGoalieStats } from '../utils/matchupCalculations';

export default function MatchupInsights(props) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [todaysGames, setTodaysGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    xgoals: false,
    shotquality: false,
    specialteams: false,
    goalie: false,
    possession: false
  });

  // Load today's games with proper time formatting
  useEffect(() => {
    if (!props || !props.dataProcessor || !props.todaysGames) {
      setLoading(false);
      return;
    }

    try {
      const games = props.todaysGames.map(game => {
        // Extract game time - try multiple sources
        let formattedTime = 'TBD';
        
        // Try game.time first (should be formatted like "7:00 PM ET")
        if (game.time && typeof game.time === 'string') {
          formattedTime = game.time;
        }
        // Try gameTime property
        else if (game.gameTime && typeof game.gameTime === 'string') {
          formattedTime = game.gameTime;
        }
        // Try startTimeUTC and convert
        else if (game.startTimeUTC) {
          try {
            const date = new Date(game.startTimeUTC);
            formattedTime = date.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              timeZone: 'America/New_York'
            }) + ' ET';
          } catch (e) {
            console.warn('Failed to parse startTimeUTC:', game.startTimeUTC);
          }
        }
        
        return {
          awayTeam: game.away || game.awayTeam,
          homeTeam: game.home || game.homeTeam || game.homeCode,
          gameTime: formattedTime,
          date: new Date().toISOString().split('T')[0],
          ...game
        };
      });

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

  // Calculate matchup data and prediction
  const matchupData = useMemo(() => {
    if (!selectedGame || !props?.dataProcessor || !props?.goalieData) return null;

    try {
      const dataProc = props.dataProcessor;
      const goalies = props.goalieData;

      // Get team stats (5v5 for main analysis)
      const awayStats5v5 = getTeamStats(dataProc, selectedGame.awayTeam, '5on5');
      const homeStats5v5 = getTeamStats(dataProc, selectedGame.homeTeam, '5on5');
      const awayPP = getTeamStats(dataProc, selectedGame.awayTeam, '5on4');
      const awayPK = getTeamStats(dataProc, selectedGame.awayTeam, '4on5');
      const homePP = getTeamStats(dataProc, selectedGame.homeTeam, '5on4');
      const homePK = getTeamStats(dataProc, selectedGame.homeTeam, '4on5');

      // Get goalies
      const awayGoalieName = selectedGame.awayGoalie || `${selectedGame.awayTeam} Goalie`;
      const homeGoalieName = selectedGame.homeGoalie || `${selectedGame.homeTeam} Goalie`;
      const awayGoalie = getGoalieStats(goalies, awayGoalieName) || { isDefault: true };
      const homeGoalie = getGoalieStats(goalies, homeGoalieName) || { isDefault: true };

      // Calculate prediction (matching Today's Games logic)
      const awayPredicted = dataProc.predictTeamScore(
        selectedGame.awayTeam, 
        selectedGame.homeTeam, 
        false, 
        awayGoalieName
      );
      const homePredicted = dataProc.predictTeamScore(
        selectedGame.homeTeam, 
        selectedGame.awayTeam, 
        true, 
        homeGoalieName
      );
      const total = awayPredicted + homePredicted;
      
      // Calculate win probability using production method
      const homeWinProb = dataProc.calculatePoissonWinProb(homePredicted, awayPredicted) * 100;
      const awayWinProb = 100 - homeWinProb;

      // Determine recommended bet (simple logic - can be enhanced)
      let recommendedBet = null;
      let confidence = null;
      let evPercent = null;

      const favorite = awayWinProb > homeWinProb ? selectedGame.awayTeam : selectedGame.homeTeam;
      const favoriteProb = Math.max(awayWinProb, homeWinProb);
      
      if (favoriteProb > 60) {
        recommendedBet = `${favorite} ML`;
        confidence = favoriteProb > 65 ? 'HIGH' : 'MEDIUM';
        evPercent = favoriteProb - 50; // Simplified EV calculation
      }

      // Build power play/penalty kill objects
      // FIX: PP% = goalsFor / total opportunities (approximated by iceTime / avg PP length)
      // FIX: PK% = 1 - (goalsAgainst / total opportunities)
      // SIMPLIFIED: Use raw xGoalsPercentage as a proxy for success rate
      const awayPowerPlay = awayPP ? {
        percentage: awayPP.xGoalsPercentage || 0.20, // Use xGoalsPercentage (already decimal 0-1)
        goalsFor: awayPP.goalsFor || 0
      } : null;

      const awayPenaltyKill = awayPK ? {
        percentage: awayPK.xGoalsPercentage ? (1 - awayPK.xGoalsPercentage) : 0.80, // Inverse for PK
        goalsAgainst: awayPK.goalsAgainst || 0
      } : null;

      const homePowerPlay = homePP ? {
        percentage: homePP.xGoalsPercentage || 0.20,
        goalsFor: homePP.goalsFor || 0
      } : null;

      const homePenaltyKill = homePK ? {
        percentage: homePK.xGoalsPercentage ? (1 - homePK.xGoalsPercentage) : 0.80,
        goalsAgainst: homePK.goalsAgainst || 0
      } : null;

      return {
        away: {
          code: selectedGame.awayTeam,
          stats5v5: awayStats5v5,
          powerPlay: awayPowerPlay,
          penaltyKill: awayPenaltyKill,
          goalie: awayGoalie
        },
        home: {
          code: selectedGame.homeTeam,
          stats5v5: homeStats5v5,
          powerPlay: homePowerPlay,
          penaltyKill: homePenaltyKill,
          goalie: homeGoalie
        },
        prediction: {
          awayScore: awayPredicted,
          homeScore: homePredicted,
          total,
          awayWinProb,
          homeWinProb,
          recommendedBet,
          confidence,
          evPercent
        }
      };
    } catch (error) {
      console.error('Error calculating matchup data:', error);
      return null;
    }
  }, [selectedGame, props?.dataProcessor, props?.goalieData, props]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        color: '#94A3B8',
        fontSize: '1.125rem'
      }}>
        Loading matchup insights...
      </div>
    );
  }

  if (todaysGames.length === 0) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        color: '#94A3B8',
        fontSize: '1.125rem',
        textAlign: 'center',
        padding: '2rem'
      }}>
        No games scheduled today
      </div>
    );
  }

  return (
    <div style={{
      padding: '1rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <h1 style={{
        fontSize: '2rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '1rem'
      }}>
        Matchup Insights
      </h1>
      <p style={{
        fontSize: '0.9375rem',
        color: '#94A3B8',
        marginBottom: '1.5rem',
        lineHeight: 1.6
      }}>
        Deep dive analytics for advanced bettors. Explore the underlying stats and metrics that drive our recommendations.
      </p>

      {/* Game Selector */}
      {todaysGames.length > 1 && (
        <div style={{
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          overflowX: 'auto',
          padding: '0.5rem 0'
        }}>
          {todaysGames.map((game, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedGame(game)}
              style={{
                padding: '0.75rem 1.25rem',
                background: selectedGame === game 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)'
                  : 'rgba(30, 41, 59, 0.6)',
                border: selectedGame === game 
                  ? '1px solid rgba(16, 185, 129, 0.5)'
                  : '1px solid rgba(148, 163, 184, 0.1)',
                borderRadius: '10px',
                color: selectedGame === game ? '#10B981' : '#F1F5F9',
                fontSize: '0.875rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {game.awayTeam} @ {game.homeTeam}
            </button>
          ))}
        </div>
      )}

      {/* AI Analysis Cards */}
      {selectedGame && (
        <AIInsightCards
          awayTeam={selectedGame.awayTeam}
          homeTeam={selectedGame.homeTeam}
        />
      )}

      {/* Prediction Summary */}
      {matchupData && (
        <PredictionSummary
          awayTeam={matchupData.away}
          homeTeam={matchupData.home}
          prediction={matchupData.prediction}
          gameTime={selectedGame.gameTime}
        />
      )}

      {/* Dominance Matrix */}
      {matchupData && props.dataProcessor && (
        <DominanceMatrix
          awayTeam={matchupData.away}
          homeTeam={matchupData.home}
          matchupData={matchupData}
          dataProcessor={props.dataProcessor}
        />
      )}

      {/* Advanced Metrics - Collapsible Sections */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1rem'
        }}>
          Advanced Metrics Deep Dive
        </h2>

        {/* Expected Goals */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderRadius: '16px',
          marginBottom: '1rem',
          overflow: 'hidden',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
        }}>
          <button
            onClick={() => toggleSection('xgoals')}
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              background: 'transparent',
              border: 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              color: '#F1F5F9',
              fontSize: '1.125rem',
              fontWeight: '700'
            }}
          >
            <span>Expected Goals Analysis</span>
            {expandedSections.xgoals ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedSections.xgoals && matchupData && (
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
              <ExpectedGoalsChart
                awayTeam={matchupData.away}
                homeTeam={matchupData.home}
                awayStats={matchupData.away.stats5v5}
                homeStats={matchupData.home.stats5v5}
              />
            </div>
          )}
        </div>

        {/* Shot Quality */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderRadius: '16px',
          marginBottom: '1rem',
          overflow: 'hidden',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
        }}>
          <button
            onClick={() => toggleSection('shotquality')}
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              background: 'transparent',
              border: 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              color: '#F1F5F9',
              fontSize: '1.125rem',
              fontWeight: '700'
            }}
          >
            <span>Shot Quality Matrix</span>
            {expandedSections.shotquality ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedSections.shotquality && matchupData && (
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
              <ShotQualityChart
                awayTeam={matchupData.away}
                homeTeam={matchupData.home}
                awayStats={matchupData.away.stats5v5}
                homeStats={matchupData.home.stats5v5}
              />
            </div>
          )}
        </div>

        {/* Special Teams */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderRadius: '16px',
          marginBottom: '1rem',
          overflow: 'hidden',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
        }}>
          <button
            onClick={() => toggleSection('specialteams')}
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              background: 'transparent',
              border: 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              color: '#F1F5F9',
              fontSize: '1.125rem',
              fontWeight: '700'
            }}
          >
            <span>Special Teams Breakdown</span>
            {expandedSections.specialteams ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedSections.specialteams && matchupData && (
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
              <SpecialTeamsChart
                awayTeam={matchupData.away}
                homeTeam={matchupData.home}
                awayPP={matchupData.away.powerPlay}
                awayPK={matchupData.away.penaltyKill}
                homePP={matchupData.home.powerPlay}
                homePK={matchupData.home.penaltyKill}
              />
            </div>
          )}
        </div>

        {/* Goalie */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderRadius: '16px',
          marginBottom: '1rem',
          overflow: 'hidden',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
        }}>
          <button
            onClick={() => toggleSection('goalie')}
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              background: 'transparent',
              border: 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              color: '#F1F5F9',
              fontSize: '1.125rem',
              fontWeight: '700'
            }}
          >
            <span>Goaltending Deep Dive</span>
            {expandedSections.goalie ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedSections.goalie && matchupData && (
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
              <GoalieChart
                awayTeam={matchupData.away}
                homeTeam={matchupData.home}
                awayGoalie={matchupData.away.goalie}
                homeGoalie={matchupData.home.goalie}
              />
            </div>
          )}
        </div>

        {/* Possession */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderRadius: '16px',
          marginBottom: '1rem',
          overflow: 'hidden',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
        }}>
          <button
            onClick={() => toggleSection('possession')}
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              background: 'transparent',
              border: 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              color: '#F1F5F9',
              fontSize: '1.125rem',
              fontWeight: '700'
            }}
          >
            <span>Possession & Pace</span>
            {expandedSections.possession ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedSections.possession && matchupData && (
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
              <PossessionChart
                awayTeam={matchupData.away}
                homeTeam={matchupData.home}
                awayStats={matchupData.away.stats5v5}
                homeStats={matchupData.home.stats5v5}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Optimization */}
      <style>{`
        @media (max-width: 768px) {
          .matchup-insights-container {
            padding: 1rem 0.75rem !important;
          }
          h1 {
            font-size: 1.5rem !important;
          }
          h2 {
            font-size: 1.25rem !important;
          }
          h4 {
            font-size: 0.9375rem !important;
          }
          p {
            font-size: 0.8125rem !important;
          }
        }
      `}</style>
    </div>
  );
}
