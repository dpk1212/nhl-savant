/**
 * Check D-Ratings parsing to see what's being extracted
 */

import fs from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { parseDRatings } from '../src/utils/dratingsParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function checkParsing() {
  console.log('\n🔍 CHECKING D-RATINGS PARSING\n');
  
  const drateMarkdown = await fs.readFile(join(__dirname, '../public/dratings.md'), 'utf8');
  const dratePreds = parseDRatings(drateMarkdown);
  
  console.log(`✅ Parsed ${dratePreds.length} D-Ratings predictions\n`);
  console.log('═'.repeat(80));
  console.log('PARSED PREDICTIONS:');
  console.log('═'.repeat(80));
  
  dratePreds.forEach((pred, i) => {
    console.log(`\n${i + 1}. ${pred.awayTeam} @ ${pred.homeTeam}`);
    console.log(`   Away Win Prob: ${(pred.awayWinProb * 100).toFixed(1)}%`);
    console.log(`   Home Win Prob: ${(pred.homeWinProb * 100).toFixed(1)}%`);
    console.log(`   Away Score: ${pred.awayScore}`);
    console.log(`   Home Score: ${pred.homeScore}`);
  });
  
  console.log('\n');
}

checkParsing().catch(console.error);

