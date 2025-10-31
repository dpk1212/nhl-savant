/**
 * Parse MoneyPuck scrape to extract starting goalies
 * Temporary script to update starting_goalies.json from user-provided scrape
 */

import { readFileSync, writeFileSync } from 'fs';

console.log('🥅 Parsing MoneyPuck Goalie Data\n');

// Read the MoneyPuck scrape
const scrapePath = '/Users/dalekolnitys/Downloads/72bc7d7a-91d7-46b0-8a1f-984f8fa8ece8.md';
const markdown = readFileSync(scrapePath, 'utf-8');

console.log(`📄 Read ${markdown.length} characters from scrape\n`);

const games = [];
const lines = markdown.split('\n');

// Look for lines with game data (contain PM ET and team logos)
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Check if line contains game time and team logos
  if (line.includes('PM ET') && line.includes('peter-tanner.com/moneypuck/logos/')) {
    // Extract team codes from logo URLs
    const teamMatches = [...line.matchAll(/logos\/([A-Z]{2,3})\.png/g)];
    
    if (teamMatches.length >= 2) {
      const awayTeam = teamMatches[0][1];
      const homeTeam = teamMatches[1][1];
      
      let awayGoalie = null;
      let homeGoalie = null;
      
      // Find all "Starter:" mentions
      const starterRegex = /Starter:\s*([A-Za-z\-\'\s]+?)\\?\*\*/g;
      let match;
      
      while ((match = starterRegex.exec(line)) !== null) {
        const goalieName = match[1].trim();
        const position = match.index;
        
        // Find position of team logos
        const awayLogoPos = line.indexOf(`logos/${awayTeam}.png`);
        const homeLogoPos = line.indexOf(`logos/${homeTeam}.png`);
        
        // Determine which team the goalie belongs to based on position
        if (position < awayLogoPos) {
          awayGoalie = goalieName;
        } else if (position > homeLogoPos) {
          homeGoalie = goalieName;
        }
      }
      
      games.push({
        gameId: `game_${games.length}`,
        matchup: `${awayTeam} @ ${homeTeam}`,
        time: 'TBD',
        away: {
          team: awayTeam,
          goalie: awayGoalie
        },
        home: {
          team: homeTeam,
          goalie: homeGoalie
        }
      });
      
      console.log(`✅ ${awayTeam} @ ${homeTeam}`);
      console.log(`   Away: ${awayGoalie || 'TBD'}`);
      console.log(`   Home: ${homeGoalie || 'TBD'}\n`);
    }
  }
}

// Create the JSON structure
const goaliesData = {
  date: '2025-10-30',
  lastUpdated: new Date().toISOString(),
  games: games
};

// Write to file
writeFileSync(
  'public/starting_goalies.json',
  JSON.stringify(goaliesData, null, 2),
  'utf-8'
);

console.log(`\n✅ Updated starting_goalies.json with ${games.length} games`);
console.log(`📅 Date: October 30, 2025`);

let confirmedCount = 0;
games.forEach(game => {
  if (game.away.goalie) confirmedCount++;
  if (game.home.goalie) confirmedCount++;
});

console.log(`🥅 Goalies: ${confirmedCount}/${games.length * 2} confirmed\n`);

