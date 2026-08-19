/**
 * Ticket EV vs no-vig fair — same formula the Locked card paints.
 * EV% = (p_fair − p_offer) × 100.
 */

export function impliedFromAmerican(o) {
  if (o == null || !Number.isFinite(Number(o))) return null;
  const n = Number(o);
  return n < 0 ? Math.abs(n) / (Math.abs(n) + 100) : 100 / (n + 100);
}

export function americanFromProb(p) {
  if (p == null || !Number.isFinite(p) || p <= 0 || p >= 1) return null;
  if (p >= 0.5) return Math.round((-100 * p) / (1 - p));
  return Math.round((100 * (1 - p)) / p);
}

/** Multiplicative no-vig fair American for `sideIdx` in a 2-way / 3-way list. */
export function noVigFairAmerican(sideOddsList, sideIdx = 0) {
  const raw = (sideOddsList || []).map(impliedFromAmerican);
  if (!raw.every((p) => p != null && p > 0)) return null;
  const sum = raw.reduce((s, p) => s + p, 0);
  if (!(sum > 0)) return null;
  return americanFromProb(raw[sideIdx] / sum);
}

export function fairProbFromNoVig(sideOddsList, sideIdx = 0) {
  const raw = (sideOddsList || []).map(impliedFromAmerican);
  if (!raw.every((p) => p != null && p > 0)) return null;
  const sum = raw.reduce((s, p) => s + p, 0);
  if (!(sum > 0)) return null;
  return raw[sideIdx] / sum;
}

/** EV in percentage points vs a fair win probability. */
export function evPctVsFairProb(offerOdds, fairProb) {
  const offerP = impliedFromAmerican(offerOdds);
  if (offerP == null || fairProb == null || !Number.isFinite(fairProb)) return null;
  return +((fairProb - offerP) * 100).toFixed(1);
}
