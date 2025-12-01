/**
 * Generate Public CSV Exports
 * Creates downloadable CSV files for NHL and CBB picks
 * Optimized for LLM citations and public transparency
 */

const fs = require('fs');
const Papa = require('papaparse');

async function generatePublicExports() {
  try {
    console.log('📊 Generating public CSV exports...');

    // Ensure data directory exists
    const outputDir = './public/data';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // NHL CSV Export
    try {
      const nhlPath = './public/data/picks-nhl-2025-26.csv';
      if (fs.existsSync(nhlPath)) {
        const nhlCsv = fs.readFileSync(nhlPath, 'utf8');
        const parsed = Papa.parse(nhlCsv, { header: true, skipEmptyLines: true });
        
        // Filter to completed picks only (for transparency)
        const completedPicks = parsed.data.filter(bet => 
          bet.status === 'won' || bet.status === 'lost'
        );

        // Format for public consumption
        const publicNHL = completedPicks.map(bet => ({
          date: bet.date,
          team: bet.team,
          opponent: bet.opponent,
          odds: bet.odds,
          grade: bet.qualityGrade || bet.grade,
          ev: bet.ev ? `${parseFloat(bet.ev).toFixed(1)}%` : 'N/A',
          units: bet.units || 'N/A',
          result: bet.status === 'won' ? 'WIN' : 'LOSS',
          profit: bet.profit ? `${parseFloat(bet.profit).toFixed(2)}u` : '0.00u'
        }));

        const nhlOutput = Papa.unparse(publicNHL, {
          header: true,
          columns: ['date', 'team', 'opponent', 'odds', 'grade', 'ev', 'units', 'result', 'profit']
        });

        fs.writeFileSync(`${outputDir}/nhl-picks-completed.csv`, nhlOutput);
        console.log(`✅ NHL export: ${completedPicks.length} completed picks`);
      } else {
        console.warn('⚠️  NHL picks file not found, skipping...');
      }
    } catch (err) {
      console.error('❌ Failed to process NHL picks:', err.message);
    }

    // CBB CSV Export
    try {
      const cbbPath = './public/data/picks-cbb-2025-26.csv';
      if (fs.existsSync(cbbPath)) {
        const cbbCsv = fs.readFileSync(cbbPath, 'utf8');
        const parsed = Papa.parse(cbbCsv, { header: true, skipEmptyLines: true });
        
        // Filter to completed picks only
        const completedPicks = parsed.data.filter(bet => 
          bet.status === 'won' || bet.status === 'lost'
        );

        // Format for public consumption
        const publicCBB = completedPicks.map(bet => ({
          date: bet.date,
          team: bet.team,
          opponent: bet.opponent,
          odds: bet.odds,
          grade: bet.qualityGrade || bet.grade,
          ev: bet.ev ? `${parseFloat(bet.ev).toFixed(1)}%` : 'N/A',
          units: bet.units || 'N/A',
          result: bet.status === 'won' ? 'WIN' : 'LOSS',
          profit: bet.profit ? `${parseFloat(bet.profit).toFixed(2)}u` : '0.00u'
        }));

        const cbbOutput = Papa.unparse(publicCBB, {
          header: true,
          columns: ['date', 'team', 'opponent', 'odds', 'grade', 'ev', 'units', 'result', 'profit']
        });

        fs.writeFileSync(`${outputDir}/cbb-picks-completed.csv`, cbbOutput);
        console.log(`✅ CBB export: ${completedPicks.length} completed picks`);
      } else {
        console.warn('⚠️  CBB picks file not found, skipping...');
      }
    } catch (err) {
      console.error('❌ Failed to process CBB picks:', err.message);
    }

    // Generate summary stats JSON
    try {
      const stats = {
        nhl: calculateSeasonStats('./public/data/picks-nhl-2025-26.csv'),
        cbb: calculateSeasonStats('./public/data/picks-cbb-2025-26.csv'),
        lastUpdated: new Date().toISOString()
      };

      fs.writeFileSync(`${outputDir}/season-stats.json`, JSON.stringify(stats, null, 2));
      console.log('✅ Season stats generated');
    } catch (err) {
      console.error('❌ Failed to generate season stats:', err.message);
    }

    console.log('\n✨ Public CSV exports complete!');
    console.log(`   View at: /data/nhl-picks-completed.csv`);
    console.log(`   View at: /data/cbb-picks-completed.csv`);
    console.log(`   View stats: /data/season-stats.json`);

  } catch (error) {
    console.error('❌ Export generation failed:', error);
    process.exit(1);
  }
}

function calculateSeasonStats(filePath) {
  if (!fs.existsSync(filePath)) {
    return {
      totalBets: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      totalProfit: 0,
      roi: 0,
      averageOdds: 0
    };
  }

  const csv = fs.readFileSync(filePath, 'utf8');
  const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
  const completed = parsed.data.filter(bet => bet.status === 'won' || bet.status === 'lost');

  const wins = completed.filter(bet => bet.status === 'won').length;
  const losses = completed.filter(bet => bet.status === 'lost').length;
  const totalBets = wins + losses;
  const winRate = totalBets > 0 ? ((wins / totalBets) * 100).toFixed(1) : 0;

  const totalProfit = completed.reduce((sum, bet) => {
    return sum + (parseFloat(bet.profit) || 0);
  }, 0);

  const totalUnitsWagered = completed.reduce((sum, bet) => {
    return sum + (parseFloat(bet.units) || 1);
  }, 0);

  const roi = totalUnitsWagered > 0 
    ? ((totalProfit / totalUnitsWagered) * 100).toFixed(1) 
    : 0;

  const averageOdds = completed.length > 0
    ? (completed.reduce((sum, bet) => {
        const odds = parseInt(bet.odds);
        return sum + (odds || 0);
      }, 0) / completed.length).toFixed(0)
    : 0;

  return {
    totalBets,
    wins,
    losses,
    winRate: parseFloat(winRate),
    totalProfit: Math.round(totalProfit * 100) / 100,
    roi: parseFloat(roi),
    averageOdds: parseInt(averageOdds),
    totalUnitsWagered: Math.round(totalUnitsWagered * 10) / 10
  };
}

// Run if called directly
if (require.main === module) {
  generatePublicExports();
}

module.exports = { generatePublicExports };

