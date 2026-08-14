/**
 * Standalone prune for public/pinnacle_history.json.
 *
 * Fetch-cycle safety net: snapshotPinnacle already prunes on write, but if a
 * prior cycle left a 100MB+ pretty-printed blob, this rewrites it compact
 * and under the GitHub blob limit before `git add`.
 *
 * Usage: node scripts/prunePinnacleHistory.js
 */

import { readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { enforceGitSafeSize, GIT_SAFE_MAX_BYTES } from './lib/pinnacleTape.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_PATH = join(ROOT, 'public', 'pinnacle_history.json');

function fmtMiB(n) {
  return `${(n / (1024 * 1024)).toFixed(2)} MiB`;
}

if (!existsSync(OUT_PATH)) {
  console.log('prunePinnacleHistory: no public/pinnacle_history.json — skip');
  process.exit(0);
}

const beforeBytes = statSync(OUT_PATH).size;
let history;
try {
  history = JSON.parse(readFileSync(OUT_PATH, 'utf8'));
} catch (err) {
  console.error(`prunePinnacleHistory: parse failed: ${err.message}`);
  process.exit(1);
}

const nowSec = Math.floor(Date.now() / 1000);
const { json, bytes, emergencyClips } = enforceGitSafeSize(history, nowSec);
writeFileSync(OUT_PATH, json, 'utf8');

console.log(`prunePinnacleHistory: ${fmtMiB(beforeBytes)} → ${fmtMiB(bytes)} (cap ${fmtMiB(GIT_SAFE_MAX_BYTES)})`);
if (emergencyClips) console.log(`  emergencyClips=${emergencyClips}`);
if (bytes > GIT_SAFE_MAX_BYTES) {
  console.error(`prunePinnacleHistory: still ${fmtMiB(bytes)} — refusing to leave an unpushable blob`);
  process.exit(1);
}
