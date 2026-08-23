/**
 * no-CONFIRMED mute (2026-08-23+).
 * Last-step 0u after all sizing when FOR has zero CONFIRMED wallets.
 * HOLD identity otherwise. Does not resize or repath.
 * Usage: node tests/testNoConfirmedMute.mjs
 */
import assert from 'assert';
import {
  applyNoConfirmedMuteOverlay,
  applyMaxSrSub4MuteOverlay,
  countConfirmedOnSide,
  isNoConfirmedMuteLive,
  NO_CONFIRMED_MUTE_FROM,
  NO_CONFIRMED_MUTED_BY,
} from '../src/lib/walletClvSkill.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

function mute(args) {
  return applyNoConfirmedMuteOverlay({ pickDate: '2026-08-23', ...args });
}

ok(isNoConfirmedMuteLive('2026-08-23'), 'live on cutover');
ok(!isNoConfirmedMuteLive('2026-08-22'), 'not live before cutover');
ok(NO_CONFIRMED_MUTE_FROM === '2026-08-23', 'cutover date');

// ── MUTE: no CONFIRMED on FOR ────────────────────────────────────────────
{
  const r = mute({ units: 3, nConfirmed: 0 });
  ok(r.action === 'MUTE' && r.units === 0, '3u nConfirmed 0 → mute');
  ok(r.mutedBy === NO_CONFIRMED_MUTED_BY, 'no-confirmed stamp');
  ok(r.unitsPrePolicy === 3, 'preserves pre units');
  ok(r.reason === 'no_confirmed_on_for', 'reason');
}
{
  const r = mute({ units: 5.4, nConfirmed: 0 });
  ok(r.action === 'MUTE' && r.units === 0, '4u+ also muted — not a unit fence');
}
{
  const r = mute({ units: 1, nConfirmed: 0 });
  ok(r.action === 'MUTE' && r.units === 0, '1u no CONFIRMED → mute');
}
{
  const r = mute({ units: 2.03, nConfirmed: null });
  ok(r.action === 'MUTE' && r.units === 0, 'null nConfirmed treated as 0 → mute');
}

// ── HOLD / EXEMPT: rest of the book (identity) ───────────────────────────
function holdExact(args, expectU, msg) {
  const r = mute(args);
  ok(r.units === expectU, `${msg} units ${r.units} === ${expectU}`);
  ok(r.action === 'HOLD' || r.action === 'EXEMPT', `${msg} action ${r.action}`);
  ok(r.mutedBy == null, `${msg} no mutedBy`);
}

holdExact({ units: 1, nConfirmed: 1 }, 1, '1 CONFIRMED HOLD');
holdExact({ units: 3, nConfirmed: 2 }, 3, '2 CONFIRMED HOLD');
holdExact({ units: 5.4, nConfirmed: 1 }, 5.4, 'exact unit identity on HOLD');
holdExact({ units: 2.03, nConfirmed: 4 }, 2.03, '4 CONFIRMED exact units');

{
  const r = applyNoConfirmedMuteOverlay({
    units: 3, nConfirmed: 0, pickDate: '2026-08-22',
  });
  ok(r.action === 'EXEMPT' && r.units === 3, 'pre-cutover does not rewrite history');
}
{
  const r = mute({ units: 0, nConfirmed: 0 });
  ok(r.action === 'PASS' && r.units === 0, 'already 0u stays PASS');
}

// ── countConfirmedOnSide helper ──────────────────────────────────────────
{
  const profiles = new Map([
    ['aaaaaa', { bySport: { MLB: { whitelistTier: 'CONFIRMED' } } }],
    ['bbbbbb', { bySport: { MLB: { whitelistTier: 'FLAT' } } }],
    ['cccccc', { bySport: { MLB: { whitelistTier: 'CONFIRMED' } } }],
    ['dddddd', { bySport: { MLB: { whitelistTier: 'WR50' } } }],
  ]);
  const wd = [
    { side: 'home', walletShort: 'aaaaaa' },
    { side: 'home', walletShort: 'bbbbbb' },
    { side: 'away', walletShort: 'cccccc' },
    { side: 'home', walletShort: 'dddddd' },
  ];
  ok(countConfirmedOnSide(wd, 'home', 'MLB', profiles) === 1, 'CONFIRMED on home counts');
  ok(countConfirmedOnSide(wd, 'away', 'MLB', profiles) === 1, 'CONFIRMED on away counts');
  ok(countConfirmedOnSide(wd, 'home', 'WNBA', profiles) === 0, 'wrong sport does not count');
}
{
  const profiles = new Map([
    ['aaaaaa', { bySport: { MLB: { whitelistTier: 'CONFIRMED' } } }],
  ]);
  const wd = [
    { side: 'home', direction: 'FOR', walletShort: 'aaaaaa' },
    { side: 'home', direction: 'AG', walletShort: 'aaaaaa' },
  ];
  ok(countConfirmedOnSide(wd, 'home', 'MLB', profiles) === 1, 'AG direction excluded, FOR counted once');
}
{
  const profiles = new Map([
    ['aaaaaa', { bySport: { MLB: { whitelistTier: 'CONFIRMED' } } }],
  ]);
  const wd = { a: { side: 'over', wallet: '0xaaaaaa' }, b: { side: 'over', wallet: '0xaaaaaa' } };
  ok(countConfirmedOnSide(wd, 'over', 'MLB', profiles) === 1, 'object map + last-6 dedupe');
}
{
  ok(countConfirmedOnSide([], 'home', 'MLB', new Map()) === 0, 'empty details → 0');
  ok(countConfirmedOnSide(null, 'home', 'MLB', new Map()) === 0, 'null details → 0');
  ok(countConfirmedOnSide([{ side: 'home', walletShort: 'aaaaaa' }], 'home', 'MLB', null) === 0, 'missing profiles → 0');
}
{
  // Thin / young CONFIRMED still counts — no size-skill gate
  const profiles = new Map([
    ['aaaaaa', { bySport: { MLB: { whitelistTier: 'CONFIRMED', picks: { n: 2 } } } }],
  ]);
  const wd = [{ side: 'home', walletShort: 'aaaaaa', sizeRatio: 0.2 }];
  ok(countConfirmedOnSide(wd, 'home', 'MLB', profiles) === 1, 'thin CONFIRMED still counts');
}

// ── Pipeline: maxSR HOLD, then no-CONFIRMED can still mute ───────────────
{
  const afterSr = applyMaxSrSub4MuteOverlay({
    units: 3, maxSR: 1.31, pickDate: '2026-08-23',
  });
  ok(afterSr.units === 3 && afterSr.action === 'HOLD', 'maxSR HOLD 3u');
  const afterNc = applyNoConfirmedMuteOverlay({
    units: afterSr.units, nConfirmed: 0, pickDate: '2026-08-23',
  });
  ok(afterNc.action === 'MUTE' && afterNc.units === 0, 'no-CONFIRMED cuts after maxSR HOLD');
}
{
  const afterSr = applyMaxSrSub4MuteOverlay({
    units: 3, maxSR: 1.31, pickDate: '2026-08-23',
  });
  const afterNc = applyNoConfirmedMuteOverlay({
    units: afterSr.units, nConfirmed: 1, pickDate: '2026-08-23',
  });
  ok(afterNc.units === 3 && afterNc.action === 'HOLD', 'CONFIRMED on FOR keeps exact units');
}
{
  const afterSr = applyMaxSrSub4MuteOverlay({
    units: 1, maxSR: 0.35, pickDate: '2026-08-23',
  });
  ok(afterSr.action === 'MUTE' && afterSr.units === 0, 'maxSR already 0');
  const afterNc = applyNoConfirmedMuteOverlay({
    units: afterSr.units, nConfirmed: 0, pickDate: '2026-08-23',
  });
  ok(afterNc.action === 'PASS' && afterNc.units === 0, 'no-CONFIRMED PASS on already 0');
}

console.log(`OK — ${n} assertions`);
