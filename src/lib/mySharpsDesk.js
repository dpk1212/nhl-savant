/**
 * My Sharps desk — aggregate / single-wallet stats from live Action
 * rows + sharpWalletProfiles. Display only. Does not change lock math.
 */
import { shortWalletId } from './walletClvSkill.js';
import { SIZED_UP_RATIO, fmtWalletTag, listMySharps } from './mySharps.js';

function profileFor(walletProfiles, short) {
  if (!walletProfiles || !short) return null;
  const s = String(short).toLowerCase();
  if (typeof walletProfiles.get === 'function') {
    return walletProfiles.get(s)
      || walletProfiles.get(s.toUpperCase())
      || walletProfiles.get(short)
      || null;
  }
  return walletProfiles[s] || walletProfiles[short] || null;
}

function confirmedSports(prof) {
  const by = prof?.bySport;
  if (!by || typeof by !== 'object') return [];
  return Object.keys(by)
    .filter((s) => String(by[s]?.whitelistTier || '').toUpperCase() === 'CONFIRMED')
    .sort();
}

function l30FromRec(rec) {
  const win = rec?.recentActionWindow;
  if (win && Number(win.n) > 0) {
    const wins = Number(win.wins);
    const losses = Number(win.losses);
    return {
      n: Number(win.n) || 0,
      wins: Number.isFinite(wins) ? wins : null,
      losses: Number.isFinite(losses) ? losses : null,
      wr: Number.isFinite(Number(win.wr)) ? Math.round(Number(win.wr)) : null,
      pnl: Number.isFinite(Number(win.settledPnl)) ? Math.round(Number(win.settledPnl)) : null,
      roi: Number.isFinite(Number(win.dollarRoi)) ? Math.round(Number(win.dollarRoi)) : null,
    };
  }
  const form = rec?.form;
  if (Number.isFinite(Number(form?.actionDollarEnd))) {
    return {
      n: Number(form?.recentActionTotalN) || 0,
      wins: null,
      losses: null,
      wr: null,
      pnl: Math.round(Number(form.actionDollarEnd)),
      roi: null,
    };
  }
  return null;
}

function pickSportRec(prof, sportFilter) {
  const by = prof?.bySport || {};
  const want = sportFilter && sportFilter !== 'All' && sportFilter !== 'ALL'
    ? sportFilter
    : null;
  if (want && by[want]) return { sport: want, rec: by[want] };
  const confirmed = confirmedSports(prof);
  const sport = confirmed[0] || Object.keys(by)[0] || null;
  return sport ? { sport, rec: by[sport] } : { sport: null, rec: null };
}

export function filterRowsToMySharps(rows, shorts, focusShort = null) {
  const set = shorts instanceof Set ? shorts : new Set(shorts || []);
  const focus = focusShort ? String(focusShort).toLowerCase() : null;
  return (rows || []).filter((r) => {
    const w = shortWalletId(r?.walletShort);
    if (!w || !set.has(w)) return false;
    if (focus && w !== focus) return false;
    return true;
  });
}

export function sortRowsByRelativeSize(rows) {
  return [...(rows || [])].sort((a, b) => {
    const sa = Number(a.displaySizeRatio ?? a.sizeRatio) || 0;
    const sb = Number(b.displaySizeRatio ?? b.sizeRatio) || 0;
    if (sb !== sa) return sb - sa;
    return (Number(b.invested) || 0) - (Number(a.invested) || 0);
  });
}

export function collectRecentLegs(walletProfiles, shorts, {
  sportFilter = 'All',
  focusShort = null,
  limit = 16,
} = {}) {
  const list = [];
  const want = sportFilter && sportFilter !== 'All' && sportFilter !== 'ALL'
    ? sportFilter
    : null;
  for (const short of shorts || []) {
    if (focusShort && short !== focusShort) continue;
    const prof = profileFor(walletProfiles, short);
    const sports = want ? [want] : confirmedSports(prof);
    for (const sport of sports.length ? sports : [want].filter(Boolean)) {
      const rec = prof?.bySport?.[sport];
      const legs = rec?.form?.recentAction;
      if (!Array.isArray(legs)) continue;
      for (const leg of legs) {
        if (leg?.won !== 0 && leg?.won !== 1) continue;
        list.push({
          ...leg,
          walletShort: short,
          sport: sport || leg.sport || null,
        });
      }
    }
  }
  list.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  return list.slice(0, limit);
}

export function buildMySharpsRoster(state, {
  walletProfiles = null,
  actionRows = [],
  sportFilter = 'All',
} = {}) {
  const members = listMySharps(state);
  return members.map((m) => {
    const prof = profileFor(walletProfiles, m.walletShort);
    const { sport, rec } = pickSportRec(prof, sportFilter);
    const l30 = l30FromRec(rec);
    const open = (actionRows || []).filter(
      (r) => shortWalletId(r.walletShort) === m.walletShort,
    );
    const openInvested = open.reduce((s, r) => s + (Number(r.invested) || 0), 0);
    return {
      ...m,
      tag: fmtWalletTag(m.walletShort),
      sports: confirmedSports(prof),
      focusSport: sport,
      l30,
      openN: open.length,
      openInvested,
      sizedUpN: open.filter((r) => (Number(r.displaySizeRatio ?? r.sizeRatio) || 0) >= SIZED_UP_RATIO).length,
    };
  });
}

export function buildMySharpsDashboard({
  roster = [],
  actionRows = [],
  recentLegs = [],
  focusShort = null,
} = {}) {
  const cards = focusShort
    ? roster.filter((r) => r.walletShort === focusShort)
    : roster;
  const plays = focusShort
    ? (actionRows || []).filter((r) => shortWalletId(r.walletShort) === focusShort)
    : (actionRows || []);
  const sized = plays.filter(
    (r) => (Number(r.displaySizeRatio ?? r.sizeRatio) || 0) >= SIZED_UP_RATIO,
  );
  let l30n = 0;
  let l30w = 0;
  let l30l = 0;
  let l30pnl = 0;
  let l30have = false;
  for (const c of cards) {
    if (!c.l30) continue;
    l30have = true;
    l30n += c.l30.n || 0;
    if (Number.isFinite(c.l30.wins)) l30w += c.l30.wins;
    if (Number.isFinite(c.l30.losses)) l30l += c.l30.losses;
    if (Number.isFinite(c.l30.pnl)) l30pnl += c.l30.pnl;
  }
  const recent = focusShort
    ? recentLegs.filter((l) => l.walletShort === focusShort)
    : recentLegs;
  const recentW = recent.filter((l) => l.won === 1).length;
  const recentL = recent.filter((l) => l.won === 0).length;
  return {
    walletN: cards.length,
    actionN: plays.length,
    actionInvested: plays.reduce((s, r) => s + (Number(r.invested) || 0), 0),
    unopposedN: plays.filter((r) => r.opposed === 'clear').length,
    sizedUpN: sized.length,
    sizedUpInvested: sized.reduce((s, r) => s + (Number(r.invested) || 0), 0),
    l30: l30have ? {
      n: l30n,
      wins: l30w,
      losses: l30l,
      pnl: l30pnl,
      wr: (l30w + l30l) > 0 ? Math.round((l30w / (l30w + l30l)) * 100) : null,
    } : null,
    recentN: recent.length,
    recentW,
    recentL,
    sizedPlays: sized,
    recentLegs: recent,
  };
}
