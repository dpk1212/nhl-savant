import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Hook to subscribe to live NHL scores from Firestore
 * 
 * Firebase Function updates scores every 5 minutes
 * This hook provides real-time updates to React components
 * 
 * @returns {Object} { scores, loading, lastUpdate }
 */
export function useLiveScores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  useEffect(() => {
    console.log('📊 Subscribing to live scores from Firestore...');
    
    const unsubscribe = onSnapshot(
      doc(db, 'live_scores', 'current'),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setScores(data.games || []);
          setLastUpdate(data.lastUpdate);
          console.log(`✅ Live scores updated: ${data.gamesCount} games`);
        } else {
          console.log('No live scores document found');
          setScores([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching live scores:', error);
        setLoading(false);
      }
    );
    
    return () => {
      console.log('Unsubscribing from live scores');
      unsubscribe();
    };
  }, []);
  
  return { scores, loading, lastUpdate };
}

