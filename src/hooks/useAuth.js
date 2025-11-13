import { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db, analytics, logEvent as firebaseLogEvent } from '../firebase/config';

// Wrapper for analytics logging
const logEvent = (eventName, params) => {
  if (analytics) {
    firebaseLogEvent(analytics, eventName, params);
  }
};

/**
 * Authentication hook for managing user sign-in, sign-out, and auth state
 * Integrates with Firebase Auth (Google OAuth) and Firestore
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified
        });

        // Update last login time in Firestore
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          await setDoc(userRef, {
            lastLoginAt: serverTimestamp()
          }, { merge: true });
        } catch (err) {
          console.error('Error updating last login:', err);
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Sign in with Google OAuth
   */
  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if this is a new user
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      const isNewUser = !userDoc.exists();

      // Create or update user document in Firestore
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        ...(isNewUser ? {
          tier: 'free',
          status: 'active',
          createdAt: serverTimestamp(),
          stripeCustomerId: null,
          subscriptionId: null,
          trialEndsAt: null
        } : {}),
        lastLoginAt: serverTimestamp()
      }, { merge: true });

      // Log analytics event
      if (isNewUser) {
        logEvent('sign_up', {
          method: 'google'
        });
        console.log('🎉 New user signed up:', user.email);
      } else {
        logEvent('sign_in', {
          method: 'google'
        });
        console.log('👋 User signed in:', user.email);
      }

      // Migrate anonymous spins to authenticated user
      try {
        const { migrateAnonymousSpins } = await import('../utils/spinTracker');
        await migrateAnonymousSpins(user.uid);
      } catch (err) {
        console.error('Error migrating anonymous spins:', err);
        // Don't throw - this is non-critical
      }

      return { user, isNewUser };
    } catch (err) {
      console.error('Error signing in with Google:', err);
      setError(err.message);
      
      // Log error type for debugging
      if (err.code === 'auth/popup-closed-by-user') {
        console.log('User closed the sign-in popup');
      } else if (err.code === 'auth/popup-blocked') {
        console.log('Sign-in popup was blocked by browser');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign out current user
   */
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      logEvent('sign_out');
      console.log('👋 User signed out');
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user
  };
}

