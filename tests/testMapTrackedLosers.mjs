/**
 * Clarity map — pin up to 3 tracked losers (display-only).
 * Run: node tests/testMapTrackedLosers.mjs
 */
import {
  isTrackedLoserRow,
  planTrackedLosersForMap,
  MAP_TRACKED_LOSER_CAP,
} from '../src/lib/boardMoneySplits.js';

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

console.log('testMapTrackedLosers: ok');
