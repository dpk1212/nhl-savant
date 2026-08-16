/**
 * Wallet CLV skill — causal % +CLV for stake sizing.
 *
 * Legacy top2 FOR-only gate (kept for stamps / audit):
 *   • Cancel top2Pct ≤ 59  → left-tail poison
 *   • Boost  top2Pct ≥ 74  → right-tail size up
 *
 * Ship (2026-07-15+): TAPE = 2·(EDGE/10) + 1.5·(netCLV/10)
 *   (EDGE-heavy from 2026-07-21; was 1.5/2 Net-heavy at original ship)
 *   EDGE  = mean(FOR sport WR) − (mean(AG sport WR) ?? PRIOR_AG_WR=50)
 *   netCLV = mean(FOR %+CLV) − (mean(AG %+CLV) ?? PRIOR_AG=62)
 *   FOR-side components (meanFor WR / meanFor CLV) always stamp when present —
 *   even unopposed — so W/L analysis has a full underlying profile.
 *   • Mute  tape < 0     → 0u (fail-open if tape missing)
 *   • Hold  mid tape     → keep path units
 *   • Boost tape ≥ 2.89  → path × 1.35 (oddsCap, 6u cap)
 *
 * top2Pct = mean of the two highest FOR wallets' causal % of graded
 * positions with CLV > 0 (n ≥ MIN_N, as-of before the pick date).
 */

import { passesSizeSkillLiveGate } from './sizeSkillRescue.js';

export const CLV_HIST_FROM = '2026-04-01';
export const CLV_SKILL_MIN_N = 5;
export const CLV_TOP2_CANCEL_MAX = 59;   // inclusive: ≤ 59 → cancel
export const CLV_TOP2_BOOST_MIN = 74;    // inclusive: ≥ 74 → boost
export const CLV_TOP2_BOOST_MULT = 1.35;
export const CLV_TOP2_BOOST_ADD = 2;
export const GLOBAL_UNIT_CAP = 6;

/** netCLV / tape sizing (replaces top2 unit effects from TAPE_SIZING_LIVE_FROM). */
export const NET_CLV_PRIOR_AG = 62;
/** EDGE = mean FOR sport WR − (mean AG sport WR ?? 50). Unopposed keeps a FOR-side datapoint. */
export const EDGE_PRIOR_AG_WR = 50;
/** EDGE share ≈ 57% (flipped from Net-heavy 1.5/2 on 2026-07-21). */
export const TAPE_EDGE_WEIGHT = 2;
export const TAPE_NET_WEIGHT = 1.5;
export const TAPE_MUTE_BELOW = 0;       // ≈ June15+ path-stamped p40
export const TAPE_BOOST_ABOVE = 2.89;   // ≈ June15+ path-stamped p80
export const TAPE_BOOST_MULT = 1.35;
export const TAPE_SIZING_LIVE_FROM = '2026-07-15';

/**
 * Skill top floors (after tape · 2026-07-21+):
 *   BOTH  EDGE≥10 ∧ tape≥boost → ≥5u
 *   ONE   EDGE≥10 XOR tape≥boost → ≥4u
 * (oddsCap, ≤6). Jun15+ tops were printing at ~3.2–3.7u avg.
 */
export const BOTH_E10_TAPE_BOOST_FROM = '2026-07-21';
export const BOTH_E10_EDGE_MIN = 10;
export const BOTH_E10_TAPE_BOOST_FLOOR = 5;
export const SKILL_ONE_TOP_FLOOR = 4;

export function isTapeSizingLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= TAPE_SIZING_LIVE_FROM;
}

export function isBothE10TapeBoostLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= BOTH_E10_TAPE_BOOST_FROM;
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

/** Firestore doc home for the materialised CLV ledger (1 read vs ~22k GRADED). */
export const CLV_LEDGER_COLLECTION = 'clvSkillLedger';
export const CLV_LEDGER_DOC_ID = 'current';

/**
 * Compact serialisation for the materialised CLV ledger.
 *
 * Firestore rejects nested arrays, so the wallet→events map is stored as a
 * JSON string field (`ledgerJson`) with compact [date, clv] tuples. Rebuilt
 * by exportWalletProfiles after gradeSharpActions — NOT on every
 * syncPickState cycle (that was the July 2026 read explosion).
 */
export function serializeClvLedger(ledger, { since = CLV_HIST_FROM } = {}) {
  const byWallet = {};
  let eventCount = 0;
  if (ledger && typeof ledger.forEach === 'function') {
    ledger.forEach((arr, short) => {
      if (!Array.isArray(arr) || !short) return;
      byWallet[short] = arr.map((e) => [e.date, e.clv]);
      eventCount += arr.length;
    });
  }
  const ledgerJson = JSON.stringify(byWallet);
  return {
    version: 1,
    since,
    walletCount: Object.keys(byWallet).length,
    eventCount,
    ledgerJson,
  };
}

/** Hydrate Map<walletShort, Array<{ date, clv }>> from serializeClvLedger output. */
export function hydrateClvLedger(doc) {
  const map = new Map();
  let byWallet = null;
  if (typeof doc?.ledgerJson === 'string' && doc.ledgerJson.length) {
    try {
      byWallet = JSON.parse(doc.ledgerJson);
    } catch {
      byWallet = null;
    }
  } else if (doc?.byWallet && typeof doc.byWallet === 'object') {
    byWallet = doc.byWallet;
  }
  if (!byWallet || typeof byWallet !== 'object') return map;
  for (const [short, rows] of Object.entries(byWallet)) {
    if (!Array.isArray(rows) || !short) continue;
    const arr = [];
    for (const row of rows) {
      if (Array.isArray(row) && row.length >= 2) {
        const date = row[0];
        const clv = Number(row[1]);
        if (typeof date === 'string' && Number.isFinite(clv)) arr.push({ date, clv });
      } else if (row && typeof row === 'object' && typeof row.date === 'string') {
        const clv = Number(row.clv);
        if (Number.isFinite(clv)) arr.push({ date: row.date, clv });
      }
    }
    if (arr.length) {
      arr.sort((a, b) => a.date.localeCompare(b.date));
      map.set(short, arr);
    }
  }
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

/** tape = 2·(EDGE/10) + 1.5·(netCLV/10). null if either input missing.
 *  EDGE should already include AG prior 50 when unopposed (see EDGE_PRIOR_AG_WR). */
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

/**
 * After tape: floor size when EDGE≥10 and/or tape boost.
 *   BOTH → ≥5u · ONE (exactly one) → ≥4u · else PASS.
 * Never shrinks units (oddsCap may block a raise; then HOLD at pre).
 */
export function applyBothE10TapeFloor({
  units,
  edge = null,
  tape = null,
  odds = null,
  oddsCapFn = null,
  unitCap = GLOBAL_UNIT_CAP,
  bothFloor = BOTH_E10_TAPE_BOOST_FLOOR,
  oneFloor = SKILL_ONE_TOP_FLOOR,
  edgeMin = BOTH_E10_EDGE_MIN,
  boostAbove = TAPE_BOOST_ABOVE,
} = {}) {
  const pre = Number.isFinite(units) ? Math.max(0, units) : 0;
  if (!(pre > 0)) {
    return { units: 0, action: 'PASS', reason: null, mode: null, unitsPrePolicy: pre };
  }
  const e10 = edge != null && Number.isFinite(Number(edge)) && Number(edge) >= edgeMin;
  const boost = tape != null && Number.isFinite(Number(tape)) && Number(tape) >= boostAbove;
  if (!e10 && !boost) {
    return { units: pre, action: 'PASS', reason: null, mode: null, unitsPrePolicy: pre };
  }
  const mode = e10 && boost ? 'BOTH' : 'ONE';
  const floor = mode === 'BOTH' ? bothFloor : oneFloor;
  const reason = mode === 'BOTH'
    ? 'both_e10_tape_boost'
    : (e10 ? 'edge_ge10_only' : 'tape_boost_only');
  let out = Math.max(pre, floor);
  if (typeof oddsCapFn === 'function') out = oddsCapFn(out, odds);
  out = Math.min(unitCap, out);
  out = Math.round(out * 100) / 100;
  if (out <= pre + 0.001) {
    return {
      units: pre,
      action: 'HOLD',
      reason: `${reason}_already_ge_floor`,
      mode,
      unitsPrePolicy: pre,
    };
  }
  return {
    units: out,
    action: 'FLOOR',
    reason,
    mode,
    unitsPrePolicy: pre,
  };
}

// ── qConv (quality-weighted conviction) Q1 mute ─────────────────────────────
// qConv = Σ sizeRatio×(sportWR−50) FOR − Σ sizeRatio×(sportWR−50) AG
// Mute bottom quintile of prior staked A/B/C (expanding Q1 thr). Fail-open
// when qConv or thr missing. Live from QCONV_MUTE_FROM.
// 2026-08-12: Path A (HC) + RANK 2-for-0 exempt — mute was cutting gold winners
// (HC-1 Rays/Braves). Applies to Path C SHARP* + CONFIRMED-UNOPP only.
export const QCONV_WR_MIN_N = 8;
export const QCONV_MUTE_FROM = '2026-08-03';
export const QCONV_MUTE_LOOKBACK_FROM = '2026-06-15';
export const QCONV_MUTE_FALLBACK_THR = 0; // ≈ Jun15+ staked Q1 (−0.27)
export const QCONV_MUTE_MIN_PRIORS = 25;
export const QCONV_STATE_COLLECTION = 'qConvMuteState';
export const QCONV_STATE_DOC_ID = 'current';
/** Path C + CONFIRMED-UNOPP only. Path A (SUPER/TOP/MINI/…) and RANK exempt. */
export const QCONV_MUTE_TIERS = new Set([
  'SHARP', 'SHARP-PRIME', 'SHARP-LEAN',
  'CONFIRMED-UNOPP',
  // Path A + RANK intentionally omitted — do not qConv-mute gold / 2-for-0
  // CONFIRMED-Q1 intentionally omitted — hard floor restores after mutes
]);

export function isQConvMuteLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= QCONV_MUTE_FROM;
}

/** Featured sport WR from sharpWalletProfiles (n≥8) — same source as EDGE. */
export function walletSportFeaturedWr(profile, sport, minN = QCONV_WR_MIN_N) {
  const rec = profile?.bySport?.[sport];
  if (!rec) return null;
  const n = Number(rec.picks?.n) || 0;
  const wr = Number(rec.picks?.wr);
  if (n < minN || !Number.isFinite(wr)) return null;
  return wr;
}

/**
 * Quality-weighted relative conviction.
 *   Σ_i sizeRatio_i × (WR_i − 50) on FOR
 * − Σ_j sizeRatio_j × (WR_j − 50) on AG
 * Returns null when no wallet on either side has WR + sizeRatio.
 */
export function computeQConv(walletDetails, mySide, sport, walletProfiles, {
  minN = QCONV_WR_MIN_N,
  getWr = walletSportFeaturedWr,
} = {}) {
  if (!Array.isArray(walletDetails) || !mySide || !sport || !walletProfiles) return null;
  let forS = 0;
  let agS = 0;
  let nF = 0;
  let nA = 0;
  const seen = new Set();
  for (const w of walletDetails) {
    if (!w) continue;
    const short = shortWalletId(w.walletShort || w.wallet);
    if (!short || seen.has(short)) continue;
    seen.add(short);
    const sr = Number(w.sizeRatio ?? w.betMultiplier);
    if (!(sr > 0) || !Number.isFinite(sr)) continue;
    const profile = walletProfiles.get(short) || walletProfiles.get(short.toUpperCase());
    const wr = getWr(profile, sport, minN);
    if (wr == null || !Number.isFinite(wr)) continue;
    const v = sr * (wr - 50);
    if (w.side === mySide) {
      forS += v;
      nF += 1;
    } else if (w.side) {
      agS += v;
      nA += 1;
    }
  }
  if (!nF && !nA) return null;
  return Math.round((forS - agS) * 10000) / 10000;
}

/** Expanding Q1 threshold from sorted prior staked qConv values. */
export function qConvMuteThresholdFromValues(values, {
  minPriors = QCONV_MUTE_MIN_PRIORS,
} = {}) {
  if (!Array.isArray(values) || values.length < minPriors) return null;
  const sorted = values
    .filter((v) => v != null && Number.isFinite(Number(v)))
    .map(Number)
    .sort((a, b) => a - b);
  if (sorted.length < minPriors) return null;
  const idx = Math.floor(sorted.length / 5) - 1;
  return sorted[Math.max(0, idx)];
}

/**
 * Final mute: qConv below expanding Q1 thr → 0u.
 * Fail-open when not live / missing qConv / missing thr / non-mute tier.
 */
export function applyQConvMuteOverlay({
  units,
  qConv = null,
  thr = null,
  tier = null,
  pickDate = null,
} = {}) {
  const pre = Number.isFinite(units) ? Math.max(0, units) : 0;
  if (!(pre > 0)) {
    return {
      units: 0, action: 'PASS', reason: null, mutedBy: null, unitsPrePolicy: pre,
    };
  }
  if (!isQConvMuteLive(pickDate)) {
    return {
      units: pre, action: 'EXEMPT', reason: 'pre_cutover', mutedBy: null, unitsPrePolicy: pre,
    };
  }
  if (!tier || !QCONV_MUTE_TIERS.has(tier)) {
    return {
      units: pre, action: 'EXEMPT', reason: 'tier_exempt', mutedBy: null, unitsPrePolicy: pre,
    };
  }
  if (qConv == null || !Number.isFinite(Number(qConv))) {
    return {
      units: pre, action: 'FAIL_OPEN', reason: 'qconv_missing', mutedBy: null, unitsPrePolicy: pre,
    };
  }
  if (thr == null || !Number.isFinite(Number(thr))) {
    return {
      units: pre, action: 'FAIL_OPEN', reason: 'thr_missing', mutedBy: null, unitsPrePolicy: pre,
    };
  }
  if (Number(qConv) < Number(thr)) {
    return {
      units: 0,
      action: 'MUTE',
      reason: 'qconv_q1',
      mutedBy: 'qconv-q1',
      unitsPrePolicy: pre,
    };
  }
  return {
    units: pre, action: 'HOLD', reason: null, mutedBy: null, unitsPrePolicy: pre,
  };
}

// ── FOOLS mute (best proven FOR = FLAT → hard 0u cancel) ─────────────────────
// 2026-08-05: hard 0u mute. Briefly clamped to 1u / [1u,2u] after early live
// cost; restored to 0u cancel (2026-08-08) — FLAT-led Path A/B/C stays MUTED.
// Forward-only from FOOLS_GOLD_MUTE_FROM. EDGE is reason-tag only (not a gate).
export const FOOLS_GOLD_MUTE_FROM = '2026-08-05';
/** @deprecated EDGE no longer gates FOOLS; kept for log/compat. */
export const FOOLS_GOLD_EDGE_MIN = 7;
/** @deprecated Was 1u clamp band; FOOLS is 0u MUTE again. Kept for import compat. */
export const FOOLS_CLAMP_MIN_U = 0;
/** @deprecated Was 1u clamp band; FOOLS is 0u MUTE again. Kept for import compat. */
export const FOOLS_CLAMP_MAX_U = 0;
/** Path A/B/C + CONFIRMED-UNOPP (broader than qConv, which is Path C-only). DISSENT exempt. */
export const FOOLS_GOLD_MUTE_TIERS = new Set([
  'SUPER', 'TOP', 'TOP+', 'MINI', 'MINI-', 'CONFIRMED',
  'RANK', 'SHARP', 'SHARP-PRIME', 'SHARP-LEAN',
  'CONFIRMED-UNOPP',
  // CONFIRMED-Q1 omitted — Q1×sized floor is CONFIRMED-led by construction
]);

export function isFoolsGoldMuteLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= FOOLS_GOLD_MUTE_FROM;
}

/**
 * Best proven FOR wallet on the ticket side.
 * Rank: CONFIRMED > FLAT, then flatRoi, then n (matches gold/fools analysis).
 * @returns {{ tier: 'CONFIRMED'|'FLAT'|null, nForProven: number, flatRoi: number|null, walletShort: string|null }}
 */
export function bestProvenForSide(walletDetails, mySide, sport, walletProfiles) {
  const empty = { tier: null, nForProven: 0, flatRoi: null, walletShort: null };
  if (!Array.isArray(walletDetails) || !mySide || !sport || !walletProfiles) return empty;
  const seen = new Set();
  const forR = [];
  for (const w of walletDetails) {
    if (!w?.side || w.side !== mySide) continue;
    const s = shortWalletId(w.walletShort || w.wallet);
    if (!s || seen.has(s)) continue;
    seen.add(s);
    const key = String(s).toLowerCase();
    const profile = walletProfiles.get(key)
      || walletProfiles.get(key.toUpperCase())
      || walletProfiles.get(s);
    const bs = profile?.bySport?.[sport];
    const tier = bs?.whitelistTier;
    if (tier !== 'CONFIRMED' && tier !== 'FLAT') continue;
    // Size-skill CONFIRMED: only count when this ticket is sized ≥ 1.0×.
    if (!passesSizeSkillLiveGate(bs, w.sizeRatio)) continue;
    const picks = bs.picks || {};
    const flatRoi = Number.isFinite(picks.flatRoi) ? picks.flatRoi : null;
    const n = picks.n ?? 0;
    const tierScore = tier === 'CONFIRMED' ? 2 : 1;
    forR.push({
      walletShort: s,
      tier,
      flatRoi,
      n,
      score: tierScore * 1e6 + ((flatRoi ?? -999) + 500) * 1e3 + n,
    });
  }
  if (!forR.length) return empty;
  forR.sort((a, b) => b.score - a.score);
  return {
    tier: forR[0].tier,
    nForProven: forR.length,
    flatRoi: forR[0].flatRoi,
    walletShort: forR[0].walletShort,
  };
}

// ── CONFIRMED-UNOPP promote (ALL CONFIRMED × sized ≥ 0.5 × unopposed) ───────
// Rescue score>0 sides still at 0u after HC/RANK/SHARP. Forward-only.
export const CONFIRMED_UNOPP_FROM = '2026-08-08';
export const CONFIRMED_UNOPP_MIN_SIZE = 0.5;
export const CONFIRMED_UNOPP_UNITS = 1;

export function isConfirmedUnoppPromoteLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= CONFIRMED_UNOPP_FROM;
}

/**
 * ≥1 CONFIRMED FOR with sizeRatio ≥ minSize, and zero CONFIRMED on AG.
 * @returns {{ qualifies: boolean, forSized: number, agConfirmed: number, bestSize: number|null, wallets: string[] }}
 */
export function computeConfirmedUnoppSized(
  walletDetails,
  mySide,
  sport,
  walletProfiles,
  { minSize = CONFIRMED_UNOPP_MIN_SIZE } = {},
) {
  const empty = {
    qualifies: false, forSized: 0, agConfirmed: 0, bestSize: null, wallets: [],
  };
  if (!Array.isArray(walletDetails) || !mySide || !sport || !walletProfiles) return empty;
  const seen = new Set();
  let forSized = 0;
  let agConfirmed = 0;
  let bestSize = null;
  const wallets = [];
  for (const w of walletDetails) {
    if (!w?.side) continue;
    const s = shortWalletId(w.walletShort || w.wallet);
    if (!s || seen.has(s)) continue;
    seen.add(s);
    const key = String(s).toLowerCase();
    const profile = walletProfiles.get(key)
      || walletProfiles.get(key.toUpperCase())
      || walletProfiles.get(s);
    const bs = profile?.bySport?.[sport];
    const tier = bs?.whitelistTier;
    if (tier !== 'CONFIRMED') continue;
    const sr = Number(w.sizeRatio);
    if (!passesSizeSkillLiveGate(bs, sr)) continue;
    if (w.side === mySide) {
      if (Number.isFinite(sr) && sr >= minSize) {
        forSized++;
        wallets.push(s);
        if (bestSize == null || sr > bestSize) bestSize = sr;
      }
    } else {
      agConfirmed++;
    }
  }
  return {
    qualifies: forSized >= 1 && agConfirmed === 0,
    forSized,
    agConfirmed,
    bestSize: bestSize != null ? +bestSize.toFixed(3) : null,
    wallets,
  };
}

// ── CONFIRMED-Q1 promote (CONFIRMED × flatDollar Q1 × size ≥ 0.5) ──────────
// As-of research: ~62% WR / +29% $ROI on wallet legs (opposed OK). Never leave
// at 0u; size up vs CONFIRMED-UNOPP (2u base · 3u when size≥1×).
export const CONFIRMED_Q1_FROM = '2026-08-08';
export const CONFIRMED_Q1_MIN_SIZE = 0.5;
export const CONFIRMED_Q1_UNITS = 2;
/** Lean/full/press conviction bump (sizeRatio ≥ 1×). */
export const CONFIRMED_Q1_PRESS_MIN_SIZE = 1.0;
export const CONFIRMED_Q1_PRESS_UNITS = 3;

export function isConfirmedQ1PromoteLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= CONFIRMED_Q1_FROM;
}

/**
 * Create-path: CONFIRMED-Q1×sized may proceed when AGS v12 would
 * no-signal or mute (score ≤ 0). Reconcile hard-floors the same way;
 * create must not skip before that floor can run.
 */
export function confirmedQ1BypassesAgsCreateGate(qualifies, scoreV12) {
  if (!qualifies) return false;
  return scoreV12 == null || !Number.isFinite(scoreV12) || scoreV12 <= 0;
}

/**
 * Create/reconcile: CONFIRMED-UNOPP×sized (≥0.5×, unopposed) may proceed when
 * AGS v12 would no-signal or mute. Action can surface these winners while
 * Locked used to skip them entirely (featured flat ≤ 0 → quality 0).
 */
export function confirmedUnoppBypassesAgsCreateGate(qualifies, scoreV12) {
  if (!qualifies) return false;
  return scoreV12 == null || !Number.isFinite(scoreV12) || scoreV12 <= 0;
}

/**
 * Raise units to Q1 target when under-floored. Returns next units + tier
 * stamp when a floor applied.
 * @param {(u: number, odds: number|null) => number} oddsCapFn
 */
export function applyConfirmedQ1UnitFloor({
  units,
  odds = null,
  q1Result,
  oddsCapFn,
}) {
  if (!q1Result?.qualifies || typeof oddsCapFn !== 'function') {
    return { units, tier: null, floored: false, targetUnits: null };
  }
  const tgt = Math.round(oddsCapFn(q1Result.targetUnits, odds ?? null) * 100) / 100;
  if (!(Number.isFinite(units) && units < tgt)) {
    return { units, tier: null, floored: false, targetUnits: tgt };
  }
  return { units: tgt, tier: 'CONFIRMED-Q1', floored: true, targetUnits: tgt };
}

/**
 * Shared Action letter + CONFIRMED-Q1 score (one formula):
 *   1. Shrink each ROI toward the sport's n-weighted CONFIRMED mean
 *      shrunk = n/(n+n0)·ROI + n0/(n+n0)·mean   (n0 = 40)
 *   2. z-score the shrunk values
 *   3. flatMix = 0.30·z(A flat) + 0.70·z(B flat)
 *      score   = 0.40·flatMix + 0.60·z(B $)
 * Missing A or B flat: that side drops out of flatMix (other side = 100%).
 */
export const FLAT_BLEND_A = 0.3;
export const FLAT_BLEND_B = 0.7;
export const FLAT_DOLLAR_Q_WEIGHT_FLAT = 0.4;
export const FLAT_DOLLAR_Q_WEIGHT_DOLLAR = 0.6;
/** Prior strength in bets — same order as Sharp-tier cell hist floor. */
export const FLAT_DOLLAR_Q_SHRINK_N0 = 40;

function zUnit(xs) {
  const finite = xs.filter((x) => Number.isFinite(x));
  if (!finite.length) return () => null;
  const m = finite.reduce((a, b) => a + b, 0) / finite.length;
  const sd = Math.sqrt(finite.reduce((a, b) => a + (b - m) ** 2, 0) / finite.length) || 1;
  return (x) => (Number.isFinite(x) ? (x - m) / sd : null);
}

/** Volume-weighted mean so a 3-1 +54% cannot pull the prior. */
export function nWeightedMean(rois, ns) {
  let num = 0;
  let den = 0;
  const fallback = [];
  const nArr = Array.isArray(ns) ? ns : [];
  for (let i = 0; i < rois.length; i++) {
    const roi = rois[i];
    if (!Number.isFinite(roi)) continue;
    fallback.push(roi);
    const n = Number(nArr[i]);
    if (Number.isFinite(n) && n > 0) {
      num += n * roi;
      den += n;
    }
  }
  if (den > 0) return num / den;
  if (!fallback.length) return null;
  return fallback.reduce((a, b) => a + b, 0) / fallback.length;
}

/**
 * Empirical-Bayes blend toward a peer mean.
 * Missing / zero n → full shrink (won't take Q1 on an uncounted book).
 */
export function shrinkRoiTowardMean(roi, n, mean, n0 = FLAT_DOLLAR_Q_SHRINK_N0) {
  if (!Number.isFinite(roi)) return null;
  if (!Number.isFinite(mean)) return roi;
  const nn = Math.max(0, Number.isFinite(Number(n)) ? Number(n) : 0);
  const k = Number.isFinite(n0) && n0 > 0 ? n0 : FLAT_DOLLAR_Q_SHRINK_N0;
  return (nn / (nn + k)) * roi + (k / (nn + k)) * mean;
}

/** Combine already-computed z's. Used by live Q and as-of cell hist. */
export function combineFlatDollarScore({ zFlatA = null, zFlatB = null, zDollar }) {
  if (!Number.isFinite(zDollar)) return null;
  const aOk = Number.isFinite(zFlatA);
  const bOk = Number.isFinite(zFlatB);
  if (!aOk && !bOk) return null;
  const flatMix = aOk && bOk
    ? FLAT_BLEND_A * zFlatA + FLAT_BLEND_B * zFlatB
    : (aOk ? zFlatA : zFlatB);
  return FLAT_DOLLAR_Q_WEIGHT_FLAT * flatMix + FLAT_DOLLAR_Q_WEIGHT_DOLLAR * zDollar;
}

/**
 * Shrink → z → 40/60 blend. Rows: { wallet, flatA, nA, flatB, nB, dol, nDol }.
 * @returns {Map<string, number>} wallet → score
 */
export function scoreFlatDollarRows(rows, n0 = FLAT_DOLLAR_Q_SHRINK_N0) {
  const list = Array.isArray(rows) ? rows : [];
  const meanA = nWeightedMean(list.map((r) => r.flatA), list.map((r) => r.nA));
  const meanB = nWeightedMean(list.map((r) => r.flatB), list.map((r) => r.nB));
  const meanD = nWeightedMean(list.map((r) => r.dol), list.map((r) => r.nDol ?? r.nB));
  const shrunk = list.map((r) => ({
    w: r.wallet,
    sA: Number.isFinite(r.flatA) ? shrinkRoiTowardMean(r.flatA, r.nA, meanA, n0) : null,
    sB: Number.isFinite(r.flatB) ? shrinkRoiTowardMean(r.flatB, r.nB, meanB, n0) : null,
    sD: Number.isFinite(r.dol) ? shrinkRoiTowardMean(r.dol, r.nDol ?? r.nB, meanD, n0) : null,
  }));
  const zA = zUnit(shrunk.map((r) => r.sA));
  const zB = zUnit(shrunk.map((r) => r.sB));
  const zD = zUnit(shrunk.map((r) => r.sD));
  const out = new Map();
  for (const r of shrunk) {
    const s = combineFlatDollarScore({
      zFlatA: zA(r.sA),
      zFlatB: zB(r.sB),
      zDollar: zD(r.sD),
    });
    if (Number.isFinite(s) && r.w) out.set(r.w, s);
  }
  return out;
}

/** Highest score → Q1. Need ≥4 scored wallets. */
export function quartileFromScores(scoreByWallet) {
  const arr = [...(scoreByWallet || [])].filter(([, s]) => Number.isFinite(s));
  arr.sort((a, b) => b[1] - a[1]);
  const out = new Map();
  const n = arr.length;
  if (n < 4) return out;
  arr.forEach(([w], i) => out.set(w, Math.min(4, Math.floor((i / n) * 4) + 1)));
  return out;
}

/**
 * flatDollar Q among whitelist-in-sport from live walletProfiles.
 * Need ≥4 scored wallets in sport. Default universe = CONFIRMED only.
 * @returns {Map<string, Map<string, number>>} sport → walletShort → Q (1..4)
 */
export function buildFlatDollarQBySport(walletProfiles, { tiers = ['CONFIRMED'] } = {}) {
  const tierSet = new Set((tiers || ['CONFIRMED']).map((t) => String(t).toUpperCase()));
  const bySport = new Map();
  if (!walletProfiles || typeof walletProfiles.forEach !== 'function') return new Map();
  for (const [id, prof] of walletProfiles) {
    const short = shortWalletId(id);
    if (!short || !prof?.bySport) continue;
    for (const [sport, rec] of Object.entries(prof.bySport)) {
      const tier = String(rec?.whitelistTier || '').toUpperCase();
      if (!tierSet.has(tier)) continue;
      const flatA = Number(rec.picks?.flatRoi);
      const flatB = Number(rec.positions?.positionFlatRoi);
      const dol = Number(rec.positions?.dollarRoi);
      if (!Number.isFinite(dol)) continue;
      if (!Number.isFinite(flatA) && !Number.isFinite(flatB)) continue;
      if (!bySport.has(sport)) bySport.set(sport, []);
      bySport.get(sport).push({
        wallet: short,
        flatA: Number.isFinite(flatA) ? flatA : null,
        nA: Number(rec.picks?.n) || 0,
        flatB: Number.isFinite(flatB) ? flatB : null,
        nB: Number(rec.positions?.n) || 0,
        dol,
        nDol: Number(rec.positions?.n) || 0,
      });
    }
  }
  const out = new Map();
  for (const [sport, rows] of bySport) {
    if (rows.length < 4) {
      out.set(sport, new Map());
      continue;
    }
    out.set(sport, quartileFromScores(scoreFlatDollarRows(rows)));
  }
  return out;
}

/**
 * ≥1 FOR wallet: CONFIRMED-in-sport × flatDollar Q1 × sizeRatio ≥ minSize.
 * Opposition does NOT disqualify.
 * @returns {{ qualifies: boolean, forQ1Sized: number, bestSize: number|null, targetUnits: number, wallets: string[] }}
 */
export function computeConfirmedQ1Sized(
  walletDetails,
  mySide,
  sport,
  walletProfiles,
  qBySport,
  {
    minSize = CONFIRMED_Q1_MIN_SIZE,
    baseUnits = CONFIRMED_Q1_UNITS,
    pressMinSize = CONFIRMED_Q1_PRESS_MIN_SIZE,
    pressUnits = CONFIRMED_Q1_PRESS_UNITS,
  } = {},
) {
  const empty = {
    qualifies: false, forQ1Sized: 0, bestSize: null, targetUnits: baseUnits, wallets: [],
  };
  if (!Array.isArray(walletDetails) || !mySide || !sport || !walletProfiles) return empty;
  const qMap = qBySport?.get?.(sport) || qBySport?.get?.(String(sport).toUpperCase()) || new Map();
  const seen = new Set();
  let forQ1Sized = 0;
  let bestSize = null;
  const wallets = [];
  for (const w of walletDetails) {
    if (!w?.side || w.side !== mySide) continue;
    const s = shortWalletId(w.walletShort || w.wallet);
    if (!s || seen.has(s)) continue;
    seen.add(s);
    const key = String(s).toLowerCase();
    const profile = walletProfiles.get(key)
      || walletProfiles.get(key.toUpperCase())
      || walletProfiles.get(s);
    if (profile?.bySport?.[sport]?.whitelistTier !== 'CONFIRMED') continue;
    if (!passesSizeSkillLiveGate(profile?.bySport?.[sport], w.sizeRatio)) continue;
    if (qMap.get(s) !== 1 && qMap.get(key) !== 1) continue;
    const sr = Number(w.sizeRatio);
    if (!(Number.isFinite(sr) && sr >= minSize)) continue;
    forQ1Sized++;
    wallets.push(s);
    if (bestSize == null || sr > bestSize) bestSize = sr;
  }
  if (forQ1Sized < 1) return empty;
  const targetUnits = (bestSize != null && bestSize >= pressMinSize) ? pressUnits : baseUnits;
  return {
    qualifies: true,
    forQ1Sized,
    bestSize: bestSize != null ? +bestSize.toFixed(3) : null,
    targetUnits,
    wallets,
  };
}

/**
 * FOOLS cancel: best proven FOR tier is FLAT → stake = 0u MUTED.
 * EDGE is optional (reason tag only). Manual stake exempt at call site.
 * Missing bestForTier → HOLD (fail-open).
 */
export function applyFoolsGoldMuteOverlay({
  units,
  edge = null,
  bestForTier = null,
  tier = null,
  pickDate = null,
} = {}) {
  const pre = Number.isFinite(units) ? Math.max(0, units) : 0;
  if (!(pre > 0)) {
    return {
      units: 0, action: 'PASS', reason: null, mutedBy: null, unitsPrePolicy: pre,
    };
  }
  if (!isFoolsGoldMuteLive(pickDate)) {
    return {
      units: pre, action: 'EXEMPT', reason: 'pre_cutover', mutedBy: null, unitsPrePolicy: pre,
    };
  }
  if (!tier || !FOOLS_GOLD_MUTE_TIERS.has(tier)) {
    return {
      units: pre, action: 'EXEMPT', reason: 'tier_exempt', mutedBy: null, unitsPrePolicy: pre,
    };
  }
  if (bestForTier !== 'FLAT') {
    return {
      units: pre, action: 'HOLD', reason: null, mutedBy: null, unitsPrePolicy: pre,
    };
  }
  const softFlat = edge == null || !Number.isFinite(Number(edge))
    || Number(edge) < FOOLS_GOLD_EDGE_MIN;
  return {
    units: 0,
    action: 'MUTE',
    reason: softFlat ? 'fools_flat_cancel_soft' : 'fools_flat_cancel',
    mutedBy: 'fools-gold-flat',
    unitsPrePolicy: pre,
  };
}

// ── Path × EDGE blended expected win rate (display / calibration) ───────────
// logit(p*) = wp·logit(pathWR) + we·logit(meanFor)
// Path WR = expanding empirical WR of prior graded staked same tier (all sports).
// EDGE side uses featured meanFor (same units as EDGE). Tape is intentionally
// excluded. Stamped for tracking — does not size units.
export const BLEND_WR_PATH_W = 0.35;
export const BLEND_WR_EDGE_W = 0.65;
export const BLEND_PATH_MIN_N = 15;
export const BLEND_PATH_LOOKBACK_FROM = '2026-06-15';
/** Cold-start / thin-tier prior ≈ typical -115 implied. */
export const BLEND_WR_BASE = 0.535;
export const BLEND_STATE_COLLECTION = 'blendWrState';
export const BLEND_STATE_DOC_ID = 'current';

export function logitProb(p) {
  const e = Math.min(1 - 1e-6, Math.max(1e-6, Number(p)));
  return Math.log(e / (1 - e));
}

export function sigmoidProb(z) {
  const x = Math.max(-20, Math.min(20, Number(z)));
  return 1 / (1 + Math.exp(-x));
}

/** American odds → implied win probability (vig-in). */
export function americanOddsImpliedWr(odds) {
  if (odds == null || !Number.isFinite(Number(odds)) || Number(odds) === 0) return null;
  const o = Number(odds);
  return o < 0 ? Math.abs(o) / (Math.abs(o) + 100) : 100 / (o + 100);
}

/**
 * Resolve path prior WR (0–1) from { n, w } record.
 * Thin tiers fall back to `baseWr` (overall book or BLEND_WR_BASE).
 */
export function pathWrFromCounts(rec, {
  minN = BLEND_PATH_MIN_N,
  baseWr = BLEND_WR_BASE,
} = {}) {
  const n = Number(rec?.n) || 0;
  const w = Number(rec?.w) || 0;
  if (n >= minN && n > 0) return w / n;
  if (baseWr != null && Number.isFinite(baseWr)) return Number(baseWr);
  return BLEND_WR_BASE;
}

/**
 * Path × EDGE blend in logit space.
 * @returns {{ blendWr, pathWr, edgeWr, wp, we, pathN } | null}
 *   blendWr/pathWr/edgeWr are percentages (0–100), rounded to 1 dp.
 */
export function computePathEdgeBlendWr({
  pathWr = null,
  meanFor = null,
  pathN = null,
  wp = BLEND_WR_PATH_W,
  we = BLEND_WR_EDGE_W,
} = {}) {
  const pPath = pathWr != null && Number.isFinite(Number(pathWr))
    ? (Number(pathWr) > 1 ? Number(pathWr) / 100 : Number(pathWr))
    : null;
  const pEdge = meanFor != null && Number.isFinite(Number(meanFor))
    ? (Number(meanFor) > 1 ? Number(meanFor) / 100 : Number(meanFor))
    : null;

  let wPath = Number(wp);
  let wEdge = Number(we);
  if (!Number.isFinite(wPath)) wPath = BLEND_WR_PATH_W;
  if (!Number.isFinite(wEdge)) wEdge = BLEND_WR_EDGE_W;

  if (pPath == null && pEdge == null) return null;
  if (pPath == null) { wPath = 0; wEdge = 1; }
  if (pEdge == null) { wPath = 1; wEdge = 0; }
  const sum = wPath + wEdge;
  if (!(sum > 0)) return null;
  wPath /= sum;
  wEdge /= sum;

  const z = (pPath != null ? wPath * logitProb(pPath) : 0)
    + (pEdge != null ? wEdge * logitProb(pEdge) : 0);
  const blend = sigmoidProb(z);
  const round1 = (x) => Math.round(x * 1000) / 10; // → pct 1dp
  return {
    blendWr: round1(blend),
    pathWr: pPath != null ? round1(pPath) : null,
    edgeWr: pEdge != null ? round1(pEdge) : null,
    wp: Math.round(wPath * 100) / 100,
    we: Math.round(wEdge * 100) / 100,
    pathN: pathN != null && Number.isFinite(Number(pathN)) ? Number(pathN) : null,
  };
}

/** Look up tier prior from a byTier map built by loadPathBlendPriors / backtest. */
export function resolvePathPriorWr(byTier, tier, {
  minN = BLEND_PATH_MIN_N,
  baseWr = BLEND_WR_BASE,
} = {}) {
  if (!tier || !byTier) {
    return { pathWr: baseWr, pathN: 0, source: 'base' };
  }
  const rec = byTier[tier] || null;
  const n = Number(rec?.n) || 0;
  if (n >= minN) {
    return { pathWr: pathWrFromCounts(rec, { minN, baseWr }), pathN: n, source: 'tier' };
  }
  const all = byTier.ALL || byTier.__ALL__ || null; // ALL preferred; __ALL__ legacy/local
  if (all && (Number(all.n) || 0) >= minN) {
    return {
      pathWr: pathWrFromCounts(all, { minN, baseWr }),
      pathN: n,
      source: 'all_staked',
    };
  }
  return { pathWr: baseWr, pathN: n, source: 'base' };
}
