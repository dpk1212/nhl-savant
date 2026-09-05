/**
 * Heavy-favorite mute (2026-09-05+).
 * Last publish mute after all sizing when american odds are juicier than -375.
 * HOLD identity otherwise. Does not resize, repath, or touch oddsCap.
 * Usage: node tests/testFavJuiceMute.mjs
 */
import assert from 'assert';
import {
  applyFavJuiceMuteOverlay,
  applyNoConfirmedMuteOverlay,
  isFavJuiceMuteLive,
  FAV_JUICE_MUTE_FROM,
  FAV_JUICE_MUTE_THR,
  FAV_JUICE_MUTED_BY,
} from '../src/lib/walletClvSkill.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

function mute(args) {
  return applyFavJuiceMuteOverlay({ pickDate: '2026-09-05', ...args });
}

ok(isFavJuiceMuteLive('2026-09-05'), 'live on cutover');
ok(!isFavJuiceMuteLive('2026-09-04'), 'not live before cutover');
ok(FAV_JUICE_MUTE_FROM === '2026-09-05', 'cutover date');
ok(FAV_JUICE_MUTE_THR === -375, 'threshold');

// ── MUTE: juicier than -375 ──────────────────────────────────────────────
{
  const r = mute({ units: 2, odds: -376 });
  ok(r.action === 'MUTE' && r.units === 0, '-376 2u → mute');
  ok(r.mutedBy === FAV_JUICE_MUTED_BY, 'fav-juice stamp');
  ok(r.unitsPrePolicy === 2, 'preserves pre units');
  ok(r.reason === 'fav_juice_lt_-375', 'reason');
}
{
  const r = mute({ units: 5.4, odds: -1567 });
  ok(r.action === 'MUTE' && r.units === 0, 'Miami-style -1567 5.4u → mute');
  ok(r.unitsPrePolicy === 5.4, '5.4u pre identity');
}
{
  const r = mute({ units: 3, odds: -400 });
  ok(r.action === 'MUTE' && r.units === 0, '-400 3u → mute');
}

// ── HOLD: -375 and shorter juice, plus-money, missing odds ───────────────
function holdExact(args, expectU, msg) {
  const r = mute(args);
  ok(r.units === expectU, `${msg} units ${r.units} === ${expectU}`);
  ok(r.action === 'HOLD' || r.action === 'EXEMPT', `${msg} action ${r.action}`);
  ok(r.mutedBy == null, `${msg} no mutedBy`);
}

holdExact({ units: 3, odds: -375 }, 3, '-375 is the cap, not muted');
holdExact({ units: 3, odds: -374 }, 3, '-374 HOLD');
holdExact({ units: 5.4, odds: -110 }, 5.4, 'small fav HOLD exact units');
holdExact({ units: 2, odds: 120 }, 2, 'plus-money dog HOLD — oddsCap is a different dial');
holdExact({ units: 2.03, odds: 250 }, 2.03, 'long dog HOLD — do not steal dog oddsCap');
{
  const r = mute({ units: 3, odds: null });
  ok(r.action === 'HOLD' && r.units === 3 && r.reason === 'odds_missing', 'missing odds fail-open');
}
{
  const r = mute({ units: 3, odds: 'juice' });
  ok(r.action === 'HOLD' && r.units === 3 && r.reason === 'odds_missing', 'non-finite odds fail-open');
}

{
  const r = applyFavJuiceMuteOverlay({
    units: 3, odds: -500, pickDate: '2026-09-04',
  });
  ok(r.action === 'EXEMPT' && r.units === 3, 'pre-cutover does not rewrite history');
}
{
  const r = mute({ units: 0, odds: -500 });
  ok(r.action === 'PASS' && r.units === 0, 'already 0u stays PASS');
}

// ── Pipeline: no-CONFIRMED HOLD, then fav-juice can still mute ───────────
{
  const afterNc = applyNoConfirmedMuteOverlay({
    units: 2, nConfirmed: 1, pickDate: '2026-09-05',
  });
  ok(afterNc.units === 2 && afterNc.action === 'HOLD', 'CONFIRMED keeps 2u');
  const afterFav = applyFavJuiceMuteOverlay({
    units: afterNc.units, odds: -1567, pickDate: '2026-09-05',
  });
  ok(afterFav.action === 'MUTE' && afterFav.units === 0, 'fav-juice cuts after upstream HOLD');
}
{
  const afterNc = applyNoConfirmedMuteOverlay({
    units: 3, nConfirmed: 1, pickDate: '2026-09-05',
  });
  const afterFav = applyFavJuiceMuteOverlay({
    units: afterNc.units, odds: -200, pickDate: '2026-09-05',
  });
  ok(afterFav.units === 3 && afterFav.action === 'HOLD', 'normal favorite keeps exact units');
}

console.log(`OK — ${n} assertions`);
