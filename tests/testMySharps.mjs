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
  isMySharpShort,
  portfolioWalletsOnCard,
  cleanSharpName,
  parseMySharpsDoc,
  tailFromTicket,
  toggleMySharpMember,
  betsFeedKey,
  betsFeedOn,
  toggleBetsFeed,
} from '../src/lib/mySharps.js';
import {
  americanProfit,
  blendRoi,
  buildConsiderRows,
  buildDeskHoldings,
  buildDeskLedger,
  buildDeskPulse,
  buildDeskReport,
  blendDollarCurves,
  buildFindCandidates,
  buildPortfolioSnapshot,
  buildPortfolioStage,
  buildSharpDossier,
  gainsSplit,
  gradeTail,
  groupPortfolioBets,
  buildMySharpsBoard,
  closedPickLabel,
  buildMySharpsDashboard,
  buildMySharpsRoster,
  filterBoardTickets,
  filterRowsToMySharps,
  heatFromForm,
  honestRecord,
  marketBooksFromProfile,
  marketTape,
  rowsForBetsFeed,
  pickDeskMovers,
  shortsForDeskSection,
  sortMySharpsRoster,
  sortRowsByRelativeSize,
  sharpFaceFromProfile,
  summarizeTails,
  tailLean,
  ticketPickLabel,
} from '../src/lib/mySharpsDesk.js';

assert.equal(fmtWalletTag('0xABC162937'), '··162937');

const card = {
  mapWallets: [
    { short: 'CD2F63', side: 'ours', invested: 818 },
    { short: '4b912c', side: 'against', invested: 1200 },
    { short: '9214c2', side: 'ours', invested: 2400 },
  ],
  wallets: [
    { short: 'cd2f63', invested: 818 },
    { short: 'aabbcc', invested: 50 },
  ],
};
const saved = new Set(['cd2f63', '4b912c']);
assert.equal(isMySharpShort(saved, 'CD2F63'), true);
assert.equal(isMySharpShort(saved, 'nope'), false);
const onCard = portfolioWalletsOnCard(card, saved);
assert.deepEqual(onCard.map((w) => [w.id, w.side, w.invested]), [
  ['4b912c', 'against', 1200],
  ['cd2f63', 'ours', 818],
]);
assert.equal(portfolioWalletsOnCard(card, new Set()).length, 0);
assert.equal(portfolioWalletsOnCard(null, saved).length, 0);

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
assert.equal(heatFromForm({ actionL10: { w: 5, l: 0 }, actionL5: { w: 5, l: 0 } }).window, 'L5');
assert.equal(heatFromForm({ actionL10: { w: 7, l: 3 }, actionL5: { w: 4, l: 1 } }).window, 'L10');

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

assert.deepEqual(emptyMySharps().tails, {});
const tailedDoc = parseMySharpsDoc({
  mySharps: {
    members: { e4ec62: { walletShort: 'e4ec62', addedAt: 1 } },
    tails: {
      'MLB|nyy_tex|ML|away': {
        pick: 'Mets', sport: 'MLB', gameKey: 'nyy_tex', marketType: 'ML', side: 'away',
        myAmerican: '-110', stake: 500, wallets: ['e4ec62'],
      },
    },
  },
});
assert.equal(tailedDoc.tails['MLB|nyy_tex|ML|away'].myAmerican, -110);
assert.equal(tailedDoc.tails['MLB|nyy_tex|ML|away'].stake, 500);
const keptTails = toggleMySharpMember(tailedDoc, { walletShort: '51176e', addedAt: 2 });
assert.equal(keptTails.tails['MLB|nyy_tex|ML|away'].stake, 500);

assert.equal(americanProfit(500, -110, true), 455);
assert.equal(americanProfit(500, -110, false), -500);
assert.equal(blendRoi([{ pnl: 1400, roi: 14 }, { pnl: 1600, roi: 16 }]), 15);

const graded = gradeTail(tailedDoc.tails['MLB|nyy_tex|ML|away'], [
  { walletShort: 'e4ec62', gameKey: 'nyy_tex', marketType: 'ML', side: 'away', won: 1 },
]);
assert.equal(graded.status, 'won');
assert.equal(graded.pnl, 455);
const summary = summarizeTails(tailedDoc.tails, [
  { walletShort: 'e4ec62', gameKey: 'nyy_tex', marketType: 'ML', side: 'away', won: 1 },
]);
assert.equal(summary.wins, 1);
assert.equal(summary.pnl, 455);

const made = tailFromTicket({
  sport: 'MLB', gameKey: 'tor_bal', marketType: 'TOTAL', side: 'under',
  pick: 'Under 8.5', americanOdds: -154, shorts: ['e4ec62'],
}, { myAmerican: '-150', stake: 2000, now: 9 });
assert.equal(made.id, 'MLB|tor_bal|TOTAL|under');
assert.equal(made.myAmerican, -150);
assert.equal(made.theirAmerican, -154);

const grouped = groupPortfolioBets(board.tickets, { names: {} });
assert.equal(grouped.together.length, 0);
assert.equal(grouped.split.length, 2);
assert.equal(grouped.pressing.length, 1);
assert.equal(grouped.split.some((t) => t.pick === 'Over 47.5'), true);
assert.equal(grouped.split.every((t) => t.whoOpposed), true);

const snap = buildPortfolioSnapshot({
  holdings,
  tickets: board.tickets,
  tails: tailedDoc.tails,
  legs: [{ walletShort: 'e4ec62', gameKey: 'nyy_tex', marketType: 'ML', side: 'away', won: 1 }],
});
assert.equal(snap.l30.pnl, 38000 + -5000);
assert.equal(snap.tails.wins, 1);
assert.ok(snap.open.n >= 1);

const found = buildFindCandidates(new Map([
  ['c0ffee', {
    clvSkill: { n: 20, pctPos: 60 },
    bySport: {
      MLB: {
        whitelistTier: 'CONFIRMED',
        positions: { n: 120, wins: 72, losses: 48, wr: 60, dollarRoi: 22, invested: 240000 },
        recentActionWindow: { n: 40, wins: 26, losses: 14, wr: 65, settledPnl: 20000, dollarRoi: 22 },
        byMarket: { TOTAL: { positions: { n: 80, wins: 50, losses: 30, wr: 62, dollarRoi: 19 } } },
      },
    },
  }],
  ['thin01', {
    bySport: {
      MLB: {
        whitelistTier: 'CONFIRMED',
        positions: { n: 4, wins: 3, losses: 1, wr: 75, dollarRoi: 40, invested: 4000 },
      },
    },
  }],
  ['e4ec62', {
    bySport: { MLB: { whitelistTier: 'CONFIRMED', positions: { n: 30, wins: 18, losses: 12, wr: 60, dollarRoi: 10, invested: 90000 } } },
  }],
]), { exclude: ['e4ec62'], sport: 'MLB', market: 'All', window: 'book', minBets: 100, minRoi: 20 });
assert.equal(found.total, 1);
assert.equal(found.rows[0].walletShort, 'c0ffee');
assert.equal(found.rows[0].roi, 22);
assert.ok(found.rows[0].usual > 0);

const rankBook = new Map([
  ['high', {
    clvSkill: { n: 8, pctPos: 51 },
    bySport: { MLB: { whitelistTier: 'CONFIRMED', positions: { n: 20, wins: 14, losses: 6, wr: 70, dollarRoi: 30, invested: 40000 } } },
  }],
  ['deep', {
    clvSkill: { n: 40, pctPos: 64 },
    bySport: { MLB: { whitelistTier: 'CONFIRMED', positions: { n: 200, wins: 110, losses: 90, wr: 55, dollarRoi: 9, invested: 900000 } } },
  }],
]);
assert.equal(buildFindCandidates(rankBook, { sport: 'MLB', window: 'book' }).rows[0].walletShort, 'high');
assert.equal(buildFindCandidates(rankBook, { sport: 'MLB', window: 'book', sort: 'bets' }).rows[0].walletShort, 'deep');
assert.equal(buildFindCandidates(rankBook, { sport: 'MLB', window: 'book', sort: 'close' }).rows[0].walletShort, 'deep');
assert.equal(buildFindCandidates(rankBook, { sport: 'MLB', window: 'book', sort: 'size' }).rows[0].walletShort, 'deep');

const blended = blendDollarCurves([[0, 100], [0, 50, 100]], 3);
assert.equal(blended.length, 3);
assert.equal(blended[0], 0);
assert.equal(blended[2], 200);

const legs = Array.from({ length: 35 }, (_, i) => ({
  date: `2026-08-${String((i % 28) + 1).padStart(2, '0')}`,
  marketType: 'ML',
  side: 'home',
  team: 'Yankees',
  gameKey: `g${i}`,
  won: i % 2,
  dollarPnl: i % 2 ? 100 : -80,
}));
const dossier = buildSharpDossier(new Map([['c0ffee', {
  clvSkill: { n: 10, pctPos: 60 },
  bySport: {
    MLB: {
      whitelistTier: 'CONFIRMED',
      recentActionWindow: { n: 40, wins: 22, losses: 18, wr: 55, settledPnl: 4000, dollarRoi: 8 },
      positions: { n: 40, wins: 22, losses: 18, wr: 55, dollarRoi: 8, invested: 80000 },
      form: { actionDollarCurve: [0, 800, 1600, 2500, 4000], recentAction: legs },
    },
  },
}]]), 'c0ffee', { sport: 'MLB' });
assert.equal(dossier.results.length, 30);
assert.equal(dossier.resultN, 35);
assert.ok(String(dossier.results[0].date) >= String(dossier.results[29].date));
assert.equal(dossier.results[0].pick, 'Yankees');
assert.equal(dossier.sparkFrom, 'book');
assert.ok(dossier.spark.length >= 5);

const quiet = buildSharpDossier(new Map([['e05213', {
  clvSkill: { n: 40, pctPos: 57 },
  bySport: {
    MLB: {
      whitelistTier: 'CONFIRMED',
      recentActionWindow: { n: 0, wins: 0, losses: 0, settledPnl: 0, dollarRoi: null },
      positions: { n: 45, wins: 32, losses: 13, wr: 71, dollarRoi: 45, invested: 1781035 },
      form: {
        actionL10: { w: 4, l: 6 },
        actionDollarCurve: [0, 120000, 240000, 360000, 485846],
        actionDollarEnd: 485846,
        flatCurveFrom: '2026-06-02',
        recentAction: [],
        recentActionTotalN: 0,
        curveLegs: [
          { date: '2026-06-18', marketType: 'TOTAL', side: 'over', line: 8.5, gameKey: 'nyy_bos', away: 'NYY', home: 'BOS', dollarPnl: 4200, won: 1 },
          { date: '2026-06-12', marketType: 'ML', side: 'home', label: 'Dodgers', gameKey: 'sf_lad', away: 'SF', home: 'LAD', dollarPnl: -1800, won: 0 },
        ],
      },
      byMarket: {
        TOTAL: { positions: { n: 26, wins: 21, losses: 5, wr: 81, dollarRoi: 54 } },
      },
    },
  },
}]]), 'e05213', { sport: 'MLB' });
assert.equal(quiet.l30Pnl, null);
assert.equal(quiet.sparkScope, 'recent');
assert.equal(quiet.sparkFromDate, '2026-06-02');
assert.equal(quiet.pathPnl, 485846);
assert.equal(quiet.tapeScope, 'recent');
assert.equal(quiet.quietMonth, false);
assert.equal(quiet.results.length, 2);
assert.equal(quiet.results[0].pick, 'Over 8.5');
assert.equal(quiet.results[0].date, '2026-06-18');

const quietEmpty = buildSharpDossier(new Map([['913987', {
  bySport: {
    MLB: {
      whitelistTier: 'CONFIRMED',
      recentActionWindow: { n: 0, wins: 0, losses: 0, settledPnl: 0 },
      form: {
        actionDollarCurve: [0, -40000, -90000, -160000, -262000],
        flatCurveFrom: '2026-06-04',
        recentAction: [],
        recentActionTotalN: 0,
      },
    },
  },
}]]), '913987', { sport: 'MLB' });
assert.equal(quietEmpty.results.length, 0);
assert.equal(quietEmpty.quietMonth, true);
assert.equal(quietEmpty.pathPnl, -262000);
assert.equal(quietEmpty.sparkScope, 'recent');

const copied = buildSharpDossier(new Map([['26f737', {
  bySport: {
    SOC: {
      whitelistTier: 'CONFIRMED',
      recentActionWindow: { n: 5, wins: 5, losses: 0, wr: 100, settledPnl: 51890, dollarRoi: 97.6, invested: 53144 },
      positions: { n: 5, wins: 5, losses: 0, wr: 100, settledPnl: 51890, dollarRoi: 97.6, invested: 53144 },
      form: {
        actionL5: { w: 5, l: 0 },
        actionL10: { w: 5, l: 0 },
        actionDollarCurve: [3315, 6630, 27965, 49300, 51890],
        actionDollarEnd: 51890,
        recentActionTotalN: 5,
        recentAction: [
          { date: '2026-09-14', marketType: 'ML', side: 'away', label: 'Villarreal CF', gameKey: 'vil_mlg', away: 'Villarreal CF', home: 'Málaga CF', dollarPnl: 3315, invested: 3185, won: 1 },
          { date: '2026-09-15', marketType: 'ML', side: 'away', label: 'Villarreal CF', gameKey: 'vil_mlg', away: 'Villarreal CF', home: 'Málaga CF', dollarPnl: 3315, invested: 3185, won: 1 },
          { date: '2026-09-16', marketType: 'ML', side: 'away', label: 'Villarreal CF', gameKey: 'vil_mlg', away: 'Villarreal CF', home: 'Málaga CF', dollarPnl: 21335, invested: 21182, won: 1 },
          { date: '2026-09-17', marketType: 'ML', side: 'away', label: 'Villarreal CF', gameKey: 'vil_mlg', away: 'Villarreal CF', home: 'Málaga CF', dollarPnl: 21335, invested: 21182, won: 1 },
          { date: '2026-09-20', marketType: 'ML', side: 'home', label: 'Villarreal CF', gameKey: 'lev_vil', away: 'Levante UD', home: 'Villarreal CF', dollarPnl: 2590, invested: 4410, won: 1 },
        ],
      },
      byMarket: {
        ML: { positions: { n: 5, wins: 5, losses: 0, wr: 100, dollarRoi: 97.6, invested: 53144, settledPnl: 51890 } },
      },
    },
  },
}]]), '26f737', { sport: 'SOC' });
assert.equal(copied.results.length, 3);
assert.equal(copied.l30Pnl, 27240);
assert.equal(copied.honest.record, '3–0');
assert.equal(copied.heat.window, 'L5');
assert.equal(copied.markets[0].n, 3);

const stage = buildPortfolioStage([
  { walletShort: 'a', name: 'Bands', tag: '··a', l30Pnl: 51000, roi: 34, wins: 26, losses: 14, honest: { text: '26–14 · 65%', n: 40, wr: 65, showPct: true }, spark: [0, 51000], heat: { key: 'hot', label: 'Hot', window: 'L10', record: '7–3', n: 10 }, lines: [{ sport: 'MLB', pnl: 51000, wins: 26, losses: 14 }], markets: [{ label: 'Total', market: 'TOTAL', n: 16, wins: 11, losses: 5, roi: 22, l30: { pnl: 28000 } }] },
  { walletShort: 'b', name: 'Harbor', tag: '··b', l30Pnl: 43100, roi: 27, wins: 22, losses: 12, honest: { text: '22–12 · 65%', n: 34, wr: 65, showPct: true }, spark: [0, 39300], lines: [{ sport: 'MLB', pnl: 39300, wins: 20, losses: 10 }, { sport: 'NFL', pnl: 3800, wins: 2, losses: 2 }], markets: [{ label: 'ML', market: 'ML', n: 12, wins: 9, losses: 3, roi: 17, l30: { pnl: 22000 } }] },
]);
assert.equal(stage.bookPnl, 94100);
assert.equal(stage.pathEnd, 94100);
assert.equal(stage.path[stage.path.length - 1], 94100);
assert.equal(stage.uncharted, null);
assert.equal(stage.sports[0].sport, 'MLB');
assert.equal(stage.sports[0].pnl, 90300);
assert.equal(stage.markets.length, 2);

const lines = groupPortfolioBets([{
  id: 't1', split: false, shared: false, maxRatio: 2.1, invested: 6400,
  shorts: ['e4ec62'], marketType: 'ML', team: 'Pirates', side: 'home',
  rows: [{ walletShort: 'e4ec62', invested: 6400, displaySizeRatio: 2.1, americanLabel: '-149' }],
}], { names: { e4ec62: 'Bands' } });
assert.equal(lines.pressing[0].walletLines[0].tag, 'Bands');
assert.equal(lines.pressing[0].walletLines[0].invested, 6400);

assert.equal(betsFeedKey('mlb', 'spread'), 'MLB|SPREAD');
assert.equal(betsFeedOn({ betsOff: ['MLB|SPREAD'] }, 'MLB', 'ML'), true);
assert.equal(betsFeedOn({ betsOff: ['MLB|SPREAD'] }, 'CFB', 'SPREAD'), true);
assert.equal(betsFeedOn({ betsOff: ['MLB|SPREAD'] }, 'MLB', 'SPREAD'), false);
const fed = toggleBetsFeed({
  members: { abcd12: { walletShort: 'abcd12', betsOff: [] } },
  tails: {},
}, 'abcd12', 'MLB', 'SPREAD');
assert.deepEqual(fed.members.abcd12.betsOff, ['MLB|SPREAD']);
const fedBack = toggleBetsFeed(fed, 'abcd12', 'MLB', 'SPREAD');
assert.deepEqual(fedBack.members.abcd12.betsOff, []);
const parsedOff = parseMySharpsDoc({
  mySharps: { members: { abcd12: { walletShort: 'abcd12', betsOff: ['mlb|ml', 'nope', 'CFB|SPREAD'] } } },
});
assert.deepEqual(parsedOff.members.abcd12.betsOff, ['MLB|ML', 'CFB|SPREAD']);

const sizedBooks = marketBooksFromProfile({
  bySport: {
    MLB: {
      whitelistTier: 'CONFIRMED',
      byMarket: {
        SPREAD: { positions: { n: 4, wins: 2, losses: 2, wr: 50, dollarRoi: 11, invested: 16800 } },
      },
    },
  },
}, 'MLB');
assert.equal(sizedBooks[0].usual, 4200);

const spreadTape = marketTape(new Map([['abcd12', {
  bySport: {
    MLB: {
      form: {
        recentAction: [
          { date: '2026-09-20', marketType: 'SPREAD', side: 'home', team: 'Yankees', line: -1.5, away: 'BOS', home: 'NYY', invested: 4000, dollarPnl: 1800, won: 1 },
          { date: '2026-09-19', marketType: 'ML', side: 'away', team: 'Mets', away: 'NYM', home: 'TEX', invested: 2000, dollarPnl: -2000, won: 0 },
        ],
      },
    },
  },
}]]), 'abcd12', 'MLB', 'SPREAD');
assert.equal(spreadTape.plays.length, 1);
assert.equal(spreadTape.plays[0].pick.includes('Yankees'), true);
assert.equal(spreadTape.plays[0].invested, 4000);

const kept = rowsForBetsFeed([
  { walletShort: 'abcd12', sport: 'MLB', marketType: 'SPREAD', invested: 100 },
  { walletShort: 'abcd12', sport: 'CFB', marketType: 'ML', invested: 200 },
  { walletShort: 'eeeeee', sport: 'MLB', marketType: 'SPREAD', invested: 300 },
], [{ walletShort: 'abcd12', betsOff: ['MLB|SPREAD'] }]);
assert.equal(kept.length, 2);
assert.equal(kept.some((r) => r.walletShort === 'abcd12' && r.marketType === 'SPREAD'), false);
const rebuilt = buildMySharpsBoard(kept);
assert.equal(rebuilt.tickets.length, 2);

const face = sharpFaceFromProfile({
  bySport: {
    MLB: {
      recentActionWindow: { n: 40, wins: 26, losses: 14, wr: 65, settledPnl: 51000, dollarRoi: 14 },
      positions: { n: 90, wins: 54, losses: 36, invested: 420000 },
      form: { actionL10: { w: 7, l: 3 } },
      byMarket: {
        TOTAL: {
          positions: { n: 48, wins: 31, losses: 17, wr: 65, dollarRoi: 19, invested: 230400 },
          recentActionWindow: { n: 16, wins: 11, losses: 5, settledPnl: 28000, dollarRoi: 22 },
        },
      },
    },
  },
}, { sport: 'MLB', market: 'TOTAL' });
assert.equal(face.heat.key, 'hot');
assert.equal(face.heat.record, '7–3');
assert.equal(face.book.label, 'Total');
assert.equal(face.book.record, '31–17');
assert.equal(face.book.roi, 19);
assert.equal(face.marketL30, 28000);
assert.equal(face.sportL30, 51000);
assert.equal(face.usual, 4667);

const thinFace = sharpFaceFromProfile({
  bySport: {
    NFL: {
      positions: { n: 3, wins: 3, losses: 0, invested: 6000 },
      form: { actionL5: { w: 2, l: 0 } },
      byMarket: {
        SPREAD: { positions: { n: 3, wins: 3, losses: 0, wr: 100, dollarRoi: 140 } },
      },
    },
  },
}, { sport: 'NFL', market: 'spreads' });
assert.equal(thinFace.heat, null);
assert.equal(thinFace.book.record, '3–0');
assert.equal(thinFace.book.roi, null);
assert.equal(thinFace.usual, 2000);

const faced = groupPortfolioBets([{
  id: 'tor-under', split: false, shared: true, maxRatio: 3, invested: 18200,
  sport: 'MLB', marketType: 'TOTAL', gameKey: 'tor_bal', side: 'under',
  shorts: ['e4ec62', '51176e'],
  rows: [
    { walletShort: 'e4ec62', invested: 14000, displaySizeRatio: 3, americanLabel: '-154', steam: { show: true, tier: 'gold', goldConfirmed: true, tag: 'GOLD 4.2%' } },
    { walletShort: '51176e', invested: 4200, displaySizeRatio: 1, americanLabel: '-100', steam: { show: false, tier: 'watch', tag: '1.2%' } },
  ],
}, {
  id: 'hou-over', split: true, shared: false, maxRatio: 0.9, invested: 1800,
  sport: 'MLB', marketType: 'TOTAL', gameKey: 'hou_sea', side: 'over',
  team: 'Over', marketLabel: 'O 7.5', away: 'HOU', home: 'SEA',
  shorts: ['e4ec62'], oppShorts: ['51176e'],
  rows: [{ walletShort: 'e4ec62', invested: 1800, displaySizeRatio: 0.9, americanLabel: '-102' }],
}, {
  id: 'hou-under', split: true, shared: false, maxRatio: 1.1, invested: 2200,
  sport: 'MLB', marketType: 'TOTAL', gameKey: 'hou_sea', side: 'under',
  team: 'Under', marketLabel: 'U 7.5', away: 'HOU', home: 'SEA',
  shorts: ['51176e'], oppShorts: ['e4ec62'],
  rows: [{ walletShort: '51176e', invested: 2200, displaySizeRatio: 1.1, americanLabel: '-108' }],
}], {
  names: { e4ec62: 'Bands' },
  walletProfiles: new Map([['e4ec62', {
    bySport: {
      MLB: {
        recentActionWindow: { n: 40, wins: 26, losses: 14, settledPnl: 51000 },
        positions: { n: 90, invested: 420000 },
        form: { actionL10: { w: 7, l: 3 } },
        byMarket: {
          TOTAL: {
            positions: { n: 48, wins: 31, losses: 17, wr: 65, dollarRoi: 19 },
            recentActionWindow: { n: 16, settledPnl: 28000 },
          },
        },
      },
    },
  }]]),
});
assert.equal(faced.together[0].walletLines[0].tag, 'Bands');
assert.equal(faced.together[0].walletLines[0].steam.tag, 'GOLD 4.2%');
assert.equal(faced.together[0].walletLines[0].book.roi, 19);
assert.equal(faced.together[0].walletLines[0].heat.key, 'hot');
assert.equal(faced.together[0].walletLines[1].steam, null);
assert.equal(faced.together[0].walletLines[1].tag, '··51176e');
assert.equal(faced.split.length, 2);
assert.equal(faced.split.find((t) => t.side === 'over').otherSide[0].pick, 'Under 7.5');
assert.equal(faced.split.find((t) => t.side === 'over').otherSide[0].tags[0], '··51176e');

console.log('testMySharps: ok');
