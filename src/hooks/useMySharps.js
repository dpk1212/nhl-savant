import { useCallback, useEffect, useMemo, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
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

  useEffect(() => {
    if (!uid) {
      setState(emptyMySharps());
      setLoading(false);
      return undefined;
    }
    setState(readCache(uid));
    setLoading(true);
    const ref = doc(db, 'users', uid);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const next = parseMySharpsDoc(snap.data());
        setState(next);
        writeCache(uid, next);
      }
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [uid]);

  const persist = useCallback(async (next) => {
    setState(next);
    if (uid) writeCache(uid, next);
    if (!uid) return;
    const ref = doc(db, 'users', uid);
    await setDoc(ref, { mySharps: next }, { merge: true });
  }, [uid]);

  const addFromRow = useCallback(async (row) => {
    if (!uid || !isPremium) return { ok: false, reason: 'auth' };
    const member = memberFromActionRow(row);
    if (!member) return { ok: false, reason: 'id' };
    if (state.members[member.walletShort]) return { ok: true, already: true };
    if (!canAddMySharp(state)) return { ok: false, reason: 'cap' };
    await persist(toggleMySharpMember(state, member));
    return { ok: true };
  }, [uid, isPremium, persist, state]);

  const remove = useCallback(async (short) => {
    const id = normalizeWalletShort(short);
    if (!id || !state.members[id]) return;
    await persist(toggleMySharpMember(state, { walletShort: id }, { remove: true }));
  }, [persist, state]);

  const toggleRow = useCallback(async (row) => {
    const id = normalizeWalletShort(row?.walletShort);
    if (!id) return { ok: false, reason: 'id' };
    if (state.members[id]) {
      await remove(id);
      return { ok: true, removed: true };
    }
    return addFromRow(row);
  }, [addFromRow, remove, state.members]);

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
