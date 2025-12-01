/**
 * Test Firebase Connection
 * Verifies that Firebase Admin SDK credentials work correctly
 */

import admin from 'firebase-admin';

console.log('🧪 Testing Firebase Admin SDK connection...\n');

// Log what environment variables are available
console.log('Environment variables present:');
console.log(`  VITE_FIREBASE_PROJECT_ID: ${process.env.VITE_FIREBASE_PROJECT_ID ? '✅ SET' : '❌ MISSING'}`);
console.log(`  FIREBASE_CLIENT_EMAIL: ${process.env.FIREBASE_CLIENT_EMAIL ? '✅ SET' : '❌ MISSING'}`);
console.log(`  FIREBASE_PRIVATE_KEY: ${process.env.FIREBASE_PRIVATE_KEY ? '✅ SET (' + process.env.FIREBASE_PRIVATE_KEY.substring(0, 30) + '...)' : '❌ MISSING'}`);
console.log('');

const serviceAccount = {
  project_id: process.env.VITE_FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

if (!serviceAccount.project_id) {
  console.error('❌ VITE_FIREBASE_PROJECT_ID not set');
  process.exit(1);
}
if (!serviceAccount.client_email) {
  console.error('❌ FIREBASE_CLIENT_EMAIL not set');
  process.exit(1);
}
if (!serviceAccount.private_key) {
  console.error('❌ FIREBASE_PRIVATE_KEY not set');
  process.exit(1);
}

console.log('✅ All credentials present');
console.log(`   Project ID: ${serviceAccount.project_id}`);
console.log(`   Client Email: ${serviceAccount.client_email}`);
console.log(`   Private Key Length: ${serviceAccount.private_key.length} chars`);
console.log(`   Private Key Starts: ${serviceAccount.private_key.substring(0, 30)}...`);
console.log('');

try {
  console.log('🔧 Initializing Firebase Admin SDK...');
  
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
  
  console.log('✅ Firebase Admin SDK initialized successfully');
  
  const db = admin.firestore();
  console.log('✅ Firestore instance created');
  
  // Try a simple query
  console.log('🔍 Testing Firestore query...');
  const betsSnapshot = await db.collection('bets').limit(1).get();
  console.log(`✅ Firestore query successful! Found ${betsSnapshot.size} document(s)`);
  
  console.log('\n✅ ALL TESTS PASSED - Firebase connection works!');
  process.exit(0);
  
} catch (error) {
  console.error('\n❌ FIREBASE CONNECTION FAILED:');
  console.error('Error name:', error.name);
  console.error('Error message:', error.message);
  if (error.code) console.error('Error code:', error.code);
  if (error.stack) console.error('\nStack trace:', error.stack);
  process.exit(1);
}

