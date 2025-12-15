/**
 * Resolve OLD basketball bets using NCAA API historical data
 * Fetches scores for past dates and grades pending bets
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// NCAA API via Firebase proxy
const NCAA_PROXY_URL = 'https://ncaaproxy-lviwud3q2q-uc.a.run.app';

// Initialize Firebase Admin
try {
  const serviceAccountPath = join(__dirname, '..', 'serviceAccountKey.json');
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('✅ Firebase Admin initialized');
} catch (error) {
  console.error('❌ Error loading service account key:', error.message);
  process.exit(1);
}

const db = admin.firestore();

// Load team mappings
function loadTeamMappings() {
  const csvPath = join(__dirname, '..', 'public', 'basketball_teams.csv');
  const csvContent = readFileSync(csvPath, 'utf8');
  const parsed = Papa.parse(csvContent, { header: true });
  
  const mappings = new Map();
  parsed.data.forEach(row => {
    if (row.normalized_name) {
      mappings.set(row.normalized_name.toLowerCase(), row);
    }
  });
  
  console.log(`📋 Loaded ${mappings.size} team mappings`);
  return mappings;
}

// Fetch NCAA games for a specific date
async function fetchNCAAGames(date) {
  try {
    const response = await fetch(`${NCAA_PROXY_URL}?date=${date}`);
    if (!response.ok) throw new Error(`NCAA API error: ${response.status}`);
    
    const data = await response.json();
    const games = data.games || [];
    
    return games.map(game => {
      const gameData = game.game || {};
      
      // NCAA API has away/home REVERSED!
      const homeTeam = gameData.away || {};
      const awayTeam = gameData.home || {};
      
      return {
        id: gameData.gameID,
        status: gameData.gameState, // 'pre', 'live', 'final'
        awayTeam: awayTeam.names?.short || awayTeam.names?.full || '',
        homeTeam: homeTeam.names?.short || homeTeam.names?.full || '',
        awayScore: parseInt(awayTeam.score) || 0,
        homeScore: parseInt(homeTeam.score) || 0,
      };
    });
  } catch (error) {
    console.error(`NCAA API failed for ${date}:`, error.message);
    return [];
  }
}

// Fuzzy team name matching
function teamNamesMatch(name1, name2) {
  if (!name1 || !name2) return false;
  
  const normalize = (str) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/\buniversity\b/g, '')
      .replace(/\bcollege\b/g, '')
      .replace(/\bof\b/g, '')
      .replace(/\bthe\b/g, '')
      .replace(/\bstate\b/g, 'st')
      .replace(/\bsaint\b/g, 'st')
      .replace(/\bst\./g, 'st')
      .replace(/[^a-z0-9]/g, '');
  };
  
  const norm1 = normalize(name1);
  const norm2 = normalize(name2);
  
  if (norm1 === norm2) return true;
  if (norm1.length >= 4 && norm2.length >= 4) {
    if (norm1.includes(norm2) || norm2.includes(norm1)) return true;
  }
  
  return false;
}

// Find team in mappings - EXACT matches first, then fuzzy
function findTeamInMappings(mappings, teamName) {
  const searchName = teamName.toLowerCase().trim();
  
  // PASS 1: Exact match on oddstrader_name (primary source for bet teams)
  for (const [normalized, mapping] of mappings) {
    const oddstraderName = mapping.oddstrader_name;
    if (oddstraderName && oddstraderName.toLowerCase().trim() === searchName) {
      return mapping;
    }
  }
  
  // PASS 2: Exact match on normalized_name
  for (const [normalized, mapping] of mappings) {
    const normalizedName = mapping.normalized_name;
    if (normalizedName && normalizedName.toLowerCase().trim() === searchName) {
      return mapping;
    }
  }
  
  // PASS 3: Fuzzy match (last resort)
  for (const [normalized, mapping] of mappings) {
    if (teamNamesMatch(searchName, mapping.normalized_name || '')) {
      return mapping;
    }
  }
  
  return null;
}

// Calculate profit
function calculateProfit(outcome, odds, units) {
  if (outcome === 'PUSH') return 0;
  if (outcome === 'LOSS') return -units;
  
  // WIN
  if (odds < 0) {
    return units * (100 / Math.abs(odds));
  } else {
    return units * (odds / 100);
  }
}

// Main function
async function resolveOldBets() {
  console.log('\n🔧 RESOLVING OLD BASKETBALL BETS');
  console.log('='.repeat(70));
  
  const teamMappings = loadTeamMappings();
  
  // Fetch all PENDING basketball bets
  const pendingBetsSnapshot = await db.collection('basketball_bets')
    .where('status', '==', 'PENDING')
    .get();
  
  console.log(`\n📊 Found ${pendingBetsSnapshot.size} pending bets\n`);
  
  if (pendingBetsSnapshot.empty) {
    console.log('No pending bets to resolve!');
    return;
  }
  
  // Group bets by date
  const betsByDate = new Map();
  pendingBetsSnapshot.docs.forEach(doc => {
    const bet = doc.data();
    const date = bet.date; // e.g., "2025-12-02"
    
    if (!betsByDate.has(date)) {
      betsByDate.set(date, []);
    }
    betsByDate.get(date).push({ id: doc.id, ...bet });
  });
  
  console.log(`📅 Bets span ${betsByDate.size} dates`);
  
  let totalResolved = 0;
  let totalSkipped = 0;
  
  // Process each date
  for (const [date, bets] of betsByDate) {
    // Convert date format: 2025-12-02 -> 20251202
    const apiDate = date.replace(/-/g, '');
    
    console.log(`\n📅 Processing ${date} (${bets.length} bets)...`);
    
    const ncaaGames = await fetchNCAAGames(apiDate);
    const finalGames = ncaaGames.filter(g => g.status === 'final');
    
    console.log(`   Found ${finalGames.length} FINAL games from NCAA API`);
    
    if (finalGames.length === 0) {
      console.log(`   ⚠️ No final games found for ${date} - skipping`);
      totalSkipped += bets.length;
      continue;
    }
    
    for (const bet of bets) {
      // Get team names from bet
      const betAwayTeam = bet.game?.awayTeam || bet.teams?.away || '';
      const betHomeTeam = bet.game?.homeTeam || bet.teams?.home || '';
      const betTeam = bet.bet?.team || '';
      
      // Find mapping for our teams
      const awayMapping = findTeamInMappings(teamMappings, betAwayTeam);
      const homeMapping = findTeamInMappings(teamMappings, betHomeTeam);
      
      if (!awayMapping || !homeMapping) {
        console.log(`   ⚠️ No mapping for ${betAwayTeam} @ ${betHomeTeam}`);
        totalSkipped++;
        continue;
      }
      
      const expectedAwayNCAA = awayMapping.ncaa_name;
      const expectedHomeNCAA = homeMapping.ncaa_name;
      
      // Find matching game
      const matchingGame = finalGames.find(g => {
        const awayMatch = teamNamesMatch(g.awayTeam, expectedAwayNCAA);
        const homeMatch = teamNamesMatch(g.homeTeam, expectedHomeNCAA);
        const reversedAwayMatch = teamNamesMatch(g.awayTeam, expectedHomeNCAA);
        const reversedHomeMatch = teamNamesMatch(g.homeTeam, expectedAwayNCAA);
        
        return (awayMatch && homeMatch) || (reversedAwayMatch && reversedHomeMatch);
      });
      
      if (!matchingGame) {
        console.log(`   ⚠️ No match for ${betAwayTeam} @ ${betHomeTeam}`);
        console.log(`      Looking for: ${expectedAwayNCAA} @ ${expectedHomeNCAA}`);
        totalSkipped++;
        continue;
      }
      
      // Map scores to correct teams
      let ourAwayScore, ourHomeScore;
      
      if (teamNamesMatch(matchingGame.awayTeam, expectedAwayNCAA)) {
        ourAwayScore = matchingGame.awayScore;
        ourHomeScore = matchingGame.homeScore;
      } else {
        ourAwayScore = matchingGame.homeScore;
        ourHomeScore = matchingGame.awayScore;
      }
      
      // Determine winner
      const awayWin = ourAwayScore > ourHomeScore;
      const homeWin = ourHomeScore > ourAwayScore;
      
      // Determine outcome based on bet side
      let outcome;
      const betSide = bet.bet?.side || '';
      
      if (betSide === 'AWAY' || betSide.toLowerCase().includes('away')) {
        outcome = awayWin ? 'WIN' : 'LOSS';
      } else if (betSide === 'HOME' || betSide.toLowerCase().includes('home')) {
        outcome = homeWin ? 'WIN' : 'LOSS';
      } else {
        // Try to determine from bet team name
        const betTeamMapping = findTeamInMappings(teamMappings, betTeam);
        if (betTeamMapping) {
          const betTeamIsAway = teamNamesMatch(betTeamMapping.ncaa_name, expectedAwayNCAA);
          outcome = betTeamIsAway ? (awayWin ? 'WIN' : 'LOSS') : (homeWin ? 'WIN' : 'LOSS');
        } else {
          console.log(`   ⚠️ Cannot determine bet side for ${bet.id}`);
          totalSkipped++;
          continue;
        }
      }
      
      // Calculate profit
      const units = bet.prediction?.unitSize || bet.bet?.unitSize || 1;
      const odds = bet.bet?.odds || -110;
      const profit = calculateProfit(outcome, odds, units);
      
      // Update Firebase
      try {
        await db.collection('basketball_bets').doc(bet.id).update({
          'result.awayScore': ourAwayScore,
          'result.homeScore': ourHomeScore,
          'result.totalScore': ourAwayScore + ourHomeScore,
          'result.winner': awayWin ? 'AWAY' : 'HOME',
          'result.outcome': outcome,
          'result.profit': profit,
          'result.units': units,
          'result.fetched': true,
          'result.fetchedAt': admin.firestore.FieldValue.serverTimestamp(),
          'result.source': 'NCAA_HISTORICAL',
          'status': 'COMPLETED'
        });
        
        console.log(`   ✅ ${betAwayTeam} @ ${betHomeTeam}: ${ourAwayScore}-${ourHomeScore} → ${outcome} (${profit >= 0 ? '+' : ''}${profit.toFixed(2)}u)`);
        totalResolved++;
      } catch (updateError) {
        console.log(`   ❌ Failed to update ${bet.id}: ${updateError.message}`);
        totalSkipped++;
      }
    }
    
    // Small delay between dates to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('📊 RESOLUTION SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Resolved: ${totalResolved}`);
  console.log(`⏭️  Skipped: ${totalSkipped}`);
  console.log('='.repeat(70));
}

// Run the script
resolveOldBets()
  .then(() => {
    console.log('\n✅ Script completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

