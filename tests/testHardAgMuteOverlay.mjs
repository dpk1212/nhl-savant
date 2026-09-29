/**
 * HARD+ AG mute overlay (2026-09-25+ binary / 2026-09-29+ margin).
 * Last-step 0u when HARD AG is present and (binary) or margin ≤ 0 (margin era).
 * Usage: node tests/testHardAgMuteOverlay.mjs
 */
import assert from 'assert';
import {
  applyHardAgMuteOverlay,
  isHardAgMuteLive,
  isHardAgMarginLive,
  HARD_AG_MUTE_FROM,
  HARD_AG_MARGIN_FROM,
  HARD_AG_MUTED_BY,
} from '../src/lib/hardAgMuteOverlay.js';
import { isHardMarketWallet } from '../src/lib/marketSkillMuteOverlay.js';
import {
  applyHardMuteExceptionOverlay,
  HARD_EXCEPTION_MUTES,
  HARD_TWO_FOR_EXCEPTION_MUTES,
} from '../src/lib/hardMuteExceptionOverlay.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

function mute(args) {
  return applyHardAgMuteOverlay({ pickDate: '2026-09-25', ...args });
}

function muteMargin(args) {
  return applyHardAgMuteOverlay({ pickDate: '2026-09-29', ...args });
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
ok(HARD_AG_MARGIN_FROM === '2026-09-29', 'margin cutover date');
ok(isHardAgMarginLive('2026-09-29'), 'margin live on cutover');
ok(!isHardAgMarginLive('2026-09-28'), 'margin not live 09-28');
ok(HARD_AG_MUTED_BY === 'hard-ag', 'mutedBy stamp');
ok(!HARD_EXCEPTION_MUTES.has('hard-ag'), 'HARD exception does not rescue this mute');
ok(!HARD_TWO_FOR_EXCEPTION_MUTES.has('hard-ag'), '2-for exception does not rescue hard-ag');
ok(isHardMarketWallet(pos(4, 62, 10)), 'HARD exact');

const hardProf = new Map([
  ['aaaaaa', prof('MLB', 'ML', pos(4, 62, 10))],
  ['bbbbbb', prof('MLB', 'ML', pos(20, 40, -10))],
  ['cccccc', prof('MLB', 'TOTAL', pos(8, 70, 25))],
  ['dddddd', prof('MLB', 'ML', pos(10, 70, 20))],
  ['eeeeee', prof('MLB', 'ML', pos(8, 66, 14))],
  ['totfor2', prof('MLB', 'TOTAL', pos(5, 63, 11))],
  ['totag', prof('MLB', 'TOTAL', pos(6, 64, 12))],
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
  ok(r.action === 'MUTE' && r.units === 0, '1-1 both-sides HARD still mutes (binary)');
}

{
  const r = mute({
    units: 4,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { wallet: 'dddddd', side: 'home', invested: 80 },
      { wallet: 'eeeeee', side: 'home', invested: 40 },
      { wallet: 'aaaaaa', side: 'away', invested: 20 },
    ],
    walletProfiles: hardProf,
  });
  ok(r.action === 'MUTE' && r.units === 0 && r.mutedBy === 'hard-ag',
    '2-1 still mutes on 09-25 binary');
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

{
  const r = muteMargin({
    units: 5,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { wallet: 'aaaaaa', side: 'away', invested: 80 },
    ],
    walletProfiles: hardProf,
  });
  ok(r.action === 'MUTE' && r.units === 0 && r.mutedBy === 'hard-ag', '0-1 still mutes on margin era');
  ok(r.hardForN === 0 && r.hardAgN === 1 && r.margin === -1, '0-1 stamps margin');
}

{
  const r = muteMargin({
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
  ok(r.action === 'MUTE' && r.units === 0 && r.mutedBy === 'hard-ag', '1-1 still mutes on margin era');
  ok(r.hardForN === 1 && r.hardAgN === 1 && r.margin === 0, '1-1 margin 0');
}

{
  const r = muteMargin({
    units: 6,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { wallet: 'dddddd', side: 'home', invested: 80 },
      { wallet: 'eeeeee', side: 'home', invested: 40 },
      { wallet: 'aaaaaa', side: 'away', invested: 20 },
    ],
    walletProfiles: hardProf,
  });
  ok(r.action === 'HOLD' && r.units === 6 && r.mutedBy == null, '2-1 HOLD on margin era');
  ok(r.reason === 'hard_margin_plus', '2-1 reason is margin plus');
  ok(r.hardForN === 2 && r.hardAgN === 1 && r.margin === 1, '2-1 stamps +1');
}

{
  const r = muteMargin({
    units: 3,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { wallet: 'dddddd', side: 'home', invested: 80 },
      { wallet: 'aaaaaa', side: 'away', invested: 20 },
      { wallet: 'eeeeee', side: 'away', invested: 40 },
    ],
    walletProfiles: hardProf,
  });
  ok(r.action === 'MUTE' && r.units === 0, '1-2 still mutes (behind)');
  ok(r.margin === -1, '1-2 margin -1');
}

{
  const r = muteMargin({
    units: 2.5,
    marketType: 'TOTAL',
    sport: 'MLB',
    side: 'over',
    walletDetails: [
      { wallet: 'cccccc', side: 'over', invested: 95 },
      { wallet: 'totfor2', side: 'over', invested: 40 },
      { wallet: 'totag', side: 'under', invested: 20 },
    ],
    walletProfiles: hardProf,
  });
  ok(r.action === 'HOLD' && r.units === 2.5, 'S/T 2-1 HOLD on margin era');
  ok(r.hardForN === 2 && r.hardAgN === 1 && r.margin === 1, 'S/T 2-1 margin');
}

{
  const rescued = applyHardMuteExceptionOverlay({
    units: 0,
    mutedBy: 'steam-tail',
    unitsPreMute: 2.5,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { wallet: 'dddddd', side: 'home', invested: 50 },
      { wallet: 'eeeeee', side: 'home', invested: 40 },
      { wallet: 'aaaaaa', side: 'away', invested: 50 },
    ],
    walletProfiles: hardProf,
    pickDate: '2026-09-29',
  });
  ok(rescued.action === 'RESCUE' && rescued.units === 3, '2-for rescues 2-1 steam-tail on 09-29');
  ok(rescued.rescuedBy === 'hard-2for-hold' && rescued.margin === 1, '2-1 2-for margin +1');
  const remute = muteMargin({
    units: rescued.units,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { wallet: 'dddddd', side: 'home', invested: 50 },
      { wallet: 'eeeeee', side: 'home', invested: 40 },
      { wallet: 'aaaaaa', side: 'away', invested: 50 },
    ],
    walletProfiles: hardProf,
  });
  ok(remute.action === 'HOLD' && remute.units === 3, 'AG mute HOLDs a rescued 2-1');
}

{
  const remute = muteMargin({
    units: 2.5,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { wallet: 'dddddd', side: 'home', invested: 50 },
      { wallet: 'aaaaaa', side: 'away', invested: 50 },
    ],
    walletProfiles: hardProf,
  });
  ok(remute.action === 'MUTE' && remute.units === 0, 'AG mute still remutes 1-1 on 09-29');
}

console.log(`testHardAgMuteOverlay: ${n} passed`);
