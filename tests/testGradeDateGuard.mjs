/**
 * testGradeDateGuard.mjs — regression test for the series-repeat mis-grading
 * bug (2026-07-08): the date-blind ESPN MLB/NBA finals fetch matched
 * YESTERDAY'S final onto TODAY'S position docs when the same teams played
 * consecutive days (NYY@TBR), which froze those docs' updatedAt and
 * stale-pruned the wallets out of the staking cron's RANK/consensus math.
 *
 * Run: node tests/testGradeDateGuard.mjs
 */
import { espnEventDateET, finalDateMatches, findMatchingGame } from '../scripts/gradeSharpActions.js';

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log(`  ✅ ${name}`); }
  else { fail++; console.error(`  ❌ ${name}`); }
}

// ── espnEventDateET ──────────────────────────────────────────────────────
// 2026-07-08T01:30Z is still 2026-07-07 in ET (21:30 EDT).
check('UTC evening game maps to previous ET date',
  espnEventDateET({ date: '2026-07-08T01:30Z' }) === '2026-07-07');
check('UTC afternoon game maps to same ET date',
  espnEventDateET({ date: '2026-07-08T18:40Z' }) === '2026-07-08');
check('missing date returns null', espnEventDateET({}) === null);
check('garbage date returns null', espnEventDateET({ date: 'nope' }) === null);

// ── finalDateMatches ─────────────────────────────────────────────────────
check('same-date final matches',
  finalDateMatches({ dateET: '2026-07-08' }, { date: '2026-07-08' }) === true);
check('yesterday final does NOT match today position',
  finalDateMatches({ dateET: '2026-07-07' }, { date: '2026-07-08' }) === false);
check('final without date is rejected when position has a date (fail-closed)',
  finalDateMatches({ dateET: null }, { date: '2026-07-08' }) === false);
check('legacy position without date keeps old behavior',
  finalDateMatches({ dateET: '2026-07-07' }, {}) === true);

// ── findMatchingGame end-to-end (the actual incident shape) ──────────────
const yesterdaysFinal = {
  dateET: '2026-07-07',
  awayCode: 'nyy', homeCode: 'tbr',
  awayTeam: 'New York Yankees', homeTeam: 'Tampa Bay Rays',
  awayScore: 4, homeScore: 6,
};
const todaysFinal = { ...yesterdaysFinal, dateET: '2026-07-08', awayScore: 2, homeScore: 3 };
const todaysPos = {
  sport: 'MLB', gameKey: 'nyy_tbr', date: '2026-07-08',
  away: 'New York Yankees', home: 'Tampa Bay Rays',
};

check('INCIDENT: yesterday\'s NYY@TBR final no longer grades today\'s doc',
  findMatchingGame(todaysPos, [], [], [yesterdaysFinal], [], []) === null);
check('today\'s final still grades today\'s doc',
  findMatchingGame(todaysPos, [], [], [todaysFinal], [], []) === todaysFinal);
check('both finals present: the SAME-DATE one is chosen',
  findMatchingGame(todaysPos, [], [], [yesterdaysFinal, todaysFinal], [], []) === todaysFinal);
check('team-name fallback path is also date-guarded',
  findMatchingGame({ ...todaysPos, gameKey: 'badkey' }, [], [], [yesterdaysFinal], [], []) === null);

// NBA path uses the same guard.
const nbaYesterday = {
  dateET: '2026-07-07', awayCode: 'bos', homeCode: 'nyk',
  awayTeam: 'Boston Celtics', homeTeam: 'New York Knicks', awayScore: 100, homeScore: 99,
};
check('NBA series-repeat also blocked',
  findMatchingGame({ sport: 'NBA', gameKey: 'bos_nyk', date: '2026-07-08', away: 'Boston Celtics', home: 'New York Knicks' },
    [], [], [], [nbaYesterday], []) === null);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
