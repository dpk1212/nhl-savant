import assert from 'node:assert/strict';
import {
  isSportSlateActive,
  DEFAULT_SLATE_ACTIVE_AFTER_COMMENCE_MS,
} from '../src/lib/sportSlateActive.js';

const nowMs = Date.parse('2026-08-29T20:00:00-04:00');
const today = '2026-08-29';

// Finished MLB game + graded locks → inactive
assert.equal(
  isSportSlateActive('MLB', {
    nowMs,
    allGames: [{ sport: 'MLB', key: 'nyy-bos', commence: '2026-08-29T12:00:00-04:00' }],
    lockedPicks: {
      [`${today}_MLB_nyy-bos`]: {
        sport: 'MLB',
        sides: {
          home: { status: 'COMPLETED', result: { outcome: 'WIN' }, finalUnits: 1, lockStage: 'LOCKED' },
        },
      },
    },
  }),
  false,
  'graded + old commence → hide',
);

// Same game still pending → keep visible
assert.equal(
  isSportSlateActive('MLB', {
    nowMs,
    allGames: [{ sport: 'MLB', key: 'nyy-bos', commence: '2026-08-29T12:00:00-04:00' }],
    lockedPicks: {
      [`${today}_MLB_nyy-bos`]: {
        sport: 'MLB',
        sides: {
          home: { lockStage: 'LOCKED', finalUnits: 1.5 },
        },
      },
    },
  }),
  true,
  'pending lock keeps sport visible even after commence window',
);

// Upcoming game → active
assert.equal(
  isSportSlateActive('NHL', {
    nowMs,
    allGames: [{ sport: 'NHL', key: 'bos-nyi', commence: '2026-08-29T19:00:00-04:00' }],
  }),
  true,
  'upcoming game keeps sport visible',
);

// Within default window after tip → active
assert.equal(
  isSportSlateActive('NBA', {
    nowMs,
    allGames: [{
      sport: 'NBA',
      key: 'lal-gsw',
      commence: new Date(nowMs - DEFAULT_SLATE_ACTIVE_AFTER_COMMENCE_MS + 60_000).toISOString(),
    }],
  }),
  true,
  'recent tip still in window',
);

// UFC uses longer window
assert.equal(
  isSportSlateActive('UFC', {
    nowMs,
    allGames: [{ sport: 'UFC', key: 'fight-1', commence: '2026-08-29T14:00:00-04:00' }],
  }),
  true,
  'UFC 6h after tip still active under 8h window',
);

console.log('testSportSlateActive: ok');
