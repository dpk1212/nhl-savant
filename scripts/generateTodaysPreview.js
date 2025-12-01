/**
 * Generate Today's Picks Preview JSON
 * Runs daily after bet generation
 * Creates public preview file without revealing specific teams/odds
 */

import fs from 'fs';
import Papa from 'papaparse';

async function generatePreview() {
  try {
    console.log('🔍 Generating today\'s picks preview...');

    const today = new Date().toISOString().split('T')[0];
    
    // Load NHL bets
    let nhlPicks = [];
    try {
      const nhlPath = './public/data/picks-nhl-2025-26.csv';
      if (fs.existsSync(nhlPath)) {
        const nhlCsv = fs.readFileSync(nhlPath, 'utf8');
        const parsed = Papa.parse(nhlCsv, { header: true, skipEmptyLines: true });
        nhlPicks = parsed.data.filter(bet => bet.date === today && bet.status === 'pending');
      }
    } catch (err) {
      console.warn('Could not load NHL picks:', err.message);
    }

    // Load CBB bets
    let cbbPicks = [];
    try {
      const cbbPath = './public/data/picks-cbb-2025-26.csv';
      if (fs.existsSync(cbbPath)) {
        const cbbCsv = fs.readFileSync(cbbPath, 'utf8');
        const parsed = Papa.parse(cbbCsv, { header: true, skipEmptyLines: true });
        cbbPicks = parsed.data.filter(bet => bet.date === today && bet.status === 'pending');
      }
    } catch (err) {
      console.warn('Could not load CBB picks:', err.message);
    }

    // Load NHL odds to count games
    let nhlGames = [];
    try {
      const oddsPath = './public/odds_money.md';
      if (fs.existsSync(oddsPath)) {
        const oddsContent = fs.readFileSync(oddsPath, 'utf8');
        const lines = oddsContent.split('\n').filter(l => l.trim() && l.includes('|'));
        nhlGames = lines.slice(1); // Skip header
      }
    } catch (err) {
      console.warn('Could not load NHL games:', err.message);
    }

    // Load CBB odds to count games
    let cbbGames = [];
    try {
      const cbbOddsPath = './public/basketball_odds.md';
      if (fs.existsSync(cbbOddsPath)) {
        const oddsContent = fs.readFileSync(cbbOddsPath, 'utf8');
        const lines = oddsContent.split('\n').filter(l => l.trim() && l.includes('|'));
        cbbGames = lines.slice(1); // Skip header
      }
    } catch (err) {
      console.warn('Could not load CBB games:', err.message);
    }

    // Calculate NHL stats
    const nhlQualityPicks = nhlPicks.filter(p => {
      const grade = p.qualityGrade || p.grade;
      return ['A+', 'A', 'A-'].includes(grade);
    });

    const nhlAvgEV = nhlQualityPicks.length > 0
      ? nhlQualityPicks.reduce((sum, p) => sum + (parseFloat(p.ev) || 0), 0) / nhlQualityPicks.length
      : 0;

    const nhlBestGrade = nhlPicks.length > 0
      ? nhlPicks.reduce((best, p) => {
          const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-'];
          const currentIdx = grades.indexOf(p.qualityGrade || p.grade);
          const bestIdx = grades.indexOf(best);
          return currentIdx !== -1 && (bestIdx === -1 || currentIdx < bestIdx) 
            ? (p.qualityGrade || p.grade) 
            : best;
        }, '')
      : 'N/A';

    // Generate NHL top matchup preview (generic, no team names)
    let nhlTopMatchup = 'Check back soon for today\'s analysis';
    if (nhlQualityPicks.length > 0) {
      const topPick = nhlQualityPicks[0];
      const evValue = parseFloat(topPick.ev) || 0;
      if (evValue > 6) {
        nhlTopMatchup = 'Elite xG team vs struggling goalie (negative GSAE) with PDO regression';
      } else if (evValue > 4) {
        nhlTopMatchup = 'Strong xG advantage with rest differential and goalie mismatch';
      } else {
        nhlTopMatchup = 'Quality underlying metrics vs market inefficiency';
      }
    }

    // Calculate CBB stats
    const cbbQualityPicks = cbbPicks.filter(p => {
      const grade = p.qualityGrade || p.grade;
      return ['A+', 'A', 'A-'].includes(grade);
    });

    const cbbAvgEV = cbbQualityPicks.length > 0
      ? cbbQualityPicks.reduce((sum, p) => sum + (parseFloat(p.ev) || 0), 0) / cbbQualityPicks.length
      : 0;

    const cbbBestGrade = cbbPicks.length > 0
      ? cbbPicks.reduce((best, p) => {
          const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-'];
          const currentIdx = grades.indexOf(p.qualityGrade || p.grade);
          const bestIdx = grades.indexOf(best);
          return currentIdx !== -1 && (bestIdx === -1 || currentIdx < bestIdx) 
            ? (p.qualityGrade || p.grade) 
            : best;
        }, '')
      : 'N/A';

    // Generate CBB top matchup preview (generic, no team names)
    let cbbTopMatchup = 'Check back soon for today\'s analysis';
    if (cbbQualityPicks.length > 0) {
      const topPick = cbbQualityPicks[0];
      const evValue = parseFloat(topPick.ev) || 0;
      if (evValue > 8) {
        cbbTopMatchup = 'Top-10 efficiency rating vs bottom-50 defense in pace-up environment';
      } else if (evValue > 5) {
        cbbTopMatchup = 'Strong efficiency advantage with home court and matchup edge';
      } else {
        cbbTopMatchup = 'Quality efficiency differential vs market mispricing';
      }
    }

    const preview = {
      date: today,
      nhl: {
        totalGames: Math.floor(nhlGames.length / 2), // Divide by 2 for matchups
        qualityPicks: nhlQualityPicks.length,
        averageEV: Math.round(nhlAvgEV * 10) / 10,
        bestGradeAvailable: nhlBestGrade,
        topMatchupPreview: nhlTopMatchup
      },
      cbb: {
        totalGames: Math.floor(cbbGames.length / 2), // Divide by 2 for matchups
        qualityPicks: cbbQualityPicks.length,
        averageEV: Math.round(cbbAvgEV * 10) / 10,
        bestGradeAvailable: cbbBestGrade,
        topMatchupPreview: cbbTopMatchup
      },
      lastUpdated: new Date().toISOString()
    };

    // Write to public/data directory
    const outputDir = './public/data';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = `${outputDir}/todays-picks-preview.json`;
    fs.writeFileSync(outputPath, JSON.stringify(preview, null, 2));

    console.log('✅ Preview generated successfully!');
    console.log(`   NHL: ${preview.nhl.qualityPicks} quality picks from ${preview.nhl.totalGames} games`);
    console.log(`   CBB: ${preview.cbb.qualityPicks} quality picks from ${preview.cbb.totalGames} games`);
    console.log(`   Saved to: ${outputPath}`);

  } catch (error) {
    console.error('❌ Failed to generate preview:', error);
    process.exit(1);
  }
}

// Run if called directly
generatePreview();

