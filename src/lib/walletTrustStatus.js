/**
 * Wallet trust status — tier floors on a wallet's running edge vs its own
 * prices, plus last-10 form, walked forward day by day (2026-10-09).
 *
 * Research (Source B, 39k graded positions Apr 17 → Oct 4, walk-forward):
 * tier-4+ form-ON wallets beat their prices by +2.8pp on V12 sides,
 * tier-1–2 form-OFF wallets −2.5pp. On the live book since Jun 1, moneyline
 * plays with a tier-4+ form-ON wallet FOR went 120-60 (66.7%, +21.1%) vs
 * 259-217 (54.4%, +2.2%) without one; every month ≥ 60.5%. Spreads and
 * totals show no sport-level effect; the market-level status is stamped as a
 * shadow there.
 *
 * Definitions (unchanged from the research machine):
 *   edge   = 100 × (wins / n − Σ price / n)            running, all decided bets
 *   tier   = n < 10 → 0 · edge ≥ +8 → 5 · ≥ +4 → 4 · ≥ 0 → 3 · ≥ −4 → 2 · else 1
 *   peak   = best tier held with n ≥ 10; FALLEN = tier < peak until regained
 *   form   = last 10 decided bets: wins − Σ price ≥ 0 → ON (fewer than 5 → ON)
 *   status = UNPROVEN (tier 0) · FALLEN_OFF · FALLEN_ON · STABLE_OFF ·
 *            REGAINED_ON (back at peak within 14 days, form ON) · STABLE_ON
 * Bookkeeping runs once per calendar day BEFORE that day's bets, so the
 * state for a day never sees that day's results.
 */

export const TRUST_TIER_MIN_N = 10;
export const TRUST_FORM_WINDOW = 10;
export const TRUST_FORM_MIN_N = 5;
export const TRUST_REGAINED_DAYS = 14;
export const TRUST_TIER_MIN = 4;
export const TRUST_ON_STATUSES = Object.freeze(['STABLE_ON', 'REGAINED_ON']);
export const TRUST_OFF_STATUSES = Object.freeze(['STABLE_OFF', 'FALLEN_OFF']);

export function trustTier(edgePp, n = TRUST_TIER_MIN_N) {
  if (!(n >= TRUST_TIER_MIN_N) || !Number.isFinite(edgePp)) return 0;
  if (edgePp >= 8) return 5;
  if (edgePp >= 4) return 4;
  if (edgePp >= 0) return 3;
  if (edgePp >= -4) return 2;
  return 1;
}

function daysBetween(a, b) {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);
}

function dateAfter(d) {
  const t = new Date(Date.parse(`${d}T00:00:00Z`) + 86400000);
  return t.toISOString().slice(0, 10);
}

/** Decided, priced bets only, oldest first. */
export function trustBets(rows) {
  const out = [];
  for (const r of rows || []) {
    if (!r || !r.date) continue;
    const price = Number(r.price);
    if (!(price > 0 && price < 1)) continue;
    if (r.push === true) continue;
    if (r.won !== true && r.won !== false && r.won !== 1 && r.won !== 0) continue;
    out.push({ date: String(r.date).slice(0, 10), price, won: r.won === true || r.won === 1, key: r.key == null ? '' : String(r.key) });
  }
  // Same-day order only moves the last-10 window edge; a stable secondary key
  // keeps the form flag deterministic from run to run.
  out.sort((a, b) => a.date.localeCompare(b.date) || a.key.localeCompare(b.key));
  return out;
}

export function isTrustOn(status) {
  return TRUST_ON_STATUSES.includes(status);
}

export function isTrustOff(status) {
  return TRUST_OFF_STATUSES.includes(status);
}

/** Tier ≥ TRUST_TIER_MIN and form ON — the live moneyline gate. */
export function isTrustedWallet(trust, tierMin = TRUST_TIER_MIN) {
  return !!trust && Number(trust.tier) >= tierMin && isTrustOn(trust.status);
}

/**
 * Walk a wallet's decided bets forward and return the state as of `asOf`
 * (default: the day after the last bet — i.e. everything graded so far,
 * nothing from today). Pass `asOf` to read the state on an earlier day;
 * bets on or after that day are ignored.
 */
export function buildTrustState(rows, { asOf = null } = {}) {
  const bets = trustBets(rows).filter((b) => !asOf || b.date < asOf);
  const s = {
    n: 0, w: 0, sumPx: 0, last: [], first: bets[0]?.date ?? null,
    peak: 0, peakDate: null, fellAt: null, fellFrom: 0, regained: 0, drops: 0,
  };
  const snapshot = (date) => {
    const edge = s.n ? 100 * (s.w / s.n - s.sumPx / s.n) : 0;
    const tier = trustTier(edge, s.n);
    const L = s.last.slice(-TRUST_FORM_WINDOW);
    const Lw = L.filter((x) => x.won).length;
    const Lpx = L.reduce((t, x) => t + x.price, 0);
    const formOn = L.length >= TRUST_FORM_MIN_N ? Lw - Lpx >= 0 : true;
    const formMargin = L.length >= TRUST_FORM_MIN_N ? (100 * (Lw - Lpx)) / L.length : 0;
    if (tier > 0) {
      if (tier > s.peak) {
        s.peak = tier; s.peakDate = date;
        if (s.fellAt) { s.fellAt = null; s.regained += 1; }
      } else if (tier < s.peak && !s.fellAt) {
        s.fellAt = date; s.fellFrom = s.peak; s.drops += 1;
      } else if (tier >= s.peak && s.fellAt) {
        s.fellAt = null; s.regained += 1;
      }
    }
    const fallen = !!s.fellAt;
    const status = tier === 0 ? 'UNPROVEN'
      : fallen && !formOn ? 'FALLEN_OFF'
        : fallen ? 'FALLEN_ON'
          : !formOn ? 'STABLE_OFF'
            : (s.regained > 0 && s.peakDate && daysBetween(s.peakDate, date) <= TRUST_REGAINED_DAYS) ? 'REGAINED_ON'
              : 'STABLE_ON';
    return {
      status, tier, n: s.n,
      edge: Math.round(edge * 10) / 10,
      formOn, formMargin: Math.round(formMargin * 10) / 10,
      formN: L.length,
      peak: s.peak, fallen,
      fellFrom: fallen ? s.fellFrom : null,
      sinceFall: fallen ? daysBetween(s.fellAt, date) : null,
      regained: s.regained,
      daysActive: s.first ? daysBetween(s.first, date) : 0,
      asOf: date,
    };
  };
  let i = 0;
  let lastDate = null;
  while (i < bets.length) {
    const date = bets[i].date;
    snapshot(date);
    while (i < bets.length && bets[i].date === date) {
      const b = bets[i];
      s.n += 1; s.w += b.won ? 1 : 0; s.sumPx += b.price;
      s.last.push({ won: b.won, price: b.price });
      if (s.last.length > TRUST_FORM_WINDOW) s.last.shift();
      i += 1;
    }
    lastDate = date;
  }
  const finalDate = asOf || (lastDate ? dateAfter(lastDate) : new Date().toISOString().slice(0, 10));
  const out = snapshot(finalDate);
  out.lastBetDate = lastDate;
  return out;
}

/** Compact form for the wallet profile / Firestore stamp. */
export function trustSummary(state) {
  if (!state) return null;
  return {
    status: state.status,
    tier: state.tier,
    n: state.n,
    edge: state.edge,
    formOn: state.formOn,
    formMargin: state.formMargin,
    peak: state.peak,
    fallen: state.fallen,
    sinceFall: state.sinceFall,
    daysActive: state.daysActive,
    lastBetDate: state.lastBetDate ?? null,
    asOf: state.asOf,
  };
}
