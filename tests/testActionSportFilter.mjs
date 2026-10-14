/**
 * Action-tab sport rail / row filter.
 * Usage: node tests/testActionSportFilter.mjs
 */
import assert from 'node:assert/strict';
import {
  actionSportMatches,
  rowMatchesActionSport,
  filterActionRows,
  resolveActionSport,
  sportsWithActionPositions,
  buildConfirmedActionRows,
  sortActionRows,
  pinMoveFor,
} from '../src/lib/confirmedActionDesk.js';

assert.equal(actionSportMatches('CFB', 'All'), true);
assert.equal(actionSportMatches('CFB', 'ALL'), true);
assert.equal(actionSportMatches('CFB', 'CFB'), true);
assert.equal(actionSportMatches('cfb', 'CFB'), true);
assert.equal(actionSportMatches('MLB', 'CFB'), false);
assert.equal(rowMatchesActionSport({ sport: 'CFB', slug: 'cfb-unlv-unt-2026-09-12' }, 'CFB'), true);
assert.equal(rowMatchesActionSport({ sport: 'MLB', slug: 'mlb-phi-atl-2026-09-12' }, 'CFB'), false);
assert.equal(rowMatchesActionSport({ sport: 'CFB', slug: 'cfb-unlv-unt-2026-09-12' }, 'NHL'), false);
assert.equal(rowMatchesActionSport({ sport: 'MLB', slug: 'cfb-unlv-unt-2026-09-12' }, 'MLB'), false);
assert.equal(rowMatchesActionSport({ sport: 'MLB', slug: 'mlb-phi-atl-2026-09-12-total-7pt5' }, 'MLB'), true);

const rows = [
  { sport: 'CFB', invested: 2000, skillKey: 'high', sizeRatio: 1, opposed: 'clear', pinMove: 'with' },
  { sport: 'MLB', invested: 2000, skillKey: 'high', sizeRatio: 1, opposed: 'clear', pinMove: 'with' },
];
assert.equal(filterActionRows(rows, { sport: 'All' }).length, 2);
assert.deepEqual(filterActionRows(rows, { sport: 'CFB' }).map((r) => r.sport), ['CFB']);
assert.deepEqual(filterActionRows(rows, { sport: 'mlb' }).map((r) => r.sport), ['MLB']);

const cfbOnly = sportsWithActionPositions(
  { CFB: { unlv_tex: { positions: [{ wallet: '0x1', invested: 900 }] } } },
  { MLB: {} },
  null,
);
assert.equal(cfbOnly.has('CFB'), true, 'CFB totals-only feed still counts for the Action rail');
assert.equal(cfbOnly.has('MLB'), false, 'empty MLB object is not on the rail');

const spreadOnly = sportsWithActionPositions(
  {},
  { SOC: { liv_ars: { positions: [{ wallet: '0x2' }] } } },
);
assert.equal(spreadOnly.has('SOC'), true, 'spread-only sport stays filterable on Action');

assert.equal(resolveActionSport('MLB', { slug: 'cfb-unlv-unt-2026-09-12' }), 'CFB');
assert.equal(resolveActionSport('CFB', { slug: 'cfb-unlv-unt-2026-09-12' }), 'CFB');
assert.equal(resolveActionSport('MLB', { slug: 'mlb-cle-min-2026-09-12' }), 'MLB');

const profiles = new Map([
  ['aa11bb', { bySport: { CFB: { whitelistTier: 'CONFIRMED' }, MLB: { whitelistTier: 'CONFIRMED' } } }],
]);
const mixedTotals = {
  CFB: {
    unlv_unt: {
      away: 'UNLV', home: 'North Texas',
      positions: [{
        wallet: '0xaaaaaaaaaaaaaa11bb', side: 'over', invested: 14800,
        slug: 'cfb-unlv-unt-2026-09-12',
      }],
    },
  },
  MLB: {
    pit_chc: {
      away: 'Pirates', home: 'Cubs',
      positions: [{
        wallet: '0xaaaaaaaaaaaaaa11bb', side: 'over', invested: 2100,
        slug: 'mlb-pit-chc-2026-09-12',
      }],
    },
  },
};
const mlbOnly = buildConfirmedActionRows({
  totalPositions: mixedTotals,
  walletProfiles: profiles,
  sportFilter: 'MLB',
}).rows;
assert.equal(mlbOnly.every((r) => r.sport === 'MLB'), true, 'MLB filter must not emit CFB rows');
assert.equal(mlbOnly.some((r) => /unlv/i.test(`${r.away} ${r.home} ${r.gameKey}`)), false, 'UNLV cannot survive an MLB filter');
assert.equal(mlbOnly.length, 1, 'one MLB ticket');

const leaked = buildConfirmedActionRows({
  totalPositions: {
    MLB: {
      unlv_unt: {
        away: 'UNLV', home: 'North Texas',
        positions: [{
          wallet: '0xaaaaaaaaaaaaaa11bb', side: 'over', invested: 14800,
          slug: 'cfb-unlv-unt-2026-09-12',
        }],
      },
    },
  },
  walletProfiles: profiles,
  sportFilter: 'MLB',
}).rows;
assert.equal(leaked.length, 0, 'CFB slug in the MLB bucket is dropped from MLB');

const recovered = buildConfirmedActionRows({
  totalPositions: {
    MLB: {
      unlv_unt: {
        away: 'UNLV', home: 'North Texas',
        positions: [{
          wallet: '0xaaaaaaaaaaaaaa11bb', side: 'over', invested: 14800,
          slug: 'cfb-unlv-unt-2026-09-12',
        }],
      },
    },
  },
  walletProfiles: profiles,
  sportFilter: 'CFB',
}).rows;
assert.equal(recovered.length, 1, 'CFB slug in the MLB bucket still shows on the CFB chip');
assert.equal(recovered[0].sport, 'CFB');

const rail = sportsWithActionPositions({
  MLB: {
    unlv_unt: { positions: [{ slug: 'cfb-unlv-unt-2026-09-12' }] },
  },
});
assert.equal(rail.has('CFB'), true, 'mis-bucketed CFB tickets keep CFB on the Action rail');

const sortRows = [
  { sport: 'MLB', team: 'Phillies', invested: 2000, sizeRatio: 1.1, displaySizeRatio: 1.1, ts: 10, skillKey: 'low', skillWeight: 2, strengthScore: 90, trust: { wr: 54 }, form: { l10: { w: 4, l: 6 } }, opposed: 'clear', pinMove: null, steam: null },
  { sport: 'CFB', team: 'Over', invested: 14800, sizeRatio: 2.4, displaySizeRatio: 3.3, ts: 5, skillKey: 'high', skillWeight: 4, strengthScore: 40, trust: { wr: 71 }, form: { actionL10: { w: 8, l: 2 } }, opposed: 'contested', pinMove: null, steam: { show: true } },
  { sport: 'MLB', team: 'Cubs', invested: 2100, sizeRatio: 0.4, displaySizeRatio: 0.4, ts: 20, skillKey: 'high', skillWeight: 4, strengthScore: 80, trust: { wr: 61 }, form: { l10: { w: 6, l: 4 } }, opposed: 'clear', pinMove: 'with', steam: null },
];
assert.deepEqual(sortActionRows(sortRows, 'dollars').map((r) => r.team), ['Over', 'Cubs', 'Phillies']);
assert.deepEqual(sortActionRows(sortRows, 'size').map((r) => r.team), ['Over', 'Phillies', 'Cubs']);
assert.deepEqual(sortActionRows(sortRows, 'recency').map((r) => r.team), ['Cubs', 'Phillies', 'Over']);
assert.deepEqual(sortActionRows(sortRows, 'skill').map((r) => r.team), ['Over', 'Cubs', 'Phillies']);
assert.deepEqual(sortActionRows(sortRows, 'form').map((r) => r.team), ['Over', 'Cubs', 'Phillies']);

assert.deepEqual(filterActionRows(sortRows, { sport: 'CFB', minInvested: 0 }).map((r) => r.team), ['Over']);
assert.deepEqual(filterActionRows(sortRows, { sport: 'All', sizedOnly: true, minInvested: 0 }).map((r) => r.team), ['Phillies', 'Over']);
assert.deepEqual(filterActionRows(sortRows, { sport: 'All', clearOnly: true, minInvested: 0 }).map((r) => r.team), ['Phillies', 'Cubs']);
assert.deepEqual(filterActionRows(sortRows, { sport: 'All', pinWithOnly: true, minInvested: 0 }).map((r) => r.team), ['Over', 'Cubs']);
assert.deepEqual(filterActionRows(sortRows, { sport: 'All', highMidOnly: true, minInvested: 0 }).map((r) => r.team), ['Over', 'Cubs']);

const trackedProfiles = new Map([
  ['aa11bb', { bySport: { MLB: { whitelistTier: 'CONFIRMED' }, NHL: { whitelistTier: 'WR50' } } }],
  ['cc33dd', { bySport: { NHL: { whitelistTier: 'WR50' } } }],
  ['dd44ee', { bySport: { MLB: { whitelistTier: 'WR50' } } }],
]);
const nhlBoard = {
  NHL: {
    njd_tor: {
      away: 'NJD', home: 'TOR',
      positions: [
        { wallet: '0xaaaaaaaaaaaaaa11bb', side: 'away', invested: 2700, slug: 'nhl-njd-tor-2026-10-14' },
        { wallet: '0xcccccccccccccc33dd', side: 'home', invested: 1800, slug: 'nhl-njd-tor-2026-10-14' },
      ],
    },
  },
};
assert.equal(buildConfirmedActionRows({
  sharpPositions: nhlBoard,
  walletProfiles: trackedProfiles,
}).rows.length, 0, 'unproven NHL stays off the Action board');
const tracked = buildConfirmedActionRows({
  sharpPositions: nhlBoard,
  walletProfiles: trackedProfiles,
  portfolioShorts: ['aa11bb'],
}).rows;
assert.equal(tracked.length, 1, 'only the saved wallet is added');
assert.equal(tracked[0].walletShort, 'aa11bb');
assert.equal(tracked[0].sport, 'NHL');
assert.equal(tracked[0].portfolioOnly, true);
assert.equal(tracked[0].counted, false);

const splitBoard = {
  MLB: {
    pit_chc: {
      away: 'PIT', home: 'CHC',
      positions: [
        { wallet: '0xaaaaaaaaaaaaaa11bb', side: 'over', invested: 2000, slug: 'mlb-pit-chc-2026-10-14', betMultiplier: 1.2 },
        { wallet: '0xdddddddddddddd44ee', side: 'under', invested: 1500, slug: 'mlb-pit-chc-2026-10-14', betMultiplier: 1.1 },
      ],
    },
  },
};
const splitRows = buildConfirmedActionRows({
  totalPositions: splitBoard,
  walletProfiles: trackedProfiles,
  portfolioShorts: ['dd44ee'],
}).rows;
const provenOver = splitRows.find((r) => r.walletShort === 'aa11bb');
const trackedUnder = splitRows.find((r) => r.walletShort === 'dd44ee');
assert.equal(provenOver.portfolioOnly, false);
assert.equal(provenOver.opposed, 'clear', 'a tracked unproven ticket does not contest the Action board');
assert.equal(trackedUnder.portfolioOnly, true);
assert.equal(trackedUnder.opposed, 'contested', 'My Bets still sees the other side');

assert.equal(pinMoveFor({ MLB: { x: { movement: { direction: 'over' } } } }, 'MLB', 'x', 'over'), 'with');
assert.equal(pinMoveFor({ MLB: { x: { movement: { direction: 'under' } } } }, 'MLB', 'x', 'over'), 'against');
assert.equal(pinMoveFor({}, 'MLB', 'x', 'over', { show: true }), 'with');

console.log('testActionSportFilter: ok');
