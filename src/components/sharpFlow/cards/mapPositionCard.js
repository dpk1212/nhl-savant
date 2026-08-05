/**
 * Adapters: production Sharp Flow data → PositionCards fixture shape.
 * Display-only. Never changes stake formulas or stamps.
 */
import { AGS_V12_STAKE_TIER_META } from '../../../lib/ags.js';
import { CLV_SKILL_MIN_N, EDGE_PRIOR_AG_WR, NET_CLV_PRIOR_AG } from '../../../lib/walletClvSkill.js';

/** Same floor as EDGE (scripts/syncPickStateAuthoritative WINNER_ALIGN_MIN_N). */
export const FEATURED_WR_MIN_N = 8;
export { EDGE_PRIOR_AG_WR, NET_CLV_PRIOR_AG, CLV_SKILL_MIN_N };

/** Featured sport WR when it clears the EDGE floor (n≥8). */
export function featuredWrFromProfile(profile, sport) {
  const picks = profile?.bySport?.[sport]?.picks;
  const wr = Number(picks?.wr);
  const n = Number(picks?.n) || 0;
  if (n < FEATURED_WR_MIN_N || !Number.isFinite(wr)) return null;
  return wr;
}

/** Causal %+CLV when it clears the netCLV floor (n≥5). */
export function netClvPctFromProfile(profile) {
  const clv = profile?.clvSkill;
  const pct = Number(clv?.pctPos);
  const n = Number(clv?.n) || 0;
  if (n < CLV_SKILL_MIN_N || !Number.isFinite(pct)) return null;
  return pct;
}

/**
 * Clears EDGE and/or netCLV floors (same as staking skill features).
 * Does not grant whitelist / proven / Path A HC.
 */
export function isSkillEligibleProfile(profile, sport) {
  if (!profile) return false;
  return featuredWrFromProfile(profile, sport) != null
    || netClvPctFromProfile(profile) != null;
}

const shortTeam = (name) => {
  if (!name) return '—';
  const parts = String(name).trim().split(/\s+/);
  return parts[parts.length - 1] || name;
};

const ip = (o) => {
  if (o == null || !Number.isFinite(Number(o))) return null;
  const n = Number(o);
  return n < 0 ? Math.abs(n) / (Math.abs(n) + 100) : 100 / (n + 100);
};

const probToAmerican = (p) => {
  if (p == null || !Number.isFinite(p) || p <= 0 || p >= 1) return null;
  if (p >= 0.5) return Math.round((-100 * p) / (1 - p));
  return Math.round((100 * (1 - p)) / p);
};

/**
 * Multiplicative no-vig fair (industry standard for 2-way / 3-way).
 * p_fair_i = p_raw_i / Σ p_raw. Returns fair American for `sideIdx`.
 */
export function noVigFairAmerican(sideOddsList, sideIdx = 0) {
  const raw = (sideOddsList || []).map(ip);
  if (!raw.every((p) => p != null && p > 0)) return null;
  const sum = raw.reduce((s, p) => s + p, 0);
  if (!(sum > 0)) return null;
  return probToAmerican(raw[sideIdx] / sum);
}

/** EV in percentage points vs a fair win probability: (p_fair − p_offer) × 100. */
export function evPctVsFairProb(offerOdds, fairProb) {
  const offerP = ip(offerOdds);
  if (offerP == null || fairProb == null || !Number.isFinite(fairProb)) return null;
  return +((fairProb - offerP) * 100).toFixed(1);
}

export function fairProbFromNoVig(sideOddsList, sideIdx = 0) {
  const raw = (sideOddsList || []).map(ip);
  if (!raw.every((p) => p != null && p > 0)) return null;
  const sum = raw.reduce((s, p) => s + p, 0);
  if (!(sum > 0)) return null;
  return raw[sideIdx] / sum;
}

const fmtEt = (ts) => {
  if (!ts) return '';
  if (typeof ts === 'string' && /AM|PM/i.test(ts) && !ts.includes('T')) return ts;
  const e = typeof ts === 'number' ? ts : Date.parse(ts);
  if (Number.isNaN(e)) return typeof ts === 'string' ? ts : '';
  return new Date(e).toLocaleTimeString('en-US', {
    timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', hour12: true,
  });
};

const normTape = (action) => {
  const a = String(action || '').toLowerCase();
  if (a === 'boost' || a === 'mute' || a === 'keep') return a;
  if (a === 'fail_open' || a === 'hold') return 'keep';
  return 'keep';
};

const pathBaseUnits = (stakeTier) => {
  if (!stakeTier) return 0;
  const meta = AGS_V12_STAKE_TIER_META[stakeTier];
  return Number.isFinite(meta?.units) ? meta.units : 0;
};

/**
 * Enrich walletDetails / backing wallets with profile fields for ConvictionRow.
 * `getRecordForDisplay(short, sport)` picks the stronger sport book (featured
 * picks vs positions) — same helper BackingWalletStrip / THE RECEIPTS use.
 */
export function enrichWallets(rawWallets, sport, getWalletProfile, isSportWinner, getRecordForDisplay) {
  if (!Array.isArray(rawWallets)) return [];
  return rawWallets
    .filter((w) => w && (w.invested || 0) > 0)
    .map((w) => {
      const short = String(w.wallet || w.short || '').slice(-6);
      const profile = getWalletProfile?.(short);
      const sportRec = profile?.bySport?.[sport];
      const picks = sportRec?.picks;
      const positions = sportRec?.positions;

      // Whitelist-coherent record first (the record that EARNED the badge).
      const wlRec = getRecordForDisplay?.(short, sport) || null;
      const wr = Number.isFinite(wlRec?.wr) ? wlRec.wr
        : Number.isFinite(picks?.wr) && (picks.n || 0) >= 2 ? picks.wr
        : Number.isFinite(positions?.wr) && (positions.n || 0) >= 2 ? positions.wr
        : Number.isFinite(w.wr) ? w.wr : null;
      const roi = Number.isFinite(wlRec?.roi) ? Math.round(wlRec.roi)
        : Number.isFinite(picks?.flatRoi) ? Math.round(picks.flatRoi)
        : Number.isFinite(positions?.positionFlatRoi) ? Math.round(positions.positionFlatRoi)
        : Number.isFinite(w.roi) ? Math.round(w.roi) : null;
      const dollarRoi = Number.isFinite(positions?.dollarRoi) ? Math.round(positions.dollarRoi)
        : Number.isFinite(w.dollarRoi) ? Math.round(w.dollarRoi) : null;
      const wins = Number.isFinite(wlRec?.wins) ? wlRec.wins
        : (picks?.n || 0) >= 2 ? (picks.wins || 0)
        : positions?.n ? (positions.wins || 0)
        : null;
      const losses = Number.isFinite(wlRec?.losses) ? wlRec.losses
        : (picks?.n || 0) >= 2 ? (picks.losses || 0)
        : positions?.n ? (positions.losses || 0)
        : null;
      const decided = (Number.isFinite(wins) && Number.isFinite(losses)) ? wins + losses : 0;
      const record = decided > 0 ? `${wins}-${losses}` : (w.record && w.record !== '—' ? w.record : null);

      // "vs usual" MUST match cron / HC: invested / cross-sport avgSportBet
      // (sports_sharps.avgSportBet stamped on the position). Do not use
      // perSport[sport] here — Path A HC and v8_sizeRatio use the same
      // cross-sport denominator.
      const feedCrossAvg = Number.isFinite(w.avgSportBet) && w.avgSportBet > 0 ? w.avgSportBet : null;
      const medianBet = profile?.sizeSignal?.medianInvested;
      const usualBet = feedCrossAvg
        || (Number.isFinite(medianBet) && medianBet > 0 ? medianBet : null);
      // Prefer stamped sizeRatio (cron / HC). Usual $ for display MUST agree
      // with that ratio — never show profile median next to a mismatched ×.
      const sizeRatio = Number.isFinite(w.sizeRatio) ? w.sizeRatio
        : (usualBet != null && (w.invested || 0) > 0) ? +(w.invested / usualBet).toFixed(2) : null;
      const avgSportBet = (Number.isFinite(sizeRatio) && sizeRatio > 0 && (w.invested || 0) > 0)
        ? Math.round((w.invested || 0) / sizeRatio)
        : (usualBet != null ? Math.round(usualBet) : null);
      // Causal %+CLV ("beats the close"): profile.clvSkill from exportWalletProfiles
      // (same definition as the tape/netCLV cron). Never invent a default %.
      const profileClv = profile?.clvSkill?.pctPos;
      const priorClvPct = Number.isFinite(w.priorClvPct) ? Math.round(w.priorClvPct)
        : Number.isFinite(w.causalPctPos) ? Math.round(w.causalPctPos)
        : Number.isFinite(profileClv) ? Math.round(profileClv)
        : null;
      // PROVEN badge must match header / battle proven counts: whitelist
      // winner AND ≥0.10× usual (writeSharpActions SHADOW floor). Token
      // bets from whitelist wallets stay on the CARRYING list as LIGHT.
      // SECONDARY = clears EDGE/net floors without being proven — display only.
      const MODEL_MIN = 0.10;
      const whitelisted = isSportWinner ? !!isSportWinner(short, sport) : true;
      const counted = !Number.isFinite(sizeRatio) || sizeRatio <= 0 || sizeRatio >= MODEL_MIN;
      const proven = whitelisted && counted;
      const featuredWr = featuredWrFromProfile(profile, sport);
      const netClvPct = netClvPctFromProfile(profile);
      const edgeEligible = featuredWr != null;
      const netEligible = netClvPct != null;
      const skillEligible = edgeEligible || netEligible;
      const badges = proven
        ? ['SHARP', `${sport} WINNER`]
        : whitelisted
          ? ['SHARP', 'LIGHT']
          : skillEligible
            ? ['SHARP', 'SECONDARY']
            : ['SHARP', 'TRACKING'];
      return {
        short,
        // Preserve feed side (away/home/draw/over/under) when present — locked
        // clarity map + live board both need it after enrich.
        side: w.side || null,
        proven,
        whitelisted,
        skillEligible,
        edgeEligible,
        netEligible,
        featuredWr: edgeEligible ? Math.round(featuredWr) : null,
        netClvPct: netEligible ? Math.round(netClvPct) : null,
        badges,
        whitelist: sportRec?.whitelistTier || (whitelisted ? 'CONFIRMED' : null),
        qualify: sizeRatio >= 0.75 ? 'VAULT' : 'SHADOW',
        sizeRatio,
        record,
        wins: Number.isFinite(wins) ? wins : null,
        losses: Number.isFinite(losses) ? losses : null,
        decided,
        wr: Number.isFinite(wr) ? Math.round(wr) : null,
        roi,
        dollarRoi,
        invested: w.invested || 0,
        avgSportBet,
        cents: w.cents ?? null,
        pnl: w.pnl || 0,
        priorClvPct,
      };
    })
    .sort((a, b) =>
      (Number(!!b.proven) - Number(!!a.proven))
      || (Number(!!b.skillEligible) - Number(!!a.skillEligible))
      || (Number(!!b.whitelisted) - Number(!!a.whitelisted))
      || ((b.sizeRatio || 0) - (a.sizeRatio || 0))
    );
}

/**
 * Live market board for a locked pick from pinnacle_history.json.
 * Returns pinSeries (fair-book overtime), books[], bestOdds/bestBook, dual-side
 * labels for totals/ML. Fail-soft → empty board when history missing.
 */
export function buildLockedMarketOdds(pick, pinnacleHistory) {
  const empty = {
    pinSeries: null,
    books: [],
    bestOdds: null,
    bestBook: null,
    fairNow: null,
    fairNoVig: null,
    fairProb: null,
    fairIsNoVig: false,
    marketLine: null,
    ourLabel: null,
    oppLabel: null,
    oppBestOdds: null,
    oppBestBook: null,
    updatedAgoSec: null,
  };
  if (!pick || !pinnacleHistory) return empty;
  const sport = pick.sport;
  const gameKey = pick.gameKey
    || (typeof pick.key === 'string' ? pick.key.split(':')[0]?.split('_').slice(2).join('_') : null);
  // docId is date_sport_gameKey — prefer explicit gameKey
  let gk = pick.gameKey;
  if (!gk && typeof pick.key === 'string') {
    // key = `${date}_${sport}_${gameKey}:${side}` or with _spread/_total suffix on doc
    const docPart = pick.key.split(':')[0] || '';
    const parts = docPart.split('_');
    // date(YYYY-MM-DD) _ sport _ gameKey…  → drop first two tokens
    if (parts.length >= 3) {
      const rest = parts.slice(2).join('_').replace(/_(spread|total)$/i, '');
      gk = rest || null;
    }
  }
  const pinnGame = sport && gk ? pinnacleHistory?.[sport]?.[gk] : null;
  if (!pinnGame) return empty;

  const mt = String(pick.marketType || 'ml').toLowerCase();
  const isTotal = mt === 'total';
  const isSpread = mt === 'spread';
  const teamRaw = (pick.team || '').trim();
  const sideKey = pick.side
    || pick.pickSide
    || (isTotal
      ? (teamRaw.toLowerCase().startsWith('under') ? 'under' : 'over')
      : (/^draw$/i.test(teamRaw) ? 'draw'
        : (shortTeam(pick.team) === shortTeam(pick.away) ? 'away' : 'home')));

  const books = [];
  let pinSeries = null;
  let bestOdds = null;
  let bestBook = null;
  let fairNow = null;
  /** Both-side sharp prices for no-vig (our side first for sideIdx=0). */
  let fairPair = null; // number[]
  let marketLine = Number.isFinite(pick.line) ? pick.line : null;
  let ourLabel = null;
  let oppLabel = null;
  let oppBestOdds = null;
  let oppBestBook = null;
  let latestT = null;

  if (isTotal) {
    const hist = Array.isArray(pinnGame.totalHistory) ? pinnGame.totalHistory : [];
    const pts = hist
      .map((h) => (sideKey === 'under' ? h.underOdds : h.overOdds))
      .filter(Number.isFinite);
    pinSeries = pts.length >= 2 ? pts : null;
    const last = hist[hist.length - 1];
    if (last) {
      fairNow = sideKey === 'under' ? last.underOdds : last.overOdds;
      const over = last.overOdds;
      const under = last.underOdds;
      if (Number.isFinite(over) && Number.isFinite(under)) {
        fairPair = sideKey === 'under' ? [under, over] : [over, under];
      }
      if (Number.isFinite(last.line)) marketLine = last.line;
      if (Number.isFinite(last.t)) latestT = last.t;
    } else if (pinnGame.totalCurrent) {
      fairNow = sideKey === 'under'
        ? pinnGame.totalCurrent.underOdds
        : pinnGame.totalCurrent.overOdds;
      const over = pinnGame.totalCurrent.overOdds;
      const under = pinnGame.totalCurrent.underOdds;
      if (Number.isFinite(over) && Number.isFinite(under)) {
        fairPair = sideKey === 'under' ? [under, over] : [over, under];
      }
      if (Number.isFinite(pinnGame.totalCurrent.line)) marketLine = pinnGame.totalCurrent.line;
    }
    const best = sideKey === 'under' ? pinnGame.bestUnder : pinnGame.bestOver;
    const opp = sideKey === 'under' ? pinnGame.bestOver : pinnGame.bestUnder;
    if (best && Number.isFinite(best.odds)) {
      bestOdds = best.odds;
      bestBook = best.book || null;
      if (Number.isFinite(best.line)) marketLine = best.line;
    }
    if (opp && Number.isFinite(opp.odds)) {
      oppBestOdds = opp.odds;
      oppBestBook = opp.book || null;
    }
    ourLabel = sideKey === 'under'
      ? `Under ${marketLine ?? ''}`.trim()
      : `Over ${marketLine ?? ''}`.trim();
    oppLabel = sideKey === 'under'
      ? `Over ${opp?.line ?? marketLine ?? ''}`.trim()
      : `Under ${opp?.line ?? marketLine ?? ''}`.trim();
    if (Number.isFinite(fairNow)) {
      books.push({ name: pinnGame.fairTotalBook || 'Pinnacle', odds: fairNow, sharp: true });
    }
    if (bestBook && Number.isFinite(bestOdds) && bestBook.toLowerCase() !== 'pinnacle') {
      books.push({ name: bestBook, odds: bestOdds, best: true });
    }
  } else if (isSpread) {
    const hist = Array.isArray(pinnGame.spreadHistory) ? pinnGame.spreadHistory : [];
    const pts = hist
      .map((h) => (sideKey === 'away' ? h.awayOdds : h.homeOdds))
      .filter(Number.isFinite);
    pinSeries = pts.length >= 2 ? pts : null;
    const last = hist[hist.length - 1];
    if (last) {
      fairNow = sideKey === 'away' ? last.awayOdds : last.homeOdds;
      const a = last.awayOdds;
      const h = last.homeOdds;
      if (Number.isFinite(a) && Number.isFinite(h)) {
        fairPair = sideKey === 'away' ? [a, h] : [h, a];
      }
      const ln = sideKey === 'away' ? last.awayLine : last.homeLine;
      if (Number.isFinite(ln)) marketLine = ln;
      if (Number.isFinite(last.t)) latestT = last.t;
    }
    const best = sideKey === 'away' ? pinnGame.bestAwaySpread : pinnGame.bestHomeSpread;
    const opp = sideKey === 'away' ? pinnGame.bestHomeSpread : pinnGame.bestAwaySpread;
    if (best && Number.isFinite(best.odds)) {
      bestOdds = best.odds;
      bestBook = best.book || null;
      if (Number.isFinite(best.line)) marketLine = best.line;
    }
    if (opp && Number.isFinite(opp.odds)) {
      oppBestOdds = opp.odds;
      oppBestBook = opp.book || null;
    }
    const teamShort = sideKey === 'away' ? shortTeam(pick.away) : shortTeam(pick.home);
    const oppShort = sideKey === 'away' ? shortTeam(pick.home) : shortTeam(pick.away);
    const fmtLn = (ln) => (Number.isFinite(ln) ? `${ln > 0 ? '+' : ''}${ln}` : '');
    ourLabel = `${teamShort} ${fmtLn(marketLine)}`.trim();
    oppLabel = `${oppShort} ${fmtLn(opp?.line)}`.trim();
    if (Number.isFinite(fairNow)) {
      books.push({ name: pinnGame.fairSpreadBook || 'Pinnacle', odds: fairNow, sharp: true });
    }
    if (bestBook && Number.isFinite(bestOdds)) {
      books.push({ name: bestBook, odds: bestOdds, best: true });
    }
  } else {
    // Moneyline
    const hist = Array.isArray(pinnGame.history) ? pinnGame.history : [];
    const pts = hist
      .map((h) => (sideKey === 'away' ? h.away : sideKey === 'draw' ? h.draw : h.home))
      .filter(Number.isFinite);
    pinSeries = pts.length >= 2 ? pts : null;
    const last = hist[hist.length - 1];
    const snap = last || pinnGame.current || null;
    if (snap) {
      fairNow = sideKey === 'away' ? snap.away : sideKey === 'draw' ? snap.draw : snap.home;
      if (Number.isFinite(last?.t)) latestT = last.t;
      const a = snap.away;
      const h = snap.home;
      const d = snap.draw;
      if (sideKey === 'draw' && Number.isFinite(a) && Number.isFinite(h) && Number.isFinite(d)) {
        fairPair = [d, a, h];
      } else if (Number.isFinite(a) && Number.isFinite(h)) {
        fairPair = sideKey === 'away' ? [a, h] : [h, a];
      }
    }
    bestOdds = sideKey === 'away' ? pinnGame.bestAway
      : sideKey === 'draw' ? pinnGame.bestDraw
      : pinnGame.bestHome;
    bestBook = sideKey === 'away' ? pinnGame.bestAwayBook
      : sideKey === 'draw' ? pinnGame.bestDrawBook
      : pinnGame.bestHomeBook;
    oppBestOdds = sideKey === 'away' ? pinnGame.bestHome : pinnGame.bestAway;
    oppBestBook = sideKey === 'away' ? pinnGame.bestHomeBook : pinnGame.bestAwayBook;
    ourLabel = sideKey === 'draw' ? 'Draw'
      : (sideKey === 'away' ? shortTeam(pick.away) : shortTeam(pick.home));
    oppLabel = sideKey === 'draw' ? null
      : (sideKey === 'away' ? shortTeam(pick.home) : shortTeam(pick.away));

    const allBooks = pinnGame.allBooks || {};
    const sideOdds = (b) => (sideKey === 'away' ? b?.away : sideKey === 'draw' ? b?.draw : b?.home);
    if (Number.isFinite(fairNow)) {
      books.push({
        name: (pinnGame.fairBook || 'pinnacle').replace(/^\w/, (c) => c.toUpperCase()),
        odds: fairNow,
        sharp: true,
      });
    }
    const seen = new Set(books.map((b) => b.name.toLowerCase()));
    // Prefer recognizable retail books, then fill from allBooks
    const prefer = ['draftkings', 'fanduel', 'betmgm', 'caesars', 'fanatics', 'betonlineag', 'lowvig', 'bookmaker', 'circa'];
    const keys = [
      ...prefer.filter((k) => allBooks[k]),
      ...Object.keys(allBooks).filter((k) => !prefer.includes(k) && k !== 'pinnacle'),
    ];
    for (const k of keys) {
      const b = allBooks[k];
      const o = sideOdds(b);
      if (!Number.isFinite(o)) continue;
      const name = b?.name || k;
      if (seen.has(String(name).toLowerCase())) continue;
      seen.add(String(name).toLowerCase());
      const isBest = bestBook && String(name).toLowerCase() === String(bestBook).toLowerCase();
      books.push({ name, odds: o, best: !!isBest });
      if (books.length >= 8) break;
    }
    if (bestBook && Number.isFinite(bestOdds)
        && !books.some((b) => String(b.name).toLowerCase() === String(bestBook).toLowerCase())) {
      books.push({ name: bestBook, odds: bestOdds, best: true });
    }
  }

  let updatedAgoSec = null;
  if (Number.isFinite(latestT)) {
    // history timestamps are unix seconds in this feed
    const ms = latestT > 1e12 ? latestT : latestT * 1000;
    updatedAgoSec = Math.max(0, Math.round((Date.now() - ms) / 1000));
  }

  // Multiplicative no-vig fair (standard). Fall back to vigged sharp price.
  const fairProb = fairPair ? fairProbFromNoVig(fairPair, 0) : null;
  const fairNoVig = fairPair ? noVigFairAmerican(fairPair, 0) : null;
  const fairIsNoVig = Number.isFinite(fairNoVig);
  const fairDisplay = fairIsNoVig ? fairNoVig : (Number.isFinite(fairNow) ? fairNow : null);

  return {
    pinSeries,
    books,
    bestOdds: Number.isFinite(bestOdds) ? bestOdds : null,
    bestBook: bestBook || null,
    fairNow: Number.isFinite(fairNow) ? fairNow : null,
    fairNoVig: Number.isFinite(fairNoVig) ? fairNoVig : null,
    fairProb: fairProb != null ? fairProb : null,
    fairIsNoVig,
    fairDisplay,
    marketLine: Number.isFinite(marketLine) ? marketLine : null,
    ourLabel,
    oppLabel,
    oppBestOdds: Number.isFinite(oppBestOdds) ? oppBestOdds : null,
    oppBestBook: oppBestBook || null,
    updatedAgoSec,
  };
}

/**
 * Locked pick (allLockedArr entry) → LockedPositionCardView fixture
 */
export function mapLockedPickToCardFixture(pick, {
  getWalletProfile,
  isSportWinner,
  getRecordForDisplay,
  record30d = null,
  tierPerf = null,
  pinnacleHistory = null,
} = {}) {
  const units = Number.isFinite(pick.units) ? pick.units : 0;
  const odds = Number.isFinite(pick.odds) ? pick.odds : null;
  const lockOdds = odds;
  const peakOdds = Number.isFinite(pick.lockPinnOdds) ? pick.lockPinnOdds
    : Number.isFinite(pick.pinnacleOdds) ? pick.pinnacleOdds : lockOdds;
  const nowOdds = Number.isFinite(pick.closingOdds) ? pick.closingOdds
    : Number.isFinite(pick.pinnacleOdds) ? pick.pinnacleOdds : peakOdds;

  const lockProb = ip(lockOdds);
  const closeProb = ip(pick.closingOdds ?? nowOdds);
  let clvPct = null;
  if (Number.isFinite(pick.clv)) {
    clvPct = +(pick.clv * (Math.abs(pick.clv) <= 1 ? 100 : 1)).toFixed(1);
  } else if (lockProb != null && closeProb != null) {
    clvPct = +((closeProb - lockProb) * 100).toFixed(1);
  } else {
    clvPct = 0;
  }

  const isTotal = pick.marketType === 'total';
  const isSpread = pick.marketType === 'spread';
  const teamRaw = (pick.team || '').trim();
  const isDraw = !isTotal && !isSpread && /^draw$/i.test(teamRaw);
  const teamShort = isTotal
    ? ((pick.team || '').toLowerCase().startsWith('under') ? 'Under' : 'Over')
    : isDraw ? 'Draw' : shortTeam(pick.team);
  const awayShort = isTotal ? 'Under' : shortTeam(pick.away);
  const homeShort = isTotal ? 'Over' : shortTeam(pick.home);
  const side = isTotal
    ? (teamShort === 'Over' ? 'home' : 'away')
    : isDraw ? 'draw'
    : (teamShort === awayShort ? 'away' : 'home');

  const pickLabel = isSpread
    ? `${teamShort} ${pick.line > 0 ? '+' : ''}${pick.line}`
    : isTotal ? (pick.team || 'Total')
    : isDraw ? 'Draw ML'
    : `${teamShort} ML`;

  const stakePath = pick.hcStakeTier || pick.lockTier || 'LOCK';
  const tapeAction = normTape(pick.tapeAction || pick.v8_tapeAction);
  // Only surface tape/edge/CLV when the stamp is actually on the pick — no fake defaults.
  const tapeScore = Number.isFinite(pick.tapeScore) ? pick.tapeScore
    : Number.isFinite(pick.v8_tapeScore) ? pick.v8_tapeScore
    : null;
  const edgeBandAction = pick.edgeBandAction || pick.v8_edgeBandAction || null;
  const edgeNetAction = pick.edgeNetAction || pick.v8_edgeNetSizeAction || null;

  const edge = Number.isFinite(pick.winnerAlignEdge) ? pick.winnerAlignEdge : null;
  const netClv = Number.isFinite(pick.netClv) ? pick.netClv
    : Number.isFinite(pick.v8_netMeanPrior) ? pick.v8_netMeanPrior : null;

  const wallets = enrichWallets(
    pick.backingWallets || [],
    pick.sport,
    getWalletProfile,
    isSportWinner,
    getRecordForDisplay,
  );

  // Normalize totals over/under → home/away so board sides match `side`.
  const normSide = (s) => {
    if (s === 'over') return 'home';
    if (s === 'under') return 'away';
    return s || null;
  };

  // Both-side board for the clarity map. Prefer stamped boardWallets; fall
  // back to play-side receipts so the expanded card still has something.
  const boardRaw = (Array.isArray(pick.boardWallets) && pick.boardWallets.length
    ? pick.boardWallets
    : (pick.backingWallets || []).map((w) => ({ ...w, side: w.side || side }))
  ).map((w) => ({ ...w, side: normSide(w.side) || side }));

  const mapWallets = enrichWallets(
    boardRaw,
    pick.sport,
    getWalletProfile,
    isSportWinner,
    getRecordForDisplay,
  ).map((w) => {
    const marketSide = normSide(w.side) || side;
    return {
      ...w,
      marketSide,
      side: marketSide === side ? 'ours' : 'against',
    };
  });

  const againstRows = mapWallets.filter((w) => w.side === 'against');
  const meanFinite = (arr) => {
    const xs = arr.filter(Number.isFinite);
    if (!xs.length) return null;
    return +(xs.reduce((s, v) => s + v, 0) / xs.length).toFixed(1);
  };
  const againstInvested = againstRows.reduce((s, w) => s + (w.invested || 0), 0);
  const againstAbbr = side === 'draw'
    ? `${awayShort}/${homeShort}`
    : side === 'home' ? awayShort : homeShort;
  const againstLabel = side === 'draw'
    ? `${pick.away || awayShort} / ${pick.home || homeShort}`
    : side === 'home' ? (pick.away || awayShort) : (pick.home || homeShort);
  const against = {
    abbr: againstAbbr,
    label: againstLabel,
    proven: againstRows.filter((w) => w.proven).length,
    invested: againstInvested,
    avgRoi: meanFinite(againstRows.map((w) => w.roi)),
    avgClv: meanFinite(againstRows.map((w) => w.priorClvPct)),
    avgWr: meanFinite(againstRows.map((w) => w.wr)),
  };

  // Proven count MUST equal PROVEN badges on THE RECEIPTS (and the live
  // board's confirmedOnSide): whitelist winner + ≥0.10× usual. Prefer that
  // census over a stamped agsProvenForCount that can drift from who we paint.
  const MODEL_MIN = 0.10;
  const isCounted = (w) => {
    const sr = Number(w?.sizeRatio);
    return !Number.isFinite(sr) || sr <= 0 || sr >= MODEL_MIN;
  };
  const provenFromWallets = wallets.filter((w) => w.proven && isCounted(w)).length;
  // When receipts exist, count equals badges — never prefer a stale stamp.
  const confirmedOnSide = wallets.length > 0
    ? provenFromWallets
    : (Number.isFinite(pick.agsProvenForCount) ? pick.agsProvenForCount : 0);
  const vaultOnSide = wallets.filter((w) => (w.sizeRatio || 0) >= 1.5).length;
  const base = pathBaseUnits(stakePath);

  const toWin = (() => {
    if (!Number.isFinite(odds) || units <= 0) return 0;
    if (odds < 0) return units * (100 / Math.abs(odds));
    return units * (odds / 100);
  })();

  const gameTime = fmtEt(pick.gameTime) || 'TBD';
  const lockedAt = fmtEt(pick.lockedAt) || '—';
  const peakAt = fmtEt(pick.peakAt) || lockedAt;
  const commenceMs = (() => {
    if (typeof pick.gameTime === 'number' && Number.isFinite(pick.gameTime)) return pick.gameTime;
    const e = Date.parse(pick.gameTime);
    return Number.isFinite(e) ? e : null;
  })();
  const moneyPct = Number.isFinite(pick.consensusStrength?.moneyPct)
    ? pick.consensusStrength.moneyPct
    : null;

  const dateStr = (() => {
    const e = typeof pick.gameTime === 'number' ? pick.gameTime : Date.parse(pick.gameTime);
    if (Number.isNaN(e)) return 'XXXX';
    const d = new Date(e);
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    return `${mm}${dd}`;
  })();
  const mkt = isSpread ? 'SP' : isTotal ? 'TOT' : 'ML';
  const serial = `SF-${pick.sport || 'XX'}-${dateStr}-${mkt}`;

  const lockChecks = [];
  if (confirmedOnSide >= 1) lockChecks.push('Proven winners backing');
  if ((pick.hcMargin || 0) >= 1 || vaultOnSide >= 1) lockChecks.push('High conviction');
  if ((pick.consensusStrength?.moneyPct || 0) >= 60) lockChecks.push('Money concentrated');

  const outcome = pick.outcome || pick.result?.outcome || null;
  const profit = Number.isFinite(pick.profit) ? pick.profit
    : Number.isFinite(pick.result?.profit) ? pick.result.profit
    : null;
  const graded = !!outcome && (outcome === 'WIN' || outcome === 'LOSS' || outcome === 'PUSH');

  const market = buildLockedMarketOdds(
    { ...pick, side: pick.side || pick.pickSide || side },
    pinnacleHistory,
  );
  const sparseJourney = [lockOdds, peakOdds, nowOdds].filter(Number.isFinite);
  const pinSeries = market.pinSeries;
  // Dense fair-book overtime when available; else lock→peak→now snapshots.
  const journey = (pinSeries && pinSeries.length >= 2) ? pinSeries : sparseJourney;
  const fairLine = Number.isFinite(market.fairDisplay) ? market.fairDisplay
    : (Number.isFinite(pick.pinnacleOdds) ? pick.pinnacleOdds : peakOdds);
  // EV vs no-vig fair when both sides exist; else vigged-sharp proxy (legacy).
  const fairProb = market.fairProb != null
    ? market.fairProb
    : ip(fairLine);
  const evFlagged = evPctVsFairProb(lockOdds, fairProb);
  const evBest = evPctVsFairProb(market.bestOdds, fairProb);

  return {
    id: pick.key || `${pick.sport}-${pickLabel}`,
    sport: pick.sport,
    away: pick.away || '',
    home: pick.home || '',
    awayShort,
    homeShort,
    pickLabel,
    side,
    marketType: isSpread ? 'spread' : isTotal ? 'total' : 'ml',
    displayState: graded ? 'GRADED' : 'LOCKED',
    outcome,
    profit,
    graded,
    stakePath,
    units,
    toWin,
    odds: lockOdds,
    book: pick.book || 'Pinnacle',
    fairOdds: fairLine,
    fairProb: Math.round((fairProb || 0.5) * 100),
    fairIsNoVig: !!market.fairIsNoVig,
    evFlagged: Number.isFinite(evFlagged) ? evFlagged : null,
    evBest: Number.isFinite(evBest) ? evBest : null,
    tapeAction,
    tapeScore,
    edgeBandAction,
    edgeNetAction,
    pathBaseUnits: base || units,
    hcMargin: Number.isFinite(pick.hcMargin) ? pick.hcMargin : 0,
    edge,
    netClv,
    confirmedOnSide,
    vaultOnSide,
    setupHitRate: null,
    sideInvested: pick.totalInvested || pick.lockTotalInvested || 0,
    wallets,
    mapWallets: mapWallets.length ? mapWallets : null,
    against,
    sharpUsd: pick.totalInvested || pick.lockTotalInvested || 0,
    journey,
    pinSeries,
    books: market.books,
    bestOdds: market.bestOdds,
    bestBook: market.bestBook,
    ourMarketLabel: market.ourLabel,
    oppMarketLabel: market.oppLabel,
    oppBestOdds: market.oppBestOdds,
    oppBestBook: market.oppBestBook,
    marketLine: market.marketLine,
    oddsUpdatedAgoSec: market.updatedAgoSec,
    combinedWalletPnl: wallets.reduce((s, w) => s + (w.pnl || 0), 0),
    gameTime,
    lockedAt,
    lockOdds,
    peakOdds,
    peakAt,
    nowOdds,
    clvPct,
    serial,
    record30d: record30d || null,
    lockChecks: lockChecks.length ? lockChecks : ['Locked ticket'],
    commenceMs,
    moneyPct,
    // Odds we flagged (pre T-15) vs fair / no-vig for the market board.
    gotOdds: lockOdds,
    fairLine,
    fairBook: pick.fairBook || pick.oddsSource || pick.book || null,
    tierPerf: tierPerf || null,
    // Mute audit — why TRACKED / 0u (tape-weak, ags-quality-veto, MONITORING…)
    mutedBy: pick.mutedBy || null,
    unitsPreTape: Number.isFinite(pick.unitsPreTape) ? pick.unitsPreTape
      : Number.isFinite(pick.v8_unitsPreTape) ? pick.v8_unitsPreTape
      : null,
  };
}

/**
 * Live game card fields → LivePositionCardView fixture (one market)
 */
export function mapLiveGameToCardFixture({
  gd,
  marketType = 'ML', // ML | SPREAD | TOTAL
  displayState,
  stakePath,
  units,
  odds,
  book,
  fairOdds,
  toWin,
  side, // 'home' | 'away' | 'over' | 'under'
  gameTimeLabel,
  isLive,
  tapeAction,
  tapeScore,
  edge,
  netClv,
  hcMargin,
  confirmedOnSide,
  vaultOnSide,
  sideInvested,
  sides, // { away: {invested, sharps, avg, pnl}, home: {...} }
  flow, // { sharp, tickets, money } each {away, home}
  pinOpen,
  pinNow,
  books,
  wallets,
  pinnacleOpposes,
  pickLabel,
  pathBase,
  setupHitRate,
  updatedLabel,
  pinSeries,
  mapWallets, // both-sides enriched wallets (each tagged side:'away'|'home') for the quadrant map
  commenceMs, // game start epoch ms — ticket stub uses this for the T-15 freeze countdown
  tierPerf, // display-tier L7/L30 { label, window, record, wr, roi, n, color }
}) {
  const isTotal = marketType === 'TOTAL';
  const awayShort = isTotal ? 'Under' : shortTeam(gd.away);
  const homeShort = isTotal ? 'Over' : shortTeam(gd.home);
  const normSide = side === 'over' ? 'home' : side === 'under' ? 'away' : side;

  const u = Number.isFinite(units) ? units : 0;
  const stake = stakePath || 'MONITORING';
  const base = Number.isFinite(pathBase) ? pathBase : pathBaseUnits(stake);
  const tape = normTape(tapeAction);
  // No fake tape scores: only show the meter when a real stamp exists.
  const score = Number.isFinite(tapeScore) ? tapeScore : null;

  const fair = Number.isFinite(fairOdds) ? fairOdds : (Number.isFinite(odds) ? odds : null);
  const fairProb = fair != null ? Math.round((ip(fair) || 0.5) * 100) : null;

  const emptySide = { invested: 0, sharps: 0, avg: 0, pnl: 0 };
  const s = sides || { away: emptySide, home: emptySide };
  // sharp split always exists (derived from our own invested totals);
  // public tickets/money stay null unless a real flow feed provided them.
  const f = {
    sharp: flow?.sharp || { away: 50, home: 50 },
    tickets: flow?.tickets || null,
    money: flow?.money || null,
  };
  const sideKey = normSide === 'draw' ? 'draw' : normSide === 'home' ? 'home' : 'away';
  const defaultPickLabel = isTotal
    ? (normSide === 'home' ? 'Over' : 'Under')
    : normSide === 'draw' ? 'Draw ML'
    : `${normSide === 'home' ? homeShort : awayShort} ML`;

  return {
    id: `${gd.sport}-${gd.key}-${marketType}`,
    sport: gd.sport,
    away: gd.away,
    home: gd.home,
    awayShort,
    homeShort,
    pickLabel: pickLabel || defaultPickLabel,
    side: normSide || 'home',
    marketType,
    displayState: displayState || 'MONITORING',
    stakePath: stake,
    units: u,
    toWin: Number.isFinite(toWin) ? toWin : 0,
    odds: Number.isFinite(odds) ? odds : null,
    book: book || 'Pinnacle',
    fairOdds: fair,
    fairProb,
    tapeAction: tape,
    tapeScore: score,
    pathBaseUnits: base,
    hcMargin: Number.isFinite(hcMargin) ? hcMargin : 0,
    edge: Number.isFinite(edge) ? edge : null,
    netClv: Number.isFinite(netClv) ? netClv : null,
    confirmedOnSide: confirmedOnSide || 0,
    vaultOnSide: vaultOnSide || 0,
    setupHitRate: Number.isFinite(setupHitRate) ? setupHitRate : null,
    sideInvested: sideInvested || s[sideKey]?.invested || 0,
    pinnacleOpposes: !!pinnacleOpposes,
    sharpMoneyPct: f.sharp?.[sideKey] ?? 50,
    sides: s,
    flow: f,
    pinOpen: pinOpen || null,
    pinNow: pinNow || null,
    books: Array.isArray(books) && books.length
      ? books.filter((b) => b && Number.isFinite(b.odds))
      : (Number.isFinite(fair) ? [{ name: 'Pinnacle', odds: fair, sharp: true }] : []),
    wallets: wallets || [],
    mapWallets: Array.isArray(mapWallets) && mapWallets.length ? mapWallets : null,
    combinedWalletPnl: (wallets || []).reduce((acc, w) => acc + (w.pnl || 0), 0),
    gameTime: isLive ? 'LIVE' : (gameTimeLabel || ''),
    isLive: !!isLive,
    updatedLabel: updatedLabel || null,
    // Real Pinnacle odds series for our side (null hides the charts).
    pinSeries: Array.isArray(pinSeries) && pinSeries.length >= 2 ? pinSeries : null,
    commenceMs: Number.isFinite(commenceMs) ? commenceMs : null,
    tierPerf: tierPerf || null,
  };
}
