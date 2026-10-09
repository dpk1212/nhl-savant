/**
 * Press ladder (2026-10-06+ stakes and stamps).
 * Usage: node tests/testPressLadderOverlay.mjs
 */
import assert from 'assert';
import {
  evaluatePressLadder,
  pressStamp,
  pressBand,
  pressEdge,
  pressPriceStep,
  isHeavyFavorite,
  isPressLadderLive,
  isPressStampLive,
  PRESS_LADDER_FROM,
  PRESS_STAMP_FROM,
  PRESS_STAKE_TIER,
  PRESS_R6_STAKE_TIER,
  PRESS_X_STAKE_TIER,
  PRESS_X_UNITS,
  PRESS_BAND_4_UNITS,
  PRESS_DOG_IMPLIED_MAX,
  PRESS_DOG_UNITS,
  pressUnits,
  PRESS_X_UNITS_STEAM_ON,
  R6_UNITS,
  PRESS_U_STAKE_TIER,
  PRESS_U_UNITS,
  PRESS_N_STAKE_TIER,
  PRESS_N_UNITS_CLEAN,
  PRESS_N_UNITS_MOVED,
  STEAM_C_STAKE_TIER,
  STEAM_C_UNITS,
  isPressMirrorLive,
  isPressMirrorShape,
  evaluatePressMirror,
  pressMirrorEval,
  pressMirrorStamp,
  PRESS_M_FROM,
  PRESS_M_UNITS,
  PRESS_M_STAKE_TIER,
  isSteamSLive,
  STEAM_S_FROM,
  STEAM_S_STAKE_TIER,
  STEAM_S_UNITS,
  isSoloQLive,
  isHotL10,
  pressWalletRows,
  SOLO_Q_FROM,
  SOLO_Q_STAKE_TIER,
  SOLO_Q_UNITS,
  isFadeFLive,
  careerLossStreak,
  isFloor2Row,
  evaluateFloorFade,
  FADE_F_FROM,
  FADE_F_STAKE_TIER,
  FADE_F_UNITS,
  isTrustLive,
  trustRead,
  trustStamp,
  applyTrustLayer,
  TRUST_FROM,
  TRUST_G_STAKE_TIER,
  TRUST_G_UNITS,
  TRUST_TIER_MIN,
  ML_FLOOR_UNITS,
  ML_FLOOR_IMPLIED_MIN,
  ML_FLOOR_IMPLIED_MAX,
  ST_CAP_UNITS,
  SPREAD_CAP_UNITS,
  TRUST_S_STAKE_TIER,
  TRUST_S_UNITS,
  TRUST_S_PRESS_UNITS,
  TRUST_S_DOG_UNITS,
  TRUST_S_IMPLIED_MIN,
  TRUST_S_IMPLIED_MAX,
  TRUST_S_CONVICTION_RATIO,
} from '../src/lib/pressLadderOverlay.js';

let n = 0;
function ok(cond, msg) { assert.ok(cond, msg); n++; }
function eq(a, b, msg) { assert.strictEqual(a, b, msg); n++; }

// Profiles: sport-local usual = invested / n. Door 2 = n≥6, wr≥55, dollarRoi>3.
function profile(short, sport, { n: bets, wr, dollarRoi, usual }) {
  return [short, { bySport: { [sport]: { positions: { n: bets, wr, dollarRoi, invested: usual * bets, wins: Math.round(bets * wr / 100), settledPnl: 0 } } } }];
}
const SPORT = 'MLB';
const profiles = new Map([
  profile('aaaaaa', SPORT, { n: 40, wr: 58, dollarRoi: 12, usual: 1000 }),   // seasoned + Door 2
  profile('bbbbbb', SPORT, { n: 20, wr: 48, dollarRoi: -5, usual: 500 }),    // seasoned, not Door 2
  profile('cccccc', SPORT, { n: 8, wr: 60, dollarRoi: 9, usual: 200 }),      // Door 2, not seasoned
  profile('dddddd', SPORT, { n: 3, wr: 67, dollarRoi: 20, usual: 100 }),     // early
  profile('eeeeee', SPORT, { n: 30, wr: 52, dollarRoi: 1, usual: 800 }),     // seasoned, not Door 2
]);
const wd = (wallet, side, invested) => ({ wallet, side, invested });

// 1. Gate pass, ≥3× press, clean price → 5u PRESS
{
  const r = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 3500), wd('dddddd', 'away', 100)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profiles, sideOdds: -120, steamOn: false,
  });
  ok(r.gate.pass, 'gate passes');
  eq(r.band, 5, 'band 5 at 3.5×');
  eq(r.priceStep, 0, 'clean');
  eq(r.units, 5, '5u');
  eq(r.rung, PRESS_STAKE_TIER, 'PRESS rung');
  eq(r.presser.wallet, 'aaaaaa', 'presser identified');
  ok(Math.abs(r.moneyShare - 3500 / 3600) < 1e-9, 'money share');
}

// 2. ≥2× press, steam on, edge ≥ 0 → 4 − 1 = 3u
{
  const r = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 2200), wd('bbbbbb', 'away', 500)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profiles, sideOdds: +110, steamOn: true,
  });
  ok(r.gate.pass, 'gate passes (bbbbbb against is not Door 2)');
  eq(r.band, 4, 'band 4 at 2.2×');
  ok(r.edge > 0, 'edge positive: 58% vs 47.6% implied');
  eq(r.priceStep, 1, 'moved, edge ≥ 0');
  eq(r.units, 1, 'band 4 step 1 is 1u (cut 2026-10-09), and +110 is a dog');
  ok(r.reason === 'press_4_moved_edge_pos_dog_cap', r.reason);
  // Same band-4 steam-on shape at a favourite price: the band-4 cut alone → 1u, no dog suffix.
  const fav = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 2200), wd('bbbbbb', 'away', 500)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profiles, sideOdds: -130, steamOn: true,
  });
  eq(fav.band, 4, 'band 4'); eq(fav.priceStep, 1, 'step 1'); eq(fav.units, 1, 'band 4 step 1 → 1u');
  eq(fav.reason, 'press_4_moved_edge_pos', 'no dog suffix at −130');
  // Band 4 clean at a favourite price → 2u (was 4u).
  const clean4 = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 2200), wd('bbbbbb', 'away', 500)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profiles, sideOdds: -130, steamOn: false,
  });
  eq(clean4.band, 4, 'band 4'); eq(clean4.priceStep, 0, 'clean'); eq(clean4.units, PRESS_BAND_4_UNITS[0], 'band 4 clean → 2u');
  eq(PRESS_BAND_4_UNITS.join('/'), '2/1/2', 'band 4 table 2 / 1 / 2');
  // Band 4 moved with edge < 0 (heavy favourite) → 2u.
  const heavy4 = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 2200), wd('bbbbbb', 'away', 500)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profiles, sideOdds: -300, steamOn: false,
  });
  eq(heavy4.band, 4, 'band 4'); eq(heavy4.priceStep, 2, 'step 2'); eq(heavy4.units, PRESS_BAND_4_UNITS[2], 'band 4 step 2 → 2u');
}

// 2b. PRESS dog cap: under .50 implied → 1u whatever the band, on every market type
{
  const dog5 = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 3500), wd('dddddd', 'away', 100)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profiles, sideOdds: +110, steamOn: false,
  });
  eq(dog5.band, 5, 'band 5'); eq(dog5.priceStep, 0, 'clean'); eq(dog5.units, PRESS_DOG_UNITS, 'band 5 clean at +110 → 1u');
  ok(dog5.reason === 'press_5_clean_dog_cap', dog5.reason);
  const fav5 = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 3500), wd('dddddd', 'away', 100)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profiles, sideOdds: -105, steamOn: false,
  });
  eq(fav5.units, 5, 'band 5 clean at −105 (.512) keeps 5u'); eq(fav5.reason, 'press_5_clean', 'no suffix');
  const spreadDog = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 3500), wd('dddddd', 'away', 100)],
    side: 'home', sport: SPORT, marketType: 'SPREAD', walletProfiles: profiles, sideOdds: +105, steamOn: false,
  });
  eq(spreadDog.units, 1, 'a +105 spread is a dog → 1u'); ok(spreadDog.reason.endsWith('_dog_cap'), spreadDog.reason);
  const spreadStd = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 3500), wd('dddddd', 'away', 100)],
    side: 'home', sport: SPORT, marketType: 'SPREAD', walletProfiles: profiles, sideOdds: -110, steamOn: false,
  });
  eq(spreadStd.units, 5, '−110 spread keeps the band');
  const noOdds = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 3500), wd('dddddd', 'away', 100)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profiles, steamOn: false,
  });
  eq(noOdds.units, 5, 'no price → no cap');
  // pressUnits directly
  eq(pressUnits(5, 0, 0.55), 5, '5/0'); eq(pressUnits(5, 1, 0.55), 4, '5/1'); eq(pressUnits(5, 2, 0.55), 3, '5/2');
  eq(pressUnits(4, 0, 0.55), 2, '4/0'); eq(pressUnits(4, 1, 0.55), 1, '4/1'); eq(pressUnits(4, 2, 0.55), 2, '4/2');
  eq(pressUnits(3, 0, 0.55), 3, '3/0'); eq(pressUnits(3, 1, 0.55), 2, '3/1'); eq(pressUnits(3, 2, 0.55), 1, '3/2');
  eq(pressUnits(5, 0, 0.49), 1, 'dog cap'); eq(pressUnits(5, 0, 0.50), 5, '.50 is not a dog'); eq(pressUnits(5, 0, null), 5, 'no price');
  eq(PRESS_DOG_IMPLIED_MAX, 0.5, 'dog line .50'); eq(PRESS_DOG_UNITS, 1, 'dog units 1');
}

// 3. Heavy ML favorite counts as moved; edge < 0 → −2
{
  const r = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 1600), wd('dddddd', 'away', 50)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profiles, sideOdds: -300, steamOn: false,
  });
  ok(r.gate.pass, 'gate passes');
  ok(r.heavyFav, 'heavy fav at -300');
  eq(r.band, 3, 'band 3 at 1.6×');
  ok(r.edge < 0, 'edge negative: 58% vs 75% implied');
  eq(r.priceStep, 2, 'moved, edge < 0');
  eq(r.units, 1, 'floor at 1u');
}

// 4. Door-2 wallet against vetoes
{
  const r = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 3500), wd('cccccc', 'away', 200)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profiles, sideOdds: -120,
  });
  ok(!r.gate.pass, 'vetoed');
  ok(!r.gate.noDoor2Ag, 'door2 against flagged');
  eq(r.units, 0, '0u');
  eq(r.rung, null, 'no rung');
  ok(r.reason.includes('door2_against'), r.reason);
}

// 4b. PRESS-X: Door-2 against under its usual size, margin +1 → 2u flat
{
  const withG = new Map([...profiles, profile('gggggg', SPORT, { n: 20, wr: 58, dollarRoi: 6, usual: 1000 })]);
  const r = evaluatePressLadder({
    // for: aaaaaa press + gggggg (both Door 2) · against: cccccc $120 vs usual $200 → 0.6×
    walletDetails: [wd('aaaaaa', 'home', 3500), wd('gggggg', 'home', 1000), wd('cccccc', 'away', 120)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: withG, sideOdds: -300, steamOn: true,
  });
  ok(!r.gate.noDoor2Ag, 'gate 3 still fails');
  eq(r.door2For - r.door2Ag, 1, 'margin +1');
  // Same shape with only one Door-2 for → margin 0 → no exception
  const tied = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 3500), wd('cccccc', 'away', 120)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profiles, sideOdds: -120,
  });
  eq(tied.rung, null, 'margin 0 is not PRESS-X'); eq(tied.units, 0, '0u');
  eq(r.rung, PRESS_X_STAKE_TIER, 'PRESS-X fires');
  eq(r.units, PRESS_X_UNITS_STEAM_ON, 'steam on → 2u, no price step');
  eq(r.priceStep, null, 'no price step');
  eq(r.dissenters.length, 1, 'dissenter recorded');
  eq(r.dissenters[0].wallet, 'cccccc', 'dissenter wallet');
  ok(r.reason.startsWith('press_x_margin1') && r.reason.endsWith('_steam_on'), r.reason);
  const off = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 3500), wd('gggggg', 'home', 1000), wd('cccccc', 'away', 120)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: withG, sideOdds: -300, steamOn: false,
  });
  eq(off.rung, PRESS_X_STAKE_TIER, 'PRESS-X fires steam off'); eq(off.units, PRESS_X_UNITS, 'steam off → 3u');
  eq(off.units, 3, 'PRESS-X steam off is 3u'); eq(r.units, 2, 'PRESS-X steam on is 2u');
  ok(off.reason.endsWith('_steam_off'), off.reason);
}

// 4c. PRESS-X needs margin ≥ +1: one Door-2 for vs one Door-2 against at under size... margin 0 → no
{
  const r = evaluatePressLadder({
    // aaaaaa for (Door 2), cccccc against under size (Door 2), plus a second Door-2 against under size → margin −1
    walletDetails: [wd('aaaaaa', 'home', 3500), wd('cccccc', 'away', 120), wd('ffffff', 'away', 100)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: new Map([...profiles, profile('ffffff', SPORT, { n: 10, wr: 60, dollarRoi: 8, usual: 400 })]), sideOdds: -120,
  });
  eq(r.door2For, 1, 'one Door-2 for'); eq(r.door2Ag, 2, 'two Door-2 against');
  eq(r.rung, null, 'margin −1 is not PRESS-X');
  eq(r.units, 0, '0u');
}

// 4d. PRESS-X needs every against under size: one under, one at normal → no
{
  const twoFor = new Map([...profiles, profile('ffffff', SPORT, { n: 10, wr: 60, dollarRoi: 8, usual: 400 }), profile('gggggg', SPORT, { n: 20, wr: 58, dollarRoi: 6, usual: 1000 })]);
  const r = evaluatePressLadder({
    // for: aaaaaa (press), gggggg; against: cccccc 0.6×, ffffff 1.0× → margin 0 anyway; make it margin +1 with bbbbbb? bbbbbb is not Door 2.
    walletDetails: [wd('aaaaaa', 'home', 3500), wd('gggggg', 'home', 1000), wd('cccccc', 'away', 120), wd('ffffff', 'away', 400)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: twoFor, sideOdds: -120,
  });
  eq(r.door2For, 2, 'two Door-2 for'); eq(r.door2Ag, 2, 'two Door-2 against');
  eq(r.rung, null, 'margin 0 blocks');
  const r2 = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 3500), wd('gggggg', 'home', 1000), wd('ffffff', 'away', 400)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: twoFor, sideOdds: -120,
  });
  eq(r2.door2For - r2.door2Ag, 1, 'margin +1');
  eq(r2.rung, null, 'against at exactly 1.0× usual is not under size → vetoed');
  eq(r2.units, 0, '0u');
}

// 4e. PRESS-U: same shape as 4b with NO seasoned press → 1u
{
  const withG = new Map([...profiles, profile('gggggg', SPORT, { n: 20, wr: 58, dollarRoi: 6, usual: 1000 })]);
  const r = evaluatePressLadder({
    // for: aaaaaa $1000 (1.0×, not a press) + gggggg $1000 (1.0×) · against: cccccc $120 (0.6×)
    walletDetails: [wd('aaaaaa', 'home', 1000), wd('gggggg', 'home', 1000), wd('cccccc', 'away', 120)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: withG, sideOdds: -120,
  });
  ok(!r.gate.seasPress, 'no seasoned press');
  ok(!r.gate.noDoor2Ag, 'gate 3 fails');
  eq(r.door2For - r.door2Ag, 1, 'margin +1');
  eq(r.rung, PRESS_U_STAKE_TIER, 'PRESS-U fires');
  eq(r.units, PRESS_U_UNITS, '2u'); eq(PRESS_U_UNITS, 2, 'PRESS-U is 2u');
  eq(r.presser, null, 'no presser stamped');
  eq(r.dissenters[0].wallet, 'cccccc', 'dissenter recorded');
  ok(r.reason.startsWith('press_u_margin1'), r.reason);
  // against at 1.0× → not under size → 0u
  const r2 = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 1000), wd('gggggg', 'home', 1000), wd('cccccc', 'away', 200)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: withG, sideOdds: -120,
  });
  eq(r2.rung, null, 'against at normal size blocks PRESS-U'); eq(r2.units, 0, '0u');
  // margin 0 → 0u (R6 needs 0 Door-2 against so it does not fire either)
  const r3 = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 1000), wd('cccccc', 'away', 120)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: withG, sideOdds: -120,
  });
  eq(r3.rung, null, 'margin 0 blocks PRESS-U'); eq(r3.units, 0, '0u');
  // money under 60% → 0u
  const r4 = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 1000), wd('gggggg', 'home', 1000), wd('cccccc', 'away', 120), wd('bbbbbb', 'away', 5000)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: withG, sideOdds: -120,
  });
  ok(!r4.gate.money, 'money fails'); eq(r4.rung, null, 'money gate still required'); eq(r4.units, 0, '0u');
}

// 4g. STEAM-C: steam on toward us, proven wallets net against (margin ≤ 0),
// every Door-2 against under 1.0×, no seasoned press against → 1u, no money gate
{
  // margin 0: aaaaaa FOR $1000 (1.0×) vs cccccc AG $120 (0.6×) · steam on
  const r = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 1000), wd('cccccc', 'away', 120)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profiles, sideOdds: -120, steamOn: true,
  });
  eq(r.door2For - r.door2Ag, 0, 'margin 0');
  eq(r.rung, STEAM_C_STAKE_TIER, 'STEAM-C fires on steam with margin 0');
  eq(r.units, STEAM_C_UNITS, '2u'); eq(STEAM_C_UNITS, 2, 'STEAM-C is 2u');
  ok(r.steamOn, 'steamOn stamped');
  eq(r.dissenters[0].wallet, 'cccccc', 'dissenter recorded');
  ok(r.reason.startsWith('steam_c_margin0'), r.reason);
  // same wallets, steam off → 0u (gate_fail door2_against)
  const off = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 1000), wd('cccccc', 'away', 120)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profiles, sideOdds: -120, steamOn: false,
  });
  eq(off.rung, null, 'no steam → no STEAM-C'); eq(off.units, 0, '0u'); ok(off.reason.includes('door2_against'), off.reason);
  // margin −1, money under 60%, pure proven against (no Door-2 FOR) → still fires
  const neg = evaluatePressLadder({
    walletDetails: [wd('bbbbbb', 'home', 400), wd('cccccc', 'away', 120), wd('aaaaaa', 'away', 500)],
    side: 'home', sport: SPORT, marketType: 'TOTAL', walletProfiles: profiles, sideOdds: -110, steamOn: true,
  });
  ok(!neg.gate.money, 'money under 60%'); eq(neg.door2For, 0, 'no Door-2 FOR'); eq(neg.door2Ag, 2, 'two Door-2 against');
  eq(neg.rung, STEAM_C_STAKE_TIER, 'STEAM-C has no money gate'); eq(neg.units, STEAM_C_UNITS, '2u');
  ok(neg.reason.startsWith('steam_c_margin-2'), neg.reason);
  // a Door-2 against at 1.0× → not under size → 0u
  const full = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 1000), wd('cccccc', 'away', 200)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profiles, sideOdds: -120, steamOn: true,
  });
  eq(full.rung, null, 'full-size dissenter blocks STEAM-C'); eq(full.units, 0, '0u');
  // seasoned press against (aaaaaa $1500 = 1.5× AG) → 0u
  const pressed = evaluatePressLadder({
    walletDetails: [wd('bbbbbb', 'home', 400), wd('cccccc', 'away', 120), wd('aaaaaa', 'away', 1500)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profiles, sideOdds: -120, steamOn: true,
  });
  eq(pressed.rung, null, 'press against blocks STEAM-C'); eq(pressed.units, 0, '0u');
  // margin +1 with steam is PRESS-U / PRESS-X territory, never STEAM-C
  const withG = new Map([...profiles, profile('gggggg', SPORT, { n: 20, wr: 58, dollarRoi: 6, usual: 1000 })]);
  const pos = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 1000), wd('gggggg', 'home', 1000), wd('cccccc', 'away', 120)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: withG, sideOdds: -120, steamOn: true,
  });
  eq(pos.rung, PRESS_U_STAKE_TIER, 'margin +1 stays PRESS-U with steam on');
  // no Door-2 against at all → not STEAM-C (steam alone is nothing)
  const none = evaluatePressLadder({
    walletDetails: [wd('bbbbbb', 'home', 400), wd('dddddd', 'away', 100)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profiles, sideOdds: -120, steamOn: true,
  });
  eq(none.rung, null, 'steam with no proven dissent is 0u'); eq(none.units, 0, '0u');
  // stamp shape
  const st = pressStamp(r, 7);
  for (const [k, v] of Object.entries(st)) ok(v !== undefined, `${k} defined`);
  eq(st.v8_pressRung, 'STEAM-C', 'stamp rung'); eq(st.v8_pressUnits, STEAM_C_UNITS, 'stamp units'); eq(st.v8_pressSteamOn, true, 'stamp steam');
}

// 4f. PRESS-N: deep-book press (n≥50, not Door 2), money, no Door-2 wallet anywhere
{
  const deep = new Map([...profiles, profile('hhhhhh', SPORT, { n: 60, wr: 50, dollarRoi: 0, usual: 1000 })]);
  const clean = evaluatePressLadder({
    walletDetails: [wd('hhhhhh', 'home', 2000), wd('bbbbbb', 'away', 300)],   // 2.0× press · bbbbbb not Door 2
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: deep, sideOdds: -120,
  });
  ok(!clean.gate.door2For && clean.gate.noDoor2Ag, 'no Door-2 either side');
  eq(clean.rung, PRESS_N_STAKE_TIER, 'PRESS-N fires clean'); eq(clean.units, PRESS_N_UNITS_CLEAN, '3u clean'); eq(PRESS_N_UNITS_CLEAN, 3, 'PRESS-N clean is 3u');
  eq(clean.presser.wallet, 'hhhhhh', 'presser stamped'); eq(clean.priceStep, 0, 'clean step 0');
  ok(clean.reason === 'press_n_deep60_clean', clean.reason);
  const moved = evaluatePressLadder({
    walletDetails: [wd('hhhhhh', 'home', 2000), wd('bbbbbb', 'away', 300)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: deep, sideOdds: -120, steamOn: true,
  });
  eq(moved.rung, PRESS_N_STAKE_TIER, 'PRESS-N fires moved'); eq(moved.units, PRESS_N_UNITS_MOVED, '3u moved'); eq(PRESS_N_UNITS_MOVED, 3, 'PRESS-N moved is 3u'); eq(moved.priceStep, 1, 'moved step 1');
  const heavy = evaluatePressLadder({
    walletDetails: [wd('hhhhhh', 'home', 2000), wd('bbbbbb', 'away', 300)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: deep, sideOdds: -250,
  });
  eq(heavy.units, PRESS_N_UNITS_MOVED, 'heavy favourite counts as moved → 3u'); eq(heavy.priceStep, 1, 'still stamped as moved');
  // presser with a shallow book (eeeeee n=30) → no PRESS-N, gate-4 fail
  const shallow = evaluatePressLadder({
    walletDetails: [wd('eeeeee', 'home', 1600), wd('bbbbbb', 'away', 300)],   // 2.0× press from n=30
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: deep, sideOdds: -120,
  });
  eq(shallow.rung, null, 'shallow presser does not qualify'); eq(shallow.units, 0, '0u');
  ok(shallow.reason.includes('no_door2_for'), shallow.reason);
  // a Door-2 against present → not PRESS-N
  const against = evaluatePressLadder({
    walletDetails: [wd('hhhhhh', 'home', 2000), wd('cccccc', 'away', 120)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: deep, sideOdds: -120,
  });
  eq(against.rung, null, 'Door-2 against blocks PRESS-N'); eq(against.units, 0, '0u');
  // a Door-2 FOR present → this is the normal ladder, not PRESS-N
  const withD2 = evaluatePressLadder({
    walletDetails: [wd('hhhhhh', 'home', 2000), wd('cccccc', 'home', 200), wd('bbbbbb', 'away', 300)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: deep, sideOdds: -120,
  });
  eq(withD2.rung, 'PRESS', 'Door-2 FOR → full ladder');
}

// 5. Press from a seasoned non-Door-2 wallet with no Door-2 FOR fails gate 4
{
  const r = evaluatePressLadder({
    walletDetails: [wd('bbbbbb', 'home', 2000), wd('dddddd', 'away', 50)],
    side: 'home', sport: SPORT, marketType: 'SPREAD', walletProfiles: profiles, sideOdds: -110,
  });
  ok(r.gate.seasPress, 'press present');
  ok(!r.gate.door2For, 'no Door-2 FOR');
  eq(r.units, 0, '0u');
}

// 6. Money below 60% fails gate 1
{
  const r = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 3500), wd('eeeeee', 'away', 4000)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profiles, sideOdds: -120,
  });
  ok(!r.gate.money, 'money fails');
  eq(r.units, 0, '0u');
}

// 7. R6: two seasoned FOR at ≥1.0×, no press, no Door-2 AG, money ≥ 60% → 2u PRESS-R6
{
  const r = evaluatePressLadder({
    walletDetails: [wd('bbbbbb', 'over', 600), wd('eeeeee', 'over', 900), wd('dddddd', 'under', 100)],
    side: 'over', sport: SPORT, marketType: 'TOTAL', walletProfiles: profiles, sideOdds: -110,
  });
  ok(!r.gate.seasPress, 'no press (1.2× and 1.125×)');
  eq(r.rung, PRESS_R6_STAKE_TIER, 'R6 fires');
  eq(r.units, R6_UNITS, '2u'); eq(R6_UNITS, 2, 'R6 is 2u');
  eq(r.veterans.length, 2, 'two veterans listed');
}

// 8. R6 does not fire with one veteran, or with a Door-2 against
{
  const one = evaluatePressLadder({
    walletDetails: [wd('bbbbbb', 'over', 600), wd('dddddd', 'under', 100)],
    side: 'over', sport: SPORT, marketType: 'TOTAL', walletProfiles: profiles, sideOdds: -110,
  });
  eq(one.rung, null, 'one veteran is not R6');
  const vetoed = evaluatePressLadder({
    walletDetails: [wd('bbbbbb', 'over', 600), wd('eeeeee', 'over', 900), wd('cccccc', 'under', 200)],
    side: 'over', sport: SPORT, marketType: 'TOTAL', walletProfiles: profiles, sideOdds: -110,
  });
  eq(vetoed.rung, null, 'Door-2 against blocks R6');
}

// 9. Fail-closed on missing inputs
{
  eq(evaluatePressLadder({ walletDetails: [], side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profiles }).units, 0, 'empty wd');
  eq(evaluatePressLadder({ walletDetails: [wd('aaaaaa', 'home', 3500)], side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: null }).units, 0, 'no profiles');
  const unknown = evaluatePressLadder({ walletDetails: [wd('zzzzzz', 'home', 3500)], side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profiles });
  eq(unknown.units, 0, 'unknown wallet → no book → no press');
}

// 10. Helpers and date gates
{
  eq(pressBand(3.0), 5, 'band 5 at 3.0'); eq(pressBand(2.0), 4, 'band 4 at 2.0'); eq(pressBand(1.5), 3, 'band 3 at 1.5'); eq(pressBand(1.49), null, 'none below 1.5');
  ok(isHeavyFavorite('ML', -150), '-150 is 60%'); ok(!isHeavyFavorite('ML', -149), '-149 is below 60%'); ok(!isHeavyFavorite('SPREAD', -300), 'spreads never heavy fav');
  eq(pressPriceStep({ steamOn: false, heavyFav: false, edge: -20 }), 0, 'clean ignores edge');
  eq(pressPriceStep({ steamOn: true, heavyFav: false, edge: null }), 2, 'moved with unknown edge is −2');
  const e = pressEdge([{ dir: 'FOR', n: 12, wr: 60 }, { dir: 'FOR', n: 5, wr: 90 }, { dir: 'AG', n: 50, wr: 70 }], 'TOTAL', -110);
  ok(Math.abs(e - (60 - 52.4)) < 1e-9, 'edge uses FOR n≥10 only vs 52.4');
  eq(PRESS_LADDER_FROM, '2026-10-06', 'live from Oct 6');
  eq(PRESS_STAMP_FROM, '2026-10-06', 'stamps from Oct 6');
  ok(isPressLadderLive('2026-10-06') && !isPressLadderLive('2026-10-05'), 'live gate');
  ok(isPressStampLive('2026-10-06') && !isPressStampLive('2026-10-05'), 'stamp gate');
  ok(!isPressLadderLive(null) && !isPressLadderLive(undefined), 'null dates are not live');
}

// 11. Stamp shape has no undefined values (Firestore rejects undefined)
{
  const r = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 3500), wd('dddddd', 'away', 100)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profiles, sideOdds: -120,
  });
  const st = pressStamp(r, 123);
  for (const [k, v] of Object.entries(st)) ok(v !== undefined, `${k} defined`);
  eq(st.v8_pressUnits, 5, 'stamp units'); eq(st.v8_pressRung, 'PRESS', 'stamp rung'); eq(st.v8_pressAt, 123, 'stamp at');
}

// 12. PRESS-M — the mirror of a muted V12 side
{
  // Home carries the shape: seasoned Door-2 wallet pressing 3.5×, money with it,
  // only an early wallet against. Evaluated FROM the home side.
  const bag = [wd('aaaaaa', 'home', 3500), wd('dddddd', 'away', 100)];
  const homeShape = evaluatePressLadder({ walletDetails: bag, side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profiles });
  const awayShape = evaluatePressLadder({ walletDetails: bag, side: 'away', sport: SPORT, marketType: 'ML', walletProfiles: profiles });
  ok(isPressMirrorShape(homeShape), 'home has the shape');
  ok(!isPressMirrorShape(awayShape), 'away does not');
  eq(awayShape.units, 0, 'away ladder is 0u (money and press against it)');

  // Fires: home score ≤ 0, away is the V12 side (score > 0) at 0u.
  const m = evaluatePressMirror({ shapeEval: homeShape, scoreV12: -0.2, siblings: [{ side: 'away', scoreV12: 0.4, ladderUnits: 0, stakedUnits: 0 }] });
  ok(m.fires, 'mirror fires'); eq(m.rung, PRESS_M_STAKE_TIER, 'rung'); eq(m.units, PRESS_M_UNITS, '1u');
  eq(m.v12Side, 'away', 'names the V12 side'); ok(m.reason.startsWith('press_m_mirror_of_away'), m.reason);
  ok(m.reason.endsWith('_door2'), 'Door-2 FOR noted');
  const mNull = evaluatePressMirror({ shapeEval: homeShape, scoreV12: null, siblings: [{ side: 'away', scoreV12: 0.4, ladderUnits: 0, stakedUnits: 0 }] });
  ok(mNull.fires, 'no-signal score fires too');

  // Never when the V12 side carries or would carry units.
  eq(evaluatePressMirror({ shapeEval: homeShape, scoreV12: -0.2, siblings: [{ side: 'away', scoreV12: 0.4, ladderUnits: 1, stakedUnits: 0 }] }).fires, false, 'sibling ladder units block');
  const manual = evaluatePressMirror({ shapeEval: homeShape, scoreV12: -0.2, siblings: [{ side: 'away', scoreV12: 0.4, ladderUnits: 0, stakedUnits: 2 }] });
  eq(manual.fires, false, 'sibling manual stake blocks'); eq(manual.siblingStaked, 'away', 'names the staked sibling');
  // Never when this side is itself a V12 side, or when no V12 side exists.
  eq(evaluatePressMirror({ shapeEval: homeShape, scoreV12: 0.3, siblings: [{ side: 'away', scoreV12: -0.1, ladderUnits: 0, stakedUnits: 0 }] }).reason, 'mirror_side_is_v12', 'own score > 0');
  eq(evaluatePressMirror({ shapeEval: homeShape, scoreV12: -0.2, siblings: [{ side: 'away', scoreV12: -0.1, ladderUnits: 0, stakedUnits: 0 }] }).reason, 'mirror_no_v12_side', 'both ≤ 0 is not the studied shape');
  eq(evaluatePressMirror({ shapeEval: homeShape, scoreV12: -0.2, siblings: [{ side: 'away', scoreV12: null, ladderUnits: 0, stakedUnits: 0 }] }).fires, false, 'no-signal sibling is not a V12 side');
  // Shape must hold on this side.
  ok(evaluatePressMirror({ shapeEval: awayShape, scoreV12: -0.2, siblings: [{ side: 'home', scoreV12: 0.4, ladderUnits: 0, stakedUnits: 0 }] }).reason.startsWith('mirror_shape_fail'), 'shape fail');
  eq(evaluatePressMirror({ shapeEval: null, scoreV12: -0.2, siblings: [] }).reason, 'mirror_no_inputs', 'fail-closed');

  // Door-2 against on the pressed side kills it (gate 3), unseasoned press too (gate 2).
  const d2Ag = evaluatePressLadder({ walletDetails: [wd('aaaaaa', 'home', 3500), wd('cccccc', 'away', 200)], side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profiles });
  ok(!isPressMirrorShape(d2Ag), 'Door-2 against breaks the shape');
  const unseasoned = evaluatePressLadder({ walletDetails: [wd('cccccc', 'home', 700), wd('dddddd', 'away', 100)], side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profiles });
  ok(!isPressMirrorShape(unseasoned), 'unseasoned press is not the shape');
  // No Door-2 FOR is fine (PRESS-N shape): seasoned non-Door-2 presser with the money.
  const noD2 = evaluatePressLadder({ walletDetails: [wd('bbbbbb', 'home', 1500), wd('dddddd', 'away', 100)], side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profiles });
  ok(isPressMirrorShape(noD2), 'shape holds without Door-2 FOR');
  const mN = evaluatePressMirror({ shapeEval: noD2, scoreV12: -0.1, siblings: [{ side: 'away', scoreV12: 0.2, ladderUnits: 0, stakedUnits: 0 }] });
  ok(mN.fires && mN.reason.endsWith('_no_door2'), 'fires, no Door-2 noted');

  // Stamp record re-labels the rung and is Firestore-safe.
  const rec = pressMirrorEval(homeShape, m);
  eq(rec.rung, PRESS_M_STAKE_TIER, 'record rung'); eq(rec.units, 1, 'record units'); eq(rec.band, null, 'no band');
  const st = pressStamp(rec, 5);
  eq(st.v8_pressRung, 'PRESS-M', 'stamp rung'); eq(st.v8_pressUnits, 1, 'stamp units');
  const ms = pressMirrorStamp(m, homeShape, 7).v8_pressMirror;
  for (const [k, v] of Object.entries(ms)) ok(v !== undefined, `mirror stamp ${k} defined`);
  eq(ms.fires, true, 'mirror stamp fires'); eq(ms.shapeRung, 'PRESS', 'underlying shape rung kept'); eq(ms.at, 7, 'at');
  eq(pressMirrorEval(homeShape, manual), homeShape, 'non-firing mirror leaves the eval alone');

  eq(PRESS_M_FROM, '2026-10-07', 'mirror live from Oct 7');
  ok(isPressMirrorLive('2026-10-07') && !isPressMirrorLive('2026-10-06') && !isPressMirrorLive(null), 'mirror date gate');
}

// 13. STEAM-S — steam toward us against a seasoned wallet's ordinary bet on
// the no-press 50/50 book. Dated rung, sits after STEAM-C and R6.
{
  const withF = new Map([...profiles, profile('ffffff', SPORT, { n: 25, wr: 50, dollarRoi: 0, usual: 1000 })]);
  const LIVE = '2026-10-07';
  const base = (over = {}) => evaluatePressLadder({
    // FOR: an early wallet (n=3) with $400; AG: bbbbbb (seasoned, not Door-2) at 1.2× its $500 usual.
    walletDetails: [wd('dddddd', 'home', 400), wd('bbbbbb', 'away', 600)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: withF, sideOdds: -110, steamOn: true, pickDate: LIVE,
    ...over,
  });
  const r = base();
  eq(r.rung, STEAM_S_STAKE_TIER, 'STEAM-S fires: steam on, no press, AG 1.2×, seasoned 0v1, money 0.40'); eq(r.units, STEAM_S_UNITS, '2u'); eq(STEAM_S_UNITS, 2, 'STEAM-S is 2u');
  ok(!r.gate.money && !r.gate.seasPress, 'money and press gates both fail (that is the shape)');
  ok(Math.abs(r.moneyShare - 0.4) < 1e-9, 'money share 0.40');
  eq(r.dissenters.length, 1, 'the seasoned AG wallet is recorded'); eq(r.dissenters[0].wallet, 'bbbbbb', 'bbbbbb'); eq(r.dissenters[0].ratio, 1.2, 'at 1.2×');
  ok(r.reason.startsWith('steam_s_seas0v1_ag1.2x_money40'), r.reason);
  eq(r.band, null, 'no band'); eq(r.priceStep, null, 'no price step');

  // Date gate: off before STEAM_S_FROM and with no pickDate.
  eq(base({ pickDate: '2026-10-06' }).rung, null, 'not live before Oct 7');
  eq(base({ pickDate: null }).rung, null, 'no pickDate → rung stays off');
  eq(STEAM_S_FROM, '2026-10-07', 'live from Oct 7');
  ok(isSteamSLive('2026-10-07') && !isSteamSLive('2026-10-06') && !isSteamSLive(null), 'date gate helper');

  // Steam is the trigger.
  const off = base({ steamOn: false });
  eq(off.rung, null, 'steam off → nothing'); eq(off.units, 0, '0u'); ok(off.reason.startsWith('gate_fail:'), off.reason);

  // The opposition has to be a normal-size bet: under 1.0× is STEAM-C's wallet, 1.5×+ is a press.
  eq(base({ walletDetails: [wd('dddddd', 'home', 400), wd('bbbbbb', 'away', 400)] }).rung, null, 'AG at 0.8× → no');
  eq(base({ walletDetails: [wd('dddddd', 'home', 400), wd('bbbbbb', 'away', 800)] }).rung, null, 'AG at 1.6× (press against) → no');
  eq(base({ walletDetails: [wd('dddddd', 'home', 400), wd('bbbbbb', 'away', 745)] }).rung, STEAM_S_STAKE_TIER, 'AG at 1.49× → yes');
  eq(base({ walletDetails: [wd('dddddd', 'home', 400), wd('bbbbbb', 'away', 500)] }).rung, STEAM_S_STAKE_TIER, 'AG at exactly 1.0× → yes');

  // Money band 0.20–0.60.
  eq(base({ walletDetails: [wd('dddddd', 'home', 1200), wd('bbbbbb', 'away', 600)] }).rung, null, 'money 0.67 → no (gate 1 passes, no press, no veterans → 0u)');
  eq(base({ walletDetails: [wd('dddddd', 'home', 100), wd('bbbbbb', 'away', 600)] }).rung, null, 'money 0.14 → no');
  eq(base({ walletDetails: [wd('dddddd', 'home', 150), wd('bbbbbb', 'away', 600)] }).rung, STEAM_S_STAKE_TIER, 'money 0.20 → yes');
  eq(base({ walletDetails: [wd('dddddd', 'home', 890), wd('bbbbbb', 'away', 600)] }).rung, STEAM_S_STAKE_TIER, 'money 0.597 → yes');

  // Seasoned count: AG ≥ FOR, at least one seasoned AG.
  const even = base({ walletDetails: [wd('eeeeee', 'home', 400), wd('bbbbbb', 'away', 600)] });
  eq(even.rung, STEAM_S_STAKE_TIER, 'seasoned 1v1 (even) → yes'); ok(even.reason.startsWith('steam_s_seas1v1'), even.reason);
  eq(base({ walletDetails: [wd('eeeeee', 'home', 200), wd('aaaaaa', 'home', 200), wd('bbbbbb', 'away', 600)] }).rung, null, 'seasoned 2v1 (we are ahead) → no');
  eq(base({ walletDetails: [wd('dddddd', 'home', 400), wd('cccccc', 'away', 250)] }).rung, null, 'only an unseasoned (Door-2, n=8) AG at 1.25× → no seasoned AG → no');

  // A seasoned press FOR is a different book (the ladder's), never STEAM-S.
  const pressed = base({ walletDetails: [wd('eeeeee', 'home', 1300), wd('ffffff', 'away', 1200), wd('bbbbbb', 'away', 600)] });
  ok(pressed.gate.seasPress, 'press FOR present'); eq(pressed.rung, null, 'press FOR with money 0.42 → no STEAM-S');

  // Long dogs and missing odds fail closed; spreads at −110 pass.
  eq(base({ sideOdds: +200 }).rung, null, 'implied 0.33 → no');
  eq(base({ sideOdds: +150 }).rung, STEAM_S_STAKE_TIER, 'implied 0.40 → yes');
  eq(base({ sideOdds: null }).rung, null, 'no odds → fail closed');
  eq(base({ marketType: 'TOTAL', sideOdds: -110 }).rung, STEAM_S_STAKE_TIER, 'total at −110 → yes');

  // Unopposed is not STEAM-S.
  eq(base({ walletDetails: [wd('dddddd', 'home', 400)] }).rung, null, 'no AG wallet → no');

  // Ordering: a Door-2 AG under size with steam on is STEAM-C first.
  const c = base({ walletDetails: [wd('dddddd', 'home', 400), wd('bbbbbb', 'away', 600), wd('cccccc', 'away', 100)] });
  eq(c.rung, STEAM_C_STAKE_TIER, 'STEAM-C takes precedence when a Door-2 AG under size is present');

  // Stamp.
  const st = pressStamp(r, 9);
  eq(st.v8_pressRung, 'STEAM-S', 'stamp rung'); eq(st.v8_pressUnits, STEAM_S_UNITS, 'stamp units'); eq(st.v8_pressSteamOn, true, 'stamp steam');
  eq(st.v8_pressDissenters[0].wallet, 'bbbbbb', 'stamp records the seasoned AG'); eq(st.v8_pressPresser, null, 'no presser');
  for (const [k, v] of Object.entries(st)) ok(v !== undefined, `stamp ${k} defined`);
}

// 14. SOLO-Q — the quiet unopposed favourite. Zero AG, steam off, implied
// .50–.60, dust FOR or one ordinary FOR from a hot-form wallet. Dated rung.
{
  const LIVE = '2026-10-07';
  const profileL10 = (short, sport, { n: bets, wr, dollarRoi, usual, l10 }) => {
    const [k, p] = profile(short, sport, { n: bets, wr, dollarRoi, usual });
    p.bySport[sport].form = { actionL10: l10 };
    return [k, p];
  };
  const withHot = new Map([
    ...profiles,
    profileL10('hhhhhh', SPORT, { n: 12, wr: 58, dollarRoi: 5, usual: 100, l10: { w: 7, l: 3 } }),   // hot last-10, unseasoned
    profileL10('kkkkkk', SPORT, { n: 12, wr: 50, dollarRoi: 0, usual: 100, l10: { w: 5, l: 5 } }),   // not hot
  ]);
  const base = (over = {}) => evaluatePressLadder({
    // FOR: an early wallet (usual $100) with $50 → 0.5× (dust). Nobody against. −120 → implied .545.
    walletDetails: [wd('dddddd', 'home', 50)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: withHot, sideOdds: -120, steamOn: false, pickDate: LIVE,
    ...over,
  });
  const r = base();
  eq(r.rung, SOLO_Q_STAKE_TIER, 'SOLO-Q fires: unopposed dust, steam off, −120'); eq(r.units, SOLO_Q_UNITS, '1u'); eq(SOLO_Q_UNITS, 1, 'SOLO-Q stays 1u');
  ok(r.gate.money && !r.gate.seasPress, 'money gate passes trivially (share 1.0), press gate fails');
  eq(r.moneyShare, 1, 'money share 1.0 on an unopposed side');
  eq(r.dissenters.length, 0, 'nobody against'); eq(r.veterans.length, 1, 'the dust FOR wallet is named'); eq(r.veterans[0].wallet, 'dddddd', 'dddddd'); eq(r.veterans[0].ratio, 0.5, 'at 0.5×');
  ok(r.reason.startsWith('solo_q_dust_for0.5x_imp55_steam_off_unopposed'), r.reason);
  eq(r.band, null, 'no band'); eq(r.priceStep, null, 'no price step'); eq(r.steamOn, false, 'steam off recorded');

  // Date gate.
  eq(base({ pickDate: '2026-10-06' }).rung, null, 'not live before Oct 7');
  eq(base({ pickDate: null }).rung, null, 'no pickDate → rung stays off');
  eq(SOLO_Q_FROM, '2026-10-07', 'live from Oct 7');
  ok(isSoloQLive('2026-10-07') && !isSoloQLive('2026-10-06') && !isSoloQLive(null), 'date gate helper');

  // Steam toward the side kills it.
  const on = base({ steamOn: true });
  eq(on.rung, null, 'steam on → nothing'); eq(on.units, 0, '0u'); ok(on.reason.startsWith('gate_fail:'), on.reason);

  // Any wallet against — even dust — and it is no longer unopposed.
  eq(base({ walletDetails: [wd('dddddd', 'home', 50), wd('cccccc', 'away', 20)] }).rung, null, 'a 0.1× AG wallet → no');

  // Price band [.50, .60): fail-closed without odds.
  eq(base({ sideOdds: 100 }).rung, SOLO_Q_STAKE_TIER, '+100 (implied .50) → yes');
  eq(base({ sideOdds: 105 }).rung, null, '+105 (implied .488) → no');
  eq(base({ sideOdds: -149 }).rung, SOLO_Q_STAKE_TIER, '−149 (implied .598) → yes');
  eq(base({ sideOdds: -150 }).rung, null, '−150 (implied .60) → no');
  eq(base({ sideOdds: -200 }).rung, null, '−200 → no');
  eq(base({ sideOdds: null }).rung, null, 'no odds → no');

  // Size: dust under 0.75×; the light band (0.75–1×) is out; ordinary needs hot form.
  eq(base({ walletDetails: [wd('dddddd', 'home', 74)] }).rung, SOLO_Q_STAKE_TIER, '0.74× → dust, yes');
  eq(base({ walletDetails: [wd('dddddd', 'home', 75)] }).rung, null, '0.75× → light band, no');
  eq(base({ walletDetails: [wd('dddddd', 'home', 99)] }).rung, null, '0.99× → light band, no');
  eq(base({ walletDetails: [wd('kkkkkk', 'home', 120)] }).rung, null, '1.2× from a wallet not in form → no');
  const ord = base({ walletDetails: [wd('hhhhhh', 'home', 120)] });
  eq(ord.rung, SOLO_Q_STAKE_TIER, '1.2× from a hot-form wallet → yes');
  ok(ord.reason.startsWith('solo_q_ordinary_hot_for1.2x_imp55'), ord.reason);
  eq(ord.veterans[0].wallet, 'hhhhhh', 'the hot wallet is named');
  eq(base({ walletDetails: [wd('hhhhhh', 'home', 100)] }).rung, SOLO_Q_STAKE_TIER, '1.0× hot → yes');
  eq(base({ walletDetails: [wd('hhhhhh', 'home', 149)] }).rung, SOLO_Q_STAKE_TIER, '1.49× hot → yes');
  eq(base({ walletDetails: [wd('hhhhhh', 'home', 150)] }).rung, null, '1.5× hot (unseasoned press) → no');
  eq(base({ walletDetails: [wd('hhhhhh', 'home', 80)] }).rung, null, '0.8× hot → light band, no');
  // Hot form anywhere on the FOR side counts, matching the research (any FOR wallet hot).
  const mixed = base({ walletDetails: [wd('kkkkkk', 'home', 120), wd('hhhhhh', 'home', 30)] });
  eq(mixed.rung, SOLO_Q_STAKE_TIER, 'biggest FOR 1.2× not hot, a 0.3× hot wallet alongside → yes');
  eq(mixed.veterans.length, 1, 'only the hot wallet is named'); eq(mixed.veterans[0].wallet, 'hhhhhh', 'hhhhhh');
  // Two dust wallets: all named, biggest first.
  const two = base({ walletDetails: [wd('dddddd', 'home', 30), wd('kkkkkk', 'home', 60)] });
  eq(two.rung, SOLO_Q_STAKE_TIER, 'two dust wallets → yes'); eq(two.veterans.length, 2, 'both named'); eq(two.veterans[0].wallet, 'kkkkkk', 'biggest first');
  // Unknown size ratio (no profile) counts as dust, as in the research.
  eq(base({ walletDetails: [wd('zzzzzz', 'home', 300)] }).rung, SOLO_Q_STAKE_TIER, 'wallet with no profile → ratio unknown → dust, yes');

  // Hot-form helper.
  ok(isHotL10({ w: 7, l: 3 }), '7-3 is hot'); ok(isHotL10({ w: 6, l: 2 }), '6-2 is hot (8 decided, 75%)');
  ok(!isHotL10({ w: 5, l: 2 }), '5-2 is thin (7 decided)'); ok(!isHotL10({ w: 6, l: 4 }), '6-4 is not hot'); ok(!isHotL10(null), 'null → not hot');

  // Precedence: a seasoned press FOR unopposed is PRESS; two veterans at size is R6.
  const press = base({ walletDetails: [wd('aaaaaa', 'home', 2000)], sideOdds: -110 });
  eq(press.rung, PRESS_STAKE_TIER, 'seasoned Door-2 press unopposed → PRESS, never SOLO-Q');
  const vets = base({ walletDetails: [wd('aaaaaa', 'home', 1100), wd('eeeeee', 'home', 900)], sideOdds: -110 });
  eq(vets.rung, PRESS_R6_STAKE_TIER, 'two veterans at ≥1.0×, no press → R6 keeps precedence');

  // Row carries the sport last-10.
  const rows = pressWalletRows([wd('hhhhhh', 'home', 120)], 'home', SPORT, withHot);
  eq(rows[0].l10.w, 7, 'row l10 w'); eq(rows[0].l10.l, 3, 'row l10 l');
  eq(pressWalletRows([wd('dddddd', 'home', 50)], 'home', SPORT, withHot)[0].l10, null, 'no form → l10 null');

  // Stamp.
  const st = pressStamp(r, 4);
  eq(st.v8_pressRung, 'SOLO-Q', 'stamp rung'); eq(st.v8_pressUnits, 1, 'stamp units'); eq(st.v8_pressSteamOn, false, 'stamp steam off');
  ok(st.v8_pressDissenters == null || st.v8_pressDissenters.length === 0, 'no dissenters'); eq(st.v8_pressVeterans[0].wallet, 'dddddd', 'stamp names the FOR wallet'); eq(st.v8_pressPresser, null, 'no presser');
  for (const [k, v] of Object.entries(st)) ok(v !== undefined, `stamp ${k} defined`);
}

// 15. FADE-F — the lone streaking loser. Floor wallet (n ≥ 15, WR ≤ 45),
// exactly one in the market, losing streak ≥ 3, under 1.5× its usual, its
// side under .65 implied. Against us at 0u → 1u; for us → veto any rung.
{
  const LIVE = '2026-10-07';
  const act = (date, won, extra = {}) => ({ date, won, settledPnl: won ? 90 : -100, ...extra });
  // Floor wallet with action spread over two sports; career streak = 3 (last MLB win on 09-28, then L L L across NFL/MLB).
  const floorProfile = (short, { streak = 3, usual = 500, wr = 40, n: bets = 25, pushTail = false } = {}) => {
    const [k, p] = profile(short, SPORT, { n: bets, wr, dollarRoi: -12, usual });
    const mlb = [act('2026-09-28', 1), act('2026-10-02', 0)];
    const nfl = [act('2026-09-30', 0), act('2026-10-04', 0)];
    // streak 2 fixture merges to L (09-28) W (09-30) L (10-02) L (10-04).
    const rows = streak >= 3 ? { mlb, nfl } : { mlb: [act('2026-09-28', 0), act('2026-10-02', 0)], nfl: [act('2026-09-30', 1), act('2026-10-04', 0)] };
    if (pushTail) rows.mlb.push({ date: '2026-10-05', won: 0, settledPnl: 0 });
    p.bySport[SPORT].form = { recentAction: rows.mlb };
    p.bySport.NFL = { positions: { n: 10, wr: 50, dollarRoi: 0, invested: 5000, wins: 5, settledPnl: 0 }, form: { recentAction: rows.nfl } };
    return [k, p];
  };
  const profilesF = new Map([
    ...profiles,
    floorProfile('ffffff'),                              // floor, streak 3
    floorProfile('gggggg', { streak: 3, usual: 500 }),   // second floor wallet (for the "exactly one" leg)
    floorProfile('nnnnnn', { streak: 2 }),               // floor, streak 2 (L W L L)
    floorProfile('pppppp', { pushTail: true }),          // floor, streak 3 with a trailing push
    floorProfile('qqqqqq', { wr: 46 }),                  // n 25 at WR 46 → not a floor wallet
  ]);

  // Streak helper: merges sports by date, skips pushes, counts trailing losses.
  eq(careerLossStreak(profilesF.get('ffffff')), 3, 'career streak 3 across MLB+NFL');
  eq(careerLossStreak(profilesF.get('nnnnnn')), 2, 'L W L L → 2');
  eq(careerLossStreak(profilesF.get('pppppp')), 3, 'trailing push is skipped');
  eq(careerLossStreak(profiles.get('aaaaaa')), 0, 'no recentAction → 0');
  eq(careerLossStreak(null), 0, 'null profile → 0');
  eq(careerLossStreak({ bySport: { MLB: { form: { recentAction: [act('2026-10-01', 1)] } } } }), 0, 'last was a win → 0');
  eq(careerLossStreak({ bySport: { MLB: { form: { recentAction: [act('2026-10-03', 0), act('2026-10-01', 0), act('2026-10-02', 1)] } } } }), 1, 'unsorted input is sorted by date');

  // Floor-2 row helper.
  ok(isFloor2Row({ n: 15, wr: 45 }), 'n15 wr45 is floor'); ok(!isFloor2Row({ n: 14, wr: 40 }), 'n14 is not seasoned');
  ok(!isFloor2Row({ n: 25, wr: 46 }), 'wr46 is not floor'); ok(!isFloor2Row({ n: 25, wr: null }), 'wr null is not floor');

  // Market: dust FOR from an early wallet, floor wallet AGAINST at 1.0× (its usual $500). Our side −120 → implied .545; floor side .455.
  const base = (over = {}) => evaluatePressLadder({
    walletDetails: [wd('dddddd', 'home', 50), wd('ffffff', 'away', 500)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profilesF, sideOdds: -120, steamOn: true, pickDate: LIVE,
    ...over,
  });
  const r = base();
  eq(r.rung, FADE_F_STAKE_TIER, 'FADE-F fires: floor wallet against, 0u core (steam on kills SOLO-Q)'); eq(r.units, FADE_F_UNITS, '2u'); eq(FADE_F_UNITS, 2, 'FADE-F is 2u');
  eq(r.floorFade.status, 'BOOST', 'status BOOST'); eq(r.floorFade.wallet, 'ffffff', 'floor wallet named'); eq(r.floorFade.dir, 'AG', 'against');
  eq(r.floorFade.streak, 3, 'streak 3'); eq(r.floorFade.ratio, 1, '1.0×'); eq(r.floorFade.floorImplied, 0.455, 'floor side implied .455');
  ok(r.reason.startsWith('fade_f_floor_against_ffffff_n25_wr40_streak3_1x_floor45'), r.reason);
  ok(!r.gate.pass, 'gate failed underneath');

  // Date gate.
  eq(base({ pickDate: '2026-10-06' }).rung, null, 'not live before Oct 7');
  eq(base({ pickDate: null }).rung, null, 'no pickDate → off');
  eq(FADE_F_FROM, '2026-10-07', 'live from Oct 7');
  ok(isFadeFLive('2026-10-07') && !isFadeFLive('2026-10-06') && !isFadeFLive(null), 'date gate helper');
  // The read is still stamped when the policy is not live.
  eq(base({ pickDate: '2026-10-06' }).floorFade.status, 'BOOST', 'read computed regardless of date');

  // Legs, each fail-closed.
  eq(base({ walletDetails: [wd('dddddd', 'home', 50), wd('nnnnnn', 'away', 500)] }).rung, null, 'streak 2 → no');
  eq(base({ walletDetails: [wd('dddddd', 'home', 50), wd('nnnnnn', 'away', 500)] }).floorFade.reason, 'streak_2', 'reason streak_2');
  eq(base({ walletDetails: [wd('dddddd', 'home', 50), wd('pppppp', 'away', 500)] }).rung, FADE_F_STAKE_TIER, 'trailing push does not break the streak');
  eq(base({ walletDetails: [wd('dddddd', 'home', 50), wd('ffffff', 'away', 749)] }).rung, FADE_F_STAKE_TIER, '1.498× → yes');
  const pressing = base({ walletDetails: [wd('dddddd', 'home', 50), wd('ffffff', 'away', 750)] });
  eq(pressing.rung, null, '1.5× → the floor wallet is pressing, no'); eq(pressing.floorFade.reason, 'pressing_1.5x', 'reason');
  eq(base({ walletDetails: [wd('dddddd', 'home', 50), wd('qqqqqq', 'away', 500)] }).floorFade.reason, 'no_floor_wallet', 'WR 46 is not a floor wallet');
  const two = base({ walletDetails: [wd('dddddd', 'home', 50), wd('ffffff', 'away', 500), wd('gggggg', 'away', 500)] });
  eq(two.rung, null, 'two floor wallets → no'); eq(two.floorFade.reason, 'floor_wallets_2', 'reason');
  const twoSplit = base({ walletDetails: [wd('gggggg', 'home', 500), wd('ffffff', 'away', 500)] });
  eq(twoSplit.floorFade.reason, 'floor_wallets_2', 'one floor each side → still two');
  // Floor side price: ours −120 → floor .455 yes; ours +200 → floor .667 no; ours +180 → floor .643 yes.
  eq(base({ sideOdds: 200 }).rung, null, 'floor side at .667 → no'); eq(base({ sideOdds: 200 }).floorFade.reason, 'floor_fav_67', 'reason');
  eq(base({ sideOdds: 180 }).rung, FADE_F_STAKE_TIER, 'floor side at .643 → yes');
  eq(base({ sideOdds: -400 }).rung, FADE_F_STAKE_TIER, 'floor side a big dog (.20) → yes');
  const noOdds = base({ sideOdds: null });
  eq(noOdds.rung, null, 'no odds → no'); eq(noOdds.floorFade.reason, 'no_odds', 'reason');
  // Unknown ratio (no profile would not be a floor wallet; force via a profile with no invested).
  const noUsual = new Map([...profilesF]);
  { const [k, p] = floorProfile('rrrrrr'); p.bySport[SPORT].positions.invested = 0; noUsual.set(k, p); }
  const unk = base({ walletDetails: [wd('dddddd', 'home', 50), wd('rrrrrr', 'away', 500)], walletProfiles: noUsual });
  eq(unk.rung, null, 'ratio unknown → no'); eq(unk.floorFade.reason, 'ratio_unknown', 'reason');

  // Steam does not matter to FADE-F; with steam off and unopposed dust it would be SOLO-Q, but the AG wallet breaks unopposed.
  eq(base({ steamOn: false }).rung, FADE_F_STAKE_TIER, 'steam off, floor AG → FADE-F');

  // Staked sides keep their stake (no boost). Seasoned Door-2 press FOR 3.5×, floor AG.
  const staked = base({ walletDetails: [wd('aaaaaa', 'home', 3500), wd('ffffff', 'away', 500)], steamOn: false });
  eq(staked.rung, PRESS_STAKE_TIER, 'PRESS keeps its rung'); eq(staked.units, 5, 'PRESS keeps 5u'); eq(staked.floorFade.status, 'BOOST', 'read says BOOST but no boost applied');

  // VETO: we are the floor side. Floor wallet FOR us at 1.0×, our side −120 → floor implied .545.
  const vetoBase = (over = {}) => evaluatePressLadder({
    walletDetails: [wd('ffffff', 'home', 500), wd('dddddd', 'away', 50)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profilesF, sideOdds: -120, steamOn: false, pickDate: LIVE,
    ...over,
  });
  const v = vetoBase();
  eq(v.rung, null, 'veto → no rung'); eq(v.units, 0, '0u'); eq(v.floorFade.status, 'VETO', 'status VETO'); eq(v.floorFade.dir, 'FOR', 'for');
  eq(v.floorFade.floorImplied, 0.545, 'floor implied is our implied');
  ok(v.reason.startsWith('fade_f_veto_of_none:floor_for_ffffff_n25_wr40_streak3_1x_floor55'), v.reason);
  // Veto overrides a rung: seasoned Door-2 press FOR alongside the floor wallet FOR → PRESS would fire.
  const vetoPress = vetoBase({ walletDetails: [wd('aaaaaa', 'home', 3500), wd('ffffff', 'home', 500), wd('dddddd', 'away', 50)] });
  eq(vetoPress.rung, null, 'PRESS vetoed'); eq(vetoPress.units, 0, '0u'); ok(vetoPress.reason.startsWith('fade_f_veto_of_PRESS:'), vetoPress.reason);
  eq(vetoPress.gate.pass, true, 'gate still recorded as passed underneath'); eq(vetoPress.presser.wallet, 'aaaaaa', 'presser still named');
  eq(vetoBase({ pickDate: '2026-10-06' }).rung, null, 'before live: no rung anyway (gate fail)');
  const prePress = vetoBase({ walletDetails: [wd('aaaaaa', 'home', 3500), wd('ffffff', 'home', 500), wd('dddddd', 'away', 50)], pickDate: '2026-10-06' });
  eq(prePress.rung, PRESS_STAKE_TIER, 'before live the PRESS stands'); eq(prePress.floorFade.status, 'VETO', 'read still VETO');
  // Veto legs fail-closed the same way: floor side at .65+ → no veto, PRESS stands.
  const favPress = vetoBase({ walletDetails: [wd('aaaaaa', 'home', 3500), wd('ffffff', 'home', 500), wd('dddddd', 'away', 50)], sideOdds: -200 });
  eq(favPress.rung, PRESS_STAKE_TIER, 'floor side at .667 → no veto'); eq(favPress.floorFade.reason, 'floor_fav_67', 'reason');

  // Rows carry the streak.
  const rows = pressWalletRows([wd('ffffff', 'away', 500)], 'home', SPORT, profilesF);
  eq(rows[0].streak, 3, 'row streak'); eq(rows[0].dir, 'AG', 'row dir');
  eq(pressWalletRows([wd('dddddd', 'home', 50)], 'home', SPORT, profilesF)[0].streak, 0, 'no form → streak 0');

  // Direct read helper.
  const ff = evaluateFloorFade(rows, 0.545);
  eq(ff.status, 'BOOST', 'direct BOOST'); eq(ff.floorImplied, 0.455, 'direct floor implied');
  eq(evaluateFloorFade([], 0.5).reason, 'no_floor_wallet', 'empty rows'); eq(evaluateFloorFade(null, 0.5).status, null, 'null rows');

  // Stamp.
  const st = pressStamp(r, 5);
  eq(st.v8_pressRung, 'FADE-F', 'stamp rung'); eq(st.v8_pressUnits, FADE_F_UNITS, 'stamp units');
  eq(st.v8_pressFloorFade.status, 'BOOST', 'stamp floor status'); eq(st.v8_pressFloorFade.wallet, 'ffffff', 'stamp floor wallet'); eq(st.v8_pressFloorFade.streak, 3, 'stamp streak');
  for (const [k, val] of Object.entries(st)) ok(val !== undefined, `stamp ${k} defined`);
  for (const [k, val] of Object.entries(st.v8_pressFloorFade)) ok(val !== undefined, `stamp floorFade.${k} defined`);
  const stV = pressStamp(v, 5);
  eq(stV.v8_pressRung, null, 'veto stamp rung null'); eq(stV.v8_pressUnits, 0, 'veto stamp 0u'); eq(stV.v8_pressFloorFade.status, 'VETO', 'veto stamp status');
  eq(pressStamp(evaluatePressLadder({ walletDetails: [], side: 'home', sport: SPORT }), 1).v8_pressFloorFade, null, 'empty eval → floorFade null');
}

// 15. TRUST layer (from 2026-10-09): statuses on every side, TRUST-G rescue, ML floor, spread/total cap
{
  eq(TRUST_FROM, '2026-10-09', 'TRUST live date');
  ok(!isTrustLive('2026-10-08') && isTrustLive('2026-10-09') && !isTrustLive(null), 'live gate');
  eq(TRUST_G_STAKE_TIER, 'TRUST-G', 'rung name'); eq(TRUST_G_UNITS, 3, 'TRUST-G 3u');
  eq(ML_FLOOR_UNITS, 4, 'gated ML floor 4u'); eq(ST_CAP_UNITS, 2, 'total cap 2u'); eq(SPREAD_CAP_UNITS, 2.5, 'spread cap 2.5u'); eq(TRUST_S_STAKE_TIER, 'TRUST-S', 'rung'); eq(TRUST_S_UNITS, 2, 'TRUST-S 2u'); eq(TRUST_S_PRESS_UNITS, 2.5, 'pressed 2.5u'); eq(TRUST_S_DOG_UNITS, 1, 'dog 1u'); eq(TRUST_S_IMPLIED_MIN, 0.5, 'window min'); eq(TRUST_S_IMPLIED_MAX, 0.7, 'window max'); eq(TRUST_S_CONVICTION_RATIO, 1.5, 'conviction'); eq(TRUST_TIER_MIN, 4, 'tier ≥ 4');

  const T = (status, tier, n = 40) => ({ status, tier, n, edge: tier >= 4 ? 6 : -2, formOn: status.endsWith('_ON') });
  const profileT = (short, sport, { n: bets, wr, dollarRoi, usual, trust = null, trustMkt = {} }) => {
    const byMarket = {};
    for (const [m, t] of Object.entries(trustMkt)) byMarket[m] = { trust: t };
    return [short, { bySport: { [sport]: {
      positions: { n: bets, wr, dollarRoi, invested: usual * bets, wins: Math.round(bets * wr / 100), settledPnl: 0 },
      trust, byMarket,
    } } }];
  };
  const profilesT = new Map([
    profileT('aaaaaa', SPORT, { n: 40, wr: 58, dollarRoi: 12, usual: 1000, trust: T('STABLE_ON', 5), trustMkt: { ML: T('STABLE_ON', 5), SPREAD: T('STABLE_OFF', 2) } }), // Door 2 presser, trusted
    profileT('bbbbbb', SPORT, { n: 20, wr: 48, dollarRoi: -5, usual: 500, trust: T('STABLE_ON', 4) }),   // seasoned, not Door 2, trusted
    profileT('gggggg', SPORT, { n: 20, wr: 48, dollarRoi: -5, usual: 500, trust: T('STABLE_ON', 3) }),   // tier 3 — not trusted
    profileT('hhhhhh', SPORT, { n: 20, wr: 48, dollarRoi: -5, usual: 500, trust: T('FALLEN_OFF', 5) }),  // tier 5 but fallen/off
    profileT('iiiiii', SPORT, { n: 20, wr: 48, dollarRoi: -5, usual: 500, trust: T('REGAINED_ON', 4) }), // regained — trusted
    profileT('dddddd', SPORT, { n: 3, wr: 67, dollarRoi: 20, usual: 100 }),                             // no trust stamp → UNPROVEN
  ]);
  const LIVE = '2026-10-09';
  const PRE = '2026-10-08';

  // Rows carry trust; the read names the trusted FOR wallets and counts both sides.
  const rows = pressWalletRows([wd('aaaaaa', 'home', 900), wd('hhhhhh', 'home', 400), wd('gggggg', 'away', 300), wd('dddddd', 'away', 50)], 'home', SPORT, profilesT, 'SPREAD');
  eq(rows[0].trust.status, 'STABLE_ON', 'row trust'); eq(rows[0].trustMkt.status, 'STABLE_OFF', 'row market trust (SPREAD)');
  eq(rows[3].trust, null, 'no stamp → null');
  const tr = trustRead(rows);
  eq(tr.gate, true, 'gate: aaaaaa tier 5 ON is FOR'); eq(tr.gateWallets.join(','), 'aaaaaa', 'gate wallets');
  eq(tr.forOn, 1, 'FOR on'); eq(tr.forOff, 1, 'FOR off (hhhhhh FALLEN_OFF)'); eq(tr.agOn, 1, 'AG on (gggggg tier 3 ON)'); eq(tr.agOff, 0, 'AG off');
  eq(tr.agTrusted.length, 0, 'tier 3 AG is not trusted'); eq(tr.mktGate, false, 'market gate: aaaaaa SPREAD status OFF');
  eq(tr.for.length, 2, 'two FOR'); eq(tr.ag.length, 2, 'two AG'); eq(tr.ag[1].status, 'UNPROVEN', 'missing → UNPROVEN'); eq(tr.ag[1].tier, 0, 'missing → tier 0');

  // A. TRUST-G: gate_fail moneyline, legacy V12 would have staked, trusted wallet FOR → 3u (4u inside the floor window)
  const gfail = (over = {}) => evaluatePressLadder({
    walletDetails: [wd('bbbbbb', 'home', 2000), wd('dddddd', 'away', 100)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profilesT, sideOdds: -115, steamOn: false,
    pickDate: LIVE, legacyUnits: 2, ...over,
  });
  const g = gfail();
  ok(!g.gate.pass, 'ladder gate fails (bbbbbb is not Door 2)');
  eq(g.rung, TRUST_G_STAKE_TIER, 'TRUST-G'); eq(g.units, ML_FLOOR_UNITS, '−115 is .535 implied → the window → 4u');
  ok(g.reason.startsWith('trust_g_for_bbbbbb_legacy2u:gate_fail:'), g.reason);
  ok(g.reason.endsWith('+ml_floor4_gate_bbbbbb'), g.reason);
  eq(g.trust.gate, true, 'trust gate'); eq(g.trust.rule, 'trust_g+ml_floor', 'rule'); eq(g.trust.lift, false, 'TRUST-G is not a lift');
  const g3 = gfail({ sideOdds: +110 });
  eq(g3.rung, TRUST_G_STAKE_TIER, 'TRUST-G at +110'); eq(g3.units, TRUST_G_UNITS, '+110 is .476 → outside the window → 3u');
  eq(g3.trust.rule, 'trust_g', 'rule trust_g only'); ok(g3.reason.endsWith(':no_seasoned_press') || !g3.reason.includes('ml_floor'), g3.reason);
  eq(gfail({ pickDate: PRE }).units, 0, 'before TRUST_FROM: 0u'); eq(gfail({ pickDate: PRE }).rung, null, 'before: no rung');
  eq(gfail({ pickDate: PRE }).trust.gate, true, 'before: statuses still read'); eq(gfail({ pickDate: PRE }).trust.rule, null, 'before: no rule');
  eq(gfail({ legacyUnits: 0 }).units, 0, 'legacy 0u → no rescue'); eq(gfail({ legacyUnits: null }).units, 0, 'legacy unknown → no rescue');
  eq(gfail({ marketType: 'SPREAD', sideOdds: -110 }).units, 0, 'spread → no TRUST-G');
  eq(gfail({ marketType: 'TOTAL', sideOdds: -110 }).units, 0, 'total → no TRUST-G');
  eq(gfail({ walletDetails: [wd('gggggg', 'home', 2000), wd('dddddd', 'away', 100)] }).units, 0, 'tier 3 FOR → no rescue');
  eq(gfail({ walletDetails: [wd('hhhhhh', 'home', 2000), wd('dddddd', 'away', 100)] }).units, 0, 'FALLEN_OFF tier 5 FOR → no rescue');
  eq(gfail({ walletDetails: [wd('dddddd', 'home', 2000), wd('bbbbbb', 'away', 100)] }).units, 0, 'trusted wallet AG only → no rescue');
  const reg = gfail({ walletDetails: [wd('iiiiii', 'home', 2000), wd('dddddd', 'away', 100)] });
  eq(reg.rung, TRUST_G_STAKE_TIER, 'REGAINED_ON tier 4 counts'); eq(reg.units, ML_FLOOR_UNITS, '4u in the window');
  // TRUST-G outside the window is 3u (oddsCap at the call site still trims long dogs); inside it rides the floor to 4u.
  const gDog = gfail({ sideOdds: +130 }); eq(gDog.rung, TRUST_G_STAKE_TIER, 'dog TRUST-G'); eq(gDog.units, TRUST_G_UNITS, 'dog 3u');
  eq(gfail({ sideOdds: -200 }).units, TRUST_G_UNITS, '−200 is .667 → outside → 3u');
  eq(gfail({ sideOdds: -185 }).units, ML_FLOOR_UNITS, '−185 is .649 → inside → 4u');
  eq(gfail({ sideOdds: +100 }).units, ML_FLOOR_UNITS, '+100 is .500 → inside → 4u');
  eq(gfail({ sideOdds: null }).units, TRUST_G_UNITS, 'no price → 3u');

  // B. Gated ML floor: staked moneyline rung under 4u, trusted wallet FOR, implied in [.50, .65) → 4u
  eq(ML_FLOOR_IMPLIED_MIN, 0.5, 'floor window from .50'); eq(ML_FLOOR_IMPLIED_MAX, 0.65, 'floor window to .65');
  const band4 = (over = {}) => evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 2200), wd('gggggg', 'away', 500)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profilesT, sideOdds: -130, steamOn: false,
    pickDate: LIVE, legacyUnits: 2, ...over,
  });
  const b4 = band4();
  eq(b4.band, 4, 'band 4'); eq(b4.rung, PRESS_STAKE_TIER, 'PRESS'); eq(b4.units, ML_FLOOR_UNITS, 'band 4 clean 2u at −130 (.565) with gate → 4u');
  ok(b4.reason.endsWith('+ml_floor4_gate_aaaaaa'), b4.reason); eq(b4.trust.rule, 'ml_floor', 'rule'); eq(b4.trust.lift, true, 'gated PRESS ML → lift flag');
  eq(band4({ pickDate: PRE }).units, PRESS_BAND_4_UNITS[0], 'before TRUST_FROM: 2u');
  const b4dog = band4({ sideOdds: +110 });
  eq(b4dog.units, PRESS_DOG_UNITS, 'dog (.476) → cap stands, no floor'); ok(!b4dog.reason.includes('ml_floor'), 'no floor suffix on a dog');
  const b4edge = band4({ sideOdds: +100 });
  eq(b4edge.units, ML_FLOOR_UNITS, '+100 is .50 → inside the window → floor');
  eq(band4({ sideOdds: -185 }).units, ML_FLOOR_UNITS, '−185 is .649 → inside the window → floor');
  const b4heavy = band4({ sideOdds: -186 });
  eq(b4heavy.units, PRESS_BAND_4_UNITS[2], '−186 is .650 → outside the window → band 4 step 2 (heavy fav) stays 2u'); ok(!b4heavy.reason.includes('ml_floor'), 'no floor suffix at .65+');
  eq(band4({ sideOdds: -300 }).units, PRESS_BAND_4_UNITS[2], '−300 → no floor');
  eq(band4({ sideOdds: null }).units, PRESS_BAND_4_UNITS[0], 'no price → no floor (odds unknown)');
  const b4steam = band4({ steamOn: true });
  eq(b4steam.units, ML_FLOOR_UNITS, 'band 4 moved 1u with gate → 4u');
  // Gate OFF at the same price → the rung's own units stand.
  const b4off = band4({ walletDetails: [wd('aaaaaa', 'home', 2200), wd('gggggg', 'away', 500)], walletProfiles: new Map([profile('aaaaaa', SPORT, { n: 40, wr: 58, dollarRoi: 12, usual: 1000 }), profile('gggggg', SPORT, { n: 20, wr: 48, dollarRoi: -5, usual: 500 })]) });
  eq(b4off.units, PRESS_BAND_4_UNITS[0], 'no trusted wallet FOR → 2u stands'); eq(b4off.trust.gate, false, 'gate off'); eq(b4off.trust.rule, null, 'no rule');
  // A trusted wallet AG only does not open the floor.
  const b4ag = band4({ walletDetails: [wd('aaaaaa', 'home', 2200), wd('bbbbbb', 'away', 500)], walletProfiles: new Map([profile('aaaaaa', SPORT, { n: 40, wr: 58, dollarRoi: 12, usual: 1000 }), profileT('bbbbbb', SPORT, { n: 20, wr: 48, dollarRoi: -5, usual: 500, trust: T('STABLE_ON', 4) })]) });
  eq(b4ag.units, PRESS_BAND_4_UNITS[0], 'trusted wallet AG only → no floor'); eq(b4ag.trust.agTrusted.join(','), 'bbbbbb', 'AG trusted recorded');
  const full = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 3500), wd('dddddd', 'away', 100)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profilesT, sideOdds: -120, steamOn: false, pickDate: LIVE, legacyUnits: 3,
  });
  eq(full.units, 5, '5u PRESS unchanged'); eq(full.trust.rule, null, 'no rule'); eq(full.trust.lift, true, 'gated 5u PRESS → lift flag');
  // Lift flag is false when no trusted wallet is FOR.
  const noGate = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 3500), wd('dddddd', 'away', 100)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: new Map([profile('aaaaaa', SPORT, { n: 40, wr: 58, dollarRoi: 12, usual: 1000 })]),
    sideOdds: -120, steamOn: false, pickDate: LIVE, legacyUnits: 3,
  });
  eq(noGate.units, 5, '5u'); eq(noGate.trust.gate, false, 'no stamp → no gate'); eq(noGate.trust.lift, false, 'no lift');

  // C. Spread cap 2.5u, total cap 2u
  const sp = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 3500), wd('dddddd', 'away', 100)],
    side: 'home', sport: SPORT, marketType: 'SPREAD', walletProfiles: profilesT, sideOdds: -110, steamOn: false, pickDate: LIVE,
  });
  eq(sp.band, 5, 'band 5 spread'); eq(sp.units, SPREAD_CAP_UNITS, '5u → 2.5u'); ok(sp.reason.endsWith('+sp_cap2.5'), sp.reason); eq(sp.trust.rule, 'sp_cap', 'rule');
  eq(sp.trust.lift, false, 'no lift on spreads'); eq(sp.trust.mktGate, false, 'aaaaaa SPREAD status OFF → market gate false');
  const tot = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 1600), wd('dddddd', 'away', 50)],
    side: 'over', sport: SPORT, marketType: 'TOTAL', walletProfiles: profilesT, sideOdds: -110, steamOn: false, pickDate: LIVE,
  });
  eq(tot.units, 0, 'over side with home wallets → no FOR rows… wallets are AG → gate fail');
  const tot2 = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'over', 1600), wd('dddddd', 'under', 50)],
    side: 'over', sport: SPORT, marketType: 'TOTAL', walletProfiles: profilesT, sideOdds: -110, steamOn: false, pickDate: LIVE,
  });
  eq(tot2.band, 3, 'band 3 total'); eq(tot2.units, 2, '3u → 2u'); eq(tot2.trust.rule, 'st_cap', 'rule');
  const spPre = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 3500), wd('dddddd', 'away', 100)],
    side: 'home', sport: SPORT, marketType: 'SPREAD', walletProfiles: profilesT, sideOdds: -110, steamOn: false, pickDate: PRE,
  });
  eq(spPre.units, 5, 'before TRUST_FROM: 5u spread stands');
  const sp2 = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 2200), wd('gggggg', 'away', 500)],
    side: 'home', sport: SPORT, marketType: 'SPREAD', walletProfiles: profilesT, sideOdds: -110, steamOn: false, pickDate: LIVE,
  });
  eq(sp2.units, 2, 'band 4 clean spread 2u unchanged'); eq(sp2.trust.rule, null, 'no rule when under the cap');

  // C2. TRUST-S: spreads off the wallet's status in THIS sport's spread market
  const profilesS = new Map([
    ...profilesT,
    profileT('ssssss', SPORT, { n: 20, wr: 48, dollarRoi: -5, usual: 1000, trustMkt: { SPREAD: T('STABLE_ON', 5) } }), // trusted on spreads only, not Door 2
    profileT('tttttt', SPORT, { n: 20, wr: 48, dollarRoi: -5, usual: 1000, trustMkt: { SPREAD: T('REGAINED_ON', 4) } }),
    profileT('uuuuuu', SPORT, { n: 20, wr: 48, dollarRoi: -5, usual: 1000, trustMkt: { SPREAD: T('FALLEN_OFF', 5), ML: T('STABLE_ON', 5) } }), // spread status OFF
  ]);
  const spr = (over = {}) => evaluatePressLadder({
    walletDetails: [wd('ssssss', 'home', 900), wd('dddddd', 'away', 50)],
    side: 'home', sport: SPORT, marketType: 'SPREAD', walletProfiles: profilesS, sideOdds: -110, steamOn: false, pickDate: LIVE, ...over,
  });
  const s1 = spr();
  ok(!s1.gate.pass, 'ladder gate fails (ssssss is not Door 2)');
  eq(s1.rung, TRUST_S_STAKE_TIER, 'TRUST-S'); eq(s1.units, TRUST_S_UNITS, '−110 (.524), one trusted FOR, no add-on → 2u');
  ok(s1.reason.startsWith('trust_s_for_ssssss_win2u:gate_fail'), s1.reason); eq(s1.trust.rule, 'trust_s', 'rule'); eq(s1.trust.mktGate, true, 'market gate');
  eq(s1.trust.mktFor[0].ratio, 0.9, 'market FOR row carries the size ratio'); eq(s1.trust.lift, false, 'no lift on spreads');
  const s2 = spr({ walletDetails: [wd('ssssss', 'home', 1500), wd('dddddd', 'away', 50)] });
  eq(s2.units, TRUST_S_PRESS_UNITS, 'conviction 1.5× → 2.5u'); ok(s2.reason.startsWith('trust_s_for_ssssss_conv_win2.5u:'), s2.reason);
  const s3 = spr({ walletDetails: [wd('ssssss', 'home', 900), wd('tttttt', 'home', 900), wd('dddddd', 'away', 50)] });
  eq(s3.units, TRUST_S_PRESS_UNITS, 'two trusted FOR → 2.5u'); ok(s3.reason.startsWith('trust_s_for_ssssss+tttttt_x2_win2.5u:'), s3.reason);
  eq(spr({ sideOdds: +120 }).units, 0, 'clean dog (.455) without an add-on → 0u'); eq(spr({ sideOdds: +120 }).trust.rule, null, 'no rule');
  const s5 = spr({ sideOdds: +120, walletDetails: [wd('ssssss', 'home', 1500), wd('dddddd', 'away', 50)] });
  eq(s5.units, TRUST_S_DOG_UNITS, 'clean dog with conviction → 1u'); ok(s5.reason.startsWith('trust_s_for_ssssss_conv_dog1u:'), s5.reason); eq(s5.rung, TRUST_S_STAKE_TIER, 'rung');
  eq(spr({ sideOdds: -250 }).units, 0, '.714 is outside the window → 0u');
  eq(spr({ sideOdds: -233 }).units, TRUST_S_UNITS, '−233 is .6997 → inside → 2u');
  eq(spr({ sideOdds: -234 }).units, 0, '−234 is .7006 → outside → 0u');
  eq(spr({ sideOdds: +100 }).units, TRUST_S_UNITS, '+100 is .500 → inside → 2u');
  eq(spr({ sideOdds: null }).units, 0, 'no price → no TRUST-S stake');
  eq(spr({ pickDate: PRE }).units, 0, 'before TRUST_FROM → 0u'); eq(spr({ pickDate: PRE }).trust.rule, null, 'before: no rule');
  eq(spr({ walletDetails: [wd('uuuuuu', 'home', 900), wd('dddddd', 'away', 50)] }).units, 0, 'spread status FALLEN_OFF (ML trusted) → not trusted here → 0u');
  eq(spr({ marketType: 'TOTAL', side: 'over', walletDetails: [wd('ssssss', 'over', 900), wd('dddddd', 'under', 50)] }).units, 0, 'TRUST-S is spreads only');
  // Veto: a wallet trusted in the spread market AGAINST zeroes the side, staked or not.
  const v1 = spr({ walletDetails: [wd('ssssss', 'home', 900), wd('tttttt', 'away', 900)] });
  eq(v1.units, 0, 'trusted FOR and trusted AG → veto'); eq(v1.trust.rule, 'trust_s_veto', 'rule'); ok(v1.reason.startsWith('trust_s_veto_ag_tttttt:'), v1.reason);
  const v2 = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 2200), wd('tttttt', 'away', 500)],
    side: 'home', sport: SPORT, marketType: 'SPREAD', walletProfiles: profilesS, sideOdds: -110, steamOn: false, pickDate: LIVE,
  });
  eq(v2.units, 0, 'ladder 2u PRESS spread with a trusted AG → 0u'); eq(v2.rung, null, 'rung cleared'); ok(v2.reason.startsWith('trust_s_veto_ag_tttttt:press_'), v2.reason);
  // Floor: a ladder-staked spread under the TRUST-S target rises to it and keeps its rung.
  const fl = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 2200), wd('ssssss', 'home', 1500), wd('gggggg', 'away', 500)],
    side: 'home', sport: SPORT, marketType: 'SPREAD', walletProfiles: profilesS, sideOdds: -110, steamOn: false, pickDate: LIVE,
  });
  eq(fl.rung, 'PRESS', 'rung stays PRESS'); eq(fl.units, TRUST_S_PRESS_UNITS, '2u PRESS + conviction trusted FOR → 2.5u'); ok(fl.reason.includes('+trust_s_for_ssssss_conv_win2.5u'), fl.reason); eq(fl.trust.rule, 'trust_s', 'rule');
  // Cap: a ladder 5u spread with a trusted FOR caps at 2.5u (no TRUST-S floor needed).
  const cp = evaluatePressLadder({
    walletDetails: [wd('aaaaaa', 'home', 3500), wd('ssssss', 'home', 900), wd('dddddd', 'away', 100)],
    side: 'home', sport: SPORT, marketType: 'SPREAD', walletProfiles: profilesS, sideOdds: -110, steamOn: false, pickDate: LIVE,
  });
  eq(cp.units, SPREAD_CAP_UNITS, '5u → 2.5u'); eq(cp.trust.rule, 'sp_cap', 'cap only');
  // Stamp
  const sst = pressStamp(s1, 3);
  eq(sst.v8_pressRung, 'TRUST-S', 'stamp rung'); eq(sst.v8_pressUnits, 2, 'stamp units'); eq(sst.v8_trustRule, 'trust_s', 'stamp rule'); eq(sst.v8_trustMktGate, true, 'stamp market gate');
  eq(sst.v8_trustMktFor[0].wallet, 'ssssss', 'stamp market FOR'); ok(!('ratio' in sst.v8_trustMktFor[0]), 'ratio is not stamped');

  // D. FADE-F veto stays a veto even with the gate on
  const vetoed = applyTrustLayer(
    { rung: null, units: 0, reason: 'fade_f_veto_of_none:x', gate: { pass: false } },
    { walletDetails: [wd('bbbbbb', 'home', 2000)], side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: profilesT, sideOdds: -115, pickDate: LIVE, legacyUnits: 2 },
  );
  eq(vetoed.units, 0, 'veto holds'); eq(vetoed.rung, null, 'no rung'); eq(vetoed.trust.gate, true, 'gate read anyway');

  // E. Stamp: v8_trust* on every side, nothing undefined
  const st = pressStamp(g, 7);
  eq(st.v8_pressRung, 'TRUST-G', 'stamp rung'); eq(st.v8_pressUnits, 4, 'stamp units');
  eq(st.v8_trustGate, true, 'stamp gate'); eq(st.v8_trustGateWallets.join(','), 'bbbbbb', 'stamp gate wallets'); eq(st.v8_trustRule, 'trust_g+ml_floor', 'stamp rule');
  eq(st.v8_trustFor[0].status, 'STABLE_ON', 'stamp FOR status'); eq(st.v8_trustAg[0].status, 'UNPROVEN', 'stamp AG status');
  eq(st.v8_trustCounts.forOn, 1, 'stamp counts'); eq(st.v8_trustLift, false, 'stamp lift'); eq(st.v8_trustMktGate, false, 'no ML market stamp on bbbbbb → false');
  for (const [k, val] of Object.entries(st)) ok(val !== undefined, `stamp ${k} defined`);
  for (const w of [...st.v8_trustFor, ...st.v8_trustAg]) for (const [k, val] of Object.entries(w)) ok(val !== undefined, `stamp wallet ${k} defined`);
  const stEmpty = pressStamp(evaluatePressLadder({ walletDetails: [], side: 'home', sport: SPORT }), 1);
  eq(stEmpty.v8_trustGate, null, 'empty eval → trust gate null'); eq(stEmpty.v8_trustFor, null, 'empty eval → FOR null'); eq(stEmpty.v8_trustRule, null, 'empty → rule null');
  const stNull = trustStamp(null);
  for (const [k, val] of Object.entries(stNull)) eq(val, null, `trustStamp(null).${k} null`);
  const stLift = pressStamp(full, 7); eq(stLift.v8_trustLift, true, 'lift stamped'); eq(stLift.v8_trustMktFor[0].status, 'STABLE_ON', 'ML market status stamped');
}

console.log(`testPressLadderOverlay: ${n} assertions passed`);
