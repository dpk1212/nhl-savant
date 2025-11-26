/**
 * Basketball Prediction Grading
 * Grades our predictions against actual game results
 */

/**
 * Grade a basketball prediction
 * @param {object} prediction - Our prediction with ensemble model
 * @param {object} liveScore - Live score data from NCAA API
 * @returns {object} - Grade object with letter grade and details
 */
export function gradePrediction(prediction, liveScore) {
  if (!liveScore || liveScore.status !== 'final') {
    return null; // Can only grade completed games
  }
  
  // ROBUSTNESS: Validate scores
  const awayScore = liveScore.awayScore;
  const homeScore = liveScore.homeScore;
  
  if (typeof awayScore !== 'number' || typeof homeScore !== 'number') {
    console.error(`❌ Invalid scores in gradePrediction: away=${awayScore}, home=${homeScore}`);
    return null;
  }
  
  if (awayScore < 0 || homeScore < 0) {
    console.error(`❌ Negative scores in gradePrediction: away=${awayScore}, home=${homeScore}`);
    return null;
  }
  
  const actualWinner = awayScore > homeScore ? 'away' : 'home';
  const actualMargin = Math.abs(awayScore - homeScore);
  
  // Get our prediction
  const predictedAwayScore = prediction.dratings?.awayScore || prediction.haslametrics?.awayScore || 0;
  const predictedHomeScore = prediction.dratings?.homeScore || prediction.haslametrics?.homeScore || 0;
  const predictedWinner = predictedAwayScore > predictedHomeScore ? 'away' : 'home';
  const predictedTotal = predictedAwayScore + predictedHomeScore;
  const actualTotal = awayScore + homeScore;
  
  // Removed verbose logging - grade silently
  
  // Calculate errors
  const winnerCorrect = predictedWinner === actualWinner;
  const scoreError = Math.abs((predictedAwayScore - awayScore) + (predictedHomeScore - homeScore)) / 2;
  const totalError = Math.abs(predictedTotal - actualTotal);
  
  // Grade based on accuracy
  let grade, gradePoints;
  
  if (winnerCorrect && scoreError <= 5) {
    grade = 'A+';
    gradePoints = 4.3;
  } else if (winnerCorrect && scoreError <= 10) {
    grade = 'A';
    gradePoints = 4.0;
  } else if (winnerCorrect && scoreError <= 15) {
    grade = 'B+';
    gradePoints = 3.3;
  } else if (winnerCorrect) {
    grade = 'B';
    gradePoints = 3.0;
  } else if (actualMargin <= 5) {
    // Wrong winner but close game
    grade = 'C';
    gradePoints = 2.0;
  } else if (actualMargin <= 10) {
    grade = 'D';
    gradePoints = 1.0;
  } else {
    grade = 'F';
    gradePoints = 0.0;
  }
  
  return {
    grade,
    gradePoints,
    winnerCorrect,
    scoreError: Math.round(scoreError * 10) / 10,
    totalError: Math.round(totalError * 10) / 10,
    predicted: {
      awayScore: Math.round(predictedAwayScore * 10) / 10,
      homeScore: Math.round(predictedHomeScore * 10) / 10,
      winner: predictedWinner,
      total: Math.round(predictedTotal * 10) / 10
    },
    actual: {
      awayScore,
      homeScore,
      winner: actualWinner,
      total: actualTotal,
      margin: actualMargin
    }
  };
}

/**
 * Get grade color for UI
 * @param {string} grade - Letter grade
 * @returns {object} - Color object with background and text colors
 */
export function getGradeColor(grade) {
  const colors = {
    'A+': { bg: '#10b981', text: '#ffffff', glow: 'rgba(16, 185, 129, 0.3)' },
    'A': { bg: '#22c55e', text: '#ffffff', glow: 'rgba(34, 197, 94, 0.3)' },
    'B+': { bg: '#84cc16', text: '#ffffff', glow: 'rgba(132, 204, 22, 0.3)' },
    'B': { bg: '#eab308', text: '#ffffff', glow: 'rgba(234, 179, 8, 0.3)' },
    'C': { bg: '#f97316', text: '#ffffff', glow: 'rgba(249, 115, 22, 0.3)' },
    'D': { bg: '#ef4444', text: '#ffffff', glow: 'rgba(239, 68, 68, 0.3)' },
    'F': { bg: '#dc2626', text: '#ffffff', glow: 'rgba(220, 38, 38, 0.3)' }
  };
  
  return colors[grade] || colors['F'];
}

/**
 * Calculate overall grading statistics
 * @param {Array} gradedGames - Array of games with grades
 * @returns {object} - Statistics object
 */
export function calculateGradingStats(gradedGames) {
  const graded = gradedGames.filter(g => g.grade);
  
  if (graded.length === 0) {
    return {
      totalGames: 0,
      avgGrade: 0,
      winnerAccuracy: 0,
      avgScoreError: 0,
      gradeDistribution: {}
    };
  }
  
  const avgGrade = graded.reduce((sum, g) => sum + g.grade.gradePoints, 0) / graded.length;
  const winnerCorrect = graded.filter(g => g.grade.winnerCorrect).length;
  const avgScoreError = graded.reduce((sum, g) => sum + g.grade.scoreError, 0) / graded.length;
  
  // Count grade distribution
  const distribution = {};
  graded.forEach(g => {
    const grade = g.grade.grade;
    distribution[grade] = (distribution[grade] || 0) + 1;
  });
  
  return {
    totalGames: graded.length,
    avgGrade: Math.round(avgGrade * 100) / 100,
    winnerAccuracy: Math.round((winnerCorrect / graded.length) * 100 * 10) / 10,
    avgScoreError: Math.round(avgScoreError * 10) / 10,
    gradeDistribution: distribution
  };
}

/**
 * Format game status for display
 * @param {string} status - Game status from NCAA API
 * @returns {object} - Display object with icon and text
 */
export function formatGameStatus(status) {
  const statusMap = {
    'pre': { icon: '🕐', text: 'Scheduled', color: '#64748b' },
    'live': { icon: '🔴', text: 'LIVE', color: '#ef4444' },
    'final': { icon: '✅', text: 'Final', color: '#10b981' }
  };
  
  return statusMap[status] || statusMap['pre'];
}


