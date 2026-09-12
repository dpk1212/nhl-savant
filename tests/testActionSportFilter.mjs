/**
 * Action-tab sport rail / row filter.
 * Usage: node tests/testActionSportFilter.mjs
 */
import assert from 'node:assert/strict';
import {
  actionSportMatches,
  filterActionRows,
  resolveActionSport,
  sportsWithActionPositions,
  buildConfirmedActionRows,
} from '../src/lib/confirmedActionDesk.js';

assert.equal(actionSportMatches('CFB', 'All'), true);
assert.equal(actionSportMatches('CFB', 'ALL'), true);
assert.equal(actionSportMatches('CFB', 'CFB'), true);
assert.equal(actionSportMatches('cfb', 'CFB'), true);
assert.equal(actionSportMatches('MLB', 'CFB'), false);

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

console.log('testActionSportFilter: ok');
