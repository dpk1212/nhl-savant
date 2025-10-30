/**
 * Matchup Insights Page - Expert Analysis & Game Selection
 * Simplified view focused on AI-generated insights
 */

import { useState, useEffect, useMemo } from 'react';
import AIInsightCards from '../components/matchup/AIInsightCards';
import GameSelector from '../components/matchup/GameSelector';

export default function MatchupInsights(props) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [todaysGames, setTodaysGames] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // No longer need matchupData - page simplified to only show game selector and AI insights

  // Calculate predictions for ALL games (for GameSelector)
  const allPredictions = useMemo(() => {
    if (!todaysGames.length || !props?.dataProcessor) return [];

    return todaysGames.map(game => {
      try {
        const dataProc = props.dataProcessor;
        
        const awayGoalieName = game.awayGoalie || `${game.awayTeam} Goalie`;
        const homeGoalieName = game.homeGoalie || `${game.homeTeam} Goalie`;
        
        const awayPredicted = dataProc.predictTeamScore(
          game.awayTeam, 
          game.homeTeam, 
          false, 
          awayGoalieName
        );
        const homePredicted = dataProc.predictTeamScore(
          game.homeTeam, 
          game.awayTeam, 
          true, 
          homeGoalieName
        );
        
        const homeWinProb = dataProc.calculatePoissonWinProb(homePredicted, awayPredicted) * 100;
        const awayWinProb = 100 - homeWinProb;
        
        return {
          awayScore: awayPredicted,
          homeScore: homePredicted,
          awayWinProb,
          homeWinProb
        };
      } catch (error) {
        console.error('Error calculating prediction for game:', game, error);
        return null;
      }
    }).filter(Boolean);
  }, [todaysGames, props?.dataProcessor]);

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
        Expert AI-generated analysis and insights for today's matchups. Bold takes and hidden edges from our analytics.
      </p>

      {/* Game Selector Carousel - PREMIUM */}
      <GameSelector
        games={todaysGames}
        selectedGame={selectedGame}
        onGameSelect={setSelectedGame}
        predictions={allPredictions}
      />

      {/* AI Analysis Cards */}
      {selectedGame && (
        <AIInsightCards
          awayTeam={{ name: selectedGame.awayTeam }}
          homeTeam={{ name: selectedGame.homeTeam }}
        />
      )}

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
