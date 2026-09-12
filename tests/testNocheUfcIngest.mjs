/**
 * Noche UFC / branded-card ingest — Poly titles must join Odds/Pinnacle keys.
 * Usage: node tests/testNocheUfcIngest.mjs
 */
import assert from 'node:assert/strict';
import {
  extractUFCFightersFromTitle,
  makeUFCGameKey,
  resolveUFCFighter,
  stripUFCEventPrefix,
} from '../scripts/lib/ufcFighters.js';

assert.equal(
  stripUFCEventPrefix('Noche UFC: Jean Silva vs. Jose Miguel Delgado'),
  'Jean Silva vs. Jose Miguel Delgado',
);
assert.equal(
  stripUFCEventPrefix('UFC 331: Arman Tsarukyan vs. Mauricio Ruffy'),
  'Arman Tsarukyan vs. Mauricio Ruffy',
);
assert.equal(
  stripUFCEventPrefix('UFC Fight Night: Kamaru Usman vs. Dricus Du Plessis'),
  'Kamaru Usman vs. Dricus Du Plessis',
);

assert.equal(
  extractUFCFightersFromTitle(
    'Noche UFC: Jean Silva vs. Jose Miguel Delgado (Featherweight, Main Card)',
  )?.[0],
  'Jean Silva',
);
assert.notEqual(
  extractUFCFightersFromTitle(
    'Noche UFC: Jean Silva vs. Jose Miguel Delgado (Featherweight, Main Card)',
  )?.[0],
  'Noche UFC: Jean Silva',
);

assert.equal(resolveUFCFighter('Jose Miguel Delgado'), 'josedelgado');
assert.equal(resolveUFCFighter('Rongzhu'), 'zhurong');
assert.equal(resolveUFCFighter('Tommy Gantt'), 'thomasgantt');
assert.equal(makeUFCGameKey('Jean Silva', 'Jose Miguel Delgado'), 'jeansilva_josedelgado');
assert.equal(makeUFCGameKey('Jose Delgado', 'Jean Silva'), 'josedelgado_jeansilva');

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

for (const [title, pinKey] of nocheCard) {
  const pair = extractUFCFightersFromTitle(title);
  assert.ok(pair, `extract ${title}`);
  const k1 = makeUFCGameKey(pair[0], pair[1]);
  const k2 = makeUFCGameKey(pair[1], pair[0]);
  assert.ok(
    k1 === pinKey || k2 === pinKey,
    `${title} → ${k1}/${k2}, expected ${pinKey}`,
  );
}

console.log('testNocheUfcIngest: ok');
