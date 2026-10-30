import assert from 'node:assert/strict';
import { adoptedCommenceMs, commenceMoveReopensLock } from '../scripts/lib/commenceFollow.js';

const noon = Date.parse('2026-10-30T16:00:00Z');
const eight = Date.parse('2026-10-30T12:00:00Z');
const morning = Date.parse('2026-10-30T14:42:00Z');

assert.equal(adoptedCommenceMs({
  status: 'PENDING', storedMs: eight, freshMs: noon, nowMs: morning,
}), noon);
assert.equal(adoptedCommenceMs({
  status: 'PENDING', storedMs: noon, freshMs: eight, nowMs: Date.parse('2026-10-30T11:00:00Z'),
}), eight);
assert.equal(adoptedCommenceMs({
  status: 'PENDING', storedMs: eight, freshMs: noon, nowMs: noon,
}), null);
assert.equal(adoptedCommenceMs({
  status: 'COMPLETED', storedMs: eight, freshMs: noon, nowMs: morning,
}), null);
assert.equal(adoptedCommenceMs({
  status: 'EXITED', storedMs: eight, freshMs: noon, nowMs: morning,
}), null);
assert.equal(adoptedCommenceMs({
  status: 'PENDING', storedMs: noon, freshMs: noon, nowMs: morning,
}), null);
assert.equal(adoptedCommenceMs({
  status: 'PENDING', storedMs: null, freshMs: noon, nowMs: morning,
}), noon);

assert.equal(commenceMoveReopensLock(eight, noon, morning), true);
assert.equal(commenceMoveReopensLock(eight, noon, Date.parse('2026-10-30T15:50:00Z')), false);
assert.equal(commenceMoveReopensLock(noon, eight, Date.parse('2026-10-30T11:00:00Z')), false);

console.log('testCommenceFollow ok');
