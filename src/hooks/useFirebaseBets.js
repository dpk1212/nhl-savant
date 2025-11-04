import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getETDate, getETYesterday } from '../utils/dateUtils';

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
    // CRITICAL FIX: Use ET dates to match bet tracker dates
    // Get last 2 days of bets (covers all edge cases with timezones)
    const today = getETDate();
    const yesterdayStr = getETYesterday();
    
    console.log(`📊 Fetching Firebase bets for ${yesterdayStr} AND ${today} (ET)`);
    
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

