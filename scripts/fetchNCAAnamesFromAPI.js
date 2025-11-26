/**
 * Fetch NCAA team names from the API for today's games
 * Helps populate the ncaa_name column in basketball_teams.csv
 */

// Fetch NCAA games
async function fetchNCAAgames() {
  const today = new Date();
  const date = today.toISOString().split('T')[0].replace(/-/g, '');
  
  try {
    const response = await fetch(`https://ncaa-api.henrygd.me/scoreboard/basketball-men/d1/${date}`);
    
    if (!response.ok) {
      throw new Error(`NCAA API error: ${response.status}`);
    }
    
    const data = await response.json();
    const games = data.games || [];
    
    console.log(`\n📊 Fetched ${games.length} games from NCAA API for ${date}\n`);
    console.log('=' .repeat(80));
    console.log('NCAA TEAM NAMES (use these in CSV ncaa_name column)');
    console.log('=' .repeat(80));
    
    // Extract unique team names
    const teamNames = new Set();
    
    games.forEach(game => {
      const homeTeam = game.home?.names?.short || game.home?.names?.full || '';
      const awayTeam = game.away?.names?.short || game.away?.names?.full || '';
      
      if (homeTeam) teamNames.add(homeTeam);
      if (awayTeam) teamNames.add(awayTeam);
    });
    
    // Sort and display
    const sorted = Array.from(teamNames).sort();
    sorted.forEach(name => {
      console.log(`  "${name}"`);
    });
    
    console.log('\n' + '=' .repeat(80));
    console.log(`Total unique teams: ${sorted.length}`);
    console.log('=' .repeat(80));
    
    // Show some sample games with full team info
    console.log('\n📋 SAMPLE GAMES (first 10):\n');
    games.slice(0, 10).forEach(game => {
      const away = game.away?.names?.short || '';
      const home = game.home?.names?.short || '';
      const status = game.gameState || 'pre';
      console.log(`  ${away} @ ${home} (${status})`);
    });
    
  } catch (error) {
    console.error('Error fetching NCAA games:', error);
  }
}

fetchNCAAgames();


