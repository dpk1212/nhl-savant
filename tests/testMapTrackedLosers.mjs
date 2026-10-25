/**
 * Clarity map — pin up to 3 tracked losers (display-only).
 * Run: node tests/testMapTrackedLosers.mjs
 */
import {
  isTrackedLoserRow,
  planTrackedLosersForMap,
  MAP_TRACKED_LOSER_CAP,
} from '../src/lib/boardMoneySplits.js';
import { profileIsTrusted } from '../src/lib/walletTrustStatus.js';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

// Thin stamp (C/F only) + raw losers → add up to 3
{
  const mapRows = [
    { short: 'eeabaf', invested: 7595, whitelist: 'CONFIRMED' },
  ];
  const walletRows = [
    { wallet: '0xeeabaf', invested: 7595, whitelist: 'CONFIRMED', verdict: null, marketSide: 'home' },
    { wallet: '0xcd2f63', invested: 7414, whitelist: null, verdict: 'MIXED_PICKS_GOOD_$_BAD', marketSide: 'away' },
    { wallet: '0x7d395d', invested: 705, whitelist: null, verdict: 'CONFIRMED_BLEEDER', marketSide: 'away' },
    { wallet: '0xa24815', invested: 459, whitelist: null, verdict: 'POSITIONS_ONLY_NEGATIVE', marketSide: 'home' },
    { wallet: '0xbbbbbb', invested: 300, whitelist: 'WR50', verdict: null, marketSide: 'away' },
  ];
  assert(isTrackedLoserRow(walletRows[1]), 'null tier is loser');
  assert(isTrackedLoserRow(walletRows[2]), 'bleeder is loser');
  assert(!isTrackedLoserRow(walletRows[0]), 'CONFIRMED non-bleeder is not loser');

  const { keepShorts, addRaw } = planTrackedLosersForMap(mapRows, walletRows);
  assert(keepShorts.has('eeabaf'), 'proven kept');
  assert(addRaw.length === MAP_TRACKED_LOSER_CAP, `add ${MAP_TRACKED_LOSER_CAP} losers, got ${addRaw.length}`);
  assert(addRaw[0].wallet === 'cd2f63', 'largest loser first');
  assert(addRaw.map((r) => r.wallet).join(',') === 'cd2f63,7d395d,a24815', 'top 3 by $');
}

// Stamp already has 3 losers → no extras, 4th raw loser not added
{
  const mapRows = [
    { short: 'eeabaf', invested: 7595 },
    { short: 'cd2f63', invested: 7414 },
    { short: '7d395d', invested: 705 },
    { short: 'a24815', invested: 459 },
  ];
  const walletRows = [
    { wallet: 'eeabaf', invested: 7595, whitelist: 'CONFIRMED', verdict: null, marketSide: 'home' },
    { wallet: 'cd2f63', invested: 7414, whitelist: null, verdict: null, marketSide: 'away' },
    { wallet: '7d395d', invested: 705, whitelist: null, verdict: 'CONFIRMED_BLEEDER', marketSide: 'away' },
    { wallet: 'a24815', invested: 459, whitelist: null, verdict: 'POSITIONS_ONLY_NEGATIVE', marketSide: 'home' },
    { wallet: 'bbbbbb', invested: 300, whitelist: 'WR50', verdict: null, marketSide: 'away' },
  ];
  const { keepShorts, addRaw } = planTrackedLosersForMap(mapRows, walletRows);
  assert(addRaw.length === 0, 'no extras when 3 losers already on map');
  assert(keepShorts.has('cd2f63') && keepShorts.has('7d395d') && keepShorts.has('a24815'), 'top 3 losers kept');
  assert(!keepShorts.has('bbbbbb'), '4th loser not kept');
}

// ML map must not adopt a spread bleeder's dollars.
{
  const mapRows = [
    { short: 'ba8492', invested: 3749, whitelist: 'CONFIRMED' },
  ];
  const walletRows = [
    { wallet: 'fcc12b', invested: 231211, whitelist: 'CONFIRMED', verdict: 'CONFIRMED_BLEEDER', marketSide: 'away', sourceMkt: 'SPREAD' },
    { wallet: 'loser1', invested: 800, whitelist: null, verdict: null, marketSide: 'away', sourceMkt: 'ML' },
  ];
  const ml = planTrackedLosersForMap(mapRows, walletRows, { sourceMkt: 'ML' });
  assert(ml.addRaw.length === 1 && ml.addRaw[0].wallet === 'loser1', 'spread dollars stay off the ML map');
  const sp = planTrackedLosersForMap(mapRows, walletRows, { sourceMkt: 'SPREAD' });
  assert(sp.addRaw.length === 1 && sp.addRaw[0].wallet === 'fcc12b', 'same bet still pins on the spread card');
}

// WR50 tier-4 wallets stay, and they do not eat the 3 loser slots.
{
  const mapRows = [
    { short: 'd780f4', invested: 2240, trusted: true },
    { short: 'caca29', invested: 4302, trusted: true },
    { short: 'ab4b6e', invested: 49000 },
    { short: 'bfe3bc', invested: 10763 },
    { short: '7923c4', invested: 6755 },
    { short: '0cd77e', invested: 5058 },
  ];
  const walletRows = mapRows.map((w) => ({
    wallet: w.short,
    invested: w.invested,
    whitelist: 'WR50',
    verdict: null,
    marketSide: 'away',
  }));
  const { keepShorts } = planTrackedLosersForMap(mapRows, walletRows);
  assert(keepShorts.has('d780f4') && keepShorts.has('caca29'), 'tier-4 wallets stay on the chart');
  assert(keepShorts.has('ab4b6e') && keepShorts.has('bfe3bc') && keepShorts.has('7923c4'), 'top 3 dollar losers still pin');
  assert(!keepShorts.has('0cd77e'), 'the next WR50 wallet is still capped');
}

{
  const spreadFive = {
    bySport: {
      NBA: {
        trust: { tier: 3, status: 'STABLE_ON' },
        byMarket: { SPREAD: { trust: { tier: 5, status: 'STABLE_ON' } } },
      },
    },
  };
  const unproven = {
    bySport: { NBA: { trust: { tier: 0, status: 'UNPROVEN' }, byMarket: { SPREAD: { trust: { tier: 0, status: 'UNPROVEN' } } } } },
  };
  assert(profileIsTrusted(spreadFive, 'NBA', 'SPREAD'), 'spread tier 5 counts when the sport book is tier 3');
  assert(!profileIsTrusted(unproven, 'NBA', 'SPREAD'), 'unproven is not tier 4+');
}

console.log('testMapTrackedLosers: ok');
