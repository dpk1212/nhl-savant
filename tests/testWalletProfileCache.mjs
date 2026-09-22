/**
 * Wallet-profile cache: one Firestore read serves the rest of a ledger job.
 * Run: node tests/testWalletProfileCache.mjs
 */
import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { readProfileCache, writeProfileCache } from '../scripts/lib/loadWalletProfiles.js';

const dir = mkdtempSync(join(tmpdir(), 'profile-cache-'));
const path = join(dir, 'cache.json');
let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    failed++;
    console.error('FAIL', msg);
  }
}

const now = Date.parse('2026-09-22T18:00:00Z');
const map = new Map();
for (let i = 0; i < 100; i++) {
  map.set(String(i).padStart(6, '0'), { bySport: { MLB: { n: i } } });
}

assert(readProfileCache(path, 30 * 60 * 1000, now) == null, 'missing file');
writeProfileCache(path, map, now);
const hit = readProfileCache(path, 30 * 60 * 1000, now + 5 * 60 * 1000);
assert(hit && hit.map.size === 100, 'fresh cache size');
assert(hit && hit.map.get('000000')?.bySport?.MLB?.n === 0, 'fresh cache row');
assert(hit && hit.ageMs === 5 * 60 * 1000, 'age');
assert(readProfileCache(path, 30 * 60 * 1000, now + 31 * 60 * 1000) == null, 'expired');
assert(readProfileCache(path, 0, now) == null, 'disabled');

rmSync(dir, { recursive: true, force: true });
if (failed) {
  console.error(`testWalletProfileCache: ${failed} failed`);
  process.exit(1);
}
console.log('testWalletProfileCache: ok');
