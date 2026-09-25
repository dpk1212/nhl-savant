/**
 * My Sharps — user-curated wallet roster.
 * Grain is the person (walletShort), not a game or a day.
 */
import { shortWalletId } from './walletClvSkill.js';

export const MY_SHARPS_CAP = 40;
export const MY_SHARPS_STORAGE_KEY = 'sf_my_sharps_v1';
export const SIZED_UP_RATIO = 1.5;

export function normalizeWalletShort(raw) {
  const s = shortWalletId(raw);
  return s && s.length >= 4 ? s : null;
}

/** Display name the customer types. Hex stays the id. */
export function cleanSharpName(raw) {
  if (typeof raw !== 'string') return null;
  const s = raw.replace(/\s+/g, ' ').trim().slice(0, 22);
  return s || null;
}

export function emptyMySharps() {
  return { updatedAt: null, members: {}, tails: {} };
}

function parseAmericanOdds(raw) {
  if (typeof raw === 'number' && Number.isFinite(raw) && raw !== 0) return Math.round(raw);
  if (typeof raw !== 'string') return null;
  const s = raw.trim().replace('−', '-');
  if (!s) return null;
  const n = Number(s.replace('+', ''));
  if (!Number.isFinite(n) || n === 0) return null;
  return s.startsWith('-') ? -Math.abs(Math.round(n)) : Math.round(Math.abs(n));
}

/** Stable id for a side. Pipes, no dots, so it can live under mySharps.tails. */
export function tailKey(ticket) {
  const sport = String(ticket?.sport || '').toUpperCase();
  const gameKey = String(ticket?.gameKey || '').toLowerCase();
  const market = String(ticket?.marketType || '').toUpperCase();
  const side = String(ticket?.side || '').toLowerCase();
  if (!sport || !gameKey || !market || !side) return null;
  return `${sport}|${gameKey}|${market}|${side}`;
}

export function normalizeTail(id, raw) {
  if (!raw || typeof raw !== 'object') return null;
  const key = tailKey(raw) || (typeof id === 'string' && id.includes('|') ? id : null);
  if (!key) return null;
  const stake = Number(raw.stake);
  const wallets = Array.isArray(raw.wallets)
    ? raw.wallets.map((w) => normalizeWalletShort(w)).filter(Boolean)
    : [];
  const status = raw.status === 'won' || raw.status === 'lost' || raw.status === 'push' ? raw.status : 'open';
  const line = Number(raw.line ?? raw.entryLine);
  return {
    id: key,
    pick: typeof raw.pick === 'string' ? raw.pick : null,
    matchup: typeof raw.matchup === 'string' ? raw.matchup : null,
    sport: raw.sport || key.split('|')[0],
    gameKey: raw.gameKey || key.split('|')[1],
    marketType: raw.marketType || key.split('|')[2],
    side: raw.side || key.split('|')[3],
    theirAmerican: parseAmericanOdds(raw.theirAmerican),
    myAmerican: parseAmericanOdds(raw.myAmerican),
    stake: Number.isFinite(stake) && stake > 0 ? Math.round(stake) : null,
    tailedAt: Number.isFinite(Number(raw.tailedAt)) ? Number(raw.tailedAt) : Date.now(),
    commenceMs: Number.isFinite(Number(raw.commenceMs)) && Number(raw.commenceMs) > 0 ? Number(raw.commenceMs) : null,
    date: typeof raw.date === 'string' ? raw.date.slice(0, 10) : null,
    line: Number.isFinite(line) ? line : null,
    gradedBy: raw.gradedBy === 'grader' ? 'grader' : null,
    wallets,
    status,
    pnl: Number.isFinite(Number(raw.pnl)) ? Math.round(Number(raw.pnl)) : null,
  };
}

export function tailFromTicket(ticket, { myAmerican, stake, now = Date.now() } = {}) {
  const id = tailKey(ticket);
  if (!id) return null;
  const their = parseAmericanOdds(ticket?.theirAmerican ?? ticket?.americanOdds ?? ticket?.odds ?? ticket?.americanLabel);
  const mine = parseAmericanOdds(myAmerican);
  const st = Number(stake);
  const wallets = (ticket?.shorts || ticket?.wallets || [])
    .map((w) => normalizeWalletShort(w))
    .filter(Boolean);
  return {
    id,
    pick: ticket?.pick || null,
    matchup: ticket?.matchup || null,
    sport: ticket?.sport || null,
    gameKey: ticket?.gameKey || null,
    marketType: ticket?.marketType || null,
    side: ticket?.side || null,
    theirAmerican: their,
    myAmerican: mine != null ? mine : their,
    stake: Number.isFinite(st) && st > 0 ? Math.round(st) : null,
    tailedAt: now,
    commenceMs: Number.isFinite(Number(ticket?.commenceMs)) && Number(ticket.commenceMs) > 0
      ? Number(ticket.commenceMs)
      : null,
    date: typeof ticket?.commenceDateKey === 'string' ? ticket.commenceDateKey.slice(0, 10) : null,
    line: Number.isFinite(Number(ticket?.entryLine)) ? Number(ticket.entryLine) : null,
    gradedBy: null,
    wallets,
    status: 'open',
    pnl: null,
  };
}

export function parseMySharpsDoc(data) {
  const bag = data?.mySharps && typeof data.mySharps === 'object'
    ? data.mySharps
    : (data && typeof data.members === 'object' ? data : null);
  const members = {};
  const src = bag?.members && typeof bag.members === 'object' ? bag.members : {};
  for (const [k, v] of Object.entries(src)) {
    const short = normalizeWalletShort(v?.walletShort || k);
    if (!short) continue;
    members[short] = {
      walletShort: short,
      walletAddress: v?.walletAddress || null,
      addedAt: Number.isFinite(Number(v?.addedAt)) ? Number(v.addedAt) : Date.now(),
      addedFrom: v?.addedFrom && typeof v.addedFrom === 'object' ? v.addedFrom : null,
      sort: Number.isFinite(Number(v?.sort)) ? Number(v.sort) : 0,
      note: typeof v?.note === 'string' ? v.note : null,
      name: cleanSharpName(v?.name),
      muted: v?.muted === true,
      betsOff: normalizeBetsOff(v?.betsOff),
    };
  }
  const tails = {};
  const tailSrc = bag?.tails && typeof bag.tails === 'object' ? bag.tails : {};
  for (const [k, v] of Object.entries(tailSrc)) {
    const tail = normalizeTail(k, v);
    if (tail) tails[tail.id] = tail;
  }
  return {
    updatedAt: Number.isFinite(Number(bag?.updatedAt)) ? Number(bag.updatedAt) : null,
    members,
    tails,
  };
}

export function listMySharps(state) {
  return Object.values(state?.members || {})
    .filter((m) => m && !m.muted && m.walletShort)
    .sort((a, b) => (a.sort - b.sort) || (a.addedAt - b.addedAt));
}

export function mySharpsShortSet(state) {
  return new Set(listMySharps(state).map((m) => m.walletShort));
}

export function canAddMySharp(state) {
  return listMySharps(state).length < MY_SHARPS_CAP;
}

export function memberFromActionRow(row, now = Date.now()) {
  const walletShort = normalizeWalletShort(row?.walletShort || row?.wallet);
  if (!walletShort) return null;
  return {
    walletShort,
    walletAddress: row?.walletAddress || row?.wallet || null,
    addedAt: now,
    addedFrom: {
      sport: row?.sport || null,
      gameKey: row?.gameKey || null,
      marketType: row?.marketType || null,
      side: row?.side || null,
      date: row?.commenceDateKey || null,
    },
    sort: now,
    note: null,
    name: null,
    muted: false,
  };
}

export function toggleMySharpMember(state, member, { remove = false } = {}) {
  const next = {
    updatedAt: Date.now(),
    members: { ...(state?.members || {}) },
    tails: { ...(state?.tails || {}) },
  };
  const short = normalizeWalletShort(member?.walletShort || member);
  if (!short) return state || emptyMySharps();
  if (remove || next.members[short]) {
    delete next.members[short];
    return next;
  }
  if (!canAddMySharp(state)) return state || emptyMySharps();
  next.members[short] = { ...member, walletShort: short };
  return next;
}

const BETS_MARKETS = new Set(['ML', 'SPREAD', 'TOTAL']);

/** Sport × market key for the Bets feed. Absent means the market is on. */
export function betsFeedKey(sport, market) {
  const s = String(sport || '').trim().toUpperCase();
  let m = String(market || '').trim().toUpperCase();
  if (m === 'MONEYLINE') m = 'ML';
  if (m === 'SPREADS') m = 'SPREAD';
  if (m === 'TOTALS') m = 'TOTAL';
  if (!s || !BETS_MARKETS.has(m)) return null;
  return `${s}|${m}`;
}

export function normalizeBetsOff(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  const seen = new Set();
  for (const item of raw) {
    const parts = String(item || '').split('|');
    const key = betsFeedKey(parts[0], parts.slice(1).join('|'));
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(key);
  }
  return out;
}

export function betsFeedOn(member, sport, market) {
  const key = betsFeedKey(sport, market);
  if (!key) return true;
  return !normalizeBetsOff(member?.betsOff).includes(key);
}

/** Flip one sport × market. Missing from the list means Bets still shows it. */
export function toggleBetsFeed(state, short, sport, market) {
  const id = normalizeWalletShort(short);
  const key = betsFeedKey(sport, market);
  const cur = id ? state?.members?.[id] : null;
  if (!id || !key || !cur) return state || emptyMySharps();
  const off = new Set(normalizeBetsOff(cur.betsOff));
  if (off.has(key)) off.delete(key);
  else off.add(key);
  return {
    updatedAt: Date.now(),
    members: {
      ...(state.members || {}),
      [id]: { ...cur, betsOff: [...off] },
    },
    tails: { ...(state.tails || {}) },
  };
}

export function fmtWalletTag(short) {
  const s = normalizeWalletShort(short);
  return s ? `··${s}` : '··————';
}

export function isMySharpShort(shorts, short) {
  if (!shorts || typeof shorts.has !== 'function') return false;
  const id = normalizeWalletShort(short);
  return !!id && shorts.has(id);
}

/**
 * Portfolio wallets sitting on a locked card.
 * Map tags win (ours / against). The play-side list fills anyone the map missed.
 */
export function portfolioWalletsOnCard(card, shorts) {
  if (!card || !shorts || typeof shorts.has !== 'function' || shorts.size === 0) return [];
  const seen = new Set();
  const out = [];
  const take = (w, fallbackSide) => {
    const id = normalizeWalletShort(w?.short || w?.wallet);
    if (!id || !shorts.has(id) || seen.has(id)) return;
    seen.add(id);
    const raw = String(w?.short || w?.wallet || id);
    out.push({
      id,
      short: raw.length > 6 ? raw.slice(-6) : raw,
      side: w?.side === 'against' ? 'against' : (fallbackSide || 'ours'),
      invested: Number(w?.invested) || 0,
    });
  };
  for (const w of (Array.isArray(card.mapWallets) ? card.mapWallets : [])) take(w);
  for (const w of (Array.isArray(card.wallets) ? card.wallets : [])) take(w, 'ours');
  out.sort((a, b) => b.invested - a.invested || a.id.localeCompare(b.id));
  return out;
}
