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
  normalizeWalletShort,
  parseMySharpsDoc,
  toggleMySharpMember,
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

  const commit = useCallback((next) => {
    setState(next);
    stateRef.current = next;
    if (uid) writeCache(uid, next);
    return next;
  }, [uid]);

  useEffect(() => {
    if (!uid) {
      pendingRemove.current.clear();
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

  const toggleRow = useCallback(async (row) => {
    const id = normalizeWalletShort(row?.walletShort);
    if (!id) return { ok: false, reason: 'id' };
    if (stateRef.current.members[id]) {
      await remove(id);
      return { ok: true, removed: true };
    }
    return addFromRow(row);
  }, [addFromRow, remove]);

  const members = useMemo(() => listMySharps(state), [state]);
  const shorts = useMemo(() => mySharpsShortSet(state), [state]);

  return {
    loading,
    ready: !!uid && isPremium,
    members,
    shorts,
    count: members.length,
    cap: MY_SHARPS_CAP,
    isSaved: (short) => shorts.has(normalizeWalletShort(short)),
    addFromRow,
    toggleRow,
    remove,
  };
}
