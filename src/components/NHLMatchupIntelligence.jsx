/**
 * NHL Matchup Intelligence Component - BALANCED SMART CONTEXT
 * Shows why each team could win without bias or recommendations
 * Displays team strengths in offense, defense, special teams, goaltending, possession, and exploitation opportunities
 */

const NHLMatchupIntelligence = ({ 
  game, 
  dataProcessor, 
  statsAnalyzer,
  bestEdge,
  firebaseBets,
  awayGoalie,
  homeGoalie,
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

  // Goalie data (now passed as props)
  const awayGSAE = awayGoalie?.gsae ? parseFloat(awayGoalie.gsae) : 0;
  const homeGSAE = homeGoalie?.gsae ? parseFloat(homeGoalie.gsae) : 0;
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

  // Get best bet recommendation
  const recommendedPlay = bestEdge && bestEdge.evPercent > 5 ? bestEdge : null;
  
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

      {/* THE MATCHUP - BALANCED SMART CONTEXT - ALWAYS SHOW */}
      <div style={{
            padding: '0.875rem 1rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
            borderRadius: '10px',
            border: '2px solid rgba(99, 102, 241, 0.3)',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
              animation: 'shine 3s infinite'
            }} />
            
            {/* Section Title */}
            <div style={{
              fontSize: '0.813rem',
              fontWeight: '800',
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              position: 'relative',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}>
              💡 THE MATCHUP
            </div>

            {/* WHY AWAY TEAM COULD WIN */}
            <div style={{
              marginBottom: '0.75rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                fontSize: '0.688rem',
                fontWeight: '700',
                color: 'rgba(96, 165, 250, 0.95)',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                🔵 WHY {awayTeam} COULD WIN:
              </div>
              <div style={{
                fontSize: '0.688rem',
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: '1.6',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.375rem'
              }}>
                {offenseEdgeTeam === awayTeam && offenseEdge > 0.05 && (
                  <div>• Superior shot quality ({awayXGF.toFixed(2)} xGF vs {awayXGA.toFixed(2)} xGA)</div>
                )}
                {specialTeamsEdgeTeam === awayTeam && specialTeamsEdge > 0.05 && (
                  <div>• Elite PP ({awayPPScore.toFixed(2)} HD xG, ranked #{awayPPRank})</div>
                )}
                {goalieEdgeTeam === awayTeam && goalieEdgeImpact > 0.03 && (
                  <div>• Goalie advantage ({awayGoalie?.name}: {awayGSAE > 0 ? '+' : ''}{awayGSAE.toFixed(2)} GSAE)</div>
                )}
                {possessionEdgeTeam === awayTeam && possessionEdge > 0.05 && (
                  <div>• Controls possession ({awayCorsi.toFixed(1)}% Corsi)</div>
                )}
                {regressionEdgeTeam === awayTeam && regressionEdge > 0.1 && (
                  <div>• {homeTeam} due for regression ({homePDO.toFixed(1)} PDO = -{Math.abs(homeRegressionImpact).toFixed(2)}g)</div>
                )}
                {turnoverExploitTeam === awayTeam && turnoverExploitEdge > 0.15 && (
                  <div>• Exploits turnovers ({awayTakeaways.toFixed(1)} takeaways vs {homeDZGiveaways.toFixed(1)} giveaways)</div>
                )}
                {awayBlockPct > homeBlockPct + 2 && (
                  <div>• Strong shot blocking ({awayBlockPct.toFixed(1)}% blocked)</div>
                )}
                {/* If no major edges, show baseline strengths */}
                {offenseEdgeTeam !== awayTeam && specialTeamsEdgeTeam !== awayTeam && goalieEdgeTeam !== awayTeam && (
                  <>
                    <div>• Solid offense ({awayXGF.toFixed(2)} xGF/gm)</div>
                    {awayCorsi > 0.5 && <div>• Positive possession ({awayCorsi.toFixed(1)}% Corsi)</div>}
                  </>
                )}
              </div>
            </div>

            {/* WHY HOME TEAM COULD WIN */}
            <div>
              <div style={{
                fontSize: '0.688rem',
                fontWeight: '700',
                color: 'rgba(251, 146, 60, 0.95)',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                🟠 WHY {homeTeam} COULD WIN:
              </div>
              <div style={{
                fontSize: '0.688rem',
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: '1.6',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.375rem'
              }}>
                {offenseEdgeTeam === homeTeam && offenseEdge > 0.05 && (
                  <div>• Superior shot quality ({homeXGF.toFixed(2)} xGF vs {homeXGA.toFixed(2)} xGA)</div>
                )}
                {specialTeamsEdgeTeam === homeTeam && specialTeamsEdge > 0.05 && (
                  <div>• Elite PP ({homePPScore.toFixed(2)} HD xG, ranked #{homePPRank})</div>
                )}
                {goalieEdgeTeam === homeTeam && goalieEdgeImpact > 0.03 && (
                  <div>• Goalie advantage ({homeGoalie?.name}: {homeGSAE > 0 ? '+' : ''}{homeGSAE.toFixed(2)} GSAE)</div>
                )}
                {possessionEdgeTeam === homeTeam && possessionEdge > 0.05 && (
                  <div>• Controls possession ({homeCorsi.toFixed(1)}% Corsi)</div>
                )}
                {regressionEdgeTeam === homeTeam && regressionEdge > 0.1 && (
                  <div>• {awayTeam} due for regression ({awayPDO.toFixed(1)} PDO = -{Math.abs(awayRegressionImpact).toFixed(2)}g)</div>
                )}
                {turnoverExploitTeam === homeTeam && turnoverExploitEdge > 0.15 && (
                  <div>• Exploits turnovers ({homeTakeaways.toFixed(1)} takeaways vs {awayDZGiveaways.toFixed(1)} giveaways)</div>
                )}
                {homeBlockPct > awayBlockPct + 2 && (
                  <div>• Strong shot blocking ({homeBlockPct.toFixed(1)}% blocked)</div>
                )}
                {/* If no major edges, show baseline strengths */}
                {offenseEdgeTeam !== homeTeam && specialTeamsEdgeTeam !== homeTeam && goalieEdgeTeam !== homeTeam && (
                  <>
                    <div>• Solid offense ({homeXGF.toFixed(2)} xGF/gm)</div>
                    {homeCorsi > 0.5 && <div>• Positive possession ({homeCorsi.toFixed(1)}% Corsi)</div>}
                  </>
                )}
              </div>
            </div>
          </div>
      </div>
    </>
  );
};

export default NHLMatchupIntelligence;
