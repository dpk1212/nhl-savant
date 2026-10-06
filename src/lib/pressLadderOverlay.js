/**
 * Press ladder — the authoritative stake policy from PRESS_LADDER_FROM.
 *
 * Research (Aug 1 → Oct 5, 3,184 V12 sides, day-of inputs): the side wins
 * when a seasoned wallet sizes up on it, the money is with it, and no
 * informed wallet is against it. Agreement, quality margin, form, history
 * vs price and every rescue path were negative without a press.
 *
 * Gate (all four, read from the live walletDetails each cycle until T-15):
 *   1. money share   Σ$ FOR ÷ Σ$ (FOR + AG) ≥ 0.60
 *   2. seasoned press ≥1 FOR wallet with sport book n ≥ 15 and
 *                    sizeRatio ≥ 1.5 (invested ÷ sport-local usual stake)
 *   3. no Door-2 AG  zero AG wallets whose sport book is Door-2 CONFIRMED
 *                    (n ≥ 6, WR ≥ 55, $ROI > 3 — whitelistTier.js)
 *   4. Door-2 FOR    ≥1 FOR wallet whose sport book is Door-2 CONFIRMED
 *
 * Ladder (1–5u) from the biggest seasoned press on the side:
 *   band  ≥3× → 5 · ≥2× → 4 · else 3
 *   price −0 clean (no steam, not a heavy ML favorite ≥ 60% implied)
 *         −1 moved and FOR-wallet edge ≥ 0
 *         −2 moved and FOR-wallet edge < 0
 *   edge = mean sport WR of FOR wallets with n ≥ 10, minus the implied win %
 *          of the ticket price (ML) or 52.4 (spreads / totals at −110).
 *
 * Rescue rung R6 (1u) when gate 2 fails: ≥2 FOR wallets with n ≥ 15 each at
 * sizeRatio ≥ 1.0, zero Door-2 AG, money ≥ 0.60. Promotion to 2u only after
 * 60 stamped R6 plays with positive flat ROI; removed if 60 are negative.
 *
 * Exception rung PRESS-X (2u) when ONLY gate 3 fails: gates 1, 2, 4 pass,
 * Door-2 margin (FOR − AG) ≥ 1, and every Door-2 AG wallet is betting under
 * its own sport-local usual size (sizeRatio < 1.0). Research on the 99
 * gate-3-only failures: 18-5 +32.5% (P2 +33.5%, P3 +31.5%), fourteen
 * different lead pressers. Tied/negative margin −2.4%; AG at/over normal
 * size −4.8%; more presses FOR did not rescue (−7.5%). Flat 2u, no price
 * step (clean 8-3, moved 10-2). Judged in the stamp record like R6.
 *
 * Rung PRESS-N when gate 4 fails with nothing informed on either side:
 * money ≥ 0.60, seasoned press ≥ 1.5×, zero Door-2 FOR and zero Door-2 AG,
 * and the biggest presser's sport book has ≥ 50 bets → 2u clean / 1u moved.
 * Research: 66-32 +20.6% flat (P1 +20.7%, P2 +13.3%, P3 +26.7%), 21 lead
 * pressers; clean 42-18 +32.7%, moved 24-14 +1.6%; presser with 30-49 bets
 * was 10-11 −25.0%, so the depth line is part of the rule.
 *
 * Rescue rung PRESS-U (1u) when gate 2 fails for the same shape: money ≥ 0.60,
 * Door-2 FOR ≥ 1, Door-2 margin ≥ 1, every Door-2 AG wallet under 1.0× its
 * usual size, no seasoned press. Research 18-11 +11.9% (P2 −15.5%, P3 +26.4%)
 * on 29 plays — directional, not period-confirmed; shipped at 1u on the R6
 * contract (promote after 60 stamped plays positive, remove if 60 negative).
 *
 * Rescue rung STEAM-C (1u) — the market overrules a small dissent. Pinnacle
 * steam is ON toward this side (the same steamOn the price step reads),
 * ≥1 Door-2 AG wallet, Door-2 margin (FOR − AG) ≤ 0, every Door-2 AG wallet
 * under 1.0× its usual size, and no seasoned press against (AG n ≥ 15 at
 * ≥ 1.5×). No money gate. Research on the steam era (Aug 19 → Oct 5, 2,352
 * sides at 0u): 57-27 +31.6% flat, positive in all four half-months
 * (+16.8 · +51.5 · +28.6 · +21.3), ML 27-14 / spread 8-3 / total 22-10,
 * already-on 27-14 / arriving 30-13, 28 of 39 days positive; p 0.0001 vs
 * the 0u pile. The same wallet shape with steam OFF is 134-167 −17.6%, and
 * steam toward a side the proven wallets are FOR is negative (margin ≥ +1
 * with steam 88-101 −16.0%) — steam only matters as the book disagreeing
 * with a proven wallet. A Door-2 AG at/over 1.0× (43-49 −3.5%) or a press
 * against (35-41 −6.4%) kills it. Same promotion contract as R6.
 *
 * Everything else between the v12 score gate and the odds cap (HC ladder,
 * rescues, floors, tape, EDGE bands, the mute chain, HARD+ layer, form×tier)
 * is retired for pickDate ≥ PRESS_LADDER_FROM. The v12 score > 0 gate,
 * manual stake, oddsCap, operator kill and the T-15 freeze stay.
 *
 * Fail-closed: missing walletDetails or profiles → nothing fires (0u).
 */
import { isConfirmedSportRec } from './whitelistTier.js';
import { stakeSizeRatio } from './sizeRatioBands.js';

/** Stakes follow the press ladder for pick dates on/after this. */
export const PRESS_LADDER_FROM = '2026-10-06';
/** Shadow stamps (v8_press*) are written from this date regardless. */
export const PRESS_STAMP_FROM = '2026-10-06';

export const PRESS_MONEY_MIN = 0.6;
export const PRESS_SEASONED_N = 15;
export const PRESS_RATIO_MIN = 1.5;
export const PRESS_BAND_5 = 3.0;
export const PRESS_BAND_4 = 2.0;
export const PRESS_EDGE_MIN_N = 10;
export const PRESS_HEAVY_FAV_IMPLIED = 0.60;
export const PRESS_ST_IMPLIED_PCT = 52.4;

export const R6_MIN_VETERANS = 2;
export const R6_RATIO_MIN = 1.0;
export const R6_UNITS = 1;

/** PRESS-X: Door-2 margin (FOR − AG) must be at least this. */
export const PRESS_X_MIN_MARGIN = 1;
/** PRESS-X: every Door-2 AG wallet must be under this × its usual size. */
export const PRESS_X_AG_RATIO_MAX = 1.0;
export const PRESS_X_UNITS = 2;
/** PRESS-N: no Door-2 wallet on either side; presser book must be this deep. */
export const PRESS_N_MIN_PRESSER_N = 50;
export const PRESS_N_UNITS_CLEAN = 2;
export const PRESS_N_UNITS_MOVED = 1;
/** PRESS-U: the same shape with no seasoned press, rescued at 1u. */
export const PRESS_U_UNITS = 1;
/** STEAM-C: Door-2 margin (FOR − AG) must be at most this. */
export const STEAM_C_MAX_MARGIN = 0;
export const STEAM_C_UNITS = 1;

export const PRESS_STAKE_TIER = 'PRESS';
export const PRESS_R6_STAKE_TIER = 'PRESS-R6';
export const PRESS_X_STAKE_TIER = 'PRESS-X';
export const PRESS_U_STAKE_TIER = 'PRESS-U';
export const PRESS_N_STAKE_TIER = 'PRESS-N';
export const STEAM_C_STAKE_TIER = 'STEAM-C';
export const PRESS_GATE_MUTED_BY = 'press-gate';

export function isPressLadderLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= PRESS_LADDER_FROM;
}

export function isPressStampLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= PRESS_STAMP_FROM;
}

function shortId(wallet) {
  return String(wallet || '').slice(-6).toLowerCase();
}

export function profileForWallet(walletProfiles, wallet) {
  if (!walletProfiles) return null;
  const short = shortId(wallet);
  if (!short) return null;
  if (typeof walletProfiles.get === 'function') {
    return walletProfiles.get(short)
      || walletProfiles.get(short.toUpperCase())
      || walletProfiles.get(String(wallet || '').toLowerCase())
      || null;
  }
  return walletProfiles[short] || walletProfiles[short.toUpperCase()] || null;
}

export function impliedFromAmerican(o) {
  if (o == null || !Number.isFinite(Number(o)) || Number(o) === 0) return null;
  const n = Number(o);
  return n < 0 ? Math.abs(n) / (Math.abs(n) + 100) : 100 / (n + 100);
}

/**
 * Sport book for one wallet as production exports it:
 * profile.bySport[sport].positions = { n, wins, wr, invested, settledPnl, dollarRoi }.
 */
export function sportBook(profile, sport) {
  const rec = profile?.bySport?.[sport];
  const pos = rec?.positions;
  if (!pos || typeof pos !== 'object') return null;
  const n = Number(pos.n) || 0;
  const wr = Number(pos.wr);
  return {
    n,
    wr: Number.isFinite(wr) ? wr : null,
    door2: isConfirmedSportRec(rec),
  };
}

/**
 * Per-wallet row the gate reads: direction, dollars, sport-local size ratio,
 * sport book depth / WR / Door-2 flag.
 */
export function pressWalletRows(walletDetails, side, sport, walletProfiles) {
  const rows = [];
  for (const wd of walletDetails || []) {
    if (!wd || !wd.side) continue;
    const invested = Number(wd.invested) || 0;
    if (!(invested > 0)) continue;
    const profile = profileForWallet(walletProfiles, wd.wallet);
    const book = sportBook(profile, sport);
    const sr = stakeSizeRatio(wd, profile, sport);
    rows.push({
      wallet: shortId(wd.wallet),
      dir: wd.side === side ? 'FOR' : 'AG',
      invested,
      ratio: Number.isFinite(sr) && sr > 0 ? sr : null,
      n: book?.n ?? 0,
      wr: book?.wr ?? null,
      door2: book?.door2 === true,
    });
  }
  return rows;
}

export function pressBand(maxRatio) {
  if (!Number.isFinite(maxRatio) || maxRatio < PRESS_RATIO_MIN) return null;
  if (maxRatio >= PRESS_BAND_5) return 5;
  if (maxRatio >= PRESS_BAND_4) return 4;
  return 3;
}

/**
 * Mean sport WR of FOR wallets with n ≥ 10 minus the implied win % of the
 * price. Null when no FOR wallet is deep enough.
 */
export function pressEdge(rows, marketType, sideOdds) {
  const deep = rows.filter((r) => r.dir === 'FOR' && r.n >= PRESS_EDGE_MIN_N && Number.isFinite(r.wr));
  if (deep.length === 0) return null;
  const meanWr = deep.reduce((t, r) => t + r.wr, 0) / deep.length;
  let impliedPct = PRESS_ST_IMPLIED_PCT;
  if (String(marketType).toUpperCase() === 'ML') {
    const p = impliedFromAmerican(sideOdds);
    if (p != null) impliedPct = p * 100;
  }
  return meanWr - impliedPct;
}

export function isHeavyFavorite(marketType, sideOdds) {
  if (String(marketType).toUpperCase() !== 'ML') return false;
  const p = impliedFromAmerican(sideOdds);
  return p != null && p >= PRESS_HEAVY_FAV_IMPLIED;
}

export function pressPriceStep({ steamOn, heavyFav, edge }) {
  const clean = !steamOn && !heavyFav;
  if (clean) return 0;
  return edge != null && edge >= 0 ? 1 : 2;
}

/**
 * Evaluate the gate, the ladder and the R6 rung for one side.
 *
 * @returns {{
 *   gate: { money: boolean, seasPress: boolean, noDoor2Ag: boolean, door2For: boolean, pass: boolean },
 *   moneyShare: number|null, door2Ag: number, door2For: number,
 *   presser: { wallet, ratio, n, wr }|null, maxRatio: number,
 *   band: number|null, priceStep: number|null, edge: number|null,
 *   steamOn: boolean, heavyFav: boolean,
 *   veterans: Array<{ wallet, ratio, n, wr }>,
 *   dissenters: Array<{ wallet, ratio, n, wr }>,
 *   rung: 'PRESS'|'PRESS-X'|'PRESS-N'|'PRESS-U'|'STEAM-C'|'PRESS-R6'|null, units: number, reason: string
 * }}
 */
export function evaluatePressLadder({
  walletDetails,
  side,
  sport,
  marketType,
  walletProfiles,
  sideOdds = null,
  steamOn = false,
} = {}) {
  const empty = {
    gate: { money: false, seasPress: false, noDoor2Ag: false, door2For: false, pass: false },
    moneyShare: null, door2Ag: 0, door2For: 0,
    presser: null, maxRatio: 0, band: null, priceStep: null, edge: null,
    steamOn: !!steamOn, heavyFav: isHeavyFavorite(marketType, sideOdds),
    veterans: [], dissenters: [], rung: null, units: 0, reason: 'no_wallet_details',
  };
  if (!Array.isArray(walletDetails) || walletDetails.length === 0 || !side || !sport) return empty;
  if (!walletProfiles) return { ...empty, reason: 'no_wallet_profiles' };

  const rows = pressWalletRows(walletDetails, side, sport, walletProfiles);
  if (rows.length === 0) return { ...empty, reason: 'no_wallet_rows' };

  const forRows = rows.filter((r) => r.dir === 'FOR');
  const agRows = rows.filter((r) => r.dir === 'AG');
  const dollarsFor = forRows.reduce((t, r) => t + r.invested, 0);
  const dollarsAll = rows.reduce((t, r) => t + r.invested, 0);
  const moneyShare = dollarsAll > 0 ? dollarsFor / dollarsAll : null;

  const seasonedFor = forRows.filter((r) => r.n >= PRESS_SEASONED_N && Number.isFinite(r.ratio));
  const pressers = seasonedFor
    .filter((r) => r.ratio >= PRESS_RATIO_MIN)
    .sort((a, b) => b.ratio - a.ratio);
  const presser = pressers[0] || null;
  const maxRatio = presser ? presser.ratio : 0;
  const door2Ag = agRows.filter((r) => r.door2).length;
  const door2For = forRows.filter((r) => r.door2).length;

  const gate = {
    money: moneyShare != null && moneyShare >= PRESS_MONEY_MIN,
    seasPress: pressers.length >= 1,
    noDoor2Ag: door2Ag === 0,
    door2For: door2For >= 1,
    pass: false,
  };
  gate.pass = gate.money && gate.seasPress && gate.noDoor2Ag && gate.door2For;

  const heavyFav = isHeavyFavorite(marketType, sideOdds);
  const edge = pressEdge(rows, marketType, sideOdds);
  const strip = (r) => ({ wallet: r.wallet, ratio: Math.round(r.ratio * 100) / 100, n: r.n, wr: r.wr });

  if (gate.pass) {
    const band = pressBand(maxRatio);
    const priceStep = pressPriceStep({ steamOn: !!steamOn, heavyFav, edge });
    const units = Math.max(1, band - priceStep);
    return {
      gate, moneyShare, door2Ag, door2For,
      presser: strip(presser), maxRatio, band, priceStep, edge,
      steamOn: !!steamOn, heavyFav,
      veterans: [],
      dissenters: [],
      rung: PRESS_STAKE_TIER, units,
      reason: `press_${band}_${priceStep === 0 ? 'clean' : (priceStep === 1 ? 'moved_edge_pos' : 'moved_edge_neg')}`,
    };
  }

  // PRESS-X — only gate 3 failed, informed FOR outnumber informed AG, and
  // every informed AG wallet is under its own normal size.
  const dissenters = agRows.filter((r) => r.door2).sort((a, b) => b.ratio - a.ratio);
  const margin = door2For - door2Ag;
  const pressX = gate.money && gate.seasPress && gate.door2For && !gate.noDoor2Ag
    && margin >= PRESS_X_MIN_MARGIN
    && dissenters.length > 0
    && dissenters.every((r) => Number.isFinite(r.ratio) && r.ratio < PRESS_X_AG_RATIO_MAX);
  if (pressX) {
    return {
      gate, moneyShare, door2Ag, door2For,
      presser: strip(presser), maxRatio, band: pressBand(maxRatio), priceStep: null, edge,
      steamOn: !!steamOn, heavyFav,
      veterans: [],
      dissenters: dissenters.map(strip),
      rung: PRESS_X_STAKE_TIER, units: PRESS_X_UNITS,
      reason: `press_x_margin${margin}_ag_under_size`,
    };
  }

  // PRESS-N — a deep-book press with the money and no informed wallet on
  // either side. Without a Door-2 wallet to vouch, the press itself must
  // come from a long record; price moved halves it.
  const pressN = gate.money && gate.seasPress && !gate.door2For && gate.noDoor2Ag
    && presser && presser.n >= PRESS_N_MIN_PRESSER_N;
  if (pressN) {
    const moved = !!steamOn || heavyFav;
    return {
      gate, moneyShare, door2Ag, door2For,
      presser: strip(presser), maxRatio, band: pressBand(maxRatio), priceStep: moved ? 1 : 0, edge,
      steamOn: !!steamOn, heavyFav,
      veterans: [],
      dissenters: [],
      rung: PRESS_N_STAKE_TIER, units: moved ? PRESS_N_UNITS_MOVED : PRESS_N_UNITS_CLEAN,
      reason: `press_n_deep${presser.n}_${moved ? 'moved' : 'clean'}`,
    };
  }

  // PRESS-U — the PRESS-X shape with no seasoned press: proven FOR outnumber
  // proven AG and every proven AG wallet is under its own normal size. 1u.
  const pressU = gate.money && !gate.seasPress && gate.door2For && !gate.noDoor2Ag
    && margin >= PRESS_X_MIN_MARGIN
    && dissenters.length > 0
    && dissenters.every((r) => Number.isFinite(r.ratio) && r.ratio < PRESS_X_AG_RATIO_MAX);
  if (pressU) {
    return {
      gate, moneyShare, door2Ag, door2For,
      presser: null, maxRatio, band: null, priceStep: null, edge,
      steamOn: !!steamOn, heavyFav,
      veterans: [],
      dissenters: dissenters.map(strip),
      rung: PRESS_U_STAKE_TIER, units: PRESS_U_UNITS,
      reason: `press_u_margin${margin}_ag_under_size_no_press`,
    };
  }

  // STEAM-C — the market overrules a small dissent: Pinnacle steam toward
  // this side, proven wallets net against (margin ≤ 0) but every one of
  // them under its own normal size, and nobody seasoned pressing against.
  const pressAg = agRows.some((r) => r.n >= PRESS_SEASONED_N && Number.isFinite(r.ratio) && r.ratio >= PRESS_RATIO_MIN);
  const steamC = !!steamOn && !gate.noDoor2Ag
    && margin <= STEAM_C_MAX_MARGIN
    && dissenters.length > 0
    && dissenters.every((r) => Number.isFinite(r.ratio) && r.ratio < PRESS_X_AG_RATIO_MAX)
    && !pressAg;
  if (steamC) {
    return {
      gate, moneyShare, door2Ag, door2For,
      presser: presser ? strip(presser) : null, maxRatio, band: null, priceStep: null, edge,
      steamOn: !!steamOn, heavyFav,
      veterans: [],
      dissenters: dissenters.map(strip),
      rung: STEAM_C_STAKE_TIER, units: STEAM_C_UNITS,
      reason: `steam_c_margin${margin}_ag_under_size_steam_on`,
    };
  }

  // R6 — two veterans at normal size, only when there is no seasoned press.
  const veterans = seasonedFor.filter((r) => r.ratio >= R6_RATIO_MIN).sort((a, b) => b.ratio - a.ratio);
  const r6 = !gate.seasPress
    && veterans.length >= R6_MIN_VETERANS
    && gate.noDoor2Ag
    && gate.money;
  if (r6) {
    return {
      gate, moneyShare, door2Ag, door2For,
      presser: null, maxRatio, band: null, priceStep: null, edge,
      steamOn: !!steamOn, heavyFav,
      veterans: veterans.map(strip),
      dissenters: [],
      rung: PRESS_R6_STAKE_TIER, units: R6_UNITS,
      reason: 'r6_two_veterans',
    };
  }

  const failed = [];
  if (!gate.money) failed.push('money');
  if (!gate.seasPress) failed.push('no_seasoned_press');
  if (!gate.noDoor2Ag) failed.push('door2_against');
  if (!gate.door2For) failed.push('no_door2_for');
  return {
    gate, moneyShare, door2Ag, door2For,
    presser: presser ? strip(presser) : null, maxRatio, band: null, priceStep: null, edge,
    steamOn: !!steamOn, heavyFav,
    veterans: veterans.map(strip),
    dissenters: dissenters.map(strip),
    rung: null, units: 0,
    reason: `gate_fail:${failed.join(',')}`,
  };
}

/** Compact Firestore stamp for the shadow / live record. */
export function pressStamp(evalResult, now) {
  if (!evalResult) return null;
  const e = evalResult;
  return {
    v8_pressGate: {
      money: e.gate.money,
      seasPress: e.gate.seasPress,
      noDoor2Ag: e.gate.noDoor2Ag,
      door2For: e.gate.door2For,
      pass: e.gate.pass,
    },
    v8_pressMoneyShare: e.moneyShare == null ? null : Math.round(e.moneyShare * 1000) / 1000,
    v8_pressDoor2Ag: e.door2Ag,
    v8_pressDoor2For: e.door2For,
    v8_pressPresser: e.presser,
    v8_pressVeterans: e.veterans.length ? e.veterans.slice(0, 4) : null,
    v8_pressDissenters: Array.isArray(e.dissenters) && e.dissenters.length ? e.dissenters.slice(0, 4) : null,
    v8_pressBand: e.band,
    v8_pressPriceStep: e.priceStep,
    v8_pressEdge: e.edge == null ? null : Math.round(e.edge * 10) / 10,
    v8_pressSteamOn: e.steamOn,
    v8_pressHeavyFav: e.heavyFav,
    v8_pressRung: e.rung,
    v8_pressUnits: e.units,
    v8_pressReason: e.reason,
    v8_pressAt: now,
  };
}
