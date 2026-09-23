import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { deleteField, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  MY_SHARPS_CAP,
  MY_SHARPS_STORAGE_KEY,
  canAddMySharp,
  emptyMySharps,
  listMySharps,
  memberFromActionRow,
  mySharpsShortSet,
  cleanSharpName,
  normalizeWalletShort,
  parseMySharpsDoc,
  tailFromTicket,
  toggleMySharpMember,
  toggleBetsFeed,
  betsFeedOn,
} from '../lib/mySharps.js';

function readCache(uid) {
  if (!uid) return emptyMySharps();
  try {
    const raw = localStorage.getItem(`${MY_SHARPS_STORAGE_KEY}:${uid}`);
    if (!raw) return emptyMySharps();
    return parseMySharpsDoc(JSON.parse(raw));
  } catch {
    return emptyMySharps();
  }
}

function writeCache(uid, state) {
  if (!uid) return;
  try {
    localStorage.setItem(`${MY_SHARPS_STORAGE_KEY}:${uid}`, JSON.stringify({
      updatedAt: state.updatedAt,
      members: state.members,
      tails: state.tails || {},
    }));
  } catch { /* ignore quota */ }
}

export function useMySharps({ user = null, isPremium = false } = {}) {
  const uid = user?.uid || null;
  const [state, setState] = useState(() => readCache(uid));
  const [loading, setLoading] = useState(!!uid);
  const stateRef = useRef(state);
  stateRef.current = state;
  const pendingRemove = useRef(new Set());
  const pendingTails = useRef(new Map());

  const commit = useCallback((next) => {
    setState(next);
    stateRef.current = next;
    if (uid) writeCache(uid, next);
    return next;
  }, [uid]);

  useEffect(() => {
      if (!uid) {
      pendingRemove.current.clear();
      pendingTails.current.clear();
      setState(emptyMySharps());
      setLoading(false);
      return undefined;
    }
    setState(readCache(uid));
    setLoading(true);
    const ref = doc(db, 'users', uid);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const parsed = parseMySharpsDoc(snap.data());
        for (const id of [...pendingRemove.current]) {
          if (parsed.members[id]) delete parsed.members[id];
          else pendingRemove.current.delete(id);
        }
        for (const [id, op] of [...pendingTails.current]) {
          if (op === 'delete') {
            if (parsed.tails?.[id]) delete parsed.tails[id];
            else pendingTails.current.delete(id);
          } else if (parsed.tails?.[id] && Number(parsed.tails[id].tailedAt) >= Number(op.tailedAt)) {
            pendingTails.current.delete(id);
          } else if (op && op !== 'delete') {
            parsed.tails[id] = op;
          }
        }
        commit(parsed);
      }
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [uid, commit]);

  const persist = useCallback(async (next) => {
    commit(next);
    if (!uid) return;
    const ref = doc(db, 'users', uid);
    await setDoc(ref, { mySharps: next }, { merge: true });
  }, [uid, commit]);

  const addFromRow = useCallback(async (row) => {
    if (!uid || !isPremium) return { ok: false, reason: 'auth' };
    const member = memberFromActionRow(row);
    if (!member) return { ok: false, reason: 'id' };
    const cur = stateRef.current;
    if (cur.members[member.walletShort]) return { ok: true, already: true };
    if (!canAddMySharp(cur)) return { ok: false, reason: 'cap' };
    await persist(toggleMySharpMember(cur, member));
    return { ok: true };
  }, [uid, isPremium, persist]);

  const remove = useCallback(async (short) => {
    const id = normalizeWalletShort(short);
    if (!id) return { ok: false, reason: 'id' };
    const cur = stateRef.current;
    if (!cur.members[id]) return { ok: true, already: true };
    pendingRemove.current.add(id);
    const next = commit(toggleMySharpMember(cur, { walletShort: id }, { remove: true }));
    if (!uid) return { ok: true, removed: true };
    const ref = doc(db, 'users', uid);
    try {
      await updateDoc(ref, {
        [`mySharps.members.${id}`]: deleteField(),
        'mySharps.updatedAt': next.updatedAt,
      });
    } catch {
      await setDoc(ref, { mySharps: next }, { merge: true });
    }
    return { ok: true, removed: true };
  }, [uid, commit]);

  const rename = useCallback(async (short, name) => {
    const id = normalizeWalletShort(short);
    if (!id) return { ok: false, reason: 'id' };
    const cur = stateRef.current;
    if (!cur.members[id]) return { ok: false, reason: 'missing' };
    const next = {
      updatedAt: Date.now(),
      members: {
        ...cur.members,
        [id]: { ...cur.members[id], name: cleanSharpName(name) },
      },
      tails: { ...(cur.tails || {}) },
    };
    await persist(next);
    return { ok: true };
  }, [persist]);

  const setBetsFeed = useCallback(async (short, sport, market) => {
    const id = normalizeWalletShort(short);
    if (!id || !stateRef.current.members[id]) return { ok: false, reason: 'missing' };
    const next = toggleBetsFeed(stateRef.current, id, sport, market);
    if (next === stateRef.current) return { ok: false, reason: 'id' };
    await persist(next);
    return { ok: true, on: betsFeedOn(next.members[id], sport, market) };
  }, [persist]);

  const toggleRow = useCallback(async (row) => {
    const id = normalizeWalletShort(row?.walletShort);
    if (!id) return { ok: false, reason: 'id' };
    if (stateRef.current.members[id]) {
      await remove(id);
      return { ok: true, removed: true };
    }
    return addFromRow(row);
  }, [addFromRow, remove]);

  const markTail = useCallback(async (ticket, patch = {}) => {
    if (!uid || !isPremium) return { ok: false, reason: 'auth' };
    const tail = tailFromTicket(ticket, patch);
    if (!tail) return { ok: false, reason: 'id' };
    const cur = stateRef.current;
    const next = {
      updatedAt: Date.now(),
      members: { ...(cur.members || {}) },
      tails: { ...(cur.tails || {}), [tail.id]: tail },
    };
    pendingTails.current.set(tail.id, tail);
    await persist(next);
    return { ok: true, tail };
  }, [uid, isPremium, persist]);

  const clearTail = useCallback(async (id) => {
    if (!id) return { ok: false, reason: 'id' };
    const cur = stateRef.current;
    if (!cur.tails?.[id]) return { ok: true, already: true };
    pendingTails.current.set(id, 'delete');
    const tails = { ...(cur.tails || {}) };
    delete tails[id];
    const next = {
      updatedAt: Date.now(),
      members: { ...(cur.members || {}) },
      tails,
    };
    commit(next);
    if (!uid) return { ok: true };
    const ref = doc(db, 'users', uid);
    try {
      await updateDoc(ref, {
        [`mySharps.tails.${id}`]: deleteField(),
        'mySharps.updatedAt': next.updatedAt,
      });
    } catch {
      await setDoc(ref, { mySharps: next }, { merge: true });
    }
    return { ok: true };
  }, [uid, commit]);

  const members = useMemo(() => listMySharps(state), [state]);
  const shorts = useMemo(() => mySharpsShortSet(state), [state]);

  return {
    loading,
    ready: !!uid && isPremium,
    members,
    shorts,
    tails: state.tails || {},
    count: members.length,
    cap: MY_SHARPS_CAP,
    isSaved: (short) => shorts.has(normalizeWalletShort(short)),
    addFromRow,
    toggleRow,
    remove,
    rename,
    setBetsFeed,
    markTail,
    clearTail,
  };
}
