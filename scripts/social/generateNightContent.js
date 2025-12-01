/**
 * Generate Night Social Content (11 PM ET Daily)
 * 
 * Creates:
 * - Twitter results thread (full transparency)
 * - Reddit results post (show every pick, every loss)
 * - Variance analysis
 * 
 * Saves all content to Firebase for admin page display
 */

import admin from 'firebase-admin';
import { generateTwitterResultsThread, generateRedditResultsPost } from './contentTemplates.js';

// Initialize Firebase Admin SDK
const serviceAccount = {
  project_id: process.env.VITE_FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
  console.error('❌ Firebase credentials not set');
  process.exit(1);
}

// Initialize Firebase Admin (check if already initialized)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

console.log('🌙 Generating night social content...');

async function generateNightContent() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Pull today's completed bets (won/lost)
    const snapshot = await db.collection('bets')
      .where('date', '==', today)
      .get();
    
    const results = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(bet => bet.status === 'won' || bet.status === 'lost')
      .sort((a, b) => {
        // Sort: wins first, then by profit
        if (a.status !== b.status) {
          return a.status === 'won' ? -1 : 1;
        }
        return parseFloat(b.profit || 0) - parseFloat(a.profit || 0);
      });

    console.log(`✅ Found ${results.length} completed picks for today`);

    if (results.length === 0) {
      console.log('⚠️  No completed picks yet - games may still be in progress');
      return;
    }

    // Get season stats
    const seasonStats = await getSeasonStats();

    // Generate Twitter results thread
    console.log('🐦 Generating Twitter results thread...');
    const twitterThread = generateTwitterResultsThread(results, seasonStats);

    // Generate Reddit results post
    console.log('💬 Generating Reddit results post...');
    const { title: redditTitle, body: redditBody } = generateRedditResultsPost(results, seasonStats);

    // Calculate today's summary
    const wins = results.filter(r => r.status === 'won').length;
    const losses = results.filter(r => r.status === 'lost').length;
    const profit = results.reduce((sum, r) => sum + parseFloat(r.profit || 0), 0);
    const roi = results.length > 0
      ? ((profit / results.reduce((sum, r) => sum + parseFloat(r.units || 1), 0)) * 100).toFixed(1)
      : 0;

    // Save to Firebase
    console.log('💾 Saving to Firebase...');
    await db.collection('socialContent').doc(today).set({
      nightResults: {
        twitterThread,
        redditTitle,
        redditBody,
        todayRecord: `${wins}-${losses}`,
        todayProfit: Math.round(profit * 10) / 10,
        todayROI: parseFloat(roi),
        totalPicks: results.length,
        generatedAt: new Date().toISOString()
      }
    }, { merge: true });

    console.log('✅ Night content generated successfully!');
    console.log(`   - Today: ${wins}-${losses} (${profit >= 0 ? '+' : ''}${profit.toFixed(1)}u)`);
    console.log(`   - Twitter thread: ${twitterThread.length} tweets`);
    console.log(`   - Reddit post ready`);
    console.log(`\n📱 View at: nhlsavant.com/admin/social-content`);

  } catch (error) {
    console.error('❌ Failed to generate night content:', error);
    process.exit(1);
  }
}

async function getSeasonStats() {
  try {
    // Get all NHL bets
    const snapshot = await db.collection('bets').get();
    const allBets = snapshot.docs.map(doc => doc.data());
    const completed = allBets.filter(b => b.status === 'won' || b.status === 'lost');
    
    const wins = completed.filter(b => b.status === 'won').length;
    const losses = completed.filter(b => b.status === 'lost').length;
    const units = completed.reduce((sum, b) => sum + parseFloat(b.profit || 0), 0);
    const unitsWagered = completed.reduce((sum, b) => sum + parseFloat(b.units || 1), 0);
    const roi = unitsWagered > 0 ? ((units / unitsWagered) * 100).toFixed(1) : 0;

    // Last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
    
    const last7 = completed.filter(b => b.date >= sevenDaysAgoStr);
    const last7Wins = last7.filter(b => b.status === 'won').length;
    const last7Units = last7.reduce((sum, b) => sum + parseFloat(b.profit || 0), 0);
    const last7Wagered = last7.reduce((sum, b) => sum + parseFloat(b.units || 1), 0);
    const last7ROI = last7Wagered > 0 ? ((last7Units / last7Wagered) * 100).toFixed(1) : 0;

    return {
      nhl: {
        record: `${wins}-${losses}`,
        totalBets: completed.length,
        wins,
        losses,
        units: Math.round(units * 10) / 10,
        roi: parseFloat(roi),
        last7Record: `${last7Wins}-${last7.length - last7Wins}`,
        last7ROI: parseFloat(last7ROI)
      },
      cbb: {
        record: '0-0',
        roi: 0
      }
    };
  } catch (error) {
    console.error('Error fetching season stats:', error);
    return {
      nhl: { record: '0-0', totalBets: 0, units: 0, roi: 0, last7Record: '0-0', last7ROI: 0 },
      cbb: { record: '0-0', roi: 0 }
    };
  }
}

// Run if called directly
generateNightContent();

