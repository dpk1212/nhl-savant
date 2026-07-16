/**
 * Adapters: production Sharp Flow data → PositionCards fixture shape.
 * Display-only. Never changes stake formulas or stamps.
 */
import { AGS_V12_STAKE_TIER_META } from '../../../lib/ags.js';

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
 * `getRecordForDisplay(short, sport)` is the whitelist-coherent record helper
 * (whitelistRecordForDisplay in SharpFlow) — the same numbers BackingWalletStrip
 * shows, so a PROVEN wallet never renders with a record that contradicts its badge.
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
      const record = wlRec ? `${wlRec.wins}-${wlRec.losses}`
        : (picks?.n || 0) >= 2 ? `${picks.wins || 0}-${picks.losses || 0}`
        : positions?.n ? `${positions.wins || 0}-${positions.losses || 0}`
        : (w.record || '—');

      // "vs usual" baseline — THIS SPORT first. Preferring the feed's
      // precomputed sizeRatio (invested / cross-sport avgSportBet) made
      // SOC/NBA whales look like 0.2× on a $5.5K MLB ticket when their
      // real MLB usual was ~$12K (~0.5×). Priority:
      //   1) profile bySport[sport] avg (graded ledger)
      //   2) caller sportAvgBet (sports_sharps.perSport[sport].avgBet)
      //   3) cross-sport avgSportBet / sizeSignal median (last resort)
      const profileSportAvg = (positions?.n || 0) > 0 && Number.isFinite(positions?.invested)
        ? positions.invested / positions.n
        : null;
      const feedSportAvg = Number.isFinite(w.sportAvgBet) && w.sportAvgBet > 0 ? w.sportAvgBet : null;
      const feedCrossAvg = Number.isFinite(w.avgSportBet) && w.avgSportBet > 0 ? w.avgSportBet : null;
      const medianBet = profile?.sizeSignal?.medianInvested;
      const usualBet = (Number.isFinite(profileSportAvg) && profileSportAvg > 0)
        ? profileSportAvg
        : (feedSportAvg
          || feedCrossAvg
          || (Number.isFinite(medianBet) && medianBet > 0 ? medianBet : null));
      // Always recompute from usual when we have it — never trust a feed
      // sizeRatio that may have used the cross-sport denominator.
      const sizeRatio = (usualBet != null && (w.invested || 0) > 0)
        ? +(w.invested / usualBet).toFixed(2)
        : (Number.isFinite(w.sizeRatio) ? w.sizeRatio : null);
      // Causal %+CLV ("beats the close"): profile.clvSkill from exportWalletProfiles
      // (same definition as the tape/netCLV cron). Never invent a default %.
      const profileClv = profile?.clvSkill?.pctPos;
      const priorClvPct = Number.isFinite(w.priorClvPct) ? Math.round(w.priorClvPct)
        : Number.isFinite(w.causalPctPos) ? Math.round(w.causalPctPos)
        : Number.isFinite(profileClv) ? Math.round(profileClv)
        : null;
      const proven = isSportWinner ? isSportWinner(short, sport) : true;
      return {
        short,
        proven,
        badges: proven ? ['SHARP', `${sport} WINNER`] : ['SHARP'],
        whitelist: sportRec?.whitelistTier || (proven ? 'CONFIRMED' : null),
        qualify: sizeRatio >= 0.75 ? 'VAULT' : 'SHADOW',
        sizeRatio,
        record,
        wr: Number.isFinite(wr) ? Math.round(wr) : null,
        roi,
        dollarRoi,
        invested: w.invested || 0,
        avgSportBet: usualBet,
        cents: w.cents ?? null,
        pnl: w.pnl || 0,
        priorClvPct,
      };
    })
    .sort((a, b) => (b.sizeRatio || 0) - (a.sizeRatio || 0));
}

/**
 * Locked pick (allLockedArr entry) → LockedPositionCardView fixture
 */
export function mapLockedPickToCardFixture(pick, {
  getWalletProfile,
  isSportWinner,
  getRecordForDisplay,
  record30d = null,
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
  const teamShort = isTotal
    ? ((pick.team || '').toLowerCase().startsWith('under') ? 'Under' : 'Over')
    : shortTeam(pick.team);
  const awayShort = isTotal ? 'Under' : shortTeam(pick.away);
  const homeShort = isTotal ? 'Over' : shortTeam(pick.home);
  const side = isTotal
    ? (teamShort === 'Over' ? 'home' : 'away')
    : (teamShort === awayShort ? 'away' : 'home');

  const pickLabel = isSpread
    ? `${teamShort} ${pick.line > 0 ? '+' : ''}${pick.line}`
    : isTotal ? (pick.team || 'Total')
    : `${teamShort} ML`;

  const stakePath = pick.hcStakeTier || pick.lockTier || 'LOCK';
  const tapeAction = normTape(pick.tapeAction || pick.v8_tapeAction);
  // Only surface tape/edge/CLV when the stamp is actually on the pick — no fake defaults.
  const tapeScore = Number.isFinite(pick.tapeScore) ? pick.tapeScore
    : Number.isFinite(pick.v8_tapeScore) ? pick.v8_tapeScore
    : null;

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

  const confirmedOnSide = Number.isFinite(pick.agsProvenForCount)
    ? pick.agsProvenForCount
    : wallets.filter((w) => w.whitelist === 'CONFIRMED' || w.whitelist === 'FLAT').length || wallets.length;
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

  return {
    id: pick.key || `${pick.sport}-${pickLabel}`,
    sport: pick.sport,
    away: pick.away || '',
    home: pick.home || '',
    awayShort,
    homeShort,
    pickLabel,
    side,
    displayState: 'LOCKED',
    stakePath,
    units,
    toWin,
    odds: lockOdds,
    book: pick.book || 'Pinnacle',
    fairOdds: Number.isFinite(pick.pinnacleOdds) ? pick.pinnacleOdds : peakOdds,
    fairProb: Math.round((ip(pick.pinnacleOdds ?? peakOdds) || 0.5) * 100),
    tapeAction,
    tapeScore,
    pathBaseUnits: base || units,
    hcMargin: Number.isFinite(pick.hcMargin) ? pick.hcMargin : 0,
    edge,
    netClv,
    confirmedOnSide,
    vaultOnSide,
    setupHitRate: null,
    sideInvested: pick.totalInvested || pick.lockTotalInvested || 0,
    wallets,
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

  return {
    id: `${gd.sport}-${gd.key}-${marketType}`,
    sport: gd.sport,
    away: gd.away,
    home: gd.home,
    awayShort,
    homeShort,
    pickLabel: pickLabel || (isTotal
      ? (normSide === 'home' ? 'Over' : 'Under')
      : `${normSide === 'home' ? homeShort : awayShort} ML`),
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
    sideInvested: sideInvested || s[normSide === 'home' ? 'home' : 'away']?.invested || 0,
    pinnacleOpposes: !!pinnacleOpposes,
    sharpMoneyPct: f.sharp?.[normSide === 'home' ? 'home' : 'away'] ?? 50,
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
  };
}
