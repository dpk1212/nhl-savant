/**
 * Action tab L30 must match locked-card L30 $ (not truncated 40-leg slice).
 * Run: node tests/testActionTabL30.mjs
 */
import { sparkPointsForTab, _test } from '../src/lib/confirmedActionDesk.js';

const { rollupFromRecentWindow, formFromProfile } = _test;

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

// cd2f63-shaped recent window (locked L30 +$11K)
{
  const win = {
    days: 30, n: 92, wins: 48, losses: 44, wr: 52.2,
    dollarRoi: 1.2, settledPnl: 10937,
  };
  const r = rollupFromRecentWindow(win, 'action');
  assert(r.window === '30d', `window ${r.window}`);
  assert(r.settledPnl === 10937, `pnl ${r.settledPnl}`);
  assert(r.record === '48-44', `record ${r.record}`);
  assert(r.roi === 1, `roi ${r.roi}`);
}

// formFromProfile passes Action L30 curves + totalN
{
  const prof = {
    bySport: {
      MLB: {
        recentActionWindow: {
          days: 30, n: 92, dollarRoi: 1.2, settledPnl: 10937,
        },
        form: {
          flatCurve: [1, 2, 3, 4, 5],
          flatEnd: -0.6,
          dollarCurve: [-1, -2, -3, -4, -50000],
          dollarEnd: -50000,
          actionFlatCurve: [0.1, 0.2, 0.3, 0.4, 0.5],
          actionFlatEnd: 0.5,
          actionDollarCurve: [1000, 2000, 5000, 8000, 10937],
          actionDollarEnd: 10937,
          recentAction: Array.from({ length: 40 }, () => ({
            date: '2026-08-20', won: 0, settledPnl: -3000, invested: 1000, flat: -1,
          })),
          recentFeatured: [],
          flatCurveDays: 30,
        },
      },
    },
  };
  const form = formFromProfile(prof, 'MLB');
  assert(form.actionDollarEnd === 10937, 'actionDollarEnd');
  assert(form.recentActionTotalN === 92, `totalN ${form.recentActionTotalN}`);
  assert(form.recentAction.length === 40, 'list still capped in fixture');
  assert(form.flatEnd === -0.6, 'featured flat preserved');
  assert(form.recentActionWindow.settledPnl === 10937, 'L30 window on form');
}

// Truncated 40-leg list must NOT paint -$135K when L30 stamp is +$11K
{
  const row = {
    recentAction: Array.from({ length: 40 }, () => ({
      settledPnl: -3375, invested: 3375, won: 0, flat: -1,
    })),
    recentActionTotalN: 92,
    recentActionWindow: { days: 30, n: 92, settledPnl: 10937, dollarRoi: 1.2 },
    recentFeatured: [],
    actionDollarCurve: null,
    actionFlatCurve: null,
  };
  const spark = sparkPointsForTab('recent', row, 'actual');
  assert(spark, 'spark exists');
  assert(spark.endLabel === '+$10.9K' || spark.endLabel === '+$11K', `end ${spark.endLabel}`);
  assert(!String(spark.endLabel).includes('135'), `must not show truncated loss, got ${spark.endLabel}`);
}

// Full actionDollarCurve preferred when stamped
{
  const row = {
    recentAction: Array.from({ length: 40 }, () => ({ settledPnl: -1000, invested: 1000, won: 0 })),
    recentActionTotalN: 92,
    recentActionWindow: { settledPnl: 10937 },
    actionDollarCurve: [0, 2000, 5000, 8000, 10937],
    actionDollarEnd: 10937,
    recentFeatured: [],
  };
  const spark = sparkPointsForTab('recent', row, 'actual');
  assert(spark.points[spark.points.length - 1] === 10937, 'curve end');
  assert(spark.endLabel === '+$10.9K' || spark.endLabel === '+$11K', `label ${spark.endLabel}`);
}

// Dual windows: L30 stamp + all-time stay separate
{
  const { rollupFromAgg } = _test;
  const l30 = rollupFromRecentWindow({
    days: 30, n: 92, wins: 48, losses: 44, wr: 52.2,
    dollarRoi: 1.2, settledPnl: 10937,
  }, 'action');
  const all = rollupFromAgg({
    n: 1374, wins: 693, losses: 681, wr: 50.4, dollarRoi: -1.1,
  }, 'action');
  assert(l30.window === '30d' && l30.settledPnl === 10937, 'L30 book');
  assert(all.window === 'all' && all.record === '693-681', 'all-time book');
  assert(l30.settledPnl !== all.settledPnl, 'windows must not collapse');
}

console.log('testActionTabL30: ok');
