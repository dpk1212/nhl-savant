#!/usr/bin/env node
/**
 * NHL Live Score Updater (Node.js version)
 * =========================================
 * Fetches live scores from NHL API and updates JSON file for display.
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class NHLScoreUpdater {
  constructor(outputDir = 'public') {
    this.outputDir = path.join(__dirname, outputDir);
    this.outputFile = path.join(this.outputDir, 'live_scores.json');
    this.nhlApiBase = 'https://api-web.nhle.com/v1';
  }

  /**
   * Fetch game data from NHL API for specified date
   */
  async fetchGames(date = null) {
    if (!date) {
      date = new Date().toISOString().split('T')[0];
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

      return this.processGames(games, date);

    } catch (error) {
      console.error(`❌ Error fetching NHL data: ${error.message}`);
      return [];
    }
  }

  /**
   * Process raw NHL API game data into clean format
   */
  processGames(games, date) {
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
          period: game.period || 0,
          periodDescriptor: game.periodDescriptor?.periodType || '',
          clock: game.clock?.timeRemaining || '',
          gameTime: game.startTimeUTC || '',
          lastUpdate: new Date().toISOString()
        };

        // Determine status
        if (['OFF', 'FINAL'].includes(gameData.gameState)) {
          gameData.status = 'FINAL';
        } else if (gameData.gameState === 'LIVE') {
          gameData.status = 'LIVE';
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

      console.log(`\n✅ Saved ${games.length} games to ${this.outputFile}`);
      return true;

    } catch (error) {
      console.error(`❌ Error saving to JSON: ${error.message}`);
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

    return await this.saveToJson(games);
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

