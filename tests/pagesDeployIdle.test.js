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
eq(pagesBusyFromSnapshot({ latestStatus: 'building' }), true, 'building is busy');
eq(pagesBusyFromSnapshot({ latestStatus: 'queued' }), true, 'queued build is busy');
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

const busy = runCli({ inProgress: 1, latestStatus: 'building' });
eq(busy.status, 1, `busy CLI should exit 1, got ${busy.status}`);
assert.match(busy.stdout, /BUSY/, 'busy CLI logs BUSY');

console.log('pagesDeployIdle tests: ok');
