/**
 * Market-skill mute overlay — last 0u cancel after no-CONFIRMED.
 *
 * Does NOT hide wallets from v12. Does NOT resize, repath, or flip.
 * v12 / leftover / Policy T / unit-tier / no-CONFIRMED run unchanged.
 * This overlay only 0u's a ticket that already published size.
 *
 * ML (user-book): HOLD if ≥1 FOR wallet has sport×ML Source B
 *   n≥6 and WR≥52. Else MUTE.
 *
 * S/T (two-layer):
 *   1. Qualified-money vote on sport×market Source B.
 *      Qual = n≥4 AND (WR≥50 OR positionFlatRoi>0 OR dollarRoi>0).
 *      EMPTY / FLIP / TIE → MUTE. Do not flip the ticket.
 *   2. HARD permission slip: ≥1 FOR wallet with n≥4 WR≥62 $ROI≥10.
 *      No HARD backer → MUTE.
 *
 * Fail-open (HOLD at exact units) when we cannot judge:
 *   missing walletProfiles, empty walletDetails, or no sport×byMarket
 *   schema on any ticket wallet. Never wipe the book on a load miss.
 *
 * Going-forward only. Roll-back: set MARKET_SKILL_MUTE_FROM = '9999-01-01'.
 */
import { shortWalletId } from './walletClvSkill.js';

export const MARKET_SKILL_MUTE_FROM = '2026-09-24';

export const ML_SKILL_MIN_N = 6;
export const ML_SKILL_MIN_WR = 52;

export const QUAL_MIN_N = 4;
export const QUAL_MIN_WR = 50;

export const ST_HARD_MIN_N = 4;
export const ST_HARD_MIN_WR = 62;
export const ST_HARD_MIN_DOLLAR_ROI = 10;

export const ML_MKT_SKILL_MUTED_BY = 'ml-mkt-skill';
export const ST_QUAL_WIPE_MUTED_BY = 'st-qual-wipe';
export const ST_HARD_SLIP_MUTED_BY = 'st-hard-slip';

export function isMarketSkillMuteLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= MARKET_SKILL_MUTE_FROM;
}

export function normalizeMarketType(marketType) {
  const raw = String(marketType || '').toUpperCase();
  if (raw === 'MONEYLINE' || raw === 'ML') return 'ML';
  if (raw === 'SPREAD' || raw === 'SPREADS') return 'SPREAD';
  if (raw === 'TOTAL' || raw === 'TOTALS') return 'TOTAL';
  return raw || null;
}

function walletList(walletDetails) {
  if (Array.isArray(walletDetails)) return walletDetails;
  if (walletDetails && typeof walletDetails === 'object') return Object.values(walletDetails);
  return [];
}

export function getWalletProfile(walletProfiles, short) {
  if (!walletProfiles || !short) return null;
  const key = String(short).toLowerCase();
  if (typeof walletProfiles.get === 'function') {
    return walletProfiles.get(key)
      || walletProfiles.get(key.toUpperCase())
      || walletProfiles.get(short)
      || null;
  }
  return walletProfiles[key] || walletProfiles[key.toUpperCase()] || walletProfiles[short] || null;
}

/**
 * Sport×market Source B positions. schema=false when byMarket is missing
 * on this sport (cannot judge). pos may be null when the market key is absent.
 */
export function marketPositions(profile, sport, market) {
  const rec = profile?.bySport?.[sport];
  if (!rec || rec.byMarket == null || typeof rec.byMarket !== 'object') {
    return { schema: false, pos: null };
  }
  const mkt = normalizeMarketType(market);
  const mRec = rec.byMarket[mkt] || rec.byMarket[market] || null;
  return { schema: true, pos: mRec?.positions || null };
}

export function isMarketQualified(pos) {
  if (!pos || typeof pos !== 'object') return false;
  const n = Number(pos.n) || 0;
  if (n < QUAL_MIN_N) return false;
  const wr = Number(pos.wr);
  const flat = Number(pos.positionFlatRoi);
  const dol = Number(pos.dollarRoi);
  return (Number.isFinite(wr) && wr >= QUAL_MIN_WR)
    || (Number.isFinite(flat) && flat > 0)
    || (Number.isFinite(dol) && dol > 0);
}

export function isHardMarketWallet(pos) {
  if (!pos || typeof pos !== 'object') return false;
  const n = Number(pos.n) || 0;
  const wr = Number(pos.wr);
  const dol = Number(pos.dollarRoi);
  return n >= ST_HARD_MIN_N
    && Number.isFinite(wr) && wr >= ST_HARD_MIN_WR
    && Number.isFinite(dol) && dol >= ST_HARD_MIN_DOLLAR_ROI;
}

export function isMlSkillWallet(pos) {
  if (!pos || typeof pos !== 'object') return false;
  const n = Number(pos.n) || 0;
  const wr = Number(pos.wr);
  return n >= ML_SKILL_MIN_N && Number.isFinite(wr) && wr >= ML_SKILL_MIN_WR;
}

/**
 * Deduped ticket wallets with FOR/AG + invested + market book.
 * onFor follows no-CONFIRMED: matching side, exclude explicit AG direction.
 */
export function attachMarketBooks(walletDetails, sideKey, sport, market, walletProfiles) {
  const list = walletList(walletDetails);
  const side = String(sideKey || '');
  const seen = new Map();
  let schemaN = 0;
  for (const w of list) {
    if (!w || typeof w !== 'object') continue;
    const short = shortWalletId(w.walletShort || w.wallet);
    if (!short) continue;
    const wSide = String(w.side || '');
    if (wSide && wSide !== side) {
      // opposing side still needed for the qual $ vote
    }
    const dir = w.direction != null ? String(w.direction).toUpperCase() : null;
    const onFor = wSide === side && dir !== 'AG';
    const invested = Number(w.invested) || 0;
    const prev = seen.get(short);
    if (prev && invested <= prev.invested) continue;
    const profile = getWalletProfile(walletProfiles, short);
    const book = marketPositions(profile, sport, market);
    if (book.schema) schemaN += 1;
    seen.set(short, {
      short,
      onFor,
      invested,
      schema: book.schema,
      pos: book.pos,
    });
  }
  return { wallets: [...seen.values()], schemaN };
}

export function qualMoneyVote(wallets) {
  let forD = 0;
  let agD = 0;
  let qualN = 0;
  for (const w of wallets) {
    if (!isMarketQualified(w.pos)) continue;
    qualN += 1;
    if (w.onFor) forD += w.invested;
    else agD += w.invested;
  }
  if (qualN === 0 || forD + agD <= 0) return { vote: 'EMPTY', forD, agD, qualN };
  if (forD > agD) return { vote: 'AGREE', forD, agD, qualN };
  if (agD > forD) return { vote: 'FLIP', forD, agD, qualN };
  return { vote: 'TIE', forD, agD, qualN };
}

function identity(units, action, reason, extra = {}) {
  const pre = Number.isFinite(units) ? Math.max(0, units) : 0;
  return {
    units: pre,
    action,
    reason,
    mutedBy: null,
    unitsPrePolicy: pre,
    ...extra,
  };
}

/**
 * Last-step market-skill mute. Never changes units unless a gate fires.
 * 4u+ is NOT exempt — this is a skill filter, like no-CONFIRMED.
 */
export function applyMarketSkillMuteOverlay({
  units,
  marketType = null,
  sport = null,
  side = null,
  walletDetails = null,
  walletProfiles = null,
  pickDate = null,
} = {}) {
  const pre = Number.isFinite(units) ? Math.max(0, units) : 0;
  const mkt = normalizeMarketType(marketType);
  const extra = { marketType: mkt, vote: null, schemaN: 0, hardN: 0, mlSkillN: 0 };

  if (!(pre > 0)) {
    return {
      units: 0, action: 'PASS', reason: null, mutedBy: null, unitsPrePolicy: pre, ...extra,
    };
  }
  if (!isMarketSkillMuteLive(pickDate)) {
    return identity(pre, 'EXEMPT', 'pre_cutover', extra);
  }
  if (mkt !== 'ML' && mkt !== 'SPREAD' && mkt !== 'TOTAL') {
    return identity(pre, 'EXEMPT', 'market_exempt', extra);
  }
  if (!sport || side == null || side === '') {
    return identity(pre, 'HOLD', 'schema_missing', extra);
  }
  if (!walletProfiles) {
    return identity(pre, 'HOLD', 'schema_missing', extra);
  }

  const { wallets, schemaN } = attachMarketBooks(
    walletDetails, side, sport, mkt, walletProfiles,
  );
  extra.schemaN = schemaN;
  if (!wallets.length || schemaN === 0) {
    return identity(pre, 'HOLD', 'schema_missing', extra);
  }

  if (mkt === 'ML') {
    const skill = wallets.filter((w) => w.onFor && isMlSkillWallet(w.pos));
    extra.mlSkillN = skill.length;
    if (skill.length >= 1) {
      return identity(pre, 'HOLD', null, extra);
    }
    return {
      units: 0,
      action: 'MUTE',
      reason: 'ml_no_skill_slip',
      mutedBy: ML_MKT_SKILL_MUTED_BY,
      unitsPrePolicy: pre,
      ...extra,
    };
  }

  const vote = qualMoneyVote(wallets);
  extra.vote = vote.vote;
  extra.qualForD = vote.forD;
  extra.qualAgD = vote.agD;
  extra.qualN = vote.qualN;
  if (vote.vote !== 'AGREE') {
    const reason = vote.vote === 'FLIP' ? 'st_qual_flip'
      : vote.vote === 'TIE' ? 'st_qual_tie'
        : 'st_qual_empty';
    return {
      units: 0,
      action: 'MUTE',
      reason,
      mutedBy: ST_QUAL_WIPE_MUTED_BY,
      unitsPrePolicy: pre,
      ...extra,
    };
  }

  const hard = wallets.filter((w) => w.onFor && isHardMarketWallet(w.pos));
  extra.hardN = hard.length;
  if (hard.length >= 1) {
    return identity(pre, 'HOLD', null, extra);
  }
  return {
    units: 0,
    action: 'MUTE',
    reason: 'st_no_hard_slip',
    mutedBy: ST_HARD_SLIP_MUTED_BY,
    unitsPrePolicy: pre,
    ...extra,
  };
}
