import test from 'node:test';
import assert from 'node:assert/strict';
import { setImmediate } from 'node:timers';
import {
  PROFILE_REFRESH_MS,
  createProfileRefresher,
  msUntilNextProfileReload,
  shouldReloadProfilesOnReturn,
} from './profileRefresh.js';

const MIN = 60 * 1000;
const T0 = Date.UTC(2026, 10, 21, 15, 0, 0);

test('the refresh window is 8 minutes, the same window the open tab already used', () => {
  assert.equal(PROFILE_REFRESH_MS, 8 * MIN);
});

test('a return to the tab inside the window keeps the copy it has', () => {
  assert.equal(shouldReloadProfilesOnReturn({ lastLoadedAt: T0, now: T0 + 1000 }), false);
  assert.equal(shouldReloadProfilesOnReturn({ lastLoadedAt: T0, now: T0 + 7 * MIN + 59 * 1000 }), false);
});

test('a return at or past the window reloads', () => {
  assert.equal(shouldReloadProfilesOnReturn({ lastLoadedAt: T0, now: T0 + 8 * MIN }), true);
  assert.equal(shouldReloadProfilesOnReturn({ lastLoadedAt: T0, now: T0 + 60 * MIN }), true);
});

test('a return with no good copy reloads, so a failed first load is retried', () => {
  assert.equal(shouldReloadProfilesOnReturn({ lastLoadedAt: 0, now: T0 }), true);
  assert.equal(shouldReloadProfilesOnReturn({ lastLoadedAt: null, now: T0 }), true);
  assert.equal(shouldReloadProfilesOnReturn({ lastLoadedAt: undefined, now: T0 }), true);
});

test('a clock that moved backwards reloads instead of trusting the copy', () => {
  assert.equal(shouldReloadProfilesOnReturn({ lastLoadedAt: T0, now: T0 - MIN }), true);
  assert.equal(shouldReloadProfilesOnReturn({ lastLoadedAt: T0, now: NaN }), true);
});

test('the next reload is counted from the last attempt, not from the return to the tab', () => {
  // Loaded at T0, tab hidden, back at T0+7m: no reload, and the timer has 1 minute left.
  assert.equal(msUntilNextProfileReload({ lastAttemptAt: T0, now: T0 + 7 * MIN }), MIN);
  assert.equal(msUntilNextProfileReload({ lastAttemptAt: T0, now: T0 }), 8 * MIN);
});

test('an overdue reload is due now and never waits longer than one window', () => {
  assert.equal(msUntilNextProfileReload({ lastAttemptAt: T0, now: T0 + 30 * MIN }), 0);
  assert.equal(msUntilNextProfileReload({ lastAttemptAt: 0, now: T0 }), 0);
  assert.equal(msUntilNextProfileReload({ lastAttemptAt: T0, now: T0 - 5 * MIN }), 8 * MIN);
});

test('a copy is never older than one window while the tab is visible', () => {
  // Walk a tab that is hidden and shown every 3 minutes for an hour.
  let lastLoadedAt = T0;
  let lastAttemptAt = T0;
  let worstAge = 0;
  for (let now = T0; now <= T0 + 60 * MIN; now += 1000) {
    const sinceStart = now - T0;
    const returning = sinceStart > 0 && sinceStart % (3 * MIN) === 0;
    const due = msUntilNextProfileReload({ lastAttemptAt, now }) === 0;
    if (due || (returning && shouldReloadProfilesOnReturn({ lastLoadedAt, now }))) {
      lastLoadedAt = now;
      lastAttemptAt = now;
    }
    worstAge = Math.max(worstAge, now - lastLoadedAt);
  }
  assert.ok(worstAge < PROFILE_REFRESH_MS, `worst age ${worstAge} ms`);
});

test('twenty returns inside one window cost one load, not twenty-one', () => {
  let lastLoadedAt = T0;
  let loads = 1;
  for (let i = 1; i <= 20; i += 1) {
    const now = T0 + i * 20 * 1000;
    if (shouldReloadProfilesOnReturn({ lastLoadedAt, now })) { loads += 1; lastLoadedAt = now; }
  }
  assert.equal(loads, 1);
});

// ── The schedule the page runs, on a fake clock ─────────────────────────────

const flush = () => new Promise((resolve) => setImmediate(resolve));

function harness() {
  const h = {
    t: T0,
    visible: true,
    loads: 0,
    result: true, // what the next load returns: true = profiles came back
    hold: null,   // set to hold a load open until release()
    timers: new Map(),
    nextId: 1,
  };
  h.refresher = createProfileRefresher({
    load: async () => {
      h.loads += 1;
      if (h.hold) await h.hold.promise;
      if (h.result === 'throw') throw new Error('read failed');
      if (h.result) h.lastGoodAt = h.t;
      return h.result;
    },
    isVisible: () => h.visible,
    now: () => h.t,
    setTimer: (fn, ms) => { const id = h.nextId; h.nextId += 1; h.timers.set(id, { fn, at: h.t + ms }); return id; },
    clearTimer: (id) => { h.timers.delete(id); },
  });
  h.start = async () => { h.refresher.start(); await flush(); };
  h.hide = async () => { h.visible = false; h.refresher.onVisibilityChange(); await flush(); };
  h.show = async () => { h.visible = true; h.refresher.onVisibilityChange(); await flush(); };
  // Move the clock forward, firing each timer at its own time.
  h.advance = async (ms) => {
    const end = h.t + ms;
    for (;;) {
      const due = [...h.timers].filter(([, x]) => x.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
      if (!due) break;
      h.timers.delete(due[0]);
      h.t = Math.max(h.t, due[1].at);
      due[1].fn();
      await flush();
    }
    h.t = end;
  };
  h.holdOpen = () => { let release; const promise = new Promise((r) => { release = r; }); h.hold = { promise }; return async () => { h.hold = null; release(); await flush(); }; };
  return h;
}

test('page: loads once on open, then every 8 minutes while visible', async () => {
  const h = harness();
  await h.start();
  assert.equal(h.loads, 1);
  await h.advance(8 * MIN - 1);
  assert.equal(h.loads, 1);
  await h.advance(1);
  assert.equal(h.loads, 2);
  await h.advance(16 * MIN);
  assert.equal(h.loads, 4);
});

test('page: a tab opened in the background still loads once', async () => {
  const h = harness();
  h.visible = false;
  await h.start();
  assert.equal(h.loads, 1);
  assert.equal(h.timers.size, 0);
});

test('page: a return inside 8 minutes does not reload, and the timer keeps the original deadline', async () => {
  const h = harness();
  await h.start();
  await h.advance(2 * MIN);
  await h.hide();
  assert.equal(h.timers.size, 0);
  await h.advance(1 * MIN);
  await h.show();
  assert.equal(h.loads, 1);
  await h.advance(5 * MIN - 1); // 7:59:59.999 after the load
  assert.equal(h.loads, 1);
  await h.advance(1);            // 8:00 after the load
  assert.equal(h.loads, 2);
});

test('page: a return after 8 minutes reloads at once', async () => {
  const h = harness();
  await h.start();
  await h.hide();
  await h.advance(60 * MIN);
  assert.equal(h.loads, 1);
  await h.show();
  assert.equal(h.loads, 2);
});

test('page: thirty returns in ten minutes cost two loads, where the old page made thirty-one', async () => {
  const h = harness();
  await h.start();
  for (let i = 0; i < 30; i += 1) {
    await h.hide();
    await h.advance(10 * 1000);
    await h.show();
    await h.advance(10 * 1000);
  }
  assert.equal(h.loads, 2); // the open, plus the 8-minute refresh
});

test('page: a failed load is retried on the next return, and waits a full window while visible', async () => {
  const h = harness();
  h.result = false;
  await h.start();
  assert.equal(h.loads, 1);
  await h.advance(8 * MIN - 1);
  assert.equal(h.loads, 1);
  await h.hide();
  await h.show();
  assert.equal(h.loads, 2);
  h.result = true;
  await h.hide();
  await h.show();
  assert.equal(h.loads, 3);
  await h.hide();
  await h.show();
  assert.equal(h.loads, 3);
});

test('page: a load that throws does not stop the schedule or loop', async () => {
  const h = harness();
  h.result = 'throw';
  await h.start();
  assert.equal(h.loads, 1);
  await h.advance(8 * MIN);
  assert.equal(h.loads, 2);
  await h.advance(4 * MIN);
  assert.equal(h.loads, 2);
});

test('page: a return while a load is open does not start a second load', async () => {
  const h = harness();
  const release = h.holdOpen();
  await h.start();
  await h.hide();
  await h.show();
  await h.hide();
  await h.show();
  assert.equal(h.loads, 1);
  await release();
  assert.equal(h.timers.size, 1);
  await h.advance(8 * MIN);
  assert.equal(h.loads, 2);
});

test('page: a slow load waits a full window from when it ends', async () => {
  const h = harness();
  const release = h.holdOpen();
  await h.start();
  h.t += 20 * MIN; // the read hangs for 20 minutes
  await release();
  assert.equal(h.loads, 1);
  await h.advance(8 * MIN - 1);
  assert.equal(h.loads, 1);
  await h.advance(1);
  assert.equal(h.loads, 2);
});

test('page: after the page closes nothing loads again', async () => {
  const h = harness();
  await h.start();
  h.refresher.stop();
  assert.equal(h.timers.size, 0);
  await h.show();
  await h.advance(60 * MIN);
  assert.equal(h.loads, 1);
});

test('page: the copy is never more than 8 minutes old while the tab is visible', async () => {
  const h = harness();
  let worst = 0;
  await h.start();
  for (let i = 0; i < 400; i += 1) {
    // Uneven hide and show pattern over about three hours.
    if (i % 7 === 3) await h.hide();
    if (i % 7 === 5 || i % 11 === 0) await h.show();
    await h.advance(27 * 1000);
    if (h.visible) worst = Math.max(worst, h.t - h.lastGoodAt);
  }
  assert.ok(h.loads > 10, `loads ${h.loads}`);
  assert.ok(worst <= PROFILE_REFRESH_MS, `worst visible age ${worst} ms`);
});
