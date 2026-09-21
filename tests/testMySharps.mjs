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
  cleanSharpName,
  parseMySharpsDoc,
  toggleMySharpMember,
} from '../src/lib/mySharps.js';
import {
  buildConsiderRows,
  buildDeskHoldings,
  buildDeskLedger,
  buildDeskPulse,
  buildDeskReport,
  gainsSplit,
  buildMySharpsBoard,
  closedPickLabel,
  buildMySharpsDashboard,
  buildMySharpsRoster,
  filterBoardTickets,
  filterRowsToMySharps,
  heatFromForm,
  honestRecord,
  marketBooksFromProfile,
  pickDeskMovers,
  shortsForDeskSection,
  sortMySharpsRoster,
  sortRowsByRelativeSize,
  tailLean,
  ticketPickLabel,
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
assert.equal(cleanSharpName('  Bands  '), 'Bands');
assert.equal(cleanSharpName('   '), null);
const named = parseMySharpsDoc({
  mySharps: { members: { e4ec62: { walletShort: 'e4ec62', name: '  Bands  ' } } },
});
assert.equal(named.members.e4ec62.name, 'Bands');

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

const boardRows = [
  { walletShort: '162937', sport: 'NFL', gameKey: 'sea_ari', marketType: 'TOTAL', side: 'over', team: 'Over', marketLabel: 'O 47.5', invested: 122100, displaySizeRatio: 2.1, opposed: 'clear' },
  { walletShort: 'e4ec62', sport: 'NFL', gameKey: 'sea_ari', marketType: 'TOTAL', side: 'over', team: 'Over', marketLabel: 'O 47.5', invested: 80000, displaySizeRatio: 1.2, opposed: 'clear' },
  { walletShort: 'abcdef', sport: 'NFL', gameKey: 'sea_ari', marketType: 'TOTAL', side: 'under', team: 'Under', marketLabel: 'U 47.5', invested: 11000, displaySizeRatio: 0.6, opposed: 'contested' },
  { walletShort: 'aaaaaa', sport: 'CFB', gameKey: 'lsu_ala', marketType: 'ML', side: 'home', team: 'Bama', marketLabel: 'ML', invested: 50000, displaySizeRatio: 1.8, opposed: 'clear' },
];
const board = buildMySharpsBoard(boardRows);
assert.equal(board.sharedN, 1);
assert.equal(board.splitN, 2);
assert.equal(board.opposedN, 1);
assert.equal(board.standoutN, 1);
const shared = board.tickets.find((t) => t.shared);
assert.equal(shared.shorts.length, 2);
assert.equal(shared.kind, 'shared');
const standout = board.tickets.find((t) => t.kind === 'standout');
assert.equal(standout.sport, 'CFB');
assert.equal(filterBoardTickets(board, { filter: 'agree' }).length, 1);
assert.equal(filterBoardTickets(board, { filter: 'fight' }).length, 2);
assert.equal(filterBoardTickets(board, { filter: 'NFL' }).every((t) => t.sport === 'NFL'), true);
assert.equal(filterBoardTickets(board, { focusShort: 'aaaaaa' }).length, 1);

const twoState = parseMySharpsDoc({
  mySharps: {
    members: {
      e4ec62: { walletShort: 'e4ec62', addedAt: 1 },
      abcdef: { walletShort: 'abcdef', addedAt: 2 },
    },
  },
});
const twoRoster = buildMySharpsRoster(twoState, {
  walletProfiles: new Map([
    ['e4ec62', {
      clvSkill: { n: 18, pctPos: 62 },
      bySport: {
        NFL: {
          whitelistTier: 'CONFIRMED',
          recentActionWindow: { n: 10, wins: 7, losses: 3, wr: 70, settledPnl: 120000, dollarRoi: 14 },
          positions: { n: 20, wins: 12, losses: 8, wr: 60, positionFlatRoi: 8, dollarRoi: 11 },
          form: { actionL5: { w: 4, l: 1 }, actionL10: { w: 7, l: 3 } },
        },
      },
    }],
    ['abcdef', {
      bySport: {
        NFL: {
          whitelistTier: 'CONFIRMED',
          recentActionWindow: { n: 3, wins: 3, losses: 0, wr: 100, settledPnl: 9000, dollarRoi: 40 },
          form: { actionL5: { w: 3, l: 0 } },
        },
      },
    }],
  ]),
  actionRows: [
    { walletShort: 'e4ec62', sport: 'NFL', invested: 162500, displaySizeRatio: 2 },
    { walletShort: 'abcdef', sport: 'CFB', invested: 11000, displaySizeRatio: 0.6 },
  ],
});
const mineBoard = buildMySharpsBoard([
  { walletShort: 'e4ec62', sport: 'NFL', gameKey: 'sea_ari', marketType: 'TOTAL', side: 'over', invested: 162500, displaySizeRatio: 2, opposed: 'clear' },
  { walletShort: 'abcdef', sport: 'NFL', gameKey: 'sea_ari', marketType: 'TOTAL', side: 'under', invested: 11000, displaySizeRatio: 0.6, opposed: 'contested' },
]);
assert.equal(mineBoard.splitN, 2);
assert.equal(mineBoard.sharedN, 0);

const pulse = buildDeskPulse({
  roster: twoRoster,
  board: mineBoard,
  actionRows: [
    { walletShort: 'e4ec62', sport: 'NFL', invested: 162500 },
    { walletShort: 'abcdef', sport: 'CFB', invested: 11000 },
  ],
  recentLegs: [
    { walletShort: 'e4ec62', won: 1, dollarPnl: 4000 },
    { walletShort: 'e4ec62', won: 0, dollarPnl: -2000 },
  ],
  window: 'l30',
});
assert.equal(pulse.hero.window, 'l30');
assert.equal(pulse.l30.pnl, 129000);
assert.equal(pulse.open.n, 2);
assert.equal(pulse.sports[0].sport, 'NFL');
assert.ok(pulse.sports[0].pct >= 90);
assert.equal(pulse.movers.hot.walletShort, 'e4ec62');
assert.notEqual(pulse.movers.book?.walletShort, 'e4ec62');
assert.equal(pulse.canOverlap, true);
assert.equal(pulse.agreeN, 0);
assert.equal(pulse.fightN, 2);
assert.equal(new Set(pulse.movers.list.map((m) => m.walletShort)).size, pulse.movers.list.length);
const recentPulse = buildDeskPulse({
  roster: twoRoster,
  board,
  actionRows: [{ walletShort: 'e4ec62', sport: 'NFL', invested: 162500 }],
  recentLegs: [
    { walletShort: 'e4ec62', won: 1, dollarPnl: 4000 },
    { walletShort: 'e4ec62', won: 0, dollarPnl: -2000 },
  ],
  window: 'recent',
});
assert.equal(recentPulse.hero.window, 'recent');
assert.equal(recentPulse.hero.pnl, 2000);
assert.equal(recentPulse.recent.wins, 1);
assert.equal(sortMySharpsRoster(twoRoster, 'l30')[0].walletShort, 'e4ec62');

const oneHot = pickDeskMovers({
  cards: twoRoster,
  tickets: mineBoard.tickets,
});
assert.equal(oneHot.hot.walletShort, 'e4ec62');
assert.ok(!oneHot.book || oneHot.book.walletShort !== oneHot.hot.walletShort);
assert.ok(!oneHot.live || !oneHot.list.filter((m) => m.role !== 'live').some((m) => m.walletShort === oneHot.live.walletShort));
assert.equal(new Set(oneHot.list.map((m) => m.walletShort)).size, oneHot.list.length);

assert.equal(ticketPickLabel({ team: 'Colts', marketType: 'SPREAD', marketLabel: 'SPREAD -6.5' }), 'Colts -6.5');
assert.equal(ticketPickLabel({ team: 'Seahawks', marketType: 'ML', marketLabel: 'ML' }), 'Seahawks');
assert.equal(ticketPickLabel({ team: 'Over', marketType: 'TOTAL', marketLabel: 'O 47.5' }), 'Over 47.5');

const report = buildDeskReport({
  roster: twoRoster,
  walletProfiles: new Map([
    ['e4ec62', {
      bySport: {
        NFL: {
          whitelistTier: 'CONFIRMED',
          recentActionWindow: { n: 10, wins: 7, losses: 3, wr: 70, settledPnl: 120000 },
          byMarket: {
            ML: { positions: { n: 10, wins: 7, losses: 3, wr: 70 }, recentActionWindow: { settledPnl: 80000 } },
          },
        },
      },
    }],
    ['abcdef', {
      bySport: {
        NFL: {
          whitelistTier: 'CONFIRMED',
          recentActionWindow: { n: 3, wins: 3, losses: 0, wr: 100, settledPnl: 9000 },
        },
      },
    }],
  ]),
  shorts: ['e4ec62', 'abcdef'],
  actionRows: [
    { walletShort: 'e4ec62', sport: 'NFL', invested: 162500 },
    { walletShort: 'abcdef', sport: 'CFB', invested: 11000 },
  ],
  weekRows: [
    { walletShort: 'e4ec62', sport: 'NFL', invested: 162500, commenceDateKey: '2026-09-20' },
  ],
  recentLegs: [
    { walletShort: 'e4ec62', won: 1, dollarPnl: 4000, date: '2026-09-18' },
    { walletShort: 'e4ec62', won: 0, dollarPnl: -1200, date: '2026-09-19' },
  ],
  dateKey: '2026-09-20',
  todayKey: '2026-09-20',
  nowMs: Date.parse('2026-09-20T18:00:00-04:00'),
});
assert.equal(report.todayN, 2);
assert.equal(report.openInvested, 173500);
assert.equal(report.l30.pnl, 129000);
assert.equal(report.weekGradedN, 2);
assert.equal(report.bestSport.sport, 'NFL');
assert.ok(report.sports.some((s) => s.sport === 'CFB' && s.openN === 1));

assert.equal(closedPickLabel({ side: 'under', line: 47.5, marketType: 'TOTAL' }), 'Under 47.5');
assert.equal(closedPickLabel({ side: 'away', team: 'Seahawks', marketType: 'ML' }), 'Seahawks');

const ledger = buildDeskLedger({
  actionRows: [
    {
      walletShort: 'e4ec62', sport: 'NFL', gameKey: 'sea_ari', marketType: 'TOTAL', side: 'over',
      team: 'Over', marketLabel: 'O 47.5', away: 'SEA', home: 'ARI', invested: 162500,
      commenceMs: Date.parse('2026-09-20T16:00:00-04:00'), commenceDateKey: '2026-09-20',
    },
    {
      walletShort: '162937', sport: 'NFL', gameKey: 'sea_ari', marketType: 'TOTAL', side: 'over',
      team: 'Over', marketLabel: 'O 47.5', away: 'SEA', home: 'ARI', invested: 11000,
      commenceMs: Date.parse('2026-09-20T16:00:00-04:00'), commenceDateKey: '2026-09-20',
    },
    {
      walletShort: 'abcdef', sport: 'CFB', gameKey: 'lsu_ala', marketType: 'ML', side: 'home',
      team: 'Bama', marketLabel: 'ML', away: 'LSU', home: 'Bama', invested: 88000,
      commenceMs: Date.parse('2026-09-21T20:00:00-04:00'), commenceDateKey: '2026-09-21',
    },
  ],
  recentLegs: [
    {
      walletShort: 'e4ec62', won: 1, dollarPnl: 4000, date: '2026-09-18',
      marketType: 'ML', side: 'away', team: 'Seahawks', gameKey: 'sea_ari', sport: 'NFL',
    },
    {
      walletShort: '162937', won: 0, dollarPnl: -1200, date: '2026-09-19',
      marketType: 'TOTAL', side: 'under', line: 7.5, gameKey: 'wsh_stl', sport: 'MLB',
    },
  ],
  todayKey: '2026-09-20',
  nowMs: Date.parse('2026-09-20T18:00:00-04:00'),
});
assert.equal(ledger.open.length, 1);
assert.equal(ledger.open[0].pick, 'Over 47.5');
assert.equal(ledger.open[0].walletN, 2);
assert.equal(ledger.open[0].invested, 173500);
assert.equal(ledger.open[0].live, true);
assert.equal(ledger.upcoming.length, 1);
assert.equal(ledger.upcoming[0].pick, 'Bama');
assert.equal(ledger.upcoming[0].matchup, 'LSU @ Bama');
assert.equal(ledger.closed.length, 2);
assert.equal(ledger.closed[0].pick, 'Under 7.5');
assert.equal(ledger.closed[1].pick, 'Seahawks');
assert.equal(ledger.closedPnl, 2800);
assert.equal(ledger.open[0].shared, true);
assert.equal(ledger.open[0].walletN, 2);

const holdings = buildDeskHoldings({
  roster: [
    { walletShort: 'e4ec62', name: 'Bands', openN: 1, openInvested: 2000 },
    { walletShort: 'aaaaaa', name: null, openN: 0, openInvested: 0 },
  ],
  walletProfiles: new Map([
    ['e4ec62', {
      bySport: {
        MLB: {
          whitelistTier: 'CONFIRMED',
          recentActionWindow: { n: 20, wins: 14, losses: 6, wr: 70, settledPnl: 30000 },
          byMarket: { ML: { positions: { n: 12, wins: 9, losses: 3, wr: 75 } } },
        },
        NFL: {
          whitelistTier: 'CONFIRMED',
          recentActionWindow: { n: 8, wins: 5, losses: 3, wr: 62, settledPnl: 8000 },
        },
      },
    }],
    ['aaaaaa', {
      bySport: {
        CFB: {
          whitelistTier: 'CONFIRMED',
          recentActionWindow: { n: 10, wins: 3, losses: 7, wr: 30, settledPnl: -5000 },
          form: { actionL10: { w: 2, l: 8 } },
        },
      },
    }],
  ]),
});
assert.equal(holdings[0].walletShort, 'e4ec62');
assert.equal(holdings[0].name, 'Bands');
assert.equal(holdings[0].l30Pnl, 38000);
assert.equal(holdings[0].whereSport, 'MLB');
assert.equal(holdings[0].whereMarket, 'ML');
assert.equal(holdings[1].l30Pnl, -5000);
assert.equal(holdings[1].heat.key, 'cold');

const tape = buildConsiderRows(ledger, { names: { abcdef: 'Ace' } });
assert.equal(tape.slate[0].pick, 'Over 47.5');
assert.equal(tape.slate[0].who, '2 on the list');
assert.equal(tape.later[0].pick, 'Bama');
assert.equal(tape.later[0].who, 'Ace');
assert.equal(tape.closed.length, 2);

const ordered = buildConsiderRows({
  open: [
    { id: 'solo', pick: 'Solo', shared: false, split: false, walletN: 1, shorts: ['aaa'], invested: 9000, commenceMs: 1 },
    { id: 'share', pick: 'Shared', shared: true, split: false, walletN: 2, shorts: ['a', 'b'], invested: 1000, commenceMs: 5 },
    { id: 'fight', pick: 'Fight', shared: true, split: true, walletN: 2, shorts: ['a', 'b'], invested: 8000, commenceMs: 2 },
  ],
  upcoming: [],
  closed: [],
});
assert.equal(ordered.slate[0].pick, 'Shared');
assert.equal(ordered.slate.find((r) => r.pick === 'Fight').who, 'Opposed');

const split = gainsSplit([
  { walletShort: 'e4ec62', dollarPnl: 4000 },
  { walletShort: 'e4ec62', dollarPnl: -1500 },
  { walletShort: 'other', dollarPnl: 9000 },
], 'e4ec62');
assert.equal(split.gains, 4000);
assert.equal(split.losses, 1500);

console.log('testMySharps: ok');
