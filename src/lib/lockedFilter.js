/**
 * Locked Picks filter: one committed view, shared by the rail, the pill,
 * and the feed. The sheet holds a draft until Show.
 *
 * Day stats are the day's staked book and ignore sport, market, and status.
 * Chip, pill, and Show counts include No Play cards that render under the slate.
 */

import { compareLockedPicks } from './lockedPickSort.js';
import { isResolvedLockedPick, lockedStatusBucket } from './lockedStatus.js';

export const LOCKED_FILTER_STORAGE_KEY = 'sf-locked-filter-v1';

export const LOCKED_FILTER_KEYS = ['status', 'sport', 'market', 'sort', 'day', 'weak', 'cancelled'];

const STATUS = new Set(['pending', 'live', 'settled', 'won', 'lost', 'all']);
const MARKET = new Set(['all', 'ml', 'spread', 'total']);
const SORT = new Set(['units', 'time', 'profit', 'winpct']);
const DAY = new Set(['today', 'yesterday']);

const STATUS_LABEL = {
  pending: 'Pending',
  live: 'Live',
  settled: 'Settled',
  won: 'Won',
  lost: 'Lost',
  all: 'All',
};

const MARKET_LABEL = {
  all: 'All',
  ml: 'ML',
  spread: 'Spread',
  total: 'Total',
};

export function defaultLockedFilter() {
  return {
    status: 'pending',
    sport: 'all',
    market: 'all',
    sort: 'units',
    day: 'today',
    weak: false,
    cancelled: false,
  };
}

function truthy(v) {
  if (v == null) return false;
  const s = String(v).toLowerCase();
  return s === '1' || s === 'true' || s === 'on' || s === 'yes';
}

export function normalizeLockedFilter(input) {
  const base = defaultLockedFilter();
  if (!input || typeof input !== 'object') return base;
  const params = new URLSearchParams();
  if (input.status) params.set('status', String(input.status));
  const sport = input.sport === 'All' ? 'all' : input.sport;
  if (sport) params.set('sport', String(sport));
  if (input.market) params.set('market', String(input.market));
  if (input.sort) params.set('sort', String(input.sort));
  if (input.day) params.set('day', String(input.day));
  if (input.weak) params.set('weak', '1');
  if (input.cancelled) params.set('cancelled', '1');
  if ([...params.keys()].length === 0) return base;
  return parseLockedFilter(params.toString()).filter;
}

export function parseLockedFilter(search) {
  const params = new URLSearchParams(String(search || '').replace(/^\?/, ''));
  const hasKeys = LOCKED_FILTER_KEYS.some((k) => params.has(k));
  const filter = defaultLockedFilter();
  if (!hasKeys) return { filter, hasKeys: false };

  let status = (params.get('status') || '').toLowerCase();
  if (status === 'inprogress' || status === 'in-progress') status = 'live';
  if (STATUS.has(status)) filter.status = status;

  const sport = params.get('sport');
  if (sport && sport.toLowerCase() !== 'all' && /^[a-z0-9]{2,8}$/i.test(sport)) {
    filter.sport = sport.toUpperCase();
  }

  const market = (params.get('market') || '').toLowerCase();
  if (MARKET.has(market)) filter.market = market;

  let sort = (params.get('sort') || '').toLowerCase();
  if (sort === 'stars') sort = 'units';
  if (sort === 'gametime' || sort === 'game-time') sort = 'time';
  if (SORT.has(sort)) filter.sort = sort;

  const day = (params.get('day') || '').toLowerCase();
  if (DAY.has(day)) filter.day = day;

  if (params.has('weak')) filter.weak = truthy(params.get('weak'));
  if (params.has('cancelled')) filter.cancelled = truthy(params.get('cancelled'));
  return { filter, hasKeys: true };
}

/** URL wins. Storage is only a fallback when the query has no filter keys. */
export function resolveLockedFilter(search, stored) {
  const parsed = parseLockedFilter(search);
  if (parsed.hasKeys) return parsed.filter;
  if (stored && typeof stored === 'object') return normalizeLockedFilter(stored);
  return defaultLockedFilter();
}

export function serializeLockedFilterQuery(filter) {
  const f = normalizeLockedFilter(filter);
  const params = new URLSearchParams();
  if (f.status !== 'pending') params.set('status', f.status);
  if (f.sport !== 'all') params.set('sport', String(f.sport).toLowerCase());
  if (f.market !== 'all') params.set('market', f.market);
  if (f.sort !== 'units') params.set('sort', f.sort);
  if (f.day !== 'today') params.set('day', f.day);
  if (f.weak) params.set('weak', '1');
  if (f.cancelled) params.set('cancelled', '1');
  const s = params.toString();
  return s ? `?${s}` : '';
}

export function mergeLockedFilterSearch(existing, filter) {
  const cur = new URLSearchParams(String(existing || '').replace(/^\?/, ''));
  for (const k of LOCKED_FILTER_KEYS) cur.delete(k);
  const next = new URLSearchParams(serializeLockedFilterQuery(filter).replace(/^\?/, ''));
  for (const [k, v] of next) cur.set(k, v);
  const s = cur.toString();
  return s ? `?${s}` : '';
}

export function lockedFiltersEqual(a, b) {
  const x = normalizeLockedFilter(a);
  const y = normalizeLockedFilter(b);
  return LOCKED_FILTER_KEYS.every((k) => x[k] === y[k]);
}

export function lockedFilterBadgeCount(filter) {
  const f = normalizeLockedFilter(filter);
  let n = 0;
  if (f.status !== 'pending') n += 1;
  if (f.sport !== 'all') n += 1;
  if (f.market !== 'all') n += 1;
  if (f.sort !== 'units') n += 1;
  if (f.day !== 'today') n += 1;
  if (f.weak) n += 1;
  if (f.cancelled) n += 1;
  return n;
}

export function lockedStatusLabel(status) {
  return STATUS_LABEL[status] || 'Pending';
}

export function lockedMarketLabel(market) {
  return MARKET_LABEL[market] || 'All';
}

/** Segment highlight. Won and Lost still light Settled. */
export function lockedSegmentStatus(status) {
  if (status === 'pending') return 'pending';
  if (status === 'live') return 'live';
  if (status === 'settled' || status === 'won' || status === 'lost') return 'settled';
  return null;
}

export function lockedPillText(filter, count) {
  const f = normalizeLockedFilter(filter);
  const bits = [];
  if (f.day === 'yesterday') bits.push('Yesterday');
  bits.push(lockedStatusLabel(f.status));
  if (f.weak) bits.push('Weakening');
  if (f.sport !== 'all') bits.push(f.sport);
  if (f.market !== 'all') bits.push(lockedMarketLabel(f.market));
  return `${bits.join(' · ')} ${count}`;
}

export function isWeakeningPick(p) {
  return (p?.health?.status || 'ACTIVE') === 'MUTED' && !isResolvedLockedPick(p);
}

export function isCancelledOpenPick(p) {
  return (p?.health?.status || 'ACTIVE') === 'CANCELLED' && !isResolvedLockedPick(p);
}

export function statusMatchesLocked(p, status, now = Date.now()) {
  const bucket = lockedStatusBucket(p, now);
  if (status === 'all') return true;
  if (status === 'pending') return bucket === 'pending';
  if (status === 'live') return bucket === 'inprogress';
  if (status === 'won') return bucket === 'won';
  if (status === 'lost') return bucket === 'lost';
  if (status === 'settled') return bucket === 'won' || bucket === 'lost' || bucket === 'resolved';
  return true;
}

function sportMatches(p, sport) {
  if (!sport || sport === 'all') return true;
  return String(p?.sport || '').toUpperCase() === String(sport).toUpperCase();
}

function marketMatches(p, market) {
  if (!market || market === 'all') return true;
  return (p?.marketType || 'ml') === market;
}

export function matchesLockedFilter(p, filter, now = Date.now()) {
  const f = normalizeLockedFilter(filter);
  if (!sportMatches(p, f.sport)) return false;
  if (!marketMatches(p, f.market)) return false;
  if (!statusMatchesLocked(p, f.status, now)) return false;
  if (f.weak && !isWeakeningPick(p)) return false;
  if (!f.cancelled && isCancelledOpenPick(p)) return false;
  return true;
}

function countWhere(picks, filter, patch, now) {
  const f = { ...normalizeLockedFilter(filter), ...patch };
  let n = 0;
  for (const p of picks || []) {
    if (matchesLockedFilter(p, f, now)) n += 1;
  }
  return n;
}

function fmtSignedU(n) {
  const v = Number.isFinite(n) ? n : 0;
  const sign = v >= 0 ? '+' : '';
  return `${sign}${v.toFixed(1)}u`;
}

function toWinUnits(p) {
  const u = Number(p?.units);
  const o = Number(p?.odds);
  if (!u || !Number.isFinite(o) || o === 0) return 0;
  return o > 0 ? u * (o / 100) : u * (100 / Math.abs(o));
}

/** Staked book for the day. The figure beside the record is settled PnL. Sport chips do not move this line. */
export function lockedDayLine(picks, day, now = Date.now()) {
  const staked = (picks || []).filter((p) => !p?.isMonitoring);
  let won = 0;
  let lost = 0;
  let pending = 0;
  let live = 0;
  let toWin = 0;
  let realized = 0;
  for (const p of staked) {
    const bucket = lockedStatusBucket(p, now);
    if (bucket === 'won') won += 1;
    else if (bucket === 'lost') lost += 1;
    else if (bucket === 'pending') pending += 1;
    else if (bucket === 'inprogress') live += 1;
    if (bucket === 'won' || bucket === 'lost' || bucket === 'resolved') {
      realized += Number(p?.profit) || 0;
    } else {
      toWin += toWinUnits(p);
    }
  }
  const record = `${won}\u2013${lost}`;
  const text = `${record} \u00b7 ${fmtSignedU(realized)}`;
  if (day === 'yesterday') {
    return { text, mini: text, record, toWin: null, realized };
  }
  return { text, mini: text, record, toWin, realized, pending, live };
}

export function describeLockedSlate(picks, filter, now = Date.now()) {
  const list = Array.isArray(picks) ? picks : [];
  const f = normalizeLockedFilter(filter);
  const dayLine = lockedDayLine(list, f.day, now);
  const statusCounts = {
    pending: countWhere(list, f, { status: 'pending' }, now),
    live: countWhere(list, f, { status: 'live' }, now),
    settled: countWhere(list, f, { status: 'settled' }, now),
  };
  const ids = new Set();
  for (const p of list) {
    if (p?.sport) ids.add(String(p.sport).toUpperCase());
  }
  const sports = [...ids]
    .map((id) => ({ id, count: countWhere(list, f, { sport: id }, now) }))
    .sort((a, b) => b.count - a.count || a.id.localeCompare(b.id));
  const feed = list.filter((p) => matchesLockedFilter(p, f, now));
  feed.sort((a, b) => compareLockedPicks(a, b, f.sort));
  return {
    dayLine,
    statusCounts,
    sports,
    allCount: countWhere(list, f, { sport: 'all' }, now),
    weakCount: countWhere(list, f, { weak: true }, now),
    cancelledCount: countCancelledOpen(list, f, now),
    feed,
    badge: lockedFilterBadgeCount(f),
    pill: lockedPillText(f, feed.length),
  };
}

function countCancelledOpen(picks, filter, now) {
  const f = normalizeLockedFilter(filter);
  let n = 0;
  for (const p of picks || []) {
    if (!isCancelledOpenPick(p)) continue;
    if (!sportMatches(p, f.sport)) continue;
    if (!marketMatches(p, f.market)) continue;
    if (!statusMatchesLocked(p, f.status, now)) continue;
    if (f.weak && !isWeakeningPick(p)) continue;
    n += 1;
  }
  return n;
}

export function readInitialLockedFilter() {
  if (typeof window === 'undefined') return defaultLockedFilter();
  const hash = window.location.hash || '';
  const q = hash.indexOf('?');
  const search = q >= 0 ? hash.slice(q) : (window.location.search || '');
  let stored = null;
  try {
    const raw = window.localStorage.getItem(LOCKED_FILTER_STORAGE_KEY);
    stored = raw ? JSON.parse(raw) : null;
  } catch {
    stored = null;
  }
  return resolveLockedFilter(search, stored);
}
