#!/usr/bin/env node
/**
 * Gate gh-pages pushes so GitHub's built-in pages-build-deployment
 * (event=dynamic) can finish. JSON-patching gh-pages every cycle cancels
 * the previous Pages deploy; after a wedge the live CDN freezes on the
 * last successful snapshot (2026-10-05 nhlsavant.com stuck at 19:14 UTC).
 *
 * --check  exit 0 if idle (safe to push), 1 if a Pages deploy is in flight
 * --wait N poll every 5s until idle or N seconds elapse (then exit 1)
 *
 * A Pages deploy is "in flight" when:
 *   - any event=dynamic Actions run is pending/queued/in_progress/waiting, OR
 *   - /pages/builds/latest status is queued or building AND younger than
 *     PAGES_BUILDING_STALE_SEC (default 180). A "building" status with no
 *     dynamic run and age >= that is a wedged Pages API ghost (2026-10-05
 *     after merge: latest=building since 21:04, no Actions run, CDN still
 *     frozen). Treat that as idle so the next push can recover.
 *
 * API errors fail closed (busy) so one skipped cycle is preferred over
 * another cancel-storm. Override with PAGES_IDLE_FAIL_OPEN=1.
 *
 * PAGES_IDLE_SNAPSHOT='{"inProgress":0,"latestStatus":"built"}' skips gh
 * (used by tests).
 */
import { execFileSync } from 'child_process';
import { pathToFileURL } from 'url';
import { resolve } from 'path';

export const STALE_BUILDING_SEC = Number(
  process.env.PAGES_BUILDING_STALE_SEC || 180,
);

export function pagesBusyFromSnapshot({
  inProgress = 0,
  queued = 0,
  pending = 0,
  waiting = 0,
  latestStatus = '',
  latestAgeSec = 0,
} = {}) {
  const n =
    toCount(inProgress) + toCount(queued) + toCount(pending) + toCount(waiting);
  const st = String(latestStatus || '').toLowerCase();
  const building = st === 'queued' || st === 'building';
  // Ghost: Pages API left status=building after the Actions run cancelled.
  // No dynamic run is actually deploying, so skipping forever freezes the CDN.
  if (building && n === 0 && toCount(latestAgeSec) >= STALE_BUILDING_SEC) {
    return false;
  }
  return n > 0 || building;
}

function toCount(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function repo() {
  return process.env.GH_REPO || process.env.GITHUB_REPOSITORY || '';
}

function ghApi(path) {
  return execFileSync('gh', ['api', path], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: process.env,
  });
}

function runCount(status) {
  const r = repo();
  const raw = ghApi(
    `repos/${r}/actions/runs?event=dynamic&status=${encodeURIComponent(status)}&per_page=1`,
  );
  const parsed = JSON.parse(raw);
  return toCount(parsed.total_count);
}

function latestBuildInfo() {
  const r = repo();
  const raw = ghApi(`repos/${r}/pages/builds/latest`);
  const parsed = JSON.parse(raw);
  const ts = parsed.updated_at || parsed.created_at;
  const age = ts ? Math.max(0, (Date.now() - Date.parse(ts)) / 1000) : 0;
  return {
    status: parsed.status || '',
    latestAgeSec: Number.isFinite(age) ? Math.round(age) : 0,
  };
}

function probe(label, fn, fallback) {
  try {
    return { ok: true, value: fn() };
  } catch (err) {
    console.warn(`pagesDeployIdle: ${label} failed: ${err.message || err}`);
    return { ok: false, value: fallback };
  }
}

export function readPagesSnapshot() {
  const inProgress = probe('in_progress', () => runCount('in_progress'), 0);
  const queued = probe('queued', () => runCount('queued'), 0);
  const pending = probe('pending', () => runCount('pending'), 0);
  const waiting = probe('waiting', () => runCount('waiting'), 0);
  const latest = probe('pages/builds/latest', () => latestBuildInfo(), {
    status: '',
    latestAgeSec: 0,
  });
  const ok =
    inProgress.ok || queued.ok || pending.ok || waiting.ok || latest.ok;
  if (!ok) {
    throw new Error('all Pages probes failed');
  }
  const latestVal = latest.value || {};
  return {
    inProgress: inProgress.value,
    queued: queued.value,
    pending: pending.value,
    waiting: waiting.value,
    latestStatus: latestVal.status || '',
    latestAgeSec: toCount(latestVal.latestAgeSec),
  };
}

function snapshotOrBusy() {
  try {
    return readPagesSnapshot();
  } catch (err) {
    if (process.env.PAGES_IDLE_FAIL_OPEN === '1') {
      console.warn(
        `pagesDeployIdle: API error (fail-open idle): ${err.message || err}`,
      );
      return { latestStatus: 'built' };
    }
    console.warn(
      `pagesDeployIdle: API error (fail-closed busy): ${err.message || err}`,
    );
    return { inProgress: 1, latestStatus: 'unknown' };
  }
}

function logSnapshot(snapshot, busy) {
  const {
    inProgress = 0,
    queued = 0,
    pending = 0,
    waiting = 0,
    latestStatus,
    latestAgeSec = 0,
  } = snapshot;
  const age = toCount(latestAgeSec);
  const ghost =
    !busy &&
    (String(latestStatus || '').toLowerCase() === 'building' ||
      String(latestStatus || '').toLowerCase() === 'queued');
  console.log(
    `pagesDeployIdle: ${busy ? 'BUSY' : 'idle'} ` +
      `dynamic in_progress=${toCount(inProgress)} queued=${toCount(queued)} ` +
      `pending=${toCount(pending)} waiting=${toCount(waiting)} ` +
      `latest=${latestStatus || '?'}` +
      (age ? ` age=${age}s` : '') +
      (ghost ? ' (stale Pages ghost — pushing to recover)' : ''),
  );
}

function checkOnce() {
  const snapshot = process.env.PAGES_IDLE_SNAPSHOT
    ? JSON.parse(process.env.PAGES_IDLE_SNAPSHOT)
    : snapshotOrBusy();
  const busy = pagesBusyFromSnapshot(snapshot);
  logSnapshot(snapshot, busy);
  return !busy;
}

function parseArgs(argv) {
  let waitSec = 0;
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--wait') {
      waitSec = Number(argv[++i] || 0);
    }
  }
  return { waitSec: Number.isFinite(waitSec) && waitSec > 0 ? waitSec : 0 };
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

export async function main(argv = process.argv) {
  const { waitSec } = parseArgs(argv);
  if (
    !repo() &&
    !process.env.PAGES_IDLE_SNAPSHOT &&
    process.env.PAGES_IDLE_ALLOW_EMPTY_REPO !== '1'
  ) {
    console.error('pagesDeployIdle: set GH_REPO or GITHUB_REPOSITORY');
    return 2;
  }

  if (!waitSec) {
    return checkOnce() ? 0 : 1;
  }

  const deadline = Date.now() + waitSec * 1000;
  while (true) {
    if (checkOnce()) return 0;
    if (Date.now() >= deadline) {
      console.log(`pagesDeployIdle: still busy after ${waitSec}s`);
      return 1;
    }
    sleep(5000);
  }
}

const invoked =
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (invoked) {
  process.exit(await main());
}
