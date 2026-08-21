/**
 * Adapters: production Sharp Flow data → PositionCards fixture shape.
 * Display-only. Never changes stake formulas or stamps.
 */
import { AGS_V12_STAKE_TIER_META } from '../../../lib/ags.js';
import { CLV_SKILL_MIN_N, EDGE_PRIOR_AG_WR, NET_CLV_PRIOR_AG } from '../../../lib/walletClvSkill.js';
import {
  matchSizeRatioBand,
  sportUsualBetFromProfile,
} from '../../../lib/sizeRatioBands.js';
import { passesSizeSkillLiveGate } from '../../../lib/sizeSkillRescue.js';
import { sharpMarketAgreementFromPinnGame, buildLockedMarketSignals } from '../../../lib/marketAgreement.js';
import {
  sportTrustBookPreferB,
  pickSensationalTrust,
} from '../../../lib/walletSportBook.js';
import {
  lastBoardMain,
  pickMainSpreadFromBoard,
  pickMainTotalFromBoard,
} from '../../../lib/pinnacleMain.js';
import {
  americanFromPolyPrice,
  resolveInstrument,
  ticketAmerican,
} from '../../../lib/ticketInstrument.js';
import {
  impliedFromAmerican as ip,
  noVigFairAmerican,
  fairProbFromNoVig,
  evPctVsFairProb,
} from '../../../lib/oddsEv.js';

export { americanFromPolyPrice };
export { noVigFairAmerican, fairProbFromNoVig, evPctVsFairProb };

/** Same floor as EDGE (scripts/syncPickStateAuthoritative WINNER_ALIGN_MIN_N). */
export const FEATURED_WR_MIN_N = 8;
export { EDGE_PRIOR_AG_WR, NET_CLV_PRIOR_AG, CLV_SKILL_MIN_N };

/**
 * Sport WR for display / skill eligibility (mirrors EDGE input).
 * From 2026-08-13 staking uses 70% Source B positions + 30% Source A picks
 * when both clear n≥8; this helper returns the same blend (no date arg → blend).
 */
export function featuredWrFromProfile(profile, sport, { blend = true } = {}) {
  const rec = profile?.bySport?.[sport];
  if (!rec) return null;
  const nA = Number(rec.picks?.n) || 0;
  const a = nA >= FEATURED_WR_MIN_N && Number.isFinite(Number(rec.picks?.wr))
    ? Number(rec.picks.wr) : null;
  const nB = Number(rec.positions?.n) || 0;
  const b = nB >= FEATURED_WR_MIN_N && Number.isFinite(Number(rec.positions?.wr))
    ? Number(rec.positions.wr) : null;
  if (!blend) return a;
  if (a != null && b != null) return 0.7 * b + 0.3 * a;
  if (b != null) return b;
  return a;
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
 * Chart ELITE quadrant floors — must match LockedClarityExpanded WalletMap
 * crosshairs (beat-close % × lifetime ROI). Geography only — not the
 * "best sharp" map labels (CONFIRMED beat-close quartile).
 */
export const ELITE_ZONE_CLV = 55;
export const ELITE_ZONE_ROI = 0;

/** Min graded CLV sample for best-sharp rank (same floor as featured WR). */
export const TOP_Q_CLV_MIN_N = FEATURED_WR_MIN_N;

/** ROI axis for the skill map (prefer unit ROI, fall back to $ ROI). */
export function walletRoiForPlot(w) {
  if (Number.isFinite(w?.roi)) return w.roi;
  if (Number.isFinite(w?.dollarRoi)) return w.dollarRoi;
  return null;
}

/** True when a wallet sits in the map ELITE zone (complete CLV + ROI only). */
export function isEliteZoneWallet(w) {
  const clv = Number(w?.priorClvPct);
  const roi = walletRoiForPlot(w);
  return Number.isFinite(clv) && Number.isFinite(roi)
    && clv > ELITE_ZONE_CLV && roi > ELITE_ZONE_ROI;
}

/**
 * Beat-close % cutoff for top quartile among CONFIRMED wallets (n≥8).
 * Higher pctPos = better. Returns null when the pool is too thin.
 */
export function computeConfirmedBeatCloseQ1(walletProfiles) {
  if (!walletProfiles || typeof walletProfiles.entries !== 'function') return null;
  const pcts = [];
  for (const [, profile] of walletProfiles.entries()) {
    const bySport = profile?.bySport;
    if (!bySport || typeof bySport !== 'object') continue;
    const confirmed = Object.values(bySport).some(
      (s) => String(s?.whitelistTier || '').toUpperCase() === 'CONFIRMED',
    );
    if (!confirmed) continue;
    const n = Number(profile?.clvSkill?.n) || 0;
    const pct = Number(profile?.clvSkill?.pctPos);
    if (n < TOP_Q_CLV_MIN_N || !Number.isFinite(pct)) continue;
    pcts.push(pct);
  }
  if (pcts.length < 4) return null;
  pcts.sort((a, b) => a - b);
  const i = Math.ceil(0.75 * (pcts.length - 1));
  return +pcts[i].toFixed(1);
}

/** CONFIRMED + enough CLV sample + beat-close at/above confirmed Q1 cut. */
export function isTopQWallet(w, q1Thr) {
  if (!Number.isFinite(q1Thr)) return false;
  if (String(w?.whitelist || '').toUpperCase() !== 'CONFIRMED') return false;
  const n = Number(w?.clvN) || 0;
  const pct = Number(w?.priorClvPct);
  return n >= TOP_Q_CLV_MIN_N && Number.isFinite(pct) && pct >= q1Thr;
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

/** Last-word nick — fine until White Sox vs Red Sox both become "Sox". */
const shortTeamLast = (name) => {
  if (!name) return '—';
  const parts = String(name).trim().split(/\s+/);
  return parts[parts.length - 1] || name;
};

/** Last two words — "Red Sox" / "White Sox" when nicknames collide. */
const shortTeamTwo = (name) => {
  if (!name) return '—';
  const parts = String(name).trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[parts.length - 2]} ${parts[parts.length - 1]}`;
  return parts[0] || name;
};

/**
 * Display nick for a team. When `other` shares the same last word (CWS/BOS
 * both "Sox"), use two-word form so labels and side inference don't collide.
 */
const shortTeam = (name, other = null) => {
  if (!name) return '—';
  const last = shortTeamLast(name);
  if (other && shortTeamLast(other) === last) return shortTeamTwo(name);
  return last;
};

/** Resolve ML/spread side. Prefer stamped sideKey — never infer via "Sox"=="Sox". */
function resolvePickSide(pick, {
  isTotal = false,
  isSpread = false,
  awayShort = null,
  homeShort = null,
  teamShort = null,
} = {}) {
  const stamped = pick?.side || pick?.pickSide || null;
  if (stamped === 'away' || stamped === 'home' || stamped === 'draw'
      || stamped === 'over' || stamped === 'under') {
    return stamped;
  }
  const teamRaw = (pick?.team || '').trim();
  if (isTotal) {
    return teamRaw.toLowerCase().startsWith('under') ? 'under' : 'over';
  }
  if (/^draw$/i.test(teamRaw)) return 'draw';
  // Matchup-aware shorts already disambiguate Sox/Sox. Fall back carefully:
  // if nicknames still collide, prefer home only when team equals home full name.
  if (teamShort && awayShort && teamShort === awayShort && teamShort === homeShort) {
    const t = teamRaw.toLowerCase();
    if (t && t === String(pick?.away || '').trim().toLowerCase()) return 'away';
    if (t && t === String(pick?.home || '').trim().toLowerCase()) return 'home';
  }
  if (teamShort && awayShort && teamShort === awayShort) return 'away';
  return 'home';
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
export function enrichWallets(rawWallets, sport, getWalletProfile, isSportWinner, getRecordForDisplay, opts = {}) {
  if (!Array.isArray(rawWallets)) return [];
  const q1Thr = Number.isFinite(opts.confirmedClvQ1) ? opts.confirmedClvQ1 : null;
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

      // Sport-local usual for SHADOW floor + Size vs usual (matches cron gate).
      // Fallback: stamped avgSportBet / sizeSignal median when sport history thin.
      const feedAvg = Number.isFinite(w.avgSportBet) && w.avgSportBet > 0 ? w.avgSportBet : null;
      const medianBet = profile?.sizeSignal?.medianInvested;
      const sportUsualRaw = sportUsualBetFromProfile(profile, sport);
      const usualBet = (Number.isFinite(sportUsualRaw) && sportUsualRaw > 0)
        ? sportUsualRaw
        : (feedAvg || (Number.isFinite(medianBet) && medianBet > 0 ? medianBet : null));
      const sizeRatio = (usualBet != null && (w.invested || 0) > 0)
        ? +(w.invested / usualBet).toFixed(2)
        : (Number.isFinite(w.sizeRatio) ? w.sizeRatio : null);
      const displaySizeRatio = sizeRatio;
      const avgSportBet = usualBet != null ? Math.round(usualBet) : null;
      // WR at this size-vs-usual band — same ratio as the meter / SHADOW floor.
      const sizeBand = matchSizeRatioBand(sizeRatio, profile?.sizeRatioBands);
      // Causal %+CLV ("beats the close"): profile.clvSkill from exportWalletProfiles
      // (same definition as the tape/netCLV cron). Never invent a default %.
      const profileClv = profile?.clvSkill?.pctPos;
      const clvN = Number(profile?.clvSkill?.n) || 0;
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
      // Size-skill CONFIRMED: Proven only at sizeRatio ≥ 1.0 (full/press).
      const sizeSkillOk = passesSizeSkillLiveGate(sportRec, sizeRatio);
      const proven = whitelisted && counted && sizeSkillOk;
      const featuredWr = featuredWrFromProfile(profile, sport);
      const netClvPct = netClvPctFromProfile(profile);
      const edgeEligible = featuredWr != null;
      const netEligible = netClvPct != null;
      const skillEligible = edgeEligible || netEligible;
      const whitelist = sportRec?.whitelistTier || (whitelisted ? 'CONFIRMED' : null);
      const topQ = isTopQWallet({ whitelist, clvN, priorClvPct }, q1Thr);
      const badges = proven
        ? ['SHARP', `${sport} WINNER`]
        : whitelisted
          ? ['SHARP', 'LIGHT']
          : skillEligible
            ? ['SHARP', 'SECONDARY']
            : ['SHARP', 'TRACKING'];
      // Collapsed Zone A — sport-specific Source B–preferred trust + sensational banger.
      const trustBook = sportTrustBookPreferB(sportRec);
      const trust = trustBook ? pickSensationalTrust(trustBook) : null;
      const trustScore = (() => {
        if (!trust?.banger) return (Number.isFinite(roi) ? roi : 0) + (proven ? 50 : 0);
        return (trust.banger.score || 0) + (proven ? 500 : 0) + Math.min((w.invested || 0) / 1000, 40);
      })();
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
        whitelist,
        qualify: sizeRatio >= 0.75 ? 'VAULT' : 'SHADOW',
        sizeRatio,
        displaySizeRatio: Number.isFinite(displaySizeRatio) ? displaySizeRatio : null,
        record,
        wins: Number.isFinite(wins) ? wins : null,
        losses: Number.isFinite(losses) ? losses : null,
        decided,
        wr: Number.isFinite(wr) ? Math.round(wr) : null,
        roi,
        dollarRoi,
        invested: w.invested || 0,
        avgSportBet,
        sizeBand,
        sizeRatioBands: profile?.sizeRatioBands || null,
        cents: w.cents ?? null,
        pnl: w.pnl || 0,
        priorClvPct,
        clvN,
        topQ,
        trust,
        trustBook,
        trustScore,
        sport,
      };
    })
    .sort((a, b) =>
      (Number(!!b.proven) - Number(!!a.proven))
      || (Number(!!b.skillEligible) - Number(!!a.skillEligible))
      || (Number(!!b.whitelisted) - Number(!!a.whitelisted))
      || ((b.sizeRatio || 0) - (a.sizeRatio || 0))
    );
}

/** Lines match within a half-point tick (totals/spreads). */
function linesClose(a, b, eps = 0.051) {
  return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= eps;
}

/** Commence / freeze timestamps from Firestore, ISO, or epoch ms. */
export function parseCommenceMs(raw) {
  if (raw == null) return null;
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw?.toMillis === 'function') return raw.toMillis();
  if (typeof raw?._seconds === 'number') return raw._seconds * 1000;
  if (raw instanceof Date) {
    const t = raw.getTime();
    return Number.isFinite(t) ? t : null;
  }
  const t = new Date(raw).getTime();
  return Number.isFinite(t) ? t : null;
}

/** Keep history points at/before freeze; points without t stay (legacy). */
function histUpTo(hist, freezeAtMs) {
  if (!Array.isArray(hist)) return [];
  if (!Number.isFinite(freezeAtMs)) return hist;
  const freezeSec = freezeAtMs > 1e12 ? freezeAtMs / 1000 : freezeAtMs;
  return hist.filter((h) => {
    if (!Number.isFinite(h?.t)) return true;
    const sec = h.t > 1e12 ? h.t / 1000 : h.t;
    return sec <= freezeSec;
  });
}

/**
 * Snapshot used to write main first, then alts — last row is the highest alt.
 * Prefer isMain / pick'em on the last cycle's board. First-of-t is last resort.
 */
function lastMainSnap(hist) {
  return lastBoardMain(hist, pickMainTotalFromBoard);
}

function lastMainSpreadSnap(hist) {
  return lastBoardMain(hist, pickMainSpreadFromBoard);
}

/** Live MAIN from the current board (pick'em). Frozen = last board at T-15. */
function resolveMainTotal(pinnGame, { frozen = false, freezeAtMs = null } = {}) {
  const hist = histUpTo(
    Array.isArray(pinnGame?.totalHistory) ? pinnGame.totalHistory : [],
    frozen ? freezeAtMs : null,
  );
  if (!frozen) {
    const fromLines = pickMainTotalFromBoard(pinnGame?.totalLines);
    if (fromLines && Number.isFinite(fromLines.line) && fromLines.line >= 1.5) return fromLines;
    const fromHist = lastMainSnap(hist);
    if (fromHist && Number.isFinite(fromHist.line) && fromHist.line >= 1.5) return fromHist;
  } else {
    const fromHist = lastMainSnap(hist);
    if (fromHist && Number.isFinite(fromHist.line) && fromHist.line >= 1.5) return fromHist;
  }
  const cur = pinnGame?.totalCurrent;
  if (!frozen && Number.isFinite(cur?.line) && cur.line >= 1.5) return cur;
  return null;
}

function resolveMainSpread(pinnGame, { frozen = false, freezeAtMs = null } = {}) {
  const lineOk = (s) => s && (Number.isFinite(s.homeLine) || Number.isFinite(s.awayLine));
  const hist = histUpTo(
    Array.isArray(pinnGame?.spreadHistory) ? pinnGame.spreadHistory : [],
    frozen ? freezeAtMs : null,
  );
  if (!frozen) {
    const fromLines = pickMainSpreadFromBoard(pinnGame?.spreadLines);
    if (lineOk(fromLines)) return fromLines;
    const fromHist = lastMainSpreadSnap(hist);
    if (lineOk(fromHist)) return fromHist;
  } else {
    const fromHist = lastMainSpreadSnap(hist);
    if (lineOk(fromHist)) return fromHist;
  }
  const cur = pinnGame?.spreadCurrent;
  if (!frozen && lineOk(cur)) return cur;
  return null;
}

/**
 * Paint max onto every path point so OddsLimitSpark can draw the dual-axis
 * story. Forward-fill stamped maxes, then fall back to ticketMax (same-line
 * live or book-level liquidity) when the alt feed omitted max.
 */
function backfillPathMax(path, ticketMax) {
  if (!Array.isArray(path) || !path.length) return path;
  let last = null;
  const fwd = path.map((p) => {
    const m = Number.isFinite(p.max) ? p.max : last;
    if (Number.isFinite(m)) last = m;
    return { ...p, max: Number.isFinite(m) ? m : null };
  });
  if (!Number.isFinite(ticketMax)) return fwd;
  return fwd.map((p) => ({
    ...p,
    max: Number.isFinite(p.max) ? p.max : ticketMax,
  }));
}

function resolveTicketMax(candidates) {
  for (const m of candidates) {
    if (Number.isFinite(m) && m > 0) return m;
  }
  return null;
}

/**
 * Ticket juice is vault Poly whenever we have it. Stamped lock.odds is
 * fallback only (sealed / no live positions).
 */
export function preferVaultPolyTicketOdds(stamped, poly) {
  if (Number.isFinite(poly) && poly !== 0) return poly;
  if (Number.isFinite(stamped) && stamped !== 0) return stamped;
  return null;
}

/**
 * Sharp entry ladder — same side, possibly different lines.
 * Product: receipts of where sharps got on; not the playable recommendation.
 */
function buildEntryLadder(positions, playSide, { isTotal = false } = {}) {
  const byLine = new Map();
  for (const p of positions || []) {
    if (String(p.side || '').toLowerCase() !== String(playSide).toLowerCase()) continue;
    const ln = Number(p.entryLine ?? (isTotal ? p.totalLine : p.spreadLine));
    if (!Number.isFinite(ln)) continue;
    if (isTotal && ln < 1.5) continue;
    const inv = Number(p.invested) || 0;
    const px = Number(p.avgPrice);
    const cur = byLine.get(ln) || {
      line: ln, invested: 0, wallets: 0, sumPxInv: 0, sumInvForPx: 0,
    };
    cur.invested += inv;
    cur.wallets += 1;
    if (inv > 0 && px > 0 && px < 1) {
      cur.sumPxInv += px * inv;
      cur.sumInvForPx += inv;
    }
    byLine.set(ln, cur);
  }
  return [...byLine.values()]
    .map((r) => ({
      line: r.line,
      invested: +r.invested.toFixed(2),
      wallets: r.wallets,
      odds: r.sumInvForPx > 0
        ? americanFromPolyPrice(r.sumPxInv / r.sumInvForPx)
        : null,
    }))
    .sort((a, b) => b.invested - a.invested);
}

function formatEntryLadderLabel(ladder, { isTotal, isSpread, teamShort }) {
  if (!Array.isArray(ladder) || !ladder.length) return null;
  const bits = ladder.slice(0, 4).map((r) => {
    if (isTotal) return String(r.line);
    if (isSpread) {
      const n = Number(r.line);
      return `${n > 0 ? '+' : ''}${n}`;
    }
    return String(r.line);
  });
  if (isTotal) return `entered ${teamShort} ${bits.join(' · ')}`;
  if (isSpread) return `entered ${teamShort} ${bits.join(' · ')}`;
  return `entered ${bits.join(' · ')}`;
}

/**
 * Live market board for a locked pick from pinnacle_history.json.
 * Returns pinSeries (fair-book overtime), books[], bestOdds/bestBook, dual-side
 * labels for totals/ML. Fail-soft → empty board when history missing.
 *
 * Rule: ticket line and companion odds are one instrument. Never overwrite
 * the staked total/spread with a live consensus line, and never pair
 * flagged ticket odds with fair/best from a different line.
 *
 * @param {object} [opts]
 * @param {number|null} [opts.freezeAtMs] — when set (T-15), truncate history and
 *   ignore live totalCurrent/best so the board cannot keep moving past freeze.
 */
export function buildLockedMarketOdds(pick, pinnacleHistory, opts = {}) {
  const freezeAtMs = Number.isFinite(opts?.freezeAtMs) ? opts.freezeAtMs : null;
  const sealed = Number.isFinite(freezeAtMs);
  const empty = {
    pinSeries: null,
    pinPath: null,
    books: [],
    bestOdds: null,
    bestBook: null,
    fairNow: null,
    fairNoVig: null,
    fairProb: null,
    fairIsNoVig: false,
    marketLine: null,
    liveMarketLine: null,
    lineMoved: false,
    ourLabel: null,
    liveLabel: null,
    oppLabel: null,
    oppBestOdds: null,
    oppBestBook: null,
    liveBestOdds: null,
    liveBestBook: null,
    liveFair: null,
    liveFairIsNoVig: false,
    updatedAgoSec: null,
  };
  if (!pick || !pinnacleHistory) return empty;
  const sport = pick.sport;
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
  const sideKey = resolvePickSide(pick, {
    isTotal,
    isSpread,
    awayShort: shortTeam(pick.away, pick.home),
    homeShort: shortTeam(pick.home, pick.away),
    teamShort: shortTeam(pick.team, pick.away === pick.team ? pick.home : pick.away),
  });

  const books = [];
  let pinSeries = null;
  let pinPath = null;
  let bestOdds = null;
  let bestBook = null;
  let fairNow = null;
  /** Both-side sharp prices for no-vig (our side first for sideIdx=0). */
  let fairPair = null; // number[]
  const stakedLine = Number.isFinite(pick.line) ? pick.line : null;
  let marketLine = stakedLine;
  let liveMarketLine = null;
  let lineMoved = false;
  let ourLabel = null;
  let liveLabel = null;
  let oppLabel = null;
  let oppBestOdds = null;
  let oppBestBook = null;
  let liveBestOdds = null;
  let liveBestBook = null;
  let liveFairPair = null;
  let latestT = null;

  if (isTotal) {
    const hist = histUpTo(
      Array.isArray(pinnGame.totalHistory) ? pinnGame.totalHistory : [],
      freezeAtMs,
    );
    const last = hist[hist.length - 1] || null;
    // Journey / fair for the TICKET line only — never mix 8.5 odds with 7.5.
    const stakeHist = stakedLine != null
      ? hist.filter((h) => linesClose(h.line, stakedLine))
      : hist;
    pinPath = stakeHist
      .map((h) => {
        const odds = sideKey === 'under' ? h.underOdds : h.overOdds;
        if (!Number.isFinite(odds)) return null;
        const max = Number.isFinite(h.max) ? h.max
          : (Number.isFinite(h.maxTotal) ? h.maxTotal : null);
        return {
          t: Number.isFinite(h.t) ? h.t : null,
          odds,
          max,
        };
      })
      .filter(Boolean);

    const matchHist = stakedLine != null
      ? [...hist].reverse().find((h) => linesClose(h.line, stakedLine))
      : last;
    const liveAlt = (!sealed && stakedLine != null && Array.isArray(pinnGame.totalLines))
      ? pinnGame.totalLines.find((r) => linesClose(r.line, stakedLine))
      : null;
    if (matchHist) {
      fairNow = sideKey === 'under' ? matchHist.underOdds : matchHist.overOdds;
      const over = matchHist.overOdds;
      const under = matchHist.underOdds;
      if (Number.isFinite(over) && Number.isFinite(under)) {
        fairPair = sideKey === 'under' ? [under, over] : [over, under];
      }
      if (Number.isFinite(matchHist.t)) latestT = matchHist.t;
    } else if (liveAlt) {
      // Live alt board (same cycle) when history hasn't caught the ticket line yet.
      fairNow = sideKey === 'under' ? liveAlt.underOdds : liveAlt.overOdds;
      if (Number.isFinite(liveAlt.overOdds) && Number.isFinite(liveAlt.underOdds)) {
        fairPair = sideKey === 'under'
          ? [liveAlt.underOdds, liveAlt.overOdds]
          : [liveAlt.overOdds, liveAlt.underOdds];
      }
      if (Number.isFinite(liveAlt.t)) latestT = liveAlt.t;
    } else if (!sealed && stakedLine == null && pinnGame.totalCurrent) {
      fairNow = sideKey === 'under'
        ? pinnGame.totalCurrent.underOdds
        : pinnGame.totalCurrent.overOdds;
      const over = pinnGame.totalCurrent.overOdds;
      const under = pinnGame.totalCurrent.underOdds;
      if (Number.isFinite(over) && Number.isFinite(under)) {
        fairPair = sideKey === 'under' ? [under, over] : [over, under];
      }
    }

    // Same-line max for dual-axis spark; book-level only once ticket odds exist.
    const ticketMax = resolveTicketMax([
      matchHist?.max,
      liveAlt?.max,
      Number.isFinite(fairNow) ? pinnGame.maxTotal : null,
      Number.isFinite(fairNow) ? pinnGame.totalCurrent?.max : null,
    ]);
    pinPath = backfillPathMax(pinPath, ticketMax);
    // Single live print still deserves a 2-point tape (odds + max story).
    if (pinPath.length === 1 && Number.isFinite(fairNow)) {
      pinPath = [
        { ...pinPath[0], mark: 'open' },
        {
          t: pinPath[0].t,
          odds: fairNow,
          max: Number.isFinite(pinPath[0].max) ? pinPath[0].max : ticketMax,
          mark: 'now',
        },
      ];
    } else if (pinPath.length === 0 && Number.isFinite(fairNow)) {
      pinPath = [
        { t: latestT, odds: fairNow, max: ticketMax, mark: 'open' },
        { t: latestT, odds: fairNow, max: ticketMax, mark: 'now' },
      ];
    }
    const pts = pinPath.map((p) => p.odds);
    pinSeries = pts.length >= 2 ? pts : null;
    if (pinPath.length < 2) pinPath = null;

    const mainSnap = lastMainSnap(hist);
    const liveTotal = !sealed
      ? (pickMainTotalFromBoard(pinnGame.totalLines) || pinnGame.totalCurrent)
      : null;
    if (liveTotal && Number.isFinite(liveTotal.line)) {
      liveMarketLine = liveTotal.line;
    } else if (mainSnap && Number.isFinite(mainSnap.line)) {
      liveMarketLine = mainSnap.line;
    }
    if (Number.isFinite(mainSnap?.t) && latestT == null) latestT = mainSnap.t;

    const best = sealed ? null : (sideKey === 'under' ? pinnGame.bestUnder : pinnGame.bestOver);
    const opp = sealed ? null : (sideKey === 'under' ? pinnGame.bestOver : pinnGame.bestUnder);
    if (!sealed && Number.isFinite(best?.line) && liveMarketLine == null) liveMarketLine = best.line;

    lineMoved = !sealed
      && stakedLine != null && liveMarketLine != null && !linesClose(stakedLine, liveMarketLine);
    marketLine = stakedLine ?? liveMarketLine;

    // Best retail only when it is the same line as the ticket.
    if (best && Number.isFinite(best.odds)) {
      if (stakedLine == null || linesClose(best.line, stakedLine)) {
        bestOdds = best.odds;
        bestBook = best.book || null;
      } else {
        liveBestOdds = best.odds;
        liveBestBook = best.book || null;
      }
    }
    // Opp only on the same ticket line (never Under 7.5 next to Over 8).
    if (opp && Number.isFinite(opp.odds)
        && (stakedLine == null || linesClose(opp.line, stakedLine))) {
      oppBestOdds = opp.odds;
      oppBestBook = opp.book || null;
    }

    if (lineMoved) {
      const src = liveTotal || mainSnap;
      const over = src?.overOdds;
      const under = src?.underOdds;
      if (Number.isFinite(over) && Number.isFinite(under)) {
        liveFairPair = sideKey === 'under' ? [under, over] : [over, under];
      }
    }

    ourLabel = sideKey === 'under'
      ? `Under ${marketLine ?? ''}`.trim()
      : `Over ${marketLine ?? ''}`.trim();
    if (lineMoved && Number.isFinite(liveMarketLine)) {
      liveLabel = sideKey === 'under'
        ? `now Under ${liveMarketLine}`
        : `now Over ${liveMarketLine}`;
    }
    const oppLn = Number.isFinite(stakedLine) ? stakedLine
      : (Number.isFinite(opp?.line) ? opp.line : marketLine);
    oppLabel = sideKey === 'under'
      ? `Over ${oppLn ?? ''}`.trim()
      : `Under ${oppLn ?? ''}`.trim();

    if (Number.isFinite(fairNow)) {
      books.push({
        name: (pinnGame.fairTotalBook || 'pinnacle').replace(/^\w/, (c) => c.toUpperCase()),
        odds: fairNow,
        sharp: true,
      });
    }
    // Retail strip on the ticket line (allTotalBooks from snapshot; fallback best*).
    {
      const allT = pinnGame.allTotalBooks || {};
      const prefer = ['draftkings', 'fanduel', 'betmgm', 'caesars', 'fanatics', 'betonlineag', 'lowvig', 'bookmaker', 'circa'];
      const keys = [
        ...prefer.filter((k) => allT[k]),
        ...Object.keys(allT).filter((k) => !prefer.includes(k) && k !== 'pinnacle'),
      ];
      const seen = new Set(books.map((b) => String(b.name).toLowerCase()));
      for (const k of keys) {
        const b = allT[k];
        if (!b) continue;
        if (stakedLine != null && Number.isFinite(b.line) && !linesClose(b.line, stakedLine)) continue;
        const o = sideKey === 'under' ? b.under : b.over;
        if (!Number.isFinite(o)) continue;
        const name = b.name || k;
        if (seen.has(String(name).toLowerCase())) continue;
        seen.add(String(name).toLowerCase());
        const isBest = bestBook && String(name).toLowerCase() === String(bestBook).toLowerCase();
        books.push({ name, odds: o, best: !!isBest });
        if (books.length >= 8) break;
      }
      if (books.length < 2 && bestBook && Number.isFinite(bestOdds)
          && bestBook.toLowerCase() !== 'pinnacle'
          && !seen.has(bestBook.toLowerCase())) {
        books.push({ name: bestBook, odds: bestOdds, best: true });
      }
    }
  } else if (isSpread) {
    const hist = histUpTo(
      Array.isArray(pinnGame.spreadHistory) ? pinnGame.spreadHistory : [],
      freezeAtMs,
    );
    const last = hist[hist.length - 1] || null;
    const lineOf = (h) => (sideKey === 'away' ? h.awayLine : h.homeLine);
    const stakeHist = stakedLine != null
      ? hist.filter((h) => linesClose(lineOf(h), stakedLine))
      : hist;
    pinPath = stakeHist
      .map((h) => {
        const odds = sideKey === 'away' ? h.awayOdds : h.homeOdds;
        if (!Number.isFinite(odds)) return null;
        const max = Number.isFinite(h.max) ? h.max
          : (Number.isFinite(h.maxSpread) ? h.maxSpread : null);
        return {
          t: Number.isFinite(h.t) ? h.t : null,
          odds,
          max,
        };
      })
      .filter(Boolean);

    const matchHist = stakedLine != null
      ? [...hist].reverse().find((h) => linesClose(lineOf(h), stakedLine))
      : last;
    const liveAlt = (!sealed && stakedLine != null && Array.isArray(pinnGame.spreadLines))
      ? pinnGame.spreadLines.find((r) => linesClose(
        sideKey === 'away' ? Number(r.awayLine) : Number(r.homeLine),
        stakedLine,
      ))
      : null;
    if (matchHist) {
      fairNow = sideKey === 'away' ? matchHist.awayOdds : matchHist.homeOdds;
      const a = matchHist.awayOdds;
      const h = matchHist.homeOdds;
      if (Number.isFinite(a) && Number.isFinite(h)) {
        fairPair = sideKey === 'away' ? [a, h] : [h, a];
      }
      if (Number.isFinite(matchHist.t)) latestT = matchHist.t;
    } else if (liveAlt) {
      fairNow = sideKey === 'away' ? liveAlt.awayOdds : liveAlt.homeOdds;
      if (Number.isFinite(liveAlt.awayOdds) && Number.isFinite(liveAlt.homeOdds)) {
        fairPair = sideKey === 'away'
          ? [liveAlt.awayOdds, liveAlt.homeOdds]
          : [liveAlt.homeOdds, liveAlt.awayOdds];
      }
      if (Number.isFinite(liveAlt.t)) latestT = liveAlt.t;
    }

    const ticketMax = resolveTicketMax([
      matchHist?.max,
      liveAlt?.max,
      Number.isFinite(fairNow) ? pinnGame.maxSpread : null,
      Number.isFinite(fairNow) ? pinnGame.spreadCurrent?.max : null,
    ]);
    pinPath = backfillPathMax(pinPath, ticketMax);
    if (pinPath.length === 1 && Number.isFinite(fairNow)) {
      pinPath = [
        { ...pinPath[0], mark: 'open' },
        {
          t: pinPath[0].t,
          odds: fairNow,
          max: Number.isFinite(pinPath[0].max) ? pinPath[0].max : ticketMax,
          mark: 'now',
        },
      ];
    } else if (pinPath.length === 0 && Number.isFinite(fairNow)) {
      pinPath = [
        { t: latestT, odds: fairNow, max: ticketMax, mark: 'open' },
        { t: latestT, odds: fairNow, max: ticketMax, mark: 'now' },
      ];
    }
    const pts = pinPath.map((p) => p.odds);
    pinSeries = pts.length >= 2 ? pts : null;
    if (pinPath.length < 2) pinPath = null;

    const mainSnap = lastMainSpreadSnap(hist);
    const liveSpread = !sealed
      ? (pickMainSpreadFromBoard(pinnGame.spreadLines) || pinnGame.spreadCurrent)
      : null;
    if (liveSpread) {
      const curLn = sideKey === 'away' ? liveSpread.awayLine : liveSpread.homeLine;
      if (Number.isFinite(curLn)) liveMarketLine = curLn;
    } else if (mainSnap) {
      const ln = lineOf(mainSnap);
      if (Number.isFinite(ln)) liveMarketLine = ln;
    }
    if (Number.isFinite(mainSnap?.t) && latestT == null) latestT = mainSnap.t;

    const best = sealed ? null : (sideKey === 'away' ? pinnGame.bestAwaySpread : pinnGame.bestHomeSpread);
    const opp = sealed ? null : (sideKey === 'away' ? pinnGame.bestHomeSpread : pinnGame.bestAwaySpread);
    if (!sealed && Number.isFinite(best?.line) && liveMarketLine == null) liveMarketLine = best.line;

    lineMoved = !sealed
      && stakedLine != null && liveMarketLine != null && !linesClose(stakedLine, liveMarketLine);
    marketLine = stakedLine ?? liveMarketLine;

    if (best && Number.isFinite(best.odds)) {
      if (stakedLine == null || linesClose(best.line, stakedLine)) {
        bestOdds = best.odds;
        bestBook = best.book || null;
      } else {
        liveBestOdds = best.odds;
        liveBestBook = best.book || null;
      }
    }
    if (opp && Number.isFinite(opp.odds) && (!lineMoved || linesClose(opp.line, stakedLine))) {
      oppBestOdds = opp.odds;
      oppBestBook = opp.book || null;
    }
    if (lineMoved) {
      const src = liveSpread || mainSnap;
      const a = src?.awayOdds;
      const h = src?.homeOdds;
      if (Number.isFinite(a) && Number.isFinite(h)) {
        liveFairPair = sideKey === 'away' ? [a, h] : [h, a];
      }
    }

    const teamShort = sideKey === 'away' ? shortTeam(pick.away) : shortTeam(pick.home);
    const oppShort = sideKey === 'away' ? shortTeam(pick.home) : shortTeam(pick.away);
    const fmtLn = (ln) => (Number.isFinite(ln) ? `${ln > 0 ? '+' : ''}${ln}` : '');
    ourLabel = `${teamShort} ${fmtLn(marketLine)}`.trim();
    if (lineMoved && Number.isFinite(liveMarketLine)) {
      liveLabel = `now ${teamShort} ${fmtLn(liveMarketLine)}`.trim();
    }
    oppLabel = `${oppShort} ${fmtLn(opp?.line ?? (lineMoved ? liveMarketLine : marketLine))}`.trim();
    if (Number.isFinite(fairNow)) {
      books.push({ name: pinnGame.fairSpreadBook || 'Pinnacle', odds: fairNow, sharp: true });
    }
    if (bestBook && Number.isFinite(bestOdds)) {
      books.push({ name: bestBook, odds: bestOdds, best: true });
    }
  } else {
    // Moneyline
    const hist = histUpTo(
      Array.isArray(pinnGame.history) ? pinnGame.history : [],
      freezeAtMs,
    );
    pinPath = hist
      .map((h) => {
        const odds = sideKey === 'away' ? h.away : sideKey === 'draw' ? h.draw : h.home;
        if (!Number.isFinite(odds)) return null;
        const max = Number.isFinite(h.max) ? h.max
          : (Number.isFinite(h.maxMoneyLine) ? h.maxMoneyLine : null);
        return {
          t: Number.isFinite(h.t) ? h.t : null,
          odds,
          max,
        };
      })
      .filter(Boolean);
    const pts = pinPath.map((p) => p.odds);
    pinSeries = pts.length >= 2 ? pts : null;
    if (pinPath.length < 2) pinPath = null;
    const last = hist[hist.length - 1];
    const snap = last || (!sealed ? pinnGame.current : null) || null;
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
    if (!sealed) {
      bestOdds = sideKey === 'away' ? pinnGame.bestAway
        : sideKey === 'draw' ? pinnGame.bestDraw
        : pinnGame.bestHome;
      bestBook = sideKey === 'away' ? pinnGame.bestAwayBook
        : sideKey === 'draw' ? pinnGame.bestDrawBook
        : pinnGame.bestHomeBook;
      oppBestOdds = sideKey === 'away' ? pinnGame.bestHome : pinnGame.bestAway;
      oppBestBook = sideKey === 'away' ? pinnGame.bestHomeBook : pinnGame.bestAwayBook;
    }
    ourLabel = sideKey === 'draw' ? 'Draw'
      : (sideKey === 'away' ? shortTeam(pick.away) : shortTeam(pick.home));
    oppLabel = sideKey === 'draw' ? null
      : (sideKey === 'away' ? shortTeam(pick.home) : shortTeam(pick.away));

    if (Number.isFinite(fairNow)) {
      books.push({
        name: (pinnGame.fairBook || 'pinnacle').replace(/^\w/, (c) => c.toUpperCase()),
        odds: fairNow,
        sharp: true,
      });
    }
    // Past T-15: sharp fair from freeze snapshot only — no live retail strip.
    if (!sealed) {
      const allBooks = pinnGame.allBooks || {};
      const sideOdds = (b) => (sideKey === 'away' ? b?.away : sideKey === 'draw' ? b?.draw : b?.home);
      const seen = new Set(books.map((b) => b.name.toLowerCase()));
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
  }

  let updatedAgoSec = null;
  if (Number.isFinite(latestT)) {
    // history timestamps are unix seconds in this feed
    const ms = latestT > 1e12 ? latestT : latestT * 1000;
    updatedAgoSec = Math.max(0, Math.round((Date.now() - ms) / 1000));
  }

  // Multiplicative no-vig fair (standard). Fall back to vigged sharp price.
  // Only from the ticket-line pair — never from a moved consensus line.
  const fairProb = fairPair ? fairProbFromNoVig(fairPair, 0) : null;
  const fairNoVig = fairPair ? noVigFairAmerican(fairPair, 0) : null;
  const fairIsNoVig = Number.isFinite(fairNoVig);
  const fairDisplay = fairIsNoVig ? fairNoVig : (Number.isFinite(fairNow) ? fairNow : null);

  let liveFair = null;
  let liveFairIsNoVig = false;
  if (liveFairPair) {
    const ln = noVigFairAmerican(liveFairPair, 0);
    if (Number.isFinite(ln)) {
      liveFair = ln;
      liveFairIsNoVig = true;
    } else {
      liveFair = liveFairPair[0];
    }
  }

  return {
    pinSeries,
    pinPath: Array.isArray(pinPath) && pinPath.length >= 2 ? pinPath : null,
    books,
    bestOdds: Number.isFinite(bestOdds) ? bestOdds : null,
    bestBook: bestBook || null,
    fairNow: Number.isFinite(fairNow) ? fairNow : null,
    fairNoVig: Number.isFinite(fairNoVig) ? fairNoVig : null,
    fairProb: fairProb != null ? fairProb : null,
    fairIsNoVig,
    fairDisplay,
    marketLine: Number.isFinite(marketLine) ? marketLine : null,
    liveMarketLine: Number.isFinite(liveMarketLine) ? liveMarketLine : null,
    lineMoved: !!lineMoved,
    ourLabel,
    liveLabel,
    oppLabel,
    oppBestOdds: Number.isFinite(oppBestOdds) ? oppBestOdds : null,
    oppBestBook: oppBestBook || null,
    liveBestOdds: Number.isFinite(liveBestOdds) ? liveBestOdds : null,
    liveBestBook: liveBestBook || null,
    liveFair: Number.isFinite(liveFair) ? liveFair : null,
    liveFairIsNoVig,
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
  walletProfiles = null,
  totalPositions = null,
  spreadPositions = null,
  mlPositions = null,
} = {}) {
  const confirmedClvQ1 = computeConfirmedBeatCloseQ1(walletProfiles);
  const enrichOpts = { confirmedClvQ1 };
  const isTotal = pick.marketType === 'total' || pick.marketType === 'TOTAL';
  const isSpread = pick.marketType === 'spread' || pick.marketType === 'SPREAD';
  const alreadyGraded = pick.status === 'COMPLETED'
    && !!(pick.outcome || pick.result?.outcome);

  // Ticket stamps = sharp receipt instrument (vault / Poly). Playable reco =
  // live MAIN (or freeze-time MAIN). Never confuse the two.
  const T15_MS = 15 * 60 * 1000;
  const commenceMsForFreeze = parseCommenceMs(
    pick.commenceMs ?? pick.gameTime ?? pick.commenceTime ?? null,
  );
  const freezeAtMs = commenceMsForFreeze != null
    ? commenceMsForFreeze - T15_MS
    : null;
  const ticketFrozen = alreadyGraded
    || (freezeAtMs != null && Date.now() >= freezeAtMs);

  let ticketLine = Number.isFinite(pick.line) ? pick.line : null;
  let ticketOdds = Number.isFinite(pick.odds) && pick.odds !== 0 ? pick.odds : null;
  let polyEntryOdds = null;
  const vaultPositions = Array.isArray(pick.vaultPositions) && pick.vaultPositions.length
    ? pick.vaultPositions
    : (isTotal && totalPositions && pick.sport && pick.gameKey
      ? (totalPositions[pick.sport]?.[pick.gameKey]?.positions || null)
      : (isSpread && spreadPositions && pick.sport && pick.gameKey
        ? (spreadPositions[pick.sport]?.[pick.gameKey]?.positions || null)
        : (!isTotal && !isSpread && mlPositions && pick.sport && pick.gameKey
          ? (mlPositions[pick.sport]?.[pick.gameKey]?.positions || null)
          : null)));

  const sideIsUnderEarly = (() => {
    const t = String(pick.team || pick.side || pick.pickSide || '').toLowerCase();
    return t.startsWith('under') || t === 'under' || pick.side === 'under' || pick.pickSide === 'under';
  })();
  const playSideEarly = isTotal
    ? (sideIsUnderEarly ? 'under' : 'over')
    : null;

  // Entry ladder first — all sharp lines on this side.
  let entryLadder = (isTotal || isSpread) && Array.isArray(vaultPositions)
    ? buildEntryLadder(
      vaultPositions,
      isTotal
        ? playSideEarly
        : (String(pick.side || pick.pickSide || '').toLowerCase() === 'away' ? 'away' : 'home'),
      { isTotal },
    )
    : [];

  // Peek Pinnacle for PLAYABLE main line (recommendation instrument).
  // Use *Current (or last main print when frozen) — never the last alt dump.
  const pinnGamePeek = (pinnacleHistory && pick.sport && pick.gameKey)
    ? pinnacleHistory[pick.sport]?.[pick.gameKey]
    : null;
  const instSide = isTotal
    ? (sideIsUnderEarly ? 'under' : 'over')
    : (String(pick.side || pick.pickSide || '').toLowerCase() === 'away' ? 'away' : 'home');
  const inst = resolveInstrument({
    family: isTotal ? 'TOTAL' : isSpread ? 'SPREAD' : 'ML',
    side: instSide,
    positions: Array.isArray(vaultPositions) ? vaultPositions : [],
    pinnGame: pinnGamePeek,
    freezeAtMs: ticketFrozen ? freezeAtMs : null,
    stampedLine: Number.isFinite(ticketLine) ? ticketLine : null,
    sport: pick.sport || null,
  });
  if (Number.isFinite(inst.ticket.american)) {
    polyEntryOdds = inst.ticket.american;
    ticketOdds = ticketAmerican(inst, ticketOdds);
  }
  if (Number.isFinite(inst.line) && (isSpread || isTotal) && !ticketFrozen) {
    ticketLine = inst.line;
  }
  const awayPickEarly = String(pick.side || pick.pickSide || '').toLowerCase() === 'away'
    || String(pick.team || '').toLowerCase().includes(
      String(pick.away || '').split(' ').pop()?.toLowerCase() || '\0',
    );
  const mainTotal = isTotal && pinnGamePeek
    ? resolveMainTotal(pinnGamePeek, { frozen: ticketFrozen, freezeAtMs })
    : null;
  const mainSpread = isSpread && pinnGamePeek
    ? resolveMainSpread(pinnGamePeek, { frozen: ticketFrozen, freezeAtMs })
    : null;
  let playableLine = ticketLine;
  if (mainTotal && Number.isFinite(mainTotal.line) && mainTotal.line >= 1.5) {
    playableLine = mainTotal.line;
  } else if (mainSpread) {
    const ln = awayPickEarly ? mainSpread.awayLine : mainSpread.homeLine;
    if (Number.isFinite(ln)) playableLine = ln;
  }
  // Junk stamp repair for totals only when we still have no playable.
  if (isTotal && (!Number.isFinite(playableLine) || playableLine < 1.5)
      && Number.isFinite(pinnGamePeek?.totalCurrent?.line)
      && pinnGamePeek.totalCurrent.line >= 1.5) {
    playableLine = pinnGamePeek.totalCurrent.line;
  }
  if (!Number.isFinite(playableLine)) playableLine = ticketLine;

  if (isTotal && !ticketFrozen && pinnGamePeek) {
    const stampJunk = Number.isFinite(ticketLine) && ticketLine < 1.5;
    const stampMissing = !Number.isFinite(ticketLine) || stampJunk;
    const oddsMissing = !Number.isFinite(ticketOdds) || ticketOdds === 0;
    if (stampMissing && Number.isFinite(playableLine)) ticketLine = playableLine;
    if (oddsMissing && Number.isFinite(ticketLine)) {
      const sideIsUnder = sideIsUnderEarly;
      const hist = Array.isArray(pinnGamePeek.totalHistory) ? pinnGamePeek.totalHistory : [];
      const match = [...hist].reverse().find((h) => linesClose(h.line, ticketLine));
      if (match) {
        const o = sideIsUnder ? match.underOdds : match.overOdds;
        if (Number.isFinite(o) && o !== 0) ticketOdds = o;
      }
    }
  }

  const units = Number.isFinite(pick.units) ? pick.units : 0;
  // Odds 0 is a missing create stamp — treat as null so cards never show “ML 0”.
  const odds = Number.isFinite(ticketOdds) && ticketOdds !== 0 ? ticketOdds : null;
  const lockOdds = odds;
  const peakOdds = Number.isFinite(pick.lockPinnOdds) ? pick.lockPinnOdds
    : Number.isFinite(pick.pinnacleOdds) ? pick.pinnacleOdds : lockOdds;
  // Live CLV is computed later vs same-line tapeNow — not pick.closingOdds.
  // updateClosingOdds stamps MAIN juice; pairing that with an alt ticket
  // (Over 9.5 +127 vs Over 8.5 −117) fake-lights Beating Close.

  const teamRaw = (pick.team || '').trim();
  const isDraw = !isTotal && !isSpread && /^draw$/i.test(teamRaw);
  // Matchup-aware shorts — White Sox @ Red Sox must not both collapse to "Sox"
  // (that flipped home locks to away and painted our wallets as Against).
  const awayShort = isTotal ? 'Under' : shortTeam(pick.away, pick.home);
  const homeShort = isTotal ? 'Over' : shortTeam(pick.home, pick.away);
  const side = resolvePickSide(pick, {
    isTotal,
    isSpread,
    awayShort,
    homeShort,
    teamShort: isTotal
      ? (teamRaw.toLowerCase().startsWith('under') ? 'Under' : 'Over')
      : isDraw ? 'Draw'
        : shortTeam(pick.team, pick.away === pick.team ? pick.home : pick.away),
  });
  // Normalize totals over/under → home/away for board math below.
  const sideNorm = side === 'over' ? 'home' : side === 'under' ? 'away' : side;
  const teamShort = isTotal
    ? (side === 'under' || sideNorm === 'away' ? 'Under' : 'Over')
    : isDraw ? 'Draw'
      : (sideNorm === 'away' ? awayShort : homeShort);

  // T-15 locks MAIN. Hero = playable main; flagged vault ticket is the subtitle.
  // Never pair ticket juice with a different handicap.
  const fmtSpreadLn = (ln) => (Number.isFinite(ln) ? `${ln > 0 ? '+' : ''}${ln}` : '');
  const fmtAm = (o) => {
    if (!Number.isFinite(o) || o === 0) return null;
    return o > 0 ? `+${Math.round(o)}` : `${Math.round(o)}`;
  };
  const fmtLineLabel = (ln) => {
    if (isSpread && Number.isFinite(ln)) return `${teamShort} ${fmtSpreadLn(ln)}`;
    if (isTotal && Number.isFinite(ln) && ln >= 1.5) return `${teamShort} ${ln}`;
    return null;
  };
  const ticketHeroLine = Number.isFinite(ticketLine) ? ticketLine : null;
  const entryLadderLabel = (isTotal || isSpread)
    ? formatEntryLadderLabel(entryLadder, { isTotal, isSpread, teamShort })
    : null;
  const entriesOffPlayable = (isTotal || isSpread)
    && Number.isFinite(playableLine)
    && (
      (Number.isFinite(ticketHeroLine) && !linesClose(ticketHeroLine, playableLine))
      || entryLadder.some((r) => !linesClose(r.line, playableLine))
    );
  const mlNowOdds = (!isTotal && !isSpread && Number.isFinite(inst.tape?.now))
    ? inst.tape.now
    : null;
  const ticketOffLine = (isTotal || isSpread)
    && Number.isFinite(playableLine)
    && Number.isFinite(ticketHeroLine)
    && !linesClose(ticketHeroLine, playableLine);
  const ticketOffMl = !isTotal && !isSpread
    && Number.isFinite(lockOdds)
    && Number.isFinite(mlNowOdds)
    && Math.round(lockOdds) !== Math.round(mlNowOdds);
  const ticketOffMain = ticketOffLine || ticketOffMl;
  const playableNowOdds = (() => {
    if (!ticketOffMain) return null;
    if (ticketOffMl && Number.isFinite(mlNowOdds)) return mlNowOdds;
    if (!pinnGamePeek) return null;
    if (isSpread && mainSpread) {
      const o = sideNorm === 'away' ? mainSpread.awayOdds : mainSpread.homeOdds;
      if (Number.isFinite(o)) return o;
    }
    if (isTotal && mainTotal) {
      const o = sideNorm === 'away' ? mainTotal.underOdds : mainTotal.overOdds;
      if (Number.isFinite(o)) return o;
    }
    return null;
  })();
  const heroLine = ticketOffLine && Number.isFinite(playableLine)
    ? playableLine
    : (Number.isFinite(ticketHeroLine) ? ticketHeroLine : playableLine);
  const pickLabel = fmtLineLabel(heroLine)
    || (isTotal ? (pick.team || 'Total')
      : isDraw ? 'Draw ML'
        : `${teamShort} ML`);
  // ML hero is always book NOW when we have tape — same pattern as
  // totals/spreads (main line + now juice, flagged ticket underneath).
  const heroOdds = (!isTotal && !isSpread && Number.isFinite(mlNowOdds))
    ? mlNowOdds
    : (ticketOffMain
      ? (Number.isFinite(playableNowOdds) ? playableNowOdds : null)
      : lockOdds);
  const flaggedAtLabel = ticketOffLine
    ? `flagged at ${fmtLineLabel(ticketHeroLine) || `${teamShort} ${ticketHeroLine}`}${
      fmtAm(lockOdds) ? ` · ${fmtAm(lockOdds)}` : ''
    }`
    : (ticketOffMl && fmtAm(lockOdds) ? `flagged at ${fmtAm(lockOdds)}` : null);
  // Secondary under hero — flagged ticket when MAIN is the lock.
  const mainNowLabel = flaggedAtLabel;

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
    enrichOpts,
  );

  // Normalize totals over/under → home/away so board sides match `sideNorm`.
  const normSide = (s) => {
    if (s === 'over') return 'home';
    if (s === 'under') return 'away';
    return s || null;
  };

  // Both-side board for the clarity map. Prefer stamped boardWallets; fall
  // back to play-side receipts so the expanded card still has something.
  const boardRaw = (Array.isArray(pick.boardWallets) && pick.boardWallets.length
    ? pick.boardWallets
    : (pick.backingWallets || []).map((w) => ({ ...w, side: w.side || sideNorm }))
  ).map((w) => ({ ...w, side: normSide(w.side) || sideNorm }));

  const mapWallets = enrichWallets(
    boardRaw,
    pick.sport,
    getWalletProfile,
    isSportWinner,
    getRecordForDisplay,
    enrichOpts,
  ).map((w) => {
    const marketSide = normSide(w.side) || sideNorm;
    const sideTag = marketSide === sideNorm ? 'ours' : 'against';
    return {
      ...w,
      marketSide,
      side: sideTag,
      eliteZone: isEliteZoneWallet(w),
    };
  });
  // Glance: any FOR-side CONFIRMED wallet in top-quartile beat-close.
  const topQOnSide = mapWallets.filter((w) => w.side === 'ours' && w.topQ).length;
  const hasTopQ = topQOnSide > 0;

  const againstRows = mapWallets.filter((w) => w.side === 'against');
  const meanFinite = (arr) => {
    const xs = arr.filter(Number.isFinite);
    if (!xs.length) return null;
    return +(xs.reduce((s, v) => s + v, 0) / xs.length).toFixed(1);
  };
  const againstInvested = againstRows.reduce((s, w) => s + (w.invested || 0), 0);
  const againstAbbr = sideNorm === 'draw'
    ? `${awayShort}/${homeShort}`
    : sideNorm === 'home' ? awayShort : homeShort;
  const againstLabel = sideNorm === 'draw'
    ? `${pick.away || awayShort} / ${pick.home || homeShort}`
    : sideNorm === 'home' ? (pick.away || awayShort) : (pick.home || homeShort);
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
  // C margin = CONFIRMED-tier winners FOR−AG (token floor + size-skill ≥1.0).
  // Distinct from HC (= CONFIRMED ∧ size ≥ 1.5×). Uses `proven` so size-skill
  // light tickets never inflate C margin.
  const confCounted = (w) => w && w.whitelist === 'CONFIRMED' && w.proven;
  const confForN = mapWallets.filter((w) => w.side === 'ours' && confCounted(w)).length;
  const confAgN = mapWallets.filter((w) => w.side === 'against' && confCounted(w)).length;
  const confMargin = mapWallets.length > 0 ? (confForN - confAgN) : null;
  // Proven margin (CONFIRMED+FLAT) — same board census as "N proven" above.
  const provenForN = mapWallets.filter((w) => w.side === 'ours' && w.proven && isCounted(w)).length;
  const provenAgN = mapWallets.filter((w) => w.side === 'against' && w.proven && isCounted(w)).length;
  const provenMargin = mapWallets.length > 0 ? (provenForN - provenAgN) : null;
  const base = pathBaseUnits(stakePath);

  const toWin = (() => {
    if (!Number.isFinite(odds) || units <= 0) return 0;
    if (odds < 0) return units * (100 / Math.abs(odds));
    return units * (odds / 100);
  })();

  const gameTime = fmtEt(pick.gameTime) || 'TBD';
  const lockedAt = fmtEt(pick.lockedAt) || '—';
  const peakAt = fmtEt(pick.peakAt) || lockedAt;
  const commenceMs = commenceMsForFreeze
    ?? parseCommenceMs(pick.gameTime ?? pick.commenceTime ?? null);
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

  // Market board + spark on the TICKET line so movement matches FLAGGED.
  // MAIN vs ALT is labeled on the instrument; never chart MAIN juice on an alt.
  const market = buildLockedMarketOdds(
    {
      ...pick,
      line: Number.isFinite(ticketLine) ? ticketLine : playableLine,
      odds: ticketOdds,
      team: isTotal && Number.isFinite(ticketLine)
        ? `${teamShort} ${ticketLine}`
        : pick.team,
      side: pick.side || pick.pickSide || sideNorm,
    },
    pinnacleHistory,
    { freezeAtMs: ticketFrozen ? freezeAtMs : null },
  );
  const recoOdds = Number.isFinite(market.bestOdds) ? market.bestOdds
    : (Number.isFinite(market.fairDisplay) ? market.fairDisplay : null);
  // Dense fair-book overtime on the playable line.
  const pinSeries = market.pinSeries;
  const sparseJourney = ticketFrozen
    ? [recoOdds, market.fairDisplay].filter(Number.isFinite)
    : [market.fairDisplay, recoOdds].filter(Number.isFinite);
  const journey = (pinSeries && pinSeries.length >= 2) ? pinSeries : sparseJourney;
  // FAIR/NOW = same-line tape as the ticket.
  const fairLine = Number.isFinite(market.fairDisplay) ? market.fairDisplay
    : (Number.isFinite(inst.tape?.fair) ? inst.tape.fair
      : (Number.isFinite(pick.pinnacleOdds) && inst.variant !== 'ALT' ? pick.pinnacleOdds : null));
  const fairProb = market.fairProb != null
    ? market.fairProb
    : ip(fairLine);
  // EV of the ticket vs same-line fair (not MAIN reco vs a different handicap).
  const evFlagged = (fairProb != null && Number.isFinite(lockOdds) && inst.variant !== 'ALT')
    ? evPctVsFairProb(lockOdds, fairProb)
    : (fairProb != null && Number.isFinite(lockOdds) && Number.isFinite(fairLine)
      ? evPctVsFairProb(lockOdds, fairProb)
      : null);
  const evBest = (fairProb != null && Number.isFinite(market.bestOdds))
    ? evPctVsFairProb(market.bestOdds, fairProb)
    : null;

  // Sharp–Market Agreement on the PLAYABLE line (odds + max story).
  let pinnGameForSma = null;
  if (pinnacleHistory && pick.sport) {
    let gk = pick.gameKey;
    if (!gk && typeof pick.key === 'string') {
      const docPart = pick.key.split(':')[0] || '';
      const parts = docPart.split('_');
      if (parts.length >= 3) {
        gk = parts.slice(2).join('_').replace(/_(spread|total)$/i, '') || null;
      }
    }
    pinnGameForSma = gk ? pinnacleHistory[pick.sport]?.[gk] : null;
  }
  const sma = sharpMarketAgreementFromPinnGame(pinnGameForSma, {
    marketType: isSpread ? 'spread' : isTotal ? 'total' : 'ml',
    sideNorm,
    line: Number.isFinite(ticketLine) ? ticketLine : playableLine,
    freezeAtMs: ticketFrozen ? freezeAtMs : null,
    commenceMs: commenceMsForFreeze,
    provenOnSide: confirmedOnSide,
    vaultOnSide,
    trackedOnSide: wallets.length,
    liveEvPct: Number.isFinite(evFlagged) ? evFlagged : null,
  });

  // PIN = first print on this-side tape; NOW = last print (green dot).
  // Do not use SMA open/now — that path used to mix +1.5 with −1.5.
  const pinPts = Array.isArray(market.pinPath)
    ? market.pinPath.filter((p) => Number.isFinite(p?.odds))
    : [];
  const tapeOpen = pinPts[0]?.odds
    ?? (Number.isFinite(inst.tape?.open) ? inst.tape.open : null)
    ?? (Number.isFinite(sma?.path?.openOdds) ? sma.path.openOdds : null);
  const tapeNow = pinPts.length
    ? pinPts[pinPts.length - 1].odds
    : (Number.isFinite(inst.tape?.now) ? inst.tape.now : null)
      ?? (Number.isFinite(sma?.path?.nowOdds) ? sma.path.nowOdds : null)
      ?? (Number.isFinite(fairLine) ? fairLine : null);

  // Beating Close = ticket vs same-line NOW. Never MAIN closingOdds vs an alt.
  const closeForClv = Number.isFinite(tapeNow) ? tapeNow
    : (ticketOffMain ? null : (Number.isFinite(pick.closingOdds) ? pick.closingOdds : null));
  const lockProb = ip(lockOdds);
  const closeProb = ip(closeForClv);
  let clvPct = null;
  if (lockProb != null && closeProb != null) {
    clvPct = +((closeProb - lockProb) * 100).toFixed(1);
  } else if (!ticketOffMain && Number.isFinite(pick.clv)) {
    clvPct = +(pick.clv * (Math.abs(pick.clv) <= 1 ? 100 : 1)).toFixed(1);
  }

  const marketSignals = buildLockedMarketSignals({
    sma,
    evPct: Number.isFinite(evFlagged) ? evFlagged : null,
    provenOnSide: confirmedOnSide,
    vaultOnSide,
    trackedOnSide: wallets.length,
    sideInvested: pick.totalInvested || pick.lockTotalInvested || 0,
    clvPct: Number.isFinite(clvPct) ? clvPct : null,
  });

  // Stake math / hero price = sealed ticket odds (not main-line reco juice).
  const displayOdds = Number.isFinite(lockOdds) ? lockOdds
    : (Number.isFinite(recoOdds) ? recoOdds : null);
  const displayToWin = (() => {
    if (!Number.isFinite(displayOdds) || units <= 0) return 0;
    if (displayOdds < 0) return units * (100 / Math.abs(displayOdds));
    return units * (displayOdds / 100);
  })();
  const chartLineLabel = (isSpread || isTotal) && Number.isFinite(ticketLine)
    ? `${inst.variant === 'ALT' ? 'Alt' : ''} ${teamShort} ${isSpread ? fmtSpreadLn(ticketLine) : ticketLine}`.trim()
    : null;

  return {
    id: pick.key || `${pick.sport}-${pickLabel}`,
    sport: pick.sport,
    away: pick.away || '',
    home: pick.home || '',
    awayShort,
    homeShort,
    pickLabel,
    entryLadder: entryLadder.length ? entryLadder : null,
    // When MAIN ≠ ticket: hero is MAIN; flagged ticket is the subtitle.
    entryLadderLabel: entriesOffPlayable
      ? null
      : (entryLadder.length > 1 ? entryLadderLabel : null),
    mainNowLabel,
    flaggedAtLabel,
    ticketOffMain,
    heroOdds,
    chartLineLabel,
    // Always home|away|draw for board math (totals already mapped over→home).
    side: sideNorm,
    marketType: isSpread ? 'spread' : isTotal ? 'total' : 'ml',
    displayState: graded ? 'GRADED' : 'LOCKED',
    outcome,
    profit,
    graded,
    stakePath,
    units,
    toWin: displayToWin,
    odds: displayOdds,
    book: market.bestBook || pick.book || 'Pinnacle',
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
    confMargin: Number.isFinite(confMargin) ? confMargin : null,
    provenMargin: Number.isFinite(provenMargin) ? provenMargin : null,
    edge,
    netClv,
    confirmedOnSide,
    vaultOnSide,
    topQOnSide,
    hasTopQ,
    confirmedClvQ1: Number.isFinite(confirmedClvQ1) ? confirmedClvQ1 : null,
    setupHitRate: null,
    sideInvested: pick.totalInvested || pick.lockTotalInvested || 0,
    wallets,
    mapWallets: mapWallets.length ? mapWallets : null,
    against,
    sharpUsd: pick.totalInvested || pick.lockTotalInvested || 0,
    journey,
    pinSeries,
    pinPath: Array.isArray(market.pinPath) && market.pinPath.length >= 2 ? market.pinPath : null,
    books: market.books,
    bestOdds: market.bestOdds,
    bestBook: market.bestBook,
    ourMarketLabel: market.ourLabel,
    liveMarketLabel: market.liveLabel,
    lineMoved: !!entriesOffPlayable,
    instrumentVariant: inst.variant || 'MAIN',
    instrumentFamily: inst.family || (isSpread ? 'SPREAD' : isTotal ? 'TOTAL' : 'ML'),
    oppMarketLabel: market.oppLabel,
    oppBestOdds: market.oppBestOdds,
    oppBestBook: market.oppBestBook,
    marketLine: Number.isFinite(playableLine) ? playableLine : market.marketLine,
    liveMarketLine: market.liveMarketLine,
    ticketLine: Number.isFinite(ticketLine) ? ticketLine : null,
    playableLine: Number.isFinite(playableLine) ? playableLine : null,
    liveBestOdds: market.liveBestOdds,
    liveBestBook: market.liveBestBook,
    liveFair: market.liveFair,
    liveFairIsNoVig: !!market.liveFairIsNoVig,
    oddsUpdatedAgoSec: market.updatedAgoSec,
    combinedWalletPnl: wallets.reduce((s, w) => s + (w.pnl || 0), 0),
    gameTime,
    lockedAt,
    lockOdds,
    peakOdds,
    peakAt,
    nowOdds: Number.isFinite(tapeNow) ? tapeNow
      : (Number.isFinite(sma?.path?.nowOdds) ? sma.path.nowOdds : fairLine),
    clvPct,
    serial,
    record30d: record30d || null,
    lockChecks: lockChecks.length ? lockChecks : ['Locked ticket'],
    commenceMs,
    moneyPct,
    // FLAGGED / PM = vault Poly receipt; FAIR / NOW / chart = same-line book tape.
    gotOdds: lockOdds,
    fairLine,
    fairBook: pick.fairBook || pick.oddsSource || pick.book || null,
    tierPerf: tierPerf || null,
    mutedBy: pick.mutedBy || null,
    unitsPreTape: Number.isFinite(pick.unitsPreTape) ? pick.unitsPreTape
      : Number.isFinite(pick.v8_unitsPreTape) ? pick.v8_unitsPreTape
      : null,
    unitsPreFlinchFailOpen: Number.isFinite(pick.unitsPreFlinchFailOpen) ? pick.unitsPreFlinchFailOpen
      : Number.isFinite(pick.v8_unitsPreFlinchFailOpen) ? pick.v8_unitsPreFlinchFailOpen
      : null,
    unitsPreMaxSrSub4: Number.isFinite(pick.unitsPreMaxSrSub4) ? pick.unitsPreMaxSrSub4
      : Number.isFinite(pick.v8_unitsPreMaxSrSub4) ? pick.v8_unitsPreMaxSrSub4
      : null,
    marketAgreement: sma,
    marketSignals,
    pinnMax: sma?.path?.maxNow
      ?? (Array.isArray(market.pinPath)
        ? [...market.pinPath].reverse().find((p) => Number.isFinite(p?.max))?.max
        : null)
      ?? null,
    pinnMaxDelta: sma?.path?.maxDelta ?? null,
    pinnMovePp: sma?.path?.deltaProbPp ?? null,
    steam: sma?.path?.steam || null,
    // PIN/NOW = same-line tape as the chart (pinPath), never SMA's mixed path.
    sharpEntryOdds: Number.isFinite(tapeOpen) ? tapeOpen : null,
    currentFairOdds: Number.isFinite(tapeNow) ? tapeNow
      : (Number.isFinite(fairLine) ? fairLine : null),
    polyEntryOdds: Number.isFinite(polyEntryOdds) ? polyEntryOdds : null,
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
  heroOdds = null,
  flaggedOdds = null,
  mainNowLabel = null,
  ticketOffMain = false,
}) {
  const isTotal = marketType === 'TOTAL';
  const awayShort = isTotal ? 'Under' : shortTeam(gd.away, gd.home);
  const homeShort = isTotal ? 'Over' : shortTeam(gd.home, gd.away);
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
    heroOdds: Number.isFinite(heroOdds) ? heroOdds : (Number.isFinite(odds) ? odds : null),
    lockOdds: Number.isFinite(flaggedOdds) ? flaggedOdds : (Number.isFinite(odds) ? odds : null),
    mainNowLabel: mainNowLabel || null,
    ticketOffMain: !!ticketOffMain,
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
