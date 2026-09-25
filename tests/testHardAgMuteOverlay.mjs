/**
 * HARD+ AG mute overlay (2026-09-25+).
 * Last-step 0u when a HARD wallet is on the other side.
 * Usage: node tests/testHardAgMuteOverlay.mjs
 */
import assert from 'assert';
import {
  applyHardAgMuteOverlay,
  isHardAgMuteLive,
  HARD_AG_MUTE_FROM,
  HARD_AG_MUTED_BY,
} from '../src/lib/hardAgMuteOverlay.js';
import { isHardMarketWallet } from '../src/lib/marketSkillMuteOverlay.js';
import {
  applyHardMuteExceptionOverlay,
  HARD_EXCEPTION_MUTES,
} from '../src/lib/hardMuteExceptionOverlay.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

function mute(args) {
  return applyHardAgMuteOverlay({ pickDate: '2026-09-25', ...args });
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

ok(isHardAgMuteLive('2026-09-25'), 'live on cutover');
ok(!isHardAgMuteLive('2026-09-24'), 'not live before cutover');
ok(HARD_AG_MUTE_FROM === '2026-09-25', 'cutover date');
ok(HARD_AG_MUTED_BY === 'hard-ag', 'mutedBy stamp');
ok(!HARD_EXCEPTION_MUTES.has('hard-ag'), 'HARD exception does not rescue this mute');
ok(isHardMarketWallet(pos(4, 62, 10)), 'HARD exact');

const hardProf = new Map([
  ['aaaaaa', prof('MLB', 'ML', pos(4, 62, 10))],
  ['bbbbbb', prof('MLB', 'ML', pos(20, 40, -10))],
  ['cccccc', prof('MLB', 'TOTAL', pos(8, 70, 25))],
  ['dddddd', prof('MLB', 'ML', pos(10, 70, 20))],
]);

{
  const r = mute({
    units: 5,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { wallet: 'aaaaaa', side: 'away', invested: 80 },
      { wallet: 'bbbbbb', side: 'home', invested: 40 },
    ],
    walletProfiles: hardProf,
  });
  ok(r.action === 'MUTE' && r.units === 0 && r.mutedBy === 'hard-ag', 'HARD AG mutes');
  ok(r.unitsPrePolicy === 5 && r.reason === 'hard_ag_against', 'keeps pre units');
  ok(r.hardAgN === 1, 'counts HARD AG');
}

{
  const r = mute({
    units: 5,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { wallet: 'aaaaaa', side: 'home', invested: 80 },
      { wallet: 'bbbbbb', side: 'away', invested: 40 },
    ],
    walletProfiles: hardProf,
  });
  ok(r.action === 'HOLD' && r.units === 5 && r.mutedBy == null, 'HARD FOR only holds');
  ok(r.hardAgN === 0, 'no HARD AG');
}

{
  const r = mute({
    units: 4,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { wallet: 'dddddd', side: 'home', invested: 80 },
      { wallet: 'aaaaaa', side: 'away', invested: 20 },
    ],
    walletProfiles: hardProf,
  });
  ok(r.action === 'MUTE' && r.units === 0, 'both-sides HARD still mutes');
}

{
  const r = mute({
    units: 3,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { wallet: 'bbbbbb', side: 'away', invested: 90 },
    ],
    walletProfiles: hardProf,
  });
  ok(r.action === 'HOLD' && r.units === 3, 'soft AG does not mute');
}

{
  const r = mute({
    units: 2.5,
    marketType: 'TOTAL',
    sport: 'MLB',
    side: 'over',
    walletDetails: [
      { wallet: 'cccccc', side: 'under', invested: 95 },
    ],
    walletProfiles: hardProf,
  });
  ok(r.action === 'MUTE' && r.mutedBy === 'hard-ag', 'S/T HARD AG mutes');
}

{
  const r = applyHardAgMuteOverlay({
    units: 5,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [{ wallet: 'aaaaaa', side: 'away', invested: 80 }],
    walletProfiles: hardProf,
    pickDate: '2026-09-24',
  });
  ok(r.action === 'EXEMPT' && r.units === 5, 'pre-cutover exempt');
}

{
  const r = mute({
    units: 5,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [{ wallet: 'aaaaaa', side: 'away', invested: 80 }],
    walletProfiles: null,
  });
  ok(r.action === 'HOLD' && r.units === 5 && r.reason === 'schema_missing', 'fail-open no profiles');
}

{
  const r = mute({
    units: 5,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [{ wallet: 'zzzzzz', side: 'away', invested: 80 }],
    walletProfiles: new Map([['zzzzzz', { bySport: { MLB: { whitelistTier: 'CONFIRMED' } } }]]),
  });
  ok(r.action === 'HOLD' && r.units === 5 && r.reason === 'schema_missing', 'fail-open no byMarket');
}

{
  const r = mute({
    units: 0,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [{ wallet: 'aaaaaa', side: 'away', invested: 80 }],
    walletProfiles: hardProf,
  });
  ok(r.action === 'PASS' && r.units === 0, 'already 0u is a no-op');
}

{
  const r = mute({
    units: 5.4,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [{ wallet: 'aaaaaa', side: 'away', invested: 80 }],
    walletProfiles: hardProf,
  });
  ok(r.action === 'MUTE' && r.units === 0 && r.unitsPrePolicy === 5.4, '4u+ not exempt');
}

{
  const rescued = applyHardMuteExceptionOverlay({
    units: 0,
    mutedBy: 'tape-weak',
    unitsPreMute: 2.5,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { wallet: 'dddddd', side: 'home', invested: 50 },
      { wallet: 'aaaaaa', side: 'away', invested: 50 },
    ],
    walletProfiles: hardProf,
    pickDate: '2026-09-24',
  });
  ok(rescued.action === 'RESCUE' && rescued.units === 2.5, 'exception still rescues HARD FOR');
  const remute = mute({
    units: rescued.units,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { wallet: 'dddddd', side: 'home', invested: 50 },
      { wallet: 'aaaaaa', side: 'away', invested: 50 },
    ],
    walletProfiles: hardProf,
  });
  ok(remute.action === 'MUTE' && remute.units === 0, 'HARD AG remutes a rescued both-sides ticket');
}

{
  const r = mute({
    units: 3,
    marketType: 'PROP',
    sport: 'MLB',
    side: 'home',
    walletDetails: [{ wallet: 'aaaaaa', side: 'away', invested: 80 }],
    walletProfiles: hardProf,
  });
  ok(r.action === 'EXEMPT' && r.units === 3, 'non ML/S/T exempt');
}

console.log(`testHardAgMuteOverlay: ${n} passed`);
