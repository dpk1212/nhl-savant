/**
 * Sharp Flow P&L bundle builder (static JSON path).
 * Usage: node tests/testSharpFlowPnl.mjs
 */
import assert from 'assert';
import {
  AGS_U_CUTOVER,
  buildSharpFlowPnl,
  isSharpFlowPnlBundle,
  pnlBundleAgeMs,
  tallySidesFromDocs,
} from '../src/lib/sharpFlowPnl.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

ok(AGS_U_CUTOVER === '2026-05-14', 'cutover date');

const liveWin = {
  date: '2026-06-15',
  sport: 'MLB',
  home: 'NYY',
  away: 'BOS',
  _marketType: 'ml',
  sides: {
    home: {
      status: 'COMPLETED',
      lockStage: 'LOCKED',
      finalUnits: 2,
      team: 'NYY',
      v8_agsV12Tier: 'LOCK',
      v8_hcStakeTier: 'TOP',
      lock: { stars: 4, odds: -110, evEdge: 0.4 },
      peak: { stars: 4, odds: -110, evEdge: 0.5 },
      result: { outcome: 'WIN', profit: 1.82, tracked: false },
    },
  },
};

const muted = {
  date: '2026-06-15',
  sport: 'MLB',
  _marketType: 'ml',
  sides: {
    away: {
      status: 'COMPLETED',
      lockStage: 'LOCKED',
      health: { status: 'MUTED' },
      finalUnits: 0,
      lock: { stars: 4 },
      result: { outcome: 'LOSS', profit: 0, tracked: false },
    },
  },
};

const tracked = {
  date: '2026-06-16',
  sport: 'NHL',
  _marketType: 'spread',
  sides: {
    home: {
      status: 'COMPLETED',
      lockStage: 'LOCKED',
      finalUnits: 0,
      v8_agsV12Tier: 'LEAN',
      lock: { stars: 3 },
      result: { outcome: 'WIN', profit: 0, tracked: true },
    },
  },
};

const tally = tallySidesFromDocs([liveWin, muted, tracked]);
ok(tally.wins === 1 && tally.losses === 0, 'muted + tracked excluded from headline');
ok(tally.totalUnits === 2, 'live units only');

const bundle = buildSharpFlowPnl([liveWin, muted, tracked]);
ok(isSharpFlowPnlBundle(bundle), 'bundle shape');
ok(bundle.picks.length >= 2, 'ledger includes muted/tracked rows');
ok(bundle.picks.filter((p) => !p.cancelled && p.outcome === 'WIN').length === 1, 'one live win in ledger');
ok(bundle.byAgsTier.LOCK.wins === 1, 'LOCK bucket live win');
ok(bundle.byAgsTier.LEAN.trackedWins === 1, 'LEAN tracked win separate');
ok(bundle.all.wins === 1, 'all matches tally');

const pending = {
  date: '2026-09-11',
  sport: 'CFB',
  _marketType: 'ml',
  sides: {
    home: {
      status: 'PENDING',
      lockStage: 'LOCKED',
      finalUnits: 4,
      v8_agsV12Tier: 'PREMIUM',
      v8_hcStakeTier: 'MAX',
      lock: { stars: 5, odds: -105 },
    },
  },
};
const b2 = buildSharpFlowPnl([liveWin, pending]);
ok(b2.byAgsTier.PREMIUM.pendingPicks === 1, 'pending live counted');
ok(b2.picks.some((p) => p.status === 'PENDING' && p.v8_hcStakeTier === 'MAX'), 'pending row in ledger');

const now = Date.parse('2026-09-12T11:40:00Z');
ok(pnlBundleAgeMs({ generatedAt: '2026-09-11T17:05:47.452Z' }, now) > 55 * 60 * 1000, 'stale generatedAt rebuilds');
ok(pnlBundleAgeMs({ generatedAt: '2026-09-12T11:00:00Z' }, now) < 55 * 60 * 1000, 'fresh generatedAt skips');
ok(pnlBundleAgeMs('{"generatedAt":"2026-09-11T17:05:47.452Z"}', now) > 55 * 60 * 1000, 'json string age');
ok(pnlBundleAgeMs({}, now) === Infinity, 'missing generatedAt rebuilds');
ok(pnlBundleAgeMs('not-json', now) === Infinity, 'invalid json rebuilds');

console.log(`ok ${n}`);
