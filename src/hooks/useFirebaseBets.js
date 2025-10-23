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
    // Get today's date AND yesterday's date (for games that started yesterday but are still live)
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // ALWAYS use yesterday's date if before noon (games from previous night)
    // This matches the live scores logic which shows yesterday's games until 6 AM
    const currentHour = now.getHours();
    const dateToQuery = currentHour < 12 ? yesterdayStr : today;
    
    console.log(`📊 Fetching Firebase bets for ${dateToQuery} (current hour: ${currentHour}, today: ${today}, yesterday: ${yesterdayStr})`);
    
    // Simple query - just get all bets and filter in memory to avoid index issues
    const unsubscribe = onSnapshot(
      collection(db, 'bets'),
      (snapshot) => {
        const allBets = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(bet => bet.date === dateToQuery) // Filter for today's date
          .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)); // Sort by timestamp desc
        
        console.log(`✅ Loaded ${allBets.length} bets from Firebase for ${dateToQuery}`);
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

