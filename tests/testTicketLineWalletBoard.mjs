/**
 * Ticket-line board: Action-sized vault leg must not be overwritten
 * by another same-side alt. Force-include wallets stay on the card.
 * Usage: node tests/testTicketLineWalletBoard.mjs
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildIntelExcludedSet } from '../src/lib/intelExclusion.js';
import {
  vaultRowsOnTicket,
  collapseWalletRowsBySide,
  mapLockedPickToCardFixture,
} from '../src/components/sharpFlow/cards/mapPositionCard.js';

const WAPOL = '0xf7f0b0b1e9c0fe02ccad926916ee31aef74b912c';
const vault = [
  {
    wallet: WAPOL, side: 'away', entryLine: 1.5, avgPrice: 0.554,
    invested: 1022, avgSportBet: 425,
  },
  {
    wallet: WAPOL, side: 'away', entryLine: -1.5, avgPrice: 0.27,
    invested: 276, avgSportBet: 425,
  },
  {
    wallet: WAPOL, side: 'away', entryLine: 2.5, avgPrice: 0.67,
    invested: 9, avgSportBet: 425,
  },
  {
    wallet: '0xdc41c39b95453c943174f369926018f6963bdd7e',
    side: 'home', entryLine: -1.5, invested: 12371, avgSportBet: 1439,
  },
];

const onPlus15 = vaultRowsOnTicket(vault, {
  ticketLine: 1.5, sideNorm: 'away', isSpread: true,
});
const wapolPlus = onPlus15.find((r) => String(r.wallet).toLowerCase() === WAPOL);
assert.equal(wapolPlus?.invested, 1022, `ticket +1.5 must keep $1022 Action, got ${wapolPlus?.invested}`);
assert.equal(onPlus15.filter((r) => String(r.wallet).toLowerCase() === WAPOL).length, 1);
const against = onPlus15.find((r) => r.side === 'home');
assert.equal(against?.invested, 12371, 'against on +1.5 ticket is complementary home −1.5');

const collapsed = collapseWalletRowsBySide(vault.filter((p) => p.wallet === WAPOL));
assert.equal(collapsed.length, 1);
assert.equal(collapsed[0].invested, 1022, 'no-line snapshot fallback keeps the fattest away leg');

const excl = JSON.parse(readFileSync('public/sharp_intel_excluded_wallets.json', 'utf8'));
const force = JSON.parse(readFileSync('public/sharp_intel_force_include.json', 'utf8'));
assert.ok(
  force.wallets.some((w) => String(w.addr).toLowerCase() === WAPOL),
  'wapol is force-included (Action writes them)',
);
const synthetic = { excluded: [WAPOL, '0xdeadbeef'] };
const set = buildIntelExcludedSet(synthetic, force);
assert.equal(set.has(WAPOL), false, 'force-include wins even if MM list still names them');
assert.equal(set.has('0xdeadbeef'), true);
assert.equal(buildIntelExcludedSet(synthetic, null).has(WAPOL), true);
assert.ok(
  Array.isArray(excl.forceIncludeSkipped) && excl.forceIncludeSkipped.includes(WAPOL),
  'published excluded[] already skips force-include; helper must stay aligned',
);

const commence = Date.now() + (5 * 60 * 60 * 1000);
const fixture = mapLockedPickToCardFixture({
  key: '2026-08-14_MLB_stl_chc_spread:away',
  sport: 'MLB',
  gameKey: 'stl_chc',
  marketType: 'spread',
  side: 'away',
  pickSide: 'away',
  team: 'St. Louis Cardinals +1.5',
  line: 1.5,
  odds: -124,
  units: 0,
  gameTime: commence,
  lockedAt: commence - 8 * 3600_000,
  status: 'PENDING',
  away: 'St. Louis Cardinals',
  home: 'Chicago Cubs',
  vaultPositions: vault,
  backingWallets: vault.filter((p) => p.side === 'away').map((p) => ({
    wallet: p.wallet, side: p.side, invested: p.invested, avgSportBet: p.avgSportBet,
  })),
}, {
  isSportWinner: () => true,
  getWalletProfile: () => ({
    bySport: { MLB: { whitelistTier: 'CONFIRMED', picks: { n: 10, wr: 51 }, positions: { n: 20, wr: 51 } } },
    clvSkill: { pctPos: 67, n: 80 },
  }),
});

const ours = (fixture.mapWallets || []).filter((w) => w.side === 'ours' && w.short === '4b912c');
assert.equal(ours.length, 1, `one 4b912c on the +1.5 card, got ${ours.length}`);
assert.equal(ours[0].invested, 1022, `lead $ must be Action +1.5 $1022, got ${ours[0].invested}`);
assert.ok(!(fixture.mapWallets || []).some((w) => w.short === '4b912c' && w.invested === 276),
  'must not paint the −1.5 $276 leg as this ticket');

console.log('testTicketLineWalletBoard: ok');
