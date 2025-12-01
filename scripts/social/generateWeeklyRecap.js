/**
 * Generate Weekly Recap Content (Sundays)
 * 
 * Creates comprehensive week review with:
 * - Best picks of the week
 * - Honest about worst picks
 * - Variance analysis
 * - Season context
 */

import admin from 'firebase-admin';
import { generateWeeklyRecap } from './contentTemplates.js';

// Initialize Firebase Admin SDK - EXACT SAME AS generateExpertAnalysis.js
const serviceAccount = {
  project_id: process.env.VITE_FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

if (!serviceAccount.project_id) {
  console.error('❌ VITE_FIREBASE_PROJECT_ID environment variable not set');
  process.exit(1);
}
if (!serviceAccount.client_email) {
  console.error('❌ FIREBASE_CLIENT_EMAIL environment variable not set');
  process.exit(1);
}
if (!serviceAccount.private_key) {
  console.error('❌ FIREBASE_PRIVATE_KEY environment variable not set');
  process.exit(1);
}

console.log(`✅ Service account loaded: ${serviceAccount.client_email}`);

// Initialize Firebase Admin (check if already initialized)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

console.log('📅 Generating weekly recap...');

// Get ET date (same as bet tracker uses)
function getETDate() {
  const now = new Date();
  const etOffset = -5; // EST (adjust to -4 for EDT if needed)
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const etDate = new Date(utc + (3600000 * etOffset));
  return etDate.toISOString().split('T')[0];
}

async function generateWeeklyRecapContent() {
  try {
    const todayStr = getETDate(); // USE ET DATE, NOT UTC
    
    // Get last 7 days of bets
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const etOffset = -5;
    const utc = sevenDaysAgo.getTime() + (sevenDaysAgo.getTimezoneOffset() * 60000);
    const sevenDaysAgoET = new Date(utc + (3600000 * etOffset));
    const sevenDaysAgoStr = sevenDaysAgoET.toISOString().split('T')[0];
    
    const snapshot = await db.collection('bets').get();
    const weekResults = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(bet => 
        bet.date >= sevenDaysAgoStr && 
        bet.date <= todayStr &&
        (bet.status === 'won' || bet.status === 'lost')
      )
      .sort((a, b) => parseFloat(b.profit || 0) - parseFloat(a.profit || 0));

    console.log(`✅ Found ${weekResults.length} completed picks this week`);

    if (weekResults.length === 0) {
      console.log('⚠️  No completed picks this week');
      return;
    }

    // Get season stats
    const seasonStats = await getSeasonStats();

    // Generate recap content
    console.log('📊 Generating recap content...');
    const { twitterThread, redditBody } = generateWeeklyRecap(weekResults, seasonStats);

    const weekWins = weekResults.filter(r => r.status === 'won').length;
    const weekLosses = weekResults.filter(r => r.status === 'lost').length;
    const weekProfit = weekResults.reduce((sum, r) => sum + parseFloat(r.profit || 0), 0);

    // Save to Firebase
    console.log('💾 Saving to Firebase...');
    await db.collection('socialContent').doc(todayStr).set({
      weeklyRecap: {
        twitterThread,
        redditTitle: `[NHL Savant] Week ${Math.ceil(seasonStats.nhl.totalBets / 20)} Recap - ${weekWins}-${weekLosses} Record, ${weekProfit >= 0 ? '+' : ''}${weekProfit.toFixed(1)}u`,
        redditBody,
        weekRecord: `${weekWins}-${weekLosses}`,
        weekProfit: Math.round(weekProfit * 10) / 10,
        weekBets: weekResults.length,
        generatedAt: new Date().toISOString()
      }
    }, { merge: true });

    console.log('✅ Weekly recap generated successfully!');
    console.log(`   - This week: ${weekWins}-${weekLosses} (${weekProfit >= 0 ? '+' : ''}${weekProfit.toFixed(1)}u)`);
    console.log(`   - Twitter thread: ${twitterThread.length} tweets`);
    console.log(`   - Reddit post ready`);
    console.log(`\n📱 View at: nhlsavant.com/admin/social-content`);

  } catch (error) {
    console.error('❌ Failed to generate weekly recap:', error);
    process.exit(1);
  }
}

async function getSeasonStats() {
  try {
    const snapshot = await db.collection('bets').get();
    const allBets = snapshot.docs.map(doc => doc.data());
    const completed = allBets.filter(b => b.status === 'won' || b.status === 'lost');
    
    const wins = completed.filter(b => b.status === 'won').length;
    const losses = completed.filter(b => b.status === 'lost').length;
    const units = completed.reduce((sum, b) => sum + parseFloat(b.profit || 0), 0);
    const unitsWagered = completed.reduce((sum, b) => sum + parseFloat(b.units || 1), 0);
    const roi = unitsWagered > 0 ? ((units / unitsWagered) * 100).toFixed(1) : 0;

    return {
      nhl: {
        record: `${wins}-${losses}`,
        totalBets: completed.length,
        units: Math.round(units * 10) / 10,
        roi: parseFloat(roi)
      },
      cbb: {
        record: '0-0',
        roi: 0
      }
    };
  } catch (error) {
    console.error('Error fetching season stats:', error);
    return {
      nhl: { record: '0-0', totalBets: 0, units: 0, roi: 0 },
      cbb: { record: '0-0', roi: 0 }
    };
  }
}

// Run if called directly
generateWeeklyRecapContent();

