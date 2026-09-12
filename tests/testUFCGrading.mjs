/**
 * testUFCGrading.mjs — UFC fight matching + prop guard for graders.
 *
 * Run: node tests/testUFCGrading.mjs
 */
import { findMatchingGame } from '../scripts/gradeSharpActions.js';
import {
  fightersMatch,
  isGradableUFCMainML,
  resolveUFCFighter,
  makeUFCGameKey,
  extractUFCFightersFromTitle,
  stripUFCEventPrefix,
} from '../scripts/lib/ufcFighters.js';

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log(`  ✅ ${name}`); }
  else { fail++; console.error(`  ❌ ${name}`); }
}

check('resolve Holloway', resolveUFCFighter('Max Holloway') === 'maxholloway');
check('resolve McGregor', resolveUFCFighter('Conor McGregor') === 'conormcgregor');
check('fightersMatch equal', fightersMatch('Max Holloway', 'max holloway') === true);
check('fightersMatch unequal', fightersMatch('Max Holloway', 'Conor McGregor') === false);
check('game key order preserved',
  makeUFCGameKey('Max Holloway', 'Conor McGregor') === 'maxholloway_conormcgregor');

check('main ML is gradable',
  isGradableUFCMainML({
    marketType: 'ml',
    title: 'UFC 329: Max Holloway vs. Conor McGregor',
    outcome: 'Max Holloway',
  }) === true);

check('KO prop is NOT gradable',
  isGradableUFCMainML({
    marketType: 'ml',
    title: 'Will Max Holloway win by KO or TKO?',
    outcome: 'Yes',
  }) === false);

check('distance prop is NOT gradable',
  isGradableUFCMainML({
    marketType: 'ml',
    outcome: 'Go the Distance',
  }) === false);

const hollowayWin = {
  dateET: '2026-07-11',
  awayCode: 'maxholloway',
  homeCode: 'conormcgregor',
  awayFighter: 'Max Holloway',
  homeFighter: 'Conor McGregor',
  awayScore: 1,
  homeScore: 0,
};
const flippedEspnOrder = {
  dateET: '2026-07-11',
  awayCode: 'conormcgregor',
  homeCode: 'maxholloway',
  awayFighter: 'Conor McGregor',
  homeFighter: 'Max Holloway',
  awayScore: 0,
  homeScore: 1, // Holloway won; ESPN listed McGregor first
};
const wrongDay = { ...hollowayWin, dateET: '2026-07-10' };

const pos = {
  sport: 'UFC',
  gameKey: 'maxholloway_conormcgregor',
  date: '2026-07-11',
  away: 'Max Holloway',
  home: 'Conor McGregor',
  marketType: 'ml',
  title: 'UFC 329: Max Holloway vs. Conor McGregor',
};

const hit = findMatchingGame(pos, [], [], [], [], [], [hollowayWin], []);
check('direct key match grades Holloway win',
  hit && hit.awayScore === 1 && hit.homeScore === 0);

const flipped = findMatchingGame(pos, [], [], [], [], [], [flippedEspnOrder], []);
check('ESPN fighter-order flip still grades Holloway win',
  flipped && flipped.awayScore === 1 && flipped.homeScore === 0);

check('wrong-day rematch blocked by date guard',
  findMatchingGame(pos, [], [], [], [], [], [wrongDay], []) === null);

check('prop position never matches even with final present',
  findMatchingGame({
    ...pos,
    title: 'Will Max Holloway win by KO or TKO?',
  }, [], [], [], [], [], [hollowayWin], []) === null);

// MLB path still works with extra ufcFinals/wnbaFinals args (no cross-sport bleed)
const mlbPos = {
  sport: 'MLB', gameKey: 'nyy_tbr', date: '2026-07-08',
  away: 'New York Yankees', home: 'Tampa Bay Rays',
};
const mlbFinal = {
  dateET: '2026-07-08', awayCode: 'nyy', homeCode: 'tbr',
  awayTeam: 'New York Yankees', homeTeam: 'Tampa Bay Rays',
  awayScore: 2, homeScore: 3,
};
check('MLB matching unchanged with UFC finals present',
  findMatchingGame(mlbPos, [], [], [mlbFinal], [], [], [hollowayWin], []) === mlbFinal);

check('strip Noche UFC prefix',
  stripUFCEventPrefix('Noche UFC: Jean Silva vs. Jose Miguel Delgado')
    === 'Jean Silva vs. Jose Miguel Delgado');
check('strip numbered UFC prefix still works',
  stripUFCEventPrefix('UFC 331: Arman Tsarukyan vs. Mauricio Ruffy')
    === 'Arman Tsarukyan vs. Mauricio Ruffy');
check('Noche title does not glue branding onto fighter A',
  extractUFCFightersFromTitle(
    'Noche UFC: Jean Silva vs. Jose Miguel Delgado (Featherweight, Main Card)',
  )?.[0] === 'Jean Silva');
check('Noche Silva/Delgado joins Odds/Pinnacle key',
  makeUFCGameKey('Jean Silva', 'Jose Miguel Delgado') === 'jeansilva_josedelgado'
  && makeUFCGameKey('Jose Delgado', 'Jean Silva') === 'josedelgado_jeansilva');
check('Rongzhu aliases to Zhu Rong',
  resolveUFCFighter('Rongzhu') === 'zhurong');
check('Tommy Gantt aliases to Thomas Gantt',
  resolveUFCFighter('Tommy Gantt') === 'thomasgantt');

const nocheCard = [
  ['Noche UFC: Jean Silva vs. Jose Miguel Delgado (Featherweight, Main Card)', 'josedelgado_jeansilva'],
  ['Noche UFC: Brandon Moreno vs. Joseph Morales (Flyweight, Main Card)', 'josephmorales_brandonmoreno'],
  ['Noche UFC: Tommy McMillen vs. Marwan Rahiki (Featherweight, Main Card)', 'marwanrahiki_tommymcmillen'],
  ['Noche UFC: Alexa Grasso vs. Manon Fiorot (Women\'s Flyweight, Main Card)', 'alexagrasso_manonfiorot'],
  ['Noche UFC: Curtis Blaydes vs. Waldo Cortes Acosta (Heavyweight, Main Card)', 'curtisblaydes_waldocortesacosta'],
  ['Noche UFC: Dan Ige vs. David Martinez (Bantamweight, Main Card)', 'danige_davidmartinez'],
  ['Noche UFC: Tim Elliott vs. Édgar Cháirez (Flyweight, Prelims)', 'edgarchairez_timelliott'],
  ['Noche UFC: Muslim Salikhov vs. Ignacio Bahamondes (Welterweight, Prelims)', 'muslimsalikhov_ignaciobahamondes'],
  ['Noche UFC: Yousri Belgaroui vs. Djorden Santos (Middleweight, Prelims)', 'djordensantos_yousribelgaroui'],
  ['Noche UFC: Rafa Garcia vs. Rongzhu (Lightweight, Prelims)', 'zhurong_rafagarcia'],
  ['Noche UFC: JJ Aldrich vs. Regina Tarin (Women\'s Flyweight, Prelims)', 'jjaldrich_reginatarin'],
  ['Noche UFC: Drakkar Klose vs. Tommy Gantt (Lightweight, Prelims)', 'drakkarklose_thomasgantt'],
  ['Noche UFC: Jessie Rosas vs. Sean King (Featherweight, Prelims)', 'jessierosas_seanking'],
];
const pinTonight = new Set(nocheCard.map(([, k]) => k));
for (const [title, pinKey] of nocheCard) {
  const pair = extractUFCFightersFromTitle(title);
  const k1 = pair ? makeUFCGameKey(pair[0], pair[1]) : null;
  const k2 = pair ? makeUFCGameKey(pair[1], pair[0]) : null;
  check(`Noche ingest ${pinKey}`, !!(pair && (pinTonight.has(k1) || pinTonight.has(k2)) && (k1 === pinKey || k2 === pinKey)));
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
