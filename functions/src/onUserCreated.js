const functions = require('firebase-functions');
const admin = require('firebase-admin');

const db = admin.firestore();

/**
 * Triggered when a new user is created via Firebase Auth
 * Creates a Firestore document with default free tier
 */
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
  console.log('🆕 New user created:', user.uid, user.email);

  try {
    const userRef = db.collection('users').doc(user.uid);

    // Check if document already exists (shouldn't, but be safe)
    const userDoc = await userRef.get();
    if (userDoc.exists()) {
      console.log('User document already exists, skipping creation');
      return;
    }

    // Create user document with free tier defaults
    await userRef.set({
      email: user.email,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      tier: 'free',
      status: 'active',
      stripeCustomerId: null,
      subscriptionId: null,
      trialEndsAt: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ User document created for ${user.uid} with free tier`);
  } catch (error) {
    console.error('Error creating user document:', error);
    // Don't throw - we don't want to block user creation
  }
});

