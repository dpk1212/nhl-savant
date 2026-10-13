import assert from 'node:assert/strict';
import { atpMayStake, clampAtpToTrustedMargin } from '../src/lib/pressLadderOverlay.js';

const trusted = (wallet) => ({ wallet, tier: 4, status: 'STABLE_ON', invested: 5000, ratio: 1.2 });
const base = (units, mktFor, mktAg) => ({
  units,
  rung: units > 0 ? 'TOP' : null,
  reason: 'ladder',
  trust: { mktFor, mktAg },
});

const kept = clampAtpToTrustedMargin(
  base(6, [trusted('a'), trusted('b')], []),
  { sport: 'ATP', marketType: 'ML' },
);
assert.equal(kept.units, 6);
assert.match(kept.reason, /atp_t4_m2/);
assert.equal(atpMayStake('ATP', 'ML', kept), true);

const plusOne = clampAtpToTrustedMargin(
  base(4, [trusted('a')], []),
  { sport: 'ATP', marketType: 'ML' },
);
assert.equal(plusOne.units, 0);
assert.match(plusOne.reason, /^atp_ml_t4_m2_only/);
assert.equal(atpMayStake('ATP', 'ML', plusOne), false);

const spread = clampAtpToTrustedMargin(
  base(2, [trusted('a'), trusted('b')], []),
  { sport: 'ATP', marketType: 'SPREAD' },
);
assert.equal(spread.units, 0);

const other = clampAtpToTrustedMargin(
  base(4, [], []),
  { sport: 'MLB', marketType: 'ML' },
);
assert.equal(other.units, 4);
assert.equal(atpMayStake('MLB', 'ML', other), true);

console.log('testAtpPlayGate ok');
