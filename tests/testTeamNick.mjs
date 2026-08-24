/**
 * Club/team display nicks — Chelsea FC vs Fulham FC must not both be "FC".
 * Run: node tests/testTeamNick.mjs
 */
import { shortTeamNick, getTeamIdentity } from '../src/utils/teamIdentity.js';
import { _test } from '../src/lib/confirmedActionDesk.js';

const { teamLabel } = _test;

let pass = 0;
let fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log(`  ok  ${name}`); }
  else { fail++; console.error(`  FAIL ${name}`); }
}

check('Chelsea vs Fulham away', shortTeamNick('Chelsea FC', 'Fulham FC') === 'Chelsea');
check('Chelsea vs Fulham home', shortTeamNick('Fulham FC', 'Chelsea FC') === 'Fulham');
check('solo Chelsea FC still Chelsea', shortTeamNick('Chelsea FC') === 'Chelsea');
check('FC Barcelona strips leading FC', shortTeamNick('FC Barcelona', 'Elche CF') === 'Barcelona');
check('AFC Bournemouth strips leading AFC', shortTeamNick('AFC Bournemouth') === 'Bournemouth');
check('Real Madrid CF vs Atlético', shortTeamNick('Real Madrid CF', 'Atlético Madrid') === 'Real Madrid');
check('Atlético vs Real Madrid', shortTeamNick('Atlético Madrid', 'Real Madrid CF') === 'Atlético Madrid');
check('White Sox vs Red Sox', shortTeamNick('Chicago White Sox', 'Boston Red Sox') === 'White Sox');
check('Red Sox vs White Sox', shortTeamNick('Boston Red Sox', 'Chicago White Sox') === 'Red Sox');
check('Man City vs Hull City', shortTeamNick('Manchester City FC', 'Hull City') === 'Manchester City');
check('Yankees untouched', shortTeamNick('New York Yankees', 'Boston Red Sox') === 'Yankees');
check('Draw passthrough via teamLabel', teamLabel({ away: 'Chelsea FC', home: 'Fulham FC' }, 'draw') === 'Draw');
check('Action hero is Chelsea not FC', teamLabel({ away: 'Chelsea FC', home: 'Fulham FC' }, 'away') === 'Chelsea');
check('Action hero is Fulham not FC', teamLabel({ away: 'Chelsea FC', home: 'Fulham FC' }, 'home') === 'Fulham');
check('Over stays Over', teamLabel({ away: 'Chelsea FC', home: 'Fulham FC' }, 'over') === 'Over');
check('crest abbr not FC', getTeamIdentity('Chelsea FC', 'SOC').abbr !== 'FC');
check('crest abbr CHE', getTeamIdentity('Chelsea FC', 'SOC').abbr === 'CHE');

if (fail) {
  console.error(`\n${fail} failed, ${pass} passed`);
  process.exit(1);
}
console.log(`\n${pass} passed`);
