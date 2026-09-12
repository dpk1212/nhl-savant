/**
 * Lock alert All vs Top preference.
 * Usage: node tests/testLockAlertMode.mjs
 */
import assert from 'assert';
import {
  LOCK_ALERT_MODE,
  normalizeLockAlertMode,
  paidTagForEntitlement,
  paidTagIsExplicitMode,
  paidTagToWriteOnPaidVisit,
  isLockAlertMode,
} from '../src/lib/lockAlertMode.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

ok(isLockAlertMode('all') && isLockAlertMode('edge11'), 'modes');
ok(!isLockAlertMode('false') && !isLockAlertMode(null), 'off/missing not a UI mode');

ok(normalizeLockAlertMode('edge11') === LOCK_ALERT_MODE.EDGE11, 'edge11 stays');
ok(normalizeLockAlertMode('all') === LOCK_ALERT_MODE.ALL, 'all stays');
ok(normalizeLockAlertMode('true') === LOCK_ALERT_MODE.ALL, 'legacy true → all');
ok(normalizeLockAlertMode(null) === LOCK_ALERT_MODE.OFF, 'missing → off (not all)');
ok(normalizeLockAlertMode(undefined) === LOCK_ALERT_MODE.OFF, 'undefined → off');
ok(normalizeLockAlertMode('false') === LOCK_ALERT_MODE.OFF, 'false → off');
ok(normalizeLockAlertMode('') === LOCK_ALERT_MODE.OFF, 'empty → off');

ok(paidTagIsExplicitMode('all') && paidTagIsExplicitMode('edge11'), 'explicit all/edge11');
ok(paidTagIsExplicitMode('true'), 'legacy true is explicit');
ok(!paidTagIsExplicitMode(null) && !paidTagIsExplicitMode(undefined), 'unread is not explicit');
ok(!paidTagIsExplicitMode('false') && !paidTagIsExplicitMode(''), 'off/empty not explicit');

ok(paidTagForEntitlement('edge11') === 'edge11', 'entitlement keeps Top');
ok(paidTagForEntitlement('all') === 'all', 'entitlement keeps All');
ok(paidTagForEntitlement('true') === 'all', 'entitlement migrates true → all');
ok(paidTagForEntitlement(null) === 'all', 'entitlement default all only when caller already decided to write');

ok(paidTagToWriteOnPaidVisit('false', 'all') === 'all', 'paid visit restores untagged → all');
ok(paidTagToWriteOnPaidVisit('false', null) === 'all', 'paid visit restores untagged with no stored pref');
ok(paidTagToWriteOnPaidVisit('false', 'edge11') === 'edge11', 'stored Top wins over untagged');
ok(paidTagToWriteOnPaidVisit('edge11', 'all') === null, 'do not clobber live Top with leftover all');
ok(paidTagToWriteOnPaidVisit(null, 'all') === null, 'empty getTags: do not invent all');
ok(paidTagToWriteOnPaidVisit('all', null) === 'all', 'normalize live all');
ok(paidTagToWriteOnPaidVisit('true', null) === 'all', 'migrate legacy true');

console.log(`ok ${n}`);
