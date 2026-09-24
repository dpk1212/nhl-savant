/**
 * HARD mute-exception overlay (2026-09-24+).
 * Last-step HOLD: restore uPre when last mute is tape/maxsr/fools/crowded
 * and a HARD FOR wallet backs the side. tape-weak S/T stays muted.
 * Usage: node tests/testHardMuteExceptionOverlay.mjs
 */
import assert from 'assert';
import {
  applyHardMuteExceptionOverlay,
  lastAppliedMute,
  isHardMuteExceptionLive,
  HARD_MUTE_EXCEPTION_FROM,
  HARD_MUTE_EXCEPTION_RESCUED_BY,
  HARD_EXCEPTION_MUTES,
} from '../src/lib/hardMuteExceptionOverlay.js';
import { isHardMarketWallet } from '../src/lib/marketSkillMuteOverlay.js';

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
ok(!HARD_EXCEPTION_MUTES.has('steam-tail'), 'T not excepted');
ok(!HARD_EXCEPTION_MUTES.has('believed-cut'), 'leftover not excepted');
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

console.log(`ok ${n}`);
