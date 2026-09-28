/**
 * Wallet-map specialist copy + HARD+ sport×market flag.
 * Usage: node tests/testSelectedWalletHeadline.mjs
 */
import assert from 'assert';
import {
  isMarketSpecialistPress,
  selectedWalletHeadline,
  walletIsHardMarket,
} from '../src/lib/marketSpecialistDisplay.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

ok(selectedWalletHeadline(null) === 'No wallets on the board', 'empty board');
ok(
  selectedWalletHeadline(
    { hardMarket: true, proven: true, displaySizeRatio: 1.6 },
    { sizeHot: true },
  ) === 'Market specialist sized up',
  'HARD+ press headline',
);
ok(
  selectedWalletHeadline(
    { hardMarket: true, proven: true, displaySizeRatio: 1.0 },
    { sizeHot: false, isBiggest: true },
  ) === 'Market specialist on this market',
  'HARD+ not pressed still named specialist',
);
ok(
  selectedWalletHeadline(
    { hardMarket: true, proven: true, displaySizeRatio: 2, side: 'against' },
    { againstSel: true, sizeHot: true },
  ) === 'Market specialist sized up — other side',
  'HARD+ AG press',
);
ok(
  selectedWalletHeadline(
    { proven: true, displaySizeRatio: 1.6, topQ: true },
    { selectedTopQ: true, sizeHot: true, isBiggest: true },
  ) === 'One of our best on price — and betting above their usual',
  'topQ press without HARD+ keeps price copy',
);
ok(
  selectedWalletHeadline(
    { proven: true, displaySizeRatio: 1.0 },
    { isBiggest: true },
  ) === 'This is the lead wallet on this play',
  'proven lead without HARD+',
);
ok(
  !isMarketSpecialistPress({ hardMarket: true, sizeRatio: 1.49 }),
  '1.49× is not press',
);
ok(
  isMarketSpecialistPress({ hardMarket: true, displaySizeRatio: 1.5 }),
  '1.5× is press',
);

function pos(nBets, wr, dollarRoi) {
  return { n: nBets, wr, dollarRoi };
}
function prof(sport, market, bookPos) {
  return {
    bySport: {
      [sport]: {
        byMarket: { [market]: { positions: bookPos } },
      },
    },
  };
}

ok(walletIsHardMarket(prof('MLB', 'SPREAD', pos(4, 62, 10)), 'MLB', 'SPREAD'), 'HARD exact');
ok(!walletIsHardMarket(prof('MLB', 'SPREAD', pos(4, 61, 10)), 'MLB', 'SPREAD'), 'WR 61 fails');
ok(!walletIsHardMarket(prof('MLB', 'ML', pos(12, 70, 20)), 'MLB', 'SPREAD'), 'wrong market');
ok(!walletIsHardMarket(prof('MLB', 'SPREAD', pos(4, 62, 10)), 'MLB', null), 'missing marketType');

console.log(`ok ${n}`);
