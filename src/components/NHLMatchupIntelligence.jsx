/**
 * NHL Matchup Intelligence Component - ULTRA-COMPACT + VISUAL + SMART CONTEXT
 * Explains VALUE plays vs QUALITY plays with exploitable angles
 * Includes possession, shot blocking, and physical play metrics
 */

import { useState } from 'react';

const NHLMatchupIntelligence = ({ 
  game, 
  dataProcessor, 
  statsAnalyzer,
  bestEdge,
  firebaseBets,
  isMobile = false 
}) => {
  if (!game || !dataProcessor || !statsAnalyzer) {
    return null;
  }

  const awayTeam = game.awayTeam;
  const homeTeam = game.homeTeam;

  // Check for locked pick
  const lockedBet = firebaseBets?.find(bet => {
    const betGame = bet.game || bet;
    return (betGame.awayTeam === awayTeam && betGame.homeTeam === homeTeam) ||
           (betGame.away === awayTeam && betGame.home === homeTeam);
  });

  const isLockedPick = lockedBet && (!bestEdge || bestEdge.evPercent < 5);

  // Get team data
  const away5v5 = dataProcessor.getTeamData(awayTeam, '5on5');
  const home5v5 = dataProcessor.getTeamData(homeTeam, '5on5');
  
  if (!away5v5 || !home5v5) return null;

  // Core metrics
  const awayXGF = (away5v5.xGoalsFor / away5v5.gamesPlayed) || 0;
  const homeXGF = (home5v5.xGoalsFor / home5v5.gamesPlayed) || 0;
  const awayXGA = (away5v5.xGoalsAgainst / away5v5.gamesPlayed) || 0;
  const homeXGA = (home5v5.xGoalsAgainst / home5v5.gamesPlayed) || 0;

  const leagueXGF = 2.18;
  const leagueXGA = 2.18;

  // High-danger metrics
  const awayHighDanger = statsAnalyzer.getHighDangerMetrics(awayTeam, '5on5');
  const homeHighDanger = statsAnalyzer.getHighDangerMetrics(homeTeam, '5on5');
  
  const awayHDxGPerGame = (awayHighDanger?.hdXgFor || 0) / (away5v5.gamesPlayed || 1);
  const homeHDxGPerGame = (homeHighDanger?.hdXgFor || 0) / (home5v5.gamesPlayed || 1);
  
  const awayReboundxG = (away5v5.xGoalsFromActualReboundsOfShotsFor || 0) / (away5v5.gamesPlayed || 1);
  const homeReboundxG = (home5v5.xGoalsFromActualReboundsOfShotsFor || 0) / (home5v5.gamesPlayed || 1);

  const awayDZGiveaways = (away5v5.dZoneGiveawaysFor || 0) / (away5v5.gamesPlayed || 1);
  const homeDZGiveaways = (home5v5.dZoneGiveawaysFor || 0) / (home5v5.gamesPlayed || 1);

  // POSSESSION METRICS
  const awayCorsi = away5v5.corsiPercentage || 0.5;
  const homeCorsi = home5v5.corsiPercentage || 0.5;
  const awayFenwick = away5v5.fenwickPercentage || 0.5;
  const homeFenwick = home5v5.fenwickPercentage || 0.5;
  
  // Faceoff %
  const awayFaceoffWins = away5v5.faceOffsWonFor || 0;
  const awayFaceoffTotal = (away5v5.faceOffsWonFor || 0) + (away5v5.faceOffsWonAgainst || 0);
  const awayFaceoffPct = awayFaceoffTotal > 0 ? awayFaceoffWins / awayFaceoffTotal : 0.5;
  
  const homeFaceoffWins = home5v5.faceOffsWonFor || 0;
  const homeFaceoffTotal = (home5v5.faceOffsWonFor || 0) + (home5v5.faceOffsWonAgainst || 0);
  const homeFaceoffPct = homeFaceoffTotal > 0 ? homeFaceoffWins / homeFaceoffTotal : 0.5;

  // PHYSICAL PLAY
  const awayHits = (away5v5.hitsFor || 0) / (away5v5.gamesPlayed || 1);
  const homeHits = (home5v5.hitsFor || 0) / (home5v5.gamesPlayed || 1);
  const awayTakeaways = (away5v5.takeawaysFor || 0) / (away5v5.gamesPlayed || 1);
  const homeTakeaways = (home5v5.takeawaysFor || 0) / (home5v5.gamesPlayed || 1);

  // SHOT BLOCKING
  const awayBlockedShots = (away5v5.blockedShotAttemptsAgainst || 0);
  const awayShotAttempts = (away5v5.shotAttemptsAgainst || 1);
  const awayBlockPct = (awayBlockedShots / awayShotAttempts) * 100;
  
  const homeBlockedShots = (home5v5.blockedShotAttemptsAgainst || 0);
  const homeShotAttempts = (home5v5.shotAttemptsAgainst || 1);
  const homeBlockPct = (homeBlockedShots / homeShotAttempts) * 100;

  // Special teams
  const awayPP = statsAnalyzer.getHighDangerMetrics(awayTeam, '5on4');
  const homePP = statsAnalyzer.getHighDangerMetrics(homeTeam, '5on4');
  
  const awayPPScore = awayPP?.hdXgfPer60 || 0;
  const homePPScore = homePP?.hdXgfPer60 || 0;
  const specialTeamsDiff = awayPPScore - homePPScore;
  const leaguePPScore = 2.95;

  // PP shot quality
  const awayPPData = dataProcessor.getTeamData(awayTeam, '5on4');
  const homePPData = dataProcessor.getTeamData(homeTeam, '5on4');
  const awayPPHDPercent = awayPPData && awayPPData.shotAttemptsFor > 0 
    ? ((awayPPData.highDangerShotsFor || 0) / awayPPData.shotAttemptsFor) * 100 
    : 0;
  const homePPHDPercent = homePPData && homePPData.shotAttemptsFor > 0
    ? ((homePPData.highDangerShotsFor || 0) / homePPData.shotAttemptsFor) * 100
    : 0;

  // Get rank for context
  const awayPPRank = statsAnalyzer.getLeagueRank(awayTeam, 'highDangerxGoalsFor', '5on4', true);
  const homePPRank = statsAnalyzer.getLeagueRank(homeTeam, 'highDangerxGoalsFor', '5on4', true);

  // Goalie data
  const awayGoalie = game.goalies?.away;
  const homeGoalie = game.goalies?.home;
  const awayGSAE = awayGoalie?.gsae || 0;
  const homeGSAE = homeGoalie?.gsae || 0;
  const goalieEdge = awayGSAE - homeGSAE;
  const leagueGSAE = 1.00;

  // PDO Regression
  const awayRegression = statsAnalyzer.getRegressionIndicators(awayTeam, '5on5');
  const homeRegression = statsAnalyzer.getRegressionIndicators(homeTeam, '5on5');
  
  const awayPDO = awayRegression?.pdo || 100;
  const homePDO = homeRegression?.pdo || 100;
  
  const awayRegressionImpact = awayPDO > 102 ? -((awayPDO - 100) * 0.06) : awayPDO < 98 ? ((100 - awayPDO) * 0.05) : 0;
  const homeRegressionImpact = homePDO > 102 ? -((homePDO - 100) * 0.06) : homePDO < 98 ? ((100 - homePDO) * 0.05) : 0;

  // Calculate edges
  const offenseEdge = Math.abs(awayXGF - homeXGF) > 0.15 ? Math.abs(awayXGF - homeXGF) * 0.4 : 0;
  const offenseEdgeTeam = awayXGF > homeXGF ? awayTeam : homeTeam;
  
  const defenseEdge = Math.abs(awayXGA - homeXGA) > 0.15 ? Math.abs(awayXGA - homeXGA) * 0.4 : 0;
  const defenseEdgeTeam = awayXGA < homeXGA ? awayTeam : homeTeam;
  
  const specialTeamsEdge = Math.abs(specialTeamsDiff) > 0.5 ? Math.abs(specialTeamsDiff) * 0.15 : 0;
  const specialTeamsEdgeTeam = specialTeamsDiff > 0 ? awayTeam : homeTeam;
  
  const goalieEdgeImpact = Math.abs(goalieEdge) > 0.3 ? Math.abs(goalieEdge) * 0.15 : 0;
  const goalieEdgeTeam = goalieEdge > 0 ? awayTeam : homeTeam;
  
  const regressionEdge = Math.abs(awayRegressionImpact - homeRegressionImpact);
  const regressionEdgeTeam = (homeRegressionImpact - awayRegressionImpact) > 0 ? homeTeam : awayTeam;
  
  // Possession edge
  const possessionEdge = Math.abs(awayCorsi - homeCorsi) > 0.03 ? Math.abs(awayCorsi - homeCorsi) * 0.3 : 0;
  const possessionEdgeTeam = awayCorsi > homeCorsi ? awayTeam : homeTeam;
  
  // Exploitable angle: Turnovers vs Forecheck
  const turnoverExploitEdge = awayDZGiveaways > 7 && homeTakeaways > 3 ? 0.25 :
                               homeDZGiveaways > 7 && awayTakeaways > 3 ? 0.25 : 0;
  const turnoverExploitTeam = awayDZGiveaways > 7 && homeTakeaways > 3 ? homeTeam : awayTeam;
  
  const totalEdge = offenseEdge + defenseEdge + specialTeamsEdge + goalieEdgeImpact + regressionEdge + possessionEdge + turnoverExploitEdge;
  const edgeFavoredTeam = (awayXGF - awayXGA + awayRegressionImpact + (awayCorsi - 0.5) * 0.5) > (homeXGF - homeXGA + homeRegressionImpact + (homeCorsi - 0.5) * 0.5) ? awayTeam : homeTeam;

  // Get best bet recommendation (include ALL edges, even low confidence)
  const recommendedPlay = bestEdge || null;
  
  // DETERMINE PLAY TYPE: VALUE vs QUALITY
  const isValuePlay = recommendedPlay && recommendedPlay.team !== edgeFavoredTeam;
  const playType = isValuePlay ? 'VALUE' : 'QUALITY';

  // GENERATE MATCHUP STORY
  const generateMatchupStory = () => {
    const offenseDiff = Math.abs(awayXGF - homeXGF);
    const defenseDiff = Math.abs(awayXGA - homeXGA);
    const ppDiff = Math.abs(specialTeamsDiff);
    
    // Determine matchup type
    if (ppDiff > 0.8 && (ppDiff > offenseDiff * 2)) {
      return "🔥 Special teams showdown - elite PP could be the difference";
    } else if (offenseDiff > 0.3 && defenseDiff < 0.15) {
      return "⚔️ Firepower vs structure - high-powered offense meets defensive wall";
    } else if (possessionEdge > 0.08) {
      return "🎮 Possession battle - territorial control drives this matchup";
    } else if (turnoverExploitEdge > 0.2) {
      return "💀 Turnover war - mistakes will be punished in transition";
    } else if (Math.abs(awayPDO - homePDO) > 4) {
      return "🎲 Regression game - luck is about to even out";
    } else if (offenseDiff < 0.15 && defenseDiff < 0.15) {
      return "⚖️ Defensive grind - two evenly-matched teams battle it out";
    } else {
      return "⚡ Clash of styles - key edges will decide this one";
    }
  };

  const matchupStory = generateMatchupStory();

  // CONFIDENCE LEVEL ASSESSMENT
  const getConfidenceLevel = () => {
    if (isLockedPick) return 'LOCKED';
    if (totalEdge > 0.5) return 'VERY_HIGH';
    if (totalEdge > 0.35) return 'HIGH';
    if (totalEdge > 0.2) return 'MODERATE';
    if (isValuePlay && recommendedPlay) return 'VALUE';
    if (totalEdge > 0.1) return 'LOW';
    return 'MINIMAL';
  };

  const confidenceLevel = getConfidenceLevel();

  // The Four Factors - ENHANCED WITH STORYTELLING
  const factors = [
    {
      icon: '🎯',
      name: 'WHO CREATES BETTER CHANCES?',
      subtitle: '',
      awayValue: awayXGF,
      homeValue: homeXGF,
      leagueAvg: leagueXGF,
      percentDiff: ((Math.abs(awayXGF - homeXGF) / leagueXGF) * 100).toFixed(1),
      advantage: Math.abs(awayXGF - homeXGF) > 0.15 ? (awayXGF > homeXGF ? awayTeam : homeTeam) : null,
      significance: Math.abs(awayXGF - homeXGF) > 0.25 ? 'high' : Math.abs(awayXGF - homeXGF) > 0.15 ? 'moderate' : 'low',
      format: (val) => val.toFixed(2),
      keyInsight: awayHDxGPerGame > homeHDxGPerGame 
        ? `${awayTeam}'s slot dominance (${((awayHDxGPerGame / homeHDxGPerGame - 1) * 100).toFixed(0)}% more HD chances) = +${(offenseEdge || 0).toFixed(2)}g`
        : homeHDxGPerGame > awayHDxGPerGame
        ? `${homeTeam}'s slot dominance (${((homeHDxGPerGame / awayHDxGPerGame - 1) * 100).toFixed(0)}% more HD chances) = +${(offenseEdge || 0).toFixed(2)}g`
        : `Even offensive quality - no clear advantage`,
      context: awayHDxGPerGame > homeHDxGPerGame 
        ? `${awayTeam} generates ${((awayHDxGPerGame / homeHDxGPerGame - 1) * 100).toFixed(0)}% more slot chances (${awayHDxGPerGame.toFixed(2)} vs ${homeHDxGPerGame.toFixed(2)} HD xG)`
        : homeHDxGPerGame > awayHDxGPerGame
        ? `${homeTeam} generates ${((homeHDxGPerGame / awayHDxGPerGame - 1) * 100).toFixed(0)}% more slot chances (${homeHDxGPerGame.toFixed(2)} vs ${awayHDxGPerGame.toFixed(2)} HD xG)`
        : 'Even battle - both teams create similar quality chances',
      stats: [
        { label: '📍 Slot', away: awayHDxGPerGame.toFixed(2), home: homeHDxGPerGame.toFixed(2), winner: awayHDxGPerGame > homeHDxGPerGame ? 'away' : 'home' },
        { label: '🔄 Rebound', away: awayReboundxG.toFixed(2), home: homeReboundxG.toFixed(2) }
      ]
    },
    {
      icon: '🛡️',
      name: 'WHO PREVENTS GOALS BETTER?',
      subtitle: '',
      awayValue: awayXGA,
      homeValue: homeXGA,
      leagueAvg: leagueXGA,
      percentDiff: ((Math.abs(awayXGA - homeXGA) / leagueXGA) * 100).toFixed(1),
      advantage: Math.abs(awayXGA - homeXGA) > 0.15 ? (awayXGA < homeXGA ? awayTeam : homeTeam) : null,
      significance: Math.abs(awayXGA - homeXGA) > 0.25 ? 'high' : Math.abs(awayXGA - homeXGA) > 0.15 ? 'moderate' : 'low',
      format: (val) => val.toFixed(2),
      keyInsight: awayXGA < homeXGA
        ? `${awayTeam} allows ${((1 - (awayXGA / homeXGA)) * 100).toFixed(0)}% fewer quality chances = +${(defenseEdge || 0).toFixed(2)}g`
        : homeXGA < awayXGA
        ? `${homeTeam} allows ${((1 - (homeXGA / awayXGA)) * 100).toFixed(0)}% fewer quality chances = +${(defenseEdge || 0).toFixed(2)}g`
        : 'Even defensive structures - no clear edge',
      context: awayDZGiveaways > 7 
        ? `${awayTeam} bleeds ${awayDZGiveaways.toFixed(1)} turnovers/gm (${statsAnalyzer.getLeagueRank(awayTeam, 'dZoneGiveawaysFor', '5on5', false) || 'bottom-10'} in NHL) = rush chances`
        : homeDZGiveaways > 7
        ? `${homeTeam} bleeds ${homeDZGiveaways.toFixed(1)} turnovers/gm (${statsAnalyzer.getLeagueRank(homeTeam, 'dZoneGiveawaysFor', '5on5', false) || 'bottom-10'} in NHL) = rush chances`
        : 'Both teams protect the puck well - clean defensive play',
      stats: [
        { label: '💀 Turnovers', away: awayDZGiveaways.toFixed(1), home: homeDZGiveaways.toFixed(1), warning: awayDZGiveaways > 7 || homeDZGiveaways > 7 }
      ]
    },
    {
      icon: '🔥',
      name: 'WHO DOMINATES SPECIAL TEAMS?',
      subtitle: '',
      awayValue: awayPPScore,
      homeValue: homePPScore,
      leagueAvg: leaguePPScore,
      percentDiff: ((Math.abs(specialTeamsDiff) / leaguePPScore) * 100).toFixed(1),
      advantage: Math.abs(specialTeamsDiff) > 0.5 ? (specialTeamsDiff > 0 ? awayTeam : homeTeam) : null,
      significance: Math.abs(specialTeamsDiff) > 1.0 ? 'high' : Math.abs(specialTeamsDiff) > 0.5 ? 'moderate' : 'low',
      format: (val) => val.toFixed(2),
      keyInsight: Math.abs(specialTeamsDiff) > 0.5
        ? `${specialTeamsDiff > 0 ? awayTeam : homeTeam}'s PP (${Math.max(awayPPHDPercent, homePPHDPercent).toFixed(0)}% HD shots) vs weak PK = +${(specialTeamsEdge || 0).toFixed(2)}g`
        : 'Even special teams - no PP/PK advantage',
      context: specialTeamsDiff > 0.8 && awayPPRank <= 10
        ? `${awayTeam}'s elite PP (#${awayPPRank} in NHL) shoots ${awayPPHDPercent.toFixed(0)}% from danger areas = 2x conversion`
        : specialTeamsDiff < -0.8 && homePPRank <= 10
        ? `${homeTeam}'s elite PP (#${homePPRank} in NHL) shoots ${homePPHDPercent.toFixed(0)}% from danger areas = 2x conversion`
        : Math.abs(specialTeamsDiff) > 0.5
        ? `Clear ${((Math.abs(specialTeamsDiff) / leaguePPScore) * 100).toFixed(0)}% special teams gap - PP quality matters`
        : 'Special teams evenly matched - not a deciding factor',
      stats: [
        { label: '📊 Quality', away: `${awayPPHDPercent.toFixed(0)}%`, home: `${homePPHDPercent.toFixed(0)}%`, suffix: 'HD shots' },
        { label: '🎯 Impact', value: `= ${Math.abs(specialTeamsDiff * 0.15).toFixed(2)} goals` }
      ]
    },
    {
      icon: '🥅',
      name: 'WHO HAS THE BETTER NETMINDER?',
      subtitle: '',
      awayValue: awayGSAE,
      homeValue: homeGSAE,
      leagueAvg: leagueGSAE,
      percentDiff: ((Math.abs(goalieEdge) / leagueGSAE) * 100).toFixed(1),
      advantage: Math.abs(goalieEdge) > 0.3 ? (goalieEdge > 0 ? awayTeam : homeTeam) : null,
      significance: Math.abs(goalieEdge) > 0.5 ? 'high' : Math.abs(goalieEdge) > 0.3 ? 'moderate' : 'low',
      format: (val) => val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2),
      keyInsight: Math.abs(goalieEdge) > 0.3
        ? `${goalieEdge > 0 ? awayGoalie?.name || awayTeam : homeGoalie?.name || homeTeam} (${Math.max(awayGSAE, homeGSAE).toFixed(2)} GSAx) saves +${Math.abs(goalieEdge * 0.15).toFixed(2)}g vs average`
        : 'Even goaltending - not a deciding factor',
      context: Math.abs(goalieEdge) > 0.3
        ? `${goalieEdge > 0 ? awayGoalie?.name || awayTeam : homeGoalie?.name || homeTeam} stops ${((Math.abs(goalieEdge) / leagueGSAE) * 100).toFixed(0)}% more shots than average goalie = +${Math.abs(goalieEdge * 0.15).toFixed(2)} goals saved`
        : 'Evenly matched goaltending - no clear advantage in net',
      stats: []
    }
  ];

  return (
    <>
      {/* Animations */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes shine {
          0% { left: -100%; }
          20% { left: 100%; }
          100% { left: 100%; }
        }
      `}</style>
      
      <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 50%, rgba(17, 24, 39, 0.98) 100%)',
      border: '1px solid rgba(16, 185, 129, 0.25)',
      borderRadius: '14px',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(16, 185, 129, 0.1) inset'
    }}>
      {/* Header */}
      <div style={{
        padding: isMobile ? '0.875rem 1rem' : '1.125rem 1.5rem',
        borderBottom: '1px solid rgba(16, 185, 129, 0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <span style={{ 
            fontSize: '1.25rem',
            filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))'
          }}>⚡</span>
          <span style={{
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            fontWeight: '800',
            color: 'var(--color-text-primary)',
            letterSpacing: '0.08em',
            textShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
          }}>
            MATCHUP INTELLIGENCE
          </span>
        </div>
      </div>

      {/* Matchup Story - NEW */}
      <div style={{
        padding: isMobile ? '0.75rem 1rem' : '0.875rem 1.5rem',
        background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.1) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
        borderLeft: '3px solid rgba(139, 92, 246, 0.5)'
      }}>
        <div style={{
          fontSize: '0.75rem',
          color: 'rgba(167, 139, 250, 0.95)',
          fontStyle: 'italic',
          letterSpacing: '0.02em',
          lineHeight: '1.4'
        }}>
          {matchupStory}
        </div>
      </div>

      {/* Team Headers - ENHANCED */}
      <div style={{
        padding: isMobile ? '0.875rem 1rem' : '1.125rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.3)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{
          fontSize: isMobile ? '1rem' : '1.125rem',
          fontWeight: '900',
          color: '#0EA5E9',
          textShadow: '0 0 20px rgba(14, 165, 233, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3)',
          letterSpacing: '0.02em'
        }}>
          {awayTeam} <span style={{ 
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            fontWeight: '700',
            opacity: 0.9
          }}>{awayXGF.toFixed(2)}</span>
        </div>
        <div style={{
          fontSize: '0.938rem',
          color: 'var(--color-text-muted)',
          fontWeight: '800',
          padding: '0.25rem 0.5rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          🆚
        </div>
        <div style={{
          fontSize: isMobile ? '1rem' : '1.125rem',
          fontWeight: '900',
          color: '#10B981',
          textShadow: '0 0 20px rgba(16, 185, 129, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3)',
          letterSpacing: '0.02em'
        }}>
          {homeTeam} <span style={{ 
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            fontWeight: '700',
            opacity: 0.9
          }}>{homeXGF.toFixed(2)}</span>
        </div>
      </div>

      {/* COMPACT BARS */}
      <div style={{
        padding: isMobile ? '0.75rem 1rem' : '1rem 1.25rem',
        background: 'rgba(0, 0, 0, 0.15)'
      }}>
        {factors.map((factor, idx) => (
          <div key={idx} style={{ 
            marginBottom: idx < factors.length - 1 ? '1.25rem' : 0,
            paddingBottom: idx < factors.length - 1 ? '1.25rem' : 0,
            borderBottom: idx < factors.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
          }}>
            {/* Header Row - ENHANCED */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.625rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: isMobile ? '0.75rem' : '0.813rem',
                fontWeight: '800',
                color: 'var(--color-text-primary)'
              }}>
                <span style={{ 
                  fontSize: '1.063rem',
                  filter: `drop-shadow(0 0 6px ${
                    factor.icon === '🎯' ? 'rgba(14, 165, 233, 0.5)' :
                    factor.icon === '🛡️' ? 'rgba(239, 68, 68, 0.5)' :
                    factor.icon === '🔥' ? 'rgba(251, 146, 60, 0.5)' :
                    'rgba(16, 185, 129, 0.5)'
                  })`
                }}>{factor.icon}</span>
                <span style={{ letterSpacing: '0.05em' }}>{factor.name}</span>
                {factor.subtitle && (
                  <span style={{
                    fontSize: '0.625rem',
                    color: 'var(--color-text-muted)',
                    fontWeight: '600',
                    opacity: 0.8
                  }}>
                    ({factor.subtitle})
                  </span>
                )}
              </div>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: '800',
                color: factor.significance === 'high' ? '#10B981' : factor.significance === 'moderate' ? '#F59E0B' : 'var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: factor.advantage ? '0.25rem 0.5rem' : '0',
                background: factor.advantage && factor.significance === 'high' ? 'rgba(16, 185, 129, 0.15)' : 
                           factor.advantage && factor.significance === 'moderate' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                borderRadius: '6px',
                border: factor.advantage && factor.significance === 'high' ? '1px solid rgba(16, 185, 129, 0.3)' : 
                        factor.advantage && factor.significance === 'moderate' ? '1px solid rgba(245, 158, 11, 0.3)' : 'none',
                textShadow: factor.significance === 'high' ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none'
              }}>
                {factor.advantage && `+${factor.percentDiff}%`}
                {factor.significance === 'high' && <span style={{ 
                  fontSize: '0.938rem',
                  filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))'
                }}>⚡</span>}
              </div>
            </div>

            {/* Center-Diverging Bar - ENHANCED */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              gap: '0.5rem',
              alignItems: 'center',
              marginBottom: '0.625rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  fontSize: '0.813rem',
                  fontWeight: '800',
                  color: factor.advantage === awayTeam ? '#0EA5E9' : 'var(--color-text-secondary)',
                  minWidth: '50px',
                  textAlign: 'right',
                  textShadow: factor.advantage === awayTeam ? '0 0 12px rgba(14, 165, 233, 0.5)' : 'none'
                }}>
                  {factor.format(factor.awayValue)}
                </span>
                <div style={{ 
                  height: '24px', 
                  width: '100%', 
                  display: 'flex', 
                  justifyContent: 'flex-end',
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '6px',
                  padding: '2px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, (factor.awayValue / (factor.leagueAvg * 2)) * 100)}%`,
                    background: factor.advantage === awayTeam
                      ? 'linear-gradient(90deg, #0EA5E9 0%, #06B6D4 50%, #0EA5E9 100%)'
                      : 'linear-gradient(90deg, rgba(14, 165, 233, 0.35) 0%, rgba(14, 165, 233, 0.25) 100%)',
                    borderRadius: '4px 0 0 4px',
                    boxShadow: factor.advantage === awayTeam 
                      ? '0 0 16px rgba(14, 165, 233, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                      : 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    border: factor.advantage === awayTeam ? '1px solid rgba(96, 165, 250, 0.5)' : 'none',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {factor.advantage === awayTeam && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
                        animation: 'shimmer 2s infinite'
                      }} />
                    )}
                  </div>
                </div>
              </div>
              <div style={{ 
                minWidth: '32px', 
                textAlign: 'center', 
                fontSize: '0.875rem',
                padding: '0.25rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>⚖️</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ 
                  height: '24px', 
                  width: '100%', 
                  display: 'flex', 
                  justifyContent: 'flex-start',
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '6px',
                  padding: '2px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, (factor.homeValue / (factor.leagueAvg * 2)) * 100)}%`,
                    background: factor.advantage === homeTeam
                      ? 'linear-gradient(90deg, #10B981 0%, #059669 50%, #10B981 100%)'
                      : 'linear-gradient(90deg, rgba(16, 185, 129, 0.35) 0%, rgba(16, 185, 129, 0.25) 100%)',
                    borderRadius: '0 4px 4px 0',
                    boxShadow: factor.advantage === homeTeam 
                      ? '0 0 16px rgba(16, 185, 129, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                      : 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    border: factor.advantage === homeTeam ? '1px solid rgba(52, 211, 153, 0.5)' : 'none',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {factor.advantage === homeTeam && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
                        animation: 'shimmer 2s infinite'
                      }} />
                    )}
                  </div>
                </div>
                <span style={{
                  fontSize: '0.813rem',
                  fontWeight: '800',
                  color: factor.advantage === homeTeam ? '#10B981' : 'var(--color-text-secondary)',
                  minWidth: '50px',
                  textShadow: factor.advantage === homeTeam ? '0 0 12px rgba(16, 185, 129, 0.5)' : 'none'
                }}>
                  {factor.format(factor.homeValue)}
                </span>
              </div>
            </div>

            {/* Stats Row */}
            {factor.stats && factor.stats.length > 0 && (
              <div style={{
                fontSize: '0.688rem',
                color: 'var(--color-text-secondary)',
                marginBottom: '0.375rem',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                {factor.stats.map((stat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span>{stat.label}:</span>
                    {stat.away && stat.home ? (
                      <>
                        <span style={{ color: stat.winner === 'away' ? '#0EA5E9' : 'var(--color-text-secondary)' }}>
                          {stat.away}
                        </span>
                        <span style={{ color: 'var(--color-text-muted)' }}>vs</span>
                        <span style={{ color: stat.winner === 'home' ? '#10B981' : 'var(--color-text-secondary)' }}>
                          {stat.home}
                        </span>
                        {stat.suffix && <span style={{ color: 'var(--color-text-muted)' }}>{stat.suffix}</span>}
                        {stat.warning && <span>⚠️</span>}
                        {stat.winner && <span>{stat.winner === 'away' ? '🔥' : '✅'}</span>}
                      </>
                    ) : (
                      <span style={{ color: '#10B981', fontWeight: '600' }}>{stat.value}</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Key Insight - NEW */}
            {factor.keyInsight && (factor.advantage || factor.significance === 'moderate') && (
              <div style={{
                fontSize: '0.688rem',
                color: '#FCD34D',
                fontWeight: '700',
                padding: '0.5rem 0.75rem',
                background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.12) 0%, rgba(251, 191, 36, 0.08) 100%)',
                borderLeft: '2px solid rgba(212, 175, 55, 0.5)',
                borderRadius: '0 6px 6px 0',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                textShadow: '0 0 10px rgba(212, 175, 55, 0.3)'
              }}>
                <span style={{
                  fontSize: '0.813rem',
                  filter: 'drop-shadow(0 0 6px rgba(212, 175, 55, 0.6))'
                }}>⭐</span>
                <span style={{ flex: 1 }}>{factor.keyInsight}</span>
              </div>
            )}

            {/* Context - ENHANCED STORYTELLING */}
            {factor.context && (
              <div style={{
                fontSize: '0.688rem',
                color: 'rgba(16, 185, 129, 0.95)',
                fontStyle: 'italic',
                paddingLeft: '1.5rem',
                position: 'relative',
                marginTop: '0.25rem',
                padding: '0.5rem 0.75rem 0.5rem 1.75rem',
                background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.08) 0%, transparent 100%)',
                borderLeft: '2px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '0 4px 4px 0'
              }}>
                <span style={{
                  position: 'absolute',
                  left: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '0.75rem',
                  filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.5))'
                }}>→</span>
                {factor.context}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* HIDDEN FACTORS - POSSESSION & CONTROL */}
      <div style={{
        padding: isMobile ? '0.875rem 1rem' : '1.125rem 1.5rem',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(96, 165, 250, 0.08) 100%)',
        borderTop: '1px solid rgba(59, 130, 246, 0.25)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{
          fontSize: '0.813rem',
          fontWeight: '800',
          color: '#3B82F6',
          marginBottom: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          textShadow: '0 0 16px rgba(59, 130, 246, 0.5)',
          letterSpacing: '0.05em'
        }}>
          <span style={{
            fontSize: '1.063rem',
            filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.7))'
          }}>🔍</span>
          <span>CONTROL & POSSESSION</span>
        </div>

        {/* Compact metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Corsi */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.688rem', marginBottom: '0.25rem' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>📊 Corsi %</span>
              <span style={{ color: Math.abs(awayCorsi - homeCorsi) > 0.03 ? (awayCorsi > homeCorsi ? '#0EA5E9' : '#10B981') : 'var(--color-text-muted)' }}>
                {(awayCorsi * 100).toFixed(1)}% vs {(homeCorsi * 100).toFixed(1)}%
              </span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${awayCorsi * 100}%`,
                background: awayCorsi > homeCorsi ? '#0EA5E9' : 'rgba(14, 165, 233, 0.5)'
              }} />
            </div>
          </div>

          {/* Faceoffs */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.688rem', marginBottom: '0.25rem' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>🏒 Faceoffs</span>
              <span style={{ color: Math.abs(awayFaceoffPct - homeFaceoffPct) > 0.03 ? (awayFaceoffPct > homeFaceoffPct ? '#0EA5E9' : '#10B981') : 'var(--color-text-muted)' }}>
                {(awayFaceoffPct * 100).toFixed(1)}% vs {(homeFaceoffPct * 100).toFixed(1)}%
              </span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${awayFaceoffPct * 100}%`,
                background: awayFaceoffPct > homeFaceoffPct ? '#0EA5E9' : 'rgba(14, 165, 233, 0.5)'
              }} />
            </div>
          </div>

          {/* Shot Blocking */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.688rem', marginBottom: '0.25rem' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>🛡️ Shot Block %</span>
              <span style={{ color: Math.abs(awayBlockPct - homeBlockPct) > 2 ? (awayBlockPct > homeBlockPct ? '#0EA5E9' : '#10B981') : 'var(--color-text-muted)' }}>
                {awayBlockPct.toFixed(1)}% vs {homeBlockPct.toFixed(1)}%
              </span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${Math.min(100, awayBlockPct)}%`,
                background: awayBlockPct > homeBlockPct ? '#0EA5E9' : 'rgba(14, 165, 233, 0.5)'
              }} />
            </div>
          </div>
        </div>

        {/* Context - ENHANCED */}
        <div style={{
          fontSize: '0.688rem',
          color: 'rgba(59, 130, 246, 0.95)',
          fontStyle: 'italic',
          padding: '0.5rem 0.75rem 0.5rem 1.75rem',
          position: 'relative',
          marginTop: '0.5rem',
          background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.08) 0%, transparent 100%)',
          borderLeft: '2px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '0 4px 4px 0'
        }}>
          <span style={{
            position: 'absolute',
            left: '0.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '0.75rem',
            filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.5))'
          }}>→</span>
          {possessionEdgeTeam === awayTeam 
            ? `${awayTeam} dictates pace (${(awayCorsi * 100).toFixed(1)}% Corsi) = 5-7 more shots/game and sustained O-zone pressure`
            : possessionEdgeTeam === homeTeam 
            ? `${homeTeam} dictates pace (${(homeCorsi * 100).toFixed(1)}% Corsi) = 5-7 more shots/game and sustained O-zone pressure`
            : 'Even territorial battle - neither team controls the flow'}
        </div>
      </div>

      {/* EXPLOITABLE ANGLES */}
      {(turnoverExploitEdge > 0.15 || Math.abs(awayDZGiveaways - homeDZGiveaways) > 2) && (
        <div style={{
          padding: isMobile ? '0.75rem 1rem' : '1rem 1.25rem',
          background: 'rgba(239, 68, 68, 0.08)',
          borderTop: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            color: '#EF4444',
            marginBottom: '0.625rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem'
          }}>
            <span>💀</span>
            <span>EXPLOITABLE WEAKNESSES</span>
          </div>

          {awayDZGiveaways > 7 && (
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.688rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                <span style={{ color: '#EF4444', fontWeight: '700' }}>{awayTeam} turnovers:</span> {awayDZGiveaways.toFixed(1)}/gm ⚠️
              </div>
              <div style={{ fontSize: '0.625rem', color: 'rgba(239, 68, 68, 0.9)', fontStyle: 'italic', paddingLeft: '1rem' }}>
                → {homeTeam}'s forecheck generates {homeTakeaways.toFixed(1)} takeaways/gm
              </div>
            </div>
          )}

          {homeDZGiveaways > 7 && (
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.688rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                <span style={{ color: '#EF4444', fontWeight: '700' }}>{homeTeam} turnovers:</span> {homeDZGiveaways.toFixed(1)}/gm ⚠️
              </div>
              <div style={{ fontSize: '0.625rem', color: 'rgba(239, 68, 68, 0.9)', fontStyle: 'italic', paddingLeft: '1rem' }}>
                → {awayTeam}'s forecheck generates {awayTakeaways.toFixed(1)} takeaways/gm
              </div>
            </div>
          )}

          {/* Context - ENHANCED */}
          <div style={{
            fontSize: '0.688rem',
            color: 'rgba(239, 68, 68, 0.95)',
            fontStyle: 'italic',
            padding: '0.5rem 0.75rem 0.5rem 1.75rem',
            position: 'relative',
            marginTop: '0.5rem',
            background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.08) 0%, transparent 100%)',
            borderLeft: '2px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '0 4px 4px 0'
          }}>
            <span style={{
              position: 'absolute',
              left: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '0.75rem',
              filter: 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.5))'
            }}>→</span>
            {turnoverExploitTeam === awayTeam 
              ? `${awayTeam}'s aggressive forecheck (${awayTakeaways.toFixed(1)} takeaways/gm) turns ${homeTeam}'s ${homeDZGiveaways.toFixed(1)} giveaways into breakaways = +${turnoverExploitEdge.toFixed(2)}g`
              : `${homeTeam}'s aggressive forecheck (${homeTakeaways.toFixed(1)} takeaways/gm) turns ${awayTeam}'s ${awayDZGiveaways.toFixed(1)} giveaways into breakaways = +${turnoverExploitEdge.toFixed(2)}g`}
          </div>
        </div>
      )}

      {/* PDO REGRESSION - COMPACT */}
      {(Math.abs(awayPDO - 100) > 2 || Math.abs(homePDO - 100) > 2) && (
        <div style={{
          padding: isMobile ? '0.75rem 1rem' : '1rem 1.25rem',
          background: 'rgba(245, 158, 11, 0.08)',
          borderTop: '1px solid rgba(245, 158, 11, 0.2)'
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            color: '#F59E0B',
            marginBottom: '0.625rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem'
          }}>
            <span>🎲</span>
            <span>LUCK FACTOR</span>
            <span style={{ fontSize: '0.625rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>(Regression)</span>
          </div>

          {/* Compact PDO bars */}
          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.688rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                {awayTeam} {awayPDO.toFixed(1)}
              </span>
              <span style={{ fontSize: '0.625rem', color: awayPDO > 102 ? '#EF4444' : awayPDO < 98 ? '#10B981' : 'var(--color-text-muted)' }}>
                {awayPDO > 102 ? '🔥' : awayPDO < 98 ? '❄️' : '⚖️'} {awayRegressionImpact.toFixed(1)}g
              </span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(212, 175, 55, 0.5)', zIndex: 2 }} />
              <div style={{
                height: '100%',
                width: `${Math.min(100, ((awayPDO - 94) / 12) * 100)}%`,
                background: awayPDO > 102 ? '#EF4444' : awayPDO < 98 ? '#10B981' : '#6B7280',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.688rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                {homeTeam} {homePDO.toFixed(1)}
              </span>
              <span style={{ fontSize: '0.625rem', color: homePDO > 102 ? '#EF4444' : homePDO < 98 ? '#10B981' : 'var(--color-text-muted)' }}>
                {homePDO > 102 ? '🔥' : homePDO < 98 ? '❄️' : '⚖️'} {homeRegressionImpact.toFixed(1)}g
              </span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(212, 175, 55, 0.5)', zIndex: 2 }} />
              <div style={{
                height: '100%',
                width: `${Math.min(100, ((homePDO - 94) / 12) * 100)}%`,
                background: homePDO > 102 ? '#EF4444' : homePDO < 98 ? '#10B981' : '#6B7280',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>

          {/* Context - ENHANCED */}
          <div style={{
            fontSize: '0.688rem',
            color: 'rgba(245, 158, 11, 0.95)',
            fontStyle: 'italic',
            padding: '0.5rem 0.75rem 0.5rem 1.75rem',
            position: 'relative',
            background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.08) 0%, transparent 100%)',
            borderLeft: '2px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '0 4px 4px 0'
          }}>
            <span style={{
              position: 'absolute',
              left: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '0.75rem',
              filter: 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.5))'
            }}>→</span>
            {awayPDO > 102 && homePDO < 98 
              ? `${awayTeam}'s hot streak (${awayPDO.toFixed(1)} PDO = ${((awayPDO - 100) * 0.8).toFixed(0)}% above talent) collides with ${homeTeam}'s due bounce (${homePDO.toFixed(1)} = ${((100 - homePDO) * 0.8).toFixed(0)}% below talent)`
              : homePDO > 102 && awayPDO < 98
              ? `${homeTeam}'s hot streak (${homePDO.toFixed(1)} PDO = ${((homePDO - 100) * 0.8).toFixed(0)}% above talent) collides with ${awayTeam}'s due bounce (${awayPDO.toFixed(1)} = ${((100 - awayPDO) * 0.8).toFixed(0)}% below talent)`
              : awayPDO > 102
              ? `${awayTeam} shooting ${((awayPDO - 100) * 0.8).toFixed(0)}% above talent (${awayPDO.toFixed(1)} PDO) = ${Math.abs(awayRegressionImpact).toFixed(2)}g negative regression incoming`
              : homePDO > 102
              ? `${homeTeam} shooting ${((homePDO - 100) * 0.8).toFixed(0)}% above talent (${homePDO.toFixed(1)} PDO) = ${Math.abs(homeRegressionImpact).toFixed(2)}g negative regression incoming`
              : awayPDO < 98
              ? `${awayTeam} shooting ${((100 - awayPDO) * 0.8).toFixed(0)}% below talent (${awayPDO.toFixed(1)} PDO) = ${Math.abs(awayRegressionImpact).toFixed(2)}g positive bounce due`
              : `${homeTeam} shooting ${((100 - homePDO) * 0.8).toFixed(0)}% below talent (${homePDO.toFixed(1)} PDO) = ${Math.abs(homeRegressionImpact).toFixed(2)}g positive bounce due`}
          </div>
        </div>
      )}

      {/* THE EDGE - ENHANCED HERO SECTION - ALWAYS SHOW WHEN RELEVANT */}
      {(isLockedPick || recommendedPlay || totalEdge > 0.15 || edgeFavoredTeam) && (
        <div style={{
          padding: isMobile ? '1rem 1rem' : '1.25rem 1.5rem',
          background: isValuePlay 
            ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(251, 191, 36, 0.10) 50%, rgba(212, 175, 55, 0.08) 100%)' 
            : 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.10) 50%, rgba(16, 185, 129, 0.08) 100%)',
          borderTop: isValuePlay ? '2px solid rgba(212, 175, 55, 0.4)' : '2px solid rgba(16, 185, 129, 0.4)',
          boxShadow: isValuePlay 
            ? '0 -4px 20px rgba(212, 175, 55, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
            : '0 -4px 20px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle background pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          
          <div style={{
            fontSize: '0.875rem',
            fontWeight: '900',
            color: isLockedPick ? '#D4AF37' : isValuePlay ? '#D4AF37' : confidenceLevel === 'MINIMAL' || confidenceLevel === 'LOW' ? '#F59E0B' : '#10B981',
            marginBottom: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            textShadow: isLockedPick 
              ? '0 0 24px rgba(212, 175, 55, 0.6), 0 2px 4px rgba(0, 0, 0, 0.3)'
              : isValuePlay 
              ? '0 0 24px rgba(212, 175, 55, 0.6), 0 2px 4px rgba(0, 0, 0, 0.3)' 
              : '0 0 24px rgba(16, 185, 129, 0.6), 0 2px 4px rgba(0, 0, 0, 0.3)',
            letterSpacing: '0.08em',
            position: 'relative'
          }}>
            <span style={{
              fontSize: '1.25rem',
              filter: isLockedPick 
                ? 'drop-shadow(0 0 12px rgba(212, 175, 55, 0.8))'
                : isValuePlay 
                ? 'drop-shadow(0 0 12px rgba(212, 175, 55, 0.8))' 
                : 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.8))'
            }}>{isLockedPick ? '🔒' : '💡'}</span>
            <span>THE PLAY</span>
            {isLockedPick && (
              <span style={{
                fontSize: '0.688rem',
                padding: '0.25rem 0.625rem',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(251, 191, 36, 0.2) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                borderRadius: '6px',
                color: '#FCD34D',
                fontWeight: '800',
                textShadow: '0 0 12px rgba(212, 175, 55, 0.8)',
                boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                letterSpacing: '0.1em'
              }}>
                LOCKED
              </span>
            )}
            {!isLockedPick && isValuePlay && (
              <span style={{
                fontSize: '0.688rem',
                padding: '0.25rem 0.625rem',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(251, 191, 36, 0.2) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                borderRadius: '6px',
                color: '#FCD34D',
                fontWeight: '800',
                textShadow: '0 0 12px rgba(212, 175, 55, 0.8)',
                boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                letterSpacing: '0.1em'
              }}>
                VALUE
              </span>
            )}
            {!isLockedPick && !isValuePlay && (confidenceLevel === 'VERY_HIGH' || confidenceLevel === 'HIGH') && (
              <span style={{
                fontSize: '0.688rem',
                padding: '0.25rem 0.625rem',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.2) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.5)',
                borderRadius: '6px',
                color: '#10B981',
                fontWeight: '800',
                textShadow: '0 0 12px rgba(16, 185, 129, 0.8)',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                letterSpacing: '0.1em'
              }}>
                {confidenceLevel === 'VERY_HIGH' ? 'VERY HIGH' : 'HIGH'} CONFIDENCE
              </span>
            )}
            {!isLockedPick && !isValuePlay && (confidenceLevel === 'MINIMAL' || confidenceLevel === 'LOW') && (
              <span style={{
                fontSize: '0.688rem',
                padding: '0.25rem 0.625rem',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(251, 146, 60, 0.2) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.5)',
                borderRadius: '6px',
                color: '#F59E0B',
                fontWeight: '800',
                textShadow: '0 0 12px rgba(245, 158, 11, 0.8)',
                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                letterSpacing: '0.1em'
              }}>
                ⚠️ LOW CONFIDENCE
              </span>
            )}
          </div>

          {/* Edge bars - inline */}
          <div style={{ marginBottom: '0.75rem' }}>
            {offenseEdge > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.688rem', color: 'var(--color-text-secondary)', minWidth: '90px' }}>
                  {offenseEdgeTeam === recommendedPlay?.team ? '✅' : '○'} Offense
                </span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${(offenseEdge / totalEdge) * 100}%`, height: '100%', background: offenseEdgeTeam === recommendedPlay?.team ? '#10B981' : 'rgba(16, 185, 129, 0.5)' }} />
                </div>
                <span style={{ fontSize: '0.688rem', fontWeight: '700', color: offenseEdgeTeam === recommendedPlay?.team ? '#10B981' : 'var(--color-text-muted)', minWidth: '40px', textAlign: 'right' }}>
                  {offenseEdgeTeam === recommendedPlay?.team ? '+' : ''}{offenseEdge.toFixed(2)}
                </span>
              </div>
            )}
            {specialTeamsEdge > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.688rem', color: 'var(--color-text-secondary)', minWidth: '90px' }}>
                  {specialTeamsEdgeTeam === recommendedPlay?.team ? '✅' : '○'} Power Play
                </span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${(specialTeamsEdge / totalEdge) * 100}%`, height: '100%', background: specialTeamsEdgeTeam === recommendedPlay?.team ? '#10B981' : 'rgba(16, 185, 129, 0.5)' }} />
                </div>
                <span style={{ fontSize: '0.688rem', fontWeight: '700', color: specialTeamsEdgeTeam === recommendedPlay?.team ? '#10B981' : 'var(--color-text-muted)', minWidth: '40px', textAlign: 'right' }}>
                  {specialTeamsEdgeTeam === recommendedPlay?.team ? '+' : ''}{specialTeamsEdge.toFixed(2)}
                </span>
              </div>
            )}
            {goalieEdgeImpact > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.688rem', color: 'var(--color-text-secondary)', minWidth: '90px' }}>
                  {goalieEdgeTeam === recommendedPlay?.team ? '✅' : '○'} Goalie
                </span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${(goalieEdgeImpact / totalEdge) * 100}%`, height: '100%', background: goalieEdgeTeam === recommendedPlay?.team ? '#10B981' : 'rgba(16, 185, 129, 0.5)' }} />
                </div>
                <span style={{ fontSize: '0.688rem', fontWeight: '700', color: goalieEdgeTeam === recommendedPlay?.team ? '#10B981' : 'var(--color-text-muted)', minWidth: '40px', textAlign: 'right' }}>
                  {goalieEdgeTeam === recommendedPlay?.team ? '+' : ''}{goalieEdgeImpact.toFixed(2)}
                </span>
              </div>
            )}
            {regressionEdge > 0.1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.688rem', color: 'var(--color-text-secondary)', minWidth: '90px' }}>
                  {regressionEdgeTeam === recommendedPlay?.team ? '✅' : '○'} Regression
                </span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${(regressionEdge / totalEdge) * 100}%`, height: '100%', background: regressionEdgeTeam === recommendedPlay?.team ? '#10B981' : 'rgba(16, 185, 129, 0.5)' }} />
                </div>
                <span style={{ fontSize: '0.688rem', fontWeight: '700', color: regressionEdgeTeam === recommendedPlay?.team ? '#10B981' : 'var(--color-text-muted)', minWidth: '40px', textAlign: 'right' }}>
                  {regressionEdgeTeam === recommendedPlay?.team ? '+' : ''}{regressionEdge.toFixed(2)}
                </span>
              </div>
            )}
            {possessionEdge > 0.05 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.688rem', color: 'var(--color-text-secondary)', minWidth: '90px' }}>
                  {possessionEdgeTeam === recommendedPlay?.team ? '✅' : '○'} Possession
                </span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${(possessionEdge / totalEdge) * 100}%`, height: '100%', background: possessionEdgeTeam === recommendedPlay?.team ? '#10B981' : 'rgba(16, 185, 129, 0.5)' }} />
                </div>
                <span style={{ fontSize: '0.688rem', fontWeight: '700', color: possessionEdgeTeam === recommendedPlay?.team ? '#10B981' : 'var(--color-text-muted)', minWidth: '40px', textAlign: 'right' }}>
                  {possessionEdgeTeam === recommendedPlay?.team ? '+' : ''}{possessionEdge.toFixed(2)}
                </span>
              </div>
            )}
            {turnoverExploitEdge > 0.15 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.688rem', color: 'var(--color-text-secondary)', minWidth: '90px' }}>
                  {turnoverExploitTeam === recommendedPlay?.team ? '✅' : '○'} Turnovers
                </span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${(turnoverExploitEdge / totalEdge) * 100}%`, height: '100%', background: turnoverExploitTeam === recommendedPlay?.team ? '#10B981' : 'rgba(16, 185, 129, 0.5)' }} />
                </div>
                <span style={{ fontSize: '0.688rem', fontWeight: '700', color: turnoverExploitTeam === recommendedPlay?.team ? '#10B981' : 'var(--color-text-muted)', minWidth: '40px', textAlign: 'right' }}>
                  {turnoverExploitTeam === recommendedPlay?.team ? '+' : ''}{turnoverExploitEdge.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Net edge - HERO BOX */}
          <div style={{
            padding: '0.875rem 1rem',
            background: isValuePlay 
              ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(251, 191, 36, 0.15) 100%)' 
              : 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)',
            borderRadius: '10px',
            border: isValuePlay ? '2px solid rgba(212, 175, 55, 0.5)' : '2px solid rgba(16, 185, 129, 0.5)',
            marginBottom: '0.75rem',
            boxShadow: isValuePlay 
              ? '0 4px 20px rgba(212, 175, 55, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)' 
              : '0 4px 20px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Shine effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)',
              animation: 'shine 3s infinite'
            }} />
            
            {recommendedPlay ? (
              <div style={{ position: 'relative' }}>
                <div style={{
                  fontSize: '0.938rem',
                  fontWeight: '900',
                  color: isValuePlay ? '#FCD34D' : '#10B981',
                  marginBottom: '0.5rem',
                  textShadow: isValuePlay 
                    ? '0 0 20px rgba(212, 175, 55, 0.8), 0 2px 4px rgba(0, 0, 0, 0.4)' 
                    : '0 0 20px rgba(16, 185, 129, 0.8), 0 2px 4px rgba(0, 0, 0, 0.4)',
                  letterSpacing: '0.02em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{
                    fontSize: '1.125rem',
                    filter: isValuePlay 
                      ? 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.8))' 
                      : 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.8))'
                  }}>🎯</span>
                  <span>{recommendedPlay.team} {recommendedPlay.type === 'moneyline' ? 'ML' : recommendedPlay.type === 'spread' ? recommendedPlay.line : `${recommendedPlay.type.toUpperCase()} ${recommendedPlay.line}`}</span>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    background: isValuePlay 
                      ? 'rgba(212, 175, 55, 0.3)' 
                      : 'rgba(16, 185, 129, 0.3)',
                    borderRadius: '6px',
                    fontSize: '0.813rem',
                    border: isValuePlay 
                      ? '1px solid rgba(212, 175, 55, 0.5)' 
                      : '1px solid rgba(16, 185, 129, 0.5)'
                  }}>
                    ({recommendedPlay.odds > 0 ? '+' : ''}{recommendedPlay.odds})
                  </span>
                </div>
                <div style={{
                  fontSize: '0.688rem',
                  color: 'var(--color-text-secondary)',
                  fontWeight: '600',
                  opacity: 0.9,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem'
                }}>
                  TYPE: {isValuePlay ? 'Value Play (Market Mispricing)' : 'Quality Play (Analytical Dominance)'}
                </div>
                
                {/* KEY FACTORS */}
                <div style={{
                  fontSize: '0.688rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: '1.6',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ fontWeight: '700', marginBottom: '0.375rem', color: 'rgba(255, 255, 255, 0.9)' }}>KEY FACTORS:</div>
                  {isValuePlay ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div>• Market undervalues {recommendedPlay.team} at {recommendedPlay.odds > 0 ? '+' : ''}{recommendedPlay.odds}</div>
                      {Math.abs(regressionEdge) > 0.1 && (
                        <div>• {edgeFavoredTeam} shooting {regressionEdge > 0 ? 'above' : 'below'} talent (regression risk)</div>
                      )}
                      {possessionEdgeTeam === recommendedPlay.team && possessionEdge > 0.05 && (
                        <div>• {recommendedPlay.team} controls possession ({(possessionEdgeTeam === awayTeam ? awayCorsi : homeCorsi).toFixed(1)}% Corsi)</div>
                      )}
                      {offenseEdgeTeam !== recommendedPlay.team && offenseEdge > 0.1 && (
                        <div>• {edgeFavoredTeam} has +{offenseEdge.toFixed(2)}g offensive edge</div>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {offenseEdgeTeam === recommendedPlay.team && offenseEdge > 0.05 && (
                        <div>• Superior offense (+{offenseEdge.toFixed(2)}g advantage)</div>
                      )}
                      {specialTeamsEdgeTeam === recommendedPlay.team && specialTeamsEdge > 0.05 && (
                        <div>• Elite special teams (+{specialTeamsEdge.toFixed(2)}g advantage)</div>
                      )}
                      {goalieEdgeTeam === recommendedPlay.team && goalieEdgeImpact > 0.03 && (
                        <div>• Superior goaltending (+{goalieEdgeImpact.toFixed(2)}g advantage)</div>
                      )}
                      <div>• Total analytical edge: +{totalEdge.toFixed(2)} goals</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // No recommendation - show neutral analytical edge
              <div style={{ position: 'relative' }}>
                <div style={{
                  fontSize: '0.938rem',
                  fontWeight: '900',
                  color: '#10B981',
                  textShadow: '0 0 20px rgba(16, 185, 129, 0.8)',
                  marginBottom: '0.5rem'
                }}>
                  {edgeFavoredTeam} +{totalEdge.toFixed(2)} goals
                </div>
                <div style={{
                  fontSize: '0.688rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: '600'
                }}>
                  Analytical favorite based on matchup factors
                </div>
              </div>
            )}
          </div>

          {/* The Story - COMPLETE NARRATIVE ARC */}
          <div style={{
            fontSize: '0.75rem',
            color: isLockedPick ? 'rgba(212, 175, 55, 0.95)' : isValuePlay ? 'rgba(212, 175, 55, 0.95)' : confidenceLevel === 'MINIMAL' || confidenceLevel === 'LOW' ? 'rgba(245, 158, 11, 0.95)' : 'rgba(16, 185, 129, 0.95)',
            lineHeight: '1.5',
            position: 'relative'
          }}>
            {(() => {
              // LOCKED PICK NARRATIVE
              if (isLockedPick && lockedBet) {
                const betDetails = lockedBet.bet || lockedBet;
                const pickTeam = betDetails.pick ? betDetails.pick.split(' ')[0] : betDetails.team;
                const odds = betDetails.odds;
                const lockedTime = lockedBet.firstRecommendedAt || lockedBet.timestamp;
                
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{
                      fontSize: '0.938rem',
                      fontWeight: '900',
                      color: '#FCD34D',
                      textShadow: '0 0 20px rgba(212, 175, 55, 0.8)',
                      marginBottom: '0.5rem'
                    }}>
                      🔒 {pickTeam} {odds > 0 ? '+' : ''}{odds}
                    </div>
                    
                    <div style={{ paddingLeft: '1rem', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, fontWeight: '800', color: '#FCD34D' }}>📍</span>
                      <span style={{ fontWeight: '700', opacity: 0.9 }}>RECOMMENDATION LOCKED</span>
                    </div>
                    
                    <div style={{ paddingLeft: '1rem', position: 'relative', fontSize: '0.688rem', opacity: 0.85, lineHeight: '1.4' }}>
                      This pick was identified when odds offered strong expected value. Line may have moved since lock, but original analysis remains valid.
                    </div>
                    
                    <div style={{
                      marginTop: '0.5rem',
                      padding: '0.75rem 1rem',
                      background: 'rgba(212, 175, 55, 0.15)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '8px'
                    }}>
                      <div style={{ fontSize: '0.688rem', fontWeight: '700', marginBottom: '0.375rem', color: '#FCD34D' }}>
                        💡 VIEW FULL ANALYSIS
                      </div>
                      <div style={{ fontSize: '0.625rem', opacity: 0.8 }}>
                        Check "Hot Takes" section above for complete matchup breakdown and betting rationale.
                      </div>
                    </div>
                    
                    <div style={{ paddingLeft: '1rem', position: 'relative', fontSize: '0.625rem', opacity: 0.7, fontStyle: 'italic' }}>
                      <span style={{ position: 'absolute', left: 0 }}>⚠️</span>
                      <span style={{ paddingLeft: '0.25rem' }}>Always check current odds at your sportsbook before placing bet</span>
                    </div>
                  </div>
                );
              }

              // VALUE PLAY NARRATIVE
              if (isValuePlay && recommendedPlay) {
                // VALUE PLAY: 3-ACT STRUCTURE
                const winningFactors = [];
                if (possessionEdgeTeam === recommendedPlay.team) winningFactors.push('possession');
                if (turnoverExploitTeam === recommendedPlay.team) winningFactors.push('turnover exploitation');
                if (regressionEdgeTeam === recommendedPlay.team) winningFactors.push('regression');
                
                const losingFactors = [];
                if (offenseEdge > 0 && offenseEdgeTeam !== recommendedPlay.team) losingFactors.push(`offense (-${offenseEdge.toFixed(2)}g)`);
                if (specialTeamsEdge > 0 && specialTeamsEdgeTeam !== recommendedPlay.team) losingFactors.push(`PP (-${specialTeamsEdge.toFixed(2)}g)`);
                if (goalieEdgeImpact > 0 && goalieEdgeTeam !== recommendedPlay.team) losingFactors.push(`goalie (-${goalieEdgeImpact.toFixed(2)}g)`);
                
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    <div style={{ paddingLeft: '1rem', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, fontWeight: '800', color: isValuePlay ? '#FCD34D' : '#10B981' }}>📊</span>
                      <span style={{ fontWeight: '600', opacity: 0.8 }}>SETUP: </span>
                      {losingFactors.length > 0 
                        ? `${edgeFavoredTeam} has analytical edges in ${losingFactors.join(', ')}`
                        : `Close matchup with minor edges for ${edgeFavoredTeam}`}
                    </div>
                    <div style={{ paddingLeft: '1rem', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, fontWeight: '800', color: isValuePlay ? '#FCD34D' : '#10B981' }}>⚔️</span>
                      <span style={{ fontWeight: '600', opacity: 0.8 }}>BUT: </span>
                      {winningFactors.length > 0
                        ? `${recommendedPlay.team} dominates ${winningFactors.join(' and ')} (+${(possessionEdge + turnoverExploitEdge + (regressionEdgeTeam === recommendedPlay.team ? regressionEdge : 0)).toFixed(2)}g)`
                        : `${recommendedPlay.team} at +${recommendedPlay.odds} offers 2-3% more value than ${edgeFavoredTeam}'s -${Math.abs(recommendedPlay.odds - 100)}`}
                    </div>
                    <div style={{ paddingLeft: '1rem', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, fontWeight: '800', color: isValuePlay ? '#FCD34D' : '#10B981' }}>💰</span>
                      <span style={{ fontWeight: '600', opacity: 0.8 }}>VALUE: </span>
                      Market overprices {edgeFavoredTeam}'s advantages. {recommendedPlay.team}'s hidden edges create +{(bestEdge.evPercent * 0.1).toFixed(2)}g of value at +{recommendedPlay.odds}.
                    </div>
                  </div>
                );
              } else {
                // QUALITY PLAY: CONFIDENCE-BASED NARRATIVE
                const advantages = [];
                if (offenseEdge > 0) advantages.push({ name: 'offense', value: offenseEdge, team: offenseEdgeTeam });
                if (specialTeamsEdge > 0) advantages.push({ name: 'PP', value: specialTeamsEdge, team: specialTeamsEdgeTeam });
                if (goalieEdgeImpact > 0) advantages.push({ name: 'goalie', value: goalieEdgeImpact, team: goalieEdgeTeam });
                if (regressionEdge > 0.1) advantages.push({ name: 'regression', value: regressionEdge, team: regressionEdgeTeam });
                if (possessionEdge > 0.05) advantages.push({ name: 'possession', value: possessionEdge, team: possessionEdgeTeam });
                
                const teamAdvantages = advantages.filter(a => a.team === (recommendedPlay?.team || edgeFavoredTeam));
                
                // VERY HIGH / HIGH CONFIDENCE
                if (confidenceLevel === 'VERY_HIGH' || confidenceLevel === 'HIGH') {
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      <div style={{ paddingLeft: '1rem', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, fontWeight: '800', color: '#10B981' }}>🎯</span>
                        <span style={{ fontWeight: '700', color: '#10B981' }}>{recommendedPlay?.team || edgeFavoredTeam} DOMINATES {teamAdvantages.length} KEY FACTORS:</span>
                      </div>
                      {teamAdvantages.map((adv, i) => (
                        <div key={i} style={{ paddingLeft: '1rem', position: 'relative', fontSize: '0.688rem' }}>
                          <span style={{ position: 'absolute', left: 0, opacity: 0.7 }}>•</span>
                          <span style={{ paddingLeft: '0.25rem', opacity: 0.9 }}>
                            {adv.name.toUpperCase()} (+{adv.value.toFixed(2)}g) - {
                              adv.name === 'offense' ? 'Superior shot quality and volume' :
                              adv.name === 'PP' ? 'Elite power play vs weak PK' :
                              adv.name === 'goalie' ? 'Netminder stops more shots' :
                              adv.name === 'regression' ? 'PDO due for correction' :
                              'Controls pace and possession'
                            }
                          </span>
                        </div>
                      ))}
                      <div style={{ paddingLeft: '1rem', marginTop: '0.25rem', fontSize: '0.688rem', fontWeight: '700', color: '#10B981' }}>
                        Total Edge: +{totalEdge.toFixed(2)} goals | Confidence: {confidenceLevel === 'VERY_HIGH' ? 'VERY HIGH ✅✅' : 'HIGH ✅'}
                      </div>
                    </div>
                  );
                }
                
                // MODERATE CONFIDENCE
                if (confidenceLevel === 'MODERATE') {
                  if (specialTeamsEdge > 0.15) {
                    return (
                      <div style={{ paddingLeft: '1rem', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, fontWeight: '800', color: '#10B981' }}>🔥</span>
                        <span style={{ fontWeight: '700' }}>PP dominance is the key factor:</span>
                        <span style={{ opacity: 0.9 }}> {specialTeamsEdgeTeam}'s elite power play (+{specialTeamsEdge.toFixed(2)}g advantage) should capitalize on weak PK. Expected impact: +{(specialTeamsEdge * 0.8).toFixed(2)} goals.</span>
                      </div>
                    );
                  }
                  return (
                    <div style={{ paddingLeft: '1rem', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, fontWeight: '800', color: '#10B981' }}>✅</span>
                      <span style={{ fontWeight: '700' }}>{recommendedPlay?.team || edgeFavoredTeam} has clear advantages:</span>
                      <span style={{ opacity: 0.9 }}> {teamAdvantages.map(a => `${a.name} (+${a.value.toFixed(2)}g)`).join(', ')}. Total edge: +{totalEdge.toFixed(2)} goals.</span>
                    </div>
                  );
                }
                
                // LOW / MINIMAL CONFIDENCE
                if (confidenceLevel === 'LOW' || confidenceLevel === 'MINIMAL') {
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      <div style={{ paddingLeft: '1rem', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, fontWeight: '800', color: '#F59E0B' }}>⚠️</span>
                        <span style={{ fontWeight: '700', color: '#F59E0B' }}>CLOSE MATCHUP - LOW CONFIDENCE</span>
                      </div>
                      <div style={{ paddingLeft: '1rem', fontSize: '0.688rem', opacity: 0.9 }}>
                        {teamAdvantages.length > 0 
                          ? `${recommendedPlay?.team || edgeFavoredTeam} has slim advantages in ${teamAdvantages.map(a => a.name).join(' and ')} (+${totalEdge.toFixed(2)}g total).`
                          : `Evenly matched teams with minimal analytical edge (+${totalEdge.toFixed(2)}g).`}
                      </div>
                      <div style={{
                        marginTop: '0.25rem',
                        padding: '0.625rem 0.875rem',
                        background: 'rgba(245, 158, 11, 0.15)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '6px',
                        fontSize: '0.688rem'
                      }}>
                        <div style={{ fontWeight: '700', color: '#F59E0B', marginBottom: '0.25rem' }}>⚠️ CAUTION</div>
                        <div style={{ opacity: 0.85 }}>
                          This is a low-confidence play with slim margins. Consider:
                          <ul style={{ marginTop: '0.375rem', marginLeft: '1rem', marginBottom: 0 }}>
                            <li>Smaller unit size (0.5u or less)</li>
                            <li>Passing on this game entirely</li>
                            <li>Waiting for better spots</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                // FALLBACK (shouldn't reach here)
                return (
                  <div style={{ paddingLeft: '1rem', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, fontWeight: '800', color: '#10B981' }}>⚖️</span>
                    <span style={{ fontWeight: '700' }}>Moderate edge:</span>
                    <span style={{ opacity: 0.9 }}> {recommendedPlay?.team || edgeFavoredTeam} has advantages totaling +{totalEdge.toFixed(2)} goals.</span>
                  </div>
                );
              }
            })()}
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default NHLMatchupIntelligence;
