import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Hook to fetch and subscribe to today's bets from Firebase
 * Returns bets that were recommended earlier (when odds were available)
 * so they can be displayed with live game scores
 */
export function useFirebaseBets() {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    console.log(`📊 Subscribing to Firebase bets for ${today}`);
    
    // Query for today's bets
    // Note: Removed orderBy to avoid needing composite index
    // Bets will be sorted in the component if needed
    const q = query(
      collection(db, 'bets'),
      where('date', '==', today)
    );
    
    // Real-time subscription
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedBets = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)); // Sort by timestamp desc
        
        console.log(`✅ Loaded ${fetchedBets.length} bets from Firebase for ${today}`);
        setBets(fetchedBets);
        setLoading(false);
      },
      (err) => {
        console.error('❌ Error fetching Firebase bets:', err);
        setError(err);
        setLoading(false);
      }
    );
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);
  
  return { bets, loading, error };
}

