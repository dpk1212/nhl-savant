/**
 * Sharp Intel My Sharps slate.
 * A followed wallet's unproven sport still lands on the slate.
 * Usage: node tests/testSavedSharpSlate.mjs
 */
import assert from 'node:assert/strict';
import { buildSavedSharpGroups } from '../src/lib/savedSharpSlate.js';
import { buildGradedPlays } from '../src/lib/mySharpsDesk.js';

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

const graded = buildGradedPlays([
  { walletShort: 'aa11bb', sport: 'NHL', gameKey: 'uta_edm', marketType: 'ML', side: 'home', team: 'Oilers', away: 'Utah', home: 'Oilers', date: '2026-10-14', won: 1, dollarPnl: 2100, invested: 8000, odds: -115, sizeRatio: 3.1 },
  { walletShort: 'bb22cc', sport: 'NHL', gameKey: 'uta_edm', marketType: 'ML', side: 'home', team: 'Oilers', away: 'Utah', home: 'Oilers', date: '2026-10-14', won: 1, dollarPnl: 400, invested: 2000, odds: 104, sizeRatio: 2.1 },
  { walletShort: 'aa11bb', sport: 'NHL', gameKey: 'sea_lak', marketType: 'TOTAL', side: 'over', line: 6.5, date: '2026-10-13', won: 0, dollarPnl: -900, invested: 900, odds: -110, sizeRatio: 1.1 },
], { names: { aa11bb: 'Bands' }, roster: [] });
assert.equal(graded.plays.length, 2);
assert.equal(graded.plays[0].pick, 'Oilers');
assert.equal(graded.plays[0].n, 2);
assert.equal(graded.plays[0].pnl, 2500);
assert.equal(graded.plays[0].won, true);
assert.equal(graded.wins, 1);
assert.equal(graded.losses, 1);
assert.equal(graded.pnl, 1600);

const hiddenGrade = buildGradedPlays([
  { walletShort: 'aa11bb', sport: 'NHL', gameKey: 'uta_edm', marketType: 'ML', side: 'home', team: 'Oilers', date: '2026-10-14', won: 1, dollarPnl: 100, invested: 500 },
], {
  roster: [{ walletShort: 'aa11bb', betsOff: ['NHL|ML'] }],
});
assert.equal(hiddenGrade.n, 0);

console.log('testSavedSharpSlate: ok');
