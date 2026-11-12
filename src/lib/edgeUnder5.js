/**
 * Edge under 5. Every sport.
 *
 * Nov 5 used the press edge. Two holds stayed on: a morning gap already in
 * the 2-unit band, and an NBA moneyline juicier than −100. A missing press
 * edge counted as 0.
 *
 * From Nov 6 the mute is one cut. A locked play comes off when the blended
 * edge is under 5 and steam is off. Steam on stays, including under 5.
 * An edge of 5 or more stays. A missing blend stays — one NHL ticket had
 * no blend and stayed on the card. A stake already at 0 stays there.
 * There is no rescue: the gap hold and the NBA-favorite hold do not keep
 * a steam-off play. A side this mute already zeroed stays zero, even
 * when steam is on. Nothing already muted is turned back on.
 *
 * The blend is each FOR wallet's market win rate pulled toward its other
 * markets in that sport (k = 10), then averaged, minus the price. Spreads
 * and totals use 52.4. A moneyline uses the American implied percent.
 * Compared at the stamped tenth.
 *
 * The Nov 5 count, for the record: edge under 5 was 114-85, −17.7u on
 * 491.5u. The Nov 6 cut, on the locked card Oct 6–Nov 6: 65-56, −32.8u
 * on 290u come off. The card goes from 188-128, +57.7u on 718u to
 * 123-72, +90.5u on 428u.
 */

export const EDGE_UNDER5_FROM = '2026-11-05';
export const EDGE_BLEND_STEAM_FROM = '2026-11-06';
export const BLEND_PULL = 10;
export const BLEND_ST_IMPLIED_PCT = 52.4;
export const EDGE_UNDER5_MAX = 5;
export const EDGE_UNDER5_GAP_MIN = 2;
export const EDGE_UNDER5_GAP_MAX = 3;
export const EDGE_UNDER5_FAV_ODDS = -100;
export const EDGE_UNDER5_MUTED_BY = 'edge-under-5';

export function isEdgeUnder5Live(pickDate) {
  return typeof pickDate === 'string' && pickDate >= EDGE_UNDER5_FROM;
}

export function isBlendSteamLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= EDGE_BLEND_STEAM_FROM;
}

export function normEdgeSport(sport) {
  const u = String(sport || '').toUpperCase();
  return (u === 'NCAAF' || u === 'NCAAFB') ? 'CFB' : u;
}

export function normEdgeMarket(market) {
  const u = String(market || '').toUpperCase();
  if (u === 'ML' || u === 'MONEYLINE' || u === 'H2H') return 'ML';
  if (u === 'SPREAD' || u === 'SPREADS') return 'SPREAD';
  if (u === 'TOTAL' || u === 'TOTALS') return 'TOTAL';
  return u;
}

export function edgeUnder5Owns(pickDate, sport) {
  return isEdgeUnder5Live(pickDate) && normEdgeSport(sport).length > 0;
}

/** Same tenth the card stores on v8_pressEdge. Missing stays missing. */
export function stampedEdge(edge) {
  if (edge == null || edge === '') return null;
  const n = Number(edge);
  if (!Number.isFinite(n)) return null;
  const rounded = Math.round(n * 10) / 10;
  return rounded === 0 ? 0 : rounded;
}

/** Missing edge counts as 0, which is under 5. */
export function edgeUnder5Value(edge) {
  const stamped = stampedEdge(edge);
  return stamped == null ? 0 : stamped;
}

export function inEdgeGapBand(units) {
  const n = Number(units);
  return Number.isFinite(n) && n >= EDGE_UNDER5_GAP_MIN && n < EDGE_UNDER5_GAP_MAX;
}

/**
 * The gap rung adds 1u under 3. From this date, a stake already in the
 * 2-unit band whose edge is under 5 stays put. An edge of 5 or more still
 * takes the extra unit.
 */
export function gapBandStays({ units, pressEdge = null, pickDate = null } = {}) {
  if (!isEdgeUnder5Live(pickDate)) return false;
  if (!inEdgeGapBand(units)) return false;
  return edgeUnder5Value(pressEdge) < EDGE_UNDER5_MAX;
}

function americanImpliedPct(odds) {
  if (odds == null || !Number.isFinite(Number(odds)) || Number(odds) === 0) return null;
  const n = Number(odds);
  const p = n < 0 ? Math.abs(n) / (Math.abs(n) + 100) : 100 / (n + 100);
  return p * 100;
}

function blendImpliedPct(market, odds) {
  if (normEdgeMarket(market) !== 'ML') return BLEND_ST_IMPLIED_PCT;
  return americanImpliedPct(odds);
}

function wrPct(wins, n) {
  if (!(n > 0)) return null;
  return Number(((100 * wins) / n).toFixed(1));
}

/**
 * Market win rate pulled toward the other markets in the sport.
 * A sport book under 10 bets does not count. No market book, or a market
 * book that is the whole sport book, uses the sport win rate.
 */
export function blendWalletWr(sportN, sportWins, marketN, marketWins) {
  const nS = Number(sportN) || 0;
  const nM = Number(marketN) || 0;
  const wrS = wrPct(Number(sportWins) || 0, nS);
  if (wrS == null || !(nS >= 10)) return null;
  if (!(nM >= 1) || nS <= nM) return wrS;
  const wrM = wrPct(Number(marketWins) || 0, nM);
  const nO = nS - nM;
  const winsO = (Number(sportWins) || 0) - (Number(marketWins) || 0);
  const wrO = wrPct(winsO, nO);
  if (wrM == null || wrO == null) return wrS;
  return (nM * wrM + BLEND_PULL * wrO) / (nM + BLEND_PULL);
}

/** Mean blended win rate minus the price, stamped to a tenth. Null when nobody qualifies. */
export function blendEdgeFromWrs(wrs, market, odds) {
  const list = (wrs || []).filter((w) => Number.isFinite(w));
  if (!list.length) return null;
  const implied = blendImpliedPct(market, odds);
  if (implied == null) return null;
  const mean = list.reduce((a, b) => a + b, 0) / list.length;
  return Math.round((mean - implied) * 10) / 10;
}

function shortWalletId(wallet) {
  return String(wallet || '').slice(-6).toLowerCase();
}

function profileForWallet(walletProfiles, wallet) {
  if (!walletProfiles) return null;
  const short = shortWalletId(wallet);
  if (!short) return null;
  if (typeof walletProfiles.get === 'function') {
    return walletProfiles.get(short)
      || walletProfiles.get(short.toUpperCase())
      || walletProfiles.get(String(wallet || '').toLowerCase())
      || null;
  }
  return walletProfiles[short] || walletProfiles[short.toUpperCase()] || null;
}

function sportRecord(profile, sport) {
  const raw = profile?.bySport?.[sport];
  if (raw) return raw;
  const norm = normEdgeSport(sport);
  return norm !== sport ? profile?.bySport?.[norm] || null : null;
}

function winsOf(pos) {
  const n = Number(pos?.n) || 0;
  if (Number.isFinite(Number(pos?.wins))) return Number(pos.wins);
  const wr = Number(pos?.wr);
  if (n > 0 && Number.isFinite(wr)) return (wr / 100) * n;
  return 0;
}

/**
 * Blended edge for the FOR wallets on this side. Same wallets the press
 * ladder reads: invested on this side, sport book of at least 10.
 */
export function blendEdgeForSide({
  walletDetails = null,
  side = null,
  sport = null,
  market = null,
  walletProfiles = null,
  odds = null,
} = {}) {
  const mkt = normEdgeMarket(market);
  const wrs = [];
  for (const wd of walletDetails || []) {
    if (!wd || wd.side !== side) continue;
    if (!(Number(wd.invested) > 0)) continue;
    const rec = sportRecord(profileForWallet(walletProfiles, wd.wallet), sport);
    const sportPos = rec?.positions;
    const marketPos = rec?.byMarket?.[mkt]?.positions;
    const wr = blendWalletWr(
      Number(sportPos?.n) || 0,
      winsOf(sportPos),
      Number(marketPos?.n) || 0,
      winsOf(marketPos),
    );
    if (wr != null) wrs.push(wr);
  }
  return blendEdgeFromWrs(wrs, mkt, odds);
}

function nbaMlFavorite(sport, market, odds) {
  if (normEdgeSport(sport) !== 'NBA') return false;
  if (normEdgeMarket(market) !== 'ML') return false;
  const n = Number(odds);
  return Number.isFinite(n) && n < EDGE_UNDER5_FAV_ODDS;
}

/**
 * @returns {{
 *   units: number, action: 'MUTE'|'HOLD'|'PASS'|'EXEMPT', reason: string|null,
 *   mutedBy: string|null, unitsPrePolicy: number,
 *   clause: 'under5'|'gap2'|'nba-ml-fav'|'steam-off'|'steam-on'|'no-blend'|null,
 *   blendEdge: number|null, steamOn: boolean, rule: 'blend-steam'|null,
 * }}
 */
export function applyEdgeUnder5Mute({
  units,
  pressEdge = null,
  pickDate = null,
  sport = null,
  market = null,
  odds = null,
  gapFires = false,
  steamOn = false,
  blendEdge = null,
  alreadyOff = false,
  oppHasT5 = null,
} = {}) {
  const pre = Number.isFinite(Number(units)) ? Math.max(0, Number(units)) : 0;
  const out = (action, reason = null, clause = null, next = pre, mutedBy = null, extra = {}) => ({
    units: next,
    action,
    reason,
    mutedBy,
    unitsPrePolicy: pre,
    clause,
    blendEdge: null,
    steamOn: false,
    rule: null,
    ...extra,
  });
  if (oppHasT5 === false) {
    return out('PASS', 'no_t5_against', 'no-t5-ag');
  }
  if (alreadyOff === true) {
    return out('MUTE', 'edge_under_5_stay', 'stay', 0, EDGE_UNDER5_MUTED_BY, {
      blendEdge: stampedEdge(blendEdge),
      steamOn: steamOn === true,
      rule: 'blend-steam',
    });
  }
  if (!edgeUnder5Owns(pickDate, sport)) return out('EXEMPT');
  if (!(pre > 0)) return out('PASS');
  if (isBlendSteamLive(pickDate)) {
    const edge = stampedEdge(blendEdge);
    const steam = steamOn === true;
    const extra = { blendEdge: edge, steamOn: steam, rule: 'blend-steam' };
    if (edge == null) return out('PASS', null, 'no-blend', pre, null, extra);
    if (!(edge < EDGE_UNDER5_MAX)) return out('PASS', null, null, pre, null, extra);
    if (steam) return out('PASS', null, 'steam-on', pre, null, extra);
    return out('MUTE', 'edge_under_5_steam_off', 'steam-off', 0, EDGE_UNDER5_MUTED_BY, extra);
  }
  if (!(edgeUnder5Value(pressEdge) < EDGE_UNDER5_MAX)) return out('PASS');
  if (gapFires === true && inEdgeGapBand(pre)) {
    return out('HOLD', 'edge_under_5_gap2', 'gap2');
  }
  if (nbaMlFavorite(sport, market, odds)) {
    return out('HOLD', 'edge_under_5_nba_ml_fav', 'nba-ml-fav');
  }
  return out('MUTE', 'edge_under_5', 'under5', 0, EDGE_UNDER5_MUTED_BY);
}

export function edgeUnder5Stamp(policy) {
  if (!policy || policy.action === 'EXEMPT') return {};
  const stamp = {
    v8_edgeUnder5Action: policy.action,
    v8_edgeUnder5Reason: policy.reason ?? null,
    v8_edgeUnder5Clause: policy.clause ?? null,
    v8_unitsPreEdgeUnder5: policy.unitsPrePolicy,
  };
  if (policy.rule === 'blend-steam') {
    stamp.v8_blendEdge = policy.blendEdge ?? null;
    stamp.v8_edgeUnder5SteamOn = policy.steamOn === true;
  }
  return stamp;
}
