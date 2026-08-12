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

/** First / last history point that actually has a max (early prints often lack it). */
function firstHistMax(hist, marketType) {
  for (const h of hist || []) {
    const m = Number(histMax(h, marketType));
    if (Number.isFinite(m) && m > 0) return m;
  }
  return null;
}
function lastHistMax(hist, marketType) {
  const arr = hist || [];
  for (let i = arr.length - 1; i >= 0; i--) {
    const m = Number(histMax(arr[i], marketType));
    if (Number.isFinite(m) && m > 0) return m;
  }
  return null;
}
function minHistMax(hist, marketType) {
  let lo = null;
  for (const h of hist || []) {
    const m = Number(histMax(h, marketType));
    if (!Number.isFinite(m) || m <= 0) continue;
    lo = lo == null ? m : Math.min(lo, m);
  }
  return lo;
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
    deltaFromTroughPp: null,
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
  } else if (isSpread && Number.isFinite(line)) {
    // Ticket may be away -1.5 or home +1.5 — match either side's stamped line.
    hist = hist.filter((h) => {
      const homeLn = Number(h.homeLine);
      const awayLn = Number(h.awayLine);
      return Math.abs(homeLn - Number(line)) <= 0.051
        || Math.abs(awayLn - Number(line)) <= 0.051
        || Math.abs(homeLn + Number(line)) <= 0.051;
    });
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
    // Session low → latest (captures $10K→$20K doubles even when early
    // prints lacked max and firstHistMax would equal lastHistMax).
    maxOpen = minHistMax(hist, mt);
    maxNow = lastHistMax(hist, mt);
  }

  // Fall back to opener/current ONLY when we are not pinned to a specific
  // ticket line. If history was filtered to e.g. Over 7.5 and came up empty,
  // never borrow MAIN 9.5 quotes — that is the line-move leak.
  const pinnedToLine = (isTotal || isSpread) && Number.isFinite(line);
  if (!pinnedToLine && openOdds == null) {
    if (isTotal) {
      const op = pinnGame.totalOpener;
      openOdds = op ? (sideIsAway ? op.underOdds : op.overOdds) : null;
      maxOpen = maxOpen ?? op?.max ?? null;
    } else if (isSpread) {
      const op = pinnGame.spreadOpener;
      openOdds = op ? (sideIsAway ? op.awayOdds : op.homeOdds) : null;
      maxOpen = maxOpen ?? op?.max ?? null;
    } else {
      const op = pinnGame.opener;
      openOdds = op
        ? (pickDraw ? op.draw : sideIsAway ? op.away : op.home)
        : null;
      maxOpen = maxOpen ?? op?.max ?? null;
    }
  }
  if (!pinnedToLine && (nowOdds == null || maxNow == null)) {
    if (isTotal) {
      const cur = pinnGame.totalCurrent;
      if (nowOdds == null) nowOdds = cur ? (sideIsAway ? cur.underOdds : cur.overOdds) : null;
      maxNow = maxNow ?? cur?.max ?? pinnGame.maxTotal ?? null;
    } else if (isSpread) {
      const cur = pinnGame.spreadCurrent;
      if (nowOdds == null) nowOdds = cur ? (sideIsAway ? cur.awayOdds : cur.homeOdds) : null;
      maxNow = maxNow ?? cur?.max ?? pinnGame.maxSpread ?? null;
    } else {
      const cur = pinnGame.current;
      if (nowOdds == null) {
        nowOdds = cur
          ? (pickDraw ? cur.draw : sideIsAway ? cur.away : cur.home)
          : null;
      }
      maxNow = maxNow ?? cur?.max ?? pinnGame.maxMoneyLine ?? pinnGame.max ?? null;
    }
  } else if (pinnedToLine) {
    // Same-line live board for odds + max (even when hist already gave odds).
    if (isTotal && Array.isArray(pinnGame.totalLines)) {
      const live = pinnGame.totalLines.find(
        (r) => Math.abs(Number(r.line) - Number(line)) <= 0.051,
      );
      if (live) {
        if (nowOdds == null) nowOdds = sideIsAway ? live.underOdds : live.overOdds;
        maxNow = maxNow ?? (Number.isFinite(live.max) ? live.max : null);
      }
    } else if (isSpread && Array.isArray(pinnGame.spreadLines)) {
      const live = pinnGame.spreadLines.find((r) => {
        const homeLn = Number(r.homeLine);
        const awayLn = Number(r.awayLine);
        return Math.abs(homeLn - Number(line)) <= 0.051
          || Math.abs(awayLn - Number(line)) <= 0.051
          || Math.abs(homeLn + Number(line)) <= 0.051;
      });
      if (live) {
        if (nowOdds == null) nowOdds = sideIsAway ? live.awayOdds : live.homeOdds;
        maxNow = maxNow ?? (Number.isFinite(live.max) ? live.max : null);
      }
    }
    // Dual-axis story: once we have a real TICKET-line price, never leave MAX
    // blank. Prefer per-line max; else book-level totals/spreads max as liquidity
    // proxy (alts often omit max in the feed). Do NOT invent odds from main.
    if (Number.isFinite(nowOdds) && maxNow == null) {
      maxNow = isTotal
        ? (pinnGame.maxTotal ?? pinnGame.totalCurrent?.max ?? null)
        : (pinnGame.maxSpread ?? pinnGame.spreadCurrent?.max ?? null);
    }
    if (Number.isFinite(openOdds) && maxOpen == null) {
      maxOpen = isTotal
        ? (pinnGame.totalOpener?.max ?? maxNow)
        : (pinnGame.spreadOpener?.max ?? maxNow);
    }
  }

  const pOpen = impliedProb(openOdds);
  const pNow = impliedProb(nowOdds);
  const deltaProbPp = (pOpen != null && pNow != null)
    ? +((pNow - pOpen) * 100).toFixed(2)
    : null;

  // Session trough → now: catches mid-day steam that open→now flattens out.
  // Example: ARI opened -176, dipped to -165, steamed back to -173 — open→now
  // looks flat/against while the live story is WITH the favorite.
  let deltaFromTroughPp = null;
  if (hist.length >= 2 && pNow != null) {
    let troughProb = null;
    for (const h of hist) {
      const o = oddsAt(h);
      const p = impliedProb(o);
      if (p == null) continue;
      troughProb = troughProb == null ? p : Math.min(troughProb, p);
    }
    if (troughProb != null) {
      deltaFromTroughPp = +((pNow - troughProb) * 100).toFixed(2);
    }
  }

  const maxDelta = (Number.isFinite(maxNow) && Number.isFinite(maxOpen))
    ? maxNow - maxOpen
    : null;

  return {
    openOdds: Number.isFinite(openOdds) ? openOdds : null,
    nowOdds: Number.isFinite(nowOdds) ? nowOdds : null,
    deltaProbPp,
    deltaFromTroughPp,
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

/** Absolute Polymarket $ that counts as a lone whale without 1.5× vault size. */
const WHALE_USD = 5000;

/**
 * High-value Locked Picks checklist — what to show when confirmation is real.
 * Ordered by user-facing significance (not SMA math order).
 */
export function buildLockedMarketSignals({
  sma = null,
  evPct = null,
  provenOnSide = 0,
  vaultOnSide = 0,
  trackedOnSide = 0,
  sideInvested = 0,
  clvPct = null,
} = {}) {
  const proven = Math.max(0, Number(provenOnSide) || 0);
  const vault = Math.max(0, Number(vaultOnSide) || 0);
  const tracked = Math.max(0, Number(trackedOnSide) || proven);
  const invested = Math.max(0, Number(sideInvested) || 0);
  const dir = sma?.dir ?? 0;
  const movePp = sma?.deltaProbPp ?? sma?.path?.deltaProbPp ?? null;
  const troughPp = sma?.path?.deltaFromTroughPp ?? null;
  const maxDelta = sma?.maxDelta ?? sma?.path?.maxDelta ?? null;
  const maxNow = sma?.maxNow ?? sma?.path?.maxNow ?? null;
  const maxOpen = sma?.maxOpen ?? sma?.path?.maxOpen ?? null;
  const limitTested = !!(sma?.limitTested || (Number.isFinite(maxNow) && maxNow >= LIMIT_TESTED_USD));
  const withFromOpen = dir > 0 && Number.isFinite(movePp) && movePp >= 0.25;
  const withFromTrough = Number.isFinite(troughPp) && troughPp >= 0.25;
  const steamedWith = withFromOpen || withFromTrough
    || !!(sma?.path?.steamDrop && Number(sma.path.steamDrop.dropPct) >= 3);
  const steamedAgainst = dir < 0 && Number.isFinite(movePp) && movePp <= -0.25
    && !(withFromTrough);
  const limitRising = (Number.isFinite(maxDelta) && maxDelta >= 500)
    || (Number.isFinite(maxOpen) && Number.isFinite(maxNow) && maxOpen > 0
      && maxNow >= maxOpen * 1.45);
  const limitFalling = Number.isFinite(maxDelta) && maxDelta <= -500;
  // Pinn confirms: SMA agree, steam+liquid, OR rising limits under sharps while
  // the live tape is not clearly steaming against the pick.
  const hasSharps = proven >= 1 || vault >= 1 || tracked >= 1;
  const pinnConfirms = sma?.state === 'CONFIRMS' || sma?.state === 'WITH'
    || (steamedWith && limitTested)
    || (limitRising && hasSharps && limitTested && !steamedAgainst);
  const plusEv = Number.isFinite(evPct) && evPct >= 0.3;
  const clvUp = Number.isFinite(clvPct) && clvPct >= 0.3;
  // Sharp consensus: cluster OR a single real sharp ($ / vault size). Solo $33K
  // proven at 0.5× usual must still light — absolute size is the signal.
  const sharpConsensus = proven >= 2
    || (proven >= 1 && vault >= 1)
    || tracked >= 3
    || (proven >= 1 && invested >= WHALE_USD)
    || (vault >= 1 && invested >= WHALE_USD);

  const signals = [
    {
      id: 'sharpConsensus',
      label: 'Sharp Consensus',
      short: 'Sharp',
      met: sharpConsensus,
      tier: 'core',
      tip: 'Proven / tracked sharp money on this side — the who.',
    },
    {
      id: 'pinnacleConfirms',
      label: 'Pinnacle Confirms',
      short: 'Pinn ✓',
      met: pinnConfirms,
      tier: 'high',
      tip: 'Liquid Pinnacle fair is moving with (or standing under) our sharps.',
    },
    {
      id: 'steamWith',
      label: 'Steam With Entry',
      short: 'Steam',
      met: steamedWith,
      tier: 'high',
      tip: 'Fair probability moved toward our side after the market formed — book pressure agrees.',
    },
    {
      id: 'limitRising',
      label: 'Limit Rising',
      short: 'Max ↑',
      met: limitRising,
      tier: 'high',
      tip: 'Pinnacle max stake increased — the fair is getting more liquid / trustworthy.',
    },
    {
      id: 'limitTested',
      label: 'Limit-Tested',
      short: 'Liquid',
      met: limitTested && !limitRising,
      tier: 'med',
      tip: 'Max is already large enough to treat this fair as real size.',
    },
    {
      id: 'plusEv',
      label: '+EV Ticket',
      short: '+EV',
      met: plusEv,
      tier: 'high',
      tip: 'Your flagged price beats no-vig / sharp fair right now.',
    },
    {
      id: 'clvLive',
      label: 'Beating Close',
      short: 'CLV',
      met: clvUp,
      tier: 'med',
      tip: 'Live CLV vs close / peak — you still own a better number than the market’s path.',
    },
  ];

  // Hide dormant med-tier noise when unmet (keep high/core always visible).
  const visible = signals.filter((s) => s.met || s.tier === 'core' || s.tier === 'high');
  const metCount = visible.filter((s) => s.met).length;
  const warnAgainst = steamedAgainst || limitFalling || sma?.state === 'OPPOSES';

  return {
    signals: visible,
    metCount,
    total: visible.length,
    warnAgainst,
    steamedAgainst,
    limitFalling,
  };
}

/**
 * Match a pinnapi steam drop to our ticket (market + side + optional line).
 * Totals: over/under + points near ticket line when present.
 */
export function matchSteamDrop(drops, {
  marketType = 'ml',
  sideNorm = 'home',
  line = null,
  minDropPct = 3,
  sinceSec = null,
} = {}) {
  if (!Array.isArray(drops) || !drops.length) return null;
  const mt = String(marketType || 'ml').toLowerCase();
  const wantMkt = mt === 'total' ? 'total' : mt === 'spread' ? 'spread' : 'ml';
  const wantSide = mt === 'total'
    ? (sideNorm === 'away' || sideNorm === 'under' ? 'under' : 'over')
    : (sideNorm === 'away' ? 'away' : sideNorm === 'draw' ? 'draw' : 'home');
  let best = null;
  for (const d of drops) {
    if (!d || d.market !== wantMkt || d.side !== wantSide) continue;
    if (!(Number(d.dropPct) >= minDropPct)) continue;
    if (Number.isFinite(sinceSec) && Number.isFinite(d.t) && d.t < sinceSec) continue;
    if (wantMkt !== 'ml' && Number.isFinite(line) && Number.isFinite(d.points)
        && Math.abs(d.points - line) > 0.051
        && Math.abs(Math.abs(d.points) - Math.abs(line)) > 0.051) {
      continue;
    }
    if (!best || (d.dropPct || 0) > (best.dropPct || 0)) best = d;
  }
  return best;
}

/**
 * Convenience: pinnacle game + pick context → full SMA payload.
 */
export function sharpMarketAgreementFromPinnGame(pinnGame, ctx = {}) {
  const path = extractMarketPath(pinnGame, ctx);
  const steam = matchSteamDrop(pinnGame?.steamDrops, {
    marketType: ctx.marketType,
    sideNorm: ctx.sideNorm,
    line: ctx.line,
    minDropPct: 3,
  });
  // Prefer trough→now when it shows clearer WITH steam than open→now
  // (mid-session dips then steam back toward the pick).
  const openPp = Number.isFinite(path.deltaProbPp) ? path.deltaProbPp : null;
  const troughPp = Number.isFinite(path.deltaFromTroughPp) ? path.deltaFromTroughPp : null;
  const agreePp = (openPp == null && troughPp == null)
    ? null
    : Math.max(openPp ?? -Infinity, troughPp ?? -Infinity);
  const base = computeSharpMarketAgreement({
    provenOnSide: ctx.provenOnSide,
    vaultOnSide: ctx.vaultOnSide,
    trackedOnSide: ctx.trackedOnSide,
    deltaProbPp: Number.isFinite(agreePp) ? agreePp : openPp,
    maxNow: path.maxNow,
    maxDelta: path.maxDelta,
    liveEvPct: ctx.liveEvPct,
  });
  // Explicit Edge drop on our side counts as steam-with even if open→now history is flat.
  if (steam && (base.dir == null || base.dir >= 0)) {
    if (base.state === 'NEUTRAL' || base.state === 'LIQUID' || base.dir === 0) {
      base.state = 'WITH';
      base.label = 'PINN STEAM';
      base.tone = 'with';
    }
  }
  return {
    ...base,
    path: {
      ...path,
      steamDrop: steam,
      steamDropPct: steam?.dropPct ?? null,
    },
  };
}
