/**
 * Napoli @ Bodø/Glimt 2026-10-20 — ESPN lists the fixture flipped
 * (Bodo/Glimt at Napoli, 3-4 FT). Board key nap_bod must flip scores
 * and grade away Napoli ML as WIN. Extra time would be a DRAW, not this game.
 *
 * Run: node tests/testNapoliBodGrade.mjs
 */
import { calculateOutcome, findMatchingGame } from '../scripts/gradeSharpActions.js';
import { resolveSOCTeam } from '../scripts/lib/soccerTeams.js';

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log(`  ✅ ${name}`); }
  else { fail++; console.error(`  ❌ ${name}`); }
}

const espn = {
  awayCode: 'bod',
  homeCode: 'nap',
  awayTeam: 'Bodo/Glimt',
  homeTeam: 'Napoli',
  awayScore: 3,
  homeScore: 4,
  wentBeyond90: false,
};

check('ESPN Bodo resolves BOD', resolveSOCTeam('Bodo/Glimt') === 'BOD');
check('ESPN Napoli resolves NAP', resolveSOCTeam('Napoli') === 'NAP');

const board = findMatchingGame(
  { sport: 'SOC', gameKey: 'nap_bod', date: '2026-10-20' },
  [], [], [], [], [espn],
);
check('flips ESPN 3-4 onto nap_bod 4-3', !!board && board.awayScore === 4 && board.homeScore === 3);
check('keeps 90-minute flag', board?.wentBeyond90 === false);
check('Napoli away ML is WIN', calculateOutcome(board, 'ML', 'away', null, 'SOC') === 'WIN');
check('Bodø home ML is LOSS', calculateOutcome(board, 'ML', 'home', null, 'SOC') === 'LOSS');
check('Draw is LOSS at 4-3 FT', calculateOutcome(board, 'ML', 'draw', null, 'SOC') === 'LOSS');

const aet = { ...espn, wentBeyond90: true };
const aetBoard = findMatchingGame(
  { sport: 'SOC', gameKey: 'nap_bod', date: '2026-10-20' },
  [], [], [], [], [aet],
);
check('AET still flips scores', !!aetBoard && aetBoard.awayScore === 4 && aetBoard.wentBeyond90 === true);
check('AET would be DRAW not WIN', calculateOutcome(aetBoard, 'ML', 'away', null, 'SOC') === 'LOSS');
check('AET draw side would WIN', calculateOutcome(aetBoard, 'ML', 'draw', null, 'SOC') === 'WIN');

if (fail) {
  console.error(`\n${fail} failed, ${pass} passed`);
  process.exit(1);
}
console.log(`\n${pass} passed`);
