/**
 * voidedLocks — hard-void ghost locks from PnL / Locked list.
 * Run: node tests/testVoidedLocks.mjs
 */
import { isVoidedLockSide, VOIDED_LOCK_SIDES } from '../src/lib/voidedLocks.js';

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log(`  ✅ ${name}`); }
  else { fail++; console.error(`  ❌ ${name}`); }
}

check('bos_nyy__2 home is voided',
  isVoidedLockSide('2026-08-29_MLB_bos_nyy__2', 'home') === true);
check('bos_nyy__2 away is NOT voided',
  isVoidedLockSide('2026-08-29_MLB_bos_nyy__2', 'away') === false);
check('Game 1 bos_nyy home is NOT voided',
  isVoidedLockSide('2026-08-29_MLB_bos_nyy', 'home') === false);
check('set non-empty', VOIDED_LOCK_SIDES.size >= 1);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
