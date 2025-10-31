import { useEffect, useState } from 'react';

/**
 * Hook to fetch live NHL scores from JSON file
 * 
 * updateLiveScores.js script updates the JSON file every 5 minutes
 * This hook polls the file periodically for updates
 * 
 * @returns {Object} { scores, loading, lastUpdate }
 */
export function useLiveScores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  const fetchScores = async () => {
    try {
      console.log('📊 Fetching live scores from JSON...');
      
      // Add cache-busting query parameter to force fresh data
      const cacheBuster = Date.now();
      const response = await fetch(`/live_scores.json?_=${cacheBuster}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setScores(data.games || []);
      setLastUpdate(data.lastUpdate);
      console.log(`✅ Live scores updated: ${data.gamesCount} games`);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching live scores:', error);
      // Don't overwrite existing scores on error
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Fetch immediately on mount
    fetchScores();
    
    // Then poll every 30 seconds for updates
    const interval = setInterval(fetchScores, 30000);
    
    return () => {
      console.log('Stopping live scores polling');
      clearInterval(interval);
    };
  }, []);
  
  return { scores, loading, lastUpdate };
}

