#!/usr/bin/env node
/**
 * Unit tests for scripts/pagesDeployIdle.js (no live GitHub calls).
 */
import assert from 'assert';
import { spawnSync } from 'child_process';
import { pagesBusyFromSnapshot } from '../scripts/pagesDeployIdle.js';

function eq(actual, expected, msg) {
  assert.strictEqual(actual, expected, msg);
}

eq(pagesBusyFromSnapshot({ latestStatus: 'built' }), false, 'built is idle');
eq(pagesBusyFromSnapshot({ latestStatus: 'errored' }), false, 'errored is idle');
eq(pagesBusyFromSnapshot({ latestStatus: 'building' }), true, 'fresh building is busy');
eq(pagesBusyFromSnapshot({ latestStatus: 'queued' }), true, 'fresh queued build is busy');
eq(
  pagesBusyFromSnapshot({ latestStatus: 'building', latestAgeSec: 30 }),
  true,
  'building <3min with no runs is still busy',
);
eq(
  pagesBusyFromSnapshot({ latestStatus: 'building', latestAgeSec: 900 }),
  false,
  'stale building ghost with no runs is idle',
);
eq(
  pagesBusyFromSnapshot({ latestStatus: 'queued', latestAgeSec: 600 }),
  false,
  'stale queued ghost with no runs is idle',
);
eq(
  pagesBusyFromSnapshot({
    inProgress: 1,
    latestStatus: 'building',
    latestAgeSec: 900,
  }),
  true,
  'stale building WITH a dynamic run is still busy',
);
eq(pagesBusyFromSnapshot({ inProgress: 1, latestStatus: 'built' }), true, 'dynamic in_progress is busy');
eq(pagesBusyFromSnapshot({ queued: 2 }), true, 'dynamic queued is busy');
eq(pagesBusyFromSnapshot({ pending: 1 }), true, 'dynamic pending is busy');
eq(pagesBusyFromSnapshot({ waiting: 1 }), true, 'dynamic waiting is busy');
eq(pagesBusyFromSnapshot({ inProgress: '0', queued: '0', latestStatus: 'BUILT' }), false, 'case + string zeros');
eq(pagesBusyFromSnapshot({}), false, 'empty snapshot is idle');

function runCli(snapshot) {
  return spawnSync(
    process.execPath,
    ['scripts/pagesDeployIdle.js', '--check'],
    {
      encoding: 'utf8',
      env: {
        ...process.env,
        PAGES_IDLE_SNAPSHOT: JSON.stringify(snapshot),
        GH_REPO: 'dpk1212/nhl-savant',
      },
    },
  );
}

const idle = runCli({ inProgress: 0, queued: 0, pending: 0, waiting: 0, latestStatus: 'built' });
eq(idle.status, 0, `idle CLI should exit 0, got ${idle.status} ${idle.stdout} ${idle.stderr}`);
assert.match(idle.stdout, /idle/, 'idle CLI logs idle');

const ghost = runCli({
  inProgress: 0,
  queued: 0,
  pending: 0,
  waiting: 0,
  latestStatus: 'building',
  latestAgeSec: 840,
});
eq(ghost.status, 0, `stale ghost CLI should exit 0, got ${ghost.status} ${ghost.stdout}`);
assert.match(ghost.stdout, /idle/, 'stale ghost CLI logs idle');
assert.match(ghost.stdout, /stale Pages ghost/, 'stale ghost CLI mentions recovery');

console.log('pagesDeployIdle tests: ok');
