/**
 * Action lock pin — T−15 hold, featured→Action union, B-primary priors.
 * Usage: node tests/testActionLockPin.mjs
 */
import assert from 'node:assert/strict';
import {
  ACTION_LOCK_PIN_MIN,
  ACTION_LOCK_PIN_MS,
  ACTION_PRIOR_B_MIN_N,
  RANK_RESCUE_MIN_BETS,
  actionLegKey,
  isActionLockPinned,
  isRankEligibleOnSourceB,
  minutesToCommence,
  parseActionTimeMs,
  mergeFeaturedIntoAction,
  restrictFeaturedToAction,
  shouldGradeExited,
  shouldSkipScanDropExit,
  walletPriorStatsPreferB,
} from '../src/lib/actionLockPin.js';

assert.equal(ACTION_LOCK_PIN_MIN, 15);
assert.equal(ACTION_LOCK_PIN_MS, 15 * 60 * 1000);
assert.equal(ACTION_PRIOR_B_MIN_N, 2);
assert.equal(RANK_RESCUE_MIN_BETS, 8);

{
  const commence = Date.parse('2026-09-19T20:00:00.000Z');
  assert.equal(minutesToCommence(commence, commence - 40 * 60 * 1000), 40);
  assert.equal(minutesToCommence(commence, commence - 10 * 60 * 1000), 10);
  assert.equal(minutesToCommence(commence, commence + 5 * 60 * 1000), -5);
  assert.equal(minutesToCommence(null, commence), null);
  assert.equal(isActionLockPinned(commence, commence - 16 * 60 * 1000), false);
  assert.equal(isActionLockPinned(commence, commence - 15 * 60 * 1000), true);
  assert.equal(isActionLockPinned(commence, commence + 60 * 1000), true);
}

{
  const commence = Date.parse('2026-09-19T20:00:00.000Z');
  const inside = commence - 10 * 60 * 1000;
  const before = commence - 40 * 60 * 1000;
  assert.equal(shouldSkipScanDropExit({
    commenceTime: commence,
    exitReason: 'asset_absent',
    nowMs: inside,
  }), true, 'scan-drop after T−15 is pinned');
  assert.equal(shouldSkipScanDropExit({
    commenceTime: commence,
    exitReason: 'soft_key_absent_legacy',
    nowMs: inside,
  }), true);
  assert.equal(shouldSkipScanDropExit({
    commenceTime: commence,
    exitReason: 'asset_absent',
    nowMs: before,
  }), false, 'pre-lock scan-drop may exit');
  assert.equal(shouldSkipScanDropExit({
    commenceTime: commence,
    exitReason: 'slug_teams_mismatch',
    nowMs: inside,
  }), false, 'wrong-game still exits after T−15');
  assert.equal(shouldSkipScanDropExit({
    commenceTime: null,
    exitReason: 'asset_absent',
    nowMs: inside,
  }), false, 'missing commence fail-opens to allow EXITED');
}

{
  assert.equal(shouldGradeExited({
    status: 'EXITED',
    exitReason: 'asset_absent',
    minutesToCommence: 10,
  }), true, 'sold inside T−15 still grades');
  assert.equal(shouldGradeExited({
    status: 'EXITED',
    exitReason: 'asset_absent',
    minutesToCommence: 40,
  }), false, 'pre-lock sell stays off Action');
  assert.equal(shouldGradeExited({
    status: 'EXITED',
    exitReason: 'date_calendar_retag',
    minutesToCommence: 10,
  }), false);
  assert.equal(shouldGradeExited({
    status: 'PENDING',
    minutesToCommence: 10,
  }), false);
  const commence = 1_780_000_000_000;
  assert.equal(shouldGradeExited({
    status: 'EXITED',
    exitReason: 'asset_absent',
    commenceTime: commence,
    exitedAt: commence - 10 * 60 * 1000,
  }), true, 'exitedAt inside freeze grades when mtc missing');
  assert.equal(shouldGradeExited({
    status: 'EXITED',
    exitReason: 'asset_absent',
    commenceTime: commence,
    exitedAt: commence - 40 * 60 * 1000,
  }), false);
  assert.equal(parseActionTimeMs({ seconds: 1_700_000_000 }), 1_700_000_000_000);
}

{
  const featured = [
    { date: '2026-09-18', marketType: 'ML', side: 'away', gameKey: 'mlb:cle_min_2026-09-18' },
    { date: '2026-09-18', marketType: 'TOTAL', side: 'over', gameKey: 'mlb:cle_min_2026-09-18' },
    { date: '2026-09-17', marketType: 'ML', side: 'home', gameKey: 'mlb:bos_nyy' },
  ];
  const action = [
    { date: '2026-09-18', marketType: 'ML', side: 'away', gameKey: 'cle_min' },
    { date: '2026-09-18', market: 'TOTAL', side: 'over', gameKey: 'mlb:cle_min_2026-09-18' },
  ];
  const kept = restrictFeaturedToAction(featured, action);
  assert.equal(kept.length, 2, 'Featured only keeps Action legs');
  assert.equal(kept[0].marketType, 'ML');
  assert.equal(kept[1].marketType, 'TOTAL');
  assert.equal(restrictFeaturedToAction(featured, []).length, 0);
  assert.equal(restrictFeaturedToAction(null, action).length, 0);
  assert.ok(actionLegKey(featured[0]));
  assert.equal(
    actionLegKey(featured[0]),
    actionLegKey({ date: '2026-09-18', market: 'ML', side: 'away', gameKey: 'cle_min' }),
  );
}

{
  // brendoncarson / 9214c2: featured Over 7.5 BOS@TBR was missing from Their Action.
  const action = [
    { date: '2026-09-18', marketType: 'TOTAL', side: 'under', gameKey: 'wsh_stl', dollarPnl: -912, won: 0 },
    { date: '2026-09-18', marketType: 'TOTAL', side: 'under', gameKey: 'sea_col', dollarPnl: 1617, won: 1 },
  ];
  const featured = [
    {
      date: '2026-09-18', marketType: 'TOTAL', side: 'over', gameKey: 'bos_tbr',
      line: 7.5, invested: 1130, dollarPnl: -1130, won: 0, odds: 126,
    },
    { date: '2026-09-18', marketType: 'TOTAL', side: 'under', gameKey: 'sea_col', dollarPnl: 1617, won: 1 },
  ];
  const merged = mergeFeaturedIntoAction(featured, action);
  assert.equal(merged.length, 3, 'featured Over lands on Action');
  const over = merged.find((l) => l.gameKey === 'bos_tbr');
  assert.equal(over?.side, 'over');
  assert.equal(over?.fromFeatured, true);
  assert.equal(over?.dollarPnl, -1130);
  assert.equal(over?.settledPnl, -1130);
  assert.equal(
    merged.filter((l) => actionLegKey(l).includes('sea_col')).length,
    1,
    'already-on-Action featured ticket is not doubled',
  );
}

{
  const bBook = {
    whitelistTier: 'CONFIRMED',
    picks: { n: 20, flatRoi: 12 },
    positions: { n: 40, positionFlatRoi: -3, dollarRoi: 8 },
  };
  const bOnly = walletPriorStatsPreferB(bBook);
  assert.equal(bOnly.priorSource, 'B');
  assert.equal(bOnly.priorN, 40);
  assert.equal(bOnly.priorRoi, 8, 'B flat ≤0 → dollar ROI');

  const aOnly = walletPriorStatsPreferB({
    whitelistTier: 'FLAT',
    picks: { n: 12, flatRoi: 9 },
    positions: { n: 0 },
  });
  assert.equal(aOnly.priorSource, 'A');
  assert.equal(aOnly.priorN, 12);
  assert.equal(aOnly.priorRoi, 9);

  const thinB = walletPriorStatsPreferB({
    whitelistTier: 'CONFIRMED',
    picks: { n: 15, flatRoi: 11 },
    positions: { n: 1, positionFlatRoi: 4 },
  });
  assert.equal(thinB.priorSource, 'A', 'B thinner than min n stays on featured');
  assert.equal(thinB.priorN, 15);
}

{
  assert.equal(isRankEligibleOnSourceB({
    bySport: { MLB: { whitelistTier: 'CONFIRMED', positions: { n: 10 }, picks: { n: 2 } } },
  }, 'MLB'), true, 'Action n≥8 qualifies');
  assert.equal(isRankEligibleOnSourceB({
    bySport: { MLB: { whitelistTier: 'CONFIRMED', positions: { n: 3 }, picks: { n: 20 } } },
  }, 'MLB'), false, 'thin Action book does not borrow featured n');
  assert.equal(isRankEligibleOnSourceB({
    bySport: { MLB: { whitelistTier: 'FLAT', positions: { n: 0 }, picks: { n: 9 } } },
  }, 'MLB'), true, 'empty Action falls back to featured n');
  assert.equal(isRankEligibleOnSourceB({
    bySport: { MLB: { whitelistTier: 'CONFIRMED', positions: { n: 10 }, picks: { n: 10 } } },
  }, 'NHL'), false);
}

console.log('testActionLockPin: ok');
