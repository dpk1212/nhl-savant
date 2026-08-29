/**
 * Sport-day Sharp A/B turnout climate — RED half-exposure CAP.
 *
 * Research (Jun–Aug 2026 day-of labels):
 *   RED  = activeA === 0 on FORs that sport-day (no Sharp A turnout)
 *   YELLOW = some A, not green
 *   GREEN = activeAB ≥ 6 OR pctABRoster ≥ 35%
 *
 * Size policy (v1): RED → units × 0.5. GREEN/YELLOW unchanged.
 * Absolute soft-cap after mutes, before sportConfirmedUnlock (compose via
 * sequential apply). Never mutes to 0. Manual stake exempt at call site.
 * Forward-only via CLIMATE_TURNOUT_GATE_FROM.
 *
 * Ticket hasA / hasAB are stamped only (no size effect in v1).
 */

import { shortWalletId } from './walletClvSkill.js';
import { tierLetterFromQ } from './sharpTierCellStats.js';

/** Live from this pickDate (YYYY-MM-DD) inclusive. */
export const CLIMATE_TURNOUT_GATE_FROM = '2026-08-29';

/** RED exposure multiplier (half size). */
export const CLIMATE_RED_EXPOSURE = 0.5;

/** GREEN thresholds (stamp + future size; v1 size only keys off RED). */
export const CLIMATE_GREEN_ACTIVE_AB = 6;
export const CLIMATE_GREEN_PCT_AB_ROSTER = 35;

export function isClimateTurnoutGateLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= CLIMATE_TURNOUT_GATE_FROM;
}

/**
 * Letter for a wallet on a sport from flatDollar Q map (CONFIRMED tiers).
 * qBySport: Map<sport, Map<walletShort, q>>
 */
export function sharpLetterForWallet(sport, wallet, qBySport) {
  if (!sport || !wallet || !qBySport) return null;
  const short = shortWalletId(wallet);
  if (!short) return null;
  const qMap = qBySport.get(String(sport)) || qBySport.get(String(sport).toUpperCase());
  if (!qMap) return null;
  const q = qMap.get(short);
  return tierLetterFromQ(q);
}

/**
 * Per-ticket FOR-side Sharp A/B features (day-of Q via qBySport).
 */
export function ticketAbFeatures({
  walletDetails = [],
  side = null,
  sport = null,
  qBySport = null,
} = {}) {
  const empty = {
    nFor: 0,
    nA: 0,
    nB: 0,
    nAB: 0,
    hasA: false,
    hasAB: false,
  };
  if (!side || !sport || !qBySport || !Array.isArray(walletDetails)) return empty;
  const seen = new Set();
  let nFor = 0;
  let nA = 0;
  let nB = 0;
  for (const w of walletDetails) {
    if (!w || String(w.side) !== String(side)) continue;
    const short = shortWalletId(w.wallet);
    if (!short || seen.has(short)) continue;
    seen.add(short);
    nFor++;
    const letter = sharpLetterForWallet(sport, short, qBySport);
    if (letter === 'A') nA++;
    else if (letter === 'B') nB++;
  }
  const nAB = nA + nB;
  return {
    nFor,
    nA,
    nB,
    nAB,
    hasA: nA >= 1,
    hasAB: nAB >= 1,
  };
}

/**
 * Roster sizes: count Q1 (A) and Q1+Q2 (AB) wallets in flatDollar Q for sport.
 */
export function rosterABForSport(sport, qBySport) {
  const empty = { nA: 0, nAB: 0, nQ: 0 };
  if (!sport || !qBySport) return empty;
  const qMap = qBySport.get(String(sport)) || qBySport.get(String(sport).toUpperCase());
  if (!qMap || typeof qMap.entries !== 'function') return empty;
  let nA = 0;
  let nAB = 0;
  let nQ = 0;
  for (const [, q] of qMap) {
    nQ++;
    if (q === 1) { nA++; nAB++; }
    else if (q === 2) nAB++;
  }
  return { nA, nAB, nQ };
}

/**
 * Classify climate from active turnout counts + roster.
 */
export function classifyClimateColor({
  activeA = 0,
  activeAB = 0,
  rosterAB = 0,
} = {}) {
  const a = Math.max(0, Math.floor(Number(activeA) || 0));
  const ab = Math.max(0, Math.floor(Number(activeAB) || 0));
  const rost = Math.max(0, Math.floor(Number(rosterAB) || 0));
  const pctABRoster = rost > 0 ? Math.round((1000 * ab) / rost) / 10 : 0;
  let color = 'YELLOW';
  if (a === 0) color = 'RED';
  else if (ab >= CLIMATE_GREEN_ACTIVE_AB || pctABRoster >= CLIMATE_GREEN_PCT_AB_ROSTER) {
    color = 'GREEN';
  }
  return {
    color,
    activeA: a,
    activeAB: ab,
    rosterA: null,
    rosterAB: rost,
    pctABRoster,
  };
}

/**
 * Build sport → climate from a list of side snapshots for one date.
 *
 * sideRows: [{ sport, side, walletDetails }]
 * Counts distinct Sharp A/B wallets on FOR sides per sport.
 */
export function buildClimateBySport(sideRows, qBySport) {
  const bySport = new Map(); // sport → { A: Set, AB: Set }
  if (!Array.isArray(sideRows) || !qBySport) return new Map();

  for (const row of sideRows) {
    const sport = row?.sport;
    const side = row?.side;
    const wd = row?.walletDetails;
    if (!sport || !side || !Array.isArray(wd)) continue;
    const sportKey = String(sport).toUpperCase();
    if (!bySport.has(sportKey)) bySport.set(sportKey, { A: new Set(), AB: new Set() });
    const bucket = bySport.get(sportKey);
    const seen = new Set();
    for (const w of wd) {
      if (!w || String(w.side) !== String(side)) continue;
      const short = shortWalletId(w.wallet);
      if (!short || seen.has(short)) continue;
      seen.add(short);
      const letter = sharpLetterForWallet(sport, short, qBySport)
        || sharpLetterForWallet(sportKey, short, qBySport);
      if (letter === 'A') {
        bucket.A.add(short);
        bucket.AB.add(short);
      } else if (letter === 'B') {
        bucket.AB.add(short);
      }
    }
  }

  const out = new Map();
  for (const [sportKey, sets] of bySport) {
    const rost = rosterABForSport(sportKey, qBySport);
    // also try original casing keys in q map via helper
    const rost2 = rost.nAB > 0 ? rost : rosterABForSport(
      [...(qBySport.keys?.() || [])].find((k) => String(k).toUpperCase() === sportKey) || sportKey,
      qBySport,
    );
    const classified = classifyClimateColor({
      activeA: sets.A.size,
      activeAB: sets.AB.size,
      rosterAB: rost2.nAB,
    });
    out.set(sportKey, {
      ...classified,
      rosterA: rost2.nA,
      rosterAB: rost2.nAB,
      sport: sportKey,
    });
  }
  return out;
}

/**
 * Collect side rows from locked-pick docs (Firestore shape: sides.home/away/…).
 */
export function sideRowsFromPickDocs(picks, { date = null } = {}) {
  const rows = [];
  if (!Array.isArray(picks)) return rows;
  for (const pick of picks) {
    if (date && pick?.date && pick.date !== date) continue;
    const sport = pick?.sport;
    if (!sport) continue;
    const sides = pick?.sides && typeof pick.sides === 'object' ? pick.sides : null;
    if (!sides) continue;
    for (const [sideKey, sd] of Object.entries(sides)) {
      if (!sd || typeof sd !== 'object') continue;
      const wd = sd.peak?.v8Scoring?.walletDetails
        || sd.lock?.v8Scoring?.walletDetails
        || null;
      if (!Array.isArray(wd) || !wd.length) continue;
      rows.push({ sport, side: sideKey, walletDetails: wd });
    }
  }
  return rows;
}

/**
 * RED half-exposure overlay. Never mutes to 0.
 */
export function applyClimateTurnoutOverlay({
  units,
  climateColor = null,
  pickDate = null,
  exposure = CLIMATE_RED_EXPOSURE,
} = {}) {
  const pre = Number.isFinite(units) ? Math.max(0, units) : 0;
  const color = climateColor == null ? null : String(climateColor).toUpperCase();
  const mult = Number.isFinite(Number(exposure)) ? Number(exposure) : CLIMATE_RED_EXPOSURE;

  const base = {
    units: pre,
    action: 'HOLD',
    reason: null,
    unitsPrePolicy: pre,
    climateColor: color,
    exposure: mult,
  };

  if (!(pre > 0)) {
    return { ...base, units: 0, action: 'PASS' };
  }
  if (!isClimateTurnoutGateLive(pickDate)) {
    return { ...base, action: 'EXEMPT', reason: 'pre_cutover' };
  }
  if (color !== 'RED') {
    return {
      ...base,
      action: 'HOLD',
      reason: color ? `climate_${color.toLowerCase()}_full` : 'climate_unknown_full',
    };
  }

  let next = Math.round(pre * mult * 100) / 100;
  // Never mute: keep a dust floor if rounding collapsed a tiny ticket.
  if (next <= 0 && pre > 0) next = Math.round(Math.min(pre, 0.01) * 100) / 100;
  if (Math.abs(next - pre) < 1e-9) {
    return { ...base, action: 'HOLD', reason: 'climate_red_already_half' };
  }
  return {
    ...base,
    units: next,
    action: 'HALF',
    reason: `climate_red_half_${mult}`,
  };
}

/**
 * Lookup climate for a sport from Map (case-insensitive).
 */
export function climateForSport(climateBySport, sport) {
  if (!climateBySport || !sport) return null;
  const key = String(sport).toUpperCase();
  return climateBySport.get(key)
    || climateBySport.get(sport)
    || null;
}

/**
 * 0–100 progress toward GREEN (for UI stoplights).
 *
 *   0     = RED (no Sharp A on FORs)
 *   1–99  = YELLOW zone — have A, climbing toward green gates
 *   100   = at/past GREEN (activeAB≥6 or pctABRoster≥35%)
 *
 * Score = max(activeAB/6, pctABRoster/35) × 100 once activeA≥1.
 */
export function climateProgressScore({
  color = null,
  activeA = 0,
  activeAB = 0,
  pctABRoster = 0,
} = {}) {
  const a = Math.max(0, Math.floor(Number(activeA) || 0));
  const c = color == null ? null : String(color).toUpperCase();
  if (c === 'RED' || a <= 0) return 0;
  const ab = Math.max(0, Number(activeAB) || 0);
  const pct = Math.max(0, Number(pctABRoster) || 0);
  const byCount = (ab / CLIMATE_GREEN_ACTIVE_AB) * 100;
  const byPct = (pct / CLIMATE_GREEN_PCT_AB_ROSTER) * 100;
  return Math.max(0, Math.min(100, Math.round(Math.max(byCount, byPct))));
}
