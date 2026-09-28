/**
 * HARD mute-exception overlay (2026-09-24+ / 2026-09-28+ 2-for).
 * Last-step HOLD: restore uPre when last mute is tape/maxsr/fools/crowded
 * and a HARD FOR wallet backs the side. tape-weak S/T stays muted at 1 HARD.
 * 2026-09-28+: 2 unique HARD+ FOR / 0 HARD+ AG restores steam-tail and
 * leftover at max(uPre, 3) capped 4u.
 * Usage: node tests/testHardMuteExceptionOverlay.mjs
 */
import assert from 'assert';
import {
  applyHardMuteExceptionOverlay,
  lastAppliedMute,
  isHardMuteExceptionLive,
  isHardTwoForExceptionLive,
  isHardExceptionRescueStamp,
  twoHardForRestoreUnits,
  HARD_MUTE_EXCEPTION_FROM,
  HARD_MUTE_EXCEPTION_RESCUED_BY,
  HARD_EXCEPTION_MUTES,
  HARD_TWO_FOR_EXCEPTION_FROM,
  HARD_TWO_FOR_RESCUED_BY,
  HARD_TWO_FOR_EXCEPTION_MUTES,
  HARD_TWO_FOR_FLOOR_U,
  HARD_TWO_FOR_CAP_U,
} from '../src/lib/hardMuteExceptionOverlay.js';
import {
  isHardMarketWallet,
  countHardMarketSides,
} from '../src/lib/marketSkillMuteOverlay.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

function hold(args) {
  return applyHardMuteExceptionOverlay({ pickDate: '2026-09-24', ...args });
}

function pos(nBets, wr, dollarRoi = null) {
  return { n: nBets, wr, dollarRoi };
}

function prof(sport, market, positions) {
  return {
    bySport: {
      [sport]: {
        byMarket: {
          [market]: { positions },
        },
      },
    },
  };
}

const hardProf = new Map([
  ['aaaaaa', prof('MLB', 'ML', pos(4, 62, 10))],
  ['bbbbbb', prof('MLB', 'ML', pos(20, 40, -10))],
]);

ok(isHardMuteExceptionLive('2026-09-24'), 'live on cutover');
ok(!isHardMuteExceptionLive('2026-09-23'), 'not live before cutover');
ok(HARD_MUTE_EXCEPTION_FROM === '2026-09-24', 'cutover date');
ok(HARD_EXCEPTION_MUTES.has('tape-weak')
  && HARD_EXCEPTION_MUTES.has('maxsr-sub4')
  && HARD_EXCEPTION_MUTES.has('fools-gold-flat')
  && HARD_EXCEPTION_MUTES.has('top-crowded'), 'four mutes');
ok(!HARD_EXCEPTION_MUTES.has('steam-tail'), 'T not excepted at 1 HARD');
ok(!HARD_EXCEPTION_MUTES.has('believed-cut'), 'leftover not excepted at 1 HARD');
ok(HARD_TWO_FOR_EXCEPTION_MUTES.has('steam-tail')
  && HARD_TWO_FOR_EXCEPTION_MUTES.has('believed-cut')
  && HARD_TWO_FOR_EXCEPTION_MUTES.has('fail-open-sub4')
  && HARD_TWO_FOR_EXCEPTION_MUTES.has('st-fat')
  && HARD_TWO_FOR_EXCEPTION_MUTES.has('tape-weak'), '2-for mute set');
ok(!HARD_TWO_FOR_EXCEPTION_MUTES.has('ev-drift-edge'), 'ev-drift not excepted');
ok(!HARD_TWO_FOR_EXCEPTION_MUTES.has('fav-juice'), 'fav-juice not excepted');
ok(isHardTwoForExceptionLive('2026-09-28'), '2-for live on cutover');
ok(!isHardTwoForExceptionLive('2026-09-27'), '2-for not live before');
ok(HARD_TWO_FOR_EXCEPTION_FROM === '2026-09-28', '2-for cutover date');
ok(isHardExceptionRescueStamp(HARD_MUTE_EXCEPTION_RESCUED_BY)
  && isHardExceptionRescueStamp(HARD_TWO_FOR_RESCUED_BY), 'rescue stamps');
ok(twoHardForRestoreUnits(1) === HARD_TWO_FOR_FLOOR_U, 'floor 3 on 1u');
ok(twoHardForRestoreUnits(2.5) === 3, 'floor 3 on 2.5u');
ok(twoHardForRestoreUnits(3.5) === 3.5, 'keep mid 3.5');
ok(twoHardForRestoreUnits(5.4) === HARD_TWO_FOR_CAP_U, 'cap 4 on fat');
ok(isHardMarketWallet(pos(4, 62, 10)), 'HARD exact');

{
  const last = lastAppliedMute([
    { mutedBy: 'steam-tail', action: 'MUTE', units: 0, unitsPrePolicy: 2.5 },
    { mutedBy: 'tape-weak', action: 'MUTE', units: 0, unitsPrePolicy: 2.5 },
  ]);
  ok(last.mutedBy === 'steam-tail' && last.unitsPre === 2.5, 'last mute wins leftover/T');
}
{
  const last = lastAppliedMute([
    { action: 'HOLD', units: 0, unitsPrePolicy: 2.5 },
    { mutedBy: 'maxsr-sub4', action: 'MUTE', units: 0, unitsPrePolicy: 1.5 },
  ]);
  ok(last.mutedBy === 'maxsr-sub4', 'skips HOLD overlays with no mutedBy');
}

{
  const r = hold({
    units: 2.5,
    mutedBy: 'tape-weak',
    unitsPreMute: 2.5,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [{ side: 'home', walletShort: 'aaaaaa', invested: 1000 }],
    walletProfiles: hardProf,
  });
  ok(r.action === 'PASS' && r.units === 2.5, 'already live is no-op');
}

{
  const r = applyHardMuteExceptionOverlay({
    pickDate: '2026-09-23',
    units: 0,
    mutedBy: 'tape-weak',
    unitsPreMute: 2.5,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [{ side: 'home', walletShort: 'aaaaaa', invested: 1000 }],
    walletProfiles: hardProf,
  });
  ok(r.action === 'EXEMPT' && r.units === 0, 'pre-cutover stays muted');
}

{
  const r = hold({
    units: 0,
    mutedBy: 'steam-tail',
    unitsPreMute: 2.5,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [{ side: 'home', walletShort: 'aaaaaa', invested: 1000 }],
    walletProfiles: hardProf,
  });
  ok(r.action === 'EXEMPT' && r.reason === 'mute_not_excepted' && r.units === 0,
    'T HARD does not rescue');
}

{
  const r = hold({
    units: 0,
    mutedBy: 'believed-cut',
    unitsPreMute: 2.5,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [{ side: 'home', walletShort: 'aaaaaa', invested: 1000 }],
    walletProfiles: hardProf,
  });
  ok(r.action === 'EXEMPT' && r.units === 0, 'leftover HARD does not rescue');
}

{
  const r = hold({
    units: 0,
    mutedBy: 'tape-weak',
    unitsPreMute: 1.5,
    marketType: 'TOTAL',
    sport: 'MLB',
    side: 'over',
    walletDetails: [{ side: 'over', walletShort: 'aaaaaa', invested: 1000 }],
    walletProfiles: new Map([['aaaaaa', prof('MLB', 'TOTAL', pos(12, 67, 21))]]),
  });
  ok(r.action === 'EXEMPT' && r.reason === 'tape_st_cut' && r.units === 0,
    'tape-weak S/T HARD stays muted');
}

{
  const r = hold({
    units: 0,
    mutedBy: 'tape-weak',
    unitsPreMute: 1.5,
    marketType: 'SPREAD',
    sport: 'MLB',
    side: 'home',
    walletDetails: [{ side: 'home', walletShort: 'aaaaaa', invested: 1000 }],
    walletProfiles: new Map([['aaaaaa', prof('MLB', 'SPREAD', pos(4, 100, 33))]]),
  });
  ok(r.action === 'EXEMPT' && r.reason === 'tape_st_cut', 'tape-weak SPREAD cut');
}

{
  const r = hold({
    units: 0,
    mutedBy: 'tape-weak',
    unitsPreMute: 2.5,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [{ side: 'home', walletShort: 'aaaaaa', invested: 1000 }],
    walletProfiles: hardProf,
  });
  ok(r.action === 'RESCUE' && r.units === 2.5, 'tape-weak ML HARD restores uPre');
  ok(r.mutedBy == null, 'rescue clears mutedBy');
  ok(r.rescuedBy === HARD_MUTE_EXCEPTION_RESCUED_BY, 'rescuedBy stamp');
  ok(r.rescuedFrom === 'tape-weak', 'rescuedFrom tape-weak');
}

{
  const r = hold({
    units: 0,
    mutedBy: 'maxsr-sub4',
    unitsPreMute: 1.5,
    marketType: 'SPREAD',
    sport: 'MLB',
    side: 'away',
    walletDetails: [{ side: 'away', walletShort: 'cccccc', invested: 200 }],
    walletProfiles: new Map([['cccccc', prof('MLB', 'SPREAD', pos(4, 100, 33))]]),
  });
  ok(r.action === 'RESCUE' && r.units === 1.5, 'maxsr S/T HARD restores');
}

{
  const r = hold({
    units: 0,
    mutedBy: 'maxsr-sub4',
    unitsPreMute: 2.5,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [{ side: 'home', walletShort: 'aaaaaa', invested: 1000 }],
    walletProfiles: hardProf,
  });
  ok(r.action === 'RESCUE' && r.units === 2.5, 'maxsr ML HARD included (variance)');
}

{
  const r = hold({
    units: 0,
    mutedBy: 'fools-gold-flat',
    unitsPreMute: 1.5,
    marketType: 'SPREAD',
    sport: 'MLB',
    side: 'away',
    walletDetails: [{ side: 'away', walletShort: 'cccccc', invested: 166 }],
    walletProfiles: new Map([['cccccc', prof('MLB', 'SPREAD', pos(4, 100, 33))]]),
  });
  ok(r.action === 'RESCUE' && r.units === 1.5, 'fools FLAT+HARD restores');
}

{
  const r = hold({
    units: 0,
    mutedBy: 'top-crowded',
    unitsPreMute: 1.5,
    marketType: 'SPREAD',
    sport: 'MLB',
    side: 'home',
    walletDetails: [{ side: 'home', walletShort: 'dddddd', invested: 500 }],
    walletProfiles: new Map([['dddddd', prof('MLB', 'SPREAD', pos(93, 64.5, 29))]]),
  });
  ok(r.action === 'RESCUE' && r.units === 1.5, 'crowded HARD restores');
}

{
  const r = hold({
    units: 0,
    mutedBy: 'tape-weak',
    unitsPreMute: 2.5,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [{ side: 'home', walletShort: 'bbbbbb', invested: 5000 }],
    walletProfiles: hardProf,
  });
  ok(r.action === 'HOLD_MUTE' && r.units === 0, 'no HARD FOR stays muted');
}

{
  const r = hold({
    units: 0,
    mutedBy: 'tape-weak',
    unitsPreMute: 2.5,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { side: 'away', walletShort: 'aaaaaa', invested: 8000 },
      { side: 'home', walletShort: 'bbbbbb', invested: 500 },
    ],
    walletProfiles: hardProf,
  });
  ok(r.action === 'HOLD_MUTE' && r.units === 0, 'HARD on AG does not rescue');
}

{
  const r = hold({
    units: 0,
    mutedBy: 'maxsr-sub4',
    unitsPreMute: 1.5,
    marketType: 'TOTAL',
    sport: 'MLB',
    side: 'under',
    walletDetails: [{ side: 'under', walletShort: 'zzzzzz', invested: 100 }],
    walletProfiles: new Map([['zzzzzz', { bySport: { MLB: { picks: { n: 10 } } } }]]),
  });
  ok(r.action === 'EXEMPT' && r.reason === 'schema_missing' && r.units === 0,
    'schema missing fail-open keeps mute');
}

{
  const r = hold({
    units: 0,
    mutedBy: 'fools-gold-flat',
    unitsPreMute: 1.5,
    marketType: 'TOTAL',
    sport: 'CFB',
    side: 'under',
    walletDetails: [
      { side: 'under', walletShort: 'flat01', invested: 2600 },
      { side: 'under', walletShort: 'hard01', invested: 215 },
    ],
    walletProfiles: new Map([
      ['flat01', prof('CFB', 'TOTAL', pos(1, 100, 117))],
      ['hard01', prof('CFB', 'TOTAL', pos(12, 66.7, 21.1))],
    ]),
  });
  ok(r.action === 'RESCUE' && r.units === 1.5, 'HARD can be a second FOR, not best A-FOR');
}

{
  const r = hold({
    units: 0,
    mutedBy: 'maxsr-sub4',
    unitsPreMute: 1.5,
    marketType: 'TOTAL',
    sport: 'MLB',
    side: 'over',
    walletDetails: [{ side: 'over', walletShort: 'aaaaaa', invested: 100 }],
    walletProfiles: new Map([['aaaaaa', prof('MLB', 'TOTAL', pos(4, 62, 9.9))]]),
  });
  ok(r.action === 'HOLD_MUTE', 'HARD $ROI 9.9 does not rescue');
}

function twoHold(args) {
  return applyHardMuteExceptionOverlay({ pickDate: '2026-09-28', ...args });
}

const twoHardProf = new Map([
  ['aaaaaa', prof('MLB', 'ML', pos(4, 62, 10))],
  ['cccccc', prof('MLB', 'ML', pos(12, 70, 20))],
  ['aghard', prof('MLB', 'ML', pos(8, 65, 15))],
  ['tot01', prof('MLB', 'TOTAL', pos(12, 67, 21))],
  ['tot02', prof('MLB', 'TOTAL', pos(8, 80, 18))],
]);

{
  const counted = countHardMarketSides(
    [
      { side: 'home', walletShort: 'aaaaaa', invested: 1000 },
      { side: 'home', walletShort: 'aaaaaa', invested: 400 },
      { side: 'home', walletShort: 'cccccc', invested: 200 },
    ],
    'home', 'MLB', 'ML', twoHardProf,
  );
  ok(counted.judged && counted.hardForN === 2 && counted.hardAgN === 0,
    'unique shorts count as two HARD FOR');
}
{
  const counted = countHardMarketSides(
    [
      { side: 'home', walletShort: 'aaaaaa', invested: 1000 },
      { side: 'home', walletShort: 'aaaaaa', invested: 900 },
    ],
    'home', 'MLB', 'ML', twoHardProf,
  );
  ok(counted.judged && counted.hardForN === 1, 'duplicate listing is one wallet');
}

{
  const r = twoHold({
    units: 0,
    mutedBy: 'steam-tail',
    unitsPreMute: 1,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { side: 'home', walletShort: 'aaaaaa', invested: 1000 },
      { side: 'home', walletShort: 'cccccc', invested: 200 },
    ],
    walletProfiles: twoHardProf,
  });
  ok(r.action === 'RESCUE' && r.units === 3, '2 HARD steam-tail floors 1u → 3u');
  ok(r.rescuedBy === HARD_TWO_FOR_RESCUED_BY, '2-for rescuedBy');
  ok(r.reason === 'hard_2for_hold', '2-for reason');
  ok(r.rescuedFrom === 'steam-tail', 'rescuedFrom steam-tail');
  ok(r.hardN === 2 && r.hardAgN === 0, 'unique 2 FOR 0 AG');
}

{
  const r = twoHold({
    units: 0,
    mutedBy: 'steam-tail',
    unitsPreMute: 2.5,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { side: 'home', walletShort: 'aaaaaa', invested: 1000 },
      { side: 'home', walletShort: 'cccccc', invested: 200 },
    ],
    walletProfiles: twoHardProf,
  });
  ok(r.action === 'RESCUE' && r.units === 3, '2 HARD steam-tail floors 2.5u → 3u');
}

{
  const r = twoHold({
    units: 0,
    mutedBy: 'steam-tail',
    unitsPreMute: 3.5,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { side: 'home', walletShort: 'aaaaaa', invested: 1000 },
      { side: 'home', walletShort: 'cccccc', invested: 200 },
    ],
    walletProfiles: twoHardProf,
  });
  ok(r.action === 'RESCUE' && r.units === 3.5, 'mid 3.5u kept');
}

{
  const r = twoHold({
    units: 0,
    mutedBy: 'steam-tail',
    unitsPreMute: 5.4,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { side: 'home', walletShort: 'aaaaaa', invested: 1000 },
      { side: 'home', walletShort: 'cccccc', invested: 200 },
    ],
    walletProfiles: twoHardProf,
  });
  ok(r.action === 'RESCUE' && r.units === 4, 'fat 5.4u capped at 4');
}

{
  const r = twoHold({
    units: 0,
    mutedBy: 'steam-tail',
    unitsPreMute: 2.5,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { side: 'home', walletShort: 'aaaaaa', invested: 1000 },
      { side: 'home', walletShort: 'aaaaaa', invested: 400 },
    ],
    walletProfiles: twoHardProf,
  });
  ok(r.action === 'EXEMPT' && r.reason === 'mute_not_excepted' && r.units === 0,
    'duplicate HARD listing is not 2 FOR');
}

{
  const r = twoHold({
    units: 0,
    mutedBy: 'steam-tail',
    unitsPreMute: 2.5,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { side: 'home', walletShort: 'aaaaaa', invested: 1000 },
      { side: 'home', walletShort: 'cccccc', invested: 200 },
      { side: 'away', walletShort: 'aghard', invested: 800 },
    ],
    walletProfiles: twoHardProf,
  });
  ok(r.action === 'HOLD_MUTE' && r.reason === 'hard_ag' && r.units === 0,
    '2 HARD FOR + HARD AG stays muted');
}

{
  const r = twoHold({
    units: 0,
    mutedBy: 'steam-tail',
    unitsPreMute: 2.5,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [{ side: 'home', walletShort: 'aaaaaa', invested: 1000 }],
    walletProfiles: twoHardProf,
  });
  ok(r.action === 'EXEMPT' && r.reason === 'mute_not_excepted' && r.units === 0,
    '1 HARD steam-tail still muted');
}

{
  const r = applyHardMuteExceptionOverlay({
    pickDate: '2026-09-27',
    units: 0,
    mutedBy: 'steam-tail',
    unitsPreMute: 2.5,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { side: 'home', walletShort: 'aaaaaa', invested: 1000 },
      { side: 'home', walletShort: 'cccccc', invested: 200 },
    ],
    walletProfiles: twoHardProf,
  });
  ok(r.action === 'EXEMPT' && r.units === 0, '2-for not live 09-27');
}

{
  const r = twoHold({
    units: 0,
    mutedBy: 'believed-cut',
    unitsPreMute: 1,
    marketType: 'SPREAD',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { side: 'home', walletShort: 'aaaaaa', invested: 1000 },
      { side: 'home', walletShort: 'cccccc', invested: 200 },
    ],
    walletProfiles: new Map([
      ['aaaaaa', prof('MLB', 'SPREAD', pos(4, 62, 10))],
      ['cccccc', prof('MLB', 'SPREAD', pos(12, 70, 20))],
    ]),
  });
  ok(r.action === 'RESCUE' && r.units === 3, 'leftover 2 HARD S/T floors to 3');
}

{
  const r = twoHold({
    units: 0,
    mutedBy: 'st-fat',
    unitsPreMute: 4,
    marketType: 'TOTAL',
    sport: 'MLB',
    side: 'under',
    walletDetails: [
      { side: 'under', walletShort: 'tot01', invested: 500 },
      { side: 'under', walletShort: 'tot02', invested: 300 },
    ],
    walletProfiles: twoHardProf,
  });
  ok(r.action === 'RESCUE' && r.units === 4, 'st-fat 2 HARD restores 4u');
}

{
  const r = twoHold({
    units: 0,
    mutedBy: 'tape-weak',
    unitsPreMute: 1.5,
    marketType: 'TOTAL',
    sport: 'MLB',
    side: 'over',
    walletDetails: [
      { side: 'over', walletShort: 'tot01', invested: 500 },
      { side: 'over', walletShort: 'tot02', invested: 300 },
    ],
    walletProfiles: twoHardProf,
  });
  ok(r.action === 'RESCUE' && r.units === 3,
    'tape-weak S/T 2 HARD / 0 AG now restores (floor 3)');
}

{
  const r = twoHold({
    units: 0,
    mutedBy: 'tape-weak',
    unitsPreMute: 1.5,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { side: 'home', walletShort: 'aaaaaa', invested: 1000 },
      { side: 'home', walletShort: 'cccccc', invested: 200 },
    ],
    walletProfiles: twoHardProf,
  });
  ok(r.action === 'RESCUE' && r.units === 3 && r.rescuedBy === HARD_TWO_FOR_RESCUED_BY,
    '2 HARD tape-weak ML upgrades 1.5u → 3u');
}

{
  const r = twoHold({
    units: 0,
    mutedBy: 'ev-drift-edge',
    unitsPreMute: 5.4,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { side: 'home', walletShort: 'aaaaaa', invested: 1000 },
      { side: 'home', walletShort: 'cccccc', invested: 200 },
    ],
    walletProfiles: twoHardProf,
  });
  ok(r.action === 'EXEMPT' && r.units === 0, 'ev-drift stays muted');
}

{
  const r = twoHold({
    units: 0,
    mutedBy: 'fav-juice',
    unitsPreMute: 5.4,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { side: 'home', walletShort: 'aaaaaa', invested: 1000 },
      { side: 'home', walletShort: 'cccccc', invested: 200 },
    ],
    walletProfiles: twoHardProf,
  });
  ok(r.action === 'EXEMPT' && r.units === 0, 'fav-juice stays muted');
}

{
  const r = twoHold({
    units: 0,
    mutedBy: 'fail-open-sub4',
    unitsPreMute: 1,
    marketType: 'SPREAD',
    sport: 'MLB',
    side: 'away',
    walletDetails: [
      { side: 'away', walletShort: 'aaaaaa', invested: 200 },
      { side: 'away', walletShort: 'cccccc', invested: 150 },
    ],
    walletProfiles: new Map([
      ['aaaaaa', prof('MLB', 'SPREAD', pos(4, 62, 10))],
      ['cccccc', prof('MLB', 'SPREAD', pos(12, 70, 20))],
    ]),
  });
  ok(r.action === 'RESCUE' && r.units === 3, 'fail-open-sub4 2 HARD floors to 3');
}

console.log(`ok ${n}`);
