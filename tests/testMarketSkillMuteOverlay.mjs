/**
 * Market-skill mute overlay (2026-09-24+).
 * Last-step 0u after no-CONFIRMED. Does not resize, repath, or hide
 * wallets from v12. Fail-open when the sport×market book is missing.
 * Usage: node tests/testMarketSkillMuteOverlay.mjs
 */
import assert from 'assert';
import {
  applyNoConfirmedMuteOverlay,
  applyMaxSrSub4MuteOverlay,
} from '../src/lib/walletClvSkill.js';
import { applyStFatMuteOverlay } from '../src/lib/stFatMuteOverlay.js';
import {
  applyMarketSkillMuteOverlay,
  isMarketSkillMuteLive,
  isMarketQualified,
  isHardMarketWallet,
  isMlSkillWallet,
  MARKET_SKILL_MUTE_FROM,
  ML_MKT_SKILL_MUTED_BY,
  ST_QUAL_WIPE_MUTED_BY,
  ST_HARD_SLIP_MUTED_BY,
  ML_SKILL_MIN_N,
  ML_SKILL_MIN_WR,
  ST_HARD_MIN_WR,
  ST_HARD_MIN_DOLLAR_ROI,
} from '../src/lib/marketSkillMuteOverlay.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

function mute(args) {
  return applyMarketSkillMuteOverlay({ pickDate: '2026-09-24', ...args });
}

function pos(nBets, wr, dollarRoi = null, positionFlatRoi = null) {
  return { n: nBets, wr, dollarRoi, positionFlatRoi };
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

ok(isMarketSkillMuteLive('2026-09-24'), 'live on cutover');
ok(!isMarketSkillMuteLive('2026-09-23'), 'not live before cutover');
ok(MARKET_SKILL_MUTE_FROM === '2026-09-24', 'cutover date');
ok(ML_SKILL_MIN_N === 6 && ML_SKILL_MIN_WR === 52, 'ML bar n6 / WR52');
ok(ST_HARD_MIN_WR === 62 && ST_HARD_MIN_DOLLAR_ROI === 10, 'HARD bar 62 / $10');

ok(isMarketQualified(pos(4, 50, null, null)), 'qual WR50 n4');
ok(isMarketQualified(pos(4, 49, 0.1, null)), 'qual dollar >0');
ok(isMarketQualified(pos(4, 49, null, 0.1)), 'qual flat >0');
ok(!isMarketQualified(pos(3, 80, 20, 20)), 'qual n<4 fails');
ok(!isMarketQualified(pos(4, 49, 0, 0)), 'qual all non-positive fails');
ok(isHardMarketWallet(pos(4, 62, 10)), 'HARD exact');
ok(!isHardMarketWallet(pos(4, 62, 9.9)), 'HARD $ROI 9.9 fails');
ok(!isHardMarketWallet(pos(4, 61, 10)), 'HARD WR 61 fails');
ok(isMlSkillWallet(pos(6, 52)), 'ML exact n6 WR52');
ok(!isMlSkillWallet(pos(5, 80)), 'ML n5 fails');
ok(!isMlSkillWallet(pos(6, 51.9)), 'ML WR 51.9 fails');

// ── ML HOLD / MUTE ───────────────────────────────────────────────────────
{
  const profiles = new Map([
    ['aaaaaa', prof('MLB', 'ML', pos(6, 52))],
    ['bbbbbb', prof('MLB', 'ML', pos(20, 48))],
  ]);
  const r = mute({
    units: 5.4,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { side: 'home', walletShort: 'aaaaaa', invested: 8000 },
      { side: 'away', walletShort: 'bbbbbb', invested: 20000 },
    ],
    walletProfiles: profiles,
  });
  ok(r.action === 'HOLD' && r.units === 5.4, 'ML n6 WR52 FOR HOLD exact units');
  ok(r.mutedBy == null, 'ML HOLD no mutedBy');
}
{
  const profiles = new Map([
    ['aaaaaa', prof('MLB', 'ML', pos(5, 70))],
    ['bbbbbb', prof('MLB', 'ML', pos(20, 80))],
  ]);
  const r = mute({
    units: 3,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [
      { side: 'home', walletShort: 'aaaaaa', invested: 8000 },
      { side: 'away', walletShort: 'bbbbbb', invested: 20000 },
    ],
    walletProfiles: profiles,
  });
  ok(r.action === 'MUTE' && r.units === 0, 'ML n5 FOR + skilled AG → mute');
  ok(r.mutedBy === ML_MKT_SKILL_MUTED_BY, 'ml-mkt-skill stamp');
  ok(r.unitsPrePolicy === 3, 'preserves pre units');
}
{
  const profiles = new Map([
    ['aaaaaa', prof('MLB', 'ML', pos(8, 51))],
  ]);
  const r = mute({
    units: 2,
    marketType: 'MONEYLINE',
    sport: 'MLB',
    side: 'home',
    walletDetails: [{ side: 'home', walletShort: 'aaaaaa', invested: 5000 }],
    walletProfiles: profiles,
  });
  ok(r.action === 'MUTE' && r.units === 0, 'ML WR 51 n8 → mute');
}

// ── S/T two-layer ────────────────────────────────────────────────────────
{
  const profiles = new Map([
    ['aaaaaa', prof('MLB', 'TOTAL', pos(10, 65, 22))],
    ['bbbbbb', prof('MLB', 'TOTAL', pos(8, 55, 3))],
  ]);
  const r = mute({
    units: 2.5,
    marketType: 'TOTAL',
    sport: 'MLB',
    side: 'over',
    walletDetails: [
      { side: 'over', walletShort: 'aaaaaa', invested: 12000 },
      { side: 'under', walletShort: 'bbbbbb', invested: 4000 },
    ],
    walletProfiles: profiles,
  });
  ok(r.action === 'HOLD' && r.units === 2.5, 'S/T qual AGREE + HARD HOLD');
}
{
  const profiles = new Map([
    ['aaaaaa', prof('MLB', 'TOTAL', pos(10, 55, 3))],
    ['bbbbbb', prof('MLB', 'TOTAL', pos(8, 55, 3))],
  ]);
  const r = mute({
    units: 2,
    marketType: 'TOTAL',
    sport: 'MLB',
    side: 'over',
    walletDetails: [
      { side: 'over', walletShort: 'aaaaaa', invested: 12000 },
      { side: 'under', walletShort: 'bbbbbb', invested: 4000 },
    ],
    walletProfiles: profiles,
  });
  ok(r.action === 'MUTE' && r.units === 0, 'S/T AGREE but no HARD → mute');
  ok(r.mutedBy === ST_HARD_SLIP_MUTED_BY, 'st-hard-slip stamp');
  ok(r.reason === 'st_no_hard_slip', 'hard slip reason');
}
{
  const profiles = new Map([
    ['aaaaaa', prof('NFL', 'SPREAD', pos(10, 70, 25))],
    ['bbbbbb', prof('NFL', 'SPREAD', pos(12, 60, 8))],
  ]);
  const r = mute({
    units: 4,
    marketType: 'SPREAD',
    sport: 'NFL',
    side: 'home',
    walletDetails: [
      { side: 'home', walletShort: 'aaaaaa', invested: 3000 },
      { side: 'away', walletShort: 'bbbbbb', invested: 15000 },
    ],
    walletProfiles: profiles,
  });
  ok(r.action === 'MUTE' && r.units === 0, 'S/T FLIP even with HARD on FOR → mute');
  ok(r.mutedBy === ST_QUAL_WIPE_MUTED_BY, 'st-qual-wipe stamp');
  ok(r.reason === 'st_qual_flip', 'flip reason — do not flip ticket');
}
{
  const profiles = new Map([
    ['aaaaaa', prof('MLB', 'TOTAL', pos(2, 80, 40))],
  ]);
  const r = mute({
    units: 1.5,
    marketType: 'TOTAL',
    sport: 'MLB',
    side: 'under',
    walletDetails: [{ side: 'under', walletShort: 'aaaaaa', invested: 9000 }],
    walletProfiles: profiles,
  });
  ok(r.action === 'MUTE' && r.units === 0, 'S/T EMPTY (thin n) → mute');
  ok(r.mutedBy === ST_QUAL_WIPE_MUTED_BY, 'empty uses qual wipe stamp');
}
{
  const profiles = new Map([
    ['aaaaaa', prof('MLB', 'TOTAL', pos(10, 70, 25))],
  ]);
  const r = mute({
    units: 3,
    marketType: 'TOTAL',
    sport: 'MLB',
    side: 'over',
    walletDetails: [
      { side: 'over', direction: 'AG', walletShort: 'aaaaaa', invested: 9000 },
    ],
    walletProfiles: profiles,
  });
  ok(r.action === 'MUTE' && r.units === 0, 'HARD on AG direction does not slip');
}

// ── Fail-open / identity ─────────────────────────────────────────────────
function holdExact(args, expectU, msg) {
  const r = mute(args);
  ok(r.units === expectU, `${msg} units ${r.units} === ${expectU}`);
  ok(r.action === 'HOLD' || r.action === 'EXEMPT', `${msg} action ${r.action}`);
  ok(r.mutedBy == null, `${msg} no mutedBy`);
}

{
  const r = applyMarketSkillMuteOverlay({
    units: 5, marketType: 'ML', sport: 'MLB', side: 'home',
    walletDetails: [{ side: 'home', walletShort: 'aaaaaa' }],
    walletProfiles: new Map(),
    pickDate: '2026-09-23',
  });
  ok(r.action === 'EXEMPT' && r.units === 5, 'pre-cutover does not rewrite history');
}
{
  const r = mute({ units: 0, marketType: 'ML', sport: 'MLB', side: 'home' });
  ok(r.action === 'PASS' && r.units === 0, 'already 0u stays PASS');
}
{
  const r = mute({
    units: 3,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [{ side: 'home', walletShort: 'aaaaaa', invested: 5000 }],
    walletProfiles: new Map([['aaaaaa', { bySport: { MLB: { positions: { n: 20, wr: 70 } } } }]]),
  });
  ok(r.action === 'HOLD' && r.units === 3, 'missing byMarket schema → fail-open HOLD');
  ok(r.reason === 'schema_missing', 'schema_missing reason');
}
{
  const r = mute({
    units: 3,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [{ side: 'home', walletShort: 'aaaaaa' }],
    walletProfiles: null,
  });
  ok(r.action === 'HOLD' && r.units === 3, 'null profiles → fail-open HOLD');
}
{
  const r = mute({
    units: 2,
    marketType: 'PROP',
    sport: 'MLB',
    side: 'home',
    walletDetails: [{ side: 'home', walletShort: 'aaaaaa' }],
    walletProfiles: new Map(),
  });
  ok(r.action === 'EXEMPT' && r.units === 2, 'non ML/S/T exempt');
}
{
  const profiles = new Map([
    ['aaaaaa', prof('MLB', 'ML', pos(10, 60))],
  ]);
  holdExact({
    units: 5.4,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [{ side: 'home', walletShort: 'aaaaaa', invested: 1000 }],
    walletProfiles: profiles,
  }, 5.4, '4u+ ML HOLD identity');
}

// ── Pipeline: leftover / no-CONFIRMED still first; this can mute after HOLD
{
  const afterSr = applyMaxSrSub4MuteOverlay({
    units: 3, maxSR: 1.31, pickDate: '2026-09-24',
  });
  ok(afterSr.units === 3 && afterSr.action === 'HOLD', 'maxSR HOLD 3u');
  const afterNc = applyNoConfirmedMuteOverlay({
    units: afterSr.units, nConfirmed: 1, pickDate: '2026-09-24',
  });
  ok(afterNc.units === 3 && afterNc.action === 'HOLD', 'no-CONFIRMED HOLD');
  const afterMkt = mute({
    units: afterNc.units,
    marketType: 'TOTAL',
    sport: 'MLB',
    side: 'over',
    walletDetails: [{ side: 'over', walletShort: 'aaaaaa', invested: 8000 }],
    walletProfiles: new Map([['aaaaaa', prof('MLB', 'TOTAL', pos(10, 55, 3))]]),
  });
  ok(afterMkt.action === 'MUTE' && afterMkt.units === 0, 'HARD fail still cuts after no-CONFIRMED HOLD');
}
{
  const afterFat = applyStFatMuteOverlay({
    units: 3,
    pickDate: '2026-09-24',
    marketType: 'ML',
    bothMode: null,
    edge: 4,
    tape: 0,
    steamArriving: false,
  });
  ok(afterFat.units === 3, 'st-fat ML exempt HOLD 3u');
  const afterMkt = mute({
    units: afterFat.units,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [{ side: 'home', walletShort: 'aaaaaa', invested: 8000 }],
    walletProfiles: new Map([['aaaaaa', prof('MLB', 'ML', pos(4, 70))]]),
  });
  ok(afterMkt.action === 'MUTE' && afterMkt.units === 0, 'ML n4 still cut after st-fat HOLD');
}
{
  const afterNc = applyNoConfirmedMuteOverlay({
    units: 3, nConfirmed: 0, pickDate: '2026-09-24',
  });
  ok(afterNc.action === 'MUTE' && afterNc.units === 0, 'no-CONFIRMED already 0');
  const afterMkt = mute({
    units: afterNc.units,
    marketType: 'ML',
    sport: 'MLB',
    side: 'home',
    walletDetails: [],
    walletProfiles: new Map(),
  });
  ok(afterMkt.action === 'PASS' && afterMkt.units === 0, 'market-skill PASS on already 0');
}

console.log(`OK — ${n} assertions`);
