/**
 * Pinnacle tape retention — keep pinnacle_history.json git-pushable.
 * Usage: node tests/testPinnacleTape.mjs
 */
import assert from 'node:assert/strict';
import {
  appendTapePoint,
  clipFarGameTape,
  enforceGitSafeSize,
  GIT_SAFE_MAX_BYTES,
  HISTORY_KEEP_HOURS,
  isDenseTapeGame,
  pruneHistoryObject,
  trimHistorySeries,
  FAR_ML_KEEP,
} from '../scripts/lib/pinnacleTape.js';

const now = 1_780_000_000;

// trim: drop older than 7d, cap length
{
  const old = { t: now - (HISTORY_KEEP_HOURS + 1) * 3600, away: 100, home: -120 };
  const keep = { t: now - 3600, away: 105, home: -125 };
  const out = trimHistorySeries([old, keep], now, 2500);
  assert.equal(out.length, 1);
  assert.equal(out[0].away, 105);
}

{
  const arr = [];
  for (let i = 0; i < 50; i++) arr.push({ t: now - i, n: i });
  const out = trimHistorySeries(arr, now, 10);
  assert.equal(out.length, 10);
  assert.equal(out[0].n, 40);
}

// unchanged ML print is skipped; price change appends
{
  let hist = [];
  const a = { t: now, away: 150, home: -175, fairBook: 'pinnacle' };
  hist = appendTapePoint(hist, a, 'ml', now);
  hist = appendTapePoint(hist, { ...a, t: now + 240 }, 'ml', now + 240);
  assert.equal(hist.length, 1, 'duplicate ML quote skipped');
  hist = appendTapePoint(hist, { t: now + 480, away: 155, home: -180, fairBook: 'pinnacle' }, 'ml', now + 480);
  assert.equal(hist.length, 2, 'moved ML quote kept');
}

// alt totals: same line unchanged skipped; other line still stored
{
  let hist = [];
  hist = appendTapePoint(hist, { t: now, line: 8.5, overOdds: -110, underOdds: -110, fairBook: 'pinnacle' }, 'total', now);
  hist = appendTapePoint(hist, { t: now, line: 9.5, overOdds: 120, underOdds: -140, fairBook: 'pinnacle' }, 'total', now);
  hist = appendTapePoint(hist, { t: now + 240, line: 8.5, overOdds: -110, underOdds: -110, fairBook: 'pinnacle' }, 'total', now + 240);
  assert.equal(hist.length, 2, 'unchanged 8.5 not duplicated');
  hist = appendTapePoint(hist, { t: now + 480, line: 8.5, overOdds: -105, underOdds: -115, fairBook: 'pinnacle' }, 'total', now + 480);
  assert.equal(hist.length, 3, 'moved 8.5 kept');
}

// spread identity is homeLine
{
  let hist = [];
  hist = appendTapePoint(hist, {
    t: now, homeLine: -1.5, awayLine: 1.5, homeOdds: -140, awayOdds: 120, fairBook: 'pinnacle',
  }, 'spread', now);
  hist = appendTapePoint(hist, {
    t: now + 240, homeLine: -1.5, awayLine: 1.5, homeOdds: -140, awayOdds: 120, fairBook: 'pinnacle',
  }, 'spread', now + 240);
  assert.equal(hist.length, 1);
}

// far-future NFL: not dense; clip tails
{
  const far = { commence: new Date((now + 40 * 86400) * 1000).toISOString() };
  assert.equal(isDenseTapeGame(far, now), false);
  const near = { commence: new Date((now + 2 * 86400) * 1000).toISOString() };
  assert.equal(isDenseTapeGame(near, now), true);
  assert.equal(isDenseTapeGame({}, now), true, 'missing commence stays dense');
}

{
  const gd = {
    commence: new Date((now + 40 * 86400) * 1000).toISOString(),
    history: Array.from({ length: 400 }, (_, i) => ({ t: now - i * 240, away: 100 + i, home: -120 })),
    spreadHistory: Array.from({ length: 3000 }, (_, i) => ({ t: now - i, homeLine: -3.5, homeOdds: -110, awayOdds: -110 })),
    totalHistory: Array.from({ length: 4000 }, (_, i) => ({ t: now - i, line: 44.5, overOdds: -110, underOdds: -110 })),
  };
  pruneHistoryObject({ NFL: { ari_lac: gd } }, now);
  assert.ok(gd.history.length <= FAR_ML_KEEP);
  assert.ok(gd.spreadHistory.length <= 24);
  assert.ok(gd.totalHistory.length <= 40);
}

// compact serialize stays under GitHub limit even with a fat NFL slate
{
  const history = { NFL: {} };
  for (let g = 0; g < 280; g++) {
    const commence = new Date((now + (20 + g) * 86400) * 1000).toISOString();
    history.NFL[`g${g}`] = {
      commence,
      opener: { t: now, away: 150, home: -175 },
      current: { away: 150, home: -175 },
      history: Array.from({ length: 400 }, (_, i) => ({ t: now - i * 240, away: 150, home: -175, fairBook: 'pinnacle' })),
      spreadHistory: Array.from({ length: 3400 }, (_, i) => ({
        t: now - i * 60, homeLine: -3.5, awayLine: 3.5, homeOdds: -110, awayOdds: -110, fairBook: 'pinnacle',
      })),
      totalHistory: Array.from({ length: 4900 }, (_, i) => ({
        t: now - i * 60, line: 44.5, overOdds: -110, underOdds: -110, fairBook: 'pinnacle',
      })),
    };
  }
  const { json, bytes, emergencyClips } = enforceGitSafeSize(history, now);
  assert.ok(bytes < GIT_SAFE_MAX_BYTES, `bytes ${bytes} should be < ${GIT_SAFE_MAX_BYTES}`);
  assert.ok(bytes < 20 * 1024 * 1024, `expected far-slate prune well under 20MiB, got ${bytes}`);
  JSON.parse(json);
  assert.ok(emergencyClips === 0 || bytes <= GIT_SAFE_MAX_BYTES);
}

// clipFarGameTape mutates in place
{
  const gd = { history: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] };
  clipFarGameTape(gd);
  assert.deepEqual(gd.history, [3, 4, 5, 6, 7, 8, 9, 10]);
}

console.log('testPinnacleTape: ok');
