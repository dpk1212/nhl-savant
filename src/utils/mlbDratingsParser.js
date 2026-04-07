/**
 * DRatings MLB Parser
 *
 * Parses the DRatings MLB predictions page (Firecrawl markdown).
 * Table format mirrors NCAAB: pipe-delimited rows with win %, predicted runs,
 * pitcher names, and best odds.
 *
 * DRatings MLB table columns (from web scrape):
 *   Time | Teams | Pitchers | Win | BestML | BestSpread | Runs | TotalRuns | BestO/U | BetValue
 *
 * Teams cell: "[San Diego Padres](/teams/...)(5-5)[Pittsburgh Pirates](/teams/...)(6-4)"
 * Win cell:   "46.4%53.6%"  (away then home, sometimes with <br> separator)
 * Pitchers:   "Nick PivettaPaul Skenes" or with <br> separator
 * Runs cell:  "3.113.49"    (away then home predicted runs, sometimes <br>)
 */

import { normalizeMLBTeam } from './mlbTeamMap.js';

/**
 * Parse DRatings MLB predictions from Firecrawl markdown.
 * @param {string} markdown - Raw markdown from Firecrawl scrape
 * @returns {Array} Parsed game predictions
 */
export function parseMLBDRatings(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    console.warn('Invalid markdown provided to parseMLBDRatings');
    return [];
  }

  const predictions = [];
  const lines = markdown.split('\n');

  let inUpcomingSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Detect "Upcoming" section header
    if (/upcoming/i.test(line) && /games?\s+for/i.test(line)) {
      inUpcomingSection = true;
      continue;
    }
    // Stop at "In Progress" or "Completed" sections
    if (inUpcomingSection && (/games?\s+in\s+progress/i.test(line) || /completed\s+games/i.test(line))) {
      break;
    }

    // Skip non-table rows and header/separator rows
    if (!line.startsWith('|')) continue;
    if (line.includes('---')) continue;
    if (/\|\s*Time\s*\|/i.test(line)) continue;

    // Must contain team links or team names with records
    const hasTeamLinks = line.includes('/teams/');
    const hasRecords = /\(\d+-\d+\)/.test(line);
    if (!hasTeamLinks && !hasRecords) continue;

    // Must contain win probabilities
    if (!line.includes('%')) continue;

    const cells = line.split('|').map(c => c.trim()).filter(c => c);
    if (cells.length < 5) continue;

    try {
      const parsed = parseGameRow(cells);
      if (parsed) {
        predictions.push(parsed);
      }
    } catch (err) {
      console.warn(`Error parsing DRatings MLB row ${i}: ${err.message}`);
    }
  }

  console.log(`✅ Parsed ${predictions.length} MLB predictions from DRatings`);
  return predictions;
}

function parseGameRow(cells) {
  // Extract game time from first cell
  const timeMatch = cells[0].match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
  const gameTime = timeMatch ? timeMatch[1].trim() : null;

  // Extract teams — look for markdown links or plain text with records
  let awayTeamRaw = null;
  let homeTeamRaw = null;

  // Check multiple cells for team names
  const teamsCell = cells.find(c => c.includes('/teams/') || (/\(\d+-\d+\)/.test(c) && !c.includes('%')));
  if (!teamsCell) return null;

  // Pattern: [Team Name](/teams/...)(record) repeated twice
  const linkMatches = [...teamsCell.matchAll(/\[([^\]]+)\]\([^\)]+\)/g)];
  if (linkMatches.length >= 2) {
    awayTeamRaw = linkMatches[0][1].trim();
    homeTeamRaw = linkMatches[1][1].trim();
  } else {
    // Fallback: plain text with records like "Team Name (5-5)Team Name (6-4)"
    const plainMatch = teamsCell.match(/([A-Z][a-zA-Z\s.]+?)\s*\(\d+-\d+\)/g);
    if (plainMatch && plainMatch.length >= 2) {
      awayTeamRaw = plainMatch[0].replace(/\s*\(\d+-\d+\)/, '').trim();
      homeTeamRaw = plainMatch[1].replace(/\s*\(\d+-\d+\)/, '').trim();
    }
  }

  if (!awayTeamRaw || !homeTeamRaw) return null;

  const awayCode = normalizeMLBTeam(awayTeamRaw);
  const homeCode = normalizeMLBTeam(homeTeamRaw);
  if (!awayCode || !homeCode) {
    console.warn(`  ⚠️  Unmapped MLB teams: "${awayTeamRaw}" / "${homeTeamRaw}"`);
    return null;
  }

  // Extract win probabilities — find the cell with two percentages
  let awayWinProb = null;
  let homeWinProb = null;
  for (const cell of cells) {
    const probs = cell.match(/([\d.]+)%/g);
    if (probs && probs.length >= 2) {
      const p1 = parseFloat(probs[0]) / 100;
      const p2 = parseFloat(probs[1]) / 100;
      const sum = p1 + p2;
      if (sum > 0.90 && sum < 1.10) {
        awayWinProb = p1;
        homeWinProb = p2;
        break;
      }
    }
  }
  if (awayWinProb == null) return null;

  // Extract pitchers — look for cell with two names and no numbers/links
  let awayPitcher = null;
  let homePitcher = null;
  const pitcherCandidates = cells.filter(c =>
    !c.includes('%') && !c.includes('/') && !c.includes('$') &&
    !/^[\d.+\-\s]+$/.test(c) && /[A-Z][a-z]/.test(c) && c.length > 3
  );
  for (const cell of pitcherCandidates) {
    // Split on <br>, newline, or try to detect two capitalized names
    const parts = cell.split(/<br\s*\/?>|\n/).map(s => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      awayPitcher = parts[0];
      homePitcher = parts[1];
      break;
    }
    // Two names concatenated: "Nick PivettaPaul Skenes" — split on capital letter boundary
    const namesSplit = cell.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)/g);
    if (namesSplit && namesSplit.length >= 2) {
      awayPitcher = namesSplit[0];
      homePitcher = namesSplit[1];
      break;
    }
  }

  // Extract predicted runs — find cell with two decimal numbers
  let awayRuns = null;
  let homeRuns = null;
  for (const cell of cells) {
    // Pattern: "3.11<br>3.49" or "3.113.49"
    const brMatch = cell.match(/([\d.]+)<br\s*\/?>([\d.]+)/);
    if (brMatch) {
      const r1 = parseFloat(brMatch[1]);
      const r2 = parseFloat(brMatch[2]);
      if (r1 > 0 && r1 < 20 && r2 > 0 && r2 < 20) {
        awayRuns = r1;
        homeRuns = r2;
        break;
      }
    }
    // Two concatenated decimals: "3.113.49"
    const concatMatch = cell.match(/^(\d+\.\d{1,2})(\d+\.\d{1,2})$/);
    if (concatMatch) {
      const r1 = parseFloat(concatMatch[1]);
      const r2 = parseFloat(concatMatch[2]);
      if (r1 > 0 && r1 < 20 && r2 > 0 && r2 < 20) {
        awayRuns = r1;
        homeRuns = r2;
        break;
      }
    }
  }

  console.log(`   🎯 DRatings: ${awayCode} (${(awayWinProb * 100).toFixed(1)}%) @ ${homeCode} (${(homeWinProb * 100).toFixed(1)}%)${awayPitcher ? ` | ${awayPitcher} vs ${homePitcher}` : ''}`);

  return {
    awayTeam: awayCode,
    homeTeam: homeCode,
    awayTeamFull: awayTeamRaw,
    homeTeamFull: homeTeamRaw,
    awayWinProb,
    homeWinProb,
    awayRuns,
    homeRuns,
    awayPitcher,
    homePitcher,
    gameTime,
    source: 'DRatings',
    matchup: `${awayCode}_${homeCode}`,
  };
}
