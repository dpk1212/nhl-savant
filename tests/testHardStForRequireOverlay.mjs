/**
 * S/T HARD+ FOR require overlay (2026-09-26+).
 * Last-step 0u on spreads/totals with no HARD wallet on our side.
 * 2026-10-04+: that HARD FOR must be ≥1.0× sport usual.
 * Usage: node tests/testHardStForRequireOverlay.mjs
 */
import assert from 'assert';
import {
  applyHardStForRequireOverlay,
  isHardStForRequireLive,
  HARD_ST_FOR_REQUIRE_FROM,
  HARD_ST_FOR_MUTED_BY,
  HARD_ST_FOR_FULL_FROM,
  HARD_ST_FOR_MIN_SR,
} from '../src/lib/hardStForRequireOverlay.js';
import { isHardMarketWallet, countHardMarketFor } from '../src/lib/marketSkillMuteOverlay.js';
import {
  applyHardMuteExceptionOverlay,
  HARD_EXCEPTION_MUTES,
  HARD_TWO_FOR_EXCEPTION_MUTES,
} from '../src/lib/hardMuteExceptionOverlay.js';
import { applyHardAgMuteOverlay } from '../src/lib/hardAgMuteOverlay.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

function mute(args) {
  return applyHardStForRequireOverlay({ pickDate: '2026-09-26', ...args });
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

ok(isHardStForRequireLive('2026-09-26'), 'live on cutover');
ok(!isHardStForRequireLive('2026-09-25'), 'not live before cutover');
ok(HARD_ST_FOR_REQUIRE_FROM === '2026-09-26', 'cutover date');
ok(HARD_ST_FOR_MUTED_BY === 'st-hard-for', 'mutedBy stamp');
ok(!HARD_EXCEPTION_MUTES.has('st-hard-for'), 'HARD exception does not rescue this mute');
ok(!HARD_TWO_FOR_EXCEPTION_MUTES.has('st-hard-for'), '2-for exception does not rescue st-hard-for');
ok(isHardMarketWallet(pos(4, 62, 10)), 'HARD exact');

const books = new Map([
  ['aaaaaa', prof('MLB', 'TOTAL', pos(4, 62, 10))],
  ['bbbbbb', prof('MLB', 'TOTAL', pos(20, 40, -10))],
  ['cccccc', prof('MLB', 'TOTAL', pos(8, 55, 4))],
  ['dddddd', prof('MLB', 'SPREAD', pos(10, 70, 20))],
  ['eeeeee', prof('MLB', 'ML', pos(10, 70, 20))],
  ['ffffff', prof('MLB', 'TOTAL', pos(12, 70, 25))],
]);

{
  const counted = countHardMarketFor(
    [{ wallet: 'aaaaaa', side: 'under', invested: 80 }],
    'under', 'MLB', 'TOTAL', books,
  );
  ok(counted.judged && counted.hardForN === 1, 'countHardMarketFor HARD FOR');
  const none = countHardMarketFor(
    [{ wallet: 'cccccc', side: 'under', invested: 80 }],
    'under', 'MLB', 'TOTAL', books,
  );
  ok(none.judged && none.hardForN === 0, 'countHardMarketFor no HARD FOR');
  const miss = countHardMarketFor(
    [{ wallet: 'zzzzzz', side: 'under', invested: 80 }],
    'under', 'MLB', 'TOTAL',
    new Map([['zzzzzz', { bySport: { MLB: { whitelistTier: 'CONFIRMED' } } }]]),
  );
  ok(miss.judged === false, 'countHardMarketFor fail-open without byMarket');
}

{
  const r = mute({
    units: 3,
    marketType: 'TOTAL',
    sport: 'MLB',
    side: 'under',
    walletDetails: [
      { wallet: 'cccccc', side: 'under', invested: 80 },
      { wallet: 'bbbbbb', side: 'over', invested: 40 },
    ],
    walletProfiles: books,
  });
  ok(r.action === 'MUTE' && r.units === 0 && r.mutedBy === 'st-hard-for', 'S/T no HARD FOR mutes');
  ok(r.unitsPrePolicy === 3 && r.reason === 'st_no_hard_for', 'keeps pre units');
  ok(r.hardForN === 0, 'counts no HARD FOR');
}

{
  const r = mute({
    units: 3,
    marketType: 'TOTAL',
    sport: 'MLB',
    side: 'under',
    walletDetails: [
      { wallet: 'aaaaaa', side: 'under', invested: 80 },
      { wallet: 'bbbbbb', side: 'over', invested: 40 },
    ],
    walletProfiles: books,
  });
  ok(r.action === 'HOLD' && r.units === 3 && r.mutedBy == null, 'HARD FOR holds');
  ok(r.hardForN === 1, 'counts HARD FOR');
}

{
  const r = mute({
    units: 5,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { wallet: 'eeeeee', side: 'away', invested: 80 },
    ],
    walletProfiles: books,
  });
  ok(r.action === 'EXEMPT' && r.units === 5, 'ML exempt even with no HARD FOR');
}

{
  const r = mute({
    units: 2.8,
    marketType: 'SPREAD',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { wallet: 'bbbbbb', side: 'home', invested: 90 },
    ],
    walletProfiles: books,
  });
  ok(r.action === 'MUTE' && r.mutedBy === 'st-hard-for', 'SPREAD no HARD FOR mutes');
}

{
  const r = mute({
    units: 2.8,
    marketType: 'SPREAD',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { wallet: 'dddddd', side: 'home', invested: 90 },
    ],
    walletProfiles: books,
  });
  ok(r.action === 'HOLD' && r.units === 2.8, 'SPREAD HARD FOR holds');
}

{
  const r = applyHardStForRequireOverlay({
    units: 4,
    marketType: 'TOTAL',
    sport: 'MLB',
    side: 'under',
    walletDetails: [{ wallet: 'cccccc', side: 'under', invested: 80 }],
    walletProfiles: books,
    pickDate: '2026-09-25',
  });
  ok(r.action === 'EXEMPT' && r.units === 4, 'pre-cutover exempt');
}

{
  const r = mute({
    units: 4,
    marketType: 'TOTAL',
    sport: 'MLB',
    side: 'under',
    walletDetails: [{ wallet: 'cccccc', side: 'under', invested: 80 }],
    walletProfiles: null,
  });
  ok(r.action === 'HOLD' && r.units === 4 && r.reason === 'schema_missing', 'fail-open no profiles');
}

{
  const r = mute({
    units: 4,
    marketType: 'TOTAL',
    sport: 'MLB',
    side: 'under',
    walletDetails: [{ wallet: 'zzzzzz', side: 'under', invested: 80 }],
    walletProfiles: new Map([['zzzzzz', { bySport: { MLB: { whitelistTier: 'CONFIRMED' } } }]]),
  });
  ok(r.action === 'HOLD' && r.units === 4 && r.reason === 'schema_missing', 'fail-open no byMarket');
}

{
  const r = mute({
    units: 0,
    marketType: 'TOTAL',
    sport: 'MLB',
    side: 'under',
    walletDetails: [{ wallet: 'cccccc', side: 'under', invested: 80 }],
    walletProfiles: books,
  });
  ok(r.action === 'PASS' && r.units === 0, 'already 0u is a no-op');
}

{
  const r = mute({
    units: 5.4,
    marketType: 'TOTAL',
    sport: 'MLB',
    side: 'under',
    walletDetails: [{ wallet: 'cccccc', side: 'under', invested: 80 }],
    walletProfiles: books,
  });
  ok(r.action === 'MUTE' && r.units === 0 && r.unitsPrePolicy === 5.4, '4u+ not exempt');
}

{
  const r = mute({
    units: 3,
    marketType: 'PROP',
    sport: 'MLB',
    side: 'under',
    walletDetails: [{ wallet: 'cccccc', side: 'under', invested: 80 }],
    walletProfiles: books,
  });
  ok(r.action === 'EXEMPT' && r.units === 3, 'non S/T exempt');
}

{
  const both = mute({
    units: 3,
    marketType: 'TOTAL',
    sport: 'MLB',
    side: 'under',
    walletDetails: [
      { wallet: 'aaaaaa', side: 'under', invested: 50 },
      { wallet: 'ffffff', side: 'over', invested: 50 },
    ],
    walletProfiles: books,
  });
  ok(both.action === 'HOLD' && both.units === 3, 'HARD FOR + HARD AG still has FOR — this overlay holds');
  const ag = applyHardAgMuteOverlay({
    units: both.units,
    marketType: 'TOTAL',
    sport: 'MLB',
    side: 'under',
    walletDetails: [
      { wallet: 'aaaaaa', side: 'under', invested: 50 },
      { wallet: 'ffffff', side: 'over', invested: 50 },
    ],
    walletProfiles: books,
    pickDate: '2026-09-26',
  });
  ok(ag.action === 'MUTE' && ag.units === 0, 'HARD+ AG still mutes both-sides');
}

{
  const rescued = applyHardMuteExceptionOverlay({
    units: 0,
    mutedBy: 'tape-weak',
    unitsPreMute: 2.5,
    marketType: 'TOTAL',
    sport: 'MLB',
    side: 'under',
    walletDetails: [
      { wallet: 'cccccc', side: 'under', invested: 80 },
    ],
    walletProfiles: books,
    pickDate: '2026-09-26',
  });
  ok(rescued.action !== 'RESCUE', 'exception does not invent HARD FOR on S/T tape-weak');
  const remute = mute({
    units: 2.5,
    marketType: 'TOTAL',
    sport: 'MLB',
    side: 'under',
    walletDetails: [
      { wallet: 'cccccc', side: 'under', invested: 80 },
    ],
    walletProfiles: books,
  });
  ok(remute.action === 'MUTE' && remute.units === 0, 'last-step remutes S/T with no HARD FOR');
}

ok(HARD_ST_FOR_FULL_FROM === '2026-10-04', 'S/T full-size cutover');
ok(HARD_ST_FOR_MIN_SR === 1.0, 'S/T require shares 1.0× bar');

function pressProf(sport, market, bookPos, usualN, usualInvested) {
  return {
    bySport: {
      [sport]: {
        positions: { n: usualN, invested: usualInvested },
        byMarket: {
          [market]: { positions: bookPos },
        },
      },
    },
  };
}

function muteFull(args) {
  return applyHardStForRequireOverlay({ pickDate: '2026-10-04', ...args });
}

{
  const r = muteFull({
    units: 3,
    marketType: 'TOTAL',
    sport: 'CFB',
    side: 'over',
    walletDetails: [{ wallet: 'light1', side: 'over', invested: 180 }],
    walletProfiles: new Map([
      ['light1', pressProf('CFB', 'TOTAL', pos(12, 67, 21), 10, 10000)],
    ]),
  });
  ok(r.action === 'MUTE' && r.units === 0 && r.mutedBy === 'st-hard-for',
    '0.18× HARD FOR remutes S/T');
  ok(r.reason === 'st_no_full_hard_for' && r.hardForN === 1 && r.fullN === 0,
    'light HARD is not full');
}

{
  const r = applyHardStForRequireOverlay({
    units: 3,
    marketType: 'TOTAL',
    sport: 'CFB',
    side: 'over',
    walletDetails: [{ wallet: 'light1', side: 'over', invested: 180 }],
    walletProfiles: new Map([
      ['light1', pressProf('CFB', 'TOTAL', pos(12, 67, 21), 10, 10000)],
    ]),
    pickDate: '2026-10-03',
  });
  ok(r.action === 'HOLD' && r.units === 3,
    'Oct 3 0.18× HARD FOR still holds (pre-gate)');
}

{
  const r = muteFull({
    units: 2.8,
    marketType: 'SPREAD',
    sport: 'CFB',
    side: 'home',
    walletDetails: [{ wallet: 'lean01', side: 'home', invested: 770 }],
    walletProfiles: new Map([
      ['lean01', pressProf('CFB', 'SPREAD', pos(10, 70, 20), 10, 10000)],
    ]),
  });
  ok(r.action === 'MUTE' && r.reason === 'st_no_full_hard_for' && r.units === 0,
    '0.77× lean HARD FOR remutes S/T');
}

{
  const r = muteFull({
    units: 3,
    marketType: 'TOTAL',
    sport: 'CFB',
    side: 'under',
    walletDetails: [{ wallet: 'full01', side: 'under', invested: 1000 }],
    walletProfiles: new Map([
      ['full01', pressProf('CFB', 'TOTAL', pos(4, 62, 10), 10, 10000)],
    ]),
  });
  ok(r.action === 'HOLD' && r.units === 3 && r.fullN === 1,
    '1.0× HARD FOR still holds S/T');
}

{
  const r = muteFull({
    units: 4,
    marketType: 'TOTAL',
    sport: 'CFB',
    side: 'under',
    walletDetails: [{ wallet: 'unknwn', side: 'under', invested: 5000 }],
    walletProfiles: new Map([
      ['unknwn', prof('CFB', 'TOTAL', pos(4, 62, 10))],
    ]),
  });
  ok(r.action === 'MUTE' && r.reason === 'st_no_full_hard_for' && r.units === 0,
    'unknown size is not full — remute S/T');
}

console.log(`testHardStForRequireOverlay: ${n} passed`);
