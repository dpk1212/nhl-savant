/**
 * Grade Yesterday's Basketball Bets
 * Simple script to manually grade bets from 11/24/2025
 */

console.log('\n🏀 Grading Yesterday\'s (11/24/2025) Basketball Bets\n');
console.log('='.repeat(60));

const date = '2025-11-24';
const formattedDate = date.replace(/-/g, '');

// Fetch NCAA games
console.log(`\n📡 Fetching NCAA games for ${date}...`);
const url = `https://ncaa-api.henrygd.me/scoreboard/basketball-men/d1/${formattedDate}`;

try {
  const response = await fetch(url);
  
  if (!response.ok) {
    console.error(`\n❌ NCAA API Error: ${response.status}`);
    process.exit(1);
  }
  
  const data = await response.json();
  const games = data.games || [];
  
  const finalGames = games
    .filter(g => g.game.gameState === 'final')
    .map(g => ({
      awayTeam: g.game.away.names.short,
      homeTeam: g.game.home.names.short,
      awayScore: parseInt(g.game.away.score) || 0,
      homeScore: parseInt(g.game.home.score) || 0,
    }));
  
  console.log(`✅ Found ${games.length} total games`);
  console.log(`🎯 Found ${finalGames.length} FINAL games\n`);
  
  if (finalGames.length === 0) {
    console.log('❌ No final games found for yesterday. Games may not have completed.');
    process.exit(0);
  }
  
  // Display final games
  console.log('📊 Final Games from 11/24:\n');
  finalGames.slice(0, 10).forEach((game, i) => {
    const winner = game.awayScore > game.homeScore ? game.awayTeam : game.homeTeam;
    console.log(`   ${i + 1}. ${game.awayTeam} ${game.awayScore} - ${game.homeScore} ${game.homeTeam} (${winner} won)`);
  });
  
  if (finalGames.length > 10) {
    console.log(`   ... and ${finalGames.length - 10} more games\n`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Ready to grade! Now triggering Cloud Function...\n');
  
  // Trigger the Cloud Function to grade all pending bets
  const gradingResponse = await fetch('https://triggerbasketballbetgrading-lviwud3q2q-uc.a.run.app');
  
  if (gradingResponse.ok) {
    const result = await gradingResponse.text();
    console.log(`✅ ${result}`);
    console.log('\n💡 Check your Basketball page - bets from 11/24 should now be graded!');
  } else {
    console.error(`\n❌ Grading failed: ${gradingResponse.status}`);
  }
  
} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
}

