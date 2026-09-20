/**
 * My Sharps identity + desk aggregations.
 * Usage: node tests/testMySharps.mjs
 */
import assert from 'node:assert/strict';
import {
  canAddMySharp,
  emptyMySharps,
  fmtWalletTag,
  memberFromActionRow,
  mySharpsShortSet,
  parseMySharpsDoc,
  toggleMySharpMember,
} from '../src/lib/mySharps.js';
import {
  buildMySharpsDashboard,
  buildMySharpsRoster,
  filterRowsToMySharps,
  sortRowsByRelativeSize,
} from '../src/lib/mySharpsDesk.js';

assert.equal(fmtWalletTag('0xABC162937'), '··162937');

const row = {
  walletShort: '162937',
  sport: 'NFL',
  gameKey: 'sea_ari',
  marketType: 'TOTAL',
  side: 'over',
  commenceDateKey: '2026-09-20',
  displaySizeRatio: 2.1,
  sizeRatio: 2.1,
  invested: 122100,
  opposed: 'clear',
};
const member = memberFromActionRow(row, 1000);
assert.equal(member.walletShort, '162937');
assert.equal(member.addedFrom.sport, 'NFL');

let state = emptyMySharps();
state = toggleMySharpMember(state, member);
assert.equal(mySharpsShortSet(state).has('162937'), true);
state = toggleMySharpMember(state, member);
assert.equal(mySharpsShortSet(state).has('162937'), false);

const parsed = parseMySharpsDoc({
  mySharps: {
    updatedAt: 1,
    members: { '162937': { walletShort: '162937', addedAt: 1 } },
  },
});
assert.equal(parsed.members['162937'].walletShort, '162937');
assert.equal(canAddMySharp(parsed), true);

const rows = [
  { ...row, walletShort: '162937' },
  { ...row, walletShort: 'aaaaaa', displaySizeRatio: 3, invested: 10 },
  { ...row, walletShort: '162937', displaySizeRatio: 0.8, invested: 1100, opposed: 'contested' },
];
const mine = filterRowsToMySharps(rows, new Set(['162937']));
assert.equal(mine.length, 2);
const sized = sortRowsByRelativeSize(mine);
assert.equal(sized[0].displaySizeRatio, 2.1);

const roster = buildMySharpsRoster(parsed, {
  walletProfiles: new Map([['162937', {
    bySport: {
      NFL: {
        whitelistTier: 'CONFIRMED',
        recentActionWindow: { n: 10, wins: 7, losses: 3, wr: 70, settledPnl: 439000, dollarRoi: 18 },
      },
    },
  }]]),
  actionRows: mine,
  sportFilter: 'NFL',
});
assert.equal(roster[0].tag, '··162937');
assert.equal(roster[0].l30.pnl, 439000);
assert.equal(roster[0].openN, 2);

const dash = buildMySharpsDashboard({
  roster,
  actionRows: mine,
  recentLegs: [{ walletShort: '162937', won: 1 }, { walletShort: '162937', won: 0 }],
});
assert.equal(dash.walletN, 1);
assert.equal(dash.actionN, 2);
assert.equal(dash.sizedUpN, 1);
assert.equal(dash.l30.wins, 7);
assert.equal(dash.recentW, 1);

console.log('testMySharps: ok');
