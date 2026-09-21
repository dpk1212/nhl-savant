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
  return { updatedAt: null, members: {} };
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
    };
  }
  return {
    updatedAt: Number.isFinite(Number(bag?.updatedAt)) ? Number(bag.updatedAt) : null,
    members,
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

export function fmtWalletTag(short) {
  const s = normalizeWalletShort(short);
  return s ? `··${s}` : '··————';
}
