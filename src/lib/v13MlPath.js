/**
 * v13 moneyline. From 2026-11-19.
 *
 * From 2026-11-20, in every sport, the wallets are the trusted list for
 * moneylines that morning (trustedList.js). The branch fires when the
 * trusted wallets on this side outnumber the trusted wallets on the
 * other side. A wallet on both sides counts on its larger ticket.
 *
 * Two counts, from 2026-11-20 evening. The wide count is every trusted
 * wallet with 10 or more graded moneyline bets in the sport, up or down
 * in units. The profitable count is the ones that are up. The side has
 * to be ahead by 1 on the wide count to fire. Ahead on the profitable
 * count too, it takes the full size. Ahead on the wide count only, the
 * side rests on wallets that lead the line and are down in units, and it
 * takes half the size, to the nearest quarter unit, never under 0.25.
 * A trusted wallet with under 10 bets there counts on neither.
 *
 * On every date before that, and on a morning the list did not build, a
 * wallet qualifies on the bets dated before this morning. Confirmed comes first, on the sport: 6 or more graded bets, a
 * win rate of at least 55, and dollar ROI above 3. Then the moneyline
 * book. Tier 4 or 5, form on, and that book is at least 15 days old. A
 * later copy of the same game, side, stake, and dollars is one bet. The
 * branch fires when one of those wallets is on this side and none of
 * them is on the other side.
 *
 * Edge under 0. −150 or shorter is 2. A longer price stays. Steam does
 * not enter.
 *
 * Edge 0 up to 10. Steam against is 0. Flat through a shorten under 4.5
 * is 4 at −110 or shorter, and 2 from +110 through the prices in between.
 * A shorten of 4.5 up to 10 is 0.75. A shorten of 10 or more is 4.
 *
 * Edge 10 or more. Steam against is 0. A flat line and any shorten take
 * the price: −150 or shorter is 3, and a price longer than −150 is 1.5.
 *
 * A missing edge, a missing steam on an edge of 0 or more, a missing
 * price, and a price juicier than −425 stay on the stake that arrived.
 * The juice check and the price check run before every size, so a
 * shorten cannot put a juiced favorite, or a side with no number, back on.
 * The dog cap still rules a sized bet. Longer than +200 is 0. +200 is
 * at most 1. +151 through +199 is at most 1.5. +121 through +150 is at
 * most 2.5. Favorites through +120 keep the size above.
 *
 * This is the size for that side. It replaces the stake that arrived.
 * Manual stake, an operator kill, the T-15 freeze, and a graded ticket
 * stay at the caller. The fit was NHL, NBA, NFL, and CFB. The path is
 * every sport's moneyline from 2026-11-19.
 *
 * From 2026-11-23 the sizes above are retired and the ladder below is
 * the size. The wallet gate does not change: ahead by 1 on the wide
 * count. The half rule, the steam sizes, and the 2 on an edge under 0
 * are gone. Steam is read one way only: a move against is 0. A missing
 * steam is not a move against.
 *
 *   No edge number, no price, or juicier than −425: stays, which the
 *   V12+ moneyline disable turns into 0.
 *   Edge under 0: stays, and is 0 the same way.
 *   Steam against: 0.
 *
 * Every sport, edge 0 or more (Dale's call; the fit was NHL, NBA, NFL,
 * and CFB):
 *   4    −110 to −199, profitable wallets ahead, edge 5 up to 10
 *   3    −110 to −199, profitable wallets ahead, edge 0 up to 5
 *   2.5  longer than −110, profitable wallets ahead
 *   2    −110 to −199, profitable wallets not ahead
 *   1    −200 to −425; edge 10 or more at any price; longer than −110
 *        with profitable wallets not ahead
 *
 * Profitable wallets ahead is the second count: trusted wallets that are
 * up in units on moneylines in the sport, ahead by 1. On a morning the
 * list did not build, the tier book opens the side and it sizes as
 * profitable wallets not ahead. The dog cap still rules every size.
 *
 * The spread door, from 2026-11-24. The wallet gate has a second way in.
 * When the wide moneyline count is level (no trusted moneyline wallet on
 * the game, or as many on one side as the other) and the trusted spread
 * count is ahead by 1 or more on this team, the side goes to the ladder.
 * The spread count is the one the spread ladder reads: trusted spread
 * wallets that are up in units on spreads in the sport, this team's
 * spread against the other team's, from the spread positions on the
 * same game. Nothing else changes. The price gates, the sizes, and the
 * dog cap are the ladder's, and the size reads the profitable moneyline
 * count as before. A moneyline count that is behind stays shut. The door
 * sizes a side that is on the board; it does not open one.
 *
 * Spread agreement, from 2026-11-24 (second change that day). The spread
 * count on the team is read on every moneyline side, and it does two
 * more things.
 *
 * The bump. A side the ladder stakes on its own moneyline count (ahead
 * by 1 on the wide count) takes 1u more when the spread count is ahead
 * by 1 or more on the same team. The 1u is added after the dog cap. A
 * side the spread door let in does not take it.
 *
 * The wide door. The spread count ahead by 2 or more on the team, and
 * the wide moneyline count not behind. A side the ladder leaves without
 * a stake because the edge is under 0 or there is no edge number takes
 * the price size instead: 2 at −110 to −199, 1 at −200 to −425, 1 longer
 * than −110. Past −425 and no price still stay, steam against is still
 * 0, and the dog cap still rules. No bump on a price size.
 *
 * The wide door opens a side (v13SpreadWideOpensSide), and the sync
 * marks that side v8_v13MlOpenedBy. A side it opened is the price size
 * for as long as the door holds, whatever the edge reads, and stays
 * without a stake once the door shuts.
 */

import { oddsCap } from './oddsCap.js';
import { dedupePositionCopies, sportBookConfirmed } from './sportConfirmed.js';
import { buildTrustState, isTrustOn } from './walletTrustStatus.js';
import { mlMiniWalletId, mlPriceBand, normMlMiniMarket, normMlMiniSport } from './mlMiniRung.js';
import { isTrustedListLive, trustedListReady, trustedSideCount } from './trustedList.js';

export const V13_ML_FROM = '2026-11-19';
export const V13_ML_EDGE_MAX = 10;
export const V13_ML_STEAM_MID = 4.5;
export const V13_ML_STEAM_HEAVY = 10;
export const V13_ML_FAVORITE_ODDS = -110;
export const V13_ML_HIGH_ODDS = -150;
export const V13_ML_JUICE_ODDS = -425;
export const V13_ML_FAVORITE_UNITS = 4;
export const V13_ML_LONG_UNITS = 2;
export const V13_ML_MID_UNITS = 0.75;
export const V13_ML_HEAVY_UNITS = 4;
export const V13_ML_HIGH_FULL_UNITS = 3;
export const V13_ML_HIGH_LONG_UNITS = 1.5;
export const V13_ML_UNDER_UNITS = 2;
export const V13_ML_STAKE_TIER = 'V13-ML';
export const V13_ML_RESCUED_BY = 'v13-ml';
export const V13_ML_MUTED_BY = 'v13-ml';
export const V13_ML_BOOK_VERSION = 3;
export const V13_ML_LIST_TRUSTED = 'trusted';
export const V13_ML_LIST_TIER = 'tier';
export const V13_ML_TRUSTED_AHEAD = 1;
/** The ladder. From this date it is the only size on a moneyline. */
export const V13_ML_LADDER_FROM = '2026-11-23';
export const V13_ML_LADDER_HEAVY_ODDS = -200;
export const V13_ML_LADDER_EDGE_SPLIT = 5;
export const V13_ML_LADDER_TOP_UNITS = 4;
export const V13_ML_LADDER_LEAD_UNITS = 3;
export const V13_ML_LADDER_PLUS_UNITS = 2.5;
export const V13_ML_LADDER_BAND_UNITS = 2;
export const V13_ML_LADDER_BASE_UNITS = 1;
/** The spread door. A level moneyline count and the spread count ahead on the team. */
export const V13_ML_SPREAD_DOOR_FROM = '2026-11-24';
export const V13_ML_SPREAD_DOOR_AHEAD = 1;
export const V13_ML_DOOR_SPREAD = 'spread';
/**
 * The count opens the card, from 2026-11-24 (Dale's call). A moneyline
 * side with the trusted count ahead (the wide count and the profitable
 * count, each by 1 or more) is put on the board when the v12 score did
 * not put it there, and when no other side of the game is a live staked
 * play. The ladder sizes it as it sizes any card. Nothing is written
 * unless the ladder stakes it.
 */
export const V13_ML_COUNT_OPENS_FROM = '2026-11-24';
export const V13_ML_COUNT_OPENS_AHEAD = 1;
export const V13_ML_COUNT_OPENS_PROMOTED_BY = 'v13-count-open';
/** Side field: which door put this side on the board (count, or spread2 for the wide door). */
export const V13_ML_OPENED_BY_FIELD = 'v8_v13MlOpenedBy';
export const V13_ML_OPENED_BY_COUNT = 'count';
/** Spread agreement: the bump and the wide door. */
export const V13_ML_SPREAD_AGREE_FROM = '2026-11-24';
export const V13_ML_SPREAD_AGREE_AHEAD = 1;
export const V13_ML_SPREAD_AGREE_UNITS = 1;
export const V13_ML_SPREAD_WIDE_AHEAD = 2;
export const V13_ML_SPREAD_WIDE_BAND_UNITS = 2;
export const V13_ML_SPREAD_WIDE_BASE_UNITS = 1;
export const V13_ML_DOOR_SPREAD_WIDE = 'spread2';
export const V13_ML_SPREAD_WIDE_PROMOTED_BY = 'v13-spread-door';

let bookIndex = new Map();

export function isV13MlLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= V13_ML_FROM;
}

export function isV13MlLadderLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= V13_ML_LADDER_FROM;
}

export function isV13MlCountOpensLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= V13_ML_COUNT_OPENS_FROM;
}

export function isV13MlSpreadDoorLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= V13_ML_SPREAD_DOOR_FROM;
}

export function isV13MlSpreadAgreeLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= V13_ML_SPREAD_AGREE_FROM;
}

export function setV13MlBook(index) {
  bookIndex = index instanceof Map ? index : new Map();
}

export function v13MlBookIndex() {
  return bookIndex;
}

function bookKey(sport, wallet) {
  return `${sport}|${wallet}`;
}

function wonOf(row) {
  const r = String(row?.result || row?.outcome || '').toUpperCase();
  if (r === 'WIN' || row?.won === true || row?.won === 1) return true;
  if (r === 'LOSS' || row?.won === false || row?.won === 0) return false;
  return null;
}

function daysBetween(a, b) {
  return Math.round((Date.parse(`${b.slice(0, 10)}T00:00:00Z`) - Date.parse(`${a.slice(0, 10)}T00:00:00Z`)) / 86400000);
}

function roundTenth(value) {
  if (value == null || value === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 10) / 10;
}

function finiteEdge(edge) {
  const n = Number(edge);
  return edge != null && Number.isFinite(n) ? n : null;
}

function impliedOf(odds) {
  const n = Number(odds);
  if (!Number.isFinite(n) || Math.abs(n) < 100) return null;
  return n < 0 ? (-n) / (-n + 100) : 100 / (n + 100);
}

/** American number for the dog cap. A price alone converts; a favorite stays negative. */
function capAmerican(odds, price) {
  const american = Number(odds);
  if (Number.isFinite(american) && Math.abs(american) >= 100) return american;
  if (!(price > 0 && price < 1) || price === 0.5) return price === 0.5 ? 100 : null;
  return price > 0.5 ? (-100 * price) / (1 - price) : (100 * (1 - price)) / price;
}

function sized(armed, units, zone, reason) {
  const capped = oddsCap(units, capAmerican(armed.odds, armed.price));
  if (!(capped > 0)) {
    return { ...armed, action: 'MUTE', units: 0, zone, reason: 'dog' };
  }
  const out = armed.half === true ? v13HalfStake(capped) : capped;
  return { ...armed, action: 'STAKE', units: out, zone, reason };
}

/** Half the size, to the nearest quarter unit, never under 0.25. */
export function v13HalfStake(units) {
  const n = Number(units);
  if (!(n > 0)) return 0;
  return Math.max(0.25, Math.round(n * 2) / 4);
}

function americanAndImplied(odds, price) {
  const american = Number(odds);
  const hasAmerican = Number.isFinite(american) && Math.abs(american) >= 100;
  const implied = hasAmerican
    ? impliedOf(american)
    : (price > 0 && price < 1 ? price : null);
  return { american, hasAmerican, implied };
}

/** favorite, long, or juice. Long is +110 and the prices between +110 and −110. */
export function v13PriceZone(odds, price) {
  const { american, hasAmerican, implied } = americanAndImplied(odds, price);
  if (hasAmerican && american < V13_ML_JUICE_ODDS) return 'juice';
  if (implied == null) return null;
  if (!hasAmerican && implied > (425 / 525)) return 'juice';
  const favoriteAt = impliedOf(V13_ML_FAVORITE_ODDS);
  if (hasAmerican) {
    if (american <= V13_ML_FAVORITE_ODDS) return 'favorite';
    return 'long';
  }
  if (implied >= favoriteAt) return 'favorite';
  return 'long';
}

/** short, longer, or juice. Short is −150 or shorter. Longer is every price past that. */
export function v13HighPriceZone(odds, price) {
  const { american, hasAmerican, implied } = americanAndImplied(odds, price);
  if (hasAmerican && american < V13_ML_JUICE_ODDS) return 'juice';
  if (implied == null) return null;
  if (!hasAmerican && implied > (425 / 525)) return 'juice';
  const shortAt = impliedOf(V13_ML_HIGH_ODDS);
  if (hasAmerican) {
    if (american <= V13_ML_HIGH_ODDS) return 'short';
    return 'longer';
  }
  if (implied >= shortAt) return 'short';
  return 'longer';
}

/**
 * The ladder's price read. band is −110 to −199. heavy is −200 to −425.
 * plus is every price longer than −110. juice is past −425.
 */
export function v13LadderZone(odds, price) {
  const { american, hasAmerican, implied } = americanAndImplied(odds, price);
  if (hasAmerican && american < V13_ML_JUICE_ODDS) return 'juice';
  if (implied == null) return null;
  if (!hasAmerican && implied > (425 / 525)) return 'juice';
  if (hasAmerican) {
    if (american <= V13_ML_LADDER_HEAVY_ODDS) return 'heavy';
    if (american <= V13_ML_FAVORITE_ODDS) return 'band';
    return 'plus';
  }
  if (implied >= impliedOf(V13_ML_LADDER_HEAVY_ODDS)) return 'heavy';
  if (implied >= impliedOf(V13_ML_FAVORITE_ODDS)) return 'band';
  return 'plus';
}

/**
 * The ladder, from V13_ML_LADDER_FROM. `armed` already passed the wallet
 * gate. `lead` is the profitable count ahead by 1.
 */
function ladderSize(armed, { odds, price, move, lead, wide = false, opened = false }) {
  const zone = v13LadderZone(odds, price);
  // The wide door. The price size on a side the ladder has no stake for
  // (edge under 0, or no edge number), and on every side the door opened.
  if (wide && (opened || armed.edge == null || armed.edge < 0)) {
    const door = { ...armed, door: V13_ML_DOOR_SPREAD_WIDE };
    if (zone === 'juice') return { ...door, action: 'PASS', zone, reason: 'juice' };
    if (zone == null) return { ...door, action: 'PASS', reason: 'no_price' };
    if (move != null && move < 0) {
      return { ...door, action: 'MUTE', units: 0, zone: 'against', reason: 'against' };
    }
    const units = zone === 'band' ? V13_ML_SPREAD_WIDE_BAND_UNITS : V13_ML_SPREAD_WIDE_BASE_UNITS;
    return sized(door, units, zone, `spread2_${zone}`);
  }
  if (armed.edge == null) return { ...armed, action: 'PASS', reason: 'missing_edge' };
  if (zone === 'juice') return { ...armed, action: 'PASS', zone, reason: 'juice' };
  if (zone == null) return { ...armed, action: 'PASS', reason: 'no_price' };
  if (armed.edge < 0) return { ...armed, action: 'PASS', zone, reason: 'edge_under' };
  if (move != null && move < 0) {
    return { ...armed, action: 'MUTE', units: 0, zone: 'against', reason: 'against' };
  }
  if (armed.edge >= V13_ML_EDGE_MAX) {
    return sized(armed, V13_ML_LADDER_BASE_UNITS, zone, 'edge10');
  }
  if (zone === 'heavy') return sized(armed, V13_ML_LADDER_BASE_UNITS, zone, 'heavy_favorite');
  if (zone === 'band') {
    if (!lead) return sized(armed, V13_ML_LADDER_BAND_UNITS, zone, 'band');
    return armed.edge >= V13_ML_LADDER_EDGE_SPLIT
      ? sized(armed, V13_ML_LADDER_TOP_UNITS, zone, 'band_lead_edge5')
      : sized(armed, V13_ML_LADDER_LEAD_UNITS, zone, 'band_lead');
  }
  return lead
    ? sized(armed, V13_ML_LADDER_PLUS_UNITS, zone, 'plus_lead')
    : sized(armed, V13_ML_LADDER_BASE_UNITS, zone, 'plus');
}

/**
 * Qualified moneyline wallets, as of the morning in `asOf`.
 * Key is sport|wallet. The sport book has to be confirmed. The tier
 * then reads the moneyline bets only.
 */
export function buildV13MlBook(rows, asOf) {
  const index = new Map();
  if (typeof asOf !== 'string' || asOf.length < 10) return index;
  const byWallet = new Map();
  for (const row of rows || []) {
    if (row?.postponed === true) continue;
    const wallet = mlMiniWalletId(row);
    const date = String(row?.date || '').slice(0, 10);
    const sport = normMlMiniSport(row?.sport);
    if (!wallet || date.length < 10 || !sport || date >= asOf) continue;
    if (!byWallet.has(wallet)) byWallet.set(wallet, []);
    byWallet.get(wallet).push(row);
  }
  for (const [wallet, list] of byWallet) {
    const bySport = new Map();
    for (const row of list) {
      const sport = normMlMiniSport(row.sport);
      if (!bySport.has(sport)) bySport.set(sport, []);
      bySport.get(sport).push(row);
    }
    for (const [sport, raw] of bySport) {
      const bets = dedupePositionCopies(raw);
      if (!sportBookConfirmed(bets)) continue;
      const trustRows = [];
      for (const row of bets) {
        if (normMlMiniMarket(row?.marketType || row?.market) !== 'ML') continue;
        const won = wonOf(row);
        const price = Number(row.avgPrice ?? row.price);
        const date = String(row.date).slice(0, 10);
        if (won == null || !(price > 0 && price < 1)) continue;
        const band = mlPriceBand(price);
        trustRows.push({ date, price, won, key: `${date}|${band ?? ''}` });
      }
      const state = buildTrustState(trustRows, { asOf });
      const age = state.firstBetDate ? daysBetween(state.firstBetDate, asOf) : null;
      if (!(state.tier >= 4 && isTrustOn(state.status) && age >= 15)) continue;
      index.set(bookKey(sport, wallet), { good: true });
    }
  }
  return index;
}

export function serializeV13MlBook(index, asOf) {
  const rows = [];
  for (const key of index?.keys?.() || []) {
    const [sport, wallet] = String(key).split('|');
    rows.push({ sport, wallet });
  }
  rows.sort((a, b) => a.sport.localeCompare(b.sport) || a.wallet.localeCompare(b.wallet));
  return { asOf, bookVersion: V13_ML_BOOK_VERSION, rows };
}

export function hydrateV13MlBook(payload) {
  const index = new Map();
  for (const row of payload?.rows || []) {
    if (!row?.sport || !row?.wallet) continue;
    index.set(bookKey(row.sport, row.wallet), { good: true });
  }
  return index;
}

function lookup(book, sport, wallet) {
  return book.get(bookKey(sport, wallet)) || null;
}

function viewPosition(row) {
  return {
    wallet: mlMiniWalletId(row),
    side: String(row?.side || '').toLowerCase(),
    market: normMlMiniMarket(row?.marketType || row?.market),
  };
}

function bookOf(book) {
  return book instanceof Map ? book : bookIndex;
}

/** Qualified wallets with a moneyline position on this side. */
export function qualifyingV13Wallets({ sport, side, positions, book = null } = {}) {
  const index = bookOf(book);
  const sp = normMlMiniSport(sport);
  const mySide = String(side || '').toLowerCase();
  const out = [];
  if (!sp || !mySide) return out;
  const seen = new Set();
  for (const raw of positions || []) {
    const row = viewPosition(raw);
    if (row.market && row.market !== 'ML') continue;
    if (row.side !== mySide || !row.wallet || seen.has(row.wallet)) continue;
    if (!lookup(index, sp, row.wallet)?.good) continue;
    seen.add(row.wallet);
    out.push(row.wallet);
  }
  return out;
}

/**
 * True when this side reads the trusted list: any sport, from the list's
 * first day, on a morning the list built. A morning with no list reads
 * the tier book, and the stamp says which one it read.
 */
export function v13UsesTrustedList(pickDate, sport, list = null) {
  return isTrustedListLive(pickDate) && !!normMlMiniSport(sport) && trustedListReady(list);
}

/**
 * Does a v13 wallet read open this side for the create pass. On the
 * trusted list the side has to be ahead. On the tier book one qualified
 * wallet on the side is enough, as before.
 */
export function v13OpensSide({ pickDate, sport, side, positions, book = null, list = null } = {}) {
  if (v13UsesTrustedList(pickDate, sport, list)) {
    return trustedSideCount({
      market: 'ML', side, positions, sport, list, wide: true,
    }).margin >= V13_ML_TRUSTED_AHEAD;
  }
  return qualifyingV13Wallets({ sport, side, positions, book }).length > 0;
}

/**
 * Does the trusted count open this moneyline side on its own, whatever
 * the v12 score says. The wide count and the profitable count are each
 * ahead by 1 or more, and no other side of the game is a live staked
 * play (`competingUnits`: the largest stake on another moneyline side
 * or on the other team's spread). Only on a morning the list built.
 */
export function v13CountOpensSide({
  pickDate, sport, side, positions, competingUnits = 0, list = null,
} = {}) {
  if (!isV13MlLadderLive(pickDate) || !isV13MlCountOpensLive(pickDate)) return false;
  if (!v13UsesTrustedList(pickDate, sport, list)) return false;
  if (Number(competingUnits) > 0) return false;
  const wide = trustedSideCount({
    market: 'ML', side, positions, sport, list, wide: true,
  });
  if (wide.margin < V13_ML_COUNT_OPENS_AHEAD) return false;
  return trustedSideCount({
    market: 'ML', side, positions, sport, list,
  }).margin >= V13_ML_COUNT_OPENS_AHEAD;
}

function againstWallets(positions, sport, side, book) {
  const sp = normMlMiniSport(sport);
  const mySide = String(side || '').toLowerCase();
  const against = new Set();
  for (const raw of positions || []) {
    const row = viewPosition(raw);
    if (row.market && row.market !== 'ML') continue;
    if (!row.wallet || !row.side || row.side === mySide) continue;
    if (lookup(book, sp, row.wallet)?.good) against.add(row.wallet);
  }
  return against.size;
}

/**
 * Does the wide door open this side for the create pass: the trusted
 * spread count ahead by 2 or more on the team and the wide moneyline
 * count not behind, on a morning the list built.
 */
export function v13SpreadWideOpensSide({
  pickDate, sport, side, positions, spreadPositions, list = null,
} = {}) {
  if (!isV13MlLadderLive(pickDate) || !isV13MlSpreadAgreeLive(pickDate)) return false;
  if (!v13UsesTrustedList(pickDate, sport, list)) return false;
  const count = trustedSideCount({
    market: 'ML', side, positions, sport, list, wide: true,
  });
  if (count.margin < 0) return false;
  return trustedSideCount({
    market: 'SPREAD', side, positions: spreadPositions, sport, list,
  }).margin >= V13_ML_SPREAD_WIDE_AHEAD;
}

/**
 * @returns {{
 *   fires: boolean, action: 'STAKE'|'MUTE'|'PASS'|'EXEMPT',
 *   reason: string, units: number, unitsPre: number, zone: string|null,
 *   steam: number|null, edge: number|null, against: number, wallets: string[],
 *   margin: number, half: boolean, list: 'trusted'|'tier',
 *   odds: number|null, price: number|null,
 *   door: 'spread'|'spread2'|null, spreadMargin: number|null, spreadWallets: string[],
 *   bump: number,
 * }}
 */
export function applyV13MlPath({
  units = 0,
  pickDate = null,
  sport = null,
  market = null,
  side = null,
  positions = null,
  spreadPositions = null,
  odds = null,
  price = null,
  steam = null,
  edge = null,
  manual = false,
  killed = false,
  book = null,
  list = null,
  opened = false,
} = {}) {
  const pre = Number.isFinite(Number(units)) ? Math.max(0, Number(units)) : 0;
  const move = roundTenth(steam);
  const oddsN = Number.isFinite(Number(odds)) ? Number(odds) : null;
  const priceN = price > 0 && price < 1 ? Number(price) : null;
  const onList = v13UsesTrustedList(pickDate, sport, list);
  const base = {
    fires: false,
    units: pre,
    unitsPre: pre,
    zone: null,
    steam: move,
    edge: finiteEdge(edge),
    against: 0,
    wallets: [],
    margin: 0,
    half: false,
    list: onList ? V13_ML_LIST_TRUSTED : V13_ML_LIST_TIER,
    odds: oddsN,
    price: priceN,
    door: null,
    spreadMargin: null,
    spreadWallets: [],
    bump: 0,
  };
  if (manual === true) return { ...base, action: 'EXEMPT', reason: 'manual' };
  if (killed === true) return { ...base, action: 'EXEMPT', reason: 'operator_kill' };
  if (!isV13MlLive(pickDate)) return { ...base, action: 'EXEMPT', reason: 'not_live' };
  if (normMlMiniMarket(market) !== 'ML' || !normMlMiniSport(sport)) {
    return { ...base, action: 'PASS', reason: 'not_ml' };
  }
  const ladder = isV13MlLadderLive(pickDate);
  const agree = ladder && isV13MlSpreadAgreeLive(pickDate);
  const doorOpened = agree && opened === true;
  let lead = false;
  let wide = false;
  let bumps = false;
  let armed;
  if (onList) {
    // Wide: trusted with 10 or more moneyline bets in the sport, up or down.
    // Kept: the ones that are up in units there.
    const count = trustedSideCount({
      market: 'ML', side, positions, sport, list, wide: true,
    });
    const kept = trustedSideCount({ market: 'ML', side, positions, sport, list });
    const read = {
      ...base, wallets: count.for, against: count.against.length, margin: count.margin,
    };
    // The spread count on the team. Before spread agreement it is read
    // only on a level moneyline count, for the door. From spread
    // agreement it is read on every side.
    if (ladder && isV13MlSpreadDoorLive(pickDate) && (agree || count.margin === 0)) {
      const spread = trustedSideCount({
        market: 'SPREAD', side, positions: spreadPositions, sport, list,
      });
      read.spreadMargin = spread.margin;
      read.spreadWallets = spread.for;
      // The spread door: a level moneyline count. Ahead needs no door,
      // and behind stays shut.
      if (count.margin === 0 && spread.margin >= V13_ML_SPREAD_DOOR_AHEAD) {
        read.door = V13_ML_DOOR_SPREAD;
      }
      if (agree) {
        wide = count.margin >= 0 && spread.margin >= V13_ML_SPREAD_WIDE_AHEAD;
        bumps = count.margin >= V13_ML_TRUSTED_AHEAD && spread.margin >= V13_ML_SPREAD_AGREE_AHEAD;
      }
    }
    // A side the wide door opened is on the board for the door alone.
    if (doorOpened && !wide) {
      return { ...read, door: null, action: 'PASS', reason: 'spread_door_shut' };
    }
    if (!read.door) {
      if (!count.for.length) return { ...read, action: 'PASS', reason: 'no_trusted_wallet' };
      if (count.margin < V13_ML_TRUSTED_AHEAD) {
        return { ...read, fires: true, action: 'PASS', reason: 'trusted_not_ahead' };
      }
    }
    armed = { ...read, fires: true };
    lead = kept.margin >= V13_ML_TRUSTED_AHEAD;
    // Before the ladder: ahead only with the wallets that are down in
    // units is half the size. On the ladder that is its own level.
    if (!lead && !ladder) armed.half = true;
  } else {
    const index = bookOf(book);
    const wallets = qualifyingV13Wallets({ sport, side, positions, book: index });
    if (!wallets.length) {
      return { ...base, action: 'PASS', reason: 'no_qualified_wallet' };
    }
    const against = againstWallets(positions, sport, side, index);
    armed = {
      ...base, fires: true, against, wallets, margin: wallets.length - against,
    };
    if (against > 0) return { ...armed, action: 'PASS', reason: 'qualified_against' };
  }
  if (ladder) {
    const out = ladderSize(armed, {
      odds, price, move, lead, wide, opened: doorOpened,
    });
    // The bump: the ladder's own stake on a moneyline count that is
    // ahead, with the spread count ahead on the team. After the dog cap.
    if (bumps && !doorOpened && out.action === 'STAKE' && out.door == null && out.units > 0) {
      return { ...out, units: out.units + V13_ML_SPREAD_AGREE_UNITS, bump: V13_ML_SPREAD_AGREE_UNITS };
    }
    return out;
  }
  if (armed.edge == null) return { ...armed, action: 'PASS', reason: 'missing_edge' };
  if (armed.edge < 0) {
    const under = v13HighPriceZone(odds, price);
    if (under === 'short') return sized(armed, V13_ML_UNDER_UNITS, 'rescue', 'rescue');
    if (under === 'juice') {
      return { ...armed, action: 'PASS', zone: 'juice', reason: 'juice' };
    }
    return { ...armed, action: 'PASS', zone: under || null, reason: under || 'under_pass' };
  }
  if (move == null) return { ...armed, action: 'PASS', reason: 'no_steam' };
  if (move < 0) {
    return { ...armed, action: 'MUTE', units: 0, zone: 'against', reason: 'against' };
  }
  if (armed.edge >= V13_ML_EDGE_MAX) {
    const high = v13HighPriceZone(odds, price);
    if (high === 'juice' || high == null) {
      return { ...armed, action: 'PASS', zone: high || null, reason: high === 'juice' ? 'juice' : 'no_price' };
    }
    if (high === 'short') return sized(armed, V13_ML_HIGH_FULL_UNITS, high, 'edge10_short');
    return sized(armed, V13_ML_HIGH_LONG_UNITS, high, 'edge10_longer');
  }
  const zone = v13PriceZone(odds, price);
  if (zone === 'juice') return { ...armed, action: 'PASS', zone, reason: 'juice' };
  if (zone == null) return { ...armed, action: 'PASS', reason: 'no_price' };
  if (move >= V13_ML_STEAM_HEAVY) return sized(armed, V13_ML_HEAVY_UNITS, 'heavy', 'heavy');
  if (move >= V13_ML_STEAM_MID) return sized(armed, V13_ML_MID_UNITS, 'mid', 'mid');
  if (zone === 'favorite') return sized(armed, V13_ML_FAVORITE_UNITS, zone, 'favorite');
  return sized(armed, V13_ML_LONG_UNITS, zone, 'long');
}

/** Every field the V13 stamp overwrites on each sync (no leftovers). */
export const V13_ML_STAMP_FIELDS = Object.freeze([
  'v8_v13Ml',
  'v8_v13MlAction',
  'v8_v13MlReason',
  'v8_v13MlUnits',
  'v8_v13MlZone',
  'v8_v13MlSteam',
  'v8_v13MlEdge',
  'v8_v13MlAgainst',
  'v8_v13MlWallets',
  'v8_v13MlMargin',
  'v8_v13MlList',
  'v8_v13MlHalf',
  'v8_v13MlOdds',
  'v8_v13MlPrice',
  'v8_v13MlDoor',
  'v8_v13MlSpreadMargin',
  'v8_v13MlSpreadWallets',
  'v8_v13MlBump',
  'v8_v13MlEvaluatedAt',
  'v8_unitsPreV13Ml',
]);

/**
 * Full current V13 stamp for every ML side. Always overwrites the whole set
 * so a STAKE→PASS (e.g. juice) cannot leave a prior units/zone/reason behind.
 * Stamp units are 0 on PASS and MUTE; STAKE keeps the sized units.
 */
export function v13MlStamp(policy, { now = Date.now() } = {}) {
  if (!policy || !policy.action) return {};
  const action = String(policy.action).toUpperCase();
  const stampUnits = (action === 'STAKE')
    ? (Number.isFinite(Number(policy.units)) ? Number(policy.units) : 0)
    : 0;
  return {
    v8_v13Ml: true,
    v8_v13MlAction: action,
    v8_v13MlReason: policy.reason ?? null,
    v8_v13MlUnits: stampUnits,
    v8_v13MlZone: policy.zone ?? null,
    v8_v13MlSteam: policy.steam ?? null,
    v8_v13MlEdge: policy.edge ?? null,
    v8_v13MlAgainst: policy.against ?? 0,
    v8_v13MlWallets: Array.isArray(policy.wallets) ? policy.wallets : [],
    v8_v13MlMargin: Number.isFinite(Number(policy.margin)) ? Number(policy.margin) : 0,
    v8_v13MlList: policy.list ?? V13_ML_LIST_TIER,
    v8_v13MlHalf: action === 'STAKE' && policy.half === true,
    v8_v13MlOdds: policy.odds ?? null,
    v8_v13MlPrice: policy.price ?? null,
    v8_v13MlDoor: policy.door ?? null,
    v8_v13MlSpreadMargin: Number.isFinite(Number(policy.spreadMargin)) && policy.spreadMargin != null
      ? Number(policy.spreadMargin) : null,
    v8_v13MlSpreadWallets: Array.isArray(policy.spreadWallets) ? policy.spreadWallets : [],
    v8_v13MlBump: action === 'STAKE' && Number(policy.bump) > 0 ? Number(policy.bump) : 0,
    v8_v13MlEvaluatedAt: now,
    v8_unitsPreV13Ml: policy.unitsPre,
  };
}
