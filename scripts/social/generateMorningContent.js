/**
 * Generate Morning Social Content (8 AM ET Daily)
 * 
 * Creates:
 * - Twitter thread (1 pick detailed, rest teased)
 * - Reddit post (2 picks detailed, rest require site visit)
 * - Reply/quote templates for engagement
 * - Perplexity Q&A (with API-generated deep analysis)
 * 
 * Saves all content to Firebase for admin page display
 */

import admin from 'firebase-admin';
import { generatePickAnalysis, generatePerplexityQA } from './perplexityClient.js';
import { 
  generateTwitterMorningThread, 
  generateTwitterReplyTemplates,
  generateRedditMorningPost,
  generateMidDayContent
} from './contentTemplates.js';

// Initialize Firebase Admin SDK (same as generateExpertAnalysis.js)
const serviceAccount = {
  project_id: process.env.VITE_FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
  console.error('❌ Firebase credentials not set');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

console.log('🌅 Generating morning social content...');

async function generateMorningContent() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Pull today's NHL bets (pending)
    const nhlSnapshot = await db.collection('bets')
      .where('date', '==', today)
      .where('status', '==', 'pending')
      .get();
    
    const nhlPicks = nhlSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(bet => parseFloat(bet.ev || 0) >= 1.0) // Only quality picks
      .sort((a, b) => parseFloat(b.ev || 0) - parseFloat(a.ev || 0));

    console.log(`✅ Found ${nhlPicks.length} NHL picks for today`);

    // Pull today's CBB bets
    const cbbSnapshot = await db.collection('basketball-bets')
      .where('date', '==', today)
      .where('status', '==', 'pending')
      .get();
    
    const cbbPicks = cbbSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(bet => parseFloat(bet.ev || 0) >= 1.0)
      .sort((a, b) => parseFloat(b.ev || 0) - parseFloat(a.ev || 0));

    console.log(`✅ Found ${cbbPicks.length} CBB picks for today`);

    // Get season stats
    const seasonStats = await getSeasonStats();
    seasonStats.cbb.todayCount = cbbPicks.length;
    seasonStats.cbb.todayAvgEV = cbbPicks.length > 0
      ? (cbbPicks.reduce((sum, p) => sum + parseFloat(p.ev || 0), 0) / cbbPicks.length).toFixed(1)
      : '0';
    seasonStats.cbb.topPickTeam = cbbPicks[0]?.team || null;

    if (nhlPicks.length === 0) {
      console.log('⚠️  No quality NHL picks today - skipping content generation');
      console.log('ℹ️  This is normal if:');
      console.log('   - No NHL games scheduled for today');
      console.log('   - Bets haven\'t been written to Firebase yet');
      console.log('   - No picks meet the quality threshold (EV >= 1.0%)');
      process.exit(0);  // Exit successfully (not an error)
    }

    // Generate Perplexity analysis for top pick
    console.log('🤖 Generating Perplexity analysis for top pick...');
    const perplexityAnalysis = await generatePickAnalysis(nhlPicks[0], seasonStats);
    const perplexityQA = await generatePerplexityQA(nhlPicks[0], seasonStats);

    // Generate Twitter content
    console.log('🐦 Generating Twitter thread...');
    const twitterThread = generateTwitterMorningThread(nhlPicks, seasonStats, perplexityAnalysis);
    const replyTemplates = generateTwitterReplyTemplates(nhlPicks, seasonStats);
    const midDayContent = generateMidDayContent(nhlPicks, null);

    // Generate Reddit content
    console.log('💬 Generating Reddit post...');
    const { title: redditTitle, body: redditBody } = generateRedditMorningPost(
      nhlPicks, 
      seasonStats, 
      perplexityAnalysis
    );

    // Save to Firebase
    console.log('💾 Saving to Firebase...');
    await db.collection('socialContent').doc(today).set({
      morningPicks: {
        twitterThread,
        replyTemplates,
        midDayContent,
        redditTitle,
        redditBody,
        perplexityQA,
        pickCount: nhlPicks.length,
        topPickTeam: nhlPicks[0].team,
        topPickEV: nhlPicks[0].ev,
        generatedAt: new Date().toISOString()
      }
    }, { merge: true });

    console.log('✅ Morning content generated successfully!');
    console.log(`   - Twitter thread: ${twitterThread.length} tweets`);
    console.log(`   - Reply templates: ${Object.keys(replyTemplates).length} templates`);
    console.log(`   - Reddit post ready`);
    console.log(`   - Perplexity Q&A ready`);
    console.log(`\n📱 View at: nhlsavant.com/admin/social-content`);

  } catch (error) {
    console.error('❌ Failed to generate morning content:', error);
    process.exit(1);
  }
}

async function getSeasonStats() {
  try {
    // Get all NHL bets
    const nhlSnapshot = await db.collection('bets').get();
    const nhlBets = nhlSnapshot.docs.map(doc => doc.data());
    const nhlCompleted = nhlBets.filter(b => b.status === 'won' || b.status === 'lost');
    
    const nhlWins = nhlCompleted.filter(b => b.status === 'won').length;
    const nhlLosses = nhlCompleted.filter(b => b.status === 'lost').length;
    const nhlUnits = nhlCompleted.reduce((sum, b) => sum + parseFloat(b.profit || 0), 0);
    const nhlUnitsWagered = nhlCompleted.reduce((sum, b) => sum + parseFloat(b.units || 1), 0);
    const nhlROI = nhlUnitsWagered > 0 ? ((nhlUnits / nhlUnitsWagered) * 100).toFixed(1) : 0;
    const nhlWinRate = nhlCompleted.length > 0 ? ((nhlWins / nhlCompleted.length) * 100).toFixed(1) : 0;

    // Get CBB stats
    const cbbSnapshot = await db.collection('basketball-bets').get();
    const cbbBets = cbbSnapshot.docs.map(doc => doc.data());
    const cbbCompleted = cbbBets.filter(b => b.status === 'won' || b.status === 'lost');
    
    const cbbWins = cbbCompleted.filter(b => b.status === 'won').length;
    const cbbLosses = cbbCompleted.filter(b => b.status === 'lost').length;
    const cbbUnits = cbbCompleted.reduce((sum, b) => sum + parseFloat(b.profit || 0), 0);
    const cbbUnitsWagered = cbbCompleted.reduce((sum, b) => sum + parseFloat(b.units || 1), 0);
    const cbbROI = cbbUnitsWagered > 0 ? ((cbbUnits / cbbUnitsWagered) * 100).toFixed(1) : 0;
    const cbbWinRate = cbbCompleted.length > 0 ? ((cbbWins / cbbCompleted.length) * 100).toFixed(1) : 0;

    // Last 7 days performance
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
    
    const nhlLast7 = nhlCompleted.filter(b => b.date >= sevenDaysAgoStr);
    const nhlLast7Wins = nhlLast7.filter(b => b.status === 'won').length;
    const nhlLast7Units = nhlLast7.reduce((sum, b) => sum + parseFloat(b.profit || 0), 0);
    const nhlLast7Wagered = nhlLast7.reduce((sum, b) => sum + parseFloat(b.units || 1), 0);
    const nhlLast7ROI = nhlLast7Wagered > 0 ? ((nhlLast7Units / nhlLast7Wagered) * 100).toFixed(1) : 0;

    return {
      nhl: {
        record: `${nhlWins}-${nhlLosses}`,
        totalBets: nhlCompleted.length,
        wins: nhlWins,
        losses: nhlLosses,
        units: Math.round(nhlUnits * 10) / 10,
        roi: parseFloat(nhlROI),
        winRate: parseFloat(nhlWinRate),
        last7Record: `${nhlLast7Wins}-${nhlLast7.length - nhlLast7Wins}`,
        last7ROI: parseFloat(nhlLast7ROI)
      },
      cbb: {
        record: `${cbbWins}-${cbbLosses}`,
        totalBets: cbbCompleted.length,
        wins: cbbWins,
        losses: cbbLosses,
        units: Math.round(cbbUnits * 10) / 10,
        roi: parseFloat(cbbROI),
        winRate: parseFloat(cbbWinRate),
        todayCount: 0,
        todayAvgEV: '0',
        topPickTeam: null
      },
      trialDays: '3-5'
    };
  } catch (error) {
    console.error('Error fetching season stats:', error);
    return {
      nhl: { record: '0-0', totalBets: 0, wins: 0, losses: 0, units: 0, roi: 0, winRate: 0, last7Record: '0-0', last7ROI: 0 },
      cbb: { record: '0-0', totalBets: 0, wins: 0, losses: 0, units: 0, roi: 0, winRate: 0, todayCount: 0, todayAvgEV: '0', topPickTeam: null },
      trialDays: '3-5'
    };
  }
}

// Run if called directly
generateMorningContent();

