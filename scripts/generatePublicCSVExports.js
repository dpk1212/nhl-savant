/**
 * Generate Public CSV Exports
 * Creates downloadable CSV files for NHL and CBB picks
 * Pulls live data from Firebase for accuracy
 */

import 'dotenv/config';
import fs from 'fs';
import Papa from 'papaparse';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
const serviceAccount = {
  project_id: process.env.VITE_FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function generatePublicExports() {
  try {
    console.log('📊 Generating public CSV exports from Firebase...');

    // Ensure data directory exists
    const outputDir = './public/data';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // NHL CSV Export - PULL FROM FIREBASE
    try {
      console.log('📥 Fetching NHL bets from Firebase...');
      const nhlSnapshot = await db.collection('bets').get();
      const nhlBets = nhlSnapshot.docs.map(doc => doc.data());
      
      // Filter to completed picks only - CHECK BOTH STATUS FORMATS
      const completedPicks = nhlBets.filter(bet => 
        bet.status === 'won' || bet.status === 'lost' ||
        (bet.status === 'COMPLETED' && bet.result?.outcome)
      );

      // Format for public consumption
      const publicNHL = completedPicks.map(bet => {
        const isWin = bet.status === 'won' || bet.result?.outcome === 'WIN';
        const profit = bet.result?.profit || bet.profit || 0;
        
        return {
          date: bet.date || bet.game?.gameDate || 'N/A',
          team: bet.bet?.team || bet.bet?.pick || 'N/A',
          opponent: bet.game?.awayTeam === (bet.bet?.team || bet.bet?.pick) 
            ? bet.game?.homeTeam 
            : bet.game?.awayTeam || 'N/A',
          odds: bet.bet?.odds || bet.odds || 'N/A',
          grade: bet.prediction?.qualityGrade || bet.prediction?.rating || bet.qualityGrade || bet.grade || 'N/A',
          ev: bet.prediction?.evPercent ? `${parseFloat(bet.prediction.evPercent).toFixed(1)}%` : (bet.ev ? `${parseFloat(bet.ev).toFixed(1)}%` : 'N/A'),
          units: bet.prediction?.recommendedUnit || bet.units || 'N/A',
          result: isWin ? 'WIN' : 'LOSS',
          profit: `${parseFloat(profit).toFixed(2)}u`
        };
      });

      const nhlOutput = Papa.unparse(publicNHL, {
        header: true,
        columns: ['date', 'team', 'opponent', 'odds', 'grade', 'ev', 'units', 'result', 'profit']
      });

      fs.writeFileSync(`${outputDir}/nhl-picks-completed.csv`, nhlOutput);
      console.log(`✅ NHL export: ${completedPicks.length} completed picks`);
    } catch (err) {
      console.error('❌ Failed to process NHL picks:', err.message);
    }

    // CBB CSV Export - PULL FROM FIREBASE
    try {
      console.log('📥 Fetching CBB bets from Firebase...');
      const cbbSnapshot = await db.collection('basketball_bets').get();
      const cbbBets = cbbSnapshot.docs.map(doc => doc.data());
      
      // Filter to completed picks only - CHECK BOTH STATUS FORMATS
      const completedPicks = cbbBets.filter(bet => 
        bet.status === 'won' || bet.status === 'lost' ||
        (bet.status === 'COMPLETED' && bet.result?.outcome)
      );

      // Format for public consumption
      const publicCBB = completedPicks.map(bet => {
        const isWin = bet.status === 'won' || bet.result?.outcome === 'WIN';
        const profit = bet.result?.profit || bet.profit || 0;
        
        return {
          date: bet.date || bet.game?.gameDate || 'N/A',
          team: bet.bet?.team || bet.bet?.pick || 'N/A',
          opponent: bet.game?.awayTeam === (bet.bet?.team || bet.bet?.pick) 
            ? bet.game?.homeTeam 
            : bet.game?.awayTeam || 'N/A',
          odds: bet.bet?.odds || bet.odds || 'N/A',
          grade: bet.prediction?.grade || bet.grade || 'N/A',
          ev: bet.prediction?.evPercent ? `${parseFloat(bet.prediction.evPercent).toFixed(1)}%` : (bet.ev ? `${parseFloat(bet.ev).toFixed(1)}%` : 'N/A'),
          units: bet.prediction?.unitSize || bet.units || 'N/A',
          result: isWin ? 'WIN' : 'LOSS',
          profit: `${parseFloat(profit).toFixed(2)}u`
        };
      });

      const cbbOutput = Papa.unparse(publicCBB, {
        header: true,
        columns: ['date', 'team', 'opponent', 'odds', 'grade', 'ev', 'units', 'result', 'profit']
      });

      fs.writeFileSync(`${outputDir}/cbb-picks-completed.csv`, cbbOutput);
      console.log(`✅ CBB export: ${completedPicks.length} completed picks`);
    }
    } catch (err) {
      console.error('❌ Failed to process CBB picks:', err.message);
    }

    // Generate summary stats JSON - FROM FIREBASE DATA
    try {
      const stats = {
        nhl: await calculateSeasonStatsFromFirebase('bets'),
        cbb: await calculateSeasonStatsFromFirebase('basketball_bets'),
        lastUpdated: new Date().toISOString()
      };

      fs.writeFileSync(`${outputDir}/season-stats.json`, JSON.stringify(stats, null, 2));
      console.log('✅ Season stats generated');
      console.log(`   NHL: ${stats.nhl.totalBets} bets, ${stats.nhl.roi}% ROI`);
      console.log(`   CBB: ${stats.cbb.totalBets} bets, ${stats.cbb.roi}% ROI`);
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

async function calculateSeasonStatsFromFirebase(collection) {
  try {
    const snapshot = await db.collection(collection).get();
    const allBets = snapshot.docs.map(doc => doc.data());
    
    // Filter completed bets - CHECK BOTH STATUS FORMATS
    const completed = allBets.filter(bet => 
      bet.status === 'won' || bet.status === 'lost' ||
      (bet.status === 'COMPLETED' && bet.result?.outcome)
    );

    const wins = completed.filter(bet => 
      bet.status === 'won' || bet.result?.outcome === 'WIN'
    ).length;
    
    const losses = completed.filter(bet => 
      bet.status === 'lost' || bet.result?.outcome === 'LOSS'
    ).length;
    
    const totalBets = wins + losses;
    const winRate = totalBets > 0 ? ((wins / totalBets) * 100).toFixed(1) : 0;

    const totalProfit = completed.reduce((sum, bet) => {
      return sum + (parseFloat(bet.result?.profit || bet.profit) || 0);
    }, 0);

    const totalUnitsWagered = completed.reduce((sum, bet) => {
      return sum + (parseFloat(bet.prediction?.recommendedUnit || bet.units) || 1);
    }, 0);

    const roi = totalUnitsWagered > 0 
      ? ((totalProfit / totalUnitsWagered) * 100).toFixed(1) 
      : 0;

    const averageOdds = completed.length > 0
      ? (completed.reduce((sum, bet) => {
          const odds = parseInt(bet.bet?.odds || bet.odds);
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
  } catch (error) {
    console.error(`Error calculating stats for ${collection}:`, error);
    return {
      totalBets: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      totalProfit: 0,
      roi: 0,
      averageOdds: 0,
      totalUnitsWagered: 0
    };
  }
}

// Run if called directly
generatePublicExports();

