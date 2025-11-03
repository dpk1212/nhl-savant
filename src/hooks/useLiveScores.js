import { useEffect, useState } from 'react';

/**
 * Hook to fetch live NHL scores DIRECTLY from NHL API
 * 
 * Polls NHL API every 30 seconds for truly live updates
 * No intermediate storage required - zero cost, truly real-time!
 * 
 * @returns {Object} { scores, loading, lastUpdate }
 */
export function useLiveScores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  const fetchScores = async () => {
    try {
      // CRITICAL FIX: Use LOCAL date, not UTC date
      // UTC date can be a day ahead when it's evening in North America
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const today = `${year}-${month}-${day}`;
      console.log(`📊 Fetching live scores from NHL API for ${today} (LOCAL time)...`);
      
      // Use CORS proxy to bypass browser restrictions
      const corsProxy = 'https://corsproxy.io/?';
      const nhlApiUrl = `https://api-web.nhle.com/v1/schedule/${today}`;
      const response = await fetch(`${corsProxy}${encodeURIComponent(nhlApiUrl)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const gameWeek = data.gameWeek || [];
      const games = gameWeek[0]?.games || [];
      
      // Process games into our format
      const processedGames = await Promise.all(games.map(async (game) => {
        const gameData = {
          date: today,
          gameId: game.id,
          awayTeam: game.awayTeam.abbrev,
          homeTeam: game.homeTeam.abbrev,
          awayScore: game.awayTeam.score || 0,
          homeScore: game.homeTeam.score || 0,
          totalScore: (game.awayTeam.score || 0) + (game.homeTeam.score || 0),
          gameState: game.gameState || 'FUT',
          period: game.periodDescriptor?.number || 0,
          periodDescriptor: game.periodDescriptor?.periodType || '',
          clock: '',
          gameTime: game.startTimeUTC || '',
          lastUpdate: new Date().toISOString()
        };
        
        // Determine status
        if (['OFF', 'FINAL', 'CRIT'].includes(gameData.gameState)) {
          gameData.status = 'FINAL';
        } else if (gameData.gameState === 'LIVE') {
          gameData.status = 'LIVE';
          // Fetch detailed clock data for LIVE games
          await fetchLiveGameDetails(gameData);
        } else if (['FUT', 'PRE'].includes(gameData.gameState)) {
          gameData.status = 'SCHEDULED';
        } else {
          gameData.status = 'UNKNOWN';
        }
        
        return gameData;
      }));
      
      setScores(processedGames);
      setLastUpdate(new Date().toISOString());
      console.log(`✅ Live scores updated: ${processedGames.length} games`);
      processedGames.forEach(game => {
        console.log(`   📊 ${game.awayTeam} @ ${game.homeTeam}: ${game.status} (${game.awayScore}-${game.homeScore})`);
      });
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching live scores:', error);
      console.error('Error details:', error.message);
      setLoading(false);
    }
  };
  
  // Fetch detailed live game data including clock
  const fetchLiveGameDetails = async (gameData) => {
    try {
      const corsProxy = 'https://corsproxy.io/?';
      const url = `https://api-web.nhle.com/v1/gamecenter/${gameData.gameId}/play-by-play`;
      const response = await fetch(`${corsProxy}${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        console.warn(`⚠️  Could not fetch live details for game ${gameData.gameId}`);
        return;
      }
      
      const data = await response.json();
      
      // Update period and clock from detailed data
      if (data.periodDescriptor) {
        gameData.period = data.periodDescriptor.number || gameData.period;
        gameData.periodDescriptor = data.periodDescriptor.periodType || gameData.periodDescriptor;
      }
      
      if (data.clock) {
        gameData.clock = data.clock.timeRemaining || '';
      }
    } catch (error) {
      console.warn(`⚠️  Error fetching live game details: ${error.message}`);
    }
  };
  
  useEffect(() => {
    // Fetch immediately on mount
    fetchScores();
    
    // Then poll every 30 seconds for truly live updates
    const interval = setInterval(fetchScores, 30000);
    
    return () => {
      console.log('Stopping live scores polling');
      clearInterval(interval);
    };
  }, []);
  
  return { scores, loading, lastUpdate };
}

