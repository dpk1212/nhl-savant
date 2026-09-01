/**
 * Sealed TOTAL hero must not chase live vault after T-15.
 * SDP/CIN Under 9.5 ↔ 8.5 on 2026-08-31.
 * Usage: node tests/testLockedTotalFreeze.mjs
 */
import assert from 'node:assert/strict';
import { mapLockedPickToCardFixture } from '../src/components/sharpFlow/cards/mapPositionCard.js';

const now = Date.now();
const commenceMs = now - 20 * 60 * 1000; // 20 min ago → past T-15
const liveVault = {
  MLB: {
    sdp_cin: {
      positions: [
        { side: 'under', entryLine: 8.5, avgPrice: 0.51, invested: 2000 },
        { side: 'under', entryLine: 9.5, avgPrice: 0.49, invested: 200 },
      ],
    },
  },
};

const f = mapLockedPickToCardFixture({
  key: '2026-08-31_MLB_sdp_cin_total:under',
  sport: 'MLB',
  gameKey: 'sdp_cin',
  marketType: 'total',
  side: 'under',
  pickSide: 'under',
  team: 'Under 9.5',
  away: 'San Diego Padres',
  home: 'Cincinnati Reds',
  line: 9.5,
  odds: -125,
  units: 1.5,
  commenceMs,
  gameTime: commenceMs,
  status: 'PENDING',
  vaultPositions: null,
}, {
  totalPositions: liveVault,
  pinnacleHistory: {
    MLB: {
      sdp_cin: {
        commence: new Date(commenceMs + 15 * 60 * 1000).toISOString(),
        totalCurrent: { line: 8.5, overOdds: -110, underOdds: -110, isMain: true },
        totalLines: [
          { line: 8.5, overOdds: -110, underOdds: -110, isMain: true },
          { line: 9.5, overOdds: 100, underOdds: -125 },
        ],
        totalHistory: [
          { t: Math.floor((commenceMs - 60 * 60 * 1000) / 1000), line: 9.5, overOdds: 100, underOdds: -125, isMain: true },
          { t: Math.floor(now / 1000), line: 8.5, overOdds: -110, underOdds: -110, isMain: true },
        ],
      },
    },
  },
});

assert.equal(f.ticketLine, 9.5, `sealed hero line stayed 9.5, got ${f.ticketLine}`);
assert.match(String(f.pickLabel), /9\.5/, `hero label is Under 9.5, got ${f.pickLabel}`);
assert.ok(!String(f.pickLabel).includes('8.5'), `hero must not become 8.5, got ${f.pickLabel}`);

console.log('testLockedTotalFreeze: ok');
