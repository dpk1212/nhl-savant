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
    // Get last 2 days of bets (covers all edge cases with timezones)
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    console.log(`📊 Fetching Firebase bets for ${yesterdayStr} AND ${today}`);
    
    // Simple query - get all recent bets and filter in memory
    const unsubscribe = onSnapshot(
      collection(db, 'bets'),
      (snapshot) => {
        const allBets = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(bet => bet.date === today || bet.date === yesterdayStr) // Last 2 days
          .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        
        console.log(`✅ Loaded ${allBets.length} bets from Firebase`);
        console.log('Dates found:', [...new Set(allBets.map(b => b.date))]);
        console.log('Bets:', allBets.map(b => `${b.date}: ${b.game?.awayTeam} @ ${b.game?.homeTeam}`));
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

