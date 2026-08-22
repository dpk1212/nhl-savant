/**
 * EXITED after first pitch still grades. Pre-game exits and retags do not.
 * Usage: node tests/testGradeExitedHeld.mjs
 */
import assert from 'node:assert/strict';
import { shouldGradeExited, isLaterAssetClone } from '../scripts/gradeSharpActions.js';

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

// NFL/preseason: asset gone, no commence stamp — still hold recent tickets for grading.
{
  const todayET = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  assert.equal(shouldGradeExited({
    status: 'EXITED',
    exitReason: 'asset_absent',
    date: todayET,
  }), true, 'recent asset_absent without commence is held');
  assert.equal(shouldGradeExited({
    status: 'EXITED',
    exitReason: 'soft_key_absent_legacy',
    date: todayET,
  }), true, 'recent soft_key exit without commence is held');
  assert.equal(shouldGradeExited({
    status: 'EXITED',
    exitReason: 'asset_absent',
    date: '2020-01-01',
  }), false, 'stale asset_absent without commence is not held');
  assert.equal(shouldGradeExited({
    status: 'EXITED',
    exitReason: 'asset_absent',
    minutesToCommence: 40,
    date: todayET,
  }), false, 'explicit pre-game minutesToCommence still blocks');
}

{
  const earliest = new Map([['abc|token1', '2026-08-10']]);
  assert.equal(isLaterAssetClone({
    wallet: 'abc', asset: 'token1', date: '2026-08-11',
  }, earliest), true, 'later date same asset is a clone');
  assert.equal(isLaterAssetClone({
    wallet: 'abc', asset: 'token1', date: '2026-08-10',
  }, earliest), false, 'earliest date is the keeper');
}

console.log('testGradeExitedHeld: ok');
