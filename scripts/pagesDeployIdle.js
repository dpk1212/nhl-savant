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
 *   - /pages/builds/latest status is queued or building
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

export function pagesBusyFromSnapshot({
  inProgress = 0,
  queued = 0,
  pending = 0,
  waiting = 0,
  latestStatus = '',
} = {}) {
  const n =
    toCount(inProgress) + toCount(queued) + toCount(pending) + toCount(waiting);
  const st = String(latestStatus || '').toLowerCase();
  return n > 0 || st === 'queued' || st === 'building';
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

function latestBuildStatus() {
  const r = repo();
  const raw = ghApi(`repos/${r}/pages/builds/latest`);
  const parsed = JSON.parse(raw);
  return parsed.status || '';
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
  const latest = probe('pages/builds/latest', () => latestBuildStatus(), '');
  const ok =
    inProgress.ok || queued.ok || pending.ok || waiting.ok || latest.ok;
  if (!ok) {
    throw new Error('all Pages probes failed');
  }
  return {
    inProgress: inProgress.value,
    queued: queued.value,
    pending: pending.value,
    waiting: waiting.value,
    latestStatus: latest.value,
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
  const { inProgress = 0, queued = 0, pending = 0, waiting = 0, latestStatus } =
    snapshot;
  console.log(
    `pagesDeployIdle: ${busy ? 'BUSY' : 'idle'} ` +
      `dynamic in_progress=${toCount(inProgress)} queued=${toCount(queued)} ` +
      `pending=${toCount(pending)} waiting=${toCount(waiting)} ` +
      `latest=${latestStatus || '?'}`,
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
