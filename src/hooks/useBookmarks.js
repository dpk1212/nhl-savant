import { useState, useEffect, useCallback } from 'react';
import { 
  subscribeToBookmarks, 
  bookmarkPick, 
  removeBookmark, 
  isBookmarked as checkIsBookmarked,
  getAnonymousUserId 
} from '../services/bookmarkService';

/**
 * React hook for managing user bookmarks
 * Provides real-time sync with Firestore and bookmark management functions
 */
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Subscribe to real-time bookmark updates
  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = subscribeToBookmarks((updatedBookmarks) => {
      setBookmarks(updatedBookmarks);
      setLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
  /**
   * Toggle bookmark for a pick
   * @param {Object} betData - Complete bet data
   */
  const toggleBookmark = useCallback(async (betData) => {
    try {
      const isCurrentlyBookmarked = checkIsBookmarked(betData.betId, bookmarks);
      
      if (isCurrentlyBookmarked) {
        await removeBookmark(betData.betId);
      } else {
        await bookmarkPick(betData);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      setError(err);
    }
  }, [bookmarks]);
  
  /**
   * Check if a specific bet is bookmarked
   * @param {string} betId - The bet ID to check
   */
  const isBookmarked = useCallback((betId) => {
    return checkIsBookmarked(betId, bookmarks);
  }, [bookmarks]);
  
  /**
   * Get user ID
   */
  const userId = getAnonymousUserId();
  
  return {
    bookmarks,
    loading,
    error,
    toggleBookmark,
    isBookmarked,
    userId,
    bookmarkCount: bookmarks.length
  };
}

