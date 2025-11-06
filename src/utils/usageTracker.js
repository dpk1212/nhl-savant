import { doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getETDate } from './dateUtils';

/**
 * Usage Tracker for managing daily free tier limits
 * Tracks game card views and hot take views per day
 */

/**
 * Get usage document for today
 */
async function getUsageDoc(userId) {
  if (!userId) {
    // For anonymous users, use localStorage
    const today = getETDate();
    const storageKey = `usage_${today}`;
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : {
      date: today,
      gameCardsViewed: [],
      hotTakesViewed: [],
      count: 0
    };
  }

  try {
    const today = getETDate();
    const usageRef = doc(db, 'user_usage', `${userId}_${today}`);
    const usageDoc = await getDoc(usageRef);

    if (usageDoc.exists()) {
      return usageDoc.data();
    }

    // Create new usage document for today
    const initialData = {
      userId,
      date: today,
      gameCardsViewed: [],
      hotTakesViewed: [],
      count: 0,
      createdAt: serverTimestamp()
    };

    await setDoc(usageRef, initialData);
    return initialData;
  } catch (error) {
    console.error('Error getting usage document:', error);
    return {
      date: getETDate(),
      gameCardsViewed: [],
      hotTakesViewed: [],
      count: 0
    };
  }
}

/**
 * Track a game card view
 */
export async function trackGameCardView(userId, gameId) {
  const today = getETDate();

  if (!userId) {
    // Anonymous user - use localStorage
    const storageKey = `usage_${today}`;
    const usage = JSON.parse(localStorage.getItem(storageKey) || '{"gameCardsViewed":[],"hotTakesViewed":[],"count":0}');
    
    if (!usage.gameCardsViewed.includes(gameId)) {
      usage.gameCardsViewed.push(gameId);
      usage.count = usage.gameCardsViewed.length + usage.hotTakesViewed.length;
      usage.date = today;
      localStorage.setItem(storageKey, JSON.stringify(usage));
    }
    
    return usage;
  }

  try {
    const usageRef = doc(db, 'user_usage', `${userId}_${today}`);
    const usageDoc = await getDoc(usageRef);

    if (!usageDoc.exists()) {
      // Create new document
      const data = {
        userId,
        date: today,
        gameCardsViewed: [gameId],
        hotTakesViewed: [],
        count: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(usageRef, data);
      return data;
    }

    const data = usageDoc.data();
    
    // Check if already viewed
    if (data.gameCardsViewed?.includes(gameId)) {
      return data;
    }

    // Add to viewed list
    await updateDoc(usageRef, {
      gameCardsViewed: arrayUnion(gameId),
      count: (data.gameCardsViewed?.length || 0) + 1 + (data.hotTakesViewed?.length || 0),
      updatedAt: serverTimestamp()
    });

    return {
      ...data,
      gameCardsViewed: [...(data.gameCardsViewed || []), gameId],
      count: (data.gameCardsViewed?.length || 0) + 1 + (data.hotTakesViewed?.length || 0)
    };
  } catch (error) {
    console.error('Error tracking game card view:', error);
    return { gameCardsViewed: [], hotTakesViewed: [], count: 0 };
  }
}

/**
 * Track a hot take view
 */
export async function trackHotTakeView(userId, gameId) {
  const today = getETDate();

  if (!userId) {
    // Anonymous user - use localStorage
    const storageKey = `usage_${today}`;
    const usage = JSON.parse(localStorage.getItem(storageKey) || '{"gameCardsViewed":[],"hotTakesViewed":[],"count":0}');
    
    if (!usage.hotTakesViewed.includes(gameId)) {
      usage.hotTakesViewed.push(gameId);
      usage.count = usage.gameCardsViewed.length + usage.hotTakesViewed.length;
      usage.date = today;
      localStorage.setItem(storageKey, JSON.stringify(usage));
    }
    
    return usage;
  }

  try {
    const usageRef = doc(db, 'user_usage', `${userId}_${today}`);
    const usageDoc = await getDoc(usageRef);

    if (!usageDoc.exists()) {
      // Create new document
      const data = {
        userId,
        date: today,
        gameCardsViewed: [],
        hotTakesViewed: [gameId],
        count: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(usageRef, data);
      return data;
    }

    const data = usageDoc.data();
    
    // Check if already viewed
    if (data.hotTakesViewed?.includes(gameId)) {
      return data;
    }

    // Add to viewed list
    await updateDoc(usageRef, {
      hotTakesViewed: arrayUnion(gameId),
      count: (data.gameCardsViewed?.length || 0) + (data.hotTakesViewed?.length || 0) + 1,
      updatedAt: serverTimestamp()
    });

    return {
      ...data,
      hotTakesViewed: [...(data.hotTakesViewed || []), gameId],
      count: (data.gameCardsViewed?.length || 0) + (data.hotTakesViewed?.length || 0) + 1
    };
  } catch (error) {
    console.error('Error tracking hot take view:', error);
    return { gameCardsViewed: [], hotTakesViewed: [], count: 0 };
  }
}

/**
 * Get usage for today
 */
export async function getUsageForToday(userId) {
  return await getUsageDoc(userId);
}

/**
 * Check if user has reached daily limit
 */
export async function hasReachedDailyLimit(userId, type = 'gameCard') {
  const usage = await getUsageDoc(userId);
  
  if (type === 'gameCard') {
    return (usage.gameCardsViewed?.length || 0) >= 1;
  } else if (type === 'hotTake') {
    return (usage.hotTakesViewed?.length || 0) >= 1;
  }
  
  return false;
}

/**
 * Check if specific game has been viewed today
 */
export async function hasViewedToday(userId, gameId, type = 'gameCard') {
  const usage = await getUsageDoc(userId);
  
  if (type === 'gameCard') {
    return usage.gameCardsViewed?.includes(gameId) || false;
  } else if (type === 'hotTake') {
    return usage.hotTakesViewed?.includes(gameId) || false;
  }
  
  return false;
}

/**
 * Reset usage (for testing)
 */
export function resetUsage() {
  const today = getETDate();
  const storageKey = `usage_${today}`;
  localStorage.removeItem(storageKey);
  console.log('Usage reset for today');
}

