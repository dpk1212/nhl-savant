import assert from 'node:assert/strict';
import {
  classifyPositionRead,
  describeFreshnessRow,
  needsPolyRead,
  walletShort,
} from '../scripts/lib/freshnessAudit.js';

const NOW = Date.parse('2026-11-13T15:00:00Z');
const MAX = NOW;

function row(overrides = {}) {
  return describeFreshnessRow({
    wallet: '0x' + 'a'.repeat(34) + '85aa98',
    sport: 'NHL',
    gameKey: 'nyi_stl',
    marketType: 'ML',
    side: 'away',
    invested: 17410,
    status: 'PENDING',
    asset: 'token-1',
    conditionId: '0xcond',
    updatedAt: new Date(NOW - 45 * 60 * 1000),
    ...overrides,
  }, {
    maxUpdatedMs: MAX,
    nowMs: NOW,
    ...overrides.ctx,
  });
}

const silence = row();
assert.equal(silence.walletShort, '85aa98');
assert.equal(silence.mechanism, 'silence_prune');
assert.equal(silence.wouldPrune, true);
assert.equal(silence.inOkWallets, false);
assert.equal(JSON.stringify(silence).includes('0x'), false);

const scanned = row({
  ctx: { inOkWallets: true, assetInOpenAssets: false, openAssetCount: 1500 },
});
assert.equal(scanned.mechanism, 'truncated_book');
assert.equal(scanned.wouldExitAbsent, true);
assert.equal(scanned.pageBoundary, 1500);
assert.equal(scanned.wouldPrune, true);

const partial = row({
  ctx: { inOkWallets: true, assetInOpenAssets: false, openAssetCount: 1000 },
});
assert.equal(partial.mechanism, 'truncated_book');
assert.equal(partial.pageBoundary, 1000);

const pinned = row({
  ctx: { inOkWallets: true, assetInOpenAssets: false, openAssetCount: 1500, t15Pinned: true },
});
assert.equal(pinned.mechanism, 't15_held');
assert.equal(pinned.wouldExitAbsent, false);
assert.equal(pinned.wouldPrune, true);

const tennis = row({
  sport: 'ATP',
  ctx: { onScanJson: true, onScanBoard: false },
});
assert.equal(tennis.mechanism, 'scan_board_sport_omitted');
assert.equal(tennis.wouldPrune, true);
assert.equal(tennis.scanBoardSportOmitted, true);

const trusted = row({ ctx: { trusted: true } });
assert.equal(trusted.mechanism, 'kept_trust');
assert.equal(trusted.wouldPrune, false);

const board = row({ ctx: { onScanBoard: true } });
assert.equal(board.mechanism, 'kept_scan_board');
assert.equal(board.wouldPrune, false);

const fresh = row({ updatedAt: new Date(NOW - 5 * 60 * 1000) });
assert.equal(fresh.mechanism, 'fresh');
assert.equal(fresh.wouldPrune, false);

const unwritten = row({
  ctx: { inOkWallets: true, assetInOpenAssets: true, openAssetCount: 40 },
});
assert.equal(unwritten.mechanism, 'open_but_unwritten');
assert.equal(unwritten.wouldExitAbsent, false);

const legacy = row({
  asset: '',
  ctx: { inOkWallets: true, openAssetCount: 20 },
});
assert.equal(legacy.mechanism, 'legacy_no_asset');
assert.equal(legacy.wouldPrune, true);
assert.equal(legacy.wouldExitAbsent, false);

const exited = row({ status: 'EXITED', exitReason: 'asset_absent' });
assert.equal(exited.mechanism, 'already_exited');
assert.equal(exited.exitReason, 'asset_absent');
assert.equal(exited.wouldPrune, false);

const ghost = classifyPositionRead({
  open: { data: [{ token_id: 'token-1', current_size: 100 }] },
  closed: { data: [] },
  redeemable: { data: [] },
  asset: 'token-1',
});
assert.equal(ghost.polyClass, 'GHOST');
assert.equal(ghost.currentSize, 100);

const closed = classifyPositionRead({
  open: { data: [] },
  closed: { data: [{ token_id: 'token-1', current_size: 0 }] },
  redeemable: { data: [] },
  asset: 'token-1',
});
assert.equal(closed.polyClass, 'TRUE_CLOSED');

const resolved = classifyPositionRead({
  open: { data: [] },
  closed: { data: [] },
  redeemable: { data: [{ token_id: 'token-1', current_size: 12 }] },
  asset: 'token-1',
});
assert.equal(resolved.polyClass, 'RESOLVED');

const unknown = classifyPositionRead({
  open: null,
  closed: { data: [] },
  redeemable: { data: [] },
  asset: 'token-1',
});
assert.equal(unknown.polyClass, 'UNKNOWN');

const paged = classifyPositionRead({
  open: { data: [], pagination: { has_more: true } },
  closed: { data: [] },
  redeemable: { data: [] },
  asset: 'token-1',
});
assert.equal(paged.polyClass, 'UNKNOWN');
assert.equal(paged.polyNote, 'open_has_more');

const mappedSize = classifyPositionRead({
  open: [{ asset: 'token-1', size: 4 }],
  closed: [],
  redeemable: [],
  asset: 'token-1',
});
assert.equal(mappedSize.polyClass, 'GHOST');

const bareObject = classifyPositionRead({
  open: { token_id: 'token-1', current_size: 10 },
  closed: { data: [] },
  redeemable: { data: [] },
  asset: 'token-1',
});
assert.equal(bareObject.polyClass, 'UNKNOWN');

assert.equal(walletShort('0xabc85aa98'), '85aa98');
assert.equal(needsPolyRead(silence, '85aa98'), true);
assert.equal(needsPolyRead(fresh, 'c6c4d6'), false);
assert.equal(needsPolyRead(scanned, 'other1'), true);

console.log('freshness audit ok');
