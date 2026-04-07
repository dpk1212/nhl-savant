/**
 * Dimers MLB Parser
 *
 * Parses the Dimers MLB schedule/predictions page (Firecrawl markdown).
 *
 * Actual scraped format (each game is a block inside a markdown link):
 *   ![Cubs](https://cdn.ciphersports.io/.../CHC.svg)\
 *   \
 *   Cubs  J. Assad \
 *   \
 *   50% \
 *   ...
 *   ![Rays](https://cdn.ciphersports.io/.../TB.svg)\
 *   \
 *   Rays  M. Englert \
 *   \
 *   50% \
 *
 * We scan for team image tags followed by "TeamName  Pitcher \\" then "XX% \\".
 */

import { normalizeMLBTeam } from './mlbTeamMap.js';

/**
 * Parse Dimers MLB predictions from Firecrawl markdown.
 * @param {string} markdown - Raw markdown from Firecrawl scrape
 * @returns {Array} Parsed game predictions
 */
export function parseMLBDimers(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    console.warn('Invalid markdown provided to parseMLBDimers');
    return [];
  }

  const predictions = [];

  // Normalize line endings: Dimers uses "\\\n\\\n" as separators
  // Split into lines, stripping trailing backslashes
  const rawLines = markdown.split('\n').map(l => l.replace(/\\+$/, '').trim());

  // Extract all (team, prob) pairs in order of appearance
  const entries = [];

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];

    // Look for a line with a percentage: "50%" or "45%"
    const probMatch = line.match(/^(\d{1,3})%\s*$/);
    if (!probMatch) continue;

    const prob = parseInt(probMatch[1], 10);
    if (prob < 1 || prob > 99) continue;

    // Look backwards for the team name line (should be 1-3 lines above)
    let teamName = null;
    for (let j = i - 1; j >= Math.max(0, i - 4); j--) {
      const candidate = rawLines[j];
      if (!candidate || candidate.startsWith('!') || candidate.startsWith('[')) continue;
      if (candidate.includes('cdn.') || candidate.includes('http')) continue;
      if (/^(LIVE|MLB|Out|Bot|Top|See|In-Play|Apr|\d+\s*Out)/.test(candidate)) continue;

      // Pattern: "TeamName" or "TeamName  Pitcher"
      // Strip pitcher: take everything before the last "FirstInitial. LastName" pattern
      let cleaned = candidate.trim();

      // Remove trailing pitcher name: "Cubs  J. Assad" -> "Cubs"
      // Pitcher pattern: one or more spaces then "X. Lastname" at the end
      const pitcherStrip = cleaned.match(/^(.+?)\s{2,}[A-Z]\.\s+\S+$/);
      if (pitcherStrip) {
        cleaned = pitcherStrip[1].trim();
      }

      const code = normalizeMLBTeam(cleaned);
      if (code) {
        teamName = code;
        break;
      }
    }

    if (teamName) {
      entries.push({ code: teamName, prob: prob / 100, lineIdx: i });
    }
  }

  // Pair consecutive entries as away/home
  const seen = new Set();
  for (let i = 0; i < entries.length - 1; i++) {
    const a = entries[i];
    const b = entries[i + 1];

    if (a.code === b.code) continue;

    const sum = a.prob + b.prob;
    if (sum < 0.85 || sum > 1.15) continue;

    // Make sure they're close together in the file (same game block)
    if (b.lineIdx - a.lineIdx > 30) continue;

    const matchupKey = `${a.code}_${b.code}`;
    if (seen.has(matchupKey)) continue;
    seen.add(matchupKey);

    predictions.push({
      awayTeam: a.code,
      homeTeam: b.code,
      awayWinProb: a.prob,
      homeWinProb: b.prob,
      source: 'Dimers',
      matchup: matchupKey,
    });

    console.log(`   🎯 Dimers: ${a.code} (${(a.prob * 100).toFixed(0)}%) @ ${b.code} (${(b.prob * 100).toFixed(0)}%)`);

    i++; // skip the home team entry
  }

  console.log(`✅ Parsed ${predictions.length} MLB predictions from Dimers`);
  return predictions;
}
