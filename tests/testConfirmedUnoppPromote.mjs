/**
 * CONFIRMED × size≥0.5 × unopposed-by-CONFIRMED promote gate.
 * Usage: node tests/testConfirmedUnoppPromote.mjs
 */
import assert from 'assert';
import {
  computeConfirmedUnoppSized,
  applyConfirmedUnoppUnitFloor,
  applyQConvMuteOverlay,
  isConfirmedUnoppPromoteLive,
  CONFIRMED_UNOPP_FROM,
  CONFIRMED_UNOPP_MIN_SIZE,
  CONFIRMED_UNOPP_UNITS,
  QCONV_MUTE_TIERS,
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

{
  // Sport-local usual beats model/v8 (Astros −1.5: card 0.7×, v8 0.24×).
  const m = profiles([['aaaaaa', 'MLB', 'CONFIRMED']]);
  m.get('aaaaaa').bySport.MLB.positions = { n: 6, invested: 7351 };
  const r = computeConfirmedUnoppSized(
    [{ wallet: 'aaaaaa', side: 'home', sizeRatio: 0.24, invested: 808 }],
    side, sport, m,
  );
  ok(r.qualifies === true, 'sport-local 0.66× qualifies even when v8 is 0.24');
  ok(r.bestSize >= 0.5 && r.bestSize < 0.8, `bestSize is sport-local (got ${r.bestSize})`);
}

{
  // Inverse: fat model size, light vs this sport's usual → fail.
  const m = profiles([['aaaaaa', 'MLB', 'CONFIRMED']]);
  m.get('aaaaaa').bySport.MLB.positions = { n: 5, invested: 10000 };
  const r = computeConfirmedUnoppSized(
    [{ wallet: 'aaaaaa', side: 'home', sizeRatio: 1.2, invested: 200 }],
    side, sport, m,
  );
  ok(r.qualifies === false, 'sport-local 0.1× fails even when model is 1.2');
}

ok(!QCONV_MUTE_TIERS.has('CONFIRMED-UNOPP'), 'UNOPP exempt from qConv mute');

const oddsCapFn = (u) => u;
{
  const wd = [{ wallet: 'aaaaaa', side: 'home', sizeRatio: 1.04 }];
  const unopp = computeConfirmedUnoppSized(
    wd, side, sport,
    profiles([['aaaaaa', 'MLB', 'CONFIRMED']]),
  );
  const fromZero = applyConfirmedUnoppUnitFloor({
    units: 0, odds: null, unoppResult: unopp, oddsCapFn,
  });
  ok(fromZero.floored === true, '0u after mute floors');
  ok(fromZero.units === CONFIRMED_UNOPP_UNITS, 'floors to 1u');
  ok(fromZero.tier === 'CONFIRMED-UNOPP', 'tier CONFIRMED-UNOPP');

  const livePath = applyConfirmedUnoppUnitFloor({
    units: 1, odds: null, unoppResult: unopp, oddsCapFn,
  });
  ok(livePath.floored === false && livePath.units === 1, 'does not upsize a live 1u path');

  const noQual = applyConfirmedUnoppUnitFloor({
    units: 0, odds: null, unoppResult: { qualifies: false }, oddsCapFn,
  });
  ok(noQual.floored === false && noQual.units === 0, 'no floor without qualify');
}

{
  const r = applyQConvMuteOverlay({
    units: 1,
    qConv: -17.4,
    thr: -0.29,
    tier: 'CONFIRMED-UNOPP',
    pickDate: '2026-08-16',
  });
  ok(r.action === 'EXEMPT' && r.units === 1, 'qConv does not mute UNOPP');
}

console.log(`OK — ${n} assertions`);
