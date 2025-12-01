/**
 * Generate Educational Content (Bi-weekly Wednesdays)
 * 
 * Uses Perplexity API to generate high-quality educational deep dives on:
 * - PDO regression
 * - xGF analysis
 * - EV calculation
 * - Parlay traps
 * - CBB efficiency ratings
 * 
 * Rotates topics every 2 weeks
 */

import admin from 'firebase-admin';
import { generateEducationalPost } from './perplexityClient.js';
import { generateEducationalContent as generateTemplateContent } from './contentTemplates.js';

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

console.log('📚 Generating educational content...');

// Topic rotation (bi-weekly cycle)
const TOPICS = [
  'pdo-regression',
  'xgf-analysis',
  'ev-calculation',
  'parlays-trap',
  'cbb-efficiency'
];

async function generateEducationalContentPost() {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Get current topic index from Firebase
    const topicTrackerSnap = await db.collection('system').doc('educationalTopicTracker').get();
    
    let topicIndex = 0;
    if (topicTrackerSnap.exists) {
      topicIndex = (topicTrackerSnap.data().lastIndex + 1) % TOPICS.length;
    }
    
    const topic = TOPICS[topicIndex];
    console.log(`📖 Topic: ${topic} (${topicIndex + 1}/${TOPICS.length})`);

    // Generate content using Perplexity API
    console.log('🤖 Generating educational post with Perplexity...');
    const perplexityContent = await generateEducationalPost(topic);
    
    // Generate formatted social content
    const { twitterThread, redditTitle, redditBody } = generateTemplateContent(
      topic,
      perplexityContent
    );

    // Save to Firebase
    console.log('💾 Saving to Firebase...');
    await db.collection('socialContent').doc(todayStr).set({
      educational: {
        topic,
        topicIndex,
        twitterThread,
        redditTitle,
        redditBody,
        perplexityGenerated: !!perplexityContent,
        generatedAt: new Date().toISOString()
      }
    }, { merge: true });

    // Update topic tracker
    await db.collection('system').doc('educationalTopicTracker').set({
      lastIndex: topicIndex,
      lastTopic: topic,
      lastGenerated: todayStr
    });

    console.log('✅ Educational content generated successfully!');
    console.log(`   - Topic: ${topic}`);
    console.log(`   - Twitter thread: ${twitterThread.length} tweets`);
    console.log(`   - Reddit post ready`);
    console.log(`   - Next topic: ${TOPICS[(topicIndex + 1) % TOPICS.length]}`);
    console.log(`\n📱 View at: nhlsavant.com/admin/social-content`);

  } catch (error) {
    console.error('❌ Failed to generate educational content:', error);
    process.exit(1);
  }
}

// Run if called directly
generateEducationalContentPost();

