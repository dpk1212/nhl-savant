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
  heatFromForm,
  honestRecord,
  marketBooksFromProfile,
  shortsForDeskSection,
  sortRowsByRelativeSize,
  tailLean,
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

state = toggleMySharpMember(state, member);
state = toggleMySharpMember(state, { walletShort: 'e4ec62', addedAt: 2 });
assert.equal(mySharpsShortSet(state).size, 2);
state = toggleMySharpMember(state, { walletShort: '162937' }, { remove: true });
assert.equal(mySharpsShortSet(state).has('162937'), false);
assert.equal(mySharpsShortSet(state).has('e4ec62'), true);
state = toggleMySharpMember(state, { walletShort: 'e4ec62' }, { remove: true });
assert.equal(mySharpsShortSet(state).size, 0);

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

assert.equal(honestRecord(3, 0, 100).text, '3–0');
assert.equal(honestRecord(3, 0, 100).showPct, false);
assert.equal(honestRecord(7, 3, 70).text, '7–3 · 70%');
assert.equal(honestRecord(7, 3, 70).showPct, true);

assert.equal(heatFromForm({ actionL10: { w: 7, l: 3 } }).key, 'hot');
assert.equal(heatFromForm({ actionL10: { w: 2, l: 8 } }).key, 'cold');
assert.equal(heatFromForm({ actionL10: { w: 5, l: 5 } }).key, 'even');
assert.equal(heatFromForm({ actionL5: { w: 2, l: 1 } }).key, 'quiet');
assert.equal(heatFromForm({}).key, 'quiet');

assert.equal(tailLean({ heat: { key: 'hot', window: 'L10', record: '7–3' } }).key, 'tail');
assert.equal(tailLean({ heat: { key: 'cold', window: 'L10', record: '2–8' } }).key, 'sit');
assert.equal(tailLean({
  heat: { key: 'even', window: 'L10', record: '5–5' },
  book: { n: 14, wins: 4, losses: 10, wr: 29, roi: -12 },
}).key, 'sit');
assert.equal(tailLean({
  heat: { key: 'quiet', n: 3, record: '3–0' },
  l30: { n: 3, wins: 3, losses: 0, wr: 100 },
}).key, 'watch');
assert.equal(tailLean({
  heat: { key: 'even', window: 'L10', record: '6–4' },
  book: { n: 20, wins: 12, losses: 8, wr: 60, roi: 8 },
  l30: { n: 10, wins: 7, losses: 3, wr: 70, roi: 12 },
  clv: { n: 18, pctPos: 62 },
}).key, 'tail');

const hotState = parseMySharpsDoc({
  mySharps: { members: { e4ec62: { walletShort: 'e4ec62', addedAt: 1 } } },
});
const hotRoster = buildMySharpsRoster(hotState, {
  walletProfiles: new Map([['e4ec62', {
    clvSkill: { n: 18, pctPos: 62 },
    bySport: {
      NFL: {
        whitelistTier: 'CONFIRMED',
        recentActionWindow: { n: 10, wins: 7, losses: 3, wr: 70, settledPnl: 120000, dollarRoi: 14 },
        positions: { n: 20, wins: 12, losses: 8, wr: 60, positionFlatRoi: 8, dollarRoi: 11 },
        form: { actionL5: { w: 4, l: 1 }, actionL10: { w: 7, l: 3 } },
        byMarket: {
          ML: { positions: { n: 10, wins: 7, losses: 3, wr: 70, dollarRoi: 16 } },
          SPREAD: { positions: { n: 6, wins: 3, losses: 3, wr: 50, dollarRoi: 2 } },
          TOTAL: { positions: { n: 4, wins: 2, losses: 2, wr: 50, dollarRoi: 1 } },
        },
      },
    },
  }]]),
  actionRows: [{ walletShort: 'e4ec62', invested: 162500, displaySizeRatio: 2 }],
  sportFilter: 'NFL',
});
assert.equal(hotRoster[0].heat.key, 'hot');
assert.equal(hotRoster[0].lean.key, 'tail');
assert.equal(hotRoster[0].l30Honest.showPct, true);
assert.equal(hotRoster[0].books.length, 3);
assert.equal(hotRoster[0].books[0].market, 'ML');
assert.equal(hotRoster[0].books[0].honest.text, '7–3 · 70%');

const thinState = parseMySharpsDoc({
  mySharps: { members: { abcdef: { walletShort: 'abcdef', addedAt: 1 } } },
});
const thinRoster = buildMySharpsRoster(thinState, {
  walletProfiles: new Map([['abcdef', {
    bySport: {
      NFL: {
        whitelistTier: 'CONFIRMED',
        recentActionWindow: { n: 3, wins: 3, losses: 0, wr: 100, settledPnl: 9000, dollarRoi: 40 },
        form: { actionL5: { w: 3, l: 0 } },
      },
    },
  }]]),
  actionRows: [],
  sportFilter: 'NFL',
});
assert.equal(thinRoster[0].heat.key, 'quiet');
assert.equal(thinRoster[0].lean.key, 'watch');
assert.equal(thinRoster[0].l30Honest.text, '3–0');
assert.equal(thinRoster[0].l30Honest.showPct, false);

const hotDash = buildMySharpsDashboard({
  roster: hotRoster,
  actionRows: [{ walletShort: 'e4ec62', invested: 162500, displaySizeRatio: 2 }],
  recentLegs: [],
});
assert.equal(hotDash.lean.tail, 1);
assert.equal(hotDash.heat.hot, 1);
assert.equal(hotDash.liveByLean.tail.n, 1);
assert.ok(shortsForDeskSection(hotRoster, 'tail').has('e4ec62'));
assert.equal(shortsForDeskSection(hotRoster, 'sit').size, 0);
assert.equal(shortsForDeskSection(hotRoster, 'action'), null);

const books = marketBooksFromProfile({
  bySport: {
    NFL: {
      whitelistTier: 'CONFIRMED',
      byMarket: {
        TOTAL: { positions: { n: 1, wins: 1, losses: 0, wr: 100 } },
        ML: { positions: { n: 8, wins: 5, losses: 3, wr: 62, dollarRoi: 9 } },
      },
    },
  },
}, 'NFL');
assert.equal(books.length, 1);
assert.equal(books[0].market, 'ML');

console.log('testMySharps: ok');
