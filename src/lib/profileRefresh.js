/**
 * When the Sharp Flow page reloads the wallet profiles.
 *
 * One reload is every document in sharpWalletProfiles (1,494 documents,
 * 29 MB on 2026-11-21). The page used to reload on every return to the tab,
 * however recent the last load was. Profiles only change when the grade job
 * runs, a few times a day, so a return inside the refresh window now keeps
 * the copy it has. A tab left open already ran on profiles up to
 * PROFILE_REFRESH_MS old, and that limit does not move.
 */

export const PROFILE_REFRESH_MS = 8 * 60 * 1000;

/**
 * On return to the tab: reload when there is no good copy yet, or when the
 * last good copy is a full refresh window old. A failed load leaves
 * lastLoadedAt unset or old, so the next return retries, as before.
 */
export function shouldReloadProfilesOnReturn({ lastLoadedAt, now, refreshMs = PROFILE_REFRESH_MS }) {
  if (!Number.isFinite(lastLoadedAt) || lastLoadedAt <= 0) return true;
  if (!Number.isFinite(now)) return true;
  // A clock that moved backwards cannot prove the copy is fresh.
  if (now < lastLoadedAt) return true;
  return now - lastLoadedAt >= refreshMs;
}

/**
 * How long a visible tab waits before its next reload. Counted from the end
 * of the last attempt, not from the return to the tab, so a skipped reload on
 * return cannot stretch the copy past one refresh window. A failed attempt
 * waits a full window too, as before, so a failing read is not retried in a
 * loop.
 */
export function msUntilNextProfileReload({ lastAttemptAt, now, refreshMs = PROFILE_REFRESH_MS }) {
  if (!Number.isFinite(lastAttemptAt) || lastAttemptAt <= 0) return 0;
  if (!Number.isFinite(now) || now < lastAttemptAt) return refreshMs;
  return Math.min(refreshMs, Math.max(0, lastAttemptAt + refreshMs - now));
}

/**
 * The reload schedule the page runs, with the clock, the timer and the
 * visibility check passed in so the test drives the same code the page ships.
 *
 *   load()      resolves true when profiles came back, false when they did not.
 *   isVisible() true while the tab is on screen.
 *
 * One load at a time. A hidden tab holds no timer. start() loads once and
 * arms the timer; onVisibilityChange() is the visibilitychange handler;
 * stop() is the unmount.
 */
export function createProfileRefresher({
  load,
  isVisible,
  now = () => Date.now(),
  setTimer = (fn, ms) => setTimeout(fn, ms),
  clearTimer = (id) => clearTimeout(id),
  refreshMs = PROFILE_REFRESH_MS,
}) {
  let timer = null;
  let inFlight = false;
  let stopped = false;
  let lastAttemptAt = 0; // end of the last load, good or failed
  let lastLoadedAt = 0;  // end of the last load that returned profiles

  const clear = () => {
    if (timer != null) { clearTimer(timer); timer = null; }
  };
  const schedule = () => {
    clear();
    if (stopped || !isVisible()) return;
    timer = setTimer(() => {
      timer = null;
      if (isVisible()) run();
    }, msUntilNextProfileReload({ lastAttemptAt, now: now(), refreshMs }));
  };
  const run = async () => {
    if (inFlight || stopped) return;
    inFlight = true;
    try {
      if (await load()) lastLoadedAt = now();
    } catch {
      // load() reports its own failures; a throw counts as a failed load.
    } finally {
      // Stamped when the load ends, so a slow or failed read still waits
      // one full window before the timer tries again.
      lastAttemptAt = now();
      inFlight = false;
      schedule();
    }
  };

  return {
    start: run,
    onVisibilityChange() {
      if (!isVisible()) { clear(); return; }
      if (shouldReloadProfilesOnReturn({ lastLoadedAt, now: now(), refreshMs })) run();
      else schedule();
    },
    stop() {
      stopped = true;
      clear();
    },
  };
}
