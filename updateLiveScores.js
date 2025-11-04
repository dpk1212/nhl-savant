#!/usr/bin/env node
/**
 * NHL Live Score Updater (Node.js version)
 * =========================================
 * Fetches live scores from NHL API and updates BOTH JSON file AND Firebase.
 * Does NOT rescrape odds - only updates scores 2-3 times during game time.
 * 
 * Usage:
 *   node updateLiveScores.js                    # Update today's games
 *   node updateLiveScores.js --date 2025-10-23  # Specific date
 *   node updateLiveScores.js --continuous       # Run every 5 minutes
 * 
 * No additional dependencies needed - uses built-in fetch & fs
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin SDK (simplified service account like generateExpertAnalysis.js)
const serviceAccount = {
  project_id: process.env.VITE_FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

// Initialize Firebase if credentials are available
if (!admin.apps.length && serviceAccount.project_id && serviceAccount.client_email && serviceAccount.private_key) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.warn('⚠️  Could not initialize Firebase Admin:', error.message);
    console.warn('   Scores will only be saved to JSON file');
  }
} else if (!admin.apps.length) {
  console.warn('⚠️  Missing Firebase credentials in environment variables');
  console.warn('   Required: VITE_FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
  console.warn('   Scores will only be saved to JSON file');
}

const db = admin.apps.length > 0 ? admin.firestore() : null;

class NHLScoreUpdater {
  constructor(outputDir = 'public') {
    this.outputDir = path.join(__dirname, outputDir);
    this.outputFile = path.join(this.outputDir, 'live_scores.json');
    this.nhlApiBase = 'https://api-web.nhle.com/v1';
    this.db = db;
  }

  /**
   * Fetch detailed live game data including clock
   */
  async fetchLiveGameDetails(gameData) {
    try {
      const url = `${this.nhlApiBase}/gamecenter/${gameData.gameId}/play-by-play`;
      const response = await fetch(url);
      
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
  }

  /**
   * Fetch game data from NHL API for specified date
   */
  async fetchGames(date = null) {
    // CRITICAL FIX: Use ET date if no date provided
    if (!date) {
      const etDateStr = new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      const [month, day, year] = etDateStr.split('/');
      date = `${year}-${month}-${day}`;
    }

    const url = `${this.nhlApiBase}/schedule/${date}`;

    try {
      console.log(`📡 Fetching NHL games for ${date}...`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const gameWeek = data.gameWeek || [];

      if (gameWeek.length === 0) {
        console.log(`❌ No games found for ${date}`);
        return [];
      }

      const games = gameWeek[0]?.games || [];
      console.log(`✅ Found ${games.length} games\n`);

      return await this.processGames(games, date);

    } catch (error) {
      console.error(`❌ Error fetching NHL data: ${error.message}`);
      return [];
    }
  }

  /**
   * Process raw NHL API game data into clean format
   */
  async processGames(games, date) {
    const processed = [];

    for (const game of games) {
      try {
        const gameData = {
          date: date,
          gameId: game.id,
          awayTeam: game.awayTeam.abbrev,
          homeTeam: game.homeTeam.abbrev,
          awayScore: game.awayTeam.score || 0,
          homeScore: game.homeTeam.score || 0,
          totalScore: (game.awayTeam.score || 0) + (game.homeTeam.score || 0),
          gameState: game.gameState || 'FUT',  // FUT, LIVE, FINAL, OFF
          period: game.periodDescriptor?.number || 0,
          periodDescriptor: game.periodDescriptor?.periodType || '',
          clock: '',
          gameTime: game.startTimeUTC || '',
          lastUpdate: new Date().toISOString()
        };

        // Determine status
        // CRIT = Critical (final moments/just ended), OFF = Officially Over, FINAL = Final
        if (['OFF', 'FINAL', 'CRIT'].includes(gameData.gameState)) {
          gameData.status = 'FINAL';
        } else if (gameData.gameState === 'LIVE') {
          gameData.status = 'LIVE';
          // Fetch detailed clock data for LIVE games
          await this.fetchLiveGameDetails(gameData);
        } else if (['FUT', 'PRE'].includes(gameData.gameState)) {
          gameData.status = 'SCHEDULED';
        } else {
          gameData.status = 'UNKNOWN';
        }

        processed.push(gameData);

        // Print game info
        const statusEmoji = {
          'LIVE': '🔴',
          'FINAL': '✅',
          'SCHEDULED': '📅',
          'UNKNOWN': '❓'
        };

        const emoji = statusEmoji[gameData.status] || '❓';
        const periodInfo = gameData.status === 'LIVE' && gameData.period > 0
          ? ` P${gameData.period} ${gameData.clock}`
          : '';
        
        console.log(`${emoji} ${gameData.awayTeam} @ ${gameData.homeTeam}: ${gameData.awayScore}-${gameData.homeScore} (${gameData.status})${periodInfo}`);

      } catch (error) {
        console.warn(`⚠️  Skipping malformed game data: ${error.message}`);
        continue;
      }
    }

    return processed;
  }

  /**
   * Save game data to JSON file
   */
  async saveToJson(games) {
    try {
      const data = {
        lastUpdate: new Date().toISOString(),
        games: games,
        gamesCount: games.length
      };

      await fs.writeFile(
        this.outputFile,
        JSON.stringify(data, null, 2),
        'utf-8'
      );

      console.log(`✅ Saved ${games.length} games to ${this.outputFile}`);
      return true;

    } catch (error) {
      console.error(`❌ Error saving to JSON: ${error.message}`);
      return false;
    }
  }

  /**
   * Save game data to Firebase Firestore
   */
  async saveToFirebase(games) {
    if (!this.db) {
      console.log('⏭️  Skipping Firebase (not initialized)');
      return true;
    }

    try {
      const data = {
        lastUpdate: new Date().toISOString(),
        games: games,
        gamesCount: games.length
      };

      await this.db.collection('live_scores').doc('current').set(data);

      console.log(`✅ Saved ${games.length} games to Firebase`);
      return true;

    } catch (error) {
      console.error(`❌ Error saving to Firebase: ${error.message}`);
      return false;
    }
  }

  /**
   * Main update method
   */
  async update(date = null) {
    const games = await this.fetchGames(date);

    if (games.length === 0) {
      return false;
    }

    // Save to both JSON and Firebase
    const jsonSuccess = await this.saveToJson(games);
    const firebaseSuccess = await this.saveToFirebase(games);

    return jsonSuccess && firebaseSuccess;
  }
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    date: null,
    continuous: false,
    interval: 5 // minutes
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--date' && args[i + 1]) {
      config.date = args[i + 1];
      i++;
    } else if (args[i] === '--continuous') {
      config.continuous = true;
    } else if (args[i] === '--interval' && args[i + 1]) {
      config.interval = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
NHL Live Score Updater

Usage:
  node updateLiveScores.js [options]

Options:
  --date YYYY-MM-DD    Fetch games for specific date (default: today)
  --continuous         Run continuously every N minutes
  --interval N         Minutes between updates (default: 5)
  --help, -h           Show this help message

Examples:
  node updateLiveScores.js
  node updateLiveScores.js --date 2025-10-23
  node updateLiveScores.js --continuous
  node updateLiveScores.js --continuous --interval 10
`);
      process.exit(0);
    }
  }

  return config;
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main execution
 */
async function main() {
  const config = parseArgs();
  const updater = new NHLScoreUpdater();

  console.log('🏒 NHL Live Score Updater');
  console.log('='.repeat(50));
  console.log();

  if (config.continuous) {
    console.log(`🔄 Running continuously (every ${config.interval} minutes)`);
    console.log('   Press Ctrl+C to stop\n');

    try {
      while (true) {
        await updater.update(config.date);

        const now = new Date();
        const nextUpdate = new Date(now.getTime() + config.interval * 60000);
        
        console.log(`\n⏰ Next update at ${nextUpdate.toLocaleTimeString()}`);
        console.log(`   Waiting ${config.interval} minutes...\n`);
        
        await sleep(config.interval * 60000);
      }
    } catch (error) {
      if (error.message.includes('aborted')) {
        console.log('\n\n👋 Stopped by user');
        process.exit(0);
      }
      throw error;
    }
  } else {
    // Single update
    const success = await updater.update(config.date);
    process.exit(success ? 0 : 1);
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\n👋 Stopped by user');
  process.exit(0);
});

// Run
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

