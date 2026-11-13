import assert from 'assert';
import { closedRowsFromPage, holderGroups, leaderboardRows, lbRow, sportFromBoardSlug } from '../scripts/lib/discoverApi.js';

const v2Lb = lbRow({
  data: { pnl: 116774, volume: 687000, rank_pnl: 752, user_name: 'holder' },
});
assert.equal(v2Lb.pnl, 116774);
assert.equal(v2Lb.vol, 687000);
assert.equal(v2Lb.rank, 752);
assert.equal(v2Lb.roi, 17);
assert.equal(lbRow(null), null);

const groups = holderGroups({
  data: [{ holders: [{ proxy_wallet: '0xabc', amount: 100, outcome_index: 0, pseudonym: 'n' }] }],
});
assert.equal(groups[0].holders[0].proxyWallet, '0xabc');
assert.equal(groups[0].holders[0].outcomeIndex, 0);
assert.equal(holderGroups({ error: 'gone' }), null);

const board = leaderboardRows({
  data: [{ user_id: '0xabc', pnl: 100.4, volume: 1000, rank: 51, user_name: 'a' }],
  pagination: { has_more: true, next_cursor: 'n' },
});
assert.equal(board.rows[0].proxyWallet, '0xabc');
assert.equal(board.rows[0].vol, 1000);
assert.equal(board.rows[0].rank, 51);
assert.equal(board.hasMore, true);
const v1board = leaderboardRows([{ proxyWallet: '0xdef', pnl: 5, vol: 9, userName: 'b', rank: '3' }]);
assert.equal(v1board.rows[0].userName, 'b');
assert.equal(v1board.rows[0].rank, 3);
assert.equal(leaderboardRows({ error: 'gone' }), null);

const closed = closedRowsFromPage({
  data: [{
    title: 'Will England win?',
    slug: 'unl-eng-hrv-2026-11-12-eng',
    total_size: 10,
    avg_price: 0.4,
    current_price: 1,
    realized_pnl: 6,
  }],
});
assert.equal(closed.rows[0].totalBought, 10);
assert.equal(closed.rows[0].avgPrice, 0.4);
assert.equal(closed.rows[0].curPrice, 1);
assert.equal(closed.rows[0].realizedPnl, 6);

assert.equal(sportFromBoardSlug('nba-den-ind-2026-11-07'), 'NBA');
assert.equal(sportFromBoardSlug('unl-eng-hrv-2026-11-12-eng'), 'SOC');
assert.equal(sportFromBoardSlug('tur-riz-tra-2026-10-26-tra'), null);

console.log('discover api ok');
