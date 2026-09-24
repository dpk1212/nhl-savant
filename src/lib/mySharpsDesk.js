/**
 * My Sharps desk — who to tail.
 * Heat + sport×market books + a lean. Display only. Does not change lock math.
 */
import { CLV_SKILL_MIN_N, shortWalletId } from './walletClvSkill.js';
import { sportBookForDisplay } from './walletSportBook.js';
import { sportUsualBetFromProfile } from './sizeRatioBands.js';
import { SIZED_UP_RATIO, betsFeedKey, fmtWalletTag, listMySharps, normalizeWalletShort, tailKey } from './mySharps.js';
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
  const raw = typeof walletProfiles.get === 'function'
    ? (walletProfiles.get(s) || walletProfiles.get(s.toUpperCase()) || walletProfiles.get(short) || null)
    : (walletProfiles[s] || walletProfiles[short] || null);
  return raw ? profileWithoutCopiedBets(raw) : null;
}

/** Same game, same side, same stake, same dollars — one ticket. Scan dates clone soccer bets. */
function legCopyKey(leg) {
  const gk = String(leg?.gameKey || '').toLowerCase();
  if (!gk) return '';
  const pnl = Number.isFinite(Number(leg?.dollarPnl)) ? Number(leg.dollarPnl) : Number(leg?.settledPnl);
  return [
    String(leg?.marketType || leg?.market || '').toUpperCase(),
    gk,
    String(leg?.side || '').toLowerCase(),
    Math.round(Number(leg?.invested) || 0),
    Math.round(Number(pnl) || 0),
  ].join('|');
}

function dedupeLegs(legs) {
  const out = [];
  const at = new Map();
  for (const leg of legs || []) {
    const key = legCopyKey(leg);
    if (!key) {
      out.push(leg);
      continue;
    }
    const i = at.get(key);
    if (i == null) {
      at.set(key, out.length);
      out.push(leg);
      continue;
    }
    if (String(leg?.date || '') < String(out[i]?.date || '')) out[i] = leg;
  }
  return out;
}

function splitCopiedLegs(legs) {
  const list = Array.isArray(legs) ? legs : [];
  const unique = dedupeLegs(list);
  const need = new Map();
  for (const leg of unique) {
    const key = legCopyKey(leg) || '';
    if (!key) continue;
    need.set(key, (need.get(key) || 0) + 1);
  }
  const dropped = [];
  for (const leg of list) {
    const key = legCopyKey(leg);
    if (!key) continue;
    const left = need.get(key) || 0;
    if (left > 0) need.set(key, left - 1);
    else dropped.push(leg);
  }
  return { unique, dropped };
}

function subtractCopies(block, dropped) {
  if (!block || !(dropped || []).length) return block;
  const n = Math.max(0, (Number(block.n) || 0) - dropped.length);
  const winsDrop = dropped.filter((leg) => legWon(leg) === 1).length;
  const wins = Math.max(0, (Number(block.wins) || 0) - winsDrop);
  const losses = Math.max(0, n - wins);
  const pnlDrop = dropped.reduce((sum, leg) => sum + (Number(leg?.dollarPnl ?? leg?.settledPnl) || 0), 0);
  const invDrop = dropped.reduce((sum, leg) => sum + (Number(leg?.invested) || 0), 0);
  const settled = Number(block.settledPnl);
  const invested = Number(block.invested);
  const nextPnl = Number.isFinite(settled) ? Math.round(settled - pnlDrop) : block.settledPnl;
  const nextInv = Number.isFinite(invested) ? Math.max(0, Math.round(invested - invDrop)) : block.invested;
  const wr = n ? +((wins / n) * 100).toFixed(1) : (n === 0 ? null : block.wr);
  const dollarRoi = Number(nextInv) > 0 && Number.isFinite(Number(nextPnl))
    ? +((Number(nextPnl) / Number(nextInv)) * 100).toFixed(1)
    : block.dollarRoi;
  return {
    ...block,
    n,
    wins,
    losses,
    wr,
    settledPnl: nextPnl,
    invested: nextInv,
    dollarRoi,
  };
}

function stretchOf(legs, n) {
  const slice = legs.slice(-n);
  const w = slice.filter((leg) => legWon(leg) === 1).length;
  return { w, l: slice.length - w };
}

function dedupeSportRec(rec) {
  const form = rec?.form;
  const raw = Array.isArray(form?.recentAction) ? form.recentAction : [];
  const { unique, dropped } = splitCopiedLegs(raw);
  if (!dropped.length) return rec;
  const ordered = [...unique].sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));
  let run = 0;
  const curve = [];
  for (const leg of ordered) {
    const d = legDollar(leg);
    if (!Number.isFinite(d)) continue;
    run += d;
    curve.push(Math.round(run));
  }
  const byMarket = { ...(rec.byMarket || {}) };
  const droppedByMarket = new Map();
  for (const leg of dropped) {
    const m = String(leg?.marketType || leg?.market || '').toUpperCase();
    if (!m) continue;
    const list = droppedByMarket.get(m) || [];
    list.push(leg);
    droppedByMarket.set(m, list);
  }
  for (const [m, legs] of droppedByMarket) {
    if (!byMarket[m]) continue;
    byMarket[m] = {
      ...byMarket[m],
      positions: subtractCopies(byMarket[m].positions, legs),
      recentActionWindow: subtractCopies(byMarket[m].recentActionWindow, legs),
    };
  }
  return {
    ...rec,
    positions: subtractCopies(rec.positions, dropped),
    recentActionWindow: subtractCopies(rec.recentActionWindow, dropped),
    byMarket,
    form: {
      ...form,
      recentAction: ordered,
      recentActionTotalN: ordered.length,
      actionDollarCurve: curve.length >= 5 ? curve : [],
      actionDollarEnd: curve.length ? curve[curve.length - 1] : form.actionDollarEnd,
      actionL5: ordered.length ? stretchOf(ordered, Math.min(5, ordered.length)) : form.actionL5,
      actionL10: ordered.length ? stretchOf(ordered, Math.min(10, ordered.length)) : form.actionL10,
    },
  };
}

function profileWithoutCopiedBets(prof) {
  const by = prof?.bySport;
  if (!by || typeof by !== 'object') return prof;
  let changed = false;
  const bySport = {};
  for (const [sport, rec] of Object.entries(by)) {
    const next = dedupeSportRec(rec);
    if (next !== rec) changed = true;
    bySport[sport] = next;
  }
  return changed ? { ...prof, bySport } : prof;
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
  // An explicit empty month is not the curve. The curve falls back to the
  // last 20 bets when this month is thin, and that dollar is not "30 days".
  if (win && Number(win.n) === 0) return null;
  const form = rec?.form;
  if (Number.isFinite(Number(form?.actionDollarEnd)) && form?.actionCurveScope !== 'recent') {
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
  if (stretch && stretch.n >= 10) {
    use = stretch;
    window = 'L10';
  } else if (recent && recent.n >= HEAT_THIN_N) {
    use = recent;
    window = 'L5';
  } else if (stretch && stretch.n >= HEAT_CLAIM_N) {
    use = stretch;
    window = 'L5';
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

/**
 * `l30` is a real month (5+ priced bets). `recent` is the last stretch of
 * the book, drawn when this month is too thin to be a path.
 */
function sportPath(rec) {
  const form = rec?.form || {};
  const n = Number(rec?.recentActionWindow?.n) || 0;
  const totalN = Number(form.recentActionTotalN) || 0;
  const spark = sparkFromForm(form);
  let scope = form.actionCurveScope || null;
  if (scope !== 'l30' && scope !== 'recent') {
    if (!spark) scope = null;
    else scope = (n >= 5 || totalN >= 5) ? 'l30' : 'recent';
  }
  const from = form.actionCurveFrom || form.flatCurveFrom || null;
  return {
    scope,
    from: scope === 'recent' ? from : null,
    spark,
    windowN: n,
  };
}

function legWon(leg) {
  if (leg?.won === 1 || leg?.won === true) return 1;
  if (leg?.won === 0 || leg?.won === false) return 0;
  return null;
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
      const invested = Number(mRec?.positions?.invested);
      const usual = packed.n > 0 && Number.isFinite(invested) && invested > 0
        ? Math.round(invested / packed.n)
        : null;
      out.push({
        sport,
        market: mkt,
        label: MARKET_LABEL[mkt] || mkt,
        ...packed,
        usual,
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

/**
 * Drop a wallet's open rows for sport × markets they turned off.
 * Other wallets on the same ticket stay. Empty means every market is on.
 */
export function rowsForBetsFeed(rows, roster = []) {
  const offByShort = new Map();
  for (const m of roster || []) {
    const id = normalizeWalletShort(m?.walletShort);
    const keys = new Set((m?.betsOff || []).map((k) => String(k)).filter(Boolean));
    if (id && keys.size) offByShort.set(id, keys);
  }
  if (!offByShort.size) return rows || [];
  return (rows || []).filter((r) => {
    const id = normalizeWalletShort(r?.walletShort) || shortWalletId(r?.walletShort);
    const keys = id ? offByShort.get(id) : null;
    if (!keys) return true;
    const key = betsFeedKey(r?.sport, r?.marketType);
    return !key || !keys.has(key);
  });
}

/** Graded plays for one sport × market. This month first, then the older tape. */
export function marketTape(walletProfiles, walletShort, sport, market, { limit = 8 } = {}) {
  const prof = profileFor(walletProfiles, walletShort);
  const rec = prof?.bySport?.[sport];
  const want = String(market || '').toUpperCase();
  const take = (legs) => (Array.isArray(legs) ? legs : []).filter((leg) => {
    if (legWon(leg) == null) return false;
    return String(leg?.marketType || leg?.market || '').toUpperCase() === want;
  });
  let legs = take(rec?.form?.recentAction);
  let scope = legs.length ? 'l30' : null;
  if (!legs.length) {
    legs = take(rec?.form?.curveLegs);
    scope = legs.length ? 'recent' : null;
  }
  legs = [...legs].sort((a, b) => String(b?.date || '').localeCompare(String(a?.date || '')));
  const shown = legs.slice(0, limit).map((leg) => {
    const row = resultFromLeg(leg, sport);
    const invested = Number(leg?.invested);
    const ratio = Number(leg?.sizeRatio ?? leg?.displaySizeRatio);
    return {
      ...row,
      invested: Number.isFinite(invested) && invested > 0 ? Math.round(invested) : null,
      ratio: Number.isFinite(ratio) && ratio > 0 ? ratio : null,
    };
  });
  return { scope, plays: shown, total: legs.length };
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
  return tailKey(r) || `${r.sport}|${r.gameKey}|${r.marketType}|${r.side}`;
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
      commenceMs: list.reduce((best, r) => {
        const n = Number(r.commenceMs);
        if (!Number.isFinite(n)) return best;
        return best == null ? n : Math.min(best, n);
      }, null),
      commenceDateKey: first.commenceDateKey || null,
      americanLabel: first.americanLabel || null,
      americanOdds: Number.isFinite(Number(first.americanOdds ?? first.odds))
        ? Number(first.americanOdds ?? first.odds)
        : null,
      entryLine: Number.isFinite(Number(first.entryLine)) ? Number(first.entryLine) : null,
      pinMove: first.pinMove === 'with' || first.pinMove === 'against' ? first.pinMove : null,
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
    openLead: (() => {
      const withMoney = sports.filter((s) => s.openInvested > 0);
      if (!withMoney.length) return null;
      const top = [...withMoney].sort((a, b) => b.openInvested - a.openInvested)[0];
      return { sport: top.sport, pct: top.openPct, invested: top.openInvested };
    })(),
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

export function ticketMatchup(t) {
  if (t?.away && t?.home) return `${t.away} @ ${t.home}`;
  if (t?.matchup) return t.matchup;
  const gk = String(t?.gameKey || '');
  const m = gk.match(/([a-z]{2,5})_([a-z]{2,5})(?:__2)?(?:_(?:total|spread|ml))?$/i);
  if (m) return `${m[1].toUpperCase()} @ ${m[2].toUpperCase()}`;
  return null;
}

export function closedPickLabel(leg) {
  const side = String(leg?.side || '').toLowerCase();
  const line = Number(leg?.line);
  const mkt = String(leg?.marketType || '').toUpperCase();
  if (side === 'over' || side === 'under') {
    const word = side === 'over' ? 'Over' : 'Under';
    return Number.isFinite(line) ? `${word} ${line}` : word;
  }
  const team = leg?.team
    || (leg?.label && !/^(away|home|over|under)$/i.test(String(leg.label)) ? leg.label : null)
    || (side === 'away' ? leg?.away : side === 'home' ? leg?.home : null)
    || '';
  if (mkt === 'ML') return team || 'ML';
  if (team && Number.isFinite(line)) {
    const signed = line > 0 ? `+${line}` : `${line}`;
    return `${team} ${signed}`;
  }
  return ticketPickLabel({
    team,
    marketType: mkt,
    marketLabel: leg?.marketLabel,
  });
}

function formatDayLabel(key, todayKey) {
  if (!key || key === '—') return '';
  if (todayKey && key === todayKey) return 'Today';
  if (todayKey && key === shiftDateKey(todayKey, -1)) return 'Yesterday';
  if (todayKey && key === shiftDateKey(todayKey, 1)) return 'Tomorrow';
  const parts = String(key).split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return key;
  const [y, m, d] = parts;
  const dt = new Date(Date.UTC(y, m - 1, d, 17));
  return dt.toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatClock(ms) {
  if (!Number.isFinite(ms)) return null;
  return new Date(ms).toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function ticketBucket(t, nowMs, todayKey) {
  const k = t?.commenceDateKey
    || (Number.isFinite(Number(t?.commenceMs)) ? etDateKey(Number(t.commenceMs)) : null);
  if (k && todayKey && k > todayKey) return 'upcoming';
  return 'open';
}

function packLiveTicket(t, nowMs, todayKey) {
  const bucket = ticketBucket(t, nowMs, todayKey);
  const dateKey = t.commenceDateKey || (Number.isFinite(Number(t.commenceMs)) ? etDateKey(Number(t.commenceMs)) : null);
  const clock = formatClock(Number(t.commenceMs));
  const live = bucket === 'open' && Number.isFinite(Number(t.commenceMs)) && Number(t.commenceMs) <= nowMs;
  return {
    id: t.id,
    bucket,
    pick: ticketPickLabel(t),
    matchup: ticketMatchup(t),
    sport: t.sport || null,
    market: MARKET_LABEL[String(t.marketType || '').toUpperCase()] || t.marketType || null,
    invested: Number(t.invested) || 0,
    walletN: (t.shorts || []).length,
    shorts: t.shorts || [],
    tags: t.tags || [],
    shared: !!t.shared,
    split: !!t.split,
    opposed: !!t.opposed,
    american: t.americanLabel || null,
    clock,
    dateKey,
    dateLabel: formatDayLabel(dateKey, todayKey),
    when: live ? 'Live' : (clock && dateKey && dateKey !== todayKey ? `${formatDayLabel(dateKey, todayKey)} ${clock}` : (clock || formatDayLabel(dateKey, todayKey) || 'Open')),
    live,
    commenceMs: Number.isFinite(Number(t.commenceMs)) ? Number(t.commenceMs) : null,
    sized: !!t.sized,
  };
}

function packClosedLeg(leg, todayKey) {
  const pnl = legDollar(leg);
  const dateKey = legDateKey(leg);
  return {
    id: `${leg.walletShort || ''}|${dateKey || ''}|${leg.gameKey || ''}|${leg.marketType || ''}|${leg.side || ''}|${leg.won}`,
    bucket: 'closed',
    pick: closedPickLabel(leg),
    matchup: ticketMatchup(leg),
    sport: leg.sport || null,
    market: MARKET_LABEL[String(leg.marketType || '').toUpperCase()] || leg.marketType || null,
    invested: Number(leg.invested) || 0,
    pnl: Number.isFinite(pnl) ? Math.round(pnl) : null,
    won: leg.won === 1,
    lost: leg.won === 0,
    tag: fmtWalletTag(leg.walletShort),
    walletShort: shortWalletId(leg.walletShort),
    dateKey,
    dateLabel: formatDayLabel(dateKey, todayKey),
    when: formatDayLabel(dateKey, todayKey) || 'Closed',
  };
}

function groupLedgerItems(items, todayKey) {
  const map = new Map();
  for (const item of items || []) {
    const key = item.dateKey || '—';
    if (!map.has(key)) {
      map.set(key, { dateKey: key, label: item.dateLabel || formatDayLabel(key, todayKey), items: [] });
    }
    map.get(key).items.push(item);
  }
  return [...map.values()];
}

/**
 * Open / upcoming / closed blotter for the whole list.
 * Open = pending money already commenced. Upcoming = later commence. Closed = graded legs.
 */
export function buildDeskLedger({
  actionRows = [],
  recentLegs = [],
  todayKey = null,
  nowMs = Date.now(),
  limitClosed = 40,
} = {}) {
  const today = todayKey || etDateKey(nowMs);
  const board = buildMySharpsBoard(actionRows);
  const open = [];
  const upcoming = [];
  for (const t of board.tickets || []) {
    const item = packLiveTicket(t, nowMs, today);
    if (item.bucket === 'upcoming') upcoming.push(item);
    else open.push(item);
  }
  open.sort((a, b) => (b.invested - a.invested) || ((a.commenceMs || 0) - (b.commenceMs || 0)));
  upcoming.sort((a, b) => ((a.commenceMs || 0) - (b.commenceMs || 0)) || (b.invested - a.invested));

  const closed = (recentLegs || [])
    .filter((leg) => leg?.won === 0 || leg?.won === 1)
    .map((leg) => packClosedLeg(leg, today))
    .sort((a, b) => String(b.dateKey || '').localeCompare(String(a.dateKey || '')))
    .slice(0, limitClosed);

  const sumInv = (list) => list.reduce((s, x) => s + (Number(x.invested) || 0), 0);
  let closedPnl = 0;
  let closedHave = false;
  let closedW = 0;
  let closedL = 0;
  for (const row of closed) {
    if (row.won) closedW += 1;
    if (row.lost) closedL += 1;
    if (Number.isFinite(row.pnl)) {
      closedHave = true;
      closedPnl += row.pnl;
    }
  }

  return {
    open,
    upcoming,
    closed,
    openN: open.length,
    openInvested: sumInv(open),
    upcomingN: upcoming.length,
    upcomingInvested: sumInv(upcoming),
    closedN: closed.length,
    closedW,
    closedL,
    closedPnl: closedHave ? Math.round(closedPnl) : null,
    closedHonest: honestRecord(closedW, closedL),
    groups: {
      open: groupLedgerItems(open, today),
      upcoming: groupLedgerItems(upcoming, today),
      closed: groupLedgerItems(closed, today),
    },
  };
}

function sharpBook(prof) {
  const sports = confirmedSports(prof);
  let pnl = 0;
  let w = 0;
  let l = 0;
  let have = false;
  let best = null;
  const lines = [];
  const sparks = [];
  const roiParts = [];
  for (const sport of sports) {
    const rec = prof?.bySport?.[sport];
    const l30 = l30FromRec(rec);
    const books = marketBooksFromProfile(prof, sport);
    let market = null;
    let marketScore = -Infinity;
    for (const b of books) {
      const score = Number.isFinite(b.l30?.pnl) ? b.l30.pnl : ((b.wins || 0) - (b.losses || 0));
      if (score > marketScore) {
        marketScore = score;
        market = b.label;
      }
    }
    const heat = heatFromForm(formFromRec(rec));
    const sp = Number.isFinite(l30?.pnl) ? l30.pnl : null;
    if (l30) {
      have = true;
      if (sp != null) pnl += sp;
      if (Number.isFinite(l30.wins)) w += l30.wins;
      if (Number.isFinite(l30.losses)) l += l30.losses;
    }
    const line = {
      sport,
      pnl: sp,
      roi: Number.isFinite(l30?.roi) ? l30.roi : null,
      wins: Number.isFinite(l30?.wins) ? l30.wins : null,
      losses: Number.isFinite(l30?.losses) ? l30.losses : null,
      honest: l30 ? honestRecord(l30.wins, l30.losses, l30.wr) : honestRecord(null, null, null),
      market,
      heat,
    };
    lines.push(line);
    const path = sportPath(rec);
    if (path.scope === 'l30' && path.spark) sparks.push(path.spark);
    if (l30 && Number.isFinite(l30.pnl) && Number.isFinite(l30.roi)) {
      roiParts.push({ pnl: l30.pnl, roi: l30.roi });
    }
    const rank = sp != null ? sp : -Infinity;
    if (!best || rank > best.rank) best = { ...line, rank };
  }
  lines.sort((a, b) => (Number(b.pnl) || 0) - (Number(a.pnl) || 0));
  return {
    l30Pnl: have ? pnl : null,
    roi: blendRoi(roiParts),
    wins: w,
    losses: l,
    honest: honestRecord(w, l),
    whereSport: best?.sport || null,
    whereMarket: best?.market || null,
    heat: best?.heat || heatFromForm(null),
    clv: skillFromProfile(prof, null).clv,
    markets: marketBooksFromProfile(prof),
    lines,
    sparks,
  };
}

/** Resample cumulative dollar curves onto one index and add them. */
export function blendDollarCurves(curves, points = 24) {
  const usable = (curves || []).filter((c) => Array.isArray(c) && c.filter((n) => Number.isFinite(Number(n))).length >= 2);
  if (!usable.length || points < 2) return [];
  const out = Array.from({ length: points }, () => 0);
  for (const curve of usable) {
    const pts = curve.map((v) => Number(v)).filter((n) => Number.isFinite(n));
    const last = pts.length - 1;
    for (let i = 0; i < points; i++) {
      const x = (i / (points - 1)) * last;
      const lo = Math.floor(x);
      const hi = Math.min(last, lo + 1);
      const w = x - lo;
      out[i] += pts[lo] * (1 - w) + pts[hi] * w;
    }
  }
  return out.map((n) => Math.round(n));
}

function scopedProfile(prof, sport) {
  if (!sport || sport === 'All' || sport === 'ALL') return prof;
  const rec = prof?.bySport?.[sport];
  if (!rec) return { ...prof, bySport: {} };
  return { ...prof, bySport: { [sport]: rec } };
}

function resultFromLeg(leg, sport) {
  const pnl = legDollar(leg);
  const date = leg?.date || null;
  const won = legWon(leg);
  return {
    id: [sport, date, leg?.gameKey, leg?.marketType, leg?.side, leg?.team].filter(Boolean).join('|'),
    date,
    pick: closedPickLabel({ ...leg, sport: leg?.sport || sport }),
    matchup: ticketMatchup(leg),
    sport: leg?.sport || sport || null,
    market: MARKET_LABEL[String(leg?.marketType || '').toUpperCase()] || leg?.marketType || null,
    won: won === 1,
    lost: won === 0,
    pnl: Number.isFinite(pnl) ? Math.round(pnl) : null,
  };
}

function gradedTape(form) {
  const month = (Array.isArray(form?.recentAction) ? form.recentAction : []).filter((leg) => legWon(leg) != null);
  if (month.length) return { legs: month, scope: 'l30' };
  const older = (Array.isArray(form?.curveLegs) ? form.curveLegs : []).filter((leg) => legWon(leg) != null);
  if (older.length) return { legs: older, scope: 'recent' };
  return { legs: [], scope: null };
}

/**
 * One sharp, opened. Book numbers plus the newest graded Action tickets.
 * `sport` limits the book and the tape to that sport.
 */
export function buildSharpDossier(walletProfiles, walletShort, { sport = 'All', limit = 30 } = {}) {
  const short = normalizeWalletShort(walletShort);
  const prof = scopedProfile(profileFor(walletProfiles, short), sport);
  const book = sharpBook(prof);
  const sports = confirmedSports(prof);
  const results = [];
  const l30Sparks = [];
  const recentSparks = [];
  let recentFrom = null;
  let sawRecent = false;
  for (const sp of sports) {
    const rec = prof?.bySport?.[sp];
    const path = sportPath(rec);
    if (path.spark && path.scope === 'l30') l30Sparks.push(path.spark);
    if (path.spark && path.scope === 'recent') {
      recentSparks.push(path.spark);
      sawRecent = true;
      if (path.from && (!recentFrom || String(path.from) < String(recentFrom))) recentFrom = path.from;
    }
    const tape = gradedTape(rec?.form);
    if (tape.scope === 'recent') sawRecent = true;
    for (const leg of tape.legs) results.push(resultFromLeg(leg, sp));
  }
  results.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')) || String(b.id).localeCompare(String(a.id)));
  const shown = results.slice(0, limit);
  const monthSpark = blendDollarCurves(l30Sparks);
  const olderSpark = blendDollarCurves(recentSparks);
  const spark = monthSpark.length ? monthSpark : olderSpark;
  let resultSpark = [];
  if (!spark.length && shown.some((r) => Number.isFinite(r.pnl))) {
    const chrono = [...shown].reverse();
    let run = 0;
    resultSpark = chrono.map((r) => {
      run += Number(r.pnl) || 0;
      return Math.round(run);
    });
  }
  const sparkScope = monthSpark.length ? 'l30' : (olderSpark.length ? 'recent' : null);
  const drawn = spark.length ? spark : resultSpark;
  return {
    walletShort: short,
    tag: fmtWalletTag(short),
    sport: sport && sport !== 'All' ? sport : null,
    l30Pnl: book.l30Pnl,
    roi: book.roi,
    honest: book.honest,
    clv: book.clv,
    heat: book.heat,
    markets: book.markets || [],
    lines: book.lines || [],
    spark: drawn,
    sparkFrom: spark.length ? 'book' : (resultSpark.length ? 'results' : null),
    sparkScope,
    sparkFromDate: sparkScope === 'recent' ? recentFrom : null,
    pathPnl: sparkScope === 'recent' && drawn.length ? drawn[drawn.length - 1] : null,
    tapeScope: results.length ? (sawRecent && !monthSpark.length ? 'recent' : 'l30') : (sawRecent ? 'recent' : null),
    quietMonth: sawRecent && results.length === 0,
    results: shown,
    resultN: results.length,
  };
}

/** Dollar-weighted ROI. Stake is inferred from pnl and roi on the same window. */
export function blendRoi(parts) {
  let stake = 0;
  let pnl = 0;
  for (const p of parts || []) {
    const roi = Number(p?.roi);
    const d = Number(p?.pnl);
    if (!Number.isFinite(roi) || roi === 0 || !Number.isFinite(d)) continue;
    const s = d / (roi / 100);
    if (!Number.isFinite(s) || s === 0) continue;
    stake += Math.abs(s);
    pnl += d;
  }
  if (!(stake > 0)) return null;
  return Math.round((pnl / stake) * 100);
}

export function americanProfit(stake, american, won) {
  const s = Number(stake);
  const o = Number(american);
  if (!(s > 0) || !Number.isFinite(o) || o === 0) return null;
  if (!won) return -Math.round(s);
  const win = o > 0 ? s * (o / 100) : s * (100 / Math.abs(o));
  return Math.round(win);
}

export function gradeTail(tail, legs, now = Date.now()) {
  if (!tail) return { status: 'open', pnl: null };
  const commence = Number(tail.commenceMs);
  if (Number.isFinite(commence) && now < commence) return { status: 'open', pnl: null };
  const gameDay = Number.isFinite(commence) ? etDateKey(commence) : null;
  const tailedDay = Number.isFinite(Number(tail.tailedAt)) ? etDateKey(Number(tail.tailedAt)) : null;
  const wallets = new Set((tail.wallets || []).map((w) => String(w).toLowerCase()));
  const match = (legs || []).find((leg) => {
    if (leg?.won !== 0 && leg?.won !== 1) return false;
    if (String(leg.gameKey || '').toLowerCase() !== String(tail.gameKey || '').toLowerCase()) return false;
    if (String(leg.marketType || '').toUpperCase() !== String(tail.marketType || '').toUpperCase()) return false;
    if (String(leg.side || '').toLowerCase() !== String(tail.side || '').toLowerCase()) return false;
    const legDay = String(leg.date || '').slice(0, 10);
    if (/^20\d{2}-\d{2}-\d{2}$/.test(legDay)) {
      if (gameDay && legDay !== gameDay) return false;
      if (!gameDay && tailedDay && legDay < tailedDay) return false;
    }
    const w = String(leg.walletShort || '').toLowerCase();
    return wallets.size === 0 || wallets.has(w);
  });
  if (!match) {
    return {
      status: tail.status === 'won' || tail.status === 'lost' ? tail.status : 'open',
      pnl: Number.isFinite(tail.pnl) ? tail.pnl : null,
    };
  }
  const won = match.won === 1;
  const pnl = americanProfit(tail.stake, tail.myAmerican, won);
  return { status: won ? 'won' : 'lost', pnl };
}

export function summarizeTails(tails, legs) {
  const cards = Object.values(tails || {}).map((tail) => {
    const grade = gradeTail(tail, legs);
    return { ...tail, status: grade.status, pnl: grade.pnl };
  }).sort((a, b) => (b.tailedAt || 0) - (a.tailedAt || 0));
  let pnl = 0;
  let have = false;
  let wins = 0;
  let losses = 0;
  let openN = 0;
  for (const c of cards) {
    if (c.status === 'won') wins += 1;
    else if (c.status === 'lost') losses += 1;
    else openN += 1;
    if ((c.status === 'won' || c.status === 'lost') && Number.isFinite(c.pnl)) {
      have = true;
      pnl += c.pnl;
    }
  }
  return {
    cards,
    pnl: have ? pnl : null,
    wins,
    losses,
    openN,
    honest: honestRecord(wins, losses),
  };
}

function sumInvested(list) {
  return (list || []).reduce((s, t) => s + (Number(t.invested) || 0), 0);
}

function clusterCount(list) {
  return new Set((list || []).map((t) => `${t.sport}|${t.gameKey}|${t.marketType}`)).size;
}

export function buildPortfolioSnapshot({ holdings = [], tickets = [], tails = {}, legs = [] } = {}) {
  let pnl = 0;
  let have = false;
  let w = 0;
  let l = 0;
  const roiParts = [];
  for (const h of holdings || []) {
    if (Number.isFinite(h.l30Pnl)) {
      have = true;
      pnl += h.l30Pnl;
    }
    w += Number(h.wins) || 0;
    l += Number(h.losses) || 0;
    if (Number.isFinite(h.l30Pnl) && Number.isFinite(h.roi)) {
      roiParts.push({ pnl: h.l30Pnl, roi: h.roi });
    }
  }
  const together = (tickets || []).filter((t) => t.shared && !t.split);
  const split = (tickets || []).filter((t) => t.split);
  return {
    l30: have ? { pnl, roi: blendRoi(roiParts), honest: honestRecord(w, l) } : { pnl: null, roi: null, honest: honestRecord(null, null) },
    tails: summarizeTails(tails, legs),
    together: { n: together.length, invested: sumInvested(together) },
    split: { n: clusterCount(split), invested: sumInvested(split) },
    open: { n: (tickets || []).length, invested: sumInvested(tickets) },
  };
}

export function suggestTailStake(ticket, walletProfiles) {
  const rows = [...(ticket?.rows || [])].sort((a, b) => (Number(b.invested) || 0) - (Number(a.invested) || 0));
  const short = rows[0]?.walletShort || ticket?.shorts?.[0];
  const usual = sportUsualBetFromProfile(profileFor(walletProfiles, short), ticket?.sport);
  if (Number.isFinite(usual) && usual > 0) return Math.round(usual);
  return null;
}

export function groupPortfolioBets(tickets, { names = {}, tails = {}, walletProfiles = null } = {}) {
  const made = (tickets || []).map((t) => {
    const who = considerWho(t, names);
    const ratio = Number(t.maxRatio);
    return {
      ...t,
      pick: ticketPickLabel(t),
      matchup: ticketMatchup(t),
      who: who.text,
      whoOpposed: who.opposed,
      sizeText: Number.isFinite(ratio) && ratio >= SIZED_UP_RATIO ? `${ratio.toFixed(1)}×` : null,
      tail: tails[t.id] || null,
      walletLines: walletLinesFor(t, names, walletProfiles),
    };
  });
  const clusters = new Map();
  for (const item of made) {
    const ck = `${item.sport}|${item.gameKey}|${item.marketType}`;
    if (!clusters.has(ck)) clusters.set(ck, []);
    clusters.get(ck).push(item);
  }
  for (const item of made) {
    const ck = `${item.sport}|${item.gameKey}|${item.marketType}`;
    const sibs = (clusters.get(ck) || []).filter((s) => s.id !== item.id);
    if (sibs.length) {
      item.otherSide = sibs.map((s) => ({
        pick: s.pick,
        tags: (s.walletLines || []).map((l) => l.tag).filter(Boolean),
      }));
    } else if (item.split && (item.oppShorts || []).length) {
      item.otherSide = [{
        pick: null,
        tags: item.oppShorts.map((s) => names[s] || fmtWalletTag(s)),
      }];
    } else {
      item.otherSide = [];
    }
  }
  const together = [];
  const pressing = [];
  const split = [];
  const rest = [];
  for (const item of made) {
    if (item.split) split.push(item);
    else if (item.shared) together.push(item);
    else if (item.sizeText) pressing.push(item);
    else rest.push(item);
  }
  const bySize = (a, b) => (b.invested || 0) - (a.invested || 0);
  together.sort(bySize);
  pressing.sort(bySize);
  split.sort(bySize);
  rest.sort(bySize);
  return { together, pressing, split, rest };
}

function findSlice(prof, { sport, market, window }) {
  const confirmed = confirmedSports(prof);
  const all = confirmed.length ? confirmed : Object.keys(prof?.bySport || {});
  const pool = sport && sport !== 'All' ? all.filter((s) => s === sport) : all;
  let best = null;
  const rank = (card) => (Number.isFinite(card?.roi) ? card.roi : -9999);
  for (const sp of pool) {
    const rec = prof?.bySport?.[sp];
    if (!rec) continue;
    if (market && market !== 'All') {
      const mRec = rec.byMarket?.[market];
      const l30 = l30FromRec(mRec);
      const packed = packBook(mRec?.positions) || packBook(mRec?.picks);
      if (window === 'l30') {
        if (!l30 || !(l30.n > 0)) continue;
        const card = {
          sport: sp,
          market,
          marketLabel: MARKET_LABEL[market] || market,
          n: l30.n,
          wins: l30.wins,
          losses: l30.losses,
          wr: l30.wr,
          roi: l30.roi,
          pnl: l30.pnl,
          window: 'l30',
        };
        if (!best || rank(card) > rank(best)) best = card;
      } else if (packed && packed.n >= 2) {
        const card = {
          sport: sp,
          market,
          marketLabel: MARKET_LABEL[market] || market,
          n: packed.n,
          wins: packed.wins,
          losses: packed.losses,
          wr: packed.wr,
          roi: packed.roi,
          pnl: null,
          window: 'book',
        };
        if (!best || rank(card) > rank(best)) best = card;
      }
      continue;
    }
    const markets = marketBooksFromProfile(prof, sp);
    const top = [...markets].sort((a, b) => (Number(b.roi) || -9999) - (Number(a.roi) || -9999))[0];
    if (window === 'l30') {
      const l30 = l30FromRec(rec);
      if (!l30 || !(l30.n > 0)) continue;
      const card = {
        sport: sp,
        market: top?.market || null,
        marketLabel: top?.label || null,
        n: l30.n,
        wins: l30.wins,
        losses: l30.losses,
        wr: l30.wr,
        roi: l30.roi,
        pnl: l30.pnl,
        window: 'l30',
      };
      if (!best || rank(card) > rank(best)) best = card;
    } else {
      const packed = packBook(rec.positions) || packBook(rec.picks);
      if (!packed || packed.n < 2) continue;
      const card = {
        sport: sp,
        market: top?.market || null,
        marketLabel: top?.label || null,
        n: packed.n,
        wins: packed.wins,
        losses: packed.losses,
        wr: packed.wr,
        roi: packed.roi,
        pnl: null,
        window: 'book',
      };
      if (!best || rank(card) > rank(best)) best = card;
    }
  }
  return best;
}

/**
 * Wallets the customer does not have yet, scored on one sport slice.
 * Window `l30` only includes a 30-day book. `book` is the longer record.
 */
export function buildFindCandidates(walletProfiles, {
  exclude = [],
  sport = 'All',
  market = 'All',
  window = 'book',
  minBets = 0,
  minRoi = null,
  limit = 60,
  sort = 'roi',
} = {}) {
  const skip = new Set((exclude || []).map((s) => String(s || '').toLowerCase()));
  const seen = new Set();
  const rows = [];
  const entries = walletProfiles && typeof walletProfiles.entries === 'function'
    ? walletProfiles.entries()
    : Object.entries(walletProfiles || {});
  for (const [key, prof] of entries) {
    const short = normalizeWalletShort(prof?.walletShort || key);
    if (!short || skip.has(short) || seen.has(short)) continue;
    seen.add(short);
    const slice = findSlice(prof, { sport, market, window });
    if (!slice) continue;
    if ((Number(slice.n) || 0) < (Number(minBets) || 0)) continue;
    if (minRoi != null && minRoi !== '' && Number.isFinite(Number(minRoi))) {
      if (!Number.isFinite(slice.roi) || slice.roi < Number(minRoi)) continue;
    }
    const { clv } = skillFromProfile(prof, prof?.bySport?.[slice.sport]);
    const usual = sportUsualBetFromProfile(prof, slice.sport);
    rows.push({
      walletShort: short,
      tag: fmtWalletTag(short),
      ...slice,
      honest: honestRecord(slice.wins, slice.losses, slice.wr),
      clv,
      usual: Number.isFinite(usual) && usual > 0 ? Math.round(usual) : null,
      heat: heatFromForm(formFromRec(prof?.bySport?.[slice.sport])),
    });
  }
  const byRoi = (a, b) => (Number(b.roi) || -9999) - (Number(a.roi) || -9999) || ((b.n || 0) - (a.n || 0));
  const rankers = {
    roi: byRoi,
    close: (a, b) => (Number(b.clv?.pctPos) || -1) - (Number(a.clv?.pctPos) || -1) || byRoi(a, b),
    bets: (a, b) => (b.n || 0) - (a.n || 0) || byRoi(a, b),
    size: (a, b) => (Number(b.usual) || 0) - (Number(a.usual) || 0) || byRoi(a, b),
  };
  rows.sort(rankers[sort] || byRoi);
  return { total: rows.length, rows: rows.slice(0, limit) };
}

function marketRollup(holdings) {
  const by = new Map();
  for (const h of holdings || []) {
    for (const m of h.markets || []) {
      const key = m.label || m.market || 'Market';
      const cur = by.get(key) || {
        label: key, n: 0, wins: 0, losses: 0, pnl: 0, havePnl: false, roiN: 0, roiSum: 0,
      };
      cur.n += Number(m.n) || 0;
      cur.wins += Number(m.wins) || 0;
      cur.losses += Number(m.losses) || 0;
      if (Number.isFinite(m.l30?.pnl)) {
        cur.havePnl = true;
        cur.pnl += m.l30.pnl;
      }
      if (Number.isFinite(m.roi) && Number(m.n) > 0) {
        cur.roiN += Number(m.n);
        cur.roiSum += m.roi * Number(m.n);
      }
      by.set(key, cur);
    }
  }
  return [...by.values()].map((row) => ({
    label: row.label,
    n: row.n,
    wins: row.wins,
    losses: row.losses,
    pnl: row.havePnl ? Math.round(row.pnl) : null,
    roi: row.roiN > 0 ? Math.round(row.roiSum / row.roiN) : null,
    honest: honestRecord(row.wins, row.losses),
  })).sort((a, b) => (Number(b.pnl) || 0) - (Number(a.pnl) || 0) || (b.n || 0) - (a.n || 0));
}

/**
 * The portfolio instrument. The path ends on the same 30-day total as the hero.
 * A short book is drawn as the last step so the headline is one number.
 */
export function buildPortfolioStage(holdings) {
  const rows = holdings || [];
  const curves = rows.map((h) => h.spark).filter((c) => Array.isArray(c) && c.length >= 2);
  const path = [];
  if (curves.length) {
    const n = Math.max(...curves.map((c) => c.length));
    for (let i = 0; i < n; i += 1) {
      path.push(curves.reduce((s, c) => {
        const idx = Math.round((i / (n - 1)) * (c.length - 1));
        return s + (Number(c[idx]) || 0);
      }, 0));
    }
  }
  let bookPnl = 0;
  let have = false;
  let w = 0;
  let l = 0;
  const roiParts = [];
  for (const h of rows) {
    if (Number.isFinite(h.l30Pnl)) {
      have = true;
      bookPnl += h.l30Pnl;
      if (Number.isFinite(h.roi)) roiParts.push({ pnl: h.l30Pnl, roi: h.roi });
    }
    w += Number(h.wins) || 0;
    l += Number(h.losses) || 0;
  }
  const total = have ? Math.round(bookPnl) : null;
  const drawn = path.map((n) => Math.round(n));
  if (drawn.length && total != null) drawn[drawn.length - 1] = total;
  const sports = new Map();
  for (const h of rows) {
    for (const line of h.lines || []) {
      if (!line.sport || !Number.isFinite(line.pnl)) continue;
      const cur = sports.get(line.sport) || { sport: line.sport, pnl: 0, wins: 0, losses: 0 };
      cur.pnl += line.pnl;
      cur.wins += Number(line.wins) || 0;
      cur.losses += Number(line.losses) || 0;
      sports.set(line.sport, cur);
    }
  }
  const sportRows = [...sports.values()]
    .map((row) => ({
      ...row,
      pnl: Math.round(row.pnl),
      honest: honestRecord(row.wins, row.losses),
    }))
    .sort((a, b) => b.pnl - a.pnl);
  const sharps = rows
    .filter((h) => Number.isFinite(h.l30Pnl))
    .map((h) => ({
      walletShort: h.walletShort,
      name: h.name || h.tag,
      tag: h.tag,
      pnl: h.l30Pnl,
      roi: Number.isFinite(h.roi) ? h.roi : null,
      honest: h.honest,
      heat: h.heat,
      spark: Array.isArray(h.spark) && h.spark.length >= 2 ? h.spark : null,
    }));
  return {
    path: drawn,
    pathEnd: drawn.length ? drawn[drawn.length - 1] : total,
    bookPnl: total,
    uncharted: null,
    roi: blendRoi(roiParts),
    honest: honestRecord(w, l),
    sharps,
    sports: sportRows,
    markets: marketRollup(rows),
  };
}

/**
 * One row per sharp. Last 30 days is every confirmed sport, not the first.
 * Sorted by that dollar, so the table reads like the hero.
 */
export function buildDeskHoldings({ roster = [], walletProfiles = null } = {}) {
  const rows = (roster || []).map((m) => {
    const book = sharpBook(profileFor(walletProfiles, m.walletShort));
    const where = [book.whereSport, book.whereMarket].filter(Boolean).join(' · ');
    return {
      walletShort: m.walletShort,
      name: m.name || null,
      tag: m.tag || fmtWalletTag(m.walletShort),
      l30Pnl: book.l30Pnl,
      roi: book.roi,
      wins: book.wins || 0,
      losses: book.losses || 0,
      clv: book.clv,
      honest: book.honest,
      where: where || null,
      whereSport: book.whereSport,
      whereMarket: book.whereMarket,
      heat: book.heat,
      openN: m.openN || 0,
      openInvested: m.openInvested || 0,
      betsOff: Array.isArray(m.betsOff) ? m.betsOff : [],
      lines: book.lines,
      markets: book.markets || [],
      spark: blendDollarCurves(book.sparks),
    };
  });
  rows.sort((a, b) => {
    const ap = Number.isFinite(a.l30Pnl) ? a.l30Pnl : -Infinity;
    const bp = Number.isFinite(b.l30Pnl) ? b.l30Pnl : -Infinity;
    if (bp !== ap) return bp - ap;
    return (b.openInvested || 0) - (a.openInvested || 0);
  });
  return rows;
}

function marketKeyOf(market) {
  let m = String(market || '').trim().toUpperCase();
  if (m === 'MONEYLINE') m = 'ML';
  if (m === 'SPREADS') m = 'SPREAD';
  if (m === 'TOTALS') m = 'TOTAL';
  return m;
}

function steamStamp(row) {
  const s = row?.steam;
  if (!s?.show) return null;
  return {
    show: true,
    tier: s.tier || null,
    goldConfirmed: !!s.goldConfirmed,
    tag: s.tag || null,
  };
}

/**
 * Receipt for one sharp on this sport and this market.
 * Book return stays off until the sample can carry a percent.
 * Steam is copied from the row, never recomputed.
 */
export function sharpFaceFromProfile(prof, { sport = null, market = null } = {}) {
  const rec = sport ? prof?.bySport?.[sport] : null;
  const heat = heatFromForm(rec?.form);
  const mkt = marketKeyOf(market);
  const mRec = mkt ? rec?.byMarket?.[mkt] : null;
  const packed = packBook(mRec?.positions) || packBook(mRec?.picks);
  const honest = packed ? honestRecord(packed.wins, packed.losses, packed.wr) : null;
  const marketL30 = l30FromRec(mRec);
  const sportL30 = l30FromRec(rec);
  const usual = sportUsualBetFromProfile(prof, sport);
  const showBookPct = !!(honest?.showPct && Number.isFinite(packed?.roi));
  return {
    heat: heat?.record && heat.key !== 'quiet' ? heat : null,
    book: packed ? {
      label: MARKET_LABEL[mkt] || mkt,
      record: honest?.record || null,
      roi: showBookPct ? packed.roi : null,
      n: packed.n,
      wins: packed.wins,
      losses: packed.losses,
    } : null,
    marketL30: Number.isFinite(marketL30?.pnl) ? marketL30.pnl : null,
    market: marketL30 ? {
      n: marketL30.n,
      wins: marketL30.wins,
      losses: marketL30.losses,
      pnl: marketL30.pnl,
      roi: marketL30.roi,
    } : null,
    sportL30: Number.isFinite(sportL30?.pnl) ? sportL30.pnl : null,
    usual: Number.isFinite(usual) && usual > 0 ? Math.round(usual) : null,
  };
}

function walletLinesFor(ticket, names, walletProfiles) {
  return [...(ticket?.rows || [])].map((r) => {
    const short = shortWalletId(r?.walletShort) || normalizeWalletShort(r?.walletShort);
    const named = short && names?.[short];
    const ratio = Number(r?.displaySizeRatio ?? r?.sizeRatio);
    const face = sharpFaceFromProfile(profileFor(walletProfiles, short), {
      sport: ticket?.sport || r?.sport,
      market: ticket?.marketType || r?.marketType,
    });
    return {
      walletShort: short,
      tag: named || fmtWalletTag(short),
      invested: Number(r?.invested) || 0,
      ratio: Number.isFinite(ratio) && ratio > 0 ? ratio : null,
      price: r?.americanLabel || null,
      steam: steamStamp(r),
      ...face,
    };
  }).sort((a, b) => (b.invested || 0) - (a.invested || 0));
}

function considerWho(item, names) {
  if (item.split) return { text: 'Opposed', opposed: true };
  const walletN = item.walletN || (item.shorts || []).length;
  if (walletN > 1) return { text: `${walletN} on the list`, opposed: false };
  const id = item.shorts?.[0] || item.walletShort;
  const named = id && names?.[id];
  return { text: named || item.tag || fmtWalletTag(id), opposed: false };
}

/**
 * Tonight's slate first (shared tickets, then kick, then size).
 * The rest is later slates, then graded. One blotter, two depths.
 */
export function buildConsiderRows(ledger, { names = {}, focusShort = null } = {}) {
  const focus = focusShort ? String(focusShort).toLowerCase() : null;
  const belongs = (item) => {
    if (!focus) return true;
    if (item.walletShort && String(item.walletShort).toLowerCase() === focus) return true;
    return (item.shorts || []).some((s) => String(s).toLowerCase() === focus);
  };
  const mapItem = (item) => {
    const who = considerWho(item, names);
    return { ...item, who: who.text, whoOpposed: who.opposed };
  };
  const slate = (ledger?.open || []).filter(belongs).map(mapItem);
  slate.sort((a, b) => {
    const as = a.shared && !a.split ? 0 : 1;
    const bs = b.shared && !b.split ? 0 : 1;
    if (as !== bs) return as - bs;
    const at = Number.isFinite(a.commenceMs) ? a.commenceMs : Infinity;
    const bt = Number.isFinite(b.commenceMs) ? b.commenceMs : Infinity;
    if (at !== bt) return at - bt;
    return (b.invested || 0) - (a.invested || 0);
  });
  const later = (ledger?.upcoming || []).filter(belongs).map(mapItem);
  const closed = (ledger?.closed || []).filter(belongs).map(mapItem);
  return { slate, later, closed };
}

export function gainsSplit(legs, short) {
  const id = short ? String(short).toLowerCase() : null;
  let gains = 0;
  let losses = 0;
  let have = false;
  for (const leg of legs || []) {
    if (id && String(leg?.walletShort || '').toLowerCase() !== id) continue;
    const d = legDollar(leg);
    if (!Number.isFinite(d) || d === 0) continue;
    have = true;
    if (d > 0) gains += d;
    else losses += Math.abs(d);
  }
  return {
    gains: have ? Math.round(gains) : null,
    losses: have ? Math.round(losses) : null,
  };
}
