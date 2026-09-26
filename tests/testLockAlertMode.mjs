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
  onesignalFiltersForEdge,
  paidTagWhenOptedInAndUntagged,
  fullAudienceReached,
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

ok(normalizeLockAlertMode('all_c') === LOCK_ALERT_MODE.ALL, 'all_c is All');
ok(normalizeLockAlertMode('edge11_c') === LOCK_ALERT_MODE.EDGE11, 'edge11_c is Top');
ok(paidTagIsExplicitMode('all_c') && paidTagIsExplicitMode('edge11_c'), 'conservative tags explicit');
ok(paidTagForEntitlement('edge11_c') === 'edge11_c', 'entitlement keeps conservative Top');
ok(paidTagForEntitlement('all', 'conservative') === 'all_c', 'entitlement applies conservative');
ok(paidTagForEntitlement('edge11', 'conservative') === 'edge11_c', 'Top + conservative');
ok(paidTagToWriteOnPaidVisit('all', null, 'conservative') === 'all_c', 'paid visit heals scale');
ok(paidTagToWriteOnPaidVisit('edge11', 'all', 'conservative') === 'edge11_c', 'heal scale without clobbering Top');

ok(onesignalFiltersForEdge(5).some((f) => f.value === 'all'), 'full all-lock audience');
ok(!onesignalFiltersForEdge(5).some((f) => f.value === 'edge11'), 'full non-top excludes edge11');
ok(onesignalFiltersForEdge(12).some((f) => f.value === 'edge11'), 'full top includes edge11');
ok(onesignalFiltersForEdge(5, { scale: 'conservative' }).every((f) => f.value !== 'all'), 'cons does not hit full all');
ok(onesignalFiltersForEdge(5, { scale: 'conservative' }).some((f) => f.value === 'all_c'), 'cons all-lock audience');
ok(onesignalFiltersForEdge(12, { scale: 'conservative' }).some((f) => f.value === 'edge11_c'), 'cons top includes edge11_c');

ok(paidTagWhenOptedInAndUntagged(null, 'all') === 'all', 'opted-in empty tag restores All');
ok(paidTagWhenOptedInAndUntagged(null, 'edge11') === 'edge11', 'opted-in empty tag restores Top');
ok(paidTagWhenOptedInAndUntagged('all', 'edge11') === null, 'live tag is not replaced');
ok(paidTagWhenOptedInAndUntagged(null, null) === null, 'no stored mode, no invent');
ok(fullAudienceReached({ id: 'm1', recipients: 160 }), 'id with a count is delivered');
ok(fullAudienceReached({ id: 'm1', recipients: 0 }), 'id with recipients still 0 is delivered');
ok(!fullAudienceReached({ recipients: 10 }), 'missing id is not delivered');

console.log(`ok ${n}`);
