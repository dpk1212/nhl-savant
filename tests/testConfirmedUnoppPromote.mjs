/**
 * CONFIRMED × size≥0.5 × unopposed-by-CONFIRMED promote gate.
 * Usage: node tests/testConfirmedUnoppPromote.mjs
 */
import assert from 'assert';
import {
  computeConfirmedUnoppSized,
  isConfirmedUnoppPromoteLive,
  CONFIRMED_UNOPP_FROM,
  CONFIRMED_UNOPP_MIN_SIZE,
  CONFIRMED_UNOPP_UNITS,
} from '../src/lib/walletClvSkill.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

ok(CONFIRMED_UNOPP_FROM === '2026-08-08', 'cutover date');
ok(CONFIRMED_UNOPP_MIN_SIZE === 0.5, 'min size');
ok(CONFIRMED_UNOPP_UNITS === 1, 'promote units');
ok(isConfirmedUnoppPromoteLive('2026-08-08'), 'live on cutover');
ok(!isConfirmedUnoppPromoteLive('2026-08-07'), 'not live before cutover');

function profiles(entries) {
  // entries: [[shortId, sport, tier], ...]
  const m = new Map();
  for (const [id, sport, tier] of entries) {
    const key = String(id).toLowerCase();
    if (!m.has(key)) m.set(key, { bySport: {} });
    m.get(key).bySport[sport] = { whitelistTier: tier };
  }
  return m;
}

const sport = 'MLB';
const side = 'home';

{
  const wd = [
    { wallet: 'aaaaaa', side: 'home', sizeRatio: 1.2 },
  ];
  const r = computeConfirmedUnoppSized(
    wd, side, sport,
    profiles([['aaaaaa', 'MLB', 'CONFIRMED']]),
  );
  ok(r.qualifies === true, 'sized CONFIRMED FOR + no AG → qualifies');
  ok(r.forSized === 1 && r.agConfirmed === 0, 'counts');
  ok(r.bestSize === 1.2, 'bestSize');
  ok(r.wallets.includes('aaaaaa'), 'wallet listed');
}

{
  const wd = [
    { wallet: 'aaaaaa', side: 'home', sizeRatio: 1.2 },
    { wallet: 'bbbbbb', side: 'away', sizeRatio: 0.2 },
  ];
  const r = computeConfirmedUnoppSized(
    wd, side, sport,
    profiles([
      ['aaaaaa', 'MLB', 'CONFIRMED'],
      ['bbbbbb', 'MLB', 'CONFIRMED'],
    ]),
  );
  ok(r.qualifies === false, 'any CONFIRMED AG → fail');
  ok(r.agConfirmed === 1, 'ag counted regardless of size');
}

{
  const wd = [
    { wallet: 'aaaaaa', side: 'home', sizeRatio: 0.49 },
  ];
  const r = computeConfirmedUnoppSized(
    wd, side, sport,
    profiles([['aaaaaa', 'MLB', 'CONFIRMED']]),
  );
  ok(r.qualifies === false, 'size 0.49 → fail');
  ok(r.forSized === 0, 'undersized not counted as forSized');
}

{
  const wd = [
    { wallet: 'aaaaaa', side: 'home', sizeRatio: 2.0 },
  ];
  const r = computeConfirmedUnoppSized(
    wd, side, sport,
    profiles([['aaaaaa', 'MLB', 'FLAT']]),
  );
  ok(r.qualifies === false, 'FLAT-only FOR → fail');
}

{
  const wd = [
    { wallet: 'aaaaaa', side: 'home', sizeRatio: 0.5 },
    { wallet: 'cccccc', side: 'away', sizeRatio: 3.0 },
  ];
  const r = computeConfirmedUnoppSized(
    wd, side, sport,
    profiles([
      ['aaaaaa', 'MLB', 'CONFIRMED'],
      ['cccccc', 'MLB', 'FLAT'],
    ]),
  );
  ok(r.qualifies === true, 'FLAT on AG does not oppose');
}

{
  const r = computeConfirmedUnoppSized(null, side, sport, profiles([]));
  ok(r.qualifies === false, 'empty/null fail-open false');
}

console.log(`OK — ${n} assertions`);
