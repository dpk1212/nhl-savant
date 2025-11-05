import { collection, addDoc, deleteDoc, doc, query, where, getDocs, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

// Generate or retrieve anonymous user ID
export function getAnonymousUserId() {
  const STORAGE_KEY = 'nhl_savant_user_id';
  let userId = localStorage.getItem(STORAGE_KEY);
  
  if (!userId) {
    // Generate a new anonymous user ID
    userId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(STORAGE_KEY, userId);
    console.log('🆔 Generated new anonymous user ID:', userId);
  }
  
  return userId;
}

// Generate a unique bookmark ID
function generateBookmarkId(userId, betId) {
  return `${userId}_${betId}`;
}

/**
 * Bookmark a pick
 * @param {Object} betData - Complete bet data including game and bet info
 * @returns {Promise<string>} - Bookmark document ID
 */
export async function bookmarkPick(betData) {
  const userId = getAnonymousUserId();
  const bookmarkId = generateBookmarkId(userId, betData.betId);
  
  const bookmarkData = {
    id: bookmarkId,
    userId,
    betId: betData.betId,
    bookmarkedAt: Date.now(),
    
    // Game info
    game: {
      awayTeam: betData.game.awayTeam,
      homeTeam: betData.game.homeTeam,
      gameTime: betData.game.gameTime,
      gameDate: betData.game.gameDate || betData.betId.split('_')[0]
    },
    
    // Bet info
    bet: {
      market: betData.bet.market,
      pick: betData.bet.pick,
      odds: betData.bet.odds,
      evPercent: betData.bet.evPercent,
      rating: betData.bet.rating,
      team: betData.bet.team || null
    }
  };
  
  try {
    // Use custom ID to prevent duplicates
    await addDoc(collection(db, 'user_bookmarks'), bookmarkData);
    console.log('✅ Bookmarked pick:', bookmarkId);
    return bookmarkId;
  } catch (error) {
    console.error('❌ Error bookmarking pick:', error);
    throw error;
  }
}

/**
 * Remove a bookmark
 * @param {string} betId - The bet ID to remove
 * @returns {Promise<void>}
 */
export async function removeBookmark(betId) {
  const userId = getAnonymousUserId();
  
  try {
    // Query for the bookmark
    const q = query(
      collection(db, 'user_bookmarks'),
      where('userId', '==', userId),
      where('betId', '==', betId)
    );
    
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      // Delete all matching bookmarks (should be only one)
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log('🗑️ Removed bookmark:', betId);
    }
  } catch (error) {
    console.error('❌ Error removing bookmark:', error);
    throw error;
  }
}

/**
 * Get all bookmarks for the current user
 * @returns {Promise<Array>} - Array of bookmark objects
 */
export async function getUserBookmarks() {
  const userId = getAnonymousUserId();
  
  try {
    const q = query(
      collection(db, 'user_bookmarks'),
      where('userId', '==', userId),
      orderBy('bookmarkedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const bookmarks = snapshot.docs.map(doc => ({
      docId: doc.id,
      ...doc.data()
    }));
    
    console.log(`📚 Loaded ${bookmarks.length} bookmarks`);
    return bookmarks;
  } catch (error) {
    console.error('❌ Error fetching bookmarks:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time bookmark updates
 * @param {Function} callback - Callback function that receives updated bookmarks array
 * @returns {Function} - Unsubscribe function
 */
export function subscribeToBookmarks(callback) {
  const userId = getAnonymousUserId();
  
  const q = query(
    collection(db, 'user_bookmarks'),
    where('userId', '==', userId),
    orderBy('bookmarkedAt', 'desc')
  );
  
  return onSnapshot(
    q,
    (snapshot) => {
      const bookmarks = snapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data()
      }));
      callback(bookmarks);
    },
    (error) => {
      console.error('❌ Error in bookmark subscription:', error);
    }
  );
}

/**
 * Check if a specific bet is bookmarked
 * @param {string} betId - The bet ID to check
 * @param {Array} bookmarks - Array of current bookmarks
 * @returns {boolean}
 */
export function isBookmarked(betId, bookmarks) {
  return bookmarks.some(bookmark => bookmark.betId === betId);
}

