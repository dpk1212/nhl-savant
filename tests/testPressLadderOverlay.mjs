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

console.log(`testPressLadderOverlay: ${n} assertions passed`);
