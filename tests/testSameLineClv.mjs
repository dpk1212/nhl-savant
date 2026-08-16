/**
 * Beating Close must compare the flagged ticket to same-line NOW.
 * MAIN closingOdds (Over 8.5 −117) vs alt ticket (Over 9.5 +127) is not CLV.
 * Usage: node tests/testSameLineClv.mjs
 */
import assert from 'node:assert/strict';
import { mapLockedPickToCardFixture } from '../src/components/sharpFlow/cards/mapPositionCard.js';

const tOpen = Math.floor(Date.now() / 1000) - 4 * 3600;
const tNow = Math.floor(Date.now() / 1000) - 60;
const commence = Date.now() + 5 * 3600 * 1000;

const pinnacleHistory = {
  MLB: {
    kcr_laa: {
      totalCurrent: { line: 8.5, overOdds: -117, underOdds: 104, max: 5625, isMain: true },
      totalLines: [
        { line: 8.5, overOdds: -117, underOdds: 104, max: 5625, isMain: true },
        { line: 9.5, overOdds: 129, underOdds: -149, max: 5625 },
      ],
      totalHistory: [
        { t: tOpen, line: 9.5, overOdds: 108, underOdds: -126, max: 1500, isMain: true },
        { t: tNow, line: 9.5, overOdds: 129, underOdds: -149, max: 5625 },
        { t: tNow, line: 8.5, overOdds: -117, underOdds: 104, max: 5625, isMain: true },
      ],
    },
  },
};

const f = mapLockedPickToCardFixture({
  key: '2026-08-16_MLB_kcr_laa_total:over',
  sport: 'MLB',
  gameKey: 'kcr_laa',
  marketType: 'total',
  side: 'over',
  team: 'Over 9.5',
  line: 9.5,
  odds: 127,
  units: 2.5,
  gameTime: commence,
  status: 'PENDING',
  away: 'Kansas City Royals',
  home: 'Los Angeles Angels',
  // Poison stamp: MAIN 8.5 juice. Old CLV treated this as "close".
  closingOdds: -117,
  pinnacleOdds: 108,
  lockPinnOdds: 108,
}, { pinnacleHistory });

assert.equal(f.ticketLine, 9.5);
assert.equal(f.lockOdds, 127);
assert.equal(f.nowOdds, 129, `NOW must be 9.5 tape, got ${f.nowOdds}`);
assert.ok(f.clvPct < 0.3, `ticket +127 vs now +129 is not beating close, got ${f.clvPct}`);
const clvSig = f.marketSignals?.signals?.find((s) => s.id === 'clvLive');
assert.ok(!clvSig?.met, `CLV chip must be off, got ${JSON.stringify(clvSig)}`);

console.log('testSameLineClv: ok', { clvPct: f.clvPct, nowOdds: f.nowOdds, lockOdds: f.lockOdds });
