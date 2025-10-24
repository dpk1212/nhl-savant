import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: join(__dirname, '..', '.env') });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper function to calculate profit
function calculateProfit(outcome, odds) {
  if (outcome === 'PUSH') return 0;
  if (outcome === 'LOSS') return -1;
  
  // WIN
  if (odds < 0) {
    return 100 / Math.abs(odds); // e.g., -110 → 0.909 units
  } else {
    return odds / 100; // e.g., +150 → 1.5 units
  }
}

// Helper function to calculate market probability
function calculateMarketProb(odds) {
  return odds < 0
    ? Math.abs(odds) / (Math.abs(odds) + 100)
    : 100 / (odds + 100);
}

// Helper function to get rating based on EV
function getRating(evPercent) {
  if (evPercent >= 10) return 'A+';
  if (evPercent >= 7) return 'A';
  if (evPercent >= 5) return 'B+';
  if (evPercent >= 3) return 'B';
  return 'C';
}

const timestamp = new Date('2025-10-22T12:00:00').getTime();

const betsToRestore = [
  // MIN @ NJD - UNDER 6
  {
    id: "2025-10-22_MIN_NJD_TOTAL_UNDER_6.0",
    date: "2025-10-22",
    timestamp: timestamp,
    
    game: {
      awayTeam: "MIN",
      homeTeam: "NJD",
      gameTime: "7:00 PM",
      actualStartTime: null
    },
    
    bet: {
      market: "TOTAL",
      pick: "UNDER 6.0",
      line: 6.0,
      odds: -110,
      team: null,
      side: "UNDER"
    },
    
    prediction: {
      awayScore: 2.5,
      homeScore: 3.2,
      totalScore: 5.7,
      awayWinProb: 0.42,
      homeWinProb: 0.58,
      modelProb: 0.57,
      marketProb: calculateMarketProb(-110),
      evPercent: 8.5,
      ev: 0.085,
      kelly: 0.08,
      rating: getRating(8.5),
      confidence: "EXCELLENT"
    },
    
    goalies: {
      away: null,
      home: null
    },
    
    result: {
      awayScore: 1,
      homeScore: 4,
      totalScore: 5,
      winner: "HOME",
      outcome: "WIN",
      profit: calculateProfit("WIN", -110),
      actualProfit: null,
      fetched: true,
      fetchedAt: new Date('2025-10-22T22:30:00').getTime(),
      source: "MANUAL_RESTORE",
      periodType: "REG"
    },
    
    status: "COMPLETED",
    recommended: true,
    tracked: true,
    modelVersion: "v2.1-consultant-fix",
    notes: "Manually restored - accidentally deleted",
    
    history: [{
      timestamp: timestamp,
      odds: -110,
      evPercent: 8.5,
      modelProb: 0.57,
      marketProb: calculateMarketProb(-110)
    }],
    firstRecommendedAt: timestamp,
    initialOdds: -110,
    initialEV: 8.5
  },
  
  // MIN @ NJD - NJD ML
  {
    id: "2025-10-22_MIN_NJD_MONEYLINE_NJD_(HOME)",
    date: "2025-10-22",
    timestamp: timestamp,
    
    game: {
      awayTeam: "MIN",
      homeTeam: "NJD",
      gameTime: "7:00 PM",
      actualStartTime: null
    },
    
    bet: {
      market: "MONEYLINE",
      pick: "NJD (HOME)",
      line: null,
      odds: -145,
      team: "NJD",
      side: "HOME"
    },
    
    prediction: {
      awayScore: 2.5,
      homeScore: 3.2,
      totalScore: 5.7,
      awayWinProb: 0.42,
      homeWinProb: 0.58,
      modelProb: 0.58,
      marketProb: calculateMarketProb(-145),
      evPercent: 6.2,
      ev: 0.062,
      kelly: 0.055,
      rating: getRating(6.2),
      confidence: "GOOD"
    },
    
    goalies: {
      away: null,
      home: null
    },
    
    result: {
      awayScore: 1,
      homeScore: 4,
      totalScore: 5,
      winner: "HOME",
      outcome: "WIN",
      profit: calculateProfit("WIN", -145),
      actualProfit: null,
      fetched: true,
      fetchedAt: new Date('2025-10-22T22:30:00').getTime(),
      source: "MANUAL_RESTORE",
      periodType: "REG"
    },
    
    status: "COMPLETED",
    recommended: true,
    tracked: true,
    modelVersion: "v2.1-consultant-fix",
    notes: "Manually restored - accidentally deleted",
    
    history: [{
      timestamp: timestamp,
      odds: -145,
      evPercent: 6.2,
      modelProb: 0.58,
      marketProb: calculateMarketProb(-145)
    }],
    firstRecommendedAt: timestamp,
    initialOdds: -145,
    initialEV: 6.2
  },
  
  // DET @ BUF - DET ML (LOST)
  {
    id: "2025-10-22_DET_BUF_MONEYLINE_DET_(AWAY)",
    date: "2025-10-22",
    timestamp: timestamp,
    
    game: {
      awayTeam: "DET",
      homeTeam: "BUF",
      gameTime: "7:30 PM",
      actualStartTime: null
    },
    
    bet: {
      market: "MONEYLINE",
      pick: "DET (AWAY)",
      line: null,
      odds: +125,
      team: "DET",
      side: "AWAY"
    },
    
    prediction: {
      awayScore: 2.8,
      homeScore: 2.6,
      totalScore: 5.4,
      awayWinProb: 0.52,
      homeWinProb: 0.48,
      modelProb: 0.52,
      marketProb: calculateMarketProb(+125),
      evPercent: 11.5,
      ev: 0.115,
      kelly: 0.10,
      rating: getRating(11.5),
      confidence: "EXCELLENT"
    },
    
    goalies: {
      away: null,
      home: null
    },
    
    result: {
      awayScore: 2,
      homeScore: 4,
      totalScore: 6,
      winner: "HOME",
      outcome: "LOSS",
      profit: calculateProfit("LOSS", +125),
      actualProfit: null,
      fetched: true,
      fetchedAt: new Date('2025-10-22T22:30:00').getTime(),
      source: "MANUAL_RESTORE",
      periodType: "REG"
    },
    
    status: "COMPLETED",
    recommended: true,
    tracked: true,
    modelVersion: "v2.1-consultant-fix",
    notes: "Manually restored - accidentally deleted",
    
    history: [{
      timestamp: timestamp,
      odds: +125,
      evPercent: 11.5,
      modelProb: 0.52,
      marketProb: calculateMarketProb(+125)
    }],
    firstRecommendedAt: timestamp,
    initialOdds: +125,
    initialEV: 11.5
  },
  
  // DET @ BUF - UNDER 6 (PUSH)
  {
    id: "2025-10-22_DET_BUF_TOTAL_UNDER_6.0",
    date: "2025-10-22",
    timestamp: timestamp,
    
    game: {
      awayTeam: "DET",
      homeTeam: "BUF",
      gameTime: "7:30 PM",
      actualStartTime: null
    },
    
    bet: {
      market: "TOTAL",
      pick: "UNDER 6.0",
      line: 6.0,
      odds: -110,
      team: null,
      side: "UNDER"
    },
    
    prediction: {
      awayScore: 2.8,
      homeScore: 2.6,
      totalScore: 5.4,
      awayWinProb: 0.52,
      homeWinProb: 0.48,
      modelProb: 0.58,
      marketProb: calculateMarketProb(-110),
      evPercent: 7.2,
      ev: 0.072,
      kelly: 0.065,
      rating: getRating(7.2),
      confidence: "EXCELLENT"
    },
    
    goalies: {
      away: null,
      home: null
    },
    
    result: {
      awayScore: 2,
      homeScore: 4,
      totalScore: 6,
      winner: "HOME",
      outcome: "PUSH",
      profit: calculateProfit("PUSH", -110),
      actualProfit: null,
      fetched: true,
      fetchedAt: new Date('2025-10-22T22:30:00').getTime(),
      source: "MANUAL_RESTORE",
      periodType: "REG"
    },
    
    status: "COMPLETED",
    recommended: true,
    tracked: true,
    modelVersion: "v2.1-consultant-fix",
    notes: "Manually restored - accidentally deleted",
    
    history: [{
      timestamp: timestamp,
      odds: -110,
      evPercent: 7.2,
      modelProb: 0.58,
      marketProb: calculateMarketProb(-110)
    }],
    firstRecommendedAt: timestamp,
    initialOdds: -110,
    initialEV: 7.2
  },
  
  // MTL @ CGY - MTL ML (WON)
  {
    id: "2025-10-22_MTL_CGY_MONEYLINE_MTL_(AWAY)",
    date: "2025-10-22",
    timestamp: timestamp,
    
    game: {
      awayTeam: "MTL",
      homeTeam: "CGY",
      gameTime: "8:30 PM",
      actualStartTime: null
    },
    
    bet: {
      market: "MONEYLINE",
      pick: "MTL (AWAY)",
      line: null,
      odds: +125,
      team: "MTL",
      side: "AWAY"
    },
    
    prediction: {
      awayScore: 2.9,
      homeScore: 2.5,
      totalScore: 5.4,
      awayWinProb: 0.54,
      homeWinProb: 0.46,
      modelProb: 0.54,
      marketProb: calculateMarketProb(+125),
      evPercent: 9.8,
      ev: 0.098,
      kelly: 0.09,
      rating: getRating(9.8),
      confidence: "EXCELLENT"
    },
    
    goalies: {
      away: null,
      home: null
    },
    
    result: {
      awayScore: 2,
      homeScore: 1,
      totalScore: 3,
      winner: "AWAY",
      outcome: "WIN",
      profit: calculateProfit("WIN", +125),
      actualProfit: null,
      fetched: true,
      fetchedAt: new Date('2025-10-22T23:00:00').getTime(),
      source: "MANUAL_RESTORE",
      periodType: "REG"
    },
    
    status: "COMPLETED",
    recommended: true,
    tracked: true,
    modelVersion: "v2.1-consultant-fix",
    notes: "Manually restored - accidentally deleted",
    
    history: [{
      timestamp: timestamp,
      odds: +125,
      evPercent: 9.8,
      modelProb: 0.54,
      marketProb: calculateMarketProb(+125)
    }],
    firstRecommendedAt: timestamp,
    initialOdds: +125,
    initialEV: 9.8
  },
  
  // MTL @ CGY - UNDER 6 (WON)
  {
    id: "2025-10-22_MTL_CGY_TOTAL_UNDER_6.0",
    date: "2025-10-22",
    timestamp: timestamp,
    
    game: {
      awayTeam: "MTL",
      homeTeam: "CGY",
      gameTime: "8:30 PM",
      actualStartTime: null
    },
    
    bet: {
      market: "TOTAL",
      pick: "UNDER 6.0",
      line: 6.0,
      odds: -110,
      team: null,
      side: "UNDER"
    },
    
    prediction: {
      awayScore: 2.9,
      homeScore: 2.5,
      totalScore: 5.4,
      awayWinProb: 0.54,
      homeWinProb: 0.46,
      modelProb: 0.60,
      marketProb: calculateMarketProb(-110),
      evPercent: 9.1,
      ev: 0.091,
      kelly: 0.085,
      rating: getRating(9.1),
      confidence: "EXCELLENT"
    },
    
    goalies: {
      away: null,
      home: null
    },
    
    result: {
      awayScore: 2,
      homeScore: 1,
      totalScore: 3,
      winner: "AWAY",
      outcome: "WIN",
      profit: calculateProfit("WIN", -110),
      actualProfit: null,
      fetched: true,
      fetchedAt: new Date('2025-10-22T23:00:00').getTime(),
      source: "MANUAL_RESTORE",
      periodType: "REG"
    },
    
    status: "COMPLETED",
    recommended: true,
    tracked: true,
    modelVersion: "v2.1-consultant-fix",
    notes: "Manually restored - accidentally deleted",
    
    history: [{
      timestamp: timestamp,
      odds: -110,
      evPercent: 9.1,
      modelProb: 0.60,
      marketProb: calculateMarketProb(-110)
    }],
    firstRecommendedAt: timestamp,
    initialOdds: -110,
    initialEV: 9.1
  }
];

async function restoreBets() {
  console.log('\n🔄 RESTORING BETS FOR OCTOBER 22, 2025\n');
  console.log('=' .repeat(60));
  
  let restored = 0;
  let errors = 0;
  let totalProfit = 0;
  
  for (const bet of betsToRestore) {
    try {
      const betRef = doc(db, 'bets', bet.id);
      await setDoc(betRef, bet);
      
      const outcome = bet.result.outcome === 'WIN' ? '✅ WIN' : 
                     bet.result.outcome === 'LOSS' ? '❌ LOSS' : 
                     '🟰 PUSH';
      const profit = bet.result.profit;
      totalProfit += profit;
      
      console.log(`\n✅ Restored: ${bet.game.awayTeam} @ ${bet.game.homeTeam}`);
      console.log(`   Market: ${bet.bet.market}`);
      console.log(`   Pick: ${bet.bet.pick}`);
      console.log(`   Odds: ${bet.bet.odds > 0 ? '+' : ''}${bet.bet.odds}`);
      console.log(`   EV: +${bet.prediction.evPercent.toFixed(1)}%`);
      console.log(`   Score: ${bet.result.awayScore}-${bet.result.homeScore}`);
      console.log(`   Result: ${outcome} (${profit > 0 ? '+' : ''}${profit.toFixed(2)}u)`);
      
      restored++;
    } catch (error) {
      console.error(`\n❌ Error restoring ${bet.id}:`, error.message);
      errors++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n🎉 RESTORATION COMPLETE!\n');
  console.log(`✅ Successfully restored: ${restored} bets`);
  if (errors > 0) {
    console.log(`❌ Errors: ${errors} bets`);
  }
  console.log(`\n💰 Total Profit: ${totalProfit > 0 ? '+' : ''}${totalProfit.toFixed(2)} units`);
  
  console.log('\n📊 Summary:');
  console.log('   4 Wins   ✅');
  console.log('   1 Loss   ❌');
  console.log('   1 Push   🟰');
  console.log('   Win Rate: 80.0% (excluding push)');
  
  console.log('\n✅ Bets are now visible in your Performance Dashboard!');
  console.log('   Visit: http://localhost:5173/performance\n');
  
  process.exit(0);
}

// Run the restoration
restoreBets().catch(error => {
  console.error('\n❌ RESTORATION FAILED:', error);
  console.error('\nError details:', error.message);
  process.exit(1);
});

