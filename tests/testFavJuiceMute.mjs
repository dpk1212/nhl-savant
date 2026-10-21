/**
 * Heavy-favorite mute (2026-09-05+).
 * Last publish mute after all sizing when american odds are juicier than -425.
 * HOLD identity otherwise. Does not resize, repath, or touch oddsCap.
 * Usage: node tests/testFavJuiceMute.mjs
 */
import assert from 'assert';
import {
  applyFavJuiceMuteOverlay,
  applyFavJuiceLastPublish,
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
ok(FAV_JUICE_MUTE_THR === -425, 'threshold');

// ── MUTE: juicier than -425 ──────────────────────────────────────────────
{
  const r = mute({ units: 2, odds: -426 });
  ok(r.action === 'MUTE' && r.units === 0, '-426 2u → mute');
  ok(r.mutedBy === FAV_JUICE_MUTED_BY, 'fav-juice stamp');
  ok(r.unitsPrePolicy === 2, 'preserves pre units');
  ok(r.reason === 'fav_juice_lt_-425', 'reason');
}
{
  const r = mute({ units: 5.4, odds: -1567 });
  ok(r.action === 'MUTE' && r.units === 0, 'Miami-style -1567 5.4u → mute');
  ok(r.unitsPrePolicy === 5.4, '5.4u pre identity');
}
// ── HOLD: -425 and shorter juice, plus-money, missing odds ───────────────
function holdExact(args, expectU, msg) {
  const r = mute(args);
  ok(r.units === expectU, `${msg} units ${r.units} === ${expectU}`);
  ok(r.action === 'HOLD' || r.action === 'EXEMPT', `${msg} action ${r.action}`);
  ok(r.mutedBy == null, `${msg} no mutedBy`);
}

holdExact({ units: 3, odds: -425 }, 3, '-425 is the cap, not muted');
holdExact({ units: 3, odds: -400 }, 3, '-400 is inside the raised cap');
holdExact({ units: 3, odds: -424 }, 3, '-424 HOLD');
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

// ── Last publish: press / TRUST / PRESS-M cannot punch through ───────────
{
  const early = mute({ units: 2, odds: -450 });
  ok(early.action === 'MUTE' && early.units === 0, 'early chain mute zeros the long fav');
  const pressRestake = applyFavJuiceLastPublish({
    units: 3,
    odds: -450,
    pickDate: '2026-10-20',
    priorPolicy: early,
  });
  ok(pressRestake.muted === true && pressRestake.units === 0, 'PRESS 3u @ -450 does not lock');
  ok(pressRestake.policy?.mutedBy === FAV_JUICE_MUTED_BY, 'last publish stamps fav-juice');
  ok(pressRestake.policy?.unitsPrePolicy === 3, 'preserves the press units as pre');
}
{
  const trustG = applyFavJuiceLastPublish({
    units: 4,
    odds: -1567,
    pickDate: '2026-10-20',
    priorPolicy: null,
  });
  ok(trustG.muted && trustG.units === 0, 'TRUST-G 4u @ -1567 does not lock');
}
{
  const pressM = applyFavJuiceLastPublish({
    units: 1,
    odds: -426,
    pickDate: '2026-10-20',
  });
  ok(pressM.muted && pressM.units === 0, 'PRESS-M 1u @ -426 does not lock');
}
{
  const keep = applyFavJuiceLastPublish({
    units: 3,
    odds: -150,
    pickDate: '2026-10-20',
    priorPolicy: { action: 'HOLD', mutedBy: null },
  });
  ok(keep.muted === false && keep.units === 3, '-150 PRESS stake is under the cap');
  ok(keep.policy?.action === 'HOLD', 'keeps prior HOLD, does not invent a mute');
}
{
  const prior = mute({ units: 2, odds: -500 });
  const alreadyZero = applyFavJuiceLastPublish({
    units: 0,
    odds: -500,
    pickDate: '2026-10-20',
    priorPolicy: prior,
  });
  ok(alreadyZero.muted === false && alreadyZero.units === 0, 'already 0u is not a new mute');
  ok(alreadyZero.policy === prior, 'keeps the earlier MUTE stamp');
}
{
  const preCutover = applyFavJuiceLastPublish({
    units: 3,
    odds: -500,
    pickDate: '2026-09-04',
  });
  ok(preCutover.muted === false && preCutover.units === 3, 'pre-cutover press stake is not rewritten');
}

console.log(`OK — ${n} assertions`);
