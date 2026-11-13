import assert from 'assert';
import { closedRowsFromPage, holderGroups, lbRow, sportFromBoardSlug } from '../scripts/lib/discoverApi.js';

const v2Lb = lbRow({
  data: { pnl: 116774, volume: 687000, rank_pnl: 752, user_name: 'holder' },
});
assert.equal(v2Lb.pnl, 116774);
assert.equal(v2Lb.vol, 687000);
assert.equal(v2Lb.rank, 752);
assert.equal(v2Lb.name, 'holder');
assert.equal(v2Lb.roi, 17);

const v1Lb = lbRow([{ pnl: 10, vol: 100, userName: 'old', rank: 4 }]);
assert.equal(v1Lb.pnl, 10);
assert.equal(v1Lb.vol, 100);
assert.equal(v1Lb.name, 'old');
assert.equal(v1Lb.rank, 4);
assert.equal(lbRow({ data: {} }), null);
assert.equal(lbRow(null), null);

const groups = holderGroups({
  data: [{
    holders: [{ proxy_wallet: '0xabc', amount: 100, outcome_index: 0, pseudonym: 'n' }],
  }],
});
assert.equal(groups.length, 1);
assert.equal(groups[0].holders[0].proxyWallet, '0xabc');
assert.equal(groups[0].holders[0].outcomeIndex, 0);
assert.equal(groups[0].holders[0].name, 'n');
assert.equal(holderGroups({ error: 'gone' }), null);

const page = closedRowsFromPage({
  data: [{
    title: 'Nuggets vs. Pacers',
    slug: 'nba-den-ind-2026-11-07',
    event_slug: 'nba-den-ind-2026-11-07',
    current_price: 1,
    condition_id: '0x1',
    outcome_index: 0,
  }],
  pagination: { has_more: true, next_cursor: 'c1' },
});
assert.equal(page.rows[0].eventSlug, 'nba-den-ind-2026-11-07');
assert.equal(page.rows[0].curPrice, 1);
assert.equal(page.rows[0].conditionId, '0x1');
assert.equal(page.hasMore, true);
assert.equal(page.nextCursor, 'c1');
assert.equal(closedRowsFromPage(null).rows.length, 0);

assert.equal(sportFromBoardSlug('nba-den-ind-2026-11-07'), 'NBA');
assert.equal(sportFromBoardSlug('unl-eng-hrv-2026-11-12-eng'), 'SOC');
assert.equal(sportFromBoardSlug('conl-kor-pan-2026-11-12'), 'SOC');
assert.equal(sportFromBoardSlug('tur-riz-tra-2026-10-26-tra'), null);
assert.equal(sportFromBoardSlug(''), null);

console.log('discover api ok');
