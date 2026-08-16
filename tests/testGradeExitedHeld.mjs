/**
 * EXITED after first pitch still grades. Pre-game exits and retags do not.
 * Usage: node tests/testGradeExitedHeld.mjs
 */
import assert from 'node:assert/strict';
import { shouldGradeExited } from '../scripts/gradeSharpActions.js';

const sdp = {
  status: 'EXITED',
  exitReason: 'asset_absent',
  minutesToCommence: -95.1,
  commenceTime: 1786749060000,
  exitedAt: '2026-08-15T00:46:07.634Z',
};
assert.equal(shouldGradeExited(sdp), true, 'SDP Over exited 95m after pitch');

assert.equal(shouldGradeExited({
  status: 'EXITED',
  exitReason: 'asset_absent',
  minutesToCommence: 40,
  commenceTime: 1786749060000,
  exitedAt: '2026-08-14T22:00:00.000Z',
}), false, 'pre-game exit stays ungraded');

assert.equal(shouldGradeExited({
  status: 'EXITED',
  exitReason: 'date_calendar_retag',
  minutesToCommence: -10,
}), false, 'calendar retag is not a held ticket');

assert.equal(shouldGradeExited({
  status: 'EXITED',
  exitReason: 'eventId_mismatch',
  minutesToCommence: 40,
}), false, 'pre-game eventId mismatch stays ungraded');

assert.equal(shouldGradeExited({
  status: 'EXITED',
  exitReason: 'eventId_mismatch',
  minutesToCommence: -180,
}), true, 'post-commence eventId mismatch is a held ticket');

assert.equal(shouldGradeExited({
  status: 'PENDING',
  minutesToCommence: -95,
}), false, 'helper is EXITED-only');

assert.equal(shouldGradeExited({
  status: 'EXITED',
  exitReason: 'asset_absent',
  commenceTime: 1786749060000,
  exitedAt: { seconds: 1786754767 },
}), true, 'Firestore timestamp after commence');

assert.equal(shouldGradeExited({
  status: 'EXITED',
  exitReason: 'slug_date_vs_board',
  minutesToCommence: -10,
}), false, 'other-day slug is not a held ticket');

console.log('testGradeExitedHeld: ok');
