/**
 * Action tab eligibility — same gates as ConfirmedActionDesk (pills off).
 * Usage: node tests/testActionTabEligible.mjs
 */
import assert from 'node:assert/strict';
import { isActionTabEligible, MIN_ACTION_INVESTED } from '../src/lib/confirmedActionDesk.js';

assert.equal(MIN_ACTION_INVESTED, 500);

assert.equal(isActionTabEligible({
  whitelistTier: 'CONFIRMED',
  invested: 500,
  sizeRatio: 0.4,
  sportRec: { whitelistTier: 'CONFIRMED' },
}), true, 'CONFIRMED $500+ paints (non size-skill)');

assert.equal(isActionTabEligible({
  whitelistTier: 'FLAT',
  invested: 5000,
  sizeRatio: 2,
  sportRec: { whitelistTier: 'FLAT' },
}), false, 'FLAT never paints');

assert.equal(isActionTabEligible({
  whitelistTier: 'CONFIRMED',
  invested: 499,
  sizeRatio: 2,
  sportRec: { whitelistTier: 'CONFIRMED' },
}), false, 'sub-$500 hidden');

assert.equal(isActionTabEligible({
  whitelistTier: 'CONFIRMED',
  invested: 800,
  sizeRatio: 0.6,
  sportRec: { whitelistTier: 'CONFIRMED', whitelistRescue: 'size-skill' },
}), false, 'size-skill CONFIRMED needs ≥1.0×');

assert.equal(isActionTabEligible({
  whitelistTier: 'CONFIRMED',
  invested: 800,
  sizeRatio: 1.0,
  sportRec: { whitelistTier: 'CONFIRMED', whitelistRescue: 'size-skill' },
}), true, 'size-skill CONFIRMED at 1.0× paints');

console.log('testActionTabEligible: ok');

import { buildConfirmedActionRows } from '../src/lib/confirmedActionDesk.js';

const cfbProfiles = new Map([
  ['c252ab', { bySport: { CFB: { whitelistTier: 'CONFIRMED' } } }],
  ['bc35e3', { bySport: { CFB: { whitelistTier: 'CONFIRMED' } } }],
  ['eeabaf', { bySport: { CFB: { whitelistTier: 'CONFIRMED' } } }],
]);
const cfbSharp = {
  CFB: {
    colo_gt: {
      away: 'Colorado',
      home: 'Georgia Tech',
      positions: [
        {
          wallet: '0x970998da056e60c707d9b1fc55cfdf3d68c252ab',
          side: 'away', invested: 1228, avgSportBet: 2715,
          title: 'Colorado vs. Georgia Tech: 1Q Moneyline',
          slug: 'cfb-col-gtech-2026-09-03-1q-moneyline',
        },
        {
          wallet: '0x21f333307ac6d2e65ac82f014b3dd2b64cbc35e3',
          side: 'home', invested: 8155, avgSportBet: 11913,
          conditionId: '0x76f14add8bd339c6940b37b49ede7855dd1bafc89a2df3deea1f4fce8ad6b586',
        },
        {
          wallet: '0x3dfb153c197d4c19d3b31c1ecd2c7b6860eeabaf',
          side: 'away', invested: 9706, avgSportBet: 43112,
          title: 'Colorado vs. Georgia Tech',
          slug: 'cfb-col-gtech-2026-09-03',
          conditionId: '0xb841e986cd07605588527c5410edfffa9b6fec3f420798607054ac1a075e3e4d',
        },
      ],
    },
    tol_msu: {
      away: 'Toledo',
      home: 'Michigan State: 4Q Moneyline',
      positions: [
        {
          wallet: '0x21f333307ac6d2e65ac82f014b3dd2b64cbc35e3',
          side: 'home', invested: 16451, avgSportBet: 11913,
          conditionId: '0xe075437767b3f7dabf5b70c2a246c7d515e4dfc7f1ca91d440406334e99de746',
        },
      ],
    },
  },
};
const cfbPoly = {
  CFB: {
    colo_gt: { polyMl: { conditionId: '0xb841e986cd07605588527c5410edfffa9b6fec3f420798607054ac1a075e3e4d' } },
    tol_msu: { polyMl: { conditionId: '0x3c0c0fa752368746b6d751bcd692084d3bab92e721647f0090705856fd5f3b0b' } },
  },
};
const { rows: cfbRows } = buildConfirmedActionRows({
  sharpPositions: cfbSharp,
  walletProfiles: cfbProfiles,
  polyData: cfbPoly,
});
assert.equal(cfbRows.length, 1, `period ML dropped from Action, got ${cfbRows.length}`);
assert.equal(cfbRows[0].gameKey, 'colo_gt');
assert.equal(cfbRows[0].side, 'away');
assert.ok(cfbRows[0].invested >= 9700, 'kept full-game Colorado ML');
console.log('testActionTabEligible: CFB period rows dropped');
