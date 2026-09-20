/**
 * My Sharps desk — who to tail.
 * Heat + sport×market books + a lean. Display only. Does not change lock math.
 */
import { CLV_SKILL_MIN_N, shortWalletId } from './walletClvSkill.js';
import { sportBookForDisplay } from './walletSportBook.js';
import { SIZED_UP_RATIO, fmtWalletTag, listMySharps } from './mySharps.js';
import { etDateKey } from './confirmedActionDesk.js';

/** Last-N needed before Hot / Cold is a claim, not noise. */
export const HEAT_CLAIM_N = 5;
/** Below this, form is Quiet. */
export const HEAT_THIN_N = 3;
/** Sport book n before Tail / Sit can use all-time WR. */
export const TAIL_BOOK_N = 8;
/** Hide shiny % until the sample can carry it. */
export const HONEST_PCT_N = 8;

const MARKET_ORDER = ['ML', 'SPREAD', 'TOTAL'];
const MARKET_LABEL = { ML: 'ML', SPREAD: 'Spread', TOTAL: 'Total' };
const LEAN_RANK = { tail: 0, watch: 1, sit: 2 };
const HEAT_RANK = { hot: 0, even: 1, quiet: 2, cold: 3 };

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

function wl(block) {
  if (!block) return null;
  const w = Number(block.w ?? block.wins);
  const l = Number(block.l ?? block.losses);
  if (!(Number.isFinite(w) && Number.isFinite(l) && w + l > 0)) return null;
  return { w, l, n: w + l, wr: w / (w + l) };
}

/** Record first. % only when n can carry it — never a naked 100% on 3 legs. */
export function honestRecord(wins, losses, wr, { minPctN = HONEST_PCT_N } = {}) {
  const w = Number(wins);
  const l = Number(losses);
  const n = (Number.isFinite(w) && Number.isFinite(l)) ? w + l : 0;
  if (n <= 0) return { text: '—', record: null, wr: null, n: 0, showPct: false };
  const pct = Number.isFinite(Number(wr)) ? Math.round(Number(wr)) : Math.round((w / n) * 100);
  return {
    text: n >= minPctN ? `${w}–${l} · ${pct}%` : `${w}–${l}`,
    record: `${w}–${l}`,
    wr: pct,
    n,
    showPct: n >= minPctN,
  };
}

/**
 * Hot / Cold / Even / Quiet from Action L5/L10 (featured L5/L10 if Action is empty).
 * Hot/Cold require n ≥ 5. n < 3 is Quiet.
 */
export function heatFromForm(form) {
  const stretch = wl(form?.actionL10) || wl(form?.l10);
  const recent = wl(form?.actionL5) || wl(form?.l5);
  let use = null;
  let window = null;
  if (stretch && stretch.n >= HEAT_CLAIM_N) {
    use = stretch;
    window = 'L10';
  } else if (recent && recent.n >= HEAT_THIN_N) {
    use = recent;
    window = 'L5';
  } else if (stretch && stretch.n >= HEAT_THIN_N) {
    use = stretch;
    window = 'L10';
  }
  if (!use) {
    return { key: 'quiet', label: 'Quiet', n: 0, record: null, wr: null, window: null };
  }
  const rec = `${use.w}–${use.l}`;
  const wr = Math.round(use.wr * 100);
  if (use.n >= HEAT_CLAIM_N && use.wr >= 0.65) {
    return { key: 'hot', label: 'Hot', n: use.n, record: rec, wr, window };
  }
  if (use.n >= HEAT_CLAIM_N && use.wr <= 0.40) {
    return { key: 'cold', label: 'Cold', n: use.n, record: rec, wr, window };
  }
  if (use.n < HEAT_CLAIM_N) {
    return { key: 'quiet', label: 'Quiet', n: use.n, record: rec, wr, window };
  }
  return { key: 'even', label: 'Even', n: use.n, record: rec, wr, window };
}

/**
 * Tail / Sit / Watch. Sit first (protect). Tail needs heat or a real book.
 * Thin samples stay Watch — including a 3–0 "100%".
 */
export function tailLean({ heat = null, l30 = null, book = null, clv = null } = {}) {
  const bookN = Number(book?.n) || 0;
  const bookWr = Number(book?.wr);
  const bookRoi = Number(book?.roi);
  const l30n = Number(l30?.n) || 0;
  const l30wr = Number(l30?.wr);
  const l30roi = Number(l30?.roi);
  const clvN = Number(clv?.n) || 0;
  const clvPct = Number(clv?.pctPos ?? clv?.priorClvPct);
  const sampleOk = bookN >= TAIL_BOOK_N || l30n >= TAIL_BOOK_N;

  const bookBad = bookN >= TAIL_BOOK_N && Number.isFinite(bookWr) && bookWr < 45;
  const bookGood = bookN >= TAIL_BOOK_N && Number.isFinite(bookWr) && bookWr >= 55
    && (!Number.isFinite(bookRoi) || bookRoi >= 0);
  const l30Bad = l30n >= TAIL_BOOK_N && Number.isFinite(l30wr) && l30wr < 45;
  const l30Good = l30n >= HEAT_CLAIM_N && Number.isFinite(l30wr) && l30wr >= 60
    && (!Number.isFinite(l30roi) || l30roi >= 0);
  const clvGood = clvN >= CLV_SKILL_MIN_N && Number.isFinite(clvPct) && clvPct >= 58;

  if (heat?.key === 'cold' || bookBad || l30Bad) {
    const reason = heat?.key === 'cold'
      ? `Cold ${heat.window} ${heat.record}`
      : l30Bad
        ? `L30 ${l30.wins}–${l30.losses}`
        : `Book ${book.wins}–${book.losses}`;
    return { key: 'sit', label: 'Sit', reason };
  }

  if (heat?.key === 'hot') {
    return { key: 'tail', label: 'Tail', reason: `Hot ${heat.window} ${heat.record}` };
  }
  if (bookGood && (l30Good || clvGood)) {
    return { key: 'tail', label: 'Tail', reason: `${book.wins}–${book.losses} book` };
  }
  if (l30Good && clvGood) {
    return { key: 'tail', label: 'Tail', reason: `L30 ${l30wr}% · beat close` };
  }

  return {
    key: 'watch',
    label: 'Watch',
    reason: sampleOk
      ? (heat?.record ? `${heat.window} ${heat.record}` : 'Mixed book')
      : 'Thin sample',
  };
}

function packBook(agg, extra = {}) {
  if (!agg || !(Number(agg.n) > 0)) return null;
  const wins = Number(agg.wins) || 0;
  const losses = Number.isFinite(Number(agg.losses))
    ? Number(agg.losses)
    : Math.max(0, Number(agg.n) - wins);
  const roiRaw = Number.isFinite(Number(agg.dollarRoi))
    ? Number(agg.dollarRoi)
    : (Number.isFinite(Number(agg.positionFlatRoi))
      ? Number(agg.positionFlatRoi)
      : Number(agg.flatRoi ?? agg.roi));
  return {
    n: Number(agg.n) || (wins + losses),
    wins,
    losses,
    wr: Number.isFinite(Number(agg.wr)) ? Math.round(Number(agg.wr)) : null,
    roi: Number.isFinite(roiRaw) ? Math.round(roiRaw) : null,
    ...extra,
  };
}

function sparkFromForm(form) {
  const raw = form?.actionDollarCurve || form?.dollarCurve;
  if (!Array.isArray(raw) || raw.length < 5) return null;
  const pts = raw.map((v) => Number(v)).filter((n) => Number.isFinite(n));
  return pts.length >= 5 ? pts : null;
}

function formFromRec(rec) {
  const form = rec?.form;
  if (!form) {
    return {
      actionL5: null, actionL10: null, l5: null, l10: null, spark: null,
    };
  }
  return {
    actionL5: form.actionL5 || null,
    actionL10: form.actionL10 || null,
    l5: form.l5 || null,
    l10: form.l10 || null,
    spark: sparkFromForm(form),
  };
}

function skillFromProfile(prof, rec) {
  const display = sportBookForDisplay(rec);
  const book = packBook(display);
  const clvN = Number(prof?.clvSkill?.n) || 0;
  const clvPct = Number(prof?.clvSkill?.pctPos);
  const priorClvPct = (clvN >= CLV_SKILL_MIN_N && Number.isFinite(clvPct))
    ? Math.round(clvPct)
    : null;
  return {
    book,
    clv: priorClvPct != null ? { n: clvN, pctPos: priorClvPct, priorClvPct } : { n: clvN, pctPos: null, priorClvPct: null },
  };
}

/** Sport × market books with n ≥ 2. Positions first, picks if that's the only book. */
export function marketBooksFromProfile(prof, sportFilter) {
  const by = prof?.bySport || {};
  const want = sportFilter && sportFilter !== 'All' && sportFilter !== 'ALL'
    ? sportFilter
    : null;
  const sports = (want ? [want] : confirmedSports(prof))
    .filter((s) => by[s]);
  const out = [];
  for (const sport of sports) {
    const rec = by[sport];
    const byM = rec?.byMarket || {};
    for (const mkt of MARKET_ORDER) {
      const mRec = byM[mkt];
      const packed = packBook(mRec?.positions) || packBook(mRec?.picks);
      if (!packed || packed.n < 2) continue;
      out.push({
        sport,
        market: mkt,
        label: MARKET_LABEL[mkt] || mkt,
        ...packed,
        l30: l30FromRec(mRec),
        honest: honestRecord(packed.wins, packed.losses, packed.wr),
      });
    }
  }
  return out;
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
  const roster = members.map((m) => {
    const prof = profileFor(walletProfiles, m.walletShort);
    const { sport, rec } = pickSportRec(prof, sportFilter);
    const l30 = l30FromRec(rec);
    const form = formFromRec(rec);
    const { book, clv } = skillFromProfile(prof, rec);
    const heat = heatFromForm(form);
    const lean = tailLean({ heat, l30, book, clv });
    const books = marketBooksFromProfile(prof, sportFilter);
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
      l30Honest: l30
        ? honestRecord(l30.wins, l30.losses, l30.wr)
        : honestRecord(null, null, null),
      form,
      book,
      bookHonest: book
        ? honestRecord(book.wins, book.losses, book.wr)
        : honestRecord(null, null, null),
      clv,
      heat,
      lean,
      books,
      spark: form.spark,
      openN: open.length,
      openInvested,
      sizedUpN: open.filter((r) => (Number(r.displaySizeRatio ?? r.sizeRatio) || 0) >= SIZED_UP_RATIO).length,
    };
  });
  roster.sort((a, b) => {
    const lr = (LEAN_RANK[a.lean?.key] ?? 9) - (LEAN_RANK[b.lean?.key] ?? 9);
    if (lr) return lr;
    const hr = (HEAT_RANK[a.heat?.key] ?? 9) - (HEAT_RANK[b.heat?.key] ?? 9);
    if (hr) return hr;
    return (b.openInvested || 0) - (a.openInvested || 0);
  });
  return roster;
}

export function rosterMatchesSection(card, section) {
  if (!section || section === 'action' || section === 'sized' || section === 'recent' || section === 'l30') {
    return true;
  }
  if (section === 'hot' || section === 'cold' || section === 'even' || section === 'quiet') {
    return card?.heat?.key === section;
  }
  return card?.lean?.key === section;
}

export function shortsForDeskSection(roster, section) {
  if (!section || section === 'action' || section === 'recent' || section === 'l30') return null;
  if (section === 'sized') return null;
  return new Set(
    (roster || []).filter((c) => rosterMatchesSection(c, section)).map((c) => c.walletShort),
  );
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
  const lean = { tail: 0, sit: 0, watch: 0 };
  const heat = { hot: 0, cold: 0, even: 0, quiet: 0 };
  const liveByLean = { tail: { n: 0, invested: 0 }, sit: { n: 0, invested: 0 }, watch: { n: 0, invested: 0 } };
  for (const c of cards) {
    if (lean[c.lean?.key] != null) lean[c.lean.key] += 1;
    if (heat[c.heat?.key] != null) heat[c.heat.key] += 1;
    const bucket = liveByLean[c.lean?.key];
    if (bucket) {
      bucket.n += c.openN || 0;
      bucket.invested += c.openInvested || 0;
    }
  }
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
    lean,
    heat,
    liveByLean,
  };
}

const SIDE_OPP = {
  away: 'home', home: 'away', over: 'under', under: 'over', draw: null,
};

function ticketKey(r) {
  return `${r.sport}|${r.gameKey}|${r.marketType}|${r.side}`;
}

function clusterKey(r) {
  return `${r.sport}|${r.gameKey}|${r.marketType}`;
}

function uniqueShorts(list) {
  const out = [];
  const seen = new Set();
  for (const r of list || []) {
    const w = shortWalletId(r.walletShort);
    if (!w || seen.has(w)) continue;
    seen.add(w);
    out.push(w);
  }
  return out;
}

function ticketRank(t) {
  if (t.shared) return 0;
  if (t.split) return 1;
  if (t.opposed) return 2;
  if (t.standout) return 3;
  return 4;
}

function legDollar(leg) {
  if (Number.isFinite(leg?.dollarPnl)) return Number(leg.dollarPnl);
  if (Number.isFinite(leg?.settledPnl)) return Number(leg.settledPnl);
  if (Number.isFinite(leg?.flat) && Number.isFinite(leg?.invested) && Number(leg.invested) > 0) {
    return Number(leg.invested) * Number(leg.flat);
  }
  return null;
}

function recentFromCards(cards) {
  let w = 0;
  let l = 0;
  for (const c of cards) {
    const block = wl(c.form?.actionL10) || wl(c.form?.l10) || wl(c.form?.actionL5) || wl(c.form?.l5);
    if (!block) continue;
    w += block.w;
    l += block.l;
  }
  return { w, l };
}

export function sortMySharpsRoster(roster, key = 'lean', dir = 'asc') {
  const mul = dir === 'desc' ? -1 : 1;
  return [...(roster || [])].sort((a, b) => {
    let cmp = 0;
    if (key === 'wallet') {
      cmp = String(a.walletShort || '').localeCompare(String(b.walletShort || ''));
    } else if (key === 'sport') {
      cmp = String(a.focusSport || a.sports?.[0] || '').localeCompare(String(b.focusSport || b.sports?.[0] || ''));
    } else if (key === 'recent') {
      const ar = wl(a.form?.actionL10) || wl(a.form?.l10) || wl(a.form?.actionL5) || wl(a.form?.l5);
      const br = wl(b.form?.actionL10) || wl(b.form?.l10) || wl(b.form?.actionL5) || wl(b.form?.l5);
      cmp = ((br?.wr || 0) - (ar?.wr || 0)) || ((br?.n || 0) - (ar?.n || 0));
    } else if (key === 'l30') {
      const ap = Number.isFinite(a.l30?.pnl) ? a.l30.pnl : -Infinity;
      const bp = Number.isFinite(b.l30?.pnl) ? b.l30.pnl : -Infinity;
      cmp = bp - ap;
      if (!cmp) cmp = (b.l30Honest?.n || 0) - (a.l30Honest?.n || 0);
    } else if (key === 'open') {
      cmp = (b.openInvested || 0) - (a.openInvested || 0);
      if (!cmp) cmp = (b.openN || 0) - (a.openN || 0);
    } else if (key === 'market') {
      const am = a.books?.[0];
      const bm = b.books?.[0];
      cmp = (Number(bm?.wr) || 0) - (Number(am?.wr) || 0);
    } else {
      cmp = (LEAN_RANK[a.lean?.key] ?? 9) - (LEAN_RANK[b.lean?.key] ?? 9);
      if (!cmp) cmp = (HEAT_RANK[a.heat?.key] ?? 9) - (HEAT_RANK[b.heat?.key] ?? 9);
      if (!cmp) cmp = (b.openInvested || 0) - (a.openInvested || 0);
    }
    return cmp * mul;
  });
}

/**
 * Open tickets from the list, grouped by game × market × side.
 * Shared / split use only wallets on this desk.
 */
export function buildMySharpsBoard(rows = []) {
  const byTicket = new Map();
  const byCluster = new Map();
  for (const r of rows || []) {
    const tk = ticketKey(r);
    if (!byTicket.has(tk)) byTicket.set(tk, []);
    byTicket.get(tk).push(r);
    const ck = clusterKey(r);
    if (!byCluster.has(ck)) byCluster.set(ck, []);
    byCluster.get(ck).push(r);
  }

  const tickets = [];
  for (const [id, list] of byTicket) {
    const first = list[0];
    const shorts = uniqueShorts(list);
    const invested = list.reduce((s, r) => s + (Number(r.invested) || 0), 0);
    const maxRatio = list.reduce((m, r) => Math.max(m, Number(r.displaySizeRatio ?? r.sizeRatio) || 0), 0);
    const opp = SIDE_OPP[String(first.side || '').toLowerCase()] ?? null;
    const cluster = byCluster.get(clusterKey(first)) || [];
    const oppShorts = opp
      ? uniqueShorts(cluster.filter((r) => String(r.side).toLowerCase() === opp))
      : [];
    const shared = shorts.length >= 2;
    const split = oppShorts.length > 0;
    const opposed = list.some((r) => r.opposed === 'contested');
    const clear = !opposed && list.some((r) => r.opposed === 'clear');
    const sized = maxRatio >= SIZED_UP_RATIO;
    const standout = !shared && !split && (sized || clear);
    const kind = shared ? 'shared' : split ? 'split' : opposed ? 'opposed' : standout ? 'standout' : 'open';
    tickets.push({
      id,
      sport: first.sport || null,
      gameKey: first.gameKey || null,
      marketType: first.marketType || null,
      side: first.side || null,
      team: first.team || null,
      marketLabel: first.marketLabel || null,
      away: first.away || null,
      home: first.home || null,
      invested,
      maxRatio,
      shorts,
      oppShorts,
      tags: shorts.map((s) => fmtWalletTag(s)),
      rows: list,
      shared,
      split,
      opposed,
      standout,
      clear,
      sized,
      kind,
    });
  }

  tickets.sort((a, b) => {
    const rk = ticketRank(a) - ticketRank(b);
    if (rk) return rk;
    if (b.maxRatio !== a.maxRatio) return b.maxRatio - a.maxRatio;
    return (b.invested || 0) - (a.invested || 0);
  });

  return {
    tickets,
    sharedN: tickets.filter((t) => t.shared).length,
    splitN: tickets.filter((t) => t.split).length,
    opposedN: tickets.filter((t) => t.opposed).length,
    standoutN: tickets.filter((t) => t.standout).length,
  };
}

export function filterBoardTickets(board, {
  focusShort = null,
  filter = null,
} = {}) {
  let list = board?.tickets || [];
  const focus = focusShort ? String(focusShort).toLowerCase() : null;
  if (focus) list = list.filter((t) => t.shorts.includes(focus));
  if (!filter || filter === 'open') return list;
  if (filter === 'agree' || filter === 'shared') return list.filter((t) => t.shared);
  if (filter === 'fight') return list.filter((t) => t.split || t.opposed);
  if (filter === 'split') return list.filter((t) => t.split);
  if (filter === 'opposed') return list.filter((t) => t.opposed);
  if (filter === 'standout') return list.filter((t) => t.standout);
  return list.filter((t) => t.sport === filter);
}

/**
 * Portfolio control KPIs for the list (or one focused wallet).
 * window: 'l30' | 'recent'
 */
export function buildDeskPulse({
  roster = [],
  board = { tickets: [] },
  actionRows = [],
  recentLegs = [],
  focusShort = null,
  window = 'l30',
} = {}) {
  const focus = focusShort ? String(focusShort).toLowerCase() : null;
  const cards = focus
    ? (roster || []).filter((r) => r.walletShort === focus)
    : (roster || []);
  const plays = focus
    ? (actionRows || []).filter((r) => shortWalletId(r.walletShort) === focus)
    : (actionRows || []);

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
  const l30Honest = honestRecord(l30w, l30l, (l30w + l30l) > 0 ? Math.round((l30w / (l30w + l30l)) * 100) : null);

  const legs = focus
    ? (recentLegs || []).filter((l) => shortWalletId(l.walletShort) === focus)
    : (recentLegs || []);
  let recentW = legs.filter((l) => l.won === 1).length;
  let recentL = legs.filter((l) => l.won === 0).length;
  let recentPnl = 0;
  let recentHavePnl = false;
  for (const leg of legs) {
    const d = legDollar(leg);
    if (!Number.isFinite(d)) continue;
    recentHavePnl = true;
    recentPnl += d;
  }
  if (recentW + recentL === 0) {
    const fb = recentFromCards(cards);
    recentW = fb.w;
    recentL = fb.l;
  }
  const recentHonest = honestRecord(recentW, recentL);

  const win = window === 'recent' ? 'recent' : 'l30';
  const heroPnl = win === 'recent'
    ? (recentHavePnl ? Math.round(recentPnl) : null)
    : (l30have ? l30pnl : null);
  const heroHonest = win === 'recent' ? recentHonest : l30Honest;

  const lean = { tail: 0, sit: 0, watch: 0 };
  const heat = { hot: 0, cold: 0, even: 0, quiet: 0 };
  for (const c of cards) {
    if (lean[c.lean?.key] != null) lean[c.lean.key] += 1;
    if (heat[c.heat?.key] != null) heat[c.heat.key] += 1;
  }

  const sportMap = new Map();
  for (const r of plays) {
    const sport = r.sport || '—';
    const cur = sportMap.get(sport) || { sport, n: 0, invested: 0 };
    cur.n += 1;
    cur.invested += Number(r.invested) || 0;
    sportMap.set(sport, cur);
  }
  const sportTotal = [...sportMap.values()].reduce((s, x) => s + x.invested, 0);
  const sports = [...sportMap.values()]
    .sort((a, b) => b.invested - a.invested)
    .map((x) => ({
      ...x,
      pct: sportTotal > 0 ? Math.round((x.invested / sportTotal) * 100) : 0,
    }));

  const tickets = filterBoardTickets(board, { focusShort: focus });
  const agreeN = tickets.filter((t) => t.shared).length;
  const splitN = tickets.filter((t) => t.split).length;
  const opposedN = tickets.filter((t) => t.opposed).length;
  const fightN = tickets.filter((t) => t.split || t.opposed).length;

  const movers = pickDeskMovers({ cards, tickets });

  return {
    walletN: cards.length,
    window: win,
    hero: {
      window: win,
      pnl: heroPnl,
      honest: heroHonest,
      hasPnl: heroPnl != null,
    },
    l30: l30have ? {
      n: l30n,
      wins: l30w,
      losses: l30l,
      pnl: l30pnl,
      wr: (l30w + l30l) > 0 ? Math.round((l30w / (l30w + l30l)) * 100) : null,
      honest: l30Honest,
    } : null,
    recent: {
      n: recentW + recentL,
      wins: recentW,
      losses: recentL,
      pnl: recentHavePnl ? Math.round(recentPnl) : null,
      honest: recentHonest,
    },
    open: {
      n: plays.length,
      invested: plays.reduce((s, r) => s + (Number(r.invested) || 0), 0),
    },
    lean,
    heat,
    sports,
    agreeN,
    splitN,
    opposedN,
    fightN,
    canOverlap: (roster || []).length >= 2,
    overlapEmpty: (roster || []).length >= 2 && agreeN === 0 && fightN === 0,
    movers,
  };
}

/** Distinct names only. Same wallet is not Hot, Book, and Live. */
export function pickDeskMovers({ cards = [], tickets = [] } = {}) {
  const hotCard = [...cards]
    .filter((c) => c.heat?.key === 'hot')
    .sort((a, b) => (Number(b.heat?.wr) || 0) - (Number(a.heat?.wr) || 0))[0]
    || [...cards].sort((a, b) => (HEAT_RANK[a.heat?.key] ?? 9) - (HEAT_RANK[b.heat?.key] ?? 9))[0]
    || null;

  const bookCard = [...cards].sort((a, b) => {
    const ap = Number.isFinite(a.l30?.pnl) ? a.l30.pnl : -Infinity;
    const bp = Number.isFinite(b.l30?.pnl) ? b.l30.pnl : -Infinity;
    if (bp !== ap) return bp - ap;
    return (b.l30Honest?.n || 0) - (a.l30Honest?.n || 0);
  }).find((c) => !hotCard || c.walletShort !== hotCard.walletShort) || null;

  const used = new Set([hotCard?.walletShort, bookCard?.walletShort].filter(Boolean));
  const liveTicket = [...(tickets || [])].sort((a, b) => {
    if (a.shared !== b.shared) return a.shared ? -1 : 1;
    if (a.sized !== b.sized) return a.sized ? -1 : 1;
    return (b.invested || 0) - (a.invested || 0);
  })[0] || null;

  let live = null;
  if (liveTicket) {
    const pick = liveTicket.shorts.find((s) => !used.has(s)) || null;
    if (pick) {
      const card = cards.find((c) => c.walletShort === pick);
      live = {
        role: 'live',
        walletShort: pick,
        tag: card?.tag || liveTicket.tags[liveTicket.shorts.indexOf(pick)] || null,
        ticket: liveTicket,
      };
    }
  }

  const hot = hotCard ? {
    role: 'hot',
    walletShort: hotCard.walletShort,
    tag: hotCard.tag,
    heat: hotCard.heat,
    lean: hotCard.lean,
  } : null;
  const book = bookCard ? {
    role: 'book',
    walletShort: bookCard.walletShort,
    tag: bookCard.tag,
    pnl: bookCard.l30?.pnl ?? null,
    honest: bookCard.l30Honest,
  } : null;

  return {
    hot,
    book,
    live,
    list: [hot, book, live].filter(Boolean),
  };
}

/** Pick first: "Colts −6.5", not "SPREAD −6.5". */
function shiftDateKey(key, days) {
  if (!key || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return null;
  const [y, m, d] = key.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

function legDateKey(leg) {
  const raw = String(leg?.date || '').slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : null;
}

function addSport(map, sport, extra = {}) {
  const key = sport || '—';
  const cur = map.get(key) || {
    sport: key, openN: 0, openInvested: 0, l30Pnl: 0, l30w: 0, l30l: 0, l30n: 0,
  };
  map.set(key, { ...cur, ...extra });
  return map.get(key);
}

/**
 * Portfolio report for the whole list. Never narrows to one wallet.
 */
export function buildDeskReport({
  roster = [],
  walletProfiles = null,
  shorts = [],
  actionRows = [],
  weekRows = [],
  recentLegs = [],
  dateKey = null,
  todayKey = null,
  nowMs = Date.now(),
} = {}) {
  const today = todayKey || etDateKey(nowMs);
  const day = dateKey || today;
  const weekStart = shiftDateKey(today, -6);
  const cards = roster || [];
  const plays = actionRows || [];
  const weekOpen = (weekRows || []).filter((r) => {
    const k = r.commenceDateKey || (Number.isFinite(Number(r.commenceMs)) ? etDateKey(Number(r.commenceMs)) : null);
    return k && weekStart && k >= weekStart && k <= today;
  });

  const weekLegs = (recentLegs || []).filter((leg) => {
    const k = legDateKey(leg);
    return k && weekStart && k >= weekStart && k <= today;
  });
  const weekW = weekLegs.filter((l) => l.won === 1).length;
  const weekL = weekLegs.filter((l) => l.won === 0).length;
  let weekPnl = 0;
  let weekHavePnl = false;
  for (const leg of weekLegs) {
    const d = legDollar(leg);
    if (!Number.isFinite(d)) continue;
    weekHavePnl = true;
    weekPnl += d;
  }

  const sportMap = new Map();
  for (const r of plays) {
    const row = addSport(sportMap, r.sport);
    row.openN += 1;
    row.openInvested += Number(r.invested) || 0;
  }

  let l30pnl = 0;
  let l30w = 0;
  let l30l = 0;
  let l30have = false;
  const marketMap = new Map();
  const ids = (shorts && shorts.length) ? shorts : cards.map((c) => c.walletShort);

  for (const short of ids) {
    const prof = profileFor(walletProfiles, short);
    const sports = confirmedSports(prof);
    for (const sport of sports) {
      const rec = prof?.bySport?.[sport];
      const l30 = l30FromRec(rec);
      const row = addSport(sportMap, sport);
      if (l30) {
        l30have = true;
        if (Number.isFinite(l30.pnl)) {
          l30pnl += l30.pnl;
          row.l30Pnl += l30.pnl;
        }
        if (Number.isFinite(l30.wins)) {
          l30w += l30.wins;
          row.l30w += l30.wins;
        }
        if (Number.isFinite(l30.losses)) {
          l30l += l30.losses;
          row.l30l += l30.losses;
        }
        row.l30n += l30.n || 0;
      }
      for (const book of marketBooksFromProfile(prof, sport)) {
        const cur = marketMap.get(book.market) || {
          market: book.market,
          label: book.label,
          n: 0,
          wins: 0,
          losses: 0,
          pnl: 0,
        };
        cur.n += book.n || 0;
        cur.wins += book.wins || 0;
        cur.losses += book.losses || 0;
        if (Number.isFinite(book.l30?.pnl)) cur.pnl += book.l30.pnl;
        marketMap.set(book.market, cur);
      }
    }
  }

  const openInvested = plays.reduce((s, r) => s + (Number(r.invested) || 0), 0);
  const sports = [...sportMap.values()]
    .map((s) => ({
      ...s,
      openPct: openInvested > 0 ? Math.round((s.openInvested / openInvested) * 100) : 0,
      honest: honestRecord(s.l30w, s.l30l),
    }))
    .sort((a, b) => (b.l30Pnl - a.l30Pnl) || (b.openInvested - a.openInvested));

  const markets = [...marketMap.values()]
    .map((m) => ({ ...m, honest: honestRecord(m.wins, m.losses) }))
    .sort((a, b) => (b.pnl - a.pnl) || (b.n - a.n));

  const l30Honest = honestRecord(l30w, l30l);
  const dayLabel = day && today && day !== today ? 'Slate' : 'Today';

  return {
    walletN: cards.length || ids.length,
    dayKey: day,
    dayLabel,
    todayN: plays.length,
    todayInvested: openInvested,
    weekN: weekLegs.length || weekOpen.length,
    weekGradedN: weekLegs.length,
    weekOpenN: weekOpen.length,
    weekW,
    weekL,
    weekPnl: weekHavePnl ? Math.round(weekPnl) : null,
    weekHonest: honestRecord(weekW, weekL),
    openN: plays.length,
    openInvested,
    l30: l30have ? {
      pnl: l30pnl,
      wins: l30w,
      losses: l30l,
      n: l30w + l30l,
      honest: l30Honest,
    } : null,
    sports,
    markets,
    bestSport: sports.find((s) => Number.isFinite(s.l30Pnl) && (s.l30Pnl !== 0 || s.l30n > 0)) || sports[0] || null,
    bestMarket: markets[0] || null,
  };
}

export function ticketPickLabel(t) {
  const team = t?.team || '';
  const raw = String(t?.marketLabel || '');
  const num = raw.replace(/^(SPREAD|TOTAL|ML|O|U)\s*/i, '').trim();
  if (team === 'Over' || team === 'Under') return num ? `${team} ${num}` : team;
  if (String(t?.marketType || '').toUpperCase() === 'ML') return team || 'ML';
  if (team && num) return `${team} ${num}`;
  return team || raw || '—';
}
