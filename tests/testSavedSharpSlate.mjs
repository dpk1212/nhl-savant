/**
 * Sharp Intel My Sharps slate.
 * A followed wallet's unproven sport still lands on the slate.
 * Usage: node tests/testSavedSharpSlate.mjs
 */
import assert from 'node:assert/strict';
import { buildSavedSharpGroups } from '../src/lib/savedSharpSlate.js';

const profiles = new Map([
  ['aa11bb', { bySport: { MLB: { whitelistTier: 'CONFIRMED' }, NHL: { whitelistTier: 'WR50' } } }],
  ['bb22cc', { bySport: { NHL: { whitelistTier: 'WR50' } } }],
  ['cc33dd', { bySport: { NHL: { whitelistTier: 'WR50' } } }],
]);

const qualified = {
  MLB: {
    pit_chc: {
      away: 'Pirates', home: 'Cubs',
      positions: [{
        wallet: '0xaaaaaaaaaaaaaa11bb', side: 'home', invested: 2200,
        slug: 'mlb-pit-chc-2026-10-14', v8_sizeRatio: 1.1,
      }],
    },
  },
};

const raw = {
  ...qualified,
  NHL: {
    dal_col: {
      away: 'Stars', home: 'Avalanche',
      positions: [
        {
          wallet: '0xaaaaaaaaaaaaaa11bb', side: 'home', invested: 1404,
          slug: 'nhl-dal-col-2026-10-14', v8_sizeRatio: 2.2,
        },
        {
          wallet: '0xbbbbbbbbbbbbbb22cc', side: 'home', invested: 900,
          slug: 'nhl-dal-col-2026-10-14', v8_sizeRatio: 1.2,
        },
        {
          wallet: '0xcccccccccccccccc33dd', side: 'away', invested: 800,
          slug: 'nhl-dal-col-2026-10-14', v8_sizeRatio: 1.1,
        },
      ],
    },
  },
};

function flat(groups) {
  return ['together', 'pressing', 'split', 'rest'].flatMap((k) => groups[k] || []);
}

const groups = buildSavedSharpGroups({
  sharpPositions: qualified,
  rawSharpPositions: raw,
  walletProfiles: profiles,
  portfolioShorts: ['aa11bb'],
  roster: [{ walletShort: 'aa11bb', name: 'Kch', betsOff: [] }],
  names: { aa11bb: 'Kch' },
  dateKey: null,
});

const tickets = flat(groups);
assert.equal(tickets.some((t) => t.sport === 'MLB'), true, 'proven MLB stays on the slate');
const nhl = tickets.filter((t) => t.sport === 'NHL');
assert.equal(nhl.length, 1, 'the followed unproven NHL ticket is on the slate');
assert.equal(nhl[0].portfolioOnly || nhl[0].rows?.every((r) => r.portfolioOnly), true);
assert.equal(groups.pressing.some((t) => t.sport === 'NHL'), true, 'a 2.2× NHL bet sits in Pressing');
assert.equal(tickets.some((t) => (t.shorts || []).includes('cc33dd')), false, 'a wallet that is not on the list stays off');
assert.equal(tickets.some((t) => (t.shorts || []).includes('bb22cc')), false, 'the other side of a stranger does not join the ticket');

const hidden = buildSavedSharpGroups({
  sharpPositions: qualified,
  rawSharpPositions: raw,
  walletProfiles: profiles,
  portfolioShorts: ['aa11bb'],
  roster: [{ walletShort: 'aa11bb', betsOff: ['NHL|ML'] }],
  dateKey: null,
});
assert.equal(flat(hidden).some((t) => t.sport === 'NHL'), false, 'a market switched off leaves the slate');
assert.equal(flat(hidden).some((t) => t.sport === 'MLB'), true, 'the markets left on stay');

const shared = buildSavedSharpGroups({
  sharpPositions: null,
  rawSharpPositions: raw,
  walletProfiles: profiles,
  portfolioShorts: ['aa11bb', 'bb22cc'],
  roster: [
    { walletShort: 'aa11bb', name: 'Kch' },
    { walletShort: 'bb22cc', name: 'Nash' },
  ],
  names: { aa11bb: 'Kch', bb22cc: 'Nash' },
  dateKey: null,
});
assert.equal(shared.together.some((t) => t.sport === 'NHL' && t.shared), true, 'two followed wallets on one side sit in Together');
assert.equal(shared.split.some((t) => t.sport === 'NHL'), false, 'a stranger on the other side does not make it a split');

const opposed = buildSavedSharpGroups({
  sharpPositions: null,
  rawSharpPositions: raw,
  walletProfiles: profiles,
  portfolioShorts: ['aa11bb', 'cc33dd'],
  roster: [
    { walletShort: 'aa11bb' },
    { walletShort: 'cc33dd' },
  ],
  dateKey: null,
});
assert.equal(opposed.split.some((t) => t.sport === 'NHL'), true, 'two followed wallets on opposite sides sit in Split');

console.log('testSavedSharpSlate: ok');
