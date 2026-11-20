/**
 * Trusted list. From 2026-11-20.
 *
 * Every morning each wallet gets one score per market, from graded bets
 * dated before that morning. The score has two parts, both in points of
 * edge per bet.
 *
 * Price. How far the Pinnacle fair line moved toward the wallet after it
 * was first seen, with the situation taken out: the average move for that
 * market, that first-sight edge, and that price. Learned on moneylines and
 * spreads in every sport, counted from 8 taped bets, at half weight at 25.
 * Each market then scales it by how much of it has shown up in that
 * market's own line moves so far.
 *
 * Results. The wallet's win rate against its own prices in this market,
 * minus the market's average wallet, kept in proportion to how much
 * lasting wallet-to-wallet spread the market has shown so far.
 *
 * A wallet is rated at 8 bets in the market, or a kept price read. Its
 * standing is the share of scores on earlier rated NHL, NBA, NFL, and
 * CFB bets in that market that sit below it. Standing of 0.80 or more is
 * trusted. The standing needs 300 earlier scores.
 *
 * One bet is one wallet, game, and market: the largest ticket. A copy of
 * the same side and line is dropped. Wins and losses only. The same two
 * teams more than a day apart are two games.
 *
 * To count on a side a trusted wallet also has to be profitable there:
 * 10 or more graded bets in that sport and that market before the
 * morning, and up in units on them at 1 unit a bet at its own prices.
 * The line read alone let a losing wallet onto the moneyline list.
 *
 * A side's count is the trusted wallets on it minus the trusted wallets
 * on the other side. A wallet on both sides counts on its larger ticket.
 *
 * Moneylines read the list in every sport. Spreads read it on NBA, NFL,
 * and CFB. The totals list lost to its own prices on the test, so no
 * totals stake reads it. The totals count is stamped for the record only.
 */

export const TRUSTED_LIST_FROM = '2026-11-20';
export const TRUSTED_LIST_VERSION = 2;
export const TRUSTED_LIST_BAR = 0.8;
export const TRUSTED_LIST_MIN_PRIOR = 300;
/** Graded bets in the sport and market before a trusted wallet counts there. */
export const TRUSTED_SPORT_MIN_BETS = 10;
export const TRUSTED_LIST_MARKETS = Object.freeze(['ML', 'SPREAD', 'TOTAL']);
export const TRUSTED_LIST_SPORTS = Object.freeze(['NHL', 'NBA', 'NFL', 'CFB']);

const LINE_MARKETS = new Set(['ML', 'SPREAD']);
const STANDING_SPORTS = new Set(TRUSTED_LIST_SPORTS);
const HALF_WEIGHT = 25;
const MIN_BETS = 8;
const RESULT_MIN_BETS = 5;
const SLOPE_MIN = 500;
const SLOPE_DEFAULT = 0.8;
const SLOPE_MAX = 1.2;

let listIndex = new Map();

export function isTrustedListLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= TRUSTED_LIST_FROM;
}

export function setTrustedList(index) {
  listIndex = index instanceof Map ? index : new Map();
}

export function trustedListIndex() {
  return listIndex;
}

/** False when this morning's list did not build. An empty list is not a list. */
export function trustedListReady(list = null) {
  const index = list instanceof Map ? list : listIndex;
  return index.size > 0;
}

export function normTrustedSport(sport) {
  const u = String(sport || '').toUpperCase();
  if (u === 'NCAAF' || u === 'NCAAFB') return 'CFB';
  if (u === 'NCAAB' || u === 'NCAAMB') return 'CBB';
  return u;
}

export function normTrustedMarket(market) {
  const u = String(market || '').toUpperCase();
  if (u === 'ML' || u === 'MONEYLINE' || u === 'H2H') return 'ML';
  if (u.includes('SPREAD')) return 'SPREAD';
  if (u.includes('TOTAL')) return 'TOTAL';
  return u;
}

/** NHL, NBA, NFL, CFB: the sports whose scores set the standing. */
export function trustedListSport(sport) {
  return STANDING_SPORTS.has(normTrustedSport(sport));
}

export function trustedWalletId(row) {
  return String(row?.walletShort || row?.wallet || '').slice(-6).toLowerCase();
}

function listKey(market, wallet) {
  return `${market}|${wallet}`;
}

function num(v) {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

function americanToProb(a) {
  if (a == null || !Number.isFinite(a) || a === 0) return null;
  return a < 0 ? -a / (-a + 100) : 100 / (a + 100);
}

function byDate(a, b) {
  if (a.date < b.date) return -1;
  if (a.date > b.date) return 1;
  return 0;
}

function dayNumber(date) {
  const t = Date.parse(`${String(date).slice(0, 10)}T00:00:00Z`);
  return Number.isFinite(t) ? Math.round(t / 86400000) : null;
}

/**
 * Graded position rows to bets. Rows need wallet, date, sport, marketType,
 * gameKey, side, avgPrice, invested, result, and ticketTapeLog. With
 * `asOf`, a row dated that morning or later is not read at all, so a
 * later ticket cannot change which earlier ticket is kept.
 */
export function trustedListBets(rows, asOf = null) {
  const raw = [];
  const cut = typeof asOf === 'string' && asOf.length >= 10 ? asOf : null;
  for (const d of rows || []) {
    if (!d || d.postponed === true) continue;
    if (cut && String(d.date || '') >= cut) continue;
    const r = String(d.result || '').toUpperCase();
    const won = r === 'WIN' ? 1 : r === 'LOSS' ? 0 : null;
    if (won == null) continue;
    const price = Number(d.avgPrice);
    if (!(price > 0 && price < 1)) continue;
    const invested = Number(d.invested);
    if (!(invested > 0)) continue;
    const wallet = String(d.wallet || '').toLowerCase();
    const gameKey = String(d.gameKey || '').toLowerCase();
    if (!wallet || !gameKey) continue;
    const market = normTrustedMarket(d.marketType);
    const line = market === 'SPREAD'
      ? num(d.spreadLine) ?? num(d.entryLine)
      : market === 'TOTAL' ? num(d.totalLine) ?? num(d.entryLine) : null;
    let p0 = null;
    let fair0 = null;
    let h0 = null;
    let fairC = null;
    let hC = null;
    const log = Array.isArray(d.ticketTapeLog) ? d.ticketTapeLog : null;
    if (log) {
      const first = log.find((g) => g && g.gate === 'first');
      if (first) {
        h0 = num(first.hoursOut);
        p0 = americanToProb(num(first.offer));
        if (h0 != null && h0 > 0) fair0 = americanToProb(num(first.fair));
      }
      let best = null;
      for (const g of log) {
        if (!g) continue;
        const h = num(g.hoursOut);
        const fp = americanToProb(num(g.fair));
        if (h == null || h <= 0 || fp == null || g.gate === 'grade') continue;
        if (!best || h < best.h) best = { h, fp };
      }
      if (best) {
        fairC = best.fp;
        hC = best.h;
      }
    }
    const u = String(d.sport || '').toUpperCase();
    raw.push({
      id: d._id ?? d.id ?? null,
      date: String(d.date || ''),
      sport: u === 'NCAAF' || u === 'NCAAFB' ? 'CFB' : u,
      market,
      wallet,
      w6: String(d.walletShort || wallet).slice(-6).toLowerCase(),
      gameKey,
      side: String(d.side || '').toLowerCase(),
      line,
      price,
      won,
      invested,
      p0,
      fair0,
      h0,
      fairC,
      hC,
    });
  }
  raw.sort((a, b) => byDate(a, b) || b.invested - a.invested);
  // One wallet, matchup, and market, in date order. A gap of more than a
  // day starts a new game: the same teams met again.
  const matchups = new Map();
  for (const r of raw) {
    const k = [r.wallet, r.sport, r.gameKey, r.market].join('|');
    if (!matchups.has(k)) matchups.set(k, []);
    matchups.get(k).push(r);
  }
  const bets = [];
  for (const list of matchups.values()) {
    let game = [];
    let last = null;
    const close = () => {
      if (!game.length) return;
      const seen = new Map();
      for (const r of game) {
        const k = `${r.side}|${r.line ?? ''}`;
        if (!seen.has(k)) seen.set(k, r);
      }
      const kept = [...seen.values()];
      kept.sort((a, b) => b.invested - a.invested || (a.date < b.date ? -1 : 1));
      bets.push(kept[0]);
      game = [];
    };
    for (const r of list) {
      const day = dayNumber(r.date);
      if (last != null && day != null && day - last > 1) close();
      game.push(r);
      if (day != null) last = day;
    }
    close();
  }
  const out = bets.filter((b) => TRUSTED_LIST_MARKETS.includes(b.market));
  for (const b of out) {
    b.tape = b.fairC != null && b.fair0 != null && b.p0 != null && b.h0 > 0 && b.hC < b.h0;
    if (b.tape) {
      b.lead = b.fairC - b.fair0;
      b.ev0 = b.fair0 - b.p0;
    }
  }
  out.sort((a, b) => byDate(a, b) || (a.gameKey < b.gameKey ? -1 : 1));
  return out;
}

function edgeBand(b) {
  if (b.ev0 < -0.03) return 0;
  if (b.ev0 < -0.015) return 1;
  if (b.ev0 < -0.005) return 2;
  if (b.ev0 < 0.005) return 3;
  if (b.ev0 < 0.015) return 4;
  if (b.ev0 < 0.03) return 5;
  return 6;
}

function fairBand(b) {
  if (b.fair0 < 0.3) return 0;
  if (b.fair0 < 0.45) return 1;
  if (b.fair0 < 0.55) return 2;
  if (b.fair0 < 0.7) return 3;
  return 4;
}

/**
 * Lasting wallet-to-wallet spread in results. Each wallet's edge is
 * S / n with luck variance V / n². Returns the best-fit mean and spread.
 */
export function fitResultSpread(wallets, minN = RESULT_MIN_BETS) {
  const rows = [];
  for (const w of wallets) {
    if (w.n >= minN) rows.push({ e: w.S / w.n, s2: w.V / (w.n * w.n) });
  }
  if (rows.length < 8) return null;
  const at = (tau) => {
    const t2 = tau * tau;
    let sw = 0;
    let swe = 0;
    for (const r of rows) {
      const w = 1 / (t2 + r.s2);
      sw += w;
      swe += w * r.e;
    }
    const mu = swe / sw;
    let L = 0;
    for (const r of rows) {
      const v = t2 + r.s2;
      L += -0.5 * (Math.log(v) + ((r.e - mu) * (r.e - mu)) / v);
    }
    return { L, mu };
  };
  let best = { tau: 0, ...at(0) };
  for (let tau = 0.001; tau <= 0.2; tau += 0.001) {
    const r = at(tau);
    if (r.L > best.L) best = { tau, ...r };
  }
  return { tau: best.tau, mu: best.mu };
}

function below(sorted, v) {
  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] < v) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function keptLine(w) {
  if (!w || w.n < MIN_BETS) return null;
  return (w.sum / w.n) * (w.n / (w.n + HALF_WEIGHT));
}

function newState() {
  const state = {
    cells: new Map(), line: new Map(), ids: new Map(), sport: new Map(), rec: {}, slope: {}, prior: {},
  };
  for (const m of TRUSTED_LIST_MARKETS) {
    state.rec[m] = new Map();
    state.slope[m] = { sxx: 0, sxy: 0, n: 0 };
    state.prior[m] = [];
  }
  return state;
}

/** A wallet's record in one sport and market: bets, and units at 1 unit a bet. */
function sportRecord(state, wallet, market, sport) {
  return state.sport.get(wallet)?.get(`${market}|${sport}`) || null;
}

function profitableRecord(r) {
  return !!r && r.n >= TRUSTED_SPORT_MIN_BETS && r.u > 0;
}

/** The sports where this wallet is profitable in this market, sorted. */
function profitableSports(state, wallet, market) {
  const out = [];
  for (const [key, r] of state.sport.get(wallet) || []) {
    const [m, sport] = key.split('|');
    if (m === market && profitableRecord(r)) out.push(sport);
  }
  return out.sort();
}

function morningParams(state) {
  const par = {};
  for (const m of TRUSTED_LIST_MARKETS) {
    const fit = fitResultSpread([...state.rec[m].values()]);
    const s = state.slope[m];
    par[m] = {
      tau: fit ? fit.tau : 0,
      mu: fit ? fit.mu : 0,
      k: s.n >= SLOPE_MIN && s.sxx > 0
        ? Math.max(0, Math.min(SLOPE_MAX, s.sxy / s.sxx))
        : SLOPE_DEFAULT,
      sorted: [...state.prior[m]].sort((a, b) => a - b),
    };
  }
  return par;
}

function scoreWallet(state, par, wallet, market) {
  const r = state.rec[market].get(wallet);
  const kl = keptLine(state.line.get(wallet));
  const p = par[market];
  let results = 0;
  if (r && r.n >= RESULT_MIN_BETS && p.tau > 0) {
    const s2 = r.V / (r.n * r.n);
    results = ((p.tau * p.tau) / (p.tau * p.tau + s2)) * (r.S / r.n - p.mu);
  }
  const price = kl == null ? 0 : p.k * kl;
  const score = results + price;
  const rated = !!((r && r.n >= MIN_BETS) || kl != null);
  const have = p.sorted.length;
  const standing = have >= TRUSTED_LIST_MIN_PRIOR ? below(p.sorted, score) / have : null;
  return {
    score,
    price,
    results,
    rated,
    n: r ? r.n : 0,
    kl,
    standing,
    trusted: rated && standing != null && standing >= TRUSTED_LIST_BAR,
  };
}

/** One day's bets, scored on that morning, then added to the books. */
function absorbDay(state, par, todays, onBet) {
  const scores = [];
  for (const b of todays) {
    const sc = scoreWallet(state, par, b.wallet, b.market);
    b.kl = sc.kl;
    if (b.tape) {
      const c = state.cells.get(`${b.market}|${edgeBand(b)}|${fairBand(b)}`);
      b.resid = b.lead - (c ? c.sum / (c.n + 20) : 0);
    }
    if (STANDING_SPORTS.has(b.sport) && sc.rated) scores.push([b.market, sc.score]);
    if (onBet) onBet(b, sc, sportRecord(state, b.wallet, b.market, normTrustedSport(b.sport)));
  }
  for (const [m, s] of scores) state.prior[m].push(s);
  for (const b of todays) {
    if (b.tape) {
      const k = `${b.market}|${edgeBand(b)}|${fairBand(b)}`;
      const c = state.cells.get(k) || { n: 0, sum: 0 };
      c.n += 1;
      c.sum += b.lead;
      state.cells.set(k, c);
      if (b.kl != null) {
        const s = state.slope[b.market];
        s.n += 1;
        s.sxx += b.kl * b.kl;
        s.sxy += b.kl * b.resid;
      }
      if (LINE_MARKETS.has(b.market)) {
        const w = state.line.get(b.wallet) || { n: 0, sum: 0 };
        w.n += 1;
        w.sum += b.resid;
        state.line.set(b.wallet, w);
      }
    }
    state.ids.set(b.wallet, b.w6);
    const r = state.rec[b.market].get(b.wallet) || { n: 0, S: 0, V: 0 };
    r.n += 1;
    r.S += b.won - b.price;
    r.V += b.price * (1 - b.price);
    state.rec[b.market].set(b.wallet, r);
    if (!state.sport.has(b.wallet)) state.sport.set(b.wallet, new Map());
    const sk = `${b.market}|${normTrustedSport(b.sport)}`;
    const sr = state.sport.get(b.wallet).get(sk) || { n: 0, u: 0 };
    sr.n += 1;
    sr.u += b.won ? (1 - b.price) / b.price : -1;
    state.sport.get(b.wallet).set(sk, sr);
  }
}

function walk(bets, asOf, onBet) {
  const state = newState();
  let i = 0;
  while (i < bets.length) {
    const date = bets[i].date;
    if (asOf && date >= asOf) break;
    let j = i;
    while (j < bets.length && bets[j].date === date) j += 1;
    absorbDay(state, morningParams(state), bets.slice(i, j), onBet);
    i = j;
  }
  return state;
}

/**
 * Every bet with the score its wallet carried that morning. For research
 * and for checking the morning list against the walk.
 */
export function scoreTrustedListBets(rows) {
  const bets = trustedListBets(rows);
  const out = [];
  walk(bets, null, (b, sc, sr) => {
    out.push({
      id: b.id,
      date: b.date,
      sport: b.sport,
      market: b.market,
      wallet: b.wallet,
      w6: b.w6,
      gameKey: b.gameKey,
      side: b.side,
      won: b.won,
      price: b.price,
      invested: b.invested,
      score: sc.score,
      rated: sc.rated,
      standing: sc.standing,
      trusted: sc.trusted,
      sportBets: sr ? sr.n : 0,
      sportUnits: sr ? sr.u : 0,
      counts: sc.trusted && profitableRecord(sr),
    });
  });
  return out;
}

/**
 * The list for the morning in `asOf`. Key is market|wallet, the wallet's
 * last six. Rated wallets only. `trusted` is the top fifth. `sports` are
 * the sports where the wallet is profitable in that market. A side reads
 * both.
 */
export function buildTrustedList(rows, asOf) {
  const index = new Map();
  if (typeof asOf !== 'string' || asOf.length < 10) return index;
  const state = walk(trustedListBets(rows, asOf), asOf, null);
  const par = morningParams(state);
  for (const market of TRUSTED_LIST_MARKETS) {
    const wallets = new Set(state.rec[market].keys());
    for (const [wallet, w] of state.line) {
      if (keptLine(w) != null) wallets.add(wallet);
    }
    for (const wallet of wallets) {
      const sc = scoreWallet(state, par, wallet, market);
      if (!sc.rated) continue;
      const id = state.ids.get(wallet) || wallet.slice(-6);
      const key = listKey(market, id);
      const had = index.get(key);
      if (had && had.n >= sc.n) continue;
      index.set(key, {
        trusted: sc.trusted,
        standing: sc.standing,
        score: sc.score,
        n: sc.n,
        sports: profitableSports(state, wallet, market),
      });
    }
  }
  return index;
}

function round(v, places) {
  if (v == null || !Number.isFinite(v)) return null;
  const f = 10 ** places;
  return Math.round(v * f) / f;
}

/** Trusted wallets only. The stored morning does not carry the rest. */
export function serializeTrustedList(index, asOf) {
  const rows = [];
  for (const [key, info] of index?.entries?.() || []) {
    if (!info?.trusted) continue;
    const [market, wallet] = String(key).split('|');
    rows.push({
      market,
      wallet,
      standing: round(info.standing, 4),
      score: round(info.score, 5),
      n: info.n ?? 0,
      sports: Array.isArray(info.sports) ? info.sports : [],
    });
  }
  rows.sort((a, b) => a.market.localeCompare(b.market) || a.wallet.localeCompare(b.wallet));
  return { asOf, listVersion: TRUSTED_LIST_VERSION, rows };
}

export function hydrateTrustedList(payload) {
  const index = new Map();
  for (const row of payload?.rows || []) {
    if (!row?.market || !row?.wallet) continue;
    index.set(listKey(row.market, row.wallet), {
      trusted: true,
      standing: Number.isFinite(Number(row.standing)) ? Number(row.standing) : null,
      score: Number.isFinite(Number(row.score)) ? Number(row.score) : null,
      n: Number(row.n) || 0,
      sports: Array.isArray(row.sports) ? row.sports.map((x) => normTrustedSport(x)) : [],
    });
  }
  return index;
}

/** Trusted, and profitable on 10 or more bets in this sport and market. */
function countsIn(info, sport) {
  const sp = normTrustedSport(sport);
  return info?.trusted === true && !!sp && Array.isArray(info.sports) && info.sports.includes(sp);
}

export function isTrustedWalletOn(market, wallet, sport, list = null) {
  const index = list instanceof Map ? list : listIndex;
  const info = index.get(listKey(normTrustedMarket(market), String(wallet || '').slice(-6).toLowerCase()));
  return countsIn(info, sport);
}

/**
 * Trusted wallets on this side and on the other side of one market.
 * `positions` are the live positions on that game. A row with a market
 * that is not this market is skipped. A wallet on both sides counts on
 * its larger ticket. A wallet counts only where it is profitable: the
 * row's sport, or `sport` when the row carries none.
 *
 * @returns {{ for: string[], against: string[], margin: number }}
 */
export function trustedSideCount({ market, side, positions, sport = null, list = null } = {}) {
  const index = list instanceof Map ? list : listIndex;
  const mkt = normTrustedMarket(market);
  const mySide = String(side || '').toLowerCase();
  const out = { for: [], against: [], margin: 0 };
  if (!mySide || !TRUSTED_LIST_MARKETS.includes(mkt)) return out;
  const held = new Map();
  for (const raw of positions || []) {
    const rowMarket = normTrustedMarket(raw?.marketType || raw?.market);
    if (rowMarket && rowMarket !== mkt) continue;
    const wallet = trustedWalletId(raw);
    const rowSide = String(raw?.side || '').toLowerCase();
    if (!wallet || !rowSide) continue;
    if (!countsIn(index.get(listKey(mkt, wallet)), raw?.sport || sport)) continue;
    const invested = Number(raw?.invested ?? raw?.size);
    const size = invested > 0 ? invested : 0;
    if (!held.has(wallet)) held.set(wallet, new Map());
    const sides = held.get(wallet);
    sides.set(rowSide, Math.max(sides.get(rowSide) ?? -1, size));
  }
  for (const [wallet, sides] of held) {
    let top = null;
    let topSize = -1;
    for (const [s, size] of sides) {
      if (size > topSize) {
        top = s;
        topSize = size;
      }
    }
    if (top === mySide) out.for.push(wallet);
    else out.against.push(wallet);
  }
  out.for.sort();
  out.against.sort();
  out.margin = out.for.length - out.against.length;
  return out;
}

/** Trusted wallets per market on a list. */
export function trustedListSizes(list = null) {
  const index = list instanceof Map ? list : listIndex;
  const out = { ML: 0, SPREAD: 0, TOTAL: 0 };
  for (const [key, info] of index) {
    if (info?.trusted !== true) continue;
    const market = String(key).split('|')[0];
    if (market in out) out[market] += 1;
  }
  return out;
}

/** Trusted wallets per market that are profitable in at least one sport, so can count on a side. */
export function trustedListCounting(list = null) {
  const index = list instanceof Map ? list : listIndex;
  const out = { ML: 0, SPREAD: 0, TOTAL: 0 };
  for (const [key, info] of index) {
    if (info?.trusted !== true || !(Array.isArray(info.sports) && info.sports.length > 0)) continue;
    const market = String(key).split('|')[0];
    if (market in out) out[market] += 1;
  }
  return out;
}

export const TRUSTED_COUNT_STAMP_FIELDS = Object.freeze([
  'v8_trustedListFor',
  'v8_trustedListAgainst',
  'v8_trustedListMargin',
]);

/**
 * The count on one side, for the record, from the list's first day.
 * Moneylines in every sport. Spreads and totals on NHL, NBA, NFL, and
 * CFB. Empty when the side is outside that or the list did not build.
 */
export function trustedCountStamp({ pickDate, sport, market, side, positions, list = null } = {}) {
  if (!isTrustedListLive(pickDate) || !trustedListReady(list)) return {};
  const mkt = normTrustedMarket(market);
  if (!TRUSTED_LIST_MARKETS.includes(mkt)) return {};
  if (!normTrustedSport(sport)) return {};
  if (mkt !== 'ML' && !trustedListSport(sport)) return {};
  const count = trustedSideCount({ market, side, positions, sport, list });
  return {
    v8_trustedListFor: count.for,
    v8_trustedListAgainst: count.against,
    v8_trustedListMargin: count.margin,
  };
}
