/**
 * My Sharps desk — who to tail.
 * Heat + sport×market books + a lean. Display only. Does not change lock math.
 */
import { CLV_SKILL_MIN_N, shortWalletId } from './walletClvSkill.js';
import { sportBookForDisplay } from './walletSportBook.js';
import { SIZED_UP_RATIO, fmtWalletTag, listMySharps } from './mySharps.js';

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

function formFromRec(rec) {
  const form = rec?.form;
  if (!form) return { actionL5: null, actionL10: null, l5: null, l10: null };
  return {
    actionL5: form.actionL5 || null,
    actionL10: form.actionL10 || null,
    l5: form.l5 || null,
    l10: form.l10 || null,
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
