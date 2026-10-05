/**
 * Form × tier layer — LAST policy before odds-cap / operator kill.
 *
 * Reads every wallet on the ticket through its Source B sport book in
 * sharpWalletProfiles (bySport[sport].positions + bySport[sport].form.actionL*)
 * and grades it day-of:
 *
 *   time   T0 <15 settled · T1 15–29 · T2 30–59 · T3 60+
 *   skill  needs WR ≥ 55%, then $ROI: S4 ≥ 60 · S3 35–60 · S2 20–35 · S1 10–20 · S0
 *   PROVEN       S3–S4 @ T2–T3, or S4 @ T1
 *   ESTABLISHED  S3 @ T1, or S2 @ T3
 *   RISING       S2 @ T1
 *   STALLED / BELOW / EARLY  everything else (statuses, not performing)
 *
 * Form on the wallet's own trailing Source B record in the sport:
 *   PROVEN       OUT = L5 ≤ 2 · IN = L10 ≥ 7 · else MID
 *   ESTABLISHED  IN = L20 ≥ 13 · OUT = L20 11–12 · else MID (MID when < 20 settled)
 *   RISING       IN = L10 ≥ 7 · OUT = L10 ≤ 6 · MID when < 10 settled
 * Pressing = stake ≥ 1.5× the wallet's sport usual (sport-local, same as Q1/UNOPP).
 *
 * Side form = best form among performing-status FOR wallets. Opposition =
 * performing-status wallets on the other side, and whether any is IN form.
 *
 * Four rules, in order (2026-10-05+):
 *   1. MUTE  'form-out'        performing FOR, best form OUT.
 *   2. MUTE  'form-contested'  performing FOR, an IN-form performing wallet AG.
 *   3. BOOST 'form-press-hold' performing FOR, IN form, ≥1 IN-form FOR pressing,
 *                              0 performing AG → max(units, 4) capped at 5.
 *   4. RESCUE 'form-press-rescue' same cell as (3) when the ticket sits at 0u
 *                              because of board-share / st-fat / ev-drift-edge
 *                              → 3u. Every other mute stands.
 *
 * Fail-open: no profile book for the sport on any wallet → HOLD, nothing changes.
 * Never flips, never touches tickets with no performing-status FOR wallet.
 *
 * Steam-era read (Aug 31 → Oct 4, V12 shipped): OUT form 17-19 −8.7u;
 * IN-form tiered against 3-8 −18.9u; IN + press + nobody against 15-5 +30.3u;
 * muted board-share/st-fat/ev-drift in-form sides 20-6 flat.
 * On chain last 60d: IN+press+nobody against 43-19 (69.4%); OUT 62-73 (45.9%).
 *
 * Roll-back: FORM_TIER_FROM = '9999-01-01'.
 */
import { getWalletProfile, normalizeMarketType } from './marketSkillMuteOverlay.js';
import { stakeSizeRatio } from './sizeRatioBands.js';
import { shortWalletId } from './walletClvSkill.js';

export const FORM_TIER_FROM = '2026-10-05';

export const FORM_OUT_MUTED_BY = 'form-out';
export const FORM_CONTESTED_MUTED_BY = 'form-contested';
export const FORM_PRESS_BOOSTED_BY = 'form-press-hold';
export const FORM_PRESS_RESCUED_BY = 'form-press-rescue';

export const FORM_BOOST_FLOOR_U = 4;
export const FORM_BOOST_CAP_U = 5;
export const FORM_RESCUE_U = 3;
export const FORM_PRESS_MIN_SR = 1.5;

/** Mutes the in-form pressing cell may override. Nothing else. */
export const FORM_RESCUE_MUTES = new Set([
  'board-share',
  'st-fat',
  'ev-drift-edge',
]);

export const FORM_MUTE_VALUES = new Set([FORM_OUT_MUTED_BY, FORM_CONTESTED_MUTED_BY]);

export const PERFORMING_GRADES = new Set(['PROVEN', 'ESTABLISHED', 'RISING']);
const GRADE_RANK = { PROVEN: 5, ESTABLISHED: 4, RISING: 3, STALLED: 2, BELOW: 1, EARLY: 0 };
const FORM_RANK = { IN: 2, MID: 1, OUT: 0 };

export function isFormTierLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= FORM_TIER_FROM;
}

export function isFormMuteStamp(value) {
  return FORM_MUTE_VALUES.has(value);
}

export function isFormRescueStamp(value) {
  return value === FORM_PRESS_RESCUED_BY;
}

export function timeTier(n) {
  if (n < 15) return 'T0';
  if (n < 30) return 'T1';
  if (n < 60) return 'T2';
  return 'T3';
}

/** wrPct and roiPct are percentages (profile positions.wr / positions.dollarRoi). */
export function skillTier(n, wrPct, roiPct) {
  if (!(n >= 1) || !Number.isFinite(wrPct) || !Number.isFinite(roiPct)) return 'S0';
  if (wrPct < 55) return 'S0';
  if (roiPct >= 60) return 'S4';
  if (roiPct >= 35) return 'S3';
  if (roiPct >= 20) return 'S2';
  if (roiPct >= 10) return 'S1';
  return 'S0';
}

export function gradeFromTiers(skill, time) {
  if (time === 'T0') return 'EARLY';
  if ((skill === 'S3' || skill === 'S4') && (time === 'T2' || time === 'T3')) return 'PROVEN';
  if (skill === 'S4' && time === 'T1') return 'PROVEN';
  if (skill === 'S3' && time === 'T1') return 'ESTABLISHED';
  if (skill === 'S2' && time === 'T3') return 'ESTABLISHED';
  if (skill === 'S2' && time === 'T1') return 'RISING';
  if (time === 'T2' || time === 'T3') return 'STALLED';
  return 'BELOW';
}

/** Wins in the last N when the window is full, else null. */
function lastNWins(rec, n) {
  if (!rec || typeof rec !== 'object') return null;
  const w = Number(rec.w);
  const l = Number(rec.l);
  if (!Number.isFinite(w) || !Number.isFinite(l)) return null;
  if (w + l < n) return null;
  return w;
}

/**
 * Grade + form for one wallet's sport book. schema=false when the profile
 * has no Source B positions for this sport (cannot judge).
 */
export function gradeSportBook(profile, sport) {
  const rec = profile?.bySport?.[sport];
  const pos = rec?.positions;
  if (!rec || !pos || typeof pos !== 'object') {
    return { schema: false, grade: 'EARLY', form: 'MID', n: 0, L5: null, L10: null, L20: null };
  }
  const n = Number(pos.n) || 0;
  const grade = gradeFromTiers(skillTier(n, Number(pos.wr), Number(pos.dollarRoi)), timeTier(n));
  const form = rec.form || {};
  const L5 = lastNWins(form.actionL5, 5);
  const L10 = lastNWins(form.actionL10, 10);
  const L20 = lastNWins(form.actionL20, 20);
  return { schema: true, grade, form: formOf(grade, { L5, L10, L20 }), n, L5, L10, L20 };
}

export function formOf(grade, { L5 = null, L10 = null, L20 = null } = {}) {
  if (grade === 'PROVEN') {
    if (L5 != null && L5 <= 2) return 'OUT';
    if (L10 != null && L10 >= 7) return 'IN';
    return 'MID';
  }
  if (grade === 'ESTABLISHED') {
    if (L20 == null) return 'MID';
    if (L20 >= 13) return 'IN';
    if (L20 >= 11) return 'OUT';
    return 'MID';
  }
  if (grade === 'RISING') {
    if (L10 == null) return 'MID';
    return L10 >= 7 ? 'IN' : 'OUT';
  }
  return 'MID';
}

function walletList(walletDetails) {
  if (Array.isArray(walletDetails)) return walletDetails;
  if (walletDetails && typeof walletDetails === 'object') return Object.values(walletDetails);
  return [];
}

/**
 * Dedupe ticket wallets (largest stake per wallet), attach grade / form /
 * pressing. onFor = matching side and not an explicit AG direction.
 */
export function classifyFormTier(walletDetails, sideKey, sport, walletProfiles) {
  const side = String(sideKey || '');
  const seen = new Map();
  let schemaN = 0;
  for (const w of walletList(walletDetails)) {
    if (!w || typeof w !== 'object') continue;
    const short = shortWalletId(w.walletShort || w.wallet || w.w);
    if (!short) continue;
    const wSide = String(w.side || '');
    const dir = w.direction != null ? String(w.direction).toUpperCase() : null;
    const onFor = wSide === side && dir !== 'AG';
    const invested = Number(w.invested) || 0;
    const prev = seen.get(short);
    if (prev && invested <= prev.invested) continue;
    const profile = getWalletProfile(walletProfiles, short);
    const book = gradeSportBook(profile, sport);
    if (book.schema) schemaN += 1;
    const sr = stakeSizeRatio(w, profile, sport);
    seen.set(short, {
      short,
      onFor,
      invested,
      sizeRatio: Number.isFinite(sr) ? sr : null,
      press: Number.isFinite(sr) && sr >= FORM_PRESS_MIN_SR,
      ...book,
    });
  }
  const wallets = [...seen.values()];
  const perfFor = wallets.filter((x) => x.onFor && PERFORMING_GRADES.has(x.grade));
  const perfAg = wallets.filter((x) => !x.onFor && PERFORMING_GRADES.has(x.grade));
  const allFor = wallets.filter((x) => x.onFor);
  const bestTier = allFor.length
    ? allFor.reduce((b, x) => (GRADE_RANK[x.grade] > GRADE_RANK[b] ? x.grade : b), 'EARLY')
    : null;
  const bestForm = perfFor.length
    ? perfFor.reduce((b, x) => (FORM_RANK[x.form] > FORM_RANK[b] ? x.form : b), 'OUT')
    : null;
  const inPressN = perfFor.filter((x) => x.form === 'IN' && x.press).length;
  const inAgN = perfAg.filter((x) => x.form === 'IN').length;
  return {
    wallets,
    schemaN,
    perfFor,
    perfAg,
    bestTier,
    bestForm,
    perfForN: perfFor.length,
    perfAgN: perfAg.length,
    inPressN,
    inAgN,
    oppo: !perfAg.length ? 'none' : (inAgN ? 'in-form' : 'mid-out'),
  };
}

export function formBoostUnits(current) {
  const pre = Number.isFinite(current) ? Math.max(0, current) : 0;
  if (!(pre > 0)) return 0;
  if (pre > FORM_BOOST_CAP_U) return pre;
  return Math.min(FORM_BOOST_CAP_U, Math.max(FORM_BOOST_FLOOR_U, pre));
}

function pack(units, action, reason, cls, extra = {}) {
  return {
    units,
    action,
    reason,
    mutedBy: extra.mutedBy ?? null,
    boostedBy: extra.boostedBy ?? null,
    rescuedBy: extra.rescuedBy ?? null,
    rescuedFrom: extra.rescuedFrom ?? null,
    unitsPrePolicy: extra.unitsPrePolicy ?? 0,
    lastMutedBy: extra.lastMutedBy ?? null,
    marketType: extra.marketType ?? null,
    schemaN: cls?.schemaN ?? 0,
    tier: cls?.bestTier ?? null,
    form: cls?.bestForm ?? null,
    perfForN: cls?.perfForN ?? 0,
    perfAgN: cls?.perfAgN ?? 0,
    inPressN: cls?.inPressN ?? 0,
    inAgN: cls?.inAgN ?? 0,
    oppo: cls?.oppo ?? null,
  };
}

/**
 * units is the post-stack stake (0 when muted); unitsPreMute is what the
 * last mute cancelled; mutedBy is that mute's stamp.
 *
 * @returns {{
 *   units: number,
 *   action: 'PASS'|'EXEMPT'|'HOLD'|'MUTE'|'BOOST'|'RESCUE',
 *   reason: string|null,
 *   mutedBy: string|null, boostedBy: string|null, rescuedBy: string|null,
 *   rescuedFrom: string|null, unitsPrePolicy: number,
 *   tier: string|null, form: string|null, oppo: string|null,
 *   perfForN: number, perfAgN: number, inPressN: number, inAgN: number, schemaN: number,
 * }}
 */
export function applyFormTierOverlay({
  units,
  mutedBy = null,
  unitsPreMute = null,
  marketType = null,
  sport = null,
  side = null,
  walletDetails = null,
  walletProfiles = null,
  pickDate = null,
} = {}) {
  const pre = Number.isFinite(units) ? Math.max(0, units) : 0;
  const restore = Number.isFinite(unitsPreMute) ? Math.max(0, unitsPreMute) : 0;
  const mkt = normalizeMarketType(marketType);
  const base = { unitsPrePolicy: pre, lastMutedBy: mutedBy || null, marketType: mkt };

  if (!isFormTierLive(pickDate)) {
    return pack(pre, 'EXEMPT', 'pre_cutover', null, base);
  }
  if (mkt !== 'ML' && mkt !== 'SPREAD' && mkt !== 'TOTAL') {
    return pack(pre, 'EXEMPT', 'market_exempt', null, base);
  }
  if (!sport || side == null || side === '' || !walletProfiles) {
    return pack(pre, 'HOLD', 'schema_missing', null, base);
  }

  const cls = classifyFormTier(walletDetails, side, sport, walletProfiles);
  if (!cls.wallets.length || cls.schemaN === 0) {
    return pack(pre, 'HOLD', 'schema_missing', cls, base);
  }
  if (cls.perfForN === 0) {
    return pack(pre, 'PASS', 'no_performing_for', cls, base);
  }

  if (cls.bestForm === 'OUT') {
    if (pre > 0) {
      return pack(0, 'MUTE', 'form_out', cls, { ...base, mutedBy: FORM_OUT_MUTED_BY });
    }
    return pack(pre, 'HOLD', 'form_out_already_muted', cls, base);
  }
  if (cls.inAgN >= 1) {
    if (pre > 0) {
      return pack(0, 'MUTE', 'form_contested', cls, { ...base, mutedBy: FORM_CONTESTED_MUTED_BY });
    }
    return pack(pre, 'HOLD', 'form_contested_already_muted', cls, base);
  }

  const pressCell = cls.bestForm === 'IN' && cls.inPressN >= 1 && cls.perfAgN === 0;
  if (!pressCell) {
    return pack(pre, 'PASS', cls.bestForm === 'IN' ? 'in_form_hold' : 'mid_form_hold', cls, base);
  }

  if (pre > 0) {
    const next = formBoostUnits(pre);
    if (next > pre + 0.001) {
      return pack(next, 'BOOST', 'form_press_boost', cls, { ...base, boostedBy: FORM_PRESS_BOOSTED_BY });
    }
    return pack(pre, 'PASS', 'form_press_already_sized', cls, base);
  }

  if (!mutedBy || !FORM_RESCUE_MUTES.has(mutedBy)) {
    return pack(pre, 'HOLD', 'mute_not_excepted', cls, base);
  }
  if (!(restore > 0)) {
    return pack(pre, 'HOLD', 'no_pre_units', cls, base);
  }
  return pack(FORM_RESCUE_U, 'RESCUE', 'form_press_rescue', cls, {
    ...base,
    rescuedBy: FORM_PRESS_RESCUED_BY,
    rescuedFrom: mutedBy,
  });
}
