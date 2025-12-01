/**
 * Fetch NCAA API to see exact team names returned
 */

async function testNCAANames() {
  console.log('\n🔍 FETCHING NCAA API TEAM NAMES\n');
  
  try {
    const response = await fetch('https://ncaaproxy-lviwud3q2q-uc.a.run.app/scoreboard/basketball-men/d1/20251201');
    const data = await response.json();
    
    console.log(`✅ Fetched ${data.games?.length || 0} games from NCAA API\n`);
    console.log('═'.repeat(80));
    console.log('TEAM NAMES FROM NCAA API:');
    console.log('═'.repeat(80));
    
    if (data.games) {
      data.games.forEach((game, i) => {
        const gameData = game.game || {};
        // NCAA API has away/home reversed
        const homeTeam = gameData.away || {};
        const awayTeam = gameData.home || {};
        
        const awayShort = awayTeam.names?.short || 'N/A';
        const homeShort = homeTeam.names?.short || 'N/A';
        
        console.log(`\n${i + 1}. ${awayShort} @ ${homeShort}`);
        console.log(`   Away: "${awayShort}"`);
        console.log(`   Home: "${homeShort}"`);
      });
    }
    
    console.log('\n');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testNCAANames();

