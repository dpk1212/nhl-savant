/**
 * Sport whitelist / Proven bag.
 *
 * v5 (2026-09-26) Door 2 — Source B only. A-only cannot be Proven.
 *   CONFIRMED = positions.n ≥ 6 AND WR ≥ 55 AND dollarRoi > 3
 *   FLAT      = not assigned (every Proven wallet is CONFIRMED)
 *   WR50      = WR ≥ 50 on A (n≥2) or B (n≥4)
 *
 * Recent-dollar and size-skill rescues do not grant CONFIRMED.
 * HARD+ (sport×market n≥4 WR≥62 $ROI≥10) is a separate overlay.
 *
 * Roll-back: revert this file / WHITELIST_VERSION to 4.
 */
export const WHITELIST_VERSION = 5;
export const WHITELIST_FROM = '2026-09-26';

export const WHITELIST_MIN_BETS = 2; // Source A / WR50-A
export const B_ONLY_MIN_BETS = 4;    // WR50-B + audit B flags (not Proven)
export const B_WR50_MIN_BETS = B_ONLY_MIN_BETS;

export const PROVEN_B_MIN_N = 6;
export const PROVEN_B_MIN_WR = 55;
/** Exclusive: dollarRoi must be strictly greater than this. */
export const PROVEN_B_MIN_DOLLAR_ROI = 3;

/**
 * Source B sport book clears the Door 2 Proven bar.
 * @param {{ n?: number, wr?: number, dollarRoi?: number }|null|undefined} pos
 */
export function isDoor2ConfirmedPositions(pos) {
  if (!pos || typeof pos !== 'object') return false;
  const n = Number(pos.n) || 0;
  const wr = Number(pos.wr);
  const dol = Number(pos.dollarRoi);
  return n >= PROVEN_B_MIN_N
    && Number.isFinite(wr) && wr >= PROVEN_B_MIN_WR
    && Number.isFinite(dol) && dol > PROVEN_B_MIN_DOLLAR_ROI;
}

/**
 * Classify one (wallet, sport) book.
 * Extra opts (recentWindow / sizeLift) are ignored — kept so callers
 * of the v4 signature do not break.
 */
export function classifyWhitelistTierWithSource(picksInSport, positionsInSport, _opts = {}) {
  const p = picksInSport || { n: 0 };
  const q = positionsInSport || { n: 0 };

  const wr50OkA = (p.n || 0) >= WHITELIST_MIN_BETS && (p.wr ?? 0) >= 50;
  const wr50OkB = (q.n || 0) >= B_WR50_MIN_BETS && (q.wr ?? 0) >= 50;
  const aActive = (p.n || 0) >= WHITELIST_MIN_BETS;

  if (isDoor2ConfirmedPositions(q)) {
    return {
      tier: 'CONFIRMED',
      source: aActive ? 'A+B' : 'B',
      whitelistRescue: null,
    };
  }

  if (wr50OkA || wr50OkB) {
    let source = null;
    if (wr50OkA && wr50OkB) source = 'A+B';
    else if (wr50OkA) source = 'A';
    else source = 'B';
    return { tier: 'WR50', source, whitelistRescue: null };
  }

  return { tier: null, source: null, whitelistRescue: null };
}

export function classifyWhitelistTier(picksInSport, positionsInSport, opts) {
  return classifyWhitelistTierWithSource(picksInSport, positionsInSport, opts).tier;
}

/**
 * Live CONFIRMED from a sport rec.
 * When `positions` is present (production profiles), Door 2 B stats win
 * so a stale Firebase stamp cannot keep A-only / soft-B wallets Proven.
 * When `positions` is missing (unit-test fixtures), fall back to the stamp.
 */
export function isConfirmedSportRec(rec) {
  if (!rec) return false;
  if (rec.positions != null && typeof rec.positions === 'object') {
    return isDoor2ConfirmedPositions(rec.positions);
  }
  return String(rec.whitelistTier || '').toUpperCase() === 'CONFIRMED';
}

/** Proven bag = CONFIRMED. FLAT is no longer assigned and is not Proven. */
export function isProvenSportRec(rec) {
  return isConfirmedSportRec(rec);
}
