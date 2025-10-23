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
    // Get today's date in local timezone (not UTC)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;
    
    console.log(`📊 Fetching Firebase bets for ${today} (local date)`);
    
    // Simple query - just get all bets and filter in memory to avoid index issues
    const unsubscribe = onSnapshot(
      collection(db, 'bets'),
      (snapshot) => {
        const allBets = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(bet => bet.date === today) // Filter for today's date (local timezone)
          .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)); // Sort by timestamp desc
        
        console.log(`✅ Loaded ${allBets.length} bets from Firebase for ${today}`);
        console.log('Bets:', allBets.map(b => `${b.game?.awayTeam} @ ${b.game?.homeTeam}`));
        setBets(allBets);
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

