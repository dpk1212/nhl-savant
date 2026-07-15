/**
 * Wallet CLV skill — causal % +CLV for stake sizing.
 *
 * Legacy top2 FOR-only gate (kept for stamps / audit):
 *   • Cancel top2Pct ≤ 59  → left-tail poison
 *   • Boost  top2Pct ≥ 74  → right-tail size up
 *
 * Ship (2026-07-15+): TAPE = 1.5·(EDGE/10) + 2·(netCLV/10)
 *   netCLV = mean(FOR %+CLV) − (mean(AG %+CLV) ?? PRIOR_AG=62)
 *   • Mute  tape < 0     → 0u (fail-open if tape missing)
 *   • Hold  mid tape     → keep path units
 *   • Boost tape ≥ 2.89  → path × 1.35 (oddsCap, 6u cap)
 *
 * top2Pct = mean of the two highest FOR wallets' causal % of graded
 * positions with CLV > 0 (n ≥ MIN_N, as-of before the pick date).
 */

export const CLV_HIST_FROM = '2026-04-01';
export const CLV_SKILL_MIN_N = 5;
export const CLV_TOP2_CANCEL_MAX = 59;   // inclusive: ≤ 59 → cancel
export const CLV_TOP2_BOOST_MIN = 74;    // inclusive: ≥ 74 → boost
export const CLV_TOP2_BOOST_MULT = 1.35;
export const CLV_TOP2_BOOST_ADD = 2;
export const GLOBAL_UNIT_CAP = 6;

/** netCLV / tape sizing (replaces top2 unit effects from TAPE_SIZING_LIVE_FROM). */
export const NET_CLV_PRIOR_AG = 62;
export const TAPE_EDGE_WEIGHT = 1.5;
export const TAPE_NET_WEIGHT = 2;
export const TAPE_MUTE_BELOW = 0;       // ≈ June15+ path-stamped p40
export const TAPE_BOOST_ABOVE = 2.89;   // ≈ June15+ path-stamped p80
export const TAPE_BOOST_MULT = 1.35;
export const TAPE_SIZING_LIVE_FROM = '2026-07-15';

export function isTapeSizingLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= TAPE_SIZING_LIVE_FROM;
}

export function shortWalletId(w) {
  return String(w || '').toLowerCase().slice(-6);
}

function impliedProb(odds) {
  if (odds == null || odds === 0 || !Number.isFinite(Number(odds))) return null;
  const o = Number(odds);
  return o < 0 ? Math.abs(o) / (Math.abs(o) + 100) : 100 / (o + 100);
}

/** CLV in probability points (close − entry) × 100. Prefers pinn→pinn, else PM avgPrice proxy. */
export function computePositionClv(pos) {
  if (!pos || typeof pos !== 'object') return null;
  if (pos.clv != null && Number.isFinite(Number(pos.clv))) return Number(pos.clv);
  const closeProb = impliedProb(pos.closingPinnacleOdds);
  if (closeProb == null) return null;
  const entryPinn = pos.entryPinnacleOdds ?? pos.pinnacleOdds ?? null;
  if (entryPinn != null && impliedProb(entryPinn) != null) {
    return (closeProb - impliedProb(entryPinn)) * 100;
  }
  const entryPm = pos.entryAvgPrice ?? pos.avgPrice ?? null;
  if (entryPm != null && entryPm > 0.01 && entryPm < 0.99) {
    return (closeProb - entryPm) * 100;
  }
  return null;
}

/**
 * Build Map<walletShort, Array<{ date, clv }>> sorted by date ascending.
 * Only includes events on/after `since` with computable CLV.
 */
export function buildClvLedgerFromPositions(positions, { since = CLV_HIST_FROM } = {}) {
  const map = new Map();
  if (!Array.isArray(positions)) return map;
  for (const pos of positions) {
    if (!pos?.date || pos.date < since) continue;
    const short = shortWalletId(pos.walletShort || pos.wallet);
    if (!short || short.length < 4) continue;
    const clv = computePositionClv(pos);
    if (clv == null || !Number.isFinite(clv)) continue;
    if (!map.has(short)) map.set(short, []);
    map.get(short).push({ date: pos.date, clv });
  }
  for (const arr of map.values()) arr.sort((a, b) => a.date.localeCompare(b.date));
  return map;
}

/** Causal % of CLV>0 grades for a wallet strictly before asOfDate. null if n < MIN_N. */
export function causalPctPos(ledger, walletShort, asOfDate, { minN = CLV_SKILL_MIN_N } = {}) {
  const short = shortWalletId(walletShort);
  const arr = ledger?.get?.(short);
  if (!arr || !asOfDate) return null;
  let n = 0;
  let nPos = 0;
  for (const e of arr) {
    if (e.date >= asOfDate) break;
    n++;
    if (e.clv > 0) nPos++;
  }
  if (n < minN) return null;
  return (100 * nPos) / n;
}

/**
 * Mean of the top-1 or top-2 FOR wallet causal % +CLV values.
 * FOR wallets = walletDetails entries on `side` (or missing side treated as for).
 */
export function computeForTop2PctPos(walletDetails, side, asOfDate, ledger, opts = {}) {
  const minN = opts.minN ?? CLV_SKILL_MIN_N;
  if (!Array.isArray(walletDetails) || !side || !asOfDate || !ledger) {
    return { top2Pct: null, nForSkill: 0, wallets: [] };
  }
  const pcts = [];
  const seen = new Set();
  for (const w of walletDetails) {
    if (!w) continue;
    if (w.side && w.side !== side) continue;
    const short = shortWalletId(w.wallet || w.walletShort);
    if (!short || seen.has(short)) continue;
    seen.add(short);
    const pct = causalPctPos(ledger, short, asOfDate, { minN });
    if (pct == null) continue;
    pcts.push({ wallet: short, pctPos: pct });
  }
  pcts.sort((a, b) => b.pctPos - a.pctPos);
  if (!pcts.length) return { top2Pct: null, nForSkill: 0, wallets: [] };
  const top = pcts.slice(0, Math.min(2, pcts.length));
  const top2Pct = top.reduce((a, b) => a + b.pctPos, 0) / top.length;
  return {
    top2Pct: Math.round(top2Pct * 100) / 100,
    nForSkill: pcts.length,
    wallets: top,
  };
}

/**
 * Apply cancel / hold / boost + global 6u cap.
 *
 * @param {object} args
 * @param {number} args.units - pre-policy units (already odds-capped by caller paths)
 * @param {number|null} args.odds - American odds for post-boost oddsCap
 * @param {number|null} args.top2Pct
 * @param {function} [args.oddsCapFn] - (units, odds) => units; optional
 * @returns {{ units: number, action: 'CANCEL'|'BOOST'|'HOLD'|'PASS', reason: string|null, mutedBy: string|null, unitsPrePolicy: number }}
 */
export function applyClvTop2UnitPolicy({
  units,
  odds = null,
  top2Pct = null,
  oddsCapFn = null,
  unitCap = GLOBAL_UNIT_CAP,
  cancelMax = CLV_TOP2_CANCEL_MAX,
  boostMin = CLV_TOP2_BOOST_MIN,
  boostMult = CLV_TOP2_BOOST_MULT,
  boostAdd = CLV_TOP2_BOOST_ADD,
} = {}) {
  const pre = Number.isFinite(units) ? Math.max(0, units) : 0;

  // Nothing to stake — still report diagnostics; no mute stamp.
  if (!(pre > 0)) {
    return {
      units: 0,
      action: 'PASS',
      reason: null,
      mutedBy: null,
      unitsPrePolicy: pre,
    };
  }

  // Fail-closed: would stake but cannot measure FOR CLV skill.
  if (top2Pct == null || !Number.isFinite(top2Pct)) {
    return {
      units: 0,
      action: 'CANCEL',
      reason: 'clv_top2_missing',
      mutedBy: 'clv-top2-missing',
      unitsPrePolicy: pre,
    };
  }

  if (top2Pct <= cancelMax) {
    return {
      units: 0,
      action: 'CANCEL',
      reason: 'clv_top2_cancel',
      mutedBy: 'clv-top2-cancel',
      unitsPrePolicy: pre,
    };
  }

  let out = pre;
  let action = 'HOLD';
  let reason = null;

  if (top2Pct >= boostMin) {
    const boosted = Math.min(pre * boostMult, pre + boostAdd);
    out = boosted;
    action = 'BOOST';
    reason = 'clv_top2_boost';
    if (typeof oddsCapFn === 'function') {
      out = oddsCapFn(out, odds);
    }
  }

  out = Math.min(unitCap, out);
  out = Math.round(out * 100) / 100;

  return {
    units: out,
    action,
    reason,
    mutedBy: null,
    unitsPrePolicy: pre,
  };
}

/**
 * netMeanPrior = mean(FOR causal %+CLV) − (mean(AG) ?? PRIOR_AG).
 * Needs at least one FOR wallet with skill; AG defaults to prior when missing.
 */
export function computeNetMeanPrior(walletDetails, side, asOfDate, ledger, opts = {}) {
  const minN = opts.minN ?? CLV_SKILL_MIN_N;
  const priorAg = opts.priorAg ?? NET_CLV_PRIOR_AG;
  if (!Array.isArray(walletDetails) || !side || !asOfDate || !ledger) {
    return { netMeanPrior: null, meanFor: null, meanAg: null, nFor: 0, nAg: 0 };
  }
  const forClean = [];
  const agClean = [];
  const seen = new Set();
  for (const w of walletDetails) {
    if (!w) continue;
    const short = shortWalletId(w.wallet || w.walletShort);
    if (!short || seen.has(short)) continue;
    seen.add(short);
    const pct = causalPctPos(ledger, short, asOfDate, { minN });
    if (pct == null) continue;
    // Missing side treated as FOR (same contract as computeForTop2PctPos)
    if (!w.side || w.side === side) forClean.push(pct);
    else agClean.push(pct);
  }
  if (!forClean.length) {
    return { netMeanPrior: null, meanFor: null, meanAg: null, nFor: 0, nAg: agClean.length };
  }
  const meanFor = forClean.reduce((a, b) => a + b, 0) / forClean.length;
  const meanAg = agClean.length ? agClean.reduce((a, b) => a + b, 0) / agClean.length : null;
  const netMeanPrior = meanFor - (meanAg != null ? meanAg : priorAg);
  return {
    netMeanPrior: Math.round(netMeanPrior * 100) / 100,
    meanFor: Math.round(meanFor * 100) / 100,
    meanAg: meanAg != null ? Math.round(meanAg * 100) / 100 : null,
    nFor: forClean.length,
    nAg: agClean.length,
  };
}

/** tape = 1.5·(EDGE/10) + 2·(netCLV/10). null if either input missing. */
export function computeTapeScore(edge, netMeanPrior, {
  we = TAPE_EDGE_WEIGHT,
  wc = TAPE_NET_WEIGHT,
} = {}) {
  if (edge == null || netMeanPrior == null) return null;
  if (!Number.isFinite(Number(edge)) || !Number.isFinite(Number(netMeanPrior))) return null;
  const tape = we * (Number(edge) / 10) + wc * (Number(netMeanPrior) / 10);
  return Math.round(tape * 1000) / 1000;
}

/**
 * Tape unit policy — mute weak / hold mid / boost strong.
 * FAIL-OPEN when tape cannot be scored (keep path units).
 */
export function applyTapeUnitPolicy({
  units,
  odds = null,
  tape = null,
  oddsCapFn = null,
  unitCap = GLOBAL_UNIT_CAP,
  muteBelow = TAPE_MUTE_BELOW,
  boostAbove = TAPE_BOOST_ABOVE,
  boostMult = TAPE_BOOST_MULT,
} = {}) {
  const pre = Number.isFinite(units) ? Math.max(0, units) : 0;
  if (!(pre > 0)) {
    return {
      units: 0,
      action: 'PASS',
      reason: null,
      mutedBy: null,
      unitsPrePolicy: pre,
    };
  }
  // Fail-open: missing tape → keep path size
  if (tape == null || !Number.isFinite(tape)) {
    return {
      units: pre,
      action: 'FAIL_OPEN',
      reason: 'tape_missing',
      mutedBy: null,
      unitsPrePolicy: pre,
    };
  }
  if (tape < muteBelow) {
    return {
      units: 0,
      action: 'MUTE',
      reason: 'tape_weak',
      mutedBy: 'tape-weak',
      unitsPrePolicy: pre,
    };
  }
  let out = pre;
  let action = 'HOLD';
  let reason = null;
  if (tape >= boostAbove) {
    out = pre * boostMult;
    action = 'BOOST';
    reason = 'tape_boost';
    if (typeof oddsCapFn === 'function') out = oddsCapFn(out, odds);
  }
  out = Math.min(unitCap, out);
  out = Math.round(out * 100) / 100;
  return {
    units: out,
    action,
    reason,
    mutedBy: null,
    unitsPrePolicy: pre,
  };
}
