/**
 * Daily Spin Tracker
 * 
 * Tracks daily spin usage for both authenticated and anonymous users.
 * Resets daily at midnight ET.
 */

import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const SPINS_PER_DAY = 2;

/**
 * Get ET date string (YYYY-MM-DD)
 */
function getETDate() {
  const date = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  const etDate = new Date(date);
  return etDate.toISOString().split('T')[0]; // YYYY-MM-DD
}

/**
 * Get daily spin data for a user
 * @param {string} userId - Firebase user ID (null for anonymous)
 * @returns {Promise<{remaining: number, used: number, total: number, codesWon: string[]}>}
 */
export async function getDailySpins(userId) {
  const today = getETDate();
  
  if (userId) {
    // Authenticated user: Check Firestore
    try {
      const docRef = doc(db, 'user_spins', `${userId}_${today}`);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          remaining: SPINS_PER_DAY - (data.spinsUsed || 0),
          used: data.spinsUsed || 0,
          total: SPINS_PER_DAY,
          codesWon: data.codesWon || []
        };
      } else {
        // No record for today - full spins available
        return {
          remaining: SPINS_PER_DAY,
          used: 0,
          total: SPINS_PER_DAY,
          codesWon: []
        };
      }
    } catch (error) {
      console.error('Error getting daily spins from Firestore:', error);
      // Fallback to localStorage
      return getDailySpinsFromLocalStorage();
    }
  } else {
    // Anonymous user: Check localStorage
    return getDailySpinsFromLocalStorage();
  }
}

/**
 * Get spins from localStorage (for anonymous users)
 */
function getDailySpinsFromLocalStorage() {
  const today = getETDate();
  const stored = localStorage.getItem('nhl_savant_daily_spins');
  
  if (stored) {
    try {
      const data = JSON.parse(stored);
      
      // Check if it's today's data
      if (data.date === today) {
        return {
          remaining: SPINS_PER_DAY - (data.spinsUsed || 0),
          used: data.spinsUsed || 0,
          total: SPINS_PER_DAY,
          codesWon: data.codesWon || []
        };
      } else {
        // Old data - reset for today
        localStorage.removeItem('nhl_savant_daily_spins');
      }
    } catch (error) {
      console.error('Error parsing localStorage spins:', error);
      localStorage.removeItem('nhl_savant_daily_spins');
    }
  }
  
  // No valid data - full spins available
  return {
    remaining: SPINS_PER_DAY,
    used: 0,
    total: SPINS_PER_DAY,
    codesWon: []
  };
}

/**
 * Record a spin usage
 * @param {string} userId - Firebase user ID (null for anonymous)
 * @param {string} prizeCode - Promo code won
 * @returns {Promise<void>}
 */
export async function recordSpin(userId, prizeCode) {
  const today = getETDate();
  
  if (userId) {
    // Authenticated user: Save to Firestore
    try {
      const docRef = doc(db, 'user_spins', `${userId}_${today}`);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        // Update existing record
        const data = docSnap.data();
        await setDoc(docRef, {
          date: today,
          spinsUsed: (data.spinsUsed || 0) + 1,
          spinsTotal: SPINS_PER_DAY,
          codesWon: [...(data.codesWon || []), prizeCode],
          lastSpinAt: serverTimestamp()
        });
      } else {
        // Create new record
        await setDoc(docRef, {
          date: today,
          spinsUsed: 1,
          spinsTotal: SPINS_PER_DAY,
          codesWon: [prizeCode],
          lastSpinAt: serverTimestamp()
        });
      }
      
      console.log('✅ Recorded spin in Firestore:', prizeCode);
    } catch (error) {
      console.error('Error recording spin in Firestore:', error);
      // Fallback to localStorage
      recordSpinInLocalStorage(prizeCode);
    }
  } else {
    // Anonymous user: Save to localStorage
    recordSpinInLocalStorage(prizeCode);
  }
}

/**
 * Record spin in localStorage
 */
function recordSpinInLocalStorage(prizeCode) {
  const today = getETDate();
  const stored = localStorage.getItem('nhl_savant_daily_spins');
  
  let data = {
    date: today,
    spinsUsed: 0,
    codesWon: []
  };
  
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.date === today) {
        data = parsed;
      }
    } catch (error) {
      console.error('Error parsing localStorage spins:', error);
    }
  }
  
  data.spinsUsed = (data.spinsUsed || 0) + 1;
  data.codesWon = [...(data.codesWon || []), prizeCode];
  
  localStorage.setItem('nhl_savant_daily_spins', JSON.stringify(data));
  console.log('✅ Recorded spin in localStorage:', prizeCode);
}

/**
 * Check if user has spins available today
 * @param {string} userId - Firebase user ID (null for anonymous)
 * @returns {Promise<boolean>}
 */
export async function hasSpinsAvailable(userId) {
  const spinsData = await getDailySpins(userId);
  return spinsData.remaining > 0;
}

/**
 * Check and reset daily spins if needed (called on page load)
 * This automatically cleans up old localStorage data
 */
export function checkAndResetDaily() {
  const today = getETDate();
  const stored = localStorage.getItem('nhl_savant_daily_spins');
  
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.date !== today) {
        // Old data - remove it
        localStorage.removeItem('nhl_savant_daily_spins');
        console.log('🔄 Reset daily spins for new day');
      }
    } catch (error) {
      console.error('Error checking daily reset:', error);
      localStorage.removeItem('nhl_savant_daily_spins');
    }
  }
}

/**
 * Migrate anonymous spins to authenticated user (called after sign-in)
 * @param {string} userId - Firebase user ID
 */
export async function migrateAnonymousSpins(userId) {
  const today = getETDate();
  const stored = localStorage.getItem('nhl_savant_daily_spins');
  
  if (stored && userId) {
    try {
      const localData = JSON.parse(stored);
      
      // Only migrate if it's today's data
      if (localData.date === today && localData.spinsUsed > 0) {
        const docRef = doc(db, 'user_spins', `${userId}_${today}`);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          // Migrate to Firestore
          await setDoc(docRef, {
            date: today,
            spinsUsed: localData.spinsUsed,
            spinsTotal: SPINS_PER_DAY,
            codesWon: localData.codesWon || [],
            lastSpinAt: serverTimestamp(),
            migratedFrom: 'localStorage'
          });
          
          console.log('✅ Migrated anonymous spins to Firestore');
        }
      }
      
      // Clear localStorage after migration attempt
      localStorage.removeItem('nhl_savant_daily_spins');
    } catch (error) {
      console.error('Error migrating anonymous spins:', error);
    }
  }
}

