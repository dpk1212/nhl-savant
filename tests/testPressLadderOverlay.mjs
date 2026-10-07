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
  eq(r.units, 3, '3u');
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
  eq(r.units, PRESS_X_UNITS, '2u, no price step even when moved');
  eq(r.dissenters.length, 1, 'dissenter recorded');
  eq(r.dissenters[0].wallet, 'cccccc', 'dissenter wallet');
  ok(r.reason.startsWith('press_x_margin1'), r.reason);
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
  eq(r.units, PRESS_U_UNITS, '1u');
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
  eq(r.units, STEAM_C_UNITS, '1u');
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
  eq(neg.rung, STEAM_C_STAKE_TIER, 'STEAM-C has no money gate'); eq(neg.units, STEAM_C_UNITS, '1u');
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
  eq(st.v8_pressRung, 'STEAM-C', 'stamp rung'); eq(st.v8_pressUnits, 1, 'stamp units'); eq(st.v8_pressSteamOn, true, 'stamp steam');
}

// 4f. PRESS-N: deep-book press (n≥50, not Door 2), money, no Door-2 wallet anywhere
{
  const deep = new Map([...profiles, profile('hhhhhh', SPORT, { n: 60, wr: 50, dollarRoi: 0, usual: 1000 })]);
  const clean = evaluatePressLadder({
    walletDetails: [wd('hhhhhh', 'home', 2000), wd('bbbbbb', 'away', 300)],   // 2.0× press · bbbbbb not Door 2
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: deep, sideOdds: -120,
  });
  ok(!clean.gate.door2For && clean.gate.noDoor2Ag, 'no Door-2 either side');
  eq(clean.rung, PRESS_N_STAKE_TIER, 'PRESS-N fires clean'); eq(clean.units, PRESS_N_UNITS_CLEAN, '2u clean');
  eq(clean.presser.wallet, 'hhhhhh', 'presser stamped'); eq(clean.priceStep, 0, 'clean step 0');
  ok(clean.reason === 'press_n_deep60_clean', clean.reason);
  const moved = evaluatePressLadder({
    walletDetails: [wd('hhhhhh', 'home', 2000), wd('bbbbbb', 'away', 300)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: deep, sideOdds: -120, steamOn: true,
  });
  eq(moved.rung, PRESS_N_STAKE_TIER, 'PRESS-N fires moved'); eq(moved.units, PRESS_N_UNITS_MOVED, '1u moved'); eq(moved.priceStep, 1, 'moved step 1');
  const heavy = evaluatePressLadder({
    walletDetails: [wd('hhhhhh', 'home', 2000), wd('bbbbbb', 'away', 300)],
    side: 'home', sport: SPORT, marketType: 'ML', walletProfiles: deep, sideOdds: -250,
  });
  eq(heavy.units, PRESS_N_UNITS_MOVED, 'heavy favourite counts as moved → 1u');
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

// 7. R6: two seasoned FOR at ≥1.0×, no press, no Door-2 AG, money ≥ 60% → 1u PRESS-R6
{
  const r = evaluatePressLadder({
    walletDetails: [wd('bbbbbb', 'over', 600), wd('eeeeee', 'over', 900), wd('dddddd', 'under', 100)],
    side: 'over', sport: SPORT, marketType: 'TOTAL', walletProfiles: profiles, sideOdds: -110,
  });
  ok(!r.gate.seasPress, 'no press (1.2× and 1.125×)');
  eq(r.rung, PRESS_R6_STAKE_TIER, 'R6 fires');
  eq(r.units, 1, '1u');
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
  eq(r.rung, STEAM_S_STAKE_TIER, 'STEAM-S fires: steam on, no press, AG 1.2×, seasoned 0v1, money 0.40'); eq(r.units, STEAM_S_UNITS, '1u');
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
  eq(st.v8_pressRung, 'STEAM-S', 'stamp rung'); eq(st.v8_pressUnits, 1, 'stamp units'); eq(st.v8_pressSteamOn, true, 'stamp steam');
  eq(st.v8_pressDissenters[0].wallet, 'bbbbbb', 'stamp records the seasoned AG'); eq(st.v8_pressPresser, null, 'no presser');
  for (const [k, v] of Object.entries(st)) ok(v !== undefined, `stamp ${k} defined`);
}

console.log(`testPressLadderOverlay: ${n} assertions passed`);
