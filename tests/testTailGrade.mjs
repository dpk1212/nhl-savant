/**
 * Tail dates, lines, and the grader stamp the desk must keep.
 * Usage: node tests/testTailGrade.mjs
 */
import assert from 'node:assert/strict';
import {
  customerTailPnl,
  graderTailResult,
  tailGameDate,
  tailLine,
  usableCommenceMs,
} from '../src/lib/tailGrade.js';
import { gradeTail } from '../src/lib/mySharpsDesk.js';

assert.equal(usableCommenceMs(0), null);
assert.equal(usableCommenceMs(1), null);

const sox = {
  pick: 'Sox',
  marketType: 'ML',
  commenceMs: 0,
  tailedAt: Date.parse('2026-09-24T22:00:00Z'),
};
assert.equal(tailGameDate(sox), '2026-09-24');
assert.notEqual(tailGameDate(sox), '1969-12-31');

assert.equal(tailGameDate({ date: '2026-09-24', commenceMs: 0 }), '2026-09-24');
assert.equal(tailLine({ marketType: 'ML', pick: 'Sox', line: -122 }), null);
assert.equal(tailLine({ marketType: 'TOTAL', pick: 'Under 8.5' }), 8.5);
assert.equal(tailLine({ marketType: 'SPREAD', pick: 'Phillies +1.5' }), 1.5);
assert.equal(tailLine({ marketType: 'TOTAL', line: 8.5, pick: 'Under 8.5' }), 8.5);

assert.equal(customerTailPnl(100, 117, 'won'), 117);
assert.equal(customerTailPnl(200, -122, 'lost'), -200);
assert.equal(customerTailPnl(500, -178, 'push'), 0);

const stamped = {
  gradedBy: 'grader',
  status: 'lost',
  pnl: -200,
  stake: 200,
  myAmerican: -122,
  gameKey: 'cws_kcr',
  marketType: 'ML',
  side: 'away',
};
assert.deepEqual(graderTailResult(stamped), { status: 'lost', pnl: -200 });
const desk = gradeTail(stamped, [
  { walletShort: 'e4ec62', gameKey: 'cws_kcr', marketType: 'ML', side: 'away', won: 1, date: '2026-09-24' },
]);
assert.equal(desk.status, 'lost');
assert.equal(desk.pnl, -200);

console.log('ok');
