/**
 * Sharp–Market Agreement (SMA)
 *
 * Highest-leverage use of Pinnacle max + line structure against *our*
 * tracked proven sharps: does the sharp book confirm or reject the side
 * our wallets are on — and is that book liquid enough to trust?
 *
 * score ∈ [-1, +1]
 *   + → market moving with our sharps (stronger when limit-tested)
 *   − → market moving against our sharps
 *   ~0 → flat / thin / insufficient data
 *
 * Not a lock-sizing input (v12 stays wallet-authoritative). This is the
 * confirmation / disagreement showcase layer.
 */

export const LIMIT_TESTED_USD = 3000;
export const THIN_MAX_USD = 1000;

/** Liquidity ∈ [0,1]: $500→0, $3k→~0.55, $10k→1 */
export function liquidityScore(maxUsd) {
  if (maxUsd == null || !Number.isFinite(Number(maxUsd)) || Number(maxUsd) <= 0) return null;
  const m = Number(maxUsd);
  const lo = Math.log(500);
  const hi = Math.log(10000);
  return Math.max(0, Math.min(1, (Math.log(Math.max(m, 500)) - lo) / (hi - lo)));
}

/** |Δimplied| in probability points → [0,1]. ~2pp≈0.4, ≥5pp→1 */
export function moveStrength(deltaProbPp) {
  if (deltaProbPp == null || !Number.isFinite(deltaProbPp)) return 0;
  return Math.max(0, Math.min(1, Math.abs(deltaProbPp) / 5));
}

function impliedProb(american) {
  if (american == null || !Number.isFinite(Number(american)) || Number(american) === 0) return null;
  const a = Number(american);
  if (a > 0) return 100 / (a + 100);
  return Math.abs(a) / (Math.abs(a) + 100);
}

function histMax(h, marketType) {
  if (!h || typeof h !== 'object') return null;
  const mt = String(marketType || 'ml').toLowerCase();
  if (mt === 'total') {
    return h.maxTotal ?? h.max ?? null;
  }
  if (mt === 'spread') {
    return h.maxSpread ?? h.max ?? null;
  }
  return h.maxMoneyLine ?? h.max ?? null;
}

/**
 * Extract open→now fair odds for the pick side + max trajectory from pinnacle_history game.
 */
export function extractMarketPath(pinnGame, {
  marketType = 'ml',
  sideNorm = 'home', // home|away|draw (totals: over→home, under→away)
  line = null,
  freezeAtMs = null,
} = {}) {
  const empty = {
    openOdds: null,
    nowOdds: null,
    deltaProbPp: null,
    maxNow: null,
    maxOpen: null,
    maxDelta: null,
    limitTested: false,
    thin: false,
  };
  if (!pinnGame) return empty;

  const mt = String(marketType || 'ml').toLowerCase();
  const isTotal = mt === 'total';
  const isSpread = mt === 'spread';
  const sideIsAway = sideNorm === 'away' || sideNorm === 'under' || sideNorm === 'draw';
  // draw uses away slot only when we stored draw separately — prefer .draw
  const pickDraw = sideNorm === 'draw';

  let hist = [];
  if (isTotal) hist = Array.isArray(pinnGame.totalHistory) ? pinnGame.totalHistory : [];
  else if (isSpread) hist = Array.isArray(pinnGame.spreadHistory) ? pinnGame.spreadHistory : [];
  else hist = Array.isArray(pinnGame.history) ? pinnGame.history : [];

  if (Number.isFinite(freezeAtMs)) {
    const freezeSec = freezeAtMs > 1e12 ? freezeAtMs / 1000 : freezeAtMs;
    hist = hist.filter((h) => !Number.isFinite(h?.t) || h.t <= freezeSec);
  }

  if (isTotal && Number.isFinite(line)) {
    hist = hist.filter((h) => Math.abs(Number(h.line) - Number(line)) <= 0.051);
  }

  const oddsAt = (h) => {
    if (!h) return null;
    if (isTotal) return sideIsAway ? h.underOdds : h.overOdds;
    if (isSpread) return sideIsAway ? h.awayOdds : h.homeOdds;
    if (pickDraw) return Number.isFinite(h.draw) ? h.draw : null;
    return sideIsAway ? h.away : h.home;
  };

  let openOdds = null;
  let nowOdds = null;
  let maxOpen = null;
  let maxNow = null;

  if (hist.length >= 1) {
    openOdds = oddsAt(hist[0]);
    nowOdds = oddsAt(hist[hist.length - 1]);
    maxOpen = histMax(hist[0], mt);
    maxNow = histMax(hist[hist.length - 1], mt);
  }

  // Fall back to opener/current game fields when history thin.
  if (openOdds == null) {
    if (isTotal) {
      const op = pinnGame.totalOpener;
      openOdds = op ? (sideIsAway ? op.underOdds : op.overOdds) : null;
      maxOpen = maxOpen ?? op?.max ?? pinnGame.maxTotal ?? null;
    } else if (isSpread) {
      const op = pinnGame.spreadOpener;
      openOdds = op ? (sideIsAway ? op.awayOdds : op.homeOdds) : null;
      maxOpen = maxOpen ?? op?.max ?? pinnGame.maxSpread ?? null;
    } else {
      const op = pinnGame.opener;
      openOdds = op
        ? (pickDraw ? op.draw : sideIsAway ? op.away : op.home)
        : null;
      maxOpen = maxOpen ?? op?.max ?? pinnGame.maxMoneyLine ?? pinnGame.max ?? null;
    }
  }
  if (nowOdds == null) {
    if (isTotal) {
      const cur = pinnGame.totalCurrent;
      nowOdds = cur ? (sideIsAway ? cur.underOdds : cur.overOdds) : null;
      maxNow = maxNow ?? cur?.max ?? pinnGame.maxTotal ?? null;
    } else if (isSpread) {
      const cur = pinnGame.spreadCurrent;
      nowOdds = cur ? (sideIsAway ? cur.awayOdds : cur.homeOdds) : null;
      maxNow = maxNow ?? cur?.max ?? pinnGame.maxSpread ?? null;
    } else {
      const cur = pinnGame.current;
      nowOdds = cur
        ? (pickDraw ? cur.draw : sideIsAway ? cur.away : cur.home)
        : null;
      maxNow = maxNow ?? cur?.max ?? pinnGame.maxMoneyLine ?? pinnGame.max ?? null;
    }
  }

  const pOpen = impliedProb(openOdds);
  const pNow = impliedProb(nowOdds);
  const deltaProbPp = (pOpen != null && pNow != null)
    ? +((pNow - pOpen) * 100).toFixed(2)
    : null;

  const maxDelta = (Number.isFinite(maxNow) && Number.isFinite(maxOpen))
    ? maxNow - maxOpen
    : null;

  return {
    openOdds: Number.isFinite(openOdds) ? openOdds : null,
    nowOdds: Number.isFinite(nowOdds) ? nowOdds : null,
    deltaProbPp,
    maxNow: Number.isFinite(maxNow) ? maxNow : null,
    maxOpen: Number.isFinite(maxOpen) ? maxOpen : null,
    maxDelta: Number.isFinite(maxDelta) ? maxDelta : null,
    limitTested: Number.isFinite(maxNow) && maxNow >= LIMIT_TESTED_USD,
    thin: Number.isFinite(maxNow) && maxNow < THIN_MAX_USD,
  };
}

/**
 * @param {object} args
 * @param {number} args.provenOnSide — counted proven/CONFIRMED wallets on pick
 * @param {number} [args.vaultOnSide]
 * @param {number|null} args.deltaProbPp — fair implied move toward pick (pp)
 * @param {number|null} args.maxNow
 * @param {number|null} [args.maxDelta] — max stake change since open
 * @param {number|null} [args.liveEvPct] — ticket EV vs current fair (%)
 */
export function computeSharpMarketAgreement({
  provenOnSide = 0,
  vaultOnSide = 0,
  trackedOnSide = 0,
  deltaProbPp = null,
  maxNow = null,
  maxDelta = null,
  liveEvPct = null,
} = {}) {
  const proven = Math.max(0, Number(provenOnSide) || 0);
  const vault = Math.max(0, Number(vaultOnSide) || 0);
  const tracked = Math.max(0, Number(trackedOnSide) || 0);
  // Proven winners weigh most; any tracked sharp on the ticket still counts —
  // MONITORING/TRACKED cards often have wallets that aren't whitelist-proven.
  const sharpN = Math.max(
    proven + (vault > 0 && proven === 0 ? 1 : 0),
    tracked > 0 ? Math.min(tracked, 3) : 0,
  );
  const sharpWeight = sharpN <= 0
    ? 0
    : Math.max(0.35, Math.min(1, 0.35 + 0.22 * Math.min(sharpN, 3)));

  const liq = liquidityScore(maxNow);
  const move = moveStrength(deltaProbPp);
  const dir = deltaProbPp == null || !Number.isFinite(deltaProbPp) || Math.abs(deltaProbPp) < 0.15
    ? 0
    : (deltaProbPp > 0 ? 1 : -1);

  // Rising limits amplify confirmation when direction agrees; falling limits mute.
  let limitAmp = 1;
  if (Number.isFinite(maxDelta) && maxDelta !== 0 && dir !== 0) {
    if (maxDelta > 0 && dir > 0) limitAmp = 1.15;
    else if (maxDelta < 0 && dir > 0) limitAmp = 0.85;
    else if (maxDelta > 0 && dir < 0) limitAmp = 1.1; // book invites more $ while moving against us
  }

  const liqFactor = liq == null ? 0.45 : (0.30 + 0.70 * liq);
  let score = sharpWeight * dir * move * liqFactor * limitAmp;

  // Soft EV agreement — never dominates move×liquidity.
  if (Number.isFinite(liveEvPct) && sharpWeight > 0) {
    const evSoft = Math.max(-1, Math.min(1, liveEvPct / 4));
    score += 0.12 * sharpWeight * evSoft * (liq == null ? 0.5 : (0.4 + 0.6 * liq));
  }

  score = Math.max(-1, Math.min(1, +score.toFixed(3)));

  const thin = Number.isFinite(maxNow) && maxNow < THIN_MAX_USD;
  const limitTested = Number.isFinite(maxNow) && maxNow >= LIMIT_TESTED_USD;
  const liquid = liq != null && liq >= 0.5;

  let state = 'NEUTRAL';
  let label = 'MARKET FLAT';
  let tone = 'neutral'; // confirm | with | neutral | against | oppose | thin

  if (sharpWeight <= 0) {
    // Still surface market structure (max / move / EV) without claiming sharp agreement.
    if (thin) {
      state = 'THIN';
      label = 'THIN PINN';
      tone = 'thin';
    } else if (limitTested) {
      state = 'LIQUID';
      label = 'LIMIT-TESTED';
      tone = 'with';
    } else if (dir > 0 && move >= 0.2) {
      state = 'WITH';
      label = 'PINN MOVE';
      tone = 'with';
    } else if (dir < 0 && move >= 0.2) {
      state = 'AGAINST';
      label = 'PINN MOVE';
      tone = 'against';
    } else if (Number.isFinite(maxNow)) {
      state = 'NEUTRAL';
      label = 'PINN MAX';
      tone = 'neutral';
    } else {
      state = 'NO_SHARPS';
      label = 'NO DATA';
      tone = 'neutral';
    }
  } else if (thin && dir !== 0) {
    state = 'THIN';
    label = 'THIN PINN';
    tone = 'thin';
  } else if (score >= 0.35 && (limitTested || liquid)) {
    state = 'CONFIRMS';
    label = 'SHARPS + PINN';
    tone = 'confirm';
  } else if (score >= 0.15) {
    state = 'WITH';
    label = 'PINN WITH';
    tone = 'with';
  } else if (score <= -0.35 && (limitTested || liquid)) {
    state = 'OPPOSES';
    label = 'PINN OPPOSES';
    tone = 'oppose';
  } else if (score <= -0.15) {
    state = 'AGAINST';
    label = 'PINN VS';
    tone = 'against';
  } else if (limitTested && sharpWeight > 0) {
    // Flat fair but liquid book under our sharps — still a confirmation signal.
    state = 'LIQUID';
    label = 'LIMIT-TESTED';
    tone = 'with';
  } else if (thin) {
    state = 'THIN';
    label = 'THIN PINN';
    tone = 'thin';
  }

  const title = buildTitle({
    state, proven, deltaProbPp, maxNow, maxDelta, liveEvPct, score,
  });

  return {
    score,
    state,
    label,
    tone,
    title,
    sharpWeight: +sharpWeight.toFixed(3),
    liquidity: liq == null ? null : +liq.toFixed(3),
    move: +move.toFixed(3),
    dir,
    limitTested,
    thin,
    maxNow: Number.isFinite(maxNow) ? maxNow : null,
    maxDelta: Number.isFinite(maxDelta) ? maxDelta : null,
    deltaProbPp: Number.isFinite(deltaProbPp) ? deltaProbPp : null,
    liveEvPct: Number.isFinite(liveEvPct) ? liveEvPct : null,
  };
}

function buildTitle({ state, proven, deltaProbPp, maxNow, maxDelta, liveEvPct, score }) {
  const bits = [];
  bits.push(`${proven} proven sharp${proven === 1 ? '' : 's'} on ticket`);
  if (deltaProbPp != null) {
    const abs = Math.abs(deltaProbPp).toFixed(1);
    bits.push(deltaProbPp > 0.15
      ? `Pinnacle fair +${abs}pp toward pick`
      : deltaProbPp < -0.15
        ? `Pinnacle fair ${abs}pp against pick`
        : 'Pinnacle fair flat');
  }
  if (maxNow != null) {
    bits.push(`max $${maxNow >= 1000 ? `${(maxNow / 1000).toFixed(maxNow >= 10000 ? 0 : 1)}K` : Math.round(maxNow)}`);
  }
  if (maxDelta != null && Math.abs(maxDelta) >= 250) {
    bits.push(maxDelta > 0 ? `limit ↑ $${Math.round(maxDelta)}` : `limit ↓ $${Math.round(Math.abs(maxDelta))}`);
  }
  if (liveEvPct != null) {
    bits.push(`live EV ${liveEvPct >= 0 ? '+' : ''}${liveEvPct.toFixed(1)}%`);
  }
  bits.push(`SMA ${score >= 0 ? '+' : ''}${score.toFixed(2)}`);
  const head = {
    CONFIRMS: 'Tracked sharps + liquid Pinnacle agree.',
    WITH: 'Pinnacle leaning with your sharps.',
    LIQUID: 'Liquid Pinnacle under your sharps — fair not moving yet.',
    NEUTRAL: 'No clear Pinnacle confirmation yet.',
    AGAINST: 'Pinnacle leaning against your sharps.',
    OPPOSES: 'Liquid Pinnacle opposes your sharps.',
    THIN: 'Pinnacle limit too thin to treat as confirmation.',
    NO_SHARPS: 'No proven sharps on this side to confirm against.',
  }[state] || '';
  return `${head} ${bits.join(' · ')}`;
}

/**
 * Convenience: pinnacle game + pick context → full SMA payload.
 */
export function sharpMarketAgreementFromPinnGame(pinnGame, ctx = {}) {
  const path = extractMarketPath(pinnGame, ctx);
  return {
    ...computeSharpMarketAgreement({
      provenOnSide: ctx.provenOnSide,
      vaultOnSide: ctx.vaultOnSide,
      trackedOnSide: ctx.trackedOnSide,
      deltaProbPp: path.deltaProbPp,
      maxNow: path.maxNow,
      maxDelta: path.maxDelta,
      liveEvPct: ctx.liveEvPct,
    }),
    path,
  };
}
